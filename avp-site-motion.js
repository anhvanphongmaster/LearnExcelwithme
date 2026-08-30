/*! avp-site-motion.js — V87 global motion + navigation transitions */
(function () {
  "use strict";

  if (window.__avpSiteMotionV87) return;
  window.__avpSiteMotionV87 = true;

  var reduce = !!(
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  var RISE_SEL = [
    ".course-card",
    ".practice-file-card",
    ".summary-card",
    ".level-card",
    ".continue-card",
    ".home-path-card",
    ".home-more-card",
    ".home-cta-card",
    ".dash-panel",
    ".pq-lesson",
    ".course-panel",
    ".path-item",
    ".learn-board",
    ".pv-panel",
    ".badge-card",
    ".lab-card",
    ".tool-card",
    ".qc-card",
    ".ref-card",
    ".sm-node",
    ".sm-zone",
    ".fr-session-card",
    ".achievement-card",
    ".feature-card",
    ".content-card",
    ".grid-card",
    "article.card",
    ".card"
  ].join(",");

  var BANNER_SEL = [
    ".avp-hero",
    ".pv-hero",
    ".ml-hero",
    ".pq-hero",
    ".dashboard-hero",
    ".tools-hero",
    ".qc-hero",
    ".fr-hero",
    ".sm-hero",
    ".lp-hero",
    ".pyt-hero",
    ".adv-hero",
    ".ach-hero",
    ".achievement-learning-hero",
    ".mobile-excel-hero",
    ".legal-hero",
    ".pl-hero"
  ].join(",");

  var INTERACTIVE_SEL = [
    "a[href]",
    "button",
    "[role='button']",
    "input[type='button']",
    "input[type='submit']",
    ".tool-card",
    ".course-card",
    ".practice-file-card",
    ".home-path-card",
    ".home-more-card",
    ".sm-node"
  ].join(",");

  function isModifiedClick(e) {
    return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
  }

  function sameDocumentHash(url) {
    return (
      url.origin === location.origin &&
      url.pathname === location.pathname &&
      url.search === location.search &&
      !!url.hash
    );
  }

  function shouldAnimateNavigation(anchor, e) {
    if (!anchor || !anchor.href || isModifiedClick(e)) return false;
    if (anchor.hasAttribute("download")) return false;
    if ((anchor.getAttribute("target") || "").toLowerCase() === "_blank") return false;
    if (anchor.dataset.avpNoTransition === "1") return false;

    var raw = (anchor.getAttribute("href") || "").trim();
    if (
      !raw ||
      raw === "#" ||
      raw.indexOf("javascript:") === 0 ||
      raw.indexOf("mailto:") === 0 ||
      raw.indexOf("tel:") === 0
    ) return false;

    var url;
    try {
      url = new URL(anchor.href, location.href);
    } catch (_) {
      return false;
    }

    if (url.origin !== location.origin) return false;
    if (sameDocumentHash(url)) return false;

    return true;
  }

  function setupRise() {
    var nodes = document.querySelectorAll(RISE_SEL);
    if (!nodes.length) return;

    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach(function (n) {
        n.classList.add("avp-motion-rise", "avp-in");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("avp-in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
    );

    nodes.forEach(function (node, index) {
      if (node.dataset.avpMotionReady === "1") return;
      node.dataset.avpMotionReady = "1";
      node.classList.add("avp-motion-rise");
      node.style.setProperty(
        "--avp-rise-delay",
        Math.min(index * 0.025, 0.18) + "s"
      );
      io.observe(node);
    });
  }

  function setupBannerParallax() {
    if (reduce) return;
    if (window.matchMedia && window.matchMedia("(hover: none)").matches) return;

    document.querySelectorAll(BANNER_SEL).forEach(function (el) {
      if (el.dataset.avpParallaxReady === "1") return;
      el.dataset.avpParallaxReady = "1";
      el.classList.add("avp-parallax-layer");

      var tx = 0, ty = 0, mx = 0, my = 0, raf = 0;

      function tick() {
        tx += (mx - tx) * 0.10;
        ty += (my - ty) * 0.10;

        el.style.setProperty("--avp-px-x", tx.toFixed(2) + "px");
        el.style.setProperty("--avp-px-y", ty.toFixed(2) + "px");

        if (Math.abs(mx - tx) > 0.04 || Math.abs(my - ty) > 0.04) {
          raf = requestAnimationFrame(tick);
        } else {
          raf = 0;
        }
      }

      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / Math.max(1, r.width) - 0.5;
        var py = (e.clientY - r.top) / Math.max(1, r.height) - 0.5;
        mx = px * 4;
        my = py * 3;
        if (!raf) raf = requestAnimationFrame(tick);
      }, { passive: true });

      el.addEventListener("mouseleave", function () {
        mx = 0;
        my = 0;
        if (!raf) raf = requestAnimationFrame(tick);
      }, { passive: true });
    });
  }

  function addPressFeedback(target, x, y) {
    if (reduce || !target) return;

    target.classList.remove("avp-pressing");
    void target.offsetWidth;
    target.classList.add("avp-pressing");

    if (typeof x === "number" && typeof y === "number") {
      var r = target.getBoundingClientRect();
      target.style.setProperty("--avp-tap-x", (x - r.left) + "px");
      target.style.setProperty("--avp-tap-y", (y - r.top) + "px");
    }

    clearTimeout(target.__avpPressTimer);
    target.__avpPressTimer = setTimeout(function () {
      target.classList.remove("avp-pressing");
    }, 280);
  }

  function setupPressFeedback() {
    if (document.documentElement.dataset.avpPressBound === "1") return;
    document.documentElement.dataset.avpPressBound = "1";

    document.addEventListener("pointerdown", function (e) {
      var target = e.target.closest(INTERACTIVE_SEL);
      if (!target) return;
      addPressFeedback(target, e.clientX, e.clientY);
    }, { passive: true });
  }

  function setupNavigationTransition() {
    if (document.documentElement.dataset.avpNavTransitionBound === "1") return;
    document.documentElement.dataset.avpNavTransitionBound = "1";

    document.addEventListener("click", function (e) {
      var anchor = e.target.closest("a[href]");
      if (!shouldAnimateNavigation(anchor, e)) return;

      e.preventDefault();

      if (document.documentElement.classList.contains("avp-page-leaving")) return;

      var destination = anchor.href;
      document.documentElement.classList.add("avp-page-leaving");
      document.documentElement.style.setProperty(
        "--avp-nav-x",
        Math.max(0, Math.min(window.innerWidth, e.clientX || window.innerWidth / 2)) + "px"
      );
      document.documentElement.style.setProperty(
        "--avp-nav-y",
        Math.max(0, Math.min(window.innerHeight, e.clientY || window.innerHeight / 2)) + "px"
      );

      window.setTimeout(function () {
        location.href = destination;
      }, reduce ? 0 : 155);
    }, true);

    window.addEventListener("pageshow", function () {
      document.documentElement.classList.remove("avp-page-leaving");
      document.documentElement.classList.add("avp-page-entered");
      window.setTimeout(function () {
        document.documentElement.classList.remove("avp-page-entered");
      }, 360);
    });
  }

  function normalizeSmoothAnchors() {
    document.documentElement.classList.add("avp-motion-enabled");

    document.querySelectorAll("a[href^='#']").forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = (a.getAttribute("href") || "").slice(1);
        if (!id) return;
        var target = document.getElementById(id);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start"
        });
        history.replaceState(null, "", "#" + id);
      });
    });
  }

  function boot() {
    document.documentElement.classList.add("avp-page-ready");

    setupRise();
    setupBannerParallax();
    setupPressFeedback();
    setupNavigationTransition();
    normalizeSmoothAnchors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  /* Dynamic content: Practice Hub, leaderboard, community cards, etc. */
  setTimeout(setupRise, 450);
  setTimeout(setupRise, 1200);
  setTimeout(setupRise, 2400);
})();