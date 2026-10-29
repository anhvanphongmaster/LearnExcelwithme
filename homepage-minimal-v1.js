/* AVP Homepage — canonical single-source layout. Replaces legacy homepage composition. */
(function(){
'use strict';
var path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
if(path!==''&&path!=='index.html')return;
if(window.__AVP_HOME_CANONICAL__)return;
window.__AVP_HOME_CANONICAL__=true;
document.documentElement.classList.add('avp-home-canonical');
/* Restore the desktop layout class required by homepage-minimal-v1.css. */
document.documentElement.classList.add('avp-force-desktop-mobile');
/* Restore the previous desktop-canvas behavior on phones as requested. */
var viewport=document.querySelector('meta[name="viewport"]');
if(viewport){
 viewport.setAttribute('content','width=1200, initial-scale=0.32, minimum-scale=0.1, maximum-scale=2, user-scalable=yes');
}
function el(tag,cls,html){var n=document.createElement(tag);if(cls)n.className=cls;if(html!==undefined)n.innerHTML=html;return n;}
function link(href,cls,html){var a=el('a',cls,html);a.href=href;return a;}
function deleteLegacyDuplicateBlocks(){
 var targets=['Bắt đầu đúng chỗ','Mở rộng kỹ năng'];
 document.querySelectorAll('h1,h2,h3,h4,strong,div,section').forEach(function(node){
  if(node.children.length>5)return;
  var txt=(node.textContent||'').replace(/\\s+/g,' ').trim();
  if(!targets.some(function(t){return txt===t;}))return;
  var box=node;
  for(var i=0;i<6&&box&&box!==document.body;i++){
   if(box.matches('section,.home-first-v1,.home-first-inner-v1,.avp-canonical-start,.home-path-inner,.home-path,.home-extra-panel-v104'))break;
   box=box.parentElement;
  }
  if(box&&box!==document.body)box.remove();
 });
 document.querySelectorAll('.home-first-v1,.avp-canonical-start,.avp-canonical-tools').forEach(function(n){n.remove();});
}
function setup(){
 var nav=document.querySelector('.top-simple-nav');
 if(nav){
  var brand=nav.querySelector('.top-simple-brand, .top-brand, .site-brand, .avp-brand');
  if(!brand&&!nav.querySelector('.avp-canonical-brand')){
   var b=el('a','avp-canonical-brand','<span class="avp-canonical-mark">AVP</span><span><strong>Anh Văn Phòng</strong><small>Learn Excel With Me</small></span>');
   b.href='index.html';nav.insertBefore(b,nav.firstChild);
  }
 }
 var hero=document.getElementById('trangchu')||document.querySelector('.avp-hero');
 if(!hero)return;
 hero.className='avp-hero avp-canonical-hero';hero.innerHTML=
 '<div class="avp-canonical-inner"><div class="avp-canonical-copy">'+
 '<div class="avp-canonical-eyebrow">●　EXCEL　·　DỮ LIỆU　·　BÁO CÁO　·　TỰ ĐỘNG HÓA　·　AI</div>'+
 '<h1>Học <span>Excel</span><br>để làm được việc.</h1>'+
 '<p>Từ cơ bản đến nâng cao, kèm ví dụ thực tế, bài tập và file thực hành.<br>Giúp bạn xử lý công việc nhanh hơn, chính xác hơn và chuyên nghiệp hơn.</p>'+
 '<div class="avp-canonical-actions"><a class="avp-canonical-primary" href="skill-map.html"><span>▤</span><b>Bắt đầu học ngay<small>Dành cho người mới</small></b><i>→</i></a><a class="avp-canonical-secondary" href="intro.html?v=11"><span>▶</span><b>Xem giới thiệu<small>1 phút hiểu về AVP</small></b></a></div></div>'+
 '<div class="avp-canonical-illustration"><div class="avp-float-label">Power Query</div><div class="avp-sheet"><small>AVP · DATA</small><div class="avp-bars"><i></i><i></i><i></i><i></i><i></i></div></div><div class="avp-checklist">✓　Dữ liệu<br>✓　Phân tích<br>✓　Báo cáo<br>✓　Tự động hóa</div><div class="avp-person">👨🏻‍💻</div><div class="avp-laptop"><span>▦</span><b>X</b></div><div class="avp-books-stack">Excel　·　Power Query　·　Dashboard</div></div></div>';
 ['#home-ai-intro','#ky-nang-excel','.home-path','#avp-home-ecosystem','#avp-reference-featured','#avp-featured-lessons','.avp-reference-next-steps'].forEach(function(s){document.querySelectorAll(s).forEach(function(n){n.remove();});});
 var discover=el('section','avp-canonical-discover');
 discover.innerHTML='<div class="avp-canonical-section-head"><div><h2>Khám phá ngay</h2><p>Chọn khu vực bạn quan tâm để bắt đầu hành trình.</p></div><a href="tools-center.html">Khám phá tất cả　↗</a></div><div class="avp-canonical-discover-grid"></div>';
 var cats=[
 ['skill-map.html','↪','Lộ trình học','12 chương được thiết kế theo đúng công việc thực tế','green'],
 ['excel-library.html','ƒx','Thư viện hàm Excel','Tra cứu nhanh công dụng, ví dụ và cách dùng','blue'],
 ['practice-video.html','▤','File thực hành','Tải file theo từng chương, bài học','amber'],
 ['ai.html','✳','Công cụ hỗ trợ','Template, tiện ích và công cụ hữu ích','purple'],
 ['tools-center.html','♟','Cộng đồng','Hỏi đáp, chia sẻ kinh nghiệm và thảo luận','pink']
 ];
 var grid=discover.querySelector('.avp-canonical-discover-grid');
 cats.forEach(function(c){grid.appendChild(link(c[0],'avp-canonical-category '+c[4],'<span class="avp-cat-icon">'+c[1]+'</span><span class="avp-cat-copy"><strong>'+c[2]+'</strong><small>'+c[3]+'</small></span><b>→</b>'));});
 hero.insertAdjacentElement('afterend',discover);
 var lessons=el('section','avp-canonical-lessons');
 lessons.innerHTML='<div class="avp-canonical-lesson-main"><div class="avp-canonical-section-head"><div><h2>Bài học nổi bật</h2><p>Những nội dung đang được quan tâm.</p></div><a href="excel.html">Xem tất cả　→</a></div><div class="avp-canonical-lesson-grid"></div></div><aside class="avp-canonical-trending"><h3>Xu hướng hôm nay　↗</h3><ol><li><b>1</b><span><strong>SUMIFS</strong><small>Tính tổng nhiều điều kiện</small></span></li><li><b>2</b><span><strong>XLOOKUP</strong><small>Tra cứu dữ liệu hiện đại</small></span></li><li><b>3</b><span><strong>PivotTable</strong><small>Báo cáo nhanh</small></span></li><li><b>4</b><span><strong>Power Query</strong><small>Làm sạch và kết hợp dữ liệu</small></span></li><li><b>5</b><span><strong>Phím tắt Excel</strong><small>Làm việc nhanh hơn</small></span></li></ol></aside><div class="avp-canonical-banner"><span class="avp-banner-art">▥<small>AVP</small></span><div><h2>Sẵn sàng nâng cấp kỹ năng Excel?</h2><p>Tham gia lộ trình 12 chương với ví dụ thực tế và bài tập có file thực hành.</p></div><a href="skill-map.html">Xem lộ trình 12 chương　→</a></div>';
 var lessonData=[
 ['power-query-course.html','Power Query cơ bản','Từ dữ liệu thô đến báo cáo','12:30','pq'],
 ['excel.html','XLOOKUP tra cứu dữ liệu','Tra cứu dữ liệu hiện đại','10:15','lookup'],
 ['congthucexcel.html','SUMIFS nhiều điều kiện','Tính tổng nhiều điều kiện','08:42','sumifs'],
 ['pivottable.html','PivotTable từ A đến Z','Phân tích dữ liệu nhanh','11:28','pivot']
 ];
 var lg=lessons.querySelector('.avp-canonical-lesson-grid');
 lessonData.forEach(function(d){lg.appendChild(link(d[0],'avp-canonical-lesson','<div class="avp-canonical-thumb '+d[4]+'"><small>AVP · EXCEL</small><strong>'+d[1]+'</strong><span class="avp-thumb-sheet"><i></i><i></i><i></i><i></i><i></i></span><b>'+d[3]+'</b></div><div class="avp-canonical-lesson-copy"><strong>'+d[1]+'</strong><small>'+d[2]+'</small></div>'));});
 discover.insertAdjacentElement('afterend',lessons);
 /* Removed by request: duplicate onboarding and tools blocks are deleted from the homepage composition. */

 /* Focused resources area: workbook library and real-world case projects. */
 var resourceSection=document.getElementById('avp-canonical-resources');
 if(!resourceSection){
  resourceSection=el('section','avp-canonical-resources');
  resourceSection.id='avp-canonical-resources';
  resourceSection.innerHTML='<div class="avp-resource-heading"><div><small>TÀI NGUYÊN DÀNH CHO DÂN VĂN PHÒNG</small><h2>Tạo ra sản phẩm thực tế, không chỉ học công cụ</h2><p>Tài nguyên để luyện tập, lưu lại nội dung hữu ích và theo dõi những gì bạn đã hoàn thành.</p></div></div><div class="avp-resource-grid"><a class="avp-resource-card avp-resource-workbook" href="practice-video.html"><span class="avp-resource-icon">▤</span><span class="avp-resource-copy"><small>01 · FILE MẪU VÀ DỮ LIỆU</small><strong>Kho workbook</strong><em>File thực hành, dữ liệu mẫu và tài liệu theo từng chủ đề.</em><b>Mở kho workbook　→</b></span><span class="avp-resource-decoration">XLSX</span></a><a class="avp-resource-card avp-resource-cases" href="practice-lab.html"><span class="avp-resource-icon">▦</span><span class="avp-resource-copy"><small>02 · BÀI TOÁN THỰC TẾ</small><strong>Case thực chiến</strong><em>Thử giải bài toán bằng dữ liệu đầu vào và mục tiêu đầu ra cụ thể.</em><b>Khám phá case　→</b></span><span class="avp-resource-decoration">CASE</span></a><a class="avp-resource-card avp-resource-collection" href="my-learning.html"><span class="avp-resource-icon">♧</span><span class="avp-resource-copy"><small>03 · HỌC TIẾP VÀ XEM LẠI</small><strong>Bộ sưu tập cá nhân</strong><em>Mở khu học tập để tiếp tục nội dung gần đây và xem các mục đã lưu trên thiết bị này.</em><b>Mở khu học tập　→</b></span><span class="avp-resource-decoration">SAVE</span></a><a class="avp-resource-card avp-resource-results" href="dashboard.html"><span class="avp-resource-icon">✓</span><span class="avp-resource-copy"><small>04 · THEO DÕI TIẾN ĐỘ</small><strong>Thành quả thực hành</strong><em>Xem tiến độ học tập và kết quả được hệ thống ghi nhận.</em><b>Xem tiến độ　→</b></span><span class="avp-resource-decoration">DONE</span></a></div>';
  lessons.insertAdjacentElement('afterend',resourceSection);
 }

 var books=document.getElementById('home-books');
 if(books){books.classList.add('avp-canonical-books');var heading=books.querySelector('.home-reference-heading');if(heading)heading.textContent='Tài liệu tham khảo';}
}
/* Build the homepage once, then remove legacy duplicates once.
   Do not use delayed DOM deletion to compensate for competing renderers. */
if(document.readyState==='loading'){
 document.addEventListener('DOMContentLoaded',function(){
  setup();
  deleteLegacyDuplicateBlocks();
 },{once:true});
}else{
 setup();
 deleteLegacyDuplicateBlocks();
}
})();