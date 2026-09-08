(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function text(id){return String($(id)?.textContent||'').trim()}
  function setBreadcrumb(parts){
    const root=$('proBreadcrumb'); if(!root)return;
    const clean=(parts||[]).map(v=>String(v||'').trim()).filter(Boolean);
    const next=clean.map((part,i)=>`<span${i===clean.length-1?' class="current"':''}>${esc(part)}</span>`).join('<i aria-hidden="true">/</i>');
    root.hidden=clean.length<=1;
    if(root.innerHTML!==next)root.innerHTML=next;
  }
  function activeStage(){
    const el=[...document.querySelectorAll('[data-pro-stage]')].find(x=>!x.hidden);
    return el?.dataset?.proStage||'domains';
  }
  function syncBreadcrumb(){
    const stage=activeStage();
    if(stage==='domains'){setBreadcrumb(['Professional']);return}
    const domain=text('proTrainingDomainLabel').replace(/\s*·\s*5\s+NỘI DUNG\s*$/i,'')||text('proFlowTitle');
    const module=text('proLevelModuleTitle')||text('proCaseLevelTitle');
    if(stage==='training'){setBreadcrumb(['Professional',domain]);return}
    if(stage==='levels'){setBreadcrumb(['Professional',domain,module]);return}
    const levelLabel=text('proCaseLevelLabel');
    const level=(levelLabel.split('·').pop()||'').trim();
    const brief=$('proCaseBrief');
    if(brief&&!brief.hidden){
      const caseLabel=String(brief.querySelector('.pro-case-brief-head span')?.textContent||'').trim();
      setBreadcrumb(['Professional',domain,module,level,caseLabel]);
    }else setBreadcrumb(['Professional',domain,module,level]);
  }
  function cleanFeedback(){
    const el=document.querySelector('.pro-case-submission-state'); if(!el)return;
    const before=el.innerHTML;
    const after=before
      .replace(/\[AUTO PRO V[12]\]\s*/g,'')
      .replace(/\s*\|\s*/g,' · ')
      .replace(/\[AUTO REVIEW\]\s*/g,'');
    if(after!==before)el.innerHTML=after;
  }
  function sync(){syncBreadcrumb();cleanFeedback()}
  document.addEventListener('click',()=>setTimeout(sync,0));
  document.addEventListener('DOMContentLoaded',()=>{
    sync();
    const root=$('ptProtectedContent')||document.body;
    new MutationObserver(()=>sync()).observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});
  });
})();
