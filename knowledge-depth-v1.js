(() => {
  'use strict';
  if (window.__AVP_KNOWLEDGE_DEPTH_V1__) return;
  window.__AVP_KNOWLEDGE_DEPTH_V1__ = true;

  const lessons = window.AVPKnowledgeLessons || [];
  const byId = new Map(lessons.map(lesson => [lesson.id, lesson]));
  const uniqPush = (list, values) => {
    const target = Array.isArray(list) ? list : [];
    values.forEach(value => { if (!target.includes(value)) target.push(value); });
    return target;
  };
  const extendLesson = (id, { sections = [], outcomes = [], useCases = [] } = {}) => {
    const lesson = byId.get(id);
    if (!lesson) return;
    lesson.sections = Array.isArray(lesson.sections) ? lesson.sections : [];
    sections.forEach(section => {
      if (!lesson.sections.some(existing => existing.title === section.title)) lesson.sections.push(section);
    });
    lesson.outcomes = uniqPush(lesson.outcomes, outcomes);
    lesson.useCases = uniqPush(lesson.useCases, useCases);
  };

  // 01 · Modern Excel 365: deepen the existing Dynamic Array lesson without adding a 25th card.
  extendLesson('x20-dynamic-array', {
    outcomes: [
      'Dùng nhóm hàm text/reshape mới của Microsoft 365 để thay nhiều helper columns',
      'Hiểu BYROW/BYCOL/MAP/REDUCE ở mức ứng dụng',
      'Biết tạo hàm tái sử dụng bằng LAMBDA và kiểm soát phạm vi áp dụng'
    ],
    useCases: [
      'Tách chuỗi mã theo delimiter mà không cần Text to Columns thủ công',
      'Ghép nhiều mảng động theo chiều dọc/ngang',
      'Đóng gói business rule thành LAMBDA dùng lại trong workbook'
    ],
    sections: [
      {
        title:'TEXTSPLIT, TEXTBEFORE và TEXTAFTER: xử lý chuỗi kiểu Excel 365',kind:'core',version:'Microsoft 365 / Excel 2024+ tùy kênh cập nhật',
        why:'Nhiều bài làm sạch text trước đây cần LEFT/MID/FIND lồng nhau. Bộ hàm mới giúp công thức ngắn và thể hiện ý định rõ hơn.',
        body:['TEXTSPLIT tách chuỗi theo delimiter và có thể spill thành nhiều cột/dòng. TEXTBEFORE lấy phần trước delimiter; TEXTAFTER lấy phần sau delimiter.','Ví dụ mã S001-NORTH-2026 có thể tách bằng TEXTSPLIT thay vì viết nhiều MID/FIND. Tuy nhiên nếu file phải chạy trên Excel cũ, cần phương án tương thích hoặc Power Query.'],
        example:{title:'Ví dụ',formula:'=TEXTSPLIT(A2,"-")',text:'Tách S001-NORTH-2026 thành ba phần và spill sang các ô bên cạnh.'},
        warning:'Hàm mới có thể không tồn tại trên Excel 2016/2019. Luôn ghi rõ phiên bản khi bàn giao file.',
        questions:[
          {q:'Muốn lấy phần nằm sau dấu "-" trong chuỗi bằng hàm Excel mới, lựa chọn phù hợp là?',options:['TEXTAFTER','SUMIFS','SUBTOTAL','ROUND'],answer:0,explain:'TEXTAFTER được thiết kế để trả phần chuỗi sau delimiter. Các hàm còn lại không phải hàm tách text.'},
          {q:'TEXTSPLIT có thể trả nhiều ô kết quả không?',options:['Có, kết quả có thể spill thành mảng','Không, luôn chỉ một ô','Chỉ khi có VBA','Chỉ khi file .xlsm'],answer:0,explain:'TEXTSPLIT là hàm Dynamic Array và có thể spill nhiều phần của chuỗi ra vùng kết quả.'}
        ]
      },
      {
        title:'TAKE, DROP, CHOOSECOLS, CHOOSEROWS, VSTACK và HSTACK',kind:'core',version:'Microsoft 365 / Excel 2024+ tùy hàm',
        why:'Các hàm reshape giúp lấy đúng phần của một mảng hoặc ghép các mảng mà không phải copy/paste hay tạo nhiều vùng trung gian.',
        body:['TAKE/DROP lấy hoặc bỏ số dòng/cột ở đầu/cuối mảng. CHOOSECOLS/CHOOSEROWS chọn các cột/dòng theo vị trí. VSTACK ghép mảng theo chiều dọc; HSTACK ghép theo chiều ngang.','Các hàm này rất mạnh khi kết hợp FILTER/UNIQUE/SORT để tạo report phụ động. Nhưng nếu nguồn là hàng trăm nghìn dòng và cần ETL lặp, Power Query thường phù hợp hơn công thức spill lớn.'],
        example:{title:'Ví dụ',formula:'=VSTACK(tblJan,tblFeb,tblMar)',text:'Ghép ba mảng có schema tương thích theo chiều dọc trong Excel hỗ trợ VSTACK.'},
        questions:[
          {q:'Muốn ghép dữ liệu Jan, Feb, Mar theo chiều dọc bằng Dynamic Array, hàm nào phù hợp?',options:['VSTACK','HSTACK','TAKE','TEXTAFTER'],answer:0,explain:'VSTACK xếp các mảng xuống dưới nhau; HSTACK ghép theo chiều ngang.'},
          {q:'CHOOSECOLS hữu ích khi?',options:['Chỉ muốn lấy một số cột từ mảng','Muốn đổi màu chart','Muốn Protect Sheet','Muốn tính trung bình'],answer:0,explain:'CHOOSECOLS trả về các cột được chỉ định từ mảng nguồn.'}
        ]
      },
      {
        title:'BYROW, BYCOL, MAP, REDUCE và SCAN: tư duy hàm theo mảng',kind:'extension',version:'Microsoft 365 · mức nâng cao',
        why:'Khi logic cần áp cùng một phép tính cho từng dòng/phần tử của mảng, nhóm hàm này giảm helper và mở đường tới LAMBDA.',
        body:['BYROW/BYCOL áp một LAMBDA cho từng dòng/cột. MAP áp logic cho từng phần tử tương ứng. REDUCE tích lũy mảng thành một kết quả; SCAN trả cả quá trình tích lũy.','Đây là công cụ nâng cao. Nếu SUMIFS, Pivot hoặc Power Query giải bài toán rõ hơn thì không cần ép dùng MAP/REDUCE chỉ vì mới.'],
        questions:[
          {q:'BYROW chủ yếu dùng để?',options:['Áp một logic cho từng dòng của mảng','Tạo Pivot','Đổi tên Sheet','Refresh Query'],answer:0,explain:'BYROW truyền từng dòng vào LAMBDA và trả kết quả tương ứng.'},
          {q:'REDUCE khác SCAN ở điểm chính nào?',options:['REDUCE thường trả kết quả tích lũy cuối, SCAN có thể trả các trạng thái trung gian','REDUCE là hàm chart','SCAN chỉ dùng VBA','Không khác'],answer:0,explain:'REDUCE thu gọn mảng về accumulator cuối; SCAN giữ chuỗi kết quả tích lũy theo từng bước.'}
        ]
      },
      {
        title:'LAMBDA: đóng gói business rule thành hàm dùng lại',kind:'core',version:'Microsoft 365 / Excel 2024+ tùy kênh cập nhật',
        why:'Khi cùng một rule xuất hiện ở nhiều nơi, copy một công thức dài làm tăng rủi ro mỗi chỗ sửa một kiểu.',
        body:['LAMBDA cho phép tạo hàm tùy chỉnh mà không cần VBA. Có thể test LAMBDA trực tiếp trong ô, sau đó đưa vào Name Manager để gọi bằng tên như một hàm workbook.','Tên hàm và tham số phải mô tả nghiệp vụ. Đừng dùng LAMBDA để che logic khó hiểu; hãy document input/output, edge cases và phiên bản Excel yêu cầu.'],
        example:{title:'Ví dụ ý tưởng',formula:'=LAMBDA(actual,target,IF(target=0,"",actual/target))(B2,C2)',text:'Tạo logic achievement có xử lý target bằng 0; sau khi test có thể đặt tên trong Name Manager.'},
        warning:'Named LAMBDA nằm trong workbook. Khi chuyển logic giữa file hoặc làm việc nhóm, cần kiểm tra tên, scope và tài liệu bàn giao.',
        questions:[
          {q:'Lợi ích chính của LAMBDA là?',options:['Tạo hàm tùy chỉnh tái sử dụng mà không cần VBA','Tự tạo Power Query','Mã hóa workbook','Tự sửa dữ liệu nguồn'],answer:0,explain:'LAMBDA đóng gói công thức thành hàm có tham số và có thể đặt tên trong workbook.'},
          {q:'Trước khi đưa LAMBDA vào Name Manager nên?',options:['Test logic với normal/boundary/error cases','Đặt tên bất kỳ rồi dùng ngay','Xóa helper/control','Chỉ thử một dòng đẹp'],answer:0,explain:'Hàm tái sử dụng có phạm vi ảnh hưởng lớn hơn nên cần test edge cases trước khi phát hành.'}
        ]
      }
    ]
  });

  // 02 · Professional Data Visualization: deepen Charts/Pareto rather than add another card.
  extendLesson('a16-charts-pareto', {
    outcomes: [
      'Chọn được Waterfall, Histogram, Scatter và Sparklines theo đúng câu hỏi',
      'Thiết kế chart có accessibility/contrast và hierarchy rõ',
      'Biết khi nào không nên dùng chart'
    ],
    useCases: [
      'Giải thích bridge Actual từ kỳ trước sang kỳ này bằng Waterfall',
      'Xem phân bố lead time/defect bằng Histogram',
      'Tạo mini-trend theo từng Store bằng Sparklines'
    ],
    sections: [
      {
        title:'Waterfall, Histogram, Scatter và Sparklines dùng khi nào',kind:'core',
        why:'Column/Line không trả lời tốt mọi câu hỏi. Chọn đúng visual giúp insight rõ mà không cần trang trí thêm.',
        body:['Waterfall phù hợp giải thích các thành phần làm một tổng tăng/giảm từ điểm đầu tới điểm cuối. Histogram mô tả phân bố một biến số theo bins. Scatter cho thấy mối quan hệ giữa hai biến số. Sparklines là mini-chart trong ô để so trend giữa nhiều dòng.','Không chọn chart theo “trông đẹp”. Hãy hỏi: cần so category, xem trend, xem distribution, xem relationship hay giải thích bridge?'],
        questions:[
          {q:'Muốn giải thích Revenue từ 100 lên 130 do Price +20, Volume +15, Return -5 nên cân nhắc?',options:['Waterfall','Pie 3D','Radar','WordArt'],answer:0,explain:'Waterfall được thiết kế để thể hiện các đóng góp tăng/giảm từ giá trị đầu đến cuối.'},
          {q:'Muốn xem phân bố thời gian xử lý 5.000 ticket theo các khoảng thời gian nên dùng?',options:['Histogram','Donut','Waterfall','Sparklines'],answer:0,explain:'Histogram nhóm một biến liên tục theo bins để xem distribution.'}
        ]
      },
      {
        title:'Accessibility: tương phản, màu mù và không truyền ý nghĩa chỉ bằng màu',kind:'core',
        why:'Một chart đúng số vẫn thất bại nếu người xem không phân biệt được series hoặc text quá nhạt.',
        body:['Giữ contrast đủ giữa text/nền. Với trạng thái PASS/WARN/FAIL, ngoài màu nên kết hợp label, icon hoặc pattern khi phù hợp. Tránh đỏ-xanh là tín hiệu duy nhất nếu report có nhiều người dùng.','Font, line thickness, marker và label cần đủ đọc trên màn hình desktop và khi xuất PDF. Màu nhạt dùng cho nền; nội dung chính cần màu chữ đủ đậm.'],
        warning:'Tone nhạt không đồng nghĩa với chữ nhạt. Nền có thể dịu nhưng text/metric quan trọng phải đạt contrast rõ.',
        questions:[
          {q:'Nếu chart chỉ dùng đỏ và xanh để truyền FAIL/PASS mà không có label, rủi ro là?',options:['Một số người khó phân biệt và report kém accessibility','Excel tự đổi số','Pivot hỏng','File tự tăng dung lượng'],answer:0,explain:'Meaning không nên phụ thuộc duy nhất vào màu; label/icon giúp thông tin vẫn đọc được.'},
          {q:'Tone pastel phù hợp nhất với?',options:['Nền/secondary surfaces, còn text chính phải đủ đậm','Mọi text kể cả số KPI','Ẩn cảnh báo','Trục chart cực nhạt'],answer:0,explain:'Pastel tạo hierarchy nhẹ cho background; foreground cần contrast để đọc.'}
        ]
      },
      {
        title:'Visual hierarchy và data-ink: biết bỏ bớt để insight nổi lên',kind:'extension',
        why:'Báo cáo chuyên nghiệp thường ít element hơn, không phải nhiều hơn.',
        body:['Ưu tiên title có thông điệp, metric chính, một điểm highlight và context cần thiết. Gridline, legend, data label, border chỉ giữ nếu giúp đọc.','Khi cần kể câu chuyện, đặt overview trước rồi breakdown/exception sau. Đừng buộc người đọc tự ghép 8 chart để đoán insight.'],
        questions:[
          {q:'Nếu mọi data point đều có label, border, shadow và màu riêng thì thường?',options:['Signal-to-noise giảm','Insight tự rõ hơn','File tự nhỏ hơn','Không ảnh hưởng'],answer:0,explain:'Quá nhiều decoration làm người xem khó xác định phần quan trọng.'},
          {q:'Trình tự report hợp lý thường là?',options:['Overview → vấn đề nổi bật → breakdown/chi tiết','Chi tiết ngẫu nhiên → title cuối','Màu trước dữ liệu','Chart trước định nghĩa KPI'],answer:0,explain:'Hierarchy từ tổng quan tới chi tiết giúp người đọc xây context trước khi đi sâu.'}
        ]
      }
    ]
  });

  // 03 · Collaboration / protection: extend the existing handover lesson, which already owns print/protect/versioning.
  extendLesson('a18-report-audit-handover', {
    outcomes: [
      'Phân biệt Notes, Comments, co-authoring và Version History',
      'Thiết kế vùng input/protected formula rõ cho người sử dụng',
      'Kiểm tra external links và connection trước bàn giao'
    ],
    useCases: [
      'Nhiều người review cùng một workbook trên Microsoft 365',
      'Template chỉ cho nhập ô được phép và tránh phá công thức',
      'Bàn giao file có external links/query sang máy khác'
    ],
    sections: [
      {
        title:'Notes, Comments, co-authoring và Version History',kind:'core',version:'Microsoft 365 có tính năng collaboration đầy đủ hơn',
        why:'Trao đổi ngay trong workbook giúp context không bị tách khỏi ô dữ liệu, nhưng Notes và Comments có vai trò khác nhau.',
        body:['Notes phù hợp ghi chú kiểu cũ gắn vào ô; modern Comments hỗ trợ hội thoại/@mention trong môi trường hỗ trợ. Co-authoring cho nhiều người chỉnh file cloud cùng lúc; Version History giúp xem/khôi phục phiên bản trước.','Không dùng Comments như database log cho quy trình cần audit bắt buộc. Với workflow quan trọng, xác định rõ owner, nơi lưu file và quy tắc version/release.'],
        questions:[
          {q:'Version History hữu ích khi?',options:['Cần xem/khôi phục phiên bản trước của file cloud','Muốn tính SUMIFS','Muốn đổi màu chart','Muốn Merge query'],answer:0,explain:'Version History lưu các phiên bản theo thời gian trong nền tảng hỗ trợ, hữu ích khi cộng tác.'},
          {q:'Comments trong Excel có nên được xem như audit log hệ thống bất biến không?',options:['Không','Có tuyệt đối','Chỉ trên Mac','Chỉ với .csv'],answer:0,explain:'Comments phục vụ collaboration; workflow cần audit nghiêm ngặt nên dùng hệ thống/log phù hợp.'}
        ]
      },
      {
        title:'Thiết kế vùng nhập liệu: unlocked input, protected formula và hướng dẫn tại chỗ',kind:'core',
        why:'Protect hiệu quả nhất khi người dùng hiểu ô nào được nhập và ô nào không được sửa.',
        body:['Một template tốt thường dùng màu nền nhẹ cho input, Data Validation khi có rule, unlock đúng vùng input rồi Protect Sheet để tránh sửa formula/helper.','Không khóa mù toàn Sheet. Người dùng vẫn cần Filter, Sort hoặc chọn ô theo workflow; hãy cấu hình permission phù hợp và test bằng vai trò người sử dụng thật.'],
        questions:[
          {q:'Template nhập liệu tốt nên?',options:['Phân biệt rõ input và formula, unlock input rồi protect có chọn lọc','Khóa mọi ô và không hướng dẫn','Để mọi công thức sửa tự do','Dùng password thay validation'],answer:0,explain:'Controlled input giảm lỗi nhưng vẫn phải giữ workflow người dùng có thể vận hành.'},
          {q:'Protect Sheet nên được test như thế nào?',options:['Thử bằng đúng thao tác người dùng cần làm','Chỉ nhìn biểu tượng khóa','Chỉ kiểm tra trên máy tác giả','Không cần test'],answer:0,explain:'Permission sai có thể chặn Filter/Sort/input hoặc vẫn cho sửa vùng không mong muốn.'}
        ]
      },
      {
        title:'External Links, Connections và trust trước khi bàn giao',kind:'core',
        why:'File có thể hiển thị số đúng trên máy tác giả nhưng lỗi trên máy người nhận vì path, credential hoặc connection.',
        body:['Kiểm tra Data → Queries & Connections, Workbook Links/Edit Links tùy phiên bản, Named Range và công thức có link [File.xlsx]. Xác định link nào chủ đích, link nào là rác từ copy/paste.','Khi dùng network/SharePoint/OneDrive, ghi rõ location và quyền cần thiết. Không nhúng credential vào workbook. Nếu source chưa sẵn sàng, ghi limitation thay vì đổi số sang hardcode để “chạy được”.'],
        warning:'Một external link không refresh được nhưng vẫn giữ cached value có thể khiến báo cáo trông bình thường dù dữ liệu đã cũ.',
        questions:[
          {q:'Workbook mở không báo lỗi nhưng external source không refresh được có thể vẫn nguy hiểm vì?',options:['Có thể đang hiển thị cached value cũ','Excel tự lấy nguồn mới','Mọi số sẽ về 0','Chart sẽ biến mất'],answer:0,explain:'Cached output có thể làm người dùng tưởng dữ liệu mới trong khi connection đã thất bại.'},
          {q:'Credential cho source nên?',options:['Quản lý qua cơ chế kết nối/quyền phù hợp, không hardcode trong workbook','Ghi password vào ô ẩn','Đặt trong tên Sheet','Đổi thành màu trắng'],answer:0,explain:'Secrets không nên được nhúng vào workbook như dữ liệu thường.'}
        ]
      }
    ]
  });

  // 04 · Data Model / DAX + Workbook Engineering live inside the final Advanced workflow card.
  extendLesson('x24-automation-workflow', {
    outcomes: [
      'Thiết kế star schema và relationship ở mức đủ dùng cho Excel Data Model',
      'Phân biệt Measure với Calculated Column và hiểu filter context',
      'Dùng CALCULATE/Date Table/Time Intelligence có kiểm soát',
      'Nhận diện nguyên nhân workbook chậm/nặng và tối ưu bằng đo lường'
    ],
    useCases: [
      'Dashboard nhiều Fact/Dimension và slicer dùng chung',
      'KPI YTD/MTD/YoY trong Data Model',
      'Workbook 100 MB refresh chậm cần phân tích bottleneck',
      'Thiết kế RAW / STAGING / MODEL / REPORT / CONTROL dễ bàn giao'
    ],
    sections: [
      {
        title:'Power Pivot & Data Model: từ bảng phẳng sang Star Schema',kind:'core',version:'Power Pivot/Data Model tùy edition/OS',
        why:'Khi một báo cáo có nhiều bảng lớn, copy lookup mọi thuộc tính vào Fact làm file nặng và model khó kiểm soát.',
        body:['Star schema gồm Fact ở grain giao dịch/sự kiện và Dimensions như Date, Store, Product, Staff. Relationship nối key từ Fact tới Dimension thay vì lặp thuộc tính ở mọi dòng Fact.','Trước khi tạo relationship, kiểm tra key phía Dimension phải unique và type hai phía tương thích. Many-to-many hoặc duplicate dimension cần được hiểu rõ thay vì tạo relation rồi hy vọng Pivot đúng.'],
        questions:[
          {q:'Trong star schema, bảng nào thường chứa Revenue/Qty theo giao dịch?',options:['Fact','Dimension Date','Theme','Config màu'],answer:0,explain:'Fact chứa events/metrics ở grain đã xác định; Dimension chứa thuộc tính để filter/group.'},
          {q:'Trước relationship Fact.StoreCode → DimStore.StoreCode, điều quan trọng ở DimStore là?',options:['StoreCode unique và cùng kiểu dữ liệu','Có nhiều duplicate','Có merge cells','Có chart'],answer:0,explain:'Dimension key cần đại diện một record duy nhất để relationship many-to-one ổn định.'}
        ]
      },
      {
        title:'DAX Measure vs Calculated Column: chọn đúng lớp tính',kind:'core',version:'Power Pivot/Data Model',
        why:'Nhầm Measure và Calculated Column làm model phình và KPI phản ứng filter không đúng mong đợi.',
        body:['Calculated Column tính theo từng row và lưu giá trị cho mỗi row trong model. Measure chỉ tính khi query/report yêu cầu và phản ứng filter context.','KPI tổng hợp như Revenue, Orders, AOV, Conversion thường phù hợp Measure. Column phù hợp thuộc tính row-level cần dùng để group/filter hoặc làm input khác, nhưng không nên tạo column chỉ vì chưa hiểu Measure.'],
        example:{title:'Ví dụ',formula:'Revenue := SUM(FactSales[NetRevenue])',text:'Measure Revenue phản ứng Store/Date/Product filter trong Pivot hoặc dashboard.'},
        questions:[
          {q:'KPI Revenue thay đổi theo Slicer thường nên là?',options:['Measure','Calculated Column bắt buộc','Text Box','Named Range'],answer:0,explain:'Measure được tính theo filter context hiện tại của report.'},
          {q:'Calculated Column có đặc điểm nào?',options:['Tính cho từng row và chiếm storage theo row','Chỉ tính khi chart mở','Không tồn tại trong model','Luôn nhanh hơn Measure'],answer:0,explain:'Column được materialize trong model nên có chi phí bộ nhớ theo số row.'}
        ]
      },
      {
        title:'Filter Context, CALCULATE và context transition ở mức thực dụng',kind:'core',version:'DAX',
        why:'DAX không khó vì cú pháp SUM; phần khó là hiểu một Measure đang được tính trong tập dữ liệu nào.',
        body:['Filter context đến từ Row/Column/Slicer/Filter của Pivot/report và từ DAX. CALCULATE đánh giá biểu thức trong filter context đã được thay đổi/thêm.','Đừng học thuộc CALCULATE như “SUMIFS của DAX”. Hãy luôn mô tả filter nào đang tồn tại và filter nào CALCULATE thêm/xóa. Debug Measure bằng visual nhỏ và control totals trước khi đưa vào dashboard.'],
        example:{title:'Ví dụ ý tưởng',formula:'Sales North := CALCULATE([Revenue], DimStore[Region]="North")',text:'Measure Revenue được đánh giá trong context bổ sung Region = North.'},
        questions:[
          {q:'CALCULATE chủ yếu làm gì?',options:['Đánh giá expression trong filter context được điều chỉnh','Đổi màu Pivot','Import file','Protect Sheet'],answer:0,explain:'CALCULATE là hàm cốt lõi để thay đổi filter context khi tính Measure.'},
          {q:'Slicer Month có ảnh hưởng Measure Revenue không?',options:['Có nếu model/relationship/filter context kết nối đúng','Không bao giờ','Chỉ Calculated Column','Chỉ VBA'],answer:0,explain:'Measure phản ứng filter context từ report khi relationship/model được thiết kế đúng.'}
        ]
      },
      {
        title:'Date Table và Time Intelligence: MTD, YTD, YoY có điều kiện',kind:'core',version:'DAX · Data Model',
        why:'So thời gian đáng tin cần một Date Dimension liên tục và relationship rõ, không chỉ MONTH(OrderDate).',
        body:['Date Table nên có một dòng mỗi ngày trong phạm vi cần thiết, không bị thiếu ngày, và có Year/Quarter/Month/MonthSort… Mark as Date Table khi môi trường yêu cầu.','Time Intelligence như TOTALYTD hoặc SAMEPERIODLASTYEAR chỉ có ý nghĩa khi date context/model đúng. Với fiscal calendar hoặc custom period, cần thiết kế dimension phù hợp thay vì ép calendar chuẩn.'],
        questions:[
          {q:'Date Table tốt nên?',options:['Có dải ngày liên tục và key ngày unique','Chỉ chứa ngày có giao dịch','Có duplicate date để đủ row','Chỉ một cột text Month'],answer:0,explain:'Continuous unique date dimension tạo nền filter thời gian ổn định.'},
          {q:'YoY sai có thể do?',options:['Date relationship/calendar context sai','Màu chart','Tên Sheet quá ngắn','Không có Macro'],answer:0,explain:'Time intelligence phụ thuộc mô hình ngày và filter context, không chỉ cú pháp measure.'}
        ]
      },
      {
        title:'Workbook Performance: tính toán nào làm Excel chậm',kind:'core',
        why:'File chậm không nên được chữa bằng “máy mạnh hơn” trước khi biết bottleneck nằm ở formula, query, model hay object.',
        body:['Các rủi ro phổ biến gồm volatile functions dùng dày (OFFSET/INDIRECT/TODAY/NOW tùy thiết kế), full-column array calculations, SUMPRODUCT lớn lặp lại, lookup lặp cùng biểu thức, quá nhiều conditional formatting/object và calculation chain dài.','Đừng cấm một hàm chỉ vì tên nó “nặng”. Đo thời gian/recalc và xác định vùng gây chậm trước. LET/helper/model/PQ có thể giảm tính lặp nếu phù hợp.'],
        warning:'Calculation Mode = Manual có thể làm file “nhanh” nhưng để số cũ. Chỉ dùng có chủ đích và luôn phục hồi trạng thái trước bàn giao.',
        questions:[
          {q:'Cách tối ưu tốt nhất trước tiên là?',options:['Đo và xác định bottleneck thật','Xóa ngẫu nhiên công thức','Đổi toàn bộ sang VBA','Tắt Calculation rồi quên'],answer:0,explain:'Optimization nên dựa bằng chứng; cùng một pattern có thể nhanh/chậm khác nhau tùy quy mô và dependency.'},
          {q:'Full-column array calculation trên hàng triệu ô có thể?',options:['Tăng chi phí tính toán không cần thiết','Luôn nhanh hơn Table','Không ảnh hưởng','Tự nén file'],answer:0,explain:'Mảng xử lý vùng rất lớn có thể tính nhiều ô trống/không cần thiết.'}
        ]
      },
      {
        title:'Workbook Engineering: RAW → STAGING → MODEL → REPORT → CONTROL',kind:'core',
        why:'Tách lớp rõ giúp file dễ debug, giảm double-count và giúp người khác biết được phép sửa ở đâu.',
        body:['RAW giữ nguồn ít biến đổi; STAGING chuẩn hóa; MODEL giữ grain/keys/measures; REPORT trình bày; CONTROL đối soát. Với workbook nhỏ, các layer có thể không cần thành 5 Sheet riêng nhưng vai trò vẫn nên tách về logic.','Đặt config/parameter tại một nơi, tránh external links không cần, load staging query Connection Only khi hợp lý và xóa helper/test artifact trước release nếu không phục vụ audit.'],
        questions:[
          {q:'REPORT có nên là nơi người dùng sửa trực tiếp raw data không?',options:['Không; nên tách input/source khỏi output','Có luôn','Chỉ dashboard','Chỉ .xlsm'],answer:0,explain:'Mix input và report làm lineage mơ hồ và tăng rủi ro sửa nhầm.'},
          {q:'Staging query chỉ phục vụ downstream thường có thể?',options:['Connection Only nếu không cần output Sheet','Bắt buộc load nhiều bản','Chuyển thành ảnh','Đặt trong chart'],answer:0,explain:'Load strategy hợp lý giảm clutter và có thể giảm overhead.'}
        ]
      },
      {
        title:'Diagnose file nặng: size, formulas, queries, links và objects',kind:'extension',
        why:'Workbook 100 MB có thể nặng vì nhiều nguyên nhân; sửa sai lớp thường không cải thiện đáng kể.',
        body:['Audit lần lượt: Used Range bất thường, hidden sheets/objects, duplicated data, Pivot cache, Data Model, query load, conditional formatting phạm vi lớn, external links, công thức và named ranges.','Tạo copy trước cleanup. Sau mỗi thay đổi lớn đo lại file size, open time, recalc/refresh time và kiểm tra control totals. Không “dọn” bằng cách xóa metadata/query mà chưa biết dependency.'],
        questions:[
          {q:'Sau tối ưu một workbook quan trọng nên kiểm tra?',options:['Size/thời gian + control totals/output','Chỉ thấy file nhỏ là PASS','Chỉ màu dashboard','Không cần reopen'],answer:0,explain:'Performance change có thể làm sai logic; cần vừa đo performance vừa giữ correctness controls.'},
          {q:'Used Range phình xa dữ liệu thật có thể?',options:['Làm file nặng hơn và scroll/processing bất thường','Tự tăng Revenue','Tạo DAX','Không ảnh hưởng bao giờ'],answer:0,explain:'Formatting/data từng tồn tại xa vùng thật có thể làm Excel coi phạm vi sử dụng lớn hơn cần thiết.'}
        ]
      }
    ]
  });

  // 05/06 · Keep real cases out of Knowledge, but make the route explicit after every lesson.
  const nextStepByZone = {
    foundation: {
      headline:'Biến kiến thức thành thao tác',
      body:'Làm bài ngắn để kiểm tra bạn có thực sự thao tác được, thay vì chỉ đọc hiểu.',
      actions:[
        ['BÀI TẬP TỰ CHẤM','Vào Auto Grading','practice-grader.html'],
        ['THỰC HÀNH THEO VIDEO','Làm cùng hướng dẫn','practice-video.html'],
        ['ĐÍCH ĐẾN','Xem Professional Track','professional-access.html?intro=1']
      ]
    },
    skills: {
      headline:'Dùng công thức trên file thật',
      body:'Sau khi hiểu logic, hãy nộp file để Auto-Grader kiểm tra công thức và kết quả.',
      actions:[
        ['BÀI TẬP TỰ CHẤM','Luyện công thức & dữ liệu','practice-grader.html'],
        ['THỰC HÀNH THEO VIDEO','Làm case hướng dẫn','practice-video.html'],
        ['CASE NGHỀ NGHIỆP','Professional Track','professional-access.html?intro=1']
      ]
    },
    analysis: {
      headline:'Từ phân tích sang báo cáo thực chiến',
      body:'Knowledge giải thích nguyên tắc; Practice kiểm tra thao tác; Professional mới là nơi xử lý case nghiệp vụ nhiều lớp.',
      actions:[
        ['AUTO GRADING','Nộp bài tự chấm','practice-grader.html'],
        ['THỰC HÀNH','Bài tập theo video','practice-video.html'],
        ['CASE CHUYÊN SÂU','Professional Track','professional-access.html?intro=1']
      ]
    },
    advanced: {
      headline:'Đưa kỹ năng nâng cao vào hệ thống thật',
      body:'Đừng dừng ở biết hàm hoặc biết nút. Hãy kiểm tra bằng file nộp và case có control, exception, handover.',
      actions:[
        ['AUTO GRADING','Kiểm tra bằng file','practice-grader.html'],
        ['THỰC HÀNH','Luyện workflow','practice-video.html'],
        ['ỨNG DỤNG CAO NHẤT','Professional Track','professional-access.html?intro=1']
      ]
    }
  };

  function injectNextSteps() {
    const bottomNav = document.getElementById('kvBottomNav');
    const sections = document.getElementById('kvSections');
    if (!bottomNav || !sections || document.getElementById('kvNextSteps')) return;
    const requested = new URLSearchParams(location.search).get('lesson');
    const lesson = byId.get(requested) || lessons[0];
    if (!lesson) return;
    const model = nextStepByZone[lesson.zone] || nextStepByZone.foundation;
    const wrapper = document.createElement('section');
    wrapper.id = 'kvNextSteps';
    wrapper.className = 'kv-next-steps';
    wrapper.innerHTML = `
      <div class="kv-next-copy">
        <span>HỌC XONG THÌ ĐI ĐÂU?</span>
        <h2>${model.headline}</h2>
        <p>${model.body}</p>
      </div>
      <div class="kv-next-actions">
        ${model.actions.map(([eyebrow,title,href]) => `<a href="${href}"><small>${eyebrow}</small><strong>${title} →</strong></a>`).join('')}
      </div>`;
    bottomNav.parentNode.insertBefore(wrapper, bottomNav);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectNextSteps);
  else requestAnimationFrame(injectNextSteps);
})();
