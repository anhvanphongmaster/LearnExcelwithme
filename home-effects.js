
(() => {
  const hero = document.querySelector(".avp-hero");
  const orb = document.getElementById("avpOrb");
  const panel = document.querySelector(".avp-panel");
  const typing = document.getElementById("avpTyping");

  if (!hero) return;

  let mouseX = hero.clientWidth * .5;
  let mouseY = hero.clientHeight * .45;
  let orbX = mouseX;
  let orbY = mouseY;
  let rafId = null;

  function animateGlow(){
    orbX += (mouseX - orbX) * 0.13;
    orbY += (mouseY - orbY) * 0.13;

    hero.style.setProperty("--mx", orbX + "px");
    hero.style.setProperty("--my", orbY + "px");

    if (orb){
      orb.style.left = orbX + "px";
      orb.style.top = orbY + "px";
    }

    rafId = requestAnimationFrame(animateGlow);
  }

  hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;

    if (panel){
      const pr = panel.getBoundingClientRect();
      const cx = pr.left + pr.width / 2;
      const cy = pr.top + pr.height / 2;
      const rx = ((e.clientY - cy) / pr.height) * -5;
      const ry = ((e.clientX - cx) / pr.width) * 7;
      panel.style.transform =
        `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    }
  });

  hero.addEventListener("mouseleave", () => {
    mouseX = hero.clientWidth * .5;
    mouseY = hero.clientHeight * .45;
    if (panel){
      panel.style.transform =
        "perspective(1100px) rotateX(0deg) rotateY(0deg)";
    }
  });

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    animateGlow();
  }

  /* Stronger typing loop, matching the reference video */
  if (typing){
    const lines = [
      "Excel • Office • Productivity",
      "Học nhanh hơn. Làm việc thông minh hơn.",
      "100+ công thức Excel đang chờ bạn khám phá.",
      "Từ dữ liệu thô đến báo cáo chuyên nghiệp.",
      "Thực hành • Phân tích • Tự động hóa công việc."
    ];

    let line = 0;
    let char = 0;
    let deleting = false;
    let timer;

    function typeLoop(){
      const current = lines[line];

      if (!deleting){
        char++;
        typing.textContent = current.slice(0,char);

        if (char >= current.length){
          deleting = true;
          timer = setTimeout(typeLoop,1550);
          return;
        }

        timer = setTimeout(typeLoop,52);
      } else {
        char--;
        typing.textContent = current.slice(0,Math.max(0,char));

        if (char <= 0){
          deleting = false;
          line = (line + 1) % lines.length;
          timer = setTimeout(typeLoop,280);
          return;
        }

        timer = setTimeout(typeLoop,24);
      }
    }

    /* Stop old inline type loop from visually winning by resetting content now. */
    typing.textContent = "";
    clearTimeout(window.__avpTypingTimer);
    window.__avpTypingTimer = setTimeout(typeLoop,220);
  }
})();
