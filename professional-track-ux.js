(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  let syncQueued=false;
  let adminMode=null;

  function text(id){return String($(id)?.textContent||'').trim()}

  function setBreadcrumb(parts){
    const root=$('proBreadcrumb'); if(!root)return;
    const clean=(parts||[]).map(v=>String(v||'').trim()).filter(Boolean);
    const next=clean.map((part,i)=>`<span${i===clean.length-1?' class="current"':''}>${esc(part)}</span>`).join('<i aria-hidden="true">/</i>');
    const shouldHide=clean.length<=1;
    if(root.hidden!==shouldHide)root.hidden=shouldHide;
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
      .replace(/\[AUTO PRO V\d+\]\s*/g,'')
      .replace(/\s*\|\s*/g,' · ')
      .replace(/\[AUTO REVIEW\]\s*/g,'');
    if(after!==before)el.innerHTML=after;
  }

  function originalCaseState(state){
    return state?.dataset?.sequenceOriginal ?? String(state?.textContent||'');
  }

  function casePassed(card){
    const state=card?.querySelector('.pro-case-state');
    const raw=originalCaseState(state).replace(',', '.');
    const match=raw.match(/(-?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
    return !!match&&Number(match[1])>=7;
  }

  function restoreCaseCard(card){
    const state=card?.querySelector('.pro-case-state');
    if(state?.dataset?.sequenceOriginal!==undefined){
      state.textContent=state.dataset.sequenceOriginal;
      delete state.dataset.sequenceOriginal;
    }
    state?.classList.remove('sequence-locked');
    if(card?.dataset?.sequenceLocked==='1'){
      card.disabled=false;
      card.removeAttribute('aria-disabled');
      card.removeAttribute('title');
      delete card.dataset.sequenceLocked;
    }
  }

  function lockCaseCard(card,blockingIndex){
    const state=card?.querySelector('.pro-case-state');
    if(state&&state.dataset.sequenceOriginal===undefined)state.dataset.sequenceOriginal=String(state.textContent||'');
    if(state){
      state.textContent=`Khóa · PASS Case ${String(blockingIndex+1).padStart(2,'0')} trước`;
      state.classList.add('sequence-locked');
    }
    card.disabled=true;
    card.setAttribute('aria-disabled','true');
    card.dataset.sequenceLocked='1';
    card.title=`Hoàn thành Case ${String(blockingIndex+1).padStart(2,'0')} với tối thiểu 7/10 để mở Case này.`;
  }

  function syncCaseSequence(){
    if(adminMode===null)return;
    const grid=$('proCaseGrid');
    if(!grid)return;
    const cards=[...grid.querySelectorAll('.pro-case-card[data-case-index]')];
    if(!cards.length)return;
    cards.forEach(restoreCaseCard);
    if(adminMode)return;
    for(let index=1;index<cards.length;index++){
      const blockingIndex=cards.slice(0,index).findIndex(card=>!casePassed(card));
      if(blockingIndex>=0)lockCaseCard(cards[index],blockingIndex);
    }
  }

  function sync(){syncBreadcrumb();cleanFeedback();syncCaseSequence()}
  function scheduleSync(){
    if(syncQueued)return;
    syncQueued=true;
    queueMicrotask(()=>{
      syncQueued=false;
      sync();
    });
  }

  document.addEventListener('click',()=>setTimeout(scheduleSync,0));
  document.addEventListener('DOMContentLoaded',()=>{
    sync();
    const root=$('ptProtectedContent')||document.body;
    new MutationObserver(scheduleSync).observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});
    Promise.resolve(window.AVPProfessionalGateReady).then(gate=>{
      adminMode=gate?.isAdmin===true;
      scheduleSync();
    }).catch(()=>{
      adminMode=false;
      scheduleSync();
    });
  });
})();
