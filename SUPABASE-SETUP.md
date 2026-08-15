
# Kích hoạt Supabase cho website

Website đã được chuẩn bị để dùng Supabase Auth + Database thật.

## 1. Tạo project Supabase
Tạo một project mới trên Supabase.

## 2. Thông tin kết nối

File `supabase-config.js` đã được điền Project URL + Publishable key.
Không thay bằng `service_role` hoặc Secret key.

## 3. Tạo bảng dữ liệu
Mở SQL Editor của Supabase và chạy toàn bộ nội dung file:

`supabase-setup.sql`

File này tạo:
- `profiles`
- `user_progress`
- Row Level Security (RLS)
- trigger tự tạo profile/progress khi đăng ký

## 4. Cấu hình Auth URL
Trong Supabase Auth / URL Configuration:
- Site URL: URL GitHub Pages của website
- Redirect URLs: thêm URL website nếu cần xác nhận email / OAuth

## 5. Chạy website
Mở bằng VS Code + Live Server hoặc deploy GitHub Pages.

Sau khi kết nối:
- Đăng ký / đăng nhập dùng Supabase Auth thật
- Hồ sơ được lưu trong `profiles`
- Tiến độ học có thể lưu trong `user_progress`
- Mỗi người chỉ được phép đọc/sửa dữ liệu của chính mình nhờ RLS

## Lưu ý
Nếu `supabase-config.js` chưa được điền, trang đăng nhập sẽ hiển thị cảnh báo cấu hình.


## Đồng bộ tiến độ học
Bản này tự đồng bộ các dữ liệu sau theo tài khoản:
- Chuyên đề đã hoàn thành
- Quiz best score
- Playground
- Lộ trình 30 ngày
- XP thưởng
- Chuỗi ngày học
- Sự kiện học / nhiệm vụ hằng ngày
- Hoạt động gần đây
- Hồ sơ cá nhân

Dữ liệu QC Dashboard, theme và lịch sử tìm kiếm không được đồng bộ lên tài khoản.


## URL xác nhận email cho GitHub Pages

Trong Supabase Dashboard > Authentication > URL Configuration, đặt:

- Site URL: `https://doananhtuant02.github.io/LearnExcelwithme/`
- Redirect URLs: thêm `https://doananhtuant02.github.io/LearnExcelwithme/**`

Trang đăng ký trong bản này cũng đã đặt `emailRedirectTo` về URL chính thức trên.
