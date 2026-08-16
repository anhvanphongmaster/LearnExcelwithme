
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    const nav = document.querySelector(".top-simple-nav");
    const toggle = document.querySelector(".top-mobile-toggle");

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
    if(document.querySelector(".avp-page-back-wrap")) return;

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
      "my-learning.html": ["index.html", "Trang chủ"],
      "profile.html": ["my-learning.html", "Hồ sơ & Thành tích"],
      "achievements.html": ["my-learning.html", "Hồ sơ & Thành tích"],
      "achievement-learning.html": ["my-learning.html", "Hồ sơ & Thành tích"],
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

/* ===== SIX CORE TOPICS NAVIGATION ===== */
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    const current = (location.pathname.split("/").pop() || "").toLowerCase();
    const topics = [
      ["phimtatexcel.html", "⌨️ Phím tắt"],
      ["congthucexcel.html", "🧮 Công thức"],
      ["pivottable.html", "📊 PivotTable"],
      ["bieudopareto.html", "📈 Pareto"],
      ["filtersort.html", "🔍 Filter & Sort"],
      ["baocaoexcel.html", "📋 Báo cáo"]
    ];
    const idx = topics.findIndex(function(item){ return item[0] === current; });
    if(idx < 0) return;
    document.body.classList.add("core-topic-page");
    if(document.querySelector(".core-topic-nav")) return;

    const box = document.createElement("nav");
    box.className = "core-topic-nav";
    box.setAttribute("aria-label", "Điều hướng 6 chuyên đề Excel");

    const top = document.createElement("div");
    top.className = "core-topic-top";

    const crumb = document.createElement("div");
    crumb.className = "core-topic-crumb";
    crumb.innerHTML = '<a href="index.html">Trang chủ</a><span>›</span><a href="excel.html">6 chuyên đề Excel</a><span>›</span><strong>' + topics[idx][1] + '</strong>';
    top.appendChild(crumb);

    const status = document.createElement("div");
    status.className = "core-topic-status";
    status.setAttribute("aria-label", "Tiến độ bài học");
    top.appendChild(status);
    box.appendChild(top);

    const actions = document.createElement("div");
    actions.className = "core-topic-actions";
    if(idx > 0){
      const prev = document.createElement("a");
      prev.href = topics[idx-1][0]; prev.className = "core-topic-prev";
      prev.textContent = "← " + topics[idx-1][1]; actions.appendChild(prev);
    } else {
      const hub = document.createElement("a");
      hub.href = "excel.html"; hub.className = "core-topic-prev";
      hub.textContent = "← 6 chuyên đề"; actions.appendChild(hub);
    }
    const all = document.createElement("a");
    all.href = "excel.html"; all.className = "core-topic-all";
    all.textContent = "☷ Xem 6 chuyên đề"; actions.appendChild(all);
    if(idx < topics.length-1){
      const next = document.createElement("a");
      next.href = topics[idx+1][0]; next.className = "core-topic-next";
      next.textContent = topics[idx+1][1] + " →"; actions.appendChild(next);
    } else {
      const home = document.createElement("a");
      home.href = "excel.html"; home.className = "core-topic-next";
      home.textContent = "Về trang chuyên đề →"; actions.appendChild(home);
    }
    box.appendChild(actions);

    const topNav = document.querySelector(".top-simple-nav");
    if(topNav) topNav.insertAdjacentElement("afterend", box);
    else {
      const header = document.querySelector(".page-header, .hero, body > header");
      if(header) header.insertAdjacentElement("afterend", box);
      else document.body.insertAdjacentElement("afterbegin", box);
    }
  });
})();
