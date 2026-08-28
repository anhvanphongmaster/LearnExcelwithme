(() => {
  const $=id=>document.getElementById(id);
  const nf=new Intl.NumberFormat("vi-VN");
  let client=null;
  let currentDays=30;
  let currentVoteMonth=null;

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
  
  
  function vnMonth(offset){
    const now=new Date();
    const vn=new Date(now.toLocaleString("en-US",{timeZone:"Asia/Ho_Chi_Minh"}));
    vn.setDate(1); vn.setHours(0,0,0,0); vn.setMonth(vn.getMonth()+(offset||0));
    return vn;
  }
  function monthIso(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-01`;}
  function sameMonth(a,b){return a&&b&&a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth();}
  function updateVoteMonthUI(){
    if(!currentVoteMonth) currentVoteMonth=vnMonth(0);
    const label=$("pvoteMonthLabel"), next=$("pvoteNextMonth");
    if(label) label.textContent=`Tháng ${String(currentVoteMonth.getMonth()+1).padStart(2,"0")}/${currentVoteMonth.getFullYear()}`;
    if(next) next.disabled=sameMonth(currentVoteMonth,vnMonth(0));
  }

  async function renderPracticeVotes(){
    const root=document.getElementById("practiceVotesList");
    if(!root)return;
    if(!currentVoteMonth) currentVoteMonth=vnMonth(0);
    updateVoteMonthUI();
    try{
      const rows=await rpcSoft("admin_list_practice_votes_by_month",{p_month:monthIso(currentVoteMonth)});
      if(rows===null){
        root.innerHTML='<div class="pvote-empty">Chưa có dashboard vote theo tháng. Chạy SQL cập nhật vote kênh một lần trong Supabase.</div>';
        return;
      }
      const allRows=Array.isArray(rows)?rows:[];
      const channelRows=allRows.filter(r=>r.vote_type==="focus_youtube"||r.vote_type==="focus_tiktok"||String(r.lesson_id||"").indexOf("channel-focus-")===0);
      const practiceRows=allRows.filter(r=>!channelRows.includes(r));

      let yt=0,tt=0;
      channelRows.forEach(r=>{const v=Number(r.votes)||0;if(r.vote_type==="focus_youtube"||r.lesson_id==="channel-focus-youtube")yt+=v;else if(r.vote_type==="focus_tiktok"||r.lesson_id==="channel-focus-tiktok")tt+=v;});
      const ytEl=$("channelVoteYoutube"),ttEl=$("channelVoteTiktok"),win=$("channelVoteWinner"),bar=$("channelVoteYoutubeBar");
      if(ytEl)ytEl.textContent=yt;if(ttEl)ttEl.textContent=tt;
      const channelTotal=yt+tt, pct=channelTotal?Math.round(yt/channelTotal*100):0;
      if(bar)bar.style.width=pct+"%";
      if(win){
        if(!channelTotal)win.textContent="Chưa có vote trong tháng này.";
        else if(yt===tt)win.textContent=`Đang hòa ${yt} – ${tt}`;
        else if(yt>tt)win.textContent=`YouTube đang dẫn ${yt} – ${tt} (${pct}%)`;
        else win.textContent=`TikTok đang dẫn ${tt} – ${yt} (${100-pct}%)`;
      }

      if(!practiceRows.length){
        root.innerHTML='<div class="pvote-summary"><div class="pvote-stat"><span>Tổng vote</span><strong>0</strong></div><div class="pvote-stat"><span>Cần hướng dẫn</span><strong>0</strong></div><div class="pvote-stat"><span>Hướng dẫn thêm</span><strong>0</strong></div><div class="pvote-stat"><span>Số bài</span><strong>0</strong></div></div><div class="pvote-empty">Tháng này chưa có vote hướng dẫn bài tập.</div>';
        return;
      }
      const typeLabel={need_guide:"Cần hướng dẫn",need_more_guide:"Hướng dẫn thêm"};
      const typeClass={need_guide:"pvote-tag-need",need_more_guide:"pvote-tag-more"};
      let total=0,need=0,more=0; const lessonIds=new Set();
      practiceRows.forEach(r=>{const v=Number(r.votes)||0;total+=v;lessonIds.add(r.lesson_id);if(r.vote_type==="need_more_guide")more+=v;else if(r.vote_type==="need_guide")need+=v;});
      practiceRows.sort((a,b)=>(Number(b.votes)||0)-(Number(a.votes)||0));
      const max=Math.max(1,...practiceRows.map(r=>Number(r.votes)||0));
      const summary=`<div class="pvote-summary"><div class="pvote-stat"><span>Tổng vote</span><strong>${total}</strong></div><div class="pvote-stat"><span>Cần hướng dẫn</span><strong>${need}</strong></div><div class="pvote-stat"><span>Hướng dẫn thêm</span><strong>${more}</strong></div><div class="pvote-stat"><span>Số bài</span><strong>${lessonIds.size}</strong></div></div>`;
      const list=practiceRows.map((r,i)=>{const kind=typeLabel[r.vote_type]||r.vote_type,tc=typeClass[r.vote_type]||"pvote-tag-need",v=Number(r.votes)||0,pct=Math.max(6,Math.round(v/max*100)),num=r.lesson_number?String(r.lesson_number).padStart(2,"0"):"—",title=r.lesson_title||r.lesson_id;return `<div class="pvote-row${i<3?" pvote-row-top":""}"><div class="pvote-rank">${i+1}</div><div class="pvote-main"><div class="pvote-title"><span class="pvote-num">#${num}</span> ${title}</div><div class="pvote-meta"><span class="pvote-tag ${tc}">${kind}</span></div><div class="pvote-bar"><span style="width:${pct}%"></span></div></div><div class="pvote-count"><strong>${v}</strong><small>vote</small></div></div>`;}).join("");
      root.innerHTML=summary+`<div class="pvote-scroll"><div class="pvote-list">${list}</div></div>`+(practiceRows.length>3?'<p class="pvote-more">↕ Cuộn trong khung để xem thêm</p>':'');
    }catch(e){
      root.innerHTML='<div class="pvote-empty">Lỗi tải vote theo tháng.</div>';
    }
  }

  function bindVoteMonthNav(){
    if(!currentVoteMonth) currentVoteMonth=vnMonth(0);
    const prev=$("pvotePrevMonth"), next=$("pvoteNextMonth");
    if(prev && !prev.dataset.bound){
      prev.dataset.bound="1";
      prev.onclick=()=>{currentVoteMonth=new Date(currentVoteMonth.getFullYear(),currentVoteMonth.getMonth()-1,1);renderPracticeVotes();};
    }
    if(next && !next.dataset.bound){
      next.dataset.bound="1";
      next.onclick=()=>{if(sameMonth(currentVoteMonth,vnMonth(0)))return;currentVoteMonth=new Date(currentVoteMonth.getFullYear(),currentVoteMonth.getMonth()+1,1);if(currentVoteMonth>vnMonth(0))currentVoteMonth=vnMonth(0);renderPracticeVotes();};
    }
    updateVoteMonthUI();
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


  let adminUsersCache=[];
  function fmtDate(v){
    if(!v) return "—";
    try{return new Date(v).toLocaleString("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}catch(e){return "—"}
  }
  function progressStats(row){
    const d=row?.progress_data&&typeof row.progress_data==="object"?row.progress_data:{};
    const xp=Math.max(Number(row?.leaderboard_xp)||0,Number(d.xp)||0,Number(d.totalXP)||0,Number(d.total_xp)||0);
    let completed=0;
    const candidates=[d.completedLessons,d.completed_lessons,d.completed,d.lessonsCompleted];
    for(const v of candidates){if(Array.isArray(v)){completed=Math.max(completed,v.length)}else if(v&&typeof v==="object"){completed=Math.max(completed,Object.keys(v).filter(k=>v[k]).length)}else if(Number.isFinite(Number(v))){completed=Math.max(completed,Number(v))}}
    return {xp,completed};
  }
  function renderAdminUsers(rows){
    adminUsersCache=Array.isArray(rows)?rows:[];
    const body=$("adminUsersBody"); if(!body)return;
    $("adminUsersShown").textContent=n(adminUsersCache.length);
    $("adminUsersAdmins").textContent=n(adminUsersCache.filter(x=>x.is_admin).length);
    $("adminUsersHidden").textContent=n(adminUsersCache.filter(x=>x.exclude_from_leaderboard).length);
    $("adminUsersWithXp").textContent=n(adminUsersCache.filter(x=>progressStats(x).xp>0).length);
    const notice=$("adminUsersNotice"); if(notice) notice.hidden=true;
    if(!adminUsersCache.length){body.innerHTML='<tr><td colspan="6" class="admin-users-empty">Không tìm thấy tài khoản phù hợp.</td></tr>';return}
    body.innerHTML=adminUsersCache.map(r=>{
      const s=progressStats(r), hidden=!!r.exclude_from_leaderboard, adm=!!r.is_admin;
      return `<tr data-user-id="${r.user_id}">
        <td><div class="admin-user-identity"><strong>${escapeHtml(r.display_name||"Học viên")}${adm?' <span class="admin-user-badge admin-badge-admin">ADMIN</span>':''}</strong><small>${escapeHtml(r.email||"")}</small><em>Đăng ký ${fmtDate(r.created_at)}</em></div></td>
        <td><div class="admin-user-progress"><b>${n(s.xp)} XP</b><small>${n(s.completed)} bài hoàn thành • ${n(r.topic_vote_count||0)} vote chủ đề</small></div></td>
        <td><div class="admin-user-progress"><b>🔥 ${n(r.current_streak||0)} ngày</b><small>Tốt nhất ${n(r.best_streak||0)} • Tổng ${n(r.total_days||0)} ngày</small></div></td>
        <td><span class="admin-user-badge ${hidden||adm?'admin-badge-hidden':'admin-badge-visible'}">${adm?'Admin':hidden?'Đang ẩn':'Đang hiện'}</span></td>
        <td><small>${fmtDate(r.last_sign_in_at)}</small></td>
        <td><div class="admin-user-actions">
          <button type="button" data-act="leaderboard" data-hidden="${hidden?'1':'0'}" ${adm?'disabled':''}>${hidden?'Hiện BXH':'Ẩn BXH'}</button>
          <button type="button" data-act="votes">Reset vote</button>
          <button type="button" data-act="progress" class="danger">Reset tiến độ</button>
          <button type="button" data-act="admin" data-admin="${adm?'1':'0'}" class="${adm?'warn':''}">${adm?'Bỏ Admin':'Cấp Admin'}</button>
        </div></td>
      </tr>`;
    }).join("");
  }
  function escapeHtml(v){return String(v??"").replace(/[&<>'"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]))}
  async function loadAdminUsers(){
    const body=$("adminUsersBody"),q=$("adminUserSearch")?.value?.trim()||"";
    if(body)body.innerHTML='<tr><td colspan="6" class="admin-users-empty">Đang tải danh sách tài khoản…</td></tr>';
    const data=await rpcSoft("admin_um_list_users",{p_search:q,p_limit:200,p_offset:0});
    if(data?.__error){
      if(body)body.innerHTML='<tr><td colspan="6" class="admin-users-empty">Chưa dùng được Quản lý người dùng. Hãy chạy ADMIN-USER-MANAGEMENT.sql trong Supabase.</td></tr>';
      const notice=$("adminUsersNotice"); if(notice){notice.hidden=false;notice.textContent="Supabase chưa có RPC Quản lý người dùng hoặc schema chưa reload."}
      return;
    }
    renderAdminUsers(data||[]);
  }
  async function doUserAction(btn){
    const tr=btn.closest("tr[data-user-id]"); if(!tr)return;
    const id=tr.dataset.userId,act=btn.dataset.act,row=adminUsersCache.find(x=>x.user_id===id); if(!row)return;
    const who=row.display_name||row.email||"tài khoản này";
    let ok=false;
    try{
      btn.disabled=true;
      if(act==="leaderboard"){
        const hidden=btn.dataset.hidden==="1";
        if(!confirm(`${hidden?'Hiện':'Ẩn'} ${who} ${hidden?'trên':'khỏi'} BXH?`))return;
        await rpc("admin_um_set_leaderboard_visibility",{p_user_id:id,p_hidden:!hidden}); ok=true;
      }else if(act==="votes"){
        if(!confirm(`Reset toàn bộ vote có liên kết tài khoản của ${who}?`))return;
        const res=await rpc("admin_um_reset_votes",{p_user_id:id}); ok=true;
        toast(`Đã reset vote • Chủ đề: ${res?.topic_deleted??0} • Bài: ${res?.lesson_deleted??0}`);
      }else if(act==="progress"){
        if(!confirm(`RESET TIẾN ĐỘ của ${who}? XP/BXH cloud sẽ được xóa. Thao tác này không nên dùng nếu không chắc.`))return;
        await rpc("admin_um_reset_progress",{p_user_id:id}); ok=true;
      }else if(act==="admin"){
        const isAdm=btn.dataset.admin==="1";
        if(!confirm(`${isAdm?'Bỏ':'Cấp'} quyền Admin cho ${who}?`))return;
        const res=await rpc("admin_um_set_admin",{p_user_id:id,p_is_admin:!isAdm});
        if(res?.ok===false) throw new Error(res.error||"Không thể đổi quyền Admin"); ok=true;
      }
      if(ok){toast("Đã cập nhật tài khoản");await loadAdminUsers()}
    }catch(e){console.error(e);toast("Không thực hiện được: "+(e?.message||e))}
    finally{btn.disabled=false}
  }
  function bindUserManagement(){
    $("adminUserSearchBtn")?.addEventListener("click",loadAdminUsers);
    $("adminUserReloadBtn")?.addEventListener("click",loadAdminUsers);
    $("adminUserSearch")?.addEventListener("keydown",e=>{if(e.key==="Enter")loadAdminUsers()});
    $("adminUsersBody")?.addEventListener("click",e=>{const b=e.target.closest("button[data-act]");if(b)doUserAction(b)});
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
      bindAdminViews();
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
      bindVoteMonthNav();
      await renderPracticeVotes();
      if(!newUsers?.__error) renderNewUsers(newUsers||[]);
    }catch(error){
      console.error(error);
      showDenied(`Không tải được Analytics: ${error?.message||error}`);
    }finally{$("adminRefresh").disabled=false}
  }
  const ADMIN_VIEW_KEY="avp_admin_view_v1";
  function setAdminView(view,opts){
    const valid=["overview","users","learning","votes","practice","downloads","inbox","analytics"];
    if(!valid.includes(view)) view="overview";
    document.querySelectorAll("[data-admin-section]").forEach(el=>{
      const show=el.getAttribute("data-admin-section")===view;
      el.classList.toggle("admin-view-hidden",!show);
      if(show){
        el.classList.remove("admin-view-enter");
        void el.offsetWidth;
        el.classList.add("admin-view-enter");
      }
    });
    document.querySelectorAll(".admin-view-tabs [data-admin-view]").forEach(btn=>{
      const on=btn.getAttribute("data-admin-view")===view;
      btn.classList.toggle("active",on);
      btn.setAttribute("aria-selected",on?"true":"false");
    });
    try{localStorage.setItem(ADMIN_VIEW_KEY,view)}catch(e){}
    if(view==="users" && !adminUsersCache.length) loadAdminUsers();
    if(view==="votes") loadAdminVoteManager();
    if(view==="downloads" && !adminDownloadLoaded) loadAdminDownloads();
    if(opts&&opts.scroll){
      document.querySelector(".admin-command-center")?.scrollIntoView({behavior:"smooth",block:"start"});
    }
  }
  function bindAdminViews(){
    const buttons=document.querySelectorAll(".admin-view-tabs [data-admin-view]");
    buttons.forEach(btn=>{
      if(btn.dataset.adminBound)return;
      btn.dataset.adminBound="1";
      btn.addEventListener("click",()=>setAdminView(btn.getAttribute("data-admin-view"),{scroll:true}));
    });
    let saved="overview";
    try{saved=localStorage.getItem(ADMIN_VIEW_KEY)||"overview"}catch(e){}
    setAdminView(saved);
  }


  let adminVotePeriod="today";
  function votePeriodLabel(v){return v==="today"?"Hôm nay":v==="7d"?"7 ngày":"Tổng"}
  function voteTypeLabel(row){
    if(row.source==="topic") return "Chủ đề";
    if(row.vote_type==="focus_youtube") return "YouTube";
    if(row.vote_type==="focus_tiktok") return "TikTok";
    if(row.vote_type==="need_more_guide") return "Hướng dẫn thêm";
    return "Cần hướng dẫn";
  }
  function renderVoteRanking(rootId, rows, kind){
    const root=$(rootId); if(!root)return;
    const list=Array.isArray(rows)?rows:[];
    if(!list.length){root.innerHTML='<div class="pvote-empty">Chưa có vote trong khoảng này.</div>';return}
    const max=Math.max(1,...list.map(r=>num(r.votes)));
    root.innerHTML=list.map((r,i)=>{
      const v=num(r.votes), pct=Math.max(6,Math.round(v/max*100));
      const title=kind==="topic"?(r.topic_title||r.topic_id):(r.lesson_title||r.lesson_id);
      const meta=kind==="topic"?"Chủ đề tiếp theo":(r.vote_type==="need_more_guide"?"Cần hướng dẫn thêm":"Cần hướng dẫn");
      return `<div class="admin-vote-rank-row"><div class="admin-vote-rank-no">${i+1}</div><div class="admin-vote-rank-main"><strong>${escapeHtml(title||"(không tên)")}</strong><small>${escapeHtml(meta)}</small><div class="admin-vote-rank-track"><i style="width:${pct}%"></i></div></div><b>${n(v)}</b></div>`;
    }).join("");
  }
  function renderVoteHistory(rows){
    const body=$("adminVoteHistoryBody"); if(!body)return;
    const filter=$("adminVoteHistoryFilter")?.value||"all";
    let list=Array.isArray(rows)?rows:[];
    if(filter!=="all") list=list.filter(r=>r.source===filter || (filter==="channel"&&r.source==="lesson"&&(r.vote_type==="focus_youtube"||r.vote_type==="focus_tiktok")));
    if(!list.length){body.innerHTML='<tr><td colspan="5" class="admin-users-empty">Không có vote phù hợp.</td></tr>';return}
    body.innerHTML=list.map(r=>`<tr data-source="${escapeHtml(r.source)}" data-id="${escapeHtml(r.vote_id)}"><td><small>${fmtDate(r.created_at)}</small></td><td><span class="admin-vote-pill">${escapeHtml(voteTypeLabel(r))}</span></td><td><strong>${escapeHtml(r.title||r.item_id||"—")}</strong></td><td><small>${escapeHtml(r.actor||"Ẩn danh")}</small></td><td><button type="button" class="admin-vote-delete" data-vote-delete="1">Xoá</button></td></tr>`).join("");
  }
  let adminVoteHistoryCache=[];
  async function loadAdminVoteManager(){
    const notice=$("adminVoteNotice");
    try{
      const [summary,topics,lessons,channels,history]=await Promise.all([
        rpc("admin_vote_summary",{p_period:adminVotePeriod}),
        rpc("admin_vote_topic_rankings",{p_period:adminVotePeriod,p_limit:10}),
        rpc("admin_vote_lesson_rankings",{p_period:adminVotePeriod,p_limit:10}),
        rpc("admin_vote_channel_summary",{p_period:adminVotePeriod}),
        rpc("admin_vote_history",{p_period:adminVotePeriod,p_limit:100})
      ]);
      if(notice)notice.textContent=`Đang xem ${votePeriodLabel(adminVotePeriod).toLowerCase()}. Xoá vote sẽ cập nhật ngay dữ liệu Supabase.`;
      $("voteKpiTotal").textContent=n(summary?.total_votes);
      $("voteKpiTopics").textContent=n(summary?.topic_votes);
      $("voteKpiLessons").textContent=n(summary?.lesson_votes);
      $("voteKpiChannel").textContent=n(summary?.channel_votes);
      $("voteKpiPeriod").textContent=votePeriodLabel(adminVotePeriod);
      $("voteTopicTotal").textContent=n(summary?.topic_votes);
      $("voteLessonTotal").textContent=n(summary?.lesson_votes);
      $("voteChannelTotal").textContent=n(summary?.channel_votes);
      renderVoteRanking("voteTopicRanking",topics,"topic");
      renderVoteRanking("voteLessonRanking",lessons,"lesson");
      const yt=num(channels?.youtube_votes), tt=num(channels?.tiktok_votes), total=yt+tt, pct=total?Math.round(yt/total*100):0;
      $("voteYoutubeCount").textContent=n(yt); $("voteTiktokCount").textContent=n(tt);
      $("voteYoutubeTrack").style.width=pct+"%";
      $("voteChannelWinner").textContent=!total?"Chưa có vote.":yt===tt?`Đang hòa ${yt} – ${tt}`:yt>tt?`YouTube đang dẫn ${yt} – ${tt}`:`TikTok đang dẫn ${tt} – ${yt}`;
      adminVoteHistoryCache=Array.isArray(history)?history:[]; renderVoteHistory(adminVoteHistoryCache);
    }catch(e){
      console.warn("vote manager",e);
      if(notice)notice.innerHTML='Chưa dùng được Vote Center. Hãy chạy <code>ADMIN-VOTE-MANAGEMENT-V1.sql</code> trong Supabase rồi tải lại.';
      ["voteTopicRanking","voteLessonRanking"].forEach(id=>{if($(id))$(id).innerHTML='<div class="pvote-empty">Thiếu RPC quản lý vote.</div>'});
    }
  }
  function bindVoteManager(){
    document.querySelectorAll("[data-vote-period]").forEach(btn=>{
      if(btn.dataset.bound)return; btn.dataset.bound="1";
      btn.addEventListener("click",()=>{
        adminVotePeriod=btn.dataset.votePeriod||"today";
        document.querySelectorAll("[data-vote-period]").forEach(x=>x.classList.toggle("active",x===btn));
        loadAdminVoteManager();
      });
    });
    $("adminVoteReload")?.addEventListener("click",()=>{loadAdminVoteManager();toast("Đang làm mới vote...")});
    $("adminVoteHistoryFilter")?.addEventListener("change",()=>renderVoteHistory(adminVoteHistoryCache));
    $("adminVoteHistoryBody")?.addEventListener("click",async e=>{
      const btn=e.target.closest("[data-vote-delete]"); if(!btn)return;
      const tr=btn.closest("tr"), source=tr?.dataset.source, id=Number(tr?.dataset.id||0); if(!source||!id)return;
      if(!confirm("Xoá vote này khỏi Supabase?"))return;
      btn.disabled=true;
      try{
        const res=await rpc("admin_vote_delete_one",{p_source:source,p_vote_id:id});
        if(res?.ok===false) throw new Error(res.error||"delete_failed");
        toast("Đã xoá vote"); await loadAdminVoteManager();
      }catch(err){toast("Không xoá được vote");btn.disabled=false}
    });
  }

  // ================= DOWNLOAD MANAGEMENT =================
  let adminDownloadCache=[];
  let adminDownloadLoaded=false;
  const dlFmtSize=n=>{n=Number(n)||0;if(n<1024)return n+" B";if(n<1048576)return (n/1024).toFixed(1)+" KB";return (n/1048576).toFixed(1)+" MB"};
  function dlCategories(){return [...new Set(adminDownloadCache.map(x=>x.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"vi"))}
  function renderDownloadCategories(){const s=$("adminDownloadCategory");if(!s)return;const keep=s.value;s.innerHTML='<option value="">Tất cả nhóm</option>'+dlCategories().map(x=>`<option>${escapeHtml(x)}</option>`).join("");s.value=keep}
  function renderAdminDownloads(rows){
    adminDownloadCache=Array.isArray(rows)?rows:[];renderDownloadCategories();const body=$("adminDownloadBody");if(!body)return;
    if(!adminDownloadCache.length){body.innerHTML='<tr><td colspan="6" class="admin-users-empty">Không tìm thấy tài nguyên.</td></tr>';return}
    body.innerHTML=adminDownloadCache.map(r=>`<tr data-download-id="${escapeHtml(r.id)}"><td><div class="admin-download-file"><strong>${escapeHtml(r.title||"(không tên)")}</strong><small>${escapeHtml((r.file_type||"").toUpperCase())} · ${dlFmtSize(r.file_size)}</small></div></td><td>${escapeHtml(r.category||"Khác")}</td><td><div class="admin-download-path">${escapeHtml(r.source_path||"")}</div>${r.file_url?'<small>↪ Có link thay thế</small>':''}</td><td><b>${n(r.download_count)}</b></td><td><span class="admin-download-status ${r.is_active?'on':'off'}">${r.is_active?'Đang hiện':'Đang ẩn'}</span></td><td><div class="admin-download-actions"><button data-dl-act="edit">Sửa</button><button data-dl-act="toggle">${r.is_active?'Ẩn':'Hiện'}</button><button data-dl-act="copy">Copy link</button><button data-dl-act="delete" class="danger">Xoá</button></div></td></tr>`).join("");
  }
  async function loadAdminDownloads(){
    const notice=$("adminDownloadNotice");
    try{
      const q=$("adminDownloadSearch")?.value?.trim()||"",cat=$("adminDownloadCategory")?.value||"",status=$("adminDownloadStatus")?.value||"all";
      const [summary,rows]=await Promise.all([rpc("admin_download_summary"),rpc("admin_download_list",{p_search:q,p_category:cat,p_status:status,p_limit:500})]);
      $("dlKpiTotal").textContent=n(summary?.total);$("dlKpiActive").textContent=n(summary?.active);$("dlKpiHidden").textContent=n(summary?.hidden);$("dlKpiCount").textContent=n(summary?.downloads);
      renderAdminDownloads(rows);adminDownloadLoaded=true;if(notice)notice.hidden=true;
    }catch(e){console.warn("download manager",e);if(notice){notice.hidden=false;notice.innerHTML='Chưa dùng được Kho tải xuống. Hãy chạy <code>ADMIN-DOWNLOAD-MANAGEMENT-V1.sql</code> rồi tải lại trang.'}}
  }
  function openDownloadEditor(row){
    const ed=$("adminDownloadEditor");if(!ed)return;ed.hidden=false;$("adminDownloadEditorTitle").textContent=row?"Sửa tài nguyên":"Thêm tài nguyên";$("dlEditId").value=row?.id||"";$("dlEditTitle").value=row?.title||"";$("dlEditCategory").value=row?.category||"";$("dlEditSource").value=row?.source_path||"";$("dlEditUrl").value=row?.file_url||"";$("dlEditDescription").value=row?.description||"";$("dlEditOrder").value=row?.sort_order||0;$("dlEditActive").checked=row?!!row.is_active:true;$("dlEditFeatured").checked=!!row?.is_featured;$("dlEditFile").value="";ed.scrollIntoView({behavior:"smooth",block:"nearest"});
  }
  function closeDownloadEditor(){$("adminDownloadEditor").hidden=true}
  async function uploadManagedDownload(file){
    const ext=(file.name.split('.').pop()||'').toLowerCase(), safe=file.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]+/g,'-');
    const path=`managed/${Date.now()}-${Math.random().toString(36).slice(2,8)}-${safe}`;
    const {error}=await client.storage.from("site-downloads").upload(path,file,{upsert:false,contentType:file.type||undefined});if(error)throw error;
    const {data}=client.storage.from("site-downloads").getPublicUrl(path);return {url:data?.publicUrl||"",path,type:ext,size:file.size||0};
  }
  async function saveDownloadEditor(){
    const btn=$("adminDownloadSave");btn.disabled=true;
    try{
      let url=$("dlEditUrl").value.trim(),storagePath=null,fileType="",fileSize=0;const file=$("dlEditFile").files?.[0];
      if(file){toast("Đang upload file...");const up=await uploadManagedDownload(file);url=up.url;storagePath=up.path;fileType=up.type;fileSize=up.size;$("dlEditUrl").value=url;if(!$("dlEditSource").value.trim())$("dlEditSource").value=`downloads/managed/${file.name}`;if(!$("dlEditTitle").value.trim())$("dlEditTitle").value=file.name}
      const existing=adminDownloadCache.find(x=>x.id===$("dlEditId").value);
      await rpc("admin_download_save",{p_id:$("dlEditId").value||null,p_source_path:$("dlEditSource").value.trim(),p_title:$("dlEditTitle").value.trim(),p_category:$("dlEditCategory").value.trim()||"Khác",p_description:$("dlEditDescription").value.trim(),p_file_url:url||null,p_storage_path:storagePath||existing?.storage_path||null,p_file_type:fileType||existing?.file_type||"",p_file_size:fileSize||existing?.file_size||0,p_is_active:$("dlEditActive").checked,p_is_featured:$("dlEditFeatured").checked,p_sort_order:Number($("dlEditOrder").value)||0});
      toast("Đã lưu tài nguyên");closeDownloadEditor();await loadAdminDownloads();
    }catch(e){console.error(e);toast("Không lưu được: "+(e?.message||e))}finally{btn.disabled=false}
  }
  function bindDownloadManagement(){
    $("adminDownloadNew")?.addEventListener("click",()=>openDownloadEditor(null));$("adminDownloadClose")?.addEventListener("click",closeDownloadEditor);$("adminDownloadCancel")?.addEventListener("click",closeDownloadEditor);$("adminDownloadSave")?.addEventListener("click",saveDownloadEditor);$("adminDownloadReload")?.addEventListener("click",loadAdminDownloads);$("adminDownloadSearch")?.addEventListener("keydown",e=>{if(e.key==="Enter")loadAdminDownloads()});$("adminDownloadCategory")?.addEventListener("change",loadAdminDownloads);$("adminDownloadStatus")?.addEventListener("change",loadAdminDownloads);
    $("adminDownloadBody")?.addEventListener("click",async e=>{const b=e.target.closest("[data-dl-act]");if(!b)return;const id=b.closest("tr")?.dataset.downloadId,row=adminDownloadCache.find(x=>x.id===id);if(!row)return;const act=b.dataset.dlAct;
      if(act==="edit")return openDownloadEditor(row);
      if(act==="copy"){const link=row.file_url||row.source_path;try{await navigator.clipboard.writeText(link);toast("Đã copy link")}catch(_){prompt("Copy link:",link)}return}
      if(act==="toggle"){b.disabled=true;try{await rpc("admin_download_set_active",{p_id:id,p_active:!row.is_active});toast(row.is_active?"Đã ẩn file":"Đã hiện file");await loadAdminDownloads()}catch(err){toast("Không đổi được trạng thái");b.disabled=false}return}
      if(act==="delete"){if(!confirm("Xoá tài nguyên khỏi hệ thống quản lý? File vật lý không tự bị xoá."))return;b.disabled=true;try{await rpc("admin_download_delete",{p_id:id});toast("Đã xoá tài nguyên");await loadAdminDownloads()}catch(err){toast("Không xoá được");b.disabled=false}}
    });
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
    bindAdminViews();
    bindUserManagement();
    bindVoteManager();
    bindDownloadManagement();
    loadDashboard();
  }
  $("adminPeriod")?.addEventListener("change",()=>{currentDays=Number($("adminPeriod").value)||30;loadDashboard()});
  $("adminRefresh")?.addEventListener("click",()=>{loadDashboard();toast("Đang làm mới dữ liệu...")});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();


// ================= PRACTICE LIBRARY MANAGEMENT V1 =================
(function(){
  let practiceCache=[], practiceDownloads=[], practiceLoaded=false;
  const el=id=>document.getElementById(id);
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  async function prpc(name,args){const c=window.avpSupabase||window.supabaseClient;if(!c||!c.rpc)throw new Error('Supabase chưa sẵn sàng');const {data,error}=await c.rpc(name,args||{});if(error)throw error;return data}
  function ptoast(text){const t=document.getElementById('adminToast');if(!t)return;t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
  function practiceCategories(){return [...new Set(practiceCache.map(x=>x.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'vi'))}
  function renderPracticeCategorySelect(){const s=el('adminPracticeCategory');if(!s)return;const keep=s.value;s.innerHTML='<option value="">Tất cả chủ đề</option>'+practiceCategories().map(x=>`<option>${esc(x)}</option>`).join('');s.value=keep}
  function stateLabel(r){if(!r.is_active)return ['Đang ẩn','hidden'];if(r.status==='draft')return ['Bản nháp','draft'];if(r.status==='archived')return ['Lưu trữ','archived'];return ['Đang hiện','live']}
  function renderPractice(rows){practiceCache=Array.isArray(rows)?rows:[];renderPracticeCategorySelect();const body=el('adminPracticeBody');if(!body)return;if(!practiceCache.length){body.innerHTML='<tr><td colspan="7" class="admin-users-empty">Không tìm thấy bài.</td></tr>';return}body.innerHTML=practiceCache.map(r=>{const st=stateLabel(r);return `<tr data-practice-id="${esc(r.id)}"><td><b>${String(r.lesson_number||0).padStart(2,'0')}</b></td><td><div class="admin-practice-name"><strong>${esc(r.icon||'📘')} ${esc(r.title)}</strong><small>${esc(r.category)} · ID: ${esc(r.id)}</small></div></td><td><span class="admin-practice-level">${esc(r.level||'—')}</span></td><td><div class="admin-practice-file">${r.source_path?esc(r.download_title||r.source_path):'— Chưa có file —'}</div></td><td><b>${Number(r.vote_count||0)}</b><small style="display:block;color:#718078">Hôm nay ${Number(r.today_votes||0)}</small></td><td><span class="admin-practice-state ${st[1]}">${st[0]}</span></td><td><div class="admin-practice-actions"><button data-practice-act="edit">Sửa</button><button data-practice-act="toggle">${r.is_active?'Ẩn':'Hiện'}</button><button data-practice-act="archive" class="danger">Lưu trữ</button></div></td></tr>`}).join('')}
  async function loadPracticeDownloads(){try{practiceDownloads=await prpc('admin_practice_download_options',{p_search:''})||[]}catch(e){practiceDownloads=[]}const s=el('practiceEditDownload');if(s){const keep=s.value;s.innerHTML='<option value="">— Chưa gắn file —</option>'+practiceDownloads.map(r=>`<option value="${esc(r.id)}">${esc(r.title)} · ${esc(r.source_path)}</option>`).join('');s.value=keep}}
  async function loadPractice(){const notice=el('adminPracticeNotice');try{const q=el('adminPracticeSearch')?.value?.trim()||'',cat=el('adminPracticeCategory')?.value||'',status=el('adminPracticeStatus')?.value||'all';const [summary,rows]=await Promise.all([prpc('admin_practice_summary'),prpc('admin_practice_list',{p_search:q,p_category:cat,p_status:status,p_limit:700})]);el('practiceKpiTotal').textContent=summary?.total??0;el('practiceKpiLive').textContent=summary?.live??0;el('practiceKpiHidden').textContent=summary?.hidden??0;el('practiceKpiCategories').textContent=summary?.categories??0;renderPractice(rows);practiceLoaded=true;if(notice)notice.hidden=true;if(!practiceDownloads.length)await loadPracticeDownloads()}catch(e){console.warn('practice manager',e);if(notice){notice.hidden=false;notice.innerHTML='Chưa dùng được Kho bài tập động. Hãy chạy <code>ADMIN-PRACTICE-LIBRARY-V1.sql</code> trong Supabase rồi tải lại.'}}}
  function openPracticeEditor(r){const ed=el('adminPracticeEditor');if(!ed)return;ed.hidden=false;el('adminPracticeEditorTitle').textContent=r?'Sửa bài':'Thêm bài';el('practiceEditOriginalId').value=r?.id||'';el('practiceEditId').value=r?.id||'';el('practiceEditNumber').value=r?.lesson_number||1;el('practiceEditIcon').value=r?.icon||'📘';el('practiceEditTitle').value=r?.title||'';el('practiceEditCategory').value=r?.category||'';el('practiceEditSkill').value=r?.skill||'';el('practiceEditLevel').value=r?.level||'Cơ bản';el('practiceEditDownload').value=r?.download_asset_id||'';el('practiceEditVideo').value=r?.video_url||'';el('practiceEditBadge').value=r?.badge||'';el('practiceEditStatus').value=r?.status||'published';el('practiceEditActive').checked=r?!!r.is_active:true;el('practiceEditOrder').value=r?.sort_order||0;ed.scrollIntoView({behavior:'smooth',block:'nearest'})}
  function closePracticeEditor(){if(el('adminPracticeEditor'))el('adminPracticeEditor').hidden=true}
  async function savePractice(){const b=el('adminPracticeSave');b.disabled=true;try{const payload={p_original_id:el('practiceEditOriginalId').value||null,p_id:el('practiceEditId').value.trim(),p_lesson_number:Number(el('practiceEditNumber').value||0),p_icon:el('practiceEditIcon').value.trim(),p_title:el('practiceEditTitle').value.trim(),p_category:el('practiceEditCategory').value.trim(),p_skill:el('practiceEditSkill').value.trim(),p_level:el('practiceEditLevel').value,p_download_asset_id:el('practiceEditDownload').value||null,p_video_url:el('practiceEditVideo').value.trim()||null,p_badge:el('practiceEditBadge').value||null,p_status:el('practiceEditStatus').value,p_is_active:el('practiceEditActive').checked,p_sort_order:Number(el('practiceEditOrder').value||0)};if(!payload.p_id||!payload.p_title)throw new Error('Thiếu ID hoặc tên bài');await prpc('admin_practice_save',payload);ptoast('Đã lưu bài');closePracticeEditor();await loadPractice()}catch(e){console.warn(e);toast(e.message||'Không lưu được bài')}finally{b.disabled=false}}
  function bindPractice(){el('adminPracticeAdd')?.addEventListener('click',async()=>{if(!practiceDownloads.length)await loadPracticeDownloads();openPracticeEditor(null)});el('adminPracticeClose')?.addEventListener('click',closePracticeEditor);el('adminPracticeCancel')?.addEventListener('click',closePracticeEditor);el('adminPracticeSave')?.addEventListener('click',savePractice);el('adminPracticeReload')?.addEventListener('click',loadPractice);el('adminPracticeSearch')?.addEventListener('keydown',e=>{if(e.key==='Enter')loadPractice()});el('adminPracticeCategory')?.addEventListener('change',loadPractice);el('adminPracticeStatus')?.addEventListener('change',loadPractice);el('adminPracticeBody')?.addEventListener('click',async e=>{const btn=e.target.closest('[data-practice-act]');if(!btn)return;const tr=btn.closest('tr'),id=tr?.dataset.practiceId,row=practiceCache.find(x=>x.id===id);if(!row)return;const act=btn.dataset.practiceAct;if(act==='edit'){if(!practiceDownloads.length)await loadPracticeDownloads();openPracticeEditor(row);return}if(act==='toggle'){btn.disabled=true;try{await prpc('admin_practice_set_active',{p_id:id,p_active:!row.is_active});toast(row.is_active?'Đã ẩn bài':'Đã hiện bài');await loadPractice()}catch(err){ptoast('Không đổi được trạng thái');btn.disabled=false}return}if(act==='archive'){if(!confirm('Lưu trữ bài này? Bài sẽ biến khỏi trang học nhưng dữ liệu vote cũ vẫn giữ.'))return;btn.disabled=true;try{await prpc('admin_practice_archive',{p_id:id});ptoast('Đã lưu trữ bài');await loadPractice()}catch(err){ptoast('Không lưu trữ được');btn.disabled=false}}});document.querySelectorAll('[data-admin-view="practice"]').forEach(btn=>btn.addEventListener('click',()=>{if(!practiceLoaded)loadPractice()}))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindPractice);else bindPractice();
})();
