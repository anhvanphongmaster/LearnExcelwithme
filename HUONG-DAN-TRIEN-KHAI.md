# Hướng dẫn triển khai — Learn Excel with Anh Van Phong

## 1. Upload lên GitHub Pages

### Cách nhanh (khuyến nghị)

1. Giải nén file ZIP website.
2. Tạo repo GitHub mới (ví dụ: `learn-excel`) **hoặc** dùng repo hiện có.
3. Upload **toàn bộ nội dung trong thư mục gốc** lên repo:
   - Phải thấy `index.html` ngay ở root repo
   - **Không** bọc thêm folder kiểu `v21/`, `website/`, `dist/`
4. Vào **Settings → Pages**:
   - Source: **Deploy from a branch**
   - Branch: `main` (hoặc `master`)
   - Folder: `/ (root)`
5. Đợi 1–2 phút, mở:
   - `https://<username>.github.io/<repo>/`

### Lưu ý quan trọng

- Mọi đường dẫn download đang dùng **relative path** (`downloads/...`) → tương thích GitHub Pages.
- Nếu đổi tên repo, không cần sửa code (trừ khi dùng absolute URL).
- File lớn (ZIP Power Query, Practice Lab) vẫn nằm trong `downloads/`.

---

## 2. Kiểm tra sau khi lên live

Mở lần lượt:

| Trang | Kiểm tra |
|------|----------|
| Trang chủ | Hero CTA xanh: **📚 Bài tập thực hành theo video** |
| `practice-video.html` | 10 card Coming soon + card 11 permanent |
| `excel-mobile.html` | Vẫn mở được (Tools / Search / card module) |
| `excel.html` | 6 chuyên đề + file thực hành cơ bản |
| `power-query-course.html` | Download 10 file Power Query |
| `practice-lab.html` | 3 project lab |
| Dark mode | Bật 🌙 — chữ/card vẫn đọc được |
| Mobile | iPhone 375–430px, không tràn ngang |

---

## 3. Phát hành file thực hành theo video (workflow)

Hệ thống **không cần sửa HTML** mỗi lần ra video mới.

### Bước 1 — Chuẩn bị file Excel/ZIP thật

Đặt vào thư mục:

```text
downloads/video-practice/
```

Tên file gợi ý (khớp config trong `practice-video.js`):

| Video | Tên file gợi ý |
|------|----------------|
| 01 | `video-01-viet-nam-hidden-space.xlsx` |
| 02 | `video-02-visible-cells-only.xlsx` |
| 03 | `video-03-number-stored-as-text.xlsx` |
| 04 | `video-04-compare-two-lists.xlsx` |
| 05 | `video-05-fill-blanks.xlsx` |
| 06 | `video-06-delete-blank-rows.xlsx` |
| 07 | `video-07-office-shortcuts.xlsx` |
| 08 | `video-08-company-name-cleaning.xlsx` |
| 09 | `video-09-business-cards-to-excel.xlsx` |
| 10 | `video-10-power-query-master-4150.xlsx` |

### Bước 2 — Mở khóa card trong manifest

Sửa file:

```text
practice-files-manifest.js
```

Ví dụ chỉ mở Video 01:

```js
const availablePracticeFiles = [
  "video-01-viet-nam-hidden-space.xlsx"
];
```

Ví dụ mở Video 01 + 03:

```js
const availablePracticeFiles = [
  "video-01-viet-nam-hidden-space.xlsx",
  "video-03-number-stored-as-text.xlsx"
];
```

### Bước 3 — Upload lại GitHub

Commit + push 2 thứ:

1. File trong `downloads/video-practice/`
2. File `practice-files-manifest.js` đã cập nhật

→ Card tương ứng tự chuyển **✅ Đã có file**, nút **Tải file thực hành** hoạt động.

### Không làm

- Không tạo file Excel giả cho video chưa quay
- Không sửa `practice-video.html` chỉ để mở khóa card
- Không đổi `id` / thứ tự 01–10 trừ khi đổi kế hoạch content

---

## 4. Cấu trúc thư mục quan trọng

```text
index.html
practice-video.html
practice-video.css
practice-video.js
practice-files-manifest.js   ← chỉ sửa file này khi mở khóa
excel-mobile.html
excel-mobile.css
excel-mobile.js
downloads/
  ├── video-practice/        ← file theo video TikTok
  ├── power-query/           ← 10 Input + Master Expected
  ├── practice-lab/          ← Pivot / Dashboard / DAX
  ├── *.xlsx                 ← file thực hành 6 chuyên đề
  ├── PowerQuery-Practice-10-Files.zip
  └── Practice-Lab-V14-Datasets.zip
```

Ba thư viện thực hành **tách riêng**, không trộn:

1. Video practice (`downloads/video-practice/`)
2. Cơ bản 6 chuyên đề + extras
3. Power Query course + Practice Lab

---

## 5. Supabase / tài khoản (nếu dùng)

- Giữ nguyên `supabase-config.js`, `supabase-auth.js`
- XP, quiz, progress, streak **không** bị reset bởi bản cập nhật này
- Sau deploy, test Đăng nhập + đồng bộ cloud 1 lần trên điện thoại thật

Chi tiết setup: xem `SUPABASE-SETUP.md` (nếu có trong ZIP).

---

## 6. Checklist trước mỗi lần publish

- [ ] `index.html` ở root (không nằm trong subfolder)
- [ ] Hero CTA trỏ `practice-video.html`
- [ ] `practice-files-manifest.js` chỉ liệt kê file **đã có thật**
- [ ] Mọi file trong manifest tồn tại dưới `downloads/video-practice/`
- [ ] Excel Mobile vẫn mở được
- [ ] Thử 1 link download trên mobile
- [ ] Dark mode ổn

---

## 7. Hỗ trợ nhanh khi lỗi

| Lỗi | Cách xử lý |
|----|------------|
| Trang trắng / 404 | Sai root deploy — `index.html` phải ở root repo |
| Card vẫn Coming soon dù đã có file | Thiếu tên file trong `practice-files-manifest.js` **hoặc** sai chính tả tên file |
| Download 404 | Sai path / sai hoa thường tên file (GitHub phân biệt hoa thường) |
| Mất tiến độ học | Không xóa localStorage; không đổi key `avp_*` |
| Excel Mobile lỗi | Kiểm tra còn đủ 3 file `.html` `.css` `.js` |

---

© 2026 Learn Excel with Anh Van Phong
