(() => {
  'use strict';
  const lessons = [
    {
      id:'a13-excel-table',order:13,zone:'analysis',level:'Phân tích & Báo cáo',duration:'60–75 phút',version:'Excel 2016+',
      title:'Excel Table: biến vùng dữ liệu thành nguồn có cấu trúc',short:'Ctrl+T, structured references, Total Row, tự mở rộng và source ổn định.',
      hook:'Excel Table không chỉ là “tô màu có Filter”. Nó giúp vùng dữ liệu có tên, tự mở rộng và trở thành nguồn ổn định hơn cho công thức, Pivot và nhiều workflow.',
      prerequisites:['f06-data-table-structure','s12-clean-control'],
      outcomes:['Tạo và đặt tên Table đúng cách','Hiểu structured reference','Biết Table tự mở rộng và copy công thức theo cột','Dùng Total Row và tránh các lỗi cấu trúc trong Table'],
      useCases:['Danh sách giao dịch tăng thêm mỗi ngày','Nguồn cho PivotTable hoặc chart','Công thức tham chiếu theo tên cột dễ đọc','Form nhập liệu có validation/format đồng nhất'],
      sections:[
        {
          title:'Tại sao dùng Table thay vùng thường',kind:'core',
          why:'Vùng A1:H500 có thể trở thành A1:H800 ngày mai; Table tự nhận diện dữ liệu mới tốt hơn trong nhiều tình huống.',
          body:['Ctrl+T hoặc Insert → Table chuyển vùng thành Table. Hãy xác nhận “My table has headers” đúng với dữ liệu. Table có Filter, banded rows tùy style, tự mở rộng khi nhập dòng mới và có tên như Table1.','Tên Table nên có ý nghĩa, ví dụ tblSales hoặc tblTraffic. Khi bàn giao, một công thức dùng tblSales[Revenue] dễ hiểu hơn $H$2:$H$5000.'],
          tip:'Ctrl+T là phím tắt quan trọng của bài này. Không cần nhớ toàn bộ phím tắt, chỉ gắn phím với thao tác bạn thực sự dùng.',
          questions:[
            {q:'Lợi ích quan trọng của Excel Table là?',options:['Chỉ đổi màu đẹp hơn','Có cấu trúc/tên và thường tự mở rộng khi thêm dữ liệu','Tự sửa mọi duplicate','Tự tạo VBA'],answer:1,explain:'Table thêm metadata và structured behavior, không chỉ style.'},
            {q:'Tên nào dễ bàn giao hơn?',options:['Table1 mãi mãi','tblSales','X','AAAA'],answer:1,explain:'Tên mô tả chức năng giúp công thức và Data Model dễ hiểu.'}
          ]
        },
        {
          title:'Structured Reference',kind:'core',
          why:'Structured Reference giúp công thức nói bằng tên cột thay vì tọa độ khó đọc.',
          body:['Trong Table, công thức có thể dùng tblSales[Revenue] cho cả cột hoặc [@Revenue] cho giá trị Revenue của dòng hiện tại. Dấu @ thể hiện current row context trong Table.','Khi rename header hoặc Table, Excel thường cập nhật structured references liên quan. Tuy nhiên bạn vẫn nên tránh tên cột trùng/mơ hồ và kiểm tra công thức sau thay đổi lớn.'],
          example:{title:'Ví dụ',formula:'=[@Qty]*[@Unit_Price]',text:'Tính thành tiền cho từng dòng Table bằng hai cột của cùng dòng.'},
          questions:[
            {q:'[@Revenue] trong công thức Table thường chỉ gì?',options:['Toàn cột Revenue','Revenue của dòng hiện tại','Sheet Revenue','Giá trị lớn nhất'],answer:1,explain:'@ là current row trong structured reference.'},
            {q:'tblSales[Revenue] thường biểu thị?',options:['Cột Revenue trong Table tblSales','Ô Revenue hiện tại','Tên file','Một chart'],answer:0,explain:'TableName[ColumnName] tham chiếu cột có tên đó trong Table.'}
          ]
        },
        {
          title:'Calculated Column và tự fill công thức',kind:'core',
          why:'Nhập công thức một dòng trong Table thường có thể lan xuống cả cột, giảm copy thủ công.',
          body:['Khi bạn nhập công thức nhất quán trong một cột Table, Excel thường tạo calculated column và fill xuống các dòng. Dòng mới thêm sau đó cũng nhận công thức.','Nếu một vài dòng bị hardcode đè công thức, tính nhất quán có thể bị phá. Khi audit, kiểm tra công thức cột và tránh sửa riêng lẻ nếu không có lý do rõ.'],
          warning:'Calculated Column tiện nhưng không thay thế kiểm tra logic. Công thức sai sẽ được nhân rộng rất nhanh.',
          questions:[
            {q:'Calculated Column hữu ích vì?',options:['Tự áp công thức nhất quán xuống các dòng Table','Xóa header','Đổi date thành text','Tạo password'],answer:0,explain:'Table hỗ trợ fill công thức theo cột và tiếp tục cho dòng mới.'},
            {q:'Rủi ro khi công thức mẫu sai là?',options:['Sai có thể lan toàn cột','Excel tự sửa chắc chắn','Không ảnh hưởng dòng khác','Chỉ đổi màu'],answer:0,explain:'Automation giúp nhanh nhưng cũng nhân lỗi nhanh, nên cần validate formula.'}
          ]
        },
        {
          title:'Total Row và tổng hợp nhanh',kind:'core',
          why:'Total Row tiện cho kiểm tra nhanh nhưng không nên trộn vào source như một dòng giao dịch.',
          body:['Table Design → Total Row thêm dòng tổng với lựa chọn Sum, Average, Count… thường dựa trên SUBTOTAL để phản ứng với Filter. Đây là lớp trình bày/tổng hợp của Table, không phải một record giao dịch.','Nếu Table dùng làm nguồn ETL/Pivot, hiểu Total Row có được tool bao gồm hay không. Không tự chèn dòng “TOTAL” vào giữa dữ liệu nguồn.'],
          questions:[
            {q:'Total Row khác dòng giao dịch ở?',options:['Là dòng tổng hợp của Table, không phải record cùng grain','Không khác','Luôn là header','Là Macro'],answer:0,explain:'Nó phục vụ tổng hợp, không đại diện một transaction như các dòng data.'},
            {q:'SUBTOTAL thường có lợi thế khi Filter?',options:['Có thể tính theo các dòng đang hiển thị tùy function','Xóa filter','Tạo key','Đổi Sheet'],answer:0,explain:'SUBTOTAL có khả năng bỏ qua các dòng lọc/ẩn tùy mã function.'}
          ]
        },
        {
          title:'Table làm nguồn cho Pivot và chart',kind:'core',
          why:'Nguồn có tên và tự mở rộng giúp giảm tình trạng Pivot bỏ sót dòng mới do source range cũ.',
          body:['Khi Pivot source là Table, thêm dòng vào Table rồi Refresh Pivot thường dễ quản lý hơn một fixed range. Chart cũng có thể dùng dữ liệu Table để mở rộng theo nguồn.','Dù Table mở rộng, Pivot vẫn cần Refresh để đọc dữ liệu mới. Table không tự biến mọi downstream object thành real-time.'],
          questions:[
            {q:'Thêm dòng mới vào Table rồi Pivot có tự cập nhật ngay luôn không?',options:['Luôn luôn','Không; thường vẫn cần Refresh Pivot','Chỉ cần đổi màu','Pivot tự xóa'],answer:1,explain:'Table giúp source mở rộng, nhưng Pivot cache cần refresh.'},
            {q:'Vì sao Table tốt hơn fixed A1:H500 khi dữ liệu tăng?',options:['Giảm nguy cơ source bỏ sót dòng mới','Vì Table luôn nhanh hơn mọi trường hợp','Vì không cần header','Vì xóa duplicate'],answer:0,explain:'Table tự mở rộng theo dòng mới, nên range nguồn linh hoạt hơn.'}
          ]
        },
        {
          title:'Khi không nên biến mọi thứ thành Table',kind:'extension',
          why:'Table là công cụ tốt nhưng không cần cho mọi vùng trình bày hoặc ma trận báo cáo.',
          body:['Bảng matrix có header nhiều tầng, template in hoặc vùng output đặc biệt có thể không phù hợp Table. Hãy dùng Table cho dữ liệu dạng record; dùng range thường cho layout khi cần.','Khi workbook có hàng trăm nghìn công thức calculated column, Table cũng có thể ảnh hưởng hiệu năng. Thiết kế dựa trên mục tiêu, không phải “Table mọi nơi”.'],
          questions:[
            {q:'Vùng nào phù hợp Table nhất?',options:['Dữ liệu record với một header và grain rõ','Banner tiêu đề báo cáo','Dashboard layout merge','Ảnh logo'],answer:0,explain:'Table được thiết kế cho tabular records.'},
            {q:'Nguyên tắc tốt là?',options:['Dùng Table theo mục đích dữ liệu, không bắt buộc mọi vùng','Chuyển mọi ô thành Table','Không bao giờ dùng Table','Chỉ dùng Table để màu'],answer:0,explain:'Công cụ cần phù hợp cấu trúc và workflow.'}
          ]
        }
      ]
    },
    {
      id:'a14-pivottable',order:14,zone:'analysis',level:'Phân tích & Báo cáo',duration:'90 phút',version:'Excel 2016+',
      title:'PivotTable: tổng hợp dữ liệu mà không viết hàng chục công thức',short:'Rows, Columns, Values, Filters, Group Date, Slicer, Refresh và lỗi Count/Sum.',
      hook:'Bạn có 20.000 dòng bán hàng và sếp hỏi doanh thu theo cửa hàng, tháng và category? PivotTable giúp trả lời trong vài thao tác nếu source được chuẩn hóa.',
      prerequisites:['a13-excel-table','f06-data-table-structure'],
      outcomes:['Hiểu 4 vùng Rows/Columns/Values/Filters','Chọn Sum/Count/Average đúng ý nghĩa','Group ngày, Sort/Filter và dùng Slicer cơ bản','Refresh và kiểm tra source/cache trước khi kết luận'],
      useCases:['Doanh thu theo Store/Month','NG theo Model/Defect','Headcount theo Department','Top sản phẩm và tỷ trọng'],
      sections:[
        {
          title:'PivotTable trả lời câu hỏi nào',kind:'core',
          why:'Đừng kéo field ngẫu nhiên; hãy xác định metric và dimension trước.',
          body:['PivotTable tổng hợp metric theo dimension. Ví dụ metric = Revenue, dimension = Store và Month. Hãy đặt câu hỏi “tổng chỉ số gì, theo nhóm nào, cần filter gì?”.','Source nên có một header, không merge, grain nhất quán và dữ liệu đúng type. Pivot không sửa lỗi source; nó chỉ tổng hợp những gì bạn đưa vào.'],
          questions:[
            {q:'Trong “Revenue theo Store”, Revenue là?',options:['Metric cần tổng hợp','Tên Sheet','Filter bắt buộc','Macro'],answer:0,explain:'Revenue là đại lượng; Store là dimension để nhóm.'},
            {q:'Pivot có tự sửa source sai type/duplicate không?',options:['Có','Không, source quality vẫn phải kiểm soát','Chỉ trên 365','Chỉ khi có Slicer'],answer:1,explain:'Pivot tổng hợp source hiện có; data quality phải được xử lý trước.'}
          ]
        },
        {
          title:'Rows, Columns, Values và Filters',kind:'core',
          why:'Bốn vùng này là ngôn ngữ cơ bản của Pivot.',
          body:['Rows tạo nhóm theo chiều dọc; Columns tạo nhóm ngang; Values chứa metric cần tính; Filters lọc toàn Pivot theo một field. Một field có thể được kéo vào nhiều vùng trong một số thiết kế.','Giữ Pivot dễ đọc: đừng nhét quá nhiều dimension vào cả Rows/Columns. Nếu mục tiêu là phân tích, bắt đầu từ layout đơn giản rồi thêm chiều khi cần.'],
          example:{title:'Ví dụ',text:'Rows = Store, Columns = Month, Values = Sum of Revenue, Filters = Region.'},
          questions:[
            {q:'Field Revenue thường đặt ở đâu khi cần tổng doanh thu?',options:['Values','Rows luôn','Sheet Tab','Name Box'],answer:0,explain:'Metric số cần aggregation thường vào Values.'},
            {q:'Region dùng để lọc toàn Pivot có thể đặt ở?',options:['Filters','Formula Bar','Status Bar','Page Layout'],answer:0,explain:'Filters cung cấp report-level filter trong Pivot.'}
          ]
        },
        {
          title:'Sum, Count, Average và Value Field Settings',kind:'core',
          why:'Pivot có thể tự chọn Count khi cột số chứa Text/blank bất thường, dẫn tới báo cáo sai mà người mới không để ý.',
          body:['Value Field Settings cho phép Sum, Count, Average, Max, Min… Nếu Revenue đáng lẽ Sum nhưng Pivot hiển thị Count of Revenue, hãy kiểm tra type của source và chọn đúng aggregation.','Show Values As có thể hiển thị % of Grand Total, Difference From, Running Total… Đây là công cụ phân tích, nhưng luôn giữ metric gốc để tránh người đọc chỉ thấy % mà mất quy mô tuyệt đối.'],
          warning:'Count of Revenue bất ngờ thường là dấu hiệu source Revenue có Text hoặc type không đồng nhất.',
          questions:[
            {q:'Pivot hiện Count of Revenue thay vì Sum, nên kiểm tra?',options:['Source Revenue có phải Number nhất quán và Value Field Settings','Màu Pivot','Tên file','Zoom'],answer:0,explain:'Type source ảnh hưởng cách Pivot nhận diện field số.'},
            {q:'% of Grand Total nên dùng thế nào?',options:['Như lớp phân tích bổ sung, vẫn hiểu số tuyệt đối','Thay thế mọi số gốc','Dùng để sửa duplicate','Dùng để đổi date'],answer:0,explain:'Phần trăm cho tỷ trọng nhưng không cho biết quy mô; hai góc nhìn bổ sung nhau.'}
          ]
        },
        {
          title:'Group Date, Sort và Filter trong Pivot',kind:'core',
          why:'Ngày thật cho phép group theo Year/Quarter/Month; ngày Text làm trải nghiệm phân tích kém.',
          body:['Date field có thể Group theo Years, Quarters, Months… tùy phiên bản/source. Nếu Group không hoạt động, kiểm tra blank/error/text trong cột Date.','Bạn có thể Sort Largest to Smallest theo metric, Value Filters như Top 10, Label Filters theo tên. Cẩn thận khi đọc Top 10 sau khi có Filter khác: scope đã thay đổi.'],
          questions:[
            {q:'Group Date không hoạt động, nên kiểm tra đầu tiên?',options:['Date source là Date thật, không có lỗi/blank gây vấn đề','Theme','Logo','Border'],answer:0,explain:'Pivot cần field thời gian hợp lệ để group đúng.'},
            {q:'Top 10 trong Pivot chịu ảnh hưởng Filter khác không?',options:['Có, nó áp trên scope dữ liệu đang lọc','Không bao giờ','Chỉ trên Mac','Chỉ nếu màu đỏ'],answer:0,explain:'Filter context quyết định tập dữ liệu được xếp hạng.'}
          ]
        },
        {
          title:'Refresh, Change Data Source và cache',kind:'core',
          why:'Dữ liệu nguồn thay đổi nhưng Pivot có thể vẫn hiển thị số cũ cho tới khi Refresh.',
          body:['Refresh cập nhật Pivot từ source. Refresh All có thể cập nhật nhiều connection/query/pivot tùy workbook. Nếu source là fixed range, dòng mới ngoài range có thể không được lấy; Table giúp giảm rủi ro này.','Khi file quan trọng, sau Refresh kiểm tra row count/source date và vài total. Đừng coi nút Refresh như bằng chứng dữ liệu đã đầy đủ.'],
          tip:'Alt+F5 thường Refresh Pivot đang chọn; Ctrl+Alt+F5 có thể Refresh All trong nhiều phiên bản Windows, nhưng hãy hiểu workbook có connection nào trước khi dùng.',
          questions:[
            {q:'Dữ liệu nguồn có dòng mới nhưng Pivot dùng fixed range cũ. Chỉ Refresh có chắc lấy dòng mới không?',options:['Có tuyệt đối','Không nếu dòng mới nằm ngoài source range','Chỉ nếu font Arial','Chỉ nếu Sort'],answer:1,explain:'Refresh đọc source đã cấu hình. Nếu range không bao gồm dòng mới, cần mở rộng source hoặc dùng Table.'},
            {q:'Sau Refresh báo cáo quan trọng nên?',options:['Đối soát vài control/source date/total','Tin ngay','Xóa source','Chỉ đổi màu'],answer:0,explain:'Refresh là thao tác kỹ thuật; control xác nhận dữ liệu đúng scope.'}
          ]
        },
        {
          title:'Slicer, PivotChart và giới hạn của Pivot',kind:'extension',
          why:'Pivot có thể là nền cho dashboard tương tác, nhưng không phải mọi logic nên nhét vào một Pivot.',
          body:['Slicer là bộ lọc trực quan cho field; Timeline hỗ trợ date trong các phiên bản phù hợp. PivotChart liên kết với Pivot và phản ứng filter/slicer.','Khi cần relationship nhiều bảng, distinct count hoặc measure phức tạp, Data Model/Power Pivot có thể phù hợp hơn Pivot thường. Đây là kiến thức mở rộng, không bắt người mới học trước Pivot cơ bản.'],
          questions:[
            {q:'Slicer chủ yếu dùng để?',options:['Lọc Pivot/report tương tác','Viết VBA','Làm sạch text','Tạo password'],answer:0,explain:'Slicer là control filter trực quan.'},
            {q:'Khi cần relationship nhiều bảng và measure, có thể cân nhắc?',options:['Data Model/Power Pivot','Merge Cells','WordArt','Chỉ SUM'],answer:0,explain:'Data Model được thiết kế cho mô hình nhiều bảng và DAX measure.'}
          ]
        }
      ]
    },
    {
      id:'a15-kpi-analysis',order:15,zone:'analysis',level:'Phân tích & Báo cáo',duration:'90 phút',version:'Excel 2016+',
      title:'Phân tích KPI: từ dữ liệu đến câu hỏi ra quyết định',short:'Metric, dimension, grain, target, variance, rate, contribution và kiểm tra denominator.',
      hook:'Một dashboard đẹp không cứu được KPI sai. Bài này dạy cách định nghĩa chỉ số trước khi viết công thức hoặc kéo Pivot.',
      prerequisites:['s08-conditional-aggregation','a14-pivottable'],
      outcomes:['Phân biệt metric, dimension và grain','Tính rate/ratio với numerator-denominator đúng','Phân tích Actual vs Target, Gap và Achievement','Đọc contribution, mix và variance mà không “average of averages” sai'],
      useCases:['Sales KPI: Revenue, Orders, AOV, UPT','QC: Input, NG, NG Rate','Traffic: Visitors, Orders, Conversion','Target vs Actual theo Store/Staff/Time'],
      sections:[
        {
          title:'Metric, Dimension và Grain',kind:'core',
          why:'Ba khái niệm này quyết định một KPI có ý nghĩa hay bị double-count.',
          body:['Metric là đại lượng như Revenue, Qty, Orders. Dimension là chiều phân tích như Store, Date, Product. Grain là “một dòng đại diện cái gì”.','Nếu source là Order-Line, Revenue/Qty có thể sum theo line nhưng Orders không thể chỉ COUNTA Order_ID nếu một Order có nhiều line. Cần unique order logic hoặc flag.'],
          questions:[
            {q:'Store trong “Revenue theo Store” là?',options:['Dimension','Metric','Formula','Error'],answer:0,explain:'Store là chiều nhóm; Revenue là metric.'},
            {q:'Grain Order-Line ảnh hưởng Orders vì?',options:['Một Order có thể xuất hiện nhiều dòng','Date bị xóa','Revenue là Text luôn','Pivot không dùng được'],answer:0,explain:'Đếm line sẽ double-count đơn nếu một order có nhiều sản phẩm.'}
          ]
        },
        {
          title:'Rate và denominator đúng',kind:'core',
          why:'Tỷ lệ đúng phải dùng đúng mẫu số; lấy trung bình các tỷ lệ nhóm thường gây sai.',
          body:['NG Rate = Total NG / Total Input nếu nghiệp vụ định nghĩa như vậy. Conversion = Orders / Visitors. Achievement = Actual / Target. Hãy viết rõ numerator và denominator.','Không nên AVERAGE(NG Rate từng ngày) khi Input mỗi ngày khác nhau nếu mục tiêu là rate tổng kỳ. Rate tổng đúng thường = SUM(NG)/SUM(Input), một weighted result theo denominator.'],
          example:{title:'Ví dụ',text:'Ngày 1: 1/10 =10%, Ngày 2: 9/90=10% thì average vẫn 10%. Nhưng nếu ngày 1=1/2=50%, ngày 2=9/98≈9.18%, average hai rate≈29.59% trong khi tổng=10/100=10%.'},
          questions:[
            {q:'Rate tổng kỳ thường nên tính?',options:['Tổng numerator / tổng denominator','AVERAGE mọi rate con luôn luôn','MAX rate','COUNT rate'],answer:0,explain:'Tổng numerator/denominator phản ánh trọng số tự nhiên của từng nhóm.'},
            {q:'Conversion Rate thường là?',options:['Orders / Visitors','Visitors / Revenue','Revenue + Orders','Orders * Visitors'],answer:0,explain:'Định nghĩa phổ biến của conversion là số hành động mua trên lượt khách đủ điều kiện.'}
          ]
        },
        {
          title:'Actual, Target, Gap và Achievement',kind:'core',
          why:'Target analysis không chỉ là phần trăm đạt; cần biết thiếu bao nhiêu và kỳ target nào đang so.',
          body:['Gap thường = Actual - Target; Achievement = Actual / Target. Với chỉ tiêu “càng thấp càng tốt” như defect rate, cách diễn giải Achievement có thể khác và không nên dùng cùng semantic màu một cách máy móc.','Target cần đúng grain/kỳ: target tháng không thể so trực tiếp actual 10 ngày nếu không có target-to-date phù hợp. Khi filter thời gian, phân biệt Monthly Target và Target phân bổ theo khoảng chọn.'],
          questions:[
            {q:'Actual 80, Target 100 thì Gap (Actual-Target) là?',options:['20','-20','80%','180'],answer:1,explain:'80-100=-20. Achievement là 80% nhưng Gap là -20 đơn vị.'},
            {q:'So actual 10 ngày với nguyên target tháng có thể gây?',options:['Đánh giá sai tiến độ nếu không dùng target-to-date','Luôn chính xác','Tự sửa dữ liệu','Không ảnh hưởng'],answer:0,explain:'Scope thời gian numerator/target phải tương thích.'}
          ]
        },
        {
          title:'AOV, UPT, ASP và KPI thương mại',kind:'core',
          why:'Các KPI thương mại có denominator khác nhau và dễ bị nhầm.',
          body:['AOV thường = Revenue / Orders. UPT = Units / Orders. ASP = Revenue / Units. Ba chỉ số nhìn giống ratio nhưng trả lời câu hỏi khác nhau.','Một Order nhiều line yêu cầu Orders unique; Units có thể là Qty sau return tùy nghiệp vụ; Revenue có thể Gross/Net. Luôn ghi rõ định nghĩa trong báo cáo.'],
          questions:[
            {q:'Revenue=1,000; Orders=10 thì AOV?',options:['100','10','1000','0.01'],answer:0,explain:'AOV = Revenue / Orders = 100.'},
            {q:'ASP dùng denominator nào phổ biến?',options:['Units/Qty','Orders','Visitors','Stores'],answer:0,explain:'Average Selling Price thường là Revenue / Units.'}
          ]
        },
        {
          title:'Contribution, Mix và variance',kind:'core',
          why:'Biết nhóm nào lớn chưa đủ; cần hiểu nhóm đóng góp bao nhiêu vào tổng và thay đổi ra sao.',
          body:['Contribution/Mix % = Metric của nhóm / Total Metric. Variance có thể là chênh lệch tuyệt đối hoặc % so kỳ trước/target. Cần ghi rõ base để tránh “tăng 20%” mà không biết so với gì.','Khi total thay đổi, mix có thể giảm dù giá trị nhóm tăng. Vì vậy đọc cả absolute value và mix, không chỉ một trong hai.'],
          questions:[
            {q:'Store A Revenue 200 trên total 1000 thì contribution?',options:['20%','200%','5%','80%'],answer:0,explain:'Contribution = 200/1000 = 20%, tức Store A đóng góp một phần năm tổng Revenue.'},
            {q:'Giá trị nhóm tăng nhưng mix giảm có thể xảy ra?',options:['Có, nếu total tăng nhanh hơn','Không','Chỉ nếu lỗi công thức','Chỉ khi màu'],answer:0,explain:'Mix là tỷ trọng tương đối; mẫu số thay đổi mạnh có thể làm tỷ trọng giảm.'}
          ]
        },
        {
          title:'KPI control và “single source of truth”',kind:'extension',
          why:'KPI cần một định nghĩa nhất quán giữa các Sheet/report để tránh mỗi người tính một kiểu.',
          body:['Tạo glossary nhỏ: KPI, công thức, grain, source, time scope, owner. Khi dashboard và báo cáo dùng cùng một KPI, chúng phải lấy cùng definition.','Control nên có total reconciliation, row count, date range và filter context. Nếu KPI thay đổi vì business rule mới, ghi version/effective date thay vì âm thầm sửa.'],
          questions:[
            {q:'KPI glossary nên chứa?',options:['Định nghĩa, công thức, source/grain','Chỉ màu','Chỉ font','Password'],answer:0,explain:'Metadata giúp người dùng hiểu và tái tạo KPI nhất quán.'},
            {q:'Business rule KPI đổi giữa tháng nên?',options:['Ghi rõ effective date/version','Âm thầm thay công thức','Xóa lịch sử','Chỉ đổi màu'],answer:0,explain:'Versioning giúp audit và giải thích số liệu trước/sau thay đổi.'}
          ]
        }
      ]
    },
    {
      id:'a16-charts-pareto',order:16,zone:'analysis',level:'Phân tích & Báo cáo',duration:'75–90 phút',version:'Excel 2016+',
      title:'Biểu đồ và Pareto: trực quan hóa đúng câu hỏi',short:'Column/Bar/Line/Combo, Pareto 80/20, cumulative %, label và lỗi chart gây hiểu sai.',
      hook:'Biểu đồ không để trang trí. Mỗi chart nên trả lời một câu hỏi: so sánh, xu hướng, cơ cấu hay ưu tiên vấn đề.',
      prerequisites:['a15-kpi-analysis'],
      outcomes:['Chọn chart theo câu hỏi','Thiết kế axis/title/label dễ đọc','Tạo và đọc Pareto đúng logic','Tránh 3D, quá nhiều màu và trục gây hiểu nhầm'],
      useCases:['So Revenue theo Store','Trend theo ngày/tháng','Top defect và Pareto','Actual vs Target trên cùng biểu đồ'],
      sections:[
        {
          title:'Chọn chart theo mục đích',kind:'core',
          why:'Sai loại chart khiến người đọc phải “giải mã” hình thay vì thấy insight.',
          body:['Column/Bar phù hợp so sánh category; Line phù hợp xu hướng theo thời gian; Combo hữu ích khi hai metric khác bản chất cần cùng context; Scatter dùng mối quan hệ hai biến số.','Pie/Donut chỉ nên dùng rất hạn chế với ít category và mục tiêu phần-trên-tổng rõ. Khi có nhiều nhóm, Bar thường dễ so sánh hơn góc/diện tích.'],
          questions:[
            {q:'Trend Revenue 12 tháng phù hợp nhất thường là?',options:['Line chart','3D Pie','Radar mặc định','WordArt'],answer:0,explain:'Line thể hiện thay đổi theo trình tự thời gian rõ.'},
            {q:'So 15 Store theo Revenue nên ưu tiên?',options:['Bar/Column','Pie 15 lát','3D cone','Không cần axis'],answer:0,explain:'Bar/Column cho so chiều dài dễ hơn nhiều lát pie.'}
          ]
        },
        {
          title:'Title, axis, label và baseline',kind:'core',
          why:'Chart đẹp nhưng thiếu đơn vị hoặc trục bị cắt có thể làm người đọc hiểu sai mức chênh lệch.',
          body:['Title nên nói metric + scope, ví dụ “Revenue theo Store – Sep 2026”, không chỉ “Chart 1”. Axis cần đơn vị; Data Label chỉ dùng khi giúp đọc, không phủ kín chart.','Bar/Column thường nên bắt đầu trục value từ 0 để không phóng đại chênh lệch, trừ khi có lý do phân tích rõ và ghi chú. Line chart có thể dùng range phù hợp nhưng vẫn cần minh bạch.'],
          questions:[
            {q:'Tiêu đề nào rõ hơn?',options:['Chart 1','Revenue theo Store – Sep 2026'],answer:1,explain:'Tiêu đề có metric và scope giúp người đọc biết đang xem gì.'},
            {q:'Cắt trục Column từ 95 thay vì 0 có rủi ro?',options:['Phóng đại chênh lệch nhỏ','Không ảnh hưởng nhận thức','Tự sửa số','Tạo duplicate'],answer:0,explain:'Chiều dài cột được so theo baseline; baseline cao làm khác biệt trông lớn bất thường.'}
          ]
        },
        {
          title:'Actual vs Target và Combo Chart',kind:'core',
          why:'Actual/Target thường cần cả giá trị và xu hướng/achievement, nhưng không nên dùng quá nhiều trục.',
          body:['Có thể dùng clustered columns Actual vs Target hoặc combo column + line tùy mục tiêu. Secondary Axis chỉ dùng khi hai scale khác biệt có ý nghĩa; ghi đơn vị rõ để tránh so trực tiếp hai thang đo khác nhau.','Màu semantic: Actual xanh chủ đạo, Target có thể line trung tính; cảnh báo under-target đỏ nhạt khi cần. Đừng tô mỗi Store một màu nếu màu không mang ý nghĩa.'],
          questions:[
            {q:'Secondary Axis nên dùng khi?',options:['Hai metric scale khác nhau và cần context chung, có ghi đơn vị rõ','Muốn chart nhiều màu','Không biết chọn chart','Mọi báo cáo'],answer:0,explain:'Secondary axis dễ gây hiểu nhầm nên chỉ dùng có mục đích.'},
            {q:'Màu trên chart nên?',options:['Có quy ước/ý nghĩa nhất quán','Mỗi cột một màu ngẫu nhiên','Càng neon càng tốt','Không cần contrast'],answer:0,explain:'Semantic color giúp người đọc giải mã nhanh và đồng nhất với UI/report.'}
          ]
        },
        {
          title:'Pareto: sắp giảm dần và cumulative %',kind:'core',
          why:'Pareto giúp ưu tiên nhóm nguyên nhân đóng góp lớn, không phải chứng minh mọi vấn đề “đúng 80/20”.',
          body:['Bước cơ bản: tổng hợp số lượng/impact theo category, Sort giảm dần, tính % mỗi nhóm và % tích lũy. Pareto thường dùng cột cho giá trị và line cho cumulative %.','Mốc 80% là heuristic phổ biến, không phải định luật bắt buộc. Mục tiêu là nhìn nhóm ít category nhưng đóng góp phần lớn impact để ưu tiên điều tra.'],
          example:{title:'Ví dụ',text:'Scratch 40, Open 25, Short 15, Other 20 trên total 100. Ba nhóm đầu cumulative =80%; đây là vùng ưu tiên, nhưng vẫn cần context về severity/cost.'},
          questions:[
            {q:'Trước tính cumulative % trong Pareto nên?',options:['Sort category theo impact giảm dần','Sort alphabet','Merge','Ẩn total'],answer:0,explain:'Pareto cần thứ tự contribution giảm dần để cumulative thể hiện ưu tiên.'},
            {q:'80/20 trong Pareto nên hiểu?',options:['Nguyên tắc định hướng, không phải luôn đúng chính xác','Mọi dữ liệu bắt buộc 80% từ 20%','Một công thức Excel','Một loại Date'],answer:0,explain:'Phân bố thực tế có thể khác; insight nằm ở concentration of impact.'}
          ]
        },
        {
          title:'Chart hygiene: giảm nhiễu, tăng thông tin',kind:'core',
          why:'Gridline, 3D, shadow và label quá nhiều có thể che dữ liệu.',
          body:['Loại những thành phần không giúp trả lời câu hỏi: legend thừa, border nặng, 3D perspective, quá nhiều decimal. Làm nổi bật 1–2 điểm cần chú ý, phần còn lại giữ neutral.','Sắp category có chủ đích: theo thời gian, giảm dần, hoặc business order. Không sort alphabet nếu mục tiêu là thấy top/bottom.'],
          questions:[
            {q:'3D chart thường có nhược điểm?',options:['Làm so sánh kích thước khó và có thể méo cảm nhận','Luôn chính xác hơn','Tự giảm file size','Tạo Filter'],answer:0,explain:'Perspective 3D thêm nhiễu và làm chiều dài/diện tích khó so.'},
            {q:'Top Store chart nên sort thế nào để đọc nhanh?',options:['Revenue giảm dần','Tên alphabet luôn','Ngẫu nhiên','Theo màu'],answer:0,explain:'Sort theo metric làm rank trực quan ngay.'}
          ]
        },
        {
          title:'Khi chart cần data control phía sau',kind:'extension',
          why:'Chart chỉ hiển thị; nó không chứng minh source đúng.',
          body:['Giữ bảng hỗ trợ/control với total, filter scope, date range và số category. Nếu chart Top 5, cho biết nó là Top 5 theo metric nào và scope nào.','Khi chart phản ứng Slicer/Filter, tiêu đề động hoặc context label giúp người đọc biết trạng thái hiện tại. Dashboard sẽ phát triển tiếp nguyên tắc này.'],
          questions:[
            {q:'Chart Top 5 cần ghi rõ gì?',options:['Metric và scope/filter','Chỉ màu','Tên người thiết kế','Kích thước file'],answer:0,explain:'Top 5 không có nghĩa nếu không biết xếp theo gì và trong phạm vi nào.'},
            {q:'Chart có tự chứng minh source đúng không?',options:['Không','Có luôn','Chỉ PivotChart','Chỉ 365'],answer:0,explain:'Visualization là lớp output; data control phải được thực hiện ở source/model.'}
          ]
        }
      ]
    },
    {
      id:'a17-dashboard',order:17,zone:'analysis',level:'Phân tích & Báo cáo',duration:'90–120 phút',version:'Excel 2016+ · Dynamic features tùy phiên bản',
      title:'Dashboard Excel: bố cục, KPI và tương tác',short:'KPI cards, hierarchy, Slicer/Timeline, chart layout, filter context và dashboard không rối.',
      hook:'Dashboard tốt giúp người xem biết “đang ra sao, vấn đề ở đâu, cần làm gì” trong vài giây. Dashboard xấu chỉ là nhiều chart đặt cùng một trang.',
      prerequisites:['a14-pivottable','a15-kpi-analysis','a16-charts-pareto'],
      outcomes:['Thiết kế hierarchy KPI → trend → breakdown','Chọn số lượng visual hợp lý','Dùng Slicer/Timeline và hiển thị filter context','Tạo layout desktop rõ, cân đối và semantic color nhất quán'],
      useCases:['Dashboard Sales theo Store/Staff/Date','QC dashboard Input/NG/Top Defect','Traffic conversion dashboard','Management one-page report'],
      sections:[
        {
          title:'Dashboard phải trả lời 3 câu hỏi',kind:'core',
          why:'Không có câu hỏi thì dashboard dễ trở thành bộ sưu tập chart.',
          body:['Ba câu hỏi cơ bản: Hiện trạng ra sao? Vấn đề/cơ hội nằm ở đâu? Cần ưu tiên hành động gì? KPI cards trả lời hiện trạng; trend cho biết hướng đi; breakdown/top list chỉ ra vị trí vấn đề.','Mỗi visual phải có vai trò. Nếu một chart không giúp câu hỏi nào, hãy cân nhắc bỏ để tăng signal-to-noise.'],
          questions:[
            {q:'Dashboard tốt nên ưu tiên?',options:['Trả lời câu hỏi ra quyết định','Càng nhiều chart càng tốt','Mỗi chart một màu','Font thật nhỏ'],answer:0,explain:'Mục tiêu là insight/action, không phải mật độ visual.'},
            {q:'KPI card thường trả lời tốt nhất?',options:['Hiện trạng tổng quan','Chi tiết từng giao dịch','Code VBA','Data cleaning'],answer:0,explain:'KPI card tóm tắt metric quan trọng ở cấp cao.'}
          ]
        },
        {
          title:'Hierarchy và grid layout desktop',kind:'core',
          why:'Người học Excel chủ yếu xem dashboard desktop; khoảng cách và tỷ lệ cần ổn định.',
          body:['Dùng grid: hàng KPI trên cùng, vùng trend chính, vùng breakdown/top issues bên dưới hoặc bên cạnh. Các card cùng nhóm nên cùng chiều cao, padding và font scale.','Giữ khoảng trắng đủ để nhóm nội dung. Không ép tất cả vào một màn hình bằng cách giảm font; một dashboard cuộn nhẹ nhưng rõ còn tốt hơn một màn hình dày đặc.'],
          tip:'Căn theo lưới và dùng Align/Distribute giúp object đều hơn thay vì kéo mắt thường.',
          questions:[
            {q:'Các KPI card cùng nhóm nên?',options:['Cùng kích thước/hierarchy nhất quán','Mỗi card một kích thước','Xếp chồng tùy ý','Dùng font khác nhau'],answer:0,explain:'Consistency giúp người đọc so sánh và tạo cảm giác chuyên nghiệp.'},
            {q:'Khi dashboard quá chật, giải pháp tốt?',options:['Giảm số visual hoặc tổ chức lại hierarchy','Thu font xuống 6pt','Chồng chart','Bỏ title'],answer:0,explain:'Giảm nhiễu và tổ chức lại tốt hơn hy sinh readability.'}
          ]
        },
        {
          title:'Slicer, Timeline và filter context',kind:'core',
          why:'Dashboard tương tác phải luôn cho người xem biết mình đang lọc gì.',
          body:['Slicer có thể điều khiển một hoặc nhiều PivotTables qua Report Connections nếu cùng nguồn/cache phù hợp. Timeline phục vụ date.','Khi có nhiều filter, thêm context như “Sep 2026 · All Stores · Region North” hoặc title động nếu thiết kế cho phép. Người dùng không nên đọc KPI mà quên đang lọc một Store.'],
          warning:'Slicer không kết nối đúng tất cả Pivot có thể tạo dashboard “nửa lọc nửa không”, rất nguy hiểm.',
          questions:[
            {q:'Một Slicer chỉ lọc một Pivot trong khi chart khác không đổi có thể do?',options:['Report Connections/cache chưa được kết nối đúng','Font','Zoom','Password'],answer:0,explain:'Slicer cần connection đến các Pivot cần điều khiển.'},
            {q:'Tại sao hiển thị filter context quan trọng?',options:['Tránh người xem hiểu KPI là toàn bộ dữ liệu khi đang lọc','Để tăng màu','Để tạo macro','Để giảm row count'],answer:0,explain:'Context là một phần của ý nghĩa số liệu.'}
          ]
        },
        {
          title:'Semantic color và highlight',kind:'core',
          why:'Màu phải có nghĩa: đúng/tốt, cảnh báo, sai; không dùng highlight mọi thứ cùng lúc.',
          body:['Giữ xanh–trắng làm nền chính. Dùng green cho pass/positive khi phù hợp nghiệp vụ, amber cho warning, red cho fail/error. Nhưng với KPI “càng thấp càng tốt”, tăng lên có thể là đỏ dù số lớn.','Highlight một insight bằng accent mạnh hơn; phần còn lại dùng tone nhạt. Nếu mọi card đều nổi bật, không còn thứ gì thực sự nổi bật.'],
          questions:[
            {q:'Defect Rate tăng mạnh nên màu xanh vì số tăng?',options:['Không; semantic phải theo ý nghĩa KPI','Có, tăng luôn tốt','Chỉ trên QC','Không dùng màu'],answer:0,explain:'Màu phản ánh performance/meaning, không phản ánh dấu tăng giảm đơn thuần.'},
            {q:'Nếu mọi thành phần đều highlight mạnh?',options:['Hierarchy bị mất','Dashboard chắc chắn tốt hơn','Tự sửa dữ liệu','Không ảnh hưởng'],answer:0,explain:'Highlight chỉ có tác dụng khi có contrast với nền/element bình thường.'}
          ]
        },
        {
          title:'KPI cards, trend và breakdown phải cùng definition',kind:'core',
          why:'Một dashboard có Revenue card khác definition với Revenue chart sẽ mất độ tin cậy.',
          body:['Tất cả visual dùng cùng metric cần dựa cùng source/logic/filter context. Nếu card dùng Net Revenue nhưng chart dùng Gross Revenue, phải ghi rõ hoặc sửa model.','Control tổng dashboard nên đối soát KPI card với tổng từ source/Pivot, kiểm tra date range và filter. Số “đẹp” không thay thế reconciliation.'],
          questions:[
            {q:'Card Revenue và chart Revenue dùng hai definition khác nhau nhưng cùng nhãn có vấn đề?',options:['Có, gây mâu thuẫn và mất trust','Không','Chỉ nếu màu khác','Chỉ mobile'],answer:0,explain:'Cùng nhãn phải cùng định nghĩa hoặc được phân biệt rõ.'},
            {q:'Control tốt cho dashboard là?',options:['Đối soát KPI tổng với source/model','Chỉ nhìn chart','Chỉ kiểm tra logo','Ẩn filter'],answer:0,explain:'Reconciliation xác nhận số hiển thị đúng logic nguồn.'}
          ]
        },
        {
          title:'Data Model/DAX như lớp mở rộng',kind:'extension',version:'Power Pivot/Data Model tùy edition/OS',
          why:'Khi dashboard có nhiều bảng relationship và measure, Data Model có thể giảm công thức trung gian.',
          body:['Data Model cho phép relationship giữa Fact và Dimension; DAX Measure tính metric theo filter context. Đây là bước nâng cao, không bắt người mới học trước khi hiểu grain/Pivot/KPI.','Calculated Column và Measure khác vai trò: column tính theo row context và lưu theo dòng; measure tính động theo filter context. Khi mô hình lớn, hiểu difference này quan trọng.'],
          questions:[
            {q:'DAX Measure phù hợp với?',options:['Metric tính động theo filter context trong Data Model','Đổi font','Làm sạch text cơ bản','Save As'],answer:0,explain:'Measure là biểu thức tính trong model, phản ứng filter/slicer.'},
            {q:'Có nên học DAX trước khi hiểu grain và Pivot cơ bản?',options:['Không; nền dữ liệu/KPI nên rõ trước','Có bắt buộc','Không cần Excel','Chỉ học Macro'],answer:0,explain:'DAX mạnh nhưng không thay thế tư duy data model cơ bản.'}
          ]
        }
      ]
    },
    {
      id:'a18-report-audit-handover',order:18,zone:'analysis',level:'Phân tích & Báo cáo',duration:'75–90 phút',version:'Excel 2016+',
      title:'Kiểm tra, in ấn và bàn giao báo cáo Excel',short:'Reconciliation, formula audit, print setup, protect cơ bản, versioning và checklist giao file.',
      hook:'Một file chỉ “xong” khi người khác có thể mở, hiểu, refresh/nhập liệu đúng và tin số. Bàn giao là một phần của kỹ năng Excel, không phải việc sau cùng làm cho có.',
      prerequisites:['a15-kpi-analysis','a17-dashboard'],
      outcomes:['Tạo checklist kiểm tra trước bàn giao','Đối soát tổng và phát hiện formula hardcode/error','Thiết lập Print Area/Page Layout cơ bản','Phân biệt Protect Sheet với bảo mật thực sự và quản lý version'],
      useCases:['Gửi báo cáo tuần/tháng cho quản lý','Bàn giao template nhập liệu cho đồng nghiệp','Khóa vùng công thức khỏi sửa nhầm','Chuẩn bị file in/PDF một trang'],
      sections:[
        {
          title:'Reconciliation và control sheet',kind:'core',
          why:'Báo cáo cần bằng chứng số liệu đi từ source đến output không bị mất/nhân.',
          body:['Tạo các control như row count, min/max date, total Revenue/Qty, unique key, source file count và status PASS/CHECK. Control nên độc lập với phần trình bày dashboard.','Đối soát theo tầng: Raw → Clean/Model → Pivot/Report. Nếu total lệch, xác định tầng bắt đầu lệch thay vì sửa trực tiếp chart.'],
          questions:[
            {q:'Khi dashboard total lệch source, nên?',options:['Tìm tầng transformation bắt đầu lệch','Sửa số trên chart','Ẩn source','Đổi màu'],answer:0,explain:'Trace lineage giúp tìm root cause; hardcode output chỉ che lỗi.'},
            {q:'Control sheet nên chứa?',options:['Các chỉ số kiểm chứng như row count/total/date range','Chỉ logo','Chỉ password','Chỉ chart'],answer:0,explain:'Control cung cấp bằng chứng kỹ thuật của data integrity.'}
          ]
        },
        {
          title:'Audit công thức, hardcode và lỗi',kind:'core',
          why:'Một vài ô bị paste value trong cột formula có thể làm báo cáo âm thầm sai.',
          body:['Dùng Show Formulas (Ctrl+`) để nhìn pattern; Go To Special → Formulas/Constants để tìm hardcode bất thường; Trace Precedents/Dependents và Evaluate Formula hỗ trợ debug công thức phức tạp.','Tìm #REF!, #N/A, #DIV/0!, #VALUE! và xác định chúng là lỗi thật hay exception được phép. Không chỉ IFERROR che hết trước khi bàn giao.'],
          tip:'F9 trong lúc chọn một phần biểu thức trong Formula Bar có thể evaluate phần đó trong một số tình huống, nhưng cẩn thận Esc để không ghi thay giá trị công thức.',
          questions:[
            {q:'Muốn tìm một ô value nằm giữa cột đáng lẽ toàn formula, có thể dùng?',options:['Go To Special → Constants','Merge','Print Area','Theme'],answer:0,explain:'Constants giúp phát hiện hardcode khác pattern formula.'},
            {q:'IFERROR mọi nơi có thay thế formula audit không?',options:['Không','Có hoàn toàn','Chỉ 365','Chỉ Pivot'],answer:0,explain:'IFERROR có thể che lỗi; audit vẫn cần xác định root cause.'}
          ]
        },
        {
          title:'Page Layout, Print Area và Fit to Page',kind:'core',
          why:'Một báo cáo tốt trên màn hình có thể in/PDF rất xấu nếu không thiết lập trang.',
          body:['Page Layout gồm Orientation, Size, Margins, Print Area, Breaks, Scale/Fit to Page. Dùng Page Break Preview để xem vùng chia trang.','Fit Sheet on One Page có thể thu nhỏ quá mức với bảng lớn. Đừng ép 50 cột vào một trang A4; hãy chọn vùng cần in hoặc thiết kế report riêng.'],
          questions:[
            {q:'Fit to One Page với bảng cực rộng có rủi ro?',options:['Chữ bị thu quá nhỏ','Tự làm số sai','Xóa cột','Tạo Macro'],answer:0,explain:'Scaling chỉ để vừa trang có thể làm output không đọc được.'},
            {q:'Muốn in đúng một vùng báo cáo, có thể dùng?',options:['Print Area','COUNTIF','XLOOKUP','Data Validation'],answer:0,explain:'Print Area xác định vùng được đưa vào in/PDF.'}
          ]
        },
        {
          title:'Protect Sheet, Locked Cells và giới hạn bảo vệ',kind:'core',
          why:'Protect giúp tránh sửa nhầm, nhưng không phải cơ chế bảo mật mạnh cho dữ liệu bí mật.',
          body:['Cell có thuộc tính Locked nhưng chỉ có hiệu lực khi Protect Sheet bật. Với template nhập liệu, có thể unlock vùng input rồi protect sheet để người dùng chỉ nhập đúng vùng.','Protect Sheet/Workbook không nên được coi là mã hóa bảo mật cấp cao. Nếu dữ liệu nhạy cảm, dùng hệ thống quyền truy cập phù hợp; password Excel cần được quản lý theo chính sách tổ chức.'],
          questions:[
            {q:'Locked cell có tác dụng chặn sửa khi?',options:['Sheet được Protect','Luôn luôn','Ô màu xanh','Có Filter'],answer:0,explain:'Locked là thuộc tính được thực thi khi Protect Sheet bật.'},
            {q:'Protect Sheet có phải giải pháp bảo mật mạnh cho dữ liệu nhạy cảm?',options:['Không nên coi như vậy','Có tuyệt đối','Chỉ trên Windows','Chỉ .xlsm'],answer:0,explain:'Nó chủ yếu hạn chế thao tác/sửa, không thay thế access control/encryption chuyên dụng.'}
          ]
        },
        {
          title:'Versioning, file naming và đường dẫn nguồn',kind:'core',
          why:'Bàn giao thất bại thường vì không biết đâu là file mới nhất hoặc query đang trỏ tới máy người tạo.',
          body:['Tên file nên có nội dung/version/date nếu cần, ví dụ Sales_KPI_2026-09_v03.xlsx. Tránh final_final_new2.xlsx. Nếu có Power Query/external link, kiểm tra đường dẫn có dùng được trên máy người nhận.','Giữ một Master rõ, bản Working riêng và chỉ bàn giao bản đã kiểm tra. Trước giao, xóa helper/test sheet không cần thiết hoặc ẩn có chủ đích, nhưng không âm thầm thay sheet name/order nếu hệ thống phụ thuộc.'],
          questions:[
            {q:'Tên nào dễ quản lý version hơn?',options:['final_final2.xlsx','Sales_KPI_2026-09_v03.xlsx'],answer:1,explain:'Tên có scope/date/version giúp xác định bản theo quy ước.'},
            {q:'Power Query trỏ tới C:\Users\YourName\Desktop có rủi ro khi bàn giao?',options:['Người nhận có thể không có đường dẫn đó','Không có','Tự đổi đường dẫn','Chỉ ảnh hưởng chart'],answer:0,explain:'Absolute local path thường không tồn tại trên máy khác.'}
          ]
        },
        {
          title:'Checklist bàn giao một file Excel chuyên nghiệp',kind:'extension',
          why:'Checklist biến kiểm tra cuối thành quy trình lặp, tránh phụ thuộc trí nhớ.',
          body:['Checklist gợi ý: source đầy đủ; refresh PASS; control PASS; công thức không lỗi; filter đã reset theo mong muốn; hidden rows/sheets đã kiểm tra; print/PDF đúng; link nguồn hợp lệ; hướng dẫn sử dụng rõ; thay đổi so bản gốc được ghi lại.','Nếu file có input, ghi rõ nơi nhập, nơi không sửa và cách refresh. Nếu có macro, ghi yêu cầu enable và rủi ro. Nếu có dữ liệu còn thiếu, ghi Deferred/Limitations thay vì bịa dữ liệu để “xong”.'],
          questions:[
            {q:'Thiếu dữ liệu đầu vào nhưng deadline tới, cách bàn giao tốt?',options:['Ghi rõ limitation/deferred và phần đã PASS','Tự bịa dữ liệu','Xóa control','Che lỗi'],answer:0,explain:'Minh bạch phạm vi giúp người nhận biết mức tin cậy và việc còn lại.'},
            {q:'File nhập liệu nên có hướng dẫn gì?',options:['Vùng nhập, vùng không sửa, cách refresh/kiểm tra','Chỉ logo','Chỉ màu','Không cần'],answer:0,explain:'Hướng dẫn vận hành là phần của deliverable, giảm lỗi người dùng.'}
          ]
        }
      ]
    }
  ];
  window.AVPKnowledgeLessons = (window.AVPKnowledgeLessons || []).concat(lessons);
})();
