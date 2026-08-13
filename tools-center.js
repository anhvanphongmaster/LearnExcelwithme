
(() => {
function $(id){return document.getElementById(id)}
function num(v){const n=Number(String(v).replace(",", "."));return Number.isFinite(n)?n:null}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m]))}

document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll(".tools-tab").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".tools-tab").forEach(b=>b.classList.remove("active"));
      document.querySelectorAll(".tool-panel").forEach(p=>p.classList.remove("active"));
      btn.classList.add("active");
      $(btn.dataset.target)?.classList.add("active");
    });
  });

  $("ngCalcBtn")?.addEventListener("click",()=>{
    const input=num($("ngInput").value), ng=num($("ngQty").value);
    if(input===null||ng===null||input<=0||ng<0){$("ngResult").textContent="Vui lòng nhập Input > 0 và NG ≥ 0.";return}
    const rate=ng/input*100;
    $("ngResult").innerHTML=`<strong>NG Rate = ${rate.toFixed(2)}%</strong>\nGood Qty = ${(input-ng).toLocaleString("vi-VN")}`;
  });

  $("formulaBuildBtn")?.addEventListener("click",()=>{
    const type=$("formulaType").value;
    const range=$("formulaRange").value.trim()||"A:A";
    const criteria=$("formulaCriteria").value.trim()||"OK";
    const sumRange=$("formulaSumRange").value.trim()||"B:B";
    let f="";
    if(type==="COUNTIF") f=`=COUNTIF(${range},"${criteria}")`;
    if(type==="SUMIF") f=`=SUMIF(${range},"${criteria}",${sumRange})`;
    if(type==="COUNTIFS") f=`=COUNTIFS(${range},"${criteria}",${sumRange},">0")`;
    if(type==="SUMIFS") f=`=SUMIFS(${sumRange},${range},"${criteria}")`;
    if(type==="XLOOKUP") f=`=XLOOKUP("${criteria}",${range},${sumRange},"Không tìm thấy")`;
    if(type==="VLOOKUP") f=`=VLOOKUP("${criteria}",${range},2,FALSE)`;
    $("formulaResult").textContent=f;
  });

  $("cleanBtn")?.addEventListener("click",()=>{
    let t=$("cleanInput").value;
    t=t.replace(/\r/g,"").split("\n").map(x=>x.trim().replace(/\s+/g," ")).filter(Boolean);
    if($("cleanUpper").checked) t=t.map(x=>x.toUpperCase());
    if($("cleanUnique").checked) t=[...new Set(t)];
    $("cleanResult").textContent=t.join("\n");
  });

  $("dateCalcBtn")?.addEventListener("click",()=>{
    const a=new Date($("dateA").value+"T00:00:00"), b=new Date($("dateB").value+"T00:00:00");
    if(isNaN(a)||isNaN(b)){$("dateResult").textContent="Hãy chọn đủ 2 ngày.";return}
    const days=Math.round((b-a)/86400000);
    $("dateResult").innerHTML=`<strong>Chênh lệch: ${days} ngày</strong>\nTương đương ${(days/7).toFixed(1)} tuần.`;
  });

  $("paretoBtn")?.addEventListener("click",()=>{
    const lines=$("paretoInput").value.split("\n").map(x=>x.trim()).filter(Boolean);
    let rows=[];
    for(const line of lines){
      const parts=line.split(/[,;\t]/).map(x=>x.trim());
      if(parts.length<2) continue;
      const q=num(parts[1]); if(q===null) continue;
      rows.push({name:parts[0],qty:q});
    }
    if(!rows.length){$("paretoResult").textContent="Nhập dữ liệu dạng: Scratch, 25";return}
    rows.sort((a,b)=>b.qty-a.qty);
    const total=rows.reduce((s,r)=>s+r.qty,0);
    let cum=0;
    let html='<table class="pareto-table"><thead><tr><th>Lỗi</th><th>Qty</th><th>%</th><th>% tích lũy</th></tr></thead><tbody>';
    rows.forEach(r=>{
      const pct=r.qty/total*100; cum+=pct;
      html+=`<tr><td>${esc(r.name)}<div class="pareto-bar"><span style="width:${pct.toFixed(2)}%"></span></div></td><td>${r.qty}</td><td>${pct.toFixed(1)}%</td><td>${cum.toFixed(1)}%</td></tr>`;
    });
    html+='</tbody></table>';
    $("paretoResult").innerHTML=html;
  });
});
})();
