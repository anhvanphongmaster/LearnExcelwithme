(() => {
  'use strict';
  if (window.__AVP_TASK_CONTENT_V7__) return;
  window.__AVP_TASK_CONTENT_V7__ = true;

  const lessons = window.AVPKnowledgeLessons || [];
  const byId = new Map(lessons.map(x => [x.id, x]));
  const q=(text,options,answer,explain)=>({q:text,options,answer,explain});
  const sec=(title,why,steps,body,example,warning,kind='core',questions=[])=>({title,kind,why,steps,body,example,warning,questions});
  const replace=(id,{hook,outcomes,useCases,sections})=>{
    const l=byId.get(id); if(!l) return;
    if(hook) l.hook=hook;
    if(outcomes) l.outcomes=outcomes;
    if(useCases) l.useCases=useCases;
    if(sections) l.sections=sections;
  };

  replace('f01-excel-workspace',{
    hook:'Bạn mở một file Excel lạ và cần biết ngay đang đứng ở đâu, dữ liệu nằm sheet nào, công thức nằm đâu và lưu file thế nào mà không phá bản gốc.',
    outcomes:['Đọc nhanh workbook/sheet đang mở','Dùng Name Box, Formula Bar và Status Bar để định vị','Di chuyển, chọn vùng và lưu bản làm việc an toàn','Biết kiểm tra trước khi sửa file người khác'],
    useCases:['Mở file khách gửi','Tìm đúng sheet dữ liệu','Kiểm tra ô có công thức hay giá trị','Tạo bản Working trước khi chỉnh'],
    sections:[
      sec('1. Định vị workbook trước khi chạm vào dữ liệu','Mở file lạ mà sửa ngay rất dễ đụng nhầm sheet hoặc nhầm bản.',[
        'Đọc tên file trên thanh tiêu đề.','Nhìn danh sách sheet phía dưới.','Bấm từng sheet và xem vùng dữ liệu chính.','Chọn một ô có số liệu rồi nhìn Formula Bar để biết đó là value hay formula.'
      ],['Workbook là cả file; Worksheet là từng sheet. Name Box cho biết địa chỉ ô đang chọn, Formula Bar cho biết nội dung thật của ô.','Trước khi sửa, xác định file này là nguồn, báo cáo hay file tổng hợp.'],{title:'PASS khi',text:'Bạn chỉ ra được file nào đang mở, sheet nào chứa dữ liệu và ô đang chọn là value hay formula.'},'Đừng đánh giá một ô chỉ bằng thứ đang hiển thị; định dạng có thể che nội dung thật.','core'),
      sec('2. Chọn vùng và di chuyển mà không phá bảng','Phần lớn lỗi người mới đến từ chọn sai vùng hoặc kéo nhầm dữ liệu.',[
        'Dùng Ctrl+Arrow để đi tới biên vùng dữ liệu.','Dùng Ctrl+Shift+Arrow để mở rộng vùng chọn.','Dùng Name Box để nhảy thẳng đến ô như H2500.','Trước khi Delete/Cut, nhìn lại vùng đang được bôi chọn.'
      ],['Ctrl+Home về đầu sheet; Ctrl+End tới vùng Excel coi là cuối vùng đã dùng.','Khi chọn cả cột/hàng, hãy chắc nghiệp vụ thật sự cần tác động toàn cột/hàng.'],{title:'Ví dụ',text:'Gõ H2500 vào Name Box để nhảy thẳng tới H2500 thay vì cuộn hàng nghìn dòng.'},'Delete và Clear Contents khác nhau; Delete có thể dịch chuyển ô, còn Clear Contents chỉ xóa nội dung.','core'),
      sec('3. Lưu bản Working an toàn','File học hoặc file khách nên có đường quay lại nếu thao tác sai.',[
        'File → Save As.','Đặt tên có hậu tố _Working hoặc ngày phiên bản.','Giữ file gốc chỉ đọc nếu có thể.','Sau khi lưu, đóng/mở lại một lần để chắc file không hỏng.'
      ],['Autosave không thay thế versioning. Một bản Working giúp rollback khi Remove Duplicates, Replace All hay macro làm sai.'],{title:'Nguyên tắc',text:'Original → Working → Final/Deliverable.'},'Không overwrite file gốc khi chưa kiểm tra kết quả cuối.','core'),
      sec('4. Học thêm: phím tắt điều hướng thiết yếu','Dùng khi file dài và bạn cần thao tác nhanh hơn chuột.',[
        'Ctrl+PageUp/PageDown đổi sheet.','Ctrl+F tìm dữ liệu.','Ctrl+G/Name Box nhảy địa chỉ.','Ctrl+S lưu thường xuyên.'
      ],['Mục tiêu không phải nhớ hàng trăm phím tắt; chỉ cần nhóm giúp giảm lỗi điều hướng.'],{title:'Gợi ý',text:'Ưu tiên Ctrl+Arrow, Ctrl+Shift+Arrow, Ctrl+F, Ctrl+S trước.'},null,'extension')
    ]
  });

  replace('f02-data-entry-types',{
    hook:'Một ô nhìn giống “01/09/2026” hay “00123” chưa chắc đang là Date hay Text. Bài này giúp bạn nhập dữ liệu để Excel hiểu đúng kiểu ngay từ đầu.',
    outcomes:['Phân biệt Number/Text/Date/Boolean thực tế','Giữ được mã có số 0 đầu','Nhập ngày tháng ổn định','Nhận ra dữ liệu đang là Text dù trông giống số/ngày'],
    useCases:['Nhập mã nhân viên 00123','Nhập ngày giao dịch','Nhập % và số tiền','Kiểm tra dữ liệu khách gửi bị sai kiểu'],
    sections:[
      sec('1. Xác định kiểu dữ liệu trước khi nhập','Kiểu dữ liệu quyết định Excel có thể tính, sort và filter đúng hay không.',[
        'Chọn ô mẫu.','Nhập một giá trị.','Nhìn Formula Bar và thử ISNUMBER/ISTEXT nếu cần.','Xác nhận mục đích cột: để tính toán hay để làm mã.'
      ],['Số lượng/doanh thu nên là Number. Mã như 00123 thường nên là Text để giữ số 0 đầu.','Ngày phải là Date thật nếu cần lọc theo tháng hoặc tính chênh lệch ngày.'],{title:'Ví dụ',formula:'=ISTEXT(A2)',text:'TRUE cho biết A2 đang là Text dù màn hình có thể nhìn giống số.'},'Đừng chuyển mọi cột có chữ số sang Number; mã định danh không phải số để tính toán.','core'),
      sec('2. Nhập mã có số 0 đầu đúng cách','Excel có thể biến 00123 thành 123 nếu cột đang được hiểu là Number.',[
        'Chọn cột mã.','Đặt Number Format = Text trước khi nhập/import nếu cần.','Nhập 00123.','Kiểm tra độ dài bằng LEN để chắc số 0 đầu còn nguyên.'
      ],['Dấu nháy đơn trước giá trị cũng ép Text nhưng không nên là giải pháp chính cho cả hệ thống dữ liệu.'],{title:'PASS khi',formula:'=LEN(A2)',text:'Mã 00123 phải có LEN = 5.'},'Nếu một nguồn có 00123 và nguồn kia có 123, lookup có thể fail vì key không đồng nhất.','core'),
      sec('3. Nhập ngày, số tiền và phần trăm','Hiển thị đẹp phải đi sau giá trị đúng.',[
        'Nhập Date bằng định dạng nhất quán.','Kiểm tra ngày bằng cách đổi format sang General/Number tạm thời.','Nhập 10% bằng 10% hoặc 0.1, không nhập text “10 %”.','Nhập tiền là Number rồi mới áp Currency/Accounting.'
      ],['Date thật được Excel lưu như serial number. Phần trăm cũng là Number; 10% thực chất là 0,1.'],{title:'Kiểm tra',text:'Nếu đổi Date sang General và thấy serial number, đó thường là Date thật.'},'Locale ngày tháng có thể khiến 01/09 và 09/01 bị hiểu khác nhau.','core'),
      sec('4. Học thêm: xử lý dữ liệu đã nhập sai kiểu','Dùng khi nhận file có Number stored as Text hoặc Date dạng text.',[
        'Không sửa hàng nghìn ô bằng tay.','Xác định pattern lỗi.','Dùng Text to Columns, VALUE/DATEVALUE hoặc Power Query tùy trường hợp.','Đối chiếu trước/sau chuyển kiểu.'
      ],['Chuyển kiểu hàng loạt cần kiểm tra giá trị không convert được để tránh biến lỗi thành blank.'],{title:'Nguyên tắc',text:'Detect → Convert → Validate → Reconcile.'},null,'extension')
    ]
  });

  replace('f03-formatting-display',{
    hook:'Bạn cần bảng dễ đọc nhưng không được làm thay đổi bản chất dữ liệu. Bài này tách rõ “giá trị thật” với “cách hiển thị” để tránh format đẹp nhưng số sai.',
    outcomes:['Phân biệt value và number format','Dùng format số/ngày/% đúng nghiệp vụ','Căn chỉnh và style có hierarchy','Tránh Merge/format thủ công làm khó xử lý dữ liệu'],
    useCases:['Hiển thị doanh thu có dấu phân cách','Định dạng % KPI','Hiển thị ngày dd/mm/yyyy','Trang trí report nhưng giữ data layer sạch'],
    sections:[
      sec('1. Giá trị thật khác cách hiển thị','Format không sửa giá trị bên trong ô.',[
        'Chọn ô có số 0.256.','Đổi sang Percentage.','Nhìn Formula Bar để thấy giá trị thật vẫn là 0.256.','Đổi qua lại General/Number để hiểu tác động của format.'
      ],['Một ô hiển thị 26% có thể chứa 0.256. Một ngày hiển thị 01/09/2026 có thể là serial number.'],{title:'PASS khi',text:'Bạn giải thích được value thật và format đang hiển thị nó như thế nào.'},'Đừng “sửa” dữ liệu bằng cách chỉ đổi format nếu kiểu dữ liệu đang sai.','core'),
      sec('2. Format số, tiền, ngày và phần trăm nhất quán','Một cột nên có một quy ước hiển thị rõ.',[
        'Chọn cột.','Ctrl+1 mở Format Cells.','Chọn Number/Currency/Date/Percentage phù hợp.','Chốt decimal places và thousand separator.','Áp cùng quy ước cho toàn cột.'
      ],['KPI % nên nhất quán số chữ số thập phân. Doanh thu nên dùng dấu phân cách hàng nghìn; không cần thêm ký hiệu tiền ở mọi ô nếu tiêu đề đã rõ đơn vị.'],{title:'Ví dụ',text:'Revenue: 1,234,567; CR: 12.5%; Date: 01/09/2026.'},'Quá nhiều decimal places tạo cảm giác chính xác giả và làm bảng khó đọc.','core'),
      sec('3. Tạo hierarchy mà không phá data layer','Data sheet và report sheet có mục tiêu khác nhau.',[
        'Data sheet: một header, không merge, màu nhẹ.','Report: dùng font đậm cho KPI/title, khoảng trắng và alignment rõ.','Giữ màu cảnh báo cho exception thật sự.','Kiểm tra dark/light hoặc xuất PDF nếu report sẽ chia sẻ.'
      ],['Format phải giúp người xem biết nhìn đâu trước, không phải làm mọi ô nổi bật như nhau.'],{title:'Nguyên tắc',text:'Data layer tối giản; Report layer mới dùng hierarchy trực quan.'},'Merge Cells trong vùng dữ liệu gây khó Sort/Filter/Pivot/Power Query.','core'),
      sec('4. Học thêm: Conditional Formatting có kiểm soát','Dùng khi cần tô exception theo rule.',[
        'Viết rule bằng giá trị/công thức.','Test ở boundary.','Mở Manage Rules để xem phạm vi Applies to.','Tránh chồng nhiều rule không rõ ưu tiên.'
      ],['Conditional Formatting nên truyền tín hiệu, không thay thế cột Status nghiệp vụ khi cần audit.'],{title:'Ví dụ',text:'Tô đỏ CR < Target nhưng vẫn giữ cột CR và Target để người xem kiểm tra.'},null,'extension')
    ]
  });

  replace('f05-core-functions',{
    hook:'Bạn có một cột số và cần tổng, trung bình, nhỏ nhất, lớn nhất, số lượng — nhưng trước hết phải chắc vùng dữ liệu và kiểu số đúng.',
    outcomes:['Dùng SUM/AVERAGE/MIN/MAX/COUNT đúng vai trò','Chọn vùng bằng thao tác thay vì gõ địa chỉ dài','Phân biệt COUNT và COUNTA','Kiểm tra nhanh kết quả bằng Status Bar'],
    useCases:['Tổng doanh thu','Trung bình lead time','Tìm min/max KPI','Đếm số record có dữ liệu'],
    sections:[
      sec('1. Chọn đúng vùng trước khi chọn hàm','Sai vùng thường nguy hiểm hơn sai tên hàm.',[
        'Bấm ô kết quả.','Gõ =SUM( rồi dùng chuột/chọn vùng.','Kiểm tra địa chỉ vùng trong Formula Bar.','Đóng ngoặc và Enter.'
      ],['SUM cộng Number; text số có thể bị bỏ qua tùy tình huống. Hãy nhìn range thực tế thay vì tin AutoSum hoàn toàn.'],{title:'Ví dụ',formula:'=SUM(H2:H5000)',text:'Tổng cột Revenue từ H2 đến H5000.'},'AutoSum có thể đoán sai vùng khi có blank hoặc bảng không liên tục.','core'),
      sec('2. Chọn hàm theo câu hỏi nghiệp vụ','Mỗi hàm trả lời một câu hỏi khác nhau.',[
        '“Tổng bao nhiêu?” → SUM.','“Trung bình?” → AVERAGE.','“Thấp/cao nhất?” → MIN/MAX.','“Có bao nhiêu số?” → COUNT; “bao nhiêu ô không trống?” → COUNTA.'
      ],['COUNT chỉ đếm Number; COUNTA đếm ô không trống kể cả Text. Vì vậy đếm ID thường dùng COUNTA hoặc COUNTIFS tùy dữ liệu.'],{title:'Ví dụ',formula:'=COUNTA(A2:A5000)',text:'Đếm số ô ID không trống nếu ID có thể là text.'},'COUNTA cũng đếm công thức trả chuỗi rỗng trong một số trường hợp; cần hiểu nguồn.','core'),
      sec('3. Kiểm tra nhanh bằng Status Bar','Một control độc lập giúp phát hiện vùng chọn sai.',[
        'Chọn vùng số cần kiểm tra.','Nhìn Status Bar: Sum/Average/Count.','So với kết quả công thức.','Nếu lệch, kiểm tra filtered rows, text số hoặc range.'
      ],['Status Bar rất hữu ích như sanity check nhanh trước khi xây công thức phức tạp.'],{title:'PASS khi',text:'SUM/AVERAGE của công thức khớp kiểm tra trên cùng vùng dữ liệu.'},'Đừng dùng cùng một công thức copy sang ô khác rồi gọi đó là kiểm tra độc lập.','core'),
      sec('4. Học thêm: SUBTOTAL khi bảng đang Filter','Dùng khi muốn tổng chỉ các dòng đang hiển thị.',[
        'Bật Filter.','Dùng SUBTOTAL thay SUM.','Thay đổi Filter.','Quan sát kết quả tự đổi theo dòng visible.'
      ],['SUBTOTAL hữu ích cho bảng kiểm tra tương tác và tránh cộng cả dòng đang ẩn bởi Filter.'],{title:'Ví dụ',formula:'=SUBTOTAL(9,H2:H5000)',text:'Function_num 9 tính SUM trên vùng với behavior của SUBTOTAL.'},null,'extension')
    ]
  });

  replace('a15-kpi-analysis',{
    hook:'Bạn có Actual và Target. Mục tiêu không phải chỉ tính một tỷ lệ, mà phải thống nhất định nghĩa KPI, mẫu số, kỳ thời gian và cách xử lý trường hợp Target = 0.',
    outcomes:['Định nghĩa KPI trước khi viết công thức','Tính Actual/Target/Variance đúng','Tránh average-of-averages sai','Thiết kế control để KPI đối chiếu được về nguồn'],
    useCases:['Sales achievement','Conversion Rate','Defect Rate','Target phân bổ theo ngày/cửa hàng'],
    sections:[
      sec('1. Viết định nghĩa KPI trước công thức','Tên KPI giống nhau có thể được hiểu khác nhau giữa các đội.',[
        'Ghi tên KPI.','Ghi numerator.','Ghi denominator/target.','Ghi grain và khoảng thời gian.','Ghi rule cho blank/zero/exclusion.'
      ],['Ví dụ CR phải nói rõ Orders/Visitors hay Orders/Approached Customers. Không có định nghĩa, công thức đúng cú pháp vẫn sai nghiệp vụ.'],{title:'KPI contract',text:'CR = Orders / Approached Customers, theo Store-Day, loại test orders.'},'Không lấy công thức từ dashboard cũ nếu chưa xác nhận định nghĩa vẫn giống hiện tại.','core'),
      sec('2. Tính Actual, Target và Variance có kiểm soát','KPI card tối thiểu cần số thật, mốc so và chênh lệch.',[
        'Tính Actual từ nguồn đúng grain.','Lấy Target từ bảng target/config.','Tính Variance = Actual - Target.','Tính Achievement = Actual/Target nếu Target hợp lệ.','Test Target = 0 và blank.'
      ],['Target = 0 không nên tự động biến thành 0% bằng IFERROR nếu nghiệp vụ chưa định nghĩa. Có thể phải hiển thị N/A.'],{title:'Ví dụ',formula:'=IF(Target=0,NA(),Actual/Target)',text:'Chỉ dùng rule N/A nếu nghiệp vụ đã thống nhất.'},'IFERROR(Actual/Target,0) có thể biến lỗi dữ liệu thành KPI 0% trông hợp lệ.','core'),
      sec('3. Tổng hợp tỷ lệ đúng cách','Rate tổng thường phải tính từ tổng tử số / tổng mẫu số.',[
        'Cộng tổng numerator.','Cộng tổng denominator.','Tính rate tổng từ hai tổng.','So với AVERAGE(rate từng dòng) để thấy chênh lệch nếu trọng số khác nhau.'
      ],['Average-of-averages sai khi các nhóm có mẫu số khác nhau. Weighted rate bằng tổng numerator / tổng denominator thường đúng hơn.'],{title:'Ví dụ',text:'Store A: 1/10 = 10%, Store B: 90/100 = 90%. Rate tổng = 91/110 = 82.7%, không phải 50%.'},'Không average % con nếu chưa chứng minh các mẫu số có trọng số ngang nhau.','core'),
      sec('4. Học thêm: KPI control sheet','Dùng khi KPI đi vào dashboard/báo cáo quản trị.',[
        'Lưu source total.','Lưu numerator/denominator.','Lưu target.','Lưu filter context.','So delta giữa dashboard và control.'
      ],['Control sheet giúp audit KPI mà không phải click sâu vào từng chart.'],{title:'PASS khi',text:'Dashboard KPI = Control KPI trên cùng filter context.'},null,'extension')
    ]
  });

  replace('a16-charts-pareto',{
    hook:'Bạn đã có bảng số. Bây giờ cần chọn đúng chart cho câu hỏi: so sánh, xu hướng, phân bố hay tìm vài nguyên nhân chính gây phần lớn vấn đề.',
    outcomes:['Chọn chart theo câu hỏi thay vì sở thích','Tạo Pareto từ dữ liệu đã sort đúng','Giảm clutter và giữ visual hierarchy','Kiểm tra chart không làm méo cách đọc số'],
    useCases:['Top lỗi QC','Doanh thu theo tháng','So cửa hàng','Pareto nguyên nhân lỗi'],
    sections:[
      sec('1. Chọn chart theo câu hỏi','Không có một loại chart tốt cho mọi tình huống.',[
        'So category → Column/Bar.','Trend theo thời gian → Line.','Relationship 2 biến → Scatter.','Distribution → Histogram.','Bridge tăng/giảm → Waterfall.'
      ],['Pie/Donut chỉ nên dùng ít category và khi part-to-whole thật sự là câu hỏi. Bar chart thường đọc so sánh tốt hơn.'],{title:'PASS khi',text:'Người xem hiểu câu hỏi chart trả lời mà không cần đọc giải thích dài.'},'Đừng chọn chart chỉ vì “đẹp” hoặc đang có sẵn template.','core'),
      sec('2. Tạo Pareto đúng thứ tự','Pareto cần category đã tổng hợp và sort giảm dần.',[
        'Tổng hợp số lỗi theo Cause.','Sort Count giảm dần.','Tính cumulative count.','Tính cumulative %.','Vẽ cột Count + đường cumulative %.'
      ],['Nếu category chưa sort giảm dần, đường cumulative vẫn tăng nhưng chart không còn đúng mục đích Pareto.'],{title:'Công thức ý tưởng',formula:'Cumulative% = Running Sum / Grand Total',text:'Đường % cho biết vài nguyên nhân đầu đóng góp bao nhiêu tổng lỗi.'},'Không dùng Pareto trên raw rows chưa group theo nguyên nhân.','core'),
      sec('3. Dọn chart để insight nổi lên','Mỗi element giữ lại phải giúp đọc dữ liệu.',[
        'Viết title có ý nghĩa.','Bỏ gridline/legend dư.','Giữ data labels khi thực sự cần.','Highlight một series/exception chính.','Kiểm tra scale trục không gây hiểu sai.'
      ],['Chart chuyên nghiệp thường ít thành phần hơn chart mặc định.'],{title:'Nguyên tắc',text:'Title → dữ liệu chính → context; phần trang trí đứng sau.'},'Trục bị cắt có thể phóng đại chênh lệch; với bar/column cần cân nhắc bắt đầu từ 0.','core'),
      sec('4. Học thêm: accessibility và small multiples','Dùng khi dashboard có nhiều nhóm hoặc nhiều người dùng.',[
        'Không truyền PASS/FAIL chỉ bằng đỏ/xanh.','Thêm label/icon nếu cần.','Dùng small multiples khi nhiều series chồng nhau.','Kiểm tra khi xuất PDF hoặc màn hình nhỏ.'
      ],['Contrast và khả năng đọc quan trọng hơn bảng màu thời thượng.'],{title:'Mục tiêu',text:'Chart vẫn hiểu được nếu in grayscale hoặc người xem khó phân biệt màu.'},null,'extension')
    ]
  });

  replace('a18-report-audit-handover',{
    hook:'Báo cáo chạy trên máy bạn chưa có nghĩa là sẵn sàng bàn giao. Trước khi gửi phải kiểm tra logic, refresh, đường dẫn, filter, sheet ẩn và hướng dẫn sử dụng.',
    outcomes:['Có checklist audit hữu hạn trước bàn giao','Kiểm tra refresh/path/link ngoài','Khóa các checkpoint đã PASS','Tạo hướng dẫn sử dụng đủ ngắn để người nhận tự vận hành'],
    useCases:['Bàn giao file KPI','Gửi dashboard cho khách','Chuyển workbook cho đồng nghiệp','Audit cuối trước nghiệm thu'],
    sections:[
      sec('1. Audit cấu trúc trước logic','Workbook lộn xộn làm người nhận khó tin và khó bảo trì.',[
        'Rà tên/thứ tự sheet.','Rà sheet ẩn/helper có cần giữ.','Rà vùng dư, name range, table/query.','Xóa test/helper không dùng.','Kiểm tra trang mở đầu/điểm vào.'
      ],['Không đổi sheet name/order nếu hệ thống khác đang phụ thuộc mà không có lý do. Audit là giảm rủi ro, không phải refactor tùy hứng.'],{title:'PASS khi',text:'Mỗi sheet/query còn lại đều có lý do tồn tại và người dùng biết bắt đầu ở đâu.'},'Đừng xóa sheet/helper chỉ vì “trông thừa” khi chưa kiểm tra dependency.','core'),
      sec('2. Audit logic, refresh và đường dẫn','Đây là phần quyết định file có chạy trên máy người khác hay không.',[
        'Refresh All trên bản Working.','Kiểm tra query lỗi/connection lỗi.','Rà external links và file path.','Test filter/slicer.','So control total với output.'
      ],['Một file chỉ PASS khi refresh không phá logic và số vẫn reconcile. Nếu nguồn chưa có dữ liệu, ghi rõ DEFERRED thay vì bịa dữ liệu test.'],{title:'PASS gate',text:'Logic PASS · Refresh PASS · Reconcile PASS · Navigation PASS.'},'Không coi “mở file không báo lỗi” là đủ để kết luận bàn giao được.','core'),
      sec('3. Hướng dẫn sử dụng và thay đổi so với bản gốc','Người nhận cần biết nhập đâu, refresh đâu, xem đâu và không được sửa đâu.',[
        'Viết 4 bước sử dụng chính.','Ghi sheet/input người dùng được sửa.','Ghi nút Refresh và thời gian chờ dự kiến.','Ghi nguồn/path cần cập nhật.','Liệt kê những gì đã sửa so với file gốc.'
      ],['Hướng dẫn nên ngắn và đặt ngay trong workbook hoặc file README đi kèm.'],{title:'Mẫu',text:'1) Cập nhật nguồn → 2) Refresh All → 3) kiểm tra Control → 4) xem Dashboard.'},'Đừng bàn giao một file phụ thuộc vào kiến thức chỉ bạn mới nhớ.','core'),
      sec('4. Học thêm: checkpoint và rollback','Dùng cho dự án nhiều vòng sửa.',[
        'Ghi hạng mục đã PASS/LOCK.','Không mở lại checkpoint cũ nếu không có dữ liệu/lỗi mới.','Giữ bản trước thay đổi lớn.','Ghi commit/version khi bàn giao.'
      ],['Checkpoint hữu hạn giúp tránh audit vòng lặp và giảm rủi ro sửa phần đã đúng.'],{title:'Nguyên tắc',text:'PASS thì LOCK; chỉ mở lại khi có bằng chứng mới.'},null,'extension')
    ]
  });

  replace('x19-advanced-formulas',{
    hook:'Khi công thức bắt đầu dài và nhiều điều kiện, mục tiêu không phải viết “cao cấp” hơn mà là làm logic ngắn hơn, dễ debug hơn và tái sử dụng được.',
    outcomes:['Chia công thức dài thành phần có thể kiểm tra','Dùng LET để đặt tên biến trong công thức','Biết chọn FILTER/SUMPRODUCT/INDEX tùy bài toán','Tránh công thức thông minh nhưng khó bàn giao'],
    useCases:['Công thức KPI nhiều bước','Lọc mảng theo điều kiện','Tính có trọng số','Giảm lặp lại cùng biểu thức'],
    sections:[
      sec('1. Tách bài toán trước khi viết công thức dài','Công thức 300 ký tự rất khó debug nếu viết một lần.',[
        'Viết kết quả cuối cần gì.','Tách thành input/intermediate/output.','Test từng phần trong ô/helper hoặc Formula Bar.','Chỉ ghép lại sau khi từng phần đúng.'
      ],['Helper columns không phải thất bại. Với file bàn giao, 3 cột rõ ràng thường tốt hơn một công thức khó đọc.'],{title:'PASS khi',text:'Bạn chỉ ra được từng phần của công thức đang làm nhiệm vụ gì.'},'Đừng tối ưu “ít ô” trước khi tối ưu khả năng kiểm tra.','core'),
      sec('2. LET để đặt tên biến và giảm tính lặp','LET giúp công thức dài đọc gần giống pseudo-code.',[
        'Xác định biểu thức lặp lại.','Đặt tên bằng LET.','Dùng tên đó trong phần calculation.','Test kết quả với case bình thường và boundary.'
      ],['LET vừa dễ đọc vừa có thể giảm việc Excel tính lại cùng biểu thức nhiều lần trong một công thức.'],{title:'Ví dụ',formula:'=LET(a,B2,b,C2,IF(b=0,NA(),a/b))',text:'Đặt tên Actual và Target trước khi tính achievement.'},'Tên biến phải có ý nghĩa; x,y,z chỉ tiết kiệm ký tự nhưng làm giảm khả năng bàn giao.','core'),
      sec('3. Chọn công cụ công thức theo dạng bài','Không phải bài nâng cao nào cũng cần SUMPRODUCT.',[
        'Cần lọc danh sách → FILTER nếu phiên bản hỗ trợ.','Cần lookup → XLOOKUP/INDEX-MATCH.','Cần tính theo nhiều điều kiện → SUMIFS/COUNTIFS trước.','Chỉ dùng SUMPRODUCT khi cấu trúc điều kiện/mảng thật sự cần.'
      ],['Ưu tiên hàm chuyên dụng dễ đọc trước; công thức mảng tổng quát chỉ dùng khi bài toán vượt khả năng hàm chuyên dụng.'],{title:'Nguyên tắc',text:'Đúng → dễ đọc → dễ kiểm tra → rồi mới tối ưu ngắn.'},'SUMPRODUCT trên cả cột với file lớn có thể gây nặng đáng kể.','core'),
      sec('4. Học thêm: Evaluate Formula và F9 debug','Dùng khi một phần công thức trả sai.',[
        'Chọn một phần biểu thức trong Formula Bar.','Nhấn F9 để xem kết quả tạm.','Esc để không ghi đè công thức.','Hoặc dùng Formulas → Evaluate Formula.'
      ],['Debug từng phần nhanh hơn đoán toàn công thức.'],{title:'Cảnh báo',text:'Sau F9 phải nhấn Esc nếu chỉ muốn xem kết quả tạm.'},null,'extension')
    ]
  });

  replace('x20-dynamic-array',{
    hook:'Bạn cần danh sách tự mở rộng như “các cửa hàng có doanh thu > target” hoặc danh sách unique. Dynamic Array giúp một công thức trả nhiều ô mà không copy xuống.',
    outcomes:['Hiểu spill range và lỗi #SPILL!','Dùng FILTER/UNIQUE/SORT theo nhiệm vụ','Ghép các hàm thành report phụ động','Biết giới hạn phiên bản Excel khi bàn giao'],
    useCases:['Danh sách unique Store','Lọc exception tự động','Sort top danh sách','Tạo report phụ không cần helper copy xuống'],
    sections:[
      sec('1. Hiểu spill trước khi dùng hàm động','Một công thức có thể chiếm nhiều ô kết quả.',[
        'Nhập =UNIQUE(A2:A100).','Quan sát vùng kết quả spill.','Thử đặt dữ liệu chặn vào vùng spill để thấy #SPILL!.','Xóa vật cản và kiểm tra lại.'
      ],['Chỉ ô góc trên chứa công thức; các ô còn lại là spill output. Dùng A2# để tham chiếu toàn spill range.'],{title:'Ví dụ',formula:'=UNIQUE(D2:D5000)',text:'Trả danh sách Store không trùng.'},'Không gõ dữ liệu thủ công vào giữa spill range.','core'),
      sec('2. FILTER + SORT cho danh sách theo điều kiện','Đây là cặp hàm rất thực dụng để tạo exception list.',[
        'Xác định vùng trả về.','Viết điều kiện Boolean.','FILTER dữ liệu.','Bọc SORT nếu cần sắp xếp.','Test trường hợp không có kết quả.'
      ],['FILTER không thay thế Power Query cho ETL lớn; nó phù hợp với report động trong workbook.'],{title:'Ví dụ',formula:'=SORT(FILTER(A2:H5000,H2:H5000>10000000))',text:'Lọc các giao dịch Revenue > 10 triệu rồi sort kết quả.'},'Mảng lớn, nhiều FILTER lồng nhau có thể làm workbook nặng.','core'),
      sec('3. UNIQUE + SORT để tạo danh mục động','Danh mục động hữu ích cho report và validation tùy phiên bản.',[
        'Lấy cột nguồn sạch.','Dùng UNIQUE.','Bọc SORT.','Kiểm tra blank có xuất hiện không.','Dùng spill range cho nơi cần danh mục.'
      ],['Nếu nguồn có blank, có thể cần FILTER bỏ blank trước UNIQUE.'],{title:'Ví dụ',formula:'=SORT(UNIQUE(FILTER(D2:D5000,D2:D5000<>"")))',text:'Danh sách Store duy nhất, bỏ blank, sắp xếp A→Z.'},'Không dùng unique list để che duplicate key trong Master; duplicate key vẫn phải xử lý nghiệp vụ.','core'),
      sec('4. Học thêm: TEXTSPLIT/VSTACK/LAMBDA và khả năng tương thích','Dùng khi Excel phiên bản mới hỗ trợ và file không cần chạy trên bản cũ.',[
        'Kiểm tra phiên bản người nhận.','Dùng hàm mới trên bản copy.','Ghi rõ yêu cầu phiên bản trong handover.','Chuẩn bị phương án PQ/helper nếu cần tương thích.'
      ],['Hàm mới mạnh nhưng #NAME? trên Excel cũ có thể làm cả báo cáo hỏng.'],{title:'Nguyên tắc',text:'Tính năng mới chỉ là lựa chọn tốt khi môi trường người dùng hỗ trợ.'},null,'extension')
    ]
  });

  replace('x22-power-query-multi-source',{
    hook:'Bạn có 12 file tháng hoặc nhiều bảng cần ghép. Power Query chỉ đáng tin khi schema, key và quy tắc Append/Merge được kiểm soát trước khi bấm Combine.',
    outcomes:['Phân biệt Append và Merge','Combine nhiều file có schema kiểm soát','Thiết kế staging query giảm lặp','Phát hiện schema drift/unmatched trước khi load'],
    useCases:['Gộp file bán hàng theo tháng','Ghép Sales với Master','Combine folder định kỳ','Tạo pipeline nhiều nguồn có thể refresh'],
    sections:[
      sec('1. Chọn Append hay Merge trước khi bấm','Append là xếp thêm dòng; Merge là ghép thêm cột theo key.',[
        'Nếu các bảng cùng loại record theo tháng → Append.','Nếu bảng giao dịch cần thêm thuộc tính từ Master → Merge.','Xác định key Merge.','Kiểm tra uniqueness của key phía Master.'
      ],['Sai lựa chọn có thể tạo duplicate hoặc số dòng tăng bất thường.'],{title:'Ví dụ',text:'Jan + Feb + Mar → Append; Sales + Store Master theo STORE_CODE → Merge.'},'Merge với Master trùng key có thể nhân dòng giao dịch.','core'),
      sec('2. Combine Folder có schema kiểm soát','Folder Combine phải chịu được file mới cùng cấu trúc và báo được file lệch cấu trúc.',[
        'Chuẩn hóa tên cột trong file mẫu.','Chỉ giữ file hợp lệ trong folder nguồn.','Combine Files.','Kiểm tra sample transform.','So row count trước/sau và theo Source.Name.'
      ],['Source.Name nên được giữ ít nhất trong staging để truy vết file gây lỗi.'],{title:'PASS khi',text:'Thêm một file đúng schema → Refresh tăng đúng số dòng; file sai schema được phát hiện rõ.'},'Đừng để file backup/tmp trong cùng folder nếu query đọc mọi file.','core'),
      sec('3. Staging, Connection Only và kiểm tra Merge','Kiến trúc query tốt giúp refresh nhẹ và debug dễ.',[
        'Tạo query nguồn/staging.','Chỉ giữ cột cần thiết sớm.','Disable load/Connection Only cho staging không cần sheet.','Merge từ staging đã sạch.','Kiểm tra unmatched bằng Left Anti hoặc null sau expand.'
      ],['Tránh nhiều query cùng đọc lại một file nguồn nếu có thể Reference từ staging.'],{title:'Nguyên tắc',text:'Source → Staging → Transform/Join → Output.'},'Expand tất cả cột sau Merge làm query nặng và dễ xung đột tên cột.','core'),
      sec('4. Học thêm: schema drift và failure design','Dùng khi pipeline chạy lâu dài với file do nhiều người gửi.',[
        'Chốt danh sách required columns.','Detect missing/extra columns.','Ghi exception thay vì tự đoán mapping.','Không load output nếu lỗi cấu trúc nghiêm trọng.'
      ],['Pipeline tốt không chỉ chạy khi dữ liệu đẹp; nó còn fail rõ khi đầu vào sai.'],{title:'Mục tiêu',text:'Sai schema phải tạo lỗi có thể hành động, không âm thầm cho số sai.'},null,'extension')
    ]
  });

  replace('x23-macro-vba',{
    hook:'Bạn đang lặp 20 click mỗi ngày. Macro/VBA chỉ nên tự động hóa quy trình đã ổn định, bắt đầu từ một thao tác nhỏ và luôn test trên bản copy.',
    outcomes:['Record và đọc được macro cơ bản','Hiểu Range/Worksheet/Workbook cần được qualify','Tránh Select/Activate khi có thể','Có cleanup/error handling tối thiểu trước khi bàn giao'],
    useCases:['Format báo cáo lặp','Export sheet/PDF','Lặp thao tác nhiều workbook','Nút refresh/chuẩn hóa thao tác'],
    sections:[
      sec('1. Record một tác vụ nhỏ rồi đọc code','Recorder là cách học object model rất nhanh nhưng code ghi lại thường chưa tối ưu.',[
        'Bật Developer nếu cần.','Record Macro.','Thực hiện 2–3 thao tác nhỏ.','Stop Recording.','Alt+F11 mở module và đọc code.'
      ],['Nhìn code để thấy Excel mô tả Range, Worksheet và method như thế nào.'],{title:'PASS khi',text:'Macro chạy lại đúng tác vụ trên bản copy mà không cần bạn click từng bước.'},'Không record một quy trình dài 50 bước ngay từ đầu; rất khó debug.','core'),
      sec('2. Bỏ Select/Activate và qualify object','Code nên nói rõ workbook/sheet/range nào đang được thao tác.',[
        'Tìm các dòng Select/Selection.','Đổi sang tham chiếu trực tiếp.','Dùng ThisWorkbook khi macro phải thao tác file chứa code.','Qualify Worksheets("Data").Range("A1").'
      ],['ActiveWorkbook/ActiveSheet thay đổi theo cửa sổ người dùng đang click nên là nguồn lỗi lớn.'],{title:'Ví dụ',formula:'ThisWorkbook.Worksheets("Data").Range("A1").Value = "OK"',text:'Không phụ thuộc sheet đang active.'},'Macro chạy đúng trên máy bạn có thể chạy sai nếu ActiveWorkbook khác khi người dùng bấm nút.','core'),
      sec('3. Test, cleanup và phục hồi trạng thái Excel','Macro tốt phải trả Excel về trạng thái bình thường kể cả khi lỗi.',[
        'Test trên bản copy.','Nếu tắt ScreenUpdating/Calculation, lưu trạng thái cũ.','Dùng error handler/cleanup.','Bật lại ScreenUpdating/Calculation trong cleanup.','Test case lỗi chủ động.'
      ],['Optimization mà quên phục hồi Calculation có thể khiến workbook sau đó không tính lại.'],{title:'PASS khi',text:'Macro thành công và macro lỗi đều kết thúc với Excel ở trạng thái sử dụng bình thường.'},'On Error Resume Next toàn module có thể che lỗi nguy hiểm.','core'),
      sec('4. Học thêm: security và bàn giao .xlsm','Dùng trước khi phát hành macro cho người khác.',[
        'Lưu đúng định dạng .xlsm.','Ghi macro làm gì và input/output.','Không yêu cầu người dùng bật mọi macro toàn hệ thống.','Dùng Trusted Location/signing theo chính sách tổ chức nếu có.'
      ],['Bảo mật macro là phần của sản phẩm, không phải bước phụ.'],{title:'Nguyên tắc',text:'Chỉ bật macro từ nguồn tin cậy và phạm vi được kiểm soát.'},null,'extension')
    ]
  });

  replace('x24-automation-workflow',{
    hook:'Bài cuối không yêu cầu thêm một hàm mới. Mục tiêu là nhìn một công việc Excel từ đầu đến cuối và chọn đúng công cụ cho từng tầng: Input → Transform → Calculate → Report → Validate → Deliver.',
    outcomes:['Thiết kế workflow trước khi xây file','Tách data/logic/report/control','Chọn Formula/Pivot/PQ/VBA đúng chỗ','Định nghĩa Definition of Done trước bàn giao'],
    useCases:['Báo cáo Sales hàng tháng','KPI cửa hàng','QC defect report','Quy trình tự động hóa file lặp'],
    sections:[
      sec('1. Vẽ workflow trước khi mở Excel','Kiến trúc sai khiến file càng làm càng khó sửa.',[
        'Viết nguồn Input.','Viết bước Transform.','Viết logic Calculate/Model.','Viết output Report.','Viết cách Validate.','Viết Deliver/Handover.'
      ],['Một sơ đồ 6 bước đủ để phát hiện sớm chỗ nào đang copy/paste thủ công hoặc trộn data với report.'],{title:'Khung',text:'Input → Transform → Calculate → Report → Validate → Deliver.'},'Đừng bắt đầu bằng việc thiết kế Dashboard khi chưa biết nguồn và logic.','core'),
      sec('2. Chọn công cụ theo loại việc','Công cụ đúng giúp file nhẹ và dễ bảo trì hơn.',[
        'Công thức: logic theo ô/bảng vừa.','Pivot: tổng hợp/khám phá nhanh.','Power Query: ETL lặp, nhiều nguồn.','VBA: thao tác lặp/automation giao diện.','Data Model: quan hệ và dữ liệu lớn khi cần.'
      ],['Không ép mọi bài vào VBA hay Power Query. Tool selection là quyết định kỹ thuật theo bài toán.'],{title:'Ví dụ',text:'12 file tháng → Power Query Append; KPI card → Formula/Pivot; export 20 PDF lặp → VBA.'},'Dùng công cụ phức tạp hơn không tự động làm giải pháp chuyên nghiệp hơn.','core'),
      sec('3. Definition of Done và control','Workflow chỉ hoàn thành khi có bằng chứng đúng và người khác dùng được.',[
        'Logic PASS.','Refresh PASS.','Reconcile PASS.','Navigation PASS.','Handover PASS.','Performance đủ dùng trên máy mục tiêu.'
      ],['Mỗi PASS nên có cách kiểm tra cụ thể; không dùng cảm giác “chắc ổn”.'],{title:'Definition of Done',text:'Logic · Refresh · Reconcile · Navigation · Handover đều PASS.'},'Nếu thiếu dữ liệu đầu vào, ghi DEFERRED rõ thay vì tự bịa dữ liệu để đánh dấu PASS.','core'),
      sec('4. Học thêm: thiết kế để bảo trì và mở rộng','Dùng khi file sẽ sống lâu hơn một kỳ báo cáo.',[
        'Đưa config ra bảng rõ ràng.','Giảm hardcode path/target trong công thức.','Giữ naming nhất quán.','Document dependency.','Tối ưu sau khi đo bottleneck thật.'
      ],['File chuyên nghiệp là file người khác có thể hiểu, refresh và sửa mà không cần gọi tác giả mỗi tháng.'],{title:'Mục tiêu cuối',text:'Người dùng mới đọc hướng dẫn ngắn vẫn có thể vận hành workflow đúng.'},null,'extension')
    ]
  });

  window.AVPTaskContentCoverageV7 = {
    legacyRewritten:[
      'f01-excel-workspace','f02-data-entry-types','f03-formatting-display','f05-core-functions',
      'a15-kpi-analysis','a16-charts-pareto','a18-report-audit-handover',
      'x19-advanced-formulas','x20-dynamic-array','x22-power-query-multi-source',
      'x23-macro-vba','x24-automation-workflow'
    ],
    status:'legacy-24-complete'
  };
})();