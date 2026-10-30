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
 function clean(){
  document.querySelectorAll('h1,h2,h3,h4,strong,[role="heading"]').forEach(function(node){
   var txt=(node.textContent||'').replace(/\s+/g,' ').trim();
   if(!targets.some(function(t){return txt===t;}))return;
   var box=node;
   for(var i=0;i<8&&box&&box!==document.body;i++){
    if(box.matches('section,.home-first-v1,.home-first-inner-v1,.avp-canonical-start,.home-path-inner,.home-path,.home-extra-panel-v104,[data-home-block]'))break;
    box=box.parentElement;
   }
   if(box&&box!==document.body)box.remove();
  });
  document.querySelectorAll('.home-first-v1,.avp-canonical-start,.avp-canonical-tools').forEach(function(n){n.remove();});
 }
 clean();
 if(!window.__avpLegacyBlockObserver){
  var pending=false;
  window.__avpLegacyBlockObserver=new MutationObserver(function(){
   if(pending)return;pending=true;
   requestAnimationFrame(function(){pending=false;clean();});
  });
  window.__avpLegacyBlockObserver.observe(document.body,{childList:true,subtree:true});
 }
}

/* Lightweight pointer parallax for homepage cards. Uses transform only; no layout writes. */
function bindHomepageParallax(){
 if(window.__AVP_HOME_PARALLAX_V1__)return;
 window.__AVP_HOME_PARALLAX_V1__=true;
 var selector='.avp-canonical-category,.avp-canonical-lesson,.avp-canonical-trending li,.avp-resource-card,.avp-canonical-banner,.avp-canonical-book';
 var active=null,frame=0,last=null;
 function reset(card){
  if(!card)return;
  card.style.setProperty('--avp-tilt-x','0deg');card.style.setProperty('--avp-tilt-y','0deg');
  card.style.setProperty('--avp-lift','0px');card.style.setProperty('--avp-mx','50%');
  card.style.setProperty('--avp-my','50%');card.classList.remove('avp-parallax-active');
 }
 document.addEventListener('pointermove',function(e){
  if(e.pointerType!=='mouse'&&e.pointerType!=='pen')return;
  var card=e.target.closest(selector);
  if(active&&active!==card)reset(active);
  active=card;if(!card){last=null;return;}
  var r=card.getBoundingClientRect();if(!r.width||!r.height)return;
  last={card:card,x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height};
  if(frame)return;
  frame=requestAnimationFrame(function(){
   frame=0;if(!last)return;var p=last,dx=p.x-.5,dy=p.y-.5;
   p.card.style.setProperty('--avp-tilt-x',(dx*7).toFixed(2)+'deg');
   p.card.style.setProperty('--avp-tilt-y',(-dy*6).toFixed(2)+'deg');
   p.card.style.setProperty('--avp-lift','-4px');
   p.card.style.setProperty('--avp-mx',(p.x*100).toFixed(1)+'%');
   p.card.style.setProperty('--avp-my',(p.y*100).toFixed(1)+'%');
   p.card.classList.add('avp-parallax-active');
  });
 },{passive:true});
 document.addEventListener('pointerout',function(e){
  if(!active||e.pointerType==='touch')return;
  if(e.relatedTarget&&active.contains(e.relatedTarget))return;
  var card=active;active=null;last=null;reset(card);
 },{passive:true});
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
 '<div class="avp-canonical-actions"><a class="avp-canonical-secondary" href="intro.html?v=11"><span>▶</span><b>Xem giới thiệu<small>1 phút hiểu về AVP</small></b></a></div></div>'+
 '<div class="avp-canonical-illustration"><div class="avp-float-label">Power Query</div><div class="avp-sheet"><small>AVP · DATA</small><div class="avp-bars"><i></i><i></i><i></i><i></i><i></i></div></div><div class="avp-checklist">✓　Dữ liệu<br>✓　Phân tích<br>✓　Báo cáo<br>✓　Tự động hóa</div><div class="avp-person">👨🏻‍💻</div><div class="avp-laptop"><span>▦</span><b>X</b></div><div class="avp-books-stack">Excel　·　Power Query　·　Dashboard</div></div></div>';
 ['#home-ai-intro','#ky-nang-excel','.home-path','#avp-home-ecosystem','#avp-reference-featured','#avp-featured-lessons','.avp-reference-next-steps'].forEach(function(s){document.querySelectorAll(s).forEach(function(n){n.remove();});});
 var discover=el('section','avp-canonical-discover');
 discover.innerHTML='<div class="avp-canonical-section-head"><div><h2>Khám phá ngay</h2><p>Chọn khu vực bạn quan tâm để bắt đầu hành trình.</p></div><a href="tools-center.html">Khám phá tất cả　↗</a></div><div class="avp-canonical-discover-grid"></div>';
 var cats=[
 ['learning-chapters.html','↪','Lộ trình học','12 chương được thiết kế theo đúng công việc thực tế','green'],
 ['#open-excel-library','▦','Thư viện Excel','Tra cứu phím tắt, hàm, kiến thức và hướng dẫn','blue'],
 ['practice-video.html','▤','File thực hành','Tải file theo từng chương, bài học','amber'],
 ['ai.html','✳','Công cụ hỗ trợ','Template, tiện ích và công cụ hữu ích','purple'],
 ['community.html','♟','Cộng đồng','Hỏi đáp, chia sẻ kinh nghiệm và thảo luận','pink']
 ];
 var grid=discover.querySelector('.avp-canonical-discover-grid');

 cats.forEach(function(c){grid.appendChild(link(c[0],'avp-canonical-category '+c[4],'<span class="avp-cat-icon">'+c[1]+'</span><span class="avp-cat-copy"><strong>'+c[2]+'</strong><small>'+c[3]+'</small></span><b>→</b>'));});
 /* The learning-path tile opens a native-feeling chapter picker overlay. */
 var pathCard=grid.querySelector('.avp-canonical-category');
 if(pathCard){
  pathCard.href='#choose-learning-chapter';
  pathCard.setAttribute('role','button');
  pathCard.setAttribute('aria-haspopup','dialog');
  pathCard.setAttribute('aria-label','Mở 12 chương học');
 }
 var chapterList=[
  ['Nhập môn Excel','▤'],['Thao tác và phím tắt','⌨'],['Nền tảng công thức','ƒx'],
  ['Hàm Excel từ cơ bản đến nâng cao','ƒ'],['Công cụ xử lý dữ liệu trên Ribbon','⌕'],['Tổ chức và kiểm soát dữ liệu','▦'],
  ['PivotTable và PivotChart','▥'],['Biểu đồ và Dashboard','▧'],['Power Query','↻'],
  ['Phân tích dữ liệu','⌁'],['Tự động hóa Excel','⚙'],['Quy trình báo cáo doanh nghiệp','✓']
 ];
 /* Lesson catalog is intentionally sourced only from the four existing chapter pages.
    Chapters 5–12 show a clear build status until their lesson sequence is authored and reviewed. */
 var chapterLessons=[
  ['Làm quen giao diện Excel','Workbook, Worksheet và cấu trúc file','Ô, dòng, cột, vùng và địa chỉ','Di chuyển và chọn vùng bằng chuột','Nhập, sửa và xóa nội dung ô','Kiểu dữ liệu: Text, Number, Date và Percentage','Định dạng số, ngày và phần trăm','Định dạng trình bày và bố cục bảng','Sao chép dữ liệu và AutoFill','Tạo, lưu và chọn đúng định dạng file','Thiết lập trang in và xuất PDF','Bài thực hành tổng hợp: dựng Workbook quản lý đơn hàng'],
  ['Di chuyển nhanh trong Sheet','Chọn vùng bằng bàn phím','Copy, Cut và Paste','Paste Special','Undo và Redo','Find và Replace','Chèn và xóa dòng, cột','Fill Handle và chuỗi dữ liệu','Freeze Panes','Sort và Filter','Quy trình thao tác bằng bàn phím','Bài thực hành tổng hợp'],
  ['Toán tử và cấu trúc công thức','Thứ tự thực hiện phép tính','Tham chiếu tương đối','Tham chiếu tuyệt đối','Tham chiếu hỗn hợp','Sao chép và kiểm tra công thức','Nối văn bản và ghép nội dung','Làm tròn và xử lý số thập phân','Ngày tháng trong công thức','IF cơ bản','Nhận diện và xử lý lỗi công thức','Bài thực hành tổng hợp công thức'],
  ['SUM và AVERAGE','MIN, MAX và COUNT','COUNTA và COUNTBLANK','IF','AND và OR','SUMIF','COUNTIF','SUMIFS và COUNTIFS','IFERROR','LEFT, RIGHT, MID và LEN','Hàm xử lý văn bản và ngày tháng','Bài thực hành tổng hợp hàm'],
  ['Làm quen các nhóm lệnh trên Ribbon','Clipboard: Copy, Cut và Paste','Font: định dạng chữ và màu sắc','Alignment: căn chỉnh và gộp ô','Number: định dạng số và ngày','Styles: Cell Styles và Conditional Formatting','Cells: Insert, Delete và Format','Editing: AutoSum, Fill và Clear','Data Tools: Text to Columns và Remove Duplicates','Bài thực hành: chuẩn hóa bảng bằng Ribbon'],
  ['Chuyển vùng dữ liệu thành Excel Table','Đặt tên và quản lý Table','Sử dụng Structured References','Sắp xếp và lọc dữ liệu trong Table','Thiết lập Data Validation','Tạo danh sách chọn phụ thuộc cơ bản','Phát hiện và xử lý dữ liệu trùng','Tách dữ liệu bằng Text to Columns','Dùng Flash Fill để chuẩn hóa dữ liệu','Conditional Formatting để cảnh báo','Bảo vệ vùng dữ liệu và Worksheet','Bài thực hành: kiểm soát bảng dữ liệu đầu vào'],
  ['Tạo PivotTable từ bảng dữ liệu','Tổ chức Rows, Columns, Values và Filters','Thay đổi phép tính và định dạng số','Group dữ liệu theo ngày và tháng','Lọc bằng Label Filters và Value Filters','Sử dụng Slicer và Timeline','Tạo PivotChart','Kết nối Slicer với nhiều PivotTable','Refresh và thay đổi nguồn dữ liệu','Thiết kế báo cáo tổng hợp bằng PivotTable','Bài thực hành: báo cáo doanh số theo cửa hàng'],
  ['Chọn loại biểu đồ phù hợp với dữ liệu','Tạo biểu đồ từ bảng dữ liệu','Định dạng trục, nhãn và chú giải','Sắp xếp thứ tự và lọc chuỗi dữ liệu','Biểu đồ kết hợp và Secondary Axis','Tạo KPI Cards bằng công thức và định dạng','Thiết kế bố cục Dashboard','Kết nối biểu đồ với bộ lọc','Kiểm tra khả năng đọc và tính nhất quán','Bài thực hành: Dashboard theo dõi kết quả kinh doanh'],
  ['Power Query là gì và khi nào nên dùng','Kết nối dữ liệu từ Excel và CSV','Làm quen Power Query Editor','Đổi kiểu dữ liệu và xử lý lỗi','Remove Rows, Remove Columns và Keep Rows','Split, Merge và Replace Values','Append Queries để gộp dữ liệu','Merge Queries để tra cứu và kết hợp bảng','Group By và tổng hợp dữ liệu','Unpivot để chuẩn hóa dữ liệu báo cáo','Load dữ liệu và Refresh truy vấn','Bài thực hành: tự động tổng hợp nhiều file'],
  ['Đọc và mô tả dữ liệu trước khi phân tích','Thống kê mô tả bằng các hàm Excel','Phân tích theo nhóm và phân khúc','So sánh thực tế với mục tiêu','Phân tích xu hướng theo thời gian','Phân tích tỷ trọng và cơ cấu','Phân tích Pareto và nguyên nhân chính','Phân tích chênh lệch và biến động','Kiểm tra ngoại lệ và dữ liệu bất thường','Trình bày insight từ dữ liệu','Bài thực hành: phân tích hiệu quả kinh doanh'],
  ['Ghi và chạy Macro an toàn','Làm quen VBA Editor và Module','Biến, kiểu dữ liệu và phạm vi','Điều kiện If và Select Case','Vòng lặp For và For Each','Làm việc với Workbook, Worksheet và Range','Tự động định dạng và xử lý dữ liệu','Tạo nút chạy Macro','Kiểm soát lỗi và xác nhận trước khi chạy','Lưu file hỗ trợ Macro và bảo mật','Bài thực hành: tự động hóa báo cáo định kỳ'],
  ['Tiếp nhận yêu cầu và xác định KPI','Kiểm tra nguồn và chất lượng dữ liệu','Chuẩn hóa dữ liệu đầu vào','Thiết kế cấu trúc file báo cáo','Xây dựng bảng tính và chỉ tiêu','Tổng hợp và trực quan hóa kết quả','Thiết lập kiểm tra và đối soát số liệu','Chuẩn hóa quy trình cập nhật định kỳ','Đóng gói, lưu trữ và bàn giao báo cáo','Bài thực hành tổng hợp: quy trình báo cáo doanh nghiệp']
 ];
 var modal=document.createElement('div');
 modal.className='avp-chapter-picker-backdrop';
 modal.hidden=true;
 modal.innerHTML='<section class="avp-chapter-picker" role="dialog" aria-modal="true" aria-labelledby="avpChapterPickerTitle"><button type="button" class="avp-chapter-picker-close" aria-label="Đóng">×</button><div class="avp-chapter-picker-head"><small>LEARN EXCEL · 12 CHƯƠNG</small><h2 id="avpChapterPickerTitle">Chọn chương học</h2><p>Chọn một biểu tượng để vào chương tương ứng.</p></div><div class="avp-chapter-picker-grid"></div></section>';
 var modalStyle=document.createElement('style');
 modalStyle.textContent='.avp-chapter-picker-backdrop{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(12,31,22,.48);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}.avp-chapter-picker-backdrop[hidden]{display:none!important}.avp-chapter-picker{position:relative;width:min(760px,100%);max-height:min(86vh,850px);overflow:auto;padding:26px;border:1px solid rgba(255,255,255,.86);border-radius:28px;background:rgba(250,252,250,.98);box-shadow:0 28px 90px rgba(0,0,0,.28);color:#173b29}.avp-chapter-picker-close{position:absolute;right:15px;top:15px;width:38px;height:38px;border:0;border-radius:50%;background:#e8f0eb;color:#315b43;font-size:25px;cursor:pointer}.avp-chapter-picker-head{padding-right:42px;margin-bottom:20px}.avp-chapter-picker-head small{font-size:10px;letter-spacing:.16em;font-weight:900;color:#16805a}.avp-chapter-picker-head h2{margin:7px 0;font-size:clamp(23px,4vw,32px);letter-spacing:-.035em}.avp-chapter-picker-head p{margin:0;color:#718177;font-size:13px}.avp-chapter-picker-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.avp-chapter-app{display:flex;flex-direction:column;align-items:center;gap:9px;min-width:0;min-height:128px;padding:13px 6px;border:1px solid transparent;border-radius:17px;background:transparent;color:#173b29;text-align:center;text-decoration:none}.avp-chapter-app:hover{background:#f0f8f3;border-color:#dcebe1}.avp-chapter-app-icon{display:grid;place-items:center;width:54px;height:52px;border-radius:15px;background:linear-gradient(145deg,#dff4e7,#a9dfbf);color:#08794f;font-size:24px;font-weight:900;box-shadow:0 3px 7px rgba(22,75,47,.12),inset 0 1px 0 rgba(255,255,255,.8)}.avp-chapter-app:nth-child(6n+2) .avp-chapter-app-icon{background:linear-gradient(145deg,#e2f0ff,#b6d7f6);color:#245f96}.avp-chapter-app:nth-child(6n+3) .avp-chapter-app-icon{background:linear-gradient(145deg,#f0eaff,#d3c4fa);color:#6548a2}.avp-chapter-app:nth-child(6n+4) .avp-chapter-app-icon{background:linear-gradient(145deg,#fff0d8,#f4d49e);color:#8b5b10}.avp-chapter-app:nth-child(6n+5) .avp-chapter-app-icon{background:linear-gradient(145deg,#ffe8e8,#f4bdbd);color:#a33b3b}.avp-chapter-app:nth-child(6n) .avp-chapter-app-icon{background:linear-gradient(145deg,#e5f0f2,#b9dadd);color:#23666b}.avp-chapter-app strong{font-size:12px;line-height:1.35}.avp-chapter-app small{font-size:10px;color:#718177}@media(max-width:560px){.avp-chapter-picker{padding:21px 12px;border-radius:24px}.avp-chapter-picker-head{padding-left:5px}.avp-chapter-picker-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:3px}.avp-chapter-app{min-height:110px;padding:9px 2px;gap:7px}.avp-chapter-app-icon{width:44px;height:42px;border-radius:12px;font-size:20px}.avp-chapter-app strong{font-size:10px;letter-spacing:-.02em}.avp-chapter-app small{font-size:9px}}';
 modalStyle.textContent+=`.avp-chapter-picker-grid[hidden]{display:none!important}.avp-chapter-app{appearance:none;-webkit-appearance:none;width:100%;border:1px solid transparent;background:transparent;font:inherit;cursor:pointer}.avp-chapter-lessons{margin-top:2px}.avp-chapter-lessons-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 14px}.avp-chapter-lessons-back{border:1px solid #d9e9df;border-radius:999px;background:#f5faf6;color:#176c49;padding:9px 13px;font-size:12px;font-weight:800;cursor:pointer}.avp-chapter-lessons-count{color:#738278;font-size:11px;font-weight:800}.avp-chapter-lessons-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.avp-chapter-lesson-card{display:flex;align-items:center;gap:11px;min-width:0;padding:13px;border:1px solid #e1ebe4;border-radius:14px;background:#fff;color:#234a34}.avp-chapter-lesson-no{display:grid;place-items:center;flex:0 0 34px;width:34px;height:34px;border-radius:10px;background:#e6f5eb;color:#08794f;font-size:12px;font-weight:900}.avp-chapter-lesson-copy{display:block;flex:1;min-width:0}.avp-chapter-lesson-copy strong{display:block;font-size:12px;line-height:1.4}.avp-chapter-lesson-copy small{display:block;margin-top:4px;color:#849187;font-size:10px}.avp-chapter-lesson-arrow{color:#7b9b87;font-size:22px}.avp-chapter-lessons-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:190px;padding:24px;border:1px dashed #cbded1;border-radius:17px;background:#f8fbf9;text-align:center}.avp-chapter-lessons-empty-icon{display:grid;place-items:center;width:42px;height:42px;margin-bottom:10px;border-radius:13px;background:#e5f4ea;color:#08794f;font-size:20px}.avp-chapter-lessons-empty strong{color:#244c35;font-size:14px}.avp-chapter-lessons-empty p{max-width:490px;margin:8px 0 0;color:#718177;font-size:12px;line-height:1.65}@media(max-width:560px){.avp-chapter-lessons-grid{grid-template-columns:1fr;gap:7px}.avp-chapter-lesson-card{padding:11px}.avp-chapter-lesson-copy strong{font-size:11px}.avp-chapter-lessons-toolbar{align-items:flex-start}.avp-chapter-lessons-back{font-size:11px;padding:8px 11px}.avp-chapter-picker{max-height:88dvh}}`;
 document.head.appendChild(modalStyle);
 document.body.appendChild(modal);
 var modalGrid=modal.querySelector('.avp-chapter-picker-grid');
 var pickerHead=modal.querySelector('.avp-chapter-picker-head');
 var pickerTitle=modal.querySelector('#avpChapterPickerTitle');
 var pickerIntro=pickerHead.querySelector('p');
 var chapterView='grid';
 var lessonPanel=null;

 modalStyle.textContent+=`.avp-lesson-reader{display:grid;grid-template-columns:minmax(0,1fr);gap:16px;margin-top:2px}.avp-lesson-main{min-width:0;padding:20px;border:1px solid #e2ebe5;border-radius:18px;background:#fff}.avp-lesson-kicker{font-size:10px;font-weight:900;letter-spacing:.12em;color:#16805a}.avp-lesson-main h3{margin:8px 0 12px;font-size:22px;line-height:1.25;color:#173b29}.avp-lesson-main p{font-size:13px;line-height:1.75;color:#53675b}.avp-lesson-main h4{margin:18px 0 8px;color:#234a34;font-size:14px}.avp-lesson-example{padding:13px 15px;border-radius:12px;background:#f2f8f4;color:#244c35;font-size:13px;line-height:1.7}.avp-lesson-ref-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:10px}.avp-lesson-ref{display:flex;align-items:center;gap:10px;padding:12px;border:1px solid #dce9df;border-radius:13px;background:#f8fbf9;color:#234a34;text-align:left;cursor:pointer}.avp-lesson-ref strong{display:block;font-size:12px}.avp-lesson-ref small{display:block;margin-top:4px;color:#78887e;font-size:10px}.avp-lesson-reader-back{margin-bottom:12px}.avp-lesson-drawer{display:none;position:fixed;z-index:100002;inset:0;background:rgba(13,32,22,.42);align-items:stretch;justify-content:flex-end}.avp-lesson-drawer.open{display:flex}.avp-lesson-drawer-panel{width:min(480px,44vw);height:100%;overflow:auto;padding:24px;background:#fff;box-shadow:-18px 0 55px rgba(0,0,0,.18);color:#173b29}.avp-lesson-drawer-head{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid #e5eee8}.avp-lesson-drawer-head small{font-size:10px;font-weight:900;letter-spacing:.1em;color:#16805a}.avp-lesson-drawer-close{width:36px;height:36px;border:0;border-radius:50%;background:#edf4ef;color:#315b43;font-size:22px;cursor:pointer}.avp-lesson-drawer-panel h3{font-size:21px;line-height:1.3}.avp-lesson-drawer-panel p,.avp-lesson-drawer-panel li{font-size:13px;line-height:1.75;color:#53675b}.avp-lesson-drawer-panel h4{margin:18px 0 7px;font-size:12px;letter-spacing:.08em;color:#16805a}.avp-lesson-drawer-example{padding:12px;border-radius:11px;background:#f2f8f4;font-size:13px;line-height:1.7;color:#244c35}.avp-lesson-drawer-loading{padding:28px 8px;color:#718177;font-size:13px}@media(max-width:700px){.avp-lesson-main{padding:15px}.avp-lesson-ref-list{grid-template-columns:1fr}.avp-lesson-drawer-panel{width:100%;padding:20px 17px}.avp-lesson-main h3{font-size:19px}}`;
 function renderDataTypesLesson(){
  if(!lessonPanel)return;
  lessonPanel.innerHTML='<div class="avp-chapter-lessons-toolbar avp-lesson-reader-back"><button type="button" class="avp-chapter-lessons-back" data-back-lessons>← Danh sách bài học</button><span class="avp-chapter-lessons-count">CHƯƠNG 01 · BÀI 06</span></div><div class="avp-lesson-reader"><article class="avp-lesson-main"><div class="avp-lesson-kicker">BÀI HỌC 06 · NHẬP MÔN EXCEL</div><h3>Kiểu dữ liệu: Text, Number, Date và Percentage</h3><p>Một ô Excel không chỉ có phần hiển thị. Bên trong, Excel lưu giá trị theo kiểu dữ liệu. Nhận diện đúng kiểu dữ liệu giúp tính toán, lọc, sắp xếp và tổng hợp chính xác.</p><h4>1. Number – dữ liệu số</h4><p>Dùng cho giá trị cần tính toán như số lượng, đơn giá, doanh thu hoặc điểm số.</p><div class="avp-lesson-example"><b>Ví dụ:</b> 1250 là một giá trị số. Có thể cộng, trừ, nhân, chia và dùng trong các hàm thống kê.</div><h4>2. Text – dữ liệu văn bản</h4><p>Dùng cho nội dung nhận diện hoặc mô tả. Mã nhân viên, mã hàng và số điện thoại thường nên lưu dạng Text, kể cả khi chỉ gồm chữ số.</p><div class="avp-lesson-example"><b>Ví dụ:</b> Mã 00125 cần giữ số 0 đầu. Nếu lưu thành Number, Excel có thể chỉ giữ 125.</div><h4>3. Date – dữ liệu ngày tháng</h4><p>Ngày hợp lệ trong Excel được lưu dưới dạng số sê-ri và có thể dùng để tính số ngày, lọc theo tháng hoặc nhóm trong PivotTable. Chuỗi ký tự trông giống ngày chưa chắc là ngày thật.</p><div class="avp-lesson-example"><b>Kiểm tra:</b> =ISNUMBER(A2) giúp kiểm tra giá trị ngày có đang được lưu dưới dạng số hay không.</div><h4>4. Percentage – dữ liệu tỷ lệ</h4><p>Tỷ lệ phần trăm được lưu dưới dạng số thập phân. Giá trị 0.15 khi định dạng Percentage sẽ hiển thị là 15 phần trăm.</p><div class="avp-lesson-example"><b>Lưu ý:</b> Nhập 15 rồi áp dụng Percentage sẽ hiển thị 1500 phần trăm. Không nhân thêm 100 nếu dữ liệu đã lưu ở dạng 0.15.</div><h4>Ghi nhớ</h4><p>Định dạng hiển thị không phải lúc nào cũng thay đổi kiểu dữ liệu gốc. Trước khi sửa dữ liệu, hãy kiểm tra giá trị thực và mục đích sử dụng của cột.</p><h4>Tài liệu tham khảo mở rộng</h4><p>Các chủ đề dưới đây thuộc Thư viện Định dạng & dữ liệu độc lập. Mở tham khảo ngay tại đây, sau đó đóng bảng để quay lại đúng bài học.</p><div class="avp-lesson-ref-list"><button class="avp-lesson-ref" type="button" data-ref-topic="DF01"><span>▦</span><span><strong>Phân biệt Number và Text</strong><small>Thư viện · Kiểu dữ liệu</small></span><b>→</b></button><button class="avp-lesson-ref" type="button" data-ref-topic="DF02"><span>▦</span><span><strong>Nhận diện ngày thật và ngày dạng Text</strong><small>Thư viện · Kiểu dữ liệu</small></span><b>→</b></button></div><h4>Tự kiểm tra</h4><p>1. Mã nhân viên 00045 nên lưu dạng gì? 2. Giá trị nào hiển thị thành 25 phần trăm khi áp dụng Percentage: 0.25 hay 25?</p><div class="avp-lesson-example"><b>Đáp án:</b> 1. Text. 2. 0.25. Hãy tự giải thích lý do trước khi xem đáp án.</div></article></div><div class="avp-lesson-drawer" aria-hidden="true"><section class="avp-lesson-drawer-panel" role="dialog" aria-modal="true" aria-label="Tài liệu tham khảo"><div class="avp-lesson-drawer-head"><small>THƯ VIỆN ĐỊNH DẠNG & DỮ LIỆU</small><button type="button" class="avp-lesson-drawer-close" aria-label="Đóng tài liệu">×</button></div><div class="avp-lesson-drawer-content"><div class="avp-lesson-drawer-loading">Đang tải chủ đề tham khảo…</div></div></section></div>';
  lessonPanel.querySelector('[data-back-lessons]').addEventListener('click',function(){renderChapterLessons(0);});
  var drawer=lessonPanel.querySelector('.avp-lesson-drawer');var drawerContent=lessonPanel.querySelector('.avp-lesson-drawer-content');
  function closeDrawer(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');}
  lessonPanel.querySelector('.avp-lesson-drawer-close').addEventListener('click',closeDrawer);
  drawer.addEventListener('click',function(event){if(event.target===drawer)closeDrawer();});
  lessonPanel.querySelectorAll('[data-ref-topic]').forEach(function(button){button.addEventListener('click',function(){
   var id=button.getAttribute('data-ref-topic');drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');drawerContent.innerHTML='<div class="avp-lesson-drawer-loading">Đang tải chủ đề tham khảo…</div>';
   function renderTopic(){var lib=window.AVP_DATA_LIBRARY;var item=lib&&lib.items&&lib.items.find(function(x){return x.id===id;});if(!item){drawerContent.innerHTML='<p>Không tải được chủ đề. Bạn có thể mở <a href="excel-data-format-library.html" target="_blank" rel="noopener">Thư viện Định dạng & dữ liệu</a> trong tab mới.</p>';return;}
    drawerContent.innerHTML='<h3></h3><p class="avp-topic-summary"></p><h4>BẢN CHẤT</h4><p class="avp-topic-concept"></p><h4>VÍ DỤ</h4><div class="avp-lesson-drawer-example"></div><h4>QUY TẮC CẦN NHỚ</h4><ul class="avp-topic-rules"></ul><h4>TỰ KIỂM TRA</h4><p class="avp-topic-check"></p><p><a href="excel-data-format-library.html" target="_blank" rel="noopener">Mở toàn bộ thư viện ↗</a></p>';
    drawerContent.querySelector('h3').textContent=item.title;drawerContent.querySelector('.avp-topic-summary').textContent=item.summary;drawerContent.querySelector('.avp-topic-concept').textContent=item.concept;drawerContent.querySelector('.avp-lesson-drawer-example').textContent=item.example;drawerContent.querySelector('.avp-topic-rules').innerHTML=item.rules.map(function(rule){var li=document.createElement('li');li.textContent=rule;return li.outerHTML;}).join('');drawerContent.querySelector('.avp-topic-check').textContent=item.check;
   }
   if(window.AVP_DATA_LIBRARY){renderTopic();}else{var script=document.getElementById('avp-data-library-reference-script');if(!script){script=document.createElement('script');script.id='avp-data-library-reference-script';script.src='excel-data-format-library-data.js?v=2';script.onload=renderTopic;script.onerror=function(){drawerContent.innerHTML='<p>Không tải được dữ liệu thư viện. <a href="excel-data-format-library.html" target="_blank" rel="noopener">Mở thư viện trong tab mới</a>.</p>';};document.head.appendChild(script);}else{script.addEventListener('load',renderTopic,{once:true});}}
  });});
 }

 function renderChapterOneLesson(lessonIndex){
  if(!lessonPanel||lessonIndex<0||lessonIndex>=12||lessonIndex===5)return;
  var lessonsData=[
   {goal:"Nhận biết các khu vực làm việc và biết nơi tìm lệnh cần dùng.",intro:"Excel được tổ chức thành các khu vực có chức năng riêng. Nắm được giao diện giúp thao tác đúng chỗ thay vì tìm lệnh theo cảm tính.",parts:[["Workbook và vùng làm việc","Workbook là tệp Excel đang mở. Vùng lưới ở giữa là nơi nhập và xử lý dữ liệu."],["Ribbon và các thẻ lệnh","Home dùng cho thao tác và định dạng phổ biến; Insert tạo bảng, biểu đồ; Data xử lý và kiểm soát dữ liệu; Formulas chứa các nhóm hàm."],["Thanh công thức và Name Box","Formula Bar hiển thị hoặc chỉnh sửa nội dung ô đang chọn. Name Box hiển thị địa chỉ ô và có thể dùng để nhảy nhanh đến vùng." ]],practice:"Chọn ô C5, quan sát Name Box và Formula Bar. Mở thẻ Data, sau đó quay lại Home.",mistake:"Nhầm tên thẻ lệnh với tên nhóm lệnh. Hãy xác định đúng thẻ trước, rồi mới tìm nhóm và nút." ,check:"Muốn kiểm tra kiểu dữ liệu và lọc bảng, nên bắt đầu tìm ở thẻ nào? Gợi ý: Data."},
   {goal:"Phân biệt Workbook, Worksheet và cách tổ chức tệp.",intro:"Workbook là một tệp Excel; bên trong có thể chứa nhiều Worksheet. Cấu trúc hợp lý giúp tách dữ liệu đầu vào, tính toán và báo cáo.",parts:[["Workbook","Là toàn bộ tệp, ví dụ BaoCaoThang.xlsx. Một Workbook có thể chứa nhiều Worksheet."],["Worksheet","Là từng trang tính nằm trong Workbook, được quản lý bằng các tab ở cạnh dưới."],["Đặt tên và sắp xếp","Đặt tên ngắn, rõ nghĩa như DATA, DANH_MUC, BAO_CAO. Không dùng tên mơ hồ như Sheet1 hoặc New." ]],practice:"Tạo một Workbook mới, đổi tên Sheet1 thành DATA, thêm một Worksheet tên BAO_CAO và đổi thứ tự hai tab.",mistake:"Tách quá nhiều Worksheet nhưng không có quy tắc. Mỗi sheet nên có vai trò rõ ràng, tránh tạo sheet chỉ để chứa vài ô rời rạc.",check:"Một tệp Excel có ba tab sheet thì có bao nhiêu Workbook? Đáp án: một Workbook, ba Worksheet."},
   {goal:"Hiểu địa chỉ ô, vùng dữ liệu và cách chọn đúng phạm vi.",intro:"Mọi thao tác trong Excel đều tác động lên ô hoặc vùng được chọn. Chọn sai phạm vi có thể làm hỏng dữ liệu hoặc định dạng.",parts:[["Ô và địa chỉ ô","Ô là giao điểm của một cột và một dòng. C5 nghĩa là cột C, dòng 5."],["Vùng dữ liệu","A1:C5 là vùng gồm ba cột và năm dòng. Dấu hai chấm biểu thị từ ô đầu đến ô cuối."],["Hàng, cột và vùng đang chọn","Tiêu đề cột dùng chữ cái, tiêu đề dòng dùng số. Vùng được chọn thường có đường viền bao quanh." ]],practice:"Nhập dữ liệu thử ở A1:C5, chọn A1:C5 bằng cách kéo chuột và quan sát vùng được tô sáng.",mistake:"Bỏ sót dòng tiêu đề hoặc chọn thừa dòng trống khi thao tác. Luôn kiểm tra địa chỉ vùng trước khi chạy lệnh.",check:"Địa chỉ B2:D6 bao gồm bao nhiêu ô? Đáp án: 3 cột × 5 dòng = 15 ô."},
   {goal:"Di chuyển và chọn vùng chính xác bằng chuột.",intro:"Chuột phù hợp khi chọn vùng nhìn thấy trên màn hình. Cần phân biệt chọn một ô, vùng liên tục, nhiều vùng rời nhau và toàn bộ dòng hoặc cột.",parts:[["Chọn một ô hoặc vùng liên tục","Nhấp một ô để chọn; giữ chuột trái và kéo để chọn vùng liền kề."],["Chọn dòng hoặc cột","Nhấp số dòng để chọn cả dòng; nhấp chữ cái cột để chọn cả cột."],["Chọn nhiều vùng rời nhau","Giữ Ctrl trong khi nhấp hoặc kéo để thêm vùng chọn khác, nếu thao tác đó được Excel hỗ trợ." ]],practice:"Chọn A1:A5, sau đó giữ Ctrl và chọn C1:C5. Quan sát hai vùng cùng được giữ lựa chọn.",mistake:"Kéo từ giữa ô thay vì từ vùng biên hoặc nhầm thao tác kéo vùng với Fill Handle. Kiểm tra con trỏ trước khi kéo.",check:"Muốn chọn toàn bộ cột C, nhấp vào chữ C ở tiêu đề cột."},
   {goal:"Nhập, chỉnh sửa và xóa nội dung mà không làm mất dữ liệu ngoài ý muốn.",intro:"Excel cho phép nhập trực tiếp trong ô hoặc qua Formula Bar. Trước khi xóa, cần xác định muốn xóa nội dung, định dạng hay cả ô.",parts:[["Nhập và xác nhận","Chọn ô, nhập nội dung rồi nhấn Enter để xác nhận. Tab chuyển sang ô bên phải."],["Chỉnh sửa nội dung","Nhấp đúp ô hoặc chọn ô rồi nhấn F2 để sửa bên trong. Formula Bar cũng có thể dùng để chỉnh sửa."],["Xóa đúng cách","Phím Delete xóa nội dung ô đang chọn. Home → Clear có các lựa chọn riêng như Clear Contents, Clear Formats và Clear All." ]],practice:"Nhập tên sản phẩm ở A1, sửa bằng F2, sau đó dùng Delete để xóa nội dung. Thử lại với Home → Clear → Clear Formats trên một ô đã định dạng.",mistake:"Dùng Delete rồi tưởng đã xóa cả định dạng. Delete thông thường chỉ xóa nội dung, không xóa toàn bộ định dạng ô.",check:"Muốn xóa nội dung nhưng giữ màu nền và đường viền, dùng Delete hoặc Clear Contents."},
   null,
   {goal:"Áp dụng định dạng số, ngày và phần trăm đúng với giá trị gốc.",intro:"Number Format thay đổi cách Excel hiển thị giá trị, không tự sửa dữ liệu gốc. Chọn định dạng dựa trên ý nghĩa của cột.",parts:[["Number","Dùng cho số lượng, điểm hoặc giá trị cần tính. Có thể bật dấu phân cách hàng nghìn và chọn số chữ số thập phân."],["Date","Dùng cho ngày thật của Excel. Có thể đổi mẫu hiển thị nhưng cần kiểm tra dữ liệu gốc trước."],["Percentage","Excel lưu 15 phần trăm dưới dạng 0.15. Khi áp dụng Percentage, 0.15 hiển thị thành 15 phần trăm." ]],practice:"Nhập 1250, 0.15 và một ngày hợp lệ vào ba ô riêng. Dùng Home → Number để lần lượt định dạng Number, Percentage và Short Date.",mistake:"Nhập 15 rồi định dạng Percentage sẽ thành 1500 phần trăm. Đừng nhầm giá trị gốc với cách hiển thị.",check:"Muốn hiển thị 25 phần trăm bằng Percentage, giá trị gốc thông thường là 0.25."},
   {goal:"Trình bày bảng dễ đọc nhưng không làm sai cấu trúc dữ liệu.",intro:"Định dạng trình bày giúp người đọc nhận diện tiêu đề, dữ liệu và tổng kết. Ưu tiên nhất quán, dễ đọc và có thể mở rộng.",parts:[["Tiêu đề và phân cấp","Dùng một hàng tiêu đề rõ ràng, chữ đậm và màu nền vừa phải. Không tạo nhiều hàng tiêu đề nếu dự định dùng Table hoặc PivotTable."],["Căn lề và kích thước","Căn trái văn bản, căn phải số theo mặc định phù hợp; điều chỉnh độ rộng cột và chiều cao dòng để nội dung không bị che."],["Borders và màu sắc","Dùng đường viền để phân tách vùng cần thiết. Màu sắc nên có ý nghĩa nhất quán, không tô quá nhiều màu." ]],practice:"Tạo bảng gồm Mã đơn hàng, Ngày, Sản phẩm, Số lượng. Định dạng hàng tiêu đề, căn chỉnh cột và điều chỉnh độ rộng.",mistake:"Gộp ô trong vùng dữ liệu chính. Merged Cells gây khó khăn khi lọc, sắp xếp và xử lý bằng Power Query.",check:"Có nên Merge Cells trong vùng dữ liệu nguồn cần lọc và tổng hợp không? Không nên."},
   {goal:"Sao chép dữ liệu và dùng AutoFill đúng mục đích.",intro:"Copy/Paste dùng để nhân bản nội dung; Fill Handle có thể sao chép hoặc tạo chuỗi dựa trên quy luật. Cần kiểm tra kết quả trước khi áp dụng cho vùng lớn.",parts:[["Copy và Paste","Chọn ô hoặc vùng, nhấn Ctrl+C, chọn vị trí đích rồi Ctrl+V."],["Fill Handle","Kéo chốt vuông ở góc dưới bên phải vùng chọn để sao chép hoặc mở rộng chuỗi."],["Nhận diện quy luật","Một giá trị đơn thường được sao chép; hai giá trị đầu có quy luật như 1 và 2 có thể được kéo thành 3, 4, 5." ]],practice:"Nhập 1 và 2 vào A1:A2, chọn cả hai rồi kéo Fill Handle xuống A10. Làm lại với chỉ ô A1 để so sánh.",mistake:"Chỉ chọn một ô rồi mong Excel tự đoán mọi chuỗi. Với chuỗi số, ngày hoặc thứ tự, cung cấp đủ mẫu để Excel nhận diện quy luật.",check:"Muốn tạo chuỗi 1, 2, 3…, nên chọn hai giá trị đầu 1 và 2 trước khi kéo."},
   {goal:"Tạo, lưu và chọn định dạng tệp phù hợp với mục đích sử dụng.",intro:"Định dạng tệp quyết định khả năng giữ công thức, Macro và mức độ tương thích. Chọn sai định dạng có thể làm mất tính năng.",parts:[["XLSX","Định dạng Workbook phổ biến, giữ dữ liệu, công thức, định dạng và nhiều đối tượng Excel."],["XLSM","Dùng khi Workbook có Macro VBA cần được giữ lại. Không lưu file có Macro thành XLSX nếu muốn tiếp tục dùng Macro."],["CSV và PDF","CSV thường chỉ lưu dữ liệu dạng văn bản của một sheet đang hoạt động, không giữ đầy đủ công thức và định dạng. PDF phù hợp để chia sẻ bản xem hoặc in." ]],practice:"Tạo Workbook có hai Worksheet, lưu một bản XLSX. Dùng Save As để quan sát các định dạng XLSX, XLSM, CSV và PDF; không cần bật Macro nếu chưa có.",mistake:"Tưởng CSV là bản sao đầy đủ của Workbook. CSV không giữ nhiều Worksheet, công thức và định dạng như XLSX.",check:"Workbook có Macro cần lưu định dạng nào? XLSM."},
   {goal:"Thiết lập trang in để bảng không bị cắt và xuất PDF đúng phạm vi.",intro:"Bảng nhìn đẹp trên màn hình chưa chắc in tốt. Cần kiểm tra vùng in, hướng giấy, tỷ lệ và ngắt trang trước khi xuất PDF.",parts:[["Print Area và hướng giấy","Chọn vùng cần in rồi Page Layout → Print Area → Set Print Area. Chọn Portrait hoặc Landscape theo chiều rộng bảng."],["Scaling và lề","Dùng Width/Height trong Scale to Fit có kiểm soát. Tránh ép toàn bộ bảng quá rộng vào một trang khiến chữ không đọc được."],["Print Preview và PDF","Mở File → Print để kiểm tra Preview. Khi đúng, chọn Microsoft Print to PDF hoặc Export → Create PDF/XPS tùy phiên bản." ]],practice:"Tạo bảng có nhiều cột, thiết lập Landscape, chọn Print Area và xem Print Preview. Thử điều chỉnh Fit All Columns on One Page.",mistake:"Ép cả bảng vào một trang bất kể số cột. Nếu chữ quá nhỏ, nên chia trang hoặc lặp lại hàng tiêu đề thay vì cố nhồi.",check:"Trước khi xuất PDF, cần kiểm tra ở đâu? File → Print → Print Preview."},
   {goal:"Kết hợp các thao tác đã học để tạo Workbook quản lý đơn hàng cơ bản.",intro:"Bài thực hành dùng một quy trình liền mạch: tạo cấu trúc Workbook, nhập dữ liệu, định dạng, kiểm tra và chuẩn bị bản in. Không cần dùng công thức nâng cao ở chương này.",parts:[["Tạo cấu trúc","Tạo hai Worksheet: DATA và BAO_CAO. DATA chứa từng đơn hàng; BAO_CAO dùng để trình bày kết quả."],["Nhập và trình bày dữ liệu","Trong DATA tạo các cột: Mã đơn hàng, Ngày đặt, Khách hàng, Sản phẩm, Số lượng, Đơn giá. Nhập tối thiểu năm dòng dữ liệu mẫu."],["Kiểm tra và bàn giao","Giữ mã đơn hàng dạng Text nếu có số 0 đầu; định dạng ngày và số; chỉnh độ rộng cột; thiết lập vùng in và lưu XLSX." ]],practice:"Tự dựng Workbook theo cấu trúc trên. Kiểm tra mỗi cột có đúng kiểu dữ liệu và tiêu đề không bị gộp ô.",mistake:"Đưa tiêu đề báo cáo, ghi chú và dòng trống xen giữa các bản ghi trong DATA. Giữ vùng DATA dạng danh sách liên tục, mỗi dòng là một đơn hàng.",check:"Workbook hoàn thành cần có tối thiểu hai sheet DATA và BAO_CAO; vùng DATA có một hàng tiêu đề và mỗi dòng là một bản ghi."}
  ];
  var d=lessonsData[lessonIndex];if(!d)return;
  var title=chapterLessons[0][lessonIndex];
  lessonPanel.innerHTML='<div class="avp-chapter-lessons-toolbar avp-lesson-reader-back"><button type="button" class="avp-chapter-lessons-back" data-back-lessons>← Danh sách bài học</button><span class="avp-chapter-lessons-count">CHƯƠNG 01 · BÀI '+String(lessonIndex+1).padStart(2,'0')+'</span></div><article class="avp-lesson-main"><div class="avp-lesson-kicker">BÀI HỌC '+String(lessonIndex+1).padStart(2,'0')+' · NHẬP MÔN EXCEL</div><h3></h3><h4>MỤC TIÊU</h4><p class="avp-lesson-goal"></p><p class="avp-lesson-intro"></p><h4>NỘI DUNG CHÍNH</h4><div class="avp-lesson-parts"></div><h4>THỰC HÀNH</h4><div class="avp-lesson-example avp-lesson-practice"></div><h4>LỖI THƯỜNG GẶP</h4><p class="avp-lesson-mistake"></p><h4>TỰ KIỂM TRA</h4><div class="avp-lesson-example avp-lesson-check"></div></article>';
  lessonPanel.querySelector('[data-back-lessons]').addEventListener('click',function(){renderChapterLessons(0);});
  lessonPanel.querySelector('h3').textContent=title;
  lessonPanel.querySelector('.avp-lesson-goal').textContent=d.goal;
  lessonPanel.querySelector('.avp-lesson-intro').textContent=d.intro;
  lessonPanel.querySelector('.avp-lesson-parts').innerHTML=d.parts.map(function(part){return '<h4>'+part[0]+'</h4><p>'+part[1]+'</p>';}).join('');
  lessonPanel.querySelector('.avp-lesson-practice').textContent=d.practice;
  lessonPanel.querySelector('.avp-lesson-mistake').textContent=d.mistake;
  lessonPanel.querySelector('.avp-lesson-check').textContent=d.check;
 }
 function renderChapterGrid(){
  chapterView='grid';
  if(lessonPanel){lessonPanel.remove();lessonPanel=null;}
  modalGrid.hidden=false;
  pickerTitle.textContent='Chọn chương học';
  pickerIntro.textContent='Chọn một biểu tượng để xem danh sách bài học.';
  modalGrid.innerHTML=chapterList.map(function(item,i){
   var tile='<span class="avp-chapter-app-icon">'+item[1]+'</span><small>CHƯƠNG '+String(i+1).padStart(2,'0')+'</small><strong>'+item[0]+'</strong>';
   return '<button type="button" class="avp-chapter-app" data-chapter-index="'+i+'" aria-label="Xem bài học Chương '+String(i+1).padStart(2,'0')+': '+item[0]+'">'+tile+'</button>';
  }).join('');
 }
 function renderChapterLessons(index){
  var chapter=chapterList[index];
  if(!chapter)return;
  chapterView='lessons';
  modalGrid.hidden=true;
  if(lessonPanel)lessonPanel.remove();
  pickerTitle.textContent='Chương '+String(index+1).padStart(2,'0')+' · '+chapter[0];
  pickerIntro.textContent='Danh sách bài học trong chương. Chọn bài học để xem nội dung ở bước tiếp theo.';
  lessonPanel=el('div','avp-chapter-lessons');
  var lessons=chapterLessons[index]||[];
  var top=el('div','avp-chapter-lessons-toolbar');
  var back=el('button','avp-chapter-lessons-back','← Tất cả 12 chương');
  back.type='button';back.addEventListener('click',renderChapterGrid);
  top.appendChild(back);
  var count=el('span','avp-chapter-lessons-count',lessons.length?lessons.length+' bài học':'Đang xây dựng nội dung');
  top.appendChild(count);lessonPanel.appendChild(top);
  if(lessons.length){
   var list=el('div','avp-chapter-lessons-grid');
   lessons.forEach(function(title,i){
    var card=el('button','avp-chapter-lesson-card');card.type='button';card.setAttribute('data-lesson-index',String(i));
    card.innerHTML='<span class="avp-chapter-lesson-no">'+String(i+1).padStart(2,'0')+'</span><span class="avp-chapter-lesson-copy"><strong></strong><small>Bài học · Chương '+String(index+1).padStart(2,'0')+'</small></span><span class="avp-chapter-lesson-arrow">›</span>';
    card.querySelector('strong').textContent=title;
    list.appendChild(card);
   });
   lessonPanel.appendChild(list);
   if(index===0){
    lessonPanel.addEventListener('click',function(event){var lessonButton=event.target.closest('[data-lesson-index]');if(!lessonButton)return;var lessonIndex=Number(lessonButton.getAttribute('data-lesson-index'));if(lessonIndex===5)renderDataTypesLesson();else renderChapterOneLesson(lessonIndex);});
   }
  }else{
   var empty=el('div','avp-chapter-lessons-empty');
   empty.innerHTML='<span class="avp-chapter-lessons-empty-icon">✎</span><strong>Danh sách bài học đang được chuẩn hóa</strong><p>Chương này đã có trong lộ trình 12 chương. Bài học sẽ được đưa vào đây sau khi chốt mục tiêu, thứ tự và kỹ năng đầu ra; không dùng lại nội dung của chương trình 8 nhóm, 42 bài đã loại bỏ.</p>';
   lessonPanel.appendChild(empty);
  }
  modalGrid.parentNode.insertBefore(lessonPanel,modalGrid.nextSibling);
  modal.querySelector('.avp-chapter-picker').scrollTop=0;
 }
 renderChapterGrid();
 modalGrid.addEventListener('click',function(event){
  var button=event.target.closest('[data-chapter-index]');
  if(!button)return;
  renderChapterLessons(Number(button.getAttribute('data-chapter-index')));
 });
 function openChapterPicker(){renderChapterGrid();modal.hidden=false;document.body.classList.add('avp-chapter-picker-open');modal.querySelector('.avp-chapter-picker-close').focus();}
 function closeChapterPicker(){modal.hidden=true;document.body.classList.remove('avp-chapter-picker-open');}
 pathCard.addEventListener('click',function(event){event.preventDefault();openChapterPicker();});
 modal.querySelector('.avp-chapter-picker-close').addEventListener('click',closeChapterPicker);
 modal.addEventListener('click',function(event){if(event.target===modal)closeChapterPicker();});
 document.addEventListener('keydown',function(event){if(event.key==='Escape'&&!modal.hidden)closeChapterPicker();});
 document.body.classList.add('avp-chapter-picker-ready');


 /* Công cụ hỗ trợ: mở thư mục ứng dụng dạng iPhone, tương tự bộ chọn 12 chương. */
 var toolsCard=grid.querySelectorAll('.avp-canonical-category')[3];
 var toolsModal=document.createElement('div');
 toolsModal.className='avp-chapter-picker-backdrop avp-tools-picker-backdrop';
 toolsModal.hidden=true;
 toolsModal.innerHTML='<section class="avp-chapter-picker avp-tools-picker" role="dialog" aria-modal="true" aria-labelledby="avpToolsPickerTitle"><button type="button" class="avp-chapter-picker-close" aria-label="Đóng">×</button><div class="avp-chapter-picker-head"><small>AVP · TOOL & WORKSPACE</small><h2 id="avpToolsPickerTitle">Công cụ hỗ trợ</h2><p>Chọn một khu vực để mở công cụ phù hợp với công việc của bạn.</p></div><div class="avp-chapter-picker-grid avp-tools-picker-grid"></div></section>';
 var toolsStyle=document.createElement('style');
 toolsStyle.textContent='.avp-tools-picker{width:min(920px,100%)}.avp-tools-picker-grid{grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}.avp-tools-app{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:10px;min-width:0;min-height:205px;padding:17px 14px;border:1px solid #e3e8f0;border-top:4px solid var(--tool-accent,#365cf5);border-radius:19px;background:linear-gradient(160deg,#fff,#fbfcff);color:#1b2d48;text-align:left;text-decoration:none;box-shadow:0 5px 15px #172b4d0a;transition:transform .18s ease,box-shadow .18s ease}.avp-tools-app:hover{transform:translateY(-3px);box-shadow:0 14px 28px #172b4d18}.avp-tools-app-icon{display:grid;place-items:center;width:48px;height:48px;border-radius:15px;background:var(--tool-tint,#e8edff);color:var(--tool-accent,#365cf5);font-size:23px;font-weight:900}.avp-tools-app small{font-size:9px;line-height:1.35;font-weight:900;letter-spacing:.08em;color:var(--tool-accent,#365cf5)}.avp-tools-app strong{font-size:16px;line-height:1.3}.avp-tools-app em{font-size:11px;line-height:1.5;color:#748095;font-style:normal}.avp-tools-app b{margin-top:auto;font-size:11px;color:var(--tool-accent,#365cf5)}.avp-tools-app.master{--tool-accent:#394b99;--tool-tint:#e9ebff}.avp-tools-app.quick{--tool-accent:#287a9a;--tool-tint:#e2f5fb}.avp-tools-app.code{--tool-accent:#087b68;--tool-tint:#def5ef}.avp-tools-app.arena{--tool-accent:#8749a2;--tool-tint:#f3e5fb}.avp-tools-app.kho{--tool-accent:#9a6417;--tool-tint:#fff0d6}@media(max-width:700px){.avp-tools-picker{padding:20px 12px}.avp-tools-picker-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.avp-tools-app{min-height:175px;padding:13px 11px}.avp-tools-app strong{font-size:14px}}';
 document.head.appendChild(toolsStyle);
 document.body.appendChild(toolsModal);
 var toolApps=[
  ['excel-mobile.html','◆','LỘ TRÌNH NÂNG CAO','Excel Master','Hệ nội dung chuyên sâu','Mở Excel Mobile →','master'],
  ['quick-learn.html','◴','HỌC NHANH 2–3 PHÚT','Học nhanh hôm nay','Mỗi ngày tự đề xuất một bài học ngắn','Học bài hôm nay →','quick'],
  ['#open-code-hub','⌘','CODE & AUTOMATION','Excel Code Hub','Python · VBA · Power Query','Mở Code Hub →','code'],
  ['excel-race.html','ϟ','GAME & PHẢN XẠ','Excel Race','Đấu kỹ năng theo thời gian','Vào Excel Race →','arena'],
  ['tools-library.html','▣','TOOL & TEMPLATE','Kho Tool','Compare File · Clean Data Pro · Công nợ','Mở Kho Tool →','kho']
 ];
 toolsModal.querySelector('.avp-tools-picker-grid').innerHTML=toolApps.map(function(t){var tag=t[0]==='#open-code-hub'?'button':'a';var dest=t[0]==='#open-code-hub'?' type="button" data-open-code-hub':' href="'+t[0]+'"';return '<'+tag+' class="avp-tools-app '+t[6]+'"'+dest+'><span class="avp-tools-app-icon">'+t[1]+'</span><small>'+t[2]+'</small><strong>'+t[3]+'</strong><em>'+t[4]+'</em><b>'+t[5]+'</b></'+tag+'>';}).join('');
 toolsModal.querySelector('[data-open-code-hub]').addEventListener('click',function(){var launcher=document.getElementById('homeCodeHubOpen');closeToolsPicker();if(launcher){launcher.click();return;}var modal=document.getElementById('avpCodeHubModal');if(modal){modal.hidden=false;document.body.classList.add('avp-codehub-lock');return;}location.href='index.html#avpCodeHubModal';});
 function openToolsPicker(){toolsModal.hidden=false;document.body.classList.add('avp-chapter-picker-open');toolsModal.querySelector('.avp-chapter-picker-close').focus();}
 function closeToolsPicker(){toolsModal.hidden=true;document.body.classList.remove('avp-chapter-picker-open');}
 if(toolsCard){toolsCard.href='#choose-avp-tools';toolsCard.setAttribute('role','button');toolsCard.setAttribute('aria-haspopup','dialog');toolsCard.setAttribute('aria-label','Mở thư mục Công cụ hỗ trợ');toolsCard.addEventListener('click',function(event){event.preventDefault();openToolsPicker();});}
 toolsModal.querySelector('.avp-chapter-picker-close').addEventListener('click',closeToolsPicker);
 toolsModal.addEventListener('click',function(event){if(event.target===toolsModal)closeToolsPicker();});
 document.addEventListener('keydown',function(event){if(event.key==='Escape'&&!toolsModal.hidden)closeToolsPicker();});


 /* Thư viện Excel: cửa vào chung cho các thư viện tra cứu. */
 var libraryCard=grid.querySelectorAll('.avp-canonical-category')[1];
 var libraryModal=document.createElement('div');
 libraryModal.className='avp-chapter-picker-backdrop avp-library-picker-backdrop';
 libraryModal.hidden=true;
 libraryModal.innerHTML='<section class="avp-chapter-picker avp-library-picker" role="dialog" aria-modal="true" aria-labelledby="avpLibraryPickerTitle"><button type="button" class="avp-chapter-picker-close" aria-label="Đóng">×</button><div class="avp-chapter-picker-head"><small>LEARN EXCEL · KNOWLEDGE LIBRARY</small><h2 id="avpLibraryPickerTitle">Thư viện Excel</h2><p>Tra cứu kiến thức, công cụ và hướng dẫn Excel theo nhu cầu.</p></div><div class="avp-library-grid"></div></section>';
 var libraryStyle=document.createElement('style');
 libraryStyle.textContent='.avp-library-picker{width:min(820px,100%)}.avp-library-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.avp-library-app{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:8px;min-width:0;min-height:145px;padding:17px 10px 14px;border:1px solid #e2ebe5;border-radius:17px;background:#fff;color:#214a34;text-align:center;text-decoration:none;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}.avp-library-app[href]:hover{transform:translateY(-3px);border-color:#a9d5b8;box-shadow:0 10px 22px #17452f12}.avp-library-app[aria-disabled=true]{cursor:default;background:#fbfcfb}.avp-library-app-icon{display:grid;place-items:center;width:48px;height:46px;border-radius:14px;background:var(--lib-tint,#e3f4e9);color:var(--lib-accent,#16764d);font-size:23px;font-weight:900}.avp-library-app strong{font-size:13px;line-height:1.35}.avp-library-app small{font-size:10px;line-height:1.4;color:#77867c}.avp-library-app em{margin-top:auto;padding:4px 8px;border-radius:999px;background:#f1f5f2;color:#718078;font-size:9px;font-style:normal;font-weight:800}.avp-library-app.ready em{background:#e5f5eb;color:#147347}.avp-library-app:nth-child(2){--lib-accent:#416fc1;--lib-tint:#e6eeff}.avp-library-app:nth-child(3){--lib-accent:#7851a7;--lib-tint:#f1e9ff}.avp-library-app:nth-child(4){--lib-accent:#a36b20;--lib-tint:#fff0d9}.avp-library-app:nth-child(5){--lib-accent:#b64e5b;--lib-tint:#fce7e9}.avp-library-app:nth-child(6){--lib-accent:#347d83;--lib-tint:#e2f1f2}@media(max-width:560px){.avp-library-picker{padding:21px 12px;max-height:88dvh}.avp-library-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.avp-library-app{min-height:132px;padding:13px 8px}.avp-library-app strong{font-size:12px}}';
 document.head.appendChild(libraryStyle);
 document.body.appendChild(libraryModal);
 var libraryItems=[
  ['excel-formula-library.html','ƒx','Hàm & công thức','Tra cứu cú pháp, đối số và ví dụ','MỞ THƯ VIỆN','ready'],
  ['excel-shortcut-library.html','⌨','Phím tắt Excel','Học và luyện tập từ cơ bản đến nâng cao','MỞ THƯ VIỆN','ready'],
  ['excel-knowledge-library.html','▤','Kiến thức Excel','Khái niệm và nguyên lý nền tảng','MỞ THƯ VIỆN','ready'],
  ['excel-operation-library.html','⚙','Hướng dẫn thao tác','Hướng dẫn trực quan từng bước','MỞ THƯ VIỆN','ready'],
  ['excel-data-format-library.html','▦','Định dạng & dữ liệu','Kiểu dữ liệu, định dạng và kiểm soát','MỞ THƯ VIỆN','ready'],
  ['#','▧','Mẫu Workbook','File mẫu và cấu trúc sử dụng','ĐANG CHUẨN BỊ','soon']
 ];
 libraryModal.querySelector('.avp-library-grid').innerHTML=libraryItems.map(function(item){var active=item[5]==='ready';return '<'+(active?'a':'div')+' class="avp-library-app '+(active?'ready':'')+'"'+(active?' href="'+item[0]+'"':' aria-disabled="true"')+'><span class="avp-library-app-icon">'+item[1]+'</span><strong>'+item[2]+'</strong><small>'+item[3]+'</small><em>'+item[4]+'</em></'+(active?'a':'div')+'>';}).join('');
 function openLibraryPicker(){libraryModal.hidden=false;document.body.classList.add('avp-chapter-picker-open');libraryModal.querySelector('.avp-chapter-picker-close').focus();}
 function closeLibraryPicker(){libraryModal.hidden=true;document.body.classList.remove('avp-chapter-picker-open');}
 if(libraryCard){libraryCard.href='#open-excel-library';libraryCard.setAttribute('role','button');libraryCard.setAttribute('aria-haspopup','dialog');libraryCard.setAttribute('aria-label','Mở Thư viện Excel');libraryCard.addEventListener('click',function(event){event.preventDefault();openLibraryPicker();});}
 libraryModal.querySelector('.avp-chapter-picker-close').addEventListener('click',closeLibraryPicker);
 libraryModal.addEventListener('click',function(event){if(event.target===libraryModal)closeLibraryPicker();});
 document.addEventListener('keydown',function(event){if(event.key==='Escape'&&!libraryModal.hidden)closeLibraryPicker();});

 hero.insertAdjacentElement('afterend',discover);
 var lessons=el('section','avp-canonical-lessons');
 lessons.innerHTML='<div class="avp-canonical-lesson-main"><div class="avp-canonical-section-head"><div><h2>Bài học nổi bật</h2><p>Những bài có nhiều học viên hoàn thành nhất.</p></div></div><div class="avp-canonical-lesson-grid" aria-live="polite"></div></div><aside class="avp-canonical-trending" aria-live="polite"><h3>Xu hướng hôm nay　↗</h3><ol><li><span><small>Đang tải dữ liệu học tập...</small></span></li></ol></aside>';
 var lg=lessons.querySelector('.avp-canonical-lesson-grid');
 function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});}
 function renderLearningRankings(data){
  var featured=Array.isArray(data&&data.featured)?data.featured:[];
  var trending=Array.isArray(data&&data.trending)?data.trending:[];
  lg.innerHTML='';
  featured.forEach(function(item,i){
   var title=esc(item.title||'Bài học');
   var learners=Math.max(0,Number(item.learners)||0);
   var card=el('article','avp-canonical-lesson',
    '<div class="avp-canonical-thumb rank-'+(i+1)+'"><small>AVP · EXCEL</small><strong>'+title+'</strong><span class="avp-thumb-sheet"><i></i><i></i><i></i><i></i><i></i></span><b>TOP '+(i+1)+'</b></div><div class="avp-canonical-lesson-copy"><strong>'+title+'</strong><small>'+learners.toLocaleString('vi-VN')+' học viên đã hoàn thành</small></div>');
   lg.appendChild(card);
  });
  if(!featured.length)lg.appendChild(el('div','avp-learning-rank-empty','Chưa có dữ liệu hoàn thành bài học.'));
  var list=lessons.querySelector('.avp-canonical-trending ol');
  list.innerHTML='';
  trending.forEach(function(item,i){
   var recent=Math.max(0,Number(item.recent_learners)||0);
   var growth=item.growth_pct==null?null:Number(item.growth_pct);
   var note=growth===null?'Mới nổi · '+recent.toLocaleString('vi-VN')+' người học':(growth>0?'Tăng '+growth.toLocaleString('vi-VN')+'%':growth<0?'Giảm '+Math.abs(growth).toLocaleString('vi-VN')+'%':'Ổn định')+' · '+recent.toLocaleString('vi-VN')+' người học';
   list.appendChild(el('li','','<b>'+(i+1)+'</b><span><strong>'+esc(item.title||'Bài học')+'</strong><small>'+esc(note)+' trong 7 ngày</small></span>'));
  });
  if(!trending.length)list.appendChild(el('li','avp-learning-rank-empty','Chưa có hoạt động học tập trong 7 ngày gần đây.'));
 }
 async function loadLearningRankings(){
  var deadline=Date.now()+6000;
  while(Date.now()<deadline&&!window.avpSupabase)await new Promise(function(resolve){setTimeout(resolve,150);});
  if(!window.avpSupabase||typeof window.avpSupabase.rpc!=='function'){
   renderLearningRankings({featured:[],trending:[]});
   return;
  }
  try{
   var result=await window.avpSupabase.rpc('public_home_learning_rankings',{p_days:7});
   if(result.error)throw result.error;
   renderLearningRankings(result.data||{});
  }catch(error){
   console.warn('[AVP learning rankings]',error);
   lg.innerHTML='';
   lg.appendChild(el('div','avp-learning-rank-empty','Chưa tải được dữ liệu xếp hạng.'));
   var list=lessons.querySelector('.avp-canonical-trending ol');
   list.innerHTML='';
   list.appendChild(el('li','avp-learning-rank-empty','Dữ liệu xu hướng tạm thời không khả dụng.'));
  }
 }
 loadLearningRankings();
 bindHomepageParallax();
 discover.insertAdjacentElement('afterend',lessons);
 /* Removed by request: duplicate onboarding and tools blocks are deleted from the homepage composition. */

 /* Focused resources area: workbook library and real-world case projects. */
 var resourceSection=document.getElementById('avp-canonical-resources');
 if(!resourceSection){
  resourceSection=el('section','avp-canonical-resources');
  resourceSection.id='avp-canonical-resources';
  resourceSection.innerHTML='<div class="avp-resource-heading"><div><small>TÀI NGUYÊN DÀNH CHO DÂN VĂN PHÒNG</small><h2>Tạo ra sản phẩm thực tế, không chỉ học công cụ</h2><p>Tài nguyên để luyện tập, lưu lại nội dung hữu ích và theo dõi những gì bạn đã hoàn thành.</p></div></div><div class="avp-resource-grid"><div class="avp-resource-card avp-resource-workbook"><span class="avp-resource-icon">▤</span><span class="avp-resource-copy"><small>01 · FILE MẪU VÀ DỮ LIỆU</small><strong>Kho workbook</strong><em>File thực hành, dữ liệu mẫu và tài liệu theo từng chủ đề.</em><b>Kho nội dung</b></span><span class="avp-resource-decoration">XLSX</span></div><div class="avp-resource-card avp-resource-cases"><span class="avp-resource-icon">▦</span><span class="avp-resource-copy"><small>02 · BÀI TOÁN THỰC TẾ</small><strong>Case thực chiến</strong><em>Thử giải bài toán bằng dữ liệu đầu vào và mục tiêu đầu ra cụ thể.</em><b>Nội dung tham khảo</b></span><span class="avp-resource-decoration">CASE</span></div><div class="avp-resource-card avp-resource-collection"><span class="avp-resource-icon">♧</span><span class="avp-resource-copy"><small>03 · HỌC TIẾP VÀ XEM LẠI</small><strong>Bộ sưu tập cá nhân</strong><em>Mở khu học tập để tiếp tục nội dung gần đây và xem các mục đã lưu trên thiết bị này.</em><b>Đang lưu trữ</b></span><span class="avp-resource-decoration">SAVE</span></div><div class="avp-resource-card avp-resource-results"><span class="avp-resource-icon">✓</span><span class="avp-resource-copy"><small>04 · THEO DÕI TIẾN ĐỘ</small><strong>Thành quả thực hành</strong><em>Xem tiến độ học tập và kết quả được hệ thống ghi nhận.</em><b>Thông tin hiển thị</b></span><span class="avp-resource-decoration">DONE</span></div></div>'
  lessons.insertAdjacentElement('afterend',resourceSection);
 }

 var books=document.getElementById('home-books');
 if(books){books.classList.remove('avp-canonical-books');var heading=books.querySelector('.home-reference-heading');if(heading)heading.textContent='Tài liệu tham khảo';}
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

/* Restore the original hero illustration motion: one tool label cycles every 3s. */
(function(){
  'use strict';
  var root=document.querySelector('.avp-canonical-illustration');
  if(!root||root.dataset.avpMotionBound==='1')return;
  root.dataset.avpMotionBound='1';
  var badge=root.querySelector('.avp-float-label');
  var tools=['Power Query','Excel','Power Pivot','DAX','PivotTable','Dashboard','VBA','Python','SQL','Office Scripts','Power Automate','AI'];
  var index=0,cycle=null,frame=0;
  if(badge){
    badge.setAttribute('aria-label','Công cụ đang giới thiệu');
    cycle=window.setInterval(function(){
      if(document.hidden)return;
      index=(index+1)%tools.length;
      badge.textContent=tools[index];
    },3000);
  }
  function reset(){
    root.style.setProperty('--avp-scene-x','0px');
    root.style.setProperty('--avp-scene-y','0px');
  }
  root.addEventListener('pointermove',function(event){
    if(event.pointerType!=='mouse'&&event.pointerType!=='pen')return;
    if(frame)return;
    frame=requestAnimationFrame(function(){
      frame=0;
      var rect=root.getBoundingClientRect();
      if(!rect.width||!rect.height)return;
      var x=(event.clientX-rect.left)/rect.width-.5;
      var y=(event.clientY-rect.top)/rect.height-.5;
      root.style.setProperty('--avp-scene-x',(x*12).toFixed(2)+'px');
      root.style.setProperty('--avp-scene-y',(y*8).toFixed(2)+'px');
    });
  },{passive:true});
  root.addEventListener('pointerleave',reset,{passive:true});
  document.addEventListener('visibilitychange',function(){if(document.hidden)reset();});
})();
