(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  let xlsxPromise = null;

  const HEADERS = ["Mã NV", "Họ tên", "Bộ phận", "Số lượng"];
  const DATA = [
    ["NV001","Nguyễn An","QC",12],
    ["NV002","Trần Bình","PE",18],
    ["NV003","Lê Chi","QC",15],
    ["NV004","Phạm Dũng","MFG",22],
    ["NV005","Hoàng Em","PE",16],
    ["NV006","Vũ Giang","QC",19],
    ["NV007","Đỗ Hạnh","MFG",14],
    ["NV008","Bùi Khánh","QC",21]
  ];

  const RAW = [
    HEADERS,
    DATA[0],["","","",""],
    DATA[1],DATA[2],["","","",""],
    DATA[3],DATA[4],["","","",""],
    DATA[5],DATA[6],["","","",""],
    DATA[7]
  ];

  function note(text, kind="") {
    const el = $("pgFileNote");
    if (!el) return;
    el.textContent = text;
    el.className = "pg-note" + (kind ? " " + kind : "");
  }

  function loadXLSX() {
    if (window.XLSX) return Promise.resolve(window.XLSX);
    if (xlsxPromise) return xlsxPromise;

    note("Đang mở bộ đọc Excel…");

    xlsxPromise = new Promise((resolve,reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
      s.async = true;
      s.onload = () => window.XLSX ? resolve(window.XLSX) : reject(new Error("XLSX_NOT_READY"));
      s.onerror = () => reject(new Error("XLSX_LOAD_FAILED"));
      document.head.appendChild(s);
    });

    return xlsxPromise;
  }

  const norm = v => {
    if (v === null || v === undefined) return "";
    if (typeof v === "number") return v;
    return String(v).trim();
  };

  const blankRow = row => (row || []).every(v => norm(v) === "");

  function sameHeaders(row) {
    return HEADERS.every((h,i) => norm(row?.[i]) === h);
  }

  function sameData(rows) {
    if (rows.length !== DATA.length) return false;
    return DATA.every((expected,r) =>
      expected.every((v,c) => String(norm(rows[r]?.[c])) === String(norm(v)))
    );
  }

  function render(checks) {
    const result = $("pgResult");
    if (!result) return;

    const score = checks.reduce((s,x) => s + (x.ok ? x.points : 0), 0);
    result.hidden = false;
    result.innerHTML = `
      <div class="pg-score">
        <strong>${score}</strong><span>/100</span>
      </div>
      <div class="pg-checks">
        ${checks.map(x => `
          <div class="pg-check ${x.ok ? "ok" : "bad"}">
            <b>${x.ok ? "✓" : "×"} ${x.label} · ${x.points}đ</b>
            <small>${x.detail}</small>
          </div>
        `).join("")}
      </div>
    `;
    note(score === 100 ? "Chấm xong: 100/100. Bài đã đạt." : `Chấm xong: ${score}/100. Xem chi tiết bên dưới.`, score === 100 ? "ok" : "warn");

    // Mọi lần nộp đều được ghi nhận ngay để chống spam.
    recordAttemptThenOffer(score);
  }

  async function downloadDemo() {
    const user = await window.AVPAccess?.requireLogin({
      next: "practice-video.html#grader",
      reason: "Đăng nhập để tải bài thực hành."
    });
    if (!user) return;

    try {
      const XLSX = await loadXLSX();
      const wb = XLSX.utils.book_new();

      const ws = XLSX.utils.aoa_to_sheet(RAW);
      ws["!cols"] = [{wch:12},{wch:22},{wch:14},{wch:12}];
      XLSX.utils.book_append_sheet(wb, ws, "DuLieu");

      const guide = XLSX.utils.aoa_to_sheet([
        ["BÀI THỰC HÀNH: XÓA DÒNG TRỐNG"],
        ["1. Mở sheet DuLieu."],
        ["2. Xóa toàn bộ các dòng trống."],
        ["3. Không sửa tiêu đề và dữ liệu."],
        ["4. Lưu file rồi quay lại website để nộp."]
      ]);
      guide["!cols"] = [{wch:58}];
      XLSX.utils.book_append_sheet(wb, guide, "HuongDan");

      XLSX.writeFile(wb, "AVP_BaiMau_XoaDongTrong.xlsx");
      note("Đã tạo file thực hành. Làm xong hãy nộp lại.", "ok");
    } catch(e) {
      console.error("[grader]", e);
      note("Không mở được bộ đọc Excel. Kiểm tra mạng rồi thử lại.", "bad");
    }
  }

  async function gradeFile(file) {
    if (!file) return;

    const user = await window.AVPAccess?.requireLogin({
      next: "practice-video.html#grader",
      reason: "Đăng nhập để nộp và chấm bài."
    });
    if (!user) return;
    if (!/\.(xlsx|xls)$/i.test(file.name)) {
      note("Chỉ nhận file Excel .xlsx hoặc .xls.", "bad");
      return;
    }

    try {
      const XLSX = await loadXLSX();
      note("Đang chấm file trên thiết bị…");

      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, {type:"array", cellDates:true});
      const hasSheet = wb.SheetNames.includes("DuLieu");
      let rows=[];

      if (hasSheet) {
        rows = XLSX.utils.sheet_to_json(wb.Sheets["DuLieu"], {
          header:1, defval:"", raw:true, blankrows:true
        });
      }

      const header = rows[0] || [];
      const body = rows.slice(1);
      const blanks = body.filter(blankRow).length;
      const dataRows = body.filter(r => !blankRow(r));

      render([
        {label:"Đúng sheet DuLieu", points:20, ok:hasSheet,
         detail:hasSheet ? "Tìm thấy sheet cần chấm." : "Không tìm thấy sheet DuLieu."},
        {label:"Giữ đúng tiêu đề", points:20, ok:hasSheet && sameHeaders(header),
         detail:hasSheet && sameHeaders(header) ? "4 tiêu đề vẫn đúng." : "Tiêu đề đã bị đổi hoặc sai vị trí."},
        {label:"Xóa hết dòng trống", points:30, ok:hasSheet && blanks===0,
         detail:!hasSheet ? "Chưa thể kiểm tra." : blanks===0 ? "Không còn dòng trống." : `Vẫn còn ${blanks} dòng trống.`},
        {label:"Giữ đủ dữ liệu", points:30, ok:hasSheet && sameData(dataRows),
         detail:!hasSheet ? "Chưa thể kiểm tra." : sameData(dataRows) ? "Đủ 8 dòng và dữ liệu không bị thay đổi." : `Hiện có ${dataRows.length}/8 dòng hoặc dữ liệu đã bị sửa.`}
      ]);
    } catch(e) {
      console.error("[grader]", e);
      note("Không đọc được file. Hãy lưu lại dưới dạng .xlsx rồi thử lại.", "bad");
    }
  }


  let pendingScore = null;
  let pendingAttempt = 1;
  let pendingAchievement = 0;

  async function getClient() {
    if (window.avpSupabase) return window.avpSupabase;
    const started = Date.now();
    while (Date.now() - started < 3500) {
      if (window.avpSupabase) return window.avpSupabase;
      await new Promise(r => setTimeout(r, 100));
    }
    return null;
  }

  async function getUser() {
    const sb = await getClient();
    if (!sb?.auth) return null;
    try {
      const r = await sb.auth.getUser();
      return r?.data?.user || null;
    } catch (e) {
      return null;
    }
  }

  function openPublishModal(score) {
    pendingScore = Number(score) || 0;
    $("pgPublishScore").textContent = String(pendingScore);
    $("pgPublishText").textContent =
      `Điểm bài ${pendingScore}/100 · Thành tích ${pendingAchievement} điểm · Lần thử ${pendingAttempt}.`;

    $("pgPublishModal").hidden = false;
    document.body.classList.add("pg-publish-open");
  }

  function closePublishModal() {
    if ($("pgPublishModal")) $("pgPublishModal").hidden = true;
    document.body.classList.remove("pg-publish-open");
  }


  async function recordAttemptThenOffer(score) {
    const user = await getUser();
    if (!user) return;

    const sb = await getClient();
    if (!sb?.rpc) {
      note("Chưa kết nối Supabase để ghi lượt làm.", "bad");
      return;
    }

    try {
      const { data, error } = await sb.rpc("practice_grader_record_attempt", {
        p_lesson_key: "clean_blank_rows_01",
        p_score: Math.max(0, Math.min(100, Number(score) || 0))
      });
      if (error) throw error;

      const attempt = Number(data?.attempt) || 1;
      const achievement = Number(data?.achievement_score) || 0;

      pendingAttempt = attempt;
      pendingAchievement = achievement;

      setTimeout(() => offerPublish(score), 220);
    } catch (e) {
      console.error("[practice grader] record attempt", e);
      note("Không ghi được lượt làm: " + (e?.message || "RPC lỗi"), "bad");
    }
  }

  async function offerPublish(score) {
    openPublishModal(score);
    const user = await getUser();
    if ($("pgPublishYes")) {
      $("pgPublishYes").textContent = user ? "🏆 Ghi thành tích" : "🔐 Đăng nhập & ghi điểm";
    }
    if ($("pgHideFromBoard")) $("pgHideFromBoard").hidden = !user;
  }

  async function publishScore() {
    const score = Math.max(0, Math.min(100, Number(pendingScore) || 0));
    const user = await getUser();

    if (!user) {
      location.href = "auth.html?next=" + encodeURIComponent("practice-video.html#grader");
      return;
    }

    const sb = await getClient();
    if (!sb?.rpc) {
      note("Chưa kết nối Supabase để ghi thành tích.", "bad");
      return;
    }

    const btn = $("pgPublishYes");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Đang ghi…";
    }

    try {
      const { error } = await sb.rpc("practice_grader_set_visibility", {
        p_visible: true
      });
      if (error) throw error;

      closePublishModal();
      note("Đã ghi thành tích lên bảng xếp hạng.", "ok");
      await loadLeaderboard();
    } catch (e) {
      console.error("[practice leaderboard] submit", e);
      note("Không ghi được thành tích: " + (e?.message || "RPC lỗi"), "bad");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "🏆 Ghi thành tích";
      }
    }
  }

  async function setPrivate() {
    const user = await getUser();
    if (user) {
      const sb = await getClient();
      try {
        await sb?.rpc?.("practice_grader_set_visibility", { p_visible: false });
      } catch (e) {}
    }
    closePublishModal();
    note("Điểm lần này không được đưa lên bảng xếp hạng.", "ok");
    await loadLeaderboard();
  }

  async function hideMyScore() {
    const user = await getUser();
    if (!user) return;

    const sb = await getClient();
    try {
      const { error } = await sb.rpc("practice_grader_set_visibility", { p_visible: false });
      if (error) throw error;
      closePublishModal();
      note("Đã ẩn thành tích của bạn khỏi bảng xếp hạng.", "ok");
      await loadLeaderboard();
    } catch (e) {
      note("Chưa ẩn được thành tích: " + (e?.message || "RPC lỗi"), "bad");
    }
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  async function loadLeaderboard() {
    const list = $("pgBoardList");
    if (!list) return;

    const sb = await getClient();
    if (!sb?.rpc) {
      list.innerHTML = '<li class="pg-board-empty">Chưa kết nối bảng xếp hạng.</li>';
      return;
    }

    list.innerHTML = '<li class="pg-board-empty">Đang tải thành tích…</li>';

    try {
      const { data, error } = await sb.rpc("practice_grader_leaderboard", { p_limit: 50 });
      if (error) throw error;

      const rows = Array.isArray(data) ? data : [];
      if (!rows.length) {
        list.innerHTML = '<li class="pg-board-empty">Chưa có thành tích công khai — bạn có thể là người đầu tiên.</li>';
        return;
      }

      list.innerHTML = rows.map((row, i) => {
        const rank = Number(row.rank_no) || (i + 1);
        const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}.`;
        return `
          <li class="pg-board-row${row.is_me ? " me" : ""}">
            <span class="pg-board-rank">${medal}</span>
            <span class="pg-board-name">${escapeHtml(row.display_name || "Học viên")}${row.is_me ? " · Bạn" : ""}</span>
            <span class="pg-board-score">${Number(row.best_score) || 0}<small>/100</small></span>
            <span class="pg-board-meta">${Number(row.passed_lessons) || 0} bài đạt · ${Number(row.attempts) || 0} lượt</span>
          </li>
        `;
      }).join("");
    } catch (e) {
      console.error("[practice leaderboard] list", e);
      list.innerHTML = '<li class="pg-board-empty">BXH chưa tải được.</li>';
    }
  }

  function init() {
    $("pgDownloadDemo")?.addEventListener("click", downloadDemo);
    $("pgSubmitDemo")?.addEventListener("change", e => {
      const file = e.target.files?.[0];
      gradeFile(file);
      e.target.value = "";
    });

    $("pgPublishYes")?.addEventListener("click", publishScore);
    $("pgPublishPrivate")?.addEventListener("click", setPrivate);
    $("pgHideFromBoard")?.addEventListener("click", hideMyScore);
    $("pgPublishClose")?.addEventListener("click", closePublishModal);
    document.querySelectorAll("[data-pg-publish-close]").forEach(el => {
      el.addEventListener("click", closePublishModal);
    });

    $("pgBoardRefresh")?.addEventListener("click", loadLeaderboard);

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !$("pgPublishModal")?.hidden) closePublishModal();
    });

    loadLeaderboard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
