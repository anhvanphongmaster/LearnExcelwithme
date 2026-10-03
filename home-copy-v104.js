/*! Home copy V104 — stable, single-owner static tagline */
(function(){
  'use strict';
  if(window.__avpHomeCopyV104)return;
  window.__avpHomeCopyV104=true;

  var typing=document.getElementById('avpTyping');
  if(!typing)return;

  /* Keep the Home hero copy stable; no competing type/delete animation. */
  typing.replaceChildren(document.createTextNode('Học đúng lộ trình, không lan man'));
  typing.style.display='block';
  typing.style.width='100%';
  typing.style.maxWidth='100%';
  typing.style.minHeight='1.35em';
  typing.style.height='auto';
  typing.style.overflow='visible';
  typing.style.whiteSpace='normal';
})();
