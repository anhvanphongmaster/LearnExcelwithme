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

  function render(){
    const previousUnlocked = Number(sessionStorage.getItem("avp_skillmap_unlocked_v71") || 0);
    const s = state();
    const total = s.all.length;
    const pct = Math.round((s.doneCount / total) * 100);

    $("smUnlocked").textContent = s.unlockedCount + "/" + total;
    $("smDone").textContent = s.doneCount + "/" + total;
    $("smXP").textContent = xp();
    $("smPct").textContent = pct + "%";

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
