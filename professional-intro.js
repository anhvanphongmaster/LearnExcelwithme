(() => {
  "use strict";

  const INTRO_ID="ptiIntro";
  let runToken=0;
  let activeTimers=[];

  const INTRO_HTML=`
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

  function clearTimers(){
    activeTimers.forEach(clearTimeout);
    activeTimers=[];
  }

  function sleep(ms,token){
    return new Promise(resolve=>{
      const id=setTimeout(()=>{
        if(token===runToken) resolve(true);
        else resolve(false);
      },ms);
      activeTimers.push(id);
    });
  }

  function removeExisting(){
    const old=document.getElementById(INTRO_ID);
    if(old) old.remove();
  }

  function mountFreshIntro(){
    removeExisting();
    document.body.insertAdjacentHTML("afterbegin",INTRO_HTML);
    return document.getElementById(INTRO_ID);
  }

  async function startIntro(){
    runToken++;
    const token=runToken;
    clearTimers();

    const intro=mountFreshIntro();
    if(!intro) return;

    const textEl=intro.querySelector("#ptiTypeText");
    const caret=intro.querySelector("#ptiCaret");
    const skip=intro.querySelector("#ptiSkip");
    let closed=false;

    function closeIntro(){
      if(closed || token!==runToken) return;
      closed=true;
      intro.classList.add("pti-exit");
      if(caret) caret.style.opacity="0";

      const id=setTimeout(()=>{
        if(intro.isConnected) intro.remove();
      },760);
      activeTimers.push(id);
    }

    skip?.addEventListener("click",closeIntro,{once:true});

    const escHandler=e=>{
      if(e.key==="Escape"){
        closeIntro();
        document.removeEventListener("keydown",escHandler);
      }
    };
    document.addEventListener("keydown",escHandler);

    async function typeLine(line){
      textEl.textContent="";
      textEl.style.opacity="1";
      textEl.style.transform="none";

      for(const ch of line){
        if(closed || token!==runToken) return false;
        textEl.textContent+=ch;

        let delay=23;
        if(/[,.—:;!?]/.test(ch)) delay=105;
        else if(ch===" ") delay=14;

        if(!(await sleep(delay,token))) return false;
      }
      return true;
    }

    if(!(await sleep(1050,token)) || closed) return;

    for(let i=0;i<lines.length;i++){
      if(!(await typeLine(lines[i])) || closed) return;

      if(!(await sleep(i===lines.length-1?1100:820,token)) || closed) return;

      if(i<lines.length-1){
        const anim=textEl.animate(
          [
            {opacity:1,transform:"translateY(0)"},
            {opacity:0,transform:"translateY(-6px)"}
          ],
          {duration:240,easing:"ease",fill:"forwards"}
        );

        if(!(await sleep(245,token)) || closed) return;
        anim.cancel();
        textEl.textContent="";
      }
    }

    if(await sleep(320,token)) closeIntro();
  }

  // IMPORTANT:
  // pageshow fires not only on a normal navigation but also when Safari/Chrome
  // restores this page from the back-forward cache. That is exactly why the
  // previous intro could run only once.
  window.addEventListener("pageshow",()=>{
    startIntro();
  });

  // Some embedded/webview environments can restore visibility without a full
  // pageshow. If the page becomes visible again and no intro exists, recreate it.
  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible" && !document.getElementById(INTRO_ID)){
      // Only restart when this document has actually been revisited after load.
      if(performance.now()>1500){
        startIntro();
      }
    }
  });
})();
