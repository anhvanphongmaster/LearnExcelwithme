/*! Home copy V104 — stable typing, transform caret */
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
   * The typed text changes width every character. Keep the hero slot fixed and
   * animate only the text content. The caret is positioned from the measured
   * text width, so it always stays immediately after the last character.
   */
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

  typing.style.display='block';
  typing.style.width='100%';
  typing.style.maxWidth='100%';
  typing.style.height='1.35em';
  typing.style.overflow='hidden';
  typing.style.contain='layout paint';
  typing.style.whiteSpace='nowrap';

  frame.style.position='relative';
  frame.style.display='block';
  frame.style.height='1.35em';
  frame.style.lineHeight='1.35';
  frame.style.whiteSpace='nowrap';
  frame.style.maxWidth='100%';
  frame.style.textAlign='left';

  text.style.display='inline-block';
  text.style.whiteSpace='nowrap';

  cursor.style.display='inline-block';
  cursor.style.position='static';
  cursor.style.marginLeft='3px';
  cursor.style.transform='none';

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
