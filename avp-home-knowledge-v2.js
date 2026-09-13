/*! AVP Home Knowledge V3 — compact 4-flow entry for the full 42-lesson curriculum. */
(function(w,d){
  'use strict';
  if(w.__AVP_HOME_KNOWLEDGE_V2__)return;
  w.__AVP_HOME_KNOWLEDGE_V2__=true;

  const TRACKS=[
    {id:'foundation-data',number:'01',label:'FOUNDATION + DATA',name:'Nền tảng & Dữ liệu',count:11,tone:'green',icon:'▦',desc:'Hiểu Excel, nhập liệu, cấu trúc bảng, lọc và làm sạch dữ liệu.'},
    {id:'formula-analysis',number:'02',label:'FORMULA + ANALYSIS',name:'Công thức & Phân tích',count:11,tone:'blue',icon:'ƒx',desc:'Logic, lookup, tổng hợp điều kiện, Table, Pivot, KPI và kiểm tra số.'},
    {id:'dashboard-power-query',number:'03',label:'DASHBOARD + POWER QUERY',name:'Dashboard & Power Query',count:11,tone:'purple',icon:'◫',desc:'Biểu đồ, dashboard tương tác và luồng làm sạch/Refresh bằng Power Query.'},
    {id:'automation-cases',number:'04',label:'AUTOMATION + CASE',name:'Tự động hóa & Case',count:9,tone:'sand',icon:'⚙',desc:'Macro/VBA, tối ưu file, chọn công cụ và case end-to-end thực chiến.'}
  ];

  const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function card(track){
    return `<a class="home-path-card avp-home-kv2-card avp-home-kv2-${track.tone}" href="skill-map.html?track=${encodeURIComponent(track.id)}">
      <div class="hp-kv2-cardtop"><span class="hp-kv2-label">${track.number} · ${esc(track.label)}</span><i class="hp-kv2-flowicon" aria-hidden="true">${esc(track.icon)}</i></div>
      <div class="hp-kv2-head"><h3>${esc(track.name)}</h3><p>${esc(track.desc)}</p></div>
      <div class="hp-kv2-more"><span>${track.count} bài</span><b>Mở luồng →</b></div>
    </a>`;
  }

  function ensureMotionCss(){
    let link=d.querySelector('link[data-avp-home-motion-fix]');
    if(link)return;
    link=d.createElement('link');
    link.rel='stylesheet';
    link.href='home-mini-bounce.css?v=20260910-motion3';
    link.dataset.avpHomeMotionFix='1';
    d.head.appendChild(link);
  }

  function syncPracticeCta(){
    const cta=d.querySelector('.avp-practice-hub-cta');
    if(!cta)return;
    const copy=cta.querySelector('.avp-mobile-main-cta-copy');
    const smalls=copy?[...copy.querySelectorAll('small')]:[];
    if(smalls[0])smalls[0].textContent='5 luồng thực hành trong cùng một khu';
    if(smalls[1]){
      smalls[1].textContent='01 TikTok · 02 YouTube · 03 Homework · 04 Tự chấm · 05 Pro';
      smalls[1].style.fontSize='11px';
      smalls[1].style.lineHeight='1.45';
    }
    const badges=cta.querySelector('.avp-practice-hub-badges');
    const needsFiveMotion=badges&&(
      badges.children.length!==5 ||
      !badges.querySelector('.avp-mini-channel-hw') ||
      !badges.querySelector('.avp-mini-channel-pro')
    );
    if(needsFiveMotion){
      badges.innerHTML='<span class="avp-mini-channel avp-mini-channel-tt">♪</span><span class="avp-mini-channel avp-mini-channel-yt">▶</span><span class="avp-mini-channel avp-mini-channel-hw">✎</span><span class="avp-mini-channel avp-mini-channel-grade">✓</span><span class="avp-mini-channel avp-mini-channel-pro">◆</span>';
    }
  }

  function replaceText(){
    syncPracticeCta();
    const section=d.getElementById('ky-nang-excel')||d.querySelector('.home-path');
    if(!section)return false;

    const h2=section.querySelector('.home-path-inner > h2')||section.querySelector('h2');
    if(h2)h2.textContent='Chọn luồng học Excel';

    const intro=section.querySelector('.home-path-inner > p');
    if(intro)intro.textContent='4 luồng · 42 bài. Chọn mục tiêu trước, sau đó cuộn qua từng bài trong cùng một giao diện.';

    const grid=section.querySelector('.home-path-grid');
    if(!grid)return false;
    grid.classList.add('avp-home-kv2-grid');
    grid.innerHTML=TRACKS.map(card).join('');
    section.dataset.knowledgeVersion='3';

    const tease=d.querySelector('#avpScrollToPath .avp-tease-title');
    if(tease)tease.innerHTML='<span class="avp-tease-chevs" aria-hidden="true"><span>▾</span><span>▾</span><span>▾</span></span> Chọn 4 luồng học · 42 bài';
    const preview=d.querySelector('#avpScrollToPath .avp-tease-preview');
    if(preview)preview.textContent='Chọn mục tiêu rồi cuộn qua từng bài';
    return true;
  }

  function boot(){
    ensureMotionCss();
    replaceText();
    setTimeout(replaceText,250);
    setTimeout(replaceText,900);
  }

  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})(window,document);
