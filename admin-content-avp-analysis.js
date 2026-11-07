(() => {
  const videos = [
    {n:1,title:"Pareto Analysis trong Excel: Tìm 20% nguyên nhân tạo ra 80% kết quả",date:"07/10/2026",time:"19:00",views:"115K",likes:"5,652",comments:"16"},
    {n:2,title:"Trend Analysis trong Excel: Đừng chỉ nhìn doanh thu",date:"08/10/2026",time:"19:00",views:"2.2M",likes:"146K",comments:"363"},
    {n:3,title:"Variance Analysis trong Excel: Phân tích chênh lệch giữa Target và thực tế",date:"09/10/2026",time:"19:00",views:"174K",likes:"6,349",comments:"26"},
    {n:4,title:"Contribution Analysis trong Excel: Tìm ra yếu tố đóng góp vào tăng trưởng",date:"10/10/2026",time:"19:00",views:"21K",likes:"918",comments:"14"},
    {n:5,title:"MoM & YoY trong Excel: Doanh thu tăng hay đang giảm?",date:"11/10/2026",time:"19:04",views:"13K",likes:"494",comments:"11"},
    {n:6,title:"ABC Analysis: Phân loại sản phẩm cần được ưu tiên",date:"12/10/2026",time:"19:12",views:"8,929",likes:"394",comments:"4"},
    {n:7,title:"Break-even Analysis trong Excel: Xác định doanh thu hòa vốn",date:"13/10/2026",time:"19:00",views:"26K",likes:"1,304",comments:"5"},
    {n:8,title:"Root Cause Analysis: Phân tích nguyên nhân gốc rễ",date:"15/10/2026",time:"19:05",views:"100K",likes:"3,225",comments:"77"},
    {n:9,title:"Phân tích RFM bằng Excel: Tìm khách hàng cần giữ chân",date:"16/10/2026",time:"19:15",views:"13K",likes:"590",comments:"3"},
    {n:10,title:"Inventory Analysis trong Excel: Phân tích tồn kho",date:"18/10/2026",time:"21:29",views:"134K",likes:"8,993",comments:"32"},
    {n:11,title:"Cycle Time Analysis trong Excel: Tìm công đoạn nghẽn",date:"19/10/2026",time:"19:29",views:"17K",likes:"625",comments:"16"},
    {n:12,title:"Pareto giúp ưu tiên lỗi cần xử lý trong xưởng",date:"21/10/2026",time:"07:09",views:"2,545",likes:"60",comments:"1"},
    {n:13,title:"Workforce Analysis: Phân tích cân đối nhân lực",date:"21/10/2026",time:"19:17",views:"17K",likes:"541",comments:"6"},
    {n:14,title:"Forecast Accuracy Analysis trong Excel: Tháng nào dự báo sai nhiều?",date:"23/10/2026",time:"19:27",views:"10K",likes:"373",comments:"4"},
    {n:15,title:"Overtime Analysis trong Excel: Tăng ca nhiều, sản lượng vẫn thấp",date:"25/10/2026",time:"11:26",views:"36K",likes:"1,037",comments:"18"},
    {n:16,title:"Excel Data Analysis - Sales Forecast Trend: Dự báo doanh số",date:"26/10/2026",time:"19:50",views:"9,619",likes:"382",comments:"4"},
    {n:17,title:"Sales Performance Analysis trong Excel: Doanh thu giảm",date:"29/10/2026",time:"19:30",views:"6,022",likes:"232",comments:"5"},
    {n:18,title:"Excel Analysis: Capacity Utilization - Vì sao dư máy, dư người",date:"30/10/2026",time:"21:07",views:"25K",likes:"1,059",comments:"14"},
    {n:19,title:"Production Progress & WIP Analysis: Phân tích tiến độ sản xuất",date:"01/11/2026",time:"22:16",views:"23K",likes:"679",comments:"21"},
    {n:20,title:"Production Capacity & What-if Analysis: Phân tích năng lực sản xuất",date:"03/11/2026",time:"22:56",views:"25K",likes:"830",comments:"11"},
    {n:21,title:"Quality Analysis trong Excel: Vì sao tỷ lệ lỗi sản xuất ngày càng tăng?",date:"06/11/2026",time:"20:19",views:"2,383",likes:"94",comments:"4"}
  ];

  const esc = v => String(v ?? "").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const number = v => { const x=String(v).replace(/,/g,"").trim().toUpperCase(); const m=x.match(/^([\d.]+)(K|M)?$/); return m ? Number(m[1])*(m[2]==="K"?1000:m[2]==="M"?1000000:1) : 0; };
  const fmt = n => new Intl.NumberFormat("vi-VN",{maximumFractionDigits:1}).format(n);
  const storeKey="avp.analysis.checkpoints.v1";
  const read = () => { try{return JSON.parse(localStorage.getItem(storeKey)||"[]")}catch{return []} };
  const write = rows => localStorage.setItem(storeKey,JSON.stringify(rows));
  const init = () => {
    const panel=document.getElementById("avpContentPanel"), grid=panel?.querySelector(".avp-category-grid"), view=document.getElementById("avpAnalysisView"), rows=document.getElementById("avpAnalysisRows");
    if(!panel||!grid||!view||!rows||panel.dataset.analysisBound==="1") return;
    panel.dataset.analysisBound="1";
    const open=()=>{grid.hidden=true;panel.querySelector(".avp-folder-heading").hidden=true;view.hidden=false;};
    const back=()=>{view.hidden=true;grid.hidden=false;panel.querySelector(".avp-folder-heading").hidden=false;};
    panel.querySelector('[data-avp-category="analysis"]')?.addEventListener("click",open);
    document.getElementById("avpAnalysisBack")?.addEventListener("click",back);
    rows.innerHTML=videos.map(v=>`<tr><td>${v.n}</td><td class="avp-analysis-name">${esc(v.title)}<small>${v.time}</small></td><td>${v.date}</td><td>${v.views}</td><td>${v.likes}</td><td>${v.comments}</td></tr>`).join("");
    const tabs=[...view.querySelectorAll("[data-analysis-tab]")], panes=[...view.querySelectorAll("[data-analysis-pane]")];
    const activate=name=>{tabs.forEach(t=>t.classList.toggle("is-active",t.dataset.analysisTab===name));panes.forEach(p=>{const on=p.dataset.analysisPane===name;p.hidden=!on;p.classList.toggle("is-active",on)}); if(name==="checkpoint")renderCheckpoints(); if(name==="performance")renderPerformance(); if(name==="trends")renderTrends(); if(name==="nextcase")renderNextCases();};
    tabs.forEach(t=>t.addEventListener("click",()=>activate(t.dataset.analysisTab)));
    const select=document.getElementById("avpCheckpointVideo");
    select.innerHTML=videos.map(v=>`<option value="${v.n}">#${v.n} · ${esc(v.title)}</option>`).join("");
    const form=document.getElementById("avpCheckpointForm"), imageInput=document.getElementById("avpCheckpointImage"), preview=document.getElementById("avpCheckpointPreview");
    imageInput?.addEventListener("change",()=>{const file=imageInput.files?.[0];preview.hidden=!file;preview.textContent=file?`Đã chọn ảnh: ${file.name}. Hãy đọc số liệu trên ảnh và nhập vào các ô bên trên.`:"";});
    form?.addEventListener("submit",e=>{e.preventDefault();const item={id:Date.now(),video:Number(select.value),capturedAt:document.getElementById("avpCheckpointAt").value,views:Number(document.getElementById("avpCheckpointViews").value),likes:Number(document.getElementById("avpCheckpointLikes").value),comments:Number(document.getElementById("avpCheckpointComments").value),imageName:imageInput.files?.[0]?.name||""};const saved=read();saved.push(item);write(saved);form.reset();preview.hidden=true;preview.textContent="";renderCheckpoints();});
    function renderCheckpoints(){const target=document.getElementById("avpCheckpointRows"),saved=read().sort((a,b)=>b.id-a.id);target.innerHTML=saved.length?saved.map(x=>{const v=videos.find(y=>y.n===x.video);return `<article class="avp-checkpoint-row"><strong>#${x.video} · ${esc(v?.title||"Video")}</strong><span>${esc(x.capturedAt.replace("T"," "))}</span><span>Views ${fmt(x.views)} · Likes ${fmt(x.likes)} · CMT ${fmt(x.comments)}</span></article>`}).join(""):'<p class="avp-empty-state">Chưa có checkpoint. Chọn video và nhập số liệu sau 1 ngày đăng.</p>';}
    function renderPerformance(){const data=videos.map(v=>({...v,vv:number(v.views),ll:number(v.likes),cc:number(v.comments)}));const totalViews=data.reduce((a,v)=>a+v.vv,0),totalLikes=data.reduce((a,v)=>a+v.ll,0),totalComments=data.reduce((a,v)=>a+v.cc,0);document.getElementById("avpPerformanceMetrics").innerHTML=[["Tổng lượt xem",fmt(totalViews)],["Tổng lượt thích",fmt(totalLikes)],["Tổng bình luận",fmt(totalComments)]].map(x=>`<article><small>${x[0]}</small><strong>${x[1]}</strong></article>`).join("");document.getElementById("avpPerformanceRows").innerHTML=data.map(v=>`<tr><td class="avp-analysis-name">${esc(v.title)}</td><td>${fmt(v.vv)}</td><td>${fmt(v.ll)}</td><td>${v.vv?(v.ll/v.vv*100).toFixed(2)+"%":"—"}</td><td>${fmt(v.cc)}</td><td>${v.vv?(v.cc/v.vv*100).toFixed(3)+"%":"—"}</td></tr>`).join("");}
    function renderTrends(){const d=videos.map(v=>({...v,vv:number(v.views),ll:number(v.likes),cc:number(v.comments)}));const sorted=[...d].sort((a,b)=>b.vv-a.vv),likeSorted=[...d].sort((a,b)=>(b.ll/b.vv)-(a.ll/a.vv)),commentSorted=[...d].sort((a,b)=>b.cc-a.cc);document.getElementById("avpTrendSummary").innerHTML=`<article><small>Video nhiều lượt xem nhất</small><strong>${esc(sorted[0].title)}</strong><b>${sorted[0].views} views</b></article><article><small>Like rate cao nhất</small><strong>${esc(likeSorted[0].title)}</strong><b>${(likeSorted[0].ll/likeSorted[0].vv*100).toFixed(2)}%</b></article><article><small>Bình luận nhiều nhất</small><strong>${esc(commentSorted[0].title)}</strong><b>${commentSorted[0].comments} comments</b></article>`;document.getElementById("avpTrendRows").innerHTML=`<tr><td>Phân tích xu hướng</td><td>Trend Analysis (2.2M) và Variance Analysis (174K) nổi bật về lượt xem; Inventory (134K) và Root Cause (100K) cũng vượt phần lớn danh sách.</td><td>Các case có góc nhìn kinh doanh rõ hoặc vấn đề vận hành/chất lượng cụ thể đáng được nghiên cứu tiếp.</td></tr><tr><td>Độ sâu tương tác</td><td>Inventory có 8,993 likes; Root Cause có 77 comments. Đây là tín hiệu tương tác đáng chú ý, không chỉ lượt xem.</td><td>Nên tiếp tục thử case có vấn đề rõ, có tranh luận hoặc quyết định quản lý.</td></tr><tr><td>Chủ đề ít tín hiệu hơn</td><td>Sales Performance, Forecast Accuracy, Quality Analysis hiện có lượt xem thấp hơn nhóm nổi bật.</td><td>Không kết luận chủ đề kém; cần checkpoint cùng mốc 24 giờ để so sánh công bằng.</td></tr>`;}
    function renderNextCases(){const list=[{title:"Bottleneck Analysis",why:"Nối tiếp Cycle Time, Capacity Utilization và Production Progress; tập trung tìm công đoạn giới hạn sản lượng."},{title:"Defect Cost Analysis",why:"Mở rộng Root Cause và Quality Analysis từ đếm lỗi sang chi phí chất lượng và mức độ ưu tiên xử lý."},{title:"Inventory Aging & Slow-moving",why:"Phát triển từ Inventory Analysis sang hàng tồn lâu, tồn chậm và vốn bị giữ."}];document.getElementById("avpNextCaseList").innerHTML=list.map((x,i)=>`<article><small>GỢI Ý ${i+1}</small><h4>${x.title}</h4><p>${x.why}</p></article>`).join("");}
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
