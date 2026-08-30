(() => {
  "use strict";

  const XPKEY="avp_xp_v2";
  const HISTORYKEY="avp_focus_history_v80";
  const ACTIVEKEY="avp_focus_active_v80";

  const $=id=>document.getElementById(id);

  const goals={
    formula:{
      title:"Ôn công thức Excel",
      link:"congthucexcel.html",
      tasks:[
        ["📖","Ôn 1 nhóm công thức","Đọc lại cú pháp và ví dụ"],
        ["✍️","Tự viết 3 công thức","Không nhìn đáp án"],
        ["🧠","Làm 1 quiz ngắn","Kiểm tra khả năng nhớ"]
      ]
    },
    clean:{
      title:"Làm sạch dữ liệu",
      link:"practice-video.html#tiktok",
      tasks:[
        ["🧹","Xử lý dữ liệu bẩn","Khoảng trắng, kiểu dữ liệu, trùng lặp"],
        ["🔍","Kiểm tra lỗi còn sót","Soát lại cột quan trọng"],
        ["✅","Hoàn thành 1 bài thực hành","Lưu kết quả cuối"]
      ]
    },
    powerquery:{
      title:"Power Query",
      link:"power-query-course.html",
      tasks:[
        ["📥","Nạp dữ liệu vào Query","Chọn nguồn phù hợp"],
        ["⚙️","Thực hiện biến đổi","Làm sạch hoặc gộp dữ liệu"],
        ["🔄","Refresh thử","Xác nhận quy trình chạy lại"]
      ]
    },
    pivot:{
      title:"PivotTable",
      link:"pivottable.html",
      tasks:[
        ["📊","Tạo PivotTable","Đặt đúng Rows/Values"],
        ["🎛️","Thử filter/slicer","Kiểm tra tương tác"],
        ["🧾","Rút ra 1 kết luận","Đọc dữ liệu thay vì chỉ tạo bảng"]
      ]
    },
    dashboard:{
      title:"Dashboard",
      link:"dashboard-dong.html",
      tasks:[
        ["📌","Chọn KPI chính","Không nhồi quá nhiều chỉ số"],
        ["📈","Tạo 1 biểu đồ","Phục vụ đúng câu hỏi"],
        ["🧪","Test bộ lọc","Đảm bảo số liệu thay đổi đúng"]
      ]
    },
    practice:{
      title:"Bài thực hành",
      link:"practice-video.html",
      tasks:[
        ["📂","Mở 1 file thực hành","Chọn bài phù hợp trình độ"],
        ["🛠️","Tự làm trước","Chưa xem hướng dẫn"],
        ["✅","Kiểm tra kết quả","Ghi lại lỗi đã mắc"]
      ]
    }
  };

  let selectedMinutes=25;
  let remaining=selectedMinutes*60;
  let running=false;
  let interval=null;
  let startedAt=null;
  let taskDone=[false,false,false];

  function history(){
    try{return JSON.parse(localStorage.getItem(HISTORYKEY)||"[]")||[]}catch(e){return[]}
  }
  function saveHistory(items){
    localStorage.setItem(HISTORYKEY,JSON.stringify(items.slice(0,30)));
  }
  function xp(){
    const n=Number(localStorage.getItem(XPKEY)||0);
    return Number.isFinite(n)?n:0;
  }
  function currentGoal(){
    return goals[$("frGoal").value]||goals.formula;
  }
  function fmt(sec){
    sec=Math.max(0,Math.round(sec));
    const m=Math.floor(sec/60);
    const s=sec%60;
    return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  }
  function renderTimer(){
    $("frTimer").textContent=fmt(remaining);
    const total=selectedMinutes*60;
    const used=Math.max(0,total-remaining);
    $("frProgress").style.width=((used/total)*100)+"%";
  }
  function renderPlan(){
    const g=currentGoal();
    $("frTitle").textContent=g.title;
    $("frStudyLink").href=g.link;
    $("frStudyLink").textContent="Mở "+g.title+" →";
    $("frPlan").innerHTML=g.tasks.map((t,i)=>`
      <div class="fr-task ${taskDone[i]?"done":""}">
        <div class="fr-task-icon">${t[0]}</div>
        <div><strong>${t[1]}</strong><small>${t[2]}</small></div>
        <button type="button" data-task="${i}">${taskDone[i]?"✓ Xong":"Đánh dấu"}</button>
      </div>
    `).join("");
    $("frPlanCount").textContent=taskDone.filter(Boolean).length+"/3";

    $("frPlan").querySelectorAll("button[data-task]").forEach(btn=>{
      btn.onclick=()=>{
        const i=Number(btn.dataset.task);
        taskDone[i]=!taskDone[i];
        saveActive();
        renderPlan();
      };
    });
  }
  function renderStats(){
    const h=history();
    const completed=h.filter(x=>x.completed);
    const total=completed.reduce((s,x)=>s+Number(x.minutes||0),0);
    const best=completed.reduce((m,x)=>Math.max(m,Number(x.minutes||0)),0);
    $("frSessions").textContent=completed.length;
    $("frMinutes").textContent=total;
    $("frBest").textContent=best+"m";
  }
  function renderHistory(){
    const h=history();
    if(!h.length){
      $("frHistory").innerHTML='<div class="fr-empty">Chưa có phiên học nào. Hoàn thành phiên đầu tiên để bắt đầu xây lịch sử học tập.</div>';
      return;
    }
    $("frHistory").innerHTML=h.slice(0,12).map(x=>`
      <div class="fr-history-row">
        <div><strong>${x.goal}</strong><small>${x.date}</small></div>
        <span>${x.minutes} phút</span>
        <span>${x.tasks}/3 nhiệm vụ</span>
      </div>
    `).join("");
  }
  function saveActive(){
    if(!startedAt){
      localStorage.removeItem(ACTIVEKEY);
      return;
    }
    localStorage.setItem(ACTIVEKEY,JSON.stringify({
      selectedMinutes,
      remaining,
      running,
      startedAt,
      goal:$("frGoal").value,
      taskDone
    }));
  }
  function restoreActive(){
    let a=null;
    try{a=JSON.parse(localStorage.getItem(ACTIVEKEY)||"null")}catch(e){}
    if(!a) return;

    selectedMinutes=Number(a.selectedMinutes||25);
    remaining=Number(a.remaining||selectedMinutes*60);
    running=false;
    startedAt=a.startedAt||null;
    taskDone=Array.isArray(a.taskDone)?a.taskDone:[false,false,false];
    if(goals[a.goal]) $("frGoal").value=a.goal;

    document.querySelectorAll("#frPresets button").forEach(b=>{
      b.classList.toggle("active",Number(b.dataset.min)===selectedMinutes);
    });

    $("frState").textContent="PAUSED";
    $("frStart").textContent="▶ Tiếp tục";
    $("frPause").disabled=true;
    $("frFinish").disabled=false;
  }
  function start(){
    if(running) return;
    if(!startedAt) startedAt=new Date().toISOString();
    running=true;
    $("frState").textContent="FOCUS";
    $("frStart").disabled=true;
    $("frPause").disabled=false;
    $("frFinish").disabled=false;
    $("frGoal").disabled=true;

    interval=setInterval(()=>{
      remaining--;
      if(remaining<=0){
        remaining=0;
        renderTimer();
        finish(true);
        return;
      }
      renderTimer();
      saveActive();
    },1000);
    saveActive();
  }
  function pause(){
    if(!running) return;
    running=false;
    clearInterval(interval);
    interval=null;
    $("frState").textContent="PAUSED";
    $("frStart").disabled=false;
    $("frStart").textContent="▶ Tiếp tục";
    $("frPause").disabled=true;
    saveActive();
  }
  function finish(auto=false){
    clearInterval(interval);
    interval=null;
    running=false;

    const used=Math.max(1,Math.round((selectedMinutes*60-remaining)/60));
    const tasks=taskDone.filter(Boolean).length;
    const completed=auto || remaining===0 || used>=Math.max(5,Math.round(selectedMinutes*.6));
    const reward=completed ? 10 + tasks*5 : 0;
    const g=currentGoal();

    const h=history();
    h.unshift({
      id:Date.now(),
      date:new Date().toLocaleString("vi-VN"),
      goal:g.title,
      minutes:used,
      tasks,
      completed
    });
    saveHistory(h);

    if(reward>0){
      localStorage.setItem(XPKEY,String(xp()+reward));
      window.dispatchEvent(new CustomEvent("avp:progress-changed"));
    }

    localStorage.removeItem(ACTIVEKEY);
    startedAt=null;

    $("frSummaryTitle").textContent=completed?"Phiên học hoàn thành!":"Đã lưu phiên học";
    $("frSummaryText").textContent=completed
      ?"Bạn đã hoàn thành một phiên tập trung thật. Giữ nhịp này quan trọng hơn học thật lâu trong một ngày."
      :"Phiên khá ngắn nên chưa được tính hoàn thành, nhưng lịch sử vẫn được lưu.";
    $("frSummaryMinutes").textContent=used+"m";
    $("frSummaryTasks").textContent=tasks+"/3";
    $("frSummaryXP").textContent="+"+reward;
    if($("frSummaryContinue")){
      $("frSummaryContinue").href=g.link;
      $("frSummaryContinue").textContent="Tiếp tục "+g.title+" →";
    }
    $("frSummary").hidden=false;

    remaining=selectedMinutes*60;
    taskDone=[false,false,false];
    $("frGoal").disabled=false;
    $("frStart").disabled=false;
    $("frStart").textContent="▶ Bắt đầu";
    $("frPause").disabled=true;
    $("frFinish").disabled=true;
    $("frState").textContent="READY";
    renderTimer();
    renderPlan();
    renderStats();
    renderHistory();
  }

  function init(){
    restoreActive();
    renderTimer();
    renderPlan();
    renderStats();
    renderHistory();

    $("frPresets").querySelectorAll("button[data-min]").forEach(btn=>{
      btn.onclick=()=>{
        if(running || startedAt) return;
        selectedMinutes=Number(btn.dataset.min);
        remaining=selectedMinutes*60;
        document.querySelectorAll("#frPresets button").forEach(b=>b.classList.toggle("active",b===btn));
        renderTimer();
      };
    });

    $("frGoal").onchange=()=>{
      if(running) return;
      taskDone=[false,false,false];
      renderPlan();
      saveActive();
    };

    $("frStart").onclick=start;
    $("frPause").onclick=pause;
    $("frFinish").onclick=()=>finish(false);

    $("frSummaryClose").onclick=()=>{$("frSummary").hidden=true};
    $("frSummaryDone").onclick=()=>{$("frSummary").hidden=true};
    $("frSummary").onclick=e=>{if(e.target===$("frSummary"))$("frSummary").hidden=true};

    $("frClearHistory").onclick=()=>{
      if(!history().length) return;
      if(confirm("Xóa toàn bộ lịch sử Focus Room trên thiết bị này?")){
        saveHistory([]);
        renderStats();
        renderHistory();
      }
    };

    window.addEventListener("beforeunload",saveActive);
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",init,{once:true});
  }else{
    init();
  }
})();
