/*! avp-zoom-copy-v56.js — zoom đúng Ô ĐƯỢC BẤM, nhịp 360 + 260 */
(function(){
  "use strict";
  if(window.__avpZoomCopyV56b)return;
  window.__avpZoomCopyV56b=true;

  if(window.self!==window.top)return;
  var page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  if(/^(admin\.html|auth\.html|certificate\.html)/.test(page))return;

  var busy=false;

  function sameSite(href){
    if(!href)return false;
    if(href.charAt(0)==="#")return false;
    if(/^(mailto:|tel:|javascript:)/i.test(href))return false;
    if(/\.(xlsx|xls|xlsm|zip|pdf)(\?|#|$)/i.test(href))return false;
    try{
      var url=new URL(href,location.href);
      if(url.origin!==location.origin)return false;
      return url.pathname!==location.pathname;
    }catch(e){return false;}
  }

  function set(el,prop,val){
    el.style.setProperty(prop,val,"important");
  }

  function scopeOf(link){
    return link.closest(".home-path-grid")
      || link.closest(".home-path-more")
      || link.closest(".home-path")
      || link.parentElement;
  }

  function itemsIn(scope){
    if(scope.classList.contains("home-path-grid")){
      return Array.prototype.slice.call(scope.querySelectorAll("a[href]"));
    }
    return Array.prototype.filter.call(scope.children,function(el){
      return el.matches && (el.matches("a[href]") || el.querySelector("a[href]"));
    });
  }

  function pickEl(link){
    if(link.closest(".home-path-grid"))return link;
    return link.closest(".home-more-card,.home-path-card,.home-cta-card,.home-book-card,.home-ref-item-v114,.course-card,.level-card,.tool-card,.lab-card") || link;
  }

  document.addEventListener("click",function(e){
    if(busy){e.preventDefault();return;}
    if(e.button!==0)return;
    if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    if(e.target.closest(".ph-switch,[data-practice-branch],#phSourceBack"))return;
    if(e.target.closest(".top-simple-nav,form,iframe,.avp-edge-launcher"))return;

    var link=e.target.closest("a[href]");
    if(!link)return;
    if(link.target && link.target!=="_self")return;
    if(link.hasAttribute("download"))return;
    if(!sameSite(link.getAttribute("href")))return;

    var picked=pickEl(link);
    var scope=scopeOf(link);
    if(!picked||!scope)return;

    e.preventDefault();
    e.stopImmediatePropagation();
    busy=true;

    var items=itemsIn(scope);
    if(items.indexOf(picked)<0)items.push(picked);

    items.forEach(function(el){
      set(el,"transition","transform .34s cubic-bezier(.18,.82,.24,1),opacity .26s ease,filter .26s ease,box-shadow .34s ease");
      if(el===picked){
        set(el,"transform","translateY(-8px) scale(1.11)");
        set(el,"opacity","1");
        set(el,"filter","none");
        set(el,"z-index","20");
        set(el,"box-shadow","0 26px 60px rgba(19,88,48,.24)");
        set(el,"position","relative");
      }else{
        set(el,"transform","scale(.94)");
        set(el,"opacity","0.22");
        set(el,"filter","saturate(.55)");
      }
    });

    var href=link.href;
    setTimeout(function(){
      set(scope,"transition","transform .28s ease,opacity .28s ease");
      set(scope,"transform","scale(1.025)");
      set(scope,"opacity","0");
      setTimeout(function(){
        location.href=href;
      },260);
    },360);
  },true);
})();
