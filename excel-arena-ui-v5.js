(()=>{
  "use strict";
  const $=id=>document.getElementById(id);

  function selectedMode(){
    const b=document.querySelector('.mode-card.is-selected');
    return b?.dataset?.mode==='rank'?'rank':'learn';
  }
  function selectedTopicName(){
    const b=document.querySelector('.topic-card.is-selected strong');
    return (b?.textContent||'Tổng hợp Excel').trim();
  }
  function syncMode(){
    const mode=selectedMode();
    document.body.dataset.arenaMode=mode;
    document.querySelectorAll('.mode-card').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('is-selected'))));
    const start=$('startArena');
    if(start)start.textContent=mode==='rank'?'Bắt đầu Rank →':'Bắt đầu Học →';
    const hint=$('setupHint');
    if(hint)hint.textContent=`${mode==='rank'?'Rank':'Học'} · ${selectedTopicName()}`;
  }
  function cleanFeedback(){
    const e=$('arenaFeedback');
    if(!e)return;
    const old='Câu này sẽ quay lại sau 3–7 lượt.';
    if(e.innerHTML.includes(old))e.innerHTML=e.innerHTML.replace(old,'Câu này sẽ được ôn lại.');
  }
  function init(){
    syncMode();
    document.addEventListener('click',e=>{
      if(e.target.closest('.mode-card')||e.target.closest('.topic-card'))setTimeout(syncMode,0);
    });
    const feedback=$('arenaFeedback');
    if(feedback){
      new MutationObserver(cleanFeedback).observe(feedback,{childList:true,subtree:true,characterData:true});
    }
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();
