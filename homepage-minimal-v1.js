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
    var card=el('div','avp-chapter-lesson-card');
    card.innerHTML='<span class="avp-chapter-lesson-no">'+String(i+1).padStart(2,'0')+'</span><span class="avp-chapter-lesson-copy"><strong></strong><small>Bài học · Chương '+String(index+1).padStart(2,'0')+'</small></span><span class="avp-chapter-lesson-arrow">›</span>';
    card.querySelector('strong').textContent=title;
    list.appendChild(card);
   });
   lessonPanel.appendChild(list);
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
