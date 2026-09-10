(() => {
  'use strict';
  if (window.__AVP_TASK_CONTENT_V5__) return;
  window.__AVP_TASK_CONTENT_V5__ = true;

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

  replace('s08-conditional-aggregation',{
    hook:'Bạn có một bảng bán hàng hàng nghìn dòng và cần trả lời ngay: “Doanh thu cửa hàng HN01 trong tháng 9 là bao nhiêu?” Bài này đi thẳng từ câu hỏi đó đến công thức đúng, cách khóa vùng và cách đối chiếu kết quả.',
    outcomes:['Biến câu hỏi nghiệp vụ thành SUMIFS/COUNTIFS đúng cột','Viết tiêu chí text, số và khoảng ngày mà không đoán cú pháp','Khóa đúng vùng khi kéo công thức','Đối chiếu kết quả bằng Filter/Pivot trước khi dùng vào báo cáo'],
    useCases:['Tổng doanh thu theo cửa hàng và tháng','Đếm đơn lỗi theo model/ca','Tính KPI theo nhiều điều kiện','Soát công thức tổng hợp trước khi đưa lên dashboard'],
    sections:[
      sec('1. Chốt đúng câu hỏi trước khi gõ công thức','Nếu chưa chỉ ra cột nào cần cộng và cột nào là điều kiện, rất dễ chọn nhầm range.',[
        'Đọc câu hỏi: “Doanh thu HN01 trong tháng 9”.','Xác định cột cần cộng: Revenue.','Xác định điều kiện 1: Store = HN01.','Xác định điều kiện 2: Date nằm trong tháng 9.'
      ],['SUMIFS không “hiểu” câu hỏi nghiệp vụ. Bạn phải tách câu hỏi thành sum_range và từng criteria_range.','Nếu mục tiêu là đếm số dòng thay vì cộng giá trị, chuyển sang COUNTIFS; khi đó không còn sum_range.'],{title:'Mẫu tư duy',formula:'SUMIFS(Revenue, Store, "HN01", Date, từ_ngày, Date, đến_ngày)',text:'Chưa cần gõ ngay. Chỉ cần xác định đúng vai trò từng cột trước.'},null,'core',[q('Trong câu “tổng Revenue của HN01”, sum_range là cột nào?',['Store','Revenue','Date','Order ID'],1,'Cột cần cộng là Revenue; Store chỉ là vùng điều kiện.')]),
      sec('2. Viết SUMIFS 2 điều kiện và khóa vùng','Đây là thao tác dùng hàng ngày; cần làm đúng ngay từ công thức đầu tiên.',[
        'Chọn ô kết quả.','Gõ =SUMIFS(','Chọn cột Revenue làm sum_range.','Chọn cột Store, chọn ô chứa HN01 làm criteria1.','Chọn cột Date hai lần cho điều kiện từ ngày và đến ngày.','Nhấn F4 để khóa các vùng nguồn nếu sẽ kéo công thức.','Enter và kiểm tra kết quả.'
      ],['Các range trong SUMIFS phải cùng kích thước. Nếu Revenue bắt đầu dòng 2 nhưng Store bắt đầu dòng 3, kết quả có thể sai hoặc báo lỗi.','Khi criteria nằm trong ô, ưu tiên tham chiếu ô thay vì hardcode để báo cáo thay đổi được.'],{title:'Ví dụ',formula:'=SUMIFS($H$2:$H$5000,$D$2:$D$5000,$B2,$A$2:$A$5000,">="&C$1,$A$2:$A$5000,"<"&EDATE(C$1,1))',text:'Tổng Revenue theo Store ở B2 và tháng bắt đầu tại C1.'},'Nếu Date đang là Text, SUMIFS theo khoảng ngày có thể trả sai dù nhìn trên màn hình giống ngày thật.','core',[q('Vì sao dùng < ngày đầu tháng sau thường an toàn?',['Bao trọn cả ngày cuối tháng kể cả có time','Để file nhẹ hơn','Vì SUMIFS bắt buộc','Để đổi màu'],0,'Điều kiện < đầu tháng sau tránh bỏ sót giá trị DateTime ở ngày cuối tháng.')]),
      sec('3. Đối chiếu trước khi tin kết quả','Công thức chạy không có nghĩa là số đúng.',[
        'Filter Store = HN01.','Filter Date đúng khoảng tháng 9.','Xem Sum của cột Revenue ở Status Bar hoặc tạo Pivot kiểm tra.','So với ô SUMIFS.','Nếu lệch, kiểm tra Date type, khoảng range và dữ liệu blank/text.'
      ],['Đối chiếu độc lập là bước bắt buộc trước khi dùng số vào KPI hoặc Dashboard.','Một control tốt phải dùng cách tính khác với công thức chính, không chỉ copy lại chính SUMIFS sang ô khác.'],{title:'PASS khi',text:'Số SUMIFS = số Filter/Pivot kiểm tra trên cùng tập dữ liệu.'},'Đừng “sửa công thức cho ra số mong muốn”. Hãy tìm nguyên nhân lệch trước.','core'),
      sec('4. Học thêm: criteria động và wildcard','Dùng khi báo cáo cần điều kiện linh hoạt hơn.',[
        'Nối toán tử với ô: ">="&F2.','Dùng "*abc*" khi cần chứa chuỗi abc.','Kiểm tra wildcard có vô tình bắt cả mã không mong muốn hay không.'
      ],['Criteria là chuỗi điều kiện, nên toán tử so sánh phải nối với giá trị bằng & khi giá trị nằm trong ô.','Wildcard * đại diện nhiều ký tự, ? đại diện một ký tự.'],{title:'Ví dụ',formula:'=COUNTIFS($C:$C,"NG*",$D:$D,$B2)',text:'Đếm mã bắt đầu bằng NG theo điều kiện ở B2.'},'Wildcard rất tiện nhưng dễ “bắt rộng” hơn ý định.','extension')
    ]
  });

  replace('s09-lookup',{
    hook:'Bạn có mã NV002 ở bảng giao dịch và cần kéo đúng Tên nhân viên/Phòng ban từ bảng Master. Bài này tập trung vào việc lookup đúng khóa, đúng cột trả về và biết kiểm tra khi không tìm thấy.',
    outcomes:['Dùng XLOOKUP cho lookup chính xác','Nhận ra lookup key bị trùng hoặc lệch kiểu dữ liệu','Biết khi nào VLOOKUP vẫn dùng được và giới hạn của nó','Kiểm tra #N/A thay vì che lỗi ngay'],
    useCases:['Kéo tên nhân viên từ STAFF_MASTER','Gắn tên cửa hàng theo STORE_CODE','Tra target theo STAFF_KEY','Đối soát mã thiếu giữa hai bảng'],
    sections:[
      sec('1. Kiểm tra khóa trước khi lookup','Nếu khóa không sạch hoặc không duy nhất, công thức đúng vẫn trả kết quả sai.',[
        'Chọn cột mã ở bảng Master.','Kiểm tra có blank hay không.','Kiểm tra duplicate bằng COUNTIF hoặc Remove Duplicates trên bản copy.','Xác nhận kiểu dữ liệu hai bên giống nhau: Text với Text, Number với Number.'
      ],['Lookup tốt bắt đầu từ chất lượng key. Ví dụ mã 00123 dạng Text không luôn giống số 123.','Nếu Master có hai dòng cùng một mã, XLOOKUP mặc định trả lần khớp đầu tiên; đây là lỗi dữ liệu chứ không phải lỗi hàm.'],{title:'PASS khi',text:'Mỗi mã cần lookup có một ý nghĩa rõ và không bị duplicate ngoài chủ đích.'},null,'core'),
      sec('2. Làm XLOOKUP chính xác','Đây là mẫu lookup nên ưu tiên trên Excel hỗ trợ XLOOKUP.',[
        'Chọn ô cần trả kết quả.','Gõ =XLOOKUP(','Chọn mã cần tìm, ví dụ A2.','Chọn cột mã ở Master làm lookup_array.','Chọn cột Tên làm return_array.','Nhập thông báo khi không tìm thấy nếu cần.','Enter rồi kéo xuống.'
      ],['XLOOKUP tách rõ cột tìm và cột trả về, nên không phụ thuộc “cột trả về phải nằm bên phải” như VLOOKUP.','Mặc định XLOOKUP dùng exact match, phù hợp với mã nhân viên, mã cửa hàng, SKU.'],{title:'Ví dụ',formula:'=XLOOKUP(A2,Master!$A$2:$A$500,Master!$B$2:$B$500,"Không có mã")',text:'Tra tên ở cột B theo mã A2.'},'Không dùng approximate match cho mã định danh nếu bạn không thật sự cần logic khoảng.','core',[q('Với mã nhân viên, match phù hợp nhất là?',['Exact match','Approximate tùy ý','Wildcard luôn luôn','Không cần match'],0,'Mã định danh cần khớp chính xác.')]),
      sec('3. Xử lý #N/A đúng cách','#N/A thường là tín hiệu cần kiểm tra, không phải thứ phải che ngay.',[
        'Lấy một mã đang #N/A.','Tìm trực tiếp mã đó trong Master.','Kiểm tra khoảng trắng bằng TRIM/LEN nếu nghi ngờ.','Kiểm tra kiểu dữ liệu bằng ISTEXT/ISNUMBER.','Chỉ sau khi hiểu nguyên nhân mới quyết định hiển thị “Không có mã”.'
      ],['#N/A có thể do thiếu Master, khoảng trắng, mã Text/Number khác kiểu hoặc chọn sai vùng.','IFERROR bọc toàn bộ từ đầu sẽ làm mất tín hiệu chẩn đoán.'],{title:'Kiểm tra nhanh',formula:'=COUNTIF(Master!$A:$A,A2)',text:'0 = không có mã; 1 = có một mã; >1 = Master đang trùng khóa.'},'Đừng sửa bằng cách thêm một dòng Master giả chỉ để hết #N/A.','core'),
      sec('4. Học thêm: INDEX/MATCH và lookup nhiều điều kiện','Dùng khi file cũ cần tương thích hoặc lookup key phải ghép nhiều trường.',[
        'Với nhiều điều kiện, tạo key ổn định như Store|Staff|Date nếu nghiệp vụ cho phép.','Hoặc dùng XLOOKUP với biểu thức Boolean trên Excel phù hợp.','Kiểm tra uniqueness của tổ hợp key.'
      ],['INDEX/MATCH vẫn hữu ích trong file cũ và khi cần kiểm soát vị trí linh hoạt.','Lookup nhiều điều kiện chỉ đúng khi tổ hợp điều kiện thực sự xác định một bản ghi duy nhất.'],{title:'Ví dụ ý tưởng',formula:'=XLOOKUP(B2&C2,Master!$A$2:$A$500&Master!$B$2:$B$500,Master!$C$2:$C$500)',text:'Lookup theo hai trường trên Excel hỗ trợ mảng phù hợp.'},null,'extension')
    ]
  });

  replace('s12-clean-control',{
    hook:'Bạn nhận một file khách hàng có dòng trùng, khoảng trắng và ô “trông giống trống”. Mục tiêu không phải bấm Clean thật nhiều, mà là xác định đúng lỗi và làm sạch mà không xóa nhầm dữ liệu hợp lệ.',
    outcomes:['Phân biệt duplicate thật với bản ghi giống nhau có chủ đích','Remove Duplicates theo đúng key','Kiểm tra blank/khoảng trắng trước khi xóa','Luôn có bước đếm trước/sau để chứng minh dữ liệu không bị mất'],
    useCases:['Loại dòng nhập trùng','Chuẩn hóa mã trước lookup','Kiểm tra dữ liệu khách gửi','Chuẩn bị nguồn sạch cho Pivot/Power Query'],
    sections:[
      sec('1. Xác định duplicate dựa trên key','Hai dòng giống vài cột chưa chắc là trùng.',[
        'Xác định một bản ghi được nhận diện bởi cột nào: Order_ID, Employee_ID hay tổ hợp nhiều cột.','Đếm số dòng hiện tại.','Dùng COUNTIF/COUNTIFS hoặc Conditional Formatting để xem dòng nào đang trùng key.','Kiểm tra vài mẫu trước khi xóa.'
      ],['Nếu Order_ID phải duy nhất, duplicate theo Order_ID là vấn đề. Nhưng hai đơn khác nhau có cùng Customer/Amount không phải duplicate chỉ vì nhìn giống.','Key phải xuất phát từ nghiệp vụ, không phải chọn “Select All Columns” theo thói quen.'],{title:'Ví dụ',formula:'=COUNTIF($A:$A,A2)',text:'Giá trị >1 cho biết Order_ID ở A2 xuất hiện nhiều lần.'},'Không xóa duplicate trên file gốc khi chưa biết key đúng.','core'),
      sec('2. Remove Duplicates an toàn','Thao tác này xóa dòng ngay, nên phải có control.',[
        'Tạo bản copy hoặc bảo đảm có Undo/backup.','Chọn toàn bộ bảng dữ liệu.','Data → Remove Duplicates.','Bỏ chọn các cột không thuộc key.','Chỉ tick cột/tổ hợp cột định danh bản ghi.','Xác nhận và ghi lại số dòng Excel báo đã xóa.'
      ],['Excel giữ một bản ghi đầu tiên và loại các bản ghi trùng theo cột bạn chọn.','Nếu chọn sai cột key, dữ liệu hợp lệ có thể bị xóa không thể nhận ra ngay.'],{title:'PASS khi',text:'Số dòng sau = số dòng trước - đúng số duplicate đã xác minh.'},'Nếu không thể giải thích vì sao mỗi dòng bị xóa là trùng, chưa nên bấm OK.','core'),
      sec('3. Blank, khoảng trắng và ký tự ẩn','“Trống” nhìn bằng mắt không luôn là blank thật.',[
        'Dùng LEN để kiểm tra ô nghi ngờ.','Dùng TRIM cho khoảng trắng thừa thông thường.','Dùng CLEAN khi có ký tự không in được phù hợp.','Kiểm tra kết quả trước khi Paste Values/ghi đè.'
      ],['Một ô chứa dấu cách có LEN >0 và có thể làm Filter/Lookup sai.','TRIM/CLEAN không thay thế việc hiểu dữ liệu; một số khoảng trắng đặc biệt cần xử lý khác.'],{title:'Ví dụ',formula:'=LEN(A2)',text:'Nếu ô nhìn trống nhưng LEN trả 1 hoặc lớn hơn, đó không phải blank thật.'},null,'core'),
      sec('4. Học thêm: dựng cột kiểm soát thay vì sửa trực tiếp','Hữu ích với file quan trọng hoặc dữ liệu lớn.',[
        'Tạo cột Clean_Value bên cạnh dữ liệu gốc.','Áp TRIM/CLEAN/chuẩn hóa tại cột mới.','So sánh Original và Clean.','Chỉ thay dữ liệu gốc sau khi kiểm tra mẫu và count.'
      ],['Giữ Original giúp audit và rollback dễ hơn.','Với quy trình lặp, Power Query phù hợp hơn sửa thủ công từng tháng.'],{title:'Nguyên tắc',text:'Original → Clean → Validate → Replace/Load.'},null,'extension')
    ]
  });

  replace('a14-pivottable',{
    hook:'Bạn có bảng Sales 20.000 dòng và cần báo cáo doanh thu theo cửa hàng trong vài phút. Bài này đi từ kiểm tra nguồn → tạo Pivot → đọc Rows/Values → đối chiếu Grand Total.',
    outcomes:['Tạo PivotTable từ nguồn sạch','Biết trường nào vào Rows, Columns, Values, Filters','Sửa lỗi Sum biến thành Count','Đối chiếu Grand Total với nguồn trước khi gửi báo cáo'],
    useCases:['Doanh thu theo cửa hàng','Sản lượng theo tháng','NG theo model','Báo cáo tổng hợp nhanh để kiểm tra số'],
    sections:[
      sec('1. Kiểm tra nguồn trước khi Insert Pivot','Pivot không sửa dữ liệu nguồn bẩn.',[
        'Đảm bảo hàng tiêu đề chỉ có một dòng.','Không merge trong vùng dữ liệu.','Kiểm tra Revenue là Number, Date là Date.','Ưu tiên chuyển vùng nguồn thành Excel Table nếu dữ liệu sẽ tăng thêm.'
      ],['Nếu Revenue là Text, Pivot có thể Count thay vì Sum.','Nếu nguồn có dòng tiêu đề lặp giữa dữ liệu, Pivot sẽ coi đó là dữ liệu thật.'],{title:'PASS khi',text:'Nguồn là một khối hình chữ nhật, header rõ, kiểu dữ liệu hợp lý.'},null,'core'),
      sec('2. Tạo Pivot và đặt đúng trường','Tư duy đúng trường quan trọng hơn nhớ vị trí nút.',[
        'Chọn một ô trong nguồn.','Insert → PivotTable.','Chọn New Worksheet.','Kéo Store vào Rows.','Kéo Revenue vào Values.','Nếu cần, kéo Date/Month vào Columns hoặc Filters.'
      ],['Rows trả lời “chia theo cái gì”; Values trả lời “đo cái gì”.','Bắt đầu từ 1 Rows + 1 Values để kiểm tra số trước, rồi mới thêm nhiều chiều.'],{title:'Mẫu',text:'Rows = Store; Values = Sum of Revenue → ra doanh thu theo cửa hàng.'},null,'core'),
      sec('3. Khi Values hiện Count thay vì Sum','Đây là lỗi rất thường gặp khi dữ liệu số đang lưu dạng Text.',[
        'Bấm vào field trong Values → Value Field Settings.','Nếu chỉ đổi Count thành Sum mà ra 0/sai, quay lại nguồn.','Kiểm tra Number stored as Text.','Chuyển dữ liệu về Number đúng cách.','Refresh Pivot.'
      ],['Đổi Value Field Settings chỉ xử lý cách tổng hợp; nó không biến Text thành Number ở nguồn.'],{title:'Dấu hiệu',text:'Revenue đáng lẽ cộng được nhưng Pivot mặc định Count → kiểm tra kiểu dữ liệu trước.'},'Không coi “ép Sum” là sửa xong nếu nguồn vẫn sai kiểu.','core'),
      sec('4. Đối chiếu Grand Total và Refresh','Pivot chỉ đáng tin khi tổng của nó khớp nguồn.',[
        'Ghi lại Grand Total của Pivot.','Tính SUM Revenue ở nguồn hoặc dùng Status Bar sau Filter tương ứng.','So sánh hai số.','Thêm dòng test vào Table nguồn.','Data → Refresh All và xác nhận Pivot nhận dòng mới.'
      ],['Nếu dùng vùng cố định A1:H20000, dữ liệu thêm sau dòng 20000 sẽ không tự vào Pivot. Table giúp nguồn mở rộng dễ hơn.'],{title:'PASS khi',text:'Grand Total = tổng nguồn và Refresh nhận dữ liệu mới.'},null,'core'),
      sec('5. Học thêm: Group Date, Slicer và Pivot dùng như control','Sau khi số gốc đúng mới thêm trải nghiệm phân tích.',[
        'Group Date theo Month/Quarter nếu Date thật.','Thêm Slicer cho Store/Region.','Dùng Pivot phụ như bảng control để so với Dashboard.'
      ],['Pivot rất mạnh làm bảng kiểm tra độc lập cho các công thức/dashboard khác.'],{title:'Ứng dụng',text:'Dashboard báo 2,35 tỷ; Pivot control cũng phải ra 2,35 tỷ trên cùng bộ lọc.'},null,'extension')
    ]
  });

  replace('a17-dashboard',{
    hook:'Bạn đã có số đúng. Bây giờ nhiệm vụ là biến chúng thành một màn hình mà người xem hiểu trong 10 giây: KPI chính ở đâu, xu hướng thế nào, ngoại lệ nào cần chú ý và bộ lọc nào đang áp dụng.',
    outcomes:['Thiết kế dashboard theo câu hỏi thay vì trang trí','Tạo KPI card có số và ngữ cảnh','Chọn chart theo nhiệm vụ','Luôn có control để chứng minh số dashboard khớp nguồn'],
    useCases:['Sales dashboard','QC dashboard','Traffic/KPI dashboard','Báo cáo quản trị một trang'],
    sections:[
      sec('1. Viết 3 câu hỏi dashboard phải trả lời','Không có câu hỏi thì dashboard sẽ thành bộ sưu tập chart.',[
        'Viết câu 1: Kết quả hiện tại là bao nhiêu?','Câu 2: So với target/kỳ trước thế nào?','Câu 3: Vấn đề nằm ở đâu: Store/Region/Model/Time?','Chỉ giữ visual phục vụ ít nhất một câu hỏi.'
      ],['Một dashboard tốt thường có Overview trước, Breakdown sau, Exception cuối.','Không cần chart cho mọi cột dữ liệu.'],{title:'Ví dụ',text:'Revenue hiện tại → % Target → Top/Bottom Store → xu hướng theo ngày.'},null,'core'),
      sec('2. Dựng KPI card có ngữ cảnh','Một con số lớn không đủ để ra quyết định.',[
        'Hiển thị metric chính, ví dụ Revenue.','Thêm Target hoặc Previous Period.','Thêm variance tuyệt đối hoặc %.','Ghi rõ đơn vị: triệu, tỷ, %, đơn.','Đảm bảo cùng bộ lọc với phần còn lại.'
      ],['KPI card nên trả lời “bao nhiêu” và “tốt/xấu so với mốc nào”.'],{title:'Ví dụ',text:'Revenue 2,35 tỷ · Target 2,50 tỷ · Achievement 94%.'},'Đừng dùng màu xanh/đỏ nếu chưa xác định rõ tốt/xấu theo nghiệp vụ.','core'),
      sec('3. Chọn chart đúng câu hỏi','Chart là công cụ trả lời, không phải đồ trang trí.',[
        'So sánh category → Bar/Column.','Xem trend theo thời gian → Line.','Xem đóng góp lớn nhất → Pareto khi phù hợp.','Tránh Pie nhiều category hoặc chart 3D.'
      ],['Nếu một bảng 5 dòng đọc nhanh hơn chart, dùng bảng.','Giữ một điểm nhấn màu chính; phần còn lại nên lùi về secondary.'],{title:'Quy tắc nhanh',text:'Category = Bar; Time = Line; Distribution = Histogram; Relationship = Scatter.'},null,'core'),
      sec('4. Audit số trước khi bàn giao','Dashboard đẹp nhưng sai số là thất bại.',[
        'Chọn một bộ lọc cụ thể, ví dụ HN01 + tháng 9.','Ghi lại KPI trên dashboard.','Đối chiếu bằng Pivot/SUMIFS/nguồn độc lập.','Kiểm tra total, top/bottom và một điểm trên chart.','Chỉ PASS khi các control khớp.'
      ],['Control nên độc lập với logic dashboard càng nhiều càng tốt.'],{title:'PASS khi',text:'KPI + chart + breakdown cùng khớp nguồn ở ít nhất vài bộ lọc test.'},'Không “nhìn hợp lý” rồi coi là đúng.','core'),
      sec('5. Học thêm: bố cục và progressive disclosure','Dùng để dashboard gọn mà vẫn có chiều sâu.',[
        'Đặt overview ở vùng nhìn đầu tiên.','Đưa breakdown chi tiết xuống dưới hoặc sheet phụ.','Dùng Slicer/Timeline có nhãn rõ.','Không đặt 8–10 KPI ngang hàng nếu chỉ 2–3 cái quan trọng.'
      ],['Hierarchy giúp người dùng biết nhìn đâu trước.'],{title:'Mục tiêu',text:'Người mới mở file vẫn hiểu: đang xem kỳ nào, số chính là gì, click ở đâu để lọc.'},null,'extension')
    ]
  });

  replace('x21-power-query-basics',{
    hook:'Bạn nhận file CSV mỗi ngày với dữ liệu bẩn giống nhau. Thay vì sửa tay lặp lại, Power Query ghi lại chuỗi bước để lần sau chỉ cần thay nguồn và Refresh.',
    outcomes:['Biết Power Query nằm ở đâu và khi nào nên dùng','Import nguồn và kiểm tra Data Type','Đọc Applied Steps theo thứ tự','Refresh và kiểm tra số dòng/kết quả sau transform'],
    useCases:['Làm sạch file lặp hàng ngày','Chuẩn hóa Date/Number/Text','Tách/đổi tên/xóa cột trước báo cáo','Tạo pipeline có thể Refresh'],
    sections:[
      sec('1. Khi nào chọn Power Query thay vì sửa tay','PQ phù hợp khi cùng một quy trình sẽ lặp lại.',[
        'Liệt kê các thao tác bạn đang làm thủ công mỗi kỳ.','Nếu các bước lặp như xóa cột, đổi type, Trim, Filter, hãy cân nhắc PQ.','Nếu chỉ sửa một ô duy nhất một lần, PQ có thể là quá mức.'
      ],['Power Query là ETL: lấy dữ liệu → biến đổi → load kết quả.','Lợi ích lớn nhất là quy trình lặp lại được và có Applied Steps để audit.'],{title:'Dấu hiệu nên dùng PQ',text:'Mỗi tuần bạn lại mở file mới và lặp cùng 8 bước làm sạch.'},null,'core'),
      sec('2. Get Data và kiểm tra preview','Không vội Transform khi chưa hiểu nguồn.',[
        'Data → Get Data → chọn nguồn phù hợp.','Chọn đúng file/sheet/table.','Trong Navigator, xem preview và header.','Bấm Transform Data thay vì Load nếu cần làm sạch.'
      ],['Preview giúp phát hiện nhầm sheet, header lệch hoặc cột thiếu trước khi tạo query.'],{title:'PASS khi',text:'Bạn chỉ ra được nguồn nào đang kết nối và mỗi cột đại diện cho gì.'},null,'core'),
      sec('3. Data Type và Applied Steps','Type sai là nguồn của nhiều lỗi Date/Number.',[
        'Kiểm tra icon type trên từng cột quan trọng.','Đặt Date cho cột ngày, Decimal/Whole Number cho số, Text cho mã.','Sau mỗi thao tác, nhìn Applied Steps xuất hiện bước mới.','Click từng step để hiểu dữ liệu thay đổi ở đâu.'
      ],['Applied Steps chạy theo thứ tự. Một bước rename trước rồi step sau gọi tên cũ có thể làm query lỗi.','Mã như 00123 thường nên giữ Text để không mất số 0 đầu.'],{title:'Control',text:'Sau Change Type, kiểm tra cột lỗi (Error) trước khi tiếp tục.'},'Không Change Type hàng loạt theo cảm tính.','core'),
      sec('4. Close & Load, Refresh và kiểm tra','Mục tiêu là pipeline chạy lại được.',[
        'Close & Load vào Table hoặc Connection theo nhu cầu.','Ghi lại số dòng output.','Thay file nguồn bằng bản mới cùng schema.','Refresh All.','Kiểm tra số dòng, error và vài mẫu kết quả.'
      ],['Refresh thành công không đồng nghĩa dữ liệu đúng; vẫn cần control count/total.'],{title:'PASS khi',text:'Nguồn mới cùng schema → Refresh không sửa tay → output đúng count/format.'},null,'core'),
      sec('5. Học thêm: tên step và query dễ bàn giao','Giúp file lớn không biến thành “Query1, Query2, Changed Type7”.',[
        'Đặt query theo vai trò: SRC_Sales, CLEAN_Sales, OUT_Sales.','Đổi tên step quan trọng nếu cần mô tả nghiệp vụ.','Không tạo nhiều query copy-paste nếu có thể Reference.'
      ],['Tên rõ giúp debug nhanh khi một query downstream lỗi.'],{title:'Mẫu',text:'SRC → CLEAN → MODEL/OUT.'},null,'extension')
    ]
  });

  replace('x22-power-query-multi-source',{
    hook:'Bạn có 12 file tháng trong một folder hoặc hai bảng cần ghép theo mã. Bài này tập trung vào ba thao tác dễ nhầm nhất: Append, Merge và Combine Folder — cùng cách kiểm tra để không nhân dòng.',
    outcomes:['Phân biệt Append với Merge','Kiểm tra schema trước khi Append','Merge theo key và nhận ra nguy cơ nhân dòng','Combine Folder bền vững khi thêm file mới'],
    useCases:['Gộp file tháng','Nối Sales với Master cửa hàng','Ghép nhiều sheet/file cùng cấu trúc','Tạo nguồn tổng chỉ cần Refresh'],
    sections:[
      sec('1. Chọn đúng: Append hay Merge','Sai lựa chọn từ đầu sẽ tạo cấu trúc dữ liệu sai.',[
        'Nếu muốn chồng Jan + Feb + Mar xuống dưới nhau → Append.','Nếu muốn thêm cột Tên cửa hàng vào Sales theo Store_Code → Merge.','Viết ra kết quả mong muốn trước khi bấm nút.'
      ],['Append tăng số dòng; Merge thường tăng số cột, nhưng có thể tăng dòng nếu key phía lookup không duy nhất.'],{title:'Nhớ nhanh',text:'Append = xếp dọc. Merge = nối ngang theo key.'},null,'core',[q('Jan và Feb cùng schema cần gộp thành một bảng năm dùng gì?',['Append','Merge','Group By','Transpose'],0,'Các bảng cùng schema cần xếp dòng xuống dưới nên dùng Append.')]),
      sec('2. Append không làm lệch cột','Power Query ghép theo tên cột, không phải vị trí mắt nhìn.',[
        'So sánh tên cột giữa các nguồn.','Chuẩn hóa khác biệt như Revenue vs DoanhThu trước Append.','Append queries.','Kiểm tra số dòng output = tổng số dòng các input sau filter hợp lệ.'
      ],['Cột chỉ có ở một nguồn sẽ tạo null ở các nguồn còn lại. Đây là tín hiệu schema chưa đồng nhất hoặc thay đổi nghiệp vụ.'],{title:'Control',text:'Rows_Out = Rows_Jan + Rows_Feb + Rows_Mar (sau cùng rule filter).'},'Đừng xóa cột “lạ” ngay; trước tiên xác định nó xuất hiện do schema drift hay dữ liệu hợp lệ.','core'),
      sec('3. Merge mà không nhân dòng','Đây là lỗi nguy hiểm nhất khi nối bảng Master.',[
        'Kiểm tra key ở bảng bên phải có duy nhất không.','Merge theo đúng cột key và đúng kiểu dữ liệu.','Xem số match/unmatch.','Expand chỉ cột cần dùng.','So sánh số dòng trước và sau Merge.'
      ],['Nếu bảng Master có 2 dòng cho một Store_Code, mỗi dòng Sales tương ứng có thể nở thành 2 dòng sau Expand.','Vì vậy uniqueness check phải làm trước Merge, không phải sau khi báo cáo đã tăng gấp đôi.'],{title:'PASS khi',text:'Nếu kỳ vọng many-to-one: Rows_AfterMerge = Rows_BeforeMerge và key unmatched được giải thích.'},'Rows tăng bất ngờ sau Merge = dừng lại kiểm tra duplicate key.','core'),
      sec('4. Combine Folder có kiểm soát','Mục tiêu là thêm file mới rồi Refresh, không chỉnh query.',[
        'Đưa các file cùng schema vào một folder nguồn riêng.','Data → Get Data → From Folder.','Lọc bỏ file tạm/~$, file archive hoặc file khác schema.','Combine & Transform.','Kiểm tra query mẫu (Transform Sample File) và output.','Thêm một file mới rồi Refresh để test.'
      ],['Folder phải sạch về loại file và schema. Một file backup khác cấu trúc có thể làm query lỗi hoặc thêm dữ liệu sai.'],{title:'PASS khi',text:'Thêm file tháng mới cùng schema → Refresh → số dòng tăng đúng bằng số dòng file mới.'},null,'core'),
      sec('5. Học thêm: staging và Reference','Dùng khi query bắt đầu nhiều nguồn/nhiều output.',[
        'Giữ query nguồn/staging ở Connection Only khi không cần load ra sheet.','Dùng Reference để tạo nhánh xử lý tiếp.','Chỉ load output cuối thật sự cần.'
      ],['Cách này giúp kiến trúc rõ và giảm các bảng trung gian không cần thiết trên workbook.'],{title:'Mẫu kiến trúc',text:'SRC_Folder → STG_Sales → CLEAN_Sales → OUT_Report.'},null,'extension')
    ]
  });
})();
