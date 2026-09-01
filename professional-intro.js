(() => {
  "use strict";

  const ID="ptiIntro";
  let token=0;
  let timers=[];

  const TEMPLATE=`
  <div class="pti-intro" id="ptiIntro" aria-live="polite">
    <div class="pti-stage" aria-hidden="true">
      <span class="pti-orbit pti-orbit-a"></span>
      <span class="pti-orbit pti-orbit-b"></span>
      <span class="pti-line pti-line-a"></span>
      <span class="pti-line pti-line-b"></span>
      <span class="pti-glow"></span>
    </div>

    <button type="button" class="pti-skip" id="ptiSkip">Bỏ qua</button>

    <div class="pti-content">
      <div class="pti-mark" aria-hidden="true"><span>AVP</span></div>
      <p class="pti-eyebrow">PROFESSIONAL TRACK</p>
      <h1>Lộ trình Excel Chuyên nghiệp</h1>
      <div class="pti-rule" aria-hidden="true"><i></i></div>
      <p class="pti-type" id="ptiTypeText"></p>
      <span class="pti-caret" id="ptiCaret" aria-hidden="true"></span>

      <div class="pti-footer">
        <span>CASE THỰC TẾ</span><i></i>
        <span>TƯ DUY NGHIỆP VỤ</span><i></i>
        <span>CHẤM ĐIỂM</span><i></i>
        <span>ADMIN SUPPORT</span>
      </div>
    </div>
  </div>`;

  const lines=[
    "Đây không chỉ là nơi học thêm một vài công thức Excel.",
    "Bạn sẽ bước vào những tình huống gần với công việc thực tế — nơi dữ liệu cần được hiểu, kiểm tra và xử lý có chủ đích.",
    "Mỗi case yêu cầu tư duy nghiệp vụ, độ chính xác và khả năng hoàn thiện một file có thể bàn giao.",
    "Hãy làm như một người đang giải quyết công việc thật, không phải chỉ hoàn thành một bài tập."
  ];

  function clearAll(){
    timers.forEach(clearTimeout);
    timers=[];
  }

  function wait(ms,myToken){
    return new Promise(resolve=>{
      const id=setTimeout(()=>resolve(myToken===token),ms);
      timers.push(id);
    });
  }

  function mount(){
    document.getElementById(ID)?.remove();
    document.body.insertAdjacentHTML("afterbegin",TEMPLATE);
    return document.getElementById(ID);
  }

  async function replay(){
    token++;
    const myToken=token;
    clearAll();

    const intro=mount();
    if(!intro) return;

    const text=intro.querySelector("#ptiTypeText");
    const caret=intro.querySelector("#ptiCaret");
    const skip=intro.querySelector("#ptiSkip");
    let closing=false;

    function close(){
      if(closing || myToken!==token) return;
      closing=true;
      intro.classList.add("pti-exit");
      if(caret) caret.style.opacity="0";
      const id=setTimeout(()=>intro.remove(),760);
      timers.push(id);
    }

    skip?.addEventListener("click",close,{once:true});

    const onKey=e=>{
      if(e.key==="Escape"){
        document.removeEventListener("keydown",onKey);
        close();
      }
    };
    document.addEventListener("keydown",onKey);

    if(!(await wait(950,myToken))) return;

    for(let idx=0; idx<lines.length; idx++){
      text.textContent="";
      text.style.opacity="1";
      text.style.transform="none";

      for(const ch of lines[idx]){
        if(myToken!==token || closing) return;
        text.textContent+=ch;

        let delay=34;
        if(/[,.—:;!?]/.test(ch)) delay=150;
        else if(ch===" ") delay=18;

        if(!(await wait(delay,myToken))) return;
      }

      if(!(await wait(idx===lines.length-1?1200:950,myToken))) return;

      if(idx<lines.length-1){
        text.style.opacity="0";
        if(!(await wait(180,myToken))) return;
      }
    }

    if(await wait(260,myToken)) close();
  }

  function shouldPlay(){
    const q=new URLSearchParams(location.search);
    return q.get("intro")!=="0";
  }

  function startNow(){
    if(!shouldPlay()) return;
    requestAnimationFrame(()=>requestAnimationFrame(replay));
  }

  // Normal navigation / reload.
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",startNow,{once:true});
  }else{
    startNow();
  }

  // Browser back-forward cache restore.
  window.addEventListener("pageshow",event=>{
    if(event.persisted){
      replay();
    }
  });

  // Returning to the tab after browser/webview restoration.
  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible" && shouldPlay() && !document.getElementById(ID)){
      replay();
    }
  });

  // Allow the Practice Hub to explicitly force replay in the future if needed.
  window.AVPProfessionalIntro={replay};
})();
