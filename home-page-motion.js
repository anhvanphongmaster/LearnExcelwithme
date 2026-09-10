/*! avp-site-motion.js — reveal + parallax nhẹ banner (không đụng dữ liệu) */
(function () {
  if (window.__avpSiteMotion) return;
  window.__avpSiteMotion = true;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  var RISE_SEL = [
    ".course-card",
    ".practice-file-card",
    ".summary-card",
    ".level-card",
    ".continue-card",
    ".home-path-card",
    ".home-more-card",
    ".home-book-card",
    ".home-ref-item-v114",
    ".home-cta-card",
    ".dash-panel",
    ".pq-lesson",
    ".course-panel",
    ".path-item",
    ".learn-board",
    ".pv-panel",
    ".badge-card",
    ".lab-card",
    ".home-platform-module-v1"
  ].join(",");

  var BANNER_SEL = [
    ".pv-hero",
    ".ml-hero",
    ".pq-hero",
    ".dashboard-hero",
    ".avp-hero",
    ".learn-board",
    ".course-panel",
    ".dash-panel",
    ".lp-hero"
  ].join(",");

  function setupRise() {
    var nodes = document.querySelectorAll(RISE_SEL);
    if (!nodes.length) return;
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("avp-motion-rise", "avp-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("avp-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    nodes.forEach(function (n, i) {
      if (n.classList.contains("avp-motion-rise")) return;
      n.classList.add("avp-motion-rise");
      n.style.transitionDelay = Math.min(i * 0.04, 0.28) + "s";
      io.observe(n);
    });
  }

  function setupBannerParallax() {
    if (window.matchMedia && window.matchMedia("(hover: none)").matches) return;
    var banners = document.querySelectorAll(BANNER_SEL);
    banners.forEach(function (el) {
      if (el.__avpPx) return;
      el.__avpPx = true;
      el.classList.add("avp-parallax-layer");
      var tx = 0, ty = 0, mx = 0, my = 0, raf = 0;
      function tick() {
        tx += (mx - tx) * 0.08; ty += (my - ty) * 0.08;
        el.style.transform = "translate3d(" + tx.toFixed(2) + "px," + ty.toFixed(2) + "px,0)";
        if (Math.abs(mx - tx) > 0.05 || Math.abs(my - ty) > 0.05) raf = requestAnimationFrame(tick); else raf = 0;
      }
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        mx = ((e.clientX - r.left) / Math.max(1, r.width) - 0.5) * 10;
        my = ((e.clientY - r.top) / Math.max(1, r.height) - 0.5) * 6;
        if (!raf) raf = requestAnimationFrame(tick);
      }, { passive: true });
      el.addEventListener("mouseleave", function () { mx = 0; my = 0; if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
    });
  }

  function boot() { setupRise(); setupBannerParallax(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
  setTimeout(boot, 600); setTimeout(boot, 1800);
})();

/* Home A–Z V4 — self-contained renderer so Home no longer depends on a cached secondary loader. */
(function(){
  if(window.__avpHomeAZV4)return;
  window.__avpHomeAZV4=true;

  var modules=[
    ['01','FOUNDATION','Nền tảng Excel','Hiểu file, nhập liệu, định dạng, công thức và cấu trúc bảng trước khi đi sâu.','excel-foundation',6,'green'],
    ['02','DATA CONTROL','Dữ liệu & Làm sạch','Lọc, tìm, chuẩn hóa text, chặn nhập sai và kiểm soát duplicate/blank/error.','data-cleaning',5,'teal'],
    ['03','FORMULA & LOOKUP','Công thức & Tra cứu','Logic, tổng hợp điều kiện, lookup, ngày tháng, công thức nâng cao và Dynamic Array.','formula-lookup',6,'blue'],
    ['04','ANALYSIS','Phân tích & Báo cáo','Excel Table, PivotTable, KPI, đối chiếu số và bàn giao báo cáo.','analysis-reporting',5,'purple'],
    ['05','VISUAL REPORT','Dashboard & Trực quan hóa','Chart đúng mục đích, KPI card, Slicer/Timeline và dashboard tương tác dễ dùng.','dashboard-visual',5,'rose'],
    ['06','POWER QUERY','Power Query','Kết nối nguồn, làm sạch, schema/type, Append/Merge, nhiều file và Refresh bền vững.','power-query',6,'sand'],
    ['07','AUTOMATION CODE','Macro / VBA & Tối ưu file','Record Macro, object model, If/Loop, xử lý lỗi, bảo mật và giảm lag workbook.','vba-optimization',4,'orange'],
    ['08','WORKFLOW & CASE','Workflow & Case thực chiến','Chọn đúng công cụ và nối Input → Transform → Calculate → Report → Validate → Deliver.','workflow-cases',5,'indigo']
  ];

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]})}
  function render(){
    var shell=document.querySelector('.home-path-inner');
    var grid=shell&&shell.querySelector('.home-path-grid');
    if(!shell||!grid)return false;

    var title=shell.querySelector(':scope > h2');
    var desc=shell.querySelector(':scope > p');
    if(title)title.textContent='Nền tảng Excel A–Z';
    if(desc)desc.textContent='8 module · 42 bài. Chọn theo nhóm công việc; bên trong là danh sách bài rõ ràng và luôn có đường quay lại.';

    grid.className='home-path-grid home-platform-grid-v1';
    grid.innerHTML=modules.map(function(m){
      return '<a class="home-platform-module-v1 tone-'+esc(m[6])+'" href="skill-map.html?module='+encodeURIComponent(m[4])+'">'+
        '<span class="home-platform-no-v1">'+esc(m[0])+'</span>'+
        '<span class="home-platform-copy-v1"><small>'+esc(m[1])+'</small><strong>'+esc(m[2])+'</strong><em>'+esc(m[3])+'</em><b>'+m[5]+' bài · Xem danh sách →</b></span></a>';
    }).join('');

    var oldMore=shell.querySelector('.home-path-more');
    if(oldMore)oldMore.style.marginTop='18px';

    var tease=document.querySelector('#avpScrollTease .avp-tease-title');
    if(tease){
      var chev=tease.querySelector('.avp-tease-chevs');
      tease.innerHTML='';
      if(chev)tease.appendChild(chev);
      tease.append(document.createTextNode(' Excel A–Z · 8 module · 42 bài'));
    }
    var preview=document.getElementById('avpTeasePreview');
    if(preview)preview.textContent='Từ cơ bản → Dashboard → Power Query → VBA → Case thực chiến';

    if(!document.getElementById('homeLearningPlatformV4Styles')){
      var css=document.createElement('style');
      css.id='homeLearningPlatformV4Styles';
      css.textContent='.home-platform-grid-v1{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:12px!important}.home-platform-module-v1{min-width:0;display:grid;grid-template-columns:42px minmax(0,1fr);gap:11px;align-items:start;padding:15px;border:1px solid #d9e6de;border-radius:16px;background:#fff;color:#173f2a;text-decoration:none;box-shadow:0 6px 18px rgba(23,70,43,.045);transition:.18s ease}.home-platform-module-v1:hover{transform:translateY(-3px);border-color:#9fc9ae;box-shadow:0 12px 28px rgba(23,70,43,.09)}.home-platform-no-v1{display:grid;place-items:center;width:42px;height:42px;border-radius:12px;background:#eaf7ef;color:#17633b;font-size:12px;font-weight:950}.home-platform-copy-v1{min-width:0;display:block}.home-platform-copy-v1 small{display:block;color:#4d8060;font-size:8px;font-weight:950;letter-spacing:.08em}.home-platform-copy-v1 strong{display:block;margin-top:3px;color:#173f2a;font-size:14px;line-height:1.3}.home-platform-copy-v1 em{display:block;margin-top:5px;color:#6d7e74;font-style:normal;font-size:10px;line-height:1.45}.home-platform-copy-v1 b{display:block;margin-top:9px;color:#217346;font-size:9px}.tone-blue .home-platform-no-v1{background:#edf5fb;color:#356f9f}.tone-teal .home-platform-no-v1{background:#e9f7f5;color:#287c72}.tone-indigo .home-platform-no-v1{background:#eef0fb;color:#4d5da8}.tone-purple .home-platform-no-v1{background:#f2edf9;color:#72599a}.tone-rose .home-platform-no-v1{background:#fbefef;color:#9d5454}.tone-sand .home-platform-no-v1{background:#fbf2e5;color:#8b6634}.tone-orange .home-platform-no-v1{background:#fff0e5;color:#9a5d2e}body.dark-mode .home-platform-module-v1{background:#17251d;border-color:#30473a;color:#e1efe6}body.dark-mode .home-platform-copy-v1 strong{color:#e5f3e9}body.dark-mode .home-platform-copy-v1 em{color:#a8b8af}.home-path-more--5{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:12px!important;align-items:stretch!important}.home-path-more--5 .home-more-card{width:100%!important;min-width:0!important;min-height:96px!important;height:100%!important;box-sizing:border-box!important;justify-content:flex-start!important}.home-path-more--5 .home-more-card strong{line-height:1.25}.home-path-more--5 .home-more-card small{line-height:1.35}@media(max-width:980px){.home-platform-grid-v1{grid-template-columns:repeat(2,minmax(0,1fr))!important}.home-path-more--5{grid-template-columns:1fr!important}}@media(max-width:560px){.home-platform-grid-v1{grid-template-columns:1fr!important}.home-platform-module-v1{grid-template-columns:40px minmax(0,1fr)}}';
      document.head.appendChild(css);
    }
    return true;
  }

  function boot(){
    if(render())return;
    var tries=0;
    var timer=setInterval(function(){tries++;if(render()||tries>20)clearInterval(timer)},150);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  setTimeout(render,700);
  setTimeout(render,1800);
})();
