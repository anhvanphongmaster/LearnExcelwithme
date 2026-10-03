/*! Home copy V104 — stable typing, transform caret */
(function(){
  'use strict';
  if(window.__avpHomeCopyV104)return;
  window.__avpHomeCopyV104=true;

  var old=document.getElementById('avpTyping');
  if(!old)return;

  /*
   * Keep the caret in normal inline flow after the text. Avoid measuring layout
   * on every tick, which can force synchronous layout and cause typing stutter.
   */
  var typing=old.cloneNode(false);
  typing.id='avpTyping';
  typing.className=old.className;
  old.replaceWith(typing);

  var frame=document.createElement('span');
  frame.className='avp-typing-frame';
  var text=document.createElement('span');
  text.className='avp-typing-text';
  var cursor=document.createElement('span');
  cursor.className='avp-cursor';
  cursor.setAttribute('aria-hidden','true');

  frame.appendChild(text);
  frame.appendChild(cursor);
  typing.appendChild(frame);

  /*
   * Reserve a fixed-width typing slot. The parent tagline is full-width and
   * centered, so its width no longer changes as each character is added.
   */
  typing.style.display='block';
  typing.style.width='42ch';
  typing.style.maxWidth='100%';
  typing.style.flex='0 1 42ch';
  typing.style.height='1.35em';
  typing.style.overflow='hidden';
  typing.style.contain='layout paint';
  typing.style.whiteSpace='nowrap';

  frame.style.position='relative';
  frame.style.display='inline-block';
  frame.style.height='1.35em';
  frame.style.lineHeight='1.35';
  frame.style.whiteSpace='nowrap';
  frame.style.maxWidth='100%';

  text.style.display='inline-block';
  text.style.whiteSpace='nowrap';

  cursor.style.display='inline-block';
  cursor.style.position='relative';
  cursor.style.left='auto';
  cursor.style.top='auto';
  cursor.style.marginLeft='3px';
  cursor.style.transform='none';
  cursor.style.verticalAlign='-2px';

  var lines=[
    'Học đúng lộ trình, không lan man',
    'Thực hành trên file thật, tự làm',
    'Tự động hóa công việc, làm nhanh hơn'
  ];

  /* Respect system reduced-motion preference: keep the message readable without animating it. */
  var reduceMotion=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion){
    text.textContent=lines[0];
    cursor.style.display='none';
    typing.style.width='auto';
    typing.style.flex='0 1 auto';
    typing.style.height='auto';
    typing.style.overflow='visible';
    return;
  }

  var line=0;
  var char=0;
  var deleting=false;
  var timer=0;
  var TYPE=48;
  var DEL=28;
  var HOLD=1900;
  var GAP=300;

  function render(){
    text.textContent=lines[line].slice(0,char);
  }

  var pendingDelay=120;

  function next(ms){
    pendingDelay=ms;
    if(timer){
      clearTimeout(timer);
      timer=0;
    }
    if(document.hidden)return;
    timer=setTimeout(step,pendingDelay);
  }

  function step(){
    timer=0;
    if(document.hidden)return;

    var current=lines[line];
    if(!deleting){
      char=Math.min(current.length,char+1);
      render();
      if(char===current.length){
        deleting=true;
        next(HOLD);
      }else{
        next(TYPE);
      }
    }else{
      char=Math.max(0,char-1);
      render();
      if(char===0){
        deleting=false;
        line=(line+1)%lines.length;
        next(GAP);
      }else{
        next(DEL);
      }
    }
  }

  function resume(){
    if(!document.hidden && !timer)next(pendingDelay);
  }

  function pause(){
    if(timer){
      clearTimeout(timer);
      timer=0;
    }
  }

  render();
  next(120);
  document.addEventListener('visibilitychange',function(){
    if(document.hidden)pause();
    else resume();
  });
  window.addEventListener('pagehide',pause);
  window.addEventListener('pageshow',resume);
})();
