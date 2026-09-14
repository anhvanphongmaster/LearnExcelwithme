(() => {
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const viDate=d=>{const [y,m,day]=String(d).split('-');return `${day}/${m}/${y}`};
  const WHY={
    'f01-excel-workspace':'Biết đứng ở đâu trong file trước khi gõ công thức.',
    'f02-data-entry-types':'Nhập đúng kiểu dữ liệu để SUM/lọc không bị sai thầm.',
    'f04-formulas-references':'Khóa ô đúng cách khi kéo công thức.',
    'f05-core-functions':'Chọn được COUNT / COUNTA / SUM đúng việc.',
    'd07-sort-filter':'Lọc được đúng tập dòng cần xem, không xóa dữ liệu.',
    'd08-find-replace':'Sửa hàng loạt mà không làm hỏng cột khác.',
    's08-conditional-aggregation':'Cộng theo nhiều điều kiện thay vì lọc tay.',
    's09-lookup':'Lấy đúng giá trị theo mã, không copy dán.',
    'a13-excel-table':'Bảng tự nở khi thêm dòng, công thức không lệch.',
    'a14-pivottable':'Gom 50.000 dòng thành báo cáo trong vài phút.',
    'a19-reconciliation':'Đối chiếu số trước khi gửi, tránh báo cáo đẹp nhưng sai.',
    'v23-kpi-cards':'Đặt số chính lên đầu, người xem đọc được trong 30 giây.',
    'v24-slicer-timeline':'Lọc dashboard không sửa công thức.',
    'x22-power-query-multi-source':'Gộp nhiều file rồi Refresh, không copy/paste.',
    'x23-macro-vba':'Ghi lại thao tác lặp thành macro an toàn.',
    'x24-automation-workflow':'Xếp đúng thứ tự Input → Tính → Báo cáo → Đối chiếu.'
  };
  function whyOf(id, moduleTitle){
    return WHY[id] || (`Hôm nay chỉ học một kỹ năng trong ${moduleTitle||'lộ trình'}, làm xong rồi dừng.`);
  }
  function peekNext(C, todayId){
    const seq=(window.AVPLearningPlatform?.lessonSequence||[]).slice();
    if(!seq.length) return null;
    const used=new Set();
    const all=C.getDaily?C.getDaily():{};
    Object.keys(all).forEach(d=>{if(all[d]?.lessonId) used.add(all[d].lessonId)});
    const next=seq.find(id=>id!==todayId && !used.has(id)) || seq.find(id=>id!==todayId);
    if(!next) return null;
    const title=C.lessonTitle?C.lessonTitle(next):next;
    const module=window.AVPLearningPlatform?.moduleForLesson?.(next);
    return {id:next,title,moduleTitle:module?.title||''};
  }

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
    const nextErr=mistakes[0];
    const completeCount=(lessonDone?1:0)+(daily.practiceDone?1:0)+((!nextErr||daily.mistakeReviewed)?1:0);
    const order=String(today.order||1).padStart(2,'0');
    const profile=C.getProfile&&C.getProfile();
    const tomorrow=peekNext(C, today.lessonId);
    host.innerHTML=`<article class="lc-today-card" aria-label="Bài học hôm nay">
      <div class="lc-today-ribbon"><span>Bài hôm nay · ${esc(viDate(today.date))}</span><b>Ngày ${today.uniqueDays}/${today.total} · không lặp</b></div>
      <div class="lc-today-body">
        <div class="lc-today-copy">
          <span class="lc-label">CỦA RIÊNG BẠN HÔM NAY</span>
          <h2>Bài ${order}. ${esc(today.title)}</h2>
          <p>${today.moduleTitle?esc(today.moduleTitle)+' · ':''}Mỗi người một lịch. Ngày mai đổi bài khác.</p>
        </div>
        <div class="lc-today-side">
          <span class="lc-pill strong">${completeCount} / 3 việc</span>
          <span class="lc-pill">${today.cycle>1?'Vòng 2':'Vòng 1'}</span>
        </div>
      </div>
      <div class="lc-why"><strong>Vì sao hôm nay học bài này</strong><p>${esc(whyOf(today.lessonId, today.moduleTitle))}</p></div>
      <div class="lc-takeaway"><strong>Xong bài thì làm được gì</strong><p>Mở được file, làm đúng thao tác chính của bài, và giải thích được vì sao chọn cách đó — không cần học thêm bài khác trong ngày.</p></div>
      <div class="lc-today-actions">
        <a class="lc-btn solid" id="openTodayLesson" href="${C.lessonUrl(today.lessonId)}">Mở bài hôm nay →</a>
        <button class="lc-btn" id="markTodayLesson" type="button" ${lessonDone?'disabled':''}>${lessonDone?'Đã học bài này':'Đánh dấu đã học'}</button>
      </div>
    </article>
    <section class="lc-focus">
      <div class="lc-focus-head"><div>
        <span class="lc-label">3 VIỆC · KHOẢNG 15 PHÚT</span>
        <h2>Xong là đủ cho hôm nay</h2>
        <p>Đọc bài → luyện 3 câu → ôn 1 lỗi nếu có. Không mở thêm luồng khác.</p>
      </div></div>
      <div class="lc-plan">
        <div class="lc-step"><span>1</span><div><strong>${lessonDone?'Đã học bài hôm nay':'Học đúng 1 bài'}</strong><small>${esc(today.title)}</small></div><a href="${C.lessonUrl(today.lessonId)}">${lessonDone?'Mở lại':'Mở bài'} →</a></div>
        <div class="lc-step"><span>2</span><div><strong>Luyện 3 câu</strong><small>${daily.practiceDone?'Đã xong hôm nay.':'Sai sẽ vào Sổ lỗi.'}</small></div><button id="startDailyKeep" type="button">Luyện 3 câu</button></div>
        <div class="lc-step"><span>3</span><div><strong>Ôn 1 lỗi cũ</strong><small>${nextErr?'Có lỗi đang chờ ôn.':'Chưa có lỗi cần ôn.'}</small></div>${nextErr?'<button id="openMistakeKeep" type="button">Ôn lỗi</button>':'<span></span>'}</div>
      </div>
      <div id="dailyHost"></div>
      ${tomorrow?`<div class="lc-preview"><strong>Ngày mai (chưa mở)</strong><p>${esc(tomorrow.title)}${tomorrow.moduleTitle?' · '+esc(tomorrow.moduleTitle):''}. Hôm nay không cần học trước.</p></div>`:''}
      <div class="lc-secondary-links">${profile?'':'<button type="button" id="goDiagnosticSoft">Kiểm tra 5 phút để ưu tiên nhóm yếu</button>'}<a href="skill-map.html">Tự chọn trong 42 bài</a><a href="practice-video.html">Khu thực hành</a></div>
    </section>`;
    document.getElementById('openTodayLesson')?.addEventListener('click',()=>C.markDaily(today.date,{lessonOpened:true}));
    document.getElementById('markTodayLesson')?.addEventListener('click',()=>{
      C.markDaily(today.date,{lessonDone:true});
      try{const raw=JSON.parse(localStorage.getItem('avp_platform_completed_v2')||'[]');const list=Array.isArray(raw)?raw:[];if(!list.includes(today.lessonId)){list.push(today.lessonId);localStorage.setItem('avp_platform_completed_v2',JSON.stringify(list))}}catch(_){}
      paint();
    });
    document.getElementById('startDailyKeep')?.addEventListener('click',()=>{
      const tab=[...document.querySelectorAll('.lc-tab')].find(b=>b.dataset.panel==='diagnostic');
      document.getElementById('startDaily')?.click();
      if(!document.getElementById('dailyHost')?.querySelector('.lc-quiz')) tab?.click();
    });
    document.getElementById('openMistakeKeep')?.addEventListener('click',()=>document.querySelector('.lc-tab[data-panel="mistakes"]')?.click());
    document.getElementById('goDiagnosticSoft')?.addEventListener('click',()=>document.querySelector('.lc-tab[data-panel="diagnostic"]')?.click());
  }

  function boot(){
    paint();
    const host=document.getElementById('todayHost');
    if(!host||host.dataset.dailyWatch==='1') return;
    host.dataset.dailyWatch='1';
    const obs=new MutationObserver(()=>{if(!host.querySelector('.lc-today-card')) paint()});
    obs.observe(host,{childList:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});
  else setTimeout(boot,0);
})();
