/*! excel-doctor.js — V108 client-side workbook audit */
(function(){
  "use strict";

  const $=id=>document.getElementById(id);
  const fileInput=$("edFile");
  const choose=$("edChoose");
  const drop=$("edDropZone");
  const status=$("edStatus");
  const report=$("edReport");

  const ERROR_NAMES={
    0x00:"#NULL!",0x07:"#DIV/0!",0x0F:"#VALUE!",0x17:"#REF!",
    0x1D:"#NAME?",0x24:"#NUM!",0x2A:"#N/A",0x2B:"#GETTING_DATA"
  };

  function escapeHtml(v){
    return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  }

  function showStatus(title,text){
    status.hidden=false; report.hidden=true;
    $("edStatusTitle").textContent=title;
    $("edStatusText").textContent=text||"";
  }

  function hideStatus(){status.hidden=true}

  function isNumericText(v){
    if(typeof v!=="string") return false;
    const s=v.trim();
    if(!s || s.length>32) return false;
    // Avoid IDs with letters, dates and very long codes.
    if(/[A-Za-zÀ-ỹ]/.test(s) || /[\/:]/.test(s)) return false;
    const cleaned=s.replace(/\s/g,"").replace(/,/g,"");
    return /^[-+]?\d+(\.\d+)?$/.test(cleaned);
  }

  function hasWhitespaceIssue(v){
    if(typeof v!=="string" || !v) return false;
    return v!==v.trim() || / {2,}/.test(v) || /\u00A0/.test(v);
  }

  function classifyCell(cell){
    if(!cell) return "blank";
    if(cell.t==="e") return "error";
    if(cell.t==="n"){
      if(cell.z && /[dmyhs]/i.test(String(cell.z))) return "date";
      return "number";
    }
    if(cell.t==="d") return "date";
    if(cell.t==="b") return "boolean";
    if(cell.t==="s" || cell.t==="str") return "text";
    return cell.t || "other";
  }

  function colLabel(idx){
    let n=idx+1,s="";
    while(n){const r=(n-1)%26;s=String.fromCharCode(65+r)+s;n=Math.floor((n-1)/26)}
    return s;
  }

  function analyzeSheet(ws,name){
    const ref=ws["!ref"];
    const result={
      name,rows:0,cols:0,usedCells:0,formulas:0,
      numericText:[],whitespace:[],errors:[],blankRows:[],duplicates:[],
      mixedColumns:[],dateText:[],merged:(ws["!merges"]||[]).length
    };
    if(!ref) return result;

    const range=XLSX.utils.decode_range(ref);
    result.rows=range.e.r-range.s.r+1;
    result.cols=range.e.c-range.s.c+1;

    const rowSignatures=new Map();
    const colTypes=Array.from({length:result.cols},()=>new Map());
    const colNonBlank=Array(result.cols).fill(0);

    for(let r=range.s.r;r<=range.e.r;r++){
      let rowHas=false;
      const rowVals=[];
      for(let c=range.s.c;c<=range.e.c;c++){
        const addr=XLSX.utils.encode_cell({r,c});
        const cell=ws[addr];
        const relC=c-range.s.c;
        if(!cell || cell.v===undefined || cell.v===null || cell.v===""){
          rowVals.push("");
          continue;
        }

        rowHas=true;
        result.usedCells++;
        colNonBlank[relC]++;

        const type=classifyCell(cell);
        colTypes[relC].set(type,(colTypes[relC].get(type)||0)+1);

        if(cell.f) result.formulas++;
        if(cell.t==="e"){
          result.errors.push({sheet:name,cell:addr,value:ERROR_NAMES[cell.v]||String(cell.w||cell.v||"Error")});
        }
        if(typeof cell.v==="string"){
          if(isNumericText(cell.v)) result.numericText.push({sheet:name,cell:addr,value:cell.v.slice(0,60)});
          if(hasWhitespaceIssue(cell.v)) result.whitespace.push({sheet:name,cell:addr,value:cell.v.slice(0,60)});
          if(/^\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\s*$/.test(cell.v)){
            result.dateText.push({sheet:name,cell:addr,value:cell.v.slice(0,40)});
          }
        }
        rowVals.push(String(cell.v).trim());
      }

      if(!rowHas && r>range.s.r && r<range.e.r){
        result.blankRows.push({sheet:name,row:r+1});
      }else if(rowHas){
        const signature=rowVals.join("\u241F");
        if(signature.replace(/\u241F/g,"")){
          if(rowSignatures.has(signature)){
            result.duplicates.push({sheet:name,row:r+1,firstRow:rowSignatures.get(signature)});
          }else{
            rowSignatures.set(signature,r+1);
          }
        }
      }
    }

    colTypes.forEach((map,i)=>{
      const total=colNonBlank[i];
      if(total<3) return;
      const relevant=[...map.entries()].filter(([type,count])=>type!=="blank" && count>0);
      // Ignore formulas because type comes from cached result; flag only true mixed value families.
      const families=new Set(relevant.map(([type])=>type));
      if(families.size>1){
        const hasText=families.has("text");
        const hasNumber=families.has("number");
        const hasDate=families.has("date");
        const hasError=families.has("error");
        if((hasText&&(hasNumber||hasDate)) || hasError){
          result.mixedColumns.push({
            sheet:name,
            column:colLabel(range.s.c+i),
            types:relevant.map(([t,n])=>t+":"+n).join(", ")
          });
        }
      }
    });

    return result;
  }

  function aggregate(sheetResults){
    const sum=(key)=>sheetResults.reduce((n,s)=>n+(Array.isArray(s[key])?s[key].length:(s[key]||0)),0);
    return {
      sheets:sheetResults.length,
      rows:sheetResults.reduce((n,s)=>n+s.rows,0),
      usedCells:sheetResults.reduce((n,s)=>n+s.usedCells,0),
      formulas:sheetResults.reduce((n,s)=>n+s.formulas,0),
      numericText:sum("numericText"),
      whitespace:sum("whitespace"),
      errors:sum("errors"),
      blankRows:sum("blankRows"),
      duplicates:sum("duplicates"),
      mixedColumns:sum("mixedColumns"),
      dateText:sum("dateText"),
      merged:sheetResults.reduce((n,s)=>n+s.merged,0)
    };
  }

  function sample(list,max=4){
    return list.slice(0,max).map(x=>{
      if(x.cell) return x.sheet+"!"+x.cell+(x.value!==undefined?" = "+String(x.value):"");
      if(x.row) return x.sheet+" · dòng "+x.row+(x.firstRow?" (trùng dòng "+x.firstRow+")":"");
      if(x.column) return x.sheet+"!"+x.column+":"+x.column+" · "+x.types;
      return x.sheet||"";
    }).join(" · ");
  }

  function calcScore(a){
    let penalty=0;
    penalty+=Math.min(24,a.errors*4);
    penalty+=Math.min(20,a.numericText*1.2);
    penalty+=Math.min(16,a.duplicates*2);
    penalty+=Math.min(12,a.mixedColumns*2);
    penalty+=Math.min(10,a.whitespace*.45);
    penalty+=Math.min(8,a.blankRows*1.2);
    penalty+=Math.min(10,a.dateText*.8);
    return Math.max(0,Math.round(100-penalty));
  }

  function scoreLabel(score){
    if(score>=90) return "Khá sạch";
    if(score>=75) return "Có vài điểm cần kiểm tra";
    if(score>=55) return "Nên làm sạch trước khi báo cáo";
    return "Rủi ro dữ liệu cao";
  }

  function issueDef(type,count,details,severity,title,desc,learn){
    return {type,count,details,severity,title,desc,learn};
  }

  function render(fileName,wb,sheets){
    const agg=aggregate(sheets);
    const score=calcScore(agg);

    $("edFileName").textContent=fileName;
    $("edWorkbookMeta").textContent=
      agg.sheets+" sheet · "+agg.rows.toLocaleString("vi-VN")+" dòng vùng sử dụng · "+
      agg.usedCells.toLocaleString("vi-VN")+" ô có dữ liệu · "+agg.formulas.toLocaleString("vi-VN")+" công thức";
    $("edScore").textContent=score+"/100";
    $("edScoreLabel").textContent=scoreLabel(score);

    const stats=[
      ["Sheet",agg.sheets,"trong workbook"],
      ["Ô có dữ liệu",agg.usedCells.toLocaleString("vi-VN"),"đã quét"],
      ["Công thức",agg.formulas.toLocaleString("vi-VN"),"được phát hiện"],
      ["Vấn đề", (agg.numericText+agg.whitespace+agg.errors+agg.blankRows+agg.duplicates+agg.mixedColumns+agg.dateText).toLocaleString("vi-VN"),"cần xem lại"]
    ];
    $("edSummary").innerHTML=stats.map(x=>
      '<article class="ed-stat"><small>'+escapeHtml(x[0])+'</small><strong>'+escapeHtml(x[1])+'</strong><span>'+escapeHtml(x[2])+'</span></article>'
    ).join("");

    const flat=k=>sheets.flatMap(s=>s[k]||[]);
    const issues=[
      issueDef("errors",agg.errors,flat("errors"),"high","Ô lỗi Excel",
        "Workbook đang chứa lỗi như #N/A, #VALUE!, #REF! hoặc lỗi tương tự. Đây là nhóm nên kiểm tra trước khi tổng hợp báo cáo.",
        ["Công thức & lỗi Excel","congthucexcel.html"]),
      issueDef("numericText",agg.numericText,flat("numericText"),"high","Số đang lưu dạng Text",
        "Các giá trị này nhìn giống số nhưng Excel có thể không cộng, lọc hoặc tổng hợp như Number.",
        ["Làm sạch dữ liệu","practice-video.html"]),
      issueDef("duplicates",agg.duplicates,flat("duplicates"),"medium","Dòng dữ liệu trùng",
        "Excel Doctor tìm thấy các dòng có toàn bộ giá trị giống nhau. Hãy xác nhận khóa nghiệp vụ trước khi xóa.",
        ["Power Query & Remove Duplicates","power-query-course.html"]),
      issueDef("mixedColumns",agg.mixedColumns,flat("mixedColumns"),"medium","Cột đang lẫn kiểu dữ liệu",
        "Một cột vừa có Text vừa có Number/Date thường gây lỗi khi Pivot, Power Query hoặc tính toán.",
        ["Power Query · Data Types","power-query-course.html"]),
      issueDef("dateText",agg.dateText,flat("dateText"),"medium","Ngày tháng đang lưu dạng Text",
        "Chuỗi trông giống ngày tháng nhưng chưa chắc Excel nhận là Date. Hãy kiểm tra Locale và Data Type.",
        ["Ngày tháng & Power Query","power-query-course.html"]),
      issueDef("whitespace",agg.whitespace,flat("whitespace"),"low","Khoảng trắng thừa",
        "Khoảng trắng đầu/cuối hoặc nhiều khoảng trắng liên tiếp có thể làm XLOOKUP, Remove Duplicates và so sánh sai.",
        ["TRIM · CLEAN · Làm sạch","practice-video.html"]),
      issueDef("blankRows",agg.blankRows,flat("blankRows"),"low","Dòng trống nằm giữa vùng dữ liệu",
        "Dòng trống giữa bảng có thể làm vùng dữ liệu bị chia cắt hoặc gây nhầm khi xử lý thủ công.",
        ["Chuẩn hóa vùng dữ liệu","excel.html"])
    ].filter(x=>x.count>0);

    if(!issues.length){
      $("edIssues").innerHTML='<div class="ed-ok"><strong>Không phát hiện vấn đề phổ biến trong lần quét này.</strong><p>Điều này không đảm bảo workbook hoàn toàn đúng nghiệp vụ, nhưng các lỗi cấu trúc cơ bản đang khá sạch.</p></div>';
    }else{
      const icons={errors:"!",numericText:"123",duplicates:"≡",mixedColumns:"T/N",dateText:"📅",whitespace:"↔",blankRows:"—"};
      $("edIssues").innerHTML=issues.map(x=>
        '<article class="ed-issue '+escapeHtml(x.severity)+'">'+
          '<div class="ed-issue-icon">'+escapeHtml(icons[x.type]||"!")+'</div>'+
          '<div><h3>'+escapeHtml(x.title)+'</h3><p>'+escapeHtml(x.desc)+'</p>'+
          (x.details.length?'<div class="ed-issue-samples">'+escapeHtml(sample(x.details))+(x.count>x.details.slice(0,4).length?" · …":"")+'</div>':"")+
          '</div><span class="ed-issue-count">'+x.count+' phát hiện</span>'+
        '</article>'
      ).join("");
    }

    // Learning cards only for issues actually found; if clean, show advanced next steps.
    const learning=[];
    const seen=new Set();
    issues.forEach(x=>{
      const key=x.learn[1];
      if(seen.has(key)) return;
      seen.add(key);
      learning.push({title:x.learn[0],href:x.learn[1],from:x.title});
    });
    if(!learning.length){
      learning.push(
        {title:"Power Query nâng cao",href:"power-query-course.html",from:"Tiếp tục kiểm tra dữ liệu có hệ thống"},
        {title:"PivotTable",href:"pivottable.html",from:"Tổng hợp dữ liệu đã làm sạch"},
        {title:"Practice Hub",href:"practice-video.html",from:"Luyện thêm với file thực hành"}
      );
    }
    $("edLearningGrid").innerHTML=learning.slice(0,6).map(x=>
      '<a class="ed-learn-card" href="'+escapeHtml(x.href)+'"><span>HỌC TIẾP</span><strong>'+escapeHtml(x.title)+'</strong><small>Liên quan: '+escapeHtml(x.from)+'</small><b>Mở nội dung →</b></a>'
    ).join("");

    report.hidden=false;
    report.scrollIntoView({behavior:"smooth",block:"start"});
  }

  async function analyzeFile(file){
    if(!file) return;
    if(typeof XLSX==="undefined"){
      alert("Chưa tải được bộ đọc Excel. Hãy kiểm tra kết nối mạng rồi thử lại.");
      return;
    }
    if(file.size>40*1024*1024){
      alert("File lớn hơn 40 MB. Bản Excel Doctor hiện tại ưu tiên file nhỏ hơn để tránh trình duyệt bị nặng.");
      return;
    }

    showStatus("Đang đọc workbook",file.name);
    try{
      const buf=await file.arrayBuffer();
      $("edStatusTitle").textContent="Đang quét dữ liệu";
      $("edStatusText").textContent="Kiểm tra sheet, kiểu dữ liệu, lỗi và dòng trùng…";

      // Yield once so the status UI can paint.
      await new Promise(r=>setTimeout(r,40));

      const wb=XLSX.read(buf,{type:"array",cellDates:true,cellFormula:true,cellNF:true,cellText:true});
      const sheetResults=[];
      wb.SheetNames.forEach(name=>{
        const ws=wb.Sheets[name];
        if(ws) sheetResults.push(analyzeSheet(ws,name));
      });

      hideStatus();
      render(file.name,wb,sheetResults);
    }catch(err){
      console.error("[Excel Doctor]",err);
      hideStatus();
      alert("Không đọc được file Excel này.\n\n"+(err && err.message ? err.message : "Lỗi không xác định"));
    }
  }

  choose.addEventListener("click",()=>fileInput.click());
  fileInput.addEventListener("change",()=>analyzeFile(fileInput.files&&fileInput.files[0]));

  ["dragenter","dragover"].forEach(type=>drop.addEventListener(type,e=>{
    e.preventDefault();e.stopPropagation();drop.classList.add("is-drag");
  }));
  ["dragleave","drop"].forEach(type=>drop.addEventListener(type,e=>{
    e.preventDefault();e.stopPropagation();drop.classList.remove("is-drag");
  }));
  drop.addEventListener("drop",e=>{
    const file=e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0];
    if(file) analyzeFile(file);
  });

  $("edScanAnother").addEventListener("click",()=>{
    report.hidden=true;
    fileInput.value="";
    drop.scrollIntoView({behavior:"smooth",block:"center"});
    setTimeout(()=>fileInput.click(),250);
  });
})();