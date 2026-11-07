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
  const esc = value => String(value).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const init = () => {
    const panel = document.getElementById("avpContentPanel");
    const grid = panel?.querySelector(".avp-category-grid");
    const view = document.getElementById("avpAnalysisView");
    const rows = document.getElementById("avpAnalysisRows");
    if (!panel || !grid || !view || !rows || panel.dataset.analysisBound === "1") return;
    panel.dataset.analysisBound = "1";
    rows.innerHTML = videos.map(v => `<tr><td>${v.n}</td><td class="avp-analysis-name">${esc(v.title)}<small>${v.time}</small></td><td>${v.date}</td><td>${v.views}</td><td>${v.likes}</td><td>${v.comments}</td></tr>`).join("");
    const open = () => { grid.hidden = true; panel.querySelector(".avp-folder-heading").hidden = true; view.hidden = false; };
    const back = () => { view.hidden = true; grid.hidden = false; panel.querySelector(".avp-folder-heading").hidden = false; };
    panel.querySelector('[data-avp-category="analysis"]')?.addEventListener("click", open);
    document.getElementById("avpAnalysisBack")?.addEventListener("click", back);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();
