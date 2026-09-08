(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function text(id){return String($(id)?.textContent||'').trim()}
  function setBreadcrumb(parts){
    const root=$('proBreadcrumb'); if(!root)return;
    const clean=(parts||[]).map(v=>String(v||'').trim()).filter(Boolean);
    root.hidden=clean.length<=1;
    root.innerHTML=clean.map((part,i)=>`<span${i===clean.length-1?' class="current"':''}>${esc(part)}</span>`).join('<i aria-hidden="true">/</i>');
  }
  function activeStage(){
    const el=[...document.querySelectorAll('[data-pro-stage]')].find(x=>!x.hidden);
    return el?.dataset?.proStage||'domains';
  }
  function syncBreadcrumb(){
    const stage=activeStage();
    if(stage==='domains'){setBreadcrumb(['Professional']);return}
    const domain=text('proTrainingDomainLabel').replace(/^NỘI DUNG TẬP LUYỆN\s*[·:-]?\s*/i,'')||text('proFlowTitle');
    const module=text('proLevelModuleTitle');
    if(stage==='training'){setBreadcrumb(['Professional',domain]);return}
    if(stage==='levels'){setBreadcrumb(['Professional',domain,module]);return}
    const brief=$('proCaseBrief');
    if(brief&&!brief.hidden){
      const caseLabel=String(brief.querySelector('.pro-case-brief-head span')?.textContent||'').trim();
      const level=text('proCaseLevelTitle')||text('proCaseLevelLabel');
      setBreadcrumb(['Professional',domain,module,level,caseLabel]);
    }else{
      const level=text('proCaseLevelTitle')||text('proCaseLevelLabel');
      setBreadcrumb(['Professional',domain,module,level]);
    }
  }
  function cleanFeedback(){
    const el=document.querySelector('.pro-case-submission-state'); if(!el)return;
    el.innerHTML=el.innerHTML
      .replace(/\[AUTO PRO V[12]\]\s*/g,'')
      .replace(/\s*\|\s*/g,' · ')
      .replace(/\[AUTO REVIEW\]\s*/g,'');
  }
  function sync(){syncBreadcrumb();cleanFeedback()}
  document.addEventListener('click',()=>setTimeout(sync,0));
  document.addEventListener('DOMContentLoaded',()=>{
    sync();
    const root=$('ptProtectedContent')||document.body;
    new MutationObserver(()=>sync()).observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});
  });
})();
