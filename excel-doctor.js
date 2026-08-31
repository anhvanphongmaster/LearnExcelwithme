/*! Excel Doctor Pro */
(function(){"use strict";
const $=id=>document.getElementById(id),fileInput=$("edFile"),choose=$("edChoose"),drop=$("edDropZone"),status=$("edStatus"),report=$("edReport");
const ERR={0:"#NULL!",7:"#DIV/0!",15:"#VALUE!",23:"#REF!",29:"#NAME?",36:"#NUM!",42:"#N/A",43:"#GETTING_DATA"};
const VOL=/\b(NOW|TODAY|RAND|RANDBETWEEN|OFFSET|INDIRECT|CELL|INFO)\s*\(/i,FULL=/(^|[^A-Z0-9_])\$?[A-Z]{1,3}:\$?[A-Z]{1,3}([^0-9]|$)/i,EXT=/\[[^\]]+\.(xlsx?|xlsm|xlsb|csv)\]/i;
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
function show(t,x){status.hidden=false;report.hidden=true;$("edStatusTitle").textContent=t;$("edStatusText").textContent=x||""}function hide(){status.hidden=true}
function isNumText(v){if(typeof v!=="string")return false;const s=v.trim();if(!s||s.length>40||/[A-Za-zÀ-ỹ]/.test(s)||/[\/:]/.test(s))return false;return /^[-+]?\d+(\.\d+)?$/.test(s.replace(/\s/g,"").replace(/,/g,""))}
function wsIssue(v){return typeof v==="string"&&v!==""&&(v!==v.trim()||/ {2,}/.test(v)||/\u00A0/.test(v))}
function typ(c){if(!c)return"blank";if(c.t==="e")return"error";if(c.t==="n")return c.z&&/[dmyhs]/i.test(String(c.z))?"date":"number";if(c.t==="d")return"date";if(c.t==="b")return"boolean";if(c.t==="s"||c.t==="str")return"text";return c.t||"other"}
function pat(f){return String(f||"").toUpperCase().replace(/\$?[A-Z]{1,3}\$?\d+/g,m=>m.replace(/\d+/g,"#")).replace(/\d+(\.\d+)?/g,"N").replace(/\s+/g,"")}
function analyze(ws,name){
 const ref=ws["!ref"],o={name,rows:0,cols:0,used:0,formulas:0,merged:(ws["!merges"]||[]).length,numericText:[],whitespace:[],errors:[],blankRows:[],dups:[],mixed:[],dateText:[],blankHeaders:[],dupHeaders:[],refFormulas:[],external:[],volatile:[],fullcol:[],vlookupApprox:[],complex:[],inconsistent:[],sparse:false};
 if(!ref)return o;const R=XLSX.utils.decode_range(ref);o.rows=R.e.r-R.s.r+1;o.cols=R.e.c-R.s.c+1;const sig=new Map(),types=Array.from({length:o.cols},()=>new Map()),non=Array(o.cols).fill(0),fcols=Array.from({length:o.cols},()=>[]),seenH=new Map();
 for(let c=R.s.c;c<=R.e.c;c++){const a=XLSX.utils.encode_cell({r:R.s.r,c}),v=String(ws[a]?.v??"").trim();if(!v)o.blankHeaders.push({sheet:name,cell:a,value:"Header trống"});else{const k=v.toLowerCase();if(seenH.has(k))o.dupHeaders.push({sheet:name,cell:a,value:`Trùng "${v}" với ${seenH.get(k)}`});else seenH.set(k,a)}}
 for(let r=R.s.r;r<=R.e.r;r++){let has=false;const vals=[];for(let c=R.s.c;c<=R.e.c;c++){const a=XLSX.utils.encode_cell({r,c}),cell=ws[a],j=c-R.s.c;if(!cell||cell.v===undefined||cell.v===null||cell.v===""){vals.push("");continue}has=true;o.used++;non[j]++;const t=typ(cell);types[j].set(t,(types[j].get(t)||0)+1);
   if(cell.f){o.formulas++;const f=String(cell.f);fcols[j].push({sheet:name,cell:a,f,pat:pat(f)});if(/#REF!/i.test(f))o.refFormulas.push({sheet:name,cell:a,value:f.slice(0,90)});if(EXT.test(f))o.external.push({sheet:name,cell:a,value:f.slice(0,90)});if(VOL.test(f))o.volatile.push({sheet:name,cell:a,value:f.slice(0,90)});if(FULL.test(f))o.fullcol.push({sheet:name,cell:a,value:f.slice(0,90)});if(/\bVLOOKUP\s*\(/i.test(f)&&(!/,\s*(FALSE|0)\s*\)$/i.test(f)))o.vlookupApprox.push({sheet:name,cell:a,value:f.slice(0,90)});if(f.length>180||(f.match(/\(/g)||[]).length>=7)o.complex.push({sheet:name,cell:a,value:f.slice(0,90)})}
   if(cell.t==="e")o.errors.push({sheet:name,cell:a,value:ERR[cell.v]||String(cell.w||cell.v||"Error")});if(typeof cell.v==="string"){if(isNumText(cell.v))o.numericText.push({sheet:name,cell:a,value:cell.v.slice(0,60)});if(wsIssue(cell.v))o.whitespace.push({sheet:name,cell:a,value:cell.v.slice(0,60)});if(/^\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\s*$/.test(cell.v))o.dateText.push({sheet:name,cell:a,value:cell.v.slice(0,40)})}vals.push(String(cell.v).trim())}
   if(!has&&r>R.s.r&&r<R.e.r)o.blankRows.push({sheet:name,row:r+1});else if(has){const s=vals.join("\u241F");if(s.replace(/\u241F/g,"")){if(sig.has(s))o.dups.push({sheet:name,row:r+1,firstRow:sig.get(s)});else sig.set(s,r+1)}}}
 types.forEach((m,i)=>{if(non[i]<3)return;const f=[...m.entries()].filter(([t,n])=>!["blank","error"].includes(t)&&n>0);if(f.length>1)o.mixed.push({sheet:name,cell:`Cột ${XLSX.utils.encode_col(R.s.c+i)}`,value:f.map(([t,n])=>`${t}:${n}`).join(", ")})});
 fcols.forEach(list=>{if(list.length<5)return;const m=new Map();list.forEach(x=>m.set(x.pat,(m.get(x.pat)||0)+1));const s=[...m.entries()].sort((a,b)=>b[1]-a[1]);if(!s[0]||s[0][1]/list.length<.65)return;list.filter(x=>x.pat!==s[0][0]).slice(0,20).forEach(x=>o.inconsistent.push({sheet:name,cell:x.cell,value:x.f.slice(0,90)}))});
 const area=o.rows*o.cols;if(area>20000&&o.used/area<.08)o.sparse=true;return o;
}
const flatten=(s,k)=>s.flatMap(x=>x[k]||[]),sample=a=>a.slice(0,4).map(x=>x.sheet?`${x.sheet}!${x.cell||("R"+x.row)}${x.value?": "+x.value:""}`:(x.name||x.value||"")).join(" · "),href=q=>"excel-dictionary.html?q="+encodeURIComponent(q);
function render(file,wb,s){
 const meta={sheets:s.length,rows:s.reduce((a,x)=>a+x.rows,0),cells:s.reduce((a,x)=>a+x.used,0),formulas:s.reduce((a,x)=>a+x.formulas,0),merged:s.reduce((a,x)=>a+x.merged,0)};
 const names=Array.isArray(wb.Workbook?.Names)?wb.Workbook.Names:[],broken=names.filter(n=>/#REF!/i.test(String(n.Ref||""))).map(n=>({name:n.Name,value:n.Ref})),extNames=names.filter(n=>EXT.test(String(n.Ref||""))).map(n=>({name:n.Name,value:n.Ref})),hidden=(Array.isArray(wb.Workbook?.Sheets)?wb.Workbook.Sheets:[]).filter(x=>x.Hidden).map(x=>({name:x.name,value:x.Hidden===2?"Very Hidden":"Hidden"})),sparse=s.filter(x=>x.sparse).map(x=>({name:x.name,value:`UsedRange ${x.rows}×${x.cols}, used ${x.used}`}));
 const I=(type,details,sev,title,desc,q)=>({type,details,count:details.length,sev,title,desc,q}),mergeDetails=s.filter(x=>x.merged).map(x=>({name:x.name,value:`${x.merged} merged ranges`}));
 const issues=[
  I("errors",flatten(s,"errors"),"high","Ô đang chứa lỗi Excel","Các lỗi như #N/A, #VALUE!, #REF! có thể lan sang báo cáo.","#N/A #VALUE #REF lỗi công thức"),
  I("ref",flatten(s,"refFormulas"),"high","Công thức chứa #REF!","Tham chiếu đã bị gãy.","#REF công thức"),
  I("names",broken,"high","Named Range bị #REF!","Tên vùng/công thức bị gãy có thể ảnh hưởng validation, chart hoặc công thức.","named range #REF"),
  I("numtxt",flatten(s,"numericText"),"medium","Số đang lưu dạng Text","SUM, Sort, Lookup hoặc Pivot có thể xử lý sai.","number stored as text"),
  I("datetxt",flatten(s,"dateText"),"medium","Ngày đang lưu dạng Text","Sort, Pivot Group và tính thời gian có thể sai.","ngày không sort đúng"),
  I("mixed",flatten(s,"mixed"),"medium","Cột lẫn nhiều kiểu dữ liệu","Nguồn chưa chuẩn hóa.","cột lẫn kiểu dữ liệu"),
  I("space",flatten(s,"whitespace"),"medium","Khoảng trắng/ký tự ẩn","Lookup và duplicate thường lỗi vì key nhìn giống nhưng khác thật.","TRIM CLEAN khoảng trắng"),
  I("dups",flatten(s,"dups"),"medium","Dòng dữ liệu trùng hoàn toàn","Có thể gây double-count.","duplicate dữ liệu"),
  I("blankh",flatten(s,"blankHeaders"),"medium","Header bị trống","Power Query, Pivot và công thức sẽ khó bảo trì.","header trống dữ liệu"),
  I("duph",flatten(s,"dupHeaders"),"medium","Header bị trùng tên","Structured Reference/Power Query dễ khó hiểu.","header trùng"),
  I("blankr",flatten(s,"blankRows"),"low","Dòng trống giữa vùng dữ liệu","Có thể chia cắt vùng thao tác.","dòng trống giữa dữ liệu"),
  I("merge",mergeDetails,"low","Merged Cells trong workbook","Merge trong raw data thường gây lỗi Sort/Filter/Pivot.","merged cells"),
  I("ext",[...flatten(s,"external"),...extNames],"medium","Liên kết workbook ngoài","Link ngoài có thể gãy khi đổi máy/thư mục.","external link workbook"),
  I("vol",flatten(s,"volatile"),"low","Hàm volatile có thể làm file chậm","OFFSET, INDIRECT, NOW, TODAY, RAND... tính lại thường xuyên.","Excel file chậm volatile"),
  I("full",flatten(s,"fullcol"),"low","Công thức dùng cả cột","A:A/B:B trong công thức nặng có thể tốn tài nguyên.","full column formula file chậm"),
  I("vlook",flatten(s,"vlookupApprox"),"medium","VLOOKUP có dấu hiệu approximate","Bỏ đối số cuối hoặc TRUE/1 có thể trả sai nếu data không phù hợp.","VLOOKUP trả sai dòng"),
  I("complex",flatten(s,"complex"),"low","Công thức rất dài/nhiều lớp","Khó audit và dễ che lỗi logic.","LET công thức dài"),
  I("incon",flatten(s,"inconsistent"),"medium","Công thức khác pattern trong cùng cột","Có thể bị ghi đè/copy lệch.","công thức khác khi copy xuống"),
  I("sparse",sparse,"low","UsedRange có dấu hiệu phình","Vùng rất lớn nhưng ít ô dữ liệu có thể làm file nặng.","Ctrl End hàng rất xa"),
  I("hidden",hidden,"low","Workbook có sheet ẩn","Nên kiểm tra khi audit dependency.","sheet ẩn Excel")
 ].filter(x=>x.count);
 let p=0;issues.forEach(x=>p+=x.count*(x.sev==="high"?3:x.sev==="medium"?1.4:.45));const score=Math.max(0,Math.round(100-Math.min(85,p/Math.max(1,meta.cells)*700)));
 $("edFileName").textContent=file.name;$("edWorkbookMeta").textContent=`${meta.sheets} sheet · ${meta.rows.toLocaleString("vi-VN")} hàng vùng dùng · ${meta.cells.toLocaleString("vi-VN")} ô có dữ liệu · ${meta.formulas.toLocaleString("vi-VN")} công thức`;$("edScore").textContent=score+"/100";$("edScoreLabel").textContent=score>=90?"Khá sạch":score>=75?"Cần rà soát":score>=55?"Có nhiều điểm đáng nghi":"Ưu tiên audit kỹ";
 $("edSummary").innerHTML=[["Sheet",meta.sheets],["Ô dữ liệu",meta.cells.toLocaleString("vi-VN")],["Công thức",meta.formulas.toLocaleString("vi-VN")],["Phát hiện",issues.reduce((a,x)=>a+x.count,0).toLocaleString("vi-VN")]].map(x=>`<div class="ed-stat"><small>${x[0]}</small><strong>${x[1]}</strong><span>Workbook audit</span></div>`).join("");
 if(!issues.length)$("edIssues").innerHTML='<div class="ed-ok"><strong>Không phát hiện dấu hiệu kỹ thuật phổ biến.</strong><p>Vẫn nên đối chiếu logic nghiệp vụ, KPI và tổng nguồn.</p></div>';else $("edIssues").innerHTML=issues.map(x=>`<article class="ed-issue ${x.sev} deep"><div class="ed-issue-icon">!</div><div><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p>${x.details.length?`<div class="ed-issue-samples">${esc(sample(x.details))}${x.count>4?" · …":""}</div>`:""}<a class="ed-dict-link" href="${esc(href(x.q))}">Tra nguyên nhân & cách xử lý →</a></div><span class="ed-issue-count">${x.count} phát hiện</span></article>`).join("");
 const learn=issues.slice(0,6).map(x=>({title:x.title,href:href(x.q)}));if(!learn.length)learn.push({title:"Audit workbook",href:href("audit workbook")},{title:"Power Query làm sạch",href:href("Power Query làm sạch")},{title:"Công thức nâng cao",href:"excel-dictionary.html"});
 $("edLearningGrid").innerHTML=learn.map(x=>`<a class="ed-learn-card" href="${esc(x.href)}"><span>TRA CỨU</span><strong>${esc(x.title)}</strong><small>Từ phát hiện trong file của bạn</small><b>Mở Từ điển →</b></a>`).join("");report.hidden=false;report.scrollIntoView({behavior:"smooth",block:"start"});
}
function emptySheetResult(name){
 return {name,rows:0,cols:0,used:0,formulas:0,merged:0,numericText:[],whitespace:[],errors:[],blankRows:[],dups:[],mixed:[],dateText:[],blankHeaders:[],dupHeaders:[],refFormulas:[],external:[],volatile:[],fullcol:[],vlookupApprox:[],complex:[],inconsistent:[],sparse:false};
}
async function analyze(file){
 if(!file)return;
 if(typeof XLSX==="undefined"){
   alert("Chưa tải được bộ đọc Excel. Kiểm tra kết nối mạng rồi thử lại.");
   return;
 }

 let buf;
 show("Đọc file…","Đang nạp workbook từ thiết bị của bạn.");
 try{
   buf=await file.arrayBuffer();
 }catch(err){
   console.error("Excel Doctor: file.arrayBuffer failed",err);
   hide();
   alert("Không đọc được dữ liệu file từ trình duyệt. Hãy chọn lại file rồi thử lại.");
   return;
 }

 let wb=null,readError=null;
 const attempts=[
   {type:"array",cellDates:true},
   {type:"array",cellDates:false},
   {type:"array"}
 ];

 for(const opts of attempts){
   try{
     wb=XLSX.read(buf,opts);
     if(wb&&Array.isArray(wb.SheetNames)&&wb.SheetNames.length)break;
     wb=null;
   }catch(err){
     readError=err;
     console.warn("Excel Doctor read attempt failed",opts,err);
   }
 }

 if(!wb){
   hide();
   const detail=String(readError?.message||readError||"Không rõ lỗi").slice(0,180);
   alert("Doctor chưa mở được workbook này.\n\nChi tiết kỹ thuật: "+detail+"\n\nNếu đây là .xlsx/.xlsm bình thường, hãy gửi file để kiểm tra Doctor thay vì sửa file.");
   return;
 }

 show("Quét dữ liệu & công thức…","Workbook đã mở được. Đang kiểm tra từng sheet, header, formula và dependency.");
 await new Promise(r=>setTimeout(r,50));

 const sheets=[];
 const scanErrors=[];
 for(const name of wb.SheetNames){
   try{
     const ws=wb.Sheets?.[name];
     if(!ws){scanErrors.push(name+": thiếu worksheet object");sheets.push(emptySheetResult(name));continue}
     sheets.push(analyze(ws,name));
   }catch(err){
     console.error("Excel Doctor sheet scan failed:",name,err);
     scanErrors.push(name+": "+String(err?.message||err).slice(0,120));
     sheets.push(emptySheetResult(name));
   }
 }

 try{
   hide();
   render(file,wb,sheets);

   if(scanErrors.length){
     const issues=document.getElementById("edIssues");
     if(issues){
       const warn=document.createElement("article");
       warn.className="ed-issue medium deep";
       warn.innerHTML='<div class="ed-issue-icon">i</div><div><h3>Một số sheet chưa quét hết</h3><p>Workbook đã mở thành công nhưng Doctor bỏ qua '+scanErrors.length+' sheet/khối gặp lỗi phân tích để phần còn lại vẫn có báo cáo.</p><div class="ed-issue-samples">'+esc(scanErrors.slice(0,3).join(" · "))+'</div></div><span class="ed-issue-count">'+scanErrors.length+' cảnh báo</span>';
       issues.prepend(warn);
     }
   }
 }catch(err){
   console.error("Excel Doctor render failed",err);
   hide();
   alert("Workbook đã mở được nhưng Doctor gặp lỗi khi dựng báo cáo.\n\nChi tiết kỹ thuật: "+String(err?.message||err).slice(0,180));
 }
}
choose?.addEventListener("click",()=>fileInput.click());fileInput?.addEventListener("change",()=>analyze(fileInput.files?.[0]));["dragenter","dragover"].forEach(ev=>drop?.addEventListener(ev,e=>{e.preventDefault();drop.classList.add("is-drag")}));["dragleave","drop"].forEach(ev=>drop?.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove("is-drag")}));drop?.addEventListener("drop",e=>analyze(e.dataTransfer?.files?.[0]));$("edScanAnother")?.addEventListener("click",()=>{report.hidden=true;fileInput.value="";drop.scrollIntoView({behavior:"smooth",block:"center"})});
})();

;(() => {
  const waitTrack = (eventName, options = {}) => {
    let tries = 0;
    const run = () => {
      if (window.avpAnalytics?.track) {
        window.avpAnalytics.track(eventName, options);
        return;
      }
      if (++tries < 25) setTimeout(run, 120);
    };
    run();
  };

  waitTrack("excel_doctor_open", {
    page: "excel-doctor.html",
    tool_name: "Excel Doctor"
  });

  const fileInput = document.getElementById("edFile");
  let scanStartedAt = 0;

  fileInput?.addEventListener("change", () => {
    if (!fileInput.files?.[0]) return;
    scanStartedAt = Date.now();
    waitTrack("excel_doctor_scan", {
      page: "excel-doctor.html",
      tool_name: "Workbook scan",
      metadata: {
        extension: (fileInput.files[0].name.split(".").pop() || "").slice(0, 12),
        size_kb: Math.round(fileInput.files[0].size / 1024)
      }
    });
  });

  // Doctor renders the report after scanning; observe it becoming visible.
  const report = document.getElementById("edReport");
  if (report) {
    const obs = new MutationObserver(() => {
      if (report.hidden) return;

      const issueEls = [...report.querySelectorAll(".ed-issue-count")];
      const issueCount = issueEls.reduce((sum, el) => {
        const m = String(el.textContent || "").match(/\d+/);
        return sum + (m ? Number(m[0]) : 0);
      }, 0);

      const scoreText = document.getElementById("edScore")?.textContent || "";
      const score = Number((scoreText.match(/\d+/) || [0])[0]);

      waitTrack("excel_doctor_scan_complete", {
        page: "excel-doctor.html",
        tool_name: "Workbook scan",
        metadata: {
          issues: issueCount,
          score,
          duration_ms: scanStartedAt ? Math.max(0, Date.now() - scanStartedAt) : 0
        }
      });

      obs.disconnect();
    });
    obs.observe(report, { attributes: true, attributeFilter: ["hidden"], subtree: false });
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest?.(".ed-dict-link");
    if (!link) return;
    waitTrack("excel_doctor_to_dictionary", {
      page: "excel-doctor.html",
      tool_name: (link.closest(".ed-issue")?.querySelector("h3")?.textContent || "Doctor issue").slice(0, 80)
    });
  }, true);
})();

