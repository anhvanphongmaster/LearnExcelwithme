from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Border, Side, Alignment
from openpyxl.worksheet.table import Table, TableStyleInfo
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from datetime import datetime
from pathlib import Path

OUT = Path("Chuong_1_Thuc_hanh_Nhap_mon_Excel.xlsx")
GREEN, DARK, PALE, YELLOW, LIGHT = "08794F", "12432F", "E6F5EB", "FFF0D8", "F3F8F5"
BORDER = Border(*(Side(style="thin", color="D9E5DD") for _ in range(4)))
wb = Workbook()
start = wb.active
start.title = "BatDau"

def set_title(ws, text, n):
    ws.merge_cells(start_row=1,start_column=1,end_row=1,end_column=n)
    c=ws.cell(1,1,text); c.font=Font(name="Aptos Display",size=17,bold=True,color="FFFFFF")
    c.fill=PatternFill("solid",fgColor=DARK); c.alignment=Alignment(vertical="center")
    ws.row_dimensions[1].height=34

def set_header(ws, row, values):
    for i,v in enumerate(values,1):
        c=ws.cell(row,i,v); c.font=Font(bold=True,color="FFFFFF")
        c.fill=PatternFill("solid",fgColor=GREEN); c.alignment=Alignment(horizontal="center",vertical="center",wrap_text=True); c.border=BORDER

def style(ws, r1, r2, c1, c2):
    for row in ws.iter_rows(min_row=r1,max_row=r2,min_col=c1,max_col=c2):
        for c in row:
            c.border=BORDER; c.alignment=Alignment(vertical="top",wrap_text=True)

set_title(start,"CHƯƠNG 1 — NHẬP MÔN EXCEL | HỌC ĐẾN ĐÂU, THỰC HÀNH ĐẾN ĐÓ",5)
set_header(start,3,["Bước","Bạn làm gì","Cách thực hiện","Kết quả cần đạt","Trạng thái"])
intro=[
["01","Mở bài L01","Làm theo từng bước trong sheet L01_GiaoDien, sau đó chuyển lần lượt đến L12_TongHop.","Mỗi bài đều có thao tác thực tế, vùng cần nhập và tiêu chí kiểm tra.","Chưa làm"],
["02","Dùng dữ liệu mẫu","Sheet Data_Mau chứa dữ liệu giả lập; vùng vàng là nơi cần nhập/sửa; không xóa dữ liệu mẫu nếu bài không yêu cầu.","Dùng cùng một bộ dữ liệu xuyên suốt các bài.","Chưa làm"],
["03","Tự làm trước","Đọc các bước, thao tác trực tiếp trong Excel, sau đó đối chiếu kết quả cần đạt.","Không chỉ đọc lý thuyết.","Chưa làm"],
["04","Xem đáp án sau cùng","Sheet DapAn có kết quả tham khảo. Chỉ mở sau khi tự làm.","Tự xác định bước nào chưa đúng.","Chưa làm"],
["05","Lưu bài làm","Dùng Save As để lưu thành Chuong1_NhapMonExcel_BaiLam.xlsx.","Giữ nguyên file gốc để dùng lại.","Chưa làm"],
]
for row in intro: start.append(row)
style(start,4,8,1,5)
for col,w in {"A":10,"B":24,"C":62,"D":42,"E":18}.items(): start.column_dimensions[col].width=w
start.freeze_panes="A4"

products=[
["DH001",datetime(2026,10,1),"000125","Chuột không dây",2,185000,"Mới"],
["DH002",datetime(2026,10,3),"000126","Bàn phím",1,320000,"Đang xử lý"],
["DH003",datetime(2026,10,5),"000127","Màn hình 24 inch",1,2450000,"Hoàn thành"],
["DH004",datetime(2026,10,7),"000128","Cáp HDMI",3,95000,"Mới"],
["DH005",datetime(2026,10,9),"000129","Ổ cứng SSD",2,890000,"Đang xử lý"],
["DH006",datetime(2026,10,11),"000130","USB 64 GB",4,145000,"Hoàn thành"],
["DH007",datetime(2026,10,13),"000131","Webcam",1,620000,"Mới"],
["DH008",datetime(2026,10,15),"000132","Tai nghe",2,275000,"Hoàn thành"],
]
data=wb.create_sheet("Data_Mau"); data.sheet_view.showGridLines=False
set_title(data,"DATA MẪU — ĐƠN HÀNG GIẢ LẬP",7)
set_header(data,3,["MaDon","NgayDat","MaHang","TenHang","SoLuong","DonGia","TrangThai"])
for row in products: data.append(row)
for row in data.iter_rows(min_row=4,max_row=11,min_col=1,max_col=7):
    for c in row: c.border=BORDER; c.fill=PatternFill("solid",fgColor=LIGHT); c.alignment=Alignment(vertical="center")
    row[1].number_format="dd/mm/yyyy"; row[2].number_format="@"; row[5].number_format='#,##0 "₫"'
t=Table(displayName="DonHangMau",ref="A3:G11"); t.tableStyleInfo=TableStyleInfo(name="TableStyleMedium4",showRowStripes=True); data.add_table(t)
data.freeze_panes="A4"
for i,w in enumerate([14,15,14,24,12,17,18],1): data.column_dimensions[get_column_letter(i)].width=w

dm=wb.create_sheet("DanhMuc"); dm.sheet_view.showGridLines=False
set_title(dm,"DANH MỤC HÀNG HÓA",4); set_header(dm,3,["MaHang","TenHang","NhomHang","DonViTinh"])
for row in [
["000125","Chuột không dây","Phụ kiện","Cái"],["000126","Bàn phím","Phụ kiện","Cái"],["000127","Màn hình 24 inch","Thiết bị","Cái"],
["000128","Cáp HDMI","Phụ kiện","Sợi"],["000129","Ổ cứng SSD","Linh kiện","Cái"],["000130","USB 64 GB","Lưu trữ","Cái"],
["000131","Webcam","Thiết bị","Cái"],["000132","Tai nghe","Phụ kiện","Cái"]]: dm.append(row)
for row in dm.iter_rows(min_row=4,max_row=11,min_col=1,max_col=4):
    for c in row: c.border=BORDER
    row[0].number_format="@"
t=Table(displayName="DanhMucHang",ref="A3:D11"); t.tableStyleInfo=TableStyleInfo(name="TableStyleMedium4",showRowStripes=True); dm.add_table(t)
for i,w in enumerate([14,25,18,15],1): dm.column_dimensions[get_column_letter(i)].width=w

lessons=[
("L01_GiaoDien","Bài 1 — Làm quen giao diện Excel","Xác định đúng các khu vực giao diện trước khi thao tác.",
["Mở Data_Mau, chọn ô C4.","Nhìn Name Box để đọc địa chỉ ô đang chọn.","Nhìn Formula Bar để xem nội dung thật của ô.","Chuyển qua tab Home, sau đó Data trên Ribbon.","Chuyển sang sheet DanhMuc rồi quay lại Data_Mau."],
"Chọn C4 thì Name Box phải hiện C4; Formula Bar hiển thị mã hàng của dòng đó.","Nhập địa chỉ ô đã chọn vào vùng vàng B14; ghi tên khu vực hiển thị nội dung ô vào B15."),
("L02_WorkbookSheet","Bài 2 — Workbook và Worksheet","Phân biệt file với sheet và thực hành tổ chức sheet.",
["Nhận biết Data_Mau và DanhMuc là hai Worksheet trong cùng Workbook.","Đổi tên sheet DanhMuc thành DanhMuc_Hang.","Tạo sheet mới tên GhiChu.","Di chuyển GhiChu về cuối thanh sheet.","Xóa sheet GhiChu do mình vừa tạo thử; không xóa sheet gốc."],
"Workbook là toàn bộ file; Worksheet là từng sheet. DanhMuc_Hang còn tồn tại sau khi đổi tên.","Ghi tên sheet đã đổi vào B14; ghi tên sheet thử nghiệm đã xóa vào B15."),
("L03_OVung","Bài 3 — Ô, dòng, cột và vùng dữ liệu","Đọc địa chỉ và chọn vùng chính xác.",
["Chọn C4; giải thích C là cột, 4 là dòng.","Nhập A3:G11 vào Name Box rồi nhấn Enter.","Nhập C4:C11 vào Name Box để chọn cột mã hàng.","Bấm số 5 bên trái để chọn dòng 5.","Bấm chữ F trên đầu cột để chọn cột đơn giá."],
"A3:G11 bao gồm hàng tiêu đề bảng và 8 dòng dữ liệu; C4:C11 là mã hàng.","Ghi vùng mã hàng vào B14; ghi cột đơn giá vào B15."),
("L04_ChonVung","Bài 4 — Di chuyển và chọn vùng","Luyện chọn vùng bằng chuột và Name Box.",
["Bấm A4.","Giữ Shift rồi bấm G11 để chọn vùng chữ nhật.","Nhập E4:E11 vào Name Box để chọn cột số lượng.","Chọn cả dòng 6 bằng số dòng bên trái.","Bấm một ô ngoài vùng để kết thúc lựa chọn."],
"Vùng số lượng là E4:E11; vùng trạng thái là G4:G11.","Ghi vùng số lượng vào B14; ghi vùng trạng thái vào B15."),
("L05_NhapSua","Bài 5 — Nhập, sửa và xóa nội dung ô","Nhập và sửa dữ liệu mà không làm xô lệch bảng.",
["Trong vùng vàng B14, nhập DH009.","Trong C14, nhập ngày 17/10/2026.","Trong E14, nhập số lượng 2.","Sửa E14 thành 3 bằng F2 hoặc Formula Bar.","Xóa nội dung thử trong G14 bằng Clear Contents, không dùng Delete Cells."],
"B14 có DH009; C14 là ngày; E14 bằng 3; Clear Contents làm trống G14 nhưng không xóa ô.","Nhập trạng thái DH009 vào G14; ghi cách sửa ô vào B16."),
("L06_KieuDuLieu","Bài 6 — Kiểu dữ liệu","Phân biệt Text, Number, Date và Percentage.",
["Trong B14, đặt Number Format là Text rồi nhập 000133.","Trong B15, nhập số 1250 và để dạng Number.","Trong B16, nhập 25% và xác nhận Excel hiểu đó là tỷ lệ.","Chọn một ô ngày trong Data_Mau và kiểm tra có thể đổi định dạng ngày.","Giải thích vì sao MaHang không nên dùng để tính tổng."],
"Mã 000133 giữ số 0 đầu; số lượng là Number; tỷ lệ được nhận dạng là Percentage.","Ghi kiểu phù hợp cho MaHang vào B18; kiểu phù hợp cho SoLuong vào B19."),
("L07_DinhDangSo","Bài 7 — Định dạng số, ngày và phần trăm","Đổi cách hiển thị mà không đổi giá trị gốc.",
["Chọn B4:B11 và chọn định dạng Date.","Chọn E4:E11 và định dạng Number với 0 chữ số thập phân.","Chọn F4:F11 và dùng Custom format #,##0 ₫ hoặc định dạng tiền tệ.","Nhập 0.25 vào B14 rồi chọn Percentage.","So sánh Formula Bar với cách hiển thị trong ô."],
"0.25 hiển thị thành 25% khi dùng Percentage; đơn giá vẫn là giá trị số.","Ghi định dạng phù hợp cho NgayDat vào B16; ghi định dạng cho DonGia vào B17."),
("L08_TrinhBay","Bài 8 — Định dạng và bố cục bảng","Trình bày bảng dễ đọc và không làm hỏng cấu trúc dữ liệu.",
["Chọn A3:G11.","Bật Bold cho hàng tiêu đề và chọn màu nền nhất quán.","Bật Wrap Text cho tiêu đề dài.","Dùng Home > Format > AutoFit Column Width.","Căn trái tên hàng; căn phải số lượng và đơn giá."],
"Tiêu đề dễ đọc, cột không bị cắt và không gộp ô trong vùng dữ liệu.","Ghi lệnh tự căn độ rộng cột vào B14; ghi lệnh xuống dòng trong ô vào B15."),
("L09_AutoFill","Bài 9 — Sao chép và AutoFill","Nhận biết khác nhau giữa tạo chuỗi và sao chép.",
["Nhập 1 vào B14 và 2 vào B15.","Chọn B14:B15 rồi kéo Fill Handle xuống B18.","Nhập 1 vào C14; kéo riêng C14 xuống C18.","So sánh hai cột kết quả.","Thử Paste Special > Values với một ô có công thức nếu đã biết thao tác."],
"B14:B18 tạo chuỗi 1,2,3,4,5; C14:C18 thường lặp số 1 nếu dùng Copy Cells.","Ghi B18 vào D14; ghi C18 vào D15."),
("L10_LuuFile","Bài 10 — Lưu file và định dạng","Lưu bản làm việc an toàn và chọn đúng định dạng.",
["Dùng File > Save As để lưu bản sao tên DonHang_Working.xlsx.","Không ghi đè file gốc.","XLSX phù hợp workbook thông thường; XLSM dùng khi cần giữ VBA; CSV thường chỉ lưu dữ liệu dạng văn bản của sheet hiện tại.","Nếu file có Macro, kiểm tra định dạng trước khi lưu."],
"DonHang_Working.xlsx là bản làm việc; file gốc vẫn được giữ.","Ghi định dạng cần giữ VBA vào B14; ghi lệnh lưu tên mới vào B15."),
("L11_InPDF","Bài 11 — Thiết lập trang in và PDF","Kiểm tra bản in trước khi bàn giao.",
["Chọn A3:G11 trên Data_Mau.","Mở Page Layout > Print Area > Set Print Area.","Chọn Orientation > Landscape nếu bảng rộng.","Mở File > Print để xem Print Preview.","Chỉ dùng Fit All Columns on One Page nếu chữ vẫn đủ đọc."],
"Không mất cột quan trọng; chữ đủ đọc; số trang hợp lý.","Ghi chế độ xem trước khi in vào B14; ghi hướng giấy cho bảng rộng vào B15."),
("L12_TongHop","Bài 12 — Bài thực hành tổng hợp","Tạo bản làm việc hoàn chỉnh bằng các kỹ năng đã học.",
["Save As thành DonHang_Working.xlsx.","Thêm đơn DH009 vào dòng mới trong Data_Mau hoặc bản làm việc.","Nhập ngày 17/10/2026, mã hàng 000125, tên Chuột không dây, số lượng 3, đơn giá 185000 và trạng thái Mới.","Định dạng ngày, số lượng, đơn giá; kiểm tra mã hàng giữ số 0 đầu.","Chỉnh độ rộng cột, kiểm tra Print Preview, lưu và mở lại file."],
"DH009 có đủ dữ liệu đúng kiểu; mã không mất số 0 đầu; file lưu và mở lại bình thường.","Ghi 3 bước kiểm tra trước khi bàn giao vào B14:B16.")
]
for name,ttl,goal,steps,expected,task in lessons:
    ws=wb.create_sheet(name); ws.sheet_view.showGridLines=False
    set_title(ws,ttl,5); set_header(ws,3,["Phần","Hướng dẫn từng bước","Bạn thực hiện tại đây","Kết quả cần đạt","Trạng thái"])
    rows=[["Mục tiêu",goal,"","","Chưa làm"]]
    rows += [[f"Bước {i}",step,"","", "Chưa làm"] for i,step in enumerate(steps,1)]
    rows += [["Tự kiểm tra","Chỉ chuyển sang phần đáp án sau khi đã thao tác.","",expected,"Chưa kiểm tra"],
             ["Bài tập của bạn",task,"Vùng nền vàng là nơi nhập câu trả lời; các thao tác còn lại thực hiện trên Data_Mau.","","Chưa làm"]]
    for r,row in enumerate(rows,4):
        for j,val in enumerate(row,1):
            c=ws.cell(r,j,val); c.border=BORDER; c.alignment=Alignment(vertical="top",wrap_text=True)
            if j==1: c.font=Font(bold=True,color=DARK); c.fill=PatternFill("solid",fgColor=PALE)
            if j==3: c.fill=PatternFill("solid",fgColor=YELLOW)
            if j==4: c.fill=PatternFill("solid",fgColor=LIGHT)
        ws.row_dimensions[r].height=58 if len(str(row[1]))>95 else 44
    for col,w in {"A":20,"B":65,"C":40,"D":48,"E":18}.items(): ws.column_dimensions[col].width=w
    ws.freeze_panes="A4"
    dv=DataValidation(type="list",formula1='"Chưa làm,Đang làm,Hoàn thành"',allow_blank=True)
    ws.add_data_validation(dv); dv.add(f"E4:E{ws.max_row}")

ans=wb.create_sheet("DapAn"); ans.sheet_view.showGridLines=False
set_title(ans,"ĐÁP ÁN THAM KHẢO — CHỈ MỞ SAU KHI TỰ LÀM",4)
set_header(ans,3,["Bài","Câu hỏi","Đáp án / kết quả mong đợi","Lưu ý"])
answer_rows=[
["L01","Name Box khi chọn C4","C4","Địa chỉ ô."],["L01","Khu vực hiển thị nội dung ô","Formula Bar","Hiển thị giá trị hoặc công thức."],
["L02","Tên sheet sau đổi tên","DanhMuc_Hang","Không xóa sheet gốc."],["L03","Vùng bảng dữ liệu","A3:G11","Hàng 3 là tiêu đề; dữ liệu từ hàng 4 đến 11."],
["L04","Vùng số lượng / trạng thái","E4:E11 / G4:G11","Kiểm tra địa chỉ trước khi thao tác."],["L05","DH009","DH009; ngày 17/10/2026; số lượng 3","Clear Contents không xóa ô."],
["L06","MaHang / SoLuong","Text / Number","Chọn kiểu theo mục đích."],["L07","0.25 dạng Percentage","25%","Giá trị gốc vẫn là 0.25."],
["L08","Tự căn độ rộng / xuống dòng","AutoFit Column Width / Wrap Text","Tránh Merge Cells trong vùng dữ liệu."],
["L09","Fill chuỗi / kéo một số đơn","1,2,3,4,5 / thường lặp 1","Kết quả phụ thuộc tùy chọn Fill."],
["L10","Giữ VBA / lưu bản mới","XLSM / Save As","XLSX không lưu VBA."],["L11","Xem trước / bảng rộng","Print Preview / Landscape","Đừng thu nhỏ chữ quá mức."],
["L12","DH009","DH009 | 17/10/2026 | 000125 | Chuột không dây | 3 | 185000 | Mới","Mã hàng phải giữ số 0 đầu."]
]
for row in answer_rows: ans.append(row)
style(ans,4,3+len(answer_rows),1,4)
for col,w in {"A":12,"B":34,"C":70,"D":42}.items(): ans.column_dimensions[col].width=w
ans.freeze_panes="A4"

for ws in wb.worksheets:
    ws.sheet_properties.pageSetUpPr.fitToPage=True; ws.page_setup.fitToWidth=1; ws.page_setup.fitToHeight=0
    ws.page_margins.left=.3; ws.page_margins.right=.3; ws.page_margins.top=.5; ws.page_margins.bottom=.5
    ws.sheet_properties.tabColor="C58B26" if ws.title=="DapAn" else GREEN
wb.active=0
wb.save(OUT)
