/*! practice-youtube.js — V96 project workspace */
(function(){
  "use strict";

  function setTab(tabName){
    document.querySelectorAll(".pyt-tab").forEach(btn=>{
      const active=btn.dataset.tab===tabName;
      btn.classList.toggle("is-active",active);
      btn.setAttribute("aria-selected",active?"true":"false");
    });

    document.querySelectorAll(".pyt-tab-panel").forEach(panel=>{
      panel.classList.toggle("is-active",panel.dataset.tabPanel===tabName);
    });

    try{
      sessionStorage.setItem("avp_youtube_project_tab_v96",tabName);
    }catch(e){}
  }

  function boot(){
    document.querySelectorAll(".pyt-tab").forEach(btn=>{
      btn.addEventListener("click",()=>setTab(btn.dataset.tab));
    });

    document.querySelectorAll("[data-go-tab]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        setTab(btn.dataset.goTab);
        document.querySelector(".pyt-tabs")?.scrollIntoView({
          behavior:"smooth",
          block:"start"
        });
      });
    });

    document.querySelectorAll("[data-project-open]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        document.querySelectorAll("[data-project-open]").forEach(x=>x.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        const id=btn.dataset.projectOpen;
        document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
      });
    });

    try{
      const saved=sessionStorage.getItem("avp_youtube_project_tab_v96");
      if(saved && document.querySelector('.pyt-tab[data-tab="'+saved+'"]')){
        setTab(saved);
      }
    }catch(e){}
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",boot,{once:true});
  }else{
    boot();
  }
})();