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
  const LEVELS=[
    {
      id:"basic",code:"LEVEL 01",title:"Cơ bản ứng dụng",
      description:"Nắm đúng grain, dựng cấu trúc và kiểm tra các lỗi nền tảng.",
      requirement:"Mở sẵn",duration:"45–60 phút / Case",
      caseTemplates:[
        {title:"Dựng nền dữ liệu",goal:"Chuyển yêu cầu nghiệp vụ thành một cấu trúc dữ liệu có thể kiểm tra.",tasks:["Xác định grain và khóa định danh","Chuẩn hóa trường bắt buộc và kiểu dữ liệu","Tạo kiểm tra tổng đầu vào"]},
        {title:"Kiểm tra logic cốt lõi",goal:"Phát hiện lỗi nền và chứng minh kết quả bằng đối soát.",tasks:["Thiết lập quy tắc kiểm tra","Tách bản ghi sai hoặc thiếu","Lập bảng tổng hợp ngoại lệ"]},
        {title:"Bàn giao mini",goal:"Hoàn thiện một file gọn, rõ và người khác có thể sử dụng lại.",tasks:["Tách vùng nhập và vùng kết quả","Ghi hướng dẫn sử dụng ngắn","Kiểm tra lại đầu ra cuối cùng"]}
      ]
    },
    {
      id:"intermediate",code:"LEVEL 02",title:"Trung cấp",
      description:"Kết hợp nhiều điều kiện, nhiều nguồn và kiểm tra chéo trong cùng nhiệm vụ.",
      requirement:"Hoàn thành Level 01",duration:"60–90 phút / Case",
      caseTemplates:[
        {title:"Nhiều điều kiện nghiệp vụ",goal:"Xử lý đồng thời các điều kiện có thứ tự ưu tiên rõ ràng.",tasks:["Lập bảng điều kiện","Xử lý trường hợp chồng chéo","Kiểm tra các trường hợp biên"]},
        {title:"Đối soát chéo",goal:"So sánh hai nguồn và giải thích toàn bộ chênh lệch.",tasks:["Chuẩn hóa khóa nối","Phân loại chênh lệch","Chốt control total"]},
        {title:"Báo cáo ngoại lệ",goal:"Biến dữ liệu lỗi thành danh sách hành động có mức ưu tiên.",tasks:["Xác định ngưỡng cảnh báo","Phân nhóm nguyên nhân","Tạo phần tóm tắt quản trị"]}
      ]
    },
    {
      id:"advanced",code:"LEVEL 03",title:"Nâng cao",
      description:"Mô hình hóa bài toán phức tạp, kiểm soát trường hợp biên và tối ưu khả năng vận hành.",
      requirement:"Hoàn thành Level 02",duration:"90–120 phút / Case",
      caseTemplates:[
        {title:"Mô hình hóa nghiệp vụ",goal:"Thiết kế mô hình bền vững trước khi viết công thức hoặc dựng báo cáo.",tasks:["Phân tách fact và dimension","Xác định quan hệ và grain","Kiểm chứng logic tổng hợp"]},
        {title:"Stress test & kiểm soát",goal:"Thử file với dữ liệu xấu, dữ liệu thiếu và khối lượng lớn.",tasks:["Tạo bộ trường hợp kiểm thử","Đo lỗi và thời gian xử lý","Bổ sung cơ chế fail-safe"]},
        {title:"Tối ưu và tài liệu hóa",goal:"Giảm thao tác thủ công và chuẩn hóa tài liệu bàn giao.",tasks:["Loại bước lặp không cần thiết","Chuẩn hóa refresh workflow","Viết checklist vận hành"]}
      ]
    },
    {
      id:"professional",code:"PROFESSIONAL",title:"Case thực tế",
      description:"Nhận brief lớn, tự chọn phương án và bàn giao theo rubric của Admin.",
      requirement:"Hoàn thành Level 03",duration:"2–4 giờ / Case",
      caseTemplates:[
        {title:"Nhận brief thực tế",goal:"Đọc yêu cầu chưa hoàn hảo và chủ động làm rõ phạm vi.",tasks:["Tách yêu cầu bắt buộc","Xác định giả định và rủi ro","Lập kế hoạch thực hiện"]},
        {title:"Thực thi và kiểm chứng",goal:"Xây sản phẩm hoàn chỉnh có bằng chứng đối soát.",tasks:["Thực hiện giải pháp","Kiểm tra control total","Ghi lại quyết định quan trọng"]},
        {title:"Bàn giao chuyên nghiệp",goal:"Đóng gói sản phẩm để người nhận tự vận hành và đánh giá.",tasks:["Hoàn thiện giao diện đầu ra","Tạo hướng dẫn và checklist","Nộp file để Admin review"]}
      ]
    }
  ];

  const STAGES=["domains","training","levels","cases"];
  const PROGRESS_KEY="avp_professional_case_progress_v1";
  const SUBMISSION_BUCKET="professional-track-submissions";
  let selectedDomain="input";
  let activeDomain="input";
  let selectedModule=0;
  let activeModule=0;
  let selectedLevel=0;
  let remoteReady=false;
  let adminMode=false;
  let supabase=null;
  let activeCases=[];
  const catalog=new Map();
  const submissions=new Map();

  async function client(){
    for(let i=0;i<30;i++){
      const sb=window.avpSupabase||window.supabaseClient||null;
      if(sb?.rpc)return sb;
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    return null;
  }

  function safeHref(value){
    const raw=String(value||"").trim();
    if(!raw)return "";
    try{
      const url=new URL(raw,location.href);
      if(url.protocol!=="http:"&&url.protocol!=="https:")return "";
      return raw;
    }catch(_){return ""}
  }

  function caseKey(level,index){
    return `${activeDomain}-${activeModule+1}-${level.id}-${index+1}`;
  }

  async function loadRemoteState(){
    supabase=await client();
    if(!supabase)return;
    try{
      const admin=await supabase.rpc("is_admin_user");
      adminMode=!admin.error&&admin.data===true;
    }catch(_){adminMode=false}
    try{
      const [catalogResult,progressResult]=await Promise.all([
        supabase.rpc("professional_track_catalog_v2"),
        supabase.rpc("professional_track_progress_v2")
      ]);
      if(catalogResult.error)throw catalogResult.error;
      if(progressResult.error)throw progressResult.error;
      catalog.clear();
      (Array.isArray(catalogResult.data)?catalogResult.data:[]).forEach(row=>catalog.set(String(row.case_key),row));
      submissions.clear();
      (Array.isArray(progressResult.data)?progressResult.data:[]).forEach(row=>submissions.set(String(row.case_key),row));
      remoteReady=true;
    }catch(error){
      remoteReady=false;
      console.info("[Professional Track] Chạy bằng catalog dự phòng:",error?.message||error);
    }
  }

  function progress(){
    try{return JSON.parse(localStorage.getItem(PROGRESS_KEY)||"{}")||{}}catch(_){return{}}
  }

  function levelUnlocked(index){
    if(adminMode)return true;
    if(index===0)return true;
    if(remoteReady){
      const previous=LEVELS[index-1];
      const scores=previous.caseTemplates.map((_,caseIndex)=>submissions.get(caseKey(previous,caseIndex)))
        .filter(row=>row?.status==="graded")
        .map(row=>Number(row.score)||0);
      return scores.length===previous.caseTemplates.length&&scores.every(score=>score>=7)&&scores.reduce((sum,score)=>sum+score,0)>=25;
    }
    const done=progress()?.[activeDomain]?.[String(activeModule)]?.completedLevels||[];
    return done.includes(LEVELS[index-1].id);
  }

  function scrollStage(stage){
    const top=Math.max(0,(stage?.getBoundingClientRect().top||0)+window.scrollY-92);
    window.scrollTo({top,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
  }

  function showStage(name,shouldScroll=true){
    document.querySelectorAll("[data-pro-stage]").forEach(stage=>{
      stage.hidden=stage.dataset.proStage!==name;
      stage.classList.toggle("is-current",stage.dataset.proStage===name);
    });
    const index=STAGES.indexOf(name);
    document.querySelectorAll("[data-path-step]").forEach((step,i)=>{
      step.classList.toggle("active",i===index);
      step.classList.toggle("done",i<index);
    });
    const titles={
      domains:["Chọn lĩnh vực bạn muốn luyện","Nội dung, Level và Case chỉ xuất hiện sau khi bạn chủ động chọn tầng trước đó."],
      training:[DATA[activeDomain]?.title||"Nội dung tập luyện","Chọn đúng nội dung chuyên môn bạn muốn phát triển."],
      levels:[DATA[activeDomain]?.items?.[activeModule]?.title||"Chọn Level","Đi từ nền tảng ứng dụng đến Case thực tế theo từng cấp độ."],
      cases:[LEVELS[selectedLevel]?.title||"Chọn Case","Mỗi Case có brief, đầu ra và tiêu chí chấm rõ ràng."]
    };
    $("proFlowTitle").textContent=titles[name][0];
    $("proFlowSubtitle").textContent=titles[name][1];
    if(shouldScroll)scrollStage(document.querySelector(`[data-pro-stage="${name}"]`));
  }

  function trainingCard(item,i){
    return `<article class="pro-card pro-training-card" data-roll-card data-id="${esc(activeDomain)}-${i}" data-module-index="${i}"><b>MODULE ${String(i+1).padStart(2,"0")}</b><h3>${esc(item.title)}</h3><p>${esc(item.focus)}</p><span>Chọn nội dung →</span></article>`;
  }

  function lockChip(level,index){
    if(levelUnlocked(index))return `<span class="pro-level-status ready">${index===0?"Mở sẵn":"Đã mở"}</span>`;
    return `<span class="pro-level-status locked">🔒 ${esc(level.requirement)}</span>`;
  }

  function levelCard(level,index){
    const unlocked=levelUnlocked(index);
    return `<article class="pro-card pro-level-card${unlocked?"":" locked"}" data-roll-card data-id="${esc(level.id)}" data-level-index="${index}"><b>${esc(level.code)}</b><h3>${esc(level.title)}</h3><p>${esc(level.description)}</p>${lockChip(level,index)}<span>${unlocked?"Xem 3 Case →":esc(level.requirement)}</span></article>`;
  }

  function bindRollChoice(root,onChoose){
    root.addEventListener("click",e=>{
      const card=e.target.closest("[data-roll-card]");
      if(!card||!card.classList.contains("active"))return;
      onChoose(card);
    });
    root.addEventListener("keydown",e=>{
      if(e.key!=="Enter"&&e.key!==" ")return;
      const card=root.querySelector("[data-roll-card].active");
      if(!card)return;
      e.preventDefault();onChoose(card);
    });
  }

  function openDomain(id){
    activeDomain=DATA[id]?id:"input";
    selectedModule=0;
    const domain=DATA[activeDomain];
    $("proTrainingDomainLabel").textContent=`${domain.title.toUpperCase()} · 5 NỘI DUNG`;
    $("proTrainingTitle").textContent="Chọn nội dung tập luyện";
    const mount=$("proTrainingRollMount");
    mount.innerHTML=`<div class="pro-roll pro-training-roll" data-roll="training" data-start="0" tabindex="0"><div class="pro-roll-stage">${domain.items.map(trainingCard).join("")}</div><div class="pro-roll-dots" data-roll-dots></div></div>`;
    const root=mount.querySelector("[data-roll]");
    root.addEventListener("avp:professional-roll-change",e=>{selectedModule=e.detail.index});
    window.AVPProfessionalRoll?.init(root);
    bindRollChoice(root,card=>openModule(Number(card.dataset.moduleIndex)||0));
    showStage("training");
  }

  function openModule(index){
    activeModule=Math.max(0,Math.min(index,DATA[activeDomain].items.length-1));
    selectedLevel=0;
    const module=DATA[activeDomain].items[activeModule];
    $("proLevelModuleTitle").textContent=module.title;
    const mount=$("proLevelRollMount");
    mount.innerHTML=`<div class="pro-roll pro-level-roll" data-roll="levels" data-start="0" tabindex="0"><div class="pro-roll-stage">${LEVELS.map(levelCard).join("")}</div><div class="pro-roll-dots" data-roll-dots></div></div>`;
    const root=mount.querySelector("[data-roll]");
    root.addEventListener("avp:professional-roll-change",e=>{selectedLevel=e.detail.index});
    window.AVPProfessionalRoll?.init(root);
    bindRollChoice(root,card=>openLevel(Number(card.dataset.levelIndex)||0));
    const notice=$("proFlowNotice");notice.hidden=true;notice.textContent="";
    showStage("levels");
  }

  function buildCases(level,module){
    return level.caseTemplates.map((template,index)=>{
      const id=caseKey(level,index);
      const row=catalog.get(id)||{};
      return {
        ...template,
        id,
        title:row.title||template.title,
        goal:row.goal||template.goal,
        tasks:Array.isArray(row.tasks)&&row.tasks.length?row.tasks:template.tasks,
        module:module.title,
        skills:row.skills||module.skills,
        output:row.expected_output||module.output,
        duration:row.duration||level.duration,
        score:Number(row.max_score)||10,
        sourceUrl:safeHref(row.source_url),
        guideUrl:safeHref(row.guide_url),
        published:row.published===true,
        submissionEnabled:row.submission_enabled!==false&&row.published===true,
        submission:submissions.get(id)||null
      };
    });
  }

  function caseCard(item,index){
    const state=item.submission?.status==="graded"?`Đã chấm ${Number(item.submission.score)||0}/${item.score}`:item.submission?.status==="pending"?"Đang chờ chấm":item.submission?.status==="revision"?"Cần nộp lại":item.published?"Đã phát hành":"Case mẫu";
    return `<button class="pro-case-card" type="button" data-case-index="${index}"><span>CASE ${String(index+1).padStart(2,"0")}</span><em class="pro-case-state ${esc(item.submission?.status||"")}">${esc(state)}</em><h3>${esc(item.title)}</h3><p>${esc(item.goal)}</p><div><small>${esc(item.duration)}</small><b>${item.score} điểm</b></div><strong>Xem brief →</strong></button>`;
  }

  function renderCases(levelIndex){
    selectedLevel=levelIndex;
    const level=LEVELS[levelIndex];
    const module=DATA[activeDomain].items[activeModule];
    const cases=buildCases(level,module);
    activeCases=cases;
    $("proCaseLevelLabel").textContent=`${DATA[activeDomain].title.toUpperCase()} · ${level.code}`;
    $("proCaseLevelTitle").textContent=module.title;
    const grid=$("proCaseGrid");
    grid.innerHTML=cases.map(caseCard).join("");
    grid.hidden=false;
    const brief=$("proCaseBrief");brief.hidden=true;brief.innerHTML="";
    grid.querySelectorAll("[data-case-index]").forEach(button=>{
      button.addEventListener("click",()=>openCase(cases[Number(button.dataset.caseIndex)]));
    });
  }

  function openLevel(index){
    if(!levelUnlocked(index)){
      const notice=$("proFlowNotice");
      notice.textContent=`${LEVELS[index].title} đang khóa. ${LEVELS[index].requirement} để mở cấp này.`;
      notice.hidden=false;
      return;
    }
    renderCases(index);
    showStage("cases");
  }

  function openCase(item){
    const grid=$("proCaseGrid");grid.hidden=true;
    const brief=$("proCaseBrief");
    const submission=item.submission;
    const status=submission?.status==="graded"?`Đã chấm: ${Number(submission.score)||0}/${item.score} điểm${submission.feedback?` · ${esc(submission.feedback)}`:""}`:submission?.status==="pending"?"Bài đã nộp và đang chờ Admin chấm.":submission?.status==="revision"?`Admin yêu cầu nộp lại${submission.feedback?`: ${esc(submission.feedback)}`:"."}`:"";
    const actions=item.published?`<div class="pro-case-actions">${item.sourceUrl?`<a href="${esc(item.sourceUrl)}" target="_blank" rel="noopener">↓ Tải file thực hành</a>`:""}${item.guideUrl?`<a class="secondary" href="${esc(item.guideUrl)}" target="_blank" rel="noopener">Xem hướng dẫn</a>`:""}${item.submissionEnabled?`<label class="pro-case-upload"><input type="file" data-pro-case-file accept=".xlsx,.xls,.xlsm,.csv,.zip"><span>${submission?.status==="pending"?"Thay file đã nộp":"Chọn file bài làm"}</span></label><button type="button" data-pro-case-submit>Nộp bài</button>`:""}</div>`:`<p class="pro-case-next">Case đang ở chế độ xem trước. Admin chưa phát hành file nguồn và cổng nộp bài.</p>`;
    brief.innerHTML=`<button type="button" class="pro-case-list-back" data-case-list>← Danh sách 3 Case</button><div class="pro-case-brief-head"><div><span>${esc(item.id.toUpperCase())}</span><h2>${esc(item.title)}</h2><p>${esc(item.goal)}</p></div><div><small>Thời lượng dự kiến</small><strong>${esc(item.duration)}</strong><small>Điểm tối đa</small><strong>${item.score}/10</strong></div></div><div class="pro-case-brief-body"><section><h3>Yêu cầu thực hiện</h3><ol>${item.tasks.map(task=>`<li>${esc(task)}</li>`).join("")}</ol></section><section><h3>Năng lực đánh giá</h3><p>${esc(item.skills)}</p><h3>Kết quả phải bàn giao</h3><p>${esc(item.output)}</p></section></div><div class="pro-case-rubric"><span><b>4 điểm</b> Đúng logic và số liệu</span><span><b>3 điểm</b> Có kiểm tra và đối soát</span><span><b>3 điểm</b> Trình bày, cấu trúc và bàn giao</span></div>${status?`<p class="pro-case-submission-state ${esc(submission?.status||"")}">${status}</p>`:""}${actions}`;
    brief.hidden=false;
    brief.querySelector("[data-case-list]").addEventListener("click",()=>{brief.hidden=true;grid.hidden=false;scrollStage($("proCaseSection"))});
    brief.querySelector("[data-pro-case-file]")?.addEventListener("change",event=>{
      const name=event.target.files?.[0]?.name||"Chọn file bài làm";
      const label=event.target.closest("label")?.querySelector("span");if(label)label.textContent=name;
    });
    brief.querySelector("[data-pro-case-submit]")?.addEventListener("click",()=>submitCase(item,brief));
    scrollStage($("proCaseSection"));
  }

  async function submitCase(item,brief){
    if(!supabase)return alert("Chưa kết nối được hệ thống. Hãy tải lại trang.");
    const input=brief.querySelector("[data-pro-case-file]");
    const file=input?.files?.[0];
    if(!file)return alert("Hãy chọn file bài làm trước khi nộp.");
    if(file.size>15*1024*1024)return alert("File bài làm không được vượt quá 15 MB.");
    const ext=(file.name.split(".").pop()||"").toLowerCase();
    if(!["xlsx","xls","xlsm","csv","zip"].includes(ext))return alert("Chỉ nhận XLSX, XLS, XLSM, CSV hoặc ZIP.");
    const {data:{user}}=await supabase.auth.getUser();
    if(!user)return alert("Bạn cần đăng nhập lại trước khi nộp bài.");
    const button=brief.querySelector("[data-pro-case-submit]");
    button.disabled=true;button.textContent="Đang nộp…";
    const cleanName=file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g,"-").slice(-90)||`baitap.${ext}`;
    const path=`${user.id}/${item.id}/${Date.now()}-${cleanName}`;
    const previousPath=item.submission?.file_path||"";
    try{
      const upload=await supabase.storage.from(SUBMISSION_BUCKET).upload(path,file,{upsert:false,contentType:file.type||undefined});
      if(upload.error)throw upload.error;
      const saved=await supabase.rpc("professional_track_submit_case_v2",{p_case_key:item.id,p_file_path:path,p_original_name:file.name,p_note:null});
      if(saved.error){try{await supabase.storage.from(SUBMISSION_BUCKET).remove([path])}catch(_){};throw saved.error}
      if(previousPath&&previousPath!==path){try{await supabase.storage.from(SUBMISSION_BUCKET).remove([previousPath])}catch(_){}}
      await loadRemoteState();
      const refreshed=buildCases(LEVELS[selectedLevel],DATA[activeDomain].items[activeModule]);
      activeCases=refreshed;
      renderCases(selectedLevel);
      openCase(refreshed.find(row=>row.id===item.id)||item);
    }catch(error){
      alert("Chưa nộp được bài: "+String(error?.message||error));
    }finally{
      if(button.isConnected){button.disabled=false;button.textContent="Nộp bài"}
    }
  }

  async function boot(){
    const domains=document.querySelector('[data-roll="domains"]');if(!domains)return;
    selectedDomain=domains.querySelector('[data-roll-card].active')?.dataset.id||"input";
    domains.addEventListener("avp:professional-roll-change",e=>{selectedDomain=e.detail.id||"input"});
    bindRollChoice(domains,card=>openDomain(card.dataset.id||selectedDomain));

    document.querySelectorAll("[data-pro-back]").forEach(button=>{
      button.addEventListener("click",()=>showStage(button.dataset.proBack));
    });
    showStage("domains",false);
    loadRemoteState();
  }

  window.AVPProfessionalTrackData={domains:DATA,levels:LEVELS};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>boot(),{once:true});else boot();
})();
