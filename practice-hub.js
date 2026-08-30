(() => {
  "use strict";

  const q = (s, r=document) => r.querySelector(s);
  const qa = (s, r=document) => Array.from(r.querySelectorAll(s));

  const page = q(".pv-page");
  const chooser = q(".ph-switch");

  let youtubeLoaded = false;
  let entering = false;

  const sourceMeta = {
    tiktok: {
      icon: "📱",
      kicker: "TIKTOK PRACTICE",
      title: "Theo video TikTok",
      desc: "Kho bài TikTok, vote nhu cầu và file thực hành."
    },
    youtube: {
      icon: "▶️",
      kicker: "YOUTUBE PROJECT",
      title: "Theo YouTube",
      desc: "Project dài, file theo từng phần và tài nguyên đi kèm."
    },
    grader: {
      icon: "🧪",
      kicker: "AUTO GRADING",
      title: "Chấm điểm tự động",
      desc: "Tải file, làm Excel, nộp lại và nhận điểm từ hệ thống."
    },
    guide: {
      icon: "📖",
      kicker: "PRACTICE GUIDE",
      title: "Hướng dẫn làm bài",
      desc: "100 bài với gợi ý cách làm và lỗi cần tránh, không có đáp án sẵn."
    }
  };

  const branchMap = () => ({
    tiktok: q("#phBranchTiktok"),
    youtube: q("#phBranchYoutube"),
    grader: q("#phBranchGrader"),
    guide: q("#phBranchGuide")
  });

  function reducedMotion() {
    return !!(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function resetHorizontalScroll() {
    try {
      document.documentElement.scrollLeft = 0;
      document.body.scrollLeft = 0;
    } catch(e) {}
  }

  function ensureFocusHeader() {
    let header = q("#phFocusHeader");
    if (header) return header;

    header = document.createElement("section");
    header.id = "phFocusHeader";
    header.className = "ph-focus-header";
    header.hidden = true;
    header.setAttribute("aria-live", "polite");
    header.innerHTML = `
      <div class="ph-focus-icon" id="phFocusIcon">📱</div>
      <div class="ph-focus-copy">
        <span class="ph-focus-kicker" id="phFocusKicker"></span>
        <h1 class="ph-focus-title" id="phFocusTitle"></h1>
        <p class="ph-focus-desc" id="phFocusDesc"></p>
      </div>
      <button type="button" class="ph-source-back" id="phSourceBack">
        ← Chọn nguồn khác
      </button>
    `;

    chooser.insertAdjacentElement("afterend", header);
    q("#phSourceBack", header).addEventListener("click", closeSource);
    return header;
  }

  function fillFocusHeader(name) {
    const meta = sourceMeta[name] || sourceMeta.tiktok;
    const header = ensureFocusHeader();

    q("#phFocusIcon", header).textContent = meta.icon;
    q("#phFocusKicker", header).textContent = meta.kicker;
    q("#phFocusTitle", header).textContent = meta.title;
    q("#phFocusDesc", header).textContent = meta.desc;

    return header;
  }

  function hideAllBranches() {
    Object.values(branchMap()).forEach(el => {
      if (!el) return;
      el.hidden = true;
      el.classList.remove("ph-branch-active", "ph-focus-reveal");
    });

    qa("[data-practice-branch]").forEach(btn => {
      btn.classList.remove("active", "is-entering-source");
      btn.setAttribute("aria-selected", "false");
    });
  }

  function showOnlyBranch(name, animate=true) {
    hideAllBranches();

    const target = branchMap()[name];
    if (!target) return null;

    target.hidden = false;
    target.classList.add("ph-branch-active");

    if (animate && !reducedMotion()) {
      target.classList.remove("ph-focus-reveal");
      void target.offsetWidth;
      target.classList.add("ph-focus-reveal");
      window.setTimeout(() => {
        target.classList.remove("ph-focus-reveal");
      }, 700);
    }

    const btn = q(`[data-practice-branch="${name}"]`);
    if (btn) {
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
    }

    if (name === "youtube") loadYoutube();
    return target;
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

  function showFinalView(name, animateBranch) {
    resetHorizontalScroll();

    const header = fillFocusHeader(name);
    page?.classList.add("ph-source-open");
    header.hidden = false;
    header.classList.remove("is-visible");
    void header.offsetWidth;
    header.classList.add("is-visible");

    showOnlyBranch(name, animateBranch);

    history.replaceState(null, "", "#" + name);

    const top = Math.max(
      0,
      header.getBoundingClientRect().top + window.scrollY - 86
    );

    window.scrollTo({
      left: 0,
      top,
      behavior: reducedMotion() ? "auto" : "smooth"
    });
  }

  async function animateCardToHeader(btn, name) {
    const header = fillFocusHeader(name);

    // Measure final header at the LEFT/CENTERED document position.
    resetHorizontalScroll();
    header.hidden = false;
    header.classList.add("is-visible");
    header.style.visibility = "hidden";
    page?.classList.remove("ph-source-open");

    const finalRect = header.getBoundingClientRect();

    header.hidden = true;
    header.classList.remove("is-visible");
    header.style.visibility = "";

    const startRect = btn.getBoundingClientRect();

    const stage = document.createElement("div");
    stage.className = "ph-source-stage";
    document.body.appendChild(stage);

    const clone = btn.cloneNode(true);
    clone.classList.add("ph-source-stage-card");
    clone.classList.remove("active", "is-entering-source");
    clone.disabled = true;
    clone.removeAttribute("role");
    clone.removeAttribute("aria-selected");

    Object.assign(clone.style, {
      left: startRect.left + "px",
      top: startRect.top + "px",
      width: startRect.width + "px",
      height: startRect.height + "px",
      borderRadius: getComputedStyle(btn).borderRadius || "20px"
    });

    stage.appendChild(clone);
    void stage.offsetWidth;
    stage.classList.add("is-active");

    // First impact: obvious zoom on both desktop and mobile.
    try {
      await clone.animate([
        {
          transform:"scale(1)",
          opacity:1
        },
        {
          transform:"scale(1.12)",
          opacity:1
        },
        {
          transform:"scale(1.06)",
          opacity:1
        }
      ], {
        duration:330,
        easing:"cubic-bezier(.16,.84,.24,1)",
        fill:"forwards"
      }).finished;
    } catch(e) {
      await new Promise(r => setTimeout(r, 330));
    }

    // Then card itself expands into the header rectangle.
    try {
      await clone.animate([
        {
          left:startRect.left + "px",
          top:startRect.top + "px",
          width:startRect.width + "px",
          height:startRect.height + "px",
          borderRadius:"20px",
          transform:"scale(1.06)",
          opacity:1
        },
        {
          left:finalRect.left + "px",
          top:Math.max(18, finalRect.top) + "px",
          width:finalRect.width + "px",
          height:Math.max(160, finalRect.height) + "px",
          borderRadius:"24px",
          transform:"scale(1)",
          opacity:.94
        }
      ], {
        duration:520,
        easing:"cubic-bezier(.18,.82,.24,1)",
        fill:"forwards"
      }).finished;
    } catch(e) {
      await new Promise(r => setTimeout(r, 520));
    }

    showFinalView(name, true);

    try {
      await clone.animate([
        {opacity:.94},
        {opacity:0}
      ], {
        duration:180,
        easing:"ease-out",
        fill:"forwards"
      }).finished;
    } catch(e) {}

    stage.remove();
  }

  async function openSource(name, btn, {animate=true} = {}) {
    if (entering) return;
    if (!branchMap()[name]) return;

    entering = true;
    resetHorizontalScroll();

    if (!animate || reducedMotion() || !btn) {
      showFinalView(name, false);
      entering = false;
      return;
    }

    chooser?.classList.add("is-entering");
    btn.classList.add("is-entering-source");

    await animateCardToHeader(btn, name);

    chooser?.classList.remove("is-entering");
    btn.classList.remove("is-entering-source");
    entering = false;
  }

  function closeSource() {
    if (entering) return;

    hideAllBranches();

    const header = ensureFocusHeader();
    header.classList.remove("is-visible");
    header.hidden = true;

    page?.classList.remove("ph-source-open");
    chooser?.classList.remove("is-entering");

    history.replaceState(null, "", location.pathname + location.search);
    resetHorizontalScroll();

    const top = Math.max(
      0,
      chooser.getBoundingClientRect().top + window.scrollY - 86
    );

    window.scrollTo({
      left:0,
      top,
      behavior:reducedMotion() ? "auto" : "smooth"
    });
  }

  function initTopicTabs() {
    qa("[data-pg-topic]").forEach(btn => {
      btn.addEventListener("click", () => {
        const topic = btn.dataset.pgTopic;

        qa("[data-pg-topic]").forEach(x => {
          x.classList.toggle("active", x === btn);
        });

        qa("[data-pg-panel]").forEach(panel => {
          panel.hidden = panel.dataset.pgPanel !== topic;
        });
      });
    });
  }

  function bindChooser() {
    qa("[data-practice-branch]").forEach(btn => {
      btn.addEventListener("click", () => {
        openSource(btn.dataset.practiceBranch, btn, {animate:true});
      });
    });
  }

  function init() {
    resetHorizontalScroll();
    ensureFocusHeader();
    hideAllBranches();
    bindChooser();
    initTopicTabs();

    // Vào bình thường: chỉ 4 nguồn.
    // Deep link rõ ràng (#grader...) vẫn mở thẳng đúng nguồn.
    const hash = location.hash.replace("#", "");
    if (["tiktok","youtube","grader","guide"].includes(hash)) {
      const btn = q(`[data-practice-branch="${hash}"]`);
      window.setTimeout(() => {
        openSource(hash, btn, {animate:false});
      }, 0);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
