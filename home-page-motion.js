/*! avp-site-motion.js — reveal + parallax nhẹ banner (không đụng dữ liệu) */
(function () {
  if (window.__avpSiteMotion) return;
  window.__avpSiteMotion = true;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  var RISE_SEL = [
    ".course-card",
    ".practice-file-card",
    ".summary-card",
    ".level-card",
    ".continue-card",
    ".home-path-card",
    ".home-more-card",
    ".home-book-card",
    ".home-ref-item-v114",
    ".home-cta-card",
    ".dash-panel",
    ".pq-lesson",
    ".course-panel",
    ".path-item",
    ".learn-board",
    ".pv-panel",
    ".badge-card",
    ".lab-card"
  ].join(",");

  var BANNER_SEL = [
    ".pv-hero",
    ".ml-hero",
    ".pq-hero",
    ".dashboard-hero",
    ".avp-hero",
    ".learn-board",
    ".course-panel",
    ".dash-panel"
  ].join(",");

  function setupRise() {
    var nodes = document.querySelectorAll(RISE_SEL);
    if (!nodes.length) return;
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("avp-motion-rise", "avp-in"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("avp-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    nodes.forEach(function (n, i) {
      if (n.classList.contains("avp-motion-rise")) return;
      n.classList.add("avp-motion-rise");
      n.style.transitionDelay = Math.min(i * 0.04, 0.28) + "s";
      io.observe(n);
    });
  }

  /* Parallax nhẹ theo chuột trên banner trong khung */
  function setupBannerParallax() {
    if (window.matchMedia && window.matchMedia("(hover: none)").matches) return;
    var banners = document.querySelectorAll(BANNER_SEL);
    banners.forEach(function (el) {
      if (el.__avpPx) return;
      el.__avpPx = true;
      el.classList.add("avp-parallax-layer");
      var tx = 0, ty = 0, mx = 0, my = 0, raf = 0;

      function tick() {
        tx += (mx - tx) * 0.08;
        ty += (my - ty) * 0.08;
        el.style.transform =
          "translate3d(" + tx.toFixed(2) + "px," + ty.toFixed(2) + "px,0)";
        if (Math.abs(mx - tx) > 0.05 || Math.abs(my - ty) > 0.05) {
          raf = requestAnimationFrame(tick);
        } else {
          raf = 0;
        }
      }

      el.addEventListener(
        "mousemove",
        function (e) {
          var r = el.getBoundingClientRect();
          var px = (e.clientX - r.left) / Math.max(1, r.width) - 0.5;
          var py = (e.clientY - r.top) / Math.max(1, r.height) - 0.5;
          mx = px * 10; /* rất nhẹ — không vỡ layout */
          my = py * 6;
          if (!raf) raf = requestAnimationFrame(tick);
        },
        { passive: true }
      );

      el.addEventListener(
        "mouseleave",
        function () {
          mx = 0;
          my = 0;
          if (!raf) raf = requestAnimationFrame(tick);
        },
        { passive: true }
      );
    });
  }

  function boot() {
    setupRise();
    setupBannerParallax();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  // nội dung render muộn (practice grid…)
  setTimeout(boot, 600);
  setTimeout(boot, 1800);
})();
