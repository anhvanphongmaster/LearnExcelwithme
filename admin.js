(() => {
  const $=id=>document.getElementById(id);
  const nf=new Intl.NumberFormat("vi-VN");
  let client=null;
  let currentDays=30;

  const lessonNames={
    "excel.html":"Excel cơ bản","phimtatexcel.html":"100 phím tắt","congthucexcel.html":"100 công thức","filtersort.html":"Filter & Sort",
    "pivottable.html":"PivotTable","bieudopareto.html":"Pareto","baocaoexcel.html":"Báo cáo Excel / QC",
    "excel-nang-cao.html":"Excel nâng cao","power-query-course.html":"Power Query","power-pivot-dax.html":"Power Pivot & DAX",
    "dashboard-dong.html":"Dashboard động","vba-macro.html":"VBA / Macro","solver-whatif.html":"What-If & Solver","practice-lab.html":"Practice Lab"
  };

  async function waitForClient(timeout=8000){
    const start=Date.now();
    while(Date.now()-start<timeout){
      if(window.avpSupabase) return window.avpSupabase;
      if(window.AVP_SUPABASE_CONFIGURED===false) return null;
      await new Promise(r=>setTimeout(r,100));
    }
    return window.avpSupabase || null;
  }
  async function waitForSession(client, timeout=8000){
    const start=Date.now();
    while(Date.now()-start<timeout){
      try{
        const {data}=await client.auth.getSession();
        if(data?.session?.user) return data.session;
      }catch(e){}
      await new Promise(r=>setTimeout(r,150));
    }
    try{
      const {data}=await client.auth.getSession();
      return data?.session || null;
    }catch(e){ return null; }
  }
  function toast(text){const el=$("adminToast");if(!el)return;el.textContent=text;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1800)}
  function showDenied(message="Không có quyền Admin."){ $("adminGate").hidden=true;$("adminDashboard").hidden=true;$("adminDenied").hidden=false;const p=$("adminDeniedMsg")||$("adminDenied").querySelector("p");if(p&&message)p.textContent=message; }
  function n(v){return nf.format(Number(v)||0)}
  function num(v){return Number(v)||0}
  function labelLesson(v){const key=String(v||"").split("?")[0].split("/").pop();return lessonNames[key]||key||"(không xác định)"}

  function renderSummary(s){
    $("kpiRegistered").textContent=n(s.registered_users);$("kpiNewUsers").textContent=`+${n(s.new_users_period)} tài khoản trong kỳ`;
    $("kpiViews").textContent=n(s.page_views);$("kpiTodayViews").textContent=`${n(s.today_page_views)} hôm nay`;
    $("kpiVisitors").textContent=n(s.unique_visitors);$("kpiTodayVisitors").textContent=`${n(s.today_unique_visitors)} hôm nay`;
    $("kpiActiveUsers").textContent=n(s.active_logged_in_users);$("kpiLogins").textContent=`${n(s.login_events)} lượt login`;
    $("kpiMobileUsers").textContent=n(s.excel_mobile_visitors);$("kpiToolRuns").textContent=n(s.excel_tool_runs);
  }
  function renderLearningSummary(s){
    $("learnSynced").textContent=n(s.synced_users);$("learnActive7d").textContent=`${n(s.active_progress_7d)} cập nhật trong 7 ngày`;
    $("learnAvgXP").textContent=n(s.avg_xp);$("learnMaxXP").textContent=`Cao nhất ${n(s.max_xp)} XP`;
    $("learnAvgQuiz").textContent=n(s.avg_quizzes);$("learnAvgBadges").textContent=n(s.avg_badges);
    $("learnPro").textContent=n(s.pro_plus);$("learnMaster").textContent=`${n(s.master_plus)} Master`;
  }
  function renderTrend(rows){
    const root=$("trendChart");if(!rows?.length){root.innerHTML='<p class="admin-empty">Chưa có dữ liệu.</p>';return}
    const max=Math.max(1,...rows.flatMap(r=>[num(r.page_views),num(r.unique_visitors),num(r.tool_runs)]));
    root.innerHTML=rows.map(r=>{const date=new Date(`${r.day}T00:00:00`),label=`${date.getDate()}/${date.getMonth()+1}`;const h1=Math.max(1,num(r.page_views)/max*180),h2=Math.max(1,num(r.unique_visitors)/max*180),h3=Math.max(1,num(r.tool_runs)/max*180);return `<div class="admin-day" title="${r.day}: ${r.page_views} views, ${r.unique_visitors} visitors, ${r.tool_runs} tool runs"><div class="admin-day-bars"><span class="admin-bar" style="height:${h1}px"></span><span class="admin-bar visitors" style="height:${h2}px"></span><span class="admin-bar tools" style="height:${h3}px"></span></div><span class="admin-day-label">${label}</span></div>`}).join("");
  }
  function renderRanking(id,rows,labelKey,valueKey,formatter=x=>x){
    const root=$(id);if(!rows?.length){root.innerHTML='<p class="admin-empty">Chưa có dữ liệu.</p>';return}
    const max=Math.max(1,...rows.map(r=>num(r[valueKey])));
    root.innerHTML=rows.map((r,i)=>{const val=num(r[valueKey]),pct=Math.max(2,val/max*100),label=String(formatter(r[labelKey])||"(không xác định)");return `<div class="admin-rank-row"><span class="admin-rank-label" title="${label.replaceAll('"','&quot;')}">${i+1}. ${label}</span><span class="admin-rank-track"><span class="admin-rank-fill" style="width:${pct}%"></span></span><span class="admin-rank-value">${n(val)}</span></div>`}).join("");
  }
  function renderFunnel(rows){
    const root=$("learningFunnel");if(!rows?.length){root.innerHTML='<p class="admin-empty">Chưa có dữ liệu tiến độ Cloud.</p>';return}
    root.innerHTML=rows.map(r=>`<div class="admin-funnel-row"><span class="admin-funnel-name">${r.stage}</span><span class="admin-funnel-track"><span class="admin-funnel-fill" style="width:${Math.max(1,num(r.completion_pct))}%"></span></span><span class="admin-funnel-val">${n(r.completed_users)} • ${num(r.completion_pct).toFixed(1)}%</span></div>`).join("");
  }
  function renderNewUsers(rows){
    const root=$("newUserTrend");if(!rows?.length){root.innerHTML='<p class="admin-empty">Chưa có dữ liệu.</p>';return}
    const max=Math.max(1,...rows.map(r=>num(r.new_users)));
    root.innerHTML=rows.map(r=>{const dt=new Date(`${r.day}T00:00:00`),label=`${dt.getDate()}/${dt.getMonth()+1}`,h=Math.max(2,num(r.new_users)/max*145);return `<div class="admin-user-day" title="${r.day}: ${n(r.new_users)} tài khoản mới"><span class="admin-user-bar" style="height:${h}px"></span><span class="admin-user-label">${label}</span></div>`}).join("");
  }
  function renderQuizDifficulty(rows){
    const root=$("quizDifficulty");if(!rows?.length){root.innerHTML='<p class="admin-empty">Chưa có lượt làm quiz sau khi cập nhật V15.</p>';return}
    root.innerHTML=rows.map(r=>{const rate=num(r.pass_rate),hard=rate<60;return `<div class="admin-quiz-row"><div><div class="admin-quiz-title">${labelLesson(r.lesson)}</div><div class="admin-quiz-meta">${n(r.attempts)} lượt làm • ${n(r.passes)} lượt đạt</div></div><span class="admin-pass-rate ${hard?'hard':''}">${rate.toFixed(1)}% đạt</span></div>`}).join("");
  }
  async function rpc(name,args){const {data,error}=await client.rpc(name,args);if(error)throw error;return data}

  async function loadDashboard(){
    try{
      $("adminRefresh").disabled=true;
      const [summary,trend,tools,pages,learning,funnel,completed,difficulty,newUsers]=await Promise.all([
        rpc("admin_analytics_summary",{p_days:currentDays}),rpc("admin_analytics_trend",{p_days:Math.min(currentDays,90)}),
        rpc("admin_analytics_top_tools",{p_days:currentDays,p_limit:10}),rpc("admin_analytics_top_pages",{p_days:currentDays,p_limit:10}),
        rpc("admin_learning_summary",{}),rpc("admin_learning_funnel",{}),rpc("admin_top_completed_lessons",{p_limit:10}),
        rpc("admin_quiz_difficulty",{p_days:currentDays,p_limit:10}),rpc("admin_new_user_trend",{p_days:Math.min(currentDays,90)})
      ]);
      renderSummary(summary||{});renderTrend(trend||[]);renderRanking("topTools",tools||[],"tool_name","uses");renderRanking("topPages",pages||[],"page_path","views",labelLesson);
      renderLearningSummary(learning||{});renderFunnel(funnel||[]);renderRanking("topCompletedLessons",completed||[],"lesson","completed_users",labelLesson);renderQuizDifficulty(difficulty||[]);renderNewUsers(newUsers||[]);
      $("adminGate").hidden=true;$("adminDenied").hidden=true;$("adminDashboard").hidden=false;
    }catch(error){
      console.error(error);
      const msg=String(error?.message||error||"");
      const details=String(error?.details||error?.hint||"");
      if(/admin access required/i.test(msg))
        showDenied("RPC báo admin access required. Bạn đã login nhưng server chưa nhận is_admin=true cho session này. Đăng xuất → đăng nhập lại. Email: doananhtuant02@gmail.com");
      else if(/not authenticated|JWT|invalid claim/i.test(msg))
        showDenied("Session hết hạn hoặc chưa login. Hãy đăng nhập lại trên live.");
      else if(/function .* does not exist|Could not find the function|schema cache/i.test(msg))
        showDenied("Thiếu SQL Analytics hoặc schema cache. Trong Supabase SQL Editor chạy: NOTIFY pgrst, 'reload schema'; rồi F5 lại admin.");
      else if(/permission denied/i.test(msg))
        showDenied("Permission denied khi gọi RPC. Kiểm tra GRANT EXECUTE cho role authenticated.");
      else
        showDenied(`Không tải được Analytics: ${msg}${details?(" — "+details):""}`);
    }finally{$("adminRefresh").disabled=false}
  }
  async function init(){
    client=await waitForClient();
    if(!client){showDenied("Supabase chưa được cấu hình hoặc API key chưa hoạt động. Kiểm tra supabase-config.js trên live.");return}
    const session=await waitForSession(client);
    if(!session?.user){
      showDenied("Bạn chưa đăng nhập trên live. Hãy bấm Đăng nhập, dùng đúng email doananhtuant02@gmail.com, rồi quay lại trang này.");
      return;
    }
    // Chẩn đoán nhanh quyền admin qua RPC helper (nếu có)
    try{
      const {data:isAdm, error:admErr}=await client.rpc("is_admin_user");
      if(admErr){
        console.warn("is_admin_user rpc:", admErr);
      }else if(isAdm===false){
        showDenied("Session đã login nhưng is_admin_user() = false. Hãy đăng xuất/đăng nhập lại. Nếu vẫn sai, chạy lại SQL set is_admin = true.");
        return;
      }
    }catch(e){ console.warn(e); }
    loadDashboard();
  }
  $("adminPeriod")?.addEventListener("change",()=>{currentDays=Number($("adminPeriod").value)||30;loadDashboard()});
  $("adminRefresh")?.addEventListener("click",()=>{loadDashboard();toast("Đang làm mới dữ liệu...")});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
