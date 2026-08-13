
(() => {
const STORAGE_KEY="avpQcDashboardData";
const $=id=>document.getElementById(id);
const n=v=>{const x=Number(String(v).replace(",","."));return Number.isFinite(x)?x:0};
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

function parseRows(text){
  return text.split("\n").map(x=>x.trim()).filter(Boolean).map(line=>{
    const p=line.split(/[,;\t]/).map(x=>x.trim());
    return {
      lot:p[0]||"",
      input:n(p[1]),
      ng:n(p[2]),
      defect:p[3]||"Khác"
    };
  }).filter(r=>r.lot && r.input>0 && r.ng>=0);
}

function save(rows){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(rows));
}

function load(){
  try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]")}catch{return[]}
}

function calc(rows){
  const totalInput=rows.reduce((s,r)=>s+r.input,0);
  const totalNg=rows.reduce((s,r)=>s+r.ng,0);
  const ngRate=totalInput?totalNg/totalInput*100:0;
  const good=totalInput-totalNg;

  const defectMap={};
  rows.forEach(r=>{ defectMap[r.defect]=(defectMap[r.defect]||0)+r.ng; });
  const defects=Object.entries(defectMap).map(([name,qty])=>({name,qty})).sort((a,b)=>b.qty-a.qty);

  return {totalInput,totalNg,ngRate,good,defects};
}

function render(rows){
  const {totalInput,totalNg,ngRate,good,defects}=calc(rows);
  $("kpiLots").textContent=rows.length;
  $("kpiInput").textContent=totalInput.toLocaleString("vi-VN");
  $("kpiNg").textContent=totalNg.toLocaleString("vi-VN");
  $("kpiRate").textContent=ngRate.toFixed(2)+"%";

  const table=$("qcLotTable");
  if(!rows.length){
    table.innerHTML='<div class="qc-empty">Chưa có dữ liệu. Nhập dữ liệu bên trái rồi bấm “Tạo Dashboard”.</div>';
  }else{
    table.innerHTML=`<table class="qc-table"><thead><tr><th>Lot</th><th>Input</th><th>NG</th><th>NG Rate</th><th>Defect</th></tr></thead><tbody>`+
      rows.map(r=>`<tr><td>${esc(r.lot)}</td><td>${r.input.toLocaleString("vi-VN")}</td><td>${r.ng.toLocaleString("vi-VN")}</td><td>${(r.ng/r.input*100).toFixed(2)}%</td><td>${esc(r.defect)}</td></tr>`).join("")+
      `</tbody></table>`;
  }

  const chart=$("qcChart");
  if(rows.length){
    const max=Math.max(...rows.map(r=>r.ng),1);
    chart.innerHTML=rows.map(r=>{
      const h=Math.max(2,r.ng/max*100);
      return `<div class="qc-bar-wrap" title="${esc(r.lot)}: NG ${r.ng}">
        <div class="qc-bar" style="height:${h}%"></div>
        <div class="qc-bar-label">${esc(r.lot)}</div>
      </div>`;
    }).join("");
  }else chart.innerHTML="";

  const pareto=$("qcPareto");
  if(defects.length){
    const total=defects.reduce((s,d)=>s+d.qty,0)||1;
    let cum=0;
    pareto.innerHTML=defects.map(d=>{
      const pct=d.qty/total*100; cum+=pct;
      return `<div class="qc-pareto-row">
        <div>${esc(d.name)}<div class="qc-mini-bar"><span style="width:${pct.toFixed(1)}%"></span></div></div>
        <div>${d.qty}</div><div>${pct.toFixed(1)}%</div><div>${cum.toFixed(1)}%</div>
      </div>`;
    }).join("");
  }else pareto.innerHTML='<div class="qc-empty">Chưa có dữ liệu Pareto.</div>';

  $("qcSummary").innerHTML = rows.length
    ? `<strong>Tóm tắt:</strong> ${rows.length} lot • Good ${good.toLocaleString("vi-VN")} • NG ${totalNg.toLocaleString("vi-VN")} • NG Rate ${ngRate.toFixed(2)}%`
    : "Chưa có dữ liệu.";
}

function toCSV(rows){
  const header=["Lot","Input","NG","NG Rate","Defect"];
  const body=rows.map(r=>[r.lot,r.input,r.ng,(r.ng/r.input*100).toFixed(2)+"%",r.defect]);
  return [header,...body].map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
}

document.addEventListener("DOMContentLoaded",()=>{
  const saved=load();
  if(saved.length){
    $("qcData").value=saved.map(r=>`${r.lot}, ${r.input}, ${r.ng}, ${r.defect}`).join("\n");
    render(saved);
  }else render([]);

  $("qcGenerate")?.addEventListener("click",()=>{
    const rows=parseRows($("qcData").value);
    save(rows);
    render(rows);
  });

  $("qcDemo")?.addEventListener("click",()=>{
    const demo=[
      "LOT001, 1200, 18, Scratch",
      "LOT002, 980, 11, Open",
      "LOT003, 1500, 26, Scratch",
      "LOT004, 1100, 7, Short",
      "LOT005, 1320, 15, Open",
      "LOT006, 900, 5, Contamination"
    ].join("\n");
    $("qcData").value=demo;
    const rows=parseRows(demo); save(rows); render(rows);
  });

  $("qcClear")?.addEventListener("click",()=>{
    localStorage.removeItem(STORAGE_KEY);
    $("qcData").value="";
    render([]);
  });

  $("qcExport")?.addEventListener("click",()=>{
    const rows=load();
    if(!rows.length){alert("Chưa có dữ liệu để xuất.");return;}
    const blob=new Blob(["\ufeff"+toCSV(rows)],{type:"text/csv;charset=utf-8"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="qc-dashboard-data.csv";
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),500);
  });
});
})();


(() => {
const PRO_KEY="avpQcDashboardProSettings";
const q=id=>document.getElementById(id);

function getRows(){
  try{return JSON.parse(localStorage.getItem("avpQcDashboardData")||"[]")}catch{return[]}
}
function getSettings(){
  try{return JSON.parse(localStorage.getItem(PRO_KEY)||"{}")}catch{return{}}
}
function saveSettings(s){localStorage.setItem(PRO_KEY,JSON.stringify(s))}
function fmt(n){return Number(n||0).toLocaleString("vi-VN")}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}

function filteredRows(){
  const rows=getRows();
  const lot=(q("qcFilterLot")?.value||"").trim().toLowerCase();
  const defect=(q("qcFilterDefect")?.value||"").trim().toLowerCase();
  return rows.filter(r=>{
    const lotOk=!lot || String(r.lot).toLowerCase().includes(lot);
    const defectOk=!defect || String(r.defect).toLowerCase().includes(defect);
    return lotOk && defectOk;
  });
}

function calc(rows){
  const totalInput=rows.reduce((s,r)=>s+Number(r.input||0),0);
  const totalNg=rows.reduce((s,r)=>s+Number(r.ng||0),0);
  const rate=totalInput?totalNg/totalInput*100:0;
  const map={};
  rows.forEach(r=>map[r.defect]=(map[r.defect]||0)+Number(r.ng||0));
  const defects=Object.entries(map).map(([name,qty])=>({name,qty})).sort((a,b)=>b.qty-a.qty);
  return {totalInput,totalNg,rate,defects};
}

function renderPro(){
  const rows=filteredRows();
  const spec=parseFloat(q("qcSpec")?.value||"1") || 1;
  const chartType=q("qcChartType")?.value||"bar";
  const {totalInput,totalNg,rate,defects}=calc(rows);

  if(q("kpiLots")) q("kpiLots").textContent=rows.length;
  if(q("kpiInput")) q("kpiInput").textContent=fmt(totalInput);
  if(q("kpiNg")) q("kpiNg").textContent=fmt(totalNg);
  if(q("kpiRate")) q("kpiRate").textContent=rate.toFixed(2)+"%";

  const alert=q("qcSpecAlert");
  if(alert){
    const pass=rate<=spec;
    alert.className="qc-alert "+(pass?"ok":"warn");
    alert.innerHTML=pass
      ? `✅ Tổng NG Rate ${rate.toFixed(2)}% đang nằm trong Spec ≤ ${spec.toFixed(2)}%.`
      : `⚠️ Tổng NG Rate ${rate.toFixed(2)}% vượt Spec ≤ ${spec.toFixed(2)}%.`;
  }

  const table=q("qcLotTable");
  if(table){
    if(!rows.length) table.innerHTML='<div class="qc-empty">Không có Lot phù hợp bộ lọc.</div>';
    else table.innerHTML=`<table class="qc-table"><thead><tr><th>Lot</th><th>Input</th><th>NG</th><th>NG Rate</th><th>Defect</th><th>Status</th></tr></thead><tbody>`+
      rows.map(r=>{
        const rr=r.input?Number(r.ng)/Number(r.input)*100:0;
        const over=rr>spec;
        return `<tr class="${over?"over-spec":""}"><td>${esc(r.lot)}</td><td>${fmt(r.input)}</td><td>${fmt(r.ng)}</td><td>${rr.toFixed(2)}%</td><td>${esc(r.defect)}</td><td><span class="qc-badge ${over?"ng":"ok"}">${over?"OVER SPEC":"PASS"}</span></td></tr>`;
      }).join("")+`</tbody></table>`;
  }

  const top=q("qcTop5");
  if(top){
    top.innerHTML=defects.slice(0,5).map((d,i)=>`<div class="qc-top5-card"><span>#${i+1} ${esc(d.name)}</span><strong>${fmt(d.qty)}</strong><span>NG Qty</span></div>`).join("")
      || '<div class="qc-empty">Chưa có dữ liệu Top Defect.</div>';
  }

  const chart=q("qcChart");
  const line=q("qcLineChart");
  if(chart) chart.style.display=chartType==="bar"?"flex":"none";
  if(line) line.style.display=chartType==="line"?"block":"none";

  if(chartType==="bar" && chart){
    if(rows.length){
      const max=Math.max(...rows.map(r=>Number(r.ng||0)),1);
      chart.innerHTML=rows.map(r=>{
        const h=Math.max(2,Number(r.ng||0)/max*100);
        return `<div class="qc-bar-wrap" title="${esc(r.lot)}: NG ${r.ng}">
          <div class="qc-bar" style="height:${h}%"></div>
          <div class="qc-bar-label">${esc(r.lot)}</div>
        </div>`;
      }).join("");
    } else chart.innerHTML="";
  }

  if(chartType==="line" && line){
    if(!rows.length){line.innerHTML="";return}
    const w=900,h=180,pad=20;
    const vals=rows.map(r=>Number(r.input)?Number(r.ng)/Number(r.input)*100:0);
    const max=Math.max(...vals,spec,1);
    const pts=vals.map((v,i)=>{
      const x=pad+(rows.length===1?0:i*(w-pad*2)/(rows.length-1));
      const y=h-pad-(v/max)*(h-pad*2);
      return [x,y,v];
    });
    const poly=pts.map(p=>`${p[0]},${p[1]}`).join(" ");
    const specY=h-pad-(spec/max)*(h-pad*2);
    line.innerHTML=`<svg class="qc-line-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <line x1="${pad}" y1="${specY}" x2="${w-pad}" y2="${specY}" stroke="currentColor" stroke-dasharray="8 8" opacity=".45"/>
      <polyline fill="none" stroke="currentColor" stroke-width="4" points="${poly}" />
      ${pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="currentColor"><title>${p[2].toFixed(2)}%</title></circle>`).join("")}
    </svg><div class="qc-line-labels">${rows.map(r=>`<span>${esc(r.lot)}</span>`).join("")}</div>`;
  }

  const pareto=q("qcPareto");
  if(pareto){
    if(defects.length){
      const total=defects.reduce((s,d)=>s+d.qty,0)||1;
      let cum=0;
      pareto.innerHTML=defects.map(d=>{
        const pct=d.qty/total*100;cum+=pct;
        return `<div class="qc-pareto-row"><div>${esc(d.name)}<div class="qc-mini-bar"><span style="width:${pct.toFixed(1)}%"></span></div></div><div>${d.qty}</div><div>${pct.toFixed(1)}%</div><div>${cum.toFixed(1)}%</div></div>`;
      }).join("");
    } else pareto.innerHTML='<div class="qc-empty">Chưa có dữ liệu Pareto.</div>';
  }

  saveSettings({
    lot:q("qcFilterLot")?.value||"",
    defect:q("qcFilterDefect")?.value||"",
    spec:q("qcSpec")?.value||"1",
    chartType
  });
}

function exportSummary(){
  const rows=filteredRows();
  if(!rows.length){alert("Không có dữ liệu để xuất.");return;}
  const spec=parseFloat(q("qcSpec")?.value||"1")||1;
  const lines=[["Lot","Input","NG","NG Rate","Defect","Status"]];
  rows.forEach(r=>{
    const rr=Number(r.input)?Number(r.ng)/Number(r.input)*100:0;
    lines.push([r.lot,r.input,r.ng,rr.toFixed(2)+"%",r.defect,rr>spec?"OVER SPEC":"PASS"]);
  });
  const csv=lines.map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="qc-dashboard-report.csv"; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),500);
}

document.addEventListener("DOMContentLoaded",()=>{
  const s=getSettings();
  if(q("qcFilterLot")) q("qcFilterLot").value=s.lot||"";
  if(q("qcFilterDefect")) q("qcFilterDefect").value=s.defect||"";
  if(q("qcSpec")) q("qcSpec").value=s.spec||"1";
  if(q("qcChartType")) q("qcChartType").value=s.chartType||"bar";

  ["qcFilterLot","qcFilterDefect","qcSpec","qcChartType"].forEach(id=>{
    q(id)?.addEventListener(id==="qcSpec"?"input":"change",renderPro);
    if(id==="qcFilterLot"||id==="qcFilterDefect") q(id)?.addEventListener("input",renderPro);
  });
  q("qcExportPro")?.addEventListener("click",exportSummary);

  // Re-render after original buttons update storage.
  ["qcGenerate","qcDemo","qcClear"].forEach(id=>{
    q(id)?.addEventListener("click",()=>setTimeout(renderPro,0));
  });
  renderPro();
});
})();


/* ===== QC CSV / EXCEL IMPORT ===== */
(() => {
let importRows=[];
let importHeaders=[];

const el=id=>document.getElementById(id);
const norm=s=>String(s||"").trim().toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g,"");

function parseCSV(text){
  const lines=text.replace(/\r/g,"").split("\n").filter(x=>x.trim());
  if(!lines.length) return [];
  const sniff=lines[0];
  const delimiter=(sniff.match(/;/g)||[]).length>(sniff.match(/,/g)||[]).length?";":",";
  function parseLine(line){
    const out=[];let cur="",quote=false;
    for(let i=0;i<line.length;i++){
      const c=line[i];
      if(c==='"'){
        if(quote && line[i+1]==='"'){cur+='"';i++}
        else quote=!quote;
      }else if(c===delimiter && !quote){out.push(cur.trim());cur=""}
      else cur+=c;
    }
    out.push(cur.trim());
    return out;
  }
  const rows=lines.map(parseLine);
  const headers=rows[0];
  return rows.slice(1).map(r=>{
    const o={};headers.forEach((h,i)=>o[h]=r[i]??"");return o;
  });
}

function sheetToObjects(data){
  if(!window.XLSX) throw new Error("Thư viện đọc Excel chưa tải được. Hãy kiểm tra kết nối Internet hoặc lưu file thành CSV.");
  const wb=XLSX.read(data,{type:"array"});
  const ws=wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws,{defval:""});
}

function suggestIndex(headers, candidates){
  const hs=headers.map(norm);
  for(const c of candidates){
    const nc=norm(c);
    let i=hs.findIndex(h=>h===nc);
    if(i>=0) return i;
    i=hs.findIndex(h=>h.includes(nc));
    if(i>=0) return i;
  }
  return 0;
}

function populateMappings(){
  const selects=["mapLot","mapInput","mapNg","mapDefect"].map(el);
  selects.forEach(sel=>{
    sel.innerHTML=importHeaders.map((h,i)=>`<option value="${i}">${h}</option>`).join("");
  });
  const choices={
    mapLot:["lot","lot no","lotno","batch","ma lot"],
    mapInput:["input","input qty","qty input","total input","so luong input"],
    mapNg:["ng","ng qty","defect qty","reject","reject qty","so luong ng"],
    mapDefect:["defect","error","loi","defect name","failure"]
  };
  Object.entries(choices).forEach(([id,cands])=>{
    const s=el(id);if(s)s.selectedIndex=suggestIndex(importHeaders,cands);
  });
}

function preview(){
  const box=el("qcImportPreview");
  if(!box||!importRows.length) return;
  const sample=importRows.slice(0,8);
  box.innerHTML=`<table><thead><tr>${importHeaders.map(h=>`<th>${String(h)}</th>`).join("")}</tr></thead><tbody>`+
    sample.map(r=>`<tr>${importHeaders.map(h=>`<td>${String(r[h]??"")}</td>`).join("")}</tr>`).join("")+
    `</tbody></table>`;
}

async function readFile(file){
  if(!file) return;
  const ext=(file.name.split(".").pop()||"").toLowerCase();
  el("qcFileMeta").textContent=`${file.name} • ${(file.size/1024).toFixed(1)} KB`;

  try{
    if(ext==="csv"){
      const text=await file.text();
      importRows=parseCSV(text);
    }else if(ext==="xlsx"||ext==="xls"){
      const buf=await file.arrayBuffer();
      importRows=sheetToObjects(buf);
    }else{
      throw new Error("Định dạng file chưa được hỗ trợ.");
    }

    importHeaders=importRows.length?Object.keys(importRows[0]):[];
    if(!importRows.length||!importHeaders.length) throw new Error("Không đọc được dữ liệu trong file.");

    populateMappings();
    preview();
    el("qcMapArea").style.display="block";
  }catch(err){
    alert(err.message||"Không thể đọc file.");
    el("qcMapArea").style.display="none";
  }
}

function n(v){
  const s=String(v??"").trim().replace(/\s/g,"").replace(",",".");
  const x=Number(s); return Number.isFinite(x)?x:0;
}

function useImport(){
  if(!importRows.length) return;
  const idx={
    lot:Number(el("mapLot").value),
    input:Number(el("mapInput").value),
    ng:Number(el("mapNg").value),
    defect:Number(el("mapDefect").value)
  };
  const h={
    lot:importHeaders[idx.lot],input:importHeaders[idx.input],
    ng:importHeaders[idx.ng],defect:importHeaders[idx.defect]
  };
  const rows=importRows.map(r=>({
    lot:String(r[h.lot]??"").trim(),
    input:n(r[h.input]),
    ng:n(r[h.ng]),
    defect:String(r[h.defect]??"Khác").trim()||"Khác"
  })).filter(r=>r.lot&&r.input>0&&r.ng>=0);

  if(!rows.length){alert("Không có dòng hợp lệ sau khi map cột.");return}

  localStorage.setItem("avpQcDashboardData",JSON.stringify(rows));
  const textarea=el("qcData");
  if(textarea) textarea.value=rows.map(r=>`${r.lot}, ${r.input}, ${r.ng}, ${r.defect}`).join("\n");

  el("qcMapArea").style.display="none";
  alert(`Đã import ${rows.length} dòng vào Dashboard.`);
  location.reload();
}

document.addEventListener("DOMContentLoaded",()=>{
  const input=el("qcFileInput");
  const drop=el("qcDropZone");
  input?.addEventListener("change",()=>readFile(input.files?.[0]));
  drop?.addEventListener("dragover",e=>{e.preventDefault();drop.classList.add("drag")});
  drop?.addEventListener("dragleave",()=>drop.classList.remove("drag"));
  drop?.addEventListener("drop",e=>{
    e.preventDefault();drop.classList.remove("drag");
    const f=e.dataTransfer?.files?.[0];if(f)readFile(f);
  });
  el("qcUseImport")?.addEventListener("click",useImport);
  el("qcCancelImport")?.addEventListener("click",()=>{
    importRows=[];importHeaders=[];el("qcMapArea").style.display="none";
    if(input) input.value="";
    if(el("qcFileMeta")) el("qcFileMeta").textContent="";
  });
});
})();


/* ===== QC EXPORT XLSX ===== */
(() => {
const $=id=>document.getElementById(id);
function getRows(){
  try{return JSON.parse(localStorage.getItem("avpQcDashboardData")||"[]")}catch{return[]}
}
function getSpec(){
  const v=parseFloat($("qcSpec")?.value||"1");
  return Number.isFinite(v)?v:1;
}
function calc(rows){
  const totalInput=rows.reduce((s,r)=>s+Number(r.input||0),0);
  const totalNg=rows.reduce((s,r)=>s+Number(r.ng||0),0);
  const good=totalInput-totalNg;
  const ngRate=totalInput?totalNg/totalInput*100:0;
  const defectMap={};
  rows.forEach(r=>defectMap[r.defect]=(defectMap[r.defect]||0)+Number(r.ng||0));
  const defects=Object.entries(defectMap).map(([name,qty])=>({name,qty})).sort((a,b)=>b.qty-a.qty);
  return {totalInput,totalNg,good,ngRate,defects};
}

function exportXlsx(){
  const rows=getRows();
  if(!rows.length){alert("Chưa có dữ liệu QC để xuất Excel.");return;}
  if(!window.XLSX){alert("Thư viện Excel chưa tải được. Hãy kiểm tra kết nối Internet.");return;}

  const spec=getSpec();
  const {totalInput,totalNg,good,ngRate,defects}=calc(rows);

  const wb=XLSX.utils.book_new();

  // Raw Data
  const raw = rows.map((r,i)=>{
    const rate=Number(r.input)?Number(r.ng)/Number(r.input)*100:0;
    return {
      STT:i+1,
      Lot:r.lot,
      Input:Number(r.input||0),
      NG:Number(r.ng||0),
      "NG Rate (%)":Number(rate.toFixed(4)),
      Defect:r.defect,
      Status: rate>spec ? "OVER SPEC" : "PASS"
    };
  });
  const wsRaw=XLSX.utils.json_to_sheet(raw);
  wsRaw["!cols"]=[
    {wch:6},{wch:16},{wch:12},{wch:10},{wch:14},{wch:20},{wch:14}
  ];
  XLSX.utils.book_append_sheet(wb,wsRaw,"Raw Data");

  // KPI Summary
  const kpiRows=[
    ["QC KPI SUMMARY",""],
    ["Metric","Value"],
    ["Total Lots",rows.length],
    ["Total Input",totalInput],
    ["Total NG",totalNg],
    ["Good Qty",good],
    ["NG Rate (%)",Number(ngRate.toFixed(4))],
    ["Spec NG Rate (%)",spec],
    ["Overall Status",ngRate>spec?"OVER SPEC":"PASS"]
  ];
  const wsKpi=XLSX.utils.aoa_to_sheet(kpiRows);
  wsKpi["!cols"]=[{wch:24},{wch:18}];
  XLSX.utils.book_append_sheet(wb,wsKpi,"KPI Summary");

  // Top Defect
  const topRows=defects.map((d,i)=>({
    Rank:i+1,
    Defect:d.name,
    "NG Qty":d.qty,
    "Share (%)": totalNg ? Number((d.qty/totalNg*100).toFixed(2)) : 0
  }));
  const wsTop=XLSX.utils.json_to_sheet(topRows);
  wsTop["!cols"]=[{wch:8},{wch:22},{wch:12},{wch:14}];
  XLSX.utils.book_append_sheet(wb,wsTop,"Top Defect");

  // Pareto
  let cum=0;
  const paretoRows=defects.map(d=>{
    const pct=totalNg?d.qty/totalNg*100:0;
    cum+=pct;
    return {
      Defect:d.name,
      Qty:d.qty,
      "Percent (%)":Number(pct.toFixed(2)),
      "Cumulative (%)":Number(cum.toFixed(2))
    };
  });
  const wsPareto=XLSX.utils.json_to_sheet(paretoRows);
  wsPareto["!cols"]=[{wch:22},{wch:10},{wch:14},{wch:18}];
  XLSX.utils.book_append_sheet(wb,wsPareto,"Pareto");

  // Meta / Notes
  const metaRows=[
    ["Generated by","Learn Excecl with Anh Van Phong - QC Dashboard"],
    ["Generated at",new Date().toLocaleString("vi-VN")],
    ["Data source","Browser localStorage / imported CSV or Excel"],
    ["Note","File includes Raw Data, KPI Summary, Top Defect and Pareto."]
  ];
  const wsMeta=XLSX.utils.aoa_to_sheet(metaRows);
  wsMeta["!cols"]=[{wch:20},{wch:56}];
  XLSX.utils.book_append_sheet(wb,wsMeta,"Info");

  const now=new Date();
  const stamp=`${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}`;
  XLSX.writeFile(wb,`QC_Report_${stamp}.xlsx`);
}

document.addEventListener("DOMContentLoaded",()=>{
  $("qcExportXlsx")?.addEventListener("click",exportXlsx);
});
})();
