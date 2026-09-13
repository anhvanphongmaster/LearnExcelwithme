/* AVP Home Robot Motion V4
   Single owner for horizontal patrol on index.html.
   - time-based speed: independent from monitor FPS
   - live viewport bounds: never walks beyond the visible page
   - neutralizes the two legacy home patrol loops without touching dock-page behavior
*/
(() => {
  'use strict';

  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(page!=='index.html' || window.__AVP_HOME_ROBOT_V4__) return;
  window.__AVP_HOME_ROBOT_V4__=true;

  const PAD=16;
  const SPEED=42; // CSS px / second, independent from refresh rate
  const POS_KEY='avp_bot_walk_x_v4';
  let root=null;
  let fab=null;
  let x=PAD;
  let dir=1;
  let lastTs=0;
  let lastSave=0;
  let raf=0;
  let observer=null;

  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

  function viewportWidth(){
    const docW=document.documentElement?.clientWidth||0;
    const winW=window.innerWidth||docW;
    return Math.max(1,docW ? Math.min(docW,winW) : winW);
  }

  function botWidth(){
    return Math.max(64,root?.offsetWidth||0,fab?.offsetWidth||0);
  }

  function maxX(){
    return Math.max(PAD,viewportWidth()-botWidth()-PAD);
  }

  function chatPanelOpen(){
    return [
      document.getElementById('avpChatPanel'),
      document.getElementById('avpAdminFloatPanel'),
      document.getElementById('avpGuestChatPanel')
    ].some(panel=>panel && !panel.hidden);
  }

  function canPatrol(){
    return !!root &&
      !document.hidden &&
      !root.classList.contains('open') &&
      !root.classList.contains('is-dragging') &&
      !root.classList.contains('is-lifted') &&
      !chatPanelOpen();
  }

  function normalizeClasses(){
    if(!root) return;
    // avp-core owns menu / lift behavior; V4 owns only horizontal movement.
    root.classList.add('avp-robot-home','avp-patrol-v4-active');
    root.classList.remove('avp-robot-home-smooth','avp-smooth-moving','is-walking');
  }

  function setSide(){
    if(!root) return;
    const left=x;
    const onLeft=(left+botWidth()/2)<viewportWidth()/2;
    root.classList.toggle('is-left',onLeft);
    root.classList.toggle('is-right',!onLeft);
    root.classList.toggle('face-left',dir<0);
  }

  function apply(){
    if(!root) return;
    const mx=maxX();
    x=clamp(x,PAD,mx);
    root.style.setProperty('left',x.toFixed(2)+'px','important');
    root.style.setProperty('right','auto','important');
    root.style.setProperty('top','auto','important');
    root.style.setProperty('bottom',PAD+'px','important');
    root.style.setProperty('transform','none','important');
    root.style.setProperty('transition','none','important');
    setSide();
  }

  function syncFromDom(){
    if(!root) return;
    const r=root.getBoundingClientRect();
    if(Number.isFinite(r.left)) x=clamp(r.left,PAD,maxX());
    apply();
  }

  function save(){
    try{localStorage.setItem(POS_KEY,JSON.stringify({x:Math.round(x),dir}));}catch(_){ }
  }

  function restore(){
    let saved=null;
    for(const key of [POS_KEY,'avp_bot_walk_x_v3','avp_bot_walk_x_v1']){
      try{saved=JSON.parse(localStorage.getItem(key)||'null');}catch(_){saved=null;}
      if(saved && Number.isFinite(saved.x)) break;
    }
    const current=root?.getBoundingClientRect().left;
    if(Number.isFinite(current) && current>=0 && current<=viewportWidth()) x=current;
    else if(saved && Number.isFinite(saved.x)) x=saved.x;
    if(saved?.dir===-1) dir=-1;
    x=clamp(x,PAD,maxX());
  }

  function tick(ts){
    if(!root){raf=0;return;}

    if(!lastTs) lastTs=ts;
    // Cap long gaps (background tab / stalled main thread) so the robot never teleports.
    const dt=Math.min(Math.max(0,(ts-lastTs)/1000),0.05);
    lastTs=ts;

    normalizeClasses();

    if(canPatrol()){
      const mx=maxX();
      x=clamp(x,PAD,mx);
      x+=dir*SPEED*dt;

      if(x>=mx){x=mx;dir=-1;}
      else if(x<=PAD){x=PAD;dir=1;}

      apply();

      if(ts-lastSave>500){
        lastSave=ts;
        save();
      }
    }else{
      // User interaction may move the robot; adopt that position instead of snapping back.
      const r=root.getBoundingClientRect();
      if(Number.isFinite(r.left)) x=clamp(r.left,PAD,maxX());
    }

    raf=requestAnimationFrame(tick);
  }

  function neutralizeLegacyMotion(){
    if(!root) return;

    // home-effects.js uses Element.animate() for a second patrol. Keep a private
    // reference only for diagnostics; this launcher no longer needs WAAPI motion.
    if(!root.__avpNativeAnimate && typeof root.animate==='function'){
      root.__avpNativeAnimate=root.animate.bind(root);
    }
    root.animate=function(){
      return {
        cancel(){}, play(){}, pause(){}, reverse(){}, finish(){},
        onfinish:null, oncancel:null,
        playState:'idle'
      };
    };

    try{root.getAnimations?.().forEach(a=>a.cancel());}catch(_){ }
    normalizeClasses();
  }

  function installStyles(){
    if(document.getElementById('avpRobotMotionV4Style')) return;
    const style=document.createElement('style');
    style.id='avpRobotMotionV4Style';
    style.textContent=`
      #avpEdgeLauncher.avp-patrol-v4-active{
        will-change:left!important;
        transition:none!important;
      }
      #avpEdgeLauncher.avp-patrol-v4-active .avp-bot-leg-l{animation:avpBotStep .36s linear infinite!important}
      #avpEdgeLauncher.avp-patrol-v4-active .avp-bot-leg-r{animation:avpBotStep .36s linear infinite reverse!important}
      #avpEdgeLauncher.avp-patrol-v4-active .avp-bot-arm-l{animation:avpBotStep .36s linear infinite reverse!important}
      #avpEdgeLauncher.avp-patrol-v4-active .avp-bot-arm-r{animation:avpBotStep .36s linear infinite!important}
      #avpEdgeLauncher.avp-patrol-v4-active .avp-bot-head{animation:avpRobotHeadBob .36s ease-in-out infinite!important}
      #avpEdgeLauncher.avp-patrol-v4-active .avp-bot-body{animation:avpRobotBodyBob .36s ease-in-out infinite!important}
      #avpEdgeLauncher.avp-patrol-v4-active .avp-bot-eye{animation:avpRobotBlink 3.1s ease-in-out infinite!important}
      #avpEdgeLauncher.avp-patrol-v4-active.open .avp-bot-leg-l,
      #avpEdgeLauncher.avp-patrol-v4-active.open .avp-bot-leg-r,
      #avpEdgeLauncher.avp-patrol-v4-active.is-lifted .avp-bot-leg-l,
      #avpEdgeLauncher.avp-patrol-v4-active.is-lifted .avp-bot-leg-r{animation-play-state:paused!important}
    `;
    document.head.appendChild(style);
  }

  function bind(){
    if(root.dataset.avpRobotV4Bound==='1') return;
    root.dataset.avpRobotV4Bound='1';

    observer=new MutationObserver(()=>normalizeClasses());
    observer.observe(root,{attributes:true,attributeFilter:['class']});

    const adoptSoon=()=>requestAnimationFrame(syncFromDom);
    fab?.addEventListener('pointerup',adoptSoon,{passive:true});
    fab?.addEventListener('pointercancel',adoptSoon,{passive:true});

    window.addEventListener('resize',()=>{
      requestAnimationFrame(()=>{
        x=clamp(root.getBoundingClientRect().left,PAD,maxX());
        apply();
        save();
      });
    },{passive:true});

    document.addEventListener('visibilitychange',()=>{
      lastTs=0;
      if(!document.hidden) requestAnimationFrame(syncFromDom);
      else save();
    });

    window.addEventListener('focus',()=>{lastTs=0;},{passive:true});
    window.addEventListener('pagehide',()=>{
      save();
      if(raf) cancelAnimationFrame(raf);
      observer?.disconnect();
    },{once:true});
  }

  function init(){
    root=document.getElementById('avpEdgeLauncher');
    fab=root?.querySelector('#avpEdgeMain');
    if(!root || !fab){setTimeout(init,80);return;}

    installStyles();
    neutralizeLegacyMotion();
    restore();
    apply();
    bind();

    // home-effects initializes again at window.load. Re-assert single ownership
    // immediately afterwards so its cached controller cannot regain movement.
    window.addEventListener('load',()=>{
      setTimeout(()=>{
        neutralizeLegacyMotion();
        syncFromDom();
      },20);
    },{once:true});

    if(!raf) raf=requestAnimationFrame(tick);
  }

  init();
})();
