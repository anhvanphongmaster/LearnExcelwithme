/*! excel-handbook.js — V113 */
(function(){
  "use strict";
  const chapters=[...document.querySelectorAll(".hb-chapter")];
  const links=[...document.querySelectorAll("[data-chapter-link]")];
  const progress=document.getElementById("hbProgress");
  const toc=document.getElementById("hbToc");
  const toggle=document.getElementById("hbTocToggle");

  function setActive(id){
    links.forEach(a=>{
      const active=a.getAttribute("href")==="#"+id;
      a.classList.toggle("is-active",active);
      if(active)a.setAttribute("aria-current","true");
      else a.removeAttribute("aria-current");
    });
  }

  function currentChapter(){
    const offset=110;
    let current=chapters[0];
    for(const ch of chapters){
      if(ch.getBoundingClientRect().top<=offset) current=ch;
      else break;
    }
    return current;
  }

  function update(){
    const max=document.documentElement.scrollHeight-innerHeight;
    const pct=max>0?Math.min(100,Math.max(0,scrollY/max*100)):0;
    if(progress)progress.style.width=pct+"%";
    const current=currentChapter();
    if(current)setActive(current.id);
  }

  let ticking=false;
  function onScroll(){
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(()=>{update();ticking=false});
  }

  // Guarantee exactly one selected item on first paint.
  links.forEach(a=>a.classList.remove("is-active"));
  setActive(chapters[0]?.id||"chap-01");
  update();

  addEventListener("scroll",onScroll,{passive:true});
  addEventListener("resize",onScroll,{passive:true});

  if(toggle&&toc){
    toggle.addEventListener("click",()=>toc.classList.toggle("is-open"));
  }
  links.forEach(a=>{
    a.addEventListener("click",()=>{
      const id=(a.getAttribute("href")||"").replace("#","");
      if(id)setActive(id);
      toc&&toc.classList.remove("is-open");
    });
  });

  // Add simple book-page footer numbers.
  chapters.forEach((ch,i)=>{
    if(ch.querySelector(".hb-page-foot-v113"))return;
    const foot=document.createElement("div");
    foot.className="hb-page-foot-v113";
    foot.innerHTML="<span>Cẩm nang Excel A–Z</span><b>"+String(i+1).padStart(2,"0")+" / "+String(chapters.length).padStart(2,"0")+"</b>";
    ch.appendChild(foot);
  });

  // Lightbox
  const lb=document.getElementById("hbLightbox");
  const lbImg=document.getElementById("hbLightboxImage");
  const close=document.getElementById("hbLightboxClose");

  document.querySelectorAll("[data-zoom-image]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const img=btn.querySelector("img");
      if(!img||!lb||!lbImg)return;
      lbImg.src=img.src;
      lbImg.alt=img.alt||"Ảnh minh hoạ Excel";
      lb.hidden=false;
      document.body.style.overflow="hidden";
    });
  });

  function closeLb(){
    if(!lb)return;
    lb.hidden=true;
    if(lbImg)lbImg.src="";
    document.body.style.overflow="";
  }

  close&&close.addEventListener("click",closeLb);
  lb&&lb.addEventListener("click",e=>{if(e.target===lb)closeLb()});
  addEventListener("keydown",e=>{if(e.key==="Escape"&&lb&&!lb.hidden)closeLb()});
})();