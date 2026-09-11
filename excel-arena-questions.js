(() => {
  "use strict";
  const topics=[
    ["shortcuts","⌨️","Phím tắt","Phản xạ thao tác Excel bằng bàn phím"],
    ["basic-functions","Σ","Hàm cơ bản","Các hàm nền tảng dùng hằng ngày"],
    ["conditional","🧠","Logic & điều kiện","IF, IFS, AND, OR và tổng hợp điều kiện"],
    ["lookup","🔎","Tra cứu","XLOOKUP, VLOOKUP, INDEX, MATCH..."],
    ["text","Aa","Text","Tách, nối, làm sạch và chuẩn hóa chuỗi"],
    ["date-time","📅","Ngày & thời gian","Ngày, tháng, ngày làm việc và chênh lệch thời gian"],
    ["dynamic-array","⚡","Dynamic Array","FILTER, UNIQUE, SORT, SEQUENCE và hàm mới"],
    ["cleaning","🧹","Làm sạch dữ liệu","Chuẩn hóa, kiểm tra và xử lý dữ liệu bẩn"],
    ["excel-table","▦","Excel Table","Bảng dữ liệu có cấu trúc và tham chiếu có tên"],
    ["pivot","📊","Pivot & phân tích","Tổng hợp, nhóm, lọc và đọc PivotTable"],
    ["dashboard","📈","Dashboard & biểu đồ","KPI, biểu đồ, slicer và trực quan hóa"],
    ["power-query","🔧","Power Query","Import, Transform, Merge, Append, Unpivot..."],
    ["vba","🤖","Macro / VBA","Object model, vòng lặp và tự động hóa"],
    ["workflow","🧩","Workflow & kiểm soát","Chọn công cụ, audit, đối soát và bàn giao"]
  ].map(([id,icon,name,desc])=>({id,icon,name,desc}));

  // topic|answer|meaning|aliases separated by ;|difficulty|real scenario
  const raw=`
shortcuts|CTRL+C|sao chép vùng đang chọn|copy;sao chep|1|Bạn cần sao chép một vùng dữ liệu mà không dùng chuột.
shortcuts|CTRL+V|dán nội dung đã sao chép|paste;dan|1|Bạn vừa copy dữ liệu và cần dán vào vị trí mới.
shortcuts|CTRL+Z|hoàn tác thao tác vừa làm|undo;hoan tac|1|Bạn vừa xóa nhầm dữ liệu và muốn quay lại bước trước.
shortcuts|CTRL+SHIFT+L|bật hoặc tắt bộ lọc|filter;bat loc|2|Bạn cần bật Filter cho hàng tiêu đề.
shortcuts|F4|đổi kiểu tham chiếu tuyệt đối và tương đối khi sửa công thức|co dinh tham chieu;co dinh o|2|Bạn đang sửa công thức và muốn chuyển A1 thành $A$1.
shortcuts|CTRL+1|mở Format Cells|format cells;dinh dang o|2|Bạn cần mở hộp định dạng số, font và border bằng bàn phím.
shortcuts|ALT+=|chèn AutoSum nhanh|autosum;tinh tong nhanh|2|Bạn muốn Excel tự đề xuất vùng SUM ngay dưới cột số.
shortcuts|ALT+ENTER|xuống dòng trong cùng một ô|xuong dong trong o;new line|2|Bạn cần nhập hai dòng văn bản trong một cell.
shortcuts|CTRL+ARROW|nhảy đến biên vùng dữ liệu|nhay den bien;di nhanh|3|Bạn đang ở đầu cột dài và muốn tới cuối vùng dữ liệu.
shortcuts|CTRL+SHIFT+ARROW|chọn nhanh đến biên vùng dữ liệu|chon den bien;chon nhanh|3|Bạn muốn chọn cả vùng liên tục tới cuối cột.

basic-functions|SUM|tính tổng các giá trị|tong;tinh tong|1|Bạn cần cộng doanh thu của cả tháng.
basic-functions|AVERAGE|tính giá trị trung bình|trung binh;binh quan|1|Bạn cần tính điểm trung bình của một nhóm.
basic-functions|MAX|lấy giá trị lớn nhất|lon nhat;cao nhat|1|Bạn cần tìm doanh số cao nhất.
basic-functions|MIN|lấy giá trị nhỏ nhất|nho nhat;thap nhat|1|Bạn cần tìm chi phí thấp nhất.
basic-functions|COUNT|đếm các ô chứa số|dem so;dem o so|1|Bạn cần đếm số ô có giá trị số.
basic-functions|COUNTA|đếm các ô không trống|dem khong trong;dem o co du lieu|2|Bạn cần đếm bao nhiêu dòng đã có nội dung.
basic-functions|ROUND|làm tròn số theo số chữ số chỉ định|lam tron|2|Bạn cần làm tròn đơn giá về 2 chữ số thập phân.
basic-functions|SUBTOTAL|tổng hợp dữ liệu và có thể bỏ qua hàng bị lọc|tong khi loc;tong bo qua hang an|3|Bạn cần tổng doanh thu chỉ của các dòng đang hiển thị sau Filter.
basic-functions|AGGREGATE|tổng hợp và có thể bỏ qua lỗi hoặc hàng ẩn|tong bo qua loi;bo qua loi|4|Bạn cần lấy MAX nhưng bỏ qua các giá trị lỗi.
basic-functions|SUMPRODUCT|nhân tương ứng rồi cộng tổng|nhan roi cong;tong tich|4|Bạn cần tính tổng Số lượng nhân Đơn giá mà không tạo cột phụ.

conditional|IF|trả về kết quả khác nhau theo một điều kiện|neu thi;dieu kien|1|Nếu doanh số đạt mục tiêu thì trả về Đạt, ngược lại Chưa đạt.
conditional|IFS|kiểm tra nhiều điều kiện theo thứ tự|nhieu dieu kien;phan nhom dieu kien|2|Bạn cần xếp loại A B C theo nhiều ngưỡng.
conditional|AND|đúng khi tất cả điều kiện đều đúng|tat ca dieu kien;va|2|Nhân viên chỉ đạt khi cả doanh số và tỷ lệ chuyển đổi cùng đạt.
conditional|OR|đúng khi ít nhất một điều kiện đúng|mot trong cac dieu kien;hoac|2|Đơn hàng cần cảnh báo khi quá hạn hoặc thiếu mã.
conditional|IFERROR|thay kết quả lỗi bằng giá trị khác|neu loi;xu ly loi|2|Tra cứu không thấy mã thì hiển thị Không có thay vì lỗi.
conditional|SUMIFS|tính tổng theo nhiều điều kiện|tong nhieu dieu kien;tong theo nhieu dieu kien|2|Bạn cần cộng doanh thu theo cửa hàng và khoảng ngày.
conditional|COUNTIFS|đếm theo nhiều điều kiện|dem nhieu dieu kien;dem theo nhieu dieu kien|3|Bạn cần đếm đơn hàng của cửa hàng A trong tháng 8.
conditional|AVERAGEIFS|tính trung bình theo nhiều điều kiện|trung binh nhieu dieu kien|4|Bạn cần tỷ lệ trung bình theo cửa hàng và ca.
conditional|MAXIFS|lấy giá trị lớn nhất theo điều kiện|lon nhat co dieu kien|max dieu kien|4|Bạn cần doanh số lớn nhất của riêng khu vực Bắc.
conditional|MINIFS|lấy giá trị nhỏ nhất theo điều kiện|nho nhat co dieu kien|min dieu kien|4|Bạn cần thời gian xử lý thấp nhất của một nhóm.

lookup|XLOOKUP|tra cứu linh hoạt theo khóa và trả về cột mong muốn|tra cuu;tim theo ma|1|Bạn cần tìm giá sản phẩm theo mã và muốn trả về được cả bên trái hoặc bên phải.
lookup|VLOOKUP|tra cứu theo cột đầu tiên và trả về cột bên phải|tra cuu doc;tim theo cot dau|2|Bạn cần tìm tên sản phẩm theo mã trong bảng truyền thống.
lookup|INDEX|trả về giá trị tại vị trí hàng và cột trong vùng|lay theo vi tri;tra gia tri vi tri|3|Bạn biết số thứ tự hàng và cột và cần lấy giá trị tương ứng.
lookup|MATCH|tìm vị trí tương đối của một giá trị trong vùng|tim vi tri;vi tri|3|Bạn cần biết mã sản phẩm đứng thứ mấy trong danh sách.
lookup|XMATCH|tìm vị trí linh hoạt hơn MATCH|tim vi tri moi;match moi|4|Bạn cần tìm vị trí với tùy chọn tìm từ cuối lên.
lookup|INDEX+MATCH|tra cứu bằng cách kết hợp vị trí và trả giá trị|index match;tra cuu index match|4|Bạn cần tra cứu linh hoạt trên phiên bản Excel chưa có XLOOKUP.
lookup|FILTER|lọc và trả về nhiều dòng thỏa điều kiện|loc bang cong thuc;loc dong|3|Bạn cần trả về toàn bộ đơn hàng của một cửa hàng bằng công thức.
lookup|INDIRECT|biến chuỗi văn bản thành tham chiếu|tham chieu tu chuoi;chuoi thanh tham chieu|5|Tên sheet nằm trong một ô và bạn muốn tạo tham chiếu động từ tên đó.
lookup|OFFSET|tạo tham chiếu dịch chuyển từ một điểm gốc|dich tham chieu;vung dong|4|Bạn cần tham chiếu tới vùng cách ô gốc một số hàng và cột.
lookup|LOOKUP|tra cứu gần đúng trong vector đã sắp xếp|tra cuu gan dung|4|Bạn cần ánh xạ điểm sang mức xếp loại theo ngưỡng tăng dần.

text|LEFT|lấy ký tự từ bên trái chuỗi|lay ben trai;tach trai|1|Mã HN-001 và bạn cần lấy HN.
text|RIGHT|lấy ký tự từ bên phải chuỗi|lay ben phai;tach phai|1|Mã SP-2026 và bạn cần lấy 4 số cuối.
text|MID|lấy một đoạn ký tự từ vị trí giữa chuỗi|lay o giua;tach giua|2|Bạn cần lấy 3 ký tự nằm giữa mã sản phẩm.
text|LEN|đếm số ký tự trong chuỗi|dem ky tu;do dai chuoi|1|Bạn cần kiểm tra mã có đúng 10 ký tự hay không.
text|TRIM|xóa khoảng trắng thừa giữa và quanh từ|xoa khoang trang thua;lam sach khoang trang|2|Tên nhân viên có nhiều dấu cách thừa.
text|CLEAN|xóa ký tự không in được|xoa ky tu an;lam sach ky tu|3|Dữ liệu copy từ hệ thống có ký tự điều khiển ẩn.
text|TEXTJOIN|nối nhiều chuỗi với dấu phân cách và có thể bỏ ô trống|noi co dau phan cach;ghep co dau|3|Bạn cần ghép nhiều tag bằng dấu phẩy và bỏ qua ô trống.
text|TEXT|định dạng số hoặc ngày thành chuỗi theo mẫu|dinh dang thanh text;so thanh chuoi|3|Bạn cần hiển thị ngày thành dd/mm/yyyy bên trong chuỗi.
text|SUBSTITUTE|thay thế chuỗi con theo nội dung|thay chuoi;doi ky tu|3|Bạn cần đổi dấu gạch ngang thành dấu gạch chéo trong toàn bộ mã.
text|VALUE|chuyển số đang lưu dạng text thành số|text thanh so;chuyen thanh so|2|Cột doanh thu nhìn như số nhưng đang là text.

date-time|TODAY|trả về ngày hiện tại|hom nay;ngay hien tai|1|Bạn cần ngày hôm nay tự cập nhật mỗi ngày.
date-time|NOW|trả về ngày và giờ hiện tại|bay gio;ngay gio hien tai|1|Bạn cần timestamp động gồm cả ngày và giờ.
date-time|DATE|tạo ngày từ năm tháng và ngày|tao ngay;ghep ngay|2|Năm tháng ngày nằm ở ba cột riêng và cần ghép thành ngày hợp lệ.
date-time|EOMONTH|trả về ngày cuối tháng trước hoặc sau một số tháng|cuoi thang;ngay cuoi thang|3|Bạn cần xác định ngày cuối cùng của tháng hiện tại.
date-time|EDATE|dịch một ngày theo số tháng|cong thang;dich thang|3|Hợp đồng cần tính ngày sau 3 tháng từ ngày bắt đầu.
date-time|DATEDIF|tính chênh lệch giữa hai ngày theo năm tháng hoặc ngày|chenh lech ngay;tinh tuoi|3|Bạn cần tính số năm làm việc giữa ngày vào và hôm nay.
date-time|NETWORKDAYS|đếm số ngày làm việc giữa hai ngày|ngay lam viec;dem ngay lam|3|Bạn cần tính số ngày công và bỏ cuối tuần.
date-time|WORKDAY|trả về ngày làm việc sau một số ngày|cong ngay lam viec;ngay lam viec tiep|3|Deadline là sau 5 ngày làm việc và phải bỏ cuối tuần.
date-time|WEEKDAY|trả về thứ của một ngày dưới dạng số|thu trong tuan;ngay thu may|2|Bạn cần xác định một ngày rơi vào thứ mấy.
date-time|WEEKNUM|trả về số tuần trong năm|tuan trong nam;so tuan|3|Bạn cần nhóm báo cáo theo tuần số mấy.

dynamic-array|FILTER|trả về mảng các dòng thỏa điều kiện|loc dong;loc dong bang cong thuc|1|Bạn cần danh sách tự tràn chỉ gồm đơn hàng miền Bắc.
dynamic-array|UNIQUE|trả về danh sách giá trị duy nhất|loai trung;gia tri duy nhat|1|Bạn cần danh sách cửa hàng không trùng.
dynamic-array|SORT|sắp xếp mảng theo cột chỉ định|sap xep|2|Bạn cần kết quả công thức tự sắp xếp tăng dần.
dynamic-array|SORTBY|sắp xếp mảng dựa trên một mảng khác|sap xep theo cot|3|Bạn muốn trả về tên nhân viên nhưng sắp theo doanh số.
dynamic-array|SEQUENCE|tạo dãy số tự động|tao day so;day so|2|Bạn cần tạo nhanh dãy 1 đến 100 bằng một công thức.
dynamic-array|TAKE|lấy một số hàng hoặc cột đầu hay cuối của mảng|lay dau cuoi mang;lay n dong|3|Bạn cần lấy top 5 dòng đầu của một mảng đã sắp xếp.
dynamic-array|VSTACK|xếp nhiều mảng theo chiều dọc|xep doc mang;ghep doc|4|Bạn có hai vùng cùng cấu trúc và muốn ghép bằng công thức theo chiều dọc.
dynamic-array|HSTACK|xếp nhiều mảng theo chiều ngang|xep ngang mang;ghep ngang|4|Bạn muốn ghép hai mảng cạnh nhau theo chiều ngang.
dynamic-array|LET|đặt tên biến bên trong một công thức|dat bien cong thuc;bien trong cong thuc|4|Công thức dài lặp cùng biểu thức nhiều lần và bạn muốn đặt biến.
dynamic-array|LAMBDA|tạo hàm tùy biến không cần VBA|tao ham rieng;ham tuy bien|5|Bạn muốn đóng gói logic công thức thành một hàm tự đặt tên.

cleaning|REMOVE DUPLICATES|xóa các dòng trùng theo cột được chọn|xoa trung;loai trung|1|Danh sách khách hàng bị lặp mã và bạn cần loại dòng trùng.
cleaning|TEXT TO COLUMNS|tách một cột thành nhiều cột theo dấu phân cách hoặc độ rộng|tach cot;chia cot|1|Họ tên và mã nằm chung một cột và cần tách ra.
cleaning|FLASH FILL|tự nhận mẫu và điền dữ liệu theo mẫu|dien nhanh theo mau;tu nhan mau|2|Bạn gõ vài mẫu tên và muốn Excel suy ra cách tách cho các dòng còn lại.
cleaning|DATA VALIDATION|giới hạn dữ liệu được phép nhập vào ô|kiem tra du lieu;gioi han nhap|2|Cột trạng thái chỉ được phép nhập Đạt hoặc Không đạt.
cleaning|CONDITIONAL FORMATTING|định dạng theo điều kiện để phát hiện bất thường|dinh dang co dieu kien;to mau dieu kien|2|Bạn muốn tô đỏ các giá trị trùng hoặc vượt ngưỡng.
cleaning|GO TO SPECIAL|chọn nhanh ô trống công thức hằng số hoặc lỗi|chon o dac biet;tim o trong|3|Bạn cần chọn tất cả ô trống trong một vùng lớn.
cleaning|TYPE CONVERSION|chuyển dữ liệu về đúng kiểu số ngày hoặc text|doi kieu du lieu;chuan hoa kieu|3|Cột ngày đang là text khiến sắp xếp sai.
cleaning|DEDUP KEY|xác định khóa duy nhất trước khi loại trùng|khoa duy nhat;kiem tra khoa|4|Bạn cần tránh xóa nhầm dòng chỉ vì một cột giống nhau.
cleaning|STANDARDIZE CASE|chuẩn hóa chữ hoa chữ thường trước khi đối chiếu|chuan hoa hoa thuong;chuan hoa chu|3|Mã abc và ABC cần được chuẩn hóa trước khi so sánh.
cleaning|ERROR CHECKING|kiểm tra các lỗi công thức được Excel cảnh báo|kiem tra loi;loi cong thuc|3|Bạn cần rà các ô có dấu cảnh báo lỗi công thức.

excel-table|EXCEL TABLE|biến vùng dữ liệu thành bảng có cấu trúc|table;bang excel|1|Bạn cần bảng nguồn tự mở rộng khi thêm dòng.
excel-table|TOTAL ROW|hàng tổng có sẵn trong Table|hang tong;total|2|Bạn muốn thêm nhanh hàng tổng ở cuối Table.
excel-table|STRUCTURED REFERENCE|tham chiếu bằng tên Table và tên cột|tham chieu co cau truc;tham chieu ten cot|2|Bạn muốn công thức dễ đọc thay vì B2:B1000.
excel-table|TABLE NAME|tên định danh của Excel Table|ten table;dat ten bang|2|Bạn cần đổi Table1 thành tên dễ hiểu để dùng trong công thức.
excel-table|CALCULATED COLUMN|cột công thức tự lan toàn Table|cot tinh toan;cong thuc table|2|Bạn nhập công thức một ô và muốn Table tự điền cả cột.
excel-table|BAND ROWS|tô xen kẽ các hàng trong Table|to xen ke;soc hang|2|Bạn muốn dữ liệu dài dễ đọc bằng hàng xen kẽ.
excel-table|RESIZE TABLE|thay đổi phạm vi của Table|doi kich thuoc table;mo rong table|3|Bạn cần đưa thêm một cột nằm ngoài vào Table hiện có.
excel-table|CONVERT TO RANGE|chuyển Table về vùng dữ liệu thường|table thanh range;chuyen ve vung|3|Bạn muốn bỏ tính năng Table nhưng giữ dữ liệu.
excel-table|SLICER|bộ lọc trực quan có nút bấm cho Table|bo loc truc quan;nut loc|3|Bạn muốn lọc Table bằng các nút chọn trực quan.
excel-table|TABLE EXPANSION|Table tự mở rộng khi nhập dòng hoặc cột liền kề|tu mo rong;mo rong tu dong|2|Nguồn cần nhận thêm dòng mới mà công thức vẫn theo.

pivot|PIVOTTABLE|tổng hợp và phân tích dữ liệu bằng kéo thả trường|pivot;bang tong hop|1|Bạn có 100 nghìn dòng bán hàng và cần tổng hợp nhanh theo cửa hàng.
pivot|ROWS|khu vực đặt trường theo chiều dòng trong PivotTable|dong pivot;hang pivot|1|Bạn muốn mỗi cửa hàng xuất hiện thành một dòng.
pivot|COLUMNS|khu vực đặt trường theo chiều cột trong PivotTable|cot pivot;columns pivot|1|Bạn muốn tháng hiển thị ngang theo cột.
pivot|VALUES|khu vực chứa số liệu cần tổng hợp trong PivotTable|gia tri pivot;values|1|Bạn muốn tính tổng Revenue trong Pivot.
pivot|REFRESH|cập nhật PivotTable sau khi nguồn thay đổi|lam moi;cap nhat pivot|1|Nguồn đã thêm dòng nhưng Pivot chưa phản ánh dữ liệu mới.
pivot|GROUP|nhóm ngày hoặc số thành tháng quý hoặc khoảng|nhom du lieu;group pivot|2|Bạn muốn nhóm ngày giao dịch theo tháng.
pivot|SLICER|bộ lọc trực quan bằng nút cho PivotTable|bo loc truc quan;nut loc pivot|2|Dashboard cần nút chọn cửa hàng để lọc Pivot.
pivot|SHOW VALUES AS|hiển thị giá trị theo phần trăm tổng chênh lệch hoặc xếp hạng|hien thi theo phan tram;phan tram tong|3|Bạn muốn mỗi cửa hàng hiển thị phần trăm đóng góp tổng doanh thu.
pivot|GETPIVOTDATA|lấy giá trị cụ thể từ PivotTable bằng công thức|lay du lieu pivot;doc pivot bang cong thuc|4|Bạn cần kéo một KPI từ Pivot sang dashboard ổn định.
pivot|DISTINCT COUNT|đếm giá trị duy nhất trong Pivot qua Data Model|dem duy nhat;dem khong trung|4|Bạn cần đếm số khách hàng khác nhau chứ không phải số dòng.

dashboard|KPI CARD|ô hiển thị chỉ số quan trọng nổi bật|the kpi;chi so lon|1|Bạn cần hiển thị Revenue Target và CR thật nổi bật trên dashboard.
dashboard|COLUMN CHART|biểu đồ cột phù hợp so sánh giá trị giữa nhóm|bieu do cot;so sanh nhom|1|Bạn cần so sánh doanh thu giữa các cửa hàng.
dashboard|LINE CHART|biểu đồ đường phù hợp xem xu hướng theo thời gian|bieu do duong;xu huong|1|Bạn cần xem doanh thu biến động theo ngày.
dashboard|COMBO CHART|biểu đồ kết hợp hai loại chuỗi dữ liệu|bieu do ket hop;combo|2|Bạn muốn cột Revenue và đường CR trên cùng biểu đồ.
dashboard|SECONDARY AXIS|trục phụ cho chuỗi có thang đo rất khác|truc phu;truc thu hai|3|Revenue hàng triệu và CR theo phần trăm cần hiển thị chung.
dashboard|PARETO|biểu đồ 80/20 gồm cột giảm dần và đường tích lũy|80 20;bieu do pareto|3|Bạn cần tìm vài nguyên nhân tạo ra phần lớn lỗi.
dashboard|SLICER|bộ lọc trực quan bằng nút bấm|bo loc nut;loc truc quan|1|Người dùng dashboard cần bấm chọn cửa hàng.
dashboard|SPARKLINE|biểu đồ mini nằm trong một ô|bieu do mini;mini chart|3|Bạn cần xem xu hướng nhỏ gọn cạnh từng dòng KPI.
dashboard|DYNAMIC TITLE|tiêu đề thay đổi theo bộ lọc hoặc lựa chọn|tieu de dong;title dong|3|Tiêu đề dashboard cần hiện cửa hàng đang được chọn.
dashboard|TARGET LINE|đường mục tiêu dùng để so sánh thực tế với kế hoạch|duong muc tieu;target|2|Biểu đồ cần thấy ngay doanh số vượt hay chưa đạt kế hoạch.

power-query|GET DATA|kết nối và nhập dữ liệu từ nguồn|lay du lieu;ket noi du lieu|1|Bạn cần đưa file Excel hoặc CSV vào Power Query.
power-query|CHANGE TYPE|đặt đúng kiểu dữ liệu cho cột|doi kieu;kieu du lieu|1|Cột ngày đang bị nhận là Text trong Power Query.
power-query|FILTER ROWS|giữ hoặc loại dòng theo điều kiện|loc dong;filter|1|Bạn chỉ cần các giao dịch trạng thái Hoàn tất.
power-query|REMOVE DUPLICATES|loại dòng trùng theo cột khóa|xoa trung;loai trung|2|Query có nhiều bản ghi trùng theo mã đơn.
power-query|SPLIT COLUMN|tách một cột thành nhiều cột|tach cot;chia cot|2|Mã HN-001 cần tách theo dấu gạch ngang.
power-query|MERGE QUERIES|ghép hai bảng theo cột khóa|merge;ghep ngang;noi theo khoa|2|Bạn cần lấy Target từ bảng khác dựa trên STAFF_KEY.
power-query|APPEND QUERIES|ghép nhiều bảng cùng cấu trúc theo chiều dọc|append;ghep doc;gop bang|2|Bạn có dữ liệu tháng 1 2 3 cùng schema và cần gom thành một bảng.
power-query|GROUP BY|gom nhóm và tính tổng hợp|gom nhom;group|2|Bạn cần tổng Revenue theo Store ngay trong Power Query.
power-query|UNPIVOT|chuyển nhiều cột thuộc tính thành cặp Attribute và Value|bo cot dong;chuyen cot thanh dong;unpivot|3|Các tháng Jan đến Dec đang nằm thành 12 cột và cần đưa về dạng dài.
power-query|PIVOT COLUMN|chuyển giá trị hàng thành các cột mới|pivot cot;chuyen dong thanh cot|3|Bạn muốn biến các loại KPI trong một cột thành nhiều cột.
power-query|FILL DOWN|điền giá trị từ trên xuống các ô null|dien xuong;fill down|2|Tên nhóm chỉ xuất hiện ở dòng đầu và các dòng dưới đang trống.
power-query|PROMOTE HEADERS|dùng dòng đầu làm tên cột|dua dong dau len tieu de;tieu de cot|1|File nguồn có tiêu đề nằm ở dòng dữ liệu đầu.
power-query|LEFT OUTER|giữ toàn bộ bảng trái và lấy phần khớp từ bảng phải|join trai;left join|3|Bạn cần giữ toàn bộ Sales kể cả khi chưa có Target.
power-query|INNER JOIN|chỉ giữ các dòng có khóa khớp ở cả hai bảng|join khop;giao hai bang|3|Bạn chỉ muốn các mã tồn tại ở cả bảng A và B.
power-query|LEFT ANTI|giữ các dòng ở bảng trái không có khớp ở bảng phải|tim thieu;khong khop;left anti|4|Bạn cần tìm mã có trong Sales nhưng không có trong Master.
power-query|COMBINE FILES|gộp nhiều file cùng cấu trúc từ một thư mục|gop file;folder combine|3|Mỗi ngày có một file CSV cùng schema và bạn cần gom tự động.
power-query|CLOSE & LOAD|đóng Power Query Editor và nạp kết quả ra Excel hoặc Data Model|dong va tai;load|1|Biến đổi xong và bạn cần đưa kết quả về workbook.
power-query|QUERY FOLDING|đẩy các bước biến đổi về nguồn hỗ trợ để xử lý|day xu ly ve nguon;folding|5|Query database lớn cần giảm dữ liệu trước khi kéo về máy.
power-query|TABLE.SELECTCOLUMNS|chỉ giữ các cột cần thiết bằng M|chon cot m;select columns|5|Bạn muốn giảm tải query bằng cách giữ đúng vài cột cần dùng.
power-query|TABLE.BUFFER|đệm một bảng trong bộ nhớ trong một số tình huống|dem bang;buffer|5|Bạn đang tối ưu một chuỗi tính toán M đặc biệt và cần cân nhắc vật hóa bảng.

vba|SUB|thủ tục VBA thực hiện một chuỗi lệnh|thu tuc;macro|1|Bạn cần viết một macro không trả về giá trị.
vba|FUNCTION|hàm VBA có thể trả về giá trị|ham vba;tra ve gia tri|2|Bạn muốn tạo UDF dùng được trong worksheet.
vba|RANGE|đối tượng đại diện ô hoặc vùng ô|vung o;o|1|Bạn cần đọc hoặc ghi giá trị ô A1 trong VBA.
vba|CELLS|tham chiếu ô bằng chỉ số hàng và cột|o theo hang cot;cells|2|Bạn muốn tham chiếu hàng i cột 3 trong vòng lặp.
vba|WORKSHEET|đối tượng một sheet trong workbook|sheet;trang tinh|1|Macro cần thao tác trên một trang tính cụ thể.
vba|WORKBOOK|đối tượng một file Excel đang mở|file excel;so lam viec|1|Macro cần tham chiếu tới file chứa nhiều worksheet.
vba|FOR EACH|vòng lặp qua từng phần tử trong collection|lap tung phan tu;for each|2|Bạn cần duyệt từng worksheet trong workbook.
vba|DO WHILE|lặp khi điều kiện còn đúng|lap khi;while|3|Bạn cần tiếp tục chạy cho đến khi gặp ô trống.
vba|SELECT CASE|rẽ nhánh theo nhiều giá trị trong VBA|nhieu nhanh;case|3|Bạn cần xử lý riêng các trạng thái A B C.
vba|OPTION EXPLICIT|bắt buộc khai báo biến trước khi dùng|bat khai bao bien;kiem soat bien|3|Bạn muốn tránh lỗi do gõ sai tên biến.
vba|ON ERROR|thiết lập cách xử lý lỗi runtime|xu ly loi vba;bat loi|3|Macro có thể gặp lỗi và cần chuyển tới nhánh xử lý.
vba|SCREENUPDATING|bật hoặc tắt cập nhật màn hình để macro chạy mượt hơn|tat cap nhat man hinh;tang toc macro|4|Macro chậm do Excel vẽ lại màn hình liên tục.
vba|CALCULATION|điều khiển chế độ tính toán của Excel|che do tinh toan;tat tu dong tinh|4|Macro lớn cần tạm chuyển Calculation sang Manual.
vba|DEBUG.PRINT|ghi thông tin ra Immediate Window để debug|in debug;immediate|4|Bạn cần xem giá trị biến trong lúc chạy macro.

workflow|POWER QUERY|công cụ phù hợp để nhập làm sạch và biến đổi dữ liệu lặp lại|pq;lam sach tu dong|1|Mỗi tháng nhận file cùng cấu trúc và phải làm sạch lặp đi lặp lại.
workflow|PIVOTTABLE|công cụ phù hợp để tổng hợp nhanh dữ liệu lớn theo chiều phân tích|pivot;tong hop nhanh|1|Bạn cần tổng doanh thu theo cửa hàng và tháng mà không viết nhiều công thức.
workflow|XLOOKUP|công cụ phù hợp để kéo thuộc tính từ bảng danh mục theo khóa|tra cuu;tim theo khoa|1|Bạn cần lấy Region từ Master theo STORE_CODE.
workflow|EXCEL TABLE|cấu trúc nguồn nên dùng khi dữ liệu thường xuyên thêm dòng|table;bang nguon|2|Nguồn nhập liệu tăng mỗi ngày và công thức cần tự mở rộng.
workflow|DATA VALIDATION|công cụ ngăn dữ liệu nhập sai ngay từ đầu|kiem soat nhap;validation|2|Cột trạng thái chỉ có 4 giá trị hợp lệ.
workflow|RECONCILIATION|quy trình đối soát hai nguồn để tìm chênh lệch|doi soat;so sanh hai nguon|3|Doanh thu hệ thống và báo cáo cửa hàng không bằng nhau.
workflow|UNIQUE KEY|khóa duy nhất dùng để chống double count và ghép đúng bản ghi|khoa duy nhat;key|3|Bạn chuẩn bị Merge hai bảng và cần đảm bảo một mã chỉ đại diện một bản ghi.
workflow|DOUBLE COUNT|lỗi một giao dịch bị tính nhiều lần do join hoặc dữ liệu trùng|dem trung;tinh trung|3|Sau Merge doanh thu tăng gấp đôi dù nguồn không đổi.
workflow|CONTROL TOTAL|tổng kiểm soát dùng để so sánh trước và sau biến đổi|tong doi soat;tong kiem soat|3|Bạn muốn chứng minh Power Query không làm mất doanh thu.
workflow|SOURCE OF TRUTH|nguồn dữ liệu chuẩn được thống nhất để đối chiếu|nguon chuan;master|3|Hai báo cáo mâu thuẫn và cần xác định nguồn nào có thẩm quyền.
workflow|REFRESH TEST|kiểm tra file sau khi thay dữ liệu nguồn và refresh|test refresh;kiem tra cap nhat|3|Workbook đúng với dữ liệu mẫu nhưng chưa biết có chạy khi thêm tháng mới.
workflow|EDGE CASE|trường hợp biên như rỗng trùng lỗi hoặc ngày cuối tháng cần test|truong hop bien;case dac biet|4|Bạn cần kiểm thử ngoài dữ liệu đẹp bình thường.
workflow|HANDOVER|bàn giao kèm hướng dẫn nguồn refresh và giới hạn sử dụng|ban giao;huong dan su dung|3|Bạn chuẩn bị giao dashboard cho người khác vận hành.
workflow|SCHEMA CHECK|kiểm tra tên số lượng và kiểu cột của nguồn|kiem tra schema;kiem tra cot|4|Một trăm file đầu vào có thể bị đảo hoặc thiếu cột.
`.trim();

  const concepts=raw.split(/\n+/).filter(Boolean).map((line,i)=>{
    const [topic,answer,meaning,aliasText,difficulty,scenario]=line.split("|");
    return {id:`c${String(i+1).padStart(3,"0")}`,topic,answer,meaning,aliases:(aliasText||"").split(";").filter(Boolean),difficulty:Number(difficulty)||1,scenario};
  });

  const wrappers=[
    c=>`Phản xạ nhanh: ${c.meaning}. Bạn dùng gì?`,
    c=>`Trong Excel, công cụ hoặc hàm nào dùng để ${c.meaning}?`,
    c=>`Bạn cần ${c.meaning}. Gõ tên chuẩn hoặc cách gọi bạn nhớ.`,
    c=>`Một đồng nghiệp hỏi cách ${c.meaning}. Bạn trả lời gì?`,
    c=>`Tình huống thực tế: ${c.scenario} Công cụ phù hợp là gì?`,
    c=>`Không nhìn đáp án: ${c.meaning}. Hãy gõ câu trả lời.`,
    c=>`Muốn ${c.meaning}, bạn nghĩ đến gì đầu tiên?`,
    c=>`Bạn đang làm file thật và cần ${c.meaning}. Giải pháp nào?`,
    c=>`Tên chuẩn của tính năng dùng để ${c.meaning} là gì?`,
    c=>`Case ngắn: ${c.scenario} Bạn chọn công cụ nào?`,
    c=>`Nhớ theo công dụng: ${c.meaning}. Hãy gọi tên nó.`,
    c=>`Nếu không dùng chuột để đoán đáp án: ${c.meaning}. Bạn gõ gì?`,
    c=>`Trong một bài Excel thực tế, bạn cần ${c.meaning}. Câu trả lời là gì?`,
    c=>`Kiểm tra trí nhớ: công cụ nào giúp ${c.meaning}?`,
    c=>`Từ mô tả sau, hãy nhớ tên: ${c.meaning}.`,
    c=>`Không có lựa chọn A/B: ${c.scenario} Bạn xử lý bằng gì?`,
    c=>`Level check · ${c.meaning}. Gõ câu trả lời trước khi mục tiêu chạm đích.`,
    c=>`Ứng dụng: ${c.scenario} Hãy gõ thuật ngữ hoặc cách gọi đúng ý.`,
    c=>`Pro check · Bạn cần ${c.meaning}. Tên công cụ hoặc hàm?`,
    c=>`BOSS · ${c.scenario} Hãy gõ công cụ hoặc hàm phù hợp nhất.`
  ];

  const questions=[];
  concepts.forEach(c=>wrappers.forEach((make,vi)=>questions.push({
    id:`${c.id}-v${vi+1}`,conceptId:c.id,topic:c.topic,answer:c.answer,meaning:c.meaning,
    aliases:c.aliases,difficulty:c.difficulty,prompt:make(c),boss:vi===wrappers.length-1
  })));
  const byTopic=Object.fromEntries(topics.map(t=>[t.id,questions.filter(q=>q.topic===t.id)]));
  const topicCounts=Object.fromEntries(topics.map(t=>[t.id,byTopic[t.id].length]));
  window.AVPArenaBank=Object.freeze({
    version:"season1-qbank1",topics:Object.freeze(topics),concepts:Object.freeze(concepts),questions:Object.freeze(questions),byTopic,topicCounts,totalQuestions:questions.length
  });
})();
