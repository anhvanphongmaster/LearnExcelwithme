/*! dashboard.js — V99 canonical 14-lesson dashboard */
(function(){
  "use strict";

  const ACTIVITY_KEY="avp_activity_days_v1";
  const LESSON_KEY="avp_lesson_progress_v1";
  const QUIZ_KEY="avp_quiz_done_v1";
  const XP_KEY="avp_xp_v2";

  const stages=[
    {
      name:"Nền tảng",
      ids:["excel","shortcuts","formula","filter"],
      lessons:[
        ["excel","excel.html","Kiến thức Excel cơ bản"],
        ["shortcuts","phimtatexcel.html","Phím tắt Excel"],
        ["formula","congthucexcel.html","Công thức Excel"],
        ["filter","filtersort.html","Filter & Sort"]
      ]
    },
    {
      name:"Phân tích",
      ids:["pivot","pareto","report"],
      lessons:[
        ["pivot","pivottable.html","PivotTable"],
        ["pareto","bieudopareto.html","Biểu đồ Pareto"],
        ["report","baocaoexcel.html","Báo cáo Excel / QC"]
      ]
    },
    {
      name:"Dữ liệu & Dashboard",
      ids:["advanced","powerquery","dax","dash","practice"],
      lessons:[
        ["advanced","excel-nang-cao.html","Excel nâng cao"],
        ["powerquery","power-query-course.html","Power Query"],
        ["dax","power-pivot-dax.html","Power Pivot & DAX"],
        ["dash","dashboard-dong.html","Dashboard động"],
        ["practice","practice-lab.html","Practice Lab"]
      ]
    },
    {
      name:"Tự động hóa",
      ids:["vba","solver"],
      lessons:[
        ["vba","vba-macro.html","VBA / Macro"],
        ["solver","solver-whatif.html","What-If & Solver"]
      ]
    }
  ];

  const $=id=>document.getElementById(id);

  function safeJSON(key,fallback){
    try{
      const value=JSON.parse(localStorage.getItem(key)||"null");
      return value??fallback;
    }catch(e){
      return fallback;
    }
  }

  function todayKey(){
    const d=new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  function dateFromKey(k){
    const [y,m,d]=String(k).split("-").map(Number);
    return new Date(y,m-1,d);
  }

  function streak(days){
    if(!Array.isArray(days) || !days.length)return 0;
    const unique=[...new Set(days)].sort();
    let count=1;

    for(let i=unique.length-1;i>0;i--){
      const a=dateFromKey(unique[i]);
      const b=dateFromKey(unique[i-1]);
      if(Math.round((a-b)/86400000)===1)count++;
      else break;
    }

    const last=dateFromKey(unique[unique.length-1]);
    const today=dateFromKey(todayKey());
    const gap=Math.round((today-last)/86400000);
    return gap<=1?count:0;
  }

  function setText(id,text){
    const el=$(id);
    if(el)el.textContent=text;
  }

  function setWidth(id,value){
    const el=$(id);
    if(el)el.style.width=Math.max(0,Math.min(100,value))+"%";
  }

  function state(){
    const progress=safeJSON(LESSON_KEY,{});
    const quiz=safeJSON(QUIZ_KEY,{});

    const done=lesson=>!!(progress[lesson[0]] || quiz[lesson[1]]);
    const all=stages.flatMap(stage=>stage.lessons);
    const completed=all.filter(done);

    let next=null;
    let nextStage=null;

    for(const stage of stages){
      const lesson=stage.lessons.find(x=>!done(x));
      if(lesson){
        next=lesson;
        nextStage=stage;
        break;
      }
    }

    return {progress,quiz,done,all,completed,next,nextStage};
  }

  function rankForXP(xp){
    const ranks=[
      "Excel Starter",
      "Excel Learner",
      "Formula Builder",
      "Data Explorer",
      "Excel Specialist",
      "Office Pro"
    ];
    return ranks[Math.min(ranks.length-1,Math.floor(xp/100))];
  }

  function render(){
    const s=state();
    const xp=Number(localStorage.getItem(XP_KEY)||localStorage.getItem("avp_bonus_xp_v1")||0)||0;
    const days=safeJSON(ACTIVITY_KEY,[]);
    const currentStreak=streak(days);

    const doneCount=s.completed.length;
    const pct=Math.round(doneCount/s.all.length*100);

    const level=Math.floor(xp/100)+1;
    const levelXP=xp%100;

    setText("dashLevel",String(level));
    setText("dashRank",rankForXP(xp));
    setText("dashXP",xp+" XP tổng");
    setWidth("dashLevelBar",levelXP);
    setText("dashLevelProgress",levelXP+" / 100 XP");
    setText("dashNextLevel",(100-levelXP)+" XP tới Level "+(level+1));

    setText("statLessons",doneCount+"/14");
    setText("statProgress",pct+"%");
    setText("statXP",String(xp));
    setText("statStreak",currentStreak+" ngày");

    const stageBindings=[
      ["stageFoundation","stageFoundationText",stages[0]],
      ["stageAnalysis","stageAnalysisText",stages[1]],
      ["stageData","stageDataText",stages[2]],
      ["stageAutomation","stageAutomationText",stages[3]]
    ];

    stageBindings.forEach(([barId,textId,stage])=>{
      const count=stage.lessons.filter(s.done).length;
      const stagePct=Math.round(count/stage.lessons.length*100);
      setWidth(barId,stagePct);
      setText(textId,`${count}/${stage.lessons.length}`);
    });

    if(s.next){
      setText("continueStage",s.nextStage.name.toUpperCase());
      setText("continueTitle",s.next[2]);
      setText(
        "continueText",
        `Bạn đã hoàn thành ${doneCount}/14 bài. Đây là nội dung tiếp theo trong lộ trình hiện tại.`
      );
      $("continueButton").href=s.next[1];
      $("continueButton").textContent="Tiếp tục học →";
    }else{
      setText("continueStage","ĐÃ HOÀN THÀNH LỘ TRÌNH");
      setText("continueTitle","Chuyển sang thực hành");
      setText(
        "continueText",
        "Bạn đã hoàn thành 14 bài chính. Hãy dùng Practice Hub để tiếp tục luyện bằng project và file thực tế."
      );
      $("continueButton").href="practice-video.html";
      $("continueButton").textContent="Đi thực hành →";
    }

    const activities=[];
    if(doneCount){
      activities.push(`Đã hoàn thành <strong>${doneCount}/14 bài học</strong> trong Skill Map.`);
    }
    if(currentStreak){
      activities.push(`Chuỗi học hiện tại là <strong>${currentStreak} ngày</strong>.`);
    }
    if(xp){
      activities.push(`Tổng XP hiện tại: <strong>${xp} XP</strong>.`);
    }

    const lastStage=[...stages].reverse().find(stage=>stage.lessons.some(s.done));
    if(lastStage){
      activities.push(`Chặng gần nhất có tiến độ: <strong>${lastStage.name}</strong>.`);
    }

    const box=$("activityList");
    if(box){
      box.innerHTML=activities.length
        ? activities.slice(0,4).map(text=>`
            <div class="activity">
              <span class="activity-dot"></span>
              <div class="activity-text">${text}</div>
            </div>
          `).join("")
        : `<div class="empty-state">
            Chưa có tiến độ học. Mở Skill Map và hoàn thành bài đầu tiên để Dashboard bắt đầu ghi nhận.
          </div>`;
    }
  }

  function reset(){
    const ok=confirm(
      "Đặt lại tiến độ học trên thiết bị này?\n\n"+
      "Thao tác này xóa tiến độ local của Skill Map và chuỗi học trên trình duyệt hiện tại."
    );
    if(!ok)return;

    [
      LESSON_KEY,
      QUIZ_KEY,
      ACTIVITY_KEY,
      "completedCourses",
      "currentCourse",
      "quizBestScore",
      "avp_playground_progress_v1"
    ].forEach(key=>localStorage.removeItem(key));

    location.reload();
  }

  function boot(){
    render();
    $("dashboardResetBtn")?.addEventListener("click",reset);

    window.addEventListener("storage",event=>{
      if([LESSON_KEY,QUIZ_KEY,ACTIVITY_KEY,XP_KEY].includes(event.key)){
        render();
      }
    });

    window.addEventListener("avp:progress-changed",render);
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",boot,{once:true});
  }else{
    boot();
  }
})();