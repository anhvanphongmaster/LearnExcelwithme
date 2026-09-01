(() => {
  "use strict";
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  function init(root){
    const cards=[...root.querySelectorAll('[data-roll-card]')]; if(!cards.length)return;
    const dots=root.querySelector('[data-roll-dots]'); let index=clamp(Number(root.dataset.start||0),0,cards.length-1); let dragStart=null, dragX=0, wheelLock=false;
    if(dots)dots.innerHTML=cards.map((_,i)=>`<button type="button" aria-label="Mục ${i+1}" data-dot="${i}"></button>`).join('');
    function render(){
      cards.forEach((card,i)=>{const d=i-index, a=Math.abs(d), x=d*230, y=Math.min(a,3)*12, z=-Math.min(a,3)*115, s=Math.max(.66,1-a*.13), r=clamp(-d*9,-20,20); card.style.transform=`translate3d(calc(-50% + ${x}px),${y}px,${z}px) rotateY(${r}deg) scale(${s})`; card.style.opacity=String(Math.max(.36,1-a*.2)); card.style.zIndex=String(20-a); card.classList.toggle('active',d===0); card.setAttribute('aria-current',d===0?'true':'false'); card.tabIndex=d===0?0:-1;});
      root.querySelectorAll('[data-dot]').forEach((d,i)=>d.classList.toggle('active',i===index));
    }
    function go(n){index=clamp(n,0,cards.length-1);render();}
    root.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)<4&&Math.abs(e.deltaX)<4)return;e.preventDefault();if(wheelLock)return;wheelLock=true;go(index+(e.deltaY>0||e.deltaX>0?1:-1));setTimeout(()=>wheelLock=false,300)},{passive:false});
    root.addEventListener('pointerdown',e=>{dragStart=e.clientX;dragX=e.clientX;root.setPointerCapture?.(e.pointerId)});
    root.addEventListener('pointermove',e=>{if(dragStart!==null)dragX=e.clientX});
    root.addEventListener('pointerup',()=>{if(dragStart===null)return;const dx=dragX-dragStart;if(Math.abs(dx)>38)go(index+(dx<0?1:-1));dragStart=null});
    root.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(index+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(index-1)}});
    root.addEventListener('click',e=>{const dot=e.target.closest('[data-dot]');if(dot){go(Number(dot.dataset.dot));return}const card=e.target.closest('[data-roll-card]');if(!card)return;const i=cards.indexOf(card);if(i!==index){go(i);return}if(card.classList.contains('locked'))return;const href=card.dataset.href;if(href)location.href=href;});
    render();
    root._avpRoll={go,get index(){return index},cards};
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
  window.addEventListener('avp:professional-level-unlocked',e=>{
    if(e.detail?.levelId) unlock(e.detail.levelId);
  });
})();
