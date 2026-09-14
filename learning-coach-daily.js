(() => {
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const viDate=d=>{const [y,m,day]=String(d).split('-');return `${day}/${m}/${y}`};

  function paint(){
    const C=window.AVPLearningCoach;
    const host=document.getElementById('todayHost');
    if(!C||!C.todayLesson||!host) return;
    const today=C.todayLesson();
    const daily=C.getDaily()[today.date]||{};
    let completed=new Set();
    try{const a=JSON.parse(localStorage.getItem('avp_platform_completed_v2')||'[]');completed=new Set(Array.isArray(a)?a:[])}catch(_){}
    const lessonDone=!!today.lessonDone||completed.has(today.lessonId);
    const mistakes=C.unresolvedMistakes?C.unresolvedMistakes():[];
    const next=mistakes[0];
    const completeCount=(lessonDone?1:0)+(daily.practiceDone?1:0)+((!next||daily.mistakeReviewed)?1:0);
    const order=String(today.order||1).padStart(2,'0');
    const profile=C.getProfile&&C.getProfile();
    host.innerHTML=`<article class="lc-today-card" aria-label="Bài học hôm nay">
      <div class="lc-today-ribbon"><span>Bài hôm nay · ${esc(viDate(today.date))}</span><b>Ngày ${today.uniqueDays}/${today.total} · không lặp</b></div>
      <div class="lc-today-body">
        <div class="lc-today-copy">
          <span class="lc-label">CỦA RIÊNG BẠN HÔM NAY</span>
          <h2>Bài ${order}. ${esc(today.title)}</h2>
          <p>${today.moduleTitle?esc(today.moduleTitle)+' · ':''}Mỗi người một lịch riêng. Cùng ngày, người khác nhận bài khác. Không lặp cho đến khi xong ${today.total} bài.</p>
        </div>
        <div class="lc-today-side">
          <span class="lc-pill strong">${completeCount} / 3 việc</span>
          <span class="lc-pill">${today.cycle>1?'Vòng 2':'Vòng 1'}</span>
        </div>
      </div>
      <div class="lc-today-actions">
        <a class="lc-btn solid" id="openTodayLesson" href="${C.lessonUrl(today.lessonId)}">Mở bài hôm nay →</a>
        <button class="lc-btn" id="markTodayLesson" type="button" ${lessonDone?'disabled':''}>${lessonDone?'Đã học bài này':'Đánh dấu đã học'}</button>
      </div>
    </article>
    <section class="lc-focus">
      <div class="lc-focus-head"><div>
        <span class="lc-label">3 VIỆC · KHOẢNG 15 PHÚT</span>
        <h2>Xong là đủ cho hôm nay</h2>
        <p>Học đúng 1 bài được chọn, luyện 3 câu, ôn 1 lỗi nếu có. Ngày mai web đổi bài khác.</p>
      </div></div>
      <div class="lc-plan">
        <div class="lc-step"><span>1</span><div><strong>${lessonDone?'Đã học bài hôm nay':'Học bài được chọn hôm nay'}</strong><small>${esc(today.title)}</small></div><a href="${C.lessonUrl(today.lessonId)}">${lessonDone?'Mở lại':'Mở bài'} →</a></div>
        <div class="lc-step"><span>2</span><div><strong>Luyện 3 câu</strong><small>Dùng nút Luyện ngay bên dưới nếu có, hoặc qua tab Kiểm tra.</small></div><button id="startDailyKeep" type="button">Luyện 3 câu</button></div>
        <div class="lc-step"><span>3</span><div><strong>Ôn 1 lỗi cũ</strong><small>${next?'Có lỗi đang chờ ôn.':'Không có lỗi đang chờ ôn.'}</small></div>${next?'<button id="openMistakeKeep" type="button">Ôn lỗi</button>':'<span></span>'}</div>
      </div>
      <div id="dailyHost"></div>
      <div class="lc-secondary-links">${profile?'':'<button type="button" id="goDiagnosticSoft">Chưa chắc trình độ? Kiểm tra 5 phút</button>'}<a href="skill-map.html">Tự chọn trong 42 bài</a><a href="practice-video.html">Khu thực hành</a></div>
    </section>`;
    document.getElementById('openTodayLesson')?.addEventListener('click',()=>C.markDaily(today.date,{lessonOpened:true}));
    document.getElementById('markTodayLesson')?.addEventListener('click',()=>{
      C.markDaily(today.date,{lessonDone:true});
      try{const raw=JSON.parse(localStorage.getItem('avp_platform_completed_v2')||'[]');const list=Array.isArray(raw)?raw:[];if(!list.includes(today.lessonId)){list.push(today.lessonId);localStorage.setItem('avp_platform_completed_v2',JSON.stringify(list))}}catch(_){}
      paint();
    });
    document.getElementById('startDailyKeep')?.addEventListener('click',()=>{
      document.getElementById('startDaily')?.click();
      if(!document.getElementById('startDaily')){
        const tab=[...document.querySelectorAll('.lc-tab')].find(b=>b.dataset.panel==='diagnostic');
        tab?.click();
      }
    });
    document.getElementById('openMistakeKeep')?.addEventListener('click',()=>{
      document.querySelector('.lc-tab[data-panel="mistakes"]')?.click();
    });
    document.getElementById('goDiagnosticSoft')?.addEventListener('click',()=>{
      document.querySelector('.lc-tab[data-panel="diagnostic"]')?.click();
    });
  }

  function boot(){
    paint();
    const host=document.getElementById('todayHost');
    if(!host||host.dataset.dailyWatch==='1') return;
    host.dataset.dailyWatch='1';
    const obs=new MutationObserver(()=>{
      if(host.querySelector('.lc-today-card')) return;
      paint();
    });
    obs.observe(host,{childList:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});
  else setTimeout(boot,0);
})();
