
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    const nav=document.querySelector(".top-simple-nav");
    const toggle=document.querySelector(".top-mobile-toggle");
    if(nav && toggle){
      toggle.addEventListener("click", function(){
        nav.classList.toggle("open");
      });
    }
    document.addEventListener("click", function(e){
      if(nav && nav.classList.contains("open") && !nav.contains(e.target)){
        nav.classList.remove("open");
      }
    });
  });
})();
