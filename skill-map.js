(() => {
  "use strict";

  const XPKEY="avp_xp_v2";
  const QKEY="avp_quiz_done_v1";
  const PKEY="avp_lesson_progress_v1";
  const DAILYKEY_PREFIX="avp_skillmap_daily_v85_";

  const stages=[
    {
      id:"beginner",
      name:"Nền tảng",
      icon:"01",
      gate:"Mở ngay",
      lessons:[
        ["excel","excel.html","Kiến thức Excel cơ bản"],
        ["shortcuts","phimtatexcel.html","Phím tắt Excel"],
        ["formula","congthucexcel.html","Công thức Excel"],
        ["filter","filtersort.html","Filter & Sort"]
      ]
    },
    {
      id:"analyst",
      name:"Phân tích",
      icon:"02",
      gate:"Hoàn thành chặng Nền tảng",
      lessons:[
        ["pivot","pivottable.html","PivotTable"],
        ["pareto","bieudopareto.html","Biểu đồ Pareto"],
        ["report","baocaoexcel.html","Báo cáo Excel / QC"]
      ]
    },
    {
      id:"advanced",
      name:"Dữ liệu & Dashboard",
      icon:"03",
      gate:"Hoàn thành chặng Phân tích",
      lessons:[
        ["advanced","excel-nang-cao.html","Excel nâng cao"],
        ["powerquery","power-query-course.html","Power Query"],
        ["dax","power-pivot-dax.html","Power Pivot & DAX"],
        ["dash","dashboard-dong.html","Dashboard động"],
        ["practice","practice-lab.html","Practice Lab"]
      ]
    },
    {
      id:"master",
      name:"Tự động hóa",
      icon:"04",
      gate:"Hoàn thành chặng Dữ liệu & Dashboard + 300 XP",
      lessons:[
        ["vba","vba-macro.html","VBA / Macro"],
        ["solver","solver-whatif.html","What-If & Solver"]
      ]
    }
  ];

  const $=id=>document.getElementById(id);

  function readJson(key,fallback){
    try{
      const value=JSON.parse(localStorage.getItem(key)||"null");
      return value??fallback;
    }catch(e){
      return fallback;
    }
  }

  function xp(){
    const value=Number(localStorage.getItem(XPKEY)||0);
    return Number.isFinite(value)?value:0;
  }

  function localDateKey(){
    const d=new Date();
    return [
      d.getFullYear(),
      String(d.getMonth()+1).padStart(2,"0"),
      String(d.getDate()).padStart(2,"0")
    ].join("-");
  }

  function getState(){
    const q=readJson(QKEY,{});
    const p=readJson(PKEY,{});

    function done(lesson){
      return !!(p[lesson[0]] || q[lesson[1]]);
    }

    function stageDone(index){
      return stages[index].lessons.every(done);
    }

    function unlocked(index){
      if(index===0) return true;
      if(index===1) return stageDone(0);
      if(index===2) return stageDone(1);
      if(index===3) return stageDone(2) && xp()>=300;
      return false;
    }

    const all=stages.flatMap(stage=>stage.lessons);
    const doneCount=all.filter(done).length;

    let next=null;
    for(let i=0;i<stages.length;i++){
      if(!unlocked(i)) continue;
      const lesson=stages[i].lessons.find(item=>!done(item));
      if(lesson){
        next={stageIndex:i,stage:stages[i],lesson};
        break;
      }
    }

    const currentStage=next
      ? next.stage
      : stages[Math.min(
          stages.length-1,
          stages.findIndex((stage,i)=>!stageDone(i))===-1
            ? stages.length-1
            : stages.findIndex((stage,i)=>!stageDone(i))
        )];

    return {q,p,done,stageDone,unlocked,all,doneCount,next,currentStage};
  }

  function dailyState(s){
    const key=DAILYKEY_PREFIX+localDateKey();
    let saved=readJson(key,{});

    if(typeof saved.baseDone!=="number"){
      saved={
        baseDone:s.doneCount,
        completed:false
      };
      localStorage.setItem(key,JSON.stringify(saved));
    }

    if(!saved.completed && s.doneCount>saved.baseDone){
      saved.completed=true;
      localStorage.setItem(key,JSON.stringify(saved));
    }

    return saved;
  }

  function renderSummary(s){
    const total=s.all.length;
    const pct=Math.round((s.doneCount/total)*100);

    $("smDone").textContent=`${s.doneCount}/${total}`;
    $("smPct").textContent=pct+"%";
    $("smXP").textContent=xp();
    $("smStage").textContent=s.next?.stage?.name || "Hoàn thành";

    if(s.next){
      $("smTodayStage").textContent=s.next.stage.name;
      $("smTodayTitle").textContent=s.next.lesson[2];
      $("smTodayDesc").textContent="Đây là bài tiếp theo trong chặng hiện tại của bạn.";
      $("smTodayLink").href=s.next.lesson[1];

      $("smMissionTitle").textContent="Hoàn thành "+s.next.lesson[2];
      $("smMissionDesc").textContent="Một nhiệm vụ duy nhất hôm nay: học xong bài tiếp theo trong lộ trình.";
    }else{
      $("smTodayStage").textContent="Skill Map";
      $("smTodayTitle").textContent="Bạn đã hoàn thành toàn bộ lộ trình";
      $("smTodayDesc").textContent="Chuyển sang thực hành để duy trì kỹ năng và xử lý các case Excel thực tế.";
      $("smTodayLink").href="practice-video.html";
      $("smTodayLink").textContent="Đi thực hành →";

      $("smMissionTitle").textContent="Hoàn thành 1 bài thực hành";
      $("smMissionDesc").textContent="Duy trì kỹ năng bằng một bài trong Practice Hub.";
    }

    const daily=dailyState(s);
    const status=$("smMissionStatus");
    status.textContent=daily.completed?"Đã hoàn thành":"Chưa hoàn thành";
    status.classList.toggle("done",!!daily.completed);
  }

  function renderMap(s){
    const zones=$("smZones");
    let offset=0;

    zones.innerHTML=stages.map((stage,stageIndex)=>{
      const open=s.unlocked(stageIndex);
      const completedInStage=stage.lessons.filter(s.done).length;

      const nodes=stage.lessons.map((lesson,lessonIndex)=>{
        const completed=s.done(lesson);
        const current=!!(
          s.next &&
          s.next.stageIndex===stageIndex &&
          s.next.lesson[0]===lesson[0]
        );
        const stateClass=completed?"done":current?"current":open?"open":"locked";
        const idx=offset+lessonIndex+1;

        return `
          <a
            class="sm-node ${stateClass}"
            href="${open?lesson[1]:"#"}"
            data-open="${open?"1":"0"}"
            data-stage="${stageIndex}"
          >
            <span class="sm-node-num">${String(idx).padStart(2,"0")}</span>
            <strong>${lesson[2]}</strong>
            <small>${
              completed?"Đã hoàn thành":
              current?"Bài nên học tiếp":
              open?"Sẵn sàng học":
              "Chưa mở khóa"
            }</small>
          </a>
        `;
      }).join("");

      offset+=stage.lessons.length;

      return `
        <section class="sm-zone ${open?"":"locked-zone"}">
          <div class="sm-zone-head">
            <div class="sm-zone-icon">${stage.icon}</div>
            <div>
              <strong>${stage.name}</strong>
              <small>${completedInStage}/${stage.lessons.length} bài hoàn thành</small>
            </div>
          </div>
          ${nodes}
          <div class="sm-zone-gate">Điều kiện: ${stage.gate}</div>
        </section>
      `;
    }).join("");

    zones.querySelectorAll(".sm-node.locked").forEach(node=>{
      node.addEventListener("click",event=>{
        event.preventDefault();
        const stageIndex=Number(node.dataset.stage);
        alert("Chưa mở khóa.\n\n"+stages[stageIndex].gate);
      });
    });

    requestAnimationFrame(drawLines);
  }

  function drawLines(){
    const map=$("smMap");
    const svg=$("smLines");
    if(!map||!svg||window.innerWidth<=940) return;

    const mapRect=map.getBoundingClientRect();
    svg.setAttribute("viewBox",`0 0 ${mapRect.width} ${mapRect.height}`);
    svg.innerHTML="";

    const nodes=Array.from(map.querySelectorAll(".sm-node"));
    for(let i=0;i<nodes.length-1;i++){
      const a=nodes[i];
      const b=nodes[i+1];
      const ar=a.getBoundingClientRect();
      const br=b.getBoundingClientRect();

      const x1=ar.left-mapRect.left+ar.width;
      const y1=ar.top-mapRect.top+ar.height/2;
      const x2=br.left-mapRect.left;
      const y2=br.top-mapRect.top+br.height/2;
      const bend=Math.max(25,Math.abs(x2-x1)*.38);

      const path=document.createElementNS("http://www.w3.org/2000/svg","path");
      path.setAttribute("d",`M ${x1} ${y1} C ${x1+bend} ${y1}, ${x2-bend} ${y2}, ${x2} ${y2}`);
      path.setAttribute(
        "class",
        "sm-line-path "+(
          a.classList.contains("done") && !b.classList.contains("locked")
            ?"active":""
        )
      );
      svg.appendChild(path);
    }
  }

  function render(){
    const s=getState();
    renderSummary(s);
    renderMap(s);
  }

  function init(){
    render();

    window.addEventListener("resize",()=>{
      clearTimeout(window.__smAudit3Resize);
      window.__smAudit3Resize=setTimeout(drawLines,120);
    });

    window.addEventListener("storage",event=>{
      if([XPKEY,QKEY,PKEY].includes(event.key)) render();
    });

    window.addEventListener("avp:progress-changed",render);
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",init,{once:true});
  }else{
    init();
  }
})();
