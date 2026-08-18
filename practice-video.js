/**
 * Video practice library — data + render
 * Source of truth: Lich_10_Video (Ke_Hoach_Content_Excel_TikTok)
 */
(function () {
  const videoPracticeData = [
    {
      id: "video-01",
      number: 1,
      icon: "🧹",
      title: "Hai ô \"Viet Nam\" nhìn giống nhau nhưng Excel bảo khác",
      category: "Làm sạch dữ liệu",
      skill: "LEN • TRIM • CLEAN • CHAR(160)",
      filterTags: ["Làm sạch dữ liệu"],
      file: "video-01-viet-nam-hidden-space.xlsx"
    },
    {
      id: "video-02",
      number: 2,
      icon: "📋",
      title: "Copy dữ liệu nhưng không copy dòng ẩn",
      category: "Tip & Trick",
      skill: "Filter • Visible Cells Only • Alt+; • Copy",
      filterTags: ["Tip & Trick"],
      file: "video-02-visible-cells-only.xlsx"
    },
    {
      id: "video-03",
      number: 3,
      icon: "🔢",
      title: "Number Stored as Text",
      category: "Làm sạch dữ liệu",
      skill: "Convert to Number • Paste Special • SUM",
      filterTags: ["Làm sạch dữ liệu", "Công thức / Lookup"],
      file: "video-03-number-stored-as-text.xlsx"
    },
    {
      id: "video-04",
      number: 4,
      icon: "🔎",
      title: "So sánh 2 danh sách, tìm dòng thiếu",
      category: "Công thức / Lookup",
      skill: "COUNTIF • XMATCH • Power Query Left Anti",
      filterTags: ["Công thức / Lookup", "Power Query"],
      file: "video-04-compare-two-lists.xlsx"
    },
    {
      id: "video-05",
      number: 5,
      icon: "✏️",
      title: "Điền toàn bộ ô trống cùng lúc",
      category: "Tip & Trick",
      skill: "Go To Special → Blanks → Ctrl+Enter",
      filterTags: ["Tip & Trick"],
      file: "video-05-fill-blanks.xlsx"
    },
    {
      id: "video-06",
      number: 6,
      icon: "🗑️",
      title: "Xóa hàng nghìn dòng trống nhanh",
      category: "Tip & Trick",
      skill: "Filter / Go To Special → Delete Rows",
      filterTags: ["Tip & Trick"],
      file: "video-06-delete-blank-rows.xlsx"
    },
    {
      id: "video-07",
      number: 7,
      icon: "⌨️",
      title: "5 phím tắt Excel dân văn phòng nên biết",
      category: "Tip & Trick",
      skill: "5 phím tắt văn phòng • demo dữ liệu thật",
      filterTags: ["Tip & Trick"],
      file: "video-07-office-shortcuts.xlsx"
    },
    {
      id: "video-08",
      number: 8,
      icon: "🏢",
      title: "Chuẩn hóa tên công ty trước khi Lookup",
      category: "Làm sạch dữ liệu",
      skill: "TRIM + CLEAN + Standard Mapping",
      filterTags: ["Làm sạch dữ liệu", "Công thức / Lookup"],
      file: "video-08-company-name-cleaning.xlsx"
    },
    {
      id: "video-09",
      number: 9,
      icon: "📇",
      title: "Danh thiếp đối tác → Excel nhanh",
      category: "Tip & Trick",
      skill: "OCR → chuẩn hóa cột → Excel Table → Remove Duplicates",
      filterTags: ["Tip & Trick", "Làm sạch dữ liệu"],
      file: "video-09-business-cards-to-excel.xlsx"
    },
    {
      id: "video-10",
      number: 10,
      icon: "⚙️",
      title: "Power Query P4 – Làm sạch Master lỗi 4.150 dòng",
      category: "Power Query",
      skill: "Trim → Clean → Uppercase → Data Type → Column Quality",
      filterTags: ["Power Query", "Làm sạch dữ liệu"],
      file: "video-10-power-query-master-4150.xlsx"
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
    const want = normalizeFile(item.file);
    const hit = fileList().find(function (f) { return normalizeFile(f) === want; });
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
      ? '<a class="pv-download" href="downloads/video-practice/' + fileName + '" download>⬇ Tải file thực hành</a>'
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
