/*! excel-handbook.js — V110 */
(function(){
  "use strict";
  const chapters=[...document.querySelectorAll(".hb-chapter")];
  const links=[...document.querySelectorAll("[data-chapter-link]")];
  const progress=document.getElementById("hbProgress");
  const toc=document.getElementById("hbToc");
  const toggle=document.getElementById("hbTocToggle");

  function updateProgress(){
    const max=document.documentElement.scrollHeight-innerHeight;
    const pct=max>0?Math.min(100,Math.max(0,scrollY/max*100)):0;
    if(progress) progress.style.width=pct+"%";
  }
  addEventListener("scroll",updateProgress,{passive:true});
  updateProgress();

  if("IntersectionObserver" in window){
    const io=new IntersectionObserver(entries=>{
      const visible=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return;
      links.forEach(a=>a.classList.toggle("is-active",a.getAttribute("href")==="#"+visible.target.id));
    },{rootMargin:"-16% 0px -68% 0px",threshold:[0,.1,.3,.6]});
    chapters.forEach(ch=>io.observe(ch));
  }

  if(toggle&&toc)toggle.addEventListener("click",()=>toc.classList.toggle("is-open"));
  links.forEach(a=>a.addEventListener("click",()=>toc&&toc.classList.remove("is-open")));

  const lb=document.getElementById("hbLightbox");
  const lbImg=document.getElementById("hbLightboxImage");
  const close=document.getElementById("hbLightboxClose");

  document.querySelectorAll("[data-zoom-image]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const img=btn.querySelector("img"); if(!img||!lb||!lbImg)return;
      lbImg.src=img.src; lbImg.alt=img.alt||"Ảnh minh hoạ Excel";
      lb.hidden=false; document.body.style.overflow="hidden";
    });
  });
  function closeLb(){if(!lb)return;lb.hidden=true;lbImg.src="";document.body.style.overflow=""}
  if(close)close.addEventListener("click",closeLb);
  if(lb)lb.addEventListener("click",e=>{if(e.target===lb)closeLb()});
  addEventListener("keydown",e=>{if(e.key==="Escape"&&lb&&!lb.hidden)closeLb()});
})();