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
 '<div class="avp-canonical-inner avp-hero-split"><div class="avp-canonical-copy">'+
 '<div class="avp-canonical-eyebrow">●　EXCEL　·　DỮ LIỆU　·　BÁO CÁO　·　TỰ ĐỘNG HÓA　·　AI</div>'+
 '<h1>Học <span>Excel</span><br>để làm được việc.</h1>'+
 '<p>Từ cơ bản đến nâng cao, kèm ví dụ thực tế, bài tập và file thực hành. Giúp bạn xử lý công việc nhanh hơn, chính xác hơn và chuyên nghiệp hơn.</p>'+
 '<div class="avp-canonical-actions"><a class="avp-canonical-secondary" href="intro.html?v=11"><span>▶</span><b>Xem giới thiệu<small>1 phút hiểu về AVP</small></b></a></div></div>'+
 '<button class="avp-home-map-card" type="button" data-open-learning-map><span class="avp-home-map-kicker">MY LEARNING JOURNEY</span><strong>Bản đồ hành trình</strong><span class="avp-home-map-copy">Theo dõi bạn đã đi đến đâu, đang đứng ở đâu và chặng tiếp theo cần chinh phục.</span><span class="avp-home-map-art"><svg viewBox="0 0 520 220" role="img" aria-label="Đường hành trình uốn lượn qua các khu vực học tập"><path d="M0 180 Q80 110 150 155 T270 95 T390 135 T520 40" fill="none" stroke="#d4bd8b" stroke-width="34" stroke-linecap="round"/><path d="M0 180 Q80 110 150 155 T270 95 T390 135 T520 40" fill="none" stroke="#fff2d2" stroke-width="25" stroke-linecap="round"/><g fill="#79a77d"><path d="M35 72l17-34 17 34zM66 82l14-27 14 27zM350 192l18-36 18 36zM390 195l14-28 14 28z"/></g><g fill="#e8f4e8" stroke="#8ab397" stroke-width="2"><circle cx="72" cy="148" r="13"/><circle cx="195" cy="142" r="13"/><circle cx="302" cy="104" r="13"/><circle cx="430" cy="111" r="13"/></g><circle cx="72" cy="148" r="6" fill="#0b7950"/><circle cx="195" cy="142" r="6" fill="#0b7950"/><circle cx="302" cy="104" r="6" fill="#f3a342"/><circle cx="430" cy="111" r="6" fill="#fff" stroke="#8ab397"/><g transform="translate(302 66)"><circle r="19" fill="#f5a340" stroke="#fff" stroke-width="4"/><text text-anchor="middle" y="6" font-size="18">●</text></g></svg></span><span class="avp-home-map-footer"><span data-home-map-position>Điểm xuất phát</span><b>Mở bản đồ ↗</b></span></button></div>'
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

 modalStyle.textContent+='.avp-lesson-workflow{margin-top:16px;padding:16px;border:1px solid #e2ebe5;border-radius:16px;background:#f8fbf9}.avp-lesson-workflow h4{margin:12px 0 8px;color:#16805a;font-size:11px;letter-spacing:.08em}.avp-lesson-workflow ol{margin:0;padding-left:20px}.avp-lesson-workflow li,.avp-lesson-workflow p{font-size:12px;line-height:1.7;color:#53675b}.avp-lesson-library-section{margin-top:18px;padding-top:14px;border-top:1px solid #e5eee8}.avp-lesson-library-section>h4{margin:0 0 7px;color:#16805a;font-size:11px;letter-spacing:.08em}.avp-lesson-library-section>p{font-size:12px;line-height:1.65;color:#718177}.avp-lesson-library-section .avp-lesson-ref-list{grid-template-columns:repeat(2,minmax(0,1fr))}.avp-lesson-library-section .avp-lesson-drawer{z-index:100004}@media(max-width:700px){.avp-lesson-library-section .avp-lesson-ref-list{grid-template-columns:1fr}}';

modalStyle.textContent+=`/* Detailed step-by-step lesson procedure v2 */
.avp-lesson-procedure-v2{margin-top:18px;padding:17px;border:1px solid #dce9df;border-radius:16px;background:linear-gradient(180deg,#fbfefc,#f4faf6)}.avp-lesson-procedure-v2 h4{margin:16px 0 8px;color:#147347;font-size:12px;letter-spacing:.07em}.avp-lesson-procedure-v2 h4:first-child{margin-top:0}.avp-lesson-procedure-v2 p,.avp-lesson-procedure-v2 li{font-size:13px;line-height:1.8;color:#405b4a}.avp-lesson-procedure-v2 ol{margin:0;padding-left:23px}.avp-lesson-procedure-v2 li{padding:3px 0 5px}.avp-procedure-mouse{padding:12px 14px;border-left:3px solid #24845a;border-radius:7px;background:#eaf5ee}.avp-procedure-goal{font-weight:600}`;
modalStyle.textContent+=`.avp-lesson-reader{display:grid;grid-template-columns:minmax(0,1fr);gap:16px;margin-top:2px}.avp-lesson-main{min-width:0;padding:20px;border:1px solid #e2ebe5;border-radius:18px;background:#fff}.avp-lesson-kicker{font-size:10px;font-weight:900;letter-spacing:.12em;color:#16805a}.avp-lesson-main h3{margin:8px 0 12px;font-size:22px;line-height:1.25;color:#173b29}.avp-lesson-main p{font-size:13px;line-height:1.75;color:#53675b}.avp-lesson-main h4{margin:18px 0 8px;color:#234a34;font-size:14px}.avp-lesson-example{padding:13px 15px;border-radius:12px;background:#f2f8f4;color:#244c35;font-size:13px;line-height:1.7}.avp-lesson-ref-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:10px}.avp-lesson-ref{display:flex;align-items:center;gap:10px;padding:12px;border:1px solid #dce9df;border-radius:13px;background:#f8fbf9;color:#234a34;text-align:left;cursor:pointer}.avp-lesson-ref strong{display:block;font-size:12px}.avp-lesson-ref small{display:block;margin-top:4px;color:#78887e;font-size:10px}.avp-lesson-reader-back{margin-bottom:12px}.avp-lesson-drawer{display:none;position:fixed;z-index:100002;inset:0;background:rgba(13,32,22,.42);align-items:stretch;justify-content:flex-end}.avp-lesson-drawer.open{display:flex}.avp-lesson-drawer-panel{width:min(480px,44vw);height:100%;overflow:auto;padding:24px;background:#fff;box-shadow:-18px 0 55px rgba(0,0,0,.18);color:#173b29}.avp-lesson-drawer-head{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid #e5eee8}.avp-lesson-drawer-head small{font-size:10px;font-weight:900;letter-spacing:.1em;color:#16805a}.avp-lesson-drawer-close{width:36px;height:36px;border:0;border-radius:50%;background:#edf4ef;color:#315b43;font-size:22px;cursor:pointer}.avp-lesson-drawer-panel h3{font-size:21px;line-height:1.3}.avp-lesson-drawer-panel p,.avp-lesson-drawer-panel li{font-size:13px;line-height:1.75;color:#53675b}.avp-lesson-drawer-panel h4{margin:18px 0 7px;font-size:12px;letter-spacing:.08em;color:#16805a}.avp-lesson-drawer-example{padding:12px;border-radius:11px;background:#f2f8f4;font-size:13px;line-height:1.7;color:#244c35}.avp-lesson-drawer-loading{padding:28px 8px;color:#718177;font-size:13px}@media(max-width:700px){.avp-lesson-main{padding:15px}.avp-lesson-ref-list{grid-template-columns:1fr}.avp-lesson-drawer-panel{width:100%;padding:20px 17px}.avp-lesson-main h3{font-size:19px}}`;
 function mountChapterOneCheckpoint(panel,lessonIndex){
  // Checkpoint tự đánh giá cho Chương 1. Kết quả lưu trên thiết bị, chưa phải xác nhận năng lực độc lập.
  var bank={
   0:{questions:[
    ["Khu vực nào hiển thị nội dung hoặc công thức của ô đang chọn?",["Name Box","Formula Bar","Status Bar"],1,"Formula Bar hiển thị và cho phép sửa nội dung hoặc công thức của ô."],
    ["Name Box thường dùng để làm gì?",["Đi đến ô/vùng theo địa chỉ","Đổi tên Workbook","Tạo biểu đồ"],0,"Name Box cho phép nhập địa chỉ ô hoặc vùng để đi đến nhanh."],
    ["Thanh trạng thái (Status Bar) thường hiển thị thông tin nào?",["Tên file","Trạng thái tính toán và thống kê vùng chọn","Danh sách Worksheet"],1,"Status Bar có thể hiển thị Sum, Average, Count và trạng thái tính toán."]
   ],task:"Mở Excel, xác định Ribbon, Name Box, Formula Bar, vùng Worksheet và Status Bar; thử chọn một vùng có số để quan sát thống kê."},
   1:{questions:[
    ["Workbook là gì?",["Một ô dữ liệu","Tệp Excel chứa một hoặc nhiều Worksheet","Một công thức"],1,"Workbook là tệp Excel; bên trong có thể chứa nhiều Worksheet."],
    ["Worksheet được nhận biết ở đâu?",["Các tab Sheet phía dưới cửa sổ","Formula Bar","Status Bar"],0,"Worksheet được chọn qua các tab Sheet."],
    ["Muốn đổi tên Worksheet, thao tác phù hợp là gì?",["Nhấp đúp tab Sheet rồi nhập tên","Sửa Name Box","Nhấn Delete"],0,"Có thể nhấp đúp tab Sheet hoặc dùng menu Rename."]
   ],task:"Tạo Workbook mới, đổi tên ít nhất hai Sheet, thêm một Sheet và lưu file."},
   2:{questions:[
    ["Địa chỉ B3 chỉ điều gì?",["Cột B, dòng 3","Dòng B, cột 3","Vùng B đến 3"],0,"Địa chỉ ô gồm chữ cột và số dòng."],
    ["Vùng B2:D5 gồm bao nhiêu cột?",["2","3","4"],1,"B, C và D là ba cột."],
    ["Địa chỉ tuyệt đối của ô A1 là gì?",["A1","$A$1","A$1"],1,"Dấu $ trước cột và dòng khóa cả hai thành phần."]
   ],task:"Chọn các ô A1, C5 và vùng B2:D5; đọc địa chỉ trên Name Box và xác định số dòng/cột của vùng."},
   3:{questions:[
    ["Muốn chọn một ô, thao tác chuột cơ bản là gì?",["Nhấp chuột trái vào ô","Nhấp chuột phải vào thanh tiêu đề","Nhấp đúp tab Sheet"],0,"Nhấp chuột trái chọn ô."],
    ["Muốn chọn cả cột C, nên bấm vào đâu?",["Ô C1","Tiêu đề chữ C","Formula Bar"],1,"Bấm tiêu đề cột để chọn toàn bộ cột."],
    ["Khi kéo chọn vùng, điểm kết thúc cần được xác định thế nào?",["Theo ô cuối cùng cần thao tác","Theo mép cửa sổ","Theo thanh cuộn"],0,"Vùng chọn phải bao gồm đúng ô đầu và ô cuối dự định thao tác."]
   ],task:"Dùng chuột chọn một ô, một vùng liên tục, toàn bộ một dòng và toàn bộ một cột."},
   4:{questions:[
    ["Muốn sửa nội dung ô mà không thay toàn bộ bằng dữ liệu mới, có thể dùng phím nào?",["F2","F12","Esc"],0,"F2 đưa ô vào chế độ chỉnh sửa."],
    ["Phím Delete trên bàn phím thường làm gì với ô đang chọn?",["Xóa cả Worksheet","Xóa nội dung ô","Xóa Workbook"],1,"Delete xóa nội dung ô, không xóa cả dòng hoặc cột."],
    ["Muốn xác nhận nội dung vừa nhập và chuyển xuống ô dưới, dùng phím nào?",["Enter","Ctrl","Alt"],0,"Enter xác nhận dữ liệu và thường di chuyển xuống ô dưới."]
   ],task:"Nhập dữ liệu vào vài ô, sửa một ô bằng F2, xóa nội dung một ô bằng Delete và kiểm tra các ô khác không bị ảnh hưởng."},
   6:{questions:[
    ["Định dạng Percentage biến giá trị 0.25 thành cách hiển thị nào?",["0.25%","25%","2500%"],1,"0.25 khi định dạng Percentage hiển thị là 25%."],
    ["Để hiển thị số tiền có dấu phân cách hàng nghìn, nhóm định dạng phù hợp là gì?",["Number hoặc Currency","Text","Date"],0,"Number/Currency phù hợp với dữ liệu số và tiền."],
    ["Định dạng ngày tháng có luôn biến chuỗi Text thành ngày thật không?",["Có, luôn luôn","Không, cần kiểm tra kiểu dữ liệu","Chỉ khi tô màu"],1,"Đổi định dạng hiển thị không đảm bảo chuyển chuỗi thành ngày số sê-ri."]
   ],task:"Định dạng một cột số, một cột ngày và một cột phần trăm; kiểm tra giá trị gốc và cách hiển thị."},
   7:{questions:[
    ["Lệnh nào giúp điều chỉnh độ rộng cột vừa nội dung?",["AutoFit Column Width","Merge & Center","Wrap Text"],0,"AutoFit điều chỉnh độ rộng theo nội dung."],
    ["Wrap Text có tác dụng gì?",["Tự xuống dòng trong ô","Xóa nội dung thừa","Tạo công thức"],0,"Wrap Text hiển thị nội dung trên nhiều dòng trong cùng ô."],
    ["Khi trình bày bảng, nên ưu tiên điều gì?",["Màu sắc càng nhiều càng tốt","Phân cấp tiêu đề và tính dễ đọc","Gộp tất cả ô"],1,"Bố cục rõ ràng và nhất quán giúp đọc dữ liệu dễ hơn."]
   ],task:"Định dạng một bảng nhỏ: tiêu đề, căn lề, độ rộng cột, Wrap Text và đường viền vừa đủ."},
   8:{questions:[
    ["Ctrl+C và Ctrl+V thực hiện việc gì?",["Di chuyển dữ liệu","Sao chép rồi dán dữ liệu","Xóa dữ liệu"],1,"Copy tạo bản sao, Paste đặt bản sao ở vị trí đích."],
    ["Fill Handle nằm ở đâu?",["Góc dưới bên phải vùng chọn","Trên Formula Bar","Ở tab Sheet"],0,"Fill Handle là chốt nhỏ ở góc dưới bên phải vùng chọn."],
    ["Muốn tạo dãy 1, 2, 3... bằng Fill Handle, nên làm gì?",["Chỉ nhập số 1 rồi kéo","Nhập 1 và 2, chọn cả hai rồi kéo","Nhập chữ A"],1,"Hai giá trị đầu giúp Excel nhận diện quy luật chuỗi."]
   ],task:"Sao chép một vùng nhỏ và dùng Fill Handle tạo dãy số hoặc ngày; kiểm tra vùng nguồn không bị thay đổi."},
   9:{questions:[
    ["Định dạng .xlsx phù hợp với loại Workbook nào?",["Workbook thông thường","Workbook có Macro cần giữ mã VBA","Tệp PDF"],0,".xlsx là định dạng Workbook thông thường, không lưu mã VBA."],
    ["Nếu Workbook có Macro cần giữ mã VBA, nên lưu dạng nào?",[".xlsx",".xlsm",".csv"],1,".xlsm hỗ trợ lưu Macro VBA."],
    ["Sau Save As, nên kiểm tra điều gì?",["Thư mục, tên và phần mở rộng","Màu nền Desktop","Độ sáng màn hình"],0,"Kiểm tra vị trí, tên file và định dạng giúp tránh lưu sai."]
   ],task:"Lưu một bản sao Workbook với tên rõ ràng; xác nhận thư mục và phần mở rộng file."},
   10:{questions:[
    ["Print Area dùng để làm gì?",["Chọn vùng sẽ in","Đổi tên Sheet","Lọc dữ liệu"],0,"Print Area xác định vùng dữ liệu đưa vào bản in."],
    ["Khi bảng có nhiều cột, hướng giấy nào thường phù hợp hơn?",["Portrait","Landscape","Không cần chọn"],1,"Landscape thường phù hợp bảng rộng."],
    ["Bước nào nên làm trước khi xuất PDF?",["Kiểm tra Print Preview","Xóa dữ liệu nguồn","Đóng Workbook ngay"],0,"Print Preview giúp phát hiện cột bị cắt, chữ quá nhỏ và sai số trang."]
   ],task:"Thiết lập vùng in, chọn khổ giấy và hướng giấy; kiểm tra Print Preview rồi xuất một bản PDF thử."}
  };
  var config=bank[lessonIndex];if(!config)return;
  var key='avp_checkpoint_local_v1_C1L'+String(lessonIndex+1).padStart(2,'0'),saved={};
  try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(e){}
  var wrap=document.createElement('section');wrap.className='avp-lesson-checkpoint';wrap.setAttribute('aria-labelledby','avp-checkpoint-title');
  var head=document.createElement('div');head.className='avp-checkpoint-head';
  var eyebrow=document.createElement('small');eyebrow.textContent='CHECKPOINT TỰ ĐÁNH GIÁ · CHƯƠNG 01 / BÀI '+String(lessonIndex+1).padStart(2,'0');
  var title=document.createElement('h4');title.id='avp-checkpoint-title';title.textContent='Kiểm tra trước khi chuyển bài';
  var intro=document.createElement('p');intro.textContent='Trả lời đủ 3 câu hỏi và tự thực hiện nhiệm vụ bên dưới. Cần đúng ít nhất 2 câu để đạt checkpoint kiến thức.';
  head.append(eyebrow,title,intro);wrap.appendChild(head);
  var form=document.createElement('div');form.className='avp-checkpoint-questions';
  config.questions.forEach(function(q,i){
   var field=document.createElement('fieldset');field.className='avp-checkpoint-question';
   var legend=document.createElement('legend');legend.textContent=(i+1)+'. '+q[0];field.appendChild(legend);
   q[1].forEach(function(opt,k){
    var label=document.createElement('label');label.className='avp-checkpoint-option';
    var input=document.createElement('input');input.type='radio';input.name='avp-checkpoint-q'+i;input.value=String(k);
    if(saved.answers&&Number(saved.answers[i])===k)input.checked=true;
    var span=document.createElement('span');span.textContent=opt;label.append(input,span);field.appendChild(label);
   });form.appendChild(field);
  });wrap.appendChild(form);
  var task=document.createElement('div');task.className='avp-checkpoint-task';
  var taskTitle=document.createElement('strong');taskTitle.textContent='NHIỆM VỤ THỰC HÀNH';
  var taskText=document.createElement('p');taskText.textContent=config.task;task.append(taskTitle,taskText);wrap.appendChild(task);
  var practice=document.createElement('label');practice.className='avp-checkpoint-practice';
  var check=document.createElement('input');check.type='checkbox';check.checked=!!saved.practice;
  var labelText=document.createElement('span');labelText.textContent='Tôi đã tự thực hiện nhiệm vụ trên Excel và kiểm tra kết quả.';
  practice.append(check,labelText);wrap.appendChild(practice);
  var actions=document.createElement('div');actions.className='avp-checkpoint-actions';
  var submit=document.createElement('button');submit.type='button';submit.className='avp-checkpoint-submit';submit.textContent='Kiểm tra checkpoint';
  var reset=document.createElement('button');reset.type='button';reset.className='avp-checkpoint-reset';reset.textContent='Làm lại';
  actions.append(submit,reset);wrap.appendChild(actions);
  var result=document.createElement('div');result.className='avp-checkpoint-result';result.setAttribute('role','status');result.setAttribute('aria-live','polite');wrap.appendChild(result);
  if(saved.passed){result.className='avp-checkpoint-result is-pass';result.textContent='Đã PASS checkpoint tự đánh giá trên thiết bị này. Bạn có thể xem lại hoặc làm lại.';}
  submit.addEventListener('click',function(){
   var answers=[],score=0,missing=false;
   config.questions.forEach(function(q,i){var chosen=form.querySelector('input[name="avp-checkpoint-q'+i+'"]:checked');if(!chosen){missing=true;answers.push(null);}else{var value=Number(chosen.value);answers.push(value);if(value===q[2])score++;}});
   if(missing){result.className='avp-checkpoint-result is-error';result.textContent='Hãy trả lời đủ 3 câu trước khi kiểm tra.';return;}
   if(!check.checked){result.className='avp-checkpoint-result is-error';result.textContent='Hãy hoàn thành nhiệm vụ thực hành rồi xác nhận.';return;}
   saved={answers:answers,practice:true,score:score,passed:score>=2,completedAt:new Date().toISOString(),source:'local-self-check'};
   try{localStorage.setItem(key,JSON.stringify(saved));}catch(e){}
   if(saved.passed){result.className='avp-checkpoint-result is-pass';result.textContent='PASS · Đúng '+score+'/3 câu. Đã lưu trên thiết bị này; phần thực hành do bạn tự xác nhận.';}
   else{result.className='avp-checkpoint-result is-error';result.textContent='Chưa đạt · Đúng '+score+'/3 câu. Xem lại bài và thử lại.';}
  });
  reset.addEventListener('click',function(){form.querySelectorAll('input[type="radio"]').forEach(function(input){input.checked=false;});check.checked=false;saved={};try{localStorage.removeItem(key);}catch(e){}result.className='avp-checkpoint-result';result.textContent='Đã xóa kết quả checkpoint trên thiết bị này.';});
  var style=document.createElement('style');style.textContent='.avp-lesson-checkpoint{margin:22px 0;padding:20px;border:1px solid #dce9e0;border-radius:18px;background:#f8fbf8;color:#173b29}.avp-checkpoint-head small{font-size:10px;font-weight:800;letter-spacing:.1em;color:#32805a}.avp-checkpoint-head h4{margin:7px 0;font-size:18px}.avp-checkpoint-head p,.avp-checkpoint-task p{margin:0 0 14px;color:#52675a;font-size:13px;line-height:1.6}.avp-checkpoint-question{margin:12px 0;padding:13px;border:1px solid #e1e9e3;border-radius:12px;background:#fff}.avp-checkpoint-question legend{padding:0 4px;font-size:13px;font-weight:700;line-height:1.5}.avp-checkpoint-option{display:flex;align-items:center;gap:9px;margin:10px 0;font-size:13px;cursor:pointer}.avp-checkpoint-option input,.avp-checkpoint-practice input{accent-color:#16784d}.avp-checkpoint-task{padding:13px;border-radius:12px;background:#edf5ef;margin:12px 0}.avp-checkpoint-task strong{font-size:11px;letter-spacing:.06em}.avp-checkpoint-practice{display:flex;align-items:flex-start;gap:9px;margin:15px 0;font-size:12px;line-height:1.55}.avp-checkpoint-practice input{margin-top:3px}.avp-checkpoint-actions{display:flex;gap:9px;flex-wrap:wrap}.avp-checkpoint-actions button{border:0;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer}.avp-checkpoint-submit{background:#08794d;color:white}.avp-checkpoint-reset{background:#e7eee9;color:#345744}.avp-checkpoint-result{margin-top:12px;font-size:13px;line-height:1.55}.avp-checkpoint-result.is-pass{color:#08794d;font-weight:700}.avp-checkpoint-result.is-error{color:#a34232;font-weight:700}@media(max-width:600px){.avp-lesson-checkpoint{padding:15px}.avp-checkpoint-question{padding:11px}}';
  wrap.appendChild(style);panel.querySelector('.avp-lesson-main').appendChild(wrap);
 }
 function renderChapterOneLesson(lessonIndex){
  if(!lessonPanel||lessonIndex<0||lessonIndex>=chapterLessons[0].length)return;
  if(!window.AVP_LESSON_PROCEDURES_V2){
   lessonPanel.innerHTML='<div class="avp-lesson-main"><p>Đang tải hướng dẫn thao tác chi tiết…</p></div>';
   var script=document.getElementById('avp-lesson-procedures-v2-script');
   if(!script){
    script=document.createElement('script');script.id='avp-lesson-procedures-v2-script';script.src='chapter-lesson-procedures-v2.js?v=2';
    script.onload=function(){renderChapterOneLesson(lessonIndex);};
    script.onerror=function(){lessonPanel.innerHTML='<div class="avp-lesson-main"><h3>Không tải được hướng dẫn bài học</h3><p>Hãy tải lại trang sau ít phút.</p></div>';};
    document.head.appendChild(script);
   }else{script.addEventListener('load',function(){renderChapterOneLesson(lessonIndex);},{once:true});}
   return;
  }
  var p=window.AVP_LESSON_PROCEDURES_V2.find(function(item){return item.id==='C1L'+String(lessonIndex+1).padStart(2,'0');});
  if(!p)return;
  var title=chapterLessons[0][lessonIndex],no=String(lessonIndex+1).padStart(2,'0');
  lessonPanel.innerHTML='<div class="avp-chapter-lessons-toolbar avp-lesson-reader-back"><button type="button" class="avp-chapter-lessons-back" data-back-lessons>← Danh sách bài học</button><span class="avp-chapter-lessons-count">CHƯƠNG 01 · BÀI '+no+'</span></div><article class="avp-lesson-main"><div class="avp-lesson-kicker">BÀI HỌC '+no+' · NHẬP MÔN EXCEL</div><h3></h3><h4>MỤC TIÊU</h4><p class="avp-c1-goal"></p><section class="avp-lesson-procedure-v2"><h4>HƯỚNG DẪN THAO TÁC TỪNG BƯỚC</h4><ol class="avp-c1-steps"></ol><h4>DÙNG CHUỘT NÀO, BẤM Ở ĐÂU?</h4><p class="avp-procedure-mouse"></p><h4>KẾT QUẢ CẦN NHÌN THẤY</h4><p class="avp-c1-expected"></p><h4>MỞ RỘNG VÀ ÁP DỤNG THỰC TẾ</h4><p class="avp-c1-practice"></p><h4>LỖI CẦN TRÁNH</h4><p class="avp-c1-errors"></p></section></article>';
  lessonPanel.querySelector('[data-back-lessons]').addEventListener('click',function(){renderChapterLessons(0);});
  lessonPanel.querySelector('.avp-lesson-main h3').textContent=title;
  lessonPanel.querySelector('.avp-c1-goal').textContent=p.goal;
  p.steps.forEach(function(step){var li=document.createElement('li');li.textContent=step;lessonPanel.querySelector('.avp-c1-steps').appendChild(li);});
  lessonPanel.querySelector('.avp-procedure-mouse').textContent=p.mouse;
  lessonPanel.querySelector('.avp-c1-expected').textContent=p.expected;
  lessonPanel.querySelector('.avp-c1-practice').textContent=p.practice;
  lessonPanel.querySelector('.avp-c1-errors').textContent=p.errors;
  renderLessonLibraryRefs(lessonPanel,0,lessonIndex);
  if(lessonIndex!==5)mountChapterOneCheckpoint(lessonPanel,lessonIndex);
 }
 function renderChapterFiveToTwelveLesson(chapterIndex,lessonIndex){
  if(!lessonPanel||chapterIndex<4||chapterIndex>11)return;
  if(!window.AVP_LESSON_PROCEDURES_CH5_12){
   lessonPanel.innerHTML='<div class="avp-lesson-main"><p>Đang tải nội dung hướng dẫn chi tiết…</p></div>';
   var script=document.getElementById('avp-lesson-procedures-ch5-12-script');
   if(!script){
    script=document.createElement('script');script.id='avp-lesson-procedures-ch5-12-script';script.src='chapter-lesson-procedures-ch5-12.js?v=1';
    script.onload=function(){renderChapterFiveToTwelveLesson(chapterIndex,lessonIndex);};
    script.onerror=function(){lessonPanel.innerHTML='<div class="avp-lesson-main"><h3>Không tải được nội dung bài học</h3><p>Hãy tải lại trang sau ít phút. Nội dung bài chưa bị thay đổi.</p></div>';};
    document.head.appendChild(script);
   }else{script.addEventListener('load',function(){renderChapterFiveToTwelveLesson(chapterIndex,lessonIndex);},{once:true});}
   return;
  }
  var p=window.AVP_LESSON_PROCEDURES_CH5_12.find(function(item){return item.id==='C'+(chapterIndex+1)+'L'+String(lessonIndex+1).padStart(2,'0');});
  if(!p)return;
  var title=chapterLessons[chapterIndex][lessonIndex],no=String(lessonIndex+1).padStart(2,'0');
  lessonPanel.innerHTML='<div class="avp-chapter-lessons-toolbar avp-lesson-reader-back"><button type="button" class="avp-chapter-lessons-back" data-back-lessons>← Danh sách bài học</button><span class="avp-chapter-lessons-count">CHƯƠNG '+String(chapterIndex+1).padStart(2,'0')+' · BÀI '+no+'</span></div><article class="avp-lesson-main"><div class="avp-lesson-kicker">BÀI HỌC '+no+' · CHƯƠNG '+String(chapterIndex+1).padStart(2,'0')+'</div><h3></h3><h4>MỤC TIÊU BÀI HỌC</h4><p class="avp-adv-goal"></p><section class="avp-lesson-procedure-v2"><h4>KIẾN THỨC CỐT LÕI</h4><p class="avp-adv-concept"></p><h4>VÍ DỤ MINH HỌA</h4><div class="avp-lesson-example avp-adv-example"></div><h4>HƯỚNG DẪN THAO TÁC TỪNG BƯỚC</h4><ol class="avp-adv-steps"></ol><h4>DÙNG CHUỘT NÀO, BẤM Ở ĐÂU?</h4><p class="avp-procedure-mouse"></p><h4>KẾT QUẢ CẦN NHÌN THẤY</h4><p class="avp-adv-expected"></p><h4>MỞ RỘNG VÀ ÁP DỤNG THỰC TẾ</h4><p class="avp-adv-practice"></p><h4>LỖI THƯỜNG GẶP CẦN TRÁNH</h4><p class="avp-adv-errors"></p><h4>TỰ KIỂM TRA</h4><p class="avp-adv-selfcheck"></p><details class="avp-lesson-answer"><summary>Xem đáp án và tiêu chí PASS</summary><p class="avp-adv-answer"></p><p><strong>Tiêu chí PASS:</strong> <span class="avp-adv-pass"></span></p></details></section></article>';
  lessonPanel.querySelector('[data-back-lessons]').addEventListener('click',function(){renderChapterLessons(chapterIndex);});
  lessonPanel.querySelector('.avp-lesson-main h3').textContent=title;
  lessonPanel.querySelector('.avp-adv-goal').textContent=p.goal;
  lessonPanel.querySelector('.avp-adv-concept').textContent=p.concept||'Phần kiến thức cốt lõi đang được bổ sung.';
  lessonPanel.querySelector('.avp-adv-example').textContent=p.example||'';
  lessonPanel.querySelector('.avp-adv-selfcheck').textContent=p.selfCheck||'Tự giải thích lại thao tác và kết quả vừa thực hiện.';
  lessonPanel.querySelector('.avp-adv-answer').textContent=p.answer||'Đối chiếu kết quả với mục tiêu và ví dụ của bài.';
  lessonPanel.querySelector('.avp-adv-pass').textContent=p.passCriteria||'Thực hiện đúng thao tác và giải thích được kết quả.';
  p.steps.forEach(function(step){var li=document.createElement('li');li.textContent=step;lessonPanel.querySelector('.avp-adv-steps').appendChild(li);});
  lessonPanel.querySelector('.avp-procedure-mouse').textContent=p.mouse;
  lessonPanel.querySelector('.avp-adv-expected').textContent=p.expected;
  lessonPanel.querySelector('.avp-adv-practice').textContent=p.practice;
  lessonPanel.querySelector('.avp-adv-errors').textContent=p.errors;
  renderLessonLibraryRefs(lessonPanel,chapterIndex,lessonIndex);
  mountChapterCheckpoint(lessonPanel,chapterIndex,lessonIndex,p);
 }
 function renderDataTypesLesson(){
  if(!lessonPanel)return;
  lessonPanel.innerHTML='<div class="avp-chapter-lessons-toolbar avp-lesson-reader-back"><button type="button" class="avp-chapter-lessons-back" data-back-lessons>← Danh sách bài học</button><span class="avp-chapter-lessons-count">CHƯƠNG 01 · BÀI 06</span></div><div class="avp-lesson-reader"><article class="avp-lesson-main"><div class="avp-lesson-kicker">BÀI HỌC 06 · NHẬP MÔN EXCEL</div><h3>Kiểu dữ liệu: Text, Number, Date và Percentage</h3><p>Một ô Excel không chỉ có phần hiển thị. Bên trong, Excel lưu giá trị theo kiểu dữ liệu. Nhận diện đúng kiểu dữ liệu giúp tính toán, lọc, sắp xếp và tổng hợp chính xác.</p><h4>1. Number – dữ liệu số</h4><p>Dùng cho giá trị cần tính toán như số lượng, đơn giá, doanh thu hoặc điểm số.</p><div class="avp-lesson-example"><b>Ví dụ:</b> 1250 là một giá trị số. Có thể cộng, trừ, nhân, chia và dùng trong các hàm thống kê.</div><h4>2. Text – dữ liệu văn bản</h4><p>Dùng cho nội dung nhận diện hoặc mô tả. Mã nhân viên, mã hàng và số điện thoại thường nên lưu dạng Text, kể cả khi chỉ gồm chữ số.</p><div class="avp-lesson-example"><b>Ví dụ:</b> Mã 00125 cần giữ số 0 đầu. Nếu lưu thành Number, Excel có thể chỉ giữ 125.</div><h4>3. Date – dữ liệu ngày tháng</h4><p>Ngày hợp lệ trong Excel được lưu dưới dạng số sê-ri và có thể dùng để tính số ngày, lọc theo tháng hoặc nhóm trong PivotTable. Chuỗi ký tự trông giống ngày chưa chắc là ngày thật.</p><div class="avp-lesson-example"><b>Kiểm tra:</b> =ISNUMBER(A2) giúp kiểm tra giá trị ngày có đang được lưu dưới dạng số hay không.</div><h4>4. Percentage – dữ liệu tỷ lệ</h4><p>Tỷ lệ phần trăm được lưu dưới dạng số thập phân. Giá trị 0.15 khi định dạng Percentage sẽ hiển thị là 15 phần trăm.</p><div class="avp-lesson-example"><b>Lưu ý:</b> Nhập 15 rồi áp dụng Percentage sẽ hiển thị 1500 phần trăm. Không nhân thêm 100 nếu dữ liệu đã lưu ở dạng 0.15.</div><h4>Ghi nhớ</h4><p>Định dạng hiển thị không phải lúc nào cũng thay đổi kiểu dữ liệu gốc. Trước khi sửa dữ liệu, hãy kiểm tra giá trị thực và mục đích sử dụng của cột.</p><h4>Tài liệu tham khảo mở rộng</h4><p>Các chủ đề dưới đây thuộc Thư viện Định dạng & dữ liệu độc lập. Mở tham khảo ngay tại đây, sau đó đóng bảng để quay lại đúng bài học.</p><div class="avp-lesson-ref-list"><button class="avp-lesson-ref" type="button" data-ref-topic="DF01"><span>▦</span><span><strong>Phân biệt Number và Text</strong><small>Thư viện · Kiểu dữ liệu</small></span><b>→</b></button><button class="avp-lesson-ref" type="button" data-ref-topic="DF02"><span>▦</span><span><strong>Nhận diện ngày thật và ngày dạng Text</strong><small>Thư viện · Kiểu dữ liệu</small></span><b>→</b></button></div><h4>Tự kiểm tra</h4><p>1. Mã nhân viên 00045 nên lưu dạng gì? 2. Giá trị nào hiển thị thành 25 phần trăm khi áp dụng Percentage: 0.25 hay 25?</p><div class="avp-lesson-example"><b>Đáp án:</b> 1. Text. 2. 0.25. Hãy tự giải thích lý do trước khi xem đáp án.</div></article></div><div class="avp-lesson-drawer" aria-hidden="true"><section class="avp-lesson-drawer-panel" role="dialog" aria-modal="true" aria-label="Tài liệu tham khảo"><div class="avp-lesson-drawer-head"><small>THƯ VIỆN ĐỊNH DẠNG & DỮ LIỆU</small><button type="button" class="avp-lesson-drawer-close" aria-label="Đóng tài liệu">×</button></div><div class="avp-lesson-drawer-content"><div class="avp-lesson-drawer-loading">Đang tải chủ đề tham khảo…</div></div></section></div>';
  // Checkpoint thử nghiệm cho C1L06. Đây là bài kiểm tra kiến thức + tự xác nhận thực hành,
  // chưa được dùng làm bằng chứng năng lực hoặc cộng vào tiến độ tổng.
  (function mountC1L06Checkpoint(){
   var key='avp_checkpoint_local_v1_C1L06';
   var questions=[
    {q:'Mã nhân viên 00045 cần lưu theo kiểu dữ liệu nào để giữ số 0 ở đầu?',opts:['Number','Text','Percentage'],answer:1,why:'Mã nhận diện cần giữ nguyên ký tự, vì vậy nên lưu dạng Text.'},
    {q:'Muốn ô hiển thị 25% bằng định dạng Percentage, giá trị số gốc phù hợp là gì?',opts:['25','0.25','250'],answer:1,why:'Excel lưu tỷ lệ 25% dưới dạng số thập phân 0.25.'},
    {q:'Trong ngữ cảnh kiểm tra một ngày Excel thật ở A2, công thức nào giúp kiểm tra giá trị có phải số sê-ri không?',opts:['=ISNUMBER(A2)','=ISTEXT(A2)','=LEN(A2)'],answer:0,why:'Ngày Excel thật được lưu dưới dạng số sê-ri; ISNUMBER kiểm tra giá trị có phải số hay không.'}
   ];
   var saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(e){}
   var wrap=document.createElement('section');wrap.className='avp-lesson-checkpoint';wrap.setAttribute('aria-labelledby','avp-c1l06-checkpoint-title');
   var head=document.createElement('div');head.className='avp-checkpoint-head';
   var eyebrow=document.createElement('small');eyebrow.textContent='CHECKPOINT KIẾN THỨC · CHƯƠNG 01 / BÀI 06';
   var title=document.createElement('h4');title.id='avp-c1l06-checkpoint-title';title.textContent='Kiểm tra trước khi chuyển bài';
   var intro=document.createElement('p');intro.textContent='Trả lời 3 câu hỏi và tự xác nhận đã thử thao tác trên Excel. Cần đúng ít nhất 2 câu để hoàn thành checkpoint thử nghiệm.';
   head.append(eyebrow,title,intro);wrap.appendChild(head);
   var form=document.createElement('div');form.className='avp-checkpoint-questions';
   questions.forEach(function(q,i){
    var field=document.createElement('fieldset');field.className='avp-checkpoint-question';
    var legend=document.createElement('legend');legend.textContent=(i+1)+'. '+q.q;field.appendChild(legend);
    q.opts.forEach(function(opt,k){
     var label=document.createElement('label');label.className='avp-checkpoint-option';
     var input=document.createElement('input');input.type='radio';input.name='avp-c1l06-q'+i;input.value=String(k);
     if(saved.answers&&Number(saved.answers[i])===k)input.checked=true;
     var span=document.createElement('span');span.textContent=opt;label.append(input,span);field.appendChild(label);
    });
    form.appendChild(field);
   });
   wrap.appendChild(form);
   var practice=document.createElement('label');practice.className='avp-checkpoint-practice';
   var practiceInput=document.createElement('input');practiceInput.type='checkbox';practiceInput.checked=!!saved.practice;
   var practiceText=document.createElement('span');practiceText.textContent='Tôi đã tự thử trên Excel: lưu mã 00045 dạng Text, nhập 0.25 và định dạng Percentage, kiểm tra ngày bằng ISNUMBER.';
   practice.append(practiceInput,practiceText);wrap.appendChild(practice);
   var actions=document.createElement('div');actions.className='avp-checkpoint-actions';
   var submit=document.createElement('button');submit.type='button';submit.className='avp-checkpoint-submit';submit.textContent='Kiểm tra checkpoint';
   var reset=document.createElement('button');reset.type='button';reset.className='avp-checkpoint-reset';reset.textContent='Làm lại';
   actions.append(submit,reset);wrap.appendChild(actions);
   var result=document.createElement('div');result.className='avp-checkpoint-result';result.setAttribute('role','status');result.setAttribute('aria-live','polite');wrap.appendChild(result);
   function restoreResult(){
    if(saved.passed){result.textContent='Đã PASS checkpoint thử nghiệm trên thiết bị này. Bạn có thể xem lại hoặc làm lại.';result.classList.add('is-pass');}
   }
   restoreResult();
   submit.addEventListener('click',function(){
    var answers=[],score=0,missing=false;
    questions.forEach(function(q,i){var chosen=form.querySelector('input[name="avp-c1l06-q'+i+'"]:checked');if(!chosen){missing=true;answers.push(null);}else{var value=Number(chosen.value);answers.push(value);if(value===q.answer)score++;}});
    if(missing){result.className='avp-checkpoint-result is-error';result.textContent='Hãy trả lời đủ 3 câu trước khi kiểm tra.';return;}
    if(!practiceInput.checked){result.className='avp-checkpoint-result is-error';result.textContent='Bạn cần hoàn thành thao tác thực hành trên Excel và tích xác nhận trước khi PASS.';return;}
    if(score>=2){
     saved={answers:answers,practice:true,score:score,passed:true,completedAt:new Date().toISOString(),source:'local-self-check'};
     try{localStorage.setItem(key,JSON.stringify(saved));}catch(e){}
     result.className='avp-checkpoint-result is-pass';result.textContent='PASS · Đúng '+score+'/3 câu. Đã lưu trạng thái trên thiết bị này. Đây chưa phải xác nhận năng lực được máy chấm.';
    }else{
     saved={answers:answers,practice:true,score:score,passed:false,source:'local-self-check'};
     try{localStorage.setItem(key,JSON.stringify(saved));}catch(e){}
     result.className='avp-checkpoint-result is-error';result.textContent='Chưa đạt · Đúng '+score+'/3 câu. Hãy xem lại nội dung rồi thử lại.';
    }
   });
   reset.addEventListener('click',function(){
    form.querySelectorAll('input[type="radio"]').forEach(function(input){input.checked=false;});practiceInput.checked=false;saved={};
    try{localStorage.removeItem(key);}catch(e){}
    result.className='avp-checkpoint-result';result.textContent='Đã xóa kết quả checkpoint trên thiết bị này.';
   });
   var style=document.createElement('style');style.textContent='.avp-lesson-checkpoint{margin:22px 0;padding:20px;border:1px solid #dce9e0;border-radius:18px;background:#f8fbf8;color:#173b29}.avp-checkpoint-head small{font-size:10px;font-weight:800;letter-spacing:.1em;color:#32805a}.avp-checkpoint-head h4{margin:7px 0;font-size:18px}.avp-checkpoint-head p{margin:0 0 16px;color:#52675a;font-size:13px;line-height:1.6}.avp-checkpoint-question{margin:12px 0;padding:13px;border:1px solid #e1e9e3;border-radius:12px;background:#fff}.avp-checkpoint-question legend{padding:0 4px;font-size:13px;font-weight:700;line-height:1.5}.avp-checkpoint-option{display:flex;align-items:center;gap:9px;margin:10px 0;font-size:13px;cursor:pointer}.avp-checkpoint-option input,.avp-checkpoint-practice input{accent-color:#16784d}.avp-checkpoint-practice{display:flex;align-items:flex-start;gap:9px;margin:15px 0;font-size:12px;line-height:1.55}.avp-checkpoint-practice input{margin-top:3px}.avp-checkpoint-actions{display:flex;gap:9px;flex-wrap:wrap}.avp-checkpoint-actions button{border:0;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer}.avp-checkpoint-submit{background:#08794d;color:white}.avp-checkpoint-reset{background:#e7eee9;color:#345744}.avp-checkpoint-result{margin-top:12px;font-size:13px;line-height:1.55}.avp-checkpoint-result.is-pass{color:#08794d;font-weight:700}.avp-checkpoint-result.is-error{color:#a34232;font-weight:700}@media(max-width:600px){.avp-lesson-checkpoint{padding:15px}.avp-checkpoint-question{padding:11px}}';
   wrap.appendChild(style);lessonPanel.querySelector('.avp-lesson-reader').appendChild(wrap);
  })();
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


 function lessonLibraryPlan(chapterIndex,lessonIndex){
  var chapterOne=[
   [["knowledge","K001"],["knowledge","K002"]],[["knowledge","K001"]],[["knowledge","K002"],["knowledge","K003"]],
   [["knowledge","K002"],["knowledge","K003"]],[["knowledge","K006"]],[["knowledge","K006"],["knowledge","K007"]],
   [["knowledge","K003"],["format","DF05"],["format","DF06"],["format","DF07"],["format","DF08"]],[["knowledge","K050"],["knowledge","K048"]],[["knowledge","K001"]],
   [["knowledge","K003"]],[["knowledge","K003"],["knowledge","K001"]],[["knowledge","K001"],["knowledge","K002"],["knowledge","K003"]]
  ];
  if(chapterIndex===0)return chapterOne[lessonIndex]||[];

  var plans={
   1:[
    [["shortcut","Ctrl+G"],["shortcut","Ctrl+End"]],[["shortcut","Ctrl+Shift+*"],["shortcut","Ctrl+Space"],["shortcut","Shift+Space"]],
    [["shortcut","Ctrl+C"],["shortcut","Ctrl+X"],["shortcut","Ctrl+V"]],[["knowledge","K048"]],
    [["shortcut","Ctrl+Z"],["shortcut","Ctrl+Y"]],[["shortcut","Ctrl+F"],["shortcut","Ctrl+H"]],
    [["knowledge","K049"]],[["knowledge","K050"],["shortcut","Ctrl+D"],["shortcut","Ctrl+R"]],
    [["knowledge","K051"]],[["knowledge","K026"],["knowledge","K027"],["shortcut","Ctrl+Shift+L"],["format","DF19"]],
    [["shortcut","Ctrl+G"],["shortcut","Ctrl+Shift+*"],["shortcut","Ctrl+F"]],
    [["shortcut","Ctrl+Shift+L"],["shortcut","Ctrl+D"],["shortcut","Ctrl+Z"],["format","DF19"]]
   ],
   2:[
    [["knowledge","K016"],["knowledge","K017"]],[["knowledge","K016"]],[["knowledge","K012"]],[["knowledge","K013"]],[["knowledge","K014"]],
    [["knowledge","K012"],["knowledge","K013"],["knowledge","K014"]],[["formula","CONCAT"],["knowledge","K006"]],
    [["formula","ROUND"],["formula","ROUNDUP"],["formula","ROUNDDOWN"]],[["knowledge","K007"],["formula","DATE"],["formula","YEAR"],["formula","MONTH"],["format","DF02"],["format","DF08"]],
    [["formula","IF"]],[["formula","IFERROR"],["knowledge","K021"]],[["formula","IF"],["formula","ROUND"],["formula","DATE"]]
   ],
   3:[
    [["formula","SUM"],["formula","AVERAGE"]],[["formula","MIN"],["formula","MAX"],["formula","COUNT"]],
    [["formula","COUNTA"],["formula","COUNTBLANK"],["format","DF03"]],[["formula","IF"]],[["formula","AND"],["formula","OR"]],
    [["formula","SUMIF"]],[["formula","COUNTIF"]],[["formula","SUMIFS"],["formula","COUNTIFS"]],
    [["formula","IFERROR"]],[["formula","LEFT"],["formula","RIGHT"],["formula","MID"],["formula","LEN"]],
    [["formula","TRIM"],["formula","SUBSTITUTE"],["formula","TODAY"],["formula","YEAR"],["format","DF10"],["format","DF11"],["format","DF12"],["format","DF13"]],
    [["formula","SUMIFS"],["formula","COUNTIFS"],["formula","IFERROR"],["formula","LEFT"]]
   ]
  };
  if(chapterIndex>=4&&window.AVP_LESSON_PROCEDURES_CH5_12){
   var advanced=window.AVP_LESSON_PROCEDURES_CH5_12.find(function(item){return item.id==='C'+(chapterIndex+1)+'L'+String(lessonIndex+1).padStart(2,'0');});
   if(advanced&&advanced.library){
    return advanced.library.split(';').map(function(token){token=token.trim();if(!token)return null;
     if(/^K\d{3}$/.test(token))return ["knowledge",token];
     if(/^DF\d{2}$/.test(token))return ["format",token];
     if(/^(Ctrl|Alt|Shift|F[1-12]|Delete|Enter|Esc|Tab)/.test(token))return ["shortcut",token];
     return ["formula",token];
    }).filter(Boolean);
   }
  }
  return (plans[chapterIndex]&&plans[chapterIndex][lessonIndex])||[];
 }
 function ensureLessonLibraryData(type,done){
  var config={shortcut:["avp-shortcut-reference-script","excel-shortcut-library-data.js","AVP_SHORTCUT_BANK"],knowledge:["avp-knowledge-reference-script","excel-knowledge-library-data.js","AVP_KNOWLEDGE_BANK"],formula:["avp-formula-reference-script","excel-formula-library-data.js","AVP_FORMULA_BANK"],format:["avp-data-format-reference-script","excel-data-format-library-data.js","AVP_DATA_LIBRARY"]}[type];
  if(!config){done();return;} if(window[config[2]]){done();return;}
  var script=document.getElementById(config[0]);
  if(script){script.addEventListener('load',done,{once:true});script.addEventListener('error',done,{once:true});return;}
  script=document.createElement('script');script.id=config[0];script.src=config[1]+'?v=3';script.onload=done;script.onerror=done;document.head.appendChild(script);
 }
 function renderLessonLibraryRefs(panel,chapterIndex,lessonIndex){
  var plan=lessonLibraryPlan(chapterIndex,lessonIndex);if(!plan.length)return;
  var section=document.createElement('section');section.className='avp-lesson-library-section';
  section.innerHTML='<h4>TÀI LIỆU THAM KHẢO MỞ RỘNG</h4><p>Các chủ đề liên quan được mở ngay trong bài học. Đóng bảng tham khảo để tiếp tục đúng vị trí đang học.</p><div class="avp-lesson-ref-list"></div><div class="avp-lesson-drawer" aria-hidden="true"><section class="avp-lesson-drawer-panel" role="dialog" aria-modal="true" aria-label="Tài liệu tham khảo"><div class="avp-lesson-drawer-head"><small>THƯ VIỆN EXCEL · THAM KHẢO</small><button type="button" class="avp-lesson-drawer-close" aria-label="Đóng tài liệu">×</button></div><div class="avp-lesson-drawer-content"><div class="avp-lesson-drawer-loading">Chọn một chủ đề để xem nội dung.</div></div></section></div>';
  panel.appendChild(section);
  var list=section.querySelector('.avp-lesson-ref-list'),drawer=section.querySelector('.avp-lesson-drawer'),content=section.querySelector('.avp-lesson-drawer-content');
  var labels={shortcut:"Thư viện Phím tắt Excel",knowledge:"Thư viện Kiến thức Excel",formula:"Thư viện Hàm & công thức",format:"Thư viện Định dạng & dữ liệu"};
  function close(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');}
  section.querySelector('.avp-lesson-drawer-close').addEventListener('click',close);
  drawer.addEventListener('click',function(e){if(e.target===drawer)close();});
  plan.forEach(function(pair){
   var button=document.createElement('button');button.type='button';button.className='avp-lesson-ref';
   button.innerHTML='<span>▦</span><span><strong></strong><small></small></span><b>→</b>';
   button.querySelector('strong').textContent=pair[1];button.querySelector('small').textContent=labels[pair[0]];
   button.addEventListener('click',function(){
    drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');
    content.innerHTML='<div class="avp-lesson-drawer-loading">Đang tải chủ đề tham khảo…</div>';
    ensureLessonLibraryData(pair[0],function(){
     var rows=pair[0]==='shortcut'?window.AVP_SHORTCUT_BANK:pair[0]==='knowledge'?window.AVP_KNOWLEDGE_BANK:pair[0]==='formula'?window.AVP_FORMULA_BANK:(window.AVP_DATA_LIBRARY&&window.AVP_DATA_LIBRARY.items);
     var item=rows&&rows.find(function(x){return pair[0]==='shortcut'?x.key===pair[1]:pair[0]==='formula'?x.name===pair[1]:x.id===pair[1];});
     if(!item){content.innerHTML='<p>Chưa tìm thấy chủ đề này trong thư viện. <a href="'+(pair[0]==='shortcut'?'excel-shortcut-library.html':pair[0]==='knowledge'?'excel-knowledge-library.html':pair[0]==='format'?'excel-data-format-library.html':'excel-formula-library.html')+'" target="_blank" rel="noopener">Mở thư viện đầy đủ trong tab mới</a>.</p>';return;}
     var title=pair[0]==='shortcut'?item.name:pair[0]==='formula'?item.name:item.title;
     var summary=item.summary||item.description||item.concept||item.syntax||item.when||'';
     var blocks=[];
     function add(h,t){if(!t)return;blocks.push({h:h,t:Array.isArray(t)?t.join(' · '):String(t)});}
     add('TỔNG QUAN',summary);add(pair[0]==='shortcut'?'TÌNH HUỐNG':pair[0]==='formula'?'CÚ PHÁP':'BẢN CHẤT',item.scenario||item.syntax||item.principle||item.concept||item.when);
     add('VÍ DỤ',item.example||item.formula);add('QUY TẮC CẦN NHỚ',item.rules||item.misconception);add('TỰ KIỂM TRA',item.question||item.check);add('ĐÁP ÁN',item.answer);
     content.innerHTML='<h3></h3>';content.querySelector('h3').textContent=title;
     blocks.forEach(function(b){var h=document.createElement('h4');h.textContent=b.h;var p=document.createElement('p');p.textContent=b.t;content.append(h,p);});
     if(pair[0]==='formula'&&item.formula){var code=document.createElement('div');code.className='avp-lesson-drawer-example';code.textContent=item.formula;content.appendChild(code);}
     var link=document.createElement('p'),a=document.createElement('a');a.href=pair[0]==='shortcut'?'excel-shortcut-library.html':pair[0]==='knowledge'?'excel-knowledge-library.html':pair[0]==='format'?'excel-data-format-library.html':'excel-formula-library.html';a.target='_blank';a.rel='noopener';a.textContent='Mở toàn bộ '+labels[pair[0]]+' ↗';link.appendChild(a);content.appendChild(link);
    });
   });
   list.appendChild(button);
  });
 }
 function mountChapterCheckpoint(panel,chapterIndex,lessonIndex,procedure){
  if(!panel||!procedure||chapterIndex<1||chapterIndex>11)return;
  var chapter=String(chapterIndex+1).padStart(2,'0'),lesson=String(lessonIndex+1).padStart(2,'0'),key='avp_checkpoint_local_v1_C'+chapter+'L'+lesson;
  if(panel.querySelector('[data-checkpoint-key="'+key+'"]'))return;
  function checkpointShortText(value,max){var text=String(value||'').replace(/\\s+/g,' ').trim();if(text.length<=max)return text;var first=text.split(/(?<=[.!?])\\s+/)[0];if(first.length>=55&&first.length<=max)return first;var cut=text.slice(0,max-1),space=cut.lastIndexOf(' ');return (space>Math.floor(max*.65)?cut.slice(0,space):cut).trim()+'…';}
  var expected=String(procedure.expected||procedure.passCriteria||'Thực hiện đúng thao tác và đối chiếu kết quả.').trim(),practice=String(procedure.practice||'Thực hiện lại thao tác của bài trên bảng dữ liệu mẫu.').trim(),errors=String(procedure.errors||'Không bỏ qua bước kiểm tra kết quả.').trim(),goal=String(procedure.goal||procedure.concept||'Nắm được nội dung trọng tâm của bài.').trim();
  var questions=[{q:'Mục tiêu trọng tâm của bài học này là gì?',opts:[checkpointShortText(goal,145),checkpointShortText(practice,145),checkpointShortText(errors,145)],a:0},{q:'Nhiệm vụ nào phù hợp để áp dụng nội dung vừa học?',opts:[checkpointShortText(errors,145),checkpointShortText(practice,145),checkpointShortText(expected,145)],a:1},{q:'Kết quả nào cần được kiểm tra sau khi thực hiện?',opts:[checkpointShortText(practice,145),checkpointShortText(goal,145),checkpointShortText(expected,145)],a:2}];
  var saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(e){}
  var wrap=document.createElement('section');wrap.className='avp-lesson-checkpoint';wrap.setAttribute('data-checkpoint-key',key);
  var head=document.createElement('div');head.className='avp-checkpoint-head';var eyebrow=document.createElement('small');eyebrow.textContent='CHECKPOINT TỰ ĐÁNH GIÁ · CHƯƠNG '+chapter+' / BÀI '+lesson;var title=document.createElement('h4');title.textContent='Kiểm tra trước khi chuyển bài';var intro=document.createElement('p');intro.textContent='Trả lời đủ 3 câu hỏi và tự thực hiện nhiệm vụ. Cần đúng ít nhất 2 câu để đạt checkpoint kiến thức.';head.append(eyebrow,title,intro);wrap.appendChild(head);
  var form=document.createElement('div');form.className='avp-checkpoint-questions';
  questions.forEach(function(q,i){var field=document.createElement('fieldset');field.className='avp-checkpoint-question';var legend=document.createElement('legend');legend.textContent=(i+1)+'. '+q.q;field.appendChild(legend);q.opts.forEach(function(opt,k){var label=document.createElement('label');label.className='avp-checkpoint-option';var input=document.createElement('input');input.type='radio';input.name=key+'-q'+i;input.value=String(k);if(saved.answers&&Number(saved.answers[i])===k)input.checked=true;var span=document.createElement('span');span.textContent=opt;label.append(input,span);field.appendChild(label);});form.appendChild(field);});wrap.appendChild(form);
  var task=document.createElement('div');task.className='avp-checkpoint-task';var taskTitle=document.createElement('strong');taskTitle.textContent='NHIỆM VỤ THỰC HÀNH';var taskText=document.createElement('p');taskText.textContent=practice;task.append(taskTitle,taskText);wrap.appendChild(task);
  var practiceLabel=document.createElement('label');practiceLabel.className='avp-checkpoint-practice';var check=document.createElement('input');check.type='checkbox';check.checked=!!saved.practice;var checkText=document.createElement('span');checkText.textContent='Tôi đã tự thực hiện nhiệm vụ trên Excel và kiểm tra kết quả.';practiceLabel.append(check,checkText);wrap.appendChild(practiceLabel);
  var actions=document.createElement('div');actions.className='avp-checkpoint-actions';var submit=document.createElement('button');submit.type='button';submit.className='avp-checkpoint-submit';submit.textContent='Kiểm tra checkpoint';var reset=document.createElement('button');reset.type='button';reset.className='avp-checkpoint-reset';reset.textContent='Làm lại';actions.append(submit,reset);wrap.appendChild(actions);
  var result=document.createElement('div');result.className='avp-checkpoint-result';result.setAttribute('role','status');result.setAttribute('aria-live','polite');wrap.appendChild(result);
  var disclaimer=document.createElement('p');disclaimer.className='avp-checkpoint-disclaimer';disclaimer.textContent='Lưu trên thiết bị hiện tại. Đây là tự đánh giá, không phải hệ thống tự xác minh file thực hành và chưa đồng bộ tiến độ tài khoản.';wrap.appendChild(disclaimer);
  if(saved.passed){result.classList.add('is-pass');result.textContent='Đã PASS checkpoint tự đánh giá trên thiết bị này.';}
  var style=document.createElement('style');style.textContent='.avp-lesson-checkpoint{box-sizing:border-box;width:100%;max-width:100%;min-width:0;margin:22px 0;padding:18px;border:1px solid #dce9e0;border-radius:18px;background:#f8fbf8;color:#173b29;overflow:hidden}.avp-checkpoint-head small{font-size:10px;font-weight:800;letter-spacing:.08em;color:#32805a}.avp-checkpoint-head h4{margin:7px 0;font-size:17px}.avp-checkpoint-head p{margin:0 0 14px;color:#52675a;font-size:13px;line-height:1.55}.avp-checkpoint-questions{display:grid;grid-template-columns:minmax(0,1fr);gap:10px;width:100%;min-width:0}.avp-checkpoint-question{box-sizing:border-box;display:block;width:100%;min-width:0;margin:0;padding:12px;border:1px solid #dfe8e1;border-radius:12px;background:#fff}.avp-checkpoint-question legend{max-width:100%;padding:0 4px;white-space:normal;overflow-wrap:anywhere;font-size:13px;font-weight:750;line-height:1.45}.avp-checkpoint-option{box-sizing:border-box;display:flex!important;align-items:flex-start!important;gap:9px;width:100%;min-width:0;margin:9px 0 0;padding:9px 10px;border:1px solid #edf1ed;border-radius:9px;background:#fbfdfb;font-size:13px;line-height:1.5;white-space:normal;cursor:pointer}.avp-checkpoint-option input{flex:0 0 17px;width:17px;height:17px;margin:2px 0 0;accent-color:#16784d}.avp-checkpoint-option span{display:block;flex:1 1 auto;min-width:0;white-space:normal;overflow-wrap:anywhere;word-break:normal}.avp-checkpoint-task{margin:12px 0;padding:13px;border-radius:12px;background:#edf5ef}.avp-checkpoint-task strong{font-size:11px;letter-spacing:.06em}.avp-checkpoint-task p{margin:6px 0 0;color:#52675a;font-size:13px;line-height:1.55;overflow-wrap:anywhere}.avp-checkpoint-practice{display:flex;align-items:flex-start;gap:9px;margin:15px 0;font-size:12px;line-height:1.55}.avp-checkpoint-practice input{flex:0 0 17px;width:17px;height:17px;margin:2px 0 0;accent-color:#16784d}.avp-checkpoint-actions{display:flex;gap:9px;flex-wrap:wrap}.avp-checkpoint-actions button{border:0;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer}.avp-checkpoint-submit{background:#08794d;color:white}.avp-checkpoint-reset{background:#e7eee9;color:#345744}.avp-checkpoint-result{margin-top:12px;font-size:13px;line-height:1.55}.avp-checkpoint-result.is-pass{color:#08794d;font-weight:700}.avp-checkpoint-result.is-error{color:#a34232;font-weight:700}.avp-checkpoint-disclaimer{margin:12px 0 0;color:#718078;font-size:11px;line-height:1.5}@media(max-width:600px){.avp-lesson-checkpoint{padding:13px}.avp-checkpoint-question{padding:10px}.avp-checkpoint-option{padding:9px;font-size:12px}.avp-checkpoint-head h4{font-size:16px}}';wrap.appendChild(style);
  submit.addEventListener('click',function(){var score=0,answers=[],missing=false;questions.forEach(function(q,i){var chosen=form.querySelector('input[name="'+key+'-q'+i+'"]:checked');if(!chosen){missing=true;answers.push(null);}else{var v=Number(chosen.value);answers.push(v);if(v===q.a)score++;}});if(missing){result.className='avp-checkpoint-result is-error';result.textContent='Hãy trả lời đủ 3 câu hỏi.';return;}if(!check.checked){result.className='avp-checkpoint-result is-error';result.textContent='Hãy thực hiện nhiệm vụ và tích xác nhận trước khi kiểm tra.';return;}saved={answers:answers,practice:true,score:score,passed:score>=2,completedAt:new Date().toISOString(),source:'local-self-check'};try{localStorage.setItem(key,JSON.stringify(saved));}catch(e){}result.className='avp-checkpoint-result '+(saved.passed?'is-pass':'is-error');result.textContent=saved.passed?'PASS · Đúng '+score+'/3 câu. Kết quả chỉ lưu trên thiết bị này.':'Chưa đạt · Đúng '+score+'/3 câu. Xem lại bài và thử lại.';});
  reset.addEventListener('click',function(){form.querySelectorAll('input[type="radio"]').forEach(function(n){n.checked=false;});check.checked=false;saved={};try{localStorage.removeItem(key);}catch(e){}result.className='avp-checkpoint-result';result.textContent='Đã xóa kết quả checkpoint trên thiết bị này.';});
  panel.appendChild(wrap);
 }
 function renderStructuredLesson(chapterIndex,lessonIndex){
  if(!lessonPanel||chapterIndex<1||chapterIndex>3||lessonIndex<0||lessonIndex>=chapterLessons[chapterIndex].length)return;
  if(!window.AVP_LESSON_PROCEDURES_V2){
   lessonPanel.innerHTML='<div class="avp-lesson-main"><p>Đang tải hướng dẫn thao tác chi tiết…</p></div>';
   var procedureScript=document.getElementById('avp-lesson-procedures-v2-script');
   if(!procedureScript){
    procedureScript=document.createElement('script');procedureScript.id='avp-lesson-procedures-v2-script';procedureScript.src='chapter-lesson-procedures-v2.js?v=1';
    procedureScript.onload=function(){renderStructuredLesson(chapterIndex,lessonIndex);};
    procedureScript.onerror=function(){lessonPanel.innerHTML='<div class="avp-lesson-main"><h3>Không tải được hướng dẫn bài học</h3><p>Hãy tải lại trang sau ít phút. Nội dung bài chưa bị thay đổi.</p></div>';};
    document.head.appendChild(procedureScript);
   }else{procedureScript.addEventListener('load',function(){renderStructuredLesson(chapterIndex,lessonIndex);},{once:true});}
   return;
  }
  var catalogs={
  1:[
   ["Di chuyển nhanh trong Sheet","Đi đến ô hoặc vùng mà không phải cuộn thủ công.","Dùng Name Box để nhập địa chỉ như A500 hoặc A1:D20. Ctrl+Home về đầu vùng; Ctrl+End đến ô cuối Excel đang nhận diện có dữ liệu/định dạng.","Thử nhảy tới A500 bằng Name Box, sau đó dùng Ctrl+Home và Ctrl+End để so sánh.","Nhầm Ctrl+End với ô cuối có dữ liệu thực tế; định dạng thừa có thể làm vùng sử dụng bị kéo dài.","Muốn đến ô XFD1000 nhanh nhất, nên dùng Name Box hay cuộn chuột? Name Box."],
   ["Chọn vùng bằng bàn phím","Chọn chính xác ô, dòng, cột và vùng liên tục.","Shift kết hợp phím mũi tên mở rộng vùng chọn. Ctrl+Shift+mũi tên chọn đến rìa vùng dữ liệu; Ctrl+Space chọn cột, Shift+Space chọn dòng.","Chọn vùng A2:D20 bằng Name Box, sau đó chọn lại bằng phím tắt.","Dùng Ctrl+A không đúng vị trí có thể chọn toàn bộ vùng dữ liệu hoặc cả Worksheet tùy ngữ cảnh.","Tổ hợp nào mở rộng vùng chọn đến rìa dữ liệu? Ctrl+Shift+mũi tên."],
   ["Copy, Cut và Paste","Phân biệt sao chép và di chuyển dữ liệu.","Ctrl+C sao chép, Ctrl+X cắt, Ctrl+V dán. Sao chép giữ dữ liệu gốc; cắt chuyển nội dung/vùng sang vị trí mới.","Sao chép A2:A6 sang C2, sau đó cắt C2:C6 sang E2.","Dán đè lên vùng có dữ liệu mà không kiểm tra; luôn xác định vùng đích trước khi Paste.","Muốn giữ nguyên dữ liệu nguồn và tạo bản sao, dùng Copy hay Cut? Copy."],
   ["Paste Special","Dán riêng giá trị, công thức, định dạng hoặc phép tính.","Paste Special cho phép chọn Values, Formulas, Formats, Transpose và các phép cộng/trừ/nhân/chia. Dán Values giúp loại bỏ công thức nhưng giữ kết quả.","Copy một vùng có công thức, Paste Special → Values sang vùng khác; thử Transpose với bảng nhỏ.","Dùng Paste thông thường khi chỉ cần kết quả khiến công thức liên kết ngoài ý muốn vẫn tồn tại.","Muốn giữ kết quả nhưng bỏ công thức, chọn mục nào? Values."],
   ["Undo và Redo","Hoàn tác và khôi phục thao tác theo đúng thứ tự.","Ctrl+Z hoàn tác; Ctrl+Y làm lại thao tác vừa hoàn tác. Lịch sử có giới hạn và một số thao tác ngoài Excel không nằm trong Undo.","Nhập dữ liệu, đổi màu ô, xóa nội dung rồi lần lượt Ctrl+Z và Ctrl+Y.","Lưu file hoặc đóng Workbook không đồng nghĩa có thể Undo mọi thao tác trước đó.","Phím tắt làm lại thao tác vừa Undo là gì? Ctrl+Y."],
   ["Find và Replace","Tìm và thay thế nội dung có kiểm soát.","Ctrl+F tìm; Ctrl+H thay thế. Có thể giới hạn trong Sheet/Workbook, tìm theo giá trị hoặc công thức và phân biệt chữ hoa thường.","Tìm mã SP01 trong bảng; thay tên khu vực viết sai bằng tên chuẩn sau khi kiểm tra phạm vi.","Replace All toàn Workbook khi chưa kiểm tra số kết quả có thể thay nhầm mã hoặc công thức.","Trước Replace All, cần kiểm tra điều gì? Phạm vi và các kết quả khớp."],
   ["Chèn và xóa dòng, cột","Thay đổi cấu trúc bảng mà không làm lệch dữ liệu.","Chọn tiêu đề dòng/cột để Insert hoặc Delete. Khi thao tác trong Excel Table, cấu trúc bảng tự mở rộng theo quy tắc riêng.","Chèn một dòng giữa bảng, thêm một cột Ghi chú rồi xóa đúng cột thử nghiệm.","Chỉ xóa nội dung ô thay vì xóa cả dòng/cột, hoặc xóa nhầm vùng đang chứa công thức liên quan.","Muốn thêm một dòng trống giữa hai bản ghi, chọn Insert Sheet Rows."],
   ["Fill Handle và chuỗi dữ liệu","Sao chép hoặc tạo chuỗi bằng chốt điền.","Fill Handle nằm ở góc dưới phải vùng chọn. Kéo để sao chép công thức, điền chuỗi ngày, số thứ tự hoặc quy luật nhận diện được.","Nhập 1 và 2 ở hai ô, chọn cả hai rồi kéo; thử kéo một ngày sang các dòng tiếp theo.","Chỉ nhập số 1 rồi kéo có thể sao chép số 1 thay vì tạo dãy tăng.","Muốn tạo dãy 1, 2, 3…, nên cung cấp bao nhiêu giá trị mẫu? Ít nhất hai giá trị."],
   ["Freeze Panes","Giữ tiêu đề hoặc cột nhận diện khi cuộn bảng.","Freeze Panes cố định các dòng phía trên và cột phía trái ô đang chọn. Freeze Top Row và Freeze First Column là lựa chọn nhanh.","Chọn ô B2 rồi View → Freeze Panes để cố định dòng đầu; thử chọn C2 để cố định cả dòng đầu và cột A.","Chọn sai ô trước khi Freeze Panes khiến cố định sai số dòng/cột.","Muốn cố định dòng 1 và cột A, chọn ô nào trước? B2."],
   ["Sort và Filter","Sắp xếp và lọc để xem đúng tập bản ghi.","Sort thay đổi thứ tự bản ghi; Filter chỉ ẩn các dòng không khớp điều kiện. Mở rộng vùng chọn để các cột đi cùng nhau.","Lọc trạng thái Đạt, sau đó sắp xếp ngày mới nhất đến cũ nhất.","Chỉ sắp xếp một cột riêng lẻ có thể làm lệch quan hệ giữa các cột của cùng bản ghi.","Filter có xóa các dòng không phù hợp khỏi dữ liệu không? Không, chỉ ẩn chúng."],
   ["Quy trình thao tác bằng bàn phím","Kết hợp điều hướng, chọn vùng, sao chép và kiểm tra.","Một quy trình tốt gồm: nhảy đến vùng, chọn đúng phạm vi, thực hiện lệnh, kiểm tra kết quả và Undo nếu sai. Dùng phím tắt giúp giảm thao tác lặp.","Thực hiện: đến A2, chọn vùng dữ liệu liên tục, copy sang sheet mới, dán Values và kiểm tra số dòng.","Thuộc phím tắt nhưng không kiểm tra vùng đích vẫn có thể gây mất dữ liệu.","Bước nào phải làm trước khi Paste đè? Xác nhận đúng vùng đích."],
   ["Bài thực hành tổng hợp","Hoàn thành một quy trình thao tác dữ liệu bằng bàn phím.","Kết hợp Find, Filter, Sort, Copy, Paste Special, Freeze Panes và Undo/Redo trong một bảng có tiêu đề và nhiều bản ghi.","Tạo bảng đơn hàng 20 dòng; lọc đơn Chưa giao, sắp xếp ngày, sao chép kết quả sang Sheet mới dưới dạng Values.","Không kiểm tra số bản ghi sau lọc và dán cả dòng ẩn ngoài dự kiến.","Bài làm đạt khi dữ liệu nguồn không bị lệch cột, kết quả lọc đúng và Sheet kết quả độc lập công thức."]
  ],
  2:[
   ["Toán tử và cấu trúc công thức","Nhận biết thành phần và cách viết công thức Excel.","Công thức bắt đầu bằng dấu =. Toán tử số học gồm +, -, *, /, ^; toán tử so sánh gồm =, >, <, >=, <=, <>. Tham chiếu ô giúp công thức tự cập nhật theo dữ liệu.","Viết công thức tính Thành tiền = Số lượng * Đơn giá và công thức kiểm tra Số lượng > 0.","Thiếu dấu = hoặc dùng ký tự nhân x thay cho * khiến công thức không tính đúng.","Công thức Excel thường bắt đầu bằng ký tự nào? Dấu =."],
   ["Thứ tự thực hiện phép tính","Hiểu độ ưu tiên toán tử và dùng ngoặc để kiểm soát kết quả.","Excel thực hiện lũy thừa, nhân/chia, cộng/trừ theo thứ tự ưu tiên; biểu thức trong ngoặc được tính trước. Không nên dựa vào cách đọc tự nhiên.","So sánh =A1+B1*C1 với =(A1+B1)*C1 bằng số mẫu.","Quên ngoặc khi cần tính tổng trước rồi mới nhân sẽ tạo kết quả khác.","Muốn cộng A1 và B1 trước khi nhân C1, cần viết thế nào? =(A1+B1)*C1."],
   ["Tham chiếu tương đối","Hiểu cách địa chỉ ô thay đổi khi sao chép công thức.","A1 là tham chiếu tương đối. Khi sao chép công thức xuống một dòng, A1 đổi thành A2; khi sao chép sang phải, cột có thể đổi.","Tại D2 nhập =B2*C2 rồi kéo xuống D10; quan sát tham chiếu từng dòng.","Sửa từng công thức thủ công thay vì dùng quy luật sao chép khiến dễ sai và khó bảo trì.","Sao chép =B2*C2 từ D2 xuống D3 sẽ thành gì? =B3*C3."],
   ["Tham chiếu tuyệt đối","Cố định hàng và cột khi sao chép công thức.","$A$1 khóa cả cột A và dòng 1. Dùng phím F4 khi đang chọn tham chiếu trong công thức để chuyển kiểu tham chiếu.","Tính giá sau thuế bằng =B2*(1+$F$1), sau đó sao chép xuống nhiều dòng.","Không khóa ô thuế khiến tham chiếu trượt khi kéo công thức.","Ký hiệu nào khóa cả cột và dòng? $A$1."],
   ["Tham chiếu hỗn hợp","Khóa riêng cột hoặc dòng theo hướng sao chép.","$A1 khóa cột A nhưng cho phép dòng đổi; A$1 khóa dòng 1 nhưng cho phép cột đổi. Hữu ích với bảng tính hai chiều.","Lập bảng nhân: cố định tiêu đề cột bằng A$1 và tiêu đề dòng bằng $A2 tùy bố cục.","Đặt dấu $ sai vị trí khiến bảng kết quả lệch khi kéo ngang hoặc dọc.","A$1 khóa phần nào? Khóa dòng 1, cột A vẫn thay đổi."],
   ["Sao chép và kiểm tra công thức","Sao chép công thức có kiểm soát và xác minh tham chiếu.","Dùng Fill Handle hoặc Copy/Paste để nhân công thức. Kiểm tra vài dòng đầu, dòng cuối và công thức trên Formula Bar; có thể bật Show Formulas để rà soát.","Tạo cột Thành tiền, kéo công thức hết bảng rồi kiểm tra dòng đầu, giữa và cuối.","Chỉ nhìn kết quả hiển thị mà không kiểm tra tham chiếu có thể bỏ sót lỗi kéo công thức.","Sau khi kéo công thức, cần kiểm tra tối thiểu những gì? Kết quả và tham chiếu ở nhiều vị trí."],
   ["Nối văn bản và ghép nội dung","Ghép nhiều trường thành một chuỗi có định dạng rõ ràng.","Dùng & để nối chuỗi; CONCAT/CONCATENATE ghép nhiều phần. Khoảng trắng và dấu phân cách phải được thêm thành chuỗi văn bản.","Ghép Họ tên từ A2 và B2 bằng =A2&' '&B2; ghép Mã-Ngày bằng dấu gạch nối.","Quên dấu cách hoặc dấu phân cách làm dữ liệu ghép dính liền và khó đọc.","Toán tử nào thường dùng để nối hai chuỗi? &."],
   ["Làm tròn và xử lý số thập phân","Chọn cách làm tròn phù hợp với quy tắc nghiệp vụ.","ROUND làm tròn đến số chữ số chỉ định; ROUNDUP luôn làm tròn lên; ROUNDDOWN luôn làm tròn xuống. Định dạng số chỉ thay đổi hiển thị, không đổi giá trị gốc.","Thử ROUND(12.345,2), ROUNDUP(12.341,2) và ROUNDDOWN(12.349,2).","Nhầm định dạng hiển thị hai chữ số thập phân với việc làm tròn giá trị trong công thức.","Hàm nào làm tròn xuống bất kể phần thập phân? ROUNDDOWN."],
   ["Ngày tháng trong công thức","Tính toán ngày dựa trên giá trị Date hợp lệ.","Ngày Excel được lưu dưới dạng số sê-ri. Có thể cộng/trừ ngày, dùng TODAY, DATE, YEAR, MONTH, DAY để tách thành phần.","Tính số ngày xử lý bằng =B2-A2; tạo ngày đầu tháng bằng DATE(YEAR(A2),MONTH(A2),1).","Ngày đang lưu dạng Text có thể khiến phép trừ lỗi hoặc cho kết quả không mong muốn.","Muốn lấy tháng từ ngày A2, dùng hàm nào? MONTH(A2)."],
   ["IF cơ bản","Tạo kết quả theo một điều kiện đúng hoặc sai.","Cấu trúc IF(logical_test,value_if_true,value_if_false). Điều kiện có thể dùng toán tử so sánh; kết quả có thể là số, văn bản hoặc công thức.","Phân loại Đạt nếu điểm ở B2 từ 80 trở lên: =IF(B2>=80,'Đạt','Chưa đạt').","Đảo nhầm nhánh đúng/sai hoặc đặt văn bản không có dấu ngoặc kép.","IF có mấy nhánh kết quả chính? Hai nhánh: đúng và sai."],
   ["Nhận diện và xử lý lỗi công thức","Đọc lỗi phổ biến trước khi sửa công thức.","#DIV/0! thường do chia cho 0; #N/A do không tìm thấy; #VALUE! do kiểu dữ liệu không phù hợp; #REF! do tham chiếu không còn hợp lệ; #### thường do độ rộng cột hoặc định dạng.","Cố ý tạo phép chia cho 0 và tham chiếu bị xóa; đọc lỗi rồi sửa nguyên nhân.","Bọc IFERROR ngay lập tức có thể che mất lỗi logic hoặc dữ liệu nguồn sai.","#### luôn là lỗi công thức? Không; thường cần kiểm tra độ rộng cột/định dạng."],
   ["Bài thực hành tổng hợp công thức","Xây dựng bảng tính có công thức, tham chiếu và kiểm tra lỗi.","Kết hợp phép tính, tham chiếu tương đối/tuyệt đối, IF, nối văn bản và xử lý ngày. Kiểm tra công thức mẫu trước khi sao chép toàn bảng.","Tạo bảng tính lương mẫu gồm Mã NV, Ngày công, Đơn giá, Phụ cấp cố định, Tổng tiền và Trạng thái.","Nhập số cố định trực tiếp vào nhiều công thức thay vì đặt tham số ở ô riêng và khóa tham chiếu.","Bài làm đạt khi kéo công thức không lệch tham chiếu và thay đổi tham số làm kết quả cập nhật."]
  ],
  3:[
   ["SUM và AVERAGE","Tính tổng và giá trị trung bình của một vùng dữ liệu.","SUM cộng các giá trị số; AVERAGE tính trung bình các ô số và bỏ qua ô trống/văn bản. Có thể truyền nhiều vùng hoặc đối số.","Tính tổng doanh thu và doanh thu trung bình của 10 đơn hàng bằng SUM và AVERAGE.","Dùng AVERAGE khi cần trung bình có trọng số hoặc bao gồm các dòng không hợp lệ.","AVERAGE có tính ô trống như số 0 không? Không, ô trống được bỏ qua."],
   ["MIN, MAX và COUNT","Tìm giá trị nhỏ nhất, lớn nhất và đếm ô số.","MIN trả giá trị nhỏ nhất; MAX trả lớn nhất; COUNT đếm ô chứa số. Chúng không thay thế cho đếm mọi ô có dữ liệu.","Tìm đơn hàng có số lượng thấp nhất/cao nhất và đếm số dòng có giá trị số.","Dùng COUNT để đếm mã dạng Text sẽ không đếm đúng các mã đó.","Hàm nào đếm ô chứa số? COUNT."],
   ["COUNTA và COUNTBLANK","Đếm ô có dữ liệu và ô trống.","COUNTA đếm ô không trống, kể cả văn bản; COUNTBLANK đếm ô trống và một số ô có công thức trả chuỗi rỗng.","Đếm số mã nhân viên đã nhập và số ô chưa điền trong cột Bộ phận.","Nhầm ô chứa công thức trả chuỗi rỗng với ô thực sự trống khi kiểm tra dữ liệu.","Muốn đếm ô có mã dạng Text, dùng hàm nào? COUNTA."],
   ["IF","Phân loại dữ liệu theo điều kiện.","IF kiểm tra một điều kiện và trả về một trong hai kết quả. Có thể lồng IF nhưng nên ưu tiên cấu trúc dễ đọc khi điều kiện nhiều.","Phân loại lỗi theo số lượng: nếu lớn hơn 5 là Cần xử lý, ngược lại là Theo dõi.","Lồng quá nhiều IF khiến công thức khó kiểm tra; điều kiện biên >= và > cần phân biệt.","Nếu điều kiện đúng trả về A, sai trả về B, cấu trúc hàm là gì? IF(điều_kiện,A,B)."],
   ["AND và OR","Kết hợp nhiều điều kiện logic.","AND chỉ TRUE khi tất cả điều kiện TRUE. OR TRUE khi ít nhất một điều kiện TRUE. Thường kết hợp với IF.","Chỉ đánh dấu Đạt khi số lỗi = 0 AND sản lượng >= mục tiêu; dùng OR để cảnh báo nếu thiếu dữ liệu hoặc lỗi vượt ngưỡng.","Dùng AND trong tình huống chỉ cần một điều kiện đúng, hoặc dùng OR khi mọi điều kiện đều phải đạt.","AND cần bao nhiêu điều kiện đúng để trả TRUE? Tất cả."],
   ["SUMIF","Cộng dữ liệu theo một điều kiện.","SUMIF(range,criteria,[sum_range]) lọc theo một điều kiện rồi cộng vùng tương ứng. Tiêu chí văn bản đặt trong dấu ngoặc kép.","Tính tổng doanh thu của cửa hàng HN01 bằng SUMIF trên cột cửa hàng và doanh thu.","Để range và sum_range lệch số dòng sẽ cho kết quả sai hoặc khó kiểm soát.","SUMIF xử lý tối đa bao nhiêu điều kiện? Một điều kiện."],
   ["COUNTIF","Đếm dữ liệu thỏa một điều kiện.","COUNTIF(range,criteria) đếm số ô khớp điều kiện. Có thể dùng ký tự đại diện * và ?; điều kiện so sánh nối với dấu & khi tham chiếu ô.","Đếm số dòng trạng thái Đạt và số mã bắt đầu bằng QC bằng COUNTIF.","Viết điều kiện lớn hơn kèm địa chỉ ô mà thiếu dấu & hoặc đặt sai dấu ngoặc kép.","Đếm các giá trị lớn hơn ô F1 cần viết tiêu chí thế nào? '>' & F1."],
   ["SUMIFS và COUNTIFS","Tổng hợp và đếm theo nhiều điều kiện đồng thời.","SUMIFS(sum_range,criteria_range1,criteria1,...) cộng khi tất cả điều kiện khớp. COUNTIFS đếm các dòng đồng thời thỏa các cặp điều kiện.","Tính doanh thu của cửa hàng A trong tháng 10; đếm số lỗi ca đêm có mức độ Nghiêm trọng.","Các criteria_range trong COUNTIFS/SUMIFS cần có cùng kích thước và cùng vị trí bản ghi.","Nhiều điều kiện trong COUNTIFS kết hợp theo AND hay OR? AND."],
   ["IFERROR","Xử lý kết quả lỗi có chủ đích.","IFERROR(value,value_if_error) thay kết quả lỗi bằng giá trị dự phòng. Nên sửa nguyên nhân trước, chỉ dùng khi kết quả thay thế có ý nghĩa nghiệp vụ.","Tính tỷ lệ lỗi =IFERROR(Số lỗi/Sản lượng,0) và ghi chú trường hợp mẫu số bằng 0.","Dùng IFERROR để che lỗi tham chiếu hoặc lỗi dữ liệu thay vì khắc phục nguyên nhân.","IFERROR thay thế những gì? Kết quả công thức khi phát sinh lỗi."],
   ["LEFT, RIGHT, MID và LEN","Trích xuất và đo độ dài chuỗi văn bản.","LEFT lấy từ trái; RIGHT lấy từ phải; MID lấy từ vị trí chỉ định; LEN đếm số ký tự, kể cả khoảng trắng.","Tách tiền tố mã hàng bằng LEFT, lấy 4 ký tự cuối bằng RIGHT, trích phần giữa bằng MID.","Nhầm vị trí bắt đầu của MID hoặc quên khoảng trắng cũng được tính trong LEN.","Hàm nào trích ký tự từ vị trí bất kỳ? MID."],
   ["Hàm xử lý văn bản và ngày tháng","Chuẩn hóa chuỗi và lấy thông tin thời gian.","TRIM loại khoảng trắng thừa; UPPER/LOWER/PROPER đổi kiểu chữ; SUBSTITUTE thay chuỗi; TODAY trả ngày hiện tại; YEAR/MONTH/DAY tách thành phần ngày.","Chuẩn hóa tên bằng TRIM và PROPER; lấy năm báo cáo từ ngày ở A2 bằng YEAR.","TRIM không xử lý mọi ký tự khoảng trắng đặc biệt; TODAY thay đổi theo ngày hệ thống.","Hàm nào loại khoảng trắng thừa giữa các từ? TRIM."],
   ["Bài thực hành tổng hợp hàm","Kết hợp hàm tính toán, điều kiện và xử lý dữ liệu.","Chọn hàm theo yêu cầu: tổng, đếm, điều kiện, xử lý lỗi, trích văn bản và phân tích ngày. Xác định đúng vùng dữ liệu trước khi viết công thức.","Tạo báo cáo đơn hàng: tổng doanh thu theo cửa hàng, đếm đơn trễ, phân loại trạng thái, tách tháng và chuẩn hóa tên khách hàng.","Viết công thức trước khi xác định định nghĩa chỉ tiêu, điều kiện lọc và dữ liệu nguồn.","Bài làm đạt khi mỗi chỉ tiêu có định nghĩa rõ, công thức đúng và đối chiếu được với dữ liệu gốc."]
  ]};
  var d=catalogs[chapterIndex][lessonIndex];if(!d)return;
  var title=chapterLessons[chapterIndex][lessonIndex],chapterName=chapterList[chapterIndex][0],no=String(lessonIndex+1).padStart(2,'0');
  lessonPanel.innerHTML='<div class="avp-chapter-lessons-toolbar avp-lesson-reader-back"><button type="button" class="avp-chapter-lessons-back" data-back-lessons>← Danh sách bài học</button><span class="avp-chapter-lessons-count">CHƯƠNG '+String(chapterIndex+1).padStart(2,'0')+' · BÀI '+no+'</span></div><article class="avp-lesson-main"><div class="avp-lesson-kicker">BÀI HỌC '+no+' · '+chapterName.toUpperCase()+'</div><h3></h3><h4>MỤC TIÊU</h4><p class="avp-lesson-goal"></p><h4>KIẾN THỨC CỐT LÕI</h4><p class="avp-lesson-intro"></p><h4>VÍ DỤ VÀ CÁCH ÁP DỤNG</h4><div class="avp-lesson-example avp-lesson-parts"></div><h4>THỰC HÀNH</h4><div class="avp-lesson-example avp-lesson-practice"></div><h4>LỖI THƯỜNG GẶP</h4><p class="avp-lesson-mistake"></p><h4>TỰ KIỂM TRA</h4><div class="avp-lesson-example avp-lesson-check"></div></article>';
  lessonPanel.querySelector('[data-back-lessons]').addEventListener('click',function(){renderChapterLessons(chapterIndex);});
  lessonPanel.querySelector('h3').textContent=title;
  lessonPanel.querySelector('.avp-lesson-goal').textContent=d[0];
  lessonPanel.querySelector('.avp-lesson-intro').textContent=d[1];
  lessonPanel.querySelector('.avp-lesson-parts').textContent=d[2];
  lessonPanel.querySelector('.avp-lesson-practice').textContent=d[3];
  lessonPanel.querySelector('.avp-lesson-mistake').textContent=d[4];
  lessonPanel.querySelector('.avp-lesson-check').textContent=d[5];
  var procedure=window.AVP_LESSON_PROCEDURES_V2.find(function(item){return item.id==='C'+(chapterIndex+1)+'L'+String(lessonIndex+1).padStart(2,'0');});
  if(procedure){
   var main=lessonPanel.querySelector('.avp-lesson-main');
   var detail=document.createElement('section');detail.className='avp-lesson-procedure-v2';
   var heading=document.createElement('h4');heading.textContent='HƯỚNG DẪN THAO TÁC TỪNG BƯỚC';detail.appendChild(heading);
   var intro=document.createElement('p');intro.className='avp-procedure-goal';intro.textContent=procedure.goal;detail.appendChild(intro);
   var listTitle=document.createElement('h4');listTitle.textContent='THỰC HIỆN TRÊN EXCEL';detail.appendChild(listTitle);
   var list=document.createElement('ol');list.className='avp-procedure-steps';
   procedure.steps.forEach(function(step){var li=document.createElement('li');li.textContent=step;list.appendChild(li);});detail.appendChild(list);
   var mouseTitle=document.createElement('h4');mouseTitle.textContent='DÙNG CHUỘT NÀO, BẤM Ở ĐÂU?';detail.appendChild(mouseTitle);
   var mouse=document.createElement('p');mouse.className='avp-procedure-mouse';mouse.textContent=procedure.mouse;detail.appendChild(mouse);
   var expectedTitle=document.createElement('h4');expectedTitle.textContent='KẾT QUẢ CẦN NHÌN THẤY';detail.appendChild(expectedTitle);
   var expected=document.createElement('p');expected.textContent=procedure.expected;detail.appendChild(expected);
   var practiceTitle=document.createElement('h4');practiceTitle.textContent='MỞ RỘNG VÀ ÁP DỤNG THỰC TẾ';detail.appendChild(practiceTitle);
   var practice=document.createElement('p');practice.textContent=procedure.practice;detail.appendChild(practice);
   var errorsTitle=document.createElement('h4');errorsTitle.textContent='LỖI CẦN TRÁNH';detail.appendChild(errorsTitle);
   var errors=document.createElement('p');errors.textContent=procedure.errors;detail.appendChild(errors);
   main.appendChild(detail);
  }
  renderLessonLibraryRefs(lessonPanel,chapterIndex,lessonIndex);
  if(procedure)mountChapterCheckpoint(lessonPanel,chapterIndex,lessonIndex,procedure);
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
   lessonPanel.addEventListener('click',function(event){var lessonButton=event.target.closest('[data-lesson-index]');if(!lessonButton)return;var lessonIndex=Number(lessonButton.getAttribute('data-lesson-index'));if(index===0){if(lessonIndex===5)renderDataTypesLesson();else renderChapterOneLesson(lessonIndex);}else if(index>=1&&index<=3){renderStructuredLesson(index,lessonIndex);}else if(index>=4&&index<=11){renderChapterFiveToTwelveLesson(index,lessonIndex);}});
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
  resourceSection.innerHTML='<div class="avp-resource-heading"><div><small>TÀI NGUYÊN DÀNH CHO DÂN VĂN PHÒNG</small><h2>Tạo ra sản phẩm thực tế, không chỉ học công cụ</h2><p>Tài nguyên để luyện tập, lưu lại nội dung hữu ích và theo dõi những gì bạn đã hoàn thành.</p></div></div><div class="avp-resource-grid"><div class="avp-resource-card avp-resource-workbook"><span class="avp-resource-icon">▤</span><span class="avp-resource-copy"><small>01 · FILE MẪU VÀ DỮ LIỆU</small><strong>Kho workbook</strong><em>File thực hành, dữ liệu mẫu và tài liệu theo từng chủ đề.</em><b>Kho nội dung</b></span><span class="avp-resource-decoration">XLSX</span></div><div class="avp-resource-card avp-resource-cases"><span class="avp-resource-icon">▦</span><span class="avp-resource-copy"><small>02 · BÀI TOÁN THỰC TẾ</small><strong>Case thực chiến</strong><em>Thử giải bài toán bằng dữ liệu đầu vào và mục tiêu đầu ra cụ thể.</em><b>Nội dung tham khảo</b></span><span class="avp-resource-decoration">CASE</span></div><div class="avp-resource-card avp-resource-collection"><span class="avp-resource-icon">♧</span><span class="avp-resource-copy"><small>03 · HỌC TIẾP VÀ XEM LẠI</small><strong>Bộ sưu tập cá nhân</strong><em>Mở khu học tập để tiếp tục nội dung gần đây và xem các mục đã lưu trên thiết bị này.</em><b>Đang lưu trữ</b></span><span class="avp-resource-decoration">SAVE</span></div><div class="avp-resource-card avp-resource-results"><span class="avp-resource-icon">✓</span><span class="avp-resource-copy"><small>04 · THEO DÕI TIẾN ĐỘ</small><strong>Tiến độ & thành tích</strong><em>Xem tiến độ học tập và kết quả được hệ thống ghi nhận.</em><b>Thông tin hiển thị</b></span><span class="avp-resource-decoration">DONE</span></div></div>'
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

/* AVP Progress & Personal Map v2 */
(function(){
'use strict';
function init(){
 if(document.querySelector('[data-avp-progress-hub]'))return;
 var resource=document.querySelector('.avp-resource-results');if(!resource)return;
 var style=document.createElement('style');
 style.textContent=String.raw`
 .avp-hub[hidden],.avp-map-modal[hidden]{display:none!important}
 .avp-hub,.avp-map-modal{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;z-index:2147483000!important;display:grid!important;place-items:center!important;padding:12px!important;box-sizing:border-box!important;background:rgba(8,28,19,.74)!important;backdrop-filter:blur(9px);overflow:auto!important}
 .avp-hub-box,.avp-map-box{width:min(1080px,calc(100vw - 24px))!important;max-width:calc(100vw - 24px)!important;max-height:calc(100vh - 24px)!important;overflow:auto!important;margin:auto!important;background:#f5f8f5;border:1px solid #dce8df;border-radius:20px;color:#183627;box-shadow:0 24px 80px #001b12aa;box-sizing:border-box}
 .avp-hub-head,.avp-map-head{position:sticky;top:0;z-index:3;background:#fff;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e2ebe4}
 .avp-hub-head small,.avp-map-head small{color:#08734b;font-weight:900;letter-spacing:.12em;font-size:10px}.avp-hub-head h2,.avp-map-head h2{margin:4px 0 0;font-size:21px}
 .avp-hub-close,.avp-map-close{border:0;border-radius:10px;padding:6px 12px;font-size:23px;background:#edf3ee;color:#234b37;cursor:pointer}
 .avp-hub-tabs{display:flex;gap:8px;flex-wrap:wrap;padding:14px 18px 0}
 .avp-hub-tabs button{border:1px solid #dce7df;background:#fff;color:#355843;padding:9px 14px;border-radius:999px;font-weight:800;cursor:pointer}
 .avp-hub-tabs button[aria-selected=true]{background:#075b3d;color:#fff}
 .avp-hub-body{padding:16px 18px 22px}.avp-hub-panel[hidden]{display:none}
 .avp-hub-card{background:#fff;border:1px solid #e0e9e2;border-radius:15px;padding:16px;min-width:0}.avp-hub-card h3{margin:0 0 7px;font-size:15px}
 .avp-hub-muted{color:#718076;font-size:12px;line-height:1.55}.avp-hub-overview{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
 .avp-hub-stat{padding:16px;border:1px solid #e0e9e2;border-radius:14px;background:#fff}.avp-hub-stat b{display:block;font-size:30px;color:#08734b;letter-spacing:-.05em}.avp-hub-stat small{color:#718076}
 .avp-hub-meter{height:9px;background:#eaf0eb;border-radius:99px;overflow:hidden;margin:10px 0 7px}.avp-hub-meter span{display:block;height:100%;background:linear-gradient(90deg,#08734b,#75c596);border-radius:99px}
 .avp-hub-list{display:grid;gap:10px;margin-top:12px}.avp-hub-row{display:grid;grid-template-columns:minmax(130px,1fr) minmax(100px,2fr) auto;gap:10px;align-items:center;font-size:12px}.avp-hub-row strong{white-space:nowrap}
 .avp-hub-library-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
 .avp-hub-subcard{border:1px solid #e5ece6;background:#fbfdfb;border-radius:12px;padding:13px}.avp-hub-subcard b{font-size:22px;color:#08734b}
 .avp-hub-note{padding:12px 14px;border-radius:12px;background:#edf5ef;color:#536b5a;font-size:12px;line-height:1.55;margin-top:12px}
 .avp-map-box{width:min(1080px,calc(100vw - 24px))!important}.avp-map-content{padding:16px}.avp-map-land{overflow:hidden;border-radius:16px;border:1px solid #cbdccb;background:#dcebdc}.avp-map-land svg{width:100%;height:auto;display:block}
 .avp-map-info{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:12px}.avp-map-info article{background:#fff;border:1px solid #e1eae3;border-radius:12px;padding:12px}.avp-map-info small{display:block;color:#718076;font-size:10px}.avp-map-info b{display:block;margin-top:5px;font-size:14px;color:#08734b}
 .avp-home-map-card{display:flex;flex-direction:column;align-items:flex-start;text-align:left;width:100%;min-width:0;min-height:265px;padding:22px;border:1px solid #cfe4d5;border-radius:20px;background:linear-gradient(145deg,#f5fbf6,#e5f3e8);color:#173d2a;cursor:pointer;box-shadow:0 14px 35px #15482a12;transition:transform .25s,box-shadow .25s}
 .avp-home-map-card:hover{transform:translateY(-3px);box-shadow:0 18px 42px #15482a1c}
 .avp-home-map-kicker{font-size:10px;letter-spacing:.13em;font-weight:900;color:#168057}.avp-home-map-card>strong{font-size:22px;margin-top:7px;letter-spacing:-.04em}.avp-home-map-copy{font-size:12px;line-height:1.55;color:#607467;margin-top:5px;max-width:450px}.avp-home-map-art{display:block;width:100%;margin-top:auto;padding-top:10px}.avp-home-map-art svg{display:block;width:100%;height:130px}.avp-home-map-footer{display:flex;justify-content:space-between;align-items:center;width:100%;gap:10px;border-top:1px solid #d6e8da;padding-top:10px;margin-top:4px;font-size:11px;color:#52705d}.avp-home-map-footer b{color:#08734b}
 @media(max-width:680px){.avp-hub-overview,.avp-hub-library-grid,.avp-map-info{grid-template-columns:1fr}.avp-hub-body,.avp-map-content{padding:12px}.avp-hub-row{grid-template-columns:100px 1fr auto;gap:7px;font-size:11px}.avp-home-map-card{min-height:230px;padding:17px}.avp-home-map-art svg{height:105px}}
 `;
 document.head.appendChild(style);
 var hub=document.createElement('div');hub.className='avp-hub';hub.hidden=true;hub.dataset.avpProgressHub='1';
 hub.innerHTML='<section class="avp-hub-box" role="dialog" aria-modal="true" aria-label="Tiến độ học tập"><header class="avp-hub-head"><div><small>LEARNEXCELWITHME · MY PROGRESS</small><h2>Tiến độ & thành tích</h2></div><button class="avp-hub-close" type="button" aria-label="Đóng">×</button></header><nav class="avp-hub-tabs"><button type="button" data-tab="course" aria-selected="true">Học theo chương</button><button type="button" data-tab="library" aria-selected="false">Thư viện</button><button type="button" data-tab="practice" aria-selected="false">Bài tập tự chấm</button></nav><main class="avp-hub-body"><section class="avp-hub-panel" data-panel="course"><div class="avp-hub-overview"><article class="avp-hub-stat"><b data-course-count>0/135</b><small>Bài học đã PASS Checkpoint</small><div class="avp-hub-meter"><span data-course-meter style="width:0%"></span></div><small data-course-percent>0% lộ trình</small></article><article class="avp-hub-stat"><b data-chapter-count>0/12</b><small>Chương hoàn thành toàn bộ</small></article><article class="avp-hub-stat"><b data-current-chapter>Điểm xuất phát</b><small>Chặng hiện tại</small></article></div><article class="avp-hub-card" style="margin-top:12px"><h3>Tiến độ từng chương</h3><div class="avp-hub-list" data-chapter-list></div></article><div class="avp-hub-note">Chỉ bài đã PASS Checkpoint mới được tính. Mở bài hoặc đọc nội dung không tự làm tăng tiến độ.</div></section><section class="avp-hub-panel" data-panel="library" hidden><div class="avp-hub-overview"><article class="avp-hub-stat"><b data-library-total>0/0</b><small>Câu hỏi / nội dung đã hoàn thành</small></article><article class="avp-hub-stat"><b data-library-percent>0%</b><small>Tỷ lệ hoàn thành thư viện</small></article><article class="avp-hub-stat"><b data-library-types>0/4</b><small>Nhóm thư viện đã có tiến độ</small></article></div><div class="avp-hub-library-grid" style="margin-top:12px"><article class="avp-hub-card"><h3>Công thức Excel</h3><div class="avp-hub-subcard"><b data-formula-count>0/0</b><div class="avp-hub-meter"><span data-formula-meter style="width:0%"></span></div><small class="avp-hub-muted">Câu trả lời đúng, không tính câu chỉ mở hoặc trả lời sai.</small></div></article><article class="avp-hub-card"><h3>Phím tắt Excel</h3><div class="avp-hub-subcard"><b data-shortcut-count>0/0</b><div class="avp-hub-meter"><span data-shortcut-meter style="width:0%"></span></div><small class="avp-hub-muted">Câu trả lời đúng được lưu lâu dài, không mất khi bắt đầu lượt mới.</small></div></article><article class="avp-hub-card"><h3>Kiến thức Excel</h3><div class="avp-hub-subcard"><b data-knowledge-count>0/0</b><div class="avp-hub-meter"><span data-knowledge-meter style="width:0%"></span></div><small class="avp-hub-muted">Nội dung đã đánh dấu hoàn thành.</small></div></article><article class="avp-hub-card"><h3>Định dạng & dữ liệu</h3><div class="avp-hub-subcard"><b data-format-count>0/0</b><div class="avp-hub-meter"><span data-format-meter style="width:0%"></span></div><small class="avp-hub-muted">Nội dung đã đánh dấu hoàn thành.</small></div></article></div><div class="avp-hub-note">Các số liệu được đọc từ đúng khóa lưu tiến độ của từng thư viện trên trình duyệt hiện tại.</div></section><section class="avp-hub-panel" data-panel="practice" hidden><div class="avp-hub-overview"><article class="avp-hub-stat"><b data-practice-count>—</b><small>Bài đã nộp và được ghi nhận</small></article><article class="avp-hub-stat"><b data-practice-average>—</b><small>Điểm trung bình</small></article><article class="avp-hub-stat"><b data-practice-total>—</b><small>Điểm tích lũy</small></article></div><article class="avp-hub-card" style="margin-top:12px"><h3>Kết quả chấm bài</h3><div class="avp-hub-list" data-practice-list><div class="avp-hub-note">Đang tải kết quả bài tập tự chấm…</div></div></article><div class="avp-hub-note" data-practice-note>Kết quả lấy từ tài khoản đã đăng nhập, không lấy lượt tải file làm bài hoàn thành.</div></section></main></section>';
 document.body.appendChild(hub);
 var map=document.createElement('div');map.className='avp-map-modal';map.hidden=true;
 map.innerHTML='<section class="avp-map-box" role="dialog" aria-modal="true" aria-label="Bản đồ hành trình cá nhân"><header class="avp-map-head"><div><small>MY LEARNING JOURNEY</small><h2>Bản đồ hành trình của bạn</h2></div><button class="avp-map-close" type="button" aria-label="Đóng bản đồ">×</button></header><div class="avp-map-content"><div class="avp-hub-muted">Đường đi từ điểm xuất phát đến đích cuối khóa. Vị trí hiện tại được xác định bằng các Checkpoint đã PASS; điểm kế tiếp cho biết chặng cần tiếp tục.</div><div class="avp-map-land"><svg viewBox="0 0 1000 540" role="img" aria-label="Bản đồ địa hình 12 chương"><defs><linearGradient id="avpJourneyLand" x2="1" y2="1"><stop stop-color="#eef3dc"/><stop offset="1" stop-color="#b6d6b8"/></linearGradient><pattern id="avpJourneyDots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1.3" fill="#82a782" opacity=".35"/></pattern></defs><rect width="1000" height="540" fill="url(#avpJourneyLand)"/><rect width="1000" height="540" fill="url(#avpJourneyDots)"/><path d="M0 95Q170 15 310 100T610 80T1000 75L1000 0L0 0Z" fill="#c9dfbd"/><path d="M0 465Q160 380 340 455T690 430T1000 470L1000 540L0 540Z" fill="#c4dfc6"/><path d="M-30 300C80 185 155 410 275 330S420 125 540 230S700 430 805 315S930 165 1030 245" fill="none" stroke="#c7b184" stroke-width="68" stroke-linecap="round"/><path d="M-30 300C80 185 155 410 275 330S420 125 540 230S700 430 805 315S930 165 1030 245" fill="none" stroke="#fff2d2" stroke-width="50" stroke-linecap="round"/><g fill="#739e70"><path d="M65 95l20-38 20 38zM98 110l15-29 15 29zM840 455l20-38 20 38zM875 465l15-29 15 29zM425 490l20-38 20 38z"/></g><g data-map-chapters></g><g data-map-player></g><text x="22" y="30" font-size="18" font-weight="900" fill="#426747">ĐIỂM XUẤT PHÁT</text><text x="805" y="515" font-size="18" font-weight="900" fill="#426747">ĐÍCH ĐẾN</text></svg></div><div class="avp-map-info"><article><small>ĐÃ ĐI QUA</small><b data-map-done>0/135 bài</b></article><article><small>BẠN ĐANG ĐỨNG Ở</small><b data-map-current>Điểm xuất phát</b></article><article><small>CHẶNG TIẾP THEO</small><b data-map-next>Chương 1</b></article></div><div class="avp-hub-note" data-map-description>Hoàn thành Checkpoint đầu tiên để bắt đầu hành trình.</div></div></section>';
 document.body.appendChild(map);
 var chapterTotals=[12,12,12,12,10,12,11,10,12,11,11,10],courseTotal=chapterTotals.reduce(function(a,b){return a+b;},0);
 function readCheckpoints(){var out=[],i;for(i=0;i<localStorage.length;i++){var k=localStorage.key(i),m=k&&k.match(/^avp_checkpoint_local_v1_C(\d{1,2})L(\d{2})$/);if(m){try{var v=JSON.parse(localStorage.getItem(k)||'{}');if(v&&v.passed===true)out.push({key:k,chapter:Number(m[1]),lesson:Number(m[2])});}catch(e){}}}return out;}
 function readJson(key){try{return JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(e){return {};}}
 function readArray(key){try{var v=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(v)?v:[];}catch(e){return [];}}
 function pct(a,b){return b?Math.round(a/b*100):0;}
 function progressData(){var cp=readCheckpoints(),chap=chapterTotals.map(function(total,i){return cp.filter(function(x){return x.chapter===i+1;}).length;});var formula=readJson('avp_formula_library_catalog_v2'),shortcut=readJson('avp_shortcut_library_v1'),knowledge=readJson('avp_excel_knowledge_progress_v2');var fDone=Array.isArray(formula.answeredAllTime)?formula.answeredAllTime:(formula.completedAllTime||formula.completed||[]),sDone=Array.isArray(shortcut.answeredAllTime)?shortcut.answeredAllTime:(shortcut.completedAllTime||shortcut.completed||[]),kDone=Array.isArray(knowledge.completed)?knowledge.completed:[],fmtDone=readArray('avp_data_format_completed_v1');var formulaTotal=(window.AVP_FORMULA_BANK||[]).length,shortcutTotal=(window.AVP_SHORTCUT_QUESTIONS||[]).length,knowledgeTotal=(window.AVP_KNOWLEDGE_BANK||[]).length,formatTotal=(window.AVP_DATA_LIBRARY&&window.AVP_DATA_LIBRARY.items||[]).length;return {cp:cp,chap:chap,courseDone:cp.length,formulaDone:fDone.length,formulaTotal:formulaTotal,shortcutDone:sDone.length,shortcutTotal:shortcutTotal,knowledgeDone:kDone.length,knowledgeTotal:knowledgeTotal,formatDone:fmtDone.length,formatTotal:formatTotal};}
 function loadProgressDataScripts(done){var scripts=[['excel-formula-library-data.js','avp-formula-data-progress'],['excel-shortcut-library-data.js','avp-shortcut-data-progress'],['excel-knowledge-library-data.js','avp-knowledge-data-progress'],['excel-data-format-library-data.js','avp-format-data-progress'],['practice-lessons.js','avp-practice-lessons-progress']];var left=scripts.length;function finish(){left--;if(left<=0&&done)done();}scripts.forEach(function(x){if(document.getElementById(x[1])){finish();return;}var s=document.createElement('script');s.id=x[1];s.src=x[0];s.onload=finish;s.onerror=finish;document.head.appendChild(s);});}
 function renderCourse(){var d=progressData(),percent=pct(d.courseDone,courseTotal),completedChapters=d.chap.filter(function(n,i){return n>=chapterTotals[i];}).length;hub.querySelector('[data-course-count]').textContent=d.courseDone+'/'+courseTotal;hub.querySelector('[data-course-meter]').style.width=percent+'%';hub.querySelector('[data-course-percent]').textContent=percent+'% toàn bộ '+courseTotal+' bài học';hub.querySelector('[data-chapter-count]').textContent=completedChapters+'/12';var current=0,acc=0;for(var i=0;i<12;i++){if(d.chap[i]<chapterTotals[i]){current=i+1;break;}acc+=chapterTotals[i];}if(!current)current=12;hub.querySelector('[data-current-chapter]').textContent=d.courseDone?'Chương '+current:'Điểm xuất phát';var list=hub.querySelector('[data-chapter-list]');list.innerHTML='';d.chap.forEach(function(n,i){var row=document.createElement('div');row.className='avp-hub-row';var p=pct(n,chapterTotals[i]);row.innerHTML='<span>Chương '+(i+1)+'</span><div class="avp-hub-meter"><span style="width:'+p+'%"></span></div><strong>'+n+'/'+chapterTotals[i]+'</strong>';list.appendChild(row);});}
 function renderLibrary(){var d=progressData(),items=[['formula',d.formulaDone,d.formulaTotal],['shortcut',d.shortcutDone,d.shortcutTotal],['knowledge',d.knowledgeDone,d.knowledgeTotal],['format',d.formatDone,d.formatTotal]],done=0,total=0;items.forEach(function(x){done+=x[1];total+=x[2];var count=hub.querySelector('[data-'+x[0]+'-count]'),meter=hub.querySelector('[data-'+x[0]+'-meter]');count.textContent=x[1]+'/'+x[2];meter.style.width=pct(x[1],x[2])+'%';});hub.querySelector('[data-library-total]').textContent=done+'/'+total;hub.querySelector('[data-library-percent]').textContent=pct(done,total)+'%';hub.querySelector('[data-library-types]').textContent=items.filter(function(x){return x[1]>0;}).length+'/4';}
 function getSupabase(){return window.avpSupabase||window.supabaseClient||null;}
 function renderPractice(){var sb=getSupabase(),list=hub.querySelector('[data-practice-list]');if(!sb||!sb.rpc){list.innerHTML='<div class="avp-hub-note">Chưa kết nối được dữ liệu tài khoản. Hãy đăng nhập để xem kết quả bài tự chấm.</div>';return;}Promise.resolve(sb.auth&&sb.auth.getUser?sb.auth.getUser():null).then(function(auth){var user=auth&&auth.data&&auth.data.user;if(!user){hub.querySelector('[data-practice-count]').textContent='—';hub.querySelector('[data-practice-average]').textContent='—';hub.querySelector('[data-practice-total]').textContent='—';list.innerHTML='<div class="avp-hub-note">Bạn cần đăng nhập để hệ thống truy xuất bài đã nộp và điểm của chính tài khoản này.</div>';return null;}return sb.rpc('practice_grader_my_submissions_v18');}).then(function(res){if(!res)return;if(res.error){list.innerHTML='<div class="avp-hub-note">Không lấy được kết quả từ hệ thống chấm bài: '+String(res.error.message||'lỗi truy vấn')+'</div>';return;}var rows=Array.isArray(res.data)?res.data:[],lessons=window.AVP_PRACTICE_LESSONS||[],active=lessons.filter(function(x){return x.isActive;}).length,sum=rows.reduce(function(a,x){return a+(Number(x.score)||0);},0),avg=rows.length?Math.round(sum/rows.length):0;hub.querySelector('[data-practice-count]').textContent=rows.length+'/'+(active||'—');hub.querySelector('[data-practice-average]').textContent=rows.length?avg+'/100':'—';hub.querySelector('[data-practice-total]').textContent=sum;list.innerHTML='';if(!rows.length){list.innerHTML='<div class="avp-hub-note">Chưa có bài nộp nào được ghi nhận trong tài khoản này.</div>';return;}rows.slice().sort(function(a,b){return String(b.submitted_at||'').localeCompare(String(a.submitted_at||''));}).forEach(function(row){var lesson=lessons.find(function(x){return x.key===row.lesson_key;}),el=document.createElement('div');el.className='avp-hub-row';var name=lesson?lesson.title:row.lesson_key||'Bài thực hành';el.innerHTML='<span>'+name+'</span><div class="avp-hub-meter"><span style="width:'+Math.max(0,Math.min(100,Number(row.score)||0))+'%"></span></div><strong>'+Number(row.score||0)+'/100</strong>';list.appendChild(el);});}).catch(function(){list.innerHTML='<div class="avp-hub-note">Lỗi kết nối dữ liệu bài tập. Vui lòng thử lại.</div>';});}
 function renderAll(){renderCourse();renderLibrary();renderPractice();}
 function openHub(){hub.hidden=false;document.body.style.overflow='hidden';loadProgressDataScripts(renderAll);renderAll();}
 function closeHub(){hub.hidden=true;document.body.style.overflow='';}
 hub.querySelector('.avp-hub-close').addEventListener('click',closeHub);hub.addEventListener('click',function(e){if(e.target===hub)closeHub();});hub.querySelectorAll('[data-tab]').forEach(function(b){b.addEventListener('click',function(){hub.querySelectorAll('[data-tab]').forEach(function(x){x.setAttribute('aria-selected',String(x===b));});hub.querySelectorAll('[data-panel]').forEach(function(x){x.hidden=x.dataset.panel!==b.dataset.tab;});renderAll();});});
 resource.setAttribute('role','button');resource.setAttribute('tabindex','0');resource.addEventListener('click',openHub);resource.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openHub();}});
 var mapCard=document.querySelector('[data-open-learning-map]');
 function mapRender(){var d=progressData(),points=[[75,300],[150,360],[245,325],[330,245],[430,195],[535,235],[635,330],[735,370],[825,300],[885,215],[940,185],[975,245]],pins=map.querySelector('[data-map-chapters]');pins.innerHTML='';var acc=0,currentChapter=1,nextChapter=1;for(var i=0;i<12;i++){var p=points[i],done=d.chap[i]>=chapterTotals[i],g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('transform','translate('+p[0]+' '+p[1]+')');var circle=document.createElementNS('http://www.w3.org/2000/svg','circle');circle.setAttribute('r','20');circle.setAttribute('fill',done?'#08734b':'#fff');circle.setAttribute('stroke',done?'#fff':'#8eaa94');circle.setAttribute('stroke-width','4');var txt=document.createElementNS('http://www.w3.org/2000/svg','text');txt.setAttribute('text-anchor','middle');txt.setAttribute('y','5');txt.setAttribute('font-size','14');txt.setAttribute('font-weight','900');txt.setAttribute('fill',done?'#fff':'#355b42');txt.textContent=String(i+1);g.append(circle,txt);pins.appendChild(g);if(d.chap[i]<chapterTotals[i]&&nextChapter===1){currentChapter=i+1;nextChapter=i+1;}acc+=chapterTotals[i];}
 var completed=d.chap.reduce(function(a,b){return a+b;},0),idx=11;for(var j=0;j<12;j++){if(d.chap[j]<chapterTotals[j]){idx=j;break;}}var player=map.querySelector('[data-map-player]'),p=points[idx];player.innerHTML='<g transform="translate('+p[0]+' '+(p[1]-40)+')"><circle r="21" fill="#f5a340" stroke="#fff" stroke-width="4"/><text text-anchor="middle" y="6" font-size="18">●</text></g>';var next=Math.min(12,idx+1);map.querySelector('[data-map-done]').textContent=completed+'/'+courseTotal+' bài';map.querySelector('[data-map-current]').textContent=completed?'Chương '+(idx+1):'Điểm xuất phát';map.querySelector('[data-map-next]').textContent=completed>=courseTotal?'Đã đến đích':'Chương '+next;map.querySelector('[data-map-description]').textContent=completed>=courseTotal?'Bạn đã hoàn thành toàn bộ lộ trình 12 chương.':completed?'Bạn đã PASS '+completed+' checkpoint. Tiếp tục hoàn thành bài còn lại tại Chương '+(idx+1)+'; chặng kế tiếp là Chương '+next+'.':'Bạn đang ở điểm xuất phát. Hãy PASS Checkpoint đầu tiên để bắt đầu di chuyển.';mapCard.querySelector('[data-home-map-position]').textContent=completed?'Đang ở Chương '+(idx+1):'Điểm xuất phát';}
 function openMap(){map.hidden=false;document.body.style.overflow='hidden';loadProgressDataScripts(mapRender);mapRender();}
 function closeMap(){map.hidden=true;document.body.style.overflow='';}
 if(mapCard){mapCard.addEventListener('click',openMap);}
 map.querySelector('.avp-map-close').addEventListener('click',closeMap);map.addEventListener('click',function(e){if(e.target===map)closeMap();});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(!map.hidden)closeMap();else if(!hub.hidden)closeHub();}});
 window.addEventListener('storage',function(){if(!hub.hidden)renderAll();if(!map.hidden)mapRender();});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
