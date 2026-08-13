
(function(){
  function ready(fn){
    if(document.readyState!=="loading"){fn();}
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function(){
    const nav=document.querySelector(".site-nav");
    const toggle=document.querySelector(".nav-toggle");
    if(toggle && nav){
      toggle.addEventListener("click", function(){
        nav.classList.toggle("open");
      });
    }
    const current=(location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".site-nav a.nav-link, .site-nav .nav-more-menu a").forEach(function(a){
      const href=(a.getAttribute("href") || "").split("#")[0].toLowerCase();
      if(href===current){ a.classList.add("active"); }
    });
    document.addEventListener("click", function(e){
      if(nav && nav.classList.contains("open") && !nav.contains(e.target)){
        nav.classList.remove("open");
      }
    });
  });
})();
