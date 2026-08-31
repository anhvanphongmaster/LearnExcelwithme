/*! avp-zoom-copy-v56.js
   Copy đúng nhịp practice-hub.js (video 4 luồng):
   360ms chọn + 260ms rời. Ghi style trực tiếp để thắng vá chồng. */
(function(){
  "use strict";
  if(window.__avpZoomCopyV56)return;
  window.__avpZoomCopyV56=true;

  var page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  if(window.self!==window.top)return;
  if(/^(admin\.html|auth\.html|certificate\.html|practice-grader\.html)/.test(page))return;
  if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;

  var CARD_SEL=[
    ".home-more-card",
    ".home-path-card",
    ".home-cta-card",
    ".home-book-card",
    ".course-card",
    ".level-card",
    ".tool-card",
    ".lab-card",
    ".feature-card",
    ".content-card",
    ".summary-card",
    ".practice-file-card",
    ".learn-board",
    ".path-item",
    ".pv-panel",
    ".badge-card"
  ].join(",");

  var busy=false;

  function internal(href){
    if(!href)return false;
    if(href.charAt(0)==="#")return false;
    if(/^(mailto:|tel:|javascript:)/i.test(href))return false;
    if(/\.(xlsx|xls|xlsm|zip|pdf|png|jpe?g|webp|gif|mp4)(\?|#|$)/i.test(href))return false;
    try{
      var url=new URL(href,location.href);
      if(url.origin!==location.origin)return false;
      var dest=(url.pathname.split("/").pop()||"").toLowerCase();
      if(/^(admin\.html|auth\.html)/.test(dest))return false;
      return url.href.split("#")[0]!==location.href.split("#")[0];
    }catch(e){return false;}
  }

  function paintPick(grid,card){
    var kids=grid.children;
    for(var i=0;i<kids.length;i++){
      var el=kids[i];
      el.style.setProperty("transition","transform .34s cubic-bezier(.18,.82,.24,1),opacity .26s ease,filter .26s ease,box-shadow .34s ease","important");
      if(el===card){
        el.style.setProperty("transform","translateY(-8px) scale(1.11)","important");
        el.style.setProperty("opacity","1","important");
        el.style.setProperty("filter","none","important");
        el.style.setProperty("z-index","9","important");
        el.style.setProperty("box-shadow","0 26px 60px rgba(19,88,48,.24)","important");
      }else{
        el.style.setProperty("transform","scale(.94)","important");
        el.style.setProperty("opacity","0.22","important");
        el.style.setProperty("filter","saturate(.55)","important");
      }
    }
  }

  function paintLeave(grid){
    grid.style.setProperty("transition","transform .28s ease,opacity .28s ease","important");
    grid.style.setProperty("transform","scale(1.025)","important");
    grid.style.setProperty("opacity","0","important");
    grid.style.setProperty("transform-origin","center center","important");
  }

  document.addEventListener("click",function(e){
    if(busy){e.preventDefault();return;}
    if(e.button!==0)return;
    if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    if(e.target.closest(".ph-switch,[data-practice-branch],#phSourceBack"))return;
    if(e.target.closest("form,input,textarea,select,iframe,.avp-edge-launcher,#avpEdgeMenu,.top-simple-nav"))return;

    var link=e.target.closest("a[href]");
    if(!link)return;
    if(link.target&&link.target!=="_self")return;
    if(link.hasAttribute("download"))return;
    if(!internal(link.getAttribute("href")))return;

    var card=link.closest(CARD_SEL);
    if(!card)return;
    var grid=card.parentElement;
    if(!grid)return;

    e.preventDefault();
    e.stopPropagation();
    busy=true;

    paintPick(grid,card);

    var href=link.href;
    setTimeout(function(){
      paintLeave(grid);
      setTimeout(function(){
        location.href=href;
      },260);
    },360);
  },true);
})();
