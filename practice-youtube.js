/*! practice-youtube.js — V95 project accordion */
(function(){
  "use strict";

  function boot(){
    document.querySelectorAll(".pyt-project").forEach(project=>{
      const head=project.querySelector(".pyt-project-head");
      const body=project.querySelector(".pyt-project-body");
      if(!head || !body) return;

      head.addEventListener("click",()=>{
        const open=project.classList.toggle("is-open");
        head.setAttribute("aria-expanded",open?"true":"false");

        if(open){
          requestAnimationFrame(()=>{
            project.scrollIntoView({
              behavior:"smooth",
              block:"nearest"
            });
          });
        }
      });
    });
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",boot,{once:true});
  }else{
    boot();
  }
})();