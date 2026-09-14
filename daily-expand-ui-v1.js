(() => {
  'use strict';
  const E = window.AVPDailyExpand;
  const C = window.AVPLearningCoach;
  if (!E || !C) return;
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const viDate = d => { const [y,m,day]=String(d).split('-'); return `${day}/${m}/${y}`; };
  const LEVEL_NAME = {basic:'Cơ bản', intermediate:'Trung cấp', advanced:'Nâng cao', case:'Case'};

  function localDate(){ return C.localDate ? C.localDate() : new Date().toISOString().slice(0,10); }
  function hash(s){ let h=2166136261; for (const ch of String(s)) { h^=ch.charCodeAt(0); h=Math.imul(h,16777619);} return h>>>0; }
  function shuffle(arr, seedStr){
    const a=arr.slice(); let seed=hash(seedStr);
    for(let i=a.length-1;i>0;i--){ seed=(Math.imul(seed,1664525)+1013904223)>>>0; const j=seed%(i+1); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }
  function usedIds(){
    const all=C.getDaily()||{}; const out=new Set();
    Object.keys(all).forEach(d => {
      const pack=all[d]?.pack; if(!pack) return;
      Object.values(pack).forEach(id => { if(id) out.add(id); });
    });
    return out;
  }
  function pickToday(){
    const date=localDate();
    const existing=C.getDaily()[date];
    if (existing?.pack?.basic && existing.pack.intermediate && existing.pack.advanced && existing.pack.case) return existing.pack;
    const learner=C.getLearnerId ? C.getLearnerId() : 'g';
    const used=usedIds();
    const pack={};
    (E.levels||[]).forEach(lv => {
      const deck=shuffle(E.byLevel[lv.id]||[], learner+':'+lv.id);
      pack[lv.id]=deck.find(id=>!used.has(id)) || deck[0];
    });
    C.markDaily(date,{pack, kind:'expand60'});
    return pack;
  }
  function itemsOf(pack){ return (E.levels||[]).map(lv => E.byId[pack[lv.id]]).filter(Boolean); }

  function card(it, done){
    return `<article class="dx-card" data-level="${esc(it.level)}">
      <header><span>${esc(LEVEL_NAME[it.level]||it.level)} · ${it.minutes} phút</span>${done?'<b>Đã làm</b>':''}</header>
      <h3>${esc(it.title)}</h3>
      <p>${esc(it.outcome)}</p>
      <ol>${(it.steps||[]).map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
      <p class="dx-tasks"><strong>Trên file:</strong> ${(it.tasks||[]).map(esc).join(' ')}</p>
      <div class="dx-actions">
        <a class="lc-btn solid" href="${esc(it.file)}" download>Tải file · sheet ${esc(it.sheet)}</a>
        <button type="button" class="lc-btn" data-dx-done="${esc(it.id)}" ${done?'disabled':''}>${done?'Đã xong':'Đánh dấu xong'}</button>
      </div>
    </article>`;
  }

  function quizBank(items){
    const bank=[];
    items.forEach(it => (it.quiz||[]).slice(0,2).forEach((q,i)=>bank.push({...q, lessonId:it.id, skill:it.level, title:it.title, qid:it.id+'-'+i})));
    return bank;
  }

  function startQuiz(items, hostId){
    const host=$(hostId||'dxQuizHost'); if(!host) return;
    const bank=quizBank(items); let i=0; const date=localDate();
    const ask=()=>{
      if(i>=bank.length){
        C.markDaily(date,{quizDone:true});
        host.innerHTML='<div class="lc-feedback good"><strong>Đã xong câu hỏi gói hôm nay.</strong></div>';
        return;
      }
      const q=bank[i];
      host.innerHTML=`<div class="lc-quiz"><div class="lc-quiz-meta"><span>Câu ${i+1}/${bank.length}</span><span>${esc(LEVEL_NAME[q.skill]||'')} · ${esc(q.title)}</span></div>
        <h3>${esc(q.q)}</h3>
        <div class="lc-options">${q.o.map((x,idx)=>`<button class="lc-option" data-qi="${idx}" type="button">${String.fromCharCode(65+idx)}. ${esc(x)}</button>`).join('')}</div>
        <div id="dxFb"></div></div>`;
      host.querySelectorAll('[data-qi]').forEach(b=>b.addEventListener('click',()=>{
        const sel=Number(b.dataset.qi);
        host.querySelectorAll('[data-qi]').forEach((x,idx)=>{x.disabled=true;x.classList.toggle('good',idx===q.a);x.classList.toggle('bad',idx===sel&&sel!==q.a)});
        if(sel!==q.a && C.logMistake) C.logMistake({source:'daily-expand',skill:q.skill,concept:q.qid,prompt:q.q,chosen:q.o[sel],correct:q.o[q.a],explain:q.e,lessonId:q.lessonId,url:location.href});
        document.getElementById('dxFb').innerHTML=`<div class="lc-feedback ${sel===q.a?'good':'bad'}"><strong>${sel===q.a?'Đúng.':'Chưa đúng.'}</strong> ${esc(q.e)}</div><div class="lc-next"><button class="lc-btn solid" id="dxNext" type="button">${i===bank.length-1?'Hoàn thành':'Câu tiếp'} →</button></div>`;
        document.getElementById('dxNext')?.addEventListener('click',()=>{i+=1;ask();},{once:true});
      },{once:true}));
    };
    ask();
  }

  function bindDone(root, after){
    root.querySelectorAll('[data-dx-done]').forEach(btn=>btn.addEventListener('click',()=>{
      const date=localDate();
      const map={...(C.getDaily()[date]?.itemDone||{}), [btn.dataset.dxDone]:true};
      C.markDaily(date,{itemDone:map}); after();
    }));
  }

  function renderToday(){
    const host=$('todayHost'); if(!host) return;
    const date=localDate(); const pack=pickToday(); const items=itemsOf(pack);
    const doneMap=C.getDaily()[date]?.itemDone||{};
    const doneN=items.filter(x=>doneMap[x.id]).length;
    host.innerHTML=`<article class="dx-hero"><div class="dx-ribbon"><span>Gói hôm nay · ${esc(viDate(date))}</span><b>4 bài mới · ngoài 42 bài</b></div>
      <div class="dx-hero-body"><div><span class="lc-label">MỞ RỘNG · 60 BÀI ĐỘC LậP</span>
      <h2>Một ngày đủ 4 mức</h2>
      <p>Cơ bản, trung cấp, nâng cao và một case. Câu hỏi và file đi đúng 4 bài này.</p></div>
      <span class="lc-pill strong">${doneN}/4 bài</span></div></article>
      <div class="dx-grid">${items.map(it=>card(it,!!doneMap[it.id])).join('')}</div>
      <section class="lc-focus" style="margin-top:12px"><div class="lc-focus-head"><div>
        <span class="lc-label">CÂU HỎI ĐÚNG GÓI HÔM NAY</span>
        <h2>8 câu — 2 câu / bài</h2></div></div>
        <div id="dxQuizHost"></div>
        <div class="lc-secondary-links"><button type="button" id="dxStartQuiz">Làm 8 câu hôm nay</button>
        <a href="skill-map.html">Lộ trình 42 bài ở khu Học</a></div></section>`;
    bindDone(host, renderToday);
    $('dxStartQuiz')?.addEventListener('click',()=>startQuiz(items,'dxQuizHost'));
  }

  function renderDiag(){
    const host=$('diagnosticHost'); if(!host) return;
    host.innerHTML='<div id="dxQuizHost"></div>';
    startQuiz(itemsOf(pickToday()),'dxQuizHost');
  }
  function renderCase(){
    const host=$('casesHost'); if(!host) return;
    const it=E.byId[pickToday().case];
    if(!it){host.innerHTML='<div class="lc-empty">Chưa gán case.</div>';return;}
    host.innerHTML=card(it,!!(C.getDaily()[localDate()]?.itemDone||{})[it.id]);
    bindDone(host, ()=>{renderCase();renderToday();});
  }
  function fillOuter(){
    const title=$('lhTodayTitle'), meta=$('lhTodayMeta'), cta=$('lhTodayCta');
    if(!title||!meta) return;
    const items=itemsOf(pickToday());
    title.textContent='Hôm nay: 4 bài mở rộng ngoài 42 bài';
    meta.textContent=items.map(x=>(LEVEL_NAME[x.level]||'')+': '+x.title).join(' · ');
    if(cta) cta.textContent='Mở gói hôm nay →';
  }

  function boot(){
    if($('todayHost')){
      document.querySelectorAll('.lc-tab').forEach(b=>b.addEventListener('click',()=>{
        if(b.dataset.panel==='today') renderToday();
        if(b.dataset.panel==='diagnostic') renderDiag();
        if(b.dataset.panel==='cases') renderCase();
      }));
      renderToday();
    }
    fillOuter();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
