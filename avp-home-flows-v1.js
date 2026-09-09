/*! AVP Home Flows V1 — five clear learner routes + one shared guide. */
(function(w,d){
  'use strict';
  if(w.__AVP_HOME_FLOWS_V1__)return;w.__AVP_HOME_FLOWS_V1__=true;
  const FLOWS=[
    {n:'01',icon:'📘',tone:'green',tag:'KNOWLEDGE',title:'Kiến thức Excel',desc:'24 bài từ nền tảng đến Power Query, VBA, Data Model và workflow. Mọi bài đều mở.',meta:'24 bài · 4 chặng',href:'skill-map.html',cta:'Mở cây kiến thức'},
    {n:'02',icon:'▶️',tone:'blue',tag:'YOUTUBE PROJECT',title:'Học theo YouTube',desc:'Video dài là nội dung gốc. Học theo project và dùng đúng file/tài nguyên đi kèm.',meta:'Video → thao tác → payoff',href:'practice-youtube.html',cta:'Mở YouTube Project'},
    {n:'03',icon:'✍️',tone:'amber',tag:'HOMEWORK',title:'Bài tập về nhà',desc:'Bài ngắn 5–15 phút tập trung phần khó hoặc dễ sai. Bí thì xem Hint, video sau sẽ chữa.',meta:'Làm → Hint → Video chữa',href:'homework.html',cta:'Mở Homework'},
    {n:'04',icon:'🧪',tone:'purple',tag:'AUTO GRADING',title:'Bài tập tự chấm',desc:'Luyện bài có tiêu chí rõ, nộp file Excel và nhận kết quả chấm để biết phần cần sửa.',meta:'Làm → Nộp → Chấm',href:'practice-grader.html',cta:'Mở Auto Grading'},
    {n:'05',icon:'◆',tone:'sand',tag:'PROFESSIONAL TRACK',title:'Case chuyên nghiệp',desc:'Case nghiệp vụ sâu cho người đã đủ nền tảng, có Auto-Grader, feedback và tiến độ mở khóa.',meta:'Case → Submit → Grader → Progress',href:'professional-access.html?intro=1',cta:'Kiểm tra Professional'}
  ];
  const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function card(x){return `<article class="home-path-card avp-home-flow-card avp-home-flow-${x.tone}" data-home-flow="${x.n}"><div class="avp-home-flow-top"><span class="avp-home-flow-num">${x.n}</span><span class="avp-home-flow-icon" aria-hidden="true">${x.icon}</span></div><span class="avp-home-flow-tag">${esc(x.tag)}</span><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p><small>${esc(x.meta)}</small><a href="${esc(x.href)}">${esc(x.cta)} →</a></article>`}
  function render(){
    const section=d.getElementById('ky-nang-excel')||d.querySelector('.home-path');if(!section)return false;
    const inner=section.querySelector('.home-path-inner')||section;
    const h2=inner.querySelector(':scope > h2')||inner.querySelector('h2');if(h2)h2.textContent='5 luồng học Excel';
    const intro=inner.querySelector(':scope > p');if(intro)intro.textContent='Chọn đúng mục tiêu hiện tại: học kiến thức, theo video, làm Homework, tự chấm hoặc vào Case Professional. Hướng dẫn bài tập được dùng chung, không tách thành một luồng riêng.';
    const grid=section.querySelector('.home-path-grid');if(!grid)return false;
    grid.className='home-path-grid avp-home-flow-grid';grid.innerHTML=FLOWS.map(card).join('');
    let guide=section.querySelector('.avp-home-shared-guide');
    if(!guide){guide=d.createElement('div');guide.className='avp-home-shared-guide';grid.insertAdjacentElement('afterend',guide)}
    guide.innerHTML='<div><span>DÙNG CHUNG CHO CÁC LUỒNG THỰC HÀNH</span><strong>📖 Hướng dẫn bài tập</strong><p>Khi chưa biết bắt đầu từ đâu, mở hướng dẫn để chọn cách tiếp cận và kiến thức cần dùng.</p></div><a href="practice-guides.html">Mở hướng dẫn →</a>';
    section.dataset.homeFlows='5';
    const tease=d.querySelector('#avpScrollToPath .avp-tease-title');if(tease)tease.innerHTML='<span class="avp-tease-chevs" aria-hidden="true"><span>▾</span><span>▾</span><span>▾</span></span> 5 luồng học · Bảng xếp hạng';
    return true;
  }
  function boot(){render();setTimeout(render,250);setTimeout(render,900)}
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})(window,document);
