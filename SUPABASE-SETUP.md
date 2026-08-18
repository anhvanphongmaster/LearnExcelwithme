
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


## Cấu hình đăng ký trực tiếp (bản hiện tại)
- Authentication → Sign In / Providers → Email: tắt **Confirm email**.
- Authentication → Emails → SMTP Settings: có thể tắt **Custom SMTP** nếu không dùng email xác nhận.
- Trang đăng ký không còn truyền `emailRedirectTo`; khi đăng ký thành công và Supabase trả về session, người dùng được đăng nhập ngay.

## V11 — Đồng bộ XP / Level / Badge / Streak giữa các thiết bị

V11 dùng bảng `public.user_progress` đã có trong `supabase-setup.sql`.
Nếu project Supabase chưa từng chạy file SQL này, mở **SQL Editor** và chạy toàn bộ `supabase-setup.sql` một lần.

Dữ liệu V11 đồng bộ khi người dùng đăng nhập gồm:
- XP (`avp_xp_v2`)
- quiz đã vượt
- bài đã hoàn thành
- huy hiệu + ngày mở khóa
- streak / ngày học
- bài gần đây
- bookmark và lịch sử học tập

Website vẫn giữ bản local để dùng khi mất mạng. RLS của `user_progress` chỉ cho user đọc/ghi đúng hàng có `user_id = auth.uid()`.

## V15 — Admin Learning Analytics
Sau khi đã chạy `supabase-setup.sql` và `analytics-setup.sql`, hãy chạy thêm **`admin-v15-upgrade.sql` một lần** trong Supabase SQL Editor.

V15 bổ sung thống kê XP/Level, funnel Beginner → Master, bài đã hoàn thành nhiều nhất, quiz khó nhất và xu hướng tài khoản mới. Các thống kê quiz khó bắt đầu tích lũy sau khi V15 được đưa lên web vì từ V15 website mới ghi sự kiện `quiz_attempt`.
