/* Content AVP navigation safety binding */
(() => {
  function bindContentAVPNavigation(){
    const panel=document.getElementById("avpContentPanel");
    if(!panel || panel.dataset.avpNavFix==="1") return;
    panel.dataset.avpNavFix="1";
    const grid=panel.querySelector(".avp-category-grid");
    const heading=panel.querySelector(".avp-folder-heading");
    const view=document.getElementById("avpAnalysisView");
    if(!grid||!view) return;
    panel.addEventListener("click",event=>{
      const category=event.target.closest("[data-avp-category]");
      if(category && category.dataset.avpCategory==="analysis"){
        grid.hidden=true;
        if(heading) heading.hidden=true;
        view.hidden=false;
        view.scrollIntoView({block:"nearest",behavior:"smooth"});
      }
      if(event.target.closest("#avpAnalysisBack")){
        view.hidden=true;
        grid.hidden=false;
        if(heading) heading.hidden=false;
      }
    });
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",bindContentAVPNavigation,{once:true});
  else bindContentAVPNavigation();
  document.addEventListener("click",event=>{
    const tab=event.target.closest('.admin-view-tabs [data-admin-view="content"]');
    if(tab) setTimeout(bindContentAVPNavigation,0);
  });
})();
