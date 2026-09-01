(() => {
  "use strict";
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

  function init(root){
    if(!root || root.dataset.rollReady==="1") return;
    const cards=[...root.querySelectorAll('[data-roll-card]')];
    if(!cards.length)return;
    root.dataset.rollReady="1";

    const dots=root.querySelector('[data-roll-dots]');
    const count=cards.length;
    let current=clamp(Number(root.dataset.start||0),0,count-1);
    let target=current;
    let raf=0, snapTimer=0, dragging=false, dragStartX=0, dragStartTarget=0, last=-1;

    if(dots)dots.innerHTML=cards.map((_,i)=>`<button type="button" aria-label="Mục ${i+1}" data-dot="${i}"></button>`).join('');

    function step(){
      const w=root.clientWidth||900;
      return w<520?Math.min(195,w*.55):w<820?225:275;
    }

    function draw(){
      const st=step();
      cards.forEach((card,i)=>{
        const d=i-current,a=Math.abs(d),x=d*st,y=Math.min(a,3.5)*11,z=-Math.min(a,4)*120;
        const s=Math.max(.64,1-a*.14),r=clamp(-d*10,-27,27);
        card.style.transform=`translate3d(calc(-50% + ${x}px),${y}px,${z}px) rotateY(${r}deg) scale(${s})`;
        card.style.opacity=String(Math.max(.12,1-a*.23));
        card.style.zIndex=String(Math.round(100-a*10));
        card.style.pointerEvents=a<.72?"auto":"none";
      });
      const active=clamp(Math.round(current),0,count-1);
      if(active!==last){
        last=active;
        cards.forEach((card,i)=>{
          const on=i===active;
          card.classList.toggle('active',on);
          card.setAttribute('aria-current',on?'true':'false');
          card.tabIndex=on?0:-1;
        });
        root.querySelectorAll('[data-dot]').forEach((d,i)=>d.classList.toggle('active',i===active));
        root.dispatchEvent(new CustomEvent('avp:professional-roll-change',{detail:{index:active,card:cards[active],id:cards[active]?.dataset.id||''}}));
      }
    }

    function animate(){
      raf=0;
      const diff=target-current;
      if(Math.abs(diff)<.001){current=target;draw();return}
      current+=diff*.18;
      draw();
      raf=requestAnimationFrame(animate);
    }
    function kick(){if(!raf)raf=requestAnimationFrame(animate)}
    function go(n,snap=true){target=clamp(n,0,count-1);if(snap)target=Math.round(target);kick()}
    function settle(){clearTimeout(snapTimer);snapTimer=setTimeout(()=>go(target,true),95)}

    root.addEventListener('wheel',e=>{
      const raw=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
      if(Math.abs(raw)<1)return;
      const outward=(target<=.001&&raw<0)||(target>=count-1-.001&&raw>0);
      if(outward)return; // don't trap normal page scrolling at the ends
      e.preventDefault();
      const factor=e.deltaMode===1?.055:.0038;
      target=clamp(target+raw*factor,0,count-1);
      kick();settle();
    },{passive:false});

    root.addEventListener('pointerdown',e=>{
      if(e.button!==undefined&&e.button!==0)return;
      if(e.target.closest('button,a,input,label,textarea,select'))return;
      dragging=true;dragStartX=e.clientX;dragStartTarget=target;
      root.classList.add('is-dragging');root.setPointerCapture?.(e.pointerId);
    });
    root.addEventListener('pointermove',e=>{
      if(!dragging)return;
      target=clamp(dragStartTarget-(e.clientX-dragStartX)/step(),0,count-1);kick();
    });
    const endDrag=()=>{if(!dragging)return;dragging=false;root.classList.remove('is-dragging');go(target,true)};
    root.addEventListener('pointerup',endDrag);
    root.addEventListener('pointercancel',endDrag);

    root.addEventListener('keydown',e=>{
      if(e.key==='ArrowRight'){e.preventDefault();go(Math.round(target)+1)}
      if(e.key==='ArrowLeft'){e.preventDefault();go(Math.round(target)-1)}
      if(e.key==='Home'){e.preventDefault();go(0)}
      if(e.key==='End'){e.preventDefault();go(count-1)}
    });

    root.addEventListener('click',e=>{
      const dot=e.target.closest('[data-dot]');
      if(dot){go(Number(dot.dataset.dot));return}
      const card=e.target.closest('[data-roll-card]');
      if(!card)return;
      const i=cards.indexOf(card);
      if(i!==Math.round(target)){e.preventDefault();e.stopPropagation();go(i);return}
      if(card.classList.contains('locked'))return;
      const href=card.dataset.href;if(href)location.href=href;
    },true);

    draw();
    root._avpRoll={go,draw,get index(){return Math.round(target)},cards};
    if('ResizeObserver' in window){
      const observer=new ResizeObserver(()=>draw());
      observer.observe(root);
      root._avpRoll.resizeObserver=observer;
    }else{
      window.addEventListener('resize',draw,{passive:true});
    }
  }

  function unlock(levelId){
    const card=document.querySelector(`[data-roll-card][data-id="${CSS.escape(levelId)}"]`);
    if(!card || !card.classList.contains("locked")) return;
    const root=card.closest('[data-roll]');
    const cards=[...root.querySelectorAll('[data-roll-card]')];
    const i=cards.indexOf(card);
    root?._avpRoll?.go(i);
    window.setTimeout(()=>{
      card.classList.add("unlocking");
      window.setTimeout(()=>{
        card.classList.remove("locked","unlocking");
        card.dataset.unlocked="1";
        card.querySelector('.pro-lock')?.remove();
      },1700);
    },420);
  }

  document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('[data-roll]').forEach(init));
  window.AVPProfessionalRoll={init,unlock};
  window.addEventListener('avp:professional-level-unlocked',e=>{if(e.detail?.levelId)unlock(e.detail.levelId)});
})();
