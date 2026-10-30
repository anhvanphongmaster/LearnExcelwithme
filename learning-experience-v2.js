/*! Learning Experience V2 — per-page learning metadata; not the canonical 12-chapter curriculum */
(function(){
  "use strict";
  const PAGE=(location.pathname.split('/').pop()||'').toLowerCase();

  const pages={
    'excel.html':{id:'excel',stage:'Nền tảng',kind:'lesson',type:'Bài cốt lõi',mins:18,title:'Excel cơ bản: bắt đầu đúng từ bảng dữ liệu',summary:'Bài đầu tiên dành cho người mới. Bạn sẽ hiểu file Excel gồm những gì, nhập dữ liệu đúng kiểu và tự viết công thức đầu tiên trước khi học các công cụ phân tích.',outcomes:['Phân biệt Workbook, Worksheet, ô và vùng dữ liệu','Nhập số, ngày, phần trăm đúng kiểu dữ liệu','Viết công thức cơ bản và hiểu tham chiếu ô'],start:'#excel-lam-quen',startLabel:'Bắt đầu từ phần 1',aidTitle:'Nhớ 2 nguyên tắc trước khi học tiếp',understand:'Excel làm việc tốt nhất khi dữ liệu được tổ chức thành bảng rõ tiêu đề, mỗi cột chỉ chứa một loại thông tin và mỗi dòng là một bản ghi.',example:'Input 1.000 và NG 25 → NG Rate = 2,5%. Nếu đổi Input thành 1.250, công thức tham chiếu ô phải tự cập nhật NG Rate thành 2,0%.',mistakes:['Không gộp ô trong vùng dữ liệu nguồn.','Đừng nhập số/ngày dưới dạng text nếu còn phải tính toán.','Công thức luôn bắt đầu bằng dấu = và nên kiểm tra tham chiếu trước khi kéo xuống.'],quiz:{xp:20,q:'Workbook trong Excel là gì?',opts:['Một ô dữ liệu','Một file Excel có thể chứa nhiều sheet','Một công thức','Một biểu đồ'],ans:1}},
    'phimtatexcel.html':{id:'shortcuts',stage:'Nền tảng',kind:'reference',type:'Kho tra cứu',mins:8,title:'Phím tắt Excel: tra nhanh, không cần học thuộc 100 phím',summary:'Đây là kho tra cứu. Người mới chỉ cần thuộc nhóm phím tắt thiết yếu, sau đó tìm lại theo tình huống khi cần — không phải hoàn thành từ trên xuống dưới.',outcomes:['Thuộc 10 phím tắt dùng hằng ngày','Biết tìm phím tắt theo nhóm công việc','Biết lúc nào dùng chuột sẽ an toàn hơn'],start:'#shortcutSearch',startLabel:'Tìm phím tắt cần dùng',aidTitle:'Cách dùng kho phím tắt không bị ngợp',understand:'Hãy chọn 5–10 phím tắt gắn với công việc bạn đang làm. Dùng lặp lại trong 1 tuần hiệu quả hơn việc cố ghi nhớ cả danh sách.',example:'Một ca làm việc thường chỉ cần vài phím lặp lại: Ctrl+S để lưu, Ctrl+F để tìm, Ctrl+Z để hoàn tác và Ctrl+Shift+L để bật/tắt Filter.',mistakes:['Không học thuộc theo số thứ tự.','Không cố dùng phím tắt cho thao tác hiếm gặp.','Ưu tiên Save, Undo, Copy/Paste, Find, Filter và thao tác chọn vùng trước.'],quiz:{xp:20,q:'Phím tắt Ctrl + S dùng để làm gì?',opts:['Tìm kiếm','Lưu file','In','Đóng file'],ans:1}},
    'congthucexcel.html':{id:'formula',stage:'Nền tảng',kind:'reference',type:'Kho tra cứu',mins:12,title:'Công thức Excel: chọn hàm theo câu hỏi công việc',summary:'Đây là kho công thức để tìm theo nhu cầu. Thay vì nhớ tên hàng chục hàm, hãy bắt đầu từ câu hỏi: cần tính tổng, đếm theo điều kiện, tra cứu hay xử lý văn bản?',outcomes:['Đọc được cú pháp công thức cơ bản','Chọn đúng nhóm hàm theo yêu cầu','Phân biệt tham chiếu tương đối và tuyệt đối'],start:'#searchInput',startLabel:'Tìm công thức cần dùng',aidTitle:'Đừng bắt đầu bằng tên hàm',understand:'Hãy viết câu hỏi công việc trước, ví dụ “đếm bao nhiêu Lot NG” hoặc “tra Model theo mã”. Sau đó mới chọn COUNTIF, XLOOKUP hoặc hàm phù hợp.',example:'Muốn đếm bao nhiêu dòng có trạng thái NG: =COUNTIF(E2:E100,"NG"). Câu hỏi công việc dẫn tới nhóm hàm đếm theo điều kiện.',mistakes:['Không chép công thức khi chưa hiểu vùng tham chiếu.','Kiểm tra dấu phân cách , hoặc ; theo Excel của máy.','Dùng F4 khi cần cố định vùng tham chiếu thay vì gõ $ thủ công nhiều lần.'],quiz:{xp:25,q:'Hàm nào dùng để đếm theo điều kiện?',opts:['SUM','COUNTIF','LEFT','ROUND'],ans:1}},
    'filtersort.html':{id:'filter',stage:'Nền tảng',kind:'lesson',type:'Bài cốt lõi',mins:12,title:'Filter & Sort: tìm đúng dòng dữ liệu trước khi phân tích',summary:'Học cách lọc đúng điều kiện và sắp xếp mà không làm lệch bảng. Đây là kỹ năng nền trước PivotTable và báo cáo.',outcomes:['Lọc dữ liệu theo một hoặc nhiều điều kiện','Sắp xếp số, ngày và văn bản đúng cách','Tránh sort riêng một cột làm hỏng dữ liệu'],start:null,startLabel:'Bắt đầu bài học',aidTitle:'Filter và Sort giải quyết hai việc khác nhau',understand:'Filter chỉ ẩn tạm các dòng không thỏa điều kiện; Sort thay đổi thứ tự hiển thị. Cả hai đều không nên thực hiện trên vùng dữ liệu bị đứt quãng hoặc có dòng tiêu đề phụ.',example:'Lọc Model = FPC-A và NG Rate > 2%, sau đó Sort NG Qty giảm dần để thấy Lot cần ưu tiên trước.',mistakes:['Không Sort riêng một cột khi Excel hỏi Expand the selection.','Không chèn dòng trống giữa bảng dữ liệu.','Sau khi lọc, nhớ kiểm tra biểu tượng Filter trước khi kết luận số lượng.'],quiz:{xp:20,q:'Filter dùng chủ yếu để làm gì?',opts:['Ẩn tạm các dòng không thỏa điều kiện','Xóa dữ liệu','Tạo biểu đồ','Khóa sheet'],ans:0}},
    'pivottable.html':{id:'pivot',stage:'Phân tích',kind:'lesson',type:'Bài cốt lõi',mins:25,title:'PivotTable: từ dữ liệu thô đến bảng tổng hợp',summary:'PivotTable giúp trả lời nhanh “bao nhiêu, theo nhóm nào, trong khoảng nào” mà không phải viết hàng loạt công thức.',outcomes:['Hiểu Rows, Columns, Values và Filters','Tạo bảng tổng hợp từ dữ liệu thô','Biết Refresh và kiểm tra phép tính trong Values'],start:null,startLabel:'Bắt đầu bài học',aidTitle:'Cách nghĩ trước khi kéo trường vào Pivot',understand:'Đặt câu hỏi trước: muốn “tổng hợp chỉ số gì” và “phân nhóm theo chiều nào”. Chỉ sau đó mới kéo trường vào Rows/Columns/Values.',example:'Rows = Model, Values = Sum of Input và Sum of NG, Filters = Shift. Chỉ vài thao tác đã trả lời được Model nào có NG cao nhất theo ca.',mistakes:['Nguồn dữ liệu không được có tiêu đề trống hoặc merge.','Kiểm tra Values đang là Sum hay Count.','Dữ liệu nguồn thay đổi phải Refresh trước khi đọc kết quả.'],quiz:{xp:35,q:'Khi dữ liệu nguồn thay đổi, thao tác nào giúp PivotTable cập nhật?',opts:['Merge','Refresh','Freeze Panes','Wrap Text'],ans:1}},
    'bieudopareto.html':{id:'pareto',stage:'Phân tích',kind:'lesson',type:'Bài cốt lõi',mins:20,title:'Biểu đồ & Pareto: nhìn ra vấn đề cần ưu tiên',summary:'Không phải biểu đồ nào cũng để trang trí. Bài này tập trung vào cách chọn biểu đồ đúng câu hỏi và dùng Pareto để tìm nhóm nguyên nhân đóng góp lớn nhất.',outcomes:['Chọn biểu đồ theo mục đích phân tích','Tính và đọc phần trăm tích lũy','Xác định nhóm lỗi ưu tiên xử lý'],start:null,startLabel:'Bắt đầu bài học',aidTitle:'Pareto không đồng nghĩa “luôn đúng 80/20”',understand:'80/20 là nguyên tắc định hướng. Mục tiêu thực tế là sắp xếp lỗi theo đóng góp giảm dần và nhìn đường % tích lũy để chọn nhóm ưu tiên.',example:'Nếu Scratch 40, Open 25, Short 15 trên tổng 100 lỗi thì ba nhóm đầu đã tạo 80% lỗi — đây là vùng cần xem xét trước.',mistakes:['Phải sắp xếp giá trị giảm dần trước khi tính tích lũy.','Không dùng quá nhiều màu khiến mất trọng tâm.','Luôn đối chiếu cả số lượng tuyệt đối, không chỉ nhìn phần trăm.'],quiz:{xp:30,q:'Đường trong biểu đồ Pareto thường thể hiện gì?',opts:['Giá trị trung bình','% tích lũy','Ngày tháng','Số sheet'],ans:1}},
    'baocaoexcel.html':{id:'report',stage:'Phân tích',kind:'lesson',type:'Bài cốt lõi',mins:25,title:'Báo cáo Excel / QC: biến số liệu thành thông tin để quyết định',summary:'Một báo cáo tốt không phải báo cáo có nhiều biểu đồ nhất. Nó phải cho người đọc biết hiện trạng, vấn đề chính và phần cần hành động.',outcomes:['Chọn KPI phù hợp với mục tiêu báo cáo','Sắp xếp bố cục theo thứ tự đọc','Phân biệt dữ liệu nguồn với phần trình bày'],start:null,startLabel:'Bắt đầu bài học',aidTitle:'Một trang báo cáo chỉ cần trả lời 3 câu hỏi',understand:'Hiện trạng ra sao? Vấn đề nằm ở đâu? Cần ưu tiên hành động gì? Nếu một bảng/biểu đồ không trả lời được câu nào trong ba câu này, nên cân nhắc bỏ.',example:'Một báo cáo ca có thể chỉ cần Total Input, Total NG, NG Rate, Top Defect và danh sách Lot vượt ngưỡng — đủ để người quản lý ra quyết định.',mistakes:['Không đưa mọi chỉ số lên cùng một màn hình.','Không dùng màu chỉ để trang trí.','Luôn kiểm tra tổng số trước và sau khi lọc báo cáo.'],quiz:{xp:35,q:'KPI trên dashboard nên ưu tiên điều gì?',opts:['Càng nhiều càng tốt','Chỉ số liên quan trực tiếp mục tiêu','Màu thật nhiều','Font thật nhỏ'],ans:1}},
    'excel-nang-cao.html':{id:'advanced',stage:'Dữ liệu & Dashboard',kind:'lesson',type:'Bài định hướng',mins:22,title:'Excel nâng cao: chọn đúng công cụ thay vì chồng công thức',summary:'Bài này không yêu cầu nhớ tất cả tính năng nâng cao. Mục tiêu là biết khi nào nên dùng XLOOKUP, Dynamic Array, Power Query, PivotTable hoặc kiểm soát Data Quality.',outcomes:['Chọn công cụ theo loại bài toán','Giảm thao tác tay và công thức lặp','Nhìn được một quy trình dữ liệu hoàn chỉnh'],start:null,startLabel:'Bắt đầu bài học',aidTitle:'Dấu hiệu bạn nên chuyển sang công cụ nâng cao',understand:'Khi một việc lặp lại nhiều lần, dữ liệu đến từ nhiều file hoặc công thức bắt đầu khó kiểm soát, hãy nghĩ đến Power Query, Pivot/Data Model hoặc cấu trúc lại nguồn trước khi viết thêm công thức.',example:'Có 10 file cùng cấu trúc cần gộp mỗi ngày → Power Query. Cần tra tên Model theo mã trong một bảng nhỏ → XLOOKUP có thể đơn giản hơn.',mistakes:['Không dùng Power Query chỉ để thay một công thức đơn giản.','Không biến workbook thành chuỗi công thức khó truy vết.','Ưu tiên dữ liệu sạch trước dashboard đẹp.'],quiz:{xp:40,q:'Công cụ phù hợp nhất để gộp nhiều file cùng cấu trúc?',opts:['WordArt','Power Query','Goal Seek','Format Painter'],ans:1}},
    'power-query-course.html':{id:'powerquery',stage:'Dữ liệu & Dashboard',kind:'course',type:'Khóa 8 bài',mins:60,title:'Power Query: 8 bước từ dữ liệu thô đến Master Data',summary:'Học theo một quy trình công việc duy nhất: lấy dữ liệu, làm sạch, Append/Merge, gộp từ thư mục, kiểm tra chất lượng và Refresh.',outcomes:['Hiểu Applied Steps và Data Type','Append/Merge đúng tình huống','Xây Master refresh-ready từ nhiều file'],start:'#lesson1',startLabel:'Bắt đầu bài 1',secondary:{href:'downloads/PowerQuery-Practice-10-Files.zip',label:'Tải bộ 10 file'},aidTitle:'Đừng học Power Query theo kiểu nhớ nút',understand:'Mỗi bước trong Query phải có lý do và có thể kiểm tra. Sau một bước biến đổi, hãy nhìn số dòng, tên cột và kiểu dữ liệu trước khi đi tiếp.',example:'10 file × 415 dòng phải ra 4.150 dòng. Sau From Folder, hãy kiểm tra Source File = 10 và số dòng trước khi tiếp tục làm sạch.',mistakes:['Không xóa Applied Step chỉ vì chưa hiểu — kiểm tra tác động trước.','Append là nối dòng; Merge là ghép theo khóa.','Chỉ Load bảng cuối nếu các Query trung gian không cần xuất ra sheet.']},
    'power-pivot-dax.html':{id:'dax',stage:'Dữ liệu & Dashboard',kind:'lesson',type:'Bài cốt lõi',mins:30,title:'Power Pivot & DAX: mô hình dữ liệu trước, Measure sau',summary:'Khi dữ liệu nằm ở nhiều bảng, Power Pivot giúp tạo quan hệ thay vì tra cứu lặp. DAX dùng để tạo Measure phản ứng theo bộ lọc báo cáo.',outcomes:['Hiểu Fact, Dimension và Relationship','Phân biệt Measure với Calculated Column','Viết Measure SUM/DIVIDE cơ bản'],start:null,startLabel:'Bắt đầu bài học',aidTitle:'DAX chỉ đúng khi mô hình dữ liệu đúng',understand:'Trước khi viết Measure, hãy kiểm tra khóa giữa bảng Dimension và Fact có duy nhất/khớp hay không. Relationship sai có thể cho kết quả hợp lý về hình thức nhưng sai về số.',example:'DimModel[Model] 1 → * FactQC[Model]. Measure Total NG = SUM(FactQC[NG]); NG Rate = DIVIDE([Total NG],[Total Input],0).',mistakes:['Không tạo relationship many-to-many nếu chưa hiểu tác động.','Dùng DIVIDE cho tỷ lệ để xử lý chia cho 0.','Measure tính theo filter context; không đọc nó như công thức từng dòng.'],quiz:{xp:45,q:'Measure trong Power Pivot thường được viết bằng ngôn ngữ nào?',opts:['HTML','DAX','VBA only','SQL Server Agent'],ans:1}},
    'dashboard-dong.html':{id:'dash',stage:'Dữ liệu & Dashboard',kind:'lesson',type:'Bài cốt lõi',mins:30,title:'Dashboard động: ít biểu đồ hơn, quyết định nhanh hơn',summary:'Tổ chức KPI, xu hướng và Top vấn đề vào một màn hình có bộ lọc. Trọng tâm là đọc được, lọc đúng và Refresh không vỡ.',outcomes:['Thiết kế bố cục theo câu hỏi quản lý','Kết nối Slicer/Timeline hợp lý','Kiểm tra dashboard sau Refresh'],start:null,startLabel:'Bắt đầu bài học',aidTitle:'Bố cục dashboard nên dẫn mắt theo thứ tự',understand:'KPI tổng quan ở trên, xu hướng ở giữa, nguyên nhân/Top vấn đề phía dưới và bộ lọc ở một khu cố định. Đừng bắt người xem tự tìm điểm bắt đầu.',example:'KPI ở hàng đầu, trend NG Rate theo ngày ở giữa, Top 5 Defect phía dưới; một Slicer Model lọc đồng bộ toàn bộ báo cáo.',mistakes:['Không dùng 3D chart và quá nhiều màu.','Các Pivot dùng chung Slicer cần kiểm tra Report Connections.','Số liệu KPI phải đối chiếu được với bảng nguồn/Pivot.'],quiz:{xp:45,q:'Slicer hữu ích nhất cho việc gì?',opts:['Lọc báo cáo tương tác','Đổi mật khẩu','Viết Macro','Nén file'],ans:0}},
    'practice-lab.html':{id:'practice',stage:'Dữ liệu & Dashboard',kind:'project',type:'Practice Lab',mins:90,title:'Practice Lab: 3 project để biến kiến thức thành kỹ năng',summary:'Đây không phải bài đọc. Chọn project theo thứ tự, tải file, làm trong Excel rồi đối chiếu checkpoint trước khi làm quiz cuối.',outcomes:['Hoàn thành PivotTable từ dữ liệu thật','Xây dashboard quản lý một trang','Tạo Data Model và Measure DAX'],start:'#projects',startLabel:'Bắt đầu Project 1',secondary:{href:'downloads/Practice-Lab-V14-Datasets.zip',label:'Tải toàn bộ dữ liệu'},aidTitle:'Cách làm Practice Lab không bị lạc',understand:'Mỗi project chỉ cần tập trung vào output được yêu cầu. Không chỉnh trang trí trước khi số liệu, cấu trúc và bộ lọc đã đúng.',example:'Project Pivot: trước tiên kiểm tra tổng Input/NG, sau đó mới thêm NG Rate và Slicer. Nếu tổng chưa đúng thì chưa chuyển sang trang trí.',mistakes:['Không mở file expected quá sớm nếu muốn tự kiểm tra.','Mỗi project phải đối chiếu checkpoint trước khi đánh dấu xong.','Nếu số tổng sai, quay lại nguồn và logic — không sửa số ở dashboard.']},
    'vba-macro.html':{id:'vba',stage:'Tự động hóa',kind:'lesson',type:'Bài cốt lõi',mins:35,title:'VBA / Macro: tự động hóa thao tác lặp có kiểm soát',summary:'Bắt đầu từ Record Macro để hiểu Excel đang làm gì, sau đó mới chỉnh VBA. Chỉ tự động hóa quy trình đã ổn định và có thể mô tả rõ từng bước.',outcomes:['Biết khi nào nên dùng Macro','Hiểu Sub, Range và Workbook cơ bản','Tạo một Macro lặp lại được an toàn'],start:null,startLabel:'Bắt đầu bài học',aidTitle:'Macro không sửa được một quy trình đang sai',understand:'Nếu thao tác thủ công chưa ổn định, tự động hóa chỉ làm lỗi chạy nhanh hơn. Hãy chuẩn hóa input, output và thứ tự bước trước khi ghi Macro.',example:'Mỗi ngày bạn định dạng cùng một báo cáo: Record Macro một lần, kiểm tra code, rồi gắn macro vào nút để chạy lại quy trình chuẩn.',mistakes:['Lưu file chứa VBA bằng định dạng hỗ trợ macro.','Không chạy macro lạ khi chưa kiểm tra.','Tránh hard-code địa chỉ ô nếu vùng dữ liệu thường thay đổi.'],quiz:{xp:50,q:'Macro phù hợp nhất với loại công việc nào?',opts:['Thao tác lặp lại có quy trình rõ','Mọi quyết định phức tạp','Thiết kế logo','Dịch ngôn ngữ'],ans:0}},
    'solver-whatif.html':{id:'solver',stage:'Tự động hóa',kind:'lesson',type:'Bài cốt lõi',mins:30,title:'What-If & Solver: tìm đầu vào để đạt mục tiêu',summary:'Goal Seek phù hợp bài toán một biến; Solver xử lý nhiều biến và ràng buộc. Bài này giúp chọn đúng công cụ trước khi thiết lập mô hình.',outcomes:['Phân biệt Goal Seek, Scenario và Solver','Thiết lập mục tiêu, biến và ràng buộc','Kiểm tra tính hợp lý của nghiệm'],start:null,startLabel:'Bắt đầu bài học',aidTitle:'Công cụ tối ưu không thay thế mô hình đúng',understand:'Solver chỉ tối ưu theo công thức và ràng buộc bạn đưa vào. Nếu mô hình thiếu giới hạn thực tế, nghiệm “tối ưu” có thể không dùng được.',example:'Biết doanh thu mục tiêu 100 triệu nhưng chưa biết số lượng cần bán: Goal Seek có thể thay đổi ô Số lượng để ô Doanh thu đạt 100 triệu.',mistakes:['Goal Seek chỉ thay đổi một ô đầu vào.','Solver cần xác định rõ Objective, Variable Cells và Constraints.','Luôn kiểm tra nghiệm có hợp lý với nghiệp vụ sau khi Solve.'],quiz:{xp:50,q:'Goal Seek phù hợp khi bạn muốn?',opts:['Tìm giá trị đầu vào để đạt một kết quả mục tiêu','Gộp file','Tạo PivotTable','Đổi font'],ans:0}}
  };

  const coreRoute=['excel.html','filtersort.html','pivottable.html','bieudopareto.html','baocaoexcel.html','excel-nang-cao.html','power-query-course.html','power-pivot-dax.html','dashboard-dong.html','practice-lab.html','vba-macro.html','solver-whatif.html'];
  const referenceRoute=['phimtatexcel.html','congthucexcel.html'];
  const cfg=pages[PAGE]; if(!cfg)return;
  // Opt-in in theory HTML only: Practice Lab retains its existing behavior.
  const refined=document.body?.dataset.learningRefined==='1';

  function json(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch(e){return fallback}}
  function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
  function slug(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,64)||'noi-dung'}
  function getMain(){return document.querySelector('main')}

  function markLegacyHero(){
    let hero=null;
    if(PAGE==='excel.html') hero=document.querySelector('header.page-header');
    else if(PAGE==='excel-nang-cao.html') hero=document.querySelector('header.adv-hero');
    else if(['power-pivot-dax.html','dashboard-dong.html','vba-macro.html','solver-whatif.html'].includes(PAGE)) hero=document.querySelector('header.hero');
    else if(PAGE==='power-query-course.html') hero=document.querySelector('.pq-hero');
    else if(PAGE==='practice-lab.html') hero=document.querySelector('.pl-hero');
    else hero=Array.from(document.querySelectorAll('header')).find(x=>x.querySelector('h1'))||null;
    if(hero) hero.classList.add('avp-learning-legacy-hero');
  }

  function restoreHiddenTheory(){
    const main=getMain();
    if(!main)return;
    main.querySelectorAll('.lesson-show-all').forEach(x=>x.remove());
    main.querySelectorAll('.lesson-extra-block').forEach(el=>{if(el.style)el.style.display='';el.classList.remove('lesson-extra-block')});
  }

  function introHtml(){
    const metaOrder=cfg.kind==='reference'?'Kho tra cứu':cfg.type;
    return `<div class="avp-learning-breadcrumb"><a href="learning-coach.html">Bài học hôm nay</a><i>›</i><span>${escapeHtml(cfg.stage)}</span><i>›</i><strong>${escapeHtml(cfg.title)}</strong></div>
    <section class="avp-learning-intro">
      <div class="avp-learning-kicker"><span class="kind">${escapeHtml(cfg.type)}</span><span>${escapeHtml(cfg.stage)}</span></div>
      <h1>${escapeHtml(cfg.title)}</h1><p>${escapeHtml(cfg.summary)}</p>
      <div class="avp-learning-meta"><span>${escapeHtml(metaOrder)}</span><span>Khoảng ${cfg.mins} phút</span></div>
      <div class="avp-learning-intro-actions"><a class="avp-learning-primary" data-lx-start href="${cfg.start||'#'}">${escapeHtml(cfg.startLabel||'Bắt đầu')}</a><a class="avp-learning-secondary" href="learning-coach.html">← Bài học hôm nay</a>${cfg.secondary?`<a class="avp-learning-secondary" href="${cfg.secondary.href}"${cfg.secondary.href.includes('downloads/')?' download':''}>${escapeHtml(cfg.secondary.label)}</a>`:''}</div>
      <div class="avp-learning-outcomes">${cfg.outcomes.map((x,i)=>`<div class="avp-learning-outcome"><small>${i===0?'Bạn sẽ làm được':'Sau bài này'}</small><strong>${escapeHtml(x)}</strong></div>`).join('')}</div>
    </section>`;
  }

  function aidHtml(){return `<section class="avp-teaching-aid" id="hieu-nhanh"><span>HIỂU NHANH</span><h2>${escapeHtml(cfg.aidTitle)}</h2><div class="avp-teaching-aid-grid"><div class="avp-teaching-aid-card"><h3>Điểm cần hiểu</h3><p>${escapeHtml(cfg.understand)}</p></div><div class="avp-teaching-aid-card"><h3>Ví dụ ngắn</h3><p>${escapeHtml(cfg.example||'Hãy áp dụng trực tiếp trên một bảng dữ liệu nhỏ trước khi chuyển sang dữ liệu thật.')}</p></div><div class="avp-teaching-aid-card warning"><h3>Lỗi người mới hay gặp</h3><ul>${cfg.mistakes.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></div></div></section>`}

  function ensureTocTargets(main){
    if(refined){
      const heads=Array.from(main.querySelectorAll(PAGE==='power-query-course.html'?'.pq-lesson h3,.pq-practice h2,.pq-quiz h2':'h2'))
        .filter(h=>!h.closest('.avp-learning-legacy-hero,[hidden]'));
      const used=new Set();
      return heads.map((h,i)=>{
        const parent=h.closest('section[id],article[id]');
        let target=h.id?h:parent&&!used.has(parent.id)?parent:h;
        let id=target.id;
        if(!id||used.has(id)){
          target=h;const base='lx-'+slug(h.textContent||`phan-${i+1}`);id=base;let n=2;
          while(document.getElementById(id)||used.has(id))id=base+'-'+n++;
          target.id=id;
        }
        used.add(id);h.dataset.lxToc=id;target.setAttribute('tabindex','-1');
        return {h,id,text:h.textContent.replace(/^[^\p{L}\p{N}]+/u,'').trim()};
      }).filter(x=>x.text);
    }
    let heads=[];
    if(PAGE==='power-query-course.html') heads=Array.from(main.querySelectorAll('.pq-lesson h3,.pq-practice h2,.pq-quiz h2'));
    else if(PAGE==='practice-lab.html') heads=Array.from(main.querySelectorAll(':scope > .pl-section > h2'));
    else if(cfg.kind==='reference') heads=Array.from(main.querySelectorAll('h2')).slice(0,8);
    else heads=Array.from(main.querySelectorAll('h2')).filter(h=>!h.closest('.lesson-tips-panel')).slice(0,12);
    const used=new Set();
    heads.forEach((h,i)=>{let id=h.closest('[id]')?.id||h.id||slug(h.textContent||`phan-${i+1}`);let base=id,n=2;while(used.has(id)||document.getElementById(id)&&document.getElementById(id)!==h&&h.closest('#'+CSS.escape(id))==null){id=base+'-'+n++}used.add(id);if(!h.id && !h.closest('[id]'))h.id=id;h.dataset.lxToc=id});
    return heads.map(h=>({h,id:h.dataset.lxToc||h.id||h.closest('[id]')?.id,text:(h.textContent||'').replace(/^[^\p{L}\p{N}]+/u,'').trim()})).filter(x=>x.id&&x.text);
  }

  function makeSidebar(items){
    const aside=document.createElement('aside');aside.className='avp-learning-sidebar';
    aside.innerHTML=`<div class="avp-learning-sidebar-head"><strong>Nội dung bài</strong><button class="avp-learning-toc-toggle" type="button" aria-expanded="false">Mở mục lục</button></div><nav class="avp-learning-toc">${items.map(x=>`<a href="#${escapeHtml(x.id)}">${escapeHtml(x.text)}</a>`).join('')}<a href="#hieu-nhanh">Hiểu nhanh & lỗi thường gặp</a></nav><div class="avp-learning-how"><strong>Nếu chưa biết bắt đầu đâu:</strong><ol><li>Đọc mục tiêu ở đầu trang.</li><li>Đi theo mục lục từ trên xuống.</li><li>Thực hành theo hướng dẫn và tự kiểm tra kết quả.</li></ol></div>`;
    const btn=aside.querySelector('.avp-learning-toc-toggle');btn.addEventListener('click',()=>{const open=aside.classList.toggle('open');btn.setAttribute('aria-expanded',open?'true':'false');btn.textContent=open?'Đóng mục lục':'Mở mục lục'});
    aside.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{if(innerWidth<=920){aside.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.textContent='Mở mục lục'}}));
    if(refined){
      const toc=aside.querySelector('nav');toc.id='lx-table-of-contents';toc.setAttribute('aria-label','Mục lục bài học');
      btn.setAttribute('aria-controls',toc.id);
      aside.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
        const target=document.getElementById(decodeURIComponent(a.hash.slice(1)));
        if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}
        aside.querySelectorAll('a').forEach(link=>{const on=link===a;link.classList.toggle('active',on);if(on)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
      }));
      aside.addEventListener('keydown',e=>{if(e.key==='Escape'&&aside.classList.contains('open')){btn.click();btn.focus()}});
    }
    return aside;
  }

  function buildNav(){
    const nav=document.createElement('nav');nav.className='avp-learning-nav';nav.setAttribute('aria-label','Điều hướng nội dung học');
    if(refined){
      const shortNames={'excel.html':'Excel cơ bản','phimtatexcel.html':'Phím tắt Excel','congthucexcel.html':'Công thức Excel','filtersort.html':'Filter & Sort','pivottable.html':'PivotTable','bieudopareto.html':'Biểu đồ Pareto','baocaoexcel.html':'Báo cáo Excel','excel-nang-cao.html':'Excel nâng cao','power-query-course.html':'Power Query','power-pivot-dax.html':'Power Pivot & DAX','dashboard-dong.html':'Dashboard động','practice-lab.html':'Practice Lab','vba-macro.html':'VBA / Macro','solver-whatif.html':'What-If & Solver','dashboard.html':'Bài học hôm nay'};
      const link=(file,label,cls='side')=>`<a class="${cls}" href="${file}"><small>${label}</small><strong>${escapeHtml(shortNames[file]||'Lộ trình học')}</strong></a>`;
      const map=link('learning-coach.html','DANH SÁCH BÀI','side map');
      if(cfg.kind==='reference'){
        const other=referenceRoute.find(file=>file!==PAGE);
        nav.innerHTML=link('excel.html','ÔN KIẾN THỨC')+map+link(other,'KHO TRA CỨU KHÁC','side next');
      }else{
        const i=coreRoute.indexOf(PAGE);
        const previous=i>0?link(coreRoute[i-1],'← BÀI TRƯỚC'):link('dashboard.html','BÀI HỌC HÔM NAY');
        const next=i<coreRoute.length-1?link(coreRoute[i+1],'BÀI TIẾP THEO →','side next'):'<a class="side next" href="practice-video.html"><small>BƯỚC TIẾP THEO →</small><strong>Chọn bài thực hành</strong></a>';
        nav.innerHTML=previous+map+next;
      }
      return nav;
    }
    if(cfg.kind==='reference'){
      const i=referenceRoute.indexOf(PAGE),other=pages[referenceRoute[i===0?1:0]];
      nav.innerHTML=`<a class="side" href="learning-coach.html"><small>LỘ TRÌNH</small><strong>← Quay lại Bài học hôm nay</strong></a><a class="map" href="learning-coach.html">Danh sách học</a><a class="side next" href="${referenceRoute[i===0?1:0]}"><small>KHO TRA CỨU KHÁC</small><strong>${escapeHtml(other.title)} →</strong></a>`;
      return nav;
    }
    const i=coreRoute.indexOf(PAGE),prev=i>0?pages[coreRoute[i-1]]:null,next=i>=0&&i<coreRoute.length-1?pages[coreRoute[i+1]]:null;
    nav.innerHTML=`${prev?`<a class="side" href="${coreRoute[i-1]}"><small>BÀI TRƯỚC</small><strong>← ${escapeHtml(prev.title)}</strong></a>`:`<a class="side" href="learning-coach.html"><small>LỘ TRÌNH</small><strong>← Skill Map</strong></a>`}<a class="map" href="learning-coach.html">Danh sách bài</a>${next?`<a class="side next" href="${coreRoute[i+1]}"><small>BÀI TIẾP THEO</small><strong>${escapeHtml(next.title)} →</strong></a>`:`<a class="side next" href="practice-video.html"><small>HOÀN THÀNH LỘ TRÌNH</small><strong>Đi thực hành →</strong></a>`}`;
    return nav;
  }

  function setupObservers(sidebar){
    if(refined){
      const links=Array.from(sidebar.querySelectorAll('.avp-learning-toc a'));
      const select=id=>links.forEach(a=>{const on=decodeURIComponent(a.hash.slice(1))===id;a.classList.toggle('active',on);if(on)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
      const fromHash=()=>{try{const id=decodeURIComponent(location.hash.slice(1));if(links.some(a=>decodeURIComponent(a.hash.slice(1))===id))select(id)}catch(_){}};
      if(links.length)select(decodeURIComponent(links[0].hash.slice(1)));fromHash();
      window.addEventListener('hashchange',fromHash);
      if('IntersectionObserver'in window){
        const visible=new Map();
        const io=new IntersectionObserver(entries=>{
          entries.forEach(e=>{if(e.isIntersecting)visible.set(e.target.id,e.target);else visible.delete(e.target.id)});
          const first=Array.from(visible.values()).sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top)[0];if(first)select(first.id);
        },{rootMargin:'-100px 0px -50% 0px',threshold:0});
        links.forEach(a=>{const target=document.getElementById(decodeURIComponent(a.hash.slice(1)));if(target)io.observe(target)});
      }
      return;
    }
    if(!('IntersectionObserver'in window))return;const links=Array.from(sidebar.querySelectorAll('.avp-learning-toc a'));const map=new Map(links.map(a=>[decodeURIComponent(a.hash.slice(1)),a]));const targets=Array.from(map.keys()).map(id=>document.getElementById(id)).filter(Boolean);const io=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(!visible)return;links.forEach(a=>a.classList.remove('active'));map.get(visible.target.id)?.classList.add('active')},{rootMargin:'-18% 0px -68% 0px',threshold:[0,.1,.5]});targets.forEach(t=>io.observe(t));
  }

  function fixStart(main){
    const a=document.querySelector('[data-lx-start]');if(!a)return;if(cfg.start&&document.querySelector(cfg.start))return;
    const first=main.querySelector('h2,h3,.card,.lesson,.shortcut-section,.search-box');if(first){if(!first.id)first.id='bat-dau-noi-dung';a.href='#'+first.id}else a.href='#hieu-nhanh';
  }

  function boot(){
    const main=getMain();if(!main)return;document.body.dataset.learningKind=cfg.kind;markLegacyHero();restoreHiddenTheory();
    document.querySelectorAll('.course-shell,.quiz-panel,.avp-learning-context,.avp-learning-flow,.lesson-action-row,.lesson-progress-strip').forEach(x=>x.remove());
    const host=document.createElement('div');host.className='avp-learning-shell';host.innerHTML=introHtml();
    const grid=document.createElement('div');grid.className='avp-learning-grid';
    const content=document.createElement('div');content.className='avp-learning-content';
    const oldParent=main.parentNode;oldParent.insertBefore(host,main);host.appendChild(grid);
    if(refined){
      // Keep all learning sections in document order and include them in the TOC.
      document.querySelectorAll('.lesson-tips-panel').forEach(x=>{if(!main.contains(x))main.appendChild(x)});
      host.querySelector('.avp-learning-intro-actions a[href="learning-coach.html"]')?.remove();
    }
    const toc=ensureTocTargets(main);const sidebar=makeSidebar(toc);grid.appendChild(sidebar);grid.appendChild(content);content.appendChild(main);
    document.querySelectorAll('.lesson-tips-panel').forEach(x=>{
      if(x.closest('.avp-learning-content'))return;
      if(cfg.kind==='reference') content.insertBefore(x,main); else content.appendChild(x);
    });
    const aid=document.createElement('div');aid.innerHTML=aidHtml();content.appendChild(aid.firstElementChild);
    /* Legacy course XP/progress checkpoint removed. XP now comes only from today's task or practice grader. */
    content.appendChild(buildNav());fixStart(main);setupObservers(sidebar);
    if(refined){
      // Keep the summary before the existing Power Query quiz, so the quiz ends the lesson.
      const nativeQuiz=main.querySelector('.pq-quiz');
      if(nativeQuiz){content.insertBefore(nativeQuiz,content.querySelector('.avp-learning-nav'));const link=sidebar.querySelector('a[href="#pqQuiz"]');if(link)sidebar.querySelector('.avp-learning-toc').appendChild(link);}
      // All large tables/code scroll within the reading column, not the page.
      main.querySelectorAll('table').forEach(table=>{
        if(table.closest('.avp-learning-table-wrap,.lx-table-scroll'))return;
        const wrap=document.createElement('div');wrap.className='lx-table-scroll';wrap.tabIndex=0;wrap.setAttribute('role','region');wrap.setAttribute('aria-label','Bảng dữ liệu, cuộn ngang để xem đủ cột');table.parentNode.insertBefore(wrap,table);wrap.appendChild(table);
      });
      const updateOffset=()=>{const top=document.querySelector('.top-simple-nav');const height=top?.getBoundingClientRect().height||64;host.style.setProperty('--lx-top-offset',`${Math.ceil(height)+16}px`)};
      updateOffset();if('ResizeObserver'in window){const resize=new ResizeObserver(updateOffset);const top=document.querySelector('.top-simple-nav');if(top)resize.observe(top)}
      // Native initial fragment navigation can precede headings generated by this script.
      if(location.hash)requestAnimationFrame(()=>{try{const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target&&host.contains(target))target.scrollIntoView({block:'start'})}catch(_){}});
    }
    setTimeout(restoreHiddenTheory,30);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
