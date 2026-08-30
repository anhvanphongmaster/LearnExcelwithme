(() => {
  "use strict";

  const q = (s, r=document) => r.querySelector(s);
  const qa = (s, r=document) => Array.from(r.querySelectorAll(s));

  const page = q(".pv-page");
  const chooser = q(".ph-switch");
  const grid = q(".ph-switch-grid");

  let youtubeLoaded = false;
  let entering = false;
  let activeBranch = null;

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
    return !!(window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);
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
      <button type="button" class="ph-source-back" id="phSourceBack">← Chọn nguồn khác</button>
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
      window.setTimeout(() => target.classList.remove("ph-focus-reveal"), 650);
    }

    const btn = q(`[data-practice-branch="${name}"]`);
    if (btn) {
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
    }

    if (name === "youtube") loadYoutube();
    activeBranch = name;
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

  function createMorphClone(btn) {
    const rect = btn.getBoundingClientRect();
    const clone = btn.cloneNode(true);
    clone.classList.add("ph-source-morph");
    clone.classList.remove("active", "is-entering-source");
    clone.disabled = true;
    clone.removeAttribute("role");
    clone.removeAttribute("aria-selected");

    Object.assign(clone.style, {
      left: rect.left + "px",
      top: rect.top + "px",
      width: rect.width + "px",
      height: rect.height + "px"
    });

    document.body.appendChild(clone);
    return {clone, rect};
  }

  function scrollToHeader() {
    const header = q("#phFocusHeader");
    if (!header) return;
    const top = Math.max(
      0,
      header.getBoundingClientRect().top + window.scrollY - 88
    );
    window.scrollTo({
      top,
      behavior: reducedMotion() ? "auto" : "smooth"
    });
  }

  async function openSource(name, btn, {animate=true} = {}) {
    if (entering) return;
    const target = branchMap()[name];
    if (!target) return;

    entering = true;
    const header = fillFocusHeader(name);

    // Put the future header into layout only for measurement.
    header.hidden = false;
    header.classList.remove("is-visible");
    header.style.visibility = "hidden";
    page?.classList.remove("ph-source-open");

    const headerRect = header.getBoundingClientRect();
    header.hidden = true;
    header.style.visibility = "";

    if (!animate || reducedMotion() || !btn) {
      page?.classList.add("ph-source-open");
      header.hidden = false;
      header.classList.add("is-visible");
      showOnlyBranch(name, false);
      history.replaceState(null, "", "#"+name);
      entering = false;
      scrollToHeader();
      return;
    }

    chooser?.classList.add("is-entering");
    btn.classList.add("is-entering-source");

    let flight = null;
    try { flight = createMorphClone(btn); } catch(e) {}

    if (flight?.clone) {
      const start = flight.rect;
      const startCX = start.left + start.width / 2;
      const startCY = start.top + start.height / 2;
      const endCX = headerRect.left + headerRect.width / 2;
      const endCY = headerRect.top + Math.min(headerRect.height, 165) / 2;

      const dx = endCX - startCX;
      const dy = endCY - startCY;
      const sx = Math.max(.9, Math.min(4, headerRect.width / Math.max(1,start.width)));
      const sy = Math.max(.75, Math.min(1.7, Math.min(headerRect.height,165) / Math.max(1,start.height)));

      try {
        const animation = flight.clone.animate([
          {
            transform:"translate3d(0,0,0) scale(1,1)",
            opacity:1,
            borderRadius:"20px"
          },
          {
            offset:.28,
            transform:"translate3d("+(dx*.20)+"px,"+(dy*.16)+"px,0) scale(1.08,1.05)",
            opacity:1,
            borderRadius:"22px"
          },
          {
            transform:"translate3d("+dx+"px,"+dy+"px,0) scale("+sx+","+sy+")",
            opacity:.08,
            borderRadius:"24px"
          }
        ], {
          duration:620,
          easing:"cubic-bezier(.16,.84,.24,1)",
          fill:"forwards"
        });

        await animation.finished.catch(() => {});
      } catch(e) {
        await new Promise(r => setTimeout(r, 620));
      }

      flight.clone.remove();
    } else {
      await new Promise(r => setTimeout(r, 420));
    }

    // Enter single-source mode only after the zoom animation.
    page?.classList.add("ph-source-open");
    header.hidden = false;
    header.classList.add("is-visible");
    showOnlyBranch(name, true);

    chooser?.classList.remove("is-entering");
    btn.classList.remove("is-entering-source");

    history.replaceState(null, "", "#"+name);
    entering = false;
    scrollToHeader();
  }

  function closeSource() {
    if (entering) return;
    activeBranch = null;
    hideAllBranches();

    const header = ensureFocusHeader();
    header.classList.remove("is-visible");
    header.hidden = true;

    page?.classList.remove("ph-source-open");
    chooser?.classList.remove("is-entering");

    history.replaceState(null, "", location.pathname + location.search);

    const top = Math.max(
      0,
      chooser.getBoundingClientRect().top + window.scrollY - 88
    );
    window.scrollTo({
      top,
      behavior: reducedMotion() ? "auto" : "smooth"
    });
  }

  function initTopicTabs() {
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

  function bindChooser() {
    qa("[data-practice-branch]").forEach(btn => {
      btn.addEventListener("click", () => {
        // Không chặn Auto Grading ở đây.
        // practice-grader.js tự xử lý đăng nhập khi người dùng tải/nộp bài.
        openSource(btn.dataset.practiceBranch, btn, {animate:true});
      });
    });
  }

  function init() {
    ensureFocusHeader();
    hideAllBranches();
    bindChooser();
    initTopicTabs();

    // Bình thường vào trang: CHỈ 4 nguồn.
    // Chỉ tự mở khi có deep-link rõ ràng, ví dụ sau khi login quay về #grader.
    const hash = location.hash.replace("#", "");
    if (["tiktok","youtube","grader","guide"].includes(hash)) {
      const btn = q(`[data-practice-branch="${hash}"]`);
      window.setTimeout(() => openSource(hash, btn, {animate:false}), 0);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
