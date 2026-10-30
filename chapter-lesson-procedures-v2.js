/* AVP lesson procedures v2 — explicit UI steps, mouse actions and verification */
window.AVP_LESSON_PROCEDURES_V2 = [
  {
    "id": "C2L01",
    "title": "Di chuyển nhanh trong Sheet",
    "goal": "Dùng Name Box để đi đến địa chỉ ô/vùng; dùng Ctrl+Home và Ctrl+End để kiểm tra phạm vi.",
    "steps": [
      "1. Mở Workbook và chọn đúng Worksheet ở tab dưới cùng.",
      "2. Nhấn chuột trái vào Name Box, nằm bên trái Formula Bar.",
      "3. Gõ A500 rồi nhấn Enter để đi đến ô A500.",
      "4. Gõ A1:D20 vào Name Box rồi nhấn Enter để chọn cả vùng.",
      "5. Nhấn Ctrl+Home để về đầu trang tính; nhấn Ctrl+End để đến ô cuối Excel đang nhận diện."
    ],
    "mouse": "Chuột trái vào Name Box; không cần cuộn chuột. Có thể dùng Ctrl+G, nhập địa chỉ vào hộp thoại Go To rồi nhấn Enter.",
    "expected": "Viền chọn phải nằm đúng tại A500 hoặc phủ vùng A1:D20. Ctrl+End có thể đến xa dữ liệu thật nếu trang tính có định dạng thừa.",
    "practice": "Thử chọn vùng dữ liệu lớn bằng Name Box, sau đó dùng Ctrl+End để kiểm tra Used Range. So sánh với dòng cuối thực tế có dữ liệu.",
    "errors": "Gõ sai địa chỉ; nhầm Name Box với Formula Bar; cho rằng Ctrl+End luôn đến ô cuối có dữ liệu.",
    "library": "Ctrl+G; Ctrl+Home; Ctrl+End"
  },
  {
    "id": "C2L02",
    "title": "Chọn vùng bằng bàn phím",
    "goal": "Chọn ô, vùng, dòng hoặc cột chính xác trước khi định dạng hay thao tác dữ liệu.",
    "steps": [
      "1. Nhấn chuột trái vào ô bắt đầu, ví dụ A2.",
      "2. Giữ Shift và nhấn phím mũi tên để mở rộng vùng từng ô.",
      "3. Đặt con trỏ ở A2 rồi nhấn Ctrl+Shift+End để mở rộng đến cuối vùng đang dùng.",
      "4. Nhấn Ctrl+Space để chọn cả cột; nhấn Shift+Space để chọn cả dòng.",
      "5. Muốn chọn một vùng chính xác, nhấn Ctrl+G, nhập A2:D20 rồi nhấn Enter."
    ],
    "mouse": "Chuột trái chọn ô neo; các thao tác mở rộng dùng bàn phím. Nhấn vào tiêu đề cột/hàng bằng chuột trái cũng chọn được toàn bộ cột/hàng.",
    "expected": "Vùng chọn phải bao gồm đúng các ô dự định thao tác, không lấy nhầm tiêu đề hoặc dữ liệu ngoài bảng.",
    "practice": "Thử chọn A2:D20 theo hai cách: kéo chuột trái từ A2 đến D20 và dùng Ctrl+G. So sánh độ chính xác.",
    "errors": "Dùng Ctrl+A khi con trỏ ở ngoài bảng; quên bỏ chọn trước khi thao tác; chọn nhầm cả tiêu đề.",
    "library": "Ctrl+Space; Shift+Space; Ctrl+Shift+End"
  },
  {
    "id": "C2L03",
    "title": "Copy, Cut và Paste",
    "goal": "Sao chép hoặc di chuyển dữ liệu và giữ nguyên quan hệ giữa các cột.",
    "steps": [
      "1. Dùng chuột trái kéo chọn vùng A2:A6.",
      "2. Nhấn chuột phải trong vùng đã chọn và chọn Copy; hoặc nhấn Ctrl+C.",
      "3. Nhấn chuột trái vào ô đích C2.",
      "4. Nhấn chuột phải tại C2 và chọn Paste; hoặc nhấn Ctrl+V.",
      "5. Nếu muốn di chuyển thay vì tạo bản sao, chọn vùng nguồn, nhấn Ctrl+X, chọn ô đích rồi Ctrl+V."
    ],
    "mouse": "Chuột trái để chọn vùng/ô đích; chuột phải để mở menu ngữ cảnh và chọn Copy/Paste. Không nhấp chuột phải ngoài vùng đã chọn.",
    "expected": "Dữ liệu xuất hiện tại C2:C6; vùng nguồn A2:A6 vẫn còn. Với Cut, dữ liệu được chuyển sang vùng đích.",
    "practice": "Sao chép cả bảng có nhiều cột sang Sheet mới; kiểm tra tiêu đề và số dòng sau khi dán.",
    "errors": "Dán đè dữ liệu đang có; chỉ chọn một cột khi cần di chuyển cả bản ghi; không kiểm tra vùng đích.",
    "library": "Ctrl+C; Ctrl+X; Ctrl+V"
  },
  {
    "id": "C2L04",
    "title": "Paste Special",
    "goal": "Chỉ dán giá trị, công thức, định dạng hoặc chuyển hàng thành cột mà không mang theo mọi thành phần của vùng nguồn.",
    "steps": [
      "1. Chọn vùng nguồn, ví dụ A2:D10, bằng cách kéo chuột trái.",
      "2. Nhấn Ctrl+C để sao chép; phải thấy đường viền nét đứt quanh vùng.",
      "3. Nhấn chuột trái vào ô đích, ví dụ F2.",
      "4. Nhấn chuột phải tại F2 để mở menu ngữ cảnh.",
      "5. Trong nhóm Paste Options, chọn biểu tượng Values (thường có ký hiệu 123) để chỉ dán kết quả; hoặc chọn Paste Special… để mở hộp thoại.",
      "6. Trong hộp thoại Paste Special, chọn Values rồi nhấn OK.",
      "7. Muốn chuyển hàng thành cột, lặp lại bước sao chép, chọn ô đích, mở Paste Special, tích Transpose rồi nhấn OK.",
      "8. Cách khác: Home → nhóm Clipboard → mũi tên dưới Paste → Paste Special… → chọn Values hoặc Transpose → OK."
    ],
    "mouse": "Chuột phải tại ô đích là cách dễ thấy nhất. Chuột trái chọn mục Values/Paste Special trong menu. Trên Ribbon: Home → Paste ▼ → Paste Special. Phím tắt hộp thoại phổ biến: Ctrl+Alt+V, sau đó chọn Values và Enter.",
    "expected": "Dán Values: kết quả còn nhưng công thức không còn. Dán Transpose: dữ liệu đổi từ ngang sang dọc hoặc ngược lại. Kiểm tra Formula Bar: ô kết quả phải là giá trị, không còn dấu = nếu nguồn là công thức.",
    "practice": "Tạo cột Thành tiền bằng công thức, sao chép cột đó sang vị trí khác dưới dạng Values để cố định kết quả trước khi gửi báo cáo. Thử Transpose với bảng 3 hàng × 4 cột.",
    "errors": "Chọn nhầm biểu tượng Paste thường; không chọn đúng ô đích; dùng Values khi cần giữ công thức; Transpose có thể ghi đè dữ liệu có sẵn; menu Paste Options có thể khác đôi chút theo phiên bản Excel.",
    "library": "K048; Ctrl+Alt+V"
  },
  {
    "id": "C2L05",
    "title": "Undo và Redo",
    "goal": "Hoàn tác một thao tác sai và khôi phục thao tác vừa hoàn tác.",
    "steps": [
      "1. Nhập thử nội dung vào ô B2 rồi nhấn Enter.",
      "2. Tô màu ô bằng Home → Fill Color.",
      "3. Nhấn Ctrl+Z một lần để hoàn tác thao tác tô màu.",
      "4. Nhấn Ctrl+Z lần nữa để hoàn tác nhập nội dung.",
      "5. Nhấn Ctrl+Y để làm lại thao tác vừa hoàn tác.",
      "6. Có thể bấm mũi tên cạnh Undo trên Quick Access Toolbar để xem danh sách thao tác có thể hoàn tác."
    ],
    "mouse": "Chuột trái vào mũi tên Undo/Redo trên Quick Access Toolbar; Ctrl+Z và Ctrl+Y nhanh hơn. Không dùng chuột phải cho thao tác này.",
    "expected": "Màu ô và nội dung thay đổi ngược/lặp lại theo đúng thứ tự thao tác.",
    "practice": "Thử thao tác trên một bản sao Workbook trước khi thực hiện chuỗi chỉnh sửa lớn.",
    "errors": "Một số thao tác ngoài Excel không thể Undo; đóng file hoặc lưu file không đảm bảo khôi phục được mọi thay đổi.",
    "library": "Ctrl+Z; Ctrl+Y"
  },
  {
    "id": "C2L06",
    "title": "Find và Replace",
    "goal": "Tìm đúng nội dung và thay thế có kiểm soát trong phạm vi được chọn.",
    "steps": [
      "1. Nhấn Ctrl+F để mở Find.",
      "2. Nhập mã cần tìm, ví dụ SP01.",
      "3. Nhấn Find All để xem tất cả kết quả hoặc Find Next để đi từng kết quả.",
      "4. Nhấn Esc để đóng hộp thoại.",
      "5. Nhấn Ctrl+H để mở Replace.",
      "6. Nhập nội dung cũ vào Find what và nội dung mới vào Replace with.",
      "7. Chọn Options để kiểm tra Within (Sheet hay Workbook), Look in và Match case nếu cần.",
      "8. Nhấn Find All để kiểm tra kết quả trước; chỉ nhấn Replace All khi chắc chắn phạm vi đúng."
    ],
    "mouse": "Chuột trái vào Home → Find & Select → Find hoặc Replace cũng mở được hộp thoại. Replace All là thao tác có rủi ro, không bấm ngay khi chưa kiểm tra.",
    "expected": "Excel tìm đúng chuỗi trong phạm vi đã chọn; sau thay thế, số kết quả thay đổi đúng như dự kiến.",
    "practice": "Đổi tên mã cửa hàng cũ trong một Sheet thử nghiệm; ghi lại số ô khớp trước và sau thay thế.",
    "errors": "Replace All trên toàn Workbook khi chỉ định thay một Sheet; tìm trong Formulas thay vì Values; thay chuỗi con bên trong mã khác.",
    "library": "Ctrl+F; Ctrl+H"
  },
  {
    "id": "C2L07",
    "title": "Chèn và xóa dòng, cột",
    "goal": "Thêm hoặc xóa đúng cấu trúc hàng/cột mà không làm lệch dữ liệu.",
    "steps": [
      "1. Muốn chèn dòng, nhấn chuột trái vào số thứ tự dòng nằm ngay dưới vị trí muốn chèn.",
      "2. Nhấn chuột phải lên số dòng đã chọn.",
      "3. Chọn Insert để chèn một dòng phía trên.",
      "4. Muốn xóa dòng, nhấn chuột trái vào số dòng, nhấn chuột phải và chọn Delete.",
      "5. Với cột, nhấn chuột trái vào chữ cái cột, nhấn chuột phải rồi chọn Insert hoặc Delete.",
      "6. Nếu chỉ muốn xóa nội dung mà giữ nguyên dòng/cột, chọn ô rồi nhấn Delete trên bàn phím hoặc Home → Clear → Clear Contents."
    ],
    "mouse": "Chuột trái chọn tiêu đề dòng/cột; chuột phải mở menu Insert/Delete. Không nhầm lệnh Delete trên tiêu đề với phím Delete xóa nội dung ô.",
    "expected": "Dòng/cột mới xuất hiện đúng vị trí; dữ liệu các cột khác vẫn thẳng hàng.",
    "practice": "Chèn cột Ghi chú bên phải cột Trạng thái; nhập thử dữ liệu rồi xóa đúng cột thử nghiệm.",
    "errors": "Chọn ô đơn lẻ thay vì tiêu đề dòng/cột; xóa nội dung khi muốn xóa cả dòng; xóa cột có công thức phụ thuộc.",
    "library": "K049"
  },
  {
    "id": "C2L08",
    "title": "Fill Handle và chuỗi dữ liệu",
    "goal": "Dùng chốt điền để sao chép công thức hoặc tạo chuỗi số/ngày.",
    "steps": [
      "1. Nhập 1 vào A2 và 2 vào A3.",
      "2. Dùng chuột trái kéo chọn A2:A3.",
      "3. Đưa con trỏ đến góc dưới bên phải vùng chọn, tại ô vuông nhỏ (Fill Handle).",
      "4. Khi con trỏ đổi thành dấu cộng đen mảnh, nhấn giữ chuột trái và kéo xuống A10.",
      "5. Thả chuột; chọn Auto Fill Options nếu cần đổi giữa Copy Cells và Fill Series.",
      "6. Với công thức, nhập công thức ở dòng đầu, đưa chuột đến Fill Handle và kéo xuống các dòng cần tính."
    ],
    "mouse": "Kéo Fill Handle bằng chuột trái; nhấp đúp chuột trái vào Fill Handle để điền nhanh theo cột bên cạnh có dữ liệu liên tục.",
    "expected": "A2:A10 hiển thị dãy 1 đến 9. Với công thức, địa chỉ tương đối tự thay đổi theo từng dòng.",
    "practice": "Tạo mã thứ tự 001, 002… hoặc lịch ngày liên tục; thử Auto Fill Options để so sánh Copy Cells và Fill Series.",
    "errors": "Chỉ nhập số 1 rồi kéo nhưng mong Excel tự tăng; kéo nhầm viền vùng chọn thay vì Fill Handle; công thức có tham chiếu tuyệt đối ngoài ý muốn.",
    "library": "K050; Ctrl+D; Ctrl+R"
  },
  {
    "id": "C2L09",
    "title": "Freeze Panes",
    "goal": "Cố định dòng tiêu đề và cột nhận diện khi cuộn bảng dài.",
    "steps": [
      "1. Mở Worksheet có bảng dữ liệu, ví dụ tiêu đề ở dòng 1.",
      "2. Muốn cố định dòng đầu, vào View → Freeze Panes → Freeze Top Row.",
      "3. Muốn cố định cột đầu, vào View → Freeze Panes → Freeze First Column.",
      "4. Muốn cố định đồng thời dòng 1 và cột A, nhấn chuột trái vào ô B2.",
      "5. Vào View → Freeze Panes → Freeze Panes.",
      "6. Cuộn xuống và sang phải để kiểm tra dòng 1 và cột A còn hiển thị.",
      "7. Muốn bỏ cố định: View → Freeze Panes → Unfreeze Panes."
    ],
    "mouse": "Chuột trái chọn ô B2 trước khi mở menu View. Đây là điểm quan trọng: Excel cố định các dòng phía trên và cột bên trái ô đang chọn.",
    "expected": "Dòng 1 và cột A vẫn đứng yên khi cuộn. Nếu chọn C3, Excel sẽ cố định hai dòng phía trên và hai cột bên trái.",
    "practice": "Dùng bảng theo dõi lỗi có nhiều dòng; cố định dòng tiêu đề và cột Mã lỗi để không mất ngữ cảnh.",
    "errors": "Chọn B1 thay vì B2 khi cần cố định cả dòng 1; quên Unfreeze Panes trước khi thiết lập lại.",
    "library": "K051"
  },
  {
    "id": "C2L10",
    "title": "Sort và Filter",
    "goal": "Lọc bản ghi theo điều kiện và sắp xếp toàn bộ dòng theo một tiêu chí.",
    "steps": [
      "1. Nhấn chuột trái vào một ô bất kỳ bên trong bảng dữ liệu có một hàng tiêu đề rõ ràng.",
      "2. Vào Data → Filter hoặc nhấn Ctrl+Shift+L.",
      "3. Nhấn chuột trái vào mũi tên lọc ở tiêu đề cột Trạng thái.",
      "4. Bỏ chọn Select All, tích Đạt rồi nhấn OK.",
      "5. Để sắp xếp, mở mũi tên ở cột Ngày và chọn Sort Newest to Oldest.",
      "6. Muốn bỏ lọc, mở mũi tên và chọn Clear Filter From… hoặc tắt Filter bằng Ctrl+Shift+L."
    ],
    "mouse": "Chuột trái vào mũi tên lọc để chọn điều kiện. Không bôi riêng một cột rồi Sort; phải chọn trong bảng hoặc xác nhận Expand the selection.",
    "expected": "Chỉ các dòng Đạt còn hiển thị; thứ tự ngày thay đổi nhưng dữ liệu trên từng dòng vẫn đi cùng nhau.",
    "practice": "Lọc lỗi theo mức độ Nghiêm trọng, sau đó sắp xếp ngày phát sinh mới nhất lên đầu.",
    "errors": "Sort một cột riêng lẻ khiến dữ liệu các cột không còn cùng bản ghi; quên rằng Filter chỉ ẩn dòng chứ không xóa.",
    "library": "K026; K027; Ctrl+Shift+L"
  },
  {
    "id": "C2L11",
    "title": "Quy trình thao tác bằng bàn phím",
    "goal": "Kết hợp điều hướng, chọn vùng, sao chép, lọc và kiểm tra kết quả.",
    "steps": [
      "1. Mở bảng dữ liệu và nhấn Ctrl+Home để về đầu Sheet.",
      "2. Nhấn Ctrl+G, nhập A2 rồi Enter để đến dữ liệu đầu tiên.",
      "3. Nhấn Ctrl+Shift+End để chọn vùng dữ liệu đến cuối.",
      "4. Nhấn Ctrl+C, tạo Worksheet mới bằng nút dấu cộng cạnh tab Sheet.",
      "5. Nhấn chuột trái vào A1 của Sheet mới rồi Ctrl+Alt+V, chọn Values và Enter.",
      "6. Nhấn Ctrl+Shift+L để bật Filter; lọc theo điều kiện cần xem.",
      "7. Kiểm tra số dòng và một vài giá trị trước khi lưu."
    ],
    "mouse": "Chuột trái chỉ dùng để chọn Sheet mới và ô đích; các bước còn lại thực hiện bằng phím tắt. Có thể dùng chuột nếu chưa quen bàn phím.",
    "expected": "Sheet mới chứa bản sao độc lập giá trị; bảng nguồn không thay đổi; bộ lọc không làm mất dữ liệu gốc.",
    "practice": "Tạo bản trích xuất danh sách đơn chưa giao để gửi quản lý; lưu thành một bản sao file trước khi thao tác.",
    "errors": "Chọn thiếu vùng; dán công thức thay vì Values; không kiểm tra số bản ghi sau lọc.",
    "library": "Ctrl+G; Ctrl+Shift+End; Ctrl+Alt+V; Ctrl+Shift+L"
  },
  {
    "id": "C2L12",
    "title": "Bài thực hành tổng hợp",
    "goal": "Hoàn thành quy trình trích xuất dữ liệu đơn hàng mà không làm hỏng bảng nguồn.",
    "steps": [
      "1. Tạo bảng có cột Mã đơn, Ngày, Cửa hàng, Trạng thái, Số lượng và Thành tiền.",
      "2. Chọn bảng bằng chuột trái; nhấn Ctrl+Shift+L để bật Filter.",
      "3. Lọc Trạng thái = Chưa giao.",
      "4. Sắp xếp Ngày từ mới đến cũ bằng mũi tên lọc ở cột Ngày.",
      "5. Chọn các dòng kết quả cần trích xuất, Copy.",
      "6. Tạo Sheet mới, chọn A1, nhấn chuột phải → Paste Special → Values.",
      "7. Vào View → Freeze Panes → Freeze Top Row để cố định tiêu đề.",
      "8. Đối chiếu số dòng, mã đơn và tổng Thành tiền với dữ liệu đã lọc."
    ],
    "mouse": "Dùng chuột trái để lọc/chọn dữ liệu; chuột phải tại A1 của Sheet đích để chọn Paste Special → Values.",
    "expected": "Có Sheet trích xuất chỉ chứa các dòng Chưa giao, không còn công thức liên kết; tiêu đề vẫn hiển thị khi cuộn.",
    "practice": "Thử thay điều kiện lọc thành Đang giao và thực hiện lại trên Sheet mới.",
    "errors": "Không xác nhận vùng chọn sau lọc; bỏ sót dữ liệu do vùng nguồn có dòng trống; dán cả công thức ngoài ý muốn.",
    "library": "K048; K026; K027; K051"
  },
  {
    "id": "C3L01",
    "title": "Toán tử và cấu trúc công thức",
    "goal": "Viết công thức tính toán và so sánh từ dữ liệu trong các ô.",
    "steps": [
      "1. Chọn ô D2 bằng chuột trái.",
      "2. Gõ dấu = để bắt đầu công thức.",
      "3. Nhập =B2*C2 để tính Số lượng nhân Đơn giá.",
      "4. Nhấn Enter để xác nhận.",
      "5. Chọn lại D2 và nhìn Formula Bar để kiểm tra công thức.",
      "6. Thử =B2>0 ở ô E2 để trả về TRUE hoặc FALSE."
    ],
    "mouse": "Chuột trái chọn ô kết quả; nhập công thức bằng bàn phím. Không gõ chữ x thay cho dấu nhân *.",
    "expected": "D2 trả về Thành tiền; E2 trả TRUE nếu số lượng lớn hơn 0.",
    "practice": "Tính Thành tiền và kiểm tra số lượng âm/0 trong bảng đơn hàng.",
    "errors": "Quên dấu =; dùng dấu nhân x; tham chiếu nhầm cột; nhập số trực tiếp thay vì tham chiếu ô.",
    "library": "K016; K017"
  },
  {
    "id": "C3L02",
    "title": "Thứ tự thực hiện phép tính",
    "goal": "Kiểm soát thứ tự ưu tiên bằng dấu ngoặc để công thức đúng ý nghĩa nghiệp vụ.",
    "steps": [
      "1. Nhập 10 vào A2, 5 vào B2 và 2 vào C2.",
      "2. Chọn D2, nhập =A2+B2*C2 rồi Enter.",
      "3. Chọn E2, nhập =(A2+B2)*C2 rồi Enter.",
      "4. So sánh D2 và E2: kết quả lần lượt là 20 và 30.",
      "5. Mở Formula Bar để kiểm tra vị trí dấu ngoặc.",
      "6. Khi công thức có nhiều phép tính, thêm ngoặc cho từng nhóm nghiệp vụ để người khác đọc được."
    ],
    "mouse": "Chuột trái chọn ô D2/E2; thao tác nhập bằng bàn phím. Không cần chuột phải.",
    "expected": "Hai kết quả khác nhau vì phép nhân được thực hiện trước phép cộng nếu không có ngoặc.",
    "practice": "Tính giá sau giảm giá rồi cộng phí vận chuyển; xác định rõ bước nào trước bước nào.",
    "errors": "Viết công thức theo thứ tự đọc tự nhiên; thiếu ngoặc; không kiểm tra bằng bộ số nhỏ dễ tính nhẩm.",
    "library": "K016"
  },
  {
    "id": "C3L03",
    "title": "Tham chiếu tương đối",
    "goal": "Sao chép công thức để địa chỉ dòng tự thay đổi theo từng bản ghi.",
    "steps": [
      "1. Tạo tiêu đề Số lượng ở B1, Đơn giá ở C1 và Thành tiền ở D1.",
      "2. Nhập dữ liệu vào B2:C5.",
      "3. Nhấn chuột trái vào D2, nhập =B2*C2 rồi Enter.",
      "4. Chọn lại D2.",
      "5. Đưa con trỏ đến Fill Handle ở góc dưới phải D2.",
      "6. Giữ chuột trái và kéo xuống D5.",
      "7. Chọn D3, xem Formula Bar: công thức phải là =B3*C3."
    ],
    "mouse": "Chuột trái chọn D2 và kéo Fill Handle. Không kéo từ giữa ô vì sẽ di chuyển ô thay vì sao chép.",
    "expected": "Mỗi dòng có Thành tiền đúng theo Số lượng và Đơn giá của chính dòng đó.",
    "practice": "Thêm dòng đơn hàng mới và kéo công thức xuống để tính tự động.",
    "errors": "Sao chép công thức nhưng tham chiếu không đúng cột; ghi đè dữ liệu ở cột kết quả; kéo quá dòng cuối.",
    "library": "K012"
  },
  {
    "id": "C3L04",
    "title": "Tham chiếu tuyệt đối",
    "goal": "Cố định ô tham số khi sao chép công thức xuống nhiều dòng.",
    "steps": [
      "1. Đặt thuế suất 8% ở ô F1 và nhập các giá trị Số lượng, Đơn giá ở B2:C5.",
      "2. Chọn D2, nhập =B2*C2*(1+$F$1) rồi Enter.",
      "3. Chọn phần tham chiếu F1 trong Formula Bar khi đang sửa công thức; nhấn F4 để chuyển sang $F$1 nếu chưa khóa.",
      "4. Nhấn Enter.",
      "5. Kéo Fill Handle từ D2 xuống D5.",
      "6. Chọn D3 và kiểm tra Formula Bar: tham chiếu $F$1 phải giữ nguyên."
    ],
    "mouse": "Chuột trái chọn ô và kéo Fill Handle; phím F4 chuyển kiểu tham chiếu khi con trỏ đang đặt trên địa chỉ ô trong công thức.",
    "expected": "Mọi dòng đều dùng cùng thuế suất F1, còn B2/C2 thay đổi theo dòng.",
    "practice": "Thay thuế suất ở F1 từ 8% thành 10%; toàn bộ Thành tiền phải cập nhật.",
    "errors": "Quên dấu $ khiến F1 trượt thành F2/F3; khóa cả B2/C2 không đúng mục tiêu.",
    "library": "K013"
  },
  {
    "id": "C3L05",
    "title": "Tham chiếu hỗn hợp",
    "goal": "Khóa riêng hàng hoặc cột để tạo bảng tính hai chiều.",
    "steps": [
      "1. Nhập các hệ số 1, 2, 3 trên hàng 1 từ B1:D1.",
      "2. Nhập các hệ số 10, 20, 30 ở cột A từ A2:A4.",
      "3. Chọn B2, nhập =$A2*B$1 rồi Enter.",
      "4. Chọn B2 và kéo Fill Handle sang phải đến D2.",
      "5. Chọn B2:D2, kéo Fill Handle xuống dòng 4.",
      "6. Chọn C3 để kiểm tra công thức: cột A phải được khóa, hàng 1 phải được khóa."
    ],
    "mouse": "Chuột trái kéo ngang trước, sau đó kéo dọc. Có thể nhấn F4 nhiều lần khi đang chọn tham chiếu để đổi giữa A1, $A$1, A$1 và $A1.",
    "expected": "Bảng kết quả là tích của hệ số ở cột A và hàng 1; công thức không lệch tham chiếu.",
    "practice": "Tạo ma trận đơn giá theo loại sản phẩm và hệ số quy đổi theo từng nhóm.",
    "errors": "Đặt $ sai vị trí; kéo dọc trước khi kiểm tra hướng tham chiếu; không hiểu ô nào cần cố định.",
    "library": "K014"
  },
  {
    "id": "C3L06",
    "title": "Sao chép và kiểm tra công thức",
    "goal": "Sao chép công thức hàng loạt và kiểm tra địa chỉ tham chiếu sau khi điền.",
    "steps": [
      "1. Nhập công thức mẫu tại D2.",
      "2. Chọn D2:D100 bằng cách nhập vùng vào Name Box.",
      "3. Nhấn Ctrl+D để Fill Down công thức từ ô đầu xuống toàn vùng.",
      "4. Chọn D2, D50 và D100 để kiểm tra Formula Bar.",
      "5. Vào Formulas → Show Formulas nếu cần xem nhanh công thức trên toàn Sheet.",
      "6. Tắt Show Formulas bằng cách bấm lại nút hoặc Ctrl+`."
    ],
    "mouse": "Chuột trái chọn vùng; Formulas → Show Formulas dùng chuột trái. Ctrl+D điền xuống; Ctrl+R điền sang phải.",
    "expected": "Các dòng đều có công thức; tham chiếu thay đổi đúng quy luật; không có dòng bị bỏ trống ngoài dự kiến.",
    "practice": "Kiểm tra công thức ở dòng đầu, giữa và cuối của bảng chấm công hoặc bảng doanh số.",
    "errors": "Chỉ kiểm tra dòng đầu; dùng Fill Down khi ô đầu chưa có công thức; ghi đè dữ liệu sẵn có.",
    "library": "K012; K013; K014"
  },
  {
    "id": "C3L07",
    "title": "Nối văn bản và ghép nội dung",
    "goal": "Ghép các trường văn bản thành mã hoặc họ tên có dấu phân cách.",
    "steps": [
      "1. Nhập Họ ở A2 và Tên ở B2.",
      "2. Chọn C2, nhập =A2&\" \"&B2 rồi Enter.",
      "3. Muốn ghép mã và ngày, nhập =A2&\"-\"&TEXT(B2,\"dd/mm/yyyy\").",
      "4. Chọn C2 và kéo Fill Handle xuống các dòng còn lại.",
      "5. Kiểm tra khoảng trắng và dấu phân cách trong kết quả.",
      "6. Nếu cần kết quả cố định, Copy cột C rồi nhấn chuột phải tại vị trí đích → Paste Special → Values."
    ],
    "mouse": "Chuột trái chọn ô và kéo Fill Handle; chuột phải tại vùng đích để Paste Special → Values.",
    "expected": "Cột ghép có khoảng trắng/dấu phân cách đúng; nếu ngày được ghép, ngày hiển thị theo định dạng mong muốn.",
    "practice": "Tạo mã kiểm tra gồm Mã cửa hàng, dấu gạch ngang và số thứ tự.",
    "errors": "Quên dấu cách; ghép ngày mà không dùng TEXT nên kết quả thành số sê-ri; nối mã có số 0 đầu nhưng nguồn đã bị chuyển Number.",
    "library": "K006; CONCAT"
  },
  {
    "id": "C3L08",
    "title": "Làm tròn và xử lý số thập phân",
    "goal": "Chọn hàm làm tròn theo quy tắc tính toán thay vì chỉ đổi cách hiển thị.",
    "steps": [
      "1. Nhập 12.345 vào A2.",
      "2. Chọn B2, nhập =ROUND(A2,2) rồi Enter.",
      "3. Chọn C2, nhập =ROUNDUP(A2,2) rồi Enter.",
      "4. Chọn D2, nhập =ROUNDDOWN(A2,2) rồi Enter.",
      "5. Chọn B2:D2, vào Home → Number → Increase/Decrease Decimal để quan sát cách hiển thị.",
      "6. So sánh kết quả công thức với việc chỉ đổi định dạng số."
    ],
    "mouse": "Chuột trái chọn ô; Home → Number để đổi số chữ số thập phân. Công thức nhập bằng bàn phím.",
    "expected": "ROUND làm tròn theo quy tắc; ROUNDUP luôn xa số 0; ROUNDDOWN hướng về 0. Định dạng số không thay đổi giá trị gốc.",
    "practice": "Làm tròn tỷ lệ lỗi hoặc đơn giá theo quy định báo cáo; xác định rõ làm tròn ở cấp dòng hay tổng.",
    "errors": "Dùng định dạng hai chữ số và tưởng giá trị đã được làm tròn; chọn sai số chữ số; làm tròn từng dòng gây lệch tổng.",
    "library": "ROUND; ROUNDUP; ROUNDDOWN"
  },
  {
    "id": "C3L09",
    "title": "Ngày tháng trong công thức",
    "goal": "Tính chênh lệch ngày và tạo mốc ngày bằng các hàm ngày tháng.",
    "steps": [
      "1. Nhập ngày bắt đầu vào A2 và ngày kết thúc vào B2 dưới dạng ngày Excel nhận diện.",
      "2. Chọn C2, nhập =B2-A2 rồi Enter để tính số ngày.",
      "3. Chọn D2, nhập =DATE(YEAR(A2),MONTH(A2),1) để lấy ngày đầu tháng.",
      "4. Chọn E2, nhập =EOMONTH(A2,0) để lấy ngày cuối tháng.",
      "5. Nếu kết quả hiện số sê-ri, vào Home → Number Format → Short Date.",
      "6. Dùng =ISNUMBER(A2) để kiểm tra A2 có phải giá trị ngày dạng số không."
    ],
    "mouse": "Chuột trái chọn ô; Home → Number Format để đổi hiển thị ngày. Không nhầm đổi định dạng với chuyển văn bản thành ngày thật.",
    "expected": "C2 là số ngày chênh lệch; D2 là ngày đầu tháng; E2 là ngày cuối tháng.",
    "practice": "Tạo báo cáo tháng từ ngày phát sinh lỗi hoặc ngày giao dịch.",
    "errors": "Ngày nguồn là Text; định dạng ngày theo vùng khác; phép trừ bị đảo thứ tự; dữ liệu có cả giờ nên kết quả là số thập phân.",
    "library": "K007; DATE; YEAR; MONTH; EOMONTH"
  },
  {
    "id": "C3L10",
    "title": "IF cơ bản",
    "goal": "Phân loại kết quả theo một điều kiện đúng hoặc sai.",
    "steps": [
      "1. Tạo cột Điểm ở B2 và Trạng thái ở C2.",
      "2. Chọn C2 bằng chuột trái.",
      "3. Nhập =IF(B2>=80,\"Đạt\",\"Chưa đạt\") rồi nhấn Enter.",
      "4. Chọn C2 và kéo Fill Handle xuống các dòng còn lại.",
      "5. Thử đổi B2 từ 79 thành 80 để kiểm tra điều kiện biên.",
      "6. Kiểm tra dấu ngoặc kép quanh văn bản và dấu phẩy/ngăn cách đối số theo thiết lập Excel."
    ],
    "mouse": "Chuột trái chọn C2 và kéo Fill Handle; không dùng chuột phải để nhập công thức.",
    "expected": "Điểm 80 trở lên trả Đạt; dưới 80 trả Chưa đạt.",
    "practice": "Phân loại KPI đạt/chưa đạt hoặc phân loại lỗi theo ngưỡng số lượng.",
    "errors": "Đảo nhánh đúng/sai; dùng > thay cho >=; thiếu dấu ngoặc kép; dùng dấu phân cách đối số không đúng thiết lập Excel.",
    "library": "IF"
  },
  {
    "id": "C3L11",
    "title": "Nhận diện và xử lý lỗi công thức",
    "goal": "Đọc nguyên nhân lỗi trước khi sửa hoặc dùng hàm xử lý lỗi.",
    "steps": [
      "1. Chọn một ô trống và nhập =10/0 để tạo #DIV/0!.",
      "2. Chọn ô có lỗi, nhìn Formula Bar để kiểm tra công thức.",
      "3. Nhấn chuột trái vào biểu tượng cảnh báo nếu Excel hiển thị, đọc gợi ý.",
      "4. Kiểm tra mẫu số hoặc tham chiếu nguồn; sửa dữ liệu hoặc điều kiện chia.",
      "5. Với lỗi tra cứu #N/A, kiểm tra mã tìm kiếm và bảng danh mục.",
      "6. Chỉ khi lỗi là tình huống hợp lệ, dùng IFERROR để trả về thông báo/giá trị dự phòng.",
      "7. Không bọc IFERROR để che lỗi chưa hiểu nguyên nhân."
    ],
    "mouse": "Chuột trái chọn ô lỗi và đọc Formula Bar; không cần chuột phải. Dùng Formulas → Error Checking nếu cần kiểm tra.",
    "expected": "Công thức trả kết quả đúng hoặc hiển thị thông báo có chủ đích; không còn lỗi bị che giấu âm thầm.",
    "practice": "Tạo bảng kiểm tra tỷ lệ lỗi khi sản lượng có thể bằng 0; hiển thị N/A thay vì một tỷ lệ sai.",
    "errors": "Dùng IFERROR(...,0) cho mọi trường hợp khiến lỗi nguồn bị che; nhầm #### với lỗi công thức; bỏ qua #REF! sau khi xóa cột.",
    "library": "IFERROR; K021"
  },
  {
    "id": "C3L12",
    "title": "Bài thực hành tổng hợp công thức",
    "goal": "Xây dựng bảng đơn hàng có công thức, tham chiếu cố định và kiểm tra chất lượng kết quả.",
    "steps": [
      "1. Tạo các cột Mã đơn, Số lượng, Đơn giá, Thuế suất, Thành tiền, Trạng thái.",
      "2. Đặt thuế suất dùng chung ở ô H1.",
      "3. Tại E2 nhập =B2*C2*(1+$H$1); nhấn Enter.",
      "4. Kéo Fill Handle từ E2 xuống dòng cuối.",
      "5. Tại F2 nhập =IF(E2>=1000000,\"Đơn lớn\",\"Đơn thường\").",
      "6. Tạo cột ghép mã bằng =A2&\"-\"&TEXT(B2,\"000\").",
      "7. Kiểm tra dòng đầu, giữa và cuối; đổi H1 để xác nhận kết quả cập nhật.",
      "8. Tạo một phép chia cho 0 có chủ đích và ghi rõ cách xử lý lỗi."
    ],
    "mouse": "Chuột trái chọn ô công thức, kéo Fill Handle; mọi công thức nhập trực tiếp vào ô tương ứng. Không sao chép công thức trước khi xác nhận dòng mẫu.",
    "expected": "Thay đổi H1 làm Thành tiền cập nhật; IF phân loại đúng; mã ghép giữ định dạng; không có tham chiếu trượt.",
    "practice": "Mở rộng bảng thành 30 đơn hàng và thêm trường hợp đơn có số lượng 0.",
    "errors": "Không khóa H1; không kiểm tra điều kiện biên; nhập số thuế trực tiếp vào từng công thức; không đối chiếu kết quả.",
    "library": "K012; K013; K014; IF; ROUND"
  },
  {
    "id": "C4L01",
    "title": "SUM và AVERAGE",
    "goal": "Tính tổng và trung bình từ một vùng số đã xác định.",
    "steps": [
      "1. Chuẩn bị cột Doanh thu từ B2:B11.",
      "2. Chọn ô B12, nhập =SUM(B2:B11) rồi nhấn Enter.",
      "3. Chọn B13, nhập =AVERAGE(B2:B11) rồi nhấn Enter.",
      "4. Chọn B12:B13, vào Home → Number để định dạng số hoặc tiền tệ.",
      "5. Chọn B2:B11 và kiểm tra có dòng tiêu đề, tổng phụ hoặc dữ liệu Text bị lẫn không.",
      "6. Đối chiếu tổng bằng AutoSum nếu cần: chọn ô B12 → Home → AutoSum → Enter."
    ],
    "mouse": "Chuột trái chọn ô kết quả; Home → AutoSum hoặc nút Σ trên Ribbon. Không bôi cả tiêu đề vào vùng tính.",
    "expected": "SUM trả tổng vùng; AVERAGE trả trung bình các ô số, bỏ qua ô trống và văn bản.",
    "practice": "Tính tổng doanh thu và doanh thu trung bình theo ngày/cửa hàng.",
    "errors": "Chọn sai vùng; đưa tổng phụ vào vùng khiến cộng trùng; nhầm trung bình cộng với trung bình có trọng số.",
    "library": "SUM; AVERAGE"
  },
  {
    "id": "C4L02",
    "title": "MIN, MAX và COUNT",
    "goal": "Tìm giá trị nhỏ nhất, lớn nhất và đếm số ô số trong vùng.",
    "steps": [
      "1. Chọn ô B12, nhập =MIN(B2:B11) rồi Enter.",
      "2. Chọn B13, nhập =MAX(B2:B11) rồi Enter.",
      "3. Chọn B14, nhập =COUNT(B2:B11) rồi Enter.",
      "4. So sánh COUNT với số dòng có dữ liệu; kiểm tra mã dạng Text không được COUNT tính.",
      "5. Định dạng kết quả theo cùng đơn vị với dữ liệu nguồn."
    ],
    "mouse": "Chuột trái chọn các ô kết quả; nhập công thức bằng bàn phím.",
    "expected": "MIN/MAX trả biên nhỏ nhất/lớn nhất; COUNT chỉ đếm ô có giá trị số.",
    "practice": "Tìm sản lượng cao nhất/thấp nhất và số bản ghi có số lượng hợp lệ.",
    "errors": "Dùng COUNT để đếm mã nhân viên dạng Text; vùng dữ liệu chứa số lưu dạng Text.",
    "library": "MIN; MAX; COUNT"
  },
  {
    "id": "C4L03",
    "title": "COUNTA và COUNTBLANK",
    "goal": "Đếm ô đã nhập dữ liệu và ô còn trống để kiểm soát tính đầy đủ.",
    "steps": [
      "1. Chuẩn bị cột Mã nhân viên A2:A20 có cả ô đã nhập và ô bỏ trống.",
      "2. Chọn B2, nhập =COUNTA(A2:A20) rồi Enter.",
      "3. Chọn B3, nhập =COUNTBLANK(A2:A20) rồi Enter.",
      "4. Chọn một ô đang trống, gõ dấu cách rồi Enter; quan sát COUNTA thay đổi.",
      "5. Thử nhập công thức =\"\" vào một ô và kiểm tra cách đếm.",
      "6. Xóa nội dung thử nghiệm để trả dữ liệu về trạng thái ban đầu."
    ],
    "mouse": "Chuột trái chọn ô kết quả; có thể dùng Home → Find & Select → Go To Special → Blanks để chọn ô trống thật.",
    "expected": "COUNTA đếm ô không trống; COUNTBLANK đếm ô trống theo quy tắc Excel. Dấu cách không phải ô trống thật.",
    "practice": "Đếm số hồ sơ đã nhập và số trường còn thiếu trước khi gửi báo cáo.",
    "errors": "Nhìn bằng mắt để kết luận ô trống; quên dấu cách; ô chứa công thức trả chuỗi rỗng gây hiểu nhầm.",
    "library": "COUNTA; COUNTBLANK"
  },
  {
    "id": "C4L04",
    "title": "IF",
    "goal": "Dùng một điều kiện để trả về một trong hai kết quả.",
    "steps": [
      "1. Tạo cột Số lỗi ở B2 và Kết luận ở C2.",
      "2. Chọn C2, nhập =IF(B2=0,\"Không lỗi\",\"Có lỗi\") rồi Enter.",
      "3. Chọn C2, kéo Fill Handle xuống các dòng còn lại.",
      "4. Thử thay B2 thành 0 và 1 để kiểm tra cả hai nhánh.",
      "5. Nếu quy tắc là đạt khi tỷ lệ lỗi dưới 1%, dùng điều kiện tham chiếu ô ngưỡng thay vì gõ số rải rác."
    ],
    "mouse": "Chuột trái chọn ô công thức và kéo Fill Handle. Nhấn F2 để sửa công thức trong ô nếu cần.",
    "expected": "Giá trị 0 trả Không lỗi; giá trị khác 0 trả Có lỗi.",
    "practice": "Phân loại trạng thái kiểm tra chất lượng hoặc đơn hàng theo một ngưỡng.",
    "errors": "Dùng điều kiện =0 khi nghiệp vụ yêu cầu <=0; không kiểm tra giá trị biên; nhầm vị trí value_if_true và value_if_false.",
    "library": "IF"
  },
  {
    "id": "C4L05",
    "title": "AND và OR",
    "goal": "Kết hợp nhiều điều kiện để xác định một trạng thái.",
    "steps": [
      "1. Tạo cột Số lỗi B2, Sản lượng C2 và Kết luận D2.",
      "2. Chọn D2, nhập =IF(AND(B2=0,C2>=100),\"Đạt\",\"Chưa đạt\") rồi Enter.",
      "3. Tạo một cột cảnh báo khác với =IF(OR(B2>5,C2<50),\"Cảnh báo\",\"Bình thường\").",
      "4. Kéo Fill Handle xuống các dòng.",
      "5. Thử lần lượt thay B2 và C2 để xác nhận AND yêu cầu tất cả điều kiện đúng, OR chỉ cần một điều kiện đúng."
    ],
    "mouse": "Chuột trái chọn ô công thức; kéo Fill Handle. Không cần menu chuột phải.",
    "expected": "AND chỉ trả TRUE khi mọi điều kiện đều đúng; OR trả TRUE khi có ít nhất một điều kiện đúng.",
    "practice": "Chỉ công nhận ca đạt khi không có lỗi và sản lượng đủ; cảnh báo nếu lỗi cao hoặc sản lượng thấp.",
    "errors": "Dùng OR khi mọi điều kiện đều phải đạt; thiếu ngoặc; đặt sai điều kiện ngưỡng.",
    "library": "AND; OR"
  },
  {
    "id": "C4L06",
    "title": "SUMIF",
    "goal": "Cộng một cột theo một điều kiện ở cột khác.",
    "steps": [
      "1. Tạo bảng có Cửa hàng ở A2:A20 và Doanh thu ở B2:B20.",
      "2. Nhập mã cửa hàng cần tính, ví dụ HN01, vào D2.",
      "3. Chọn E2, nhập =SUMIF(A2:A20,D2,B2:B20) rồi Enter.",
      "4. Đổi D2 sang HN02 để kiểm tra kết quả tự cập nhật.",
      "5. Đối chiếu bằng Filter: lọc A theo HN01 rồi cộng các giá trị B đang hiển thị bằng cách kiểm tra riêng."
    ],
    "mouse": "Chuột trái chọn D2/E2; Data → Filter để lọc đối chiếu. Công thức nhập bằng bàn phím.",
    "expected": "E2 chỉ cộng doanh thu của các dòng có cửa hàng bằng D2.",
    "practice": "Tổng doanh số theo cửa hàng hoặc tổng số lượng theo mã lỗi.",
    "errors": "Đảo criteria_range và sum_range; hai vùng không cùng kích thước; tiêu chí có khoảng trắng thừa.",
    "library": "SUMIF"
  },
  {
    "id": "C4L07",
    "title": "COUNTIF",
    "goal": "Đếm số dòng/ô thỏa một điều kiện.",
    "steps": [
      "1. Tạo cột Trạng thái ở C2:C20.",
      "2. Nhập Đạt vào E2.",
      "3. Chọn F2, nhập =COUNTIF(C2:C20,E2) rồi Enter.",
      "4. Thử đếm giá trị lớn hơn 10 bằng =COUNTIF(B2:B20,\">10\").",
      "5. Nếu ngưỡng nằm ở ô E3, nhập =COUNTIF(B2:B20,\">\"&E3).",
      "6. Đối chiếu kết quả bằng Filter trên cột điều kiện."
    ],
    "mouse": "Chuột trái chọn ô công thức; dùng mũi tên Filter để kiểm tra thủ công số dòng.",
    "expected": "F2 là số ô khớp điều kiện; khi thay E2/E3, kết quả cập nhật.",
    "practice": "Đếm số lỗi theo loại hoặc số đơn theo trạng thái.",
    "errors": "Thiếu dấu ngoặc kép quanh điều kiện so sánh; quên nối dấu > với địa chỉ ô bằng &; đếm nhầm cột.",
    "library": "COUNTIF"
  },
  {
    "id": "C4L08",
    "title": "SUMIFS và COUNTIFS",
    "goal": "Tổng hợp hoặc đếm khi nhiều điều kiện phải đồng thời đúng.",
    "steps": [
      "1. Chuẩn bị các cột Cửa hàng A, Ngày B, Trạng thái C, Doanh thu D.",
      "2. Nhập cửa hàng cần lọc vào F2; ngày đầu tháng vào F3; ngày đầu tháng sau vào F4.",
      "3. Chọn F5, nhập =SUMIFS(D2:D100,A2:A100,F2,B2:B100,\">=\"&F3,B2:B100,\"<\"&F4) rồi Enter.",
      "4. Chọn F6, nhập =COUNTIFS(A2:A100,F2,C2:C100,\"Đạt\") rồi Enter.",
      "5. Đổi cửa hàng hoặc tháng để kiểm tra kết quả.",
      "6. Kiểm tra các vùng điều kiện và vùng tính có cùng số dòng."
    ],
    "mouse": "Chuột trái chọn ô kết quả và các ô tham số; dùng Filter để đối chiếu nhiều điều kiện nếu cần.",
    "expected": "SUMIFS trả tổng theo cửa hàng và khoảng ngày; COUNTIFS đếm dòng vừa đúng cửa hàng vừa có trạng thái Đạt.",
    "practice": "Báo cáo doanh thu cửa hàng theo tháng; đếm lỗi ca đêm theo mức độ.",
    "errors": "Dùng SUMIF thay SUMIFS; viết điều kiện ngày thiếu dấu &; dùng mốc <= ngày cuối tháng thay vì < ngày đầu tháng sau gây bỏ sót giờ.",
    "library": "SUMIFS; COUNTIFS"
  },
  {
    "id": "C4L09",
    "title": "IFERROR",
    "goal": "Hiển thị kết quả thay thế khi công thức phát sinh lỗi đã được xác định là có thể chấp nhận.",
    "steps": [
      "1. Chọn B2, nhập =10/0 để tạo lỗi #DIV/0!.",
      "2. Chọn C2, nhập =IFERROR(10/0,\"Chưa có sản lượng\") rồi Enter.",
      "3. Thay công thức bằng =IFERROR(A2/B2,0) nếu nghiệp vụ xác định mẫu số bằng 0 phải trả 0.",
      "4. Trước khi dùng IFERROR, kiểm tra công thức gốc có sai tham chiếu hay sai kiểu dữ liệu không.",
      "5. Ghi chú trường hợp thay thế để người đọc hiểu ý nghĩa kết quả."
    ],
    "mouse": "Chuột trái chọn ô và nhập công thức. Không dùng thao tác chuột phải để sửa lỗi.",
    "expected": "Ô C2 hiển thị thông báo hoặc giá trị dự phòng thay vì mã lỗi; nguyên nhân lỗi gốc phải được hiểu rõ.",
    "practice": "Tính tỷ lệ lỗi khi sản lượng bằng 0; hiển thị N/A thay vì tỷ lệ giả.",
    "errors": "Bọc toàn bộ báo cáo bằng IFERROR(...,0) khiến lỗi nguồn bị che; thay lỗi bằng 0 dù 0 mang ý nghĩa nghiệp vụ khác.",
    "library": "IFERROR"
  },
  {
    "id": "C4L10",
    "title": "LEFT, RIGHT, MID và LEN",
    "goal": "Trích xuất một phần chuỗi và kiểm tra độ dài mã.",
    "steps": [
      "1. Nhập mã NV-HN-0025 vào A2.",
      "2. Chọn B2, nhập =LEFT(A2,2) để lấy hai ký tự đầu.",
      "3. Chọn C2, nhập =RIGHT(A2,4) để lấy bốn ký tự cuối.",
      "4. Chọn D2, nhập =MID(A2,4,2) để lấy hai ký tự từ vị trí 4.",
      "5. Chọn E2, nhập =LEN(A2) để đếm số ký tự.",
      "6. Kéo các công thức xuống các dòng còn lại và so sánh với mã nguồn."
    ],
    "mouse": "Chuột trái chọn ô công thức; có thể nhấp đúp Fill Handle để điền xuống nếu cột bên cạnh có dữ liệu liên tục.",
    "expected": "B2/C2/D2 trả phần chuỗi tương ứng; E2 đếm cả dấu gạch nối và khoảng trắng.",
    "practice": "Tách tiền tố khu vực, mã loại lỗi hoặc số thứ tự từ mã định danh.",
    "errors": "Đếm sai vị trí bắt đầu của MID; quên khoảng trắng cũng được tính; mã không đồng nhất độ dài.",
    "library": "LEFT; RIGHT; MID; LEN"
  },
  {
    "id": "C4L11",
    "title": "Hàm xử lý văn bản và ngày tháng",
    "goal": "Chuẩn hóa văn bản và lấy thông tin ngày phục vụ lọc/tổng hợp.",
    "steps": [
      "1. Nhập tên có khoảng trắng thừa vào A2.",
      "2. Chọn B2, nhập =TRIM(A2) để bỏ khoảng trắng thừa.",
      "3. Chọn C2, nhập =PROPER(B2) để viết hoa chữ đầu mỗi từ nếu phù hợp.",
      "4. Với mã có dấu gạch sai, dùng =SUBSTITUTE(A2,\"_\",\"-\").",
      "5. Với ngày ở D2, dùng =YEAR(D2), =MONTH(D2), =DAY(D2) để lấy thành phần.",
      "6. Kéo Fill Handle xuống và kiểm tra một vài dòng có ký tự đặc biệt."
    ],
    "mouse": "Chuột trái chọn ô; công thức nhập từ bàn phím. Dùng Data → Text to Columns chỉ khi cần tách cột theo dấu phân cách.",
    "expected": "Tên/mã được chuẩn hóa theo quy tắc; các trường năm, tháng, ngày được tách đúng.",
    "practice": "Chuẩn hóa tên cửa hàng và tạo cột tháng báo cáo từ ngày giao dịch.",
    "errors": "TRIM không loại mọi ký tự khoảng trắng đặc biệt; PROPER không phù hợp mọi mã viết hoa; TODAY thay đổi theo ngày hệ thống.",
    "library": "TRIM; SUBSTITUTE; YEAR; MONTH; DAY"
  },
  {
    "id": "C4L12",
    "title": "Bài thực hành tổng hợp hàm",
    "goal": "Tạo báo cáo đơn hàng dùng hàm tổng hợp, đếm, phân loại và chuẩn hóa dữ liệu.",
    "steps": [
      "1. Chuẩn bị bảng có Mã đơn, Cửa hàng, Ngày, Trạng thái, Số lượng, Đơn giá.",
      "2. Tại G2 nhập =E2*F2 để tính Thành tiền; kéo xuống hết dữ liệu.",
      "3. Tại ô tổng doanh thu nhập =SUM(G2:G100); tại ô trung bình nhập =AVERAGE(G2:G100).",
      "4. Dùng =COUNTIF(D2:D100,\"Trễ\") để đếm đơn trễ.",
      "5. Dùng SUMIFS để tính doanh thu theo cửa hàng và tháng.",
      "6. Dùng IF để phân loại đơn lớn; dùng IFERROR cho trường hợp mẫu số bằng 0 sau khi kiểm tra nguyên nhân.",
      "7. Dùng TRIM/SUBSTITUTE để chuẩn hóa tên/mã; dùng MONTH để tạo tháng báo cáo.",
      "8. Đối chiếu một cửa hàng bằng Filter và cộng thủ công vài dòng mẫu."
    ],
    "mouse": "Chuột trái chọn ô công thức, kéo Fill Handle; Data → Filter để đối chiếu; không cần chuột phải trừ khi dán kết quả Values.",
    "expected": "Các KPI có định nghĩa rõ, công thức tính đúng, dữ liệu chuẩn hóa và kết quả đối chiếu được.",
    "practice": "Thêm điều kiện theo trạng thái hoặc khoảng ngày; kiểm tra dữ liệu có mã trùng và dòng trống.",
    "errors": "Không xác định định nghĩa KPI trước khi viết công thức; các vùng điều kiện lệch kích thước; không kiểm tra kết quả biên.",
    "library": "SUM; AVERAGE; COUNTIF; SUMIFS; IF; IFERROR"
  },
  {
    "id": "C1L01",
    "title": "Làm quen giao diện Excel",
    "goal": "Nhận diện các vùng chính trên cửa sổ Excel và biết nơi thao tác.",
    "steps": [
      "1. Mở Excel và tạo Blank Workbook.",
      "2. Nhấn chuột trái vào tab Home trên Ribbon; quan sát các nhóm Clipboard, Font, Alignment, Number.",
      "3. Nhấn chuột trái vào một ô bất kỳ; quan sát Name Box và Formula Bar.",
      "4. Nhấn chuột trái vào các tab Sheet1 phía dưới để nhận diện Worksheet.",
      "5. Nhấn dấu + cạnh tab Sheet để thêm Worksheet; nhấp đúp chuột trái vào tên Sheet để đổi tên.",
      "6. Vào File → New để xem mẫu Workbook; nhấn Esc để quay lại."
    ],
    "mouse": "Chuột trái dùng để chọn tab Ribbon, ô và Worksheet; nhấp đúp chuột trái vào tên Sheet để đổi tên. Chuột phải trên tab Sheet mở menu đổi tên/di chuyển/xóa.",
    "expected": "Nhận diện được Ribbon, Name Box, Formula Bar, vùng ô, tab Sheet và thanh trạng thái.",
    "practice": "Tạo Workbook quản lý đơn hàng với các Sheet Data, Master và Report.",
    "errors": "Nhầm Workbook với Worksheet; sửa dữ liệu trên nhầm Sheet; đóng cửa sổ mà chưa lưu file.",
    "library": "K001; K002; K003"
  },
  {
    "id": "C1L02",
    "title": "Workbook, Worksheet và cấu trúc file",
    "goal": "Phân biệt tệp Excel với các trang tính bên trong và tổ chức file có chủ đích.",
    "steps": [
      "1. Vào File → New → Blank Workbook.",
      "2. Nhấn chuột trái vào tab Sheet1, nhấp đúp tên Sheet1 và gõ Data.",
      "3. Nhấn dấu + để thêm Sheet; đổi tên thành Master.",
      "4. Thêm Sheet thứ ba và đổi tên thành Report.",
      "5. Nhấn chuột phải vào tab Report để xem Rename, Move or Copy, Delete, Tab Color.",
      "6. Nhấn Ctrl+S, chọn vị trí lưu, đặt tên file rồi nhấn Save."
    ],
    "mouse": "Chuột trái để chọn/nhấp đúp đổi tên; chuột phải vào tab Sheet để mở menu quản lý trang tính.",
    "expected": "Một Workbook có ba Worksheet tên Data, Master và Report; file được lưu với tên rõ ràng.",
    "practice": "Tách dữ liệu đầu vào, danh mục chuẩn và báo cáo tổng hợp thành ba Sheet.",
    "errors": "Tạo nhiều file riêng không cần thiết; xóa nhầm Worksheet; đặt tên Sheet trùng hoặc khó hiểu.",
    "library": "K001"
  },
  {
    "id": "C1L03",
    "title": "Ô, dòng, cột, vùng và địa chỉ",
    "goal": "Đọc đúng địa chỉ ô và chọn vùng dữ liệu trước khi nhập hoặc định dạng.",
    "steps": [
      "1. Nhấn chuột trái vào ô B3; đọc địa chỉ B3 trên Name Box.",
      "2. Nhấn chuột trái vào chữ B trên đầu cột để chọn cả cột B.",
      "3. Nhấn chuột trái vào số 3 bên trái để chọn cả dòng 3.",
      "4. Giữ chuột trái tại B3, kéo đến D8 để chọn vùng B3:D8.",
      "5. Nhấn Ctrl+G, nhập B3:D8 rồi Enter để chọn lại vùng bằng địa chỉ.",
      "6. Nhìn Formula Bar để phân biệt nội dung ô với địa chỉ ô."
    ],
    "mouse": "Chuột trái chọn ô, tiêu đề cột, tiêu đề dòng và kéo vùng. Chuột phải chỉ mở menu thao tác, không dùng để xác định vùng chọn.",
    "expected": "Name Box hiển thị đúng địa chỉ; vùng B3:D8 được tô chọn; cột B hoặc dòng 3 được chọn toàn bộ.",
    "practice": "Chọn đúng vùng dữ liệu trước khi áp dụng định dạng hoặc công thức.",
    "errors": "Nhầm B3:D8 là một ô; kéo lệch vùng; chọn tiêu đề cột thay vì một ô.",
    "library": "K002; K003"
  },
  {
    "id": "C1L04",
    "title": "Di chuyển và chọn vùng bằng chuột",
    "goal": "Di chuyển trong Worksheet và chọn một vùng liên tục bằng thao tác chuột chính xác.",
    "steps": [
      "1. Nhấn chuột trái vào ô A1.",
      "2. Dùng thanh cuộn dọc bên phải để kéo xuống khoảng dòng 100.",
      "3. Dùng thanh cuộn ngang phía dưới để kéo sang cột H.",
      "4. Nhấn chuột trái vào ô B2, giữ nút chuột trái và kéo đến E10.",
      "5. Muốn chọn vùng lớn, nhấn vào ô đầu, giữ Shift rồi nhấn ô cuối.",
      "6. Nhấn Ctrl+Home để quay về A1."
    ],
    "mouse": "Chuột trái để chọn ô và kéo thanh cuộn; lăn bánh xe chuột để cuộn dọc. Nhấn giữ Shift và nhấp chuột trái để chọn vùng từ ô đầu đến ô cuối.",
    "expected": "Vùng B2:E10 được chọn chính xác; vị trí đang đứng thể hiện trên Name Box.",
    "practice": "Thực hành chọn vùng dữ liệu lớn trên bảng kiểm tra chất lượng mà không kéo lệch cột.",
    "errors": "Kéo thanh cuộn ngang/dọc khiến mất vị trí; nhấn chuột phải khi định chọn vùng; chọn ô cuối nhưng quên giữ Shift.",
    "library": "K002; K003"
  },
  {
    "id": "C1L05",
    "title": "Nhập, sửa và xóa nội dung ô",
    "goal": "Nhập dữ liệu, chỉnh sửa nội dung và xóa đúng phần cần xóa.",
    "steps": [
      "1. Nhấn chuột trái vào ô A1, gõ Mã đơn rồi nhấn Enter.",
      "2. Nhập dữ liệu mẫu vào A2, B2 và C2.",
      "3. Muốn sửa toàn bộ nội dung, chọn ô rồi gõ nội dung mới và Enter.",
      "4. Muốn sửa một phần, nhấp đúp chuột trái vào ô hoặc chọn ô rồi nhấn F2.",
      "5. Muốn xóa nội dung nhưng giữ định dạng, chọn ô và nhấn Delete trên bàn phím.",
      "6. Muốn xóa cả nội dung, định dạng và ghi chú, vào Home → Clear → Clear All."
    ],
    "mouse": "Chuột trái chọn ô; nhấp đúp chuột trái để sửa trực tiếp. Chuột phải mở menu Clear Contents nếu cần; phím Delete chỉ xóa nội dung.",
    "expected": "Nội dung được nhập/sửa đúng ô; thao tác Delete không làm mất định dạng; Clear All xóa cả định dạng.",
    "practice": "Nhập mã sản phẩm, số lượng, ngày phát sinh và ghi chú theo đúng cột.",
    "errors": "Nhấn Delete khi đang chọn cả dòng/cột; gõ đè làm mất nội dung cũ; nhầm Clear Contents với Clear All.",
    "library": "K002; K006"
  },
  {
    "id": "C1L07",
    "title": "Định dạng số, ngày và phần trăm",
    "goal": "Thay đổi cách hiển thị số mà không làm sai giá trị gốc.",
    "steps": [
      "1. Nhập 12500000 vào A2, 0.085 vào A3 và một ngày hợp lệ vào A4.",
      "2. Chọn A2 bằng chuột trái; vào Home → Number Format → Number hoặc Currency.",
      "3. Chọn A3; vào Home → Number Format → Percentage.",
      "4. Chọn A4; vào Home → Number Format → Short Date.",
      "5. Nhấn Ctrl+1 để mở Format Cells; chọn Number, Date hoặc Percentage rồi nhấn OK.",
      "6. Chọn từng ô và nhìn Formula Bar để so sánh giá trị thật với cách hiển thị."
    ],
    "mouse": "Chuột trái chọn ô và danh sách Number Format; Ctrl+1 mở Format Cells. Chuột phải → Format Cells cũng được.",
    "expected": "12.500.000 hiển thị dạng số/tiền; 0.085 hiển thị 8,5%; ngày hiển thị theo định dạng đã chọn.",
    "practice": "Định dạng báo cáo doanh số, tỷ lệ lỗi và ngày kiểm tra trước khi gửi quản lý.",
    "errors": "Nhập 8.5 rồi định dạng Percentage thành 850%; tưởng đổi định dạng là chuyển Text thành Date; dùng Currency không đúng đơn vị.",
    "library": "K006; K007; K008"
  },
  {
    "id": "C1L08",
    "title": "Định dạng trình bày và bố cục bảng",
    "goal": "Tạo bảng dễ đọc bằng định dạng tiêu đề, căn chỉnh, đường viền và độ rộng.",
    "steps": [
      "1. Chọn hàng tiêu đề bằng cách kéo chuột trái qua các ô A1:F1.",
      "2. Vào Home → Font → Bold để in đậm; chọn Fill Color để tô nền.",
      "3. Vào Home → Alignment → Center để căn giữa tiêu đề.",
      "4. Chọn cột A:F bằng cách kéo qua các chữ cái cột; nhấp đúp ranh giới giữa hai chữ cái cột để AutoFit Column Width.",
      "5. Chọn vùng bảng, vào Home → Borders → All Borders.",
      "6. Nếu cần xuống dòng, chọn ô rồi nhấn Home → Wrap Text."
    ],
    "mouse": "Chuột trái chọn vùng, nút Bold, Fill Color, Alignment, Borders và Wrap Text. Nhấp đúp chuột trái vào ranh giới cột để AutoFit.",
    "expected": "Tiêu đề nổi bật, nội dung không bị cắt, cột vừa với dữ liệu và bảng có đường viền dễ đọc.",
    "practice": "Chuẩn hóa báo cáo ca ngày/ca đêm để người nhận đọc nhanh.",
    "errors": "Gộp ô tràn lan; căn giữa mọi dữ liệu; tô quá nhiều màu; chỉnh độ rộng từng cột thủ công.",
    "library": "K003"
  },
  {
    "id": "C1L09",
    "title": "Sao chép dữ liệu và AutoFill",
    "goal": "Sao chép nội dung và điền chuỗi dữ liệu bằng Fill Handle.",
    "steps": [
      "1. Nhập mã NV001 vào A2.",
      "2. Chọn A2, đưa con trỏ đến ô vuông nhỏ ở góc dưới phải vùng chọn.",
      "3. Giữ chuột trái và kéo xuống A10; quan sát Auto Fill Options.",
      "4. Muốn tạo dãy số, nhập 1 ở B2 và 2 ở B3; chọn cả B2:B3 rồi kéo Fill Handle xuống.",
      "5. Muốn sao chép định dạng, Copy ô mẫu, chọn vùng đích, nhấn chuột phải → Paste Special → Formats.",
      "6. Kiểm tra dữ liệu ở dòng cuối và xóa vùng thử nghiệm nếu cần."
    ],
    "mouse": "Chuột trái kéo Fill Handle; chuột phải tại ô đích để chọn Paste Special → Formats.",
    "expected": "Dữ liệu hoặc chuỗi được điền theo quy luật; định dạng được sao chép mà không thay đổi giá trị.",
    "practice": "Tạo số thứ tự, lịch ngày hoặc sao chép công thức xuống các dòng báo cáo.",
    "errors": "Kéo một giá trị đơn và mong tạo chuỗi; nhầm Fill Handle với viền vùng chọn; sao chép đè dữ liệu có sẵn.",
    "library": "K050; K048"
  },
  {
    "id": "C1L10",
    "title": "Tạo, lưu và chọn đúng định dạng file",
    "goal": "Lưu Workbook đúng vị trí, tên và định dạng để tránh mất dữ liệu hoặc mất tính năng.",
    "steps": [
      "1. Nhấn Ctrl+S hoặc vào File → Save As.",
      "2. Chọn Browse để mở cửa sổ lưu file.",
      "3. Chọn thư mục đích, nhập tên file có phiên bản/ngày rõ ràng.",
      "4. Mở danh sách Save as type.",
      "5. Chọn Excel Workbook (*.xlsx) cho file thông thường; chọn Excel Macro-Enabled Workbook (*.xlsm) nếu có Macro.",
      "6. Nhấn Save; nếu Excel cảnh báo tính năng không tương thích, đọc kỹ trước khi chọn tiếp.",
      "7. Đóng rồi mở lại file để xác nhận file lưu đúng."
    ],
    "mouse": "Chuột trái chọn File → Save As → Browse, chọn thư mục, định dạng và Save. Ctrl+S lưu nhanh sau khi đã có tên file.",
    "expected": "File xuất hiện đúng thư mục, đúng tên và đúng phần mở rộng; Macro không bị mất khi lưu .xlsm.",
    "practice": "Tạo bản sao trước khi chỉnh sửa file báo cáo gốc; đặt tên theo tháng và phiên bản.",
    "errors": "Lưu file có Macro thành .xlsx; ghi đè nhầm bản gốc; không kiểm tra thư mục lưu.",
    "library": "K001"
  },
  {
    "id": "C1L11",
    "title": "Thiết lập trang in và xuất PDF",
    "goal": "Chọn vùng in, kiểm tra bố cục trang và xuất báo cáo thành PDF.",
    "steps": [
      "1. Chọn vùng bảng cần in bằng chuột trái kéo từ ô đầu đến ô cuối.",
      "2. Vào Page Layout → Print Area → Set Print Area.",
      "3. Vào Page Layout → Orientation → Landscape nếu bảng nhiều cột.",
      "4. Chọn Page Layout → Size → A4.",
      "5. Trong Scale to Fit, chọn Fit All Columns on One Page nếu cần vừa chiều ngang; tránh ép quá nhiều dòng vào một trang.",
      "6. Vào File → Print để xem Print Preview; kiểm tra lề, tiêu đề và số trang.",
      "7. Vào File → Export → Create PDF/XPS hoặc Save As → PDF; chọn Publish/Save."
    ],
    "mouse": "Chuột trái thao tác Page Layout và File; Print Preview là bước bắt buộc trước khi xuất. Không dùng chuột phải để xuất PDF.",
    "expected": "Bảng nằm gọn trong trang, không bị cắt cột; file PDF mở được và đúng nội dung.",
    "practice": "Xuất báo cáo QC một trang để gửi quản lý hoặc lưu hồ sơ.",
    "errors": "Chọn sai Print Area; ép vừa một trang khiến chữ quá nhỏ; không kiểm tra Print Preview; xuất nhầm Sheet.",
    "library": "K003"
  },
  {
    "id": "C1L12",
    "title": "Bài thực hành tổng hợp: dựng Workbook quản lý đơn hàng",
    "goal": "Tạo một Workbook có cấu trúc rõ ràng, nhập liệu, định dạng và xuất báo cáo.",
    "steps": [
      "1. Tạo Blank Workbook và đổi Sheet1 thành Data; thêm Master và Report.",
      "2. Trên Data, nhập tiêu đề Mã đơn, Ngày, Cửa hàng, Mã hàng, Số lượng, Đơn giá.",
      "3. Nhập ít nhất 10 dòng dữ liệu; giữ mã có số 0 đầu dưới dạng Text.",
      "4. Trên Master, tạo danh sách cửa hàng và mã hàng chuẩn.",
      "5. Trên Report, tạo tiêu đề báo cáo và liên kết vài chỉ tiêu từ Data.",
      "6. Định dạng ngày, số lượng, đơn giá; AutoFit cột; in đậm tiêu đề và thêm đường viền.",
      "7. Lưu file dạng .xlsx; thiết lập vùng in và xuất PDF.",
      "8. Đóng/mở lại file để kiểm tra cấu trúc và nội dung."
    ],
    "mouse": "Chuột trái để chọn Sheet, ô và vùng; nhấp đúp tên Sheet để đổi tên; chuột phải tab Sheet để quản lý; Ctrl+S lưu file; Page Layout để thiết lập in.",
    "expected": "Workbook có ba Sheet đúng vai trò, dữ liệu không lệch cột, định dạng phù hợp và PDF không bị cắt.",
    "practice": "Mở rộng thêm cột Trạng thái đơn và ghi chú; thử thay dữ liệu nguồn rồi cập nhật Report.",
    "errors": "Để tất cả dữ liệu trên một Sheet; dùng sai kiểu dữ liệu; quên lưu; xuất PDF trước khi xem Print Preview.",
    "library": "K001; K002; K003; K006; K007"
  }
];
