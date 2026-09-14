#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

OUT = Path("downloads/daily")
GREEN = "217346"
NAVY = "1E3A5F"
YELLOW = "FFF2CC"
TABLE_HEADER_ROW = 4
DATA_START_ROW = TABLE_HEADER_ROW + 1
thin = Border(
    left=Side(style="thin", color="D0D0D0"),
    right=Side(style="thin", color="D0D0D0"),
    top=Side(style="thin", color="D0D0D0"),
    bottom=Side(style="thin", color="D0D0D0"),
)
head_fill = PatternFill("solid", fgColor=GREEN)
head_font = Font(name="Arial", bold=True, color="FFFFFF", size=11)
title_font = Font(name="Arial", bold=True, color=GREEN, size=14)
brand_font = Font(name="Arial", bold=True, color=NAVY, size=12)
body = Font(name="Arial", size=11)
yellow = PatternFill("solid", fgColor=YELLOW)

LESSONS = [
    ("b01-freeze", "Cơ bản", "Cố định hàng tiêu đề khi cuộn",
     ["Chọn ô A5 (ngay dưới hàng tiêu đề ở dòng 4).", "View → Freeze Panes → Freeze Panes.", "Cuộn xuống: hàng 4 đứng yên.", "Ghi ĐÃ CỐ ĐỊNH vào ô vàng."],
     ["Mã", "Sản phẩm", "Số lượng"],
     [(f"SP{i:02d}", f"Hàng {i}", 10 + i) for i in range(1, 25)]),
    ("b13-hyperlink", "Cơ bản", "Tạo liên kết tới sheet hướng dẫn",
     ["Chọn ô vàng trên LamBai.", "Insert → Link → Place in This Document.", "Chọn 00_HuongDan!A1."],
     ["Việc", "Trạng thái"],
     [("Tạo liên kết nội bộ", ""), ("Kiểm tra bấm được", "")]),
    ("t01-index-match", "Trung cấp", "INDEX + MATCH lấy đơn giá theo mã",
     ["MATCH mã trong cột khóa.", "INDEX cột Đơn giá bằng vị trí vừa tìm.", "Khóa tuyệt đối cột khóa.", "Điền kết quả vào cột vàng."],
     ["Mã SP", "Tên", "Đơn giá"],
     [("SP01", "Bút", 5000), ("SP02", "Vở", 12000), ("SP03", "Thước", 8000), ("SP04", "Tẩy", 3000)]),
    ("n01-let", "Nâng cao", "LET đặt biến trong công thức",
     ["Dùng =LET(ty_le,B5, doanh,C5, doanh*ty_le) cho dòng dữ liệu đầu tiên.", "Đặt tên biến rõ nghĩa.", "Viết lại hoa hồng ở ô vàng."],
     ["NV", "Tỷ lệ", "Doanh thu"],
     [("An", 0.03, 20000000), ("Bình", 0.04, 15000000), ("Chi", 0.03, 18000000)]),
    ("c01-week-close", "Case", "Chốt doanh thu một tuần",
     ["Khóa kỳ 07–13/09/2026.", "Cộng Doanh thu trong kỳ.", "Đếm Unique mã đơn, không đếm dòng hàng.", "Ghi 2 số vào ô vàng."],
     ["Ngày", "Mã đơn", "Doanh thu"],
     [("2026-09-07", "DH01", 1200000), ("2026-09-07", "DH01", 300000), ("2026-09-08", "DH02", 900000),
      ("2026-09-10", "DH03", 1500000), ("2026-09-14", "DH04", 700000)]),
    ("b02-print-fit", "Cơ bản", "In vừa một trang giấy",
     ["Bôi vùng bảng nguồn.", "Page Layout → Print Area → Set Print Area.", "Width = 1 page.", "Ghi vùng in vào ô vàng."],
     ["Cột A", "Cột B", "Cột C", "Cột D"],
     [(i, i * 2, i * 3, i * 4) for i in range(1, 16)]),
    ("b14-split-window", "Cơ bản", "Tách cửa sổ xem nguồn và chỉ số",
     ["Chọn ô giữa vùng cần tách.", "View → Split.", "Kéo thanh tách cho vừa.", "Ghi ĐÃ TÁCH vào ô vàng."],
     ["Chỉ số", "Giá trị"],
     [("Doanh thu", 12500000), ("Số đơn", 48), ("Tồn", 320)]),
    ("t02-countif-wild", "Trung cấp", "COUNTIF đếm mã theo tiền tố",
     ['Viết =COUNTIF(dải_mã,"HN-*").', "Đổi tiền tố thử HCM-*.", "Ghi số vào ô vàng."],
     ["Mã đơn"],
     [("HN-01",), ("HN-02",), ("HCM-01",), ("HN-03",), ("DN-01",), ("HCM-02",)]),
    ("n02-lambda", "Nâng cao", "LAMBDA đặt thành hàm riêng",
     ["Formulas → Name Manager → New.", "Công thức =LAMBDA(x,y,x*y*0.03).", "Gọi =HoaHong(doanh,ty_le) trên 3 dòng."],
     ["NV", "Doanh thu", "Tỷ lệ"],
     [("An", 20000000, 0.03), ("Bình", 15000000, 0.04), ("Chi", 18000000, 0.03)]),
    ("c02-ar-match", "Case", "Đối chiếu hóa đơn và thanh toán",
     ["Hai bảng: Hóa đơn và Thanh toán.", "Khóa chung là Mã HĐ sạch.", "Thiếu = phải thu − đã thu > 0.", "Ra danh sách còn thiếu."],
     ["Mã HĐ", "Phải thu", "Đã thu"],
     [("HD01", 5000000, 5000000), ("HD02", 3000000, 1000000), ("HD03", 2500000, 0), ("HD04", 4000000, 4000000)]),
    ("b03-paste-values", "Cơ bản", "Dán chỉ giá trị, bỏ công thức",
     ["Copy cột có công thức.", "Paste Special → Values sang cột Mốc.", "F2 một ô: không còn dấu =."],
     ["SL", "Đơn giá", "Thành tiền"],
     [(2, 5000, "=A5*B5"), (3, 12000, "=A6*B6"), (1, 8000, "=A7*B7")]),
    ("b15-linked-picture", "Cơ bản", "Dán ảnh liên kết lên tờ bìa",
     ["Copy vùng chỉ số.", "Home → Paste → Linked Picture.", "Kéo ảnh xuống vùng bìa.", "Ghi ĐÃ DÁN."],
     ["KPI", "Số"],
     [("Doanh thu", 18000000), ("Đơn", 64)]),
    ("t03-textjoin", "Trung cấp", "TEXTJOIN ghép ghi chú, bỏ ô trống",
     ['=TEXTJOIN(", ",TRUE, dải_ghi_chú).', "TRUE = bỏ ô trống.", "Ghép lỗi từng đơn vào cột Ghi chú."],
     ["Đơn", "Lỗi 1", "Lỗi 2", "Lỗi 3"],
     [("DH01", "Thiếu mã", "", "Sai SL"), ("DH02", "", "Trùng", ""), ("DH03", "Sai giá", "Thiếu VAT", "")]),
    ("n03-filter-unique", "Nâng cao", "FILTER kết hợp UNIQUE",
     ['=UNIQUE(FILTER(CuaHang, TrangThai="OK")).', "Đổ ra vùng riêng, chừa chỗ spill.", "Liệt kê cửa hàng OK không trùng."],
     ["Cửa hàng", "Trạng thái"],
     [("Hà Nội", "OK"), ("Hà Nội", "OK"), ("Đà Nẵng", "Lỗi"), ("Huế", "OK"), ("Huế", "OK")]),
    ("c03-stock-gap", "Case", "Lệch tồn kho sách và kiểm kê",
     ["Lệch = sổ − kiểm kê.", "Lọc |Lệch| > 0.", "Xếp theo độ lớn, lấy 5 mã.", "Điền 5 mã lệch lớn."],
     ["Mã", "Sổ", "Kiểm kê"],
     [("A1", 100, 92), ("A2", 40, 40), ("A3", 20, 35), ("A4", 80, 70), ("A5", 15, 15), ("A6", 60, 41)]),
]

def style_header(ws, cols):
    ws["A1"] = "Anh Văn Phòng"
    ws["A1"].font = brand_font
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=max(3, cols))

def write_guide(ws, code, level, title, steps):
    style_header(ws, 3)
    ws["A2"] = title
    ws["A2"].font = title_font
    ws["A3"] = f"Mã bài: {code}  ·  Mức: {level}  ·  Sheet làm bài: LamBai"
    ws["A3"].font = body
    ws["A5"] = "Hướng dẫn chi tiết"
    ws["A5"].font = Font(name="Arial", bold=True, size=12, color=NAVY)
    for i, step in enumerate(steps, start=1):
        ws[f"A{6 + i}"] = f"{i}. {step}"
        ws[f"A{6 + i}"].font = body
        ws[f"A{6 + i}"].alignment = Alignment(wrap_text=True)
    ws.column_dimensions["A"].width = 78

def write_lab(ws, headers, rows, task):
    style_header(ws, len(headers) + 1)
    ws["A2"] = "Làm bài tại đây. Ô vàng là chỗ ghi kết quả."
    ws["A2"].font = body
    start = TABLE_HEADER_ROW
    for c, h in enumerate(headers, start=1):
        cell = ws.cell(start, c, h)
        cell.fill = head_fill
        cell.font = head_font
        cell.border = thin
    for r, row in enumerate(rows, start=DATA_START_ROW):
        for c, val in enumerate(row, start=1):
            cell = ws.cell(r, c, val)
            cell.font = body
            cell.border = thin
    ans_row = start + len(rows) + 2
    ws.cell(ans_row, 1, "Kết quả / xác nhận")
    ws.cell(ans_row, 1).font = Font(name="Arial", bold=True, color=NAVY)
    ws.cell(ans_row + 1, 1, task)
    ws.cell(ans_row + 1, 1).font = body
    cell = ws.cell(ans_row + 1, 2, "")
    cell.fill = yellow
    cell.border = thin
    for i, _ in enumerate(headers, start=1):
        ws.column_dimensions[chr(64 + i)].width = 18

def build_one(code, level, title, steps, headers, rows):
    wb = Workbook()
    g = wb.active
    g.title = "00_HuongDan"
    write_guide(g, code, level, title, steps)
    lab = wb.create_sheet("LamBai")
    write_lab(lab, headers, rows, steps[-1] if steps else "Ghi kết quả vào ô vàng.")
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{code}.xlsx"
    wb.save(path)
    print(path)

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for item in LESSONS:
        build_one(*item)

if __name__ == "__main__":
    main()
