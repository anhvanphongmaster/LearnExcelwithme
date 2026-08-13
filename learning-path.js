(() => {
  const KEY = "avpLearningPath30";
  const START_KEY = "avpLearningPathLastVisit";

  const plan = [
  {d:1,w:1,t:"Làm quen Excel",desc:"Bắt đầu từ Workbook, Worksheet, Cell, Row và Column.",href:"excel.html",action:"Học bài",tag:"Nền tảng"},
  {d:2,w:1,t:"Nhập & trình bày dữ liệu",desc:"Học cách tổ chức dữ liệu trước khi đi vào công thức và phân tích.",href:"excel.html",action:"Học bài",tag:"Nền tảng"},
  {d:3,w:1,t:"Phím tắt nền tảng",desc:"Luyện các phím tắt dùng hằng ngày để thao tác nhanh hơn.",href:"phimtatexcel.html",action:"Luyện phím tắt",tag:"Tốc độ"},
  {d:4,w:1,t:"IF – phân loại OK/NG",desc:"Học IF rồi áp dụng ngay cho bài toán phân loại OK/NG.",href:"baitapexcel.html",action:"Làm bài IF",tag:"Công thức"},
  {d:5,w:1,t:"COUNTIF & SUMIF",desc:"Tìm đúng công thức đếm/tính tổng theo điều kiện và xem cú pháp.",href:"formula-finder.html",action:"Tìm công thức",tag:"Công thức"},
  {d:6,w:1,t:"Bài tập NG Rate & IF",desc:"Làm bài tập có dữ liệu thực tế thay vì chỉ đọc lý thuyết.",href:"baitapexcel.html",action:"Làm bài tập",tag:"Thực hành"},
  {d:7,w:1,t:"Excel Challenge tuần 1",desc:"Làm Excel Challenge để kiểm tra nhanh kiến thức nền tảng và tích điểm.",href:"formula-finder.html#excelChallenge",action:"Làm Challenge",tag:"Ôn tập"},
  {d:8,w:2,t:"VLOOKUP trong công việc",desc:"Tra cứu dữ liệu theo mã và hiểu cách dùng trong bảng thực tế.",href:"congthucexcel.html",action:"Xem công thức",tag:"Tra cứu"},
  {d:9,w:2,t:"XLOOKUP",desc:"Dùng Formula Finder để tìm XLOOKUP và thử Formula Tester.",href:"formula-finder.html",action:"Thử XLOOKUP",tag:"Tra cứu"},
  {d:10,w:2,t:"COUNTIFS",desc:"Tạo công thức đếm nhiều điều kiện trực tiếp bằng Formula Finder.",href:"formula-finder.html",action:"Tạo COUNTIFS",tag:"Công thức"},
  {d:11,w:2,t:"SUMIFS",desc:"Tạo công thức tính tổng nhiều điều kiện và thay dữ liệu mẫu của bạn.",href:"formula-finder.html",action:"Tạo SUMIFS",tag:"Công thức"},
  {d:12,w:2,t:"FILTER & lọc dữ liệu",desc:"Học Filter thực tế trên bảng dữ liệu trước khi dùng các kỹ thuật lọc nâng cao.",href:"filtersort.html",action:"Học Filter",tag:"Dữ liệu"},
  {d:13,w:2,t:"TEXTJOIN & xử lý Text",desc:"Tra cứu TEXTJOIN trong thư viện công thức và xem cách ghép chuỗi.",href:"congthucexcel.html",action:"Tra TEXTJOIN",tag:"Xử lý text"},
  {d:14,w:2,t:"Challenge công thức",desc:"Kiểm tra IF, tra cứu, hàm điều kiện và xử lý Text bằng Excel Challenge.",href:"formula-finder.html#excelChallenge",action:"Làm Challenge",tag:"Kiểm tra"},
  {d:15,w:3,t:"Filter & Sort thực tế",desc:"Lọc nhiều điều kiện và sắp xếp dữ liệu sản xuất.",href:"filtersort.html",action:"Thực hành Filter/Sort",tag:"Dữ liệu"},
  {d:16,w:3,t:"Pivot Table cơ bản",desc:"Học đúng quy trình tạo Pivot Table và 4 vùng Rows/Columns/Values/Filters.",href:"pivottable.html",action:"Học Pivot",tag:"Phân tích"},
  {d:17,w:3,t:"Pivot phân tích NG",desc:"Xem ví dụ Pivot theo Lot và ví dụ phân tích NG Rate.",href:"pivottable.html",action:"Xem Pivot thực tế",tag:"Phân tích"},
  {d:18,w:3,t:"Chọn biểu đồ phù hợp",desc:"Học Column, Line, Pie và cách chọn biểu đồ theo dữ liệu.",href:"bieudopareto.html",action:"Học biểu đồ",tag:"Biểu đồ"},
  {d:19,w:3,t:"Pareto 80/20",desc:"Đi thẳng tới bài Pareto với % tích lũy và ví dụ lỗi sản xuất.",href:"bieudopareto.html",action:"Học Pareto",tag:"QC"},
  {d:20,w:3,t:"NG Rate thực hành",desc:"Làm bài NG Rate có sẵn trong trang Bài tập Excel.",href:"baitapexcel.html",action:"Làm bài NG Rate",tag:"QC"},
  {d:21,w:3,t:"Tự tạo QC Dashboard",desc:"Đưa kiến thức Pivot/Pareto/NG Rate vào dashboard dữ liệu thực tế.",href:"qc-dashboard.html",action:"Thực hành Dashboard QC",tag:"Thực hành"},
  {d:22,w:4,t:"Báo cáo Excel",desc:"Học quy trình từ dữ liệu → KPI → biểu đồ → kết luận.",href:"baocaoexcel.html",action:"Học báo cáo",tag:"Báo cáo"},
  {d:23,w:4,t:"KPI, Top Defect & Action",desc:"Xem đúng các khối KPI, Top Defect, Lot ưu tiên và Action Needed.",href:"baocaoexcel.html",action:"Xem KPI & Defect",tag:"QC"},
  {d:24,w:4,t:"Formula Finder thực tế",desc:"Nhập nhu cầu của bạn để hệ thống gợi ý hàm thay vì học thuộc tên hàm.",href:"formula-finder.html",action:"Dùng Formula Finder",tag:"Công cụ"},
  {d:25,w:4,t:"Tăng tốc bằng phím tắt",desc:"Quay lại bộ phím tắt và tập trung các thao tác bạn dùng nhiều nhất.",href:"phimtatexcel.html",action:"Luyện tốc độ",tag:"Tốc độ"},
  {d:26,w:4,t:"Excel Challenge tổng hợp",desc:"Làm bộ Challenge tổng hợp để tích điểm và mở khóa huy hiệu Thành tích.",href:"formula-finder.html#excelChallenge",action:"Thi Challenge",tag:"Thử thách"},
  {d:27,w:4,t:"Playground Challenge",desc:"Tự nhập dữ liệu và giải bài thay vì chỉ xem đáp án.",href:"playground.html",action:"Bắt đầu Challenge",tag:"Thử thách"},
  {d:28,w:4,t:"Kiểm tra tiến độ cá nhân",desc:"Mở Dashboard để xem kỹ năng, XP, hoạt động và nội dung cần học tiếp.",href:"dashboard.html",action:"Xem Dashboard",tag:"Đánh giá"},
  {d:29,w:5,t:"Mini Project QC/Report",desc:"Dùng QC Dashboard để nhập dữ liệu thật, xem KPI, Lot NG và Pareto.",href:"qc-dashboard.html",action:"Làm Mini Project",tag:"Dự án"},
  {d:30,w:5,t:"Tổng kết & thành tích",desc:"Xem thành tích, nhiệm vụ và chọn mục tiêu học tiếp theo.",href:"achievements.html",action:"Xem thành tích",tag:"Hoàn thành"}
  ];

  function normalizeDone(value) {
    if(!Array.isArray(value)) return [];
    return [...new Set(
      value
        .map(Number)
        .filter(n => Number.isInteger(n) && n >= 1 && n <= 30)
    )].sort((a,b)=>a-b);
  }

  function getDone() {
    try {
      return normalizeDone(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {
      return [];
    }
  }

  function setDone(days) {
    const clean = normalizeDone(days);
    localStorage.setItem(KEY, JSON.stringify(clean));
    window.dispatchEvent(new CustomEvent("avp:learning-path-updated", {
      detail: { days: clean }
    }));
    return clean;
  }

  function addActivity(day) {
    const key = "avpRecentActivities";
    let activities = [];
    try { activities = JSON.parse(localStorage.getItem(key) || "[]"); }
    catch {}

    activities.unshift({
      type: "learning-path",
      title: `Hoàn thành Ngày ${day} trong Lộ trình 30 ngày`,
      time: new Date().toISOString()
    });

    localStorage.setItem(key, JSON.stringify(activities.slice(0,20)));
  }

  function ensureStartDate() {
    if(!localStorage.getItem(START_KEY)) {
      localStorage.setItem(START_KEY, new Date().toISOString().slice(0,10));
    }
  }

  /*
    "Ngày hiện tại" = ngày đầu tiên chưa hoàn thành.
    Cách này ổn định hơn việc khóa theo số ngày kể từ lần đầu truy cập.
  */
  function currentDay() {
    const done = getDone();
    const next = plan.find(item => !done.includes(item.d));
    return next ? next.d : 30;
  }

  function ensureCongratsBanner() {
    let banner = document.getElementById("lpCongratsBanner");
    if(banner) return banner;

    banner = document.createElement("section");
    banner.id = "lpCongratsBanner";
    banner.className = "lp-congrats";
    banner.setAttribute("role","status");
    banner.setAttribute("aria-live","polite");
    banner.innerHTML = `
      <div class="lp-congrats-icon">🎉</div>
      <div class="lp-congrats-copy">
        <strong>Chúc mừng bạn đã hoàn thành!</strong>
        <span>Bạn đã hoàn thành toàn bộ Lộ trình Excel 30 ngày.</span>
      </div>
      <a href="achievements.html" class="lp-congrats-link">Xem thành tích →</a>
    `;

    const hero = document.querySelector(".lp-hero");
    hero?.insertAdjacentElement("afterend", banner);
    return banner;
  }

  function celebrateCompletion() {
    const banner = ensureCongratsBanner();
    if(!banner) return;
    banner.classList.remove("show");
    window.scrollTo({top:0,behavior:"smooth"});
    setTimeout(()=>banner.classList.add("show"),250);
  }

  function updateStats() {
    const doneDays = getDone();
    const done = doneDays.length;
    const pct = Math.round(done / 30 * 100);
    const xp = done * 15;
    const current = currentDay();

    const setText = (id,value) => {
      const el = document.getElementById(id);
      if(el) el.textContent = value;
    };

    setText("lpCompleted", done);
    setText("lpPercent", `${pct}%`);
    setText("lpXp", xp);
    setText("lpToday", done === 30 ? "30" : current);
    setText("lpProgressText", `${done}/30 ngày hoàn thành`);

    const bar = document.getElementById("lpProgressBar");
    if(bar) bar.style.width = `${pct}%`;

    const next = plan.find(item => !doneDays.includes(item.d));
    const title = document.getElementById("lpNextTitle");
    const desc = document.getElementById("lpNextDesc");
    const link = document.getElementById("lpNextLink");

    if(done === 30) {
      if(title) title.textContent = "Bạn đã hoàn thành toàn bộ 30 ngày 🎉";
      if(desc) desc.textContent = "Hãy xem thành tích và chọn mục tiêu Excel tiếp theo của bạn.";
      if(link) {
        link.href = "achievements.html";
        link.textContent = "Xem thành tích →";
      }
      return;
    }

    if(next) {
      if(title) title.textContent = `Ngày ${next.d}: ${next.t}`;
      if(desc) desc.textContent = next.desc;
      if(link) {
        link.href = next.href;
        link.textContent = `${next.action || "Học ngay"} →`;
      }
    }
  }

  function render(filter = "all") {
    const root = document.getElementById("learningPathGrid");
    if(!root) return;

    const done = getDone();
    const current = currentDay();
    root.innerHTML = "";

    let lastWeek = 0;

    plan.forEach(item => {
      if(filter !== "all" && String(item.w) !== String(filter)) return;

      if(item.w !== lastWeek) {
        lastWeek = item.w;
        const heading = document.createElement("div");
        heading.className = "lp-week";
        heading.textContent = item.w === 5 ? "🏁 Hai ngày tổng kết" : `Tuần ${item.w}`;
        root.appendChild(heading);
      }

      const isDone = done.includes(item.d);
      const isCurrent = !isDone && item.d === current;

      const card = document.createElement("article");
      card.className = [
        "lp-day",
        isDone ? "done" : "",
        isCurrent ? "current" : ""
      ].filter(Boolean).join(" ");

      card.innerHTML = `
        <div class="lp-day-top">
          <div style="display:flex;gap:13px;align-items:flex-start">
            <div class="lp-day-num">${isDone ? "✓" : item.d}</div>
            <div>
              <h3>${item.t}</h3>
              <div class="lp-topic">${item.desc}</div>
              <span class="lp-tag">${item.tag}</span>
              ${isCurrent ? '<span class="lp-current-badge">🎯 Tiếp theo</span>' : ''}
            </div>
          </div>
        </div>
        <div class="lp-actions">
          <a class="lp-go" href="${item.href}">${item.action || "Mở bài"} →</a>
          <button type="button" class="lp-complete" data-day="${item.d}">
            ${isDone ? "Bỏ hoàn thành" : "Đánh dấu hoàn thành"}
          </button>
        </div>
      `;

      root.appendChild(card);
    });

    updateStats();
    bindButtons();
  }

  function activeFilter() {
    return document.querySelector(".lp-filter.active")?.dataset.filter || "all";
  }

  function bindButtons() {
    document.querySelectorAll(".lp-complete").forEach(btn => {
      btn.addEventListener("click", () => {
        const day = Number(btn.dataset.day);
        if(!Number.isInteger(day)) return;

        const before = getDone();
        const wasDone = before.includes(day);

        const next = wasDone
          ? before.filter(x => x !== day)
          : [...before, day];

        if(!wasDone) addActivity(day);
        const after = setDone(next);

        render(activeFilter());

        if(before.length < 30 && after.length === 30) {
          celebrateCompletion();
        }
      });
    });
  }

  function resetProgress() {
    if(!confirm("Xóa toàn bộ tiến độ Lộ trình 30 ngày?")) return;

    /*
      setItem([]) thay vì removeItem để cloud sync nhận được
      trạng thái rỗng chính xác.
    */
    setDone([]);
    localStorage.setItem(START_KEY, new Date().toISOString().slice(0,10));

    document.querySelectorAll(".lp-filter").forEach(x=>x.classList.remove("active"));
    document.querySelector('.lp-filter[data-filter="all"]')?.classList.add("active");

    render("all");
  }

  function init() {
    ensureStartDate();
    render();

    document.querySelectorAll(".lp-filter").forEach(button => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".lp-filter").forEach(x=>x.classList.remove("active"));
        button.classList.add("active");
        render(button.dataset.filter);
      });
    });

    document.getElementById("lpReset")?.addEventListener("click", resetProgress);
  }

  document.addEventListener("DOMContentLoaded", init);

  /*
    Supabase auth có thể tải tiến độ cloud sau khi trang đã render.
    Render lại ngay khi dữ liệu cloud được áp vào localStorage.
  */
  window.addEventListener("avp:cloud-progress-loaded", () => {
    render(activeFilter());
  });

  window.addEventListener("avp:learning-path-updated", () => {
    updateStats();
  });
})();
