/**
 * Video practice library — data + render
 * Source of truth: Lich_10_Video (Ke_Hoach_Content_Excel_TikTok)
 */
(function () {
  const ALL_PQ_FILES = ["Input_01.xlsx","Input_02.xlsx","Input_03.xlsx","Input_04.xlsx","Input_05.xlsx","Input_06.xlsx","Input_07.xlsx","Input_08.xlsx","Input_09.xlsx","Input_10.xlsx","PowerQuery-Master-Expected.xlsx"];
  const videoPracticeData = [
    {
      id: "video-01",
      number: 1,
      icon: "🧹",
      title: "Làm sạch dữ liệu trong Power Query",
      category: "Làm sạch dữ liệu",
      skill: "Trim • Clean • Kiểu dữ liệu • Column Quality",
      filterTags: ["Làm sạch dữ liệu", "Power Query"],
      file: "PowerQuery-11-Files.zip",
      folder: "downloads/power-query/"
    },
    {
      id: "video-02",
      number: 2,
      icon: "📂",
      title: "Gộp nhiều file Input bằng Power Query",
      category: "Power Query",
      skill: "Get Data → From Folder • Combine • Input_01 … Input_10",
      filterTags: ["Power Query"],
      file: "PowerQuery-11-Files.zip",
      folder: "downloads/power-query/"
    },
    {
      id: "video-03",
      number: 3,
      icon: "📊",
      title: "Tạo PivotTable từ kết quả Power Query",
      category: "Power Query",
      skill: "Close & Load • Pivot • Refresh",
      filterTags: ["Power Query"],
      file: "PowerQuery-11-Files.zip",
      folder: "downloads/power-query/"
    },
    {
      id: "video-04",
      number: 4,
      icon: "📈",
      title: "Dashboard QC từ Pivot Power Query",
      category: "Power Query",
      skill: "KPI • Slicer • PivotChart",
      filterTags: ["Power Query"],
      file: "PowerQuery-11-Files.zip",
      folder: "downloads/power-query/"
    }
  ];

  function fileList() {
    return (typeof availablePracticeFiles !== "undefined" && Array.isArray(availablePracticeFiles))
      ? availablePracticeFiles
      : [];
  }
  function normalizeFile(name) {
    return String(name || "").replace(/\.xlsx\.xlsx$/i, ".xlsx").toLowerCase();
  }
  function resolvedFile(item) {
    if (!item.file) return "";
    const list = fileList();
    const aliases = (typeof practiceFileAliases !== "undefined" && practiceFileAliases) ? practiceFileAliases : {};
    const alias = aliases[item.file] || aliases[item.id] || "";
    const candidates = [item.file, alias].filter(Boolean).map(normalizeFile);
    const hit = list.find(function (f) { return candidates.indexOf(normalizeFile(f)) !== -1; });
    return hit || "";
  }
  function isAvailable(item) {
    return !!resolvedFile(item);
  }
  function tiktokUrl(item) {
    const map = (typeof videoTikTokLinks !== "undefined" && videoTikTokLinks) ? videoTikTokLinks : {};
    return (item.tiktok || map[item.id] || "").trim();
  }
  function isReleased(item) {
    return isAvailable(item) || !!tiktokUrl(item);
  }


  function downloadBlock(item, fileName){
    const folder = item.folder || "downloads/power-query/";
    const names = [];
    function add(f){ if(f && names.indexOf(f)===-1) names.push(f); }
    add(fileName);
    (item.extraFiles || []).forEach(add);
    let html = names.map(function(f){
      return '<a class="pv-download" href="' + folder + f + '" download>⬇ ' + f + '</a>';
    }).join("");
    return html;
  }
  function updateSummary() {
    const available = videoPracticeData.filter(isReleased).length;
    const coming = videoPracticeData.length - available;
    const elA = document.getElementById("pvStatAvailable");
    const elC = document.getElementById("pvStatComing");
    const elT = document.getElementById("pvStatTotal");
    if (elA) elA.textContent = String(available);
    if (elC) elC.textContent = String(coming);
    if (elT) elT.textContent = String(videoPracticeData.length);
  }

  function cardHTML(item, permanentComing) {
    if (permanentComing) {
      return (
        '<article class="pv-card pv-card-locked pv-card-future" data-status="coming" data-category="future">' +
        '<div class="pv-card-top"><span class="pv-num">11</span><span class="pv-badge pv-badge-coming">⏳ Coming soon</span></div>' +
        '<div class="pv-icon">✨</div>' +
        '<h3 class="pv-title">Nội dung tiếp theo đang được chuẩn bị</h3>' +
        '<p class="pv-cat">Roadmap</p>' +
        '<p class="pv-skill">Video và file thực hành mới sẽ tiếp tục được cập nhật tại đây.</p>' +
        '<div class="pv-foot"><span class="pv-locked-note">🔒 Sẽ mở khi có video mới</span></div>' +
        "</article>"
      );
    }

    const fileName = resolvedFile(item);
    const avail = !!fileName;
    const tk = tiktokUrl(item);
    const released = avail || !!tk;
    const status = released ? "available" : "coming";
    let badge;
    if (avail && tk) badge = '<span class="pv-badge pv-badge-available">✅ Đã có video + file</span>';
    else if (avail) badge = '<span class="pv-badge pv-badge-available">✅ Đã có file</span>';
    else if (tk) badge = '<span class="pv-badge pv-badge-available">▶ Đã có video</span>';
    else badge = '<span class="pv-badge pv-badge-coming">⏳ Coming soon</span>';
    const tkBtn = tk
      ? '<a class="pv-tiktok" href="' + tk + '" target="_blank" rel="noopener noreferrer">▶ Xem video TikTok</a>'
      : '<span class="pv-tiktok-soon">Video TikTok chưa gắn link</span>';
    const fileBtn = avail
      ? downloadBlock(item, fileName)
      : '<span class="pv-locked-note">File sẽ mở khi video được phát hành.</span>';
    const foot = tkBtn + fileBtn;
    const tags = (item.filterTags || [item.category]).join(" ");

    return (
      '<article class="pv-card ' + (avail ? "pv-card-available" : "pv-card-locked") + '" ' +
      'data-status="' + status + '" data-category="' + tags + '" data-title="' + item.title.toLowerCase() + '">' +
      '<div class="pv-card-top"><span class="pv-num">' + String(item.number).padStart(2, "0") + "</span>" + badge + "</div>" +
      '<div class="pv-icon">' + item.icon + "</div>" +
      '<h3 class="pv-title">' + item.title + "</h3>" +
      '<p class="pv-cat">' + item.category + "</p>" +
      '<p class="pv-skill">' + item.skill + "</p>" +
      '<div class="pv-foot">' + foot + "</div>" +
      "</article>"
    );
  }

  function render(filter, query) {
    const grid = document.getElementById("pvGrid");
    if (!grid) return;
    const q = (query || "").trim().toLowerCase();
    const f = filter || "all";

    let html = "";
    videoPracticeData.forEach(function (item) {
      const released = isReleased(item);
      if (f === "available" && !released) return;
      if (f === "coming" && released) return;
      if (f !== "all" && f !== "available" && f !== "coming") {
        const tags = (item.filterTags || []).join(" ").toLowerCase();
        if (tags.indexOf(f.toLowerCase()) === -1 && item.category.toLowerCase().indexOf(f.toLowerCase()) === -1) return;
      }
      if (q) {
        const hay = (item.title + " " + item.skill + " " + item.category).toLowerCase();
        if (hay.indexOf(q) === -1) return;
      }
      html += cardHTML(item, false);
    });

    // permanent card 11 — only show when not filtering to "available" only, and query empty or matches
    const showFuture =
      f !== "available" &&
      (!q || "nội dung tiếp theo đang được chuẩn bị coming soon".indexOf(q) !== -1);
    if (showFuture && (f === "all" || f === "coming")) {
      html += cardHTML(null, true);
    }

    grid.innerHTML = html || '<p class="pv-empty">Không tìm thấy bài phù hợp.</p>';
  }

  function init() {
    updateSummary();
    render("all", "");

    const search = document.getElementById("pvSearch");
    const filters = document.querySelectorAll(".pv-filter");
    let currentFilter = "all";

    if (search) {
      search.addEventListener("input", function () {
        render(currentFilter, search.value);
      });
    }
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filters.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        currentFilter = btn.getAttribute("data-filter") || "all";
        render(currentFilter, search ? search.value : "");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();

  document.addEventListener("click", function(e){
    const dl = e.target.closest(".pv-download");
    if(dl && window.avpAnalytics){
      window.avpAnalytics.track("practice_file_download", {page:"practice-video.html", tool: (dl.getAttribute("download")||dl.textContent||"file").slice(0,80)});
    }
    const vd = e.target.closest(".pv-tiktok, a.pv-watch");
    if(vd && window.avpAnalytics){
      window.avpAnalytics.track("practice_video_click", {page:"practice-video.html", tool: (vd.textContent||"tiktok").slice(0,80)});
    }
  });
  document.addEventListener("DOMContentLoaded", function(){
    const btn = document.getElementById("pvFeedbackBtn");
    const modal = document.getElementById("pvFeedbackModal");
    if(!btn || !modal) return;
    const close = () => { modal.hidden = true; };
    btn.addEventListener("click", () => { modal.hidden = false; });
    document.getElementById("pvFbCancel")?.addEventListener("click", close);
    modal.addEventListener("click", e => { if(e.target===modal) close(); });
    document.getElementById("pvFbSend")?.addEventListener("click", async function(){
      const kind = document.getElementById("pvFbKind")?.value || "question";
      const name = (document.getElementById("pvFbName")?.value || "").trim();
      const message = (document.getElementById("pvFbText")?.value || "").trim();
      const st = document.getElementById("pvFbStatus");
      if(name.length < 2){ if(st) st.textContent="Nhập tên của bạn."; return; }
      if(message.length < 4){ if(st) st.textContent="Viết rõ hơn một chút."; return; }
      if(st) st.textContent="Đang gửi...";
      if(!window.avpAnalytics){ if(st) st.textContent="Chưa kết nối được máy chủ."; return; }
      const ok = await window.avpAnalytics.track("site_feedback", {page:"practice-video.html", metadata:{kind, name, message}});
      if(st) st.textContent = ok ? "Đã gửi. Cảm ơn bạn." : "Chưa gửi được. Thử lại sau.";
      if(ok) document.getElementById("pvFbText").value = "";
    });
  });
