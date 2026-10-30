(() => {
  'use strict';
  if (window.__AVP_TASK_CONTENT_V8__) return;
  window.__AVP_TASK_CONTENT_V8__ = true;
  const lessons=window.AVPKnowledgeLessons||[];
  const byId=new Map(lessons.map(x=>[x.id,x]));
  const q=(text,options,answer,explain)=>({q:text,options,answer,explain});
  const sec=(title,why,steps,body,example,warning,questions=[])=>({title,kind:'core',why,steps,body,example,warning,questions});
  const replace=(id,data)=>{const l=byId.get(id);if(!l)return;Object.assign(l,data);};
  replace('d07-sort-filter',{
    hook:'Một bảng có hàng nghìn giao dịch. Bạn cần tìm riêng cửa hàng A trong tháng này, xếp doanh thu giảm dần và vẫn giữ nguyên từng dòng giao dịch.',
    outcomes:['Bật/tắt Filter và lọc theo text, số, ngày','Sort một cột và nhiều cấp mà không làm lệch bản ghi','Nhận biết Filter đang ẩn dòng và xóa điều kiện lọc','Đối chiếu kết quả lọc với số dòng thực tế'],
    useCases:['Tìm các lỗi NG theo model','Xem doanh thu theo cửa hàng/ngày','Tìm giao dịch vượt ngưỡng','Chuẩn bị dữ liệu trước khi PivotTable'],
    sections:[
      sec('1. Lọc đúng tập dữ liệu cần xem','Filter không xóa dòng; nó tạm ẩn các bản ghi không thỏa điều kiện.',[
        'Mở workbook thực hành và chọn một ô bên trong bảng có đúng một hàng header.',
        'Nhấn Ctrl+Shift+L để bật Filter.',
        'Mở mũi tên ở cột Store và chỉ chọn S001.',
        'Quan sát số dòng hiển thị; ghi lại các Order_ID nhìn thấy.',
        'Lọc tiếp cột Status = NG để kết hợp hai điều kiện.',
        'Mở Filter và chọn Clear Filter From… để trả lại toàn bộ dữ liệu.'
      ],['Filter trên nhiều cột kết hợp theo logic AND: dòng phải thỏa tất cả điều kiện đang bật.','Filter chỉ ẩn dòng trên màn hình; các dòng bị ẩn vẫn nằm trong dữ liệu và có thể ảnh hưởng công thức không dùng SUBTOTAL/AGGREGATE.'],{title:'Kết quả cần đạt',text:'Chỉ còn các bản ghi Store = S001 và Status = NG; khi xóa Filter, số dòng trở về như ban đầu.'},'Đừng copy vùng đang lọc rồi mặc định rằng đã copy toàn bộ bản ghi; kiểm tra Visible cells only khi cần.'),
      sec('2. Sort an toàn và Sort nhiều cấp','Sort sai vùng có thể ghép doanh thu của người này với mã của người khác mà Excel không nhất thiết báo lỗi.',[
        'Xóa Filter trước khi Sort để dễ kiểm soát.',
        'Chọn một ô trong bảng, mở Data → Sort.',
        'Xác nhận My data has headers.',
        'Sort theo Revenue, Largest to Smallest.',
        'Mở Sort lần nữa, chọn Add Level: Store A to Z, sau đó Revenue Largest to Smallest.',
        'Kiểm tra ba dòng đầu và cuối; so Order_ID với các cột liên quan.'
      ],['Khi Sort một vùng có nhiều cột liền nhau, phải sort cả bản ghi. Nếu Excel hỏi Expand the selection, chọn mở rộng vùng.','Sort nhiều cấp áp dụng thứ tự ưu tiên từ level trên xuống level dưới.'],{title:'Kết quả cần đạt',text:'Trong từng Store, Revenue giảm dần; thông tin cùng một Order_ID vẫn nằm trên cùng một hàng.'},'Không Sort riêng một cột mã hoặc doanh thu nếu các cột còn lại thuộc cùng bản ghi.',[
        q('Khi Excel hỏi Expand the selection lúc Sort một cột trong bảng, nên chọn gì?',['Sort only current selection','Expand the selection','Cancel rồi xóa cột','Chọn No Header'],1,'Phải mở rộng để toàn bộ trường của bản ghi di chuyển cùng nhau.'),
        q('Filter trên hai cột Store và Status thường kết hợp thế nào?',['OR','AND','Không liên quan','Tự động cộng'],1,'Một dòng phải thỏa cả hai điều kiện đang bật mới còn hiển thị.')
      ]),
      sec('3. Kiểm tra và khôi phục trạng thái dữ liệu','Một thao tác chỉ PASS khi bạn chứng minh được dữ liệu không bị mất hoặc lệch.',[
        'Xóa toàn bộ Filter bằng Data → Clear.',
        'So số dòng trước/sau; nếu có dòng tổng thì không tính dòng đó như bản ghi.',
        'Chọn ngẫu nhiên hai Order_ID và kiểm tra các trường liên quan.',
        'Nếu thứ tự ban đầu quan trọng, dùng cột Index tạo trước khi Sort để khôi phục.'
      ],['Sort thay đổi thứ tự dòng nhưng không thay đổi giá trị; Filter thay đổi những dòng đang nhìn thấy. Hai thao tác có tác động khác nhau.'],{title:'PASS khi',text:'Bạn lọc được đúng tập bản ghi, Sort đúng cấp và chứng minh dữ liệu mỗi dòng không bị tách cột.'},'Nếu cần giữ thứ tự gốc, phải có cột Index trước khi Sort.')
    ]
  });
  replace('d08-find-replace',{
    hook:'Một file có hàng nghìn dòng đang ghi “Pending”, nhưng quy trình mới yêu cầu đổi thành “Waiting”. Thay từng ô bằng tay không phải cách làm.',
    outcomes:['Tìm chính xác giá trị trong sheet/workbook','Phân biệt Look in Values và Formulas','Thay chuỗi trong vùng giới hạn','Kiểm tra tác động trước và sau Replace All'],
    useCases:['Chuẩn hóa trạng thái','Tìm mã nhân viên/sản phẩm','Sửa ký tự phân cách trong mã','Tìm công thức hoặc hằng số bất thường'],
    sections:[
      sec('1. Tìm và xác định đúng nơi chứa dữ liệu','Find có thể tìm trong giá trị hiển thị, công thức, sheet hiện tại hoặc cả workbook tùy Options.',[
        'Nhấn Ctrl+F, nhập Pending và chọn Find All.',
        'Kiểm tra danh sách kết quả: Sheet, Cell và Value.',
        'Mở Options và thử Within: Sheet rồi Workbook.',
        'Đổi Look in giữa Values và Formulas để thấy sự khác nhau.',
        'Dùng Match case hoặc Match entire cell contents nếu cần khớp chính xác.'
      ],['Find All hữu ích khi cần kiểm tra số lượng và vị trí trước khi sửa.','Wildcard * và ? có thể tìm mẫu chuỗi; dùng dấu ~ nếu muốn tìm chính ký tự wildcard.'],{title:'Kết quả cần đạt',text:'Bạn xác định được số ô Pending và vị trí các ô trước khi thay.'},'Đừng bấm Replace All trước khi biết Excel đang tìm trong phạm vi nào.'),
      sec('2. Replace có kiểm soát','Replace All nhanh nhưng có thể thay nhầm chuỗi trong công thức hoặc ngoài sheet dự kiến.',[
        'Nhấn Ctrl+H và nhập Find what = Pending.',
        'Nhập Replace with = Waiting.',
        'Chọn Options và đặt Within = Sheet nếu chỉ sửa sheet hiện tại.',
        'Dùng Find Next để xem từng kết quả; Replace thử một ô.',
        'Nếu kết quả đúng, dùng Replace All.',
        'Tìm lại Pending để xác nhận còn hay không.'
      ],['Khi chỉ sửa một cột, hãy chọn cột đó trước khi mở Replace và kiểm tra Excel giới hạn vùng tìm.','Nếu thay chuỗi nằm trong công thức, Look in = Formulas có thể gây thay đổi logic; chỉ dùng khi chủ đích.'],{title:'Kết quả cần đạt',text:'Các ô trạng thái được đổi đúng; công thức và các sheet không liên quan giữ nguyên.'},'Không dùng Replace All toàn workbook với chuỗi ngắn phổ biến như “1”, “A” hoặc dấu gạch khi chưa kiểm tra.'),
      sec('3. Kiểm tra sau thay thế','Thông báo “X replacements made” không chứng minh nghiệp vụ đã đúng.',[
        'Lọc cột Status và kiểm tra chỉ còn các trạng thái hợp lệ.',
        'Tìm lại Pending với Within = Workbook.',
        'Kiểm tra một vài dòng đã đổi và một vài dòng không thuộc đối tượng.',
        'Nếu thay nhầm, dùng Ctrl+Z ngay trước khi thực hiện thao tác khác.'
      ],['Với thay đổi quan trọng, lưu một bản Working trước thao tác và ghi lại số ô dự kiến thay.'],{title:'PASS khi',text:'Số ô được thay khớp với số ô dự kiến và không phát sinh thay đổi ngoài phạm vi.'},'Không dựa duy nhất vào thông báo Replace; phải kiểm tra lại dữ liệu.')
    ]
  });
  replace('d09-data-validation',{
    hook:'Bạn giao file nhập liệu cho nhiều người. Nếu ai cũng tự gõ trạng thái, dữ liệu sẽ có “Done”, “DONE”, “Hoàn thành”, “Xong” và báo cáo không thể nhóm ổn định.',
    outcomes:['Tạo dropdown từ danh sách nguồn','Giới hạn số/ngày bằng Data Validation','Thiết lập Input Message và Error Alert','Kiểm tra hành vi khi nhập đúng, sai và paste dữ liệu'],
    useCases:['Chuẩn hóa Status/Department/Store','Chặn số lượng âm hoặc vượt ngưỡng','Giới hạn ngày nhập','Tạo form nhập liệu có hướng dẫn'],
    sections:[
      sec('1. Tạo dropdown từ danh sách nguồn','Dropdown giảm lỗi gõ tay nhưng danh sách nguồn phải được quản lý rõ.',[
        'Tạo sheet Lists và nhập các trạng thái Open, In Progress, Done vào A2:A4.',
        'Chọn vùng Status cần nhập, ví dụ D2:D100.',
        'Mở Data → Data Validation.',
        'Allow chọn List; Source trỏ tới vùng danh sách.',
        'Bật In-cell dropdown và thiết lập Error Alert kiểu Stop.',
        'Thử chọn từng trạng thái và thử gõ một trạng thái không có trong danh sách.'
      ],['Danh sách nguồn nên đặt riêng, không trộn vào bảng giao dịch.','Với danh sách cần mở rộng thường xuyên, cân nhắc đặt tên vùng hoặc dùng Excel Table làm nguồn tùy phiên bản.'],{title:'Kết quả cần đạt',text:'Ô có dropdown và từ chối giá trị không nằm trong danh sách khi nhập trực tiếp.'},'Data Validation không phải bảo mật tuyệt đối; paste dữ liệu có thể vượt qua một số quy tắc tùy thao tác.'),
      sec('2. Giới hạn số và ngày','Validation có thể kiểm soát miền giá trị chứ không chỉ danh sách chọn.',[
        'Chọn cột Qty, mở Data Validation và chọn Whole number.',
        'Đặt Data = between, Minimum = 1, Maximum = 500.',
        'Chọn cột Date, Allow = Date, đặt khoảng ngày hợp lệ.',
        'Viết Input Message nêu rõ đơn vị và giới hạn.',
        'Thử giá trị 0, 501 và một ngày ngoài khoảng.'
      ],['Whole number phù hợp khi số lượng không được có phần thập phân; Decimal phù hợp khi cho phép số lẻ.','Thông báo lỗi nên nói cách sửa, không chỉ ghi “Invalid”.'],{title:'Kết quả cần đạt',text:'Giá trị nằm trong giới hạn được nhận; giá trị ngoài giới hạn bị chặn theo Error Alert.'},'Đừng dùng Text length để kiểm tra số lượng; chọn đúng loại dữ liệu cần kiểm soát.'),
      sec('3. Nghiệm thu form nhập liệu','Rule cần được thử bằng cả dữ liệu hợp lệ và dữ liệu sai.',[
        'Thử nhập một giá trị hợp lệ ở mỗi cột.',
        'Thử nhập một giá trị sai ở mỗi cột.',
        'Copy/paste một giá trị sai vào vùng đã validation để kiểm tra giới hạn thực tế.',
        'Mở Data Validation lại và xác nhận rule áp dụng toàn bộ vùng, không chỉ ô đầu tiên.'
      ],['Nếu paste có thể bỏ qua validation trong quy trình của bạn, cần bổ sung kiểm tra sau nhập bằng Conditional Formatting, công thức kiểm soát hoặc quy trình review.'],{title:'PASS khi',text:'Bạn chứng minh được rule hoạt động, biết giới hạn của nó và có bước kiểm tra dữ liệu sau khi paste.'},'Không quảng cáo Validation như một cơ chế khóa dữ liệu tuyệt đối.')
    ]
  });
  replace('a19-reconciliation',{
    hook:'Dashboard đang báo doanh thu 1,28 tỷ, nhưng tổng dữ liệu nguồn là 1,31 tỷ. Đổi số trên KPI không giải quyết được vấn đề; cần tìm tầng làm lệch.',
    outcomes:['Thiết kế control theo row count, key và tổng metric','Đối soát theo từng tầng dữ liệu','Phát hiện thiếu dòng, duplicate và sai điều kiện','Ghi lại chênh lệch và kết luận có bằng chứng'],
    useCases:['Kiểm tra báo cáo doanh số tháng','Đối chiếu số lỗi QC giữa nguồn và dashboard','Nghiệm thu workbook trước bàn giao','Tìm nguyên nhân số liệu lệch sau Refresh'],
    sections:[
      sec('1. Chốt baseline từ dữ liệu nguồn','Không có baseline thì không thể biết output thiếu hay thừa.',[
        'Xác định grain: một dòng là Order, Order Line hay một lần kiểm tra.',
        'Ghi row count, distinct key count, min/max date và tổng metric từ Raw.',
        'Kiểm tra duplicate key theo grain đã chọn.',
        'Ghi rõ filter kỳ, trạng thái và phạm vi cửa hàng được dùng.'
      ],['Tổng doanh thu có thể khớp dù thiếu dòng và thừa dòng bù trừ nhau; vì vậy phải kiểm tra cả row count và key.','Distinct key chỉ có ý nghĩa khi key thực sự đại diện duy nhất một bản ghi.'],{title:'Ví dụ',text:'Raw có 10.000 order lines, 9.850 unique Order_ID và Revenue tổng 1.310.000.000. Không được dùng 9.850 làm số dòng.'},'Đếm Order_ID bằng COUNTA không tương đương đếm số đơn nếu một đơn có nhiều dòng.'),
      sec('2. Đối soát theo tầng','So Raw với Dashboard một lần chỉ cho biết có lệch, không chỉ ra lỗi bắt đầu ở đâu.',[
        'Tính lại các control ở tầng Clean/Staging.',
        'So row count và total Raw → Clean; giải thích mọi dòng bị loại bởi rule.',
        'So Clean → Pivot/Model; kiểm tra source range, refresh và filter context.',
        'So Pivot/Model → Dashboard; kiểm tra công thức KPI, denominator và slicer.',
        'Lọc danh sách unmatched/duplicate để truy ra record gây lệch.'
      ],['Mỗi tầng cần cùng filter context và cùng định nghĩa metric.','Nếu Pivot chưa Refresh hoặc dashboard dùng một phạm vi khác, số liệu có thể lệch dù công thức không sai.'],{title:'Ví dụ',text:'Raw 1.310.000.000 → Clean 1.310.000.000 → Pivot 1.280.000.000. Sai lệch bắt đầu ở bước Clean → Pivot, cần kiểm tra source/cache/filter.'},'Không hardcode KPI hoặc sửa trực tiếp chart để làm cho số khớp.'),
      sec('3. Lập control sheet và kết luận','Một báo cáo đáng tin phải để người khác lặp lại được phép kiểm tra.',[
        'Tạo các dòng control: Raw rows, Clean rows, Unique keys, Revenue total, Min date, Max date.',
        'Thêm cột Expected, Actual, Difference và Status.',
        'Đặt PASS khi Difference = 0 hoặc nằm trong tolerance đã được nghiệp vụ duyệt.',
        'Với CHECK, ghi nguyên nhân, owner và bước xử lý tiếp theo.',
        'Refresh lại và chạy control lần cuối trước khi bàn giao.'
      ],['Tolerance phải có căn cứ nghiệp vụ; không tự đặt mức chênh lệch chấp nhận được.','Control độc lập với công thức tạo KPI để tránh cùng một lỗi logic xuất hiện ở cả hai nơi.'],{title:'PASS khi',text:'Người khác có thể dùng control sheet để xác định tầng nào lệch và tái hiện kết luận.'},'Đừng đánh dấu PASS chỉ vì Grand Total khớp; phải kiểm tra cả cấu trúc và khóa.')
    ]
  });

  const quizAdditions={
    'd08-find-replace':[
      q('Trước Replace All, thao tác nào giúp kiểm tra vị trí và số lượng kết quả?',['Find All','Sort A to Z','Remove Duplicates','Text to Columns'],0,'Find All cho phép rà soát các ô khớp trước khi thay.'),
      q('Muốn chỉ thay trong một cột, cách an toàn hơn là gì?',['Chọn đúng vùng/cột trước khi Replace','Để Within = Workbook','Bật Match case bất kể dữ liệu','Ẩn các sheet khác'],0,'Giới hạn vùng giúp tránh sửa ngoài phạm vi dự kiến.'),
      q('Sau Replace All, cần làm gì?',['Tin thông báo Excel','Tìm lại chuỗi cũ và kiểm tra các dòng mẫu','Xóa bản gốc','Sort toàn workbook'],1,'Cần xác nhận kết quả thực tế và phạm vi thay đổi.')
    ],
    'd09-data-validation':[
      q('Muốn tạo dropdown từ danh mục, Allow nên chọn gì?',['List','Whole number','Date','Text length'],0,'List tạo danh sách lựa chọn từ Source.'),
      q('Muốn chặn Qty nhỏ hơn 1, nên cấu hình gì?',['Whole number, minimum = 1','Text length = 1','List không có Source','Custom Sort'],0,'Whole number cho phép giới hạn miền số nguyên.'),
      q('Data Validation có đảm bảo mọi dữ liệu paste đều hợp lệ không?',['Có, tuyệt đối','Không; cần test paste và kiểm tra sau nhập','Chỉ khi tô màu ô','Chỉ khi khóa sheet'],1,'Một số cách paste có thể bỏ qua hoặc ghi đè validation.')
    ],
    'a19-reconciliation':[
      q('Vì sao không nên chỉ đối chiếu Grand Total?',['Vì tổng có thể khớp dù thiếu và thừa record bù trừ nhau','Vì Grand Total luôn sai','Vì không cần kiểm tra tổng','Vì Pivot không có tổng'],0,'Cần kết hợp row count, key và metric để phát hiện nhiều loại sai lệch.'),
      q('Khi đối soát Raw → Clean → Pivot → Dashboard, mục tiêu chính là gì?',['Tìm tầng đầu tiên phát sinh chênh lệch','Làm cho mọi số đều giống nhau bằng tay','Ẩn dòng lỗi','Đổi màu KPI'],0,'So theo tầng giúp khoanh vùng nguyên nhân thay vì chỉ thấy kết quả cuối bị lệch.'),
      q('Unmatched key nên được xử lý thế nào?',['Tự xóa','Đưa vào exception list để điều tra','Đổi thành 0','Bỏ qua nếu dashboard đẹp'],1,'Exception list giữ lại bằng chứng và hỗ trợ truy nguyên.')
    ]
  };
  Object.entries(quizAdditions).forEach(([id,items])=>{
    const lesson=byId.get(id);
    if(!lesson||!Array.isArray(lesson.sections))return;
    items.forEach((item,index)=>{
      const section=lesson.sections[index];
      if(section){
        section.questions=Array.isArray(section.questions)?section.questions:[];
        section.questions.push(item);
      }
    });
  });
})();
