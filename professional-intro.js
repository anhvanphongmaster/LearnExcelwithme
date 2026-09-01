(() => {
  "use strict";

  const intro=document.getElementById("ptiIntro");
  const textEl=document.getElementById("ptiTypeText");
  const caret=document.getElementById("ptiCaret");
  const skip=document.getElementById("ptiSkip");

  if(!intro || !textEl) return;

  const lines=[
    "Đây không chỉ là nơi học thêm một vài công thức Excel.",
    "Bạn sẽ bước vào những tình huống gần với công việc thực tế — nơi dữ liệu cần được hiểu, kiểm tra và xử lý có chủ đích.",
    "Mỗi case yêu cầu tư duy nghiệp vụ, độ chính xác và khả năng hoàn thiện một file có thể bàn giao.",
    "Hãy làm như một người đang giải quyết công việc thật, không phải chỉ hoàn thành một bài tập."
  ];

  let stopped=false;
  let timers=[];

  const sleep=ms=>new Promise(resolve=>{
    const id=setTimeout(resolve,ms);
    timers.push(id);
  });

  async function typeLine(line){
    for(let i=0;i<line.length;i++){
      if(stopped) return;
      textEl.textContent+=line[i];

      let delay=23;
      const ch=line[i];
      if(/[,.—:;!?]/.test(ch)) delay=105;
      else if(ch===" ") delay=14;

      await sleep(delay);
    }
  }

  async function run(){
    // Cho title xuất hiện trước, rồi mới bắt đầu "đánh máy".
    await sleep(1050);

    for(let i=0;i<lines.length;i++){
      if(stopped) return;

      textEl.textContent="";
      await typeLine(lines[i]);
      if(stopped) return;

      await sleep(i===lines.length-1?1100:820);

      if(i<lines.length-1){
        textEl.animate(
          [{opacity:1,transform:"translateY(0)"},{opacity:0,transform:"translateY(-6px)"}],
          {duration:240,easing:"ease",fill:"forwards"}
        );
        await sleep(245);
        textEl.textContent="";
        textEl.getAnimations().forEach(a=>a.cancel());
      }
    }

    await sleep(320);
    closeIntro();
  }

  function closeIntro(){
    if(stopped && intro.classList.contains("pti-exit")) return;
    stopped=true;
    intro.classList.add("pti-exit");
    if(caret) caret.style.opacity="0";

    setTimeout(()=>{
      intro.remove();
    },760);
  }

  skip?.addEventListener("click",closeIntro);

  // ESC cũng bỏ qua trên desktop.
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape" && document.body.contains(intro)) closeIntro();
  });

  // Chỉ phát một lần trong mỗi tab/session.
  // Nếu quay lại trang trong cùng phiên thì bỏ intro để tránh gây khó chịu.
  const key="avp_professional_intro_seen_v1";
  let seen=false;
  try{seen=sessionStorage.getItem(key)==="1"}catch(_){}

  if(seen){
    intro.remove();
    return;
  }

  try{sessionStorage.setItem(key,"1")}catch(_){}
  run();
})();
