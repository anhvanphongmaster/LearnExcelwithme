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
  let mailData={questions:[], ideas:[], saved:[], files:[]};
  let mailKind='questions';
  function preview(text){
    const s=String(text||"").replace(/\s+/g," ").trim();
    return s.length>42 ? s.slice(0,42)+"…" : s;
  }
  function openMail(list, idx){
    const r=list[idx]; if(!r) return;
    document.querySelectorAll(".admin-mail-item").forEach((el,i)=>el.classList.toggle("active", i===idx));
    const who=String(r.name||"Ẩn danh").replace(/[<>]/g,"");
    const when=r.at ? new Date(r.at).toLocaleString("vi-VN") : "";
    const msg=String(r.message||"").replace(/[<>]/g,"");
    if(mailKind==="files"){
      const contact=[r.email,r.zalo].filter(Boolean).join(" · ");
      $("engMailRead").innerHTML=`<h4>${who}</h4><small>${when}</small>
        <p><b>Liên hệ:</b> ${String(contact||"—").replace(/[<>]/g,"")}</p>
        <p>${String(r.note||r.file||"").replace(/[<>]/g,"")}</p>
        <div class="admin-mail-actions">
          <button type="button" class="admin-mail-keep" id="mailDownload">Tải file</button>
          <button type="button" class="admin-mail-del" id="mailDelete">Xóa phiếu này</button>
        </div>`;
      $("mailDownload")?.addEventListener("click", async()=>{
        try{
          const {data,error}=await client.storage.from("practice-uploads").createSignedUrl(r.path, 3600);
          if(error||!data?.signedUrl){ toast("Không tạo được link tải."); return; }
          location.href=data.signedUrl;
        }catch(e){ toast("Không tải được file"); }
      });
      $("mailDelete")?.addEventListener("click", async()=>{
        { const okFile = window.avpConfirm ? await window.avpConfirm("Phiếu gửi file này sẽ bị xóa khỏi danh sách admin.", { title: "Xóa phiếu file?", icon: "📎", tone: "danger", ok: "Xóa", cancel: "Hủy" }) : confirm("Xóa phiếu file này?"); if(!okFile) return; }
        await rpcSoft("admin_delete_user_file",{p_id:r.id});
        mailData.files=(mailData.files||[]).filter(x=>x.id!==r.id);
        renderMail("files");
        toast("Đã xóa phiếu");
      });
      return;
    }
    const extra = mailKind==="saved"
      ? `<button type="button" class="admin-mail-del" id="mailDelete">Xóa thư này</button>`
      : `<button type="button" class="admin-mail-keep" id="mailKeep">Giữ lại</button>
         <button type="button" class="admin-mail-del" id="mailDelete">Xóa thư này</button>`;
    $("engMailRead").innerHTML=`<h4>${who}</h4><small>${when}</small><p style="margin-top:12px;white-space:pre-wrap">${msg}</p><div class="admin-mail-actions">${extra}</div>`;
    const keep=$("mailKeep");
    if(keep) keep.onclick=async()=>{
      keep.disabled=true; keep.textContent="Đang lưu...";
      try{
        await rpc("admin_save_feedback",{p_kind:mailKind==="ideas"?"idea":"question", p_name:who, p_message:r.message||"", p_at:r.at||null});
        toast("Đã giữ lại");
        mailData.saved = await rpcSoft("admin_list_saved_feedback") || [];
        if(mailData.saved.__error) mailData.saved=[];
        const s=$("mailTabS"); if(s) s.textContent="Đã giữ ("+mailData.saved.length+")";
        keep.textContent="Đã lưu";
      }catch(e){ keep.disabled=false; keep.textContent="Giữ lại"; toast("Chưa lưu được"); }
    };
    const del=$("mailDelete");
    if(del) del.onclick=async()=>{
      { const okMail = window.avpConfirm ? await window.avpConfirm("Xóa thư / góp ý của " + who + "?\nKhông hoàn tác được.", { title: "Xóa thư?", icon: "✉️", tone: "danger", ok: "Xóa", cancel: "Hủy" }) : confirm("Xóa thư này của "+who+"?"); if(!okMail) return; }
      const itemId=Number(r.id);
      if(mailKind==="saved"){
        if(!itemId){ toast("Thư đã giữ chưa có mã."); return; }
        await rpcSoft("admin_delete_saved_feedback",{p_id:itemId});
        mailData.saved = (await rpcSoft("admin_list_saved_feedback")) || [];
        if(mailData.saved.__error) mailData.saved=[];
      }else if(itemId){
        await rpcSoft("admin_delete_inbox_item",{p_id:itemId});
        mailData[mailKind] = (mailData[mailKind]||[]).filter(x=>Number(x.id)!==itemId);
      }else{
        const res=await rpcSoft("admin_delete_inbox_match",{p_at:r.at||null, p_message:r.message||""});
        if(res&&res.__error){ toast("Chưa xóa được. Chạy lại SQL rồi F5."); return; }
        mailData[mailKind] = (mailData[mailKind]||[]).filter(x=>x!==r && x.message!==r.message);
      }
      renderMail(mailKind);
      toast("Đã xóa thư này");
    };
  }
  function bindMailTabs(){
    document.querySelectorAll(".admin-mail-tabs button").forEach(btn=>{
      btn.type="button";
      btn.onclick=function(e){
        e.preventDefault();
        e.stopPropagation();
        document.querySelectorAll(".admin-mail-tabs button").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        renderMail(btn.getAttribute("data-mail")||"questions");
      };
    });
  }
  function renderMail(kind){
    mailKind=kind;
    const list=mailData[kind]||[];
    const box=$("engMailList");
    const read=$("engMailRead");
    if(!box||!read) return;
    if(!list.length){
      box.innerHTML='<p class="admin-empty" style="padding:12px">Hộp thư trống.</p>';
      read.innerHTML="<p>Chưa có thư.</p>";
      return;
    }
    box.innerHTML=list.map((r,i)=>`<button type="button" class="admin-mail-item" data-i="${i}"><b>${String(r.name||"Ẩn danh").replace(/[<>]/g,"")}</b><small>${r.at?new Date(r.at).toLocaleString("vi-VN"):""}</small><em>${preview(r.message||r.file||r.note)}</em></button>`).join("");
    box.querySelectorAll(".admin-mail-item").forEach(btn=>{
      btn.onclick=()=>openMail(list, Number(btn.dataset.i));
    });
    openMail(list, 0);
  }
  
  
  async function renderPracticeVotes(){
    const root=document.getElementById("practiceVotesList");
    if(!root) return;
    try{
      const rows=await rpcSoft("admin_list_practice_votes");
      if(!rows || rows.__error){
        root.innerHTML='<div class="pvote-empty">Chưa có dữ liệu vote (hoặc chưa chạy <code>practice-votes.sql</code>).</div>';
        return;
      }
      if(!rows.length){
        root.innerHTML='<div class="pvote-empty">Chưa có lượt vote nào.</div>';
        return;
      }
      const typeLabel={need_guide:"Cần hướng dẫn",need_more_guide:"Cần hướng dẫn thêm"};
      const typeClass={need_guide:"pvote-tag-need",need_more_guide:"pvote-tag-more"};
      let total=0, need=0, more=0;
      rows.forEach(r=>{
        const v=Number(r.votes)||0; total+=v;
        if(r.vote_type==="need_more_guide") more+=v; else need+=v;
      });
      rows.sort((a,b)=>(Number(b.votes)||0)-(Number(a.votes)||0));
      const max=Math.max(1, ...rows.map(r=>Number(r.votes)||0));
      const summary=`<div class="pvote-summary">
        <div class="pvote-stat"><span>Tổng vote</span><strong>${total}</strong></div>
        <div class="pvote-stat"><span>Cần hướng dẫn</span><strong>${need}</strong></div>
        <div class="pvote-stat"><span>Hướng dẫn thêm</span><strong>${more}</strong></div>
        <div class="pvote-stat"><span>Số bài</span><strong>${rows.length}</strong></div>
      </div>`;
      const list=rows.map((r,i)=>{
        const num=r.lesson_number!=null?String(r.lesson_number).padStart(2,"0"):"—";
        const title=String(r.lesson_title||r.lesson_id||"").replace(/</g,"&lt;");
        const kind=typeLabel[r.vote_type]||r.vote_type;
        const tc=typeClass[r.vote_type]||"pvote-tag-need";
        const v=Number(r.votes)||0;
        const pct=Math.max(8, Math.round(v/max*100));
        return `<div class="pvote-row${i<3?" pvote-row-top":""}">
          <div class="pvote-rank">${i+1}</div>
          <div class="pvote-main">
            <div class="pvote-title"><span class="pvote-num">#${num}</span> ${title}</div>
            <div class="pvote-meta"><span class="pvote-tag ${tc}">${kind}</span></div>
            <div class="pvote-bar"><span style="width:${pct}%"></span></div>
          </div>
          <div class="pvote-count"><strong>${v}</strong><small>vote</small></div>
        </div>`;
      }).join("");
      root.innerHTML=summary+`<div class="pvote-scroll"><div class="pvote-list">${list}</div></div>`+(rows.length>3?'<p class="pvote-more">Cuộn trong khung để xem thêm</p>':'');
    }catch(e){
      root.innerHTML='<div class="pvote-empty">Lỗi tải vote.</div>';
    }
  }


  async function renderEngagement(s){
    const hint=$("engHint");
    if(!s||s.__error){
      if(hint) hint.textContent="Chưa có hàm admin_engagement_summary. Chạy admin-feedback-upgrade.sql rồi F5.";
      return;
    }
    const set=(id,v)=>{const el=$(id); if(el) el.textContent=n(v)};
    set("engDownloads", s.downloads);
    set("engVideos", s.video_clicks);
    set("engBooks", s.book_clicks);
    set("engFeedback", s.feedback);
    mailData.questions=s.questions||[];
    mailData.ideas=s.ideas||[];
    const saved=await rpcSoft("admin_list_saved_feedback");
    mailData.saved=(!saved||saved.__error)?[]:saved;
    const files=await rpcSoft("admin_list_user_files");
    mailData.files=Array.isArray(files)?files:(!files||files.__error?[]:files);
    const q=$("mailTabQ"), i=$("mailTabI");
    if(q) q.textContent="Thắc mắc ("+mailData.questions.length+")";
    if(i) i.textContent="Ý tưởng ("+mailData.ideas.length+")";
    const sv=$("mailTabS"); if(sv) sv.textContent="Đã giữ ("+(mailData.saved||[]).length+")";
    const ff=$("mailTabF"); if(ff) ff.textContent="File gửi lên ("+(mailData.files||[]).length+")";
    bindMailTabs();
    renderMail(mailKind||"questions");
    if(hint) hint.textContent="Chỉ hiện 50 thư mới nhất mỗi loại.";
  }
  function renderQuizDifficulty(rows){
    const root=$("quizDifficulty");if(!rows?.length){root.innerHTML='<p class="admin-empty">Chưa có lượt làm quiz sau khi cập nhật V15.</p>';return}
    root.innerHTML=rows.map(r=>{const rate=num(r.pass_rate),hard=rate<60;return `<div class="admin-quiz-row"><div><div class="admin-quiz-title">${labelLesson(r.lesson)}</div><div class="admin-quiz-meta">${n(r.attempts)} lượt làm • ${n(r.passes)} lượt đạt</div></div><span class="admin-pass-rate ${hard?'hard':''}">${rate.toFixed(1)}% đạt</span></div>`}).join("");
  }
  async function rpc(name,args){
    const {data,error}=await client.rpc(name,args||{});
    if(error) throw error;
    return data;
  }
  async function rpcSoft(name,args){
    try { return await rpc(name,args); }
    catch(e){ console.warn("RPC fail:", name, e); return {__error:e}; }
  }

  
  async function loadRaceStats(){
    try{
      if(!client) return;
      const a=$("kpiRacePlays"), b=$("kpiRaceTodayCount"), c=$("kpiRaceCrash");
      const sm=$("kpiRaceToday");
      const {count:total,error:e1}=await client.from("race_plays").select("*",{count:"exact",head:true}).eq("event","start");
      if(e1){
        if(a) a.textContent="—";
        if(sm) sm.textContent=(e1.message||"").includes("does not exist")?"Chưa chạy race-plays.sql":("Lỗi: "+(e1.message||"đọc bảng"));
        if(b) b.textContent="—";
        if(c) c.textContent="—";
        return;
      }
      const since=new Date(); since.setHours(0,0,0,0);
      const {count:today,error:e2}=await client.from("race_plays").select("*",{count:"exact",head:true}).eq("event","start").gte("created_at",since.toISOString());
      const {count:crash,error:e3}=await client.from("race_plays").select("*",{count:"exact",head:true}).in("event",["crash","timeout"]);
      if(a) a.textContent=n(total||0);
      if(b) b.textContent=e2?"—":n(today||0);
      if(c) c.textContent=e3?"—":n(crash||0);
      if(sm) sm.textContent="2.5D minigame";
    }catch(e){ console.warn("race stats", e); }
  }

  async function loadDashboard(){
    try{
      $("adminRefresh").disabled=true;

      // Core metrics first — if these fail with admin/auth, block page
      let summary, trend, tools, pages;
      try{
        [summary, trend, tools, pages] = await Promise.all([
          rpc("admin_analytics_summary",{p_days:currentDays}),
          rpc("admin_analytics_trend",{p_days:Math.min(currentDays,90)}),
          rpc("admin_analytics_top_tools",{p_days:currentDays,p_limit:10}),
          rpc("admin_analytics_top_pages",{p_days:currentDays,p_limit:10})
        ]);
      }catch(error){
        console.error(error);
        const msg=String(error?.message||error||"");
        const details=String(error?.details||error?.hint||"");
        if(/admin access required/i.test(msg))
          return showDenied("RPC báo admin access required. Login lại bằng doananhtuant02@gmail.com (tab ẩn danh).");
        if(/not authenticated|JWT|invalid claim/i.test(msg))
          return showDenied("Chưa đăng nhập hoặc session hết hạn. Hãy đăng nhập lại trên live.");
        if(/Could not find the function|schema cache|404/i.test(msg))
          return showDenied("Thiếu hàm analytics hoặc schema cache. SQL Editor chạy: NOTIFY pgrst, 'reload schema'; rồi F5.");
        return showDenied(`Không tải được Analytics: ${msg}${details?(" — "+details):""}`);
      }

      // Learning RPCs — optional, không chặn cả dashboard nếu 1 hàm lỗi
      const [learning,funnel,completed,difficulty,newUsers,engagement] = await Promise.all([
        rpcSoft("admin_learning_summary"),
        rpcSoft("admin_learning_funnel"),
        rpcSoft("admin_top_completed_lessons",{p_limit:10}),
        rpcSoft("admin_quiz_difficulty",{p_days:currentDays,p_limit:10}),
        rpcSoft("admin_new_user_trend",{p_days:Math.min(currentDays,90)}),
        rpcSoft("admin_engagement_summary",{p_days:currentDays})
      ]);

      $("adminGate").hidden=true;$("adminDenied").hidden=true;$("adminDashboard").hidden=false;
      renderSummary(summary||{});
      await loadRaceStats();
      renderTrend(trend||[]);
      renderRanking("topTools",tools||[],"tool_name","uses");
      renderRanking("topPages",pages||[],"page_path","views",labelLesson);
      if(!learning?.__error) renderLearningSummary(learning||{});
      if(!funnel?.__error) renderFunnel(funnel||[]);
      if(!completed?.__error) renderRanking("topCompletedLessons",completed||[],"lesson","completed_users",labelLesson);
      if(!difficulty?.__error) renderQuizDifficulty(difficulty||[]);
      if(!engagement?.__error) await renderEngagement(engagement||{});
      await renderPracticeVotes();
      if(!newUsers?.__error) renderNewUsers(newUsers||[]);
    }catch(error){
      console.error(error);
      showDenied(`Không tải được Analytics: ${error?.message||error}`);
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
    bindMailTabs();
    loadDashboard();
  }
  $("adminPeriod")?.addEventListener("change",()=>{currentDays=Number($("adminPeriod").value)||30;loadDashboard()});
  $("adminRefresh")?.addEventListener("click",()=>{loadDashboard();toast("Đang làm mới dữ liệu...")});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
