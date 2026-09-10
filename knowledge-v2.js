(() => {
  'use strict';

  const ZONES={
    foundation:{id:'foundation',number:'01',label:'FOUNDATION',name:'Nền tảng Excel',short:'Từ số 0 đến bảng dữ liệu đúng cấu trúc.'},
    skills:{id:'skills',number:'02',label:'DATA SKILLS',name:'Dữ liệu & Công thức',short:'Logic, tổng hợp, lookup, text, date và cleaning.'},
    analysis:{id:'analysis',number:'03',label:'ANALYSIS',name:'Phân tích & Báo cáo',short:'Table, Pivot, KPI, chart, dashboard và handover.'},
    advanced:{id:'advanced',number:'04',label:'ADVANCED',name:'Nâng cao & Tự động hóa',short:'Formula hiện đại, Power Query, VBA và workflow.'}
  };
  const ZONE_ORDER=['foundation','skills','analysis','advanced'];
  const LAST_KEY='avp_knowledge_last_v2';
  const lessons=(window.AVPKnowledgeLessons||[]).slice().sort((a,b)=>a.order-b.order);
  const byId=new Map(lessons.map(x=>[x.id,x]));
  const firstByZone=new Map(ZONE_ORDER.map(zone=>[zone,lessons.find(x=>x.zone===zone)]));
  const $=id=>document.getElementById(id);
  let currentLesson=null;
  let currentSectionIndex=0;

  function esc(value){
    return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function urlFor(id){return `knowledge.html?lesson=${encodeURIComponent(id)}`}
  function requestedId(){return new URLSearchParams(location.search).get('lesson')||lessons[0]?.id||''}
  function kindLabel(kind){return kind==='extension'?'MỞ RỘNG':'CỐT LÕI'}
  function sectionFromHash(lesson){
    const match=String(location.hash||'').match(/^#sec-(\d+)$/);
    if(!match)return 0;
    return Math.max(0,Math.min((lesson.sections?.length||1)-1,Number(match[1])-1));
  }

  function renderCourseNav(lesson){
    const host=$('kvCourseNav');
    if(!host)return;
    const idx=lessons.findIndex(x=>x.id===lesson.id);
    const prev=idx>0?lessons[idx-1]:null;
    const next=idx<lessons.length-1?lessons[idx+1]:null;
    const left=prev
      ? `<a class="kv-course-edge prev" href="${urlFor(prev.id)}"><small>← BÀI TRƯỚC</small><strong>${String(prev.order).padStart(2,'0')} · ${esc(prev.title)}</strong></a>`
      : `<a class="kv-course-edge prev is-boundary" href="index.html"><small>← TRANG CHỦ</small><strong>Về Trang chủ</strong></a>`;
    const right=next
      ? `<a class="kv-course-edge next" href="${urlFor(next.id)}"><small>BÀI TIẾP THEO →</small><strong>${String(next.order).padStart(2,'0')} · ${esc(next.title)}</strong></a>`
      : `<a class="kv-course-edge next is-boundary" href="practice-video.html"><small>ĐẾN THỰC HÀNH →</small><strong>Chọn 5 luồng thực hành</strong></a>`;
    const stages=ZONE_ORDER.map(zoneId=>{
      const zone=ZONES[zoneId];
      const first=firstByZone.get(zoneId);
      const href=first?urlFor(first.id):'#';
      return `<a class="kv-stage-tab ${zoneId===lesson.zone?'active':''}" href="${href}" ${zoneId===lesson.zone?'aria-current="step"':''}><span>${zone.number} · ${esc(zone.label)}</span><strong>${esc(zone.name)}</strong></a>`;
    }).join('');
    host.innerHTML=`${left}<div class="kv-stage-tabs" aria-label="4 khối kiến thức">${stages}</div>${right}`;
  }

  function renderHero(lesson){
    const zone=ZONES[lesson.zone];
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
        <div class="kv-hero-card"><span>CÁCH ĐỌC BÀI</span><strong>Chọn nội dung ở menu bên trái</strong><p>Mỗi lần chỉ hiện một nội dung ở bên phải. Menu được ghim khi cuộn để bạn đổi phần mà không phải kéo qua một trang quá dài.</p></div>
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
      <div class="kv-prereq"><span>Kiến thức nên biết trước:</span>${prereq.length?prereq.map(x=>`<em class="kv-prereq-item">Bài ${String(x.order).padStart(2,'0')} · ${esc(x.title)}</em>`).join(''):'<em>Không yêu cầu — có thể bắt đầu từ đây.</em>'}</div>`;
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

  function bindQuestions(lesson,sectionIndex){
    document.querySelectorAll('.kv-question').forEach(card=>{
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
    $('kvSidebar').innerHTML=`
      <span class="kv-side-label">${esc(zone.number)} · ${esc(zone.label)}</span>
      <h2 class="kv-side-title">${esc(lesson.title)}</h2>
      <nav class="kv-outline" aria-label="Nội dung bài học">${lesson.sections.map((s,i)=>`<button type="button" data-outline="${i}" aria-current="${i===0?'true':'false'}"><span class="kv-outline-num">${String(i+1).padStart(2,'0')}</span><span>${esc(s.title)}</span></button>`).join('')}</nav>
      <div class="kv-side-progress"><span>Đang ở nội dung</span><strong id="kvSectionProgress">1 / ${lesson.sections.length}</strong></div>`;
    $('kvSidebar').addEventListener('click',event=>{
      const button=event.target.closest('[data-outline]');
      if(!button)return;
      activateSection(Number(button.dataset.outline),{scroll:true,updateHash:true});
    });
  }

  function setSidebarActive(index){
    document.querySelectorAll('[data-outline]').forEach((button,i)=>{
      const active=i===index;
      button.classList.toggle('active',active);
      button.setAttribute('aria-current',active?'true':'false');
    });
    const progress=$('kvSectionProgress');
    if(progress&&currentLesson)progress.textContent=`${index+1} / ${currentLesson.sections.length}`;
  }

  function updateSectionHash(index){
    const target=`#sec-${index+1}`;
    if(location.hash===target)return;
    history.replaceState(null,'',`${location.pathname}${location.search}${target}`);
  }

  function scrollContentToTop(){
    const target=$('kvSections');
    if(!target)return;
    const mobile=window.matchMedia&&window.matchMedia('(max-width:820px)').matches;
    const offset=mobile?132:88;
    const top=Math.max(0,target.getBoundingClientRect().top+window.pageYOffset-offset);
    window.scrollTo({top,behavior:'smooth'});
  }

  function activateSection(index,{scroll=false,updateHash=false}={}){
    if(!currentLesson)return;
    const max=Math.max(0,currentLesson.sections.length-1);
    const next=Math.max(0,Math.min(max,Number(index)||0));
    currentSectionIndex=next;
    $('kvSections').innerHTML=renderSection(currentLesson.sections[next],next);
    setSidebarActive(next);
    bindQuestions(currentLesson,next);
    if(updateHash)updateSectionHash(next);
    if(scroll)requestAnimationFrame(scrollContentToTop);
  }

  function renderNotFound(){
    const page=$('kvPage');
    page.innerHTML=`<section class="kv-not-found"><h1>Không tìm thấy bài học</h1><p>Liên kết này không còn thuộc cây Kiến thức Excel V2.</p><a href="skill-map.html">Về lộ trình 24 bài →</a></section>`;
  }

  function boot(){
    if(!lessons.length){renderNotFound();return}
    const lesson=byId.get(requestedId());
    if(!lesson){renderNotFound();return}
    currentLesson=lesson;
    currentSectionIndex=sectionFromHash(lesson);
    localStorage.setItem(LAST_KEY,lesson.id);
    document.title=`Bài ${String(lesson.order).padStart(2,'0')} · ${lesson.title} | Anh Văn Phòng`;
    renderCourseNav(lesson);
    renderHero(lesson);
    renderIntro(lesson);
    renderSidebar(lesson);
    activateSection(currentSectionIndex,{scroll:false,updateHash:false});
    window.addEventListener('hashchange',()=>{
      const next=sectionFromHash(lesson);
      if(next!==currentSectionIndex)activateSection(next,{scroll:true,updateHash:false});
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
