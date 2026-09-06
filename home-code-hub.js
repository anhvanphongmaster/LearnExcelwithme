(function(){
  "use strict";

  const SNIPPETS = [
    {
      id:"watchdog-inbox",lang:"Python",level:"Trung cấp",
      title:"Tự động kiểm tra file Excel mới và phân loại READY / ERROR",
      summary:"Theo dõi thư mục INBOX; file đủ cột bắt buộc được chuyển sang READY, thiếu cột hoặc lỗi sẽ vào ERROR.",
      purpose:"Tạo một cổng kiểm tra đầu vào tự động trước khi file được đưa vào quy trình tổng hợp hoặc Power Query.",
      useWhen:"Phù hợp khi nhiều người gửi file vào cùng một thư mục và bạn muốn phát hiện file sai cấu trúc ngay khi vừa xuất hiện.",
      result:"Giảm thao tác mở từng file; console báo READY hoặc danh sách cột còn thiếu.",
      requirements:["Python 3.10+","Cài: pip install watchdog openpyxl","Tạo 3 thư mục INBOX, READY, ERROR cùng cấp với file .py"],
      steps:["Lưu code thành watcher.py.","Sửa biến REQUIRED nếu tiêu đề file của bạn khác.","Mở Terminal tại thư mục chứa watcher.py và chạy: python watcher.py.","Để cửa sổ Terminal chạy; thả file .xlsx vào INBOX để kiểm tra."],
      code:String.raw`from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from openpyxl import load_workbook
import os, shutil, time

BASE = os.path.dirname(os.path.abspath(__file__))
INBOX = os.path.join(BASE, "INBOX")
READY = os.path.join(BASE, "READY")
ERROR = os.path.join(BASE, "ERROR")

REQUIRED = {"Ngày bán", "Mã đơn", "Nhân viên", "Sản phẩm", "Số lượng", "Doanh thu"}

class Watcher(FileSystemEventHandler):
    def on_created(self, event):
        if event.is_directory or not event.src_path.lower().endswith(".xlsx"):
            return
        time.sleep(1)
        try:
            wb = load_workbook(event.src_path, read_only=True, data_only=True)
            ws = wb.active
            headers = {cell.value for cell in ws[1] if cell.value}
            wb.close()

            target = READY if REQUIRED.issubset(headers) else ERROR
            shutil.move(event.src_path, os.path.join(target, os.path.basename(event.src_path)))

            print("READY" if target == READY else f"ERROR - Thiếu: {REQUIRED - headers}")
        except Exception as e:
            shutil.move(event.src_path, os.path.join(ERROR, os.path.basename(event.src_path)))
            print("ERROR:", e)

observer = Observer()
observer.schedule(Watcher(), INBOX, recursive=False)
observer.start()

print("Đang theo dõi INBOX...")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    observer.stop()

observer.join()`
    },
    {
      id:"audit-headers",lang:"Python",level:"Dễ dùng",
      title:"Audit hàng loạt file Excel: file nào thiếu / thừa cột?",
      summary:"Quét toàn bộ .xlsx trong một folder và xuất báo cáo AUDIT_HEADERS.xlsx.",
      purpose:"Kiểm tra cấu trúc nhiều file trước khi Append/Combine để tránh lỗi do header sai, thiếu hoặc thừa.",
      useWhen:"Dùng khi nhận 10–100+ file từ nhiều người nhập liệu và không muốn mở từng file để so tiêu đề.",
      result:"Một file audit ghi tên file, trạng thái, cột thiếu và cột thừa.",
      requirements:["Python 3.10+","Cài: pip install openpyxl","Đặt script cùng thư mục với các file cần kiểm tra hoặc sửa FOLDER"],
      steps:["Sửa REQUIRED theo bộ cột chuẩn.","Chạy script một lần.","Mở AUDIT_HEADERS.xlsx và lọc Status = CHECK để xử lý file lỗi."],
      code:String.raw`from openpyxl import load_workbook, Workbook
from pathlib import Path

FOLDER = Path(__file__).resolve().parent
REQUIRED = {"Ngày bán", "Mã đơn", "Nhân viên", "Sản phẩm", "Số lượng", "Doanh thu"}
OUTPUT = FOLDER / "AUDIT_HEADERS.xlsx"

rows = []

for file in FOLDER.glob("*.xlsx"):
    if file.name.startswith("~$") or file.name == OUTPUT.name:
        continue

    try:
        wb = load_workbook(file, read_only=True, data_only=True)
        ws = wb.active
        headers = {c.value for c in ws[1] if c.value not in (None, "")}
        wb.close()

        missing = sorted(REQUIRED - headers)
        extra = sorted(headers - REQUIRED)
        status = "OK" if not missing and not extra else "CHECK"
        rows.append([file.name, status, ", ".join(missing), ", ".join(extra)])
    except Exception as e:
        rows.append([file.name, "ERROR", str(e), ""])

out = Workbook()
ws = out.active
ws.title = "Audit"
ws.append(["File", "Status", "Thiếu cột", "Thừa cột"])
for row in rows:
    ws.append(row)

out.save(OUTPUT)
print(f"Đã tạo: {OUTPUT}")`
    },
    {
      id:"merge-folder",lang:"Python",level:"Trung cấp",
      title:"Gộp nhiều file Excel thành một MASTER và giữ tên file nguồn",
      summary:"Đọc tất cả file .xlsx trong folder, ghép dữ liệu và thêm cột SourceFile.",
      purpose:"Tạo master nhanh bằng Python khi bạn cần xử lý ngoài Excel hoặc muốn có quy trình tự động hóa độc lập.",
      useWhen:"Các file có cùng hoặc gần cùng cấu trúc cột và dữ liệu nằm ở sheet đầu tiên.",
      result:"MASTER.xlsx chứa toàn bộ dữ liệu; cột SourceFile giúp truy ngược dòng đến file gốc.",
      requirements:["Python 3.10+","Cài: pip install pandas openpyxl","Các file nguồn nên có header ở dòng 1"],
      steps:["Đặt script cùng folder dữ liệu.","Nếu cần sheet cụ thể, thay sheet_name=0 bằng tên sheet.","Chạy script và kiểm tra MASTER.xlsx trước khi dùng làm nguồn báo cáo."],
      code:String.raw`from pathlib import Path
import pandas as pd

FOLDER = Path(__file__).resolve().parent
OUTPUT = FOLDER / "MASTER.xlsx"
frames = []

for file in FOLDER.glob("*.xlsx"):
    if file.name.startswith("~$") or file.name == OUTPUT.name:
        continue

    df = pd.read_excel(file, sheet_name=0)
    df["SourceFile"] = file.name
    frames.append(df)

if not frames:
    raise SystemExit("Không tìm thấy file .xlsx để gộp.")

master = pd.concat(frames, ignore_index=True, sort=False)
master.to_excel(OUTPUT, index=False)
print(f"Đã gộp {len(frames)} file -> {OUTPUT.name}")`
    },
    {
      id:"backup-watcher",lang:"Python",level:"Trung cấp",
      title:"Tự động tạo bản backup mỗi khi file Excel được lưu",
      summary:"Watchdog theo dõi folder WORK và copy phiên bản mới sang BACKUP kèm timestamp.",
      purpose:"Giảm rủi ro ghi đè nhầm hoặc mất phiên bản khi đang sửa workbook quan trọng.",
      useWhen:"Hữu ích với file dashboard, master hoặc workbook khách hàng đang chỉnh sửa nhiều lần trong ngày.",
      result:"Mỗi lần file .xlsx/.xlsm thay đổi sẽ có một bản sao theo thời gian trong BACKUP.",
      requirements:["Python 3.10+","Cài: pip install watchdog","Tạo folder WORK; BACKUP sẽ được tạo tự động"],
      steps:["Lưu script ở thư mục cha của WORK.","Chạy python backup_watcher.py.","Làm việc với file bên trong WORK; backup xuất hiện sau mỗi lần lưu."],
      code:String.raw`from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from pathlib import Path
from datetime import datetime
import shutil, time

BASE = Path(__file__).resolve().parent
WORK = BASE / "WORK"
BACKUP = BASE / "BACKUP"
BACKUP.mkdir(exist_ok=True)

class BackupHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.is_directory:
            return

        src = Path(event.src_path)
        if src.suffix.lower() not in {".xlsx", ".xlsm"} or src.name.startswith("~$"):
            return

        time.sleep(0.8)
        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        target = BACKUP / f"{src.stem}_{stamp}{src.suffix}"

        try:
            shutil.copy2(src, target)
            print("BACKUP:", target.name)
        except PermissionError:
            print("Bỏ qua: file vẫn đang bị khóa", src.name)

observer = Observer()
observer.schedule(BackupHandler(), str(WORK), recursive=False)
observer.start()
print("Đang theo dõi WORK...")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    observer.stop()

observer.join()`
    },
    {
      id:"vba-split",lang:"VBA",level:"Trung cấp",
      title:"Tách một bảng thành nhiều workbook theo giá trị cột",
      summary:"Ví dụ tách Master thành từng file theo Cửa hàng, Bộ phận hoặc Nhân viên.",
      purpose:"Xuất dữ liệu riêng cho từng đơn vị mà không phải Filter → Copy → Save thủ công nhiều lần.",
      useWhen:"Bảng nguồn có header dòng 1 và một cột dùng làm khóa tách dữ liệu.",
      result:"Mỗi giá trị duy nhất tạo thành một file .xlsx trong folder SPLIT_OUTPUT.",
      requirements:["Excel Desktop có VBA","Lưu workbook chạy macro dưới dạng .xlsm","Nên chạy trên bản sao dữ liệu trước"],
      steps:["Alt + F11 → Insert → Module.","Dán code và sửa SHEET_NAME, SPLIT_COLUMN nếu cần.","Alt + F8 → chạy SplitDataToWorkbooks."],
      code:String.raw`Option Explicit

Sub SplitDataToWorkbooks()
    Const SHEET_NAME As String = "Data"
    Const SPLIT_COLUMN As Long = 2   ' B = 2

    Dim ws As Worksheet, lastRow As Long, lastCol As Long
    Dim dict As Object, c As Range, key As Variant
    Dim outPath As String, wbNew As Workbook

    Set ws = ThisWorkbook.Worksheets(SHEET_NAME)
    lastRow = ws.Cells(ws.Rows.Count, SPLIT_COLUMN).End(xlUp).Row
    lastCol = ws.Cells(1, ws.Columns.Count).End(xlToLeft).Column

    outPath = ThisWorkbook.Path & "\SPLIT_OUTPUT\"
    If Dir(outPath, vbDirectory) = "" Then MkDir outPath

    Set dict = CreateObject("Scripting.Dictionary")
    For Each c In ws.Range(ws.Cells(2, SPLIT_COLUMN), ws.Cells(lastRow, SPLIT_COLUMN))
        If Len(Trim(c.Value)) > 0 Then dict(CStr(c.Value)) = 1
    Next c

    Application.ScreenUpdating = False

    For Each key In dict.Keys
        ws.Range(ws.Cells(1, 1), ws.Cells(lastRow, lastCol)).AutoFilter _
            Field:=SPLIT_COLUMN, Criteria1:=key

        Set wbNew = Workbooks.Add(xlWBATWorksheet)
        ws.Range(ws.Cells(1, 1), ws.Cells(lastRow, lastCol)).SpecialCells(xlCellTypeVisible).Copy _
            Destination:=wbNew.Worksheets(1).Range("A1")

        wbNew.Worksheets(1).Name = "Data"
        wbNew.SaveAs outPath & CleanFileName(CStr(key)) & ".xlsx", xlOpenXMLWorkbook
        wbNew.Close False
    Next key

    If ws.AutoFilterMode Then ws.AutoFilterMode = False
    Application.ScreenUpdating = True
    MsgBox "Đã tách " & dict.Count & " file.", vbInformation
End Sub

Private Function CleanFileName(ByVal s As String) As String
    Dim bad As Variant, x As Variant
    bad = Array("\", "/", ":", "*", "?", Chr(34), "<", ">", "|")
    For Each x In bad
        s = Replace(s, x, "_")
    Next x
    CleanFileName = s
End Function`
    },
    {
      id:"vba-pdf",lang:"VBA",level:"Dễ dùng",
      title:"Xuất toàn bộ sheet thành PDF chỉ với một lần chạy",
      summary:"Mỗi worksheet được xuất thành một file PDF riêng trong folder PDF_OUTPUT.",
      purpose:"Tự động hóa quy trình in/gửi báo cáo nhiều sheet theo định kỳ.",
      useWhen:"Workbook có nhiều sheet báo cáo và bạn thường phải Save as PDF từng sheet.",
      result:"Một thư mục PDF_OUTPUT chứa PDF theo tên từng sheet.",
      requirements:["Excel Desktop có VBA","Thiết lập Print Area/Page Setup của từng sheet trước khi chạy"],
      steps:["Alt + F11 → Insert → Module.","Dán code rồi chạy ExportSheetsToPDF.","Kiểm tra PDF_OUTPUT cạnh workbook hiện tại."],
      code:String.raw`Option Explicit

Sub ExportSheetsToPDF()
    Dim ws As Worksheet
    Dim outPath As String

    If ThisWorkbook.Path = "" Then
        MsgBox "Hãy lưu workbook trước khi xuất PDF.", vbExclamation
        Exit Sub
    End If

    outPath = ThisWorkbook.Path & "\PDF_OUTPUT\"
    If Dir(outPath, vbDirectory) = "" Then MkDir outPath

    For Each ws In ThisWorkbook.Worksheets
        ws.ExportAsFixedFormat _
            Type:=xlTypePDF, _
            Filename:=outPath & CleanPdfName(ws.Name) & ".pdf", _
            Quality:=xlQualityStandard, _
            IncludeDocProperties:=True, _
            IgnorePrintAreas:=False, _
            OpenAfterPublish:=False
    Next ws

    MsgBox "Đã xuất PDF xong.", vbInformation
End Sub

Private Function CleanPdfName(ByVal s As String) As String
    Dim bad As Variant, x As Variant
    bad = Array("\", "/", ":", "*", "?", Chr(34), "<", ">", "|")
    For Each x In bad
        s = Replace(s, x, "_")
    Next x
    CleanPdfName = s
End Function`
    },
    {
      id:"vba-hardcode",lang:"VBA",level:"Dễ dùng",
      title:"Audit nhanh ô hard-code và ô công thức trong vùng dữ liệu",
      summary:"Tô vàng ô nhập giá trị trực tiếp và xanh nhạt ô có công thức để kiểm tra workbook.",
      purpose:"Tìm nhanh nơi bị gõ cứng trong một model tính toán hoặc nhận diện vùng công thức bị đứt.",
      useWhen:"Audit file người khác, kiểm tra model KPI hoặc rà một vùng lẽ ra phải chứa công thức liên tục.",
      result:"Màu hiển thị giúp nhìn ngay constants và formulas; macro không thay đổi giá trị ô.",
      requirements:["Excel Desktop có VBA","Macro thay màu nền; nên chạy trên bản sao nếu file có màu nghiệp vụ quan trọng"],
      steps:["Chọn đúng vùng cần audit.","Alt + F11 → Insert → Module → dán code.","Chạy HighlightConstantsAndFormulas; muốn hoàn tác màu hãy đóng file không lưu hoặc dùng bản sao."],
      code:String.raw`Option Explicit

Sub HighlightConstantsAndFormulas()
    Dim rng As Range
    Dim constants As Range, formulas As Range

    If TypeName(Selection) <> "Range" Then Exit Sub
    Set rng = Selection

    On Error Resume Next
    Set constants = rng.SpecialCells(xlCellTypeConstants)
    Set formulas = rng.SpecialCells(xlCellTypeFormulas)
    On Error GoTo 0

    If Not constants Is Nothing Then
        constants.Interior.Color = RGB(255, 235, 156)
    End If

    If Not formulas Is Nothing Then
        formulas.Interior.Color = RGB(198, 239, 206)
    End If

    MsgBox "Vàng = hard-code | Xanh = công thức", vbInformation
End Sub`
    },
    {
      id:"pq-combine",lang:"Power Query",level:"Trung cấp",
      title:"Combine Folder động và tự thêm tên file nguồn",
      summary:"Gộp tất cả sheet Excel trong folder; Table.Combine tự căn cột theo tên.",
      purpose:"Tạo một query tổng hợp dễ kiểm soát mà vẫn giữ SourceFile để truy lỗi về file gốc.",
      useWhen:"Dữ liệu lặp theo tháng/người nhập liệu và các file nằm chung một folder.",
      result:"Một bảng duy nhất gồm dữ liệu của các file .xlsx, bỏ file tạm ~$ và giữ tên file nguồn.",
      requirements:["Excel có Power Query","Thay C:\\DATA bằng đường dẫn folder thật","Header của mỗi sheet nằm ở dòng đầu"],
      steps:["Data → Get Data → From Other Sources → Blank Query.","Advanced Editor → thay toàn bộ bằng code bên dưới.","Sửa đường dẫn C:\\DATA rồi Done; kiểm tra kiểu dữ liệu trước khi Load."],
      code:String.raw`let
    Source = Folder.Files("C:\DATA"),
    ExcelFiles = Table.SelectRows(
        Source,
        each [Extension] = ".xlsx" and not Text.StartsWith([Name], "~$")
    ),
    AddWorkbook = Table.AddColumn(
        ExcelFiles,
        "Workbook",
        each Excel.Workbook([Content], false)
    ),
    ExpandWorkbook = Table.ExpandTableColumn(
        AddWorkbook,
        "Workbook",
        {"Name", "Data", "Kind", "Hidden"},
        {"Sheet", "Data", "Kind", "Hidden"}
    ),
    KeepSheets = Table.SelectRows(
        ExpandWorkbook,
        each [Kind] = "Sheet" and [Hidden] <> true
    ),
    PromoteHeaders = Table.AddColumn(
        KeepSheets,
        "Clean",
        each Table.PromoteHeaders([Data], [PromoteAllScalars=true])
    ),
    AddSourceFile = Table.AddColumn(
        PromoteHeaders,
        "WithSource",
        each let fileName = [Name]
        in Table.AddColumn([Clean], "SourceFile", each fileName, type text)
    ),
    Combined = Table.Combine(AddSourceFile[WithSource])
in
    Combined`
    },
    {
      id:"pq-header-audit",lang:"Power Query",level:"Nâng cao",
      title:"Power Query audit Header: liệt kê file đang thiếu cột chuẩn",
      summary:"Không Combine ngay; tạo bảng kiểm tra file nào thiếu tiêu đề bắt buộc.",
      purpose:"Phát hiện lỗi schema trước khi Append để tránh mất dữ liệu âm thầm hoặc sinh cột lệch.",
      useWhen:"Folder có nhiều workbook do nhiều người tạo và bạn muốn có bước Quality Gate trước query tổng.",
      result:"Bảng File / MissingColumns / Status; chỉ Status = OK mới nên đi tiếp vào luồng Combine.",
      requirements:["Excel có Power Query","Sửa đường dẫn và danh sách Required","Mỗi file dùng sheet đầu tiên làm nguồn"],
      steps:["Tạo Blank Query → Advanced Editor.","Sửa Required và C:\\DATA.","Load bảng audit hoặc dùng query này làm bước kiểm tra trước Master Query."],
      code:String.raw`let
    Required = {"Ngày bán", "Mã đơn", "Nhân viên", "Sản phẩm", "Số lượng", "Doanh thu"},
    Source = Folder.Files("C:\DATA"),
    ExcelFiles = Table.SelectRows(
        Source,
        each [Extension] = ".xlsx" and not Text.StartsWith([Name], "~$")
    ),
    AddHeaders = Table.AddColumn(
        ExcelFiles,
        "Headers",
        each
            let
                wb = Excel.Workbook([Content], false),
                firstSheet = Table.SelectRows(wb, each [Kind] = "Sheet"){0}[Data],
                promoted = Table.PromoteHeaders(firstSheet, [PromoteAllScalars=true])
            in
                Table.ColumnNames(promoted)
    ),
    AddMissing = Table.AddColumn(
        AddHeaders,
        "MissingColumns",
        each List.Difference(Required, [Headers])
    ),
    AddStatus = Table.AddColumn(
        AddMissing,
        "Status",
        each if List.Count([MissingColumns]) = 0 then "OK" else "CHECK"
    ),
    Result = Table.SelectColumns(AddStatus, {"Name", "MissingColumns", "Status"})
in
    Result`
    },
    {
      id:"pq-quality-profile",lang:"Power Query",level:"Trung cấp",
      title:"Tạo bảng Quality Profile: Null, Error và số giá trị duy nhất theo cột",
      summary:"Sinh báo cáo nhanh chất lượng dữ liệu từ một bảng/query đã có.",
      purpose:"Biết cột nào đang nhiều null, error hoặc có cardinality bất thường trước khi làm Dashboard/Model.",
      useWhen:"Sau bước làm sạch nhưng trước khi Load, hoặc khi cần audit nguồn dữ liệu mới.",
      result:"Mỗi dòng là một cột của dữ liệu nguồn kèm TotalRows, NullCount, ErrorCount, DistinctCount.",
      requirements:["Đã có một query nguồn tên DataSource","Có thể đổi DataSource thành tên query thực tế của bạn"],
      steps:["Tạo Blank Query mới.","Đổi DataSource ở dòng đầu thành query cần kiểm tra.","Load kết quả thành sheet audit hoặc chỉ giữ Connection."],
      code:String.raw`let
    Source = DataSource,
    Columns = Table.ColumnNames(Source),
    TotalRows = Table.RowCount(Source),
    Profile = Table.FromRecords(
        List.Transform(
            Columns,
            (col) =>
                let
                    values = Table.Column(Source, col),
                    nulls = List.Count(List.Select(values, each _ = null)),
                    errors = List.Count(List.Select(List.Transform(values, each try _), each [HasError])),
                    cleanValues = List.RemoveNulls(
                        List.Transform(values, each try _ otherwise null)
                    ),
                    distincts = List.Count(List.Distinct(cleanValues))
                in
                    [
                        Column = col,
                        TotalRows = TotalRows,
                        NullCount = nulls,
                        ErrorCount = errors,
                        DistinctCount = distincts
                    ]
        )
    )
in
    Profile`
    }
  ];

  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value == null ? "" : value)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

  let lang = "all";
  let query = "";

  function filtered(){
    const q = query.trim().toLowerCase();
    return SNIPPETS.filter(item => {
      if(lang !== "all" && item.lang !== lang) return false;
      if(!q) return true;
      return [item.title,item.summary,item.purpose,item.useWhen,item.lang,item.level]
        .join(" ").toLowerCase().includes(q);
    });
  }

  function render(){
    const list = $("avpCodeHubList");
    const count = $("avpCodeHubCount");
    if(!list) return;
    const rows = filtered();
    if(count) count.textContent = rows.length + "/" + SNIPPETS.length + " code";

    if(!rows.length){
      list.innerHTML = '<div class="avp-codehub-empty">Không tìm thấy code phù hợp. Thử từ khóa khác hoặc chọn “Tất cả”.</div>';
      return;
    }

    list.innerHTML = rows.map((item) => {
      const idx = SNIPPETS.findIndex(x => x.id === item.id) + 1;
      return `<details class="avp-codecard" data-id="${esc(item.id)}" ${idx===1 && !query && lang==="all" ? "open" : ""}>
        <summary>
          <span class="avp-codecard-no">${String(idx).padStart(2,"0")}</span>
          <span class="avp-codecard-title"><strong>${esc(item.title)}</strong><small>${esc(item.summary)}</small></span>
          <span class="avp-codecard-tags"><span class="avp-code-tag">${esc(item.lang)}</span><span class="avp-code-tag level">${esc(item.level)}</span></span>
        </summary>
        <div class="avp-codecard-body">
          <div class="avp-code-info-grid">
            <div class="avp-code-info"><b>Mục đích</b><p>${esc(item.purpose)}</p></div>
            <div class="avp-code-info"><b>Khi nào dùng</b><p>${esc(item.useWhen)}</p></div>
            <div class="avp-code-info"><b>Kết quả</b><p>${esc(item.result)}</p></div>
          </div>
          <div class="avp-code-setup">
            <div class="avp-code-setup-box"><h4>Chuẩn bị</h4><ul>${item.requirements.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
            <div class="avp-code-setup-box"><h4>Cách dùng</h4><ol>${item.steps.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div>
          </div>
          <div class="avp-code-block">
            <div class="avp-code-block-head"><span>${esc(item.lang)} · ${esc(item.title)}</span><button type="button" class="avp-code-copy" data-copy-id="${esc(item.id)}">Copy code</button></div>
            <pre><code>${esc(item.code)}</code></pre>
          </div>
          <div class="avp-codehub-note">Nên thử trên file/bản sao dữ liệu trước khi đưa vào quy trình thật. Với VBA, macro có thể thay đổi workbook; với Python/Power Query, hãy kiểm tra lại đường dẫn và tên cột trước khi chạy.</div>
        </div>
      </details>`;
    }).join("");
  }

  function openHub(){
    const modal = $("avpCodeHubModal");
    if(!modal) return;
    modal.hidden = false;
    document.body.classList.add("avp-codehub-lock");
    requestAnimationFrame(() => $("avpCodeHubSearch")?.focus({preventScroll:true}));
    if(window.avpAnalytics) window.avpAnalytics.track("code_hub_open",{page:"index.html",tool:"Excel Code Hub"});
  }

  function closeHub(){
    const modal = $("avpCodeHubModal");
    if(!modal) return;
    modal.hidden = true;
    document.body.classList.remove("avp-codehub-lock");
    $("homeCodeHubOpen")?.focus({preventScroll:true});
  }

  async function copyCode(id, button){
    const item = SNIPPETS.find(x => x.id === id);
    if(!item) return;
    let ok = false;
    try{
      await navigator.clipboard.writeText(item.code);
      ok = true;
    }catch(_){
      const ta = document.createElement("textarea");
      ta.value = item.code;ta.setAttribute("readonly","");ta.style.position="fixed";ta.style.opacity="0";
      document.body.appendChild(ta);ta.select();
      try{ ok = document.execCommand("copy"); }catch(__){}
      ta.remove();
    }
    if(button){
      const old = button.textContent;
      button.textContent = ok ? "Đã copy ✓" : "Copy lỗi";
      button.classList.toggle("is-copied",ok);
      setTimeout(()=>{button.textContent=old;button.classList.remove("is-copied");},1600);
    }
    if(ok && window.avpAnalytics) window.avpAnalytics.track("code_hub_copy",{page:"index.html",tool:item.title.slice(0,80)});
  }

  function init(){
    const launcher = $("homeCodeHubOpen");
    const modal = $("avpCodeHubModal");
    if(!launcher || !modal) return;
    render();
    launcher.addEventListener("click",openHub);
    $("avpCodeHubClose")?.addEventListener("click",closeHub);
    modal.querySelector(".avp-codehub-backdrop")?.addEventListener("click",closeHub);
    $("avpCodeHubSearch")?.addEventListener("input",e=>{query=e.target.value||"";render();});
    modal.querySelectorAll("[data-code-filter]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        lang=btn.dataset.codeFilter||"all";
        modal.querySelectorAll("[data-code-filter]").forEach(b=>b.classList.toggle("is-active",b===btn));
        render();
      });
    });
    modal.addEventListener("click",e=>{
      const btn=e.target.closest("[data-copy-id]");
      if(btn) copyCode(btn.dataset.copyId,btn);
    });
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.hidden)closeHub();});
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
