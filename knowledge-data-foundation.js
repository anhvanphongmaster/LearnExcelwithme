(() => {
  'use strict';
  const lessons = [
    {
      id:'f01-excel-workspace',order:1,zone:'foundation',level:'Nền tảng',duration:'35–45 phút',version:'Excel 2016+',
      title:'Làm quen Excel và cách một file hoạt động',short:'Workbook, Sheet, ô, vùng, Ribbon và cách di chuyển đúng ngay từ đầu.',
      hook:'Nếu chưa hiểu Workbook, Sheet, ô và vùng dữ liệu, những thao tác sau này rất dễ trở thành học thuộc nút. Bài này giúp bạn nhìn Excel như một hệ thống có cấu trúc thay vì một màn hình đầy ô.',
      prerequisites:[],
      outcomes:['Phân biệt Workbook, Worksheet, Row, Column, Cell và Range','Đọc được địa chỉ ô/vùng và biết mình đang chọn gì','Di chuyển, chọn vùng, thêm/đổi tên sheet và lưu file an toàn','Nhận biết các vùng giao diện cần dùng hằng ngày'],
      useCases:['Mở một file do đồng nghiệp gửi và hiểu cấu trúc trước khi sửa','Đi tới đúng ô/vùng khi người khác nói “kiểm tra D2:D500”','Tạo file mới có các sheet Data, Report và Danh mục rõ ràng'],
      sections:[
        {
          title:'Workbook, Worksheet và cấu trúc file',kind:'core',
          why:'Excel không chỉ là một bảng. Một file có thể chứa nhiều trang tính phục vụ dữ liệu nguồn, tính toán và báo cáo.',
          body:['Workbook là toàn bộ file Excel, ví dụ BaoCao_Thang9.xlsx. Worksheet (Sheet) là từng trang tính bên trong file. Một Workbook có thể chứa nhiều Sheet và mỗi Sheet có lưới gồm dòng, cột, ô.','Người mới thường trộn dữ liệu nguồn, danh mục và báo cáo vào một Sheet. Cách này có thể dùng với file rất nhỏ nhưng sẽ khó kiểm tra khi dữ liệu lớn. Ngay từ đầu hãy tập tư duy: dữ liệu nguồn ở đâu, phần tính toán ở đâu, phần trình bày ở đâu.'],
          example:{title:'Ví dụ công việc',text:'File TheoDoiBanHang.xlsx có Sheet Data để nhập giao dịch, Sheet DM_Store để lưu danh mục cửa hàng và Sheet Report để tổng hợp. Ba Sheet vẫn thuộc cùng một Workbook.'},
          tip:'Đổi tên Sheet theo chức năng thay vì Sheet1, Sheet2. Tên ngắn, rõ và ổn định sẽ giúp công thức, Power Query và người bàn giao dễ hiểu hơn.',
          questions:[
            {q:'Workbook trong Excel là gì?',options:['Một ô đang được chọn','Toàn bộ file Excel có thể chứa nhiều Sheet','Một vùng dữ liệu','Một công thức'],answer:1,explain:'Workbook là toàn bộ file. Ô và vùng chỉ là thành phần bên trong Worksheet; công thức là nội dung có thể nằm trong ô.'},
            {q:'Cách tổ chức nào dễ kiểm soát hơn khi file bắt đầu lớn?',options:['Dồn dữ liệu, danh mục và báo cáo vào một Sheet','Tách Data, danh mục và Report theo chức năng','Đặt tất cả Sheet tên Sheet1, Sheet2','Merge nhiều vùng để phân khu'],answer:1,explain:'Tách theo chức năng giúp nguồn, logic và đầu ra rõ ràng. Dồn chung hoặc merge để “chia khu” làm file khó bảo trì và dễ gây lỗi khi lọc/tổng hợp.'}
          ]
        },
        {
          title:'Row, Column, Cell, Range và địa chỉ ô',kind:'core',
          why:'Công thức, định dạng, lọc và hầu hết thao tác Excel đều tác động lên ô hoặc vùng. Đọc đúng địa chỉ là kỹ năng nền.',
          body:['Column được đánh dấu bằng chữ A, B, C…; Row được đánh dấu bằng số 1, 2, 3… Giao điểm tạo thành Cell. Vì vậy D5 là ô ở cột D, dòng 5.','Range là một vùng ô. A2:D20 nghĩa là vùng hình chữ nhật từ A2 tới D20. D2:D500 là một cột dữ liệu từ dòng 2 tới 500. Khi nhìn công thức SUM(D2:D500), bạn cần hiểu ngay Excel đang cộng những ô nào.'],
          example:{title:'Đọc địa chỉ',text:'Bảng có tiêu đề ở dòng 1, dữ liệu từ A2:F101. Khi yêu cầu “định dạng cột ngày C2:C101”, bạn không nên chọn cả Sheet hoặc chỉ chọn C2.'},
          questions:[
            {q:'Địa chỉ C7 có nghĩa gì?',options:['Cột 7, dòng C','Cột C, dòng 7','Sheet C, ô 7','Vùng từ C đến 7'],answer:1,explain:'Địa chỉ ô luôn đọc chữ cột trước và số dòng sau. Vì vậy C7 là cột C, dòng 7.'},
            {q:'A2:D10 là gì?',options:['Một công thức','Một vùng từ A2 đến D10','Bốn Sheet','Chỉ cột D'],answer:1,explain:'Dấu hai chấm biểu diễn vùng liên tục. A2:D10 bao gồm mọi ô trong hình chữ nhật từ A2 tới D10.'}
          ]
        },
        {
          title:'Ribbon, Formula Bar, Name Box và Sheet Tab',kind:'core',
          why:'Bạn không cần nhớ mọi nút trên Ribbon, nhưng phải biết tìm nhóm lệnh và kiểm tra nội dung thật của ô.',
          body:['Ribbon chia lệnh theo tab như Home, Insert, Page Layout, Formulas, Data, Review, View. Home phục vụ thao tác thường ngày; Data chứa Sort, Filter, Data Validation và công cụ dữ liệu; Formulas hỗ trợ hàm và kiểm tra công thức.','Formula Bar cho thấy giá trị/công thức thực đang nằm trong ô. Name Box hiển thị địa chỉ ô đang chọn và có thể dùng để nhảy nhanh tới một địa chỉ hoặc vùng. Sheet Tab ở đáy Workbook dùng để chuyển, thêm, đổi tên, di chuyển các Sheet.'],
          steps:['Bấm một ô có công thức và nhìn Formula Bar thay vì chỉ nhìn kết quả trong ô.','Gõ A500 vào Name Box rồi Enter để nhảy nhanh tới dòng 500.','Nhấp đúp tên Sheet hoặc dùng Rename để đặt tên rõ ràng.'],
          warning:'Giá trị hiển thị trong ô có thể khác nội dung thật do định dạng. Khi nghi ngờ, kiểm tra Formula Bar.',
          questions:[
            {q:'Muốn kiểm tra công thức thật đang nằm trong ô, nơi nào hữu ích nhất?',options:['Status Bar','Formula Bar','Sheet Tab','Scroll Bar'],answer:1,explain:'Formula Bar hiển thị nội dung/công thức của ô đang chọn. Status Bar chủ yếu hiển thị trạng thái và thống kê nhanh; Sheet Tab dùng chuyển Sheet.'},
            {q:'Name Box có thể giúp gì ngoài việc cho biết địa chỉ ô?',options:['Tạo PivotTable tự động','Nhảy nhanh tới một ô/vùng','Đổi màu toàn Workbook','Khóa file'],answer:1,explain:'Bạn có thể nhập địa chỉ như H250 hoặc A1:D20 vào Name Box để đi tới vùng đó. Nó không thay thế các công cụ phân tích hay bảo vệ file.'}
          ]
        },
        {
          title:'Chọn ô, chọn vùng và di chuyển hiệu quả',kind:'core',
          why:'Chọn sai vùng là nguyên nhân phổ biến khiến người mới định dạng nhầm, xóa nhầm hoặc copy thiếu dữ liệu.',
          body:['Một click chọn một ô; kéo chuột chọn vùng; click tiêu đề cột/dòng chọn cả cột/dòng. Với bảng dài, kết hợp bàn phím thường nhanh và chính xác hơn kéo chuột.','Ctrl + phím mũi tên đi tới biên của vùng dữ liệu liên tục. Ctrl + Shift + mũi tên vừa đi vừa mở rộng vùng chọn. Ctrl + Home về A1; Ctrl + End đi tới vùng Excel đang xem là điểm cuối đã sử dụng.'],
          tip:'Phím tắt nên học theo tình huống. Ở bài này chỉ cần nhớ Ctrl+Arrow, Ctrl+Shift+Arrow, Ctrl+Home và Ctrl+End; không cần học một danh sách 100 phím.',
          warning:'Ctrl+Arrow dừng ở khoảng trống. Nếu bảng có dòng/cột trống xen giữa, vùng chọn có thể không như bạn nghĩ. Luôn nhìn biên vùng trước khi xóa hoặc dán.',
          questions:[
            {q:'Muốn chọn nhanh từ ô hiện tại xuống cuối vùng dữ liệu liên tục, tổ hợp nào phù hợp?',options:['Ctrl + Shift + ↓','Ctrl + P','Alt + F4','Ctrl + B'],answer:0,explain:'Ctrl+Shift+↓ mở rộng vùng chọn tới biên dữ liệu. Ctrl+P là in; Alt+F4 đóng cửa sổ; Ctrl+B in đậm.'},
            {q:'Tại sao Ctrl+Arrow có thể dừng sớm?',options:['Vì file chưa lưu','Vì gặp ô trống/ngắt quãng trong vùng dữ liệu','Vì font khác nhau','Vì Sheet có màu'],answer:1,explain:'Ctrl+Arrow dựa trên biên vùng dữ liệu liên tục, nên khoảng trống có thể làm nó dừng. Định dạng hay màu Sheet không quyết định điểm dừng.'}
          ]
        },
        {
          title:'Tạo, đổi tên, di chuyển Sheet và lưu file',kind:'core',
          why:'Quản lý Sheet và định dạng file đúng giúp tránh mất dữ liệu, ghi đè bản gốc hoặc lưu sai loại file.',
          body:['Bạn có thể thêm, xóa, đổi tên, kéo thả để sắp xếp Sheet. Khi làm việc với file của người khác, hạn chế đổi tên Sheet tùy tiện vì công thức, Query hoặc VBA có thể phụ thuộc tên đó.','Ctrl+S lưu thay đổi vào file hiện tại. Save As tạo bản mới hoặc đổi định dạng. .xlsx là định dạng Workbook thông dụng không chứa VBA; .xlsm cho phép lưu macro; .csv chỉ lưu dữ liệu dạng bảng của một Sheet và không giữ công thức/định dạng như Workbook.'],
          steps:['Trước khi sửa file quan trọng, dùng Save As tạo bản Working.','Giữ tên Sheet ổn định nếu file có công thức, Query hoặc Macro.','Kiểm tra phần mở rộng trước khi đóng file, đặc biệt với .csv và .xlsm.'],
          warning:'Lưu Workbook có macro thành .xlsx có thể làm mất phần VBA. Lưu .csv cũng không giữ nhiều Sheet và định dạng Workbook.',
          questions:[
            {q:'Định dạng nào dùng phổ biến cho Workbook không cần VBA?',options:['.xlsx','.jpg','.txt','.mp3'],answer:0,explain:'.xlsx là định dạng Workbook tiêu chuẩn. Các lựa chọn còn lại không phải định dạng Workbook Excel.'},
            {q:'Khi cần sửa một file quan trọng nhưng muốn giữ nguyên bản gốc, thao tác an toàn hơn là gì?',options:['Sửa thẳng rồi Ctrl+S','Save As tạo bản Working','Xóa Sheet cũ','Đổi file thành .csv'],answer:1,explain:'Save As tạo một bản làm việc riêng, giảm nguy cơ ghi đè bản gốc. Chuyển sang CSV có thể làm mất cấu trúc Workbook.'}
          ]
        },
        {
          title:'Thói quen an toàn cho người mới',kind:'extension',
          why:'Học Excel nhanh không chỉ là biết nhiều lệnh; quan trọng là biết kiểm tra trước khi thao tác có thể phá dữ liệu.',
          body:['Trước thao tác lớn, xác định vùng đang chọn, kiểm tra Filter có bật không và hiểu bạn đang sửa dữ liệu nguồn hay báo cáo. Sau thao tác, kiểm tra lại vài dòng đầu/cuối hoặc tổng số dòng.','Undo (Ctrl+Z) rất hữu ích nhưng không nên là chiến lược bảo vệ duy nhất. Với file quan trọng, giữ bản gốc, đặt tên phiên bản rõ và lưu định kỳ vẫn an toàn hơn.'],
          tip:'Ctrl+S để lưu, Ctrl+Z để hoàn tác, Ctrl+F để tìm và Ctrl+Shift+L để bật/tắt Filter là nhóm phím tắt nên hình thành thói quen sớm.',
          questions:[
            {q:'Trước khi xóa một vùng lớn, điều gì nên kiểm tra đầu tiên?',options:['Màu giao diện','Vùng đang chọn và trạng thái Filter','Tên người tạo file','Kích thước màn hình'],answer:1,explain:'Vùng chọn và Filter quyết định trực tiếp bạn đang tác động lên dữ liệu nào. Màu giao diện hay màn hình không bảo vệ dữ liệu.'},
            {q:'Ctrl+Z nên được hiểu như thế nào?',options:['Thay thế hoàn toàn việc backup','Công cụ hoàn tác hữu ích nhưng không thay thế bản sao an toàn','Lệnh để đóng Excel','Lệnh để khóa Sheet'],answer:1,explain:'Undo giúp sửa lỗi thao tác gần nhất, nhưng lịch sử có giới hạn và có thể mất khi đóng file. Bản sao Working vẫn cần cho file quan trọng.'}
          ]
        }
      ]
    },
    {
      id:'f02-data-entry-types',order:2,zone:'foundation',level:'Nền tảng',duration:'45–60 phút',version:'Excel 2016+',
      title:'Nhập liệu, sửa dữ liệu và kiểu dữ liệu',short:'Text, Number, Date, %, mã có số 0 đầu, AutoFill và lỗi “số nhìn như số”.',
      hook:'Một bảng có thể nhìn rất đẹp nhưng vẫn tính sai nếu số đang là Text hoặc ngày không phải ngày thật. Đây là lỗi nền tảng ảnh hưởng trực tiếp tới SUM, Sort, Filter, Pivot và Power Query.',
      prerequisites:['f01-excel-workspace'],
      outcomes:['Phân biệt Text, Number, Date/Time, Percentage và Blank','Nhập mã có số 0 đầu mà không làm mất dữ liệu','Dùng AutoFill/Fill Series đúng mục đích','Nhận biết và sửa lỗi số/ngày lưu dạng Text'],
      useCases:['Nhập mã nhân viên, mã hàng, số điện thoại và ngày giao dịch','Nhận file từ nhiều người với kiểu dữ liệu không đồng nhất','Chuẩn bị bảng nguồn trước khi tính toán hoặc Pivot'],
      sections:[
        {
          title:'Excel lưu giá trị khác với cách nó hiển thị',kind:'core',
          why:'Hiểu “giá trị thật” giúp bạn không nhầm định dạng với dữ liệu.',
          body:['Ô có thể chứa Number, Text, Date/Time, logical TRUE/FALSE, công thức hoặc Blank. Number có thể được hiển thị thành tiền, phần trăm hay ngày tùy định dạng; việc đổi định dạng không nhất thiết thay đổi giá trị gốc.','Ngày trong Excel được lưu như số serial (trên hệ ngày mặc định). Vì vậy ngày thật có thể cộng trừ, Sort theo thời gian và dùng YEAR/MONTH. Một chuỗi nhìn giống 09/09/2026 nhưng lưu dưới dạng Text sẽ không hoạt động giống ngày thật.'],
          example:{title:'Ví dụ',text:'Ô A1 chứa 0.25. Nếu định dạng Percentage, màn hình hiển thị 25%. Giá trị dùng trong phép tính vẫn là 0.25.'},
          questions:[
            {q:'Đổi 0.25 sang định dạng Percentage thường làm gì?',options:['Biến giá trị thành 25 trong dữ liệu','Hiển thị 25% nhưng giá trị tính toán vẫn là 0.25','Xóa giá trị','Biến ô thành Text'],answer:1,explain:'Number Format thay đổi cách hiển thị. Nó không tự nhân dữ liệu gốc thành 25 hay chuyển sang Text.'},
            {q:'Dấu hiệu nào cho thấy “ngày” có thể đang là Text?',options:['Có thể dùng YEAR và Sort đúng thời gian','YEAR trả lỗi hoặc Sort theo chữ không đúng thứ tự thời gian','Ô có viền','Sheet có nhiều cột'],answer:1,explain:'Ngày dạng Text thường không tham gia hàm ngày và sắp xếp thời gian đúng cách. Viền hay số cột không nói lên kiểu dữ liệu.'}
          ]
        },
        {
          title:'Text, Number và mã định danh',kind:'core',
          why:'Mã nhân viên, mã hàng và số điện thoại không phải lúc nào cũng nên được lưu như số để tính toán.',
          body:['Number dùng cho đại lượng cần tính: số lượng, doanh thu, tỷ lệ. Text dùng cho tên, mã, trạng thái và thông tin không có ý nghĩa cộng trừ. Một chuỗi toàn chữ số vẫn có thể là mã, ví dụ 00125.','Nếu nhập 00125 như Number, Excel thường hiển thị 125. Với mã cần giữ số 0 đầu, bạn có thể định dạng cột là Text trước khi nhập hoặc dùng Custom Number Format khi bản chất vẫn là số nhưng chỉ cần cách hiển thị cố định.'],
          warning:'Không dùng dấu nháy đơn một cách vô tội vạ cho toàn bộ cột số. Nó có thể khiến số trở thành Text và làm SUM/AVERAGE bỏ qua.',
          questions:[
            {q:'Mã nhân viên 00125 chủ yếu dùng để tra cứu, không tính toán. Cách nghĩ phù hợp nhất?',options:['Bắt buộc lưu Number','Có thể lưu Text để giữ nguyên mã','Phải chuyển thành Date','Phải lưu Percentage'],answer:1,explain:'Mã định danh là nhãn, không phải đại lượng. Lưu Text giúp giữ 0 đầu và tránh phép tính vô nghĩa.'},
            {q:'Tại sao thêm dấu nháy đơn trước mọi số là thói quen xấu?',options:['Vì làm file tự đóng','Vì có thể biến số thành Text và làm tính toán sai','Vì đổi font','Vì tạo Pivot tự động'],answer:1,explain:'Dấu nháy đơn buộc Excel coi nội dung là Text. Khi cần cộng/trung bình, dữ liệu Text có thể bị bỏ qua hoặc gây lỗi.'}
          ]
        },
        {
          title:'Nhập, sửa, xóa và xuống dòng trong ô',kind:'core',
          why:'Sửa dữ liệu đúng cách giúp không xóa nhầm định dạng hoặc cấu trúc bảng.',
          body:['Nhập dữ liệu bằng cách chọn ô và gõ. F2 hoặc double-click cho phép chỉnh trực tiếp nội dung ô. Delete thường xóa nội dung nhưng giữ nhiều thuộc tính định dạng; Clear có nhiều lựa chọn như Clear Contents, Clear Formats hoặc Clear All.','Alt+Enter tạo xuống dòng bên trong một ô. Đây hữu ích cho ghi chú, nhưng không nên lạm dụng trong các cột dùng làm mã, ngày hoặc khóa vì ký tự xuống dòng ẩn có thể gây lỗi so khớp.'],
          tip:'F2 rất hữu ích khi cần sửa công thức mà không muốn dùng chuột vào Formula Bar.',
          questions:[
            {q:'F2 thường dùng để làm gì trong Excel?',options:['Chỉnh nội dung/công thức của ô đang chọn','Lưu file','Bật Filter','Tạo chart'],answer:0,explain:'F2 đưa ô hiện tại vào chế độ chỉnh sửa. Các thao tác còn lại dùng phím/lệnh khác.'},
            {q:'Alt+Enter nên hạn chế ở cột mã vì sao?',options:['Làm mất màu','Có thể chèn ký tự xuống dòng khiến so khớp/cleaning khó hơn','Tự đổi mã thành ngày','Tự xóa Sheet'],answer:1,explain:'Ký tự xuống dòng là một phần của chuỗi và có thể không nhìn rõ, khiến lookup hoặc so sánh chuỗi không khớp.'}
          ]
        },
        {
          title:'AutoFill, Fill Series và Flash Fill',kind:'core',
          why:'Excel có thể giúp nhập nhanh, nhưng bạn cần phân biệt copy mẫu với tạo chuỗi và suy đoán mẫu.',
          body:['Kéo Fill Handle có thể copy giá trị/công thức hoặc mở rộng chuỗi. Với 1,2 rồi kéo, Excel có thể tạo 3,4…; với một công thức, tham chiếu tương đối sẽ thay đổi theo vị trí.','Flash Fill (Ctrl+E) nhận diện mẫu từ ví dụ bạn cung cấp, ví dụ tách tên hoặc ghép mã. Nó tạo giá trị kết quả chứ không tạo công thức liên kết động. Nếu dữ liệu nguồn thay đổi, kết quả Flash Fill không tự cập nhật như công thức.'],
          warning:'Sau AutoFill/Flash Fill, luôn kiểm tra vài dòng ở giữa và cuối. Mẫu phức tạp hoặc dữ liệu ngoại lệ có thể khiến kết quả sai dù những dòng đầu đúng.',
          questions:[
            {q:'Flash Fill khác công thức ở điểm quan trọng nào?',options:['Flash Fill luôn tự cập nhật khi nguồn đổi','Flash Fill tạo giá trị theo mẫu và thường không liên kết động với nguồn','Flash Fill chỉ dùng cho số','Flash Fill là PivotTable'],answer:1,explain:'Flash Fill suy đoán rồi điền giá trị. Nó không duy trì dependency như công thức nên nguồn đổi không đảm bảo kết quả đổi theo.'},
            {q:'Kéo công thức =A2*B2 từ dòng 2 xuống dòng 3 thường thành gì?',options:['=A2*B2','=A3*B3','=$A$2*$B$2','=A1*B1'],answer:1,explain:'A2 và B2 là tham chiếu tương đối nên dịch xuống thành A3 và B3. Khóa $ mới giữ cố định.'}
          ]
        },
        {
          title:'Số nhìn như số và ngày nhìn như ngày',kind:'core',
          why:'Đây là lỗi thực tế rất phổ biến khi copy từ web, hệ thống ERP hoặc file CSV.',
          body:['“Number stored as text” thường xuất hiện khi dữ liệu chứa dấu nháy, khoảng trắng/ký tự đặc biệt hoặc được nhập với kiểu Text. Bạn có thể nhận biết bằng cảnh báo tam giác, căn lề bất thường, ISNUMBER/ISTEXT hoặc thử SUM trên vùng.','Ngày dạng Text cần được chuyển theo cấu trúc thực tế của chuỗi và locale. Không nên chỉ đổi Number Format rồi kết luận đã sửa; format không biến một chuỗi Text thành Date serial. Có thể dùng Text to Columns, DATEVALUE khi phù hợp hoặc Power Query với locale khi dữ liệu phức tạp.'],
          example:{title:'Kiểm tra nhanh',text:'Nếu A2 hiển thị 1000 nhưng =ISNUMBER(A2) trả FALSE, A2 không phải Number thật.'},
          questions:[
            {q:'Chỉ đổi Number Format từ General sang Number có chắc chuyển Text "1000" thành số thật không?',options:['Có, luôn luôn','Không; format chỉ đổi cách hiển thị và có thể không đổi kiểu dữ liệu','Chỉ khi ô màu xanh','Chỉ khi file .xlsm'],answer:1,explain:'Định dạng không đảm bảo chuyển kiểu. Bạn cần conversion thật như Convert to Number, VALUE, Text to Columns hoặc công cụ phù hợp.'},
            {q:'Hàm nào có thể giúp kiểm tra một ô đang là số thật?',options:['ISNUMBER','LEFT','UPPER','CONCAT'],answer:0,explain:'ISNUMBER trả TRUE nếu giá trị là số. LEFT/UPPER/CONCAT xử lý văn bản, không kiểm tra kiểu số.'}
          ]
        },
        {
          title:'Blank, khoảng trắng và dữ liệu thiếu',kind:'extension',
          why:'Ô trống thật khác chuỗi rỗng và khác ô chỉ chứa dấu cách. Sự khác biệt này ảnh hưởng COUNTBLANK, Filter và kiểm tra dữ liệu.',
          body:['Blank thật là ô không có giá trị. Một công thức có thể trả "" và nhìn như trống nhưng ô vẫn chứa công thức. Một ô có dấu cách cũng nhìn gần như trống nhưng thực tế là Text.','Khi kiểm tra dữ liệu thiếu, cần biết quy tắc nghiệp vụ: trường nào bắt buộc, trường nào có thể bỏ trống. Sau đó dùng Filter, COUNTBLANK, LEN/TRIM hoặc Data Validation để phát hiện và ngăn lỗi.'],
          questions:[
            {q:'Ô chứa một dấu cách có phải Blank thật không?',options:['Có','Không, đó là một chuỗi Text có ký tự khoảng trắng','Chỉ trên Excel 365','Chỉ khi căn trái'],answer:1,explain:'Dấu cách là ký tự. Ô không còn trống thật dù trên màn hình trông giống trống.'},
            {q:'Một công thức trả "" có thể nhìn trống nhưng thực tế thế nào?',options:['Ô hoàn toàn không có gì','Ô vẫn chứa công thức','Ô tự bị xóa','Ô là ngày'],answer:1,explain:'Chuỗi rỗng là kết quả của công thức. Điều này có thể khác Blank thật trong một số hàm và kiểm tra.'}
          ]
        }
      ]
    },
    {
      id:'f03-formatting-display',order:3,zone:'foundation',level:'Nền tảng',duration:'45–60 phút',version:'Excel 2016+',
      title:'Định dạng ô và trình bày dữ liệu đúng cách',short:'Number Format, %, ngày, căn lề, Wrap Text, Merge và cách làm bảng dễ đọc.',
      hook:'Định dạng tốt giúp người đọc hiểu dữ liệu nhanh; định dạng sai có thể khiến 0.05 thành “5” hoặc ngày thành chuỗi khó lọc. Bài này tách rõ “giá trị thật” và “cách hiển thị”.',
      prerequisites:['f02-data-entry-types'],
      outcomes:['Dùng Number Format đúng cho số, tiền, %, ngày và thời gian','Trình bày bảng bằng Alignment, Wrap Text, Border và kích thước hợp lý','Hiểu khi nào Merge gây hại cho bảng dữ liệu','Biết các nguyên tắc định dạng báo cáo dễ đọc'],
      useCases:['Chuẩn hóa bảng nhập liệu trước khi gửi đồng nghiệp','Hiển thị doanh thu, tỷ lệ và ngày tháng nhất quán','Làm báo cáo rõ nhưng không phá cấu trúc dữ liệu nguồn'],
      sections:[
        {
          title:'Giá trị thật và Number Format',kind:'core',
          why:'Cùng một giá trị có thể hiển thị theo nhiều cách. Hiểu điều này giúp tránh sửa dữ liệu chỉ để làm đẹp.',
          body:['Number Format điều khiển cách Number được hiển thị: General, Number, Currency/Accounting, Percentage, Date, Time, Fraction, Scientific và Custom. Ví dụ 0.075 có thể hiển thị thành 7.5% mà giá trị dùng trong công thức vẫn là 0.075.','Tăng/giảm số chữ số thập phân chỉ thay đổi phần nhìn thấy, không nhất thiết làm tròn giá trị thật. Nếu cần thay đổi giá trị phục vụ tính toán, dùng ROUND/ROUNDUP/ROUNDDOWN theo nghiệp vụ.'],
          warning:'Đừng dùng định dạng hiển thị để “che” sai số rồi kỳ vọng phép tính sau dùng số đã nhìn thấy.',
          questions:[
            {q:'Giảm hiển thị từ 4 xuống 2 chữ số thập phân thường có làm thay đổi giá trị thật không?',options:['Luôn có','Thường không, chỉ đổi cách hiển thị','Xóa công thức','Biến số thành Text'],answer:1,explain:'Number Format thường chỉ tác động hiển thị. Muốn làm tròn giá trị dùng trong logic, cần hàm ROUND hoặc quy tắc nghiệp vụ khác.'},
            {q:'Giá trị 0.08 định dạng Percentage sẽ thường hiển thị thế nào?',options:['0.08%','8%','80%','800%'],answer:1,explain:'Percentage hiển thị giá trị nhân 100 kèm %. 0.08 tương ứng 8%.'}
          ]
        },
        {
          title:'Số, tiền tệ, phần trăm và ngày tháng',kind:'core',
          why:'Định dạng nhất quán giúp người đọc phân biệt đại lượng và tránh hiểu nhầm đơn vị.',
          body:['Number phù hợp cho số lượng/đo lường; Currency/Accounting dùng cho tiền tệ; Percentage cho tỷ lệ; Date/Time cho serial ngày giờ. Với báo cáo, nên thống nhất dấu phân cách hàng nghìn và số chữ số thập phân theo mục đích.','Ngày nên hiển thị theo định dạng dễ hiểu với người dùng, ví dụ dd/mm/yyyy trong môi trường Việt Nam. Nhưng khi trao đổi đa quốc gia, nên cân nhắc định dạng ít mơ hồ như dd-mmm-yyyy hoặc yyyy-mm-dd.'],
          example:{title:'Ví dụ',text:'Doanh thu 12500000 có thể hiển thị 12,500,000 ₫; NG Rate 0.0235 hiển thị 2.35%; cả hai vẫn là Number.'},
          questions:[
            {q:'Tỷ lệ lỗi 2.35% nên lưu giá trị cơ bản gần nhất là?',options:['2.35','0.0235','235','23.5'],answer:1,explain:'2.35% tương ứng 0.0235 ở dạng Number. Nhập 2.35 rồi định dạng % sẽ hiển thị 235%.'},
            {q:'Tại sao dd/mm/yyyy có thể gây nhầm trong môi trường quốc tế?',options:['Vì Excel không hỗ trợ','Vì một số nơi dùng mm/dd/yyyy','Vì ngày không phải số','Vì có dấu /'],answer:1,explain:'Thứ tự ngày/tháng khác nhau theo locale. 05/06 có thể được hiểu là 5/6 hoặc 6/5.'}
          ]
        },
        {
          title:'Alignment, Wrap Text và kích thước hàng/cột',kind:'core',
          why:'Bảng dễ đọc cần không gian hợp lý, không phải cứ kéo cột thật rộng hoặc thu font thật nhỏ.',
          body:['Horizontal/Vertical Alignment điều khiển vị trí nội dung. Wrap Text cho phép văn bản dài xuống dòng trong cùng ô; AutoFit điều chỉnh độ rộng/cao theo nội dung.','Với bảng dữ liệu, nên ưu tiên độ rộng đủ đọc, tiêu đề ngắn và Wrap Text khi cần. Không nên giảm font quá nhỏ chỉ để nhét hết dữ liệu vào một màn hình.'],
          tip:'Double-click biên tiêu đề cột có thể AutoFit nhanh. Với báo cáo, sau AutoFit vẫn nên rà lại để tránh một chuỗi quá dài làm cột phình bất thường.',
          questions:[
            {q:'Wrap Text dùng để làm gì?',options:['Xóa nội dung dài','Hiển thị nội dung trên nhiều dòng trong cùng ô','Khóa công thức','Tạo Filter'],answer:1,explain:'Wrap Text giữ nội dung trong ô nhưng cho phép xuống dòng hiển thị. Nó không xóa dữ liệu hay tạo Filter.'},
            {q:'Cách nào hợp lý hơn khi tiêu đề hơi dài?',options:['Giảm font xuống rất nhỏ','Dùng Wrap Text và chiều cao hàng hợp lý','Merge toàn bộ bảng','Ẩn tiêu đề'],answer:1,explain:'Wrap Text giữ khả năng đọc mà không phá cấu trúc. Font quá nhỏ hoặc merge rộng làm trải nghiệm kém.'}
          ]
        },
        {
          title:'Border, Fill, Font và hierarchy thị giác',kind:'core',
          why:'Màu sắc nên giúp người đọc hiểu mức quan trọng, không phải trang trí ngẫu nhiên.',
          body:['Dùng font, fill và border để tạo hierarchy: tiêu đề chính, header bảng, vùng nhập liệu, vùng kết quả, cảnh báo. Một bảng tốt thường dùng ít màu nhưng nhất quán.','Trong hệ thống này, xanh–trắng là tone chính; xanh nhạt cho thông tin/đúng, vàng nhạt cho lưu ý, đỏ nhạt cho lỗi/cảnh báo. Khi làm file của bạn, cũng nên xây quy ước màu và dùng xuyên suốt.'],
          warning:'Quá nhiều màu, viền dày và font khác nhau làm người đọc khó biết đâu là thông tin quan trọng.',
          questions:[
            {q:'Mục đích tốt nhất của màu trong bảng là gì?',options:['Dùng càng nhiều càng đẹp','Tạo hierarchy và truyền ý nghĩa nhất quán','Thay thế tiêu đề','Che dữ liệu thiếu'],answer:1,explain:'Màu nên hỗ trợ nhận biết cấu trúc/trạng thái. Nhiều màu không có quy ước làm tăng nhiễu.'},
            {q:'Cảnh báo lỗi nên dùng cách nào dễ hiểu?',options:['Đỏ nhạt/viền đỏ nhất quán','Mỗi lỗi một màu ngẫu nhiên','Chỉ đổi font nhỏ hơn','Không cần phân biệt'],answer:0,explain:'Màu đỏ nhẹ và nhất quán phù hợp semantic warning/error; các lựa chọn khác làm trạng thái khó nhận diện.'}
          ]
        },
        {
          title:'Merge Cells: dùng khi nào, tránh khi nào',kind:'core',
          why:'Merge có thể đẹp ở tiêu đề báo cáo nhưng gây vấn đề lớn trong bảng dữ liệu nguồn.',
          body:['Merge Cells gộp nhiều ô thành một vùng hiển thị. Trong title/banner của báo cáo, nó có thể chấp nhận được. Trong vùng dữ liệu cần Sort, Filter, Table, Pivot hoặc Power Query, Merge thường gây cản trở và làm cấu trúc không còn dạng bảng chuẩn.','Nếu chỉ muốn tiêu đề nằm giữa nhiều cột mà không merge, Center Across Selection là một lựa chọn trình bày hữu ích trong một số trường hợp.'],
          warning:'Không merge ô trong header/dữ liệu nguồn chỉ để “đẹp”. Đây là một trong những lỗi cấu trúc phổ biến nhất khi file phải phân tích về sau.',
          questions:[
            {q:'Merge Cells phù hợp hơn ở đâu?',options:['Giữa vùng dữ liệu nguồn cần Pivot','Tiêu đề báo cáo không tham gia xử lý dữ liệu','Cột khóa Order_ID','Bảng Power Query source'],answer:1,explain:'Merge có thể dùng ở khu trình bày tách khỏi data source. Trong bảng dữ liệu, nó phá cấu trúc một ô/một trường.'},
            {q:'Nếu muốn căn tiêu đề giữa nhiều cột nhưng tránh merge, có thể cân nhắc?',options:['Center Across Selection','Delete','Text to Columns','Remove Duplicates'],answer:0,explain:'Center Across Selection là lựa chọn định dạng giúp căn giữa trên vùng mà không gộp cấu trúc ô như Merge.'}
          ]
        },
        {
          title:'Custom Number Format và nguyên tắc trình bày báo cáo',kind:'extension',
          why:'Custom Format giúp hiển thị đơn vị, số 0 hoặc số âm rõ hơn mà không đổi giá trị.',
          body:['Custom Number Format có thể hiển thị số theo mẫu, ví dụ thêm đơn vị, ẩn số 0 trong báo cáo hoặc hiển thị số âm bằng dấu ngoặc. Đây là kỹ thuật trình bày; dữ liệu gốc vẫn cần đúng kiểu.','Khi dùng Custom Format, người nhận file có thể không biết giá trị thực khác phần hiển thị. Vì vậy tránh những format quá “ảo thuật”; luôn ưu tiên khả năng đọc và bàn giao.'],
          example:{title:'Ví dụ mở rộng',text:'Giá trị 1250 có thể hiển thị “1,250 pcs” bằng Custom Format mà vẫn là Number để SUM.'},
          questions:[
            {q:'Custom Number Format chủ yếu thay đổi gì?',options:['Cách hiển thị','Công thức gốc','Tên Sheet','Quyền truy cập'],answer:0,explain:'Custom Format là lớp hiển thị. Nó không tự sửa logic công thức hay quyền truy cập.'},
            {q:'Vì sao không nên dùng format quá phức tạp để che dữ liệu?',options:['Vì làm người nhận khó hiểu giá trị thực','Vì Excel sẽ xóa file','Vì Pivot không bao giờ chạy','Vì không thể in'],answer:0,explain:'Format phức tạp có thể khiến người khác hiểu sai giá trị và khó audit. Mục tiêu là rõ ràng, không phải gây bất ngờ.'}
          ]
        }
      ]
    },
    {
      id:'f04-formulas-references',order:4,zone:'foundation',level:'Nền tảng',duration:'60–75 phút',version:'Excel 2016+',
      title:'Công thức và tham chiếu ô',short:'Dấu =, toán tử, thứ tự tính, relative/absolute/mixed reference và F4.',
      hook:'Biết nhiều hàm nhưng không hiểu tham chiếu ô sẽ khiến công thức “đúng ở dòng đầu, sai từ dòng thứ hai”. Đây là bài nền quan trọng nhất trước khi học SUMIFS, XLOOKUP hay dashboard.',
      prerequisites:['f01-excel-workspace','f02-data-entry-types'],
      outcomes:['Viết và đọc được công thức Excel cơ bản','Hiểu thứ tự phép tính và các toán tử so sánh','Phân biệt A1, $A$1, A$1, $A1','Copy công thức đúng và biết dùng F4 để khóa tham chiếu'],
      useCases:['Tính Thành tiền = Số lượng × Đơn giá','Dùng một tỷ lệ/target cố định cho hàng trăm dòng','Tra cứu hoặc tổng hợp mà vùng dữ liệu không bị trôi khi copy'],
      sections:[
        {
          title:'Công thức bắt đầu bằng = và dùng tham chiếu thay số cứng',kind:'core',
          why:'Tham chiếu giúp kết quả tự cập nhật khi dữ liệu nguồn thay đổi.',
          body:['Công thức Excel thường bắt đầu bằng dấu =. Bạn có thể dùng toán tử +, -, *, /, ^ và tham chiếu ô. Viết =B2*C2 tốt hơn =5*120000 nếu 5 và 120000 thực sự nằm trong B2/C2, vì dữ liệu thay đổi thì kết quả tự cập nhật.','Một công thức có thể tham chiếu ô cùng Sheet, Sheet khác hoặc Workbook khác. Với người mới, hãy ưu tiên công thức dễ đọc và kiểm tra được trước khi tối ưu ngắn.'],
          example:{title:'Ví dụ',text:'B2 = Qty, C2 = Unit Price. D2 dùng =B2*C2. Khi Qty đổi từ 5 thành 6, D2 tự tính lại.'},
          questions:[
            {q:'Ưu điểm chính của =B2*C2 so với gõ =5*120000 là gì?',options:['Nhiều ký tự hơn','Tự cập nhật khi dữ liệu B2/C2 đổi','Không bao giờ lỗi','Tự tạo chart'],answer:1,explain:'Tham chiếu tạo dependency với dữ liệu nguồn. Hardcode số có thể đúng lúc đầu nhưng không tự phản ánh thay đổi.'},
            {q:'Ký hiệu nào thường mở đầu công thức Excel?',options:['#','=','$','@'],answer:1,explain:'Dấu = báo cho Excel đây là công thức. Các ký hiệu khác có vai trò riêng nhưng không thay thế dấu mở đầu cơ bản.'}
          ]
        },
        {
          title:'Toán tử và thứ tự phép tính',kind:'core',
          why:'Hai công thức có cùng số nhưng đặt ngoặc khác nhau có thể cho kết quả hoàn toàn khác.',
          body:['Excel ưu tiên ngoặc, lũy thừa, nhân/chia rồi cộng/trừ theo quy tắc tính toán. Toán tử so sánh như =, >, <, >=, <=, <> trả về TRUE/FALSE và là nền của IF, AND, OR.','Khi logic dài, dùng ngoặc để thể hiện ý định rõ ràng thay vì chỉ dựa vào việc nhớ thứ tự ưu tiên. Công thức dễ đọc sẽ dễ audit hơn.'],
          example:{title:'Ví dụ',text:'=100+20*2 cho 140, còn =(100+20)*2 cho 240. Ngoặc thay đổi thứ tự tính.'},
          questions:[
            {q:'=10+5*2 cho kết quả nào?',options:['30','20','25','15'],answer:1,explain:'Nhân được ưu tiên trước cộng: 5*2=10, sau đó 10+10=20.'},
            {q:'Toán tử <> có nghĩa là gì?',options:['Bằng','Không bằng','Lớn hơn hoặc bằng','Nối chuỗi'],answer:1,explain:'<> là “không bằng”. Nó thường dùng trong điều kiện, ví dụ A2<>"Closed".'}
          ]
        },
        {
          title:'Tham chiếu tương đối A1',kind:'core',
          why:'Đây là hành vi mặc định khi copy công thức và là nền cho việc tính theo từng dòng.',
          body:['A1 là tham chiếu tương đối. Khi công thức được copy sang vị trí khác, Excel điều chỉnh cả cột và dòng theo khoảng cách. Ví dụ ở C2 có =A2*B2, copy xuống C3 sẽ thành =A3*B3.','Tương đối rất phù hợp khi mỗi dòng dùng dữ liệu của chính dòng đó. Sai lầm thường gặp là khóa mọi thứ bằng $ vì sợ công thức trôi, làm công thức không còn thay đổi đúng theo từng dòng.'],
          questions:[
            {q:'C2 = A2+B2. Copy xuống C5 thì công thức thường là?',options:['=A2+B2','=A5+B5','=$A$2+$B$2','=A1+B1'],answer:1,explain:'Tham chiếu tương đối dịch cùng số dòng với công thức, nên tại dòng 5 sẽ tham chiếu A5/B5.'},
            {q:'Khi nào tham chiếu tương đối phù hợp?',options:['Mỗi dòng cần tính từ dữ liệu của chính dòng đó','Luôn cần dùng một tỷ lệ cố định ở F1','Muốn khóa cả dòng và cột','Không muốn công thức đổi khi copy'],answer:0,explain:'Relative reference phù hợp cho logic lặp theo dòng/cột. Các trường hợp còn lại thường cần absolute/mixed reference.'}
          ]
        },
        {
          title:'Tham chiếu tuyệt đối $A$1 và phím F4',kind:'core',
          why:'Bạn cần khóa ô chứa tỷ lệ, target, thuế suất hoặc vùng tra cứu để copy công thức hàng loạt.',
          body:['$A$1 khóa cả cột A và dòng 1. Khi copy công thức, tham chiếu này không dịch chuyển. Ví dụ =B2*$F$1 dùng Qty/Revenue ở B2 nhưng luôn nhân với tỷ lệ tại F1.','Khi con trỏ đang ở tham chiếu trong công thức, nhấn F4 thường luân phiên A1 → $A$1 → A$1 → $A1 → A1. Đây là cách nhanh và ít lỗi hơn gõ dấu $ thủ công nhiều lần.'],
          example:{title:'Ví dụ',text:'F1 chứa VAT 8%. D2 = C2*$F$1. Copy D2 xuống D100, F1 vẫn cố định.'},
          tip:'F4 là phím tắt nên học ngay trong bối cảnh tham chiếu, không cần tách thành một bài phím tắt riêng.',
          questions:[
            {q:'Trong =C2*$F$1, phần nào thay đổi khi copy xuống một dòng?',options:['C2 thành C3, $F$1 giữ nguyên','C2 giữ nguyên, $F$1 thành $F$2','Cả hai giữ nguyên','Cả hai đổi'],answer:0,explain:'C2 là relative nên đổi theo dòng; $F$1 absolute nên không đổi.'},
            {q:'F4 khi đang sửa tham chiếu thường dùng để?',options:['Lưu file','Luân phiên các kiểu khóa $','Mở Filter','Tạo Pivot'],answer:1,explain:'Trong chế độ sửa công thức, F4 giúp chuyển nhanh relative/absolute/mixed reference.'}
          ]
        },
        {
          title:'Tham chiếu hỗn hợp A$1 và $A1',kind:'core',
          why:'Mixed reference cực hữu ích trong bảng ma trận khi cần khóa chỉ dòng hoặc chỉ cột.',
          body:['A$1 khóa dòng 1 nhưng cột A vẫn thay đổi khi copy ngang. $A1 khóa cột A nhưng dòng 1 vẫn thay đổi khi copy xuống.','Hãy hỏi: phần nào của tham chiếu phải đứng yên khi công thức di chuyển? Dấu $ đặt trước phần cần khóa. Khi hiểu nguyên tắc này, bạn không cần học thuộc bốn dạng một cách máy móc.'],
          example:{title:'Ví dụ ma trận',text:'Trong bảng nhân, công thức =$A2*B$1 có cột A cố định để lấy giá trị theo dòng và dòng 1 cố định để lấy tiêu đề theo cột.'},
          questions:[
            {q:'A$1 khóa phần nào?',options:['Chỉ cột A','Chỉ dòng 1','Cả cột và dòng','Không khóa gì'],answer:1,explain:'Dấu $ đứng trước 1 nên khóa dòng. Cột A vẫn tương đối.'},
            {q:'$A1 phù hợp khi nào?',options:['Muốn cột A luôn cố định nhưng dòng thay đổi khi copy xuống','Muốn khóa dòng 1','Muốn khóa cả A1','Không muốn dùng tham chiếu'],answer:0,explain:'$ trước A khóa cột; số dòng không có $ nên vẫn thay đổi.'}
          ]
        },
        {
          title:'Tham chiếu Sheet khác và kiểm tra công thức',kind:'extension',
          why:'File thực tế thường tách Data, Config và Report; công thức phải liên kết giữa các Sheet nhưng vẫn dễ kiểm tra.',
          body:['Cú pháp Sheet khác thường dạng =Data!B2 hoặc =SUM(Data!D2:D100). Tên Sheet có khoảng trắng được Excel đặt trong dấu nháy đơn, ví dụ =\'Sales Data\'!B2.','Khi công thức cho kết quả lạ, kiểm tra Formula Bar, dùng F2 để nhìn các vùng tham chiếu, kiểm tra dấu $ và Sheet nguồn. Sau đó mới nghĩ tới việc thay hàm. Nhiều lỗi thực chất là tham chiếu sai chứ không phải hàm sai.'],
          warning:'Đổi tên/xóa Sheet hoặc di chuyển file nguồn có thể làm công thức liên kết lỗi. Khi bàn giao, hạn chế external link không cần thiết.',
          questions:[
            {q:'=SUM(Data!D2:D100) đang làm gì?',options:['Cộng vùng D2:D100 trên Sheet Data','Cộng Sheet hiện tại','Đổi tên Sheet Data','Tạo Table'],answer:0,explain:'Dấu ! tách tên Sheet và địa chỉ vùng. Công thức cộng D2:D100 trên Sheet Data.'},
            {q:'Công thức đúng hàm nhưng kết quả sai, bước kiểm tra nào nên làm sớm?',options:['Đổi font','Kiểm tra vùng tham chiếu và dấu $','Tạo chart','Xóa Sheet'],answer:1,explain:'Sai reference là nguyên nhân phổ biến. Kiểm tra vùng và kiểu khóa trước khi thay toàn bộ logic.'}
          ]
        }
      ]
    },
    {
      id:'f05-core-functions',order:5,zone:'foundation',level:'Nền tảng',duration:'75–90 phút',version:'Excel 2016+',
      title:'Các hàm nền tảng bắt buộc phải biết',short:'SUM, AVERAGE, MIN/MAX, COUNT/COUNTA, ROUND và cách đọc cú pháp hàm.',
      hook:'Mục tiêu không phải nhớ thật nhiều hàm. Bạn cần hiểu cách một hàm nhận đối số, vùng và điều kiện; sau đó mới mở rộng sang hàm điều kiện và tra cứu.',
      prerequisites:['f04-formulas-references'],
      outcomes:['Đọc được cú pháp function(arguments)','Dùng SUM, AVERAGE, MIN, MAX đúng kiểu dữ liệu','Phân biệt COUNT, COUNTA, COUNTBLANK','Làm tròn bằng ROUND/ROUNDUP/ROUNDDOWN theo nghiệp vụ'],
      useCases:['Tổng doanh thu và số lượng','Tính trung bình/giá trị lớn nhất nhỏ nhất','Đếm số dòng có dữ liệu và ô trống','Làm tròn giá, tỷ lệ hoặc số lượng theo quy tắc'],
      sections:[
        {
          title:'Cách đọc cú pháp hàm và đối số',kind:'core',
          why:'Hiểu cú pháp giúp bạn tự đọc các hàm mới thay vì học thuộc ví dụ.',
          body:['Hàm có dạng =FUNCTION(argument1, argument2,…). Argument có thể là số, text, ô, vùng, điều kiện hoặc kết quả hàm khác. Excel hiển thị gợi ý cú pháp khi bạn gõ tên hàm.','Dấu phân cách đối số có thể là dấu phẩy hoặc chấm phẩy tùy thiết lập vùng của Excel. Khi copy công thức từ internet, cần điều chỉnh theo máy thay vì kết luận hàm “không chạy”.'],
          example:{title:'Ví dụ',formula:'=SUM(D2:D100)',text:'SUM là tên hàm; D2:D100 là một đối số dạng Range.'},
          questions:[
            {q:'Trong =SUM(D2:D100), D2:D100 là gì?',options:['Tên Sheet','Đối số dạng vùng','Tên hàm','Lỗi cú pháp'],answer:1,explain:'SUM là tên hàm; vùng D2:D100 được truyền vào hàm làm argument.'},
            {q:'Vì sao công thức từ máy khác dùng , có thể cần đổi thành ;?',options:['Do thiết lập dấu phân cách theo locale','Do font','Do màu Sheet','Do file lớn'],answer:0,explain:'List separator phụ thuộc thiết lập vùng/hệ thống. Đây là khác biệt cú pháp hiển thị, không phải do dữ liệu.'}
          ]
        },
        {
          title:'SUM, AVERAGE, MIN và MAX',kind:'core',
          why:'Bốn hàm này trả lời các câu hỏi tổng, trung bình và biên cơ bản của gần mọi bảng số.',
          body:['SUM cộng các giá trị số trong vùng. AVERAGE tính trung bình cộng của các giá trị số. MIN/MAX tìm giá trị nhỏ nhất/lớn nhất. Các ô Text thường không được xử lý như Number trong các hàm này.','Trước khi tin kết quả, kiểm tra vùng có đúng không, có Filter hay dữ liệu Text không và nghiệp vụ có cần tính trung bình có trọng số hay không. AVERAGE đơn giản không phù hợp cho mọi loại “trung bình”.'],
          example:{title:'Ví dụ',text:'D2:D31 là doanh thu 30 ngày. =SUM(D2:D31) cho tổng; =AVERAGE(D2:D31) cho doanh thu trung bình theo các giá trị số trong vùng.'},
          questions:[
            {q:'Muốn tìm doanh thu lớn nhất trong D2:D31 dùng?',options:['MIN','MAX','COUNT','LEFT'],answer:1,explain:'MAX trả về giá trị số lớn nhất. MIN là nhỏ nhất; COUNT đếm số; LEFT xử lý text.'},
            {q:'AVERAGE đơn giản có luôn là cách đúng để tính “trung bình” không?',options:['Có, mọi bài toán','Không; có trường hợp cần trung bình có trọng số hoặc logic khác','Chỉ khi màu xanh','Chỉ với Text'],answer:1,explain:'AVERAGE là trung bình cộng không trọng số. KPI như ASP tổng hợp nhiều nhóm đôi khi cần tổng doanh thu/tổng lượng thay vì trung bình các trung bình.'}
          ]
        },
        {
          title:'COUNT, COUNTA và COUNTBLANK',kind:'core',
          why:'Ba hàm đếm thường bị nhầm vì chúng trả lời ba câu hỏi khác nhau.',
          body:['COUNT đếm các ô chứa Number. COUNTA đếm các ô không trống (nhiều loại giá trị). COUNTBLANK đếm ô trống theo cách Excel xác định, và cần chú ý ô có công thức trả chuỗi rỗng trong một số tình huống.','Nếu bạn muốn đếm “số giao dịch”, đừng mặc định dùng COUNTA toàn cột. Hãy chọn cột khóa đáng tin cậy như Order_ID và hiểu dữ liệu có duplicate/blank không.'],
          example:{title:'Ví dụ',text:'Cột A là Order_ID dạng Text: COUNT(A2:A100) có thể bằng 0 dù có dữ liệu; COUNTA sẽ phù hợp hơn để đếm ô không trống, nhưng vẫn chưa xử lý duplicate.'},
          questions:[
            {q:'COUNT chủ yếu đếm gì?',options:['Mọi ô không trống','Ô chứa số','Chỉ ô Text','Sheet'],answer:1,explain:'COUNT đếm giá trị số. COUNTA mới đếm nhiều loại ô không trống.'},
            {q:'Đếm số Order_ID duy nhất có thể dùng COUNTA trực tiếp và luôn đúng không?',options:['Có','Không, vì có thể có duplicate hoặc blank','Chỉ khi font Arial','Chỉ khi có chart'],answer:1,explain:'COUNTA đếm ô có dữ liệu, không loại trùng. Cần kiểm soát grain/unique key khi đếm giao dịch.'}
          ]
        },
        {
          title:'ROUND, ROUNDUP và ROUNDDOWN',kind:'core',
          why:'Hiển thị ít chữ số không đồng nghĩa giá trị đã được làm tròn theo nghiệp vụ.',
          body:['ROUND(number, num_digits) làm tròn theo quy tắc thông thường; ROUNDUP làm tròn ra xa 0; ROUNDDOWN làm tròn về gần 0. num_digits dương làm tròn phần thập phân, 0 làm tròn số nguyên, âm có thể làm tròn hàng chục/hàng trăm.','Chọn cách làm tròn theo quy định nghiệp vụ, đặc biệt với tiền, sản lượng, tỷ lệ và target. Không tự dùng ROUNDUP chỉ để “đẹp số”.'],
          example:{title:'Ví dụ',text:'=ROUND(12.345,2) → 12.35. =ROUNDUP(12.341,2) → 12.35. =ROUNDDOWN(12.349,2) → 12.34.'},
          questions:[
            {q:'=ROUND(12.345,2) thường cho?',options:['12.34','12.35','13','12'],answer:1,explain:'ROUND làm tròn tới 2 chữ số thập phân; chữ số tiếp theo là 5 nên tăng chữ số trước.'},
            {q:'Vì sao chỉ giảm Decimal Places không thay thế ROUND trong logic?',options:['Vì chỉ đổi hiển thị, giá trị tính toán có thể vẫn giữ nhiều chữ số','Vì Excel cấm','Vì ROUND chỉ dùng Text','Vì không thể in'],answer:0,explain:'Format có thể che phần thập phân nhưng công thức sau vẫn dùng giá trị thật. ROUND tạo giá trị đã làm tròn.'}
          ]
        },
        {
          title:'Hàm lồng nhau ở mức cơ bản',kind:'core',
          why:'Kết quả của một hàm có thể trở thành đối số của hàm khác, nhưng cần giữ công thức dễ đọc.',
          body:['Ví dụ =ROUND(AVERAGE(D2:D31),2) lấy trung bình rồi làm tròn. Khi đọc công thức lồng, bắt đầu từ hàm trong cùng và đi ra ngoài.','Không cần cố nhét mọi logic vào một công thức dài. Với bài phức tạp, helper column hoặc LET (ở bài nâng cao) có thể giúp dễ kiểm tra hơn.'],
          questions:[
            {q:'Trong =ROUND(AVERAGE(D2:D31),2), phần nào được tính trước về logic?',options:['ROUND','AVERAGE(D2:D31)','Số 2','Không có thứ tự'],answer:1,explain:'AVERAGE tạo kết quả trung gian, sau đó ROUND làm tròn kết quả đó.'},
            {q:'Công thức càng dài càng chuyên nghiệp đúng không?',options:['Đúng','Sai; ưu tiên rõ, kiểm tra và bảo trì được','Chỉ đúng trên 365','Chỉ đúng với VBA'],answer:1,explain:'Mục tiêu là logic đúng và audit được. Helper hoặc tách bước có thể tốt hơn một công thức quá dài.'}
          ]
        },
        {
          title:'Khi nào chuyển sang hàm có điều kiện',kind:'extension',
          why:'SUM/COUNT/AVERAGE cơ bản tính toàn vùng; khi câu hỏi có “chỉ những dòng thỏa…”, bạn cần nhóm IF/SUMIF/COUNTIF.',
          body:['Nếu câu hỏi là “tổng doanh thu”, SUM đủ. Nếu là “tổng doanh thu cửa hàng S001 trong tháng 8”, bạn cần điều kiện. Đây là lúc học SUMIF/SUMIFS, COUNTIF/COUNTIFS, AVERAGEIF/AVERAGEIFS.','Hãy bắt đầu bằng câu hỏi nghiệp vụ rồi xác định vùng cần tính và điều kiện, thay vì chọn hàm vì thấy tên quen.'],
          questions:[
            {q:'Câu hỏi nào cho thấy cần hàm có điều kiện?',options:['Tổng toàn bộ doanh thu','Đếm số đơn của Store S001','Giá trị lớn nhất toàn cột','Trung bình toàn cột'],answer:1,explain:'“của Store S001” là điều kiện. Các câu còn lại có thể dùng hàm cơ bản không điều kiện.'},
            {q:'Bước tốt trước khi viết SUMIFS là gì?',options:['Chọn màu ô','Nói rõ cần cộng gì và theo điều kiện nào','Merge header','Tạo chart trước'],answer:1,explain:'Xác định metric và criteria giúp chọn đúng sum_range/criteria_range, giảm lỗi tham chiếu.'}
          ]
        }
      ]
    },
    {
      id:'f06-data-table-structure',order:6,zone:'foundation',level:'Nền tảng',duration:'60–75 phút',version:'Excel 2016+',
      title:'Quản lý bảng dữ liệu: Sort, Filter và cấu trúc nguồn',short:'Bảng “sạch”, Sort, Filter, Freeze Panes, Find/Replace và các lỗi làm lệch dữ liệu.',
      hook:'Trước khi học phân tích, bạn phải biết bảo vệ cấu trúc bảng. Sort sai một cột hoặc đặt dòng tổng giữa dữ liệu có thể làm cả báo cáo phía sau sai mà không có cảnh báo.',
      prerequisites:['f02-data-entry-types','f03-formatting-display'],
      outcomes:['Tổ chức dữ liệu theo nguyên tắc một dòng = một bản ghi','Sort một/nhiều cột mà không làm lệch hàng','Filter theo text, số và ngày đúng cách','Dùng Freeze Panes, Find/Replace và kiểm tra vùng dữ liệu an toàn'],
      useCases:['Lọc nhanh giao dịch lỗi/NG','Sắp xếp theo ngày và doanh thu','Tìm mã hoặc thay chuỗi hàng loạt','Chuẩn bị source trước Pivot/Table/Power Query'],
      sections:[
        {
          title:'Một dòng = một bản ghi, một cột = một trường',kind:'core',
          why:'Đây là nguyên tắc nền cho Filter, Pivot, Power Query và hầu hết công cụ dữ liệu.',
          body:['Header nên nằm trên một hàng, không để ô tiêu đề trống, không merge trong data source. Mỗi cột giữ một loại thông tin ổn định; mỗi dòng đại diện một bản ghi ở cùng grain.','Dòng tổng, tiêu đề phụ, ghi chú dài hoặc nhiều bảng đặt cạnh nhau trong cùng source sẽ làm công cụ phân tích khó xác định cấu trúc. Hãy tách phần trình bày khỏi bảng nguồn.'],
          warning:'Một dòng có ý nghĩa khác các dòng còn lại là tín hiệu grain không đồng nhất. Ví dụ dòng thường là Order Line nhưng một dòng lại là Total Store.',
          questions:[
            {q:'Cấu trúc nào phù hợp nhất cho bảng nguồn?',options:['Header 2 hàng merge','Một header, mỗi dòng cùng loại bản ghi','Chèn subtotal sau mỗi nhóm','Nhiều bảng cạnh nhau'],answer:1,explain:'Bảng chuẩn cần header duy nhất và grain nhất quán. Merge/subtotal trong source làm Sort/Pivot/PQ khó xử lý.'},
            {q:'“Một cột = một trường” nghĩa là?',options:['Cột có thể trộn ngày và ghi chú tùy dòng','Cột nên chứa cùng loại thông tin/ý nghĩa','Mỗi cột chỉ có một ô','Mỗi cột phải là số'],answer:1,explain:'Một field nên có ý nghĩa và kiểu dữ liệu nhất quán. Không bắt buộc mọi cột là số.'}
          ]
        },
        {
          title:'Sort an toàn và multi-level sort',kind:'core',
          why:'Sort sai phạm vi có thể làm tên, mã, doanh thu không còn thuộc cùng một bản ghi.',
          body:['Khi Sort trong bảng liên tục, Excel thường đề nghị Expand the selection. Mục tiêu là di chuyển cả dòng cùng nhau. Không Sort riêng cột doanh thu nếu các cột khác thuộc cùng bản ghi.','Custom Sort cho phép nhiều cấp: ví dụ Region A→Z, sau đó Revenue Largest→Smallest trong từng Region. Với ngày, đảm bảo cột là Date thật trước khi Sort Oldest→Newest.'],
          warning:'Nếu Excel hỏi “Expand the selection” hay “Continue with current selection”, hãy dừng và hiểu phạm vi. Chọn current selection sai có thể phá quan hệ giữa các cột.',
          questions:[
            {q:'Bảng A:F là một bản ghi theo hàng. Muốn Sort Revenue ở cột F an toàn hơn nên?',options:['Sort riêng F','Mở rộng selection để cả hàng đi cùng','Xóa A:E','Copy F sang Sheet khác rồi bỏ'],answer:1,explain:'Các cột của cùng bản ghi phải di chuyển cùng nhau để giữ quan hệ dữ liệu.'},
            {q:'Muốn Sort theo Region rồi trong từng Region Sort Revenue giảm dần dùng?',options:['Custom Sort nhiều level','Merge Cells','Wrap Text','Goal Seek'],answer:0,explain:'Custom Sort hỗ trợ Add Level cho nhiều tiêu chí theo thứ tự ưu tiên.'}
          ]
        },
        {
          title:'Filter theo Text, Number và Date',kind:'core',
          why:'Filter giúp thu hẹp dữ liệu mà không xóa dòng; nhưng kết luận phải dựa trên trạng thái lọc hiện tại.',
          body:['Ctrl+Shift+L bật/tắt Filter cho vùng phù hợp. Text Filters có Equals, Contains…; Number Filters có Greater Than, Between…; Date Filters có nhóm theo thời gian khi dữ liệu là Date thật.','Filter chỉ ẩn tạm các dòng không thỏa điều kiện. Khi copy, tính tổng hoặc bàn giao, luôn kiểm tra icon Filter và số dòng đang hiển thị để không tưởng đang nhìn toàn bộ dữ liệu.'],
          tip:'Ctrl+Shift+L là phím tắt Filter nên học tại đúng bài này.',
          questions:[
            {q:'Filter có xóa các dòng không thỏa điều kiện không?',options:['Có','Không, thường chỉ ẩn tạm khỏi chế độ xem','Chỉ trên 365','Chỉ khi Sort'],answer:1,explain:'Filter thay đổi visibility của dòng, không phải Delete. Dữ liệu vẫn tồn tại cho tới khi bạn xóa riêng.'},
            {q:'Date Filter không nhóm ngày đúng thường nên kiểm tra gì?',options:['Kiểu dữ liệu có phải Date thật','Màu tab Sheet','Font','Zoom'],answer:0,explain:'Ngày dạng Text không có hành vi Date Filter chuẩn. Kiểu dữ liệu là điểm cần kiểm tra trước.'}
          ]
        },
        {
          title:'Find, Replace và Go To',kind:'core',
          why:'Tìm/thay hàng loạt rất mạnh nhưng cũng có thể sửa quá rộng nếu không giới hạn phạm vi.',
          body:['Ctrl+F tìm nội dung; Ctrl+H mở Replace. Có thể tìm trong Sheet/Workbook, theo value/formula và dùng Options để kiểm soát. Trước Replace All, nên Find All hoặc thử vài kết quả để hiểu phạm vi.','Go To (Ctrl+G hoặc F5) giúp nhảy tới địa chỉ/Name. Go To Special có thể chọn Blank, Formula, Constant, Visible cells only… và sẽ được dùng nhiều hơn ở bài làm sạch.'],
          warning:'Replace All trên toàn Workbook có thể thay chuỗi trong những Sheet bạn không định sửa. Luôn xác nhận Scope và backup khi thay lớn.',
          questions:[
            {q:'Trước Replace All toàn bảng, thói quen nào an toàn?',options:['Không cần xem trước','Find All/thử phạm vi trước','Merge bảng','Đổi theme'],answer:1,explain:'Xem trước giúp tránh thay nhầm các chuỗi tương tự hoặc Sheet ngoài phạm vi.'},
            {q:'Ctrl+F chủ yếu dùng để?',options:['Tìm nội dung','Lưu','In','Bật Macro'],answer:0,explain:'Ctrl+F mở Find. Save là Ctrl+S; Print là Ctrl+P.'}
          ]
        },
        {
          title:'Freeze Panes, Hide/Unhide và làm việc với bảng dài',kind:'core',
          why:'Khả năng nhìn context khi cuộn giúp giảm nhầm cột/dòng trong file lớn.',
          body:['Freeze Panes giữ hàng/cột tiêu đề khi cuộn. Freeze Top Row giữ dòng đầu; Freeze First Column giữ cột đầu. Freeze Panes theo vị trí ô đang chọn có thể giữ đồng thời nhiều hàng/cột phía trên/trái.','Hide/Unhide giúp tạm ẩn cột phụ, nhưng dữ liệu vẫn tồn tại. Khi nhận file, luôn kiểm tra có hàng/cột/Sheet bị ẩn trước khi kết luận dữ liệu thiếu.'],
          questions:[
            {q:'Freeze Panes có xóa dữ liệu phía trên không?',options:['Có','Không, chỉ cố định vùng khi cuộn','Chỉ khi Filter','Chỉ trên Mac'],answer:1,explain:'Freeze ảnh hưởng cách xem, không thay dữ liệu.'},
            {q:'Một cột không thấy giữa D và F có thể do?',options:['Cột E bị ẩn','Excel không có cột E','Công thức lỗi','Zoom 100%'],answer:0,explain:'Hide Column có thể làm tiêu đề cột nhảy từ D sang F. Cần Unhide để kiểm tra.'}
          ]
        },
        {
          title:'Kiểm tra trước khi chuyển sang phân tích',kind:'extension',
          why:'Một Pivot đẹp vẫn sai nếu source thiếu dòng, duplicate hoặc grain không thống nhất.',
          body:['Trước phân tích, kiểm tra header, blank rows, kiểu dữ liệu, key, duplicate, số dòng, tổng kiểm soát và Filter đang bật. Đây là “pre-flight check” đơn giản nhưng giảm nhiều lỗi.','Khi có dữ liệu mới, so sánh row count, min/max date và một vài tổng quan trọng với kỳ trước. Nếu chênh lệch bất thường, tìm nguyên nhân trước khi làm chart.'],
          questions:[
            {q:'Trước Pivot, điều gì quan trọng hơn màu của source?',options:['Kiểm tra grain, header, type và row count','Chọn theme','Thêm icon','Merge title'],answer:0,explain:'Tính toàn vẹn dữ liệu quyết định kết quả phân tích; màu sắc chỉ là trình bày.'},
            {q:'Row count giảm mạnh so với kỳ trước, nên?',options:['Bỏ qua nếu chart đẹp','Kiểm tra filter/nguồn/thiếu dữ liệu trước khi kết luận','Tăng font','Đổi tên file'],answer:1,explain:'Chênh lệch row count là tín hiệu data quality hoặc scope cần được giải thích trước phân tích.'}
          ]
        }
      ]
    }
  ];
  window.AVPKnowledgeLessons = (window.AVPKnowledgeLessons || []).concat(lessons);
})();
