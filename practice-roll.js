(() => {
  "use strict";

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function init(root){
    if (!root || root.dataset.rollReady === "1") return;
    const cards = [...root.querySelectorAll("[data-practice-roll-card]")];
    if (!cards.length) return;

    root.dataset.rollReady = "1";
    const stage = root.querySelector("[data-practice-roll-stage]") || root;
    const dots = root.querySelector("[data-practice-roll-dots]");
    const count = cards.length;

    let current = clamp(Number(root.dataset.start || 0), 0, count - 1);
    let target = current;
    let raf = 0;
    let snapTimer = 0;
    let dragging = false;
    let dragStartX = 0;
    let dragStartTarget = 0;
    let lastActive = -1;

    if (dots){
      dots.innerHTML = cards.map((_, i) =>
        `<button type="button" data-practice-roll-dot="${i}" aria-label="Mục ${i+1}"></button>`
      ).join("");
    }

    function stepSize(){
      const w = root.clientWidth || 900;
      if (w < 520) return Math.min(205, w * .54);
      if (w < 820) return 235;
      return root.classList.contains("lesson-roll") ? 360 : 280;
    }

    function draw(){
      const step = stepSize();
      cards.forEach((card, i) => {
        const d = i - current;
        const a = Math.abs(d);
        const x = d * step;
        const y = Math.min(a, 3.5) * 10;
        const z = -Math.min(a, 4) * 125;
        const scale = Math.max(.64, 1 - a * .145);
        const rotate = clamp(-d * 10.5, -28, 28);
        const opacity = Math.max(.10, 1 - a * .23);

        card.style.transform =
          `translate3d(calc(-50% + ${x}px), ${y}px, ${z}px) rotateY(${rotate}deg) scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(Math.round(100 - a * 10));
        card.style.pointerEvents = a < .72 ? "auto" : "none";
      });

      const active = clamp(Math.round(current), 0, count - 1);
      if (active !== lastActive){
        lastActive = active;
        cards.forEach((card, i) => {
          const on = i === active;
          card.classList.toggle("active", on);
          card.setAttribute("aria-current", on ? "true" : "false");
          card.tabIndex = on ? 0 : -1;
        });
        root.querySelectorAll("[data-practice-roll-dot]").forEach((dot, i) =>
          dot.classList.toggle("active", i === active)
        );
        root.dispatchEvent(new CustomEvent("avp:roll-change", {
          detail: { index: active, card: cards[active] }
        }));
      }
    }

    function animate(){
      raf = 0;
      const diff = target - current;
      if (Math.abs(diff) < .001){
        current = target;
        draw();
        return;
      }
      current += diff * .18;
      draw();
      raf = requestAnimationFrame(animate);
    }

    function kick(){
      if (!raf) raf = requestAnimationFrame(animate);
    }

    function go(value, snap = true){
      target = clamp(value, 0, count - 1);
      if (snap) target = Math.round(target);
      kick();
    }

    function scheduleSnap(){
      clearTimeout(snapTimer);
      snapTimer = setTimeout(() => go(target, true), 95);
    }

    root.addEventListener("wheel", e => {
      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(raw) < 1) return;

      const outward =
        (target <= 0.001 && raw < 0) ||
        (target >= count - 1 - .001 && raw > 0);

      // At the first/last item, allow normal page scrolling in the outward direction.
      if (outward) return;

      e.preventDefault();
      const factor = e.deltaMode === 1 ? .055 : .0038;
      target = clamp(target + raw * factor, 0, count - 1);
      kick();
      scheduleSnap();
    }, { passive:false });

    root.addEventListener("pointerdown", e => {
      if (e.button !== undefined && e.button !== 0) return;
      if (e.target.closest("button,a,input,label,textarea,select")) return;
      dragging = true;
      dragStartX = e.clientX;
      dragStartTarget = target;
      root.classList.add("is-dragging");
      root.setPointerCapture?.(e.pointerId);
    });

    root.addEventListener("pointermove", e => {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      target = clamp(dragStartTarget - dx / stepSize(), 0, count - 1);
      kick();
    });

    function finishDrag(){
      if (!dragging) return;
      dragging = false;
      root.classList.remove("is-dragging");
      go(target, true);
    }
    root.addEventListener("pointerup", finishDrag);
    root.addEventListener("pointercancel", finishDrag);

    root.addEventListener("keydown", e => {
      if (e.key === "ArrowRight"){
        e.preventDefault(); go(Math.round(target) + 1);
      } else if (e.key === "ArrowLeft"){
        e.preventDefault(); go(Math.round(target) - 1);
      } else if (e.key === "Home"){
        e.preventDefault(); go(0);
      } else if (e.key === "End"){
        e.preventDefault(); go(count - 1);
      }
    });

    root.addEventListener("click", e => {
      const dot = e.target.closest("[data-practice-roll-dot]");
      if (dot){
        go(Number(dot.dataset.practiceRollDot));
        return;
      }

      const card = e.target.closest("[data-practice-roll-card]");
      if (!card) return;
      const i = cards.indexOf(card);
      if (i < 0) return;

      // Side cards only move to the centre. Controls become usable once centred.
      if (i !== Math.round(target)){
        e.preventDefault();
        e.stopPropagation();
        go(i);
      }
    }, true);

    root._avpPracticeRoll = { go, cards, get index(){ return Math.round(target); } };
    draw();
  }

  function initAll(scope=document){
    scope.querySelectorAll("[data-practice-roll]").forEach(init);
  }

  document.addEventListener("DOMContentLoaded", () => initAll());
  window.AVPPracticeRoll = { init, initAll };
})();