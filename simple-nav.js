
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
