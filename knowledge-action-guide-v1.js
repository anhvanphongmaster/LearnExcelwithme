(() => {
  'use strict';
  if (window.__AVP_KNOWLEDGE_ACTION_GUIDE_V1__) return;
  window.__AVP_KNOWLEDGE_ACTION_GUIDE_V1__ = true;

  const G = {
    'f01-excel-workspace': ['Bấm ô B2 để thấy địa chỉ B2 ở Name Box','Nhìn Formula Bar để kiểm tra nội dung thật của ô','Đổi tên Sheet thành Data / Report rồi lưu bản Working'],
    'f02-data-entry-types': ['Chọn cột Mã SP → Home → Number Format → Text trước khi nhập mã có số 0 đầu','Nhập ngày và kiểm tra Excel nhận là Date, không phải Text','Thử AutoFill một mẫu rồi kiểm tra 3 dòng đầu/cuối'],
    'f03-formatting-display': ['Chọn cột Doanh thu → Ctrl+1 → Number/Currency','Chọn cột Tăng trưởng → Percentage','Dùng Wrap Text cho tiêu đề dài; tránh Merge trong bảng dữ liệu nguồn'],
    'f04-formulas-references': ['Bấm ô D2 và nhập công thức bắt đầu bằng =','Đặt con trỏ vào tham chiếu C2 rồi nhấn F4 để chuyển $C$2','Kéo công thức xuống D4 và kiểm tra tham chiếu có chạy đúng'],
    'f05-core-functions': ['Chọn vùng Revenue → AutoSum hoặc gõ =SUM(...)','Dùng AVERAGE/MIN/MAX trên cùng vùng để so sánh','Đối chiếu COUNT/COUNTA để phát hiện ô trống hoặc dữ liệu không phải số'],
    'f06-data-table-structure': ['Đặt con trỏ trong bảng → Data → Filter','Lọc Store = HN01 rồi kiểm tra số dòng còn lại','Sort Revenue giảm dần và xác nhận cả hàng đi cùng nhau, không sort một cột riêng'],
    's07-logic': ['Ở cột Xếp loại nhập IF dựa trên Tỷ lệ','Thêm AND/OR khi có nhiều điều kiện','Cố tình tạo lỗi đầu vào rồi chỉ dùng IFERROR sau khi xác định nguyên nhân'],
    's08-conditional-aggregation': ['Chọn ô kết quả và gõ SUMIFS','Chọn đúng sum_range trước, rồi từng criteria_range/criteria','Đổi Store hoặc khoảng ngày để xác nhận kết quả thay đổi đúng'],
    's09-lookup': ['Chọn ô Target cần trả về → nhập XLOOKUP','Chọn lookup_value là Mã NV, lookup_array là cột Mã NV của Master','Kiểm tra #N/A và tìm duplicate key trước khi che lỗi'],
    's10-text': ['Chọn Raw_Code và dùng TRIM/CLEAN trước','Tách Region bằng LEFT/MID/SEARCH theo cấu trúc mã','Ghép key chuẩn rồi so sánh với dữ liệu Master trước Lookup/Merge'],
    's11-date-time': ['Bấm ô ngày và kiểm tra Format/Formula Bar để chắc là Date thật','Dùng MONTH/YEAR/EOMONTH tạo kỳ báo cáo','So sánh ngày bằng giá trị Date, không so chuỗi ngày dạng text'],
    's12-clean-control': ['Tạo bản sao trước khi làm sạch','Data → Remove Duplicates và chỉ tick cột key cần kiểm tra','Sau xử lý, đối chiếu Row Count + tổng Revenue + danh sách Exception'],
    'a13-excel-table': ['Chọn một ô trong vùng dữ liệu → Ctrl+T','Tick My table has headers và đặt Table Name','Thêm một dòng mới để kiểm tra Table tự mở rộng công thức/nguồn'],
    'a14-pivottable': ['Insert → PivotTable từ bảng nguồn','Kéo Store vào Rows, Revenue vào Values','Bấm Value Field Settings/Refresh rồi đối chiếu Grand Total với nguồn'],
    'a15-kpi-analysis': ['Chốt Grain trước: theo ngày, cửa hàng hay nhân viên','Tính Actual và Target riêng, sau đó mới tính Variance/Rate','Đối chiếu tổng KPI với dữ liệu nguồn trước khi đưa lên Dashboard'],
    'a16-charts-pareto': ['Sắp xếp Defect giảm dần','Tính % và Cum.% rồi chèn Column + Line Combo','Đặt Cum.% ở Secondary Axis và tìm điểm vượt 80%'],
    'a17-dashboard': ['Đặt KPI chính ở đầu trang, breakdown phía dưới','Gắn Slicer/Timeline vào đúng Pivot/PivotChart','Đổi filter và kiểm tra mọi KPI/chart phản ứng cùng context'],
    'a18-report-audit-handover': ['Ctrl+` hoặc Show Formulas để rà công thức','Kiểm tra Error, hidden sheet, external link và Print Area','Save As bản final, khóa vùng cần thiết và ghi version/ngày bàn giao'],
    'x19-advanced-formulas': ['Chọn một công thức dài → Formulas → Evaluate Formula','Dùng F9 để xem riêng một đoạn biểu thức khi debug','Chỉ đưa LET/SUMPRODUCT/AGGREGATE vào khi công thức rõ hơn và dễ audit hơn'],
    'x20-dynamic-array': ['Nhập FILTER/UNIQUE/SORT vào một ô trống','Đảm bảo vùng spill bên dưới/bên phải không bị chặn','Thử thay đổi nguồn và xác nhận mảng tự mở rộng/thu hẹp'],
    'x21-power-query-basics': ['Data → Get Data → chọn nguồn','Trong Power Query Editor: Promote Headers → Data Type → Trim/Clean','Home → Close & Load, sau đó sửa nguồn và bấm Refresh để kiểm tra'],
    'x22-power-query-multi-source': ['Append khi cần xếp thêm dòng; Merge khi cần ghép thêm cột theo key','Với Merge, chọn đúng key hai bảng và đúng Join Kind','Sau Combine/Merge, kiểm tra unmatched, duplicate key và tổng dòng/tổng tiền'],
    'x23-macro-vba': ['Developer → Record Macro, thực hiện một thao tác đơn giản rồi Stop','Alt+F11 mở VBA Editor và xem code vừa ghi','Lưu .xlsm, chạy lại macro trên bản copy và thêm xử lý lỗi trước khi bàn giao'],
    'x24-automation-workflow': ['Vẽ luồng Input → Transform → Calculate → Report → Validate → Deliver','Gán mỗi bước cho Formula/Pivot/PQ/VBA đúng vai trò','Tạo Control sheet: row count, error count, refresh status và version trước khi tự động hóa']
  };

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const id = () => new URLSearchParams(location.search).get('lesson') || 'f01-excel-workspace';

  function mount(){
    const section = document.querySelector('#kvSections .kv-section');
    const steps = G[id()];
    if (!section || !steps || section.querySelector('.kag-guide')) return;
    const visual = section.querySelector('.kd-visual');
    const guide = document.createElement('section');
    guide.className = 'kag-guide';
    guide.innerHTML = `<div class="kag-head"><span>NHÌN ẢNH LÀ BIẾT PHẢI LÀM GÌ</span><strong>Làm đúng theo thứ tự 1 → ${steps.length}</strong></div>
      <div class="kag-steps">${steps.map((s,i)=>`<article><em>${i+1}</em><div><b>${i===0?'BẮT ĐẦU Ở ĐÂY':i===steps.length-1?'KIỂM TRA KẾT QUẢ':'THAO TÁC TIẾP'}</b><p>${esc(s)}</p></div></article>`).join('')}</div>
      <div class="kag-note"><b>Dấu hiệu làm đúng:</b> hoàn thành từng bước rồi mới chuyển bước tiếp theo; nếu kết quả khác mô tả, quay lại kiểm tra vùng chọn, kiểu dữ liệu và nguồn.</div>`;
    if (visual) visual.insertAdjacentElement('beforebegin', guide);
    else section.appendChild(guide);
  }

  function boot(){
    mount();
    const host = document.getElementById('kvSections');
    if (host) new MutationObserver(mount).observe(host,{childList:true,subtree:false});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();