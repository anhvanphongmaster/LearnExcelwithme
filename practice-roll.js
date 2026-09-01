(() => {
  "use strict";
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

  function init(root){
    if(!root || root.dataset.rollReady==="1") return;
    const stage=root.querySelector("[data-practice-roll-stage]")||root;
    const cards=[...stage.querySelectorAll(":scope > [data-practice-roll-card]")];
    if(!cards.length)return;
    root.dataset.rollReady="1";
    const dots=root.querySelector("[data-practice-roll-dots]");
    const count=cards.length;
    let current=clamp(Number(root.dataset.start||0),0,count-1);
    let target=current, raf=0, snapTimer=0, dragging=false, startX=0, startTarget=0, last=-1;

    if(dots){dots.innerHTML=cards.map((_,i)=>`<button type="button" data-practice-roll-dot="${i}" aria-label="Mục ${i+1}"></button>`).join("");}

    function step(){
      const w=root.clientWidth||900;
      if(root.dataset.rollKind==="ranking") return w<700?210:275;
      if(root.dataset.rollKind==="lesson") return w<540?245:w<900?320:390;
      return w<540?205:w<900?255:315;
    }
    function draw(){
      const s=step();
      cards.forEach((card,i)=>{
        const d=i-current, a=Math.abs(d), sign=d<0?-1:1;
        const x=d*s;
        const y=Math.min(a,3)*15;
        const z=-Math.min(a,4)*165;
        const scale=Math.max(.52,1-a*.17);
        const rotate=clamp(-d*18,-48,48);
        const opacity=Math.max(.16,1-a*.24);
        card.style.transform=`translate3d(calc(-50% + ${x}px),${y}px,${z}px) rotateY(${rotate}deg) scale(${scale})`;
        card.style.opacity=String(opacity);
        card.style.zIndex=String(Math.round(100-a*12));
        card.style.filter=a<.55?"none":`saturate(${Math.max(.55,1-a*.12)})`;
        card.style.pointerEvents=a<.62?"auto":"none";
      });
      const active=clamp(Math.round(current),0,count-1);
      if(active!==last){
        last=active;
        cards.forEach((c,i)=>{const on=i===active;c.classList.toggle("is-roll-active",on);c.setAttribute("aria-current",on?"true":"false");c.tabIndex=on?0:-1;});
        root.querySelectorAll("[data-practice-roll-dot]").forEach((d,i)=>d.classList.toggle("active",i===active));
        root.dispatchEvent(new CustomEvent("avp:roll-change",{detail:{index:active,card:cards[active]}}));
      }
    }
    function animate(){
      raf=0; const diff=target-current;
      if(Math.abs(diff)<.0008){current=target;draw();return;}
      current+=diff*.21;draw();raf=requestAnimationFrame(animate);
    }
    function kick(){if(!raf)raf=requestAnimationFrame(animate);}
    function go(v,snap=true){target=clamp(v,0,count-1);if(snap)target=Math.round(target);kick();}
    function schedule(){clearTimeout(snapTimer);snapTimer=setTimeout(()=>go(target,true),105);}

    root.addEventListener("wheel",e=>{
      const raw=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
      if(Math.abs(raw)<1)return;
      const outward=(target<=.001&&raw<0)||(target>=count-1-.001&&raw>0);
      if(outward)return;
      e.preventDefault();
      const factor=e.deltaMode===1?.06:.0048;
      target=clamp(target+raw*factor,0,count-1);kick();schedule();
    },{passive:false});

    root.addEventListener("pointerdown",e=>{
      if(e.button!==undefined&&e.button!==0)return;
      if(e.target.closest("a,button,input,label,textarea,select"))return;
      dragging=true;startX=e.clientX;startTarget=target;root.classList.add("is-dragging");root.setPointerCapture?.(e.pointerId);
    });
    root.addEventListener("pointermove",e=>{if(!dragging)return;target=clamp(startTarget-(e.clientX-startX)/step(),0,count-1);kick();});
    const finish=()=>{if(!dragging)return;dragging=false;root.classList.remove("is-dragging");go(target,true);};
    root.addEventListener("pointerup",finish);root.addEventListener("pointercancel",finish);
    root.addEventListener("keydown",e=>{if(e.key==="ArrowRight"){e.preventDefault();go(Math.round(target)+1)}else if(e.key==="ArrowLeft"){e.preventDefault();go(Math.round(target)-1)}else if(e.key==="Home"){e.preventDefault();go(0)}else if(e.key==="End"){e.preventDefault();go(count-1)}});
    root.addEventListener("click",e=>{
      const dot=e.target.closest("[data-practice-roll-dot]");if(dot){go(Number(dot.dataset.practiceRollDot));return;}
      const card=e.target.closest("[data-practice-roll-card]");if(!card)return;
      const i=cards.indexOf(card);if(i<0)return;
      const opens=card.matches("[data-topic-open],[data-topic-roll],[data-project],[data-topic-contribute]");
      if(i!==Math.round(target) && !opens){e.preventDefault();e.stopPropagation();go(i);}
    },true);
    root._avpPracticeRoll={go,cards,get index(){return Math.round(target)}};
    draw();
  }

  function initAll(scope=document){scope.querySelectorAll("[data-practice-roll]").forEach(init);}
  function reset(root){if(!root)return;delete root.dataset.rollReady;root._avpPracticeRoll=null;init(root);}
  function watchList(container){
    if(!container||container.dataset.rollWatch==="1")return;container.dataset.rollWatch="1";
    let timer=0;
    new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>{
      const children=[...container.children].filter(x=>!x.classList.contains("pv-daily-empty")&&!x.classList.contains("pg-board-empty"));
      if(children.length<2)return;
      children.forEach(x=>x.setAttribute("data-practice-roll-card",""));
      let root=container.closest("[data-practice-roll]");if(root)reset(root);
    },30)}).observe(container,{childList:true});
  }
  document.addEventListener("DOMContentLoaded",()=>{initAll();watchList(document.getElementById("pvDailyList"));});
  window.AVPPracticeRoll={init,initAll,reset,watchList};
})();
