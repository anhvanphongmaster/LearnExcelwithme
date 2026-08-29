(() => {
  "use strict";

  const q = (s, r=document) => r.querySelector(s);
  const qa = (s, r=document) => Array.from(r.querySelectorAll(s));

  let youtubeLoaded = false;

  function setBranch(name) {
    const map = {
      tiktok: q("#phBranchTiktok"),
      youtube: q("#phBranchYoutube"),
      grader: q("#phBranchGrader")
    };

    Object.entries(map).forEach(([key, el]) => {
      if (!el) return;
      const active = key === name;
      el.hidden = !active;
      el.classList.toggle("ph-branch-active", active);
    });

    qa("[data-practice-branch]").forEach(btn => {
      const active = btn.dataset.practiceBranch === name;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });

    if (name === "youtube") loadYoutube();
    try { sessionStorage.setItem("avp_practice_branch", name); } catch(e) {}
  }

  function loadYoutube() {
    if (youtubeLoaded) return;
    youtubeLoaded = true;

    const wrap = q("#phYoutubeFrameWrap");
    if (!wrap) return;

    wrap.innerHTML = `
      <iframe
        class="ph-youtube-frame"
        src="practice-youtube.html?embed=1"
        title="Bài tập YouTube"
        loading="lazy"
      ></iframe>
    `;
  }

  function initTopicTabs() {
    qa("[data-pg-topic]").forEach(btn => {
      btn.addEventListener("click", () => {
        const topic = btn.dataset.pgTopic;
        qa("[data-pg-topic]").forEach(x => x.classList.toggle("active", x === btn));
        qa("[data-pg-panel]").forEach(panel => {
          panel.hidden = panel.dataset.pgPanel !== topic;
        });
      });
    });
  }

  function init() {
    qa("[data-practice-branch]").forEach(btn => {
      btn.addEventListener("click", () => setBranch(btn.dataset.practiceBranch));
    });

    initTopicTabs();

    let initial = "tiktok";
    try {
      const saved = sessionStorage.getItem("avp_practice_branch");
      if (["tiktok","youtube","grader"].includes(saved)) initial = saved;
    } catch(e) {}

    const hash = location.hash.replace("#","");
    if (["tiktok","youtube","grader"].includes(hash)) initial = hash;

    setBranch(initial);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
