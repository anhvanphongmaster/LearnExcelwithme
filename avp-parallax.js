/*! avp-parallax.js — parallax nâng cao hero + scroll */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  var hero = document.querySelector(".avp-hero");
  if (!hero) return;

  var layers = [];
  var mouseX = 0, mouseY = 0, targetMX = 0, targetMY = 0;
  var ticking = false;

  function collect() {
    layers = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]")).map(function (el) {
      return {
        el: el,
        speed: parseFloat(el.getAttribute("data-parallax")) || 0.2,
        mouse: parseFloat(el.getAttribute("data-parallax-mouse") || "0") || 0
      };
    });
  }

  function apply() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    var heroH = hero.offsetHeight || 1;
    var progress = Math.min(1.2, Math.max(0, scrollY / heroH));

    // smooth mouse lag
    mouseX += (targetMX - mouseX) * 0.08;
    mouseY += (targetMY - mouseY) * 0.08;

    for (var i = 0; i < layers.length; i++) {
      var L = layers[i];
      var y = scrollY * L.speed;
      // fade/scale slightly as leave hero
      var fade = 1 - progress * 0.55 * L.speed;
      var scale = 1 - progress * 0.06 * L.speed;
      var mx = mouseX * 28 * L.mouse;
      var my = mouseY * 20 * L.mouse;
      L.el.style.transform =
        "translate3d(" + mx.toFixed(2) + "px," + (y + my).toFixed(2) + "px,0) scale(" + scale.toFixed(4) + ")";
      L.el.style.opacity = String(Math.max(0.25, fade));
    }

    // depth fog on hero
    hero.style.setProperty("--px-depth", progress.toFixed(4));
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(apply);
    }
  }

  function onMouse(e) {
    var r = hero.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    var cx = r.left + r.width / 2;
    var cy = r.top + r.height / 2;
    targetMX = (e.clientX - cx) / Math.max(1, r.width / 2);
    targetMY = (e.clientY - cy) / Math.max(1, r.height / 2);
    requestTick();
  }

  function onLeave() {
    targetMX = 0;
    targetMY = 0;
    requestTick();
  }

  // reveal path cards when entering view
  function setupReveals() {
    var cards = document.querySelectorAll(".home-path-card, .learn-board, .home-more-card");
    if (!cards.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("px-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    cards.forEach(function (c) {
      c.classList.add("px-reveal");
      io.observe(c);
    });
  }

  collect();
  setupReveals();
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", function () {
    collect();
    requestTick();
  });
  hero.addEventListener("mousemove", onMouse, { passive: true });
  hero.addEventListener("mouseleave", onLeave);
  requestTick();
  // continuous smooth mouse lag
  setInterval(function () {
    if (Math.abs(targetMX - mouseX) > 0.001 || Math.abs(targetMY - mouseY) > 0.001) requestTick();
  }, 32);
})();
