(() => {
  'use strict';
  if(window.__AVP_VISUAL_WALKTHROUGH_V3__)return;
  window.__AVP_VISUAL_WALKTHROUGH_V3__=true;
  const V={
    'f01-excel-workspace':['File có sheet Data / Master / Report','Bấm ô B3 → nhìn Name Box + Formula Bar','Biết chính xác mình đang ở B3 của sheet nào'],
    'f02-data-entry-types':['Mã 00125 · Ngày 01/09/2026 · SL 15','Đặt type đúng trước khi nhập / AutoFill','Mã giữ 0 đầu, ngày lọc theo tháng, SL tính được'],
    'f03-formatting-display':['12500000 · 0.085 · 01/09/2026','Home → Number / Alignment / Format Cells','12.500.000 ₫ · 8,5% · 01/09/2026 mà giá trị thật không đổi'],
    'f04-formulas-references':['SL=10 · Đơn giá=250000 · Thuế ở C2=8%','Nhập =A2*B2*(1+$C$2) rồi kéo xuống','C2 luôn cố định, A/B đổi theo từng dòng'],
    'f05-core-functions':['Doanh thu: 12,5m · 9,8m · 15,4m','SUM / AVERAGE / MIN / MAX / COUNT','Ra tổng, trung bình, min/max và số dòng đúng vùng'],
    'f06-data-table-structure':['Bảng có header kép, dòng trống, subtotal giữa data','Giữ 1 header · bỏ dòng ngắt · mỗi cột 1 loại dữ liệu','Bảng nguồn liền mạch, grain rõ, sẵn cho Filter/Pivot/PQ'],
    'd07-sort-filter':['Revenue có 500 dòng','Data → Filter → Number Filters > 10.000.000','Chỉ còn giao dịch >10m; hàng không bị lệch cột'],
    'd08-find-replace':['Store cũ “Hà Nội cũ” xuất hiện 37 lần','Ctrl+F → Find All → kiểm tra → Ctrl+H','Chỉ đúng 37 ô trong phạm vi được đổi thành HN'],
    's10-text':['Raw code = " HN–001 "','TRIM/CLEAN/SUBSTITUTE rồi tách/ghép lại','Key chuẩn = HN-001 và lookup match được'],
    'd09-data-validation':['Cột Store cần chỉ cho HN01/HN02/HCM01','Data → Data Validation → List','Người nhập chọn dropdown; giá trị ngoài danh mục bị cảnh báo'],
    's12-clean-control':['SO001 xuất hiện 2 lần, Revenue có N/A','Ghi control → xác định rule → Remove Duplicates/Go To Special','Dòng lỗi được xử lý có lý do; tổng trước/sau giải thích được'],
    's07-logic':['Actual=8,5m · Target=10m','=IF(A2>=B2,"Đạt","Chưa đạt")','Trả “Chưa đạt”; boundary 10m trả “Đạt”'],
    's08-conditional-aggregation':['Store HN01 · tháng 9 · nhiều giao dịch','SUMIFS Revenue theo Store + khoảng ngày','Ra đúng tổng HN01 tháng 9 và đối chiếu được bằng Filter'],
    's09-lookup':['Mã NV = NV002 · bảng Master có Tên/Store/Target','XLOOKUP exact match theo Mã NV','NV002 → Bình; mã thiếu hiện rõ #N/A/Unmatched'],
    's11-date-time':['Ngày giao dịch 15/09/2026','YEAR/MONTH/EOMONTH hoặc mốc DATE','Nhóm đúng tháng 9; cuối tháng trả 30/09/2026'],
    'x19-advanced-formulas':['Một công thức lặp cùng biểu thức 3 lần','Evaluate/F9 → LET đặt tên phần lặp','Công thức ngắn hơn, đọc/debug dễ hơn'],
    'x20-dynamic-array':['Danh sách Store có trùng HN01/HN02','=SORT(UNIQUE(A2:A500))','Danh sách duy nhất tự spill và tự cập nhật'],
    'a13-excel-table':['Range A1:D500 có header','Ctrl+T → My table has headers → đặt tên tblSales','Thêm dòng 501, Table tự mở rộng và công thức theo cột tự điền'],
    'a14-pivottable':['Nguồn Sales có Store/Date/Revenue/Orders','Insert → PivotTable → Rows=Store · Values=Revenue','Tổng theo Store; Grand Total khớp nguồn'],
    'a15-kpi-analysis':['Revenue=12,5m · Orders=125 · Traffic=1000','Định nghĩa grain + công thức AOV/CR/Target achievement','AOV=100k; CR=12,5%; KPI có mẫu số/đơn vị rõ'],
    'a18-report-audit-handover':['File final có query, chart, helper, external link','Refresh → control total → audit link/formula → dọn test → Save Final','Người nhận mở/refresh được và biết kiểm tra số ở đâu'],
    'a19-reconciliation':['Source 4.150 dòng · Revenue 2,35 tỷ','So row count/key count/Revenue trước và sau transform','Delta=0 hoặc có exception list giải thích từng chênh lệch'],
    'a16-charts-pareto':['Defect: Scratch 45 · Dent 30 · Stain 15 · Other 10','Sort giảm dần → cột Qty + đường Cum.%','Nhìn ngay 2 lỗi đầu chiếm ~75% và biết ưu tiên xử lý'],
    'a17-dashboard':['Nhiều KPI/chart rời rạc','Xếp KPI tổng quan → trend → breakdown → filter → exception','Người dùng biết nhìn gì trước và filter ở đâu'],
    'v23-kpi-cards':['Actual 12,5m · Target 12m','Card = Actual + variance + status màu semantic','Card cho biết 104,2% target, +0,5m, trạng thái đạt'],
    'v24-slicer-timeline':['Pivot có Date/Store','Insert Slicer(Store) + Timeline(Date) → Report Connections','Một lần chọn Store/tháng cập nhật mọi Pivot/Chart liên quan'],
    'v25-dashboard-interaction':['Dashboard có nhiều filter và chart','Khóa vùng filter, sync slicer, thêm Reset/guide','Người mới thao tác không bị mất context hoặc lọc “mù”'],
    'pq28-import-sources':['File Excel/CSV/Folder cần lấy vào báo cáo','Data → Get Data → chọn connector → Transform Data','Nguồn xuất hiện trong Power Query, chưa chỉnh tay trên sheet'],
    'x21-power-query-basics':['CSV mới mỗi ngày cùng schema','Get Data → Promote Headers → Type → Trim/Clean → Close & Load','Thay file nguồn rồi Refresh vẫn ra bảng sạch'],
    'pq30-transform-clean':['Cột Store có space, null, ký tự sai','Transform → Trim/Clean/Replace/Fill/Remove Rows','Output sạch theo rule và Applied Steps lưu lại từng bước'],
    'pq31-schema-types':['Date đang Text, Revenue có lỗi type','Set type có chủ đích → lọc Errors → kiểm tra schema','Date thành Date, Revenue thành Number; lỗi được tách ra thay vì nuốt'],
    'x22-power-query-multi-source':['12 file tháng cùng cột','Folder Combine / Append; Merge Master bằng key','Một query hợp nhất 12 file, unmatched key được kiểm tra'],
    'pq33-refresh-performance':['Query load chậm vì nhiều cột/bước nặng','SelectColumns sớm · filter sớm · staging · disable load khi cần','Refresh nhẹ hơn, output không đổi logic'],
    'x23-macro-vba':['Bạn lặp 10 click định dạng mỗi ngày','Record Macro → lưu .xlsm → chạy thử trên copy','Một nút chạy lại đúng chuỗi thao tác đã kiểm tra'],
    'vb35-object-model':['Cần ghi giá trị vào Sheet Data ô A2','ThisWorkbook.Worksheets("Data").Range("A2")','Code chỉ đúng workbook/sheet/range, không phụ thuộc ActiveSheet'],
    'vb36-control-flow':['500 dòng cần xử lý theo điều kiện','For/For Each + If + xử lý lỗi có giới hạn','Mỗi dòng đúng rule được xử lý; lỗi có log/nhánh rõ'],
    'vb37-performance-security':['Macro chậm, nhấp nháy, file khó bàn giao','Giảm Select/Activate · batch range · ScreenUpdating off/on an toàn','Macro nhanh hơn và luôn khôi phục trạng thái Excel khi kết thúc'],
    'x24-automation-workflow':['Quy trình đang copy → clean → tính → chart bằng tay','Tách Input → Transform → Calculate → Report → Validate → Deliver','Mỗi lớp có trách nhiệm rõ và có checkpoint kiểm tra'],
    'c39-tool-selection':['Bài toán: tổng theo điều kiện, gộp file, thao tác lặp','Chọn Formula/Pivot/PQ/VBA theo loại việc','Không dùng VBA cho việc SUMIFS hay dùng công thức khổng lồ để gộp 30 file'],
    'c40-sales-case':['Sales raw + target + store master','PQ clean/merge → KPI → Pivot/Dashboard → reconciliation','Dashboard Sales có Revenue/Orders/CR/Target và khớp nguồn'],
    'c41-qc-case':['QC log có defect, line, date, qty','Clean → chuẩn defect → Pivot/Pareto → exception','Biết lỗi nào chiếm nhiều nhất, line nào lệch và có danh sách cần điều tra'],
    'c42-end-to-end-case':['Nhiều file nguồn rời + yêu cầu báo cáo','Ingest → clean → model → calculate → visualize → validate → handover','Một workflow hoàn chỉnh có refresh, control, hướng dẫn và bản final']
  };
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function html(id){const v=V[id];if(!v)return '';return `<section class="lp-visual-v3" aria-label="Minh họa thao tác"><div class="lp-visual-title-v3"><span>MINH HỌA THAO TÁC</span><strong>Nhìn 3 khung này trước khi đọc chi tiết</strong></div><div class="lp-visual-flow-v3"><article><small>ĐẦU VÀO</small><b>${esc(v[0])}</b></article><i aria-hidden="true">→</i><article class="action"><small>BẠN LÀM</small><b>${esc(v[1])}</b></article><i aria-hidden="true">→</i><article class="result"><small>PHẢI THẤY</small><b>${esc(v[2])}</b></article></div><p>Đây là sơ đồ thao tác chính xác theo bài, không phải ảnh trang trí. Khi làm trong Excel, hãy đối chiếu lần lượt Đầu vào → Bạn làm → Phải thấy.</p></section>`}
  window.AVPVisualWalkthrough={html,items:V};
})();
