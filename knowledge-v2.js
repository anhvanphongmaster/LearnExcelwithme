(() => {
  'use strict';

  const ZONES={
    foundation:{id:'foundation',number:'01',label:'FOUNDATION',name:'Nền tảng Excel',short:'Từ số 0 đến bảng dữ liệu đúng cấu trúc.'},
    skills:{id:'skills',number:'02',label:'DATA SKILLS',name:'Dữ liệu & Công thức',short:'Logic, tổng hợp, lookup, text, date và cleaning.'},
    analysis:{id:'analysis',number:'03',label:'ANALYSIS',name:'Phân tích & Báo cáo',short:'Table, Pivot, KPI, chart, dashboard và handover.'},
    advanced:{id:'advanced',number:'04',label:'ADVANCED',name:'Nâng cao & Tự động hóa',short:'Formula hiện đại, Power Query, VBA và workflow.'}
  };
  const LAST_KEY='avp_knowledge_last_v2';
  const lessons=(window.AVPKnowledgeLessons||[]).slice().sort((a,b)=>a.order-b.order);
  const byId=new Map(lessons.map(x=>[x.id,x]));
  const $=id=>document.getElementById(id);

  function esc(value){
    return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function urlFor(id){return `knowledge.html?lesson=${encodeURIComponent(id)}`}
  function requestedId(){return new URLSearchParams(location.search).get('lesson')||lessons[0]?.id||''}
  function kindLabel(kind){return kind==='extension'?'MỞ RỘNG':'CỐT LÕI'}

  function renderHero(lesson){
    const zone=ZONES[lesson.zone];
    $('kvBreadcrumb').innerHTML=`<a href="skill-map.html">Kiến thức Excel</a><i>/</i><a href="skill-map.html#zone-${esc(zone.id)}">${esc(zone.name)}</a><i>/</i><b>Bài ${String(lesson.order).padStart(2,'0')}</b>`;
    $('kvHero').innerHTML=`
      <div>
        <div class="kv-eyebrow">
          <span class="kv-chip">${esc(zone.number)} · ${esc(zone.label)}</span>
          <span class="kv-chip">Bài ${String(lesson.order).padStart(2,'0')} / ${lessons.length}</span>
          <span class="kv-chip">${esc(lesson.duration)}</span>
          <span class="kv-chip">${esc(lesson.version)}</span>
        </div>
        <h1>${esc(lesson.title)}</h1>
        <p class="kv-hero-lead">${esc(lesson.hook)}</p>
      </div>
      <div class="kv-hero-side">
        <div class="kv-hero-card"><span>BẠN ĐANG HỌC GÌ?</span><strong>${esc(zone.name)}</strong><p>${esc(zone.short)}</p></div>
        <div class="kv-hero-card"><span>NGUYÊN TẮC HỌC</span><strong>Không khóa đường học</strong><p>Bạn có thể quay lại Skill Map và nhảy tới bất kỳ bài nào phù hợp với trình độ hiện tại.</p></div>
        <div class="kv-hero-card"><span>CÂU HỎI THEO TỪNG PHẦN</span><strong>${lesson.sections.reduce((n,s)=>n+(s.questions?.length||0),0)} câu kiểm tra nhanh</strong><p>Chọn đáp án để xem giải thích ngay. Không có XP, không có nút “đánh dấu đã học”.</p></div>
      </div>`;
  }

  function renderIntro(lesson){
    const prereq=(lesson.prerequisites||[]).map(id=>byId.get(id)).filter(Boolean);
    $('kvIntro').innerHTML=`
      <div class="kv-intro-grid">
        <section class="kv-intro-box"><h2>Bạn sẽ học</h2><ul>${lesson.outcomes.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>
        <section class="kv-intro-box"><h2>Bạn sẽ dùng khi</h2><ul>${lesson.useCases.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>
      </div>
      <div class="kv-prereq"><span>Kiến thức nên biết trước:</span>${prereq.length?prereq.map(x=>`<a href="${urlFor(x.id)}">Bài ${String(x.order).padStart(2,'0')} · ${esc(x.title)}</a>`).join(''):'<em>Không yêu cầu — có thể bắt đầu từ đây.</em>'}</div>`;
  }

  function renderQuestion(q,index){
    return `<article class="kv-question" data-question="${index}">
      <p class="kv-q-text">${index+1}. ${esc(q.q)}</p>
      <div class="kv-options">${q.options.map((option,i)=>`<button class="kv-option" type="button" data-answer="${i}">${String.fromCharCode(65+i)}. ${esc(option)}</button>`).join('')}</div>
      <div class="kv-feedback" aria-live="polite"></div>
    </article>`;
  }

  function renderSection(section,index){
    const qCount=section.questions?.length||0;
    return `<section class="kv-section" id="sec-${index+1}" data-section-index="${index}">
      <div class="kv-section-head">
        <div class="kv-section-index"><span class="kv-section-num">${String(index+1).padStart(2,'0')}</span><h2>${esc(section.title)}</h2></div>
        <span class="kv-kind ${section.kind==='extension'?'extension':'core'}">${kindLabel(section.kind)}</span>
      </div>
      ${section.version?`<span class="kv-version">Phiên bản: ${esc(section.version)}</span>`:''}
      <p class="kv-why"><strong>Vì sao cần học:</strong> ${esc(section.why)}</p>
      <div class="kv-body">${(section.body||[]).map(p=>`<p>${esc(p)}</p>`).join('')}</div>
      ${section.steps?.length?`<ol class="kv-steps">${section.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`:''}
      ${section.example?`<div class="kv-box kv-example"><strong>VÍ DỤ THỰC TẾ</strong>${section.example.formula?`<code class="kv-formula">${esc(section.example.formula)}</code>`:''}<p>${esc(section.example.text||'')}</p></div>`:''}
      ${section.tip?`<div class="kv-box kv-tip"><strong>MẸO / PHÍM TẮT</strong><p>${esc(section.tip)}</p></div>`:''}
      ${section.warning?`<div class="kv-box kv-warning"><strong>CẢNH BÁO / LỖI THƯỜNG GẶP</strong><p>${esc(section.warning)}</p></div>`:''}
      <div class="kv-check"><div class="kv-check-head"><strong>Kiểm tra bạn đã hiểu chưa</strong><span>${qCount} câu · giải thích ngay sau khi chọn</span></div><div class="kv-questions">${(section.questions||[]).map(renderQuestion).join('')}</div></div>
    </section>`;
  }

  function bindQuestions(lesson){
    document.querySelectorAll('.kv-question').forEach(card=>{
      const sectionEl=card.closest('.kv-section');
      const sectionIndex=Number(sectionEl?.dataset.sectionIndex||0);
      const qIndex=Number(card.dataset.question||0);
      const q=lesson.sections[sectionIndex]?.questions?.[qIndex];
      if(!q)return;
      card.querySelectorAll('.kv-option').forEach(button=>{
        button.addEventListener('click',()=>{
          const selected=Number(button.dataset.answer);
          const correct=selected===q.answer;
          card.querySelectorAll('.kv-option').forEach((item,i)=>{
            item.disabled=true;
            item.classList.toggle('correct',i===q.answer);
            item.classList.toggle('wrong',i===selected&&!correct);
          });
          const feedback=card.querySelector('.kv-feedback');
          feedback.className=`kv-feedback show ${correct?'good':'bad'}`;
          feedback.innerHTML=`<b>${correct?'Đúng.':'Chưa đúng.'}</b>${esc(q.explain)}`;
        });
      });
    });
  }

  function renderSidebar(lesson){
    const zone=ZONES[lesson.zone];
    const zoneOrder=['foundation','skills','analysis','advanced'];
    $('kvSidebar').innerHTML=`
      <span class="kv-side-label">${esc(zone.number)} · ${esc(zone.label)}</span>
      <h2 class="kv-side-title">${esc(lesson.title)}</h2>
      <nav class="kv-zone-jump" aria-label="Chuyển chặng">${zoneOrder.map(id=>`<a class="${id===lesson.zone?'active':''}" href="skill-map.html#zone-${id}">${ZONES[id].number} · ${esc(ZONES[id].name.replace(' Excel',''))}</a>`).join('')}</nav>
      <nav class="kv-outline" aria-label="Mục lục bài học">${lesson.sections.map((s,i)=>`<a href="#sec-${i+1}" data-outline="${i}"><span class="kv-outline-num">${String(i+1).padStart(2,'0')}</span><span>${esc(s.title)}</span></a>`).join('')}</nav>
      <div class="kv-side-progress"><span>Đang ở phần</span><strong id="kvSectionProgress">1 / ${lesson.sections.length}</strong></div>`;
  }

  function renderBottomNav(lesson){
    const idx=lessons.findIndex(x=>x.id===lesson.id);
    const prev=idx>0?lessons[idx-1]:null;
    const next=idx<lessons.length-1?lessons[idx+1]:null;
    $('kvBottomNav').innerHTML=`
      ${prev?`<a href="${urlFor(prev.id)}"><small>← BÀI TRƯỚC</small><strong>${String(prev.order).padStart(2,'0')} · ${esc(prev.title)}</strong></a>`:'<a href="skill-map.html"><small>← LỘ TRÌNH</small><strong>Xem 24 bài học</strong></a>'}
      ${next?`<a href="${urlFor(next.id)}"><small>BÀI TIẾP THEO →</small><strong>${String(next.order).padStart(2,'0')} · ${esc(next.title)}</strong></a>`:'<a href="practice-video.html"><small>HOÀN THÀNH KIẾN THỨC →</small><strong>Chuyển sang Thực hành</strong></a>'}`;
  }

  function bindSectionObserver(lesson){
    const outline=[...document.querySelectorAll('[data-outline]')];
    const sections=[...document.querySelectorAll('.kv-section')];
    if(!sections.length)return;
    const setActive=index=>{
      outline.forEach((a,i)=>a.classList.toggle('active',i===index));
      const progress=$('kvSectionProgress');if(progress)progress.textContent=`${index+1} / ${lesson.sections.length}`;
    };
    setActive(0);
    if(!('IntersectionObserver'in window))return;
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];
      if(visible)setActive(Number(visible.target.dataset.sectionIndex||0));
    },{rootMargin:'-18% 0px -68% 0px',threshold:[0,.01]});
    sections.forEach(s=>observer.observe(s));
  }

  function renderNotFound(){
    const page=$('kvPage');
    page.innerHTML=`<section class="kv-not-found"><h1>Không tìm thấy bài học</h1><p>Liên kết này không còn thuộc cây Kiến thức Excel V2.</p><a href="skill-map.html">Về lộ trình 24 bài →</a></section>`;
  }

  function boot(){
    if(!lessons.length){renderNotFound();return}
    const lesson=byId.get(requestedId());
    if(!lesson){renderNotFound();return}
    localStorage.setItem(LAST_KEY,lesson.id);
    document.title=`Bài ${String(lesson.order).padStart(2,'0')} · ${lesson.title} | Anh Văn Phòng`;
    renderHero(lesson);
    renderIntro(lesson);
    renderSidebar(lesson);
    $('kvSections').innerHTML=lesson.sections.map(renderSection).join('');
    renderBottomNav(lesson);
    bindQuestions(lesson);
    bindSectionObserver(lesson);
    if(location.hash){requestAnimationFrame(()=>document.querySelector(location.hash)?.scrollIntoView({block:'start'}))}
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
