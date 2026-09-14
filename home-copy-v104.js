/*! Home copy V104 — stable typing, local caret */
(function(){
  'use strict';
  if(window.__avpHomeCopyV104)return;
  window.__avpHomeCopyV104=true;

  var old=document.getElementById('avpTyping');
  if(!old)return;

  var typing=old.cloneNode(false);
  typing.id='avpTyping';
  typing.className=old.className;
  old.replaceWith(typing);

  /*
   * Keep one fixed slot to stop the hero from re-centering while characters change.
   * The caret lives inside the slot, immediately after the typed text, so it follows
   * the actual text instead of sitting at the far edge of the reserved width.
   */
  var text=document.createElement('span');
  text.className='avp-typing-text';
  var cursor=document.createElement('span');
  cursor.className='avp-cursor';
  cursor.setAttribute('aria-hidden','true');
  typing.appendChild(text);
  typing.appendChild(cursor);

  typing.style.display='inline-flex';
  typing.style.alignItems='baseline';
  typing.style.justifyContent='flex-start';
  typing.style.width='36ch';
  typing.style.maxWidth='100%';
  typing.style.minHeight='1.25em';
  typing.style.whiteSpace='nowrap';
  typing.style.overflow='hidden';
  typing.style.contain='layout paint';

  var lines=[
    'Học đúng lộ trình, không lan man',
    'Thực hành trên file thật, tự làm',
    'Tự động hóa công việc, làm nhanh hơn'
  ];

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

  function next(ms){
    clearTimeout(timer);
    timer=setTimeout(step,ms);
  }

  function step(){
    if(document.hidden){next(500);return;}

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

  render();
  next(120);
  window.addEventListener('pagehide',function(){clearTimeout(timer);},{once:true});
})();
