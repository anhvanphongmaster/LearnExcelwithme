
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


/* ===== GLOBAL PREVIOUS PAGE BUTTON ===== */
(function(){
  document.addEventListener("DOMContentLoaded", function(){

    const pageName = (location.pathname.split("/").pop() || "index.html").toLowerCase();

    /* Trang chủ không cần nút quay lại */
    if(pageName === "" || pageName === "index.html"){
      return;
    }

    if(document.querySelector(".avp-page-back-wrap")){
      return;
    }

    const wrap = document.createElement("div");
    wrap.className = "avp-page-back-wrap";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "avp-page-back";
    btn.setAttribute("aria-label", "Quay lại trang trước");
    btn.innerHTML =
      '<span class="avp-page-back-arrow">←</span><span>Quay lại trang trước</span>';

    btn.addEventListener("click", function(){
      if(window.history.length > 1){
        window.history.back();
      }else{
        window.location.href = "index.html";
      }
    });

    wrap.appendChild(btn);

    const nav = document.querySelector(".top-simple-nav");

    /*
      Tìm banner / hero chính của từng loại trang.
      Ưu tiên selector cụ thể trước, sau đó mới tới header tổng quát.
    */
    const bannerSelectors = [
      ".lp-hero",
      ".avp-hero",
      ".page-header",
      ".qc-hero",
      ".tools-hero",
      ".profile-hero",
      ".dashboard-hero",
      ".achievement-hero",
      ".playground-hero",
      ".formula-hero",
      ".hero",
      "body > header"
    ];

    let banner = null;

    for(const selector of bannerSelectors){
      const found = document.querySelector(selector);
      if(found){
        banner = found;
        break;
      }
    }

    if(banner){
      /*
        Nếu menu đứng SAU banner trong DOM (một số trang cũ),
        chèn nút sau menu để thứ tự vẫn là:
        Banner -> Menu -> Quay lại -> Nội dung.
        Nếu menu đứng TRƯỚC banner:
        Menu -> Banner -> Quay lại -> Nội dung.
      */
      if(nav && (banner.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING)){
        nav.insertAdjacentElement("afterend", wrap);
      }else{
        banner.insertAdjacentElement("afterend", wrap);
      }
    }else if(nav){
      /* Fallback cho trang không có banner */
      nav.insertAdjacentElement("afterend", wrap);
    }else{
      document.body.insertAdjacentElement("afterbegin", wrap);
    }
  });
})();
