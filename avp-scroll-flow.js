/*! avp-scroll-flow.js — cuộn mượt kiểu luồng quang học */
(function () {
  function easeOutQuint(t) {
    return 1 - Math.pow(1 - t, 5);
  }

  function targetEl() {
    return (
      document.getElementById("ky-nang-excel") ||
      document.querySelector("section.home-path") ||
      document.getElementById("learnBoard")
    );
  }

  function flowScrollTo(el) {
    if (!el) return;
    var startY = window.pageYOffset || document.documentElement.scrollTop || 0;
    var endY = Math.max(0, el.getBoundingClientRect().top + startY - 16);
    var dist = endY - startY;
    if (Math.abs(dist) < 4) return;

    var duration = Math.min(1800, Math.max(1100, Math.abs(dist) * 0.85));
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, endY);
      return;
    }

    var btn = document.getElementById("avpScrollToPath");
    var veil = document.getElementById("avpFlowVeil");
    if (!veil) {
      veil = document.createElement("div");
      veil.id = "avpFlowVeil";
      veil.className = "avp-flow-veil";
      document.body.appendChild(veil);
    }
    veil.classList.add("on");
    if (btn) btn.classList.add("is-flowing");

    var t0 = performance.now();
    function frame(now) {
      var p = Math.min(1, (now - t0) / duration);
      var e = easeOutQuint(p);
      window.scrollTo(0, startY + dist * e);
      // subtle parallax on veil opacity
      veil.style.opacity = String(0.22 * Math.sin(p * Math.PI));
      if (p < 1) {
        requestAnimationFrame(frame);
      } else {
        veil.classList.remove("on");
        veil.style.opacity = "0";
        if (btn) btn.classList.remove("is-flowing");
      }
    }
    requestAnimationFrame(frame);
  }

  function bind() {
    var btn = document.getElementById("avpScrollToPath");
    if (!btn || btn.__flowBound) return;
    btn.__flowBound = true;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      flowScrollTo(targetEl());
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
  // late bind (nav re-render)
  setTimeout(bind, 500);
  setTimeout(bind, 1500);
})();
