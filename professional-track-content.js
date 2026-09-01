(()=>{
  "use strict";
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const DATA={
    input:{title:"Nhập liệu & Data Quality",items:[
      {title:"Thiết kế cấu trúc nhập liệu",focus:"Chuẩn hóa cột, kiểu dữ liệu, khóa định danh và quy tắc bắt buộc.",skills:"Data structure · Data type · Unique key",output:"Template nhập liệu có quy tắc rõ ràng và sẵn sàng tổng hợp."},
      {title:"Validation & kiểm soát đầu vào",focus:"Giới hạn giá trị, danh mục chọn, ngày hợp lệ và cảnh báo nhập sai.",skills:"Data Validation · Conditional Formatting",output:"Form nhập liệu ngăn lỗi ngay tại thời điểm phát sinh."},
      {title:"Phát hiện dữ liệu bất thường",focus:"Tìm trống, trùng, sai kiểu, ngoại lệ và giá trị vượt ngưỡng.",skills:"Audit rules · Duplicate · Exception",output:"Danh sách lỗi có mức độ ưu tiên và nguyên nhân xác định."},
      {title:"Chuẩn hóa Master Data",focus:"Đồng nhất mã, tên, danh mục và quan hệ giữa dữ liệu giao dịch với danh mục chuẩn.",skills:"Mapping · Lookup · Reconciliation",output:"Master Data sạch, không lệch mã và không tạo nhóm giả."},
      {title:"Audit trail & bàn giao",focus:"Theo dõi thay đổi, kiểm tra tổng và thiết lập hướng dẫn vận hành file.",skills:"Control total · Change log · Handover",output:"File có thể kiểm tra lại và bàn giao cho người khác sử dụng."}
    ]},
    sales:{title:"Sales & Commercial",items:[
      {title:"Sales Data Model",focus:"Xác định grain, đơn hàng, dòng hàng, cửa hàng, nhân viên và sản phẩm.",skills:"Grain · Order key · Dimension",output:"Mô hình dữ liệu bán hàng không trùng doanh thu và số đơn."},
      {title:"Order & Revenue Control",focus:"Kiểm tra doanh thu, số lượng, chiết khấu, hoàn trả và trạng thái đơn.",skills:"Revenue logic · Returns · Reconcile",output:"Bảng bán hàng đã đối soát và giải thích được sai lệch."},
      {title:"Sales KPI Analysis",focus:"Phân tích Revenue, Orders, QTY, AOV và mức đóng góp theo chiều dữ liệu.",skills:"KPI definition · Mix · Variance",output:"Báo cáo KPI đúng grain và không cộng trùng."},
      {title:"Target vs Actual",focus:"Phân bổ mục tiêu và đánh giá thực đạt theo thời gian, cửa hàng, nhân viên.",skills:"Target allocation · Achievement · Gap",output:"Bảng hiệu suất có Target, Actual, Gap và tỷ lệ hoàn thành."},
      {title:"Traffic, Conversion & Handover",focus:"Kết nối traffic với doanh số, đọc funnel và hoàn thiện báo cáo quản trị.",skills:"Traffic · CR · Funnel · Storytelling",output:"Báo cáo Sales hoàn chỉnh, có kiểm chứng và hướng dẫn sử dụng."}
    ]},
    hr:{title:"Human Resources",items:[
      {title:"Employee Master Control",focus:"Chuẩn hóa mã nhân viên, bộ phận, chức danh và trạng thái làm việc.",skills:"Employee key · Mapping · Effective date",output:"Danh mục nhân sự nhất quán và theo dõi được biến động."},
      {title:"Attendance & Shift",focus:"Kiểm soát ngày công, ca làm, đi muộn, nghỉ và dữ liệu máy chấm công.",skills:"Shift logic · Attendance · Exception",output:"Bảng công có thể đối chiếu đến từng nhân viên và từng ngày."},
      {title:"Overtime & Payroll Inputs",focus:"Tính OT theo điều kiện và chuẩn bị dữ liệu đầu vào cho bảng lương.",skills:"OT rules · Allowance · Reconcile",output:"Bảng tổng hợp OT và phụ cấp có dấu vết kiểm tra."},
      {title:"Headcount & Turnover",focus:"Theo dõi đầu kỳ, tuyển mới, nghỉ việc và biến động nhân sự.",skills:"Headcount · Joiner · Leaver · Turnover",output:"Báo cáo biến động nhân sự đúng thời điểm hiệu lực."},
      {title:"Workforce Performance",focus:"Kết hợp lịch làm, năng suất và KPI để đánh giá nguồn lực.",skills:"Productivity · KPI · Capacity",output:"Báo cáo hiệu suất nhân sự có ngữ cảnh vận hành."}
    ]},
    inventory:{title:"Inventory & Warehouse",items:[
      {title:"Inventory Movement",focus:"Chuẩn hóa nhập, xuất, chuyển kho, điều chỉnh và mã giao dịch.",skills:"Movement type · SKU · Warehouse",output:"Sổ vận động tồn kho theo đúng trình tự nghiệp vụ."},
      {title:"Stock Reconciliation",focus:"Đối chiếu tồn đầu, nhập, xuất, tồn cuối và kiểm kê thực tế.",skills:"Opening · Movement · Closing · Count",output:"Bảng reconciliation chỉ rõ chênh lệch và nguồn phát sinh."},
      {title:"Aging & Slow-moving",focus:"Phân nhóm tuổi tồn kho và nhận diện hàng chậm luân chuyển.",skills:"Aging bucket · Turnover · Days on hand",output:"Danh sách tồn rủi ro theo giá trị và thời gian lưu kho."},
      {title:"Replenishment Control",focus:"Đánh giá mức tồn, nhu cầu, lead time và điểm đặt hàng.",skills:"Min-max · Lead time · Reorder",output:"Đề xuất bổ sung hàng có điều kiện và mức ưu tiên."},
      {title:"Warehouse Performance",focus:"Theo dõi độ chính xác tồn, tốc độ xử lý và vấn đề vận hành.",skills:"Accuracy · SLA · Productivity",output:"Dashboard kho có KPI, cảnh báo và khả năng truy vết."}
    ]},
    qc:{title:"Quality Control",items:[
      {title:"Inspection Data Structure",focus:"Thiết kế dữ liệu kiểm tra theo lot, model, công đoạn, ca và người kiểm.",skills:"Lot key · Sampling · Traceability",output:"Dataset QC đủ grain để phân tích và truy vết."},
      {title:"Yield & Defect Rate",focus:"Tính Input, OK, NG, yield và tỷ lệ lỗi đúng mẫu số.",skills:"Yield · Defect rate · Reconcile",output:"Báo cáo chất lượng không sai mẫu số và không cộng trùng."},
      {title:"Pareto & Root Cause",focus:"Xếp hạng lỗi, đọc Pareto và phân tầng nguyên nhân.",skills:"Pareto · Contribution · Stratification",output:"Danh sách lỗi trọng yếu phục vụ điều tra nguyên nhân."},
      {title:"Lot & Shift Control",focus:"So sánh lot, line, ca, máy và thời điểm để phát hiện bất thường.",skills:"Trend · Shift · Lot comparison",output:"Cảnh báo chất lượng gắn đúng phạm vi ảnh hưởng."},
      {title:"CAPA & Quality Report",focus:"Theo dõi hành động khắc phục, hiệu lực và báo cáo quản trị.",skills:"CAPA · Owner · Due date · Effectiveness",output:"Báo cáo QC liên kết vấn đề, hành động và kết quả."}
    ]},
    pq:{title:"Power Query Workflow",items:[
      {title:"Import & Data Types",focus:"Kết nối nguồn, kiểm soát header, kiểu dữ liệu và lỗi chuyển đổi.",skills:"Source · Type · Error handling",output:"Query đầu vào ổn định và có thể kiểm tra lỗi."},
      {title:"Folder Combine",focus:"Gộp nhiều file có cùng cấu trúc và kiểm soát file ngoại lệ.",skills:"Folder · Sample file · Combine",output:"Luồng tổng hợp tự nhận file mới khi refresh."},
      {title:"Append, Merge & Mapping",focus:"Chọn đúng phép ghép, khóa nối và xử lý bản ghi không khớp.",skills:"Append · Join · Key · Mapping",output:"Master dataset liên kết đúng và không nhân bản dòng."},
      {title:"Reusable Transformations",focus:"Tạo tham số, function và bước biến đổi có thể tái sử dụng.",skills:"Parameter · Function · Modular query",output:"Bộ query gọn, dễ bảo trì và dùng lại cho kỳ tiếp theo."},
      {title:"Refresh & Control",focus:"Kiểm soát thứ tự phụ thuộc, refresh, lỗi nguồn và bàn giao.",skills:"Dependency · Refresh · Audit",output:"Quy trình Power Query vận hành ổn định và có log kiểm tra."}
    ]},
    dashboard:{title:"Reporting & Dashboard",items:[
      {title:"KPI & Grain Definition",focus:"Chốt câu hỏi quản trị, công thức KPI và cấp độ chi tiết.",skills:"KPI dictionary · Grain · Scope",output:"Bộ định nghĩa KPI thống nhất trước khi dựng báo cáo."},
      {title:"Pivot Analysis Model",focus:"Tổ chức dữ liệu, PivotTable và cấu trúc phân tích đa chiều.",skills:"Pivot · Dimension · Measure",output:"Mô hình phân tích có thể kiểm tra từ tổng xuống chi tiết."},
      {title:"Dashboard Layout",focus:"Sắp xếp KPI, biểu đồ và vùng đọc theo thứ tự ra quyết định.",skills:"Hierarchy · Layout · Visual choice",output:"Dashboard rõ trọng tâm và không lạm dụng biểu đồ."},
      {title:"Filters & Interaction",focus:"Thiết kế slicer, timeline và bộ lọc không làm sai ngữ cảnh KPI.",skills:"Slicer · Timeline · Filter context",output:"Bộ lọc nhất quán trên toàn bộ báo cáo."},
      {title:"Reconciliation & Handover",focus:"Đối chiếu nguồn, kiểm thử trường hợp biên và hướng dẫn refresh.",skills:"QA · Control total · Documentation",output:"Dashboard có thể bàn giao và người dùng tự vận hành."}
    ]},
    automation:{title:"Automation & Control",items:[
      {title:"Process Mapping",focus:"Tách quy trình lặp thành đầu vào, bước xử lý, kiểm soát và đầu ra.",skills:"Workflow · Trigger · Dependency",output:"Sơ đồ tự động hóa có phạm vi và điều kiện rõ ràng."},
      {title:"Formula-based Automation",focus:"Thiết kế công thức bền vững, vùng động và kiểm soát lỗi.",skills:"Dynamic range · Error handling · Audit",output:"File tự cập nhật mà không tạo liên kết mong manh."},
      {title:"Refresh Workflow",focus:"Kết hợp nguồn dữ liệu, Power Query, Pivot và báo cáo theo chuỗi refresh.",skills:"Refresh order · Dependency · Status",output:"Quy trình cập nhật một chiều, có trạng thái thành công hoặc lỗi."},
      {title:"Alerts & Exception Control",focus:"Tạo cảnh báo theo ngưỡng, hạn xử lý và trạng thái bất thường.",skills:"Threshold · Exception · Escalation",output:"Danh sách cảnh báo có người chịu trách nhiệm và ưu tiên."},
      {title:"Protected Delivery",focus:"Khóa vùng tính, tách input/output và chuẩn hóa tài liệu bàn giao.",skills:"Protection · Version · Handover",output:"Công cụ tự động an toàn cho người dùng cuối."}
    ]}
  };
  let activeDomain="input";

  function card(item,i){
    return `<article class="pro-card pro-training-card" data-roll-card data-id="${esc(activeDomain)}-${i}" data-module-index="${i}"><b>MODULE ${String(i+1).padStart(2,"0")}</b><h3>${esc(item.title)}</h3><p>${esc(item.focus)}</p><span>Kết quả: ${esc(item.output)}</span></article>`;
  }
  function detail(item,index){
    const host=$("proTrainingDetail");if(!host||!item)return;
    host.innerHTML=`<div><span>MODULE ${String(index+1).padStart(2,"0")}</span><h3>${esc(item.title)}</h3><p>${esc(item.focus)}</p></div><dl><div><dt>Năng lực rèn luyện</dt><dd>${esc(item.skills)}</dd></div><div><dt>Kết quả đầu ra</dt><dd>${esc(item.output)}</dd></div></dl>`;
  }
  function renderDomain(id){
    const domain=DATA[id]||DATA.input;activeDomain=DATA[id]?id:"input";
    $("proTrainingTitle").textContent=domain.title;
    const mount=$("proTrainingRollMount");if(!mount)return;
    mount.querySelector('[data-roll]')?._avpRoll?.resizeObserver?.disconnect();
    mount.innerHTML=`<div class="pro-roll pro-training-roll" data-roll="training" data-start="0" tabindex="0"><div class="pro-roll-stage">${domain.items.map(card).join("")}</div><div class="pro-roll-dots" data-roll-dots></div></div>`;
    const root=mount.querySelector("[data-roll]");
    root.addEventListener("avp:professional-roll-change",e=>detail(domain.items[e.detail.index],e.detail.index));
    window.AVPProfessionalRoll?.init(root);detail(domain.items[0],0);
  }
  function boot(){
    const domains=document.querySelector('[data-roll="domains"]');if(!domains)return;
    domains.addEventListener("avp:professional-roll-change",e=>renderDomain(e.detail.id||"input"));
    renderDomain(domains.querySelector('[data-roll-card].active')?.dataset.id||"input");
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
