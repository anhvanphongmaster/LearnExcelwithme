(() => {
  const $=id=>document.getElementById(id);
  const nf=new Intl.NumberFormat("vi-VN");
  let client=null;
  let currentDays=30;

  async function waitForClient(timeout=3500){
    const start=Date.now();
    while(Date.now()-start<timeout){
      if(window.avpSupabase) return window.avpSupabase;
      if(window.AVP_SUPABASE_CONFIGURED===false) return null;
      await new Promise(r=>setTimeout(r,80));
    }
    return window.avpSupabase || null;
  }

  function toast(text){
    const el=$("adminToast");
    if(!el) return;
    el.textContent=text;
    el.classList.add("show");
    setTimeout(()=>el.classList.remove("show"),1800);
  }

  function showDenied(message="Không có quyền Admin."){
    $("adminGate").hidden=true;
    $("adminDashboard").hidden=true;
    $("adminDenied").hidden=false;
    const p=$("adminDenied").querySelector("p");
    if(p && message) p.textContent=message;
  }

  function n(v){return nf.format(Number(v)||0)}

  function renderSummary(s){
    $("kpiRegistered").textContent=n(s.registered_users);
    $("kpiNewUsers").textContent=`+${n(s.new_users_period)} tài khoản trong kỳ`;
    $("kpiViews").textContent=n(s.page_views);
    $("kpiTodayViews").textContent=`${n(s.today_page_views)} hôm nay`;
    $("kpiVisitors").textContent=n(s.unique_visitors);
    $("kpiTodayVisitors").textContent=`${n(s.today_unique_visitors)} hôm nay`;
    $("kpiActiveUsers").textContent=n(s.active_logged_in_users);
    $("kpiLogins").textContent=`${n(s.login_events)} lượt login`;
    $("kpiMobileUsers").textContent=n(s.excel_mobile_visitors);
    $("kpiToolRuns").textContent=n(s.excel_tool_runs);
  }

  function renderTrend(rows){
    const root=$("trendChart");
    if(!rows?.length){
      root.innerHTML='<p class="admin-empty">Chưa có dữ liệu.</p>';
      return;
    }

    const max=Math.max(1,...rows.flatMap(r=>[
      Number(r.page_views)||0,
      Number(r.unique_visitors)||0,
      Number(r.tool_runs)||0
    ]));

    root.innerHTML=rows.map(r=>{
      const date=new Date(`${r.day}T00:00:00`);
      const label=`${date.getDate()}/${date.getMonth()+1}`;
      const h1=Math.max(1,(Number(r.page_views)||0)/max*180);
      const h2=Math.max(1,(Number(r.unique_visitors)||0)/max*180);
      const h3=Math.max(1,(Number(r.tool_runs)||0)/max*180);

      return `<div class="admin-day" title="${r.day}: ${r.page_views} views, ${r.unique_visitors} visitors, ${r.tool_runs} tool runs">
        <div class="admin-day-bars">
          <span class="admin-bar" style="height:${h1}px"></span>
          <span class="admin-bar visitors" style="height:${h2}px"></span>
          <span class="admin-bar tools" style="height:${h3}px"></span>
        </div>
        <span class="admin-day-label">${label}</span>
      </div>`;
    }).join("");
  }

  function renderRanking(id,rows,labelKey,valueKey){
    const root=$(id);
    if(!rows?.length){
      root.innerHTML='<p class="admin-empty">Chưa có dữ liệu.</p>';
      return;
    }

    const max=Math.max(1,...rows.map(r=>Number(r[valueKey])||0));

    root.innerHTML=rows.map((r,i)=>{
      const val=Number(r[valueKey])||0;
      const pct=Math.max(2,val/max*100);
      const label=String(r[labelKey]||"(không xác định)");
      return `<div class="admin-rank-row">
        <span class="admin-rank-label" title="${label.replaceAll('"','&quot;')}">${i+1}. ${label}</span>
        <span class="admin-rank-track"><span class="admin-rank-fill" style="width:${pct}%"></span></span>
        <span class="admin-rank-value">${n(val)}</span>
      </div>`;
    }).join("");
  }

  async function rpc(name,args){
    const {data,error}=await client.rpc(name,args);
    if(error) throw error;
    return data;
  }

  async function loadDashboard(){
    try{
      $("adminRefresh").disabled=true;

      const [summary,trend,tools,pages]=await Promise.all([
        rpc("admin_analytics_summary",{p_days:currentDays}),
        rpc("admin_analytics_trend",{p_days:Math.min(currentDays,90)}),
        rpc("admin_analytics_top_tools",{p_days:currentDays,p_limit:10}),
        rpc("admin_analytics_top_pages",{p_days:currentDays,p_limit:10})
      ]);

      renderSummary(summary||{});
      renderTrend(trend||[]);
      renderRanking("topTools",tools||[],"tool_name","uses");
      renderRanking("topPages",pages||[],"page_path","views");

      $("adminGate").hidden=true;
      $("adminDenied").hidden=true;
      $("adminDashboard").hidden=false;
    }catch(error){
      console.error(error);

      const msg=String(error?.message||"");
      if(
        /admin access required|permission|not authenticated|JWT/i.test(msg)
      ){
        showDenied("Tài khoản hiện tại chưa được cấp quyền Admin.");
      }else if(/function .* does not exist|Could not find the function|schema cache/i.test(msg)){
        showDenied("Chưa cài Analytics SQL. Hãy chạy file analytics-setup.sql trong Supabase SQL Editor.");
      }else{
        showDenied(`Không tải được Analytics: ${msg || "Lỗi không xác định"}`);
      }
    }finally{
      $("adminRefresh").disabled=false;
    }
  }

  async function init(){
    client=await waitForClient();

    if(!client){
      showDenied("Supabase chưa được cấu hình hoặc API key chưa hoạt động.");
      return;
    }

    const {data}=await client.auth.getSession();
    if(!data?.session?.user){
      showDenied("Bạn chưa đăng nhập. Hãy đăng nhập bằng tài khoản Admin.");
      return;
    }

    loadDashboard();
  }

  $("adminPeriod")?.addEventListener("change",()=>{
    currentDays=Number($("adminPeriod").value)||30;
    loadDashboard();
  });

  $("adminRefresh")?.addEventListener("click",()=>{
    loadDashboard();
    toast("Đang làm mới dữ liệu...");
  });

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",init,{once:true});
  }else{
    init();
  }
})();
