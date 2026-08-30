(() => {
  "use strict";

  const XPKEY = "avp_xp_v2";
  const QKEY = "avp_quiz_done_v1";
  const PKEY = "avp_lesson_progress_v1";

  const stages = [
    {
      id:"beginner", name:"Nền tảng", icon:"🌱",
      gate:"Mở ngay",
      lessons:[
        ["excel","excel.html","Kiến thức Excel cơ bản"],
        ["shortcuts","phimtatexcel.html","100 phím tắt Excel"],
        ["formula","congthucexcel.html","100 công thức Excel"],
        ["filter","filtersort.html","Filter & Sort"]
      ]
    },
    {
      id:"analyst", name:"Phân tích", icon:"📊",
      gate:"Hoàn thành 4 bài Nền tảng",
      lessons:[
        ["pivot","pivottable.html","PivotTable"],
        ["pareto","bieudopareto.html","Biểu đồ Pareto"],
        ["report","baocaoexcel.html","Báo cáo Excel / QC"]
      ]
    },
    {
      id:"advanced", name:"Dữ liệu & Dashboard", icon:"🚀",
      gate:"Hoàn thành 3 bài Phân tích",
      lessons:[
        ["advanced","excel-nang-cao.html","Excel nâng cao thực chiến"],
        ["powerquery","power-query-course.html","Power Query thực chiến"],
        ["dax","power-pivot-dax.html","Power Pivot & DAX"],
        ["dash","dashboard-dong.html","Dashboard động"],
        ["practice","practice-lab.html","Practice Lab"]
      ]
    },
    {
      id:"master", name:"Tự động hóa", icon:"🏆",
      gate:"Hoàn thành Advanced + đạt 300 XP",
      lessons:[
        ["vba","vba-macro.html","VBA / Macro"],
        ["solver","solver-whatif.html","What-If & Solver"]
      ]
    }
  ];

  const $ = id => document.getElementById(id);

  function json(key, fallback){
    try{
      const v = JSON.parse(localStorage.getItem(key) || "null");
      return v ?? fallback;
    }catch(e){
      return fallback;
    }
  }

  function xp(){
    const n = Number(localStorage.getItem(XPKEY) || 0);
    return Number.isFinite(n) ? n : 0;
  }

  function state(){
    const q = json(QKEY,{});
    const p = json(PKEY,{});

    function done(lesson){
      const id = lesson[0], url = lesson[1];
      return !!(p[id] || q[url]);
    }

    function stageDone(index){
      return stages[index].lessons.every(done);
    }

    function unlocked(index){
      if(index === 0) return true;
      if(index === 1) return stageDone(0);
      if(index === 2) return stageDone(1);
      if(index === 3) return stageDone(2) && xp() >= 300;
      return false;
    }

    const all = stages.flatMap(s => s.lessons);
    const doneCount = all.filter(done).length;
    const unlockedCount = stages.reduce((sum,s,i) => {
      return sum + (unlocked(i) ? s.lessons.length : 0);
    },0);

    let next = null;
    for(let i=0;i<stages.length;i++){
      if(!unlocked(i)) continue;
      const lesson = stages[i].lessons.find(l => !done(l));
      if(lesson){
        next = {stageIndex:i,stage:stages[i],lesson};
        break;
      }
    }

    return {q,p,done,stageDone,unlocked,all,doneCount,unlockedCount,next};
  }


  function localDateKey(){
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth()+1).padStart(2,"0"),
      String(d.getDate()).padStart(2,"0")
    ].join("-");
  }

  function dailyState(s){
    const key = "avp_skillmap_daily_v72_" + localDateKey();
    let saved = {};
    try{ saved = JSON.parse(localStorage.getItem(key) || "{}"); }catch(e){}

    if(typeof saved.xpBase !== "number"){
      saved.xpBase = xp();
      saved.doneBase = s.doneCount;
      saved.claimed = false;
      localStorage.setItem(key, JSON.stringify(saved));
    }

    const nextLesson = s.next?.lesson || null;
    const mission1Done = s.doneCount > (saved.doneBase || 0);
    const mission2Done = xp() >= (saved.xpBase || 0) + 20;
    const quizMap = json(QKEY,{});
    const mission3Done = Object.keys(quizMap).length > Number(saved.quizBase || 0);

    if(saved.quizBase == null){
      saved.quizBase = Object.keys(quizMap).length;
      localStorage.setItem(key, JSON.stringify(saved));
    }

    return {
      key,
      saved,
      missions:[
        {
          icon:"🎯",
          title:nextLesson ? "Hoàn thành 1 node kỹ năng" : "Ôn lại 1 node bất kỳ",
          desc:nextLesson ? "Ưu tiên: " + nextLesson[2] : "Bạn đã hoàn thành Skill Map, hãy ôn lại một kỹ năng.",
          done:mission1Done
        },
        {
          icon:"⚡",
          title:"Kiếm thêm 20 XP",
          desc:"Học, làm quiz hoặc nhận thưởng checkpoint.",
          done:mission2Done
        },
        {
          icon:"🧠",
          title:"Hoàn thành thêm 1 Quiz",
          desc:"Củng cố kiến thức bằng một bài kiểm tra ngắn.",
          done:mission3Done
        }
      ]
    };
  }

  function renderDaily(s){
    const d = dailyState(s);
    const list = $("smMissionList");
    if(!list) return;

    list.innerHTML = d.missions.map((m,i)=>`
      <div class="sm-mission ${m.done ? "done" : ""}">
        <div class="sm-mission-icon">${m.icon}</div>
        <div>
          <strong>${m.title}</strong>
          <small>${m.desc}</small>
        </div>
        <div class="sm-mission-status">${m.done ? "✓ Xong" : "Chưa xong"}</div>
      </div>
    `).join("");

    const doneCount = d.missions.filter(m=>m.done).length;
    $("smMissionCount").textContent = doneCount + "/3";
    $("smMissionRing").style.setProperty("--mission-pct",(doneCount/3*100)+"%");

    const claim = $("smDailyClaim");
    if(d.saved.claimed){
      claim.disabled = true;
      claim.textContent = "✓ Đã nhận +25 XP";
    }else if(doneCount === 3){
      claim.disabled = false;
      claim.textContent = "Nhận +25 XP";
    }else{
      claim.disabled = true;
      claim.textContent = "Chưa đủ điều kiện";
    }

    claim.onclick = () => {
      const latest = dailyState(state());
      if(latest.saved.claimed) return;
      if(latest.missions.filter(m=>m.done).length < 3) return;

      latest.saved.claimed = true;
      localStorage.setItem(latest.key,JSON.stringify(latest.saved));
      localStorage.setItem(XPKEY,String(xp()+25));
      render();
    };
  }


  function weekKey(){
    const d = new Date();
    const day = (d.getDay()+6)%7;
    const monday = new Date(d);
    monday.setDate(d.getDate()-day);
    monday.setHours(0,0,0,0);
    return [
      monday.getFullYear(),
      String(monday.getMonth()+1).padStart(2,"0"),
      String(monday.getDate()).padStart(2,"0")
    ].join("-");
  }

  function weekEndsIn(){
    const now = new Date();
    const day = (now.getDay()+6)%7;
    const end = new Date(now);
    end.setDate(now.getDate() + (6-day));
    end.setHours(23,59,59,999);
    const ms = Math.max(0,end-now);
    const days = Math.floor(ms/86400000);
    const hours = Math.floor((ms%86400000)/3600000);
    return days + "d " + hours + "h";
  }

  function bossState(s){
    const key = "avp_skillmap_boss_v73_" + weekKey();
    let saved = {};
    try{ saved = JSON.parse(localStorage.getItem(key) || "{}"); }catch(e){}

    if(saved.baseDone == null){
      saved.baseDone = s.doneCount;
      saved.baseXP = xp();
      saved.defeated = false;
      saved.rewarded = false;
      localStorage.setItem(key,JSON.stringify(saved));
    }

    const doneDelta = Math.max(0,s.doneCount - Number(saved.baseDone||0));
    const xpDelta = Math.max(0,xp() - Number(saved.baseXP||0));

    const m1 = doneDelta >= 2;
    const m2 = xpDelta >= 60;
    const m3 = s.doneCount >= Math.max(3, Math.ceil(s.all.length*.35));

    const damage =
      (m1 ? 35 : Math.min(30,doneDelta*15)) +
      (m2 ? 35 : Math.min(30,Math.floor(xpDelta/10)*5)) +
      (m3 ? 30 : 0);

    const hp = Math.max(0,100-damage);

    if(hp===0 && !saved.defeated){
      saved.defeated = true;
      localStorage.setItem(key,JSON.stringify(saved));
    }

    return {
      key,saved,hp,damage,
      missions:[
        {icon:"🧩",title:"Hoàn thành 2 node",desc:"Mỗi node gây sát thương Boss.",done:m1,dmg:m1?35:Math.min(30,doneDelta*15)},
        {icon:"⚡",title:"Kiếm 60 XP tuần",desc:"XP từ học, quiz và checkpoint đều được tính.",done:m2,dmg:m2?35:Math.min(30,Math.floor(xpDelta/10)*5)},
        {icon:"🏆",title:"Đạt mốc tiến độ",desc:"Hoàn thành ít nhất 35% Skill Map.",done:m3,dmg:m3?30:0}
      ]
    };
  }

  function renderBoss(s){
    const b = bossState(s);
    $("smBossHpFill").style.width = b.hp + "%";
    $("smBossHpText").textContent = b.hp + " HP";
    $("smBossStatus").textContent = b.hp===0 ? "Boss đã bị hạ!" : "Đã gây " + b.damage + " sát thương";
    $("smBossMissions").innerHTML = b.missions.map(m=>`
      <div class="sm-boss-mission ${m.done?"done":""}">
        <div class="sm-boss-mission-icon">${m.icon}</div>
        <div>
          <strong>${m.title}</strong>
          <small>${m.desc}</small>
        </div>
        <div class="sm-boss-dmg">${m.done?"✓ ":""}${m.dmg} DMG</div>
      </div>
    `).join("");

    const attack = $("smBossAttack");
    if(b.hp===0 && !b.saved.rewarded){
      attack.disabled = false;
      attack.textContent = "🎁 Nhận +100 XP";
    }else if(b.hp===0 && b.saved.rewarded){
      attack.disabled = true;
      attack.textContent = "✓ Đã nhận thưởng";
    }else{
      attack.disabled = true;
      attack.textContent = "⚔️ " + b.damage + "/100 DMG";
    }

    attack.onclick = () => {
      const latest = bossState(state());
      if(latest.hp!==0 || latest.saved.rewarded) return;
      latest.saved.rewarded = true;
      localStorage.setItem(latest.key,JSON.stringify(latest.saved));
      localStorage.setItem(XPKEY,String(xp()+100));
      document.querySelector(".sm-boss-card")?.classList.add("boss-defeated");
      setTimeout(()=>render(),650);
    };
  }

  function leagueScore(s){
    const dailyBonus = Object.keys(localStorage)
      .filter(k=>k.startsWith("avp_skillmap_daily_v72_"))
      .reduce((sum,k)=>{
        try{
          const v=JSON.parse(localStorage.getItem(k)||"{}");
          return sum + (v.claimed?25:0);
        }catch(e){return sum}
      },0);

    return s.doneCount*120 + xp() + dailyBonus;
  }

  function supabaseClient(){
    return window.avpSupabase || window.supabaseClient || null;
  }

  async function syncRealLeague(s){
    const sb = supabaseClient();
    const note = $("smLeagueNote");
    const board = $("smLeagueBoard");

    if(!sb){
      if(note) note.textContent = "Chưa kết nối được Supabase. League sẽ tự đồng bộ khi kết nối sẵn sàng.";
      return null;
    }

    const score = leagueScore(s);
    $("smLeagueScore").textContent = score.toLocaleString("vi-VN");
    $("smLeagueTime").textContent = weekEndsIn();

    try{
      const { data: sessionData } = await sb.auth.getSession();
      const user = sessionData?.session?.user || null;

      if(!user){
        if(note) note.textContent = "Đăng nhập để ghi điểm vào League tuần. Bạn vẫn có thể xem BXH cộng đồng.";
      }else{
        await sb.rpc("weekly_league_upsert_v74",{
          p_score:score,
          p_xp:xp(),
          p_completed:s.doneCount
        });
      }

      const {data:top,error:topError} = await sb.rpc("weekly_league_top_v74",{p_limit:10});
      if(topError) throw topError;

      const rows = Array.isArray(top) ? top : [];
      if(!rows.length){
        board.innerHTML = '<div class="sm-league-empty">Chưa có người chơi trong League tuần này.</div>';
      }else{
        board.innerHTML = rows.map((u,i)=>{
          const isYou = !!(user && u.user_id === user.id);
          const cls = [
            "sm-league-row",
            isYou ? "you" : "",
            i===0 ? "top1" : i===1 ? "top2" : i===2 ? "top3" : ""
          ].filter(Boolean).join(" ");

          return `
            <div class="${cls}">
              <div class="sm-league-pos">#${i+1}</div>
              <div class="sm-league-user">
                <strong>${escapeLeague(u.display_name || "Học viên")}</strong>
                <small>${isYou ? "Bạn • " : ""}${escapeLeague(u.tier || "Bronze")}</small>
              </div>
              <div class="sm-league-score">${Number(u.score||0).toLocaleString("vi-VN")}</div>
            </div>
          `;
        }).join("");
      }

      if(user){
        const {data:mine,error:mineError} = await sb.rpc("weekly_league_my_rank_v74");
        if(mineError) throw mineError;

        const me = Array.isArray(mine) ? mine[0] : mine;
        if(me){
          $("smLeagueRank").textContent = "#" + Number(me.rank||0);
          $("smLeagueTier").textContent = me.tier || "Bronze";
        }
        if(note) note.textContent = "BXH cộng đồng thật • Tự reset theo tuần • Điểm được đồng bộ khi bạn mở Skill Map.";
      }else{
        $("smLeagueRank").textContent = "#--";
        $("smLeagueTier").textContent = "Guest";
      }

      return rows;
    }catch(err){
      console.error("[SkillMap V74 League]",err);
      if(note) note.textContent = "League chưa đồng bộ được. Kiểm tra SQL V74/RPC rồi tải lại trang.";
      return null;
    }
  }

  function escapeLeague(v){
    return String(v ?? "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  function renderLeague(s){
    const score = leagueScore(s);
    $("smLeagueScore").textContent = score.toLocaleString("vi-VN");
    $("smLeagueTier").textContent =
      score>=2400 ? "Diamond" :
      score>=1500 ? "Gold" :
      score>=800 ? "Silver" : "Bronze";
    $("smLeagueTime").textContent = weekEndsIn();
    $("smLeagueRank").textContent = "#--";

    const board = $("smLeagueBoard");
    board.classList.add("sm-league-syncing");
    board.innerHTML = '<div class="sm-league-empty">Đang tải League tuần…</div>';

    clearTimeout(window.__avpLeagueSync);
    window.__avpLeagueSync = setTimeout(async()=>{
      await syncRealLeague(s);
      board.classList.remove("sm-league-syncing");
    },250);
  }


  function dateOnlyLocal(offsetDays){
    const d = new Date();
    d.setDate(d.getDate()+offsetDays);
    return [
      d.getFullYear(),
      String(d.getMonth()+1).padStart(2,"0"),
      String(d.getDate()).padStart(2,"0")
    ].join("-");
  }

  async function maybeTouchStudyActivity(s){
    const sb = supabaseClient();
    if(!sb) return;

    try{
      const {data:sessionData} = await sb.auth.getSession();
      const user = sessionData?.session?.user;
      if(!user) return;

      const key = "avp_study_snapshot_v75_" + user.id;
      let prev = {};
      try{ prev = JSON.parse(localStorage.getItem(key) || "{}"); }catch(e){}

      const nowSnapshot = {
        done:s.doneCount,
        xp:xp(),
        quiz:Object.keys(json(QKEY,{})).length
      };

      if(prev.done == null){
        localStorage.setItem(key,JSON.stringify(nowSnapshot));
        return;
      }

      const dDone = Math.max(0,nowSnapshot.done-Number(prev.done||0));
      const dXp = Math.max(0,nowSnapshot.xp-Number(prev.xp||0));
      const dQuiz = Math.max(0,nowSnapshot.quiz-Number(prev.quiz||0));

      if(dDone>0 || dXp>0 || dQuiz>0){
        await sb.rpc("study_activity_touch_v75",{
          p_nodes:dDone,
          p_xp:dXp,
          p_quiz:dQuiz
        });
        localStorage.setItem(key,JSON.stringify(nowSnapshot));
      }
    }catch(err){
      console.warn("[SkillMap V75 activity]",err);
    }
  }

  function renderStreakWeek(activeDates){
    const container = $("smStreakWeek");
    if(!container) return;

    const days = ["T2","T3","T4","T5","T6","T7","CN"];
    const today = new Date();
    const iso = (today.getDay()+6)%7;
    const monday = new Date(today);
    monday.setDate(today.getDate()-iso);

    const activeSet = new Set(activeDates || []);

    container.innerHTML = days.map((label,i)=>{
      const d = new Date(monday);
      d.setDate(monday.getDate()+i);
      const key = [
        d.getFullYear(),
        String(d.getMonth()+1).padStart(2,"0"),
        String(d.getDate()).padStart(2,"0")
      ].join("-");
      const active = activeSet.has(key);
      const isToday = key === dateOnlyLocal(0);
      return `
        <div class="sm-streak-day ${active?"active":""} ${isToday?"today":""}">
          <span>${label}</span>
          <strong>${active?"🔥":"○"}</strong>
        </div>
      `;
    }).join("");
  }

  async function renderRealStreak(s){
    const sb = supabaseClient();
    if(!sb){
      $("smStreakMessage").textContent = "Chưa kết nối Supabase.";
      renderStreakWeek([]);
      return;
    }

    await maybeTouchStudyActivity(s);

    try{
      const {data,error} = await sb.rpc("study_streak_summary_v75");
      if(error) throw error;

      const row = Array.isArray(data) ? data[0] : data;
      if(!row){
        $("smStreakMessage").textContent = "Đăng nhập và hoàn thành hoạt động học để bắt đầu streak.";
        renderStreakWeek([]);
        return;
      }

      const current = Number(row.current_streak||0);
      const best = Number(row.best_streak||0);
      const active7 = Number(row.active_last_7||0);
      const studiedToday = !!row.studied_today;
      const activeDates = Array.isArray(row.week_dates) ? row.week_dates : [];

      $("smStreakDays").textContent = current;
      $("smBestStreak").textContent = best + " ngày";
      $("smActive7").textContent = active7 + "/7";
      $("smTodayStudy").textContent = studiedToday ? "✓ Đã học" : "Chưa học";

      const flame = $("smStreakFlame");
      flame.classList.toggle("hot",current>0);

      if(studiedToday && current>=7){
        $("smStreakMessage").textContent = "Quá tốt — bạn đang giữ streak " + current + " ngày. Đừng để chuỗi này đứt!";
      }else if(studiedToday){
        $("smStreakMessage").textContent = "Hôm nay đã được tính streak. Quay lại ngày mai để nối chuỗi.";
      }else if(current>0){
        $("smStreakMessage").textContent = "Bạn còn hôm nay để giữ streak " + current + " ngày.";
      }else{
        $("smStreakMessage").textContent = "Hoàn thành một hoạt động học thật để bắt đầu streak.";
      }

      renderStreakWeek(activeDates);
      renderFreeze(row);
      renderMilestones(row);
    }catch(err){
      console.error("[SkillMap V75 streak]",err);
      $("smStreakMessage").textContent = "Streak chưa đồng bộ được. Kiểm tra SQL V75.";
      renderStreakWeek([]);
    }
  }


  function retentionLocal(){
    const key="avp_retention_v79";
    let data={};
    try{data=JSON.parse(localStorage.getItem(key)||"{}");}catch(e){}
    data.freeze=Number(data.freeze||0);
    data.claimed=data.claimed||{};
    data.lastSeen=data.lastSeen||null;
    return {key,data};
  }

  function saveRetention(r){
    localStorage.setItem(r.key,JSON.stringify(r.data));
  }

  function daysBetween(a,b){
    if(!a||!b) return 0;
    const x=new Date(a+"T00:00:00");
    const y=new Date(b+"T00:00:00");
    return Math.round((y-x)/86400000);
  }

  function renderComebackLocal(){
    const r=retentionLocal();
    const today=localDateKey();
    const gap=r.data.lastSeen?daysBetween(r.data.lastSeen,today):0;

    if(gap>=2&&!sessionStorage.getItem("avp_comeback_shown_v79")){
      const banner=document.createElement("div");
      banner.className="sm-comeback-banner";
      banner.innerHTML="<strong>👋 Chào mừng bạn quay lại!</strong><span>Bạn đã vắng "+gap+" ngày. Hôm nay chỉ cần hoàn thành 1 nhiệm vụ nhỏ để lấy lại nhịp học.</span>";
      document.querySelector(".sm-daily-grid")?.before(banner);
      sessionStorage.setItem("avp_comeback_shown_v79","1");
    }

    r.data.lastSeen=today;
    saveRetention(r);
  }

  function renderFreeze(summary){
    const r=retentionLocal();
    const current=Number(summary?.current_streak||0);
    const best=Number(summary?.best_streak||0);

    if(best>=7&&!r.data.claimed.freeze7){
      r.data.freeze+=1;
      r.data.claimed.freeze7=true;
      saveRetention(r);
    }

    $("smFreezeStock").textContent=r.data.freeze+" 🧊";
    $("smFreezeTitle").textContent=current>=7?"Streak đang rất mạnh":"Streak Freeze";
    $("smFreezeText").textContent=current>=7
      ?"Bạn có thể dùng Freeze nếu bỏ lỡ đúng 1 ngày trong tương lai."
      :"Đạt streak 7 ngày để nhận Freeze đầu tiên.";

    $("smFreezeAction").onclick=()=>{
      alert("🧊 Streak Freeze\n\nBạn đang có: "+r.data.freeze+"\n\nFreeze dùng để bảo vệ chuỗi khi bỏ lỡ đúng 1 ngày.");
    };
  }

  function renderMilestones(summary){
    const best=Number(summary?.best_streak||0);
    const r=retentionLocal();
    const milestones=[
      {days:7,icon:"🥉",reward:"+50 XP + 1 Freeze",xp:50,freeze:1},
      {days:14,icon:"🥈",reward:"+100 XP",xp:100,freeze:0},
      {days:30,icon:"🥇",reward:"+250 XP + 2 Freeze",xp:250,freeze:2}
    ];

    const next=milestones.find(m=>best<m.days);
    $("smNextMilestone").textContent=next?next.days+" ngày":"Đã mở hết";

    $("smMilestones").innerHTML=milestones.map(m=>{
      const unlocked=best>=m.days;
      const claimed=!!r.data.claimed["m"+m.days];
      return `<div class="sm-milestone ${claimed?"claimed":unlocked?"unlocked":""}">
        <div class="sm-milestone-icon">${m.icon}</div>
        <strong>${m.days} ngày streak</strong>
        <small>${m.reward}</small>
        <button type="button" data-milestone="${m.days}" ${(!unlocked||claimed)?"disabled":""}>
          ${claimed?"✓ Đã nhận":unlocked?"Nhận thưởng":"Chưa mở"}
        </button>
      </div>`;
    }).join("");

    $("smMilestones").querySelectorAll("button[data-milestone]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const days=Number(btn.dataset.milestone);
        const m=milestones.find(x=>x.days===days);
        const latest=retentionLocal();
        if(!m||best<m.days||latest.data.claimed["m"+days]) return;

        latest.data.claimed["m"+days]=true;
        latest.data.freeze+=m.freeze;
        saveRetention(latest);
        localStorage.setItem(XPKEY,String(xp()+m.xp));
        render();
      });
    });
  }

  function coachData(s){
    const total = s.all.length;
    const pct = Math.round((s.doneCount/total)*100);
    let message = "";
    let focus = "Excel cơ bản";
    let actionHref = "excel.html";
    let strength = "Đang xây nền";
    let status = "Khởi động";

    if(s.next){
      focus = s.next.lesson[2];
      actionHref = s.next.lesson[1];
    }

    if(pct === 0){
      message = "Bạn đang ở điểm bắt đầu. Hôm nay chỉ cần hoàn thành node đầu tiên, đừng cố học quá nhiều. Mục tiêu là tạo nhịp học đều.";
    }else if(pct < 30){
      message = "Bạn đã bắt đầu có đà. Hãy ưu tiên hoàn thành chặng Nền tảng trước khi nhảy sang các kỹ năng nâng cao.";
      strength = "Nền tảng đang hình thành";
      status = "Đang tăng tốc";
    }else if(pct < 65){
      message = "Tiến độ khá tốt. Bạn nên xen kẽ 1 node mới với 1 bài thực hành để tránh học lý thuyết quá nhiều mà không áp dụng.";
      strength = "Phân tích & thực hành";
      status = "Đang tiến bộ";
    }else if(pct < 100){
      message = "Bạn đã đi khá xa trên Skill Map. Từ đây nên ưu tiên Power Query, Dashboard và các case thực chiến để tạo năng lực làm việc thật.";
      strength = "Kỹ năng ứng dụng";
      status = "Nâng cao";
    }else{
      message = "Bạn đã hoàn thành toàn bộ Skill Map. Giai đoạn tiếp theo không phải học thêm node, mà là làm project, Boss Challenge và duy trì tốc độ thực hành.";
      strength = "Toàn diện";
      status = "Master";
      focus = "Practice Hub";
      actionHref = "practice-video.html";
    }

    return {message,focus,actionHref,strength,status,pct};
  }

  function renderCoach(s){
    const c = coachData(s);
    $("smCoachMessage").textContent = c.message;
    $("smCoachInsights").innerHTML = `
      <div class="sm-coach-insight"><span>COACH ĐÁNH GIÁ</span><strong>${c.status}</strong></div>
      <div class="sm-coach-insight"><span>NÊN ƯU TIÊN</span><strong>${c.focus}</strong></div>
      <div class="sm-coach-insight"><span>ĐIỂM MẠNH</span><strong>${c.strength}</strong></div>
      <div class="sm-coach-insight"><span>TIẾN ĐỘ</span><strong>${c.pct}% Skill Map</strong></div>
    `;
    $("smCoachAction").href = c.actionHref;
    $("smCoachAction").textContent = "Làm bài Coach đề xuất →";
  }

  function openAiCoach(){
    try{
      window.dispatchEvent(new CustomEvent("avp:surface-open",{detail:{surface:"aihub"}}));
    }catch(e){}

    const bubble = document.getElementById("avpAiChatBubble");
    if(bubble){
      bubble.click();
      return;
    }

    if(window.AVPCommunity?.openAI){
      window.AVPCommunity.openAI();
      return;
    }

    alert("AI Coach đang tải. Bạn có thể mở mục Hỏi AI từ nút AVP.");
  }

  function render(){
    const previousUnlocked = Number(sessionStorage.getItem("avp_skillmap_unlocked_v71") || 0);
    const s = state();
    const total = s.all.length;
    const pct = Math.round((s.doneCount / total) * 100);

    $("smUnlocked").textContent = s.unlockedCount + "/" + total;
    $("smDone").textContent = s.doneCount + "/" + total;
    $("smXP").textContent = xp();
    $("smPct").textContent = pct + "%";
    renderDaily(s);
    renderCoach(s);
    renderBoss(s);
    renderLeague(s);
    renderRealStreak(s);

    if(s.next){
      $("smTodayTitle").textContent = s.next.lesson[2];
      $("smTodayDesc").textContent =
        s.next.stage.icon + " " + s.next.stage.name +
        " • Đây là node tiếp theo phù hợp với tiến độ hiện tại.";
      $("smTodayLink").href = s.next.lesson[1];
      $("smTodayLink").textContent = "Học node này →";
    }else{
      $("smTodayTitle").textContent = "Bạn đã hoàn thành toàn bộ Skill Map 🎉";
      $("smTodayDesc").textContent = "Có thể chuyển sang Practice Hub, Race hoặc luyện lại các node muốn củng cố.";
      $("smTodayLink").href = "practice-video.html";
      $("smTodayLink").textContent = "Luyện thực hành →";
    }

    const zones = $("smZones");
    zones.innerHTML = stages.map((stage,stageIndex) => {
      const open = s.unlocked(stageIndex);
      const items = stage.lessons.map((lesson,lessonIndex) => {
        const completed = s.done(lesson);
        const current = !!(
          s.next &&
          s.next.stageIndex === stageIndex &&
          s.next.lesson[0] === lesson[0]
        );

        const cls = completed ? "done" : current ? "current" : open ? "open" : "locked";
        const href = open ? lesson[1] : "#";
        const idx = stages.slice(0,stageIndex)
          .reduce((n,x)=>n+x.lessons.length,0) + lessonIndex + 1;

        return `
          <a
            class="sm-node ${cls}"
            href="${href}"
            data-stage="${stageIndex}"
            data-node="${lessonIndex}"
            data-open="${open ? "1" : "0"}"
            ${open ? "" : 'aria-disabled="true"'}
          >
            <span class="sm-node-num">${String(idx).padStart(2,"0")}</span>
            <strong>${lesson[2]}</strong>
            <small>${
              completed ? "Đã hoàn thành" :
              current ? "Node nên học tiếp" :
              open ? "Sẵn sàng học" :
              "Chưa mở khóa"
            }</small>
          </a>
        `;
      }).join("");

      const zoneComplete = stage.lessons.every(s.done);

      return `
        <section class="sm-zone ${open ? "" : "locked-zone"} ${zoneComplete ? "sm-zone-complete" : ""}" data-zone="${stageIndex}">
          <div class="sm-zone-head">
            <div class="sm-zone-icon">${stage.icon}</div>
            <div>
              <strong>${stage.name}</strong>
              <small>${stage.lessons.filter(s.done).length}/${stage.lessons.length} node hoàn thành</small>
            </div>
          </div>
          ${items}
          <div class="sm-zone-gate">🔓 Điều kiện: ${stage.gate}</div>
        </section>
      `;
    }).join("");

    zones.querySelectorAll(".sm-node.locked").forEach(a => {
      a.addEventListener("click", e => {
        e.preventDefault();
        const stageIndex = Number(a.dataset.stage);
        const gate = stages[stageIndex]?.gate || "Hoàn thành chặng trước";
        alert("🔒 Node này chưa mở khóa.\n\nĐiều kiện: " + gate);
      });
    });

    sessionStorage.setItem("avp_skillmap_unlocked_v71", String(s.unlockedCount));

    requestAnimationFrame(() => {
      drawLines();
      renderWowOverlays(s);

      if (previousUnlocked > 0 && s.unlockedCount > previousUnlocked) {
        const justUnlocked = Array.from(document.querySelectorAll(".sm-node.open"))
          .slice(0, s.unlockedCount - previousUnlocked);
        justUnlocked.forEach((node, i) => {
          setTimeout(() => {
            node.classList.add("sm-unlock-fx");
            setTimeout(() => node.classList.remove("sm-unlock-fx"), 900);
          }, i * 120);
        });
      }
    });
  }

  function renderWowOverlays(s){
    const map = $("smMap");
    if(!map) return;

    map.querySelectorAll(".sm-avatar-marker,.sm-checkpoint,.sm-map-progress,.sm-map-progress-fill")
      .forEach(el => el.remove());

    const track = document.createElement("div");
    track.className = "sm-map-progress";
    map.appendChild(track);

    const fill = document.createElement("div");
    fill.className = "sm-map-progress-fill";
    fill.style.height = Math.max(0, Math.min(1, s.doneCount / s.all.length)) * Math.max(0, map.clientHeight - 88) + "px";
    map.appendChild(fill);

    const current = map.querySelector(".sm-node.current") || map.querySelector(".sm-node.open");
    if(current && window.innerWidth > 980){
      const mr = map.getBoundingClientRect();
      const nr = current.getBoundingClientRect();
      const avatar = document.createElement("div");
      avatar.className = "sm-avatar-marker";
      avatar.textContent = "🧑‍💻";
      avatar.style.left = Math.max(4, nr.left - mr.left - 56) + "px";
      avatar.style.top = (nr.top - mr.top + nr.height/2 - 23) + "px";
      map.appendChild(avatar);
    }

    map.querySelectorAll(".sm-zone").forEach((zone, index) => {
      if(window.innerWidth <= 980) return;

      const zr = zone.getBoundingClientRect();
      const mr = map.getBoundingClientRect();
      const chest = document.createElement("button");
      chest.type = "button";
      chest.className = "sm-checkpoint";
      chest.textContent = "🎁";

      const stageComplete = stages[index].lessons.every(s.done);
      const claimedKey = "avp_skillmap_reward_claimed_v71_" + index;
      const claimed = localStorage.getItem(claimedKey) === "1";

      if(stageComplete && !claimed) chest.classList.add("ready");
      if(claimed) chest.style.opacity = ".45";

      chest.style.left = (index % 2 === 0
        ? zr.right - mr.left + 8
        : zr.left - mr.left - 52) + "px";
      chest.style.top = (zr.top - mr.top + 28) + "px";

      chest.addEventListener("click", () => {
        if(!stageComplete){
          alert("🎁 Hoàn thành toàn bộ node của chặng này để mở checkpoint reward.");
          return;
        }
        if(claimed){
          alert("✅ Bạn đã nhận phần thưởng của checkpoint này.");
          return;
        }
        openReward(index);
      });

      map.appendChild(chest);
    });
  }

  function openReward(stageIndex){
    const stage = stages[stageIndex];
    const rewardXP = [30,50,80,120][stageIndex] || 30;

    $("smRewardTitle").textContent = "Hoàn thành chặng " + stage.name + "!";
    $("smRewardText").textContent =
      "Bạn đã vượt qua toàn bộ node của chặng này. Nhận +" + rewardXP +
      " XP checkpoint và mở đường sang kỹ năng tiếp theo.";

    $("smReward").hidden = false;
    $("smRewardClaim").onclick = () => {
      const key = "avp_skillmap_reward_claimed_v71_" + stageIndex;
      if(localStorage.getItem(key) !== "1"){
        localStorage.setItem(key,"1");
        localStorage.setItem(XPKEY, String(xp() + rewardXP));
      }
      $("smReward").hidden = true;
      render();
    };
  }

  function closeReward(){
    $("smReward").hidden = true;
  }

  function drawLines(){
    const map = $("smMap");
    const svg = $("smLines");
    if(!map || !svg || window.innerWidth <= 640) return;

    const mapRect = map.getBoundingClientRect();
    svg.setAttribute("viewBox",`0 0 ${mapRect.width} ${mapRect.height}`);
    svg.innerHTML = "";

    const nodes = Array.from(map.querySelectorAll(".sm-node"));
    for(let i=0;i<nodes.length-1;i++){
      const a = nodes[i], b = nodes[i+1];
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();

      const x1 = ar.left - mapRect.left + ar.width;
      const y1 = ar.top - mapRect.top + ar.height/2;
      const x2 = br.left - mapRect.left;
      const y2 = br.top - mapRect.top + br.height/2;
      const bend = Math.max(28,Math.abs(x2-x1)*.42);

      const path = document.createElementNS("http://www.w3.org/2000/svg","path");
      path.setAttribute("d",`M ${x1} ${y1} C ${x1+bend} ${y1}, ${x2-bend} ${y2}, ${x2} ${y2}`);
      path.setAttribute("class","sm-line-path " +
        ((a.classList.contains("done") && !b.classList.contains("locked")) ? "active" : "")
      );
      svg.appendChild(path);
    }
  }

  function init(){
    renderComebackLocal();
    $("smCoachAsk")?.addEventListener("click", openAiCoach);
    $("smRewardClose")?.addEventListener("click", closeReward);
    $("smReward")?.addEventListener("click", e => {
      if(e.target === $("smReward")) closeReward();
    });

    render();
    window.addEventListener("resize",() => {
      clearTimeout(window.__smResize);
      window.__smResize = setTimeout(drawLines,120);
    });

    window.addEventListener("storage",e => {
      if([XPKEY,QKEY,PKEY].includes(e.key)) render();
    });

    window.addEventListener("avp:progress-changed",render);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded",init,{once:true});
  }else{
    init();
  }
})();
