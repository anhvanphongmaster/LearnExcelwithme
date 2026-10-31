(() => {
  // Single-instance guard: avp-core must never mount the global UI twice.
  if(window.__AVP_CORE_BOOTED__) return;
  window.__AVP_CORE_BOOTED__=true;
  const KEY_HISTORY='avp_learning_history_v2', KEY_BOOK='avp_bookmarks_v2';
  const AVP_EMBEDDED=(function(){try{return new URLSearchParams(location.search).get('embed')==='1'||window.self!==window.top;}catch(e){return window.self!==window.top;}})();
  if(AVP_EMBEDDED){document.documentElement.classList.add('avp-embedded-frame','avp-embedded-youtube');}

  const IGNORE=new Set(['auth.html','admin.html','privacy.html','terms.html','disclaimer.html','open-source.html','lienhe.html','gioithieu.html']);
  const page=location.pathname.split('/').pop()||'index.html';
  const title=(document.querySelector('h1')?.textContent||document.title.split('|')[0]||page).trim();

  /* One read-only page context shared by Robot / AI / Admin chat. */
  const AVP_PAGE_META={
    'index.html':['Trang chủ','Trang chủ','home'],
    'skill-map.html':['Khu học','Skill Map','map'],
    'learning-path.html':['Khu học','Lộ trình học','learning'],
    'master-learning.html':['Khu học','Master Learning','learning'],
    'my-learning.html':['Khu học','Học tập của tôi','learning'],
    'excel.html':['Khu học','Excel cơ bản','learning'],
    'filtersort.html':['Khu học','Filter & Sort','learning'],
    'pivottable.html':['Khu học','PivotTable','learning'],
    'bieudopareto.html':['Khu học','Biểu đồ Pareto','learning'],
    'baocaoexcel.html':['Khu học','Báo cáo Excel / QC','learning'],
    'excel-nang-cao.html':['Khu học','Excel nâng cao','learning'],
    'power-query-course.html':['Khu học','Power Query','learning'],
    'power-pivot-dax.html':['Khu học','Power Pivot & DAX','learning'],
    'dashboard-dong.html':['Khu học','Dashboard động','learning'],
    'solver-whatif.html':['Khu học','What-If & Solver','learning'],
    'vba-macro.html':['Khu học','VBA / Macro','learning'],
    'phimtatexcel.html':['Kho tra cứu','Phím tắt Excel','reference'],
    'congthucexcel.html':['Kho tra cứu','Công thức Excel','reference'],
    'excel-dictionary.html':['Kho tra cứu','Từ điển Excel','reference'],
    'excel-handbook.html':['Kho tra cứu','Excel Handbook','reference'],
    'practice-video.html':['Khu bài tập','Khu bài tập','practice'],
    'practice-tiktok.html':['Khu bài tập','TikTok Practice','practice'],
    'practice-youtube.html':['Khu bài tập','YouTube Practice','practice'],
    'practice-grader.html':['Khu bài tập','Bài tập tự chấm','practice'],
    'practice-guides.html':['Khu bài tập','Hướng dẫn thực hành','practice'],
    'practice-lab.html':['Khu bài tập','Practice Lab','practice'],
    'excel-race.html':['Thử thách','Excel Race','game'],
    'professional-access.html':['Professional Track','Điều kiện truy cập','professional'],
    'professional-track.html':['Professional Track','Khu bài tập Professional','professional'],
    'tools-center.html':['Công cụ',title,'tools'],
    'tools-library.html':['Công cụ','Kho Tool','tools'],
    'formula-finder.html':['Công cụ',title,'tools'],
    'excel-doctor.html':['Công cụ',title,'tools'],
    'qc-dashboard.html':['Công cụ',title,'tools'],
    'excel-mobile.html':['Công cụ',title,'tools']
  };
  const avpMeta=AVP_PAGE_META[page]||['Learn Excel',title,'general'];
  const pageContext=Object.freeze({
    page,area:avpMeta[0],label:avpMeta[1],kind:avpMeta[2],title,href:location.href
  });
  window.AVPPageContext=pageContext;
  document.documentElement.dataset.avpArea=pageContext.kind;
  const now=Date.now();
  const safe=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
  const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const toast=(t)=>{let e=document.querySelector('.avp-save-toast');if(!e){e=document.createElement('div');e.className='avp-save-toast';document.body.appendChild(e)}e.textContent=t;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),1800)};
  if(!IGNORE.has(page)){
    const hist=safe(KEY_HISTORY).filter(x=>x.url!==page);hist.unshift({url:page,title,ts:now});save(KEY_HISTORY,hist.slice(0,12));
  }
  /* Legacy floating robot, draggable launcher, mini-preview and floating hub
     were removed. Page context and local learning history above remain intact. */
  if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).catch(()=>{}));
  let deferred;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;showInstall()});
  function showInstall(){if(sessionStorage.getItem('avp_install_hide'))return;const b=document.createElement('div');b.className='avp-install-banner show';b.innerHTML='<strong>📱 Cài Learn Excel như ứng dụng</strong><p>Mở nhanh hơn và dùng được một phần nội dung khi mạng yếu.</p><div class="avp-hub-actions"><button class="avp-hub-btn" data-install>Cài ứng dụng</button><button class="avp-hub-btn secondary" data-hide>Để sau</button></div>';document.body.appendChild(b);b.querySelector('[data-install]').onclick=async()=>{if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;b.remove()}};b.querySelector('[data-hide]').onclick=()=>{sessionStorage.setItem('avp_install_hide','1');b.remove()}}
})();

/* Global Download Manager loader */
(()=>{if(document.querySelector('script[data-avp-download-manager]'))return;const s=document.createElement('script');s.src='download-manager.js?v=20260828a';s.defer=true;s.dataset.avpDownloadManager='1';document.head.appendChild(s);})();
