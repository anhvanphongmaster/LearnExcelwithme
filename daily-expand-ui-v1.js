(() => {
  'use strict';
  const E=window.AVPDailyExpand,C=window.AVPLearningCoach;
  if(!C||!E||!Array.isArray(E.lessons)||!E.lessons.length)return;
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const names={basic:'Cơ bản',intermediate:'Trung cấp',advanced:'Nâng cao',case:'Case thực tế'};
  function date(){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}catch(_){return C.localDate()}}
  function offset(a,b){const x=String(a).split('-').map(Number),y=String(b).split('-').map(Number);return Math.max(0,Math.floor((Date.UTC(y[0],y[1]-1,y[2])-Date.UTC(x[0],x[1]-1,x[2]))/86400000))}
  function pickToday(){
    const d=date(),row=C.getDaily()[d]||{},start=(window.AVPDailyStart&&window.AVPDailyStart.getDailyStartDate())||E.startDate||d;
    const lesson=E.byId[row.lessonId]||E.lessons[offset(start,d)%E.lessons.length];
    if(!row.lessonId)C.markDaily(d,{lessonId:lesson.id,assignedAt:new Date().toISOString(),dailyVersion:'one-lesson-v1'});
    return {date:d,lesson};
  }
  function renderToday(){
    const host=$('todayHost');if(!host)return;
    const a=pickToday(),row=C.getDaily()[a.date]||{},done=!!((row.itemDone||{})[a.lesson.id]),tried=!!((row.itemTried||{})[a.lesson.id]);
    const q=(window.AVPDailyConfirm||{})[a.lesson.id];
    const it=a.lesson;
    host.innerHTML='<article class="dx-hero"><div class="dx-ribbon"><span>BÀI HỌC HÔM NAY · '+a.date.split('-').reverse().join('/')+'</span><b>01 bài / ngày</b></div><div class="dx-hero-body"><div><span class="lc-label">ĐỀ XUẤT HỌC TẬP</span><h2>Một bài Excel, học đến nơi đến chốn.</h2><p>Mỗi ngày một nội dung theo lộ trình. Làm bài thực hành và xác nhận kiến thức một lần.</p></div><span class="lc-pill strong">'+(done?'Đã hoàn thành':tried?'Đã xác nhận':'Chưa hoàn thành')+'</span></div></article><article class="dx-card dx-single-card" data-level="'+esc(it.level)+'"><header><span>'+esc(names[it.level]||it.level)+' · '+Number(it.minutes||0)+' phút</span><b>'+(done?'Đã hoàn thành':'Bài đề xuất')+'</b></header><h2>'+esc(it.title)+'</h2><p>'+esc(it.outcome)+'</p><h3>Cách thực hiện</h3><ol>'+(it.steps||[]).map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol><p class="dx-tasks"><strong>Yêu cầu thực hành:</strong> '+(it.tasks||[]).map(esc).join(' ')+'</p><div class="dx-actions"><a class="lc-btn solid" href="'+esc(it.file)+'" download>Tải file thực hành</a><button type="button" class="lc-btn" data-dx-done="'+esc(it.id)+'" '+((done||tried)?'disabled':'')+'>'+(done?'Đã nhận XP':tried?'Đã xác nhận':'Kiểm tra và hoàn thành')+'</button></div><p class="dx-single-note">'+(q?'Trả lời đúng câu xác nhận để nhận 10 XP.':'Bài này đang chờ bổ sung câu xác nhận.')+'</p></article><section class="lc-focus dx-one-focus"><span class="lc-label">NGUYÊN TẮC TÍCH ĐIỂM</span><h2>Chỉ nhận điểm khi hoàn thành thật.</h2><p>10 XP cho bài Hôm nay khi trả lời đúng câu xác nhận. Mở trang, tải file hoặc đăng nhập không tự phát sinh XP.</p><p id="dxExpHud" aria-live="polite"></p></section>';
    if(window.AVPDailyExp&&window.AVPDailyExp.paintHud)window.AVPDailyExp.paintHud();
  }
  function fillOuter(){
    const t=$('lhTodayTitle'),m=$('lhTodayMeta'),c=$('lhTodayCta'),a=$('lhTodayCard');if(!t||!m)return false;
    const x=pickToday();t.textContent='Bài học hôm nay: '+x.lesson.title;m.textContent=x.date+' · '+(names[x.lesson.level]||'Excel')+' · '+x.lesson.minutes+' phút';
    if(c)c.textContent='Mở bài hôm nay →';if(a)a.href='learning-coach.html';return true;
  }
  function boot(){
    document.querySelectorAll('.lc-tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.lc-tab').forEach(x=>x.classList.toggle('is-active',x===b));document.querySelectorAll('.lc-panel').forEach(x=>x.classList.toggle('is-active',x.id==='panel-'+b.dataset.panel))}));
    renderToday();fillOuter();window.AVPDailyExpandUI={pickToday,renderToday,vnDate:date,fillOuter};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();