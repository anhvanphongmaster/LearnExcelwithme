/*! Home copy V104 — current value proposition */
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

  var lines=['Học đúng lộ trình','Thực hành trên file thật','Tự động hóa công việc'];
  var line=0,char=0,deleting=false,timer=0;
  var TYPE=48,DEL=28,HOLD=1900,GAP=300;
  function render(){typing.textContent=lines[line].slice(0,char)}
  function next(ms){clearTimeout(timer);timer=setTimeout(step,ms)}
  function step(){
    if(document.hidden){next(500);return}
    var current=lines[line];
    if(!deleting){
      char=Math.min(current.length,char+1);render();
      if(char===current.length){deleting=true;next(HOLD)}else next(TYPE);
    }else{
      char=Math.max(0,char-1);render();
      if(char===0){deleting=false;line=(line+1)%lines.length;next(GAP)}else next(DEL);
    }
  }
  typing.textContent='';next(120);
  window.addEventListener('pagehide',function(){clearTimeout(timer)},{once:true});
})();
