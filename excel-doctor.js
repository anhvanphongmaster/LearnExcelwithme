/*! Excel Doctor Accuracy Fix v3
 *  - separates workbook-read errors from audit findings
 *  - does not treat instruction/guide sheets as raw data tables
 *  - relative formula-pattern audit catches wrong-row references
 *  - external-link detection supports SheetJS [1] style references
 *  - per-check failures never abort the entire report
 */
(function(){
"use strict";

const $=id=>document.getElementById(id);
const fileInput=$("edFile"), choose=$("edChoose"), drop=$("edDropZone"),
      status=$("edStatus"), report=$("edReport");

const ERR={
  0:"#NULL!",7:"#DIV/0!",15:"#VALUE!",23:"#REF!",29:"#NAME?",
  36:"#NUM!",42:"#N/A",43:"#GETTING_DATA"
};
const VOL=/\b(NOW|TODAY|RAND|RANDBETWEEN|OFFSET|INDIRECT|CELL|INFO)\s*\(/i;
const FULL=/(^|[^A-Z0-9_])\$?[A-Z]{1,3}:\$?[A-Z]{1,3}([^0-9]|$)/i;
/* SheetJS may expose an external book as [1] rather than [Book.xlsx]. */
const EXTBOOK=/\[(?:\d+|[^\]]+\.(?:xlsx?|xlsm|xlsb|csv))\]/i;

const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[c]));

function show(t,x){
  if(status) status.hidden=false;
  if(report) report.hidden=true;
  if($("edStatusTitle")) $("edStatusTitle").textContent=t;
  if($("edStatusText")) $("edStatusText").textContent=x||"";
}
function hide(){ if(status) status.hidden=true; }

function isNumText(v){
  if(typeof v!=="string") return false;
  const s=v.trim();
  if(!s || s.length>40 || /[A-Za-zÀ-ỹ]/.test(s) || /[\/:]/.test(s)) return false;
  return /^[-+]?\d+(?:[.,]\d+)?$/.test(s.replace(/\s/g,"").replace(/,/g,""));
}
function isDateText(v){
  return typeof v==="string" &&
    /^\s*(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\s*$/.test(v);
}
function wsIssue(v){
  return typeof v==="string" && v!=="" &&
    (v!==v.trim() || / {2,}/.test(v) || /\u00A0|\u200B|\u200C|\u200D|\uFEFF/.test(v));
}
function typ(c){
  if(!c) return "blank";
  if(c.t==="e") return "error";
  if(c.t==="n") return c.z && /[dmyhs]/i.test(String(c.z)) ? "date" : "number";
  if(c.t==="d") return "date";
  if(c.t==="b") return "boolean";
  if(c.t==="s" || c.t==="str") return "text";
  return c.t||"other";
}
function colNum(letters){
  let n=0;
  for(const ch of letters) n=n*26+(ch.charCodeAt(0)-64);
  return n-1;
}
function relativeFormulaPattern(formula,cellAddr){
  const base=XLSX.utils.decode_cell(cellAddr);
  return String(formula||"").toUpperCase().replace(
    /((?:'[^']+'|[A-Z0-9_]+)!)?(\$?)([A-Z]{1,3})(\$?)(\d+)/g,
    (m,sheet,absC,col,absR,row)=>{
      const c=colNum(col), r=Number(row)-1;
      const cp=absC ? `C${c+1}` : `C[${c-base.c}]`;
      const rp=absR ? `R${r+1}` : `R[${r-base.r}]`;
      return (sheet||"")+rp+cp;
    }
  ).replace(/\s+/g,"");
}
function emptyResult(name){
  return {
    name,isData:false,rows:0,cols:0,used:0,formulas:0,merged:0,
    numericText:[],dateText:[],whitespace:[],errors:[],blankRows:[],dups:[],
    blankHeaders:[],dupHeaders:[],mixed:[],refFormulas:[],external:[],
    volatile:[],fullcol:[],vlookupApprox:[],complex:[],inconsistent:[],sparse:false
  };
}
function isDataSheet(ws,R){
  const cols=R.e.c-R.s.c+1, rows=R.e.r-R.s.r+1;
  if(rows<4 || cols<2) return false;
  let headers=0;
  for(let c=R.s.c;c<=R.e.c;c++){
    const v=ws[XLSX.utils.encode_cell({r:R.s.r,c})]?.v;
    if(String(v??"").trim()) headers++;
  }
  return headers>=2 && headers/cols>=0.50;
}

function analyzeSheet(ws,name){
  const o=emptyResult(name),ref=ws?.["!ref"];
  if(!ref) return o;

  const R=XLSX.utils.decode_range(ref);
  o.rows=R.e.r-R.s.r+1;
  o.cols=R.e.c-R.s.c+1;
  o.merged=(ws["!merges"]||[]).length;
  o.isData=isDataSheet(ws,R);

  const rowSig=new Map();
  const types=Array.from({length:o.cols},()=>new Map());
  const non=Array(o.cols).fill(0);
  const fcols=Array.from({length:o.cols},()=>[]);
  const seenH=new Map();

  /* Header-quality checks only make sense on sheets that look tabular. */
  if(o.isData){
    for(let c=R.s.c;c<=R.e.c;c++){
      const a=XLSX.utils.encode_cell({r:R.s.r,c});
      const v=String(ws[a]?.v??"").trim();
      if(!v){
        o.blankHeaders.push({sheet:name,cell:a,value:"Header trống"});
      }else{
        const k=v.toLocaleLowerCase("vi");
        if(seenH.has(k)){
          o.dupHeaders.push({sheet:name,cell:a,value:`Trùng "${v}" với ${seenH.get(k)}`});
        }else seenH.set(k,a);
      }
    }
  }

  for(let r=R.s.r;r<=R.e.r;r++){
    let rowHas=false;
    const duplicateValues=[];

    for(let c=R.s.c;c<=R.e.c;c++){
      const a=XLSX.utils.encode_cell({r,c});
      const cell=ws[a], j=c-R.s.c;

      if(!cell || cell.v===undefined || cell.v===null || cell.v===""){
        duplicateValues.push("");
        continue;
      }

      rowHas=true;
      o.used++;
      const t=typ(cell);
      types[j].set(t,(types[j].get(t)||0)+1);
      non[j]++;

      if(cell.f){
        o.formulas++;
        const f=String(cell.f);
        fcols[j].push({sheet:name,cell:a,f,pat:relativeFormulaPattern(f,a)});

        if(/#REF!/i.test(f))
          o.refFormulas.push({sheet:name,cell:a,value:f.slice(0,110)});
        if(EXTBOOK.test(f))
          o.external.push({sheet:name,cell:a,value:f.slice(0,110)});
        if(VOL.test(f))
          o.volatile.push({sheet:name,cell:a,value:f.slice(0,110)});
        if(FULL.test(f))
          o.fullcol.push({sheet:name,cell:a,value:f.slice(0,110)});
        if(/\bVLOOKUP\s*\(/i.test(f) && !/,\s*(?:FALSE|0)\s*\)$/i.test(f))
          o.vlookupApprox.push({sheet:name,cell:a,value:f.slice(0,110)});
        if(f.length>180 || (f.match(/\(/g)||[]).length>=7)
          o.complex.push({sheet:name,cell:a,value:f.slice(0,110)});

        /* Formula cells are excluded from duplicate row signatures. */
        duplicateValues.push("");
      }else{
        duplicateValues.push(String(cell.v).trim());
      }

      /* Data-quality checks are intentionally restricted to data-like sheets. */
      if(o.isData && r>R.s.r && typeof cell.v==="string"){
        if(isNumText(cell.v))
          o.numericText.push({sheet:name,cell:a,value:cell.v.slice(0,70)});
        if(isDateText(cell.v))
          o.dateText.push({sheet:name,cell:a,value:cell.v.slice(0,70)});
        if(wsIssue(cell.v))
          o.whitespace.push({sheet:name,cell:a,value:cell.v.slice(0,70)});
      }

      if(cell.t==="e")
        o.errors.push({sheet:name,cell:a,value:ERR[cell.v]||String(cell.w||cell.v||"Error")});
    }

    if(o.isData && r>R.s.r){
      if(!rowHas && r<R.e.r){
        o.blankRows.push({sheet:name,row:r+1});
      }else if(rowHas){
        const sig=duplicateValues.join("\u241F");
        const meaningful=duplicateValues.filter(Boolean).length;
        if(meaningful>=2){
          if(rowSig.has(sig)){
            o.dups.push({sheet:name,row:r+1,firstRow:rowSig.get(sig),value:`Trùng dữ liệu không-công-thức với dòng ${rowSig.get(sig)}`});
          }else rowSig.set(sig,r+1);
        }
      }
    }
  }

  if(o.isData){
    types.forEach((m,i)=>{
      if(non[i]<4) return;
      const fam=[...m.entries()].filter(([t,n])=>!["blank","error"].includes(t)&&n>0);
      if(fam.length>1){
        o.mixed.push({
          sheet:name,
          cell:`Cột ${XLSX.utils.encode_col(R.s.c+i)}`,
          value:fam.map(([t,n])=>`${t}:${n}`).join(", ")
        });
      }
    });
  }

  /* Formula-consistency check: uses relative R1C1-like pattern.
     This catches =F15*G14 among =Frow*Grow formulas. */
  fcols.forEach(list=>{
    if(list.length<5) return;
    const counts=new Map();
    list.forEach(x=>counts.set(x.pat,(counts.get(x.pat)||0)+1));
    const ranked=[...counts.entries()].sort((a,b)=>b[1]-a[1]);
    if(!ranked[0] || ranked[0][1]/list.length<0.75) return;
    const dominant=ranked[0][0];
    list.filter(x=>x.pat!==dominant).slice(0,20).forEach(x=>
      o.inconsistent.push({sheet:name,cell:x.cell,value:x.f.slice(0,110)})
    );
  });

  const area=o.rows*o.cols;
  if(o.isData && area>20000 && o.used/area<0.08) o.sparse=true;
  return o;
}

const flat=(s,k)=>s.flatMap(x=>x[k]||[]);
const sample=a=>a.slice(0,4).map(x=>
  x.sheet ? `${x.sheet}!${x.cell||("R"+x.row)}${x.value?": "+x.value:""}` : (x.name||x.value||"")
).join(" · ");
const href=q=>"excel-dictionary.html?q="+encodeURIComponent(q);

function issue(type,details,sev,title,desc,q){
  return {type,details,count:details.length,sev,title,desc,q};
}
function safeText(id,text){const el=$(id);if(el)el.textContent=text}
function renderReport(file,wb,sheets,scanWarnings){
  const meta={
    sheets:sheets.length,
    rows:sheets.reduce((a,x)=>a+x.rows,0),
    cells:sheets.reduce((a,x)=>a+x.used,0),
    formulas:sheets.reduce((a,x)=>a+x.formulas,0),
    merged:sheets.reduce((a,x)=>a+x.merged,0)
  };

  const names=Array.isArray(wb?.Workbook?.Names)?wb.Workbook.Names:[];
  const brokenNames=names.filter(n=>/#REF!/i.test(String(n.Ref||"")))
    .map(n=>({name:n.Name,value:n.Ref}));
  const externalNames=names.filter(n=>EXTBOOK.test(String(n.Ref||"")))
    .map(n=>({name:n.Name,value:n.Ref}));

  const wbSheets=Array.isArray(wb?.Workbook?.Sheets)?wb.Workbook.Sheets:[];
  const hidden=wbSheets.filter(x=>x && x.Hidden)
    .map(x=>({name:x.name||x.Name||"Sheet",value:Number(x.Hidden)===2?"Very Hidden":"Hidden"}));

  const sparse=sheets.filter(x=>x.sparse)
    .map(x=>({name:x.name,value:`UsedRange ${x.rows}×${x.cols}, used ${x.used}`}));
  const merges=sheets.filter(x=>x.isData && x.merged)
    .map(x=>({name:x.name,value:`${x.merged} merged ranges`}));

  const issues=[
    issue("ref",flat(sheets,"refFormulas"),"high","Công thức chứa #REF!","Tham chiếu trong công thức đã bị gãy.","#REF công thức"),
    issue("errors",flat(sheets,"errors"),"high","Ô đang chứa lỗi Excel","Có ô lưu lỗi Excel thực tế như #N/A, #VALUE!, #REF! hoặc #DIV/0!.","lỗi Excel #N/A #VALUE #REF"),
    issue("names",brokenNames,"high","Named Range bị #REF!","Tên vùng/công thức bị gãy có thể ảnh hưởng formula, validation hoặc chart.","named range #REF"),
    issue("numtxt",flat(sheets,"numericText"),"medium","Số đang lưu dạng Text","SUM, Sort, Lookup hoặc Pivot có thể xử lý sai.","number stored as text"),
    issue("datetxt",flat(sheets,"dateText"),"medium","Ngày đang lưu dạng Text","Sort ngày, Pivot Group và phép tính thời gian có thể sai.","ngày không sort đúng"),
    issue("space",flat(sheets,"whitespace"),"medium","Khoảng trắng/ký tự ẩn","Lookup, Merge và Duplicate check thường sai vì key nhìn giống nhưng khác thật.","TRIM CLEAN khoảng trắng"),
    issue("dups",flat(sheets,"dups"),"medium","Dòng dữ liệu có dấu hiệu trùng","Doctor so các giá trị đầu vào và bỏ qua ô công thức khi kiểm tra duplicate.","duplicate dữ liệu"),
    issue("blankh",flat(sheets,"blankHeaders"),"medium","Header bị trống","Bảng dữ liệu có cột chưa có tên.","header trống dữ liệu"),
    issue("duph",flat(sheets,"dupHeaders"),"medium","Header bị trùng tên","Tên cột trùng khiến Power Query và Structured Reference khó kiểm soát.","header trùng"),
    issue("ext",[...flat(sheets,"external"),...externalNames],"medium","Liên kết workbook ngoài","Công thức/Name có tham chiếu workbook ngoài hoặc book index kiểu [1].","external link workbook"),
    issue("vlook",flat(sheets,"vlookupApprox"),"medium","VLOOKUP có nguy cơ dò gần đúng","Công thức không kết thúc bằng FALSE/0; cần xác nhận có thật sự muốn approximate match hay không.","VLOOKUP trả sai dòng"),
    issue("incon",flat(sheets,"inconsistent"),"medium","Công thức lệch pattern trong cùng cột","Một số công thức có quan hệ tham chiếu khác số đông trong cùng cột.","công thức khác khi copy xuống"),
    issue("mixed",flat(sheets,"mixed"),"low","Cột lẫn kiểu dữ liệu","Cột có nhiều kiểu Number/Text/Date; hãy kiểm tra xem đây có phải chủ ý.","cột lẫn kiểu dữ liệu"),
    issue("vol",flat(sheets,"volatile"),"low","Hàm volatile","OFFSET, INDIRECT, NOW, TODAY, RAND... có thể làm workbook tính lại thường xuyên.","Excel file chậm volatile"),
    issue("full",flat(sheets,"fullcol"),"low","Công thức dùng cả cột","A:A/B:B trong công thức nặng có thể gây tốn tài nguyên.","full column formula file chậm"),
    issue("complex",flat(sheets,"complex"),"low","Công thức rất dài/nhiều lớp","Không nhất thiết sai nhưng khó audit và bảo trì.","LET công thức dài"),
    issue("blankr",flat(sheets,"blankRows"),"low","Dòng trống giữa vùng dữ liệu","Có thể chia cắt vùng Sort/Filter thủ công.","dòng trống giữa dữ liệu"),
    issue("merge",merges,"low","Merged Cells trong bảng dữ liệu","Merge trong raw data thường gây lỗi Sort/Filter/Pivot.","merged cells"),
    issue("sparse",sparse,"low","UsedRange có dấu hiệu phình","Vùng dùng lớn nhưng mật độ dữ liệu thấp có thể làm file nặng.","Ctrl End hàng rất xa"),
    issue("hidden",hidden,"low","Workbook có sheet ẩn","Không phải lỗi; chỉ là điểm cần biết khi audit dependency.","sheet ẩn Excel")
  ].filter(x=>x.count>0);

  let penalty=0;
  issues.forEach(x=>penalty+=x.count*(x.sev==="high"?3:x.sev==="medium"?1.25:.30));
  const score=Math.max(0,Math.round(100-Math.min(85,penalty/Math.max(1,meta.cells)*550)));

  safeText("edFileName",file.name);
  safeText("edWorkbookMeta",`${meta.sheets} sheet · ${meta.rows.toLocaleString("vi-VN")} hàng vùng dùng · ${meta.cells.toLocaleString("vi-VN")} ô có dữ liệu · ${meta.formulas.toLocaleString("vi-VN")} công thức`);
  safeText("edScore",score+"/100");
  safeText("edScoreLabel",score>=90?"Khá sạch":score>=75?"Cần rà soát":score>=55?"Có nhiều điểm đáng nghi":"Ưu tiên audit kỹ");

  const summary=$("edSummary");
  if(summary){
    summary.innerHTML=[
      ["Sheet",meta.sheets],["Ô dữ liệu",meta.cells.toLocaleString("vi-VN")],
      ["Công thức",meta.formulas.toLocaleString("vi-VN")],
      ["Nhóm cảnh báo",issues.length.toLocaleString("vi-VN")]
    ].map(x=>`<div class="ed-stat"><small>${esc(x[0])}</small><strong>${esc(x[1])}</strong><span>Workbook audit</span></div>`).join("");
  }

  const issueBox=$("edIssues");
  if(issueBox){
    if(!issues.length){
      issueBox.innerHTML='<div class="ed-ok"><strong>Không phát hiện dấu hiệu kỹ thuật phổ biến.</strong><p>Vẫn nên đối chiếu logic nghiệp vụ, KPI và tổng nguồn.</p></div>';
    }else{
      issueBox.innerHTML=issues.map(x=>`<article class="ed-issue ${esc(x.sev)} deep">
        <div class="ed-issue-icon">!</div>
        <div>
          <h3>${esc(x.title)}</h3>
          <p>${esc(x.desc)}</p>
          ${x.details.length?`<div class="ed-issue-samples">${esc(sample(x.details))}${x.count>4?" · …":""}</div>`:""}
          <a class="ed-dict-link" href="${esc(href(x.q))}">Tra nguyên nhân & cách xử lý →</a>
        </div>
        <span class="ed-issue-count">${x.count} phát hiện</span>
      </article>`).join("");
    }

    if(scanWarnings.length){
      issueBox.insertAdjacentHTML("afterbegin",`<article class="ed-issue low deep">
        <div class="ed-issue-icon">i</div>
        <div><h3>${scanWarnings.length} cảnh báo kỹ thuật khi quét</h3>
        <p>Workbook vẫn đọc được; Doctor bỏ qua đúng phần analyzer gặp ngoại lệ thay vì dừng toàn bộ.</p>
        <div class="ed-issue-samples">${esc(scanWarnings.slice(0,3).join(" · "))}</div></div>
        <span class="ed-issue-count">${scanWarnings.length} cảnh báo</span>
      </article>`);
    }
  }

  const learning=$("edLearningGrid");
  if(learning){
    let top=issues.slice(0,6).map(x=>({title:x.title,href:href(x.q)}));
    if(!top.length) top=[
      {title:"Audit workbook",href:href("audit workbook")},
      {title:"Power Query làm sạch",href:href("Power Query làm sạch")},
      {title:"Công thức nâng cao",href:"excel-dictionary.html"}
    ];
    learning.innerHTML=top.map(x=>`<a class="ed-learn-card" href="${esc(x.href)}">
      <span>TRA CỨU</span><strong>${esc(x.title)}</strong>
      <small>Từ phát hiện trong file của bạn</small><b>Mở Từ điển →</b>
    </a>`).join("");
  }

  if(report){
    report.hidden=false;
    report.scrollIntoView({behavior:"smooth",block:"start"});
  }

  return issues;
}

async function readWorkbook(buf){
  let lastErr=null;
  const attempts=[
    {type:"array",cellDates:true},
    {type:"array",cellDates:false},
    {type:"array"}
  ];
  for(const opts of attempts){
    try{
      const wb=XLSX.read(buf,opts);
      if(wb && Array.isArray(wb.SheetNames) && wb.SheetNames.length) return wb;
    }catch(err){
      lastErr=err;
      console.warn("Doctor read fallback",opts,err);
    }
  }
  throw lastErr||new Error("Workbook không có sheet đọc được");
}

async function analyzeFile(file){
  if(!file) return;
  if(typeof XLSX==="undefined"){
    alert("Chưa tải được bộ đọc Excel. Kiểm tra kết nối mạng rồi thử lại.");
    return;
  }

  show("Đọc workbook…","Đang mở file trên thiết bị của bạn.");
  let buf,wb;
  try{
    buf=await file.arrayBuffer();
    wb=await readWorkbook(buf);
  }catch(err){
    console.error("Doctor workbook read failed",err);
    hide();
    alert("Doctor thực sự không mở được workbook này.\n\nChi tiết: "+String(err?.message||err).slice(0,180));
    return;
  }

  show("Quét dữ liệu & công thức…","Workbook đã mở thành công. Đang kiểm tra các sheet có cấu trúc dữ liệu và công thức.");
  await new Promise(r=>setTimeout(r,50));

  const sheets=[],warnings=[];
  for(const name of wb.SheetNames){
    try{
      sheets.push(analyzeSheet(wb.Sheets?.[name],name));
    }catch(err){
      console.error("Doctor sheet analyzer failed",name,err);
      warnings.push(name+": "+String(err?.message||err).slice(0,110));
      sheets.push(emptyResult(name));
    }
  }

  hide();
  let issues=[];
  try{
    issues=renderReport(file,wb,sheets,warnings)||[];
  }catch(err){
    console.error("Doctor report render failed",err);
    /* Do not show a misleading 'cannot read workbook' alert here. */
    if(report) report.hidden=false;
    const issueBox=$("edIssues");
    if(issueBox){
      issueBox.innerHTML=`<div class="ed-ok"><strong>Workbook đã đọc được nhưng phần hiển thị báo cáo gặp lỗi.</strong><p>${esc(String(err?.message||err).slice(0,180))}</p></div>`;
    }
  }

  /* Analytics: only anonymous usage metadata, never workbook content. */
  if(window.avpAnalytics?.track){
    try{
      window.avpAnalytics.track("excel_doctor_scan_complete",{
        page:"excel-doctor.html",
        tool_name:"Workbook scan",
        metadata:{issues:issues.reduce((a,x)=>a+x.count,0),groups:issues.length}
      });
    }catch(_){}
  }
}

choose?.addEventListener("click",()=>fileInput?.click());
fileInput?.addEventListener("change",()=>analyzeFile(fileInput.files?.[0]));
["dragenter","dragover"].forEach(ev=>drop?.addEventListener(ev,e=>{
  e.preventDefault();drop.classList.add("is-drag");
}));
["dragleave","drop"].forEach(ev=>drop?.addEventListener(ev,e=>{
  e.preventDefault();drop.classList.remove("is-drag");
}));
drop?.addEventListener("drop",e=>analyzeFile(e.dataTransfer?.files?.[0]));
$("edScanAnother")?.addEventListener("click",()=>{
  if(report) report.hidden=true;
  if(fileInput) fileInput.value="";
  drop?.scrollIntoView({behavior:"smooth",block:"center"});
});

/* Existing Admin usage tracking */
(function(){
  let tries=0;
  const track=(eventName,options={})=>{
    if(window.avpAnalytics?.track){window.avpAnalytics.track(eventName,options);return}
    if(++tries<25)setTimeout(()=>track(eventName,options),120);
  };
  track("excel_doctor_open",{page:"excel-doctor.html",tool_name:"Excel Doctor"});
  fileInput?.addEventListener("change",()=>{
    const f=fileInput.files?.[0]; if(!f)return;
    track("excel_doctor_scan",{
      page:"excel-doctor.html",tool_name:"Workbook scan",
      metadata:{extension:(f.name.split(".").pop()||"").slice(0,12),size_kb:Math.round(f.size/1024)}
    });
  });
  document.addEventListener("click",e=>{
    const link=e.target.closest?.(".ed-dict-link");if(!link)return;
    track("excel_doctor_to_dictionary",{
      page:"excel-doctor.html",
      tool_name:(link.closest(".ed-issue")?.querySelector("h3")?.textContent||"Doctor issue").slice(0,80)
    });
  },true);
})();
})();