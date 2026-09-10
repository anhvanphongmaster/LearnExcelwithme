(() => {
  'use strict';

  const P=window.AVPLearningPlatform||null;
  P?.syncLessonOrder?.();
  const LAST_KEY='avp_knowledge_last_v2';
  const SECTION_KEY='avp_knowledge_section_v2';
  const lessons=(window.AVPKnowledgeLessons||[]).slice().sort((a,b)=>(a.order||999)-(b.order||999));
  const byId=new Map(lessons.map(x=>[x.id,x]));
  const $=id=>document.getElementById(id);
  let currentLesson=null,currentSectionIndex=0;

  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const urlFor=id=>`knowledge.html?lesson=${encodeURIComponent(id)}`;
  const requestedId=()=>new URLSearchParams(location.search).get('lesson')||lessons[0]?.id||'';
  const moduleFor=lesson=>P?.moduleForLesson?.(lesson.id)||null;
  const kindLabel=kind=>kind==='extension'?'HỌC THÊM':'CỐT LÕI';
  const sectionFromHash=lesson=>{const m=String(location.hash||'').match(/^#sec-(\d+)$/);if(!m)return 0;return Math.max(0,Math.min((lesson.sections?.length||1)-1,Number(m[1])-1))};

  function renderCourseNav(lesson){
    const host=$('kvCourseNav');if(!host)return;
    const idx=lessons.findIndex(x=>x.id===lesson.id),prev=idx>0?lessons[idx-1]:null,next=idx<lessons.length-1?lessons[idx+1]:null,module=moduleFor(lesson);
    host.innerHTML=`
      ${prev?`<a class="kv-course-edge prev" href="${urlFor(prev.id)}"><small>← BÀI TRƯỚC</small><strong>${String(prev.order).padStart(2,'0')} · ${esc(prev.title)}</strong></a>`:`<a class="kv-course-edge prev is-boundary" href="skill-map.html"><small>← HỌC EXCEL</small><strong>Tất cả module</strong></a>`}
      <div class="kv-stage-tabs lp-reader-module"><a class="kv-stage-tab active" href="${module?P.moduleUrl(module.id):'skill-map.html'}"><span>${module?`${module.number} · ${esc(module.label)}`:'EXCEL A–Z'}</span><strong>${module?esc(module.title):'Lộ trình học'}</strong></a></div>
      ${next?`<a class="kv-course-edge next" href="${urlFor(next.id)}"><small>BÀI TIẾP THEO →</small><strong>${String(next.order).padStart(2,'0')} · ${esc(next.title)}</strong></a>`:`<a class="kv-course-edge next is-boundary" href="practice-video.html"><small>HOÀN THÀNH LỘ TRÌNH →</small><strong>Chuyển sang thực hành</strong></a>`}`;
  }

  function renderHero(lesson){
    const module=moduleFor(lesson),qCount=(lesson.sections||[]).reduce((n,s)=>n+(s.questions?.length||0),0);
    $('kvHero').innerHTML=`<div><div class="kv-eyebrow"><span class="kv-chip">${module?`${module.number} · ${esc(module.label)}`:'EXCEL A–Z'}</span><span class="kv-chip">Bài ${String(lesson.order).padStart(2,'0')} / ${lessons.length}</span><span class="kv-chip">${esc(lesson.duration||'')}</span></div><h1>${esc(lesson.title)}</h1><p class="kv-hero-lead">${esc(lesson.hook||lesson.short||'')}</p></div><div class="kv-hero-side"><div class="kv-hero-card"><span>BẠN ĐANG Ở ĐÂU?</span><strong>${module?esc(module.title):'Học Excel A–Z'}</strong><p>${module?esc(module.short):'Bài học trong lộ trình chính.'}</p></div><div class="kv-hero-card"><span>CÁCH HỌC BÀI NÀY</span><strong>Làm phần cốt lõi trước</strong><p>Mỗi lần chỉ hiện một phần. Nội dung nâng cao được gom riêng vào “Học thêm”, tránh làm người mới bị ngợp.</p></div><div class="kv-hero-card"><span>KIỂM TRA NHANH</span><strong>${qCount} câu trong bài</strong><p>Câu hỏi nằm sau đúng phần vừa học, không tách thành một bài thi riêng.</p></div></div>`;
  }

  function renderGuide(lesson){
    const g=lesson.guide;if(!g)return '';
    const visual=window.AVPVisualWalkthrough?.html?.(lesson.id)||'';
    return `<section class="lp-start-here-v2" aria-label="Bắt đầu bài học"><div class="lp-start-head-v2"><span>BẮT ĐẦU Ở ĐÂY</span><strong>${esc(g.task)}</strong></div><div class="lp-start-grid-v2"><article><small>1 · DÙNG GÌ?</small><b>${esc(g.tool)}</b></article><article class="wide"><small>2 · LÀM THEO</small><ol>${(g.steps||[]).map(s=>`<li>${esc(s)}</li>`).join('')}</ol></article><article><small>3 · LÀM ĐÚNG KHI</small><b>${esc(g.success)}</b></article><article><small>4 · DỄ SAI NHẤT</small><b>${esc(g.mistake)}</b></article></div></section>${visual}`;
  }

  function renderIntro(lesson){
    const prereq=(lesson.prerequisites||[]).map(id=>byId.get(id)).filter(Boolean);
    $('kvIntro').innerHTML=`${renderGuide(lesson)}<div class="kv-intro-grid"><section class="kv-intro-box"><h2>Bạn sẽ học</h2><ul>${(lesson.outcomes||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section><section class="kv-intro-box"><h2>Dùng khi nào?</h2><ul>${(lesson.useCases||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section></div><div class="kv-prereq"><span>Nên biết trước:</span>${prereq.length?prereq.map(x=>`<em class="kv-prereq-item">Bài ${String(x.order).padStart(2,'0')} · ${esc(x.title)}</em>`).join(''):'<em>Có thể bắt đầu trực tiếp từ bài này.</em>'}</div>`;
  }

  function renderQuestion(q,index){return `<article class="kv-question" data-question="${index}"><p class="kv-q-text">${index+1}. ${esc(q.q)}</p><div class="kv-options">${(q.options||[]).map((o,i)=>`<button class="kv-option" type="button" data-answer="${i}">${String.fromCharCode(65+i)}. ${esc(o)}</button>`).join('')}</div><div class="kv-feedback" aria-live="polite"></div></article>`}

  function renderSectionFlow(index){
    if(!currentLesson)return '';
    const total=currentLesson.sections?.length||0;
    const prev=index>0?index-1:null;
    const next=index<total-1?index+1:null;
    const lessonIndex=lessons.findIndex(x=>x.id===currentLesson.id);
    const nextLesson=lessonIndex>=0&&lessonIndex<lessons.length-1?lessons[lessonIndex+1]:null;
    return `<div class="kv-section-flow-v4" aria-label="Điều hướng trong bài">${prev!==null?`<button type="button" data-flow-section="${prev}">← Phần trước</button>`:'<button type="button" disabled>← Phần trước</button>'}${next!==null?`<button class="next" type="button" data-flow-section="${next}">Phần tiếp theo →</button>`:nextLesson?`<a class="next kv-flow-next-lesson-v4" href="${urlFor(nextLesson.id)}">Bài ${String(nextLesson.order).padStart(2,'0')} →</a>`:`<a class="next kv-flow-next-lesson-v4" href="practice-video.html">Sang thực hành →</a>`}</div>`;
  }

  function renderSection(section,index){
    const qCount=section.questions?.length||0;
    return `<section class="kv-section" id="sec-${index+1}" data-section-index="${index}"><div class="kv-section-head"><div class="kv-section-index"><span class="kv-section-num">${String(index+1).padStart(2,'0')}</span><h2>${esc(section.title)}</h2></div><span class="kv-kind ${section.kind==='extension'?'extension':'core'}">${kindLabel(section.kind)}</span></div>${section.version?`<span class="kv-version">Phiên bản: ${esc(section.version)}</span>`:''}<p class="kv-why"><strong>Phần này để làm gì:</strong> ${esc(section.why||'')}</p><div class="kv-body">${(section.body||[]).map(p=>`<p>${esc(p)}</p>`).join('')}</div>${section.steps?.length?`<div class="lp-do-now-v2"><strong>LÀM NGAY</strong><ol>${section.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></div>`:''}${section.example?`<div class="kv-box kv-example"><strong>VÍ DỤ THỰC TẾ</strong>${section.example.formula?`<code class="kv-formula">${esc(section.example.formula)}</code>`:''}<p>${esc(section.example.text||'')}</p></div>`:''}${section.tip?`<div class="kv-box kv-tip"><strong>MẸO</strong><p>${esc(section.tip)}</p></div>`:''}${section.warning?`<div class="kv-box kv-warning"><strong>DỄ SAI Ở ĐÂY</strong><p>${esc(section.warning)}</p></div>`:''}${qCount?`<div class="kv-check"><div class="kv-check-head"><strong>Kiểm tra vừa học</strong><span>${qCount} câu</span></div><div class="kv-questions">${section.questions.map(renderQuestion).join('')}</div></div>`:''}${renderSectionFlow(index)}</section>`;
  }

  function bindQuestions(lesson,sectionIndex){
    document.querySelectorAll('.kv-question').forEach(card=>{const q=lesson.sections[sectionIndex]?.questions?.[Number(card.dataset.question||0)];if(!q)return;card.querySelectorAll('.kv-option').forEach(button=>button.addEventListener('click',()=>{const selected=Number(button.dataset.answer),correct=selected===q.answer;card.querySelectorAll('.kv-option').forEach((item,i)=>{item.disabled=true;item.classList.toggle('correct',i===q.answer);item.classList.toggle('wrong',i===selected&&!correct)});const feedback=card.querySelector('.kv-feedback');feedback.className=`kv-feedback show ${correct?'good':'bad'}`;feedback.innerHTML=`<b>${correct?'Đúng.':'Chưa đúng.'}</b>${esc(q.explain||'')}`}))})
    document.querySelectorAll('[data-flow-section]').forEach(button=>button.addEventListener('click',()=>activateSection(Number(button.dataset.flowSection),{scroll:true,updateHash:true})));
  }

  function outlineButton(s,i){return `<button type="button" data-outline="${i}" data-kind="${s.kind==='extension'?'extension':'core'}" aria-current="false"><span class="kv-outline-num">${String(i+1).padStart(2,'0')}</span><span>${esc(s.title)}</span></button>`}

  function renderSidebar(lesson){
    const module=moduleFor(lesson);
    const sections=lesson.sections||[];
    const core=sections.map((s,i)=>({s,i})).filter(x=>x.s.kind!=='extension');
    const extra=sections.map((s,i)=>({s,i})).filter(x=>x.s.kind==='extension');
    $('kvSidebar').innerHTML=`<span class="kv-side-label">${module?`${module.number} · ${esc(module.title)}`:'EXCEL A–Z'}</span><h2 class="kv-side-title">${esc(lesson.title)}</h2><p class="lp-side-help-v2">Đi theo phần cốt lõi trước. Khi cần đào sâu, mở “Học thêm”.</p><nav class="kv-outline" aria-label="Nội dung bài học">${core.map(x=>outlineButton(x.s,x.i)).join('')}${extra.length?`<div class="kv-outline-extra-v4" id="kvOutlineExtra"><button class="kv-outline-extra-toggle-v4" type="button" data-extra-toggle aria-expanded="false"><span>HỌC THÊM</span><span>${extra.length} phần nâng cao ▾</span></button><div class="kv-outline-extra-list-v4">${extra.map(x=>outlineButton(x.s,x.i)).join('')}</div></div>`:''}</nav><div class="kv-side-progress"><span>Đang học</span><strong id="kvSectionProgress">1 / ${sections.length}</strong></div>${module?`<a class="lp-back-module-v2" href="${P.moduleUrl(module.id)}">← Danh sách bài trong module</a>`:''}`;
    $('kvSidebar').addEventListener('click',e=>{const toggle=e.target.closest('[data-extra-toggle]');if(toggle){const box=$('kvOutlineExtra');const open=!box?.classList.contains('open');box?.classList.toggle('open',open);toggle.setAttribute('aria-expanded',open?'true':'false');return}const b=e.target.closest('[data-outline]');if(b)activateSection(Number(b.dataset.outline),{scroll:true,updateHash:true})});
  }

  function setSidebarActive(index){
    document.querySelectorAll('[data-outline]').forEach(b=>{const active=Number(b.dataset.outline)===index;b.classList.toggle('active',active);b.setAttribute('aria-current',active?'true':'false')});
    if(currentLesson?.sections?.[index]?.kind==='extension'){
      const box=$('kvOutlineExtra'),toggle=box?.querySelector('[data-extra-toggle]');box?.classList.add('open');toggle?.setAttribute('aria-expanded','true');
    }
    const p=$('kvSectionProgress');if(p&&currentLesson)p.textContent=`${index+1} / ${currentLesson.sections.length}`;
  }
  function updateSectionHash(index){const target=`#sec-${index+1}`;if(location.hash!==target)history.replaceState(null,'',`${location.pathname}${location.search}${target}`)}
  function scrollContentToTop(){const t=$('kvSections');if(!t)return;const mobile=window.matchMedia&&window.matchMedia('(max-width:820px)').matches;window.scrollTo({top:Math.max(0,t.getBoundingClientRect().top+window.pageYOffset-(mobile?132:88)),behavior:'smooth'})}
  function activateSection(index,{scroll=false,updateHash=false}={}){if(!currentLesson)return;const next=Math.max(0,Math.min(currentLesson.sections.length-1,Number(index)||0));currentSectionIndex=next;$('kvSections').innerHTML=renderSection(currentLesson.sections[next],next);setSidebarActive(next);bindQuestions(currentLesson,next);try{localStorage.setItem(SECTION_KEY,JSON.stringify({lesson:currentLesson.id,section:next}))}catch{}if(updateHash)updateSectionHash(next);if(scroll)requestAnimationFrame(scrollContentToTop)}

  function renderNotFound(){const page=$('kvPage');page.innerHTML=`<section class="kv-not-found"><h1>Không tìm thấy bài học</h1><p>Bài này không còn trong lộ trình Excel A–Z hiện tại.</p><a href="skill-map.html">Về Học Excel →</a></section>`}
  function boot(){
    if(!lessons.length){renderNotFound();return}const lesson=byId.get(requestedId());if(!lesson){renderNotFound();return}currentLesson=lesson;currentSectionIndex=sectionFromHash(lesson);localStorage.setItem(LAST_KEY,lesson.id);const module=moduleFor(lesson);if(module)sessionStorage.setItem('avp_learning_module_return',module.id);document.title=`Bài ${String(lesson.order).padStart(2,'0')} · ${lesson.title} | Anh Văn Phòng`;renderCourseNav(lesson);renderHero(lesson);renderIntro(lesson);renderSidebar(lesson);activateSection(currentSectionIndex,{scroll:false,updateHash:false});window.addEventListener('hashchange',()=>{const next=sectionFromHash(lesson);if(next!==currentSectionIndex)activateSection(next,{scroll:true,updateHash:false})});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
