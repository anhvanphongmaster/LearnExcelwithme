(() => {
  const orb = document.getElementById("avpOrb");
  const typing = document.getElementById("avpTyping");

  if (orb) orb.style.display = "none";

  if (typing) {
    const lines = [
      "100+ công thức Excel đang chờ bạn",
      "Excel • Office • Productivity",
      "Học nhanh hơn. Làm việc thông minh hơn.",
      "Từ dữ liệu thô → báo cáo chuyên nghiệp",
      "Thực hành theo video • File mẫu sẵn",
      "Power Query • Pivot • Dashboard",
      "Làm sạch dữ liệu trong vài bước",
      "Đua top học viên trên Excel Race",
      "Tự động hóa — ít click, nhiều kết quả",
      "Beginner → Master: một lộ trình rõ ràng"
    ];
    let line = 0, char = 0, deleting = false, timer = null;
    const TYPE_MS = 42, DEL_MS = 26, HOLD_MS = 2300, GAP_MS = 360;

    function render(){ typing.textContent = (lines[line] || "").slice(0, char); }
    function schedule(ms){ clearTimeout(timer); timer = setTimeout(step, ms); }
    function step(){
      if (document.hidden) { schedule(500); return; }
      const current = lines[line] || "";
      if (!current) { schedule(500); return; }
      if (!deleting) {
        char = Math.min(current.length, char + 1);
        render();
        if (char >= current.length) {
          deleting = true;
          schedule(HOLD_MS);
        } else schedule(TYPE_MS);
      } else {
        char = Math.max(0, char - 1);
        render();
        if (char <= 0) {
          deleting = false;
          line = (line + 1) % lines.length;
          schedule(GAP_MS);
        } else schedule(DEL_MS);
      }
    }

    typing.textContent = "";
    clearTimeout(window.__avpTypingTimer);
    if (window.__avpTypingRaf) cancelAnimationFrame(window.__avpTypingRaf);
    window.__avpTypingTimer = setTimeout(step, 300);
    window.addEventListener("pagehide", () => clearTimeout(timer), { once:true });
  }
})();

/* ===== HOME EARNED BADGES ===== */
(function(){
  const rootId="homeEarnedBadges";

  function read(key,fallback){
    try{
      const raw=localStorage.getItem(key);
      return raw===null ? fallback : JSON.parse(raw);
    }catch{
      return fallback;
    }
  }

  function uniqueCount(arr){
    return Array.isArray(arr) ? new Set(arr.map(Number)).size : 0;
  }

  function getStreak(days){
    if(!Array.isArray(days) || !days.length) return 0;
    const unique=[...new Set(days)].sort().reverse();
    let streak=1;
    for(let i=1;i<unique.length;i++){
      const prev=new Date(unique[i-1]+"T00:00:00");
      const curr=new Date(unique[i]+"T00:00:00");
      const diff=Math.round((prev-curr)/86400000);
      if(diff===1) streak++;
      else break;
    }
    return streak;
  }

  function getAllHomeBadges(){
    const courses=read("completedCourses",[]);
    const pg=read("avp_playground_progress_v1",{});
    const pgDone=Object.values(pg||{}).filter(Boolean).length;
    const quiz=Math.min(5,Number(localStorage.getItem("quizBestScore")||0)||0);
    const challenge=read("avp_excel_challenge_stats_v1",{});
    const challengeCorrect=uniqueCount(challenge.correctUnique);
    const challengeScore=Number(challenge.score)||0;
    const activityDays=read("avp_activity_days_v1",[]);
    const streak=getStreak(activityDays);
    const roadmap=read("avpLearningPath30",[]);
    const roadmapDone=uniqueCount(roadmap);
    const bonus=Number(localStorage.getItem("avp_bonus_xp_v1")||0)||0;
    const xp=
      Math.min(6,uniqueCount(courses))*20+
      pgDone*10+
      quiz*10+
      bonus+
      challengeCorrect*5+
      roadmapDone*15;

    return [
      {icon:"🌱",name:"Bước đầu tiên",ok:uniqueCount(courses)>=1},
      {icon:"🧪",name:"Formula Rookie",ok:pgDone>=3},
      {icon:"🏆",name:"Playground Master",ok:pgDone>=10},
      {icon:"📚",name:"Excel Journey",ok:uniqueCount(courses)>=6},
      {icon:"🎯",name:"Quiz Ace",ok:quiz>=4},
      {icon:"🧠",name:"Challenge Starter",ok:challengeCorrect>=1},
      {icon:"🔥",name:"Challenge 10",ok:challengeCorrect>=10},
      {icon:"👑",name:"Challenge Master",ok:challengeCorrect>=25},
      {icon:"💯",name:"Challenge 280",ok:challengeScore>=280},
      {icon:"🔥",name:"3-Day Streak",ok:streak>=3},
      {icon:"💎",name:"Office Pro",ok:xp>=300}
    ];
  }

  function renderHomeBadges(){
    const root=document.getElementById(rootId);
    if(!root) return;
    const badges=getAllHomeBadges();
    const unlockedCount=badges.filter(b=>b.ok).length;
    root.innerHTML=badges.map(b=>`
      <span
        class="home-earned-badge ${b.ok ? "is-unlocked" : "is-locked"}"
        title="${b.name}${b.ok ? " · Đã đạt" : " · Chưa đạt"}"
        aria-label="${b.name} - ${b.ok ? "Đã đạt" : "Chưa đạt"}"
      >${b.icon}</span>
    `).join("");
    root.setAttribute("aria-label",`Đã mở khóa ${unlockedCount}/${badges.length} huy hiệu`);
    root.title=`Đã mở khóa ${unlockedCount}/${badges.length} huy hiệu`;
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",renderHomeBadges,{once:true});
  }else{
    renderHomeBadges();
  }
  window.addEventListener("storage",renderHomeBadges);
  window.addEventListener("avp:cloud-progress-loaded",renderHomeBadges);
  window.addEventListener("avp:challenge-updated",renderHomeBadges);
  window.addEventListener("avp:learning-path-updated",renderHomeBadges);
})();

/* ===== HOME PANEL USER AVATAR ===== */
(function(){
  function initialsFromName(name){
    const parts=String(name||"").trim().split(/\s+/).filter(Boolean);
    if(!parts.length) return "A";
    if(parts.length===1) return parts[0].slice(0,1).toUpperCase();
    return (parts[0][0]+parts[parts.length-1][0]).toUpperCase();
  }

  function applyHomePanelUser(user, profile){
    const avatar=document.getElementById("homePanelAvatar");
    const nameEl=document.getElementById("homePanelUserName");
    const meta=document.getElementById("homePanelUserMeta");
    if(!avatar || !nameEl) return;

    const displayName=
      profile?.display_name ||
      user?.user_metadata?.display_name ||
      user?.user_metadata?.full_name ||
      user?.email?.split("@")[0] ||
      "Người học Excel";

    const avatarUrl=
      profile?.avatar_url ||
      user?.user_metadata?.avatar_url ||
      user?.user_metadata?.picture ||
      "";

    nameEl.textContent=displayName;
    if(meta){
      meta.textContent=user
        ? "Tiến độ & huy hiệu của bạn"
        : "Đăng nhập để đồng bộ tiến độ";
    }

    const loginBtn=document.getElementById("homePanelLoginBtn");
    if(loginBtn){
      loginBtn.hidden=false;
      if(user){
        loginBtn.textContent="Đăng xuất";
        loginBtn.href="#";
        loginBtn.classList.add("is-logout");
        loginBtn.onclick=async (e)=>{
          e.preventDefault();
          if(loginBtn.dataset.busy==="1") return;
          loginBtn.dataset.busy="1";
          loginBtn.textContent="Đang đăng xuất...";
          if(typeof window.avpLogout==="function"){
            await window.avpLogout();
            return;
          }
          try{
            await window.avpSupabase?.auth?.signOut({scope:"local"});
          }catch{}
          location.href="index.html";
        };
      }else{
        loginBtn.textContent="Đăng nhập / Đăng ký";
        loginBtn.href="auth.html?redirect=index.html";
        loginBtn.classList.remove("is-logout");
        loginBtn.onclick=null;
        delete loginBtn.dataset.busy;
      }
    }

    avatar.innerHTML="";
    if(avatarUrl){
      const img=document.createElement("img");
      img.src=avatarUrl;
      img.alt=displayName;
      img.loading="lazy";
      img.referrerPolicy="no-referrer";
      img.addEventListener("error",()=>{
        avatar.textContent=initialsFromName(displayName);
      },{once:true});
      avatar.appendChild(img);
    }else{
      avatar.textContent=initialsFromName(displayName);
    }
  }

  async function loadHomePanelUser(){
    let waited=0;
    while(!window.avpSupabase && waited<3000){
      if(window.AVP_SUPABASE_CONFIGURED===false) break;
      await new Promise(r=>setTimeout(r,80));
      waited+=80;
    }

    const client=window.avpSupabase;
    if(!client){
      applyHomePanelUser(null,null);
      return;
    }

    try{
      const {data}=await client.auth.getSession();
      const user=data?.session?.user || null;
      if(!user){
        applyHomePanelUser(null,null);
      }else{
        let profile=null;
        try{
          const result=await client
            .from("profiles")
            .select("display_name, avatar_url")
            .eq("id",user.id)
            .maybeSingle();
          profile=result?.data || null;
        }catch(e){}
        applyHomePanelUser(user,profile);
      }

      client.auth.onAuthStateChange(async (_event,session)=>{
        const nextUser=session?.user || null;
        applyHomePanelUser(nextUser,null);
        try{window.dispatchEvent(new CustomEvent("avp:home-auth-change"));}catch{}
      });
    }catch(e){
      applyHomePanelUser(null,null);
    }
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",loadHomePanelUser,{once:true});
  }else{
    loadHomePanelUser();
  }
})();

/* ===== HOME AVP ROBOT — COMPOSITOR PATROL V3 + CHAT STABILITY ===== */
(function(){
  const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  if(page!=="index.html") return;
  if(window.__avpHomeRobotSmoothV3) return;
  window.__avpHomeRobotSmoothV3=true;

  const PAD=16;
  const SPEED=42;
  const POS_KEY="avp_bot_walk_x_v3";
  let root=null, fab=null, motion=null, direction=1, ready=false;
  let chatWantedOpen=false;
  let resumeTimer=null;
  let chatRestoreTimer=null;

  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

  function maxX(){
    if(!root) return PAD;
    return Math.max(PAD,window.innerWidth-(root.offsetWidth||64)-PAD);
  }

  function getChatPanel(){
    return [
      document.getElementById("avpChatPanel"),
      document.getElementById("avpAdminFloatPanel"),
      document.getElementById("avpGuestChatPanel")
    ].find(Boolean) || null;
  }

  function chatPanelOpen(){
    const panel=getChatPanel();
    return !!(panel && !panel.hidden);
  }

  function setSide(){
    if(!root) return;
    const r=root.getBoundingClientRect();
    const onLeft=(r.left+r.width/2)<window.innerWidth/2;
    root.classList.toggle("is-left",onLeft);
    root.classList.toggle("is-right",!onLeft);
  }

  function saveState(left){
    try{
      localStorage.setItem(POS_KEY,JSON.stringify({x:Math.round(left),dir:direction}));
    }catch{}
  }

  function freezeAtCurrent(){
    if(!root) return PAD;
    const r=root.getBoundingClientRect();
    const left=clamp(r.left,PAD,maxX());
    if(motion){
      try{motion.cancel();}catch(_){ }
      motion=null;
    }
    root.style.transform="none";
    root.style.left=Math.round(left)+"px";
    root.style.right="auto";
    root.style.top="auto";
    root.style.bottom=PAD+"px";
    root.classList.remove("avp-smooth-moving");
    setSide();
    saveState(left);
    return left;
  }

  function canMove(){
    return !!root &&
      !document.hidden &&
      !root.classList.contains("open") &&
      !root.classList.contains("is-dragging") &&
      !root.classList.contains("is-lifted") &&
      !chatPanelOpen();
  }

  function patrol(fromLeft,dir){
    if(!canMove()) return;
    const start=clamp(Number(fromLeft)||root.getBoundingClientRect().left,PAD,maxX());
    const target=dir>0?maxX():PAD;
    const delta=target-start;

    direction=dir>0?1:-1;
    root.classList.toggle("face-left",direction<0);
    root.classList.add("avp-smooth-moving");
    root.style.left=Math.round(start)+"px";
    root.style.right="auto";
    root.style.top="auto";
    root.style.bottom=PAD+"px";
    root.style.transform="translate3d(0,0,0)";
    setSide();

    if(Math.abs(delta)<2){
      direction*=-1;
      clearTimeout(resumeTimer);
      resumeTimer=setTimeout(()=>patrol(start,direction),80);
      return;
    }

    if(!root.animate){
      root.style.left=Math.round(target)+"px";
      direction*=-1;
      clearTimeout(resumeTimer);
      resumeTimer=setTimeout(()=>patrol(target,direction),120);
      return;
    }

    motion=root.animate(
      [
        {transform:"translate3d(0,0,0)"},
        {transform:`translate3d(${delta}px,0,0)`}
      ],
      {
        duration:Math.max(1800,Math.abs(delta)/SPEED*1000),
        easing:"linear",
        fill:"forwards"
      }
    );

    motion.onfinish=()=>{
      if(!root) return;
      const safeTarget=clamp(target,PAD,maxX());
      root.style.left=Math.round(safeTarget)+"px";
      root.style.transform="none";
      try{motion.cancel();}catch(_){ }
      motion=null;
      direction*=-1;
      root.classList.remove("avp-smooth-moving");
      setSide();
      saveState(safeTarget);
      if(canMove()) patrol(safeTarget,direction);
    };
  }

  function resume(){
    clearTimeout(resumeTimer);
    if(!ready || !canMove() || motion) return;
    const left=clamp(root.getBoundingClientRect().left,PAD,maxX());
    root.style.left=Math.round(left)+"px";
    if(left>=maxX()-3) direction=-1;
    else if(left<=PAD+3) direction=1;
    patrol(left,direction);
  }

  function retryRestoreChat(){
    clearTimeout(chatRestoreTimer);
    let tries=0;
    const check=()=>{
      if(!chatWantedOpen) return;
      const panel=getChatPanel();
      if(panel){
        if(panel.hidden){
          const bubble=document.getElementById("avpChatBubble");
          if(bubble) bubble.click();
        }
        freezeAtCurrent();
        return;
      }
      tries++;
      if(tries<18) chatRestoreTimer=setTimeout(check,140);
    };
    check();
  }

  function markChatClosed(){
    chatWantedOpen=false;
    clearTimeout(chatRestoreTimer);
    setTimeout(resume,120);
  }

  function bindChatStability(){
    window.addEventListener("avp:surface-open",e=>{
      const surface=e.detail?.surface;
      if(surface==="chat"){
        chatWantedOpen=true;
        freezeAtCurrent();
        retryRestoreChat();
      }else if(surface){
        chatWantedOpen=false;
      }
    });

    window.addEventListener("avp:chat-ready",()=>{
      if(chatWantedOpen) retryRestoreChat();
    });

    window.addEventListener("avp:home-auth-change",()=>{
      if(chatWantedOpen){
        setTimeout(retryRestoreChat,100);
        setTimeout(retryRestoreChat,450);
      }
    });

    document.addEventListener("click",e=>{
      if(e.target.closest?.("#avpChatClose,#avpAdminFloatClose,#avpGuestChatClose")){
        markChatClosed();
        return;
      }
      const action=e.target.closest?.('[data-edge-action="chat"]');
      if(action){
        setTimeout(()=>{
          if(chatPanelOpen()){
            chatWantedOpen=true;
            freezeAtCurrent();
          }else if(!document.getElementById("avpEdgeLauncher")?.classList.contains("open")){
            markChatClosed();
          }
        },80);
      }
    },true);
  }

  function init(){
    if(ready) return;
    root=document.getElementById("avpEdgeLauncher");
    fab=root?.querySelector("#avpEdgeMain");
    if(!root || !fab){ setTimeout(init,120); return; }
    ready=true;

    const r=root.getBoundingClientRect();
    let startLeft=clamp(r.left,PAD,maxX());
    try{
      const saved=JSON.parse(localStorage.getItem(POS_KEY)||"null");
      if(saved && Number.isFinite(saved.x)) startLeft=clamp(saved.x,PAD,maxX());
      if(saved?.dir===-1) direction=-1;
    }catch{}

    root.classList.remove("avp-robot-home","is-walking");
    root.classList.add("avp-robot-home-smooth");
    root.style.left=Math.round(startLeft)+"px";
    root.style.right="auto";
    root.style.top="auto";
    root.style.bottom=PAD+"px";
    root.style.transform="none";
    setSide();

    bindChatStability();

    fab.addEventListener("click",setSide,true);
    fab.addEventListener("pointerdown",()=>{ freezeAtCurrent(); },true);

    const afterPointer=()=>setTimeout(()=>{
      if(!root?.classList.contains("open") && !chatPanelOpen()){
        const left=freezeAtCurrent();
        direction=(left<window.innerWidth/2)?1:-1;
        resume();
      }
    },90);
    fab.addEventListener("pointerup",afterPointer);
    fab.addEventListener("pointercancel",afterPointer);

    fab.addEventListener("click",()=>setTimeout(()=>{
      if(root.classList.contains("open") || chatPanelOpen()) freezeAtCurrent();
      else resume();
    },0));

    document.addEventListener("visibilitychange",()=>{
      if(document.hidden) freezeAtCurrent();
      else if(chatWantedOpen) retryRestoreChat();
      else setTimeout(resume,80);
    });

    window.addEventListener("focus",()=>{
      if(chatWantedOpen) retryRestoreChat();
    });

    let resizeTimer=null;
    window.addEventListener("resize",()=>{
      clearTimeout(resizeTimer);
      const left=freezeAtCurrent();
      resizeTimer=setTimeout(()=>{
        const safe=clamp(left,PAD,maxX());
        root.style.left=Math.round(safe)+"px";
        setSide();
        if(!chatPanelOpen()) resume();
      },140);
    });

    window.addEventListener("pagehide",()=>{
      const left=freezeAtCurrent();
      saveState(left);
      clearTimeout(resumeTimer);
      clearTimeout(chatRestoreTimer);
    },{once:true});

    resume();
  }

  if(document.readyState==="complete") init();
  else window.addEventListener("load",()=>setTimeout(init,0),{once:true});
})();
