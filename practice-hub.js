(() => {
  "use strict";

  const q = (s, r=document) => r.querySelector(s);
  const qa = (s, r=document) => Array.from(r.querySelectorAll(s));

  const chooser = q(".ph-switch");
  const header = q("#phFocusHeader");
  let youtubeLoaded = false;
  let busy = false;

  const sources = {
    tiktok: {
      icon:"📱",
      kicker:"TIKTOK PRACTICE",
      title:"Theo video TikTok",
      desc:"Kho bài TikTok, vote nhu cầu và file thực hành."
    },
    youtube: {
      icon:"▶️",
      kicker:"YOUTUBE PROJECT",
      title:"Theo YouTube",
      desc:"Project dài, file theo từng phần và tài nguyên đi kèm."
    },
    grader: {
      icon:"🧪",
      kicker:"AUTO GRADING",
      title:"Chấm điểm tự động",
      desc:"Tải file, làm Excel, nộp lại và nhận điểm từ hệ thống."
    },
    guide: {
      icon:"📖",
      kicker:"PRACTICE GUIDE",
      title:"Hướng dẫn làm bài",
      desc:"100 bài với gợi ý cách làm và lỗi cần tránh, không có đáp án sẵn."
    }
  };

  const branches = () => ({
    tiktok:q("#phBranchTiktok"),
    youtube:q("#phBranchYoutube"),
    grader:q("#phBranchGrader"),
    guide:q("#phBranchGuide")
  });

  function reducedMotion(){
    return false;
  }

  function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function hideBranches(){
    Object.values(branches()).forEach(el => {
      if(!el) return;
      el.hidden = true;
      el.classList.remove("ph-v56-reveal");
    });

    qa("[data-practice-branch]").forEach(btn => {
      btn.classList.remove("active","is-picked");
      btn.setAttribute("aria-selected","false");
    });
  }

  function fillHeader(name){
    const meta = sources[name] || sources.tiktok;
    q("#phFocusIcon").textContent = meta.icon;
    q("#phFocusKicker").textContent = meta.kicker;
    q("#phFocusTitle").textContent = meta.title;
    q("#phFocusDesc").textContent = meta.desc;
  }

  function loadYoutube(){
    if(youtubeLoaded) return;
    youtubeLoaded = true;
    const wrap = q("#phYoutubeFrameWrap");
    if(!wrap) return;
    wrap.innerHTML = `
      <iframe
        class="ph-youtube-frame"
        src="practice-youtube.html?embed=1"
        title="Bài tập YouTube"
        loading="lazy"
      ></iframe>
    `;
  }

  function showBranch(name, animate=true){
    hideBranches();

    const target = branches()[name];
    if(!target) return;

    target.hidden = false;

    if(name === "youtube") loadYoutube();

    const btn = q(`[data-practice-branch="${name}"]`);
    if(btn){
      btn.classList.add("active");
      btn.setAttribute("aria-selected","true");
    }

    if(animate && !reducedMotion()){
      void target.offsetWidth;
      target.classList.add("ph-v56-reveal");
      setTimeout(() => target.classList.remove("ph-v56-reveal"), 600);
    }
  }

  async function openSource(name, btn, animate=true){
    if(busy || !branches()[name]) return;
    busy = true;

    fillHeader(name);

    if(animate && !reducedMotion() && btn){
      chooser.classList.add("is-choosing");
      btn.classList.add("is-picked");
      await sleep(360);

      chooser.classList.add("is-leaving");
      await sleep(260);
    }

    chooser.hidden = true;
    chooser.classList.remove("is-choosing","is-leaving");
    btn?.classList.remove("is-picked");

    header.hidden = false;
    header.classList.remove("is-opening");
    if(animate && !reducedMotion()){
      void header.offsetWidth;
      header.classList.add("is-opening");
    }

    showBranch(name, animate);
    history.replaceState(null,"","#"+name);

    const top = Math.max(0, header.getBoundingClientRect().top + window.scrollY - 88);
    window.scrollTo({
      top,
      left:0,
      behavior:reducedMotion() ? "auto" : "smooth"
    });

    await sleep(animate ? 480 : 0);
    header.classList.remove("is-opening");
    busy = false;
  }

  function closeSource(){
    if(busy) return;

    hideBranches();
    header.hidden = true;
    chooser.hidden = false;
    chooser.classList.remove("is-choosing","is-leaving");

    history.replaceState(null,"",location.pathname + location.search);

    const top = Math.max(0, chooser.getBoundingClientRect().top + window.scrollY - 88);
    window.scrollTo({
      top,
      left:0,
      behavior:reducedMotion() ? "auto" : "smooth"
    });
  }

  function initTopicTabs(){
    qa("[data-pg-topic]").forEach(btn => {
      btn.addEventListener("click", () => {
        const topic = btn.dataset.pgTopic;
        qa("[data-pg-topic]").forEach(x =>
          x.classList.toggle("active", x === btn)
        );
        qa("[data-pg-panel]").forEach(panel => {
          panel.hidden = panel.dataset.pgPanel !== topic;
        });
      });
    });
  }

  function init(){
    hideBranches();
    header.hidden = true;
    chooser.hidden = false;

    qa("[data-practice-branch]").forEach(btn => {
      btn.addEventListener("click", () => {
        openSource(btn.dataset.practiceBranch, btn, true);
      });
    });

    q("[data-professional-track]")?.addEventListener("click", async e => {
      if(busy) return;
      e.preventDefault();
      const link=e.currentTarget;
      const href=link.href;
      busy=true;

      if(!reducedMotion()){
        chooser.classList.add("is-choosing");
        link.classList.add("is-picked");
        await sleep(360);

        chooser.classList.add("is-leaving");
        await sleep(260);
      }

      location.href=href;
    });

    q("#phSourceBack")?.addEventListener("click", closeSource);

    initTopicTabs();

    const hash = location.hash.replace("#","");
    if(["tiktok","youtube","grader","guide"].includes(hash)){
      const btn = q(`[data-practice-branch="${hash}"]`);
      openSource(hash, btn, false);
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init, {once:true});
  }else{
    init();
  }
})();
