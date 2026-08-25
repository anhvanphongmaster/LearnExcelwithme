
(() => {
  const hero = document.querySelector(".avp-hero");
  const orb = document.getElementById("avpOrb");
  const typing = document.getElementById("avpTyping");

  // Bỏ LED theo chuột / tilt 3D — gây lag trên máy yếu và điện thoại
  if (orb) orb.style.display = "none";

  /* Typing slogans — RAF mượt */
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
    let line = 0, char = 0, deleting = false, last = 0, holdUntil = 0;
    const TYPE_MS = 36, DEL_MS = 22, HOLD_MS = 2400, GAP_MS = 380;
    function render(){ typing.textContent = (lines[line]||"").slice(0,char); }
    function frame(now){
      requestAnimationFrame(frame);
      const current = lines[line]||"";
      if (!current) return;
      if (holdUntil && now < holdUntil) return;
      if (holdUntil && now >= holdUntil) holdUntil = 0;
      if (!deleting){
        if (now - last < TYPE_MS) return;
        last = now; char = Math.min(current.length, char+1); render();
        if (char >= current.length){ deleting = true; holdUntil = now + HOLD_MS; }
      } else {
        if (now - last < DEL_MS) return;
        last = now; char = Math.max(0, char-1); render();
        if (char <= 0){ deleting = false; line = (line+1)%lines.length; holdUntil = now + GAP_MS; }
      }
    }
    typing.textContent = "";
    clearTimeout(window.__avpTypingTimer);
    if (window.__avpTypingRaf) cancelAnimationFrame(window.__avpTypingRaf);
    window.__avpTypingTimer = setTimeout(function(){ last = performance.now(); window.__avpTypingRaf = requestAnimationFrame(frame); }, 300);
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

    const challengeXP=challengeCorrect*5;
    const roadmapXP=roadmapDone*15;
    const xp=
      Math.min(6,uniqueCount(courses))*20+
      pgDone*10+
      quiz*10+
      bonus+
      challengeXP+
      roadmapXP;

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

    root.setAttribute(
      "aria-label",
      `Đã mở khóa ${unlockedCount}/${badges.length} huy hiệu`
    );

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
            await client?.auth?.signOut({scope:"local"});
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
        return;
      }

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

      client.auth.onAuthStateChange(async (_event,session)=>{
        const nextUser=session?.user || null;
        applyHomePanelUser(nextUser,null);
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
