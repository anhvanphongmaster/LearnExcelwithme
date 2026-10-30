/* AVP Excel Knowledge Library — curated learning catalogue */
window.AVP_KNOWLEDGE_BANK = [
  {
    "id": "K001",
    "categoryId": "01",
    "category": "Nền tảng Excel",
    "title": "Workbook và Worksheet",
    "level": "Cơ bản",
    "summary": "Workbook là tệp Excel; Worksheet là từng trang tính nằm bên trong tệp đó.",
    "concept": "Workbook là tệp Excel; Worksheet là từng trang tính nằm bên trong tệp đó.",
    "principle": "Một Workbook có thể chứa nhiều Worksheet. Mỗi Worksheet có lưới gồm hàng và cột. Tên trang tính nằm ở các tab phía dưới cửa sổ Excel.",
    "example": "Tệp BaoCao.xlsx là Workbook. Các tab Thang 1, Thang 2 và Tong hop là ba Worksheet trong cùng tệp.",
    "scenario": "Dùng một Workbook để quản lý dữ liệu theo tháng và một Worksheet riêng để tổng hợp.",
    "misconception": "Nhầm Worksheet là một tệp độc lập. Thực tế Worksheet nằm trong Workbook.",
    "question": "Workbook là gì?",
    "answer": "Một tệp Excel có thể chứa nhiều Worksheet.",
    "options": [
      "Một ô trong Worksheet",
      "Một công thức Excel",
      "Một biểu đồ"
    ]
  },
  {
    "id": "K002",
    "categoryId": "01",
    "category": "Nền tảng Excel",
    "title": "Cell, Row, Column và Range",
    "level": "Cơ bản",
    "summary": "Cell là ô giao nhau giữa một hàng và một cột; Range là một ô hoặc một vùng ô.",
    "concept": "Cell là ô giao nhau giữa một hàng và một cột; Range là một ô hoặc một vùng ô.",
    "principle": "Cột được đặt tên bằng chữ cái, hàng được đánh số. Địa chỉ ô ghép tên cột và số hàng, ví dụ B3. Một vùng liên tục được viết bằng ô đầu và ô cuối, ví dụ B3:D8.",
    "example": "B3 là một Cell; hàng 3 là Row; cột B là Column; B3:D8 là Range.",
    "scenario": "Xác định đúng vùng dữ liệu trước khi tạo công thức, định dạng hoặc biểu đồ.",
    "misconception": "Nhầm B3:D8 là một ô. Đây là vùng gồm nhiều ô.",
    "question": "B3:D8 biểu thị điều gì?",
    "answer": "Một vùng từ B3 đến D8.",
    "options": [
      "Một Worksheet",
      "Một Workbook",
      "Một cột duy nhất"
    ]
  },
  {
    "id": "K003",
    "categoryId": "01",
    "category": "Nền tảng Excel",
    "title": "Name Box và Formula Bar",
    "level": "Cơ bản",
    "summary": "Name Box hiển thị địa chỉ hoặc tên vùng đang chọn; Formula Bar hiển thị nội dung thực của ô đang chọn.",
    "concept": "Name Box hiển thị địa chỉ hoặc tên vùng đang chọn; Formula Bar hiển thị nội dung thực của ô đang chọn.",
    "principle": "Khi chọn ô, Name Box cho biết vị trí. Formula Bar cho biết giá trị, văn bản hoặc công thức được lưu trong ô, không nhất thiết giống cách ô đang hiển thị.",
    "example": "Ô C5 hiển thị 25%, nhưng Formula Bar có thể hiển thị 0.25.",
    "scenario": "Dùng Name Box để đi nhanh đến A1000 hoặc một Named Range; dùng Formula Bar để kiểm tra công thức dài.",
    "misconception": "Cho rằng Formula Bar chỉ hiển thị công thức. Nó cũng hiển thị giá trị hoặc văn bản.",
    "question": "Dùng Name Box để làm gì?",
    "answer": "Đi đến hoặc xác định ô/vùng đang chọn.",
    "options": [
      "Đổi kiểu dữ liệu",
      "Tạo biểu đồ",
      "Tính tổng tự động"
    ]
  },
  {
    "id": "K004",
    "categoryId": "01",
    "category": "Nền tảng Excel",
    "title": "Used Range và vùng dữ liệu thực tế",
    "level": "Trung cấp",
    "summary": "Used Range là vùng Worksheet mà Excel xem là đã được sử dụng hoặc định dạng.",
    "concept": "Used Range là vùng Worksheet mà Excel xem là đã được sử dụng hoặc định dạng.",
    "principle": "Một ô từng nhập dữ liệu rồi xóa vẫn có thể khiến vùng sử dụng bị mở rộng. Điều này có thể làm tệp nặng hoặc khiến thao tác chọn vùng vượt xa dữ liệu thực tế.",
    "example": "Bảng chỉ có dữ liệu đến dòng 500 nhưng Ctrl+End đưa đến dòng 50000 do định dạng thừa.",
    "scenario": "Kiểm tra vùng cuối trang tính khi file bất thường lớn hoặc cuộn rất xa.",
    "misconception": "Nghĩ rằng xóa nội dung là luôn thu nhỏ Used Range ngay lập tức.",
    "question": "Ctrl+End có thể giúp kiểm tra điều gì?",
    "answer": "Vị trí cuối vùng Excel đang nhận diện là đã sử dụng.",
    "options": [
      "Ô có công thức cuối cùng",
      "Ô đầu tiên",
      "Tên Workbook"
    ]
  },
  {
    "id": "K005",
    "categoryId": "01",
    "category": "Nền tảng Excel",
    "title": "Giới hạn hàng, cột và độ dài dữ liệu",
    "level": "Cơ bản",
    "summary": "Excel có giới hạn kỹ thuật về số hàng, số cột và độ dài nội dung mỗi ô.",
    "concept": "Excel có giới hạn kỹ thuật về số hàng, số cột và độ dài nội dung mỗi ô.",
    "principle": "Trong các phiên bản Excel hiện đại, một Worksheet có 1.048.576 hàng và 16.384 cột, cột cuối là XFD. Một ô có giới hạn 32.767 ký tự; không nên nhầm giới hạn này với lượng văn bản hiển thị trong ô.",
    "example": "Khi dữ liệu vượt giới hạn hàng của một Worksheet, cần chia dữ liệu hoặc dùng công cụ phù hợp như Power Query hay cơ sở dữ liệu.",
    "scenario": "Ước lượng quy mô dữ liệu trước khi thiết kế workbook lớn.",
    "misconception": "Cho rằng Excel có số hàng vô hạn hoặc mọi phiên bản đều có cùng giới hạn.",
    "question": "Cột cuối của Worksheet Excel hiện đại là gì?",
    "answer": "XFD",
    "options": [
      "ZZZ",
      "XFC",
      "IV"
    ]
  },
  {
    "id": "K006",
    "categoryId": "02",
    "category": "Dữ liệu và kiểu dữ liệu",
    "title": "Number và Text",
    "level": "Cơ bản",
    "summary": "Number là giá trị số có thể tham gia phép tính; Text là chuỗi ký tự được xử lý như văn bản.",
    "concept": "Number là giá trị số có thể tham gia phép tính; Text là chuỗi ký tự được xử lý như văn bản.",
    "principle": "Một chuỗi gồm chữ số chưa chắc là Number. Mã nhân viên 00125 thường nên giữ dạng Text để không mất số 0 đầu; số lượng 125 nên là Number để tính toán.",
    "example": "Mã sản phẩm 00078 cần giữ nguyên số 0 đầu; số lượng sản phẩm 78 cần cộng trừ được.",
    "scenario": "Phân biệt mã định danh với đại lượng đo lường trước khi nhập dữ liệu.",
    "misconception": "Chuyển mọi dữ liệu nhìn giống số thành Number có thể làm hỏng mã có số 0 đầu.",
    "question": "Mã nhân viên 00125 nên lưu kiểu nào?",
    "answer": "Text",
    "options": [
      "Number",
      "Date",
      "Boolean"
    ]
  },
  {
    "id": "K007",
    "categoryId": "02",
    "category": "Dữ liệu và kiểu dữ liệu",
    "title": "Excel lưu trữ ngày tháng",
    "level": "Cơ bản",
    "summary": "Trong hệ ngày 1900 mặc định phổ biến, ngày được lưu dưới dạng số sê-ri; phần giờ là phần thập phân của một ngày.",
    "concept": "Trong hệ ngày 1900 mặc định phổ biến, ngày được lưu dưới dạng số sê-ri; phần giờ là phần thập phân của một ngày.",
    "principle": "Phần nguyên biểu thị số ngày tính từ mốc hệ thống ngày của Excel; phần thập phân biểu thị phần thời gian trong ngày. Định dạng ô quyết định cách số đó được hiển thị thành ngày hoặc giờ.",
    "example": "Ngày 01/01/2026 có số sê-ri 46023 trong hệ ngày 1900. 12:00 tương ứng phần 0.5 của một ngày.",
    "scenario": "Giải thích vì sao có thể trừ hai ngày để tính số ngày, hoặc cộng thời gian vào ngày.",
    "misconception": "Đổi định dạng ô thành Date không đảm bảo chuỗi văn bản ngày được chuyển thành ngày thật.",
    "question": "Phần giờ trong giá trị ngày-giờ được biểu diễn thế nào?",
    "answer": "Bằng phần thập phân của một ngày.",
    "options": [
      "Bằng màu chữ",
      "Bằng tên Worksheet",
      "Bằng công thức riêng"
    ]
  },
  {
    "id": "K008",
    "categoryId": "02",
    "category": "Dữ liệu và kiểu dữ liệu",
    "title": "Time và phần thập phân",
    "level": "Cơ bản",
    "summary": "Excel biểu diễn thời gian trong ngày bằng phần của 24 giờ.",
    "concept": "Excel biểu diễn thời gian trong ngày bằng phần của 24 giờ.",
    "principle": "Một ngày bằng 1; một giờ bằng 1/24; một phút bằng 1/1440. Vì vậy 6:00 sáng là 0.25 và 18:00 là 0.75 nếu chỉ lưu thời gian.",
    "example": "Cộng 8 giờ vào thời điểm 08:00 cho kết quả 16:00 cùng ngày nếu không vượt qua nửa đêm.",
    "scenario": "Hiểu cách lưu thời gian để tính giờ làm, thời lượng và ca qua đêm.",
    "misconception": "Nhầm 08:00 là số 8. Trong Excel, thời gian này là một phần của ngày.",
    "question": "Một giờ tương ứng với giá trị nào?",
    "answer": "1/24",
    "options": [
      "1/60",
      "1/100",
      "24"
    ]
  },
  {
    "id": "K009",
    "categoryId": "02",
    "category": "Dữ liệu và kiểu dữ liệu",
    "title": "TRUE, FALSE và Boolean",
    "level": "Cơ bản",
    "summary": "Boolean là kiểu giá trị logic chỉ có hai trạng thái TRUE hoặc FALSE.",
    "concept": "Boolean là kiểu giá trị logic chỉ có hai trạng thái TRUE hoặc FALSE.",
    "principle": "Các phép so sánh như A1>100 trả về TRUE hoặc FALSE. Nhiều hàm và điều kiện sử dụng giá trị logic để quyết định kết quả.",
    "example": "Nếu số lượng lớn hơn 0, biểu thức B2>0 trả về TRUE; nếu không, trả về FALSE.",
    "scenario": "Dùng kiểm tra logic để phân loại dữ liệu, xác nhận điều kiện và kiểm soát chất lượng.",
    "misconception": "Nhầm chữ TRUE được gõ như văn bản với giá trị logic TRUE.",
    "question": "Kết quả của phép so sánh A1>100 là kiểu gì?",
    "answer": "Boolean",
    "options": [
      "Date",
      "Text",
      "Currency"
    ]
  },
  {
    "id": "K010",
    "categoryId": "02",
    "category": "Dữ liệu và kiểu dữ liệu",
    "title": "Blank, Empty String và khoảng trắng",
    "level": "Trung cấp",
    "summary": "Ô trống thật, chuỗi rỗng do công thức trả về và ô chứa dấu cách là ba trạng thái khác nhau.",
    "concept": "Ô trống thật, chuỗi rỗng do công thức trả về và ô chứa dấu cách là ba trạng thái khác nhau.",
    "principle": "Ô trống không chứa giá trị; công thức =\"\" trả về chuỗi rỗng; ô chứa dấu cách có ký tự khoảng trắng. Chúng có thể khác nhau khi đếm, lọc hoặc kiểm tra dữ liệu.",
    "example": "COUNTA có thể đếm ô chứa công thức trả về chuỗi rỗng; ô chứa một dấu cách cũng không phải ô trống thật.",
    "scenario": "Kiểm tra dữ liệu nhập liệu và xử lý những dòng tưởng trống nhưng vẫn bị tính.",
    "misconception": "Dùng mắt nhìn để kết luận ô trống là không đủ.",
    "question": "Ô chứa một dấu cách có phải ô trống thật không?",
    "answer": "Không",
    "options": [
      "Có",
      "Chỉ khi định dạng General",
      "Chỉ khi có màu trắng"
    ]
  },
  {
    "id": "K011",
    "categoryId": "02",
    "category": "Dữ liệu và kiểu dữ liệu",
    "title": "Giá trị thực và giá trị hiển thị",
    "level": "Cơ bản",
    "summary": "Giá trị lưu trong ô có thể khác cách Excel trình bày giá trị đó trên màn hình.",
    "concept": "Giá trị lưu trong ô có thể khác cách Excel trình bày giá trị đó trên màn hình.",
    "principle": "Number Format, độ rộng cột và định dạng có thể làm tròn hoặc thay đổi cách hiển thị mà không thay đổi giá trị gốc. Công thức thường tính trên giá trị lưu trữ, không phải số chữ số đang nhìn thấy.",
    "example": "Ô lưu 12.345 nhưng định dạng hiển thị 12.35; phép tính vẫn có thể dùng 12.345.",
    "scenario": "Đối soát số liệu khi tổng trên báo cáo khác tổng các số đã làm tròn đang nhìn thấy.",
    "misconception": "Nhầm định dạng hiển thị 2 chữ số thập phân với việc làm tròn giá trị thật.",
    "question": "Định dạng hiển thị 2 chữ số có tự thay đổi giá trị gốc không?",
    "answer": "Không",
    "options": [
      "Luôn luôn",
      "Chỉ khi lưu file",
      "Chỉ trong PivotTable"
    ]
  },
  {
    "id": "K012",
    "categoryId": "03",
    "category": "Cấu trúc và tham chiếu",
    "title": "Relative Reference",
    "level": "Cơ bản",
    "summary": "Tham chiếu tương đối thay đổi theo vị trí mới khi sao chép công thức.",
    "concept": "Tham chiếu tương đối thay đổi theo vị trí mới khi sao chép công thức.",
    "principle": "A1 là tham chiếu tương đối. Khi sao chép công thức sang ô khác, Excel dịch địa chỉ theo số hàng và cột mà công thức di chuyển.",
    "example": "Công thức =A2*B2 sao chép xuống dòng kế tiếp trở thành =A3*B3.",
    "scenario": "Dùng khi mỗi dòng cần tính theo dữ liệu của chính dòng đó.",
    "misconception": "Cho rằng địa chỉ A1 luôn chỉ đến cùng một ô dù công thức được sao chép.",
    "question": "Sao chép =A1 sang ô bên dưới sẽ tham chiếu đến ô nào?",
    "answer": "A2",
    "options": [
      "A1",
      "B1",
      "B2"
    ]
  },
  {
    "id": "K013",
    "categoryId": "03",
    "category": "Cấu trúc và tham chiếu",
    "title": "Absolute Reference",
    "level": "Cơ bản",
    "summary": "Tham chiếu tuyệt đối cố định cả cột và hàng khi sao chép công thức.",
    "concept": "Tham chiếu tuyệt đối cố định cả cột và hàng khi sao chép công thức.",
    "principle": "Dấu đô la đứng trước tên cột và số hàng, ví dụ $A$1. Khi sao chép công thức theo bất kỳ hướng nào, địa chỉ này không dịch chuyển.",
    "example": "Tỷ lệ thuế đặt tại B1; công thức dùng =A2*$B$1 để mọi dòng đều lấy cùng một tỷ lệ.",
    "scenario": "Dùng cho ô chứa tỷ lệ, ngưỡng, hệ số hoặc tham số dùng chung.",
    "misconception": "Nhầm $A$1 với A$1 hoặc $A1; hai dạng sau chỉ khóa một phần.",
    "question": "Ký hiệu nào khóa cả cột và hàng?",
    "answer": "$A$1",
    "options": [
      "A$1",
      "$A1",
      "A1"
    ]
  },
  {
    "id": "K014",
    "categoryId": "03",
    "category": "Cấu trúc và tham chiếu",
    "title": "Mixed Reference",
    "level": "Trung cấp",
    "summary": "Tham chiếu hỗn hợp chỉ khóa cột hoặc chỉ khóa hàng.",
    "concept": "Tham chiếu hỗn hợp chỉ khóa cột hoặc chỉ khóa hàng.",
    "principle": "A$1 khóa hàng 1 nhưng cho phép cột thay đổi; $A1 khóa cột A nhưng cho phép hàng thay đổi. Đây là cách tạo công thức ma trận hoặc bảng hai chiều.",
    "example": "Bảng giá theo số lượng và mức chiết khấu có thể cần khóa hàng tiêu đề hoặc cột tiêu đề khi kéo công thức.",
    "scenario": "Dùng khi sao chép công thức đồng thời theo chiều ngang và chiều dọc.",
    "misconception": "Cho rằng chỉ có tham chiếu tương đối và tuyệt đối; thực tế có dạng hỗn hợp.",
    "question": "$A1 khóa phần nào?",
    "answer": "Cột A",
    "options": [
      "Hàng 1",
      "Cả cột và hàng",
      "Không khóa phần nào"
    ]
  },
  {
    "id": "K015",
    "categoryId": "03",
    "category": "Cấu trúc và tham chiếu",
    "title": "Named Range",
    "level": "Trung cấp",
    "summary": "Named Range là tên được đặt cho một ô, vùng ô, hằng số hoặc công thức.",
    "concept": "Named Range là tên được đặt cho một ô, vùng ô, hằng số hoặc công thức.",
    "principle": "Tên giúp công thức dễ đọc và dễ bảo trì hơn địa chỉ ô. Phạm vi tên có thể ở mức Workbook hoặc Worksheet, vì vậy cần kiểm tra scope khi có tên trùng.",
    "example": "Thay vì =B2*$F$2, có thể dùng =B2*TaxRate nếu F2 được đặt tên TaxRate.",
    "scenario": "Dùng cho tham số chung, vùng dữ liệu thường xuyên tham chiếu và công thức dài.",
    "misconception": "Đặt tên không làm dữ liệu tự cập nhật hoặc tự biến thành bảng dữ liệu.",
    "question": "Named Range giúp ích chủ yếu ở điểm nào?",
    "answer": "Làm công thức dễ hiểu và quản lý hơn.",
    "options": [
      "Tăng giới hạn số hàng",
      "Tự sửa dữ liệu sai",
      "Tự tạo biểu đồ"
    ]
  },
  {
    "id": "K016",
    "categoryId": "03",
    "category": "Cấu trúc và tham chiếu",
    "title": "Structured Reference",
    "level": "Trung cấp",
    "summary": "Structured Reference là cách tham chiếu cột và vùng trong Excel Table bằng tên bảng và tên trường.",
    "concept": "Structured Reference là cách tham chiếu cột và vùng trong Excel Table bằng tên bảng và tên trường.",
    "principle": "Công thức có thể gọi tên cột như TableSales[Amount] thay vì địa chỉ ô. Khi Table mở rộng, tham chiếu có thể tự bao gồm dữ liệu mới theo cấu trúc Table.",
    "example": "=SUM(TableSales[Amount]) tính tổng cột Amount trong bảng TableSales.",
    "scenario": "Dùng trong báo cáo bán hàng hoặc bảng dữ liệu thường xuyên thêm dòng.",
    "misconception": "Nhầm Structured Reference dùng được cho mọi vùng dữ liệu dù chưa chuyển thành Table.",
    "question": "Structured Reference gắn với đối tượng nào?",
    "answer": "Excel Table",
    "options": [
      "Chart Sheet",
      "Tên Workbook",
      "Comment"
    ]
  },
  {
    "id": "K017",
    "categoryId": "03",
    "category": "Cấu trúc và tham chiếu",
    "title": "Tham chiếu giữa Sheet và Workbook",
    "level": "Trung cấp",
    "summary": "Excel cho phép công thức tham chiếu ô ở Worksheet khác hoặc Workbook khác.",
    "concept": "Excel cho phép công thức tham chiếu ô ở Worksheet khác hoặc Workbook khác.",
    "principle": "Tham chiếu cùng Workbook thường có dạng Sheet2!A1; tham chiếu Workbook khác có thể chứa tên tệp và đường dẫn. Liên kết ngoài có thể bị ảnh hưởng khi đổi tên, di chuyển hoặc đóng nguồn.",
    "example": "Sheet TongHop lấy dữ liệu từ Sheet Thang1 bằng =Thang1!B5.",
    "scenario": "Tổ chức báo cáo tổng hợp từ nhiều trang tính hoặc nhiều tệp nguồn.",
    "misconception": "Nghĩ rằng liên kết ngoài luôn tự tìm đúng tệp sau khi di chuyển thư mục.",
    "question": "Tham chiếu Sheet khác thường có ký tự nào trước địa chỉ ô?",
    "answer": "Dấu chấm than !",
    "options": [
      "Dấu hai chấm :",
      "Dấu gạch dưới _",
      "Dấu phần trăm %"
    ]
  },
  {
    "id": "K018",
    "categoryId": "04",
    "category": "Định dạng và hiển thị",
    "title": "Number Format không đổi giá trị gốc",
    "level": "Cơ bản",
    "summary": "Number Format quyết định cách hiển thị giá trị, không nhất thiết thay đổi giá trị lưu trữ.",
    "concept": "Number Format quyết định cách hiển thị giá trị, không nhất thiết thay đổi giá trị lưu trữ.",
    "principle": "Một số 0.15 có thể hiển thị 15% hoặc 0.15 tùy định dạng. Định dạng tiền tệ thêm ký hiệu tiền nhưng không tự chuyển đổi tỷ giá hoặc giá trị.",
    "example": "Giá trị 1500000 hiển thị thành 1,500,000 ₫ khi áp dụng định dạng tiền tệ phù hợp.",
    "scenario": "Chuẩn hóa cách trình bày báo cáo mà vẫn giữ số liệu để tính toán.",
    "misconception": "Nhầm chọn định dạng Currency là đã quy đổi tiền tệ.",
    "question": "Đổi Number Format có luôn thay đổi giá trị lưu trữ không?",
    "answer": "Không",
    "options": [
      "Có",
      "Chỉ với phần trăm",
      "Chỉ với ngày"
    ]
  },
  {
    "id": "K019",
    "categoryId": "04",
    "category": "Định dạng và hiển thị",
    "title": "Custom Number Format",
    "level": "Trung cấp",
    "summary": "Custom Number Format cho phép định nghĩa cách hiển thị số dương, số âm, số 0 và văn bản.",
    "concept": "Custom Number Format cho phép định nghĩa cách hiển thị số dương, số âm, số 0 và văn bản.",
    "principle": "Mã định dạng có thể chia tối đa bốn phần theo thứ tự dương; âm; zero; text. Các ký hiệu định dạng chỉ thay đổi cách trình bày, không sửa nội dung gốc.",
    "example": "Mã 00000 hiển thị số 78 thành 00078 nhưng giá trị số vẫn là 78.",
    "scenario": "Dùng để hiển thị mã có số 0 đầu hoặc trình bày báo cáo theo quy ước.",
    "misconception": "Dùng Custom Format để biến số thành mã văn bản thực sự là hiểu sai.",
    "question": "Mã 00000 làm gì với số 78?",
    "answer": "Hiển thị thành 00078 nhưng giữ giá trị số 78.",
    "options": [
      "Đổi thành văn bản 00078",
      "Nhân số với 100000",
      "Xóa số 78"
    ]
  },
  {
    "id": "K020",
    "categoryId": "04",
    "category": "Định dạng và hiển thị",
    "title": "Conditional Formatting",
    "level": "Trung cấp",
    "summary": "Conditional Formatting thay đổi cách trình bày ô dựa trên điều kiện.",
    "concept": "Conditional Formatting thay đổi cách trình bày ô dựa trên điều kiện.",
    "principle": "Quy tắc có thể dựa trên giá trị, công thức, thanh dữ liệu, thang màu hoặc bộ biểu tượng. Quy tắc có thứ tự ưu tiên và vùng áp dụng; nhiều quy tắc có thể cùng tác động một ô.",
    "example": "Tô đỏ các dòng có tỷ lệ lỗi vượt ngưỡng 2%.",
    "scenario": "Làm nổi bật bất thường, KPI thấp hoặc dữ liệu cần kiểm tra.",
    "misconception": "Nghĩ rằng ô được tô đỏ nghĩa là giá trị đã bị thay đổi.",
    "question": "Conditional Formatting tác động chủ yếu đến điều gì?",
    "answer": "Cách hiển thị ô theo điều kiện.",
    "options": [
      "Giá trị lưu trữ",
      "Tên Sheet",
      "Nguồn dữ liệu"
    ]
  },
  {
    "id": "K021",
    "categoryId": "04",
    "category": "Định dạng và hiển thị",
    "title": "Cell Style và Theme",
    "level": "Cơ bản",
    "summary": "Cell Style là bộ định dạng có sẵn cho ô; Theme là bộ màu sắc và phông chữ thống nhất cho Workbook.",
    "concept": "Cell Style là bộ định dạng có sẵn cho ô; Theme là bộ màu sắc và phông chữ thống nhất cho Workbook.",
    "principle": "Dùng Style giúp trình bày nhất quán. Theme điều khiển bảng màu và phông chủ đạo, nên thay Theme có thể ảnh hưởng các màu và kiểu gắn với Theme.",
    "example": "Dùng Heading Style cho tiêu đề, Input Style cho ô nhập liệu và màu Theme cho biểu đồ.",
    "scenario": "Chuẩn hóa báo cáo nhiều Sheet để người xem nhận diện cùng một hệ thống.",
    "misconception": "Nhầm Style là kiểu dữ liệu hoặc công cụ bảo vệ ô.",
    "question": "Theme chủ yếu quản lý gì?",
    "answer": "Màu sắc và phông chữ chủ đạo.",
    "options": [
      "Công thức tính toán",
      "Quyền truy cập",
      "Số hàng"
    ]
  },
  {
    "id": "K022",
    "categoryId": "04",
    "category": "Định dạng và hiển thị",
    "title": "Độ rộng cột, chiều cao hàng và ####",
    "level": "Cơ bản",
    "summary": "Cách hiển thị có thể bị giới hạn bởi kích thước ô dù giá trị vẫn còn nguyên.",
    "concept": "Cách hiển thị có thể bị giới hạn bởi kích thước ô dù giá trị vẫn còn nguyên.",
    "principle": "Chuỗi ##### thường xuất hiện khi cột quá hẹp để hiển thị số hoặc ngày; với ngày giờ âm cũng có thể xuất hiện do hệ ngày/giá trị không hỗ trợ cách hiển thị đó.",
    "example": "Một ô chứa ngày hợp lệ nhưng cột quá hẹp nên hiện #####.",
    "scenario": "Kiểm tra độ rộng cột và định dạng trước khi kết luận dữ liệu bị lỗi.",
    "misconception": "Cho rằng ##### luôn có nghĩa công thức sai.",
    "question": "Khi số hiển thị ##### do cột hẹp, nên kiểm tra gì trước?",
    "answer": "Độ rộng cột và định dạng.",
    "options": [
      "Tên file",
      "Mật khẩu Workbook",
      "Số lượng Sheet"
    ]
  },
  {
    "id": "K023",
    "categoryId": "04",
    "category": "Định dạng và hiển thị",
    "title": "Định dạng ngày và thiết lập vùng",
    "level": "Trung cấp",
    "summary": "Cách diễn giải ngày có thể phụ thuộc định dạng, ngôn ngữ và thiết lập vùng của hệ thống.",
    "concept": "Cách diễn giải ngày có thể phụ thuộc định dạng, ngôn ngữ và thiết lập vùng của hệ thống.",
    "principle": "Chuỗi 03/04/2026 có thể được hiểu là ngày 3 tháng 4 hoặc ngày 4 tháng 3 tùy quy ước. Nên dùng dữ liệu ngày thực, định dạng rõ ràng và kiểm tra nguồn nhập.",
    "example": "CSV xuất từ hệ thống dùng tháng/ngày/năm nhưng máy nhận dữ liệu đang hiểu ngày/tháng/năm.",
    "scenario": "Chuẩn hóa dữ liệu ngày trước khi tổng hợp nhiều nguồn.",
    "misconception": "Chỉ đổi hình thức hiển thị không luôn sửa được ngày đã bị diễn giải sai khi nhập.",
    "question": "Vì sao cùng chuỗi 03/04/2026 có thể bị hiểu khác nhau?",
    "answer": "Do quy ước ngày tháng và thiết lập vùng khác nhau.",
    "options": [
      "Do độ rộng cột",
      "Do màu nền",
      "Do tên Worksheet"
    ]
  },
  {
    "id": "K024",
    "categoryId": "05",
    "category": "Quản lý dữ liệu",
    "title": "Excel Table là gì?",
    "level": "Cơ bản",
    "summary": "Excel Table là đối tượng bảng có cấu trúc, có Header, bộ lọc và khả năng mở rộng theo dữ liệu.",
    "concept": "Excel Table là đối tượng bảng có cấu trúc, có Header, bộ lọc và khả năng mở rộng theo dữ liệu.",
    "principle": "Table quản lý dữ liệu theo cột có tên. Khi thêm dòng liền kề hoặc nhập ở dòng cuối, Table thường tự mở rộng và có thể tự điền công thức cột tính toán.",
    "example": "Chuyển vùng dữ liệu bán hàng thành Table tên SalesData để dễ lọc và tham chiếu.",
    "scenario": "Dùng Table làm nguồn cho báo cáo, công thức và PivotTable.",
    "misconception": "Nhầm tô màu một vùng ô là đã tạo Excel Table.",
    "question": "Đặc điểm nào cho thấy vùng dữ liệu là Excel Table?",
    "answer": "Có tên bảng và các cột có cấu trúc.",
    "options": [
      "Có màu nền bất kỳ",
      "Có đường viền đậm",
      "Có nhiều Sheet"
    ]
  },
  {
    "id": "K025",
    "categoryId": "05",
    "category": "Quản lý dữ liệu",
    "title": "Thiết kế bảng dữ liệu chuẩn",
    "level": "Cơ bản",
    "summary": "Bảng dữ liệu tốt có một dòng tiêu đề rõ ràng, mỗi cột là một trường và mỗi dòng là một bản ghi.",
    "concept": "Bảng dữ liệu tốt có một dòng tiêu đề rõ ràng, mỗi cột là một trường và mỗi dòng là một bản ghi.",
    "principle": "Tránh tiêu đề nhiều tầng, dòng trống xen giữa, gộp ô trong vùng dữ liệu và đặt nhiều loại thông tin trong một cột. Mỗi trường nên có kiểu dữ liệu nhất quán.",
    "example": "Bảng lỗi QC nên có Ngày, Ca, Mã máy, Mã lỗi, Số lượng; mỗi dòng đại diện một bản ghi theo quy ước thống nhất.",
    "scenario": "Thiết kế nguồn dữ liệu sạch trước khi dùng PivotTable, Power Query hoặc phân tích.",
    "misconception": "Làm đẹp bảng bằng gộp ô có thể khiến máy khó đọc và tổng hợp.",
    "question": "Trong bảng dữ liệu chuẩn, mỗi dòng thường đại diện cho gì?",
    "answer": "Một bản ghi.",
    "options": [
      "Một tiêu đề trang",
      "Một biểu đồ",
      "Một công thức"
    ]
  },
  {
    "id": "K026",
    "categoryId": "05",
    "category": "Quản lý dữ liệu",
    "title": "Sort và thứ tự sắp xếp",
    "level": "Cơ bản",
    "summary": "Sort sắp xếp các bản ghi theo một hoặc nhiều trường theo thứ tự xác định.",
    "concept": "Sort sắp xếp các bản ghi theo một hoặc nhiều trường theo thứ tự xác định.",
    "principle": "Sắp xếp có thể tăng dần, giảm dần hoặc theo danh sách tùy chỉnh. Khi sắp xếp phải mở rộng vùng để các giá trị trên cùng dòng không bị tách rời.",
    "example": "Sắp xếp danh sách nhân viên theo phòng ban rồi theo họ tên.",
    "scenario": "Sắp xếp nhiều tiêu chí để tạo danh sách báo cáo có trật tự.",
    "misconception": "Chỉ chọn một cột rồi sắp xếp có thể làm lệch quan hệ giữa các cột nếu không xử lý cả vùng.",
    "question": "Rủi ro lớn khi chỉ sắp xếp một cột riêng là gì?",
    "answer": "Dữ liệu các cột khác có thể không còn đúng bản ghi.",
    "options": [
      "File tự đóng",
      "Mất định dạng số",
      "Tạo bản sao Sheet"
    ]
  },
  {
    "id": "K027",
    "categoryId": "05",
    "category": "Quản lý dữ liệu",
    "title": "Filter và dữ liệu bị ẩn",
    "level": "Cơ bản",
    "summary": "Filter chỉ hiển thị các bản ghi thỏa điều kiện và tạm ẩn các bản ghi không thỏa.",
    "concept": "Filter chỉ hiển thị các bản ghi thỏa điều kiện và tạm ẩn các bản ghi không thỏa.",
    "principle": "Lọc không đồng nghĩa xóa dữ liệu. Các phép tính và thao tác trên vùng lọc có thể xử lý cả dòng ẩn hoặc chỉ dòng hiển thị tùy công cụ được dùng.",
    "example": "Lọc lỗi theo Ca đêm để xem riêng nhóm bản ghi nhưng dữ liệu Ca ngày vẫn còn trong bảng.",
    "scenario": "Phân tích từng nhóm mà không phá dữ liệu nguồn.",
    "misconception": "Nhầm lọc dữ liệu là xóa dữ liệu không phù hợp.",
    "question": "Filter có xóa các dòng không thỏa điều kiện không?",
    "answer": "Không, chỉ ẩn chúng khỏi chế độ xem.",
    "options": [
      "Có, luôn xóa",
      "Chuyển sang Sheet khác",
      "Đổi kiểu dữ liệu"
    ]
  },
  {
    "id": "K028",
    "categoryId": "05",
    "category": "Quản lý dữ liệu",
    "title": "Remove Duplicates và bản ghi trùng",
    "level": "Trung cấp",
    "summary": "Remove Duplicates xóa các bản ghi được xem là trùng theo những cột người dùng chọn.",
    "concept": "Remove Duplicates xóa các bản ghi được xem là trùng theo những cột người dùng chọn.",
    "principle": "Excel so sánh giá trị trong các cột đã chọn. Nếu chỉ chọn Mã nhân viên, các dòng có cùng mã được xem là trùng dù thông tin khác có thể khác nhau. Nên sao lưu hoặc xác định khóa trước khi xóa.",
    "example": "Một nhân viên có nhiều dòng theo ngày thì không thể chỉ xóa trùng theo Mã nhân viên nếu cần giữ lịch sử.",
    "scenario": "Xác định khóa bản ghi và tiêu chí trùng trước khi làm sạch dữ liệu.",
    "misconception": "Nhầm hai dòng có cùng một trường là chắc chắn trùng toàn bộ bản ghi.",
    "question": "Remove Duplicates dựa trên điều gì?",
    "answer": "Các cột được chọn làm tiêu chí so sánh.",
    "options": [
      "Màu ô",
      "Độ rộng cột",
      "Thứ tự Sheet"
    ]
  },
  {
    "id": "K029",
    "categoryId": "05",
    "category": "Quản lý dữ liệu",
    "title": "Data Validation và kiểm soát nhập liệu",
    "level": "Trung cấp",
    "summary": "Data Validation đặt quy tắc giới hạn hoặc hướng dẫn dữ liệu được nhập vào ô.",
    "concept": "Data Validation đặt quy tắc giới hạn hoặc hướng dẫn dữ liệu được nhập vào ô.",
    "principle": "Có thể giới hạn số, ngày, độ dài văn bản, danh sách chọn hoặc công thức tùy chỉnh. Validation giúp giảm lỗi nhập nhưng không thay thế kiểm tra dữ liệu đã tồn tại hoặc dữ liệu dán từ nguồn khác.",
    "example": "Cột Ca chỉ cho phép Day hoặc Night bằng danh sách chọn.",
    "scenario": "Chuẩn hóa dữ liệu đầu vào cho nhiều người nhập cùng một biểu mẫu.",
    "misconception": "Nghĩ rằng Data Validation ngăn được mọi dữ liệu sai trong mọi tình huống; thao tác dán dữ liệu có thể vượt qua một số cảnh báo.",
    "question": "Data Validation có mục tiêu chính là gì?",
    "answer": "Hướng dẫn và giới hạn dữ liệu nhập vào.",
    "options": [
      "Tự tạo báo cáo",
      "Tự sửa mọi dữ liệu cũ",
      "Mã hóa Workbook"
    ]
  },
  {
    "id": "K030",
    "categoryId": "06",
    "category": "Nguyên lý tính toán",
    "title": "Thứ tự ưu tiên phép tính",
    "level": "Cơ bản",
    "summary": "Excel tuân theo thứ tự ưu tiên toán tử; dấu ngoặc có thể thay đổi thứ tự tính.",
    "concept": "Excel tuân theo thứ tự ưu tiên toán tử; dấu ngoặc có thể thay đổi thứ tự tính.",
    "principle": "Phép tính trong ngoặc được xử lý trước; sau đó đến các nhóm toán tử theo quy tắc Excel, ví dụ lũy thừa, nhân chia, cộng trừ và nối văn bản/so sánh theo thứ tự quy định. Khi không chắc, hãy dùng ngoặc để thể hiện ý định.",
    "example": "=10+2*3 cho kết quả 16; =(10+2)*3 cho kết quả 36.",
    "scenario": "Kiểm tra công thức KPI, tỷ lệ và phép tính nhiều bước.",
    "misconception": "Đọc công thức từ trái sang phải như một câu văn là sai.",
    "question": "=10+2*3 cho kết quả nào?",
    "answer": "16",
    "options": [
      "36",
      "30",
      "15"
    ]
  },
  {
    "id": "K031",
    "categoryId": "06",
    "category": "Nguyên lý tính toán",
    "title": "Calculation Mode Automatic và Manual",
    "level": "Trung cấp",
    "summary": "Calculation Mode quyết định khi nào Excel tính lại các công thức trong Workbook.",
    "concept": "Calculation Mode quyết định khi nào Excel tính lại các công thức trong Workbook.",
    "principle": "Automatic thường tự tính lại khi dữ liệu phụ thuộc thay đổi. Manual chỉ tính khi người dùng yêu cầu hoặc kích hoạt lệnh tính toán. Chế độ Manual có thể khiến kết quả cũ vẫn hiển thị nếu quên tính lại.",
    "example": "Workbook lớn chuyển Manual để giảm thời gian cập nhật nhưng người dùng quên Calculate trước khi gửi báo cáo.",
    "scenario": "Kiểm tra Calculation Options khi công thức có vẻ không cập nhật.",
    "misconception": "Cho rằng công thức không đổi kết quả chắc chắn là công thức sai; có thể Workbook đang ở Manual.",
    "question": "Manual Calculation có thể gây ra vấn đề gì?",
    "answer": "Kết quả chưa được tính lại sau khi dữ liệu thay đổi.",
    "options": [
      "Tự xóa công thức",
      "Tự đổi định dạng",
      "Tự khóa Sheet"
    ]
  },
  {
    "id": "K032",
    "categoryId": "06",
    "category": "Nguyên lý tính toán",
    "title": "Formula Dependency và tính toán lại",
    "level": "Trung cấp",
    "summary": "Excel theo dõi quan hệ phụ thuộc giữa các ô để biết công thức nào cần tính lại.",
    "concept": "Excel theo dõi quan hệ phụ thuộc giữa các ô để biết công thức nào cần tính lại.",
    "principle": "Nếu C1 phụ thuộc A1 và B1, khi A1 đổi Excel có thể tính lại C1 và các công thức phía sau phụ thuộc C1. Chuỗi phụ thuộc dài và công thức nặng có thể ảnh hưởng hiệu năng.",
    "example": "Một KPI tổng hợp phụ thuộc dữ liệu nguồn, bảng trung gian và nhiều ô tính toán khác.",
    "scenario": "Thiết kế workbook có luồng tính toán dễ kiểm tra, tránh phụ thuộc vòng hoặc lặp không cần thiết.",
    "misconception": "Nhầm thứ tự ô hiển thị trên màn hình luôn là thứ tự Excel tính.",
    "question": "Formula Dependency mô tả điều gì?",
    "answer": "Quan hệ giữa ô đầu vào và ô chứa công thức phụ thuộc.",
    "options": [
      "Quan hệ giữa màu nền",
      "Thứ tự tab Sheet",
      "Kích thước file"
    ]
  },
  {
    "id": "K033",
    "categoryId": "06",
    "category": "Nguyên lý tính toán",
    "title": "Circular Reference",
    "level": "Nâng cao",
    "summary": "Circular Reference xảy ra khi công thức trực tiếp hoặc gián tiếp phụ thuộc lại chính ô đó.",
    "concept": "Circular Reference xảy ra khi công thức trực tiếp hoặc gián tiếp phụ thuộc lại chính ô đó.",
    "principle": "Ví dụ A1 chứa =B1+1 và B1 chứa =A1+1. Excel thường cảnh báo tham chiếu vòng. Một số mô hình có thể chủ động dùng tính toán lặp, nhưng phải thiết lập và kiểm soát điều kiện dừng.",
    "example": "Mô hình tính lãi hoặc số dư có quan hệ vòng cần được thiết kế có chủ đích.",
    "scenario": "Phân biệt lỗi tham chiếu vòng ngoài ý muốn với mô hình lặp có kiểm soát.",
    "misconception": "Bật Iterative Calculation không tự động làm mọi công thức vòng trở nên đúng.",
    "question": "Circular Reference là gì?",
    "answer": "Công thức phụ thuộc lại chính nó trực tiếp hoặc gián tiếp.",
    "options": [
      "Công thức tham chiếu Sheet khác",
      "Tên vùng bị trùng",
      "Dữ liệu bị lọc"
    ]
  },
  {
    "id": "K034",
    "categoryId": "06",
    "category": "Nguyên lý tính toán",
    "title": "Volatile Functions",
    "level": "Nâng cao",
    "summary": "Volatile Functions là các hàm có thể được tính lại mỗi khi Excel tính toán lại Workbook, dù đầu vào trực tiếp không đổi.",
    "concept": "Volatile Functions là các hàm có thể được tính lại mỗi khi Excel tính toán lại Workbook, dù đầu vào trực tiếp không đổi.",
    "principle": "Các hàm như NOW, TODAY, RAND, RANDBETWEEN và INDIRECT thường được xem là volatile. Dùng quá nhiều trong Workbook lớn có thể làm tăng số lần tính toán và giảm hiệu năng.",
    "example": "Một cột hàng trăm nghìn dòng dùng NOW trong từng dòng có thể khiến Workbook tính toán nặng.",
    "scenario": "Hạn chế hàm volatile khi không cần cập nhật liên tục; cân nhắc lưu giá trị cố định khi phù hợp.",
    "misconception": "Không phải mọi hàm có kết quả thay đổi theo dữ liệu đều là volatile.",
    "question": "Hàm volatile có đặc điểm gì?",
    "answer": "Có thể được tính lại mỗi khi Workbook tính toán.",
    "options": [
      "Chỉ chạy khi mở file lần đầu",
      "Luôn trả lỗi",
      "Chỉ dùng trong Macro"
    ]
  },
  {
    "id": "K035",
    "categoryId": "06",
    "category": "Nguyên lý tính toán",
    "title": "Vì sao Workbook chậm?",
    "level": "Trung cấp",
    "summary": "Hiệu năng phụ thuộc kích thước dữ liệu, số lượng công thức, cách tham chiếu, định dạng và tài nguyên máy.",
    "concept": "Hiệu năng phụ thuộc kích thước dữ liệu, số lượng công thức, cách tham chiếu, định dạng và tài nguyên máy.",
    "principle": "Công thức tham chiếu cả cột, hàm volatile, công thức mảng nặng, nhiều định dạng thừa, liên kết ngoài và Pivot/Query lớn đều có thể góp phần làm chậm. Cần xác định nút thắt thay vì xóa công thức tùy tiện.",
    "example": "File 800 nghìn dòng với nhiều công thức dò tìm lặp lại có thể chậm hơn nếu chuẩn hóa bằng Table hoặc Power Query.",
    "scenario": "Đo và tối ưu từng thành phần; tránh thay đổi cấu trúc khi chưa xác định nguyên nhân.",
    "misconception": "Cứ tăng RAM là chắc chắn giải quyết được mọi vấn đề hiệu năng.",
    "question": "Cách tiếp cận đúng khi Workbook chậm là gì?",
    "answer": "Xác định nguyên nhân cụ thể rồi tối ưu phù hợp.",
    "options": [
      "Xóa ngẫu nhiên công thức",
      "Đổi màu giao diện",
      "Đổi tên file"
    ]
  },
  {
    "id": "K036",
    "categoryId": "07",
    "category": "Lỗi và xử lý dữ liệu",
    "title": "#VALUE!",
    "level": "Cơ bản",
    "summary": "#VALUE! thường xuất hiện khi công thức nhận kiểu dữ liệu hoặc đối số không phù hợp.",
    "concept": "#VALUE! thường xuất hiện khi công thức nhận kiểu dữ liệu hoặc đối số không phù hợp.",
    "principle": "Có thể do phép toán với văn bản không hợp lệ, dấu phân cách sai, khoảng trắng hoặc dữ liệu ngày/số đang ở dạng text. Cần kiểm tra từng đầu vào và kiểu dữ liệu.",
    "example": "Cộng số với chuỗi văn bản không chuyển đổi được có thể gây #VALUE!.",
    "scenario": "Kiểm tra dữ liệu nguồn, kiểu dữ liệu và đối số trước khi bọc IFERROR.",
    "misconception": "Dùng IFERROR để ẩn lỗi mà không sửa nguyên nhân có thể che giấu dữ liệu sai.",
    "question": "#VALUE! thường gợi ý vấn đề gì?",
    "answer": "Giá trị hoặc kiểu đối số không phù hợp.",
    "options": [
      "Thiếu RAM chắc chắn",
      "Sai mật khẩu",
      "Workbook bị khóa"
    ]
  },
  {
    "id": "K037",
    "categoryId": "07",
    "category": "Lỗi và xử lý dữ liệu",
    "title": "#REF!",
    "level": "Cơ bản",
    "summary": "#REF! báo tham chiếu ô hoặc vùng không còn hợp lệ.",
    "concept": "#REF! báo tham chiếu ô hoặc vùng không còn hợp lệ.",
    "principle": "Thường xảy ra khi xóa hàng, cột hoặc Sheet mà công thức đang tham chiếu; hoặc công thức tạo ra địa chỉ ngoài phạm vi hợp lệ.",
    "example": "Công thức =Sheet2!A1 có thể thành #REF! nếu Sheet2 bị xóa.",
    "scenario": "Truy tìm công thức phụ thuộc và khôi phục nguồn hoặc sửa tham chiếu.",
    "misconception": "Nhầm #REF! với #N/A; một lỗi liên quan tham chiếu, lỗi kia thường liên quan không tìm thấy kết quả.",
    "question": "#REF! thường liên quan đến điều gì?",
    "answer": "Tham chiếu không còn hợp lệ.",
    "options": [
      "Không tìm thấy giá trị tra cứu",
      "Chia cho 0",
      "Sai kiểu văn bản"
    ]
  },
  {
    "id": "K038",
    "categoryId": "07",
    "category": "Lỗi và xử lý dữ liệu",
    "title": "#NAME?",
    "level": "Cơ bản",
    "summary": "#NAME? xuất hiện khi Excel không nhận diện được tên trong công thức.",
    "concept": "#NAME? xuất hiện khi Excel không nhận diện được tên trong công thức.",
    "principle": "Nguyên nhân có thể là gõ sai tên hàm, tên vùng chưa được định nghĩa, thiếu dấu ngoặc kép cho văn bản hoặc dùng hàm không được phiên bản Excel hỗ trợ.",
    "example": "=SUMM(A1:A5) có thể trả #NAME? do tên hàm SUM bị gõ sai.",
    "scenario": "Kiểm tra tên hàm, Named Range, dấu ngoặc kép và phiên bản Excel.",
    "misconception": "Không phải mọi lỗi #NAME? đều do viết sai tên hàm.",
    "question": "#NAME? thường có nghĩa gì?",
    "answer": "Excel không nhận diện được một tên trong công thức.",
    "options": [
      "Không tìm thấy dữ liệu",
      "Chia cho 0",
      "Tham chiếu bị xóa"
    ]
  },
  {
    "id": "K039",
    "categoryId": "07",
    "category": "Lỗi và xử lý dữ liệu",
    "title": "#N/A",
    "level": "Cơ bản",
    "summary": "#N/A biểu thị giá trị không khả dụng hoặc không tìm thấy theo logic công thức.",
    "concept": "#N/A biểu thị giá trị không khả dụng hoặc không tìm thấy theo logic công thức.",
    "principle": "Thường gặp trong hàm tra cứu khi khóa tìm kiếm không tồn tại hoặc không khớp. Cũng có thể được tạo có chủ đích bằng NA để đánh dấu dữ liệu thiếu.",
    "example": "Tra mã NV999 nhưng bảng danh mục không có mã này có thể trả #N/A.",
    "scenario": "Kiểm tra khóa, khoảng trắng, kiểu dữ liệu và chế độ khớp của hàm tra cứu.",
    "misconception": "Ẩn #N/A bằng IFERROR có thể làm mất tín hiệu cho biết mã chưa có trong danh mục.",
    "question": "#N/A thường gặp khi nào?",
    "answer": "Không tìm thấy giá trị phù hợp hoặc giá trị chưa khả dụng.",
    "options": [
      "Chia cho 0",
      "Sai định dạng tiền",
      "Vượt độ rộng cột"
    ]
  },
  {
    "id": "K040",
    "categoryId": "07",
    "category": "Lỗi và xử lý dữ liệu",
    "title": "#DIV/0!",
    "level": "Cơ bản",
    "summary": "#DIV/0! xảy ra khi công thức chia cho 0 hoặc mẫu số là ô trống được xử lý như 0.",
    "concept": "#DIV/0! xảy ra khi công thức chia cho 0 hoặc mẫu số là ô trống được xử lý như 0.",
    "principle": "Cần kiểm tra mẫu số, điều kiện dữ liệu và trường hợp chưa có số liệu. Không nên mặc định thay lỗi bằng 0 nếu điều đó làm sai ý nghĩa báo cáo.",
    "example": "Tỷ lệ lỗi = Số lỗi / Tổng sản phẩm; nếu tổng sản phẩm bằng 0 thì phép chia gây #DIV/0!.",
    "scenario": "Quy định rõ cách xử lý khi mẫu số bằng 0: để trống, ghi N/A hoặc hiển thị thông báo.",
    "misconception": "Cho kết quả 0% trong mọi trường hợp có mẫu số 0 có thể gây hiểu nhầm.",
    "question": "#DIV/0! xuất hiện do nguyên nhân nào?",
    "answer": "Chia cho 0 hoặc mẫu số trống được hiểu là 0.",
    "options": [
      "Sai tên hàm",
      "Sai Sheet",
      "Cột quá hẹp"
    ]
  },
  {
    "id": "K041",
    "categoryId": "07",
    "category": "Lỗi và xử lý dữ liệu",
    "title": "#NUM! và #NULL!",
    "level": "Nâng cao",
    "summary": "#NUM! liên quan giá trị số hoặc phép tính số không hợp lệ; #NULL! thường liên quan toán tử giao vùng dùng sai.",
    "concept": "#NUM! liên quan giá trị số hoặc phép tính số không hợp lệ; #NULL! thường liên quan toán tử giao vùng dùng sai.",
    "principle": "#NUM! có thể xuất hiện khi đầu vào số nằm ngoài phạm vi hợp lệ hoặc thuật toán không tìm được kết quả. #NULL! có thể do dùng dấu cách giữa hai vùng không giao nhau trong ngữ cảnh toán tử giao vùng.",
    "example": "Một hàm yêu cầu số dương nhưng nhận giá trị không hợp lệ có thể trả #NUM!.",
    "scenario": "Đọc loại lỗi và kiểm tra miền giá trị, phạm vi và toán tử trong công thức.",
    "misconception": "Không nên gom mọi lỗi thành một thông báo chung nếu cần chẩn đoán nguyên nhân.",
    "question": "#NUM! thường liên quan điều gì?",
    "answer": "Giá trị hoặc phép tính số không hợp lệ.",
    "options": [
      "Tên hàm sai",
      "Không tìm thấy mã",
      "Ô trống"
    ]
  },
  {
    "id": "K042",
    "categoryId": "07",
    "category": "Lỗi và xử lý dữ liệu",
    "title": "Phân biệt lỗi công thức và #####",
    "level": "Cơ bản",
    "summary": "Không phải mọi biểu hiện bất thường trên ô đều là mã lỗi công thức.",
    "concept": "Không phải mọi biểu hiện bất thường trên ô đều là mã lỗi công thức.",
    "principle": "Các mã như #VALUE! hoặc #REF! là lỗi Excel; ##### thường là vấn đề hiển thị do cột hẹp hoặc ngày giờ âm. Một kết quả sai nhưng không có mã lỗi cũng có thể là lỗi logic.",
    "example": "Tổng doanh số sai do lọc thiếu dữ liệu không nhất thiết hiển thị mã lỗi.",
    "scenario": "Kiểm tra cả mã lỗi, giá trị gốc, định dạng và logic nghiệp vụ.",
    "misconception": "Chỉ kiểm tra ô có mã lỗi sẽ bỏ sót nhiều sai lệch logic.",
    "question": "##### có phải lúc nào cũng là lỗi công thức không?",
    "answer": "Không, thường là vấn đề hiển thị.",
    "options": [
      "Có",
      "Chỉ trong Excel 365",
      "Chỉ khi dùng hàm"
    ]
  },
  {
    "id": "K043",
    "categoryId": "08",
    "category": "Workbook và bảo mật",
    "title": "XLSX, XLS, XLSM và CSV",
    "level": "Cơ bản",
    "summary": "Đây là các định dạng tệp có khả năng lưu trữ khác nhau.",
    "concept": "Đây là các định dạng tệp có khả năng lưu trữ khác nhau.",
    "principle": "XLSX là định dạng Workbook hiện đại không lưu VBA; XLSM hỗ trợ Macro; XLS là định dạng Excel cũ; CSV lưu dữ liệu dạng văn bản phân tách và không giữ nhiều Sheet, công thức hay định dạng như Workbook.",
    "example": "Báo cáo cần Macro phải lưu dạng XLSM; dữ liệu trao đổi đơn giản có thể xuất CSV.",
    "scenario": "Chọn định dạng theo mục đích sử dụng và tính năng cần giữ.",
    "misconception": "Lưu XLSM thành CSV sẽ không giữ nguyên Macro và cấu trúc Workbook.",
    "question": "Định dạng nào hỗ trợ lưu Macro VBA?",
    "answer": "XLSM",
    "options": [
      "CSV",
      "TXT",
      "PNG"
    ]
  },
  {
    "id": "K044",
    "categoryId": "08",
    "category": "Workbook và bảo mật",
    "title": "Macro và VBA",
    "level": "Trung cấp",
    "summary": "Macro là chuỗi thao tác được ghi hoặc lập trình để tự động hóa; VBA là ngôn ngữ thường dùng để viết Macro trong Excel Desktop.",
    "concept": "Macro là chuỗi thao tác được ghi hoặc lập trình để tự động hóa; VBA là ngôn ngữ thường dùng để viết Macro trong Excel Desktop.",
    "principle": "Macro có thể thao tác Workbook, Worksheet và dữ liệu. Tệp có Macro cần định dạng hỗ trợ như XLSM. Chỉ bật Macro từ nguồn đáng tin cậy vì mã có thể thực hiện hành động trên máy.",
    "example": "Tạo Macro định dạng báo cáo định kỳ nhưng phải kiểm tra mã trước khi chạy.",
    "scenario": "Tự động hóa tác vụ lặp lại và quản trị rủi ro bảo mật.",
    "misconception": "Nhầm Macro luôn an toàn vì được gửi dưới dạng file Excel.",
    "question": "Vì sao cần cẩn trọng khi bật Macro?",
    "answer": "Macro có thể thực thi mã và hành động trên máy.",
    "options": [
      "Macro chỉ đổi màu",
      "Macro không thể truy cập file",
      "Macro luôn bị vô hiệu hóa"
    ]
  },
  {
    "id": "K045",
    "categoryId": "08",
    "category": "Workbook và bảo mật",
    "title": "External Links và liên kết ngoài",
    "level": "Trung cấp",
    "summary": "External Link là tham chiếu từ Workbook này đến dữ liệu trong Workbook khác.",
    "concept": "External Link là tham chiếu từ Workbook này đến dữ liệu trong Workbook khác.",
    "principle": "Liên kết ngoài có thể lưu đường dẫn đến tệp nguồn. Khi tệp nguồn bị di chuyển, đổi tên hoặc không truy cập được, Excel có thể không cập nhật được dữ liệu liên kết.",
    "example": "Báo cáo tổng hợp lấy số liệu từ file doanh số ở thư mục dùng chung.",
    "scenario": "Quản lý đường dẫn, nguồn và thời điểm cập nhật liên kết trước khi phát hành báo cáo.",
    "misconception": "Nhầm giá trị đang hiển thị đồng nghĩa liên kết đã cập nhật mới nhất.",
    "question": "Rủi ro chính của External Links là gì?",
    "answer": "Nguồn hoặc đường dẫn thay đổi khiến dữ liệu không cập nhật.",
    "options": [
      "Tự xóa Sheet",
      "Tự đổi định dạng",
      "Tự chuyển CSV"
    ]
  },
  {
    "id": "K046",
    "categoryId": "08",
    "category": "Workbook và bảo mật",
    "title": "Protect Sheet và Protect Workbook",
    "level": "Cơ bản",
    "summary": "Protect Sheet hạn chế thao tác trên Worksheet; Protect Workbook có thể bảo vệ cấu trúc Workbook.",
    "concept": "Protect Sheet hạn chế thao tác trên Worksheet; Protect Workbook có thể bảo vệ cấu trúc Workbook.",
    "principle": "Bảo vệ Sheet có thể khóa sửa ô, chọn vùng hoặc thay đổi một số đối tượng theo thiết lập. Bảo vệ cấu trúc Workbook hạn chế thêm, xóa, đổi tên, di chuyển hoặc ẩn Sheet. Đây không phải cơ chế mã hóa mạnh cho dữ liệu nhạy cảm.",
    "example": "Khóa công thức và chỉ mở vùng nhập liệu cho người dùng.",
    "scenario": "Giảm sửa nhầm trong biểu mẫu hoặc báo cáo dùng chung.",
    "misconception": "Nhầm Protect Sheet với mã hóa dữ liệu hoặc phân quyền truy cập hệ thống.",
    "question": "Protect Workbook Structure chủ yếu hạn chế gì?",
    "answer": "Thay đổi cấu trúc các Worksheet.",
    "options": [
      "Tính toán công thức",
      "Lọc dữ liệu",
      "Đổi font chữ"
    ]
  },
  {
    "id": "K047",
    "categoryId": "08",
    "category": "Workbook và bảo mật",
    "title": "Compatibility giữa các phiên bản Excel",
    "level": "Trung cấp",
    "summary": "Tính tương thích phụ thuộc phiên bản Excel, hệ điều hành, định dạng file và tính năng được sử dụng.",
    "concept": "Tính tương thích phụ thuộc phiên bản Excel, hệ điều hành, định dạng file và tính năng được sử dụng.",
    "principle": "Một số hàm mới như XLOOKUP, FILTER hoặc TEXTSPLIT không có trong các phiên bản cũ. Tính năng, định dạng và Macro cũng có thể hoạt động khác nhau. Cần kiểm tra phiên bản người nhận trước khi chia sẻ.",
    "example": "File dùng FILTER gửi cho người dùng Excel 2016 có thể không tính được như mong muốn.",
    "scenario": "Thiết kế giải pháp theo phiên bản Excel thực tế của nhóm sử dụng.",
    "misconception": "Cho rằng file XLSX mở được thì mọi hàm và tính năng đều tương thích.",
    "question": "Yếu tố nào cần kiểm tra trước khi chia sẻ Workbook?",
    "answer": "Phiên bản Excel và các tính năng được sử dụng.",
    "options": [
      "Màu nền máy tính",
      "Tên người tạo",
      "Kích thước màn hình"
    ]
  }

  ,
  {
    "id":"K048","categoryId":"05","category":"Quản lý dữ liệu","title":"Paste Special và dán theo mục đích",
    "level":"Cơ bản","summary":"Paste Special cho phép chỉ dán giá trị, công thức, định dạng hoặc chuyển vị trí dữ liệu.",
    "concept":"Paste thông thường sao chép nhiều thành phần cùng lúc; Paste Special giúp chọn chính xác thành phần cần chuyển sang vùng đích.",
    "principle":"Values chỉ giữ kết quả hiện tại; Formulas giữ công thức; Formats giữ định dạng; Transpose đổi hàng thành cột hoặc cột thành hàng. Các tùy chọn phép tính có thể cộng, trừ, nhân hoặc chia vùng đích với dữ liệu sao chép.",
    "example":"Sao chép cột Thành tiền có công thức, sau đó Paste Special → Values sang báo cáo bàn giao để giữ kết quả mà không mang theo công thức.",
    "scenario":"Khi cần chốt số liệu, gửi báo cáo độc lập hoặc chuyển bảng ngang thành bảng dọc.",
    "misconception":"Dán Values không giữ công thức; dán Formats không thay đổi giá trị gốc.",
    "question":"Muốn giữ kết quả nhưng bỏ công thức, chọn tùy chọn nào?","answer":"Values",
    "options":["Formulas","Formats","Transpose"]
  },
  {
    "id":"K049","categoryId":"05","category":"Quản lý dữ liệu","title":"Chèn và xóa dòng, cột an toàn",
    "level":"Cơ bản","summary":"Chèn hoặc xóa đúng cấu trúc để tránh làm lệch dữ liệu và công thức liên quan.",
    "concept":"Một bản ghi thường chiếm trọn một hàng; một thuộc tính thường chiếm trọn một cột. Thay đổi cấu trúc cần thao tác trên toàn hàng hoặc toàn cột khi phù hợp.",
    "principle":"Chọn tiêu đề hàng/cột để Insert hoặc Delete. Trong Excel Table, thêm dữ liệu ngay dưới bảng thường giúp bảng tự mở rộng. Xóa nội dung ô khác với xóa cả hàng hoặc cột.",
    "example":"Muốn thêm trường Ghi chú, chèn một cột mới trong Table thay vì ghi đè lên cột Trạng thái.",
    "scenario":"Khi cần mở rộng bảng nhập liệu hoặc loại bỏ trường không còn sử dụng.",
    "misconception":"Nhấn Delete chỉ xóa nội dung vùng chọn, không xóa cấu trúc hàng hoặc cột.",
    "question":"Muốn loại bỏ cả một hàng bản ghi, cần dùng thao tác nào?","answer":"Delete Sheet Rows",
    "options":["Clear Contents","Delete trên bàn phím","Hide"]
  },
  {
    "id":"K050","categoryId":"01","category":"Nền tảng Excel","title":"Fill Handle và AutoFill",
    "level":"Cơ bản","summary":"Fill Handle sao chép công thức hoặc tạo chuỗi dữ liệu theo quy luật.",
    "concept":"Fill Handle là chốt nhỏ ở góc dưới bên phải vùng chọn, dùng để kéo nội dung hoặc quy luật sang vùng lân cận.",
    "principle":"Một mẫu có thể được sao chép nguyên trạng; hai hoặc nhiều mẫu liên tiếp giúp Excel nhận diện quy luật tăng số, ngày hoặc chuỗi. Với công thức, tham chiếu thay đổi theo quy tắc tương đối và tuyệt đối.",
    "example":"Nhập 1 và 2 ở hai ô, chọn cả hai rồi kéo xuống để tạo dãy 3, 4, 5. Với công thức ở D2, kéo xuống D3 sẽ điều chỉnh tham chiếu theo hàng.",
    "scenario":"Đánh số thứ tự, tạo lịch ngày hoặc điền công thức cho nhiều bản ghi.",
    "misconception":"Chỉ nhập số 1 rồi kéo có thể sao chép số 1 thay vì tạo dãy tăng.",
    "question":"Muốn Excel nhận diện quy luật 1, 2, 3..., nên chọn bao nhiêu giá trị mẫu?","answer":"Ít nhất hai giá trị",
    "options":["Một giá trị","Không cần giá trị mẫu","Bốn giá trị bắt buộc"]
  },
  {
    "id":"K051","categoryId":"05","category":"Quản lý dữ liệu","title":"Freeze Panes và cố định tiêu đề",
    "level":"Cơ bản","summary":"Freeze Panes giữ hàng hoặc cột nhận diện luôn hiển thị khi cuộn bảng.",
    "concept":"Excel cố định các hàng phía trên và các cột bên trái ô đang chọn. Phần còn lại của trang tính vẫn cuộn bình thường.",
    "principle":"Chọn ô nằm ngay dưới các hàng và bên phải các cột muốn cố định, sau đó vào View → Freeze Panes. Freeze Top Row và Freeze First Column là lựa chọn nhanh cho từng trường hợp.",
    "example":"Chọn B2 rồi Freeze Panes để giữ hàng 1. Chọn C2 để giữ hàng 1 và cột A.",
    "scenario":"Làm việc với bảng dài hoặc bảng có nhiều cột cần giữ mã nhận diện.",
    "misconception":"Chọn sai ô trước khi Freeze Panes sẽ cố định sai số hàng hoặc cột.",
    "question":"Muốn cố định hàng 1 và cột A, chọn ô nào trước?","answer":"B2",
    "options":["A1","A2","B1"]
  }

];
window.AVP_KNOWLEDGE_CATEGORIES = [
  {
    "id": "01",
    "name": "Nền tảng Excel",
    "description": "Hiểu cấu trúc Workbook, Worksheet và cách Excel tổ chức trang tính.",
    "icon": "▦",
    "tone": "green"
  },
  {
    "id": "02",
    "name": "Dữ liệu và kiểu dữ liệu",
    "description": "Hiểu Excel lưu trữ, nhận diện và diễn giải dữ liệu.",
    "icon": "◫",
    "tone": "blue"
  },
  {
    "id": "03",
    "name": "Cấu trúc và tham chiếu",
    "description": "Nắm cách ô, vùng và công thức tham chiếu lẫn nhau.",
    "icon": "⌗",
    "tone": "violet"
  },
  {
    "id": "04",
    "name": "Định dạng và hiển thị",
    "description": "Phân biệt giá trị gốc với cách dữ liệu được trình bày.",
    "icon": "◈",
    "tone": "amber"
  },
  {
    "id": "05",
    "name": "Quản lý dữ liệu",
    "description": "Hiểu cấu trúc bảng, sắp xếp, lọc và kiểm soát nhập liệu.",
    "icon": "▤",
    "tone": "teal"
  },
  {
    "id": "06",
    "name": "Nguyên lý tính toán",
    "description": "Tìm hiểu cách Excel tính công thức và ảnh hưởng hiệu năng.",
    "icon": "ƒx",
    "tone": "indigo"
  },
  {
    "id": "07",
    "name": "Lỗi và xử lý dữ liệu",
    "description": "Nhận diện lỗi, hiểu nguyên nhân và chọn cách kiểm tra phù hợp.",
    "icon": "⚠",
    "tone": "rose"
  },
  {
    "id": "08",
    "name": "Workbook và bảo mật",
    "description": "Chọn định dạng file, quản lý liên kết và bảo vệ Workbook.",
    "icon": "▣",
    "tone": "slate"
  }
];
