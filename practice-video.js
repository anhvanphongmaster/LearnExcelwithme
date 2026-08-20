/**
 * Video practice library — data + render
 * 01–04: Power Query cũ (đã có file)
 * 05–22: 18 video sắp ra (Coming soon cho đến khi zip nằm trong manifest)
 */
(function () {
  const videoPracticeData = [
{
      id: "video-01",
      number: 1,
      icon: "🧹",
      title: "Làm sạch dữ liệu • Cột trùng",
      category: "Làm sạch dữ liệu",
      skill: "Trim • Clean • Kiểu dữ liệu • Column Quality",
      filterTags: ["Làm sạch dữ liệu", "Power Query"],
      file: "01_PowerQuery_DEMO.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "video-02",
      number: 2,
      icon: "📂",
      title: "Gộp nhiều file Input bằng Power Query",
      category: "Power Query",
      skill: "Get Data → From Folder • Combine • Input_01 … Input_10",
      filterTags: ["Power Query"],
      file: "02_PowerQuery-11-Files.zip",
      folder: ""
    },
{
      id: "video-03",
      number: 3,
      icon: "📊",
      title: "Tạo PivotTable từ kết quả Power Query",
      category: "Power Query",
      skill: "Close & Load • Pivot • Refresh",
      filterTags: ["Power Query"],
      file: "02_PowerQuery-11-Files.zip",
      folder: ""
    },
{
      id: "video-04",
      number: 4,
      icon: "📈",
      title: "Dashboard QC từ Pivot Power Query",
      category: "Power Query",
      skill: "KPI • Slicer • PivotChart",
      filterTags: ["Power Query"],
      file: "02_PowerQuery-11-Files.zip",
      folder: ""
    },
{
      id: "v02-center-across",
      number: 5,
      icon: "↔️",
      title: "Đừng Merge — Center Across Selection",
      category: "Format",
      skill: "Format Cells • Alignment • Center Across Selection • Sort",
      filterTags: ["Format"],
      file: "05_center_across.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "v04-so-viet",
      number: 6,
      icon: "🇻🇳",
      title: "Số kiểu Việt 1.234.567 Excel không cộng",
      category: "Làm sạch dữ liệu",
      skill: "SUBSTITUTE • VALUE • dấu chấm nghìn",
      filterTags: ["Làm sạch dữ liệu", "Công thức"],
      file: "06_so_viet.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "v05-an-so-0",
      number: 7,
      icon: "🫥",
      title: "Custom format ẩn số 0",
      category: "Format",
      skill: "Custom format 0;-0;;@ • #,##0;\"-\";@",
      filterTags: ["Format"],
      file: "07_an_so_0.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "b01-dan-dong-loc",
      number: 8,
      icon: "📥",
      title: "Dán vào đúng dòng đang lọc",
      category: "Nhập liệu",
      skill: "Filter • XLOOKUP • Sort • không dán đè dòng ẩn",
      filterTags: ["Nhập liệu", "Công thức"],
      file: "08_dan_dong_loc.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "c2-sum-text",
      number: 9,
      icon: "0️⃣",
      title: "Số nhìn như số nhưng SUM ra 0",
      category: "Làm sạch dữ liệu",
      skill: "VALUE • Convert to Number • Paste Special Multiply",
      filterTags: ["Làm sạch dữ liệu", "Công thức"],
      file: "09_so_nhin_nhu_so_SUM_0.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "c3-ngay",
      number: 10,
      icon: "📅",
      title: "10 người nhập 10 kiểu ngày",
      category: "Nhập liệu",
      skill: "Custom format dd/mm/yyyy • Data Validation Date • Error Alert",
      filterTags: ["Nhập liệu", "Làm sạch dữ liệu"],
      file: "10_10_kieu_ngay.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "v01-char160",
      number: 11,
      icon: "👻",
      title: "Khoảng trắng ma CHAR(160)",
      category: "Làm sạch dữ liệu",
      skill: "LEN • CODE • MID • SUBSTITUTE • CHAR(160) • TRIM",
      filterTags: ["Làm sạch dữ liệu", "Công thức"],
      file: "11_CHAR160.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "v03-alt-visible",
      number: 12,
      icon: "👁️",
      title: "Alt+; copy đúng dòng đang Filter",
      category: "Nhập liệu",
      skill: "Filter • Go To Special Visible cells • Alt+;",
      filterTags: ["Nhập liệu"],
      file: "12_Alt_copy_dong_loc.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "v06-dropdown-2tang",
      number: 13,
      icon: "📑",
      title: "Dropdown 2 tầng: bộ phận → tên",
      category: "Nhập liệu",
      skill: "Data Validation • FILTER • INDIRECT • Table",
      filterTags: ["Nhập liệu", "Công thức"],
      file: "13_dropdown_2_tang.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "v07-xlookup",
      number: 14,
      icon: "🔎",
      title: "XLOOKUP không còn #N/A",
      category: "Công thức",
      skill: "XLOOKUP if_not_found • match_mode • IFNA",
      filterTags: ["Công thức"],
      file: "14_XLOOKUP.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "v08-unpivot",
      number: 15,
      icon: "↩️",
      title: "Unpivot: báo cáo nằm ngang thành dữ liệu",
      category: "Power Query",
      skill: "From Table • Unpivot Other Columns",
      filterTags: ["Power Query", "Làm sạch dữ liệu"],
      file: "15_Unpivot.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "v09-from-folder",
      number: 16,
      icon: "📁",
      title: "Power Query gộp cả thư mục file tháng",
      category: "Power Query",
      skill: "Get Data From Folder • Combine • Refresh",
      filterTags: ["Power Query"],
      file: "16_PQ_gop_thu_muc.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "v10-fuzzy",
      number: 17,
      icon: "🧩",
      title: "Fuzzy merge tên gần giống",
      category: "Power Query",
      skill: "Merge queries • Fuzzy • Similarity threshold",
      filterTags: ["Power Query", "Làm sạch dữ liệu"],
      file: "17_Fuzzy_merge.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "c1-pq-10sheet",
      number: 18,
      icon: "📚",
      title: "Gộp 10 sheet rồi mới biết bẩn",
      category: "Power Query",
      skill: "Connection Only • Append • Custom column • Close & Load",
      filterTags: ["Power Query", "Làm sạch dữ liệu"],
      file: "18_PQ_10_sheet.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "v11-skip-blanks",
      number: 19,
      icon: "📋",
      title: "Paste Special Skip Blanks",
      category: "Nhập liệu",
      skill: "Paste Special • Skip blanks • cập nhật cột thiếu ô",
      filterTags: ["Nhập liệu"],
      file: "19_Skip_Blanks.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "v12-textbefore",
      number: 20,
      icon: "✂️",
      title: "Tách họ tên bằng TEXTBEFORE",
      category: "Công thức",
      skill: "TEXTBEFORE • TEXTAFTER • Flash Fill",
      filterTags: ["Công thức", "Làm sạch dữ liệu"],
      file: "20_TEXTBEFORE.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "v13-filldown",
      number: 21,
      icon: "⬇️",
      title: "Power Query Skip row + Fill Down",
      category: "Power Query",
      skill: "Skip rows • Promote headers • Fill Down",
      filterTags: ["Power Query", "Làm sạch dữ liệu"],
      file: "21_Fill_Down.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "v14-distinct",
      number: 22,
      icon: "🔢",
      title: "Pivot Distinct Count — Data Model",
      category: "Power Query",
      skill: "Add to Data Model • Distinct Count",
      filterTags: ["Power Query"],
      file: "22_Distinct_Count.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "v15-aggregate",
      number: 23,
      icon: "🧮",
      title: "AGGREGATE bỏ lỗi và dòng ẩn",
      category: "Công thức",
      skill: "AGGREGATE(9,7,range) • so với SUM / SUBTOTAL",
      filterTags: ["Công thức"],
      file: "23_AGGREGATE.xlsx",
      folder: "downloads/video-practice/"
    },
{
      id: "v16-Coming_soon",
      number: 24,
      icon: "🎆",
      title: "Sắp ra mắt",
      category: "Các bạn đóng góp ý tưởng nhé",
      skill: "Wait",
      filterTags: ["Wait"],
      file: "",
      folder: "downloads/video-practice/"
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

  function downloadBlock(item, fileName) {
    const folder = item.folder || "downloads/power-query/";
    const names = [];
    function add(f) { if (f && names.indexOf(f) === -1) names.push(f); }
    add(fileName);
    (item.extraFiles || []).forEach(add);
    return names.map(function (f) {
      return '<a class="pv-download" href="' + folder + f + '" download>⬇ ' + f + "</a>";
    }).join("");
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

  function cardHTML(item) {
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
    const tags = (item.filterTags || [item.category]).join(" ");

    return (
      '<article class="pv-card ' + (avail ? "pv-card-available" : "pv-card-locked") + '" ' +
      'data-status="' + status + '" data-category="' + tags + '" data-title="' + item.title.toLowerCase() + '">' +
      '<div class="pv-card-top"><span class="pv-num">' + String(item.number).padStart(2, "0") + "</span>" + badge + "</div>" +
      '<div class="pv-icon">' + item.icon + "</div>" +
      '<h3 class="pv-title">' + item.title + "</h3>" +
      '<p class="pv-cat">' + item.category + "</p>" +
      '<p class="pv-skill">' + item.skill + "</p>" +
      '<div class="pv-foot">' + tkBtn + fileBtn + "</div>" +
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
      if (f === "available" && !isAvailable(item)) return;
      if (f === "video" && !tiktokUrl(item)) return;
      if (f === "coming" && released) return;
      if (f !== "all" && f !== "available" && f !== "coming" && f !== "video") {
        const tags = (item.filterTags || []).join(" ").toLowerCase();
        if (tags.indexOf(f.toLowerCase()) === -1 && item.category.toLowerCase().indexOf(f.toLowerCase()) === -1) return;
      }
      if (q) {
        const hay = (item.title + " " + item.skill + " " + item.category).toLowerCase();
        if (hay.indexOf(q) === -1) return;
      }
      html += cardHTML(item);
    });

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

  document.addEventListener("click", function (e) {
    const dl = e.target.closest(".pv-download");
    if (dl && window.avpAnalytics) {
      window.avpAnalytics.track("practice_file_download", {
        page: "practice-video.html",
        tool: (dl.getAttribute("download") || dl.textContent || "file").slice(0, 80)
      });
    }
    const vd = e.target.closest(".pv-tiktok, a.pv-watch");
    if (vd && window.avpAnalytics) {
      window.avpAnalytics.track("practice_video_click", {
        page: "practice-video.html",
        tool: (vd.textContent || "tiktok").slice(0, 80)
      });
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("pvFeedbackBtn");
    const modal = document.getElementById("pvFeedbackModal");
    if (!btn || !modal) return;
    const close = function () { modal.hidden = true; };
    btn.addEventListener("click", function () { modal.hidden = false; });
    var cancel = document.getElementById("pvFbCancel");
    if (cancel) cancel.addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    var send = document.getElementById("pvFbSend");
    if (send) send.addEventListener("click", async function () {
      const kind = (document.getElementById("pvFbKind") || {}).value || "question";
      const name = ((document.getElementById("pvFbName") || {}).value || "").trim();
      const message = ((document.getElementById("pvFbText") || {}).value || "").trim();
      const st = document.getElementById("pvFbStatus");
      if (name.length < 2) { if (st) st.textContent = "Nhập tên của bạn."; return; }
      if (message.length < 4) { if (st) st.textContent = "Viết rõ hơn một chút."; return; }
      if (st) st.textContent = "Đang gửi...";
      if (!window.avpAnalytics) { if (st) st.textContent = "Chưa kết nối được máy chủ."; return; }
      const ok = await window.avpAnalytics.track("site_feedback", {
        page: "practice-video.html",
        metadata: { kind: kind, name: name, message: message }
      });
      if (st) st.textContent = ok ? "Đã gửi. Cảm ơn bạn." : "Chưa gửi được. Thử lại sau.";
      if (ok) document.getElementById("pvFbText").value = "";
    });
  });

  document.addEventListener("DOMContentLoaded", function(){
    var btn = document.getElementById("pvFileBtn");
    var modal = document.getElementById("pvFileModal");
    if(!btn || !modal) return;
    var st = document.getElementById("pvFileStatus");
    function close(){ modal.hidden = true; }
    btn.addEventListener("click", function(){ modal.hidden = false; if(st) st.textContent=""; });
    var cancel = document.getElementById("pvFileCancel");
    if (cancel) cancel.addEventListener("click", close);
    modal.addEventListener("click", function(e){ if(e.target===modal) close(); });
    var send = document.getElementById("pvFileSend");
    if (send) send.addEventListener("click", async function(){
      var name = (document.getElementById("pvFileName").value || "").trim();
      var email = (document.getElementById("pvFileEmail").value || "").trim();
      var zalo = (document.getElementById("pvFileZalo").value || "").trim();
      var note = (document.getElementById("pvFileNote").value || "").trim();
      var pick = document.getElementById("pvFilePick");
      var file = pick && pick.files && pick.files[0];
      if(name.length < 2){ if(st) st.textContent="Nhập tên."; return; }
      if(!email && !zalo){ if(st) st.textContent="Cần Gmail hoặc Zalo để gửi lại file."; return; }
      if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ if(st) st.textContent="Gmail không hợp lệ."; return; }
      if(!file){ if(st) st.textContent="Chọn file Excel."; return; }
      if(file.size > 8*1024*1024){ if(st) st.textContent="File tối đa 8MB."; return; }
      var sb = window.avpSupabase;
      if(!sb){ if(st) st.textContent="Chưa kết nối được máy chủ."; return; }
      if(st) st.textContent="Đang gửi file...";
      var safe = file.name.replace(/[^\w.\-]+/g,"_").slice(0,80);
      var path = "inbox/" + Date.now() + "_" + Math.random().toString(36).slice(2,8) + "_" + safe;
      var up = await sb.storage.from("practice-uploads").upload(path, file, {upsert:false});
      if(up.error){ if(st) st.textContent="Không tải được file. Cần chạy SQL / tạo bucket practice-uploads."; return; }
      var rec = await sb.rpc("submit_user_file", {
        p_name: name, p_email: email, p_zalo: zalo, p_note: note,
        p_file_name: file.name, p_storage_path: path
      });
      if(rec.error){ if(st) st.textContent="File lên rồi nhưng chưa ghi phiếu. " + rec.error.message; return; }
      if(st) st.textContent="Đã gửi. Mình sẽ trả qua Gmail/Zalo khi xử lý xong.";
      pick.value = "";
    });
  });

})();
