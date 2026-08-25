/**
 * Video practice library — data + render
 * 01–04: Power Query cũ (đã có file)
 * 05–22: 18 video sắp ra (Coming soon cho đến khi zip nằm trong manifest)
 */
(function () {
  const videoPracticeData = [
    // ===== LÀM SẠCH DỮ LIỆU =====
    {
      id: "video-01",
      number: 1,
      icon: "🧹",
      title: "Làm sạch dữ liệu • Cột trùng",
      category: "Làm sạch dữ liệu",
      skill: "Trim • Clean • Kiểu dữ liệu • Column Quality",
      filterTags: ["Làm sạch dữ liệu"],
      file: "01_PowerQuery_DEMO.xlsx",
      folder: "downloads/video-practice/"
    },
    {
      id: "v04-so-viet",
      number: 2,
      icon: "VN",
      title: "Số kiểu Việt 1.234.567 Excel không cộng",
      category: "Làm sạch dữ liệu",
      skill: "SUBSTITUTE • VALUE • dấu chấm nghìn",
      filterTags: ["Làm sạch dữ liệu"],
      file: "06_so_viet.xlsx",
      folder: "downloads/video-practice/"
    },
    {
      id: "c2-sum-text",
      number: 3,
      icon: "0",
      title: "Số nhìn như số nhưng SUM ra 0",
      category: "Làm sạch dữ liệu",
      skill: "VALUE • Convert to Number • Paste Special Multiply",
      filterTags: ["Làm sạch dữ liệu"],
      file: "09_so_nhin_nhu_so_SUM_0.xlsx",
      folder: "downloads/video-practice/"
    },
    {
      id: "v01-char160",
      number: 4,
      icon: "👻",
      title: "Khoảng trắng ma CHAR(160)",
      category: "Làm sạch dữ liệu",
      skill: "LEN • CODE • MID • SUBSTITUTE CHAR(160)",
      filterTags: ["Làm sạch dữ liệu"],
      file: "11_CHAR160.xlsx",
      folder: "downloads/video-practice/"
    },
    {
      id: "clean-date-text",
      number: 5,
      icon: "📅",
      title: "Ngày dạng chữ → ngày thật (DATEVALUE)",
      category: "Làm sạch dữ liệu",
      skill: "DATEVALUE • Text to Columns • chuẩn dd/mm/yyyy",
      filterTags: ["Làm sạch dữ liệu"],
      file: "",
      folder: "downloads/video-practice/"
    },
    {
      id: "clean-dup-multi",
      number: 6,
      icon: "🧬",
      title: "Xóa trùng theo nhiều cột",
      category: "Làm sạch dữ liệu",
      skill: "Remove Duplicates • UNIQUE • điều kiện 2–3 cột",
      filterTags: ["Làm sạch dữ liệu"],
      file: "",
      folder: "downloads/video-practice/"
    },

    // ===== POWER QUERY =====
    {
      id: "video-02",
      number: 1,
      icon: "📂",
      title: "Gộp file / thư mục / nhiều sheet bằng Power Query",
      category: "Power Query",
      skill: "From Folder • Append • From File (sheet) • Combine",
      filterTags: ["Power Query"],
      file: "02_PowerQuery-11-Files.zip",
      folder: "downloads/video-practice/"
    },
    {
      id: "video-03",
      number: 2,
      icon: "📊",
      title: "Tạo PivotTable từ kết quả Power Query",
      category: "Power Query",
      skill: "Close & Load • Pivot • Refresh",
      filterTags: ["Power Query"],
      file: "02_PowerQuery-11-Files.zip",
      folder: "downloads/video-practice/"
    },
    {
      id: "video-04",
      number: 3,
      icon: "📈",
      title: "Dashboard QC từ Pivot Power Query",
      category: "Power Query",
      skill: "KPI • Slicer • PivotChart",
      filterTags: ["Power Query"],
      file: "02_PowerQuery-11-Files.zip",
      folder: "downloads/video-practice/"
    },
    {
      id: "v08-unpivot",
      number: 4,
      icon: "↔️",
      title: "Unpivot: báo cáo nằm ngang thành dữ liệu",
      category: "Power Query",
      skill: "Unpivot Columns • Rename • Change Type",
      filterTags: ["Power Query"],
      file: "15_Unpivot.xlsx",
      folder: "downloads/video-practice/"
    },
    {
      id: "v10-fuzzy",
      number: 5,
      icon: "🔗",
      title: "Fuzzy merge tên gần giống",
      category: "Power Query",
      skill: "Merge Queries • Fuzzy Matching • Threshold",
      filterTags: ["Power Query"],
      file: "17_Fuzzy_merge.xlsx",
      folder: "downloads/video-practice/"
    },
    {
      id: "c1-pq-10sheet",
      number: 6,
      icon: "📋",
      title: "Gộp nhiều sheet rồi phát hiện dữ liệu bẩn",
      category: "Power Query",
      skill: "Append sheets • Column quality • lỗi sau khi gộp",
      filterTags: ["Power Query"],
      file: "18_PQ_10_sheet.xlsx",
      folder: "downloads/video-practice/"
    },
    {
      id: "v13-filldown",
      number: 7,
      icon: "⬇️",
      title: "Skip row + Fill Down trong Power Query",
      category: "Power Query",
      skill: "Skip rows • Fill Down • Promote headers",
      filterTags: ["Power Query"],
      file: "21_Fill_Down.xlsx",
      folder: "downloads/video-practice/"
    },
    {
      id: "v14-distinct",
      number: 8,
      icon: "🎯",
      title: "Làm sạch → Pivot → Dashboard",
      category: "Power Query",
      skill: "Clean • Pivot • Slicer • Dashboard tháng",
      filterTags: ["Power Query"],
      file: "22_dashboard_thang.xlsx",
      folder: "downloads/video-practice/"
    },

    // ===== NHẬP LIỆU =====
    {
      id: "b01-filter-zone",
      number: 1,
      icon: "📌",
      title: "Làm việc đúng vùng đang Filter (dán / copy)",
      category: "Nhập liệu",
      skill: "Filter • Visible cells only • Alt+; • dán đúng dòng",
      filterTags: ["Nhập liệu"],
      file: "08_dan_dong_loc.xlsx",
      folder: "downloads/video-practice/"
    },
    {
      id: "c3-ngay",
      number: 2,
      icon: "🗓️",
      title: "10 người nhập 10 kiểu ngày",
      category: "Nhập liệu",
      skill: "Chuẩn hóa ngày nhập • Data Validation date",
      filterTags: ["Nhập liệu"],
      file: "10_10_kieu_ngay.xlsx",
      folder: "downloads/video-practice/"
    },
    {
      id: "v06-dropdown-2tang",
      number: 3,
      icon: "📑",
      title: "Dropdown 2 tầng: bộ phận → tên",
      category: "Nhập liệu",
      skill: "INDIRECT • Named range • Data Validation",
      filterTags: ["Nhập liệu"],
      file: "13_dropdown_2_tang.xlsx",
      folder: "downloads/video-practice/"
    },
    {
      id: "valid-1tang-trung",
      number: 4,
      icon: "✅",
      title: "Dropdown 1 tầng + chặn nhập trùng",
      category: "Nhập liệu",
      skill: "Data Validation list • COUNTIF chặn trùng",
      filterTags: ["Nhập liệu"],
      file: "NhapLieu_Dropdown2_ChanTrung.xlsx",
      folder: "downloads/video-practice/"
    },
    {
      id: "v11-skip-blanks",
      number: 5,
      icon: "📋",
      title: "Paste Special Skip Blanks",
      category: "Nhập liệu",
      skill: "Paste Special • Skip blanks • không đè dữ liệu cũ",
      filterTags: ["Nhập liệu"],
      file: "19_Skip_Blanks.xlsx",
      folder: "downloads/video-practice/"
    },

    // ===== CÔNG THỨC =====
    {
      id: "v07-xlookup",
      number: 1,
      icon: "🔍",
      title: "XLOOKUP không còn #N/A",
      category: "Công thức",
      skill: "XLOOKUP • if_not_found • tra cứu an toàn",
      filterTags: ["Công thức"],
      file: "14_XLOOKUP.xlsx",
      folder: "downloads/video-practice/"
    },
    {
      id: "ct-sumifs",
      number: 2,
      icon: "➕",
      title: "SUMIFS / COUNTIFS theo nhiều điều kiện",
      category: "Công thức",
      skill: "SUMIFS • COUNTIFS • tiêu chí ngày / khu vực",
      filterTags: ["Công thức"],
      file: "",
      folder: "downloads/video-practice/"
    },
    {
      id: "ct-if-ifs",
      number: 3,
      icon: "🔀",
      title: "IF / IFS phân loại dữ liệu",
      category: "Công thức",
      skill: "IF • IFS • lồng điều kiện có kiểm soát",
      filterTags: ["Công thức"],
      file: "",
      folder: "downloads/video-practice/"
    },
    {
      id: "v12-textbefore",
      number: 4,
      icon: "✂️",
      title: "Tách họ tên bằng TEXTBEFORE",
      category: "Công thức",
      skill: "TEXTBEFORE • TEXTAFTER • TEXTSPLIT",
      filterTags: ["Công thức"],
      file: "20_TEXTBEFORE.xlsx",
      folder: "downloads/video-practice/"
    },
    {
      id: "v15-aggregate",
      number: 5,
      icon: "🧮",
      title: "AGGREGATE bỏ lỗi và dòng ẩn",
      category: "Công thức",
      skill: "AGGREGATE • bỏ #DIV/0! • bỏ dòng ẩn Filter",
      filterTags: ["Công thức"],
      file: "23_AGGREGATE.xlsx",
      folder: "downloads/video-practice/"
    },

    // ===== FORMAT =====
    {
      id: "v02-center-across",
      number: 1,
      icon: "↔️",
      title: "Đừng Merge — Center Across Selection",
      category: "Format",
      skill: "Alignment • Center Across • Sort an toàn",
      filterTags: ["Format"],
      file: "05_center_across.xlsx",
      folder: "downloads/video-practice/"
    },
    {
      id: "v05-an-so-0",
      number: 2,
      icon: "🚫",
      title: "Custom format ẩn số 0",
      category: "Format",
      skill: "Custom format 0;-0;;@ • #,##0;-#,##0;;@",
      filterTags: ["Format"],
      file: "07_an_so_0.xlsx",
      folder: "downloads/video-practice/"
    },
    {
      id: "fmt-cf-basic",
      number: 3,
      icon: "🎨",
      title: "Conditional Formatting cơ bản",
      category: "Format",
      skill: "Highlight • Color scale • Rule theo giá trị",
      filterTags: ["Format"],
      file: "",
      folder: "downloads/video-practice/"
    },
    {
      id: "pivot-basic",
      number: 4,
      icon: "📉",
      title: "PivotTable cơ bản (không cần Power Query)",
      category: "Format",
      skill: "Insert Pivot • Rows/Columns/Values • Refresh",
      filterTags: ["Format", "Power Query"],
      file: "",
      folder: "downloads/video-practice/"
    },

    // ===== CTA =====
    {
      id: "v16-Coming_soon",
      number: 99,
      icon: "💡",
      title: "Sắp ra mắt — gửi ý tưởng bài mới",
      category: "Các bạn đóng góp ý tưởng nhé",
      skill: "Vote / góp ý trên trang để admin lên bài tiếp",
      filterTags: ["Các bạn đóng góp ý tưởng nhé"],
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
      return '<a class="pv-download" href="' + folder + f + '" download title="' + f + '">Tải file</a>' + f + "</a>";
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


  function voterKey() {
    try {
      var k = localStorage.getItem("avp_voter_key");
      if (!k) {
        k = "v_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem("avp_voter_key", k);
      }
      return k;
    } catch (e) { return "v_anon"; }
  }
  function votedMap() {
    try { return JSON.parse(localStorage.getItem("avp_practice_votes") || "{}") || {}; }
    catch (e) { return {}; }
  }
  function markVoted(id) {
    var m = votedMap(); m[id] = true;
    try { localStorage.setItem("avp_practice_votes", JSON.stringify(m)); } catch (e) {}
  }
  function hasVoted(id) { return !!votedMap()[id]; }

  async function submitVote(item, voteType, btn) {
    if (hasVoted(item.id)) {
      if (btn) { btn.disabled = true; btn.textContent = "✓ Đã gửi"; }
      return;
    }
    if (btn) { btn.disabled = true; btn.textContent = "Đang gửi..."; }
    markVoted(item.id);
    try {
      var sb = window.avpSupabase || window.supabaseClient || null;
      if (sb && sb.rpc) {
        var res = await sb.rpc("vote_practice_lesson", {
          p_lesson_id: item.id,
          p_lesson_number: item.number || null,
          p_lesson_title: item.title || "",
          p_vote_type: voteType,
          p_voter_key: voterKey()
        });
        if (res && res.error) console.debug("vote rpc error", res.error);
      }
    } catch (e) { console.debug("vote rpc", e); }
    if (btn) { btn.textContent = "✓ Đã gửi yêu cầu"; }
  }


  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function highlightText(text, q) {
    const raw = String(text || "");
    if (!q) return escapeHtml(raw);
    const lower = raw.toLowerCase();
    const qi = lower.indexOf(q);
    if (qi < 0) return escapeHtml(raw);
    return (
      escapeHtml(raw.slice(0, qi)) +
      '<mark class="pv-hl">' + escapeHtml(raw.slice(qi, qi + q.length)) + "</mark>" +
      escapeHtml(raw.slice(qi + q.length))
    );
  }

  function panelTone(cat) {
    const c = String(cat || "").toLowerCase();
    if (c.indexOf("làm sạch") >= 0) return "tone-clean";
    if (c.indexOf("power query") >= 0) return "tone-pq";
    if (c.indexOf("công thức") >= 0) return "tone-formula";
    if (c.indexOf("nhập liệu") >= 0) return "tone-input";
    if (c.indexOf("format") >= 0) return "tone-format";
    if (c.indexOf("pivot") >= 0 || c.indexOf("dashboard") >= 0) return "tone-dash";
    return "tone-default";
  }

  function cardHTML(item, localNum, q) {
    const fileName = resolvedFile(item);
    const avail = !!fileName;
    const tk = tiktokUrl(item);
    const status = (avail || !!tk) ? "available" : "coming";
    let badge = '<span class="pv-badge pv-badge-coming">Soon</span>';
    if (avail && tk) badge = '<span class="pv-badge pv-badge-available">Video+file</span>';
    else if (avail) badge = '<span class="pv-badge pv-badge-available">File</span>';
    else if (tk) badge = '<span class="pv-badge pv-badge-available">Video</span>';

    const ico = '<svg class="pv-tt-ico" viewBox="0 0 24 24" width="11" height="11" aria-hidden="true"><path fill="currentColor" d="M16.5 3c.4 2.4 1.9 4.1 4.2 4.4v2.3c-1.5.1-2.9-.4-4.2-1.3v6.5c0 3.4-2.7 6.1-6.1 6.1S4.3 18.3 4.3 14.9s2.7-6.1 6.1-6.1c.3 0 .6 0 .9.1v2.5c-.3-.1-.6-.2-.9-.2-2 0-3.6 1.6-3.6 3.7s1.6 3.7 3.6 3.7 3.6-1.6 3.6-3.7V3h2.5z"/></svg>';
    const tkBtn = tk
      ? '<a class="pv-tiktok" href="' + tk + '" target="_blank" rel="noopener noreferrer" title="Xem trên TikTok">' + ico + ' TikTok</a>'
      : '';
    const fileBtn = avail
      ? '<a class="pv-download" href="' + (item.folder || "downloads/video-practice/") + fileName + '" download title="' + fileName + '">Tải file</a>'
      : '';
    const tags = (item.filterTags || [item.category]).join(" ");
    const hasVideo = !!tk;
    const isIdeaCta = item.id === "v16-Coming_soon" || String(item.category || "").indexOf("đóng góp") >= 0 || String(item.title || "").indexOf("Sắp ra mắt") >= 0;
    let voteRowHtml;
    if (isIdeaCta) {
      voteRowHtml =
        '<div class="pv-vote-row pv-vote-row-cta">' +
          '<button type="button" class="pv-cta-mini pv-cta-idea" data-open="feedback">💡 Gửi ý tưởng / thắc mắc</button>' +
          '<button type="button" class="pv-cta-mini pv-cta-file" data-open="file">📎 Gửi file Excel</button>' +
        "</div>";
    } else {
      const voteType = hasVideo ? "need_more_guide" : "need_guide";
      const voteLabel = hasVideo ? "Cần hướng dẫn thêm" : "Cần hướng dẫn";
      const voteHint = hasVideo
        ? "Cần admin ra video hướng dẫn thêm"
        : "Cần admin ra video hướng dẫn";
      const voted = hasVoted(item.id);
      const voteBtn = voted
        ? '<button type="button" class="pv-vote pv-vote-done" disabled>✓ Đã gửi</button>'
        : '<button type="button" class="pv-vote" data-vote-id="' + item.id + '" data-vote-type="' + voteType + '">' + voteLabel + "</button>";
      voteRowHtml =
        '<div class="pv-vote-row">' +
          voteBtn +
          '<span class="pv-vote-arrow" aria-hidden="true">→</span>' +
          '<span class="pv-vote-hint">' + voteHint + '</span>' +
        '</div>';
    }
    const num = localNum != null ? localNum : item.number;
    const skillRaw = item.skill || "";
    const skill = '<div class="pv-skill">' + (skillRaw ? highlightText(skillRaw, q) : "&nbsp;") + "</div>";
    const matched = !!(q && (
      String(item.title).toLowerCase().indexOf(q) >= 0 ||
      String(skillRaw).toLowerCase().indexOf(q) >= 0 ||
      String(item.category || "").toLowerCase().indexOf(q) >= 0
    ));

    return (
      '<article class="pv-line' + (matched ? " pv-line-hit" : "") + '" id="pv-item-' + item.id + '" data-status="' + status +
      '" data-category="' + tags + '" data-title="' + String(item.title).toLowerCase() + '" data-id="' + item.id + '">' +
        '<div class="pv-main">' +
          '<div class="pv-main-top">' +
            '<span class="pv-n">' + String(num).padStart(2, "0") + "</span>" +
            '<span class="pv-i">' + item.icon + "</span>" +
            '<span class="pv-t">' + highlightText(item.title, q) + "</span>" +
            badge +
          "</div>" +
          skill +
          voteRowHtml +
        "</div>" +
        '<div class="pv-a">' + tkBtn + fileBtn + "</div>" +
      "</article>"
    );
  }

  var __pvVoteBound = false;
  function bindVotes() {
    var grid = document.getElementById("pvGrid");
    if (!grid || __pvVoteBound) return;
    __pvVoteBound = true;
    grid.addEventListener("click", function (e) {
      var cta = e.target.closest(".pv-cta-mini");
      if (!cta) return;
      e.preventDefault();
      var open = cta.getAttribute("data-open");
      if (open === "feedback") {
        var b1 = document.getElementById("pvFeedbackBtn");
        if (b1) b1.click();
      } else if (open === "file") {
        var b2 = document.getElementById("pvFileBtn");
        if (b2) b2.click();
      }
    });

    grid.addEventListener("click", function (e) {
      var btn = e.target.closest(".pv-vote");
      if (!btn || btn.disabled) return;
      e.preventDefault();
      var id = btn.getAttribute("data-vote-id");
      var type = btn.getAttribute("data-vote-type") || "need_guide";
      var item = videoPracticeData.find(function (x) { return x.id === id; });
      if (!item) return;
      submitVote(item, type, btn);
    });
  }

  function render(filter, query) {
    const grid = document.getElementById("pvGrid");
    if (!grid) return;
    const q = (query || "").trim().toLowerCase();
    const f = filter || "all";
    const focusOne = f !== "all";

    const items = [];
    videoPracticeData.forEach(function (item) {
      if (f !== "all") {
        const cat = String(item.category || "");
        // exact or contains match for main topic
        if (cat !== f && cat.toLowerCase().indexOf(String(f).toLowerCase()) === -1) return;
      }
      if (q) {
        const hay = (item.title + " " + (item.skill || "") + " " + (item.category || "")).toLowerCase();
        if (hay.indexOf(q) === -1) return;
      }
      items.push(item);
    });

    if (!items.length) {
      grid.innerHTML = '<p class="pv-empty">Không tìm thấy bài phù hợp.</p>';
      bindVotes();
      return;
    }

    const groups = {};
    const order = [];
    items.forEach(function (item) {
      const g = item.category || "Khác";
      if (!groups[g]) { groups[g] = []; order.push(g); }
      groups[g].push(item);
    });

    let html = '<div class="pv-groups' + (focusOne ? " pv-groups-focus" : "") + '">';
    let firstHitId = null;
    order.forEach(function (g) {
      const list = groups[g].slice().sort(function (a, b) { return (a.number || 0) - (b.number || 0); });
      const tone = panelTone(g);
      const title = String(g).toUpperCase();
      html += '<section class="pv-panel ' + tone + (focusOne ? " pv-panel-focus" : "") + '">' +
        '<header class="pv-panel-h"><span class="pv-panel-name">' + escapeHtml(title) + '</span>' +
        '<span class="pv-panel-count">' + list.length + ' bài</span></header>' +
        '<div class="pv-panel-body">';
      list.forEach(function (item, idx) {
        if (q && !firstHitId) firstHitId = item.id;
        html += cardHTML(item, idx + 1, q);
      });
      html += '</div></section>';
    });
    html += '</div>';
    grid.innerHTML = html;
    bindVotes();

    if (q && firstHitId) {
      const el = document.getElementById("pv-item-" + firstHitId);
      if (el) {
        const body = el.closest(".pv-panel-body");
        if (body) body.scrollTop = Math.max(0, el.offsetTop - 8);
        try { el.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) {}
      }
    }
  }

  function init() {
    updateSummary();
    render("all", "");
    bindVotes();

    const search = document.getElementById("pvSearch");
    const filters = document.querySelectorAll(".pv-filter");
    let currentFilter = "all";

    if (search) {
      search.addEventListener("input", function () {
        render(currentFilter, search.value || "");
      });
      search.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          render(currentFilter, search.value || "");
        }
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
