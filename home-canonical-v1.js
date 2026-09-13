/* AVP Home Canonical V1 — one final DOM state, no visual legacy flash. */
(() => {
  'use strict';
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(page!=='index.html' || window.__AVP_HOME_CANONICAL_V1__) return;
  window.__AVP_HOME_CANONICAL_V1__=true;

  const modules=[
    ['01','FOUNDATION','Nền tảng Excel','Hiểu file, nhập liệu, định dạng, công thức và cấu trúc bảng trước khi đi sâu.','f01-excel-workspace',6,'green'],
    ['02','DATA CONTROL','Dữ liệu & Làm sạch','Lọc, tìm, chuẩn hóa text, chặn nhập sai và kiểm soát duplicate/blank/error.','d07-sort-filter',5,'teal'],
    ['03','FORMULA & LOOKUP','Công thức & Tra cứu','Logic, tổng hợp điều kiện, lookup, ngày tháng, công thức nâng cao và Dynamic Array.','s07-logic',6,'blue'],
    ['04','ANALYSIS','Phân tích & Báo cáo','Excel Table, PivotTable, KPI, đối chiếu số và bàn giao báo cáo.','a13-excel-table',5,'purple'],
    ['05','VISUAL REPORT','Dashboard & Trực quan hóa','Chart đúng mục đích, KPI card, Slicer/Timeline và dashboard tương tác dễ dùng.','a16-charts-pareto',5,'rose'],
    ['06','POWER QUERY','Power Query','Kết nối nguồn, làm sạch, schema/type, Append/Merge, nhiều file và Refresh bền vững.','pq28-import-sources',6,'sand'],
    ['07','AUTOMATION CODE','Macro / VBA & Tối ưu file','Record Macro, object model, If/Loop, xử lý lỗi, bảo mật và giảm lag workbook.','x23-macro-vba',4,'orange'],
    ['08','WORKFLOW & CASE','Workflow & Case thực chiến','Chọn đúng công cụ và nối Input → Transform → Calculate → Report → Validate → Deliver.','x24-automation-workflow',5,'indigo']
  ];

  const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const gridHTML=()=>modules.map(m=>
    '<a class="home-platform-module-v1 tone-'+esc(m[6])+'" href="knowledge.html?lesson='+encodeURIComponent(m[4])+'">'+
      '<span class="home-platform-no-v1">'+esc(m[0])+'</span>'+
      '<span class="home-platform-copy-v1"><small>'+esc(m[1])+'</small><strong>'+esc(m[2])+'</strong><em>'+esc(m[3])+'</em><b>'+m[5]+' bài · Bắt đầu →</b></span>'+
    '</a>'
  ).join('');

  function render(){
    const shell=document.querySelector('.home-path-inner');
    const grid=shell?.querySelector('.home-path-grid');
    if(!shell || !grid) return false;

    const title=shell.querySelector(':scope > h2');
    const desc=shell.querySelector(':scope > p');
    if(title) title.textContent='Nền tảng Excel A–Z';
    if(desc) desc.textContent='8 module · 42 bài. Chọn theo nhóm công việc; bên trong là danh sách bài rõ ràng và luôn có đường quay lại.';

    grid.className='home-path-grid home-platform-grid-v1';
    if(grid.querySelectorAll('.home-platform-module-v1').length!==8 || grid.dataset.canonicalHome!=='1'){
      grid.innerHTML=gridHTML();
    }
    grid.dataset.canonicalHome='1';

    const learn=document.querySelector('.top-simple-nav [data-avp-nav="learn"]');
    if(learn){ learn.href='learning-coach.html'; learn.setAttribute('aria-label','Học Excel hôm nay'); }

    const teaser=document.getElementById('avpScrollToPath');
    if(teaser){
      teaser.dataset.onePath='coach2';
      const t=teaser.querySelector('.avp-tease-title');
      const p=document.getElementById('avpTeasePreview');
      if(t) t.textContent='Học hôm nay →';
      if(p) p.textContent='Web tự chọn bài cần học · luyện ngắn · ôn lỗi';
    }

    const arena=document.querySelector('a.home-more-race[href*="excel-race.html"]');
    if(arena){
      arena.classList.add('avp-arena-home');
      const icon=arena.querySelector(':scope > span');
      const titleEl=arena.querySelector('strong');
      const small=arena.querySelector('small');
      if(icon) icon.textContent='⚡';
      if(titleEl) titleEl.textContent='Excel Arena';
      if(small) small.textContent='Bạn nhớ Excel đến đâu khi thời gian đang chạy?';
      if(!arena.querySelector('.avp-arena-home-meta')){
        const meta=document.createElement('span'); meta.className='avp-arena-home-meta'; meta.textContent='Học · Rank · 14 chủ đề'; arena.appendChild(meta);
      }
      if(!arena.querySelector('.avp-arena-home-badge')){
        const badge=document.createElement('span'); badge.className='avp-arena-home-badge'; badge.textContent='NEW GAME'; arena.appendChild(badge);
      }
    }

    const more=shell.querySelector('.home-path-more');
    if(more) more.style.marginTop='18px';
    document.body.classList.add('home-canonical-ready');
    return true;
  }

  window.__avpHomeAZV4=true;
  window.__avpArenaHomeCard=true;

  function boot(){
    if(!render()){
      requestAnimationFrame(boot);
      return;
    }
    const shell=document.querySelector('.home-path-inner');
    if(!shell || typeof MutationObserver==='undefined') return;
    let queued=false;
    const observer=new MutationObserver(()=>{
      if(queued) return;
      queued=true;
      queueMicrotask(()=>{ queued=false; render(); });
    });
    observer.observe(shell,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','href']});
    setTimeout(()=>{ render(); observer.disconnect(); },2400);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
