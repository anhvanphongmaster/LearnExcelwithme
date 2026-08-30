(() => {
  "use strict";

  const q = (s, r=document) => r.querySelector(s);
  const qa = (s, r=document) => Array.from(r.querySelectorAll(s));

  let youtubeLoaded = false;
  let switching = false;

  const branchMap = () => ({
    tiktok: q("#phBranchTiktok"),
    youtube: q("#phBranchYoutube"),
    grader: q("#phBranchGrader"),
    guide: q("#phBranchGuide")
  });

  function markSelected(name) {
    qa("[data-practice-branch]").forEach(btn => {
      const active = btn.dataset.practiceBranch === name;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
      btn.tabIndex = active ? 0 : -1;
    });
  }

  function showBranch(name, {animate=true} = {}) {
    const map = branchMap();

    Object.entries(map).forEach(([key, el]) => {
      if (!el) return;
      const active = key === name;
      el.hidden = !active;
      el.classList.toggle("ph-branch-active", active);

      if (active && animate) {
        el.classList.remove("ph-branch-reveal", "ph-branch-flash");
        void el.offsetWidth;
        el.classList.add("ph-branch-reveal", "ph-branch-flash");
        window.setTimeout(() => {
          el.classList.remove("ph-branch-reveal", "ph-branch-flash");
        }, 760);
      }
    });

    markSelected(name);

    if (name === "youtube") loadYoutube();
    try { sessionStorage.setItem("avp_practice_branch", name); } catch(e) {}

    return map[name] || null;
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

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function smoothReveal(target) {
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 92;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReducedMotion() ? "auto" : "smooth"
    });
  }

  function makeFlightClone(btn) {
    const rect = btn.getBoundingClientRect();
    const clone = btn.cloneNode(true);
    clone.classList.add("ph-choice-flight");
    clone.classList.remove("active", "is-launching");
    clone.removeAttribute("role");
    clone.removeAttribute("aria-selected");
    clone.removeAttribute("tabindex");
    clone.disabled = true;

    Object.assign(clone.style, {
      left: rect.left + "px",
      top: rect.top + "px",
      width: rect.width + "px",
      height: rect.height + "px"
    });

    document.body.appendChild(clone);
    return {clone, rect};
  }

  async function animateBranchSwitch(btn, branch) {
    if (switching) return;
    switching = true;

    const grid = q(".ph-switch-grid");
    const current = q(".ph-choice.active");
    const targetAlreadyActive = current === btn;

    if (grid) grid.classList.add("is-switching");
    btn.classList.add("is-launching");

    if (prefersReducedMotion()) {
      const target = showBranch(branch, {animate:false});
      if (grid) grid.classList.remove("is-switching");
      btn.classList.remove("is-launching");
      switching = false;
      smoothReveal(target);
      return;
    }

    let flight = null;
    try {
      flight = makeFlightClone(btn);
    } catch(e) {}

    await new Promise(resolve => window.setTimeout(resolve, 150));

    const target = showBranch(branch, {animate:true});

    if (flight && flight.clone && target) {
      const start = flight.rect;
      const end = target.getBoundingClientRect();

      const targetX = Math.max(16, Math.min(window.innerWidth - 16, end.left + Math.min(end.width, 420) / 2));
      const targetY = Math.max(80, Math.min(window.innerHeight - 80, end.top + 68));
      const startX = start.left + start.width / 2;
      const startY = start.top + start.height / 2;

      const dx = targetX - startX;
      const dy = targetY - startY;
      const scaleX = Math.max(.58, Math.min(1.45, Math.min(end.width, 420) / Math.max(start.width, 1)));
      const scale = Math.min(1.16, Math.max(.72, scaleX));

      try {
        const anim = flight.clone.animate([
          {transform:"translate3d(0,0,0) scale(1)", opacity:1, filter:"blur(0px)"},
          {offset:.35, transform:"translate3d("+(dx*.34)+"px,"+(dy*.28)+"px,0) scale(1.07)", opacity:.94},
          {transform:"translate3d("+dx+"px,"+dy+"px,0) scale("+scale+")", opacity:0, filter:"blur(2px)"}
        ], {
          duration:430,
          easing:"cubic-bezier(.2,.78,.22,1)",
          fill:"forwards"
        });
        await anim.finished.catch(() => {});
      } catch(e) {
        await new Promise(resolve => window.setTimeout(resolve, 360));
      }

      flight.clone.remove();
    } else {
      await new Promise(resolve => window.setTimeout(resolve, 260));
    }

    if (grid) grid.classList.remove("is-switching");
    btn.classList.remove("is-launching");
    switching = false;

    smoothReveal(target);

    // When tapping the already selected source, replay the reveal so the card
    // still feels like an entrance to that content.
    if (targetAlreadyActive && target) {
      target.classList.remove("ph-branch-reveal");
      void target.offsetWidth;
      target.classList.add("ph-branch-reveal");
      window.setTimeout(() => target.classList.remove("ph-branch-reveal"), 600);
    }
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

  async function canEnterGrader() {
    const access = window.AVPAccess;
    if (!access) {
      location.href = "auth.html?next=" + encodeURIComponent("practice-video.html#grader");
      return false;
    }

    const user = await access.requireLogin({
      next: "practice-video.html#grader",
      reason: "Đăng nhập để làm bài chấm điểm."
    });
    return !!user;
  }

  function init() {
    qa("[data-practice-branch]").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (switching) return;
        const branch = btn.dataset.practiceBranch;

        if (branch === "grader") {
          const ok = await canEnterGrader();
          if (!ok) return;
        }

        animateBranchSwitch(btn, branch);
      });
    });

    initTopicTabs();

    let initial = "tiktok";
    try {
      const saved = sessionStorage.getItem("avp_practice_branch");
      if (["tiktok","youtube","grader","guide"].includes(saved)) initial = saved;
    } catch(e) {}

    const hash = location.hash.replace("#","");
    if (["tiktok","youtube","grader","guide"].includes(hash)) initial = hash;

    if (initial === "grader") {
      (async () => {
        const access = window.AVPAccess;
        if (!access) {
          showBranch("tiktok", {animate:false});
          return;
        }
        const user = await access.getUser(true);
        if (user) showBranch("grader", {animate:false});
        else {
          showBranch("tiktok", {animate:false});
          access.goLogin("practice-video.html#grader");
        }
      })();
    } else {
      showBranch(initial, {animate:false});
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
