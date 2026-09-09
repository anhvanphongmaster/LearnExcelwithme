(() => {
  'use strict';
  const lessons = [
    {
      id:'s07-logic',order:7,zone:'skills',level:'Dữ liệu & Công thức',duration:'60–75 phút',version:'Excel 2016+',
      title:'Logic với IF, AND, OR và xử lý lỗi',short:'TRUE/FALSE, điều kiện, IF nhiều nhánh, AND/OR và IFERROR.',
      hook:'Phần lớn quy tắc công việc đều có dạng “nếu… thì…”. Hiểu logic TRUE/FALSE giúp bạn chuyển quy định nghiệp vụ thành công thức thay vì chỉ copy IF từ mạng.',
      prerequisites:['f04-formulas-references','f05-core-functions'],
      outcomes:['Hiểu biểu thức TRUE/FALSE và toán tử so sánh','Viết IF một điều kiện và nhiều nhánh vừa phải','Kết hợp AND/OR để kiểm tra nhiều điều kiện','Dùng IFERROR đúng chỗ mà không che lỗi dữ liệu'],
      useCases:['Phân loại Đạt/Không đạt theo target','Gắn cảnh báo khi doanh thu thấp và tồn kho cao','Kiểm tra hồ sơ đủ nhiều điều kiện','Hiển thị thông báo thân thiện khi lookup không tìm thấy'],
      sections:[
        {
          title:'TRUE/FALSE và toán tử so sánh',kind:'core',
          why:'IF chỉ có ý nghĩa khi bạn hiểu điều kiện được Excel đánh giá như thế nào.',
          body:['Biểu thức như A2>100, B2="OK" hoặc C2<>"Closed" trả về TRUE hoặc FALSE. Các toán tử chính gồm =, >, <, >=, <= và <>. Text trong điều kiện thường đặt trong dấu nháy kép.','Trước khi viết IF, hãy thử riêng biểu thức logic trong một ô. Nếu =D2>=10000000 trả đúng TRUE/FALSE mong đợi, phần điều kiện của IF đã dễ kiểm tra hơn.'],
          example:{title:'Ví dụ',formula:'=D2>=10000000',text:'Trả TRUE khi giá trị D2 từ 10 triệu trở lên, FALSE nếu thấp hơn.'},
          questions:[
            {q:'Biểu thức =A2<>"NG" có nghĩa là?',options:['A2 bằng NG','A2 không bằng NG','A2 lớn hơn NG','A2 trống'],answer:1,explain:'<> là toán tử không bằng. Dấu nháy kép bao quanh giá trị Text cần so sánh.'},
            {q:'Trước khi lồng điều kiện vào IF, cách kiểm tra tốt là?',options:['Thử biểu thức logic riêng xem TRUE/FALSE','Đổi màu ô','Merge vùng','Ẩn cột'],answer:0,explain:'Tách điều kiện giúp xác nhận logic trước khi thêm nhánh kết quả, dễ debug hơn.'}
          ]
        },
        {
          title:'IF một điều kiện',kind:'core',
          why:'IF biến kết quả TRUE/FALSE thành thông báo hoặc giá trị có ý nghĩa nghiệp vụ.',
          body:['Cú pháp cơ bản: IF(logical_test, value_if_true, value_if_false). Hãy đọc thành câu: nếu điều kiện đúng thì trả gì, nếu sai thì trả gì.','Ví dụ =IF(E2>=0.95,"Đạt","Chưa đạt"). Điều kiện là E2>=0.95, kết quả đúng là “Đạt”, sai là “Chưa đạt”. Nếu E2 là tỷ lệ, cần chắc nó được lưu đúng kiểu Number chứ không phải Text.'],
          example:{title:'Ví dụ công việc',formula:'=IF(D2>=10000000,"Đạt target","Chưa đạt")',text:'Dùng cho từng cửa hàng khi target tối thiểu là 10 triệu.'},
          questions:[
            {q:'Trong IF, đối số thứ hai là gì?',options:['Kết quả khi điều kiện TRUE','Tên Sheet','Kết quả khi FALSE luôn luôn','Vùng Sort'],answer:0,explain:'Cấu trúc IF là điều kiện, kết quả nếu TRUE, kết quả nếu FALSE.'},
            {q:'=IF(A2>0,"Có","Không") khi A2=0 trả?',options:['Có','Không','TRUE','#N/A'],answer:1,explain:'0 không lớn hơn 0 nên điều kiện FALSE và IF trả nhánh “Không”. Nếu muốn 0 cũng là Có phải dùng >=0.'}
          ]
        },
        {
          title:'AND và OR cho nhiều điều kiện',kind:'core',
          why:'Quy tắc thực tế thường cần nhiều điều kiện cùng lúc hoặc chỉ cần một trong nhiều điều kiện.',
          body:['AND trả TRUE khi tất cả điều kiện đều TRUE. OR trả TRUE khi ít nhất một điều kiện TRUE. Thường bạn đặt AND/OR bên trong IF để trả nhãn nghiệp vụ.','Ví dụ =IF(AND(B2>=10000000,C2="Đạt"),"Thưởng","Chưa đủ") yêu cầu cả doanh thu và chất lượng cùng đạt. Với OR, chỉ một điều kiện cảnh báo đúng đã đủ kích hoạt trạng thái.'],
          example:{title:'Ví dụ cảnh báo',formula:'=IF(OR(D2<0,E2>0.05),"Cảnh báo","OK")',text:'Cảnh báo nếu tồn kho âm hoặc tỷ lệ lỗi vượt 5%.'},
          questions:[
            {q:'AND(A2>0,B2="OK") chỉ TRUE khi?',options:['Ít nhất một điều kiện đúng','Cả hai điều kiện đúng','Cả hai sai','A2 là Text'],answer:1,explain:'AND yêu cầu tất cả điều kiện thành phần TRUE.'},
            {q:'Muốn cảnh báo nếu NG Rate >5% HOẶC Revenue < target dùng?',options:['AND','OR','SUM','LEFT'],answer:1,explain:'Chỉ cần một trong hai điều kiện để cảnh báo nên OR phù hợp.'}
          ]
        },
        {
          title:'Nhiều nhánh: IF lồng và cách tránh công thức rối',kind:'core',
          why:'IF lồng có thể xử lý phân loại nhiều mức nhưng rất nhanh trở nên khó đọc.',
          body:['Ví dụ phân loại điểm: >=90 A, >=80 B, còn lại C có thể dùng IF lồng. Thứ tự điều kiện rất quan trọng; thường xét từ ngưỡng cao xuống thấp để tránh bắt nhầm nhánh.','Nếu có nhiều mức cố định, cân nhắc bảng mapping + lookup thay vì IF lồng 7–10 lớp. Công thức dễ audit quan trọng hơn việc nhét mọi thứ vào một ô.'],
          warning:'IF lồng quá sâu dễ sai dấu ngoặc và khó sửa khi quy tắc thay đổi. Khi quy tắc là dữ liệu (ngưỡng, nhóm), đưa nó ra bảng cấu hình thường tốt hơn.',
          questions:[
            {q:'Phân loại >=90 A, >=80 B nên kiểm tra ngưỡng nào trước?',options:['>=80','>=90','Bằng 0','Không quan trọng'],answer:1,explain:'Nếu kiểm tra >=80 trước thì giá trị 95 đã thỏa và có thể bị gán B. Xét ngưỡng cao trước tránh bắt nhầm.'},
            {q:'Khi có 10 mức phân loại hay thay đổi, giải pháp nào dễ bảo trì hơn?',options:['IF lồng 10 lớp','Bảng mapping + lookup','Tô màu thủ công','Merge'],answer:1,explain:'Bảng cấu hình tách quy tắc khỏi công thức, dễ cập nhật và kiểm tra hơn IF lồng dài.'}
          ]
        },
        {
          title:'IFERROR: xử lý lỗi có chủ đích',kind:'core',
          why:'IFERROR làm giao diện sạch hơn nhưng nếu dùng bừa có thể che mất lỗi cần sửa.',
          body:['IFERROR(value, value_if_error) trả kết quả thay thế khi biểu thức gặp lỗi như #N/A, #DIV/0!, #VALUE!… Ví dụ lookup không tìm thấy có thể hiển thị “Không có mã”.','Đừng bọc mọi công thức bằng IFERROR("",…). Nếu lỗi do dữ liệu hoặc công thức sai, việc biến nó thành ô trống khiến audit khó hơn. Chỉ dùng khi bạn hiểu lỗi dự kiến và cách xử lý nghiệp vụ.'],
          example:{title:'Ví dụ',formula:'=IFERROR(A2/B2,0)',text:'Chỉ hợp lý nếu nghiệp vụ xác định B2=0 thì tỷ lệ muốn hiển thị 0. Nếu B2=0 là lỗi dữ liệu, nên cảnh báo thay vì che.'},
          questions:[
            {q:'Rủi ro của IFERROR("",...) dùng khắp nơi là?',options:['Làm font lớn','Che lỗi thật thành ô trống','Tạo thêm Sheet','Bật Macro'],answer:1,explain:'Khi mọi lỗi bị thay bằng chuỗi rỗng, người kiểm tra khó biết dữ liệu/công thức đang có vấn đề.'},
            {q:'IFERROR phù hợp nhất khi?',options:['Bạn biết lỗi dự kiến và có quy tắc xử lý rõ','Bạn không hiểu công thức','Muốn che mọi lỗi','Muốn Sort'],answer:0,explain:'Xử lý lỗi phải có chủ đích. Nếu chưa biết nguyên nhân, nên điều tra thay vì che.'}
          ]
        },
        {
          title:'Logic có thể kiểm tra và bàn giao',kind:'extension',
          why:'Một công thức đúng hôm nay vẫn cần người khác hiểu được ngày mai.',
          body:['Đặt tên cột rõ như Eligibility_Status thay vì Result1; tách helper nếu công thức quá dài; lưu ngưỡng ở Config khi nghiệp vụ thay đổi thường xuyên.','Khi test logic, tạo các trường hợp biên: đúng ngưỡng, thấp hơn một chút, cao hơn một chút, blank, zero và lỗi. Đây là cách phát hiện điều kiện > với >= hoặc AND với OR bị dùng nhầm.'],
          questions:[
            {q:'Muốn kiểm tra điều kiện >=100, case test nào quan trọng?',options:['99, 100, 101','Chỉ 500','Chỉ ô màu đỏ','Chỉ Text “ABC”'],answer:0,explain:'Các điểm sát ngưỡng giúp xác nhận toán tử >= hoạt động đúng ở boundary.'},
            {q:'Ngưỡng target thay đổi hàng tháng nên đặt ở đâu dễ quản lý?',options:['Hardcode trong hàng nghìn IF','Bảng Config/tham chiếu rõ','Tên file','Màu nền'],answer:1,explain:'Tách config giúp cập nhật một nơi, giảm lỗi sửa hàng loạt công thức.'}
          ]
        }
      ]
    },
    {
      id:'s08-conditional-aggregation',order:8,zone:'skills',level:'Dữ liệu & Công thức',duration:'75–90 phút',version:'Excel 2016+',
      title:'SUMIF/SUMIFS, COUNTIF/COUNTIFS và tiêu chí',short:'Tổng/đếm/trung bình theo điều kiện, criteria, date range và lỗi lệch vùng.',
      hook:'Khi câu hỏi có dạng “bao nhiêu/tổng bao nhiêu nhưng chỉ với những dòng thỏa điều kiện…”, đây là nhóm hàm bạn sẽ dùng hàng ngày.',
      prerequisites:['f04-formulas-references','f05-core-functions','s07-logic'],
      outcomes:['Phân biệt IF với IF(S) aggregation','Viết SUMIF/SUMIFS và COUNTIF/COUNTIFS','Dùng tiêu chí text, số, toán tử và ngày','Tránh lỗi sum_range/criteria_range lệch kích thước'],
      useCases:['Tổng doanh thu theo cửa hàng/tháng','Đếm số đơn NG theo model','Tính trung bình theo ca','Tạo KPI theo bộ lọc cố định bằng công thức'],
      sections:[
        {
          title:'Từ câu hỏi nghiệp vụ đến sum_range và criteria_range',kind:'core',
          why:'Sai phổ biến nhất không phải cú pháp mà là chọn nhầm cột cần cộng và cột cần xét điều kiện.',
          body:['SUMIF/SUMIFS có hai vai trò: vùng cần cộng (sum_range) và vùng dùng để kiểm tra điều kiện (criteria_range). Hãy nói rõ câu hỏi: “cộng Revenue ở cột H cho những dòng Store ở D bằng S001”.','COUNTIF/COUNTIFS không có sum_range vì mục tiêu là đếm dòng/ô thỏa điều kiện. AVERAGEIF(S) tương tự nhưng tính trung bình vùng được chỉ định.'],
          questions:[
            {q:'Câu “tổng Revenue của Store S001” thì sum_range nên là?',options:['Cột Store','Cột Revenue','Cột ngày luôn luôn','Tiêu đề'],answer:1,explain:'Revenue là đại lượng cần cộng; Store là criteria_range dùng để lọc điều kiện.'},
            {q:'COUNTIFS cần sum_range không?',options:['Có, luôn luôn','Không, vì hàm đếm bản thân các dòng thỏa điều kiện','Chỉ trên 365','Chỉ khi Text'],answer:1,explain:'COUNTIFS đếm theo criteria_range/criteria; không cộng một vùng số riêng.'}
          ]
        },
        {
          title:'SUMIF và COUNTIF với một điều kiện',kind:'core',
          why:'Một điều kiện là bước đơn giản trước khi chuyển sang nhiều criteria.',
          body:['SUMIF(range, criteria, sum_range) dùng một điều kiện. COUNTIF(range, criteria) đếm một điều kiện. Criteria Text đặt trong dấu nháy, ví dụ "NG"; số có thể nhập trực tiếp; toán tử ghép trong chuỗi như ">100".','Khi tiêu chí nằm trong một ô, có thể tham chiếu ô đó. Ví dụ COUNTIF(E:E,H2) đếm theo trạng thái tại H2, giúp thay tiêu chí mà không sửa công thức.'],
          example:{title:'Ví dụ',formula:'=SUMIF(D2:D100,"S001",H2:H100)',text:'Cộng H2:H100 tại các dòng D2:D100 bằng S001.'},
          questions:[
            {q:'=COUNTIF(E2:E100,"NG") trả gì?',options:['Tổng giá trị NG','Số ô trong vùng bằng NG','Giá trị lớn nhất','Tên Sheet'],answer:1,explain:'COUNTIF đếm số ô thỏa một criteria, không cộng giá trị.'},
            {q:'Muốn tiêu chí thay đổi theo ô H2, cách nào linh hoạt?',options:['Gõ "S001" cố định','Dùng H2 làm criteria','Đổi màu công thức','Merge H2'],answer:1,explain:'Tham chiếu ô tiêu chí cho phép thay giá trị H2 mà công thức tự cập nhật.'}
          ]
        },
        {
          title:'SUMIFS và COUNTIFS với nhiều điều kiện',kind:'core',
          why:'Báo cáo thực tế thường lọc đồng thời Store, thời gian, trạng thái hoặc nhân viên.',
          body:['SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2, …). Lưu ý thứ tự khác SUMIF: SUMIFS đặt sum_range trước. COUNTIFS chỉ gồm các cặp range/criteria.','Các criteria_range nên cùng kích thước và tương ứng cùng dòng. Nếu một vùng D2:D100 nhưng vùng khác E2:E99, kết quả có thể lỗi hoặc logic không đáng tin.'],
          example:{title:'Ví dụ',formula:'=SUMIFS(H2:H100,D2:D100,"S001",E2:E100,"OK")',text:'Tổng Revenue của Store S001 và Status OK.'},
          warning:'Đừng dùng cả cột một cách máy móc trong hàng trăm SUMIFS trên file lớn nếu hiệu năng bắt đầu chậm. Table hoặc vùng giới hạn rõ thường dễ quản lý hơn.',
          questions:[
            {q:'SUMIFS khác SUMIF ở điểm cú pháp quan trọng nào?',options:['SUMIFS đặt sum_range đầu tiên','SUMIFS không có điều kiện','SUMIF chỉ dùng Text','Không khác'],answer:0,explain:'SUMIFS bắt đầu bằng sum_range rồi các cặp criteria_range/criteria; SUMIF có thứ tự range, criteria, sum_range.'},
            {q:'Criteria ranges trong SUMIFS nên?',options:['Có kích thước tương ứng nhau','Tùy ý dài ngắn','Chỉ một ô','Luôn là Text'],answer:0,explain:'Các vùng phải map cùng các dòng để nhiều điều kiện áp lên cùng bản ghi.'}
          ]
        },
        {
          title:'Criteria với toán tử, wildcard và blank',kind:'core',
          why:'Nhiều lỗi đến từ cách viết điều kiện chứ không phải hàm.',
          body:['Toán tử trong criteria thường viết trong chuỗi như ">=100". Nếu ghép toán tử với ô, dùng ">="&H2. Wildcard * đại diện nhiều ký tự, ? đại diện một ký tự trong các hàm hỗ trợ criteria text.','Criteria blank cần hiểu dữ liệu: "" có thể khác ô trống thật. Khi kiểm soát blank quan trọng, kết hợp kiểm tra kiểu dữ liệu và logic nguồn thay vì chỉ dựa vào hình thức.'],
          example:{title:'Ví dụ',formula:'=COUNTIF(A2:A100,"SP*")',text:'Đếm chuỗi bắt đầu bằng SP trong các hàm criteria hỗ trợ wildcard.'},
          questions:[
            {q:'Muốn COUNTIF >= giá trị trong H2, criteria nên viết?',options:['">="&H2','">=H2"','H2>=','SUM(H2)'],answer:0,explain:'Toán tử là text và cần nối với giá trị ô bằng &. ">=H2" sẽ tìm theo chuỗi, không đọc H2 như tham chiếu.'},
            {q:'Wildcard * thường đại diện?',options:['Một hoặc nhiều ký tự','Chỉ số 0','Tên Sheet','Ngày hiện tại'],answer:0,explain:'* khớp một chuỗi ký tự có độ dài linh hoạt; ? thường khớp một ký tự.'}
          ]
        },
        {
          title:'Điều kiện ngày và khoảng thời gian',kind:'core',
          why:'KPI theo tháng/ngày cần dùng Date thật và biên thời gian rõ.',
          body:['Để tổng trong khoảng ngày, thường dùng hai criteria trên cùng cột Date: >= ngày bắt đầu và <= ngày kết thúc, hoặc >= đầu kỳ và < đầu kỳ kế tiếp. Cách nửa khoảng [start, next_start) đặc biệt hữu ích khi có cả time.','Nên tham chiếu ô StartDate/EndDate thay vì gõ chuỗi ngày vào công thức, giảm phụ thuộc locale và dễ thay kỳ báo cáo.'],
          example:{title:'Ví dụ',formula:'=SUMIFS(H:H,C:C,">="&K2,C:C,"<"&L2)',text:'Tổng H với Date ở C từ K2 trở đi nhưng trước L2; L2 có thể là ngày đầu tháng kế tiếp.'},
          questions:[
            {q:'Vì sao dùng < ngày đầu kỳ kế tiếp hữu ích khi dữ liệu có giờ?',options:['Bao phủ toàn bộ ngày cuối kỳ mà không cần 23:59:59','Đổi Text thành Number','Tạo Pivot','Xóa duplicate'],answer:0,explain:'Mọi timestamp trước đầu kỳ sau đều nằm trong kỳ, tránh phải đoán thời điểm cuối ngày.'},
            {q:'Ngày dùng trong SUMIFS nên ưu tiên?',options:['Date serial thật','Text nhìn giống ngày','Màu ngày','Tên tháng bằng hình ảnh'],answer:0,explain:'Date thật mới so sánh theo thời gian đáng tin cậy. Text có thể cho kết quả sai theo locale/chuỗi.'}
          ]
        },
        {
          title:'Kiểm tra kết quả tổng hợp và tránh double-count',kind:'extension',
          why:'SUMIFS đúng cú pháp vẫn có thể sai nghiệp vụ nếu dữ liệu có nhiều dòng cho một Order.',
          body:['Trước khi đếm Orders, xác định grain. Nếu một Order có nhiều dòng sản phẩm, COUNTIFS trên Order_ID có thể đếm line chứ không phải unique order. Khi cần unique, dùng phương pháp phù hợp như helper flag, Pivot Distinct Count/Data Model hoặc Dynamic Array tùy phiên bản.','Đối soát tổng chi tiết với tổng nhóm: tổng Revenue theo tất cả Store nên khớp total Revenue nếu các nhóm phủ đầy đủ và không chồng lấn. Đây là control rất hữu ích.'],
          questions:[
            {q:'Một Order có 3 line. COUNTIFS đếm các line thỏa điều kiện có chắc bằng số Order không?',options:['Có','Không, vì grain line có thể làm đếm trùng Order','Chỉ khi font khác','Chỉ trên Mac'],answer:1,explain:'COUNTIFS đếm dòng/ô thỏa điều kiện. Nếu grain là Order-Line, một Order có thể được đếm nhiều lần.'},
            {q:'Control tốt sau khi tổng theo Store là?',options:['Tổng các Store đối soát với total nguồn','Thêm nhiều màu','Merge toàn bảng','Ẩn nguồn'],answer:0,explain:'Reconciliation giữa tổng nhóm và tổng nguồn giúp phát hiện thiếu/chồng nhóm hoặc sai điều kiện.'}
          ]
        }
      ]
    },
    {
      id:'s09-lookup',order:9,zone:'skills',level:'Dữ liệu & Công thức',duration:'75–90 phút',version:'XLOOKUP: Microsoft 365 / Excel 2021+ · VLOOKUP: Excel 2016+',
      title:'Dò tìm dữ liệu với XLOOKUP, VLOOKUP và INDEX/MATCH',short:'Tra mã lấy thông tin, exact match, khóa vùng, lỗi #N/A và duplicate key.',
      hook:'Có mã nhân viên nhưng cần tên/phòng ban; có Product_ID nhưng cần Category/Price. Lookup là cầu nối giữa bảng giao dịch và bảng danh mục.',
      prerequisites:['f04-formulas-references','s07-logic'],
      outcomes:['Hiểu lookup value, key và return column','Dùng XLOOKUP exact match khi phiên bản hỗ trợ','Dùng VLOOKUP đúng range_lookup và khóa vùng','Hiểu duplicate key, #N/A và INDEX/MATCH như lựa chọn mở rộng'],
      useCases:['Map tên nhân viên từ Staff_ID','Map Store/Region từ mã cửa hàng','Tra giá/nhóm sản phẩm','Kiểm tra mã có tồn tại trong danh mục'],
      sections:[
        {
          title:'Tư duy khóa–giá trị trước khi chọn hàm',kind:'core',
          why:'Lookup chỉ đáng tin khi cột khóa thực sự đại diện đúng một bản ghi trong bảng danh mục.',
          body:['Một bài lookup có ba câu hỏi: bạn đang có giá trị gì để tìm (lookup value), tìm nó ở cột khóa nào, và muốn trả về cột nào. Ví dụ có Staff_ID NV005, tìm trong Staff_Master[Staff_ID], trả Staff_Name.','Nếu key bị duplicate trong danh mục, nhiều hàm lookup sẽ trả một trong các kết quả phù hợp (thường kết quả đầu tiên theo cách tìm). Vì vậy data quality của key quan trọng hơn việc chọn XLOOKUP hay VLOOKUP.'],
          warning:'Lookup không tự chứng minh bảng master là duy nhất. Hãy kiểm tra duplicate key khi kết quả có vẻ ngẫu nhiên hoặc sai người/sản phẩm.',
          questions:[
            {q:'Trước khi viết lookup, điều cần xác định là?',options:['Lookup value, key column, return column','Màu chart','Tên font','Độ zoom'],answer:0,explain:'Ba thành phần này mô tả chính xác bài toán tra cứu. Trình bày không quyết định logic lookup.'},
            {q:'Master có duplicate key gây rủi ro gì?',options:['Lookup có thể trả kết quả không đại diện duy nhất','Excel tự xóa duplicate','Tạo thêm Sheet','Không ảnh hưởng'],answer:0,explain:'Nếu cùng key có nhiều bản ghi, khái niệm “kết quả đúng” không còn duy nhất. Cần xử lý dữ liệu/master trước.'}
          ]
        },
        {
          title:'XLOOKUP: cách tra cứu dễ đọc hơn',kind:'core',version:'Microsoft 365 / Excel 2021+',
          why:'XLOOKUP tách lookup_array và return_array nên không phụ thuộc cột trả về nằm bên phải.',
          body:['Cú pháp thường dùng: XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found]). Mặc định của XLOOKUP phù hợp với exact match trong nhiều tình huống.','Ví dụ =XLOOKUP(A2,Master!A:A,Master!C:C,"Không tìm thấy") tìm A2 trong cột A và trả cột C. Bạn vẫn cần khóa vùng nếu dùng range cụ thể và copy công thức, hoặc dùng Table structured reference.'],
          example:{title:'Ví dụ',formula:'=XLOOKUP(A2,Staff!$A$2:$A$100,Staff!$B$2:$B$100,"Không có mã")',text:'Tra Staff_ID ở A2 để lấy Staff_Name.'},
          questions:[
            {q:'Ưu điểm của XLOOKUP so với VLOOKUP cổ điển là?',options:['Có thể return từ cột bên trái hoặc phải mà không dựa chỉ số cột','Không cần key','Tự xóa duplicate','Chỉ dùng số'],answer:0,explain:'XLOOKUP dùng lookup_array và return_array độc lập, linh hoạt hơn hướng tra cứu.'},
            {q:'XLOOKUP có giải quyết duplicate key trong master không?',options:['Có, tự chọn bản ghi đúng nghiệp vụ','Không; duplicate vẫn là vấn đề dữ liệu','Chỉ trên 365','Chỉ khi dùng màu'],answer:1,explain:'Hàm không biết bản ghi duplicate nào là đúng nghiệp vụ. Bạn phải kiểm soát master.'}
          ]
        },
        {
          title:'VLOOKUP và exact match',kind:'core',version:'Excel 2016+',
          why:'VLOOKUP vẫn phổ biến trong nhiều file cũ; hiểu nó giúp bạn đọc và bảo trì workbook hiện hữu.',
          body:['VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup]). Với exact match, thường dùng FALSE hoặc 0. table_array phải có cột khóa ở bên trái và cột trả về nằm bên phải.','col_index_num là số thứ tự cột trong table_array, không phải số cột Excel. Chèn/xóa cột trong table_array có thể làm công thức trả sai cột nếu chỉ số không được cập nhật.'],
          warning:'Bỏ đối số cuối hoặc dùng approximate match khi dữ liệu không được chuẩn bị đúng có thể cho kết quả sai mà không báo lỗi.',
          questions:[
            {q:'VLOOKUP exact match thường dùng đối số cuối?',options:['FALSE/0','TRUE luôn luôn','Tên Sheet','-1'],answer:0,explain:'FALSE hoặc 0 yêu cầu khớp chính xác. TRUE/omitted là approximate và cần hiểu điều kiện sắp xếp/logic.'},
            {q:'col_index_num trong VLOOKUP tính từ đâu?',options:['Cột A của Excel luôn luôn','Cột đầu tiên của table_array','Sheet đầu','Ô hiện tại'],answer:1,explain:'Chỉ số cột là vị trí tương đối trong table_array, không phải chữ cột Excel.'}
          ]
        },
        {
          title:'#N/A, IFERROR và kiểm tra mã không tồn tại',kind:'core',
          why:'Không tìm thấy có thể là tình trạng nghiệp vụ cần xử lý, không chỉ là lỗi cần che.',
          body:['#N/A thường có nghĩa lookup không tìm thấy kết quả phù hợp. Nguyên nhân có thể là mã thật sự không tồn tại, khoảng trắng/ký tự ẩn, khác kiểu Text/Number, hoặc lookup range sai.','Có thể dùng if_not_found của XLOOKUP hoặc IFERROR/IFNA để hiển thị thông báo, nhưng nên phân biệt “mã thiếu master” với “công thức hỏng”. Một cột Exception_Flag đôi khi tốt hơn biến tất cả thành trống.'],
          example:{title:'Ví dụ kiểm soát',text:'Thay vì IFERROR(...,"") có thể trả "MISSING_MASTER" để người dùng biết cần bổ sung danh mục.'},
          questions:[
            {q:'#N/A sau lookup nên làm gì đầu tiên?',options:['Che bằng chuỗi rỗng ngay','Kiểm tra mã, kiểu dữ liệu, khoảng trắng và vùng lookup','Xóa dòng','Đổi font'],answer:1,explain:'Cần xác định lỗi là data quality hay logic trước khi quyết định cách hiển thị.'},
            {q:'Thông báo MISSING_MASTER có lợi hơn ô trống ở điểm nào?',options:['Cho biết nguyên nhân cần hành động','Làm file nhẹ hơn luôn luôn','Tự sửa master','Tự tạo Pivot'],answer:0,explain:'Nhãn exception làm trạng thái rõ và có thể Filter/đếm để xử lý.'}
          ]
        },
        {
          title:'INDEX + MATCH và khi nào cần',kind:'extension',version:'Excel 2016+',
          why:'INDEX/MATCH là kỹ thuật linh hoạt để đọc file cũ hoặc xử lý lookup khi XLOOKUP không có.',
          body:['MATCH tìm vị trí tương đối của lookup value trong một vùng; INDEX trả giá trị tại một vị trí trong vùng. Kết hợp: INDEX(return_range, MATCH(value, key_range, 0)).','Exact MATCH dùng 0. Công thức này tách key range và return range tương tự tư duy XLOOKUP, nhưng dài hơn. Với người mới, nếu có XLOOKUP thì học XLOOKUP trước, INDEX/MATCH là mở rộng.'],
          example:{title:'Ví dụ',formula:'=INDEX(B2:B100,MATCH(E2,A2:A100,0))',text:'Tìm E2 trong A2:A100 rồi lấy giá trị cùng vị trí ở B2:B100.'},
          questions:[
            {q:'MATCH(...,0) thường biểu thị?',options:['Exact match','Lấy giá trị lớn nhất','Tổng hợp','Sắp xếp'],answer:0,explain:'0 yêu cầu MATCH khớp chính xác.'},
            {q:'Nếu người mới có Excel hỗ trợ XLOOKUP, thứ tự học hợp lý?',options:['Bắt đầu XLOOKUP, sau đó hiểu INDEX/MATCH như mở rộng','Bắt buộc INDEX/MATCH trước mọi thứ','Không học key','Chỉ dùng VLOOKUP approximate'],answer:0,explain:'XLOOKUP dễ đọc hơn cho nhiều tình huống; INDEX/MATCH vẫn hữu ích để đọc file cũ và mở rộng tư duy.'}
          ]
        },
        {
          title:'Kiểm tra lookup bằng reconciliation',kind:'extension',
          why:'Một cột không có lỗi không có nghĩa mapping đã đúng.',
          body:['Sau khi lookup, đếm số MISSING, kiểm tra duplicate key trong master, spot-check một vài mã và đối soát tổng theo nhóm mới với nguồn. Nếu map Category sai, tổng Revenue tổng thể có thể vẫn đúng nhưng phân bổ Category sai.','Với file quan trọng, giữ key gốc bên cạnh trường đã map để người kiểm tra có thể truy vết.'],
          questions:[
            {q:'Mapping Category sai có thể xảy ra nhưng total Revenue vẫn đúng không?',options:['Có','Không bao giờ','Chỉ khi chart','Chỉ khi VBA'],answer:0,explain:'Lookup thay nhãn/phân nhóm có thể không đổi Revenue tổng, nhưng phân bổ theo Category sẽ sai. Vì vậy cần kiểm tra nhiều chiều.'},
            {q:'Control tốt sau lookup là?',options:['Đếm missing + kiểm tra duplicate key + spot-check','Chỉ tô xanh','Ẩn key gốc','Merge kết quả'],answer:0,explain:'Các kiểm tra này đánh giá completeness, uniqueness và correctness của mapping.'}
          ]
        }
      ]
    },
    {
      id:'s10-text',order:10,zone:'skills',level:'Dữ liệu & Công thức',duration:'75–90 phút',version:'Excel 2016+ · TEXTJOIN: Excel 2019/365 phổ biến',
      title:'Xử lý văn bản và mã trong Excel',short:'LEFT/RIGHT/MID, LEN, TRIM/CLEAN, FIND/SEARCH, SUBSTITUTE/REPLACE và ghép chuỗi.',
      hook:'Mã sản phẩm, họ tên, địa chỉ, chuỗi xuất từ hệ thống thường cần tách, làm sạch hoặc chuẩn hóa trước khi lookup và phân tích.',
      prerequisites:['f02-data-entry-types','f04-formulas-references'],
      outcomes:['Cắt chuỗi bằng LEFT/RIGHT/MID','Đo và làm sạch bằng LEN/TRIM/CLEAN','Tìm vị trí bằng FIND/SEARCH','Thay chuỗi và ghép dữ liệu có kiểm soát'],
      useCases:['Tách prefix từ mã hàng','Loại khoảng trắng thừa trước lookup','Chuẩn hóa họ tên/trạng thái','Tạo key ghép Store-Month-Staff'],
      sections:[
        {
          title:'LEFT, RIGHT và MID để tách chuỗi',kind:'core',
          why:'Nhiều mã có cấu trúc vị trí cố định, cho phép tách phần có ý nghĩa mà không sửa tay.',
          body:['LEFT(text, num_chars) lấy ký tự bên trái; RIGHT lấy bên phải; MID(text, start_num, num_chars) lấy đoạn ở giữa. Các hàm này đếm ký tự, không “hiểu” nghiệp vụ của mã.','Nếu cấu trúc mã thay đổi độ dài, cắt theo vị trí cố định có thể sai. Khi đó cần tìm delimiter bằng FIND/SEARCH hoặc dùng TEXTSPLIT trên phiên bản mới.'],
          example:{title:'Ví dụ',formula:'=LEFT(A2,3)',text:'A2 = HN-00125 thì LEFT 2 hoặc 3 cần được chọn theo cấu trúc thực tế; đừng đoán số ký tự.'},
          questions:[
            {q:'RIGHT(A2,4) lấy gì?',options:['4 ký tự bên phải','4 ký tự bên trái','Ký tự thứ 4','4 dòng'],answer:0,explain:'RIGHT trả số ký tự được yêu cầu tính từ cuối chuỗi.'},
            {q:'Rủi ro của MID với vị trí hardcode khi format mã thay đổi là?',options:['Có thể tách sai đoạn','Tự xóa file','Không ảnh hưởng','Tạo ngày'],answer:0,explain:'MID phụ thuộc vị trí bắt đầu và độ dài. Cấu trúc chuỗi đổi sẽ làm vị trí cũ không còn đúng.'}
          ]
        },
        {
          title:'LEN, TRIM và CLEAN: nhìn thấy và không nhìn thấy',kind:'core',
          why:'Khoảng trắng/ký tự ẩn khiến hai mã nhìn giống nhau nhưng lookup không khớp.',
          body:['LEN đếm số ký tự. TRIM loại khoảng trắng thừa kiểu ASCII thông thường và giữ một khoảng giữa từ; CLEAN loại một số ký tự không in được. Dữ liệu từ web/hệ thống có thể chứa non-breaking space hoặc ký tự Unicode khác, cần xử lý bổ sung.','Một quy trình tốt là so LEN trước/sau cleaning và giữ dữ liệu gốc nếu cần audit. Đừng sửa trực tiếp source quan trọng mà không biết đã thay gì.'],
          example:{title:'Ví dụ',text:'"NV001 " có LEN lớn hơn "NV001" dù nhìn gần giống nhau. TRIM có thể loại dấu cách cuối và làm lookup khớp.'},
          questions:[
            {q:'LEN hữu ích khi nghi có ký tự ẩn vì?',options:['Cho biết số ký tự thực trong chuỗi','Tự xóa ký tự','Tạo Pivot','Đổi màu'],answer:0,explain:'Độ dài khác dự kiến là tín hiệu chuỗi có khoảng trắng/ký tự dư.'},
            {q:'TRIM có đảm bảo loại mọi loại khoảng trắng Unicode không?',options:['Có tuyệt đối','Không; một số ký tự đặc biệt cần xử lý khác','Chỉ trên 365','TRIM chỉ dùng số'],answer:1,explain:'TRIM không phải trình làm sạch mọi Unicode whitespace. Dữ liệu web có thể cần SUBSTITUTE/Power Query hoặc xử lý khác.'}
          ]
        },
        {
          title:'FIND và SEARCH để tìm vị trí',kind:'core',
          why:'Khi delimiter không ở vị trí cố định, tìm vị trí giúp tách chuỗi linh hoạt hơn.',
          body:['FIND và SEARCH trả vị trí của chuỗi con. FIND phân biệt hoa/thường; SEARCH thường không phân biệt hoa/thường và hỗ trợ wildcard trong một số tình huống.','Kết hợp FIND/SEARCH với LEFT/MID để tách phần trước/sau dấu -. Cần xử lý trường hợp delimiter không tồn tại để tránh #VALUE!.'],
          example:{title:'Ví dụ',formula:'=LEFT(A2,FIND("-",A2)-1)',text:'Lấy phần trước dấu - đầu tiên nếu A2 chắc chắn có dấu -.'},
          questions:[
            {q:'FIND và SEARCH khác nhau đáng chú ý ở?',options:['FIND phân biệt hoa/thường, SEARCH thường không','Một hàm cộng, một hàm đếm','Cả hai tạo chart','Không có khác biệt'],answer:0,explain:'Case sensitivity là khác biệt thực tế quan trọng giữa FIND và SEARCH.'},
            {q:'Nếu dấu - không tồn tại, FIND("-",A2) có thể?',options:['Trả lỗi #VALUE!','Trả 0 luôn','Xóa A2','Tạo Blank'],answer:0,explain:'Không tìm thấy chuỗi con thường dẫn tới #VALUE!, nên cần kiểm soát nếu dữ liệu không đảm bảo format.'}
          ]
        },
        {
          title:'SUBSTITUTE, REPLACE và chuẩn hóa chuỗi',kind:'core',
          why:'Thay text theo nội dung khác với thay theo vị trí; chọn nhầm hàm dễ phá chuỗi.',
          body:['SUBSTITUTE(text, old_text, new_text, [instance_num]) thay một chuỗi cụ thể. REPLACE(old_text, start_num, num_chars, new_text) thay theo vị trí.','SUBSTITUTE phù hợp đổi dấu -, loại ký tự hoặc chuẩn hóa nhãn; REPLACE phù hợp khi vị trí cố định. Sau thay hàng loạt, kiểm tra số dòng/kết quả vì một pattern có thể xuất hiện ở nơi bạn không ngờ.'],
          questions:[
            {q:'Muốn thay mọi dấu "-" bằng "/" theo nội dung nên ưu tiên?',options:['SUBSTITUTE','REPLACE theo vị trí cố định','SUM','COUNT'],answer:0,explain:'SUBSTITUTE tìm old_text cụ thể và thay bằng new_text, phù hợp thay theo nội dung.'},
            {q:'REPLACE phù hợp hơn khi?',options:['Biết chính xác vị trí và số ký tự cần thay','Muốn cộng số','Muốn Sort','Muốn Filter'],answer:0,explain:'REPLACE làm việc theo start_num/num_chars.'}
          ]
        },
        {
          title:'Ghép chuỗi, &, CONCAT và TEXTJOIN',kind:'core',
          why:'Ghép key hoặc mô tả cần dấu phân cách rõ để tránh key mơ hồ.',
          body:['Toán tử & ghép chuỗi đơn giản: =A2&"-"&B2. CONCAT ghép nhiều text; TEXTJOIN cho phép delimiter và có thể bỏ qua blank trên phiên bản hỗ trợ.','Khi tạo composite key, luôn dùng delimiter hoặc format cố định. Ghép A=12, B=34 thành 1234 có thể trùng với A=1, B=234. 12-34 và 1-234 rõ hơn.'],
          example:{title:'Ví dụ key',formula:'=A2&"|"&TEXT(B2,"yyyymm")&"|"&C2',text:'Tạo key Store|Month|Staff với delimiter rõ.'},
          questions:[
            {q:'Vì sao composite key nên có delimiter?',options:['Giảm khả năng hai tổ hợp khác nhau tạo cùng chuỗi mơ hồ','Làm file tự nhanh 100%','Tạo chart','Bắt buộc bởi Excel'],answer:0,explain:'Delimiter tách ranh giới giữa các phần, giảm collision do nối chuỗi không phân cách.'},
            {q:'TEXTJOIN hữu ích khi?',options:['Ghép nhiều giá trị với delimiter và có tùy chọn bỏ blank','Tính trung bình','Tra cứu','Freeze Pane'],answer:0,explain:'TEXTJOIN được thiết kế để nối nhiều chuỗi có delimiter.'}
          ]
        },
        {
          title:'Chuẩn hóa text trước lookup và bàn giao',kind:'extension',
          why:'Cleaning tốt cần có quy tắc, không phải “xóa tất cả ký tự lạ”.',
          body:['Xác định chuẩn mong muốn: viết hoa/thường, độ dài, delimiter, khoảng trắng, mã hợp lệ. Có thể dùng UPPER/LOWER/PROPER cho hiển thị, nhưng mã key nên theo chuẩn do hệ thống định nghĩa.','Giữ Raw_Text và Clean_Text khi thay đổi có rủi ro, thêm cột Check để so khác biệt và đếm exception. Khi volume lớn/lặp lại nhiều file, Power Query thường phù hợp hơn chuỗi công thức cleaning dài.'],
          questions:[
            {q:'Cleaning chuyên nghiệp nên bắt đầu từ?',options:['Quy tắc dữ liệu mong muốn','Xóa mọi ký tự không quen','Tô màu','Merge'],answer:0,explain:'Không có chuẩn thì không biết thay đổi nào là đúng. Data rule phải đi trước thao tác.'},
            {q:'Khi cleaning lặp lại mỗi ngày trên nhiều file, có thể cân nhắc?',options:['Power Query','Merge Cells','WordArt','In thủ công'],answer:0,explain:'Power Query giúp xây quy trình transformation có thể refresh, phù hợp tác vụ lặp và nhiều nguồn.'}
          ]
        }
      ]
    },
    {
      id:'s11-date-time',order:11,zone:'skills',level:'Dữ liệu & Công thức',duration:'75–90 phút',version:'Excel 2016+',
      title:'Ngày tháng và thời gian trong Excel',short:'Date serial, TODAY/NOW, DATE, YEAR/MONTH/DAY, EOMONTH và tính khoảng thời gian.',
      hook:'Ngày là một trong những kiểu dữ liệu dễ “trông đúng nhưng sai”. Hiểu serial, locale và biên kỳ giúp báo cáo tháng/ngày không lệch.',
      prerequisites:['f02-data-entry-types','f04-formulas-references'],
      outcomes:['Hiểu Date/Time là số serial','Tạo/tách ngày bằng DATE, YEAR, MONTH, DAY','Dùng TODAY/NOW và tính chênh lệch ngày','Xác định đầu/cuối tháng bằng EOMONTH và điều kiện thời gian an toàn'],
      useCases:['Tính tuổi/thâm niên/số ngày xử lý','Lọc báo cáo tháng hiện tại','Tạo Month_Key','Phân bổ target theo số ngày'],
      sections:[
        {
          title:'Date serial và phần thời gian',kind:'core',
          why:'Ngày giờ có thể cộng trừ vì Excel lưu chúng dưới dạng số.',
          body:['Trong hệ ngày thông dụng của Excel, phần nguyên đại diện số ngày từ mốc, phần thập phân đại diện thời gian trong ngày. Vì vậy 0.5 là nửa ngày và thời gian 12:00 tương ứng phần 0.5.','Điều này giải thích tại sao Date+1 là ngày kế tiếp và DateTime có thể so sánh bằng toán tử số. Nó cũng giải thích vì sao Text “09/09/2026” không hoạt động giống Date serial.'],
          questions:[
            {q:'Tại sao Excel có thể lấy EndDate-StartDate?',options:['Vì Date được lưu như số serial','Vì ngày là Text','Vì màu ô','Vì có Pivot'],answer:0,explain:'Date thật là giá trị số nên phép trừ cho chênh lệch ngày.'},
            {q:'Trong DateTime, phần thập phân thường biểu diễn?',options:['Thời gian trong ngày','Tên tháng','Tên Sheet','Màu'],answer:0,explain:'Phần nguyên là ngày, phần thập phân là tỷ lệ của 24 giờ.'}
          ]
        },
        {
          title:'DATE, YEAR, MONTH và DAY',kind:'core',
          why:'Tạo và tách ngày bằng hàm an toàn hơn ghép chuỗi ngày thủ công.',
          body:['DATE(year,month,day) tạo Date từ thành phần số. YEAR/MONTH/DAY tách các thành phần từ Date thật. Đây là nền cho Month_Key, nhóm báo cáo và kiểm tra ngày.','Không nên tạo ngày bằng chuỗi "1/"&A2&"/"&B2 nếu locale có thể khác. DATE cho logic rõ và ít phụ thuộc định dạng hiển thị.'],
          example:{title:'Ví dụ',formula:'=YEAR(C2)*100+MONTH(C2)',text:'Tạo Month_Key dạng 202609 từ một Date ở C2.'},
          questions:[
            {q:'Hàm nào tạo Date từ năm, tháng, ngày?',options:['DATE','TEXTJOIN','COUNT','LEFT'],answer:0,explain:'DATE nhận year, month, day và trả Date serial.'},
            {q:'YEAR(C2)*100+MONTH(C2) dùng để?',options:['Tạo khóa tháng YYYYMM','Tính doanh thu','Tạo chart','Xóa ngày'],answer:0,explain:'Ví dụ 2026*100+9 = 202609, một key số tiện cho grouping/comparison.'}
          ]
        },
        {
          title:'TODAY, NOW và giá trị biến động theo thời gian',kind:'core',
          why:'Hàm ngày hiện tại hữu ích nhưng là volatile theo thời điểm, nên cần hiểu tác động tới báo cáo lịch sử.',
          body:['TODAY() trả ngày hiện tại; NOW() trả ngày và thời gian hiện tại. Chúng tự thay đổi khi Workbook tính lại theo ngày/giờ hệ thống.','Nếu báo cáo cần “ngày chốt” cố định, không nên dùng TODAY làm mốc lịch sử vì ngày mai kết quả sẽ khác. Hãy lưu một AsOfDate/ReportDate cố định ở Config.'],
          warning:'Dùng TODAY trong tuổi tồn kho hoặc overdue rất tiện, nhưng khi tái mở file cũ, số ngày sẽ tiếp tục tăng. Hãy phân biệt báo cáo live và snapshot.',
          questions:[
            {q:'NOW() khác TODAY() ở đâu?',options:['NOW có cả thời gian, TODAY chủ yếu ngày','TODAY có giờ, NOW không','Cả hai là Text','Không khác'],answer:0,explain:'NOW chứa DateTime; TODAY trả ngày hiện tại với phần thời gian 0.'},
            {q:'Báo cáo snapshot cuối tháng nên dùng gì làm mốc dễ audit?',options:['Một ReportDate cố định','TODAY luôn luôn','Màu tab','Tên người mở file'],answer:0,explain:'Mốc cố định giúp kết quả lịch sử không thay đổi khi mở lại ở ngày khác.'}
          ]
        },
        {
          title:'EOMONTH, đầu tháng và khoảng kỳ',kind:'core',
          why:'Báo cáo theo tháng cần xác định biên kỳ nhất quán thay vì gõ ngày cuối tháng bằng tay.',
          body:['EOMONTH(start_date, months) trả ngày cuối tháng cách start_date một số tháng. Ngày đầu tháng có thể tạo bằng DATE(YEAR(d),MONTH(d),1) hoặc EOMONTH(d,-1)+1.','Đối với DateTime, khoảng >=Start và <NextStart thường an toàn hơn <=EndDate vì EndDate có thể là 00:00 và bỏ các giao dịch có giờ trong ngày cuối.'],
          example:{title:'Ví dụ',formula:'=EOMONTH(C2,0)',text:'Lấy ngày cuối tháng của C2.'},
          questions:[
            {q:'EOMONTH(DATE(2026,9,10),0) trả ngày nào?',options:['30/09/2026','10/09/2026','01/10/2026','31/08/2026'],answer:0,explain:'months=0 nghĩa là cuối tháng chứa start_date.'},
            {q:'Với timestamp, điều kiện nào an toàn cho tháng 9?',options:['>=01/09 và <01/10','>01/09 và <30/09','=09','Chỉ MONTH=9 không xét năm luôn'],answer:0,explain:'Khoảng nửa mở bao phủ mọi thời điểm trong tháng 9 và tránh vấn đề cuối ngày.'}
          ]
        },
        {
          title:'Chênh lệch ngày, tuổi và thâm niên',kind:'core',
          why:'Có nhiều định nghĩa “số tháng” hoặc “tuổi”; bạn cần chọn công thức theo nghiệp vụ.',
          body:['Số ngày đơn giản có thể là EndDate-StartDate. YEARFRAC hoặc DATEDIF thường được dùng trong một số bài tuổi/thâm niên, nhưng cần kiểm tra quy tắc làm tròn và ngày biên.','Không lấy YEAR(TODAY())-YEAR(BirthDate) rồi gọi là tuổi chính xác, vì chưa xét sinh nhật năm nay. Với KPI thâm niên theo tháng, cần định nghĩa tháng tròn hay số ngày/30.'],
          questions:[
            {q:'YEAR(TODAY())-YEAR(BirthDate) có thể sai tuổi vì?',options:['Không xét đã qua sinh nhật trong năm hay chưa','Excel không có YEAR','Ngày là Text luôn','Vì font'],answer:0,explain:'Chênh lệch năm lịch không tự xét ngày/tháng sinh.'},
            {q:'Khi tính “thâm niên tháng”, điều quan trọng trước công thức là?',options:['Định nghĩa nghiệp vụ tháng tròn/cách làm tròn','Màu cột','Tên Sheet','Zoom'],answer:0,explain:'Cùng dữ liệu nhưng định nghĩa khác cho kết quả khác. Logic phải theo quy tắc nghiệp vụ.'}
          ]
        },
        {
          title:'Locale, Text-to-Date và kiểm tra ngày lỗi',kind:'extension',
          why:'Nguồn quốc tế có thể dùng mm/dd/yyyy hoặc yyyy-mm-dd; đọc sai ngày là lỗi nghiêm trọng nhưng khó nhận ra.',
          body:['Khi chuỗi ngày đến từ CSV/web, xác định format nguồn và locale trước khi convert. 03/04/2026 là mơ hồ nếu không biết ngày/tháng theo thứ tự nào.','Kiểm tra min/max date, số bản ghi theo tháng và vài mẫu biên sau conversion. Với quy trình lặp nhiều file/locale, Power Query Change Type Using Locale thường rõ hơn sửa thủ công.'],
          warning:'Một ngày convert “thành công” nhưng đảo tháng/ngày còn nguy hiểm hơn lỗi rõ vì nó vẫn nhìn hợp lệ.',
          questions:[
            {q:'Chuỗi 03/04/2026 có thể mơ hồ vì?',options:['Có thể là 3/4 hoặc 4/3 theo locale','Excel không hỗ trợ 2026','Vì có số 0','Vì có /'],answer:0,explain:'dd/mm và mm/dd đều có thể tạo ngày hợp lệ khi cả hai số <=12.'},
            {q:'Sau convert hàng loạt ngày, control nào hữu ích?',options:['Min/max date và count theo tháng','Đổi màu ngẫu nhiên','Merge','Xóa nguồn'],answer:0,explain:'Phân bố thời gian giúp phát hiện ngày bị đảo hoặc nằm ngoài kỳ mong đợi.'}
          ]
        }
      ]
    },
    {
      id:'s12-clean-control',order:12,zone:'skills',level:'Dữ liệu & Công thức',duration:'90 phút',version:'Excel 2016+',
      title:'Làm sạch và kiểm soát dữ liệu cơ bản',short:'Remove Duplicates, Text to Columns, Flash Fill, Go To Special, lỗi dữ liệu và control trước phân tích.',
      hook:'Cleaning không phải “xóa cái trông lạ”. Bạn cần biết lỗi gì, quy tắc đúng là gì và chứng minh dữ liệu sau làm sạch vẫn bảo toàn những gì cần bảo toàn.',
      prerequisites:['f06-data-table-structure','s10-text','s11-date-time'],
      outcomes:['Phân loại lỗi dữ liệu thường gặp','Dùng Remove Duplicates/Text to Columns/Flash Fill có kiểm soát','Tìm blank, error, constant/formula bằng Go To Special','Tạo các control row count/total/duplicate trước và sau cleaning'],
      useCases:['Chuẩn hóa file nhập từ nhiều nhân sự','Xử lý duplicate và blank','Tách cột dữ liệu nhập sai cấu trúc','Chuẩn bị source để Power Query/Pivot'],
      sections:[
        {
          title:'Định nghĩa lỗi trước khi làm sạch',kind:'core',
          why:'Không có data rule thì bạn không biết một giá trị “khác thường” là lỗi hay ngoại lệ hợp lệ.',
          body:['Các nhóm lỗi phổ biến: missing, duplicate, sai type, ký tự thừa, format không nhất quán, invalid code, outlier và sai grain. Mỗi nhóm cần quy tắc khác nhau.','Ví dụ Store_Code S999 có thể là mã mới chưa cập nhật master, không phải dòng cần xóa. Quy trình tốt gắn Exception và xác minh thay vì tự động “sửa cho đẹp”.'],
          questions:[
            {q:'Bước đầu của cleaning chuyên nghiệp là?',options:['Xác định data rule và loại lỗi','Remove Duplicates ngay','Tô màu','Xóa mọi blank'],answer:0,explain:'Phải biết trạng thái đúng mong muốn trước khi chọn công cụ xử lý.'},
            {q:'Mã không có trong master nên luôn xóa?',options:['Có','Không; có thể là exception cần xác minh','Chỉ nếu màu đỏ','Chỉ trên 365'],answer:1,explain:'Missing master có thể là lỗi nguồn, master chưa cập nhật hoặc mã mới. Cần workflow xử lý chứ không mặc định xóa.'}
          ]
        },
        {
          title:'Remove Duplicates và khái niệm duplicate key',kind:'core',
          why:'Hai dòng giống nhau không luôn là duplicate nghiệp vụ; cần xác định key và grain.',
          body:['Remove Duplicates xóa các dòng trùng theo tập cột bạn chọn. Nếu chỉ chọn Order_ID trong bảng Order-Line, bạn có thể xóa mất các sản phẩm hợp lệ của cùng đơn.','Trước khi xóa, tạo bản copy hoặc đánh dấu duplicate bằng COUNTIF/COUNTIFS để kiểm tra. Xác định key như Order_ID+Line_No, Staff_ID+Date… theo grain.'],
          warning:'Remove Duplicates là thao tác phá hủy dữ liệu. Luôn ghi row count trước/sau và hiểu vì sao số dòng giảm.',
          questions:[
            {q:'Trong bảng Order-Line, dùng Order_ID duy nhất để Remove Duplicates có thể?',options:['Xóa mất line hợp lệ cùng Order','Luôn đúng','Tạo thêm line','Không thay đổi'],answer:0,explain:'Một Order có nhiều line, nên Order_ID không phải unique key của grain Order-Line.'},
            {q:'Control tối thiểu sau Remove Duplicates là?',options:['Row count trước/sau và key đã dùng','Màu trước/sau','Zoom','Tên font'],answer:0,explain:'Bạn cần chứng minh số dòng giảm có lý do và đúng theo key nghiệp vụ.'}
          ]
        },
        {
          title:'Text to Columns và Flash Fill',kind:'core',
          why:'Hai công cụ tách/chuyển dữ liệu nhanh nhưng có hành vi khác và có thể ghi đè cột bên cạnh.',
          body:['Text to Columns có Delimited (dựa dấu phân cách như comma/tab) hoặc Fixed Width. Nó cũng có thể hỗ trợ conversion text/date trong một số tình huống. Hãy chừa vùng đích để không ghi đè dữ liệu cạnh.','Flash Fill dựa trên mẫu bạn cung cấp và điền giá trị. Nó nhanh cho thao tác một lần nhưng không phải transformation có thể refresh. Với quy trình lặp lại, công thức hoặc Power Query đáng tin hơn.'],
          questions:[
            {q:'Text to Columns Delimited phù hợp khi?',options:['Chuỗi có delimiter rõ như comma/tab','Muốn tính SUM','Muốn Pivot','Muốn khóa Sheet'],answer:0,explain:'Delimited tách dựa ký tự phân cách.'},
            {q:'Flash Fill phù hợp nhất với?',options:['Tác vụ nhận diện mẫu một lần cần kiểm tra','Pipeline lặp hàng ngày cần refresh tự động','Database transaction','Bảo vệ file'],answer:0,explain:'Flash Fill tạo giá trị tĩnh; quy trình lặp nên dùng công thức/PQ để tái chạy.'}
          ]
        },
        {
          title:'Go To Special: blank, formula, constant và visible cells',kind:'core',
          why:'Go To Special giúp chọn đúng loại ô thay vì kéo vùng và sửa thủ công.',
          body:['Go To Special có thể chọn Blank, Formulas, Constants, Visible cells only… Dùng Blank để rà ô thiếu; dùng Formulas/Constants để phát hiện một cột công thức bị hardcode vài dòng; Visible cells only hữu ích khi copy dữ liệu đã Filter.','Hãy rất cẩn thận khi dùng “chọn blank rồi điền” trên vùng có merged cells hoặc logic blank có ý nghĩa. Kiểm tra mẫu trước thao tác hàng loạt.'],
          example:{title:'Ví dụ audit',text:'Một cột đáng lẽ toàn công thức: Go To Special → Constants có thể tìm những ô bị người dùng paste giá trị đè lên công thức.'},
          questions:[
            {q:'Muốn tìm ô hardcode trong cột đáng lẽ toàn formula, có thể dùng?',options:['Go To Special → Constants','Merge','Freeze','Theme'],answer:0,explain:'Constants giúp chọn ô có giá trị nhập trực tiếp, khác Formula.'},
            {q:'Visible cells only hữu ích khi?',options:['Copy dữ liệu đang Filter mà không lấy dòng ẩn','Tạo ngày','Đổi font','VBA'],answer:0,explain:'Nó giới hạn selection ở ô đang hiển thị, tránh copy cả dòng ẩn do filter.'}
          ]
        },
        {
          title:'Kiểm tra error và type mismatch',kind:'core',
          why:'#N/A, #VALUE!, #DIV/0! và số dạng Text cần được phân loại nguyên nhân trước khi sửa.',
          body:['#DIV/0! là chia cho zero/blank; #N/A thường là không tìm thấy; #VALUE! thường liên quan kiểu/đối số; #REF! liên quan tham chiếu không hợp lệ. Đây là tín hiệu để truy lỗi, không chỉ là thứ cần che bằng IFERROR.','Kết hợp Filter lỗi, ISNUMBER/ISTEXT, LEN/TRIM và kiểm tra master để xác định nguồn. Khi có nhiều bước lặp, ghi lại số exception theo loại để biết cleaning có cải thiện hay làm mất dữ liệu.'],
          questions:[
            {q:'#REF! thường chỉ ra vấn đề gì?',options:['Tham chiếu không hợp lệ','Màu sai','Ngày hôm nay','Font'],answer:0,explain:'#REF! xuất hiện khi công thức tham chiếu ô/vùng đã bị xóa hoặc không còn hợp lệ.'},
            {q:'Thấy #N/A sau lookup nên mặc định xóa dòng?',options:['Có','Không, cần điều tra missing master/key/type trước','Chỉ nếu file nhỏ','Chỉ trên 365'],answer:1,explain:'#N/A có thể là exception có giá trị nghiệp vụ; xóa sẽ làm mất dữ liệu và che vấn đề.'}
          ]
        },
        {
          title:'Reconciliation trước và sau cleaning',kind:'core',
          why:'Cleaning đúng phải có bằng chứng rằng bạn đã sửa lỗi mà không làm mất số liệu cần giữ.',
          body:['Ghi lại row count, unique key count, total Qty/Revenue, min/max date và số exception trước/sau. Không phải mọi chỉ số đều phải giữ nguyên: Remove duplicate hợp lệ có thể giảm row count, nhưng bạn phải giải thích.','Tạo Control sheet/box nhỏ với các metric và trạng thái PASS/CHECK. Khi workflow trở thành định kỳ hoặc nhiều file, đây là bước chuyển tự nhiên sang Power Query và automated validation.'],
          questions:[
            {q:'Sau cleaning, vì sao total Revenue nên được đối soát?',options:['Để phát hiện dữ liệu bị mất/nhân ngoài ý muốn','Để đổi màu','Để tạo password','Không cần'],answer:0,explain:'Tổng số quan trọng là control phát hiện transformation làm sai dữ liệu.'},
            {q:'Row count thay đổi có luôn là lỗi không?',options:['Có','Không; có thể đúng nếu loại duplicate hợp lệ nhưng cần giải thích','Chỉ khi tăng','Chỉ khi giảm'],answer:1,explain:'Control không yêu cầu mọi metric bất biến; nó yêu cầu biến động có lý do và khớp quy tắc.'}
          ]
        },
        {
          title:'Khi nào nên chuyển cleaning sang Power Query',kind:'extension',
          why:'Công cụ thủ công phù hợp một lần; workflow lặp cần khả năng tái chạy và audit bước biến đổi.',
          body:['Nếu mỗi tuần bạn lại mở file, Trim, đổi type, xóa cột, filter và append nhiều file giống nhau, Power Query cho phép ghi lại các bước và Refresh.','Excel formula vẫn rất tốt cho logic tương tác và tính toán trong sheet. Đừng chuyển mọi thứ sang Power Query; chọn công cụ theo loại công việc: ETL lặp → PQ, tính toán tương tác → formula, tổng hợp nhanh → Pivot.'],
          questions:[
            {q:'Dấu hiệu rõ nên cân nhắc Power Query là?',options:['Chuỗi thao tác cleaning lặp lại trên nhiều file','Một phép SUM đơn giản','Đổi font một lần','In một trang'],answer:0,explain:'PQ mạnh ở quy trình import/transform lặp và có thể refresh.'},
            {q:'Có nên dùng Power Query cho mọi công việc Excel?',options:['Có','Không; chọn theo bài toán và mức lặp','Chỉ trên desktop','Chỉ cho chart'],answer:1,explain:'Không có công cụ duy nhất tốt nhất. Formula/Pivot/PQ mỗi loại có vai trò.'}
          ]
        }
      ]
    }
  ];
  window.AVPKnowledgeLessons = (window.AVPKnowledgeLessons || []).concat(lessons);
})();
