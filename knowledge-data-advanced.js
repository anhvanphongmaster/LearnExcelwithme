(() => {
  'use strict';
  const lessons = [
    {
      id:'x19-advanced-formulas',order:19,zone:'advanced',level:'Nâng cao & Tự động hóa',duration:'90 phút',version:'Excel 2016+ · LET tùy phiên bản mới',
      title:'Công thức nâng cao: thiết kế logic dễ audit',short:'SUMPRODUCT, INDEX reference, AGGREGATE, formula audit, LET và cách tránh “siêu công thức” khó bảo trì.',
      hook:'Nâng cao không có nghĩa công thức phải dài. Mục tiêu là giải quyết bài toán khó nhưng vẫn truy vết, test và bàn giao được.',
      prerequisites:['s07-logic','s08-conditional-aggregation','s09-lookup'],
      outcomes:['Biết khi nào dùng helper thay mega-formula','Hiểu SUMPRODUCT cho logic mảng có điều kiện','Biết AGGREGATE/INDEX reference trong các tình huống phù hợp','Dùng LET khi có để đặt tên phần tính và giảm lặp'],
      useCases:['Tính logic nhiều điều kiện khó biểu diễn bằng SUMIFS','Tạo công thức linh hoạt nhưng cần audit','Bỏ qua lỗi/hidden trong một số phép tổng hợp','Giảm lặp biểu thức dài trong Excel mới'],
      sections:[
        {
          title:'Nâng cao = rõ logic + kiểm soát, không phải dài',kind:'core',
          why:'Một công thức 300 ký tự có thể “chạy” nhưng rất khó debug khi business rule đổi.',
          body:['Trước khi viết công thức phức tạp, tách bài toán thành inputs, transformations, condition và output. Nếu nhiều bước có ý nghĩa riêng, helper columns thường là thiết kế tốt.','Công thức nên có test cases: normal, boundary, blank, error và exception. Nâng cao là khả năng kiểm soát logic, không phải số lượng hàm lồng.'],
          questions:[
            {q:'Một công thức rất dài có tự động tốt hơn helper columns không?',options:['Có','Không; readability/auditability có thể quan trọng hơn độ ngắn','Chỉ khi 365','Chỉ khi màu xanh'],answer:1,explain:'Thiết kế cần đúng, dễ kiểm tra và bảo trì. Helper có thể làm dependency rõ hơn.'},
            {q:'Test case tốt cho công thức phức tạp gồm?',options:['Normal + boundary + blank/error/exception','Chỉ một dòng đúng','Chỉ màu','Chỉ total'],answer:0,explain:'Các case khác nhau giúp phát hiện lỗi điều kiện và edge cases.'}
          ]
        },
        {
          title:'SUMPRODUCT cho logic mảng có điều kiện',kind:'core',
          why:'SUMPRODUCT có thể nhân các mảng điều kiện 1/0 và metric để tạo tổng có logic linh hoạt.',
          body:['SUMPRODUCT nhân các phần tử tương ứng rồi cộng. Biểu thức như --(A2:A100="S001") chuyển TRUE/FALSE thành 1/0 trong nhiều cách dùng. Kết hợp với Revenue có thể tính tổng theo condition mà không cần helper.','SUMPRODUCT mạnh nhưng dễ chậm nếu dùng full-column ranges lớn và nhiều công thức. Nếu SUMIFS làm được rõ hơn, thường nên dùng SUMIFS.'],
          example:{title:'Ví dụ',formula:'=SUMPRODUCT((A2:A100="S001")*(B2:B100>0)*C2:C100)',text:'Tổng C cho dòng Store S001 và B>0.'},
          questions:[
            {q:'Trong SUMPRODUCT, biểu thức điều kiện thường đóng vai trò?',options:['Mảng 1/0 để giữ/bỏ dòng','Đổi màu','Tạo Sheet','Khóa file'],answer:0,explain:'TRUE/FALSE được coerced thành 1/0 để nhân với metric.'},
            {q:'Nếu SUMIFS giải được rõ ràng, có luôn nên thay bằng SUMPRODUCT?',options:['Không; ưu tiên công thức đơn giản/dễ đọc hơn','Có bắt buộc','Chỉ trên Mac','Không hàm nào dùng được'],answer:0,explain:'SUMPRODUCT phù hợp logic mảng đặc thù, nhưng không cần cho bài đơn giản.'}
          ]
        },
        {
          title:'INDEX ở dạng reference và chọn vùng động',kind:'core',
          why:'INDEX không chỉ lookup; nó có thể trả reference để tạo vùng tính linh hoạt mà tránh một số hàm volatile.',
          body:['INDEX(array,row_num,[column_num]) thường trả giá trị, nhưng trong một số công thức vùng, INDEX có thể tạo điểm đầu/cuối reference, ví dụ SUM(A2:INDEX(A:A,n)).','Kỹ thuật vùng động cần cực rõ về row number và header. Với nguồn dữ liệu dạng Table, structured reference thường dễ quản lý hơn tự xây dynamic range phức tạp.'],
          questions:[
            {q:'INDEX có thể dùng ngoài lookup để?',options:['Tạo reference/điểm cuối vùng trong một số công thức','Chỉ đổi font','Chỉ tạo chart','Không'],answer:0,explain:'INDEX có khả năng trả reference trong ngữ cảnh phù hợp.'},
            {q:'Khi source là Table tự mở rộng, có cần luôn xây dynamic range INDEX phức tạp không?',options:['Không, Table có thể đơn giản hơn','Có bắt buộc','Chỉ nếu dữ liệu số','Chỉ Excel 365'],answer:0,explain:'Structured reference thường đã giải quyết bài toán vùng tăng.'}
          ]
        },
        {
          title:'AGGREGATE và xử lý hidden/error có kiểm soát',kind:'core',
          why:'Một số phép tổng hợp cần bỏ qua error hoặc row ẩn theo option, điều SUM đơn giản không làm được.',
          body:['AGGREGATE(function_num, options, array/ref, …) hỗ trợ các phép như AVERAGE, SUM, LARGE… với option bỏ qua hidden rows, errors hoặc nested subtotal trong một số cấu hình.','Do function_num/options là mã số, công thức có thể khó đọc. Ghi chú logic hoặc dùng helper/control để người nhận hiểu tại sao chọn option đó.'],
          warning:'Đừng dùng “ignore errors” để biến data quality issue thành invisible. Chỉ bỏ error nếu nghiệp vụ cho phép và vẫn đếm/kiểm soát exception ở nơi khác.',
          questions:[
            {q:'AGGREGATE hữu ích khi?',options:['Cần tổng hợp với tùy chọn bỏ hidden/error theo rule','Muốn đổi tên Sheet','Muốn nhập text','Muốn Merge'],answer:0,explain:'AGGREGATE có options kiểm soát row/error trong aggregation.'},
            {q:'Bỏ qua error bằng AGGREGATE có nghĩa lỗi nguồn không cần xử lý?',options:['Không','Có','Chỉ 365','Chỉ file nhỏ'],answer:0,explain:'Output có thể bỏ error theo rule nhưng data quality vẫn cần được theo dõi.'}
          ]
        },
        {
          title:'LET: đặt tên phần tính để công thức dễ đọc',kind:'core',version:'Microsoft 365 / Excel 2021+ phổ biến',
          why:'LET giảm lặp cùng một biểu thức và làm công thức giống một chuỗi bước có tên.',
          body:['LET(name1,value1,name2,value2,…,calculation) cho phép đặt tên biến cục bộ. Ví dụ có thể đặt rev = H2:H100, store = D2:D100 rồi dùng trong calculation.','LET có thể cải thiện readability/performance khi một biểu thức lặp nhiều lần, nhưng tên biến nên mô tả ý nghĩa. Không dùng LET chỉ để làm công thức trông “cao cấp”.'],
          example:{title:'Ví dụ',formula:'=LET(rev,H2:H100,total,SUM(rev),total)',text:'Đặt tên rev và total rồi trả total.'},
          questions:[
            {q:'Lợi ích chính của LET là?',options:['Đặt tên và tái sử dụng biểu thức trong công thức','Tạo Macro','Xóa duplicate','Bảo vệ file'],answer:0,explain:'LET tạo biến cục bộ, giúp công thức rõ và giảm tính lặp.'},
            {q:'Tên biến LET nên?',options:['Mô tả ý nghĩa như revenue/target','a,b,c bất kể logic','Tên màu','Không cần'],answer:0,explain:'Tên có nghĩa hỗ trợ đọc và audit.'}
          ]
        },
        {
          title:'Evaluate Formula, F9 và Name Manager như công cụ debug',kind:'extension',
          why:'Kỹ năng debug nhanh quan trọng hơn việc nhớ thêm 50 hàm.',
          body:['Evaluate Formula đi từng bước của công thức. Trong Formula Bar, chọn một phần biểu thức rồi F9 có thể xem kết quả phần đó; cần Esc để thoát nếu không muốn thay phần công thức bằng giá trị.','Name Manager giúp xem Named Range/Formula và phạm vi Workbook/Sheet. Named ranges tốt có thể làm công thức rõ; named ranges cũ/hỏng cũng có thể tạo hidden complexity.'],
          warning:'Không nhấn Enter sau khi F9 evaluate một phần nếu bạn không muốn ghi đè biểu thức bằng kết quả tĩnh.',
          questions:[
            {q:'Evaluate Formula giúp?',options:['Xem từng bước tính của công thức','Đổi theme','Tạo Slicer','Refresh Query'],answer:0,explain:'Đây là công cụ audit/debug formula.'},
            {q:'Sau khi dùng F9 xem một phần công thức, muốn tránh thay công thức bằng giá trị nên?',options:['Esc/thoát chỉnh sửa phù hợp','Enter ngay','Save As CSV','Merge'],answer:0,explain:'Esc giúp hủy thay đổi khi chỉ đang evaluate.'}
          ]
        },
        {
          title:'What-If, Goal Seek và Solver ở đúng vị trí',kind:'extension',version:'Solver có thể cần bật Add-in',
          why:'Đây là công cụ ra quyết định/tối ưu, không phải nền tảng dữ liệu; nên học sau khi mô hình công thức đã đáng tin.',
          body:['Goal Seek tìm một input để một formula đạt target. Data Table/Scenario Manager hỗ trợ phân tích kịch bản; Solver tối ưu objective với biến và constraints.','Nếu model formula sai, Solver chỉ tối ưu một mô hình sai. Vì vậy control/model validation đi trước optimization.'],
          questions:[
            {q:'Goal Seek phù hợp với?',options:['Tìm input cần thiết để output đạt target','Gộp nhiều file','Clean text','Sort'],answer:0,explain:'Goal Seek giải ngược một biến đầu vào cho một mục tiêu output.'},
            {q:'Trước Solver, điều quan trọng là?',options:['Mô hình và constraint đúng/được kiểm tra','Chart đẹp','Merge','Password'],answer:0,explain:'Optimizer phụ thuộc hoàn toàn vào model/constraints được cung cấp.'}
          ]
        }
      ]
    },
    {
      id:'x20-dynamic-array',order:20,zone:'advanced',level:'Nâng cao & Tự động hóa',duration:'90 phút',version:'Microsoft 365 / Excel 2021+ tùy hàm',
      title:'Dynamic Array và công thức Excel hiện đại',short:'FILTER, UNIQUE, SORT, SEQUENCE, spill range, #SPILL! và tư duy một công thức trả nhiều ô.',
      hook:'Dynamic Array thay đổi cách xây report phụ trợ: một công thức có thể trả cả danh sách tự mở rộng thay vì kéo xuống hàng trăm dòng.',
      prerequisites:['s09-lookup','s10-text','x19-advanced-formulas'],
      outcomes:['Hiểu spill behavior và toán tử #','Dùng FILTER/UNIQUE/SORT cho danh sách động','Dùng SEQUENCE cho chuỗi số/ngày','Xử lý #SPILL! và tránh tham chiếu hard-size'],
      useCases:['Danh sách Store theo điều kiện','Danh sách unique mã/nhân viên','Top/sort động','Tạo calendar hoặc sequence kỳ'],
      sections:[
        {
          title:'Spill: một công thức trả nhiều ô',kind:'core',
          why:'Dynamic Array không cần copy công thức xuống; vùng kết quả tự mở rộng theo dữ liệu.',
          body:['Khi công thức trả mảng nhiều giá trị, Excel spill kết quả sang ô lân cận. Chỉ ô góc trên trái chứa công thức gốc; các ô spill là kết quả liên kết.','Toán tử # sau địa chỉ spill anchor, ví dụ H2#, tham chiếu toàn bộ spill range hiện tại. Khi số dòng thay đổi, H2# thay đổi theo.'],
          questions:[
            {q:'Trong vùng spill, công thức gốc thường nằm ở?',options:['Ô góc trên trái anchor','Mọi ô đều có công thức riêng','Sheet khác','Không có công thức'],answer:0,explain:'Dynamic array formula nằm ở anchor và kết quả spill ra vùng.'},
            {q:'H2# thường biểu thị?',options:['Toàn spill range bắt đầu ở H2','Lỗi #VALUE','Chỉ H2','Tên Sheet'],answer:0,explain:'# tham chiếu dynamic spill range của công thức anchor.'}
          ]
        },
        {
          title:'FILTER: trả danh sách theo điều kiện',kind:'core',
          why:'FILTER tạo subset động mà không ẩn dòng như AutoFilter và không cần công thức copy từng dòng.',
          body:['FILTER(array, include, [if_empty]) trả các dòng/cột nơi include=TRUE. include phải có kích thước phù hợp với dimension đang lọc.','Ví dụ FILTER(A2:H100,D2:D100="S001","Không có dữ liệu") trả các dòng Store S001. Khi source đổi, danh sách spill cập nhật.'],
          example:{title:'Ví dụ',formula:'=FILTER(A2:H100,D2:D100=K2,"Không có dữ liệu")',text:'K2 là Store được chọn.'},
          questions:[
            {q:'FILTER khác AutoFilter ở?',options:['FILTER trả một mảng kết quả bằng công thức; AutoFilter ẩn/hiện dòng source','Không khác','FILTER xóa source','AutoFilter là VBA'],answer:0,explain:'Hai công cụ phục vụ mục tiêu khác: formula output vs view filtering.'},
            {q:'include trong FILTER cần?',options:['Tương ứng đúng số dòng/cột với array theo chiều lọc','Một màu','Một chart','Một Sheet'],answer:0,explain:'Boolean include mask phải align với array.'}
          ]
        },
        {
          title:'UNIQUE và SORT/SORTBY',kind:'core',
          why:'Tạo danh sách distinct và xếp hạng động mà không cần Remove Duplicates phá dữ liệu.',
          body:['UNIQUE(array) trả danh sách giá trị duy nhất; SORT sắp xếp mảng theo index; SORTBY sắp theo một hoặc nhiều mảng khác. Có thể kết hợp UNIQUE+SORT để tạo dropdown/source list động.','UNIQUE phản ánh uniqueness của chuỗi thực: "S001" và "S001 " có thể khác nhau. Cleaning vẫn phải làm trước nếu source bẩn.'],
          example:{title:'Ví dụ',formula:'=SORT(UNIQUE(D2:D1000))',text:'Tạo danh sách Store unique và sort tăng dần.'},
          questions:[
            {q:'UNIQUE có thay đổi/xóa duplicate trong source không?',options:['Không, chỉ trả output unique','Có, xóa source','Chỉ nếu Ctrl+T','Chỉ Mac'],answer:0,explain:'UNIQUE là hàm tạo kết quả, source không bị chỉnh.'},
            {q:'"S001" và "S001 " có thể được UNIQUE coi khác nhau?',options:['Có, do chuỗi khác ký tự','Không bao giờ','Chỉ 2016','Chỉ nếu màu'],answer:0,explain:'Khoảng trắng là ký tự, nên cleaning cần làm trước.'}
          ]
        },
        {
          title:'SEQUENCE và tạo chuỗi động',kind:'core',
          why:'SEQUENCE giúp tạo số thứ tự, calendar axis hoặc danh sách kỳ không cần kéo fill handle.',
          body:['SEQUENCE(rows,[columns],[start],[step]) tạo mảng số. Vì Date là số serial, SEQUENCE có thể tạo dãy ngày khi start là Date và step=1.','Kết hợp với EOMONTH/DATE để tạo trục tháng hoặc calendar, nhưng phải giữ scope rõ để không spill vào vùng có dữ liệu khác.'],
          questions:[
            {q:'=SEQUENCE(5) thường trả?',options:['1,2,3,4,5 theo cột','Chỉ số 5','Năm hiện tại','5 Sheet'],answer:0,explain:'Mặc định start=1, step=1 và một cột.'},
            {q:'SEQUENCE có thể tạo ngày vì?',options:['Date trong Excel là số serial','Ngày là Text','SEQUENCE tự đọc calendar từ web','Vì chart'],answer:0,explain:'Cộng step vào serial tương đương tăng ngày.'}
          ]
        },
        {
          title:'#SPILL! và vùng kết quả bị chặn',kind:'core',
          why:'Dynamic Array cần không gian trống; một ô có dữ liệu trong vùng spill sẽ chặn toàn công thức.',
          body:['#SPILL! thường xuất hiện khi vùng kết quả dự kiến có ô không trống, merged cell hoặc giới hạn khác. Chọn cảnh báo để xem spill range dự kiến rồi dọn đúng obstruction.','Đừng xóa ngẫu nhiên cả vùng. Xác định ô chặn có dữ liệu quan trọng hay không. Trong Table, dynamic array behavior cũng có giới hạn nhất định; thường đặt spill formula ngoài Table.'],
          questions:[
            {q:'#SPILL! thường liên quan?',options:['Vùng kết quả bị chặn/không thể spill','Lookup không tìm thấy','Chia 0','Tên Sheet sai'],answer:0,explain:'#SPILL! là lỗi dynamic array expansion.'},
            {q:'Cách xử lý tốt?',options:['Xác định spill range và ô chặn trước khi xóa','Xóa toàn Sheet','IFERROR che','Merge thêm'],answer:0,explain:'Cần xử lý obstruction có chủ đích.'}
          ]
        },
        {
          title:'Dynamic Array với XLOOKUP và dashboard phụ trợ',kind:'extension',
          why:'Các hàm hiện đại có thể kết hợp tạo bảng lựa chọn động, nhưng không nên thay data model khi logic trở nên lớn.',
          body:['FILTER có thể tạo subset, UNIQUE tạo dimension list, XLOOKUP trả thuộc tính cho mảng, SORTBY xếp theo metric. Đây là nền cho report nhỏ linh hoạt không cần helper hàng trăm dòng.','Khi pipeline cần import/clean nhiều file hoặc model nhiều bảng, Power Query/Pivot/Data Model vẫn phù hợp hơn một mạng công thức spill quá lớn.'],
          questions:[
            {q:'Dynamic Array có thay thế Power Query cho mọi ETL không?',options:['Không','Có','Chỉ 365','Chỉ CSV'],answer:0,explain:'Formula và ETL có vai trò khác; PQ tốt cho import/transform lặp.'},
            {q:'Tổ hợp nào tạo danh sách Store unique đã sort?',options:['SORT(UNIQUE(...))','SUM(IF(...))','LEFT(RIGHT(...))','ROUND(MAX(...))'],answer:0,explain:'UNIQUE tạo distinct, SORT sắp output.'}
          ]
        }
      ]
    },
    {
      id:'x21-power-query-basics',order:21,zone:'advanced',level:'Nâng cao & Tự động hóa',duration:'120 phút',version:'Excel 2016+ Windows: Get & Transform tích hợp · tính năng Mac tùy phiên bản',
      title:'Power Query nền tảng: Import → Transform → Load',short:'Query Editor, Applied Steps, type, Trim/Clean, remove/filter, Close & Load và Refresh.',
      hook:'Nếu mỗi tuần bạn lại copy file, xóa cột, Trim, đổi kiểu và ghép dữ liệu bằng tay, Power Query biến chuỗi thao tác đó thành quy trình có thể Refresh.',
      prerequisites:['s12-clean-control','a13-excel-table'],
      outcomes:['Hiểu luồng Source → Transform → Load','Đọc Applied Steps và biết bước nào thay dữ liệu','Đặt data type, Trim/Clean, filter/remove cột đúng cách','Load ra Table hoặc connection và Refresh có kiểm soát'],
      useCases:['Làm sạch file xuất hệ thống','Chuẩn hóa dữ liệu nhập hàng ngày','Tái chạy transformation khi source đổi','Chuẩn bị source cho Pivot/Data Model'],
      sections:[
        {
          title:'Power Query là ETL, không phải “một nút gộp file”',kind:'core',
          why:'Hiểu vai trò giúp bạn biết bước nào nên làm trong Query và bước nào nên để Formula/Pivot.',
          body:['ETL = Extract, Transform, Load. Power Query kết nối nguồn, ghi lại các transformation và nạp kết quả về Excel/Data Model. Query không sửa file nguồn khi bạn transform trong Editor; nó tạo output dựa trên source.','Power Query phù hợp bước chuẩn hóa dữ liệu trước phân tích. Logic tương tác theo ô hoặc công thức người dùng nhập có thể vẫn phù hợp Excel formula.'],
          questions:[
            {q:'Power Query chủ yếu phục vụ?',options:['Import/transform/load dữ liệu lặp lại','Định dạng font','Vẽ logo','Protect Sheet'],answer:0,explain:'PQ là công cụ ETL trong Excel.'},
            {q:'Transform trong Query Editor có trực tiếp sửa file source gốc không?',options:['Thông thường không; nó tạo kết quả theo steps','Luôn xóa source','Chỉ CSV','Chỉ 365'],answer:0,explain:'Query đọc source và áp steps vào output; source file không bị sửa bởi transformation thông thường.'}
          ]
        },
        {
          title:'Get Data và chọn source đúng',kind:'core',
          why:'Connection tới đúng file/Table/folder quyết định khả năng Refresh và bàn giao.',
          body:['Get Data có thể kết nối Workbook, Text/CSV, Folder, database và nguồn khác tùy edition. Với workbook hiện tại, From Table/Range là cách phổ biến để đưa Table vào PQ.','Đường dẫn local cứng có thể hỏng trên máy người khác. Khi workflow cần bàn giao, thiết kế folder/path/config phù hợp hoặc hướng dẫn rõ nơi đặt file.'],
          warning:'Đừng “browse tạm” tới Downloads rồi quên. Refresh sau này sẽ phụ thuộc đúng path đã lưu.',
          questions:[
            {q:'From Table/Range dùng khi?',options:['Muốn đưa Table/range hiện tại vào Power Query','Muốn tạo chart','Muốn Save As','Muốn Macro'],answer:0,explain:'Đây là connector phổ biến từ dữ liệu trong workbook.'},
            {q:'Rủi ro của path C:\Users\A\Downloads\source.xlsx?',options:['Máy người khác có thể không có path này','Query tự chuyển cloud','Không có','Chỉ ảnh hưởng màu'],answer:0,explain:'Absolute local path phụ thuộc máy người tạo.'}
          ]
        },
        {
          title:'Applied Steps và thứ tự transformation',kind:'core',
          why:'Power Query là pipeline; bước sau phụ thuộc output bước trước.',
          body:['Applied Steps ghi từng transformation như Source, Promoted Headers, Changed Type, Filtered Rows, Removed Columns. Click từng step để xem dữ liệu ở trạng thái đó.','Thứ tự quan trọng. Ví dụ đổi type trước khi cleaning text có thể tạo error; remove cột trước khi bước sau dùng cột đó sẽ làm step fail. Hãy đọc dependency thay vì kéo step ngẫu nhiên.'],
          questions:[
            {q:'Applied Steps giúp?',options:['Xem pipeline transformation theo thứ tự','Tạo password','Tô màu source','In file'],answer:0,explain:'Mỗi step đại diện một phép biến đổi nối tiếp.'},
            {q:'Xóa cột được step sau sử dụng có thể?',options:['Làm step sau lỗi','Không ảnh hưởng','Tự tạo lại cột','Chỉ đổi màu'],answer:0,explain:'Pipeline có dependency giữa các step.'}
          ]
        },
        {
          title:'Data Type: Text, Whole/Decimal, Date và locale',kind:'core',
          why:'Kiểu dữ liệu trong PQ ảnh hưởng filter, calculation, merge và output.',
          body:['Set type đúng cho key, number, date. Mã có số 0 đầu thường nên Text; Revenue Number; Date đúng Date. PQ có thể tự thêm Changed Type nhưng auto-detection không phải luôn đúng.','Change Type Using Locale hữu ích khi chuỗi ngày/số được tạo theo locale khác. Sau type conversion, kiểm tra error count và min/max thay vì chỉ thấy icon type đổi.'],
          questions:[
            {q:'Product_ID 00125 nên thường type?',options:['Text nếu là mã','Decimal luôn','Date','Percentage'],answer:0,explain:'Mã không dùng toán học và cần giữ 0 đầu nên Text phù hợp.'},
            {q:'Sau đổi Date using locale nên kiểm tra?',options:['Error/min-max/date distribution','Logo','Màu header','Zoom'],answer:0,explain:'Conversion có thể đảo ngày/tháng hoặc tạo error; cần control.'}
          ]
        },
        {
          title:'Trim, Clean, Replace, Filter và Remove Columns',kind:'core',
          why:'Những thao tác cleaning thủ công có thể được ghi thành steps để Refresh.',
          body:['Transform → Format hỗ trợ Trim/Clean cho text; Replace Values thay pattern; Filter Rows loại theo điều kiện; Remove Columns giảm dữ liệu không cần.','Chỉ giữ cột cần thiết có thể cải thiện hiệu năng và clarity. Nhưng remove quá sớm cột cần audit hoặc join sẽ làm mất khả năng truy vết.'],
          example:{title:'Quy trình mẫu',text:'Source → Promote Headers → Select Columns → Trim key → Set Types → Filter invalid → Add control columns → Load.'},
          questions:[
            {q:'Trim trong PQ hữu ích với?',options:['Khoảng trắng thừa ở text key','Tính tổng','Vẽ chart','Protect'],answer:0,explain:'Trim chuẩn hóa leading/trailing spaces.'},
            {q:'Remove Columns tốt khi?',options:['Cột thực sự không cần downstream/audit','Chưa biết cột dùng gì','Muốn làm file đẹp','Muốn che lỗi'],answer:0,explain:'Column pruning cần dựa dependency, không xóa mù.'}
          ]
        },
        {
          title:'Close & Load, Connection Only và Refresh',kind:'core',
          why:'Load strategy ảnh hưởng workbook size, downstream và hiệu năng.',
          body:['Close & Load có thể nạp ra Table; Load To có thể chọn Only Create Connection hoặc Data Model tùy tình huống. Staging query thường không cần load ra Sheet nếu chỉ làm nguồn cho query khác.','Refresh chạy lại source và toàn bộ steps. Sau Refresh, kiểm tra source date/file count/row count/errors và output totals. Refresh thành công không chứng minh source đầy đủ.'],
          questions:[
            {q:'Staging query chỉ làm nguồn cho query khác có thể dùng?',options:['Connection Only','Bắt buộc load Table','Chart','Macro'],answer:0,explain:'Connection-only tránh tạo output sheet không cần thiết.'},
            {q:'Refresh không báo lỗi có nghĩa dữ liệu chắc chắn đầy đủ?',options:['Không','Có','Chỉ CSV','Chỉ 365'],answer:0,explain:'Source có thể thiếu file/dòng nhưng query vẫn chạy; cần controls.'}
          ]
        },
        {
          title:'M code và Formula Bar: chỉ cần đọc trước khi viết',kind:'extension',
          why:'UI tạo M code phía sau. Biết nhìn một bước giúp debug mà chưa cần trở thành lập trình viên M.',
          body:['Power Query dùng ngôn ngữ M. Advanced Editor hiển thị let…in và các step. Người mới nên hiểu mỗi step có tên và tham chiếu step trước.','Không cần viết M từ đầu ở bài nền. Khi UI không đủ, học dần các hàm như Table.SelectColumns, Table.TransformColumnTypes, Table.AddColumn và cách giới hạn cột để tăng hiệu năng.'],
          questions:[
            {q:'Ngôn ngữ phía sau Power Query là?',options:['M','DAX','VBA','CSS'],answer:0,explain:'Power Query transformations được biểu diễn bằng M.'},
            {q:'Người mới có cần viết M từ đầu ngay?',options:['Không; hiểu Applied Steps/UI trước','Có bắt buộc','Chỉ nếu file nhỏ','Không bao giờ cần'],answer:0,explain:'UI xây nền tốt; M học thêm khi cần custom/optimization.'}
          ]
        }
      ]
    },
    {
      id:'x22-power-query-multi-source',order:22,zone:'advanced',level:'Nâng cao & Tự động hóa',duration:'120–150 phút',version:'Excel 2016+ Windows · connector tùy edition',
      title:'Power Query nhiều nguồn: Append, Merge và Folder',short:'Append rows, Merge joins, folder combine, staging, schema drift, anti-join và reconciliation.',
      hook:'Đây là bước biến nhiều file/sheet thành một pipeline. Mục tiêu không phải “gộp được”, mà gộp đúng grain, đúng schema và có control.',
      prerequisites:['x21-power-query-basics','s09-lookup','s12-clean-control'],
      outcomes:['Phân biệt Append và Merge','Hiểu join types cơ bản','Combine files from Folder có sample transform','Kiểm soát schema drift, duplicate và row totals'],
      useCases:['Gộp file của 10 người nhập liệu','Nối Sales với Store Master','Combine file tháng từ Folder','Phát hiện mã không match bằng Left Anti'],
      sections:[
        {
          title:'Append = thêm dòng, Merge = thêm cột',kind:'core',
          why:'Nhầm hai khái niệm này là lỗi nền khi bắt đầu nhiều nguồn.',
          body:['Append xếp các bảng có schema tương thích xuống dưới nhau: Jan rows + Feb rows. Merge join hai bảng theo key và thêm thông tin từ bảng kia vào cột: Sales + Store Master.','Trước Append, chuẩn hóa tên/type cột. PQ align theo tên cột, nên cột thiếu hoặc tên khác có thể sinh null/cột mới thay vì “dịch theo vị trí” như người mới tưởng.'],
          questions:[
            {q:'Gộp Jan và Feb cùng cấu trúc theo chiều dọc dùng?',options:['Append','Merge','Pivot','Goal Seek'],answer:0,explain:'Append thêm rows của bảng này vào bảng kia.'},
            {q:'Tra Region từ Store Master vào Sales dùng?',options:['Merge','Append','Sort','Freeze'],answer:0,explain:'Merge join theo key rồi expand cột cần lấy.'}
          ]
        },
        {
          title:'Merge và join types',kind:'core',
          why:'Join type quyết định dòng nào được giữ, nên có tác động trực tiếp đến completeness.',
          body:['Left Outer giữ toàn bộ bảng trái và match từ bảng phải; Inner chỉ giữ dòng có match; Left Anti giữ dòng bên trái không match. Full Outer giữ tất cả hai phía trong các tình huống cần reconcile.','Với enrichment Sales → Master, Left Outer thường an toàn hơn Inner vì bạn không muốn mất giao dịch chỉ vì mã chưa có master. Sau đó kiểm tra null/anti-join để xử lý exception.'],
          warning:'Inner Join có thể làm row count giảm mà query vẫn PASS kỹ thuật. Luôn control số dòng trước/sau join.',
          questions:[
            {q:'Muốn giữ mọi Sales dù Store chưa có Master nên ưu tiên?',options:['Left Outer từ Sales','Inner','Right Anti','Append'],answer:0,explain:'Left Outer giữ toàn bộ bảng trái và cho null nếu không match.'},
            {q:'Left Anti hữu ích để?',options:['Liệt kê key bên trái không match bên phải','Tính Sum','Đổi type','Tạo chart'],answer:0,explain:'Anti join là công cụ exception/reconciliation rất mạnh.'}
          ]
        },
        {
          title:'Merge key, uniqueness và row multiplication',kind:'core',
          why:'Master duplicate có thể nhân dòng Sales sau Merge và làm Revenue tăng gấp đôi.',
          body:['Nếu một key bên trái match 2 dòng bên phải, expand có thể tạo 2 dòng output. Vì vậy trước merge many-to-one, kiểm tra key bên Master unique.','Control row count trước/sau merge và total Revenue. Nếu enrichment đáng lẽ 1:1/many:1, row count không nên tăng chỉ vì join.'],
          questions:[
            {q:'Master có 2 dòng cho Store S001, merge Sales S001 có thể?',options:['Nhân dòng khi expand','Tự chọn đúng một dòng','Xóa Sales','Không ảnh hưởng'],answer:0,explain:'One-to-many match tạo nhiều nested rows và expand sẽ nhân records.'},
            {q:'Control quan trọng sau Merge enrichment?',options:['Row count + key match + total metric','Màu query','Tên file','Zoom'],answer:0,explain:'Các control phát hiện missing và row multiplication.'}
          ]
        },
        {
          title:'Combine Files from Folder',kind:'core',
          why:'Folder connector tự động hóa import nhiều file cùng cấu trúc, nhưng sample file/schema phải được hiểu.',
          body:['From Folder đọc danh sách file và metadata, sau đó Combine tạo sample transform/function để áp cùng logic cho từng file. Bạn cần filter file đúng loại, bỏ temporary files và hiểu “Transform Sample File”.','Schema drift như thiếu cột, đổi tên header, thêm sheet hoặc file khác cấu trúc có thể làm combine lỗi hoặc null. Thiết kế validation cho expected columns và file count.'],
          warning:'Đừng trỏ Folder chứa cả file output/master nếu pattern có thể đọc chính output và gây duplicate vòng lặp.',
          questions:[
            {q:'Combine Folder phù hợp khi?',options:['Nhiều file cùng cấu trúc cần xử lý lặp','Một ô cần IF','Một chart','Một Sheet title'],answer:0,explain:'Folder connector áp một transform cho nhiều files.'},
            {q:'Vì sao nên filter file temporary/output?',options:['Tránh combine file không thuộc source hoặc tự đọc output','Để đẹp','Để đổi font','Không cần'],answer:0,explain:'Folder query đọc mọi file phù hợp filter; file thừa có thể double-count/lỗi schema.'}
          ]
        },
        {
          title:'Staging, Reference và kiến trúc query',kind:'core',
          why:'Query lớn dễ rối nếu mọi transformation nằm một chuỗi dài và load mọi intermediate ra Sheet.',
          body:['Staging query thường chỉ kết nối/chuẩn hóa nguồn; query business reference staging để merge/group. Có thể để Connection Only cho staging.','Reference tạo query mới phụ thuộc output query gốc; Duplicate tạo bản copy logic tại thời điểm đó. Chọn theo dependency mong muốn. Đặt tên như stgSales, dimStore, factSales, rptKPI giúp flow rõ.'],
          questions:[
            {q:'stgSales dùng nội bộ không cần xem trên Sheet nên?',options:['Connection Only','Load 5 bản Table','Screenshot','Chart'],answer:0,explain:'Giảm clutter và có thể giảm overhead output.'},
            {q:'Reference khác Duplicate ở?',options:['Reference phụ thuộc query nguồn, Duplicate là bản copy logic ban đầu','Không khác','Reference chỉ màu','Duplicate xóa source'],answer:0,explain:'Reference tạo dependency, Duplicate tạo query độc lập hơn.'}
          ]
        },
        {
          title:'Schema drift và contract dữ liệu',kind:'core',
          why:'Một người đổi header “Store Code” thành “Store_Code” có thể làm pipeline ngày mai hỏng.',
          body:['Xác định expected columns, types và key. Dùng Table.SelectColumns với MissingField behavior khi phù hợp hoặc custom validation để phát hiện thiếu cột.','Không nên âm thầm bỏ mọi lỗi schema. Với pipeline quan trọng, fail rõ hoặc tạo exception report để Admin biết file nào sai cấu trúc.'],
          questions:[
            {q:'Schema drift là?',options:['Cấu trúc nguồn thay đổi so contract','Màu Table đổi','File lớn','Ngày mới'],answer:0,explain:'Tên/số/type cột hoặc sheet structure thay đổi là schema drift.'},
            {q:'Pipeline quan trọng gặp thiếu cột key nên?',options:['Báo rõ/exception thay vì âm thầm coi như null nếu không có rule','Che mọi lỗi','Xóa file','Đổi font'],answer:0,explain:'Key thiếu ảnh hưởng integrity và cần visibility.'}
          ]
        },
        {
          title:'Hiệu năng và reconciliation nhiều nguồn',kind:'extension',
          why:'Query chạy được nhưng 10 phút mỗi Refresh sẽ khó dùng; tối ưu phải có bằng chứng và control.',
          body:['Giảm cột sớm khi chắc chắn không cần, filter row sớm nếu business scope cho phép, tránh bước lặp nặng và load output thừa. Không tối ưu mù nếu chưa biết bottleneck.','Control cuối: source file count, source row count, output row count, distinct key, total metric, unmatched keys, error rows. Refresh chỉ được coi PASS khi controls phù hợp.'],
          questions:[
            {q:'Cách giảm load hợp lý là?',options:['Select chỉ cột cần dùng khi dependency rõ','Xóa cột ngẫu nhiên','Load mọi staging ra Sheet','Merge mọi nguồn trước'],answer:0,explain:'Column pruning có chủ đích giảm volume và complexity.'},
            {q:'Refresh thành công nhưng file count thiếu 2 có thể coi PASS không?',options:['Không','Có','Chỉ khi Revenue cao','Chỉ nếu chart đẹp'],answer:0,explain:'Technical success không đồng nghĩa source completeness.'}
          ]
        }
      ]
    },
    {
      id:'x23-macro-vba',order:23,zone:'advanced',level:'Nâng cao & Tự động hóa',duration:'120 phút',version:'Excel Desktop · .xlsm · VBA support tùy nền tảng',
      title:'Macro và VBA: tự động hóa thao tác lặp có kiểm soát',short:'Record Macro, .xlsm, Workbook/Worksheet/Range, biến, If/Loop, lỗi và an toàn macro.',
      hook:'Macro phù hợp công việc lặp có quy trình rõ. Nó không thay thế tư duy dữ liệu và không nên được dùng để che một quy trình vốn nên làm bằng Power Query hoặc công thức.',
      prerequisites:['f01-excel-workspace','x21-power-query-basics'],
      outcomes:['Hiểu Macro, VBA và file .xlsm','Record Macro và đọc code cơ bản','Hiểu Workbook/Worksheet/Range object','Biết If/For/For Each và nguyên tắc xử lý lỗi/an toàn'],
      useCases:['Định dạng báo cáo lặp','Xuất nhiều Sheet/PDF theo rule','Refresh và chạy checklist thao tác','Tạo nút cho workflow đã chuẩn hóa'],
      sections:[
        {
          title:'Macro là gì và khi nào nên dùng',kind:'core',
          why:'Không phải việc lặp nào cũng nên viết VBA; chọn đúng công cụ giảm rủi ro.',
          body:['Macro là chuỗi thao tác tự động; VBA là ngôn ngữ dùng để viết logic trong Excel Desktop. Record Macro có thể ghi thao tác thành code để học object/method.','Nếu công việc là import/clean dữ liệu lặp, Power Query thường phù hợp hơn. Nếu là logic tính toán ô, formula có thể tốt hơn. VBA mạnh khi cần điều khiển workbook/UI/files và quy trình thao tác.'],
          questions:[
            {q:'Gộp/clean 100 file cùng schema mỗi ngày nên nghĩ trước tới?',options:['Power Query','VBA bắt buộc','Merge Cells','Format Painter'],answer:0,explain:'PQ được thiết kế cho ETL; VBA chỉ cần nếu workflow có nhu cầu đặc thù ngoài PQ.'},
            {q:'VBA phù hợp với?',options:['Tự động hóa thao tác/workbook workflow có quy trình rõ','Mọi bài toán không cần suy nghĩ','Chỉ chart','Chỉ text'],answer:0,explain:'Automation hiệu quả khi process đã được định nghĩa.'}
          ]
        },
        {
          title:'Record Macro và Relative/Absolute recording',kind:'core',
          why:'Recorder là cách nhìn Excel thao tác thành code, nhưng code ghi ra thường cần làm sạch.',
          body:['Record Macro ghi actions như Select, Format, Copy. Absolute recording ghi địa chỉ cụ thể; Use Relative References ghi thao tác tương đối với vị trí hiện tại trong những trường hợp hỗ trợ.','Recorder thường tạo nhiều Select/Activate thừa. Khi chỉnh code, bạn có thể thao tác object trực tiếp để code rõ và nhanh hơn.'],
          warning:'Đừng record thao tác trên file thật quan trọng rồi chạy lại khi chưa hiểu code. Macro có thể sửa/xóa dữ liệu mà Undo không luôn cứu được.',
          questions:[
            {q:'Record Macro có tạo code tối ưu sẵn không?',options:['Không; thường có Select/Activate thừa','Có luôn','Chỉ 365','Không tạo code'],answer:0,explain:'Recorder ghi thao tác gần giống người dùng, không tối ưu kiến trúc.'},
            {q:'Tại sao test Macro trên copy?',options:['Macro có thể thay đổi dữ liệu và Undo hạn chế','Vì màu','Vì font','Không cần'],answer:0,explain:'Automation có blast radius lớn; copy là safety layer.'}
          ]
        },
        {
          title:'Workbook, Worksheet, Range và object model',kind:'core',
          why:'VBA điều khiển object; hiểu hierarchy giúp tránh ActiveSheet/Selection mơ hồ.',
          body:['Application chứa Workbooks; Workbook chứa Worksheets; Worksheet chứa Range/Cells. Tham chiếu rõ như ThisWorkbook.Worksheets("Data").Range("A1") đáng tin hơn Selection khi macro chạy trong context khác.','ThisWorkbook là workbook chứa code; ActiveWorkbook là workbook đang active và có thể khác. Sai khái niệm này dễ làm macro sửa nhầm file.'],
          questions:[
            {q:'ThisWorkbook thường là?',options:['Workbook chứa VBA code','Workbook bất kỳ đang active','Sheet hiện tại','Range hiện tại'],answer:0,explain:'ThisWorkbook gắn với project chứa code.'},
            {q:'Vì sao hạn chế ActiveSheet khi có thể?',options:['Context có thể thay đổi và macro tác động nhầm sheet','ActiveSheet luôn lỗi','Không có property này','Chỉ để in'],answer:0,explain:'Explicit object reference an toàn và dễ audit hơn state phụ thuộc UI.'}
          ]
        },
        {
          title:'Biến, If và Loop cơ bản',kind:'core',
          why:'Automation cần lưu giá trị, ra quyết định và lặp trên danh sách.',
          body:['Dim khai báo biến; If...Then...Else điều khiển nhánh; For/For Each lặp. Option Explicit giúp bắt lỗi tên biến chưa khai báo và nên bật cho code nghiêm túc.','Không loop từng cell nếu có cách xử lý range/array nhanh hơn trên dữ liệu lớn. Đầu tiên viết đúng, sau đó đo hiệu năng trước tối ưu.'],
          example:{title:'Ví dụ ý tưởng',text:'For Each ws In ThisWorkbook.Worksheets → nếu tên bắt đầu “Report_” thì export PDF.'},
          questions:[
            {q:'Option Explicit giúp?',options:['Yêu cầu khai báo biến, giảm lỗi typo','Tạo chart','Save file','Clean text'],answer:0,explain:'Nó làm VBA báo biến chưa khai báo thay vì âm thầm tạo Variant mới.'},
            {q:'For Each phù hợp khi?',options:['Lặp qua collection như Worksheets','Chỉ tính SUM','Đổi Number Format bằng tay','Pivot'],answer:0,explain:'For Each duyệt từng object trong collection.'}
          ]
        },
        {
          title:'Error handling và trạng thái Excel',kind:'core',
          why:'Macro lỗi giữa chừng có thể để ScreenUpdating/Calculation/Event ở trạng thái bất thường.',
          body:['On Error cần dùng có chủ đích. Pattern tốt là có cleanup block để phục hồi Application.ScreenUpdating, EnableEvents, Calculation nếu code đã thay.','On Error Resume Next dùng bừa sẽ che lỗi giống IFERROR bừa trong formula. Giới hạn phạm vi, kiểm tra Err và trả trạng thái rõ.'],
          warning:'Luôn phục hồi state trong nhánh lỗi. Macro “chạy nhanh” nhưng để Calculation Manual sau khi lỗi có thể khiến workbook sau đó hiển thị số cũ.',
          questions:[
            {q:'On Error Resume Next nên?',options:['Dùng giới hạn và kiểm tra lỗi','Đặt đầu mọi macro để che lỗi','Không bao giờ cần','Dùng thay IF'],answer:0,explain:'Nó có use case nhưng rất dễ che exception nếu dùng rộng.'},
            {q:'Nếu macro set Calculation Manual, cleanup nên?',options:['Khôi phục state mong muốn','Để Manual mãi','Xóa workbook','Đổi theme'],answer:0,explain:'Macro cần trả Excel về trạng thái an toàn sau success/error.'}
          ]
        },
        {
          title:'Macro security, signed code và .xlsm',kind:'core',
          why:'Macro có thể chạy code, nên người dùng cần biết nguồn file và policy bảo mật.',
          body:['Workbook có VBA thường lưu .xlsm. Excel có Trust Center và cảnh báo macro. Không khuyến khích người học “Enable Content” cho file không rõ nguồn chỉ để hết cảnh báo.','Trong tổ chức, signed macro/trusted location/policy có thể được quản lý bởi IT. Khi bàn giao, ghi rõ macro làm gì, input/output và yêu cầu permission.'],
          questions:[
            {q:'File chứa VBA thường cần định dạng?',options:['.xlsm','.jpg','.csv luôn','.txt'],answer:0,explain:'.xlsm hỗ trợ macro; .xlsx không lưu VBA project.'},
            {q:'Nhận file macro không rõ nguồn nên?',options:['Không vội Enable; xác minh nguồn/policy','Enable ngay','Upload password','Xóa antivirus'],answer:0,explain:'Macro có thể thực thi code nên cần trust decision.'}
          ]
        },
        {
          title:'Từ Macro cá nhân tới automation có thể bàn giao',kind:'extension',
          why:'Automation tốt cần config, log trạng thái và test, không chỉ “chạy được trên máy tôi”.',
          body:['Tách đường dẫn/Sheet name/parameter ra Config khi thay đổi thường xuyên. Kiểm tra file tồn tại, input schema, output path và trạng thái success/fail.','Với quy trình quan trọng, tạo dry-run/test sample, backup và message rõ. Nếu workflow bắt đầu cần scheduler, nhiều người dùng hoặc hệ thống ngoài Excel, cân nhắc công cụ phù hợp hơn VBA.'],
          questions:[
            {q:'Path thay đổi theo người dùng nên?',options:['Đưa vào Config/resolver thay vì hardcode username','Hardcode C:\Users\Tuan','Ẩn code','Merge'],answer:0,explain:'Config giảm phụ thuộc máy cá nhân.'},
            {q:'Workflow cần chạy server-side cho nhiều user có nhất thiết VBA là tốt nhất?',options:['Không; cần đánh giá platform khác','Có luôn','Chỉ .xlsm','Chỉ Windows'],answer:0,explain:'VBA desktop không phải orchestration/server platform.'}
          ]
        }
      ]
    },
    {
      id:'x24-automation-workflow',order:24,zone:'advanced',level:'Nâng cao & Tự động hóa',duration:'120 phút',version:'Tổng hợp · công cụ tùy phiên bản',
      title:'Thiết kế workflow Excel tự động hóa có kiểm soát',short:'Chọn Formula/Pivot/PQ/VBA/Data Model đúng vai trò, controls, refresh order, exception và handover.',
      hook:'Bài cuối không dạy thêm một nút. Bạn học cách ghép các công cụ đã học thành một hệ thống Excel có thể chạy lại, kiểm tra và bàn giao.',
      prerequisites:['x21-power-query-basics','x22-power-query-multi-source','x23-macro-vba','a18-report-audit-handover'],
      outcomes:['Chọn đúng công cụ theo loại công việc','Thiết kế flow Source → Staging → Model → Report → Control','Xây refresh/checkpoint finite thay vì audit vòng lặp','Biết khi nào Excel cần Data Model/DAX hoặc công cụ ngoài Excel'],
      useCases:['Master data + nhiều file nhập → dashboard','KPI report refresh định kỳ','QC/Sales workflow có exception','Template một Admin vận hành cho nhiều người'],
      sections:[
        {
          title:'Chọn công cụ theo bài toán',kind:'core',
          why:'Dùng sai công cụ tạo workbook khó bảo trì dù từng bước riêng lẻ “chạy”.',
          body:['Formula phù hợp tính toán tương tác theo ô; Table cho tabular source; Pivot cho aggregation nhanh; Power Query cho import/transform/append/merge lặp; Data Model/DAX cho relationship/measure; VBA cho orchestration/UI/file actions.','Một bài toán có thể dùng nhiều lớp. Ví dụ PQ clean/append, Pivot/Data Model aggregate, dashboard visualize, VBA chỉ làm nút Refresh/Export nếu thật sự cần.'],
          questions:[
            {q:'Gộp 50 file cùng schema định kỳ nên ưu tiên lớp nào?',options:['Power Query','Merge Cells','IF lồng','Chart'],answer:0,explain:'ETL lặp nhiều file là use case tự nhiên của PQ.'},
            {q:'Tính =Qty*Price theo dòng tương tác nên thường?',options:['Formula/Table calculated column','VBA bắt buộc','Power Query luôn','Solver'],answer:0,explain:'Logic row-level đơn giản trong sheet phù hợp formula.'}
          ]
        },
        {
          title:'Kiến trúc Source → Staging → Model → Report → Control',kind:'core',
          why:'Tách lớp giúp biết lỗi nằm ở đâu và tránh dashboard trực tiếp đọc file hỗn loạn.',
          body:['Source là dữ liệu đầu vào; Staging chuẩn hóa schema/type; Model tạo grain, relationship, metric; Report trình bày; Control kiểm tra integrity.','Không phải workbook nào cũng cần đủ 5 Sheet/layer vật lý, nhưng tư duy layer giúp tránh mixing: người dùng sửa source ngay trong dashboard hoặc calculation lẫn input.'],
          questions:[
            {q:'Layer nào nên chịu trách nhiệm kiểm tra row count/total?',options:['Control (có thể lấy dữ liệu từ các layer)','Chỉ Report','Chỉ source filename','Theme'],answer:0,explain:'Control là nơi tổng hợp bằng chứng integrity xuyên pipeline.'},
            {q:'Staging chủ yếu làm?',options:['Chuẩn hóa source trước model','Trang trí dashboard','In file','Macro security'],answer:0,explain:'Staging là lớp ingest/standardize, giảm complexity downstream.'}
          ]
        },
        {
          title:'Refresh order và dependency',kind:'core',
          why:'Output phải chạy sau input/dependency; refresh sai thứ tự có thể dùng dữ liệu cũ.',
          body:['Power Query có dependency graph; Pivot/Data Model refresh sau source/query. VBA orchestration nếu có cần đợi refresh hoàn thành trước export. Không chỉ gọi RefreshAll rồi lập tức Save PDF nếu connection còn chạy async.','Thiết kế trạng thái: Source OK → Query OK → Model Control PASS → Report ready → Export. Khi step fail, dừng downstream thay vì xuất báo cáo sai.'],
          questions:[
            {q:'Vì sao RefreshAll rồi export ngay có thể rủi ro?',options:['Một số connection có thể chưa hoàn thành','Refresh luôn xóa dữ liệu','Chart đổi màu','Không có'],answer:0,explain:'Asynchronous refresh/dependency cần hoàn thành trước output.'},
            {q:'Model Control FAIL nên workflow?',options:['Dừng/flag và không publish output như PASS','Export bình thường','Che status','Xóa control'],answer:0,explain:'Checkpoint ngăn dữ liệu lỗi đi tiếp.'}
          ]
        },
        {
          title:'Controls, exception và FINISH LINE hữu hạn',kind:'core',
          why:'Audit vòng lặp làm tốn thời gian; checkpoint đã PASS nên được khóa trừ khi có thay đổi liên quan.',
          body:['Mỗi layer có vài control có ý nghĩa: file count, row count, schema, key uniqueness, unmatched, total reconciliation, date range. Khi PASS và input/logic không đổi, coi checkpoint locked.','Exception cần output riêng với reason/action, không làm toàn workflow fail nếu nghiệp vụ cho phép xử lý ngoại lệ. Chỉ reopen checkpoint khi có dữ liệu mới, code/query thay đổi hoặc bằng chứng lỗi.'],
          questions:[
            {q:'Checkpoint đã PASS, không có input/code mới thì?',options:['Giữ locked, không audit lặp vô hạn','Kiểm tra lại mọi vòng','Xóa bằng chứng','Hardcode kết quả'],answer:0,explain:'Finite finish line giúp workflow hiệu quả và nhất quán.'},
            {q:'Unmatched master được phép review sau nên?',options:['Tách exception list + reason/status','Xóa tất cả dòng','Che null','Bỏ control'],answer:0,explain:'Exception workflow giữ data visibility và khả năng xử lý.'}
          ]
        },
        {
          title:'Config, parameter và portability',kind:'core',
          why:'Automation phụ thuộc đường dẫn/tên Sheet hardcode sẽ dễ vỡ khi đổi máy hoặc kỳ báo cáo.',
          body:['Tách parameter như SourceFolder, ReportMonth, threshold, target vào Config/Table/Named Range khi người dùng cần thay. Power Query parameter hoặc VBA đọc Config có thể dùng tùy kiến trúc.','Không biến Config thành nơi người dùng sửa mọi thứ. Chỉ expose parameter thực sự cần đổi và validate giá trị.'],
          questions:[
            {q:'ReportMonth đổi mỗi kỳ nên?',options:['Đặt parameter/config rõ thay vì sửa 20 công thức','Hardcode ở mọi Sheet','Tên file ngẫu nhiên','Merge'],answer:0,explain:'Single configuration point giảm lỗi và tăng repeatability.'},
            {q:'Config tốt nên?',options:['Chỉ expose input cần thiết và có validation','Cho sửa mọi internal name','Không có label','Dùng màu thay giá trị'],answer:0,explain:'Controlled parameters giúp người dùng không phá implementation.'}
          ]
        },
        {
          title:'Data Model/DAX và lúc workbook bắt đầu lớn',kind:'extension',version:'Power Pivot/Data Model tùy edition/OS',
          why:'Nhiều fact/dimension và KPI theo filter context có thể phù hợp Data Model hơn mạng VLOOKUP/helper.',
          body:['Star schema thường có Fact ở grain giao dịch và Dimensions như Date, Store, Product. Relationships thay việc copy mọi thuộc tính vào fact. DAX Measures tính theo filter context và phục vụ Pivot/Dashboard.','Không chuyển sang DAX chỉ vì “nâng cao”. Nếu dữ liệu nhỏ và formula/Pivot rõ, giải pháp đơn giản có thể tốt hơn. Học Data Model sau khi hiểu grain/keys/KPI sẽ dễ hơn rất nhiều.'],
          questions:[
            {q:'Star schema thường có?',options:['Fact + Dimension tables','Chỉ một merged Sheet','Chỉ VBA','Chỉ chart'],answer:0,explain:'Fact chứa events/metrics; dimensions cung cấp attributes để filter/group.'},
            {q:'Khi nào DAX có lợi?',options:['Nhiều bảng relationship và measure theo filter context','Đổi font','Nhập một mã','Freeze Pane'],answer:0,explain:'Data Model/DAX được thiết kế cho analytics model.'}
          ]
        },
        {
          title:'Khi nào nên ra khỏi Excel',kind:'extension',
          why:'Chuyên nghiệp cũng là biết giới hạn của công cụ.',
          body:['Nếu dữ liệu vượt khả năng workbook, cần multi-user concurrent write, audit log hệ thống, security phức tạp, scheduler/server automation hoặc transaction consistency, có thể cần database/BI/app thay vì cố nhồi Excel.','Excel vẫn rất mạnh như analysis/front-end/rapid prototyping. Hãy dùng nó ở nơi nó tạo giá trị, và kết nối hệ thống khác khi yêu cầu vượt phạm vi.'],
          questions:[
            {q:'Nhu cầu nhiều người cùng ghi transaction có quyền/audit chặt nên?',options:['Cân nhắc database/app thay vì chỉ Excel file','Chia sẻ một .xlsx không kiểm soát','Merge Cells','Macro password'],answer:0,explain:'Concurrent transactional systems cần controls mà workbook không được thiết kế để cung cấp đầy đủ.'},
            {q:'Biết giới hạn Excel có phải kỹ năng nâng cao?',options:['Có','Không','Chỉ IT','Chỉ Mac'],answer:0,explain:'Chọn đúng platform là một phần của thiết kế giải pháp.'}
          ]
        },
        {
          title:'Checklist workflow hoàn chỉnh',kind:'core',
          why:'Bài cuối cần một checklist có thể áp vào project thật.',
          body:['1) Xác định grain/source/owner. 2) Chuẩn hóa schema/type. 3) Xây transformation có dependency rõ. 4) Định nghĩa KPI. 5) Tạo controls. 6) Tạo report. 7) Test happy path + exception. 8) Document input/refresh/handover. 9) Lock checkpoint PASS.','Khi thay đổi, ghi rõ change impact: step nào bị ảnh hưởng, control nào cần reopen. Tránh “sửa một nút” rồi audit lại toàn hệ thống nếu không có dependency.'],
          questions:[
            {q:'Sau thay đổi chỉ ở chart color, có cần reopen query reconciliation nếu logic/source không đổi?',options:['Không mặc định','Có, luôn audit từ đầu','Xóa query','Refresh database 10 lần'],answer:0,explain:'Chỉ reopen checkpoint có dependency bị tác động.'},
            {q:'Một workflow được coi bàn giao tốt khi?',options:['Người khác biết input, refresh, controls, output và exception','Chỉ tác giả chạy được','Không có hướng dẫn','Không có control'],answer:0,explain:'Repeatability và operability là tiêu chí quan trọng.'}
          ]
        }
      ]
    }
  ];
  window.AVPKnowledgeLessons = (window.AVPKnowledgeLessons || []).concat(lessons);
})();
