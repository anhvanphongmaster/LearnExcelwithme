
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    const nav = document.querySelector(".top-simple-nav");
    const toggle = document.querySelector(".top-mobile-toggle");
    if(nav && nav.parentNode !== document.body){
      document.body.insertBefore(nav, document.body.firstChild);
    } else if(nav && document.body.firstElementChild !== nav){
      document.body.insertBefore(nav, document.body.firstChild);
    }

    function closeMenu(){
      if(!nav || !toggle) return;
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Mở menu");
      toggle.innerHTML = "☰";
    }

    function openMenu(){
      if(!nav || !toggle) return;
      nav.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Đóng menu");
      toggle.innerHTML = "✕";
    }

    if(nav && !nav.querySelector(".top-simple-brand")){
      const brand=document.createElement("a");
      brand.className="top-simple-brand";
      brand.href="index.html";
      brand.textContent="📗 Learn Excel";
      nav.insertBefore(brand, nav.firstChild);
    }
    if(nav && !nav.querySelector(".auth-nav-slot")){
      const slot=document.createElement("span");
      slot.className="auth-nav-slot";
      const links=nav.querySelector(".top-simple-links");
      if(links) links.appendChild(slot);
    }

    if(nav && toggle){
      toggle.setAttribute("type", "button");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Mở menu");
      toggle.innerHTML = "☰";

      toggle.addEventListener("click", function(e){
        e.stopPropagation();
        if(nav.classList.contains("open")){
          closeMenu();
        }else{
          openMenu();
        }
      });

      document.addEventListener("click", function(e){
        if(nav.classList.contains("open") && !nav.contains(e.target)){
          closeMenu();
        }
      });

      nav.querySelectorAll(".top-simple-links a, .top-simple-links button").forEach(function(el){
        el.addEventListener("click", function(){
          if(window.innerWidth <= 900){
            setTimeout(closeMenu, 120);
          }
        });
      });

      window.addEventListener("resize", function(){
        if(window.innerWidth > 900){
          closeMenu();
        }
      });
    }
  });
})();


/* ===== GLOBAL BACK TO TOP ===== */
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    let button = document.querySelector(".avp-back-to-top");

    /* Reuse old button if page already has one */
    const oldButton = document.getElementById("backToTop");
    if (!button && oldButton) {
      oldButton.classList.add("avp-back-to-top");
      oldButton.removeAttribute("onclick");
      oldButton.textContent = "↑";
      button = oldButton;
    }

    /* Create button on pages that do not have one */
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "avp-back-to-top";
      button.setAttribute("aria-label", "Cuộn lên đầu trang");
      button.setAttribute("title", "Lên đầu trang");
      button.textContent = "↑";
      document.body.appendChild(button);
    }

    function updateBackToTop(){
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      if (scrollTop > 320) {
        button.classList.add("show");
      } else {
        button.classList.remove("show");
      }
    }

    button.addEventListener("click", function(){
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();
  });
})();


/* ===== SMART PARENT NAVIGATION ===== */
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    const pageName = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if(pageName === "" || pageName === "index.html") return;
    return; /* nav already has Trang chủ — no second back button */

    /*
      Không dùng history.back() cho điều hướng học tập.
      Một URL có thể được mở từ Trang chủ, Search, Dashboard, QR hoặc link trực tiếp;
      history.back() vì thế dễ đưa người học tới một nơi không liên quan.
    */
    const coreTopicPages = new Set([
      "phimtatexcel.html","congthucexcel.html","pivottable.html",
      "bieudopareto.html","filtersort.html","baocaoexcel.html"
    ]);
    if(coreTopicPages.has(pageName)) return;

    const parentRoutes = {
      "phimtatexcel.html": ["excel.html", "6 chuyên đề Excel"],
      "congthucexcel.html": ["excel.html", "6 chuyên đề Excel"],
      "pivottable.html": ["excel.html", "6 chuyên đề Excel"],
      "bieudopareto.html": ["excel.html", "6 chuyên đề Excel"],
      "filtersort.html": ["excel.html", "6 chuyên đề Excel"],
      "baocaoexcel.html": ["excel.html", "6 chuyên đề Excel"],

      "power-query-course.html": ["excel-nang-cao.html", "Kỹ năng nâng cao"],
      "power-pivot-dax.html": ["excel-nang-cao.html", "Kỹ năng nâng cao"],
      "dashboard-dong.html": ["excel-nang-cao.html", "Kỹ năng nâng cao"],
      "vba-macro.html": ["excel-nang-cao.html", "Kỹ năng nâng cao"],
      "solver-whatif.html": ["excel-nang-cao.html", "Kỹ năng nâng cao"],

      "certificate.html": ["master-learning.html", "Master Learning Path"],
      "master-learning.html": ["index.html", "Trang chủ"],
      "learning-path.html": ["master-learning.html", "Lộ trình học"],
      "practice-lab.html": ["index.html", "Trang chủ"],
      "dashboard.html": ["index.html", "Trang chủ"],
      "profile.html": ["dashboard.html", "Hồ sơ & Thành tích"],
      "achievements.html": ["dashboard.html", "Hồ sơ & Thành tích"],
      "achievement-learning.html": ["dashboard.html", "Hồ sơ & Thành tích"],
      "formula-finder.html": ["tools-center.html", "Công cụ"],
      "tools-center.html": ["index.html", "Trang chủ"],
      "qc-dashboard.html": ["tools-center.html", "Công cụ"],
      "excel-mobile.html": ["tools-center.html", "Công cụ"],
      "playground.html": ["tools-center.html", "Công cụ"],
      "excel.html": ["index.html", "Trang chủ"],
      "excel-nang-cao.html": ["index.html", "Trang chủ"],
      "gioithieu.html": ["index.html", "Trang chủ"],
      "lienhe.html": ["index.html", "Trang chủ"],
      "auth.html": ["index.html", "Trang chủ"],
      "privacy.html": ["index.html", "Trang chủ"],
      "terms.html": ["index.html", "Trang chủ"],
      "disclaimer.html": ["index.html", "Trang chủ"],
      "open-source.html": ["index.html", "Trang chủ"]
    };

    const route = parentRoutes[pageName] || ["index.html", "Trang chủ"];
    const wrap = document.createElement("div");
    wrap.className = "avp-page-back-wrap";

    const link = document.createElement("a");
    link.className = "avp-page-back";
    link.href = route[0];
    link.setAttribute("aria-label", "Về " + route[1]);
    link.innerHTML = '<span class="avp-page-back-arrow">←</span><span>Về ' + route[1] + '</span>';
    wrap.appendChild(link);

    const nav = document.querySelector(".top-simple-nav");
    const bannerSelectors = [
      ".lp-hero", ".avp-hero", ".page-header", ".qc-hero", ".tools-hero",
      ".profile-hero", ".dashboard-hero", ".achievement-hero", ".playground-hero",
      ".formula-hero", ".hero", "body > header"
    ];
    let banner = null;
    for(const selector of bannerSelectors){
      const found = document.querySelector(selector);
      if(found){ banner = found; break; }
    }
    if(banner){
      if(nav && (banner.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING)){
        nav.insertAdjacentElement("afterend", wrap);
      }else{
        banner.insertAdjacentElement("afterend", wrap);
      }
    }else if(nav){
      nav.insertAdjacentElement("afterend", wrap);
    }else{
      document.body.insertAdjacentElement("afterbegin", wrap);
    }
  });
})();

/* ===== UNIFIED LESSON PATH NAVIGATION ===== */
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    const current = (location.pathname.split("/").pop() || "").toLowerCase();
    const topics = [
      ["excel.html", "Excel cơ bản", "Beginner"],
      ["phimtatexcel.html", "Phím tắt", "Beginner"],
      ["congthucexcel.html", "Công thức", "Beginner"],
      ["filtersort.html", "Filter & Sort", "Beginner"],
      ["pivottable.html", "PivotTable", "Analyst"],
      ["bieudopareto.html", "Pareto", "Analyst"],
      ["baocaoexcel.html", "Báo cáo QC", "Analyst"],
      ["excel-nang-cao.html", "Excel nâng cao", "Advanced"],
      ["power-query-course.html", "Power Query", "Advanced"],
      ["power-pivot-dax.html", "Power Pivot & DAX", "Advanced"],
      ["dashboard-dong.html", "Dashboard động", "Advanced"],
      ["practice-lab.html", "Practice Lab", "Advanced"],
      ["vba-macro.html", "VBA / Macro", "Master"],
      ["solver-whatif.html", "What-If & Solver", "Master"]
    ];
    const idx = topics.findIndex(function(item){ return item[0] === current; });
    if(idx < 0) return;
    document.body.classList.add("core-topic-page");
    try{
      localStorage.setItem("avp_last_lesson_v1", JSON.stringify({
        url: topics[idx][0],
        title: topics[idx][1],
        stage: topics[idx][2],
        index: idx,
        ts: Date.now()
      }));
    }catch(e){}
    if(document.querySelector(".core-topic-nav")) return;

    const box = document.createElement("div");
    box.className = "core-topic-nav";
    box.setAttribute("aria-label", "Điều hướng lộ trình học");

    const top = document.createElement("div");
    top.className = "core-topic-top";

    const crumb = document.createElement("div");
    crumb.className = "core-topic-crumb";
    crumb.innerHTML = '<a href="index.html">Trang chủ</a><span>›</span><a href="master-learning.html">Lộ trình</a><span>›</span><strong>' + topics[idx][2] + " • " + topics[idx][1] + '</strong>';
    top.appendChild(crumb);

    const status = document.createElement("div");
    status.className = "core-topic-status";
    status.textContent = "Bài " + (idx + 1) + "/" + topics.length;
    top.appendChild(status);
    box.appendChild(top);

    const actions = document.createElement("div");
    actions.className = "core-topic-actions";

    const prev = document.createElement("a");
    prev.className = "core-topic-prev";
    if(idx > 0){
      prev.href = topics[idx-1][0];
      prev.textContent = "← " + topics[idx-1][1];
    } else {
      prev.href = "master-learning.html";
      prev.textContent = "← Lộ trình";
    }
    actions.appendChild(prev);

    const all = document.createElement("a");
    all.href = "master-learning.html";
    all.className = "core-topic-all";
    all.textContent = "Lộ trình học";
    actions.appendChild(all);

    const next = document.createElement("a");
    next.className = "core-topic-next";
    if(idx < topics.length-1){
      next.href = topics[idx+1][0];
      next.textContent = topics[idx+1][1] + " →";
    } else {
      next.href = "master-learning.html";
      next.textContent = "Hoàn thành lộ trình →";
    }
    actions.appendChild(next);
    box.appendChild(actions);

    const header = document.querySelector("body > header, .page-header, .pq-hero, .pl-hero, .hero");
    if(header) header.insertAdjacentElement("afterend", box);
    else {
      const topNav = document.querySelector(".top-simple-nav");
      if(topNav) topNav.insertAdjacentElement("afterend", box);
      else document.body.insertAdjacentElement("afterbegin", box);
    }

    function hideDupBack(){
      document.querySelectorAll(".avp-page-back-wrap").forEach(function(el){ el.style.display = "none"; });
    }
    hideDupBack();
    setTimeout(hideDupBack, 200);
  });
})();

document.addEventListener("DOMContentLoaded", function(){
  document.querySelectorAll(".site-footer-brand").forEach(function(el){
    el.textContent = "© 2026 Learn Excel with Anh Van Phong. Bảo lưu mọi quyền.";
  });
});
