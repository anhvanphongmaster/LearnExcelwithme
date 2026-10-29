# LearnExcelwithme — Project Workflow

## Mục tiêu
Giữ một luồng điều hướng rõ ràng cho 12 chương học, tránh tạo thêm đường dẫn trùng lặp và tránh sửa nhầm chương đang đúng.

## Nguồn chuẩn (source of truth)
- Danh sách 12 chương: `learning-chapters.html`.
- Cửa sổ chọn chương trên trang chủ: được dựng bởi `homepage-minimal-v1.js`.
- Chương 1: `learning-chapter.html` — chỉ dùng làm mẫu cấu trúc và giao diện, không sửa nếu yêu cầu không nhắm tới Chương 1.
- Chương 2: `learning-chapter-2.html`.
- Chương 3: `learning-chapter-3.html`.
- Chương 4: `learning-chapter-4.html`.
- Workbook Chương 4 phải là file Excel thật (.xlsx), không dùng file HTML đổi đuôi hoặc trang web thay thế workbook. Trước khi gắn nút tải, xác nhận file nhị phân tồn tại trong repository và đường dẫn tải trả về đúng file.

## Quy tắc điều hướng
- Một mục “Lộ trình học” chính trên trang chủ mở cửa sổ chọn chương.
- Mỗi ô chương trong cửa sổ phải là liên kết thực sự tới đúng trang chương.
- Không thêm banner hoặc CTA thứ hai dẫn tới cùng danh sách 12 chương nếu không có yêu cầu rõ ràng.
- Trang `learning-chapters.html` là trang danh sách chương; các liên kết trong trang phải dẫn tới trang chương tương ứng.
- Không để ô chương trông như nút nhưng chỉ là `div` không có hành động.
- Không đổi URL đích của các chương đã tồn tại khi chưa kiểm tra liên kết và nội dung đích.

## Quy trình mỗi lần sửa
1. Đọc yêu cầu hiện tại và xác định đúng file bị lỗi.
2. Fetch bản mới nhất trên nhánh `main`; không dùng SHA hoặc nội dung cũ từ lượt trước.
3. Kiểm tra file tham chiếu liên quan nếu cần; không sửa file mẫu chỉ để làm cho file đích khớp.
4. Thực hiện thay đổi nhỏ nhất có thể, tránh cleanup ngoài phạm vi.
5. Commit từng thay đổi với thông điệp nêu rõ file và mục đích.
6. Fetch lại file sau commit để xác minh nội dung đã ghi.
7. Kiểm tra toàn bộ đường dẫn bị ảnh hưởng: trang chủ → chọn chương → trang danh sách chương → trang chương → workbook.
8. Kiểm tra cả mobile và desktop ở mức mã nguồn (viewport, breakpoint, điều khiển); chỉ tuyên bố đã kiểm tra giao diện thực tế nếu đã mở và xác minh trang đã triển khai.
9. Báo cáo ngắn: file thay đổi, commit, điều đã xác minh, việc còn thiếu. Không tuyên bố hoàn tất nếu workbook hoặc link tải chưa được kiểm tra thực tế.

## Quy tắc không được vi phạm
- Không sửa Chương 1 khi lỗi nằm ở Chương 4.
- Không tạo thêm một lối vào 12 chương để né sửa lối vào đang hỏng.
- Không tạo workbook giả, file rỗng, hoặc HTML mang tên .xlsx.
- Không nói “đã tải lên” nếu file chưa có trong repository.
- Không làm thay đổi diện rộng khi chưa audit tác động.
