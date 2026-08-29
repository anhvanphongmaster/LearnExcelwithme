(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const EXPECTED_HEADERS = ["Mã NV", "Họ tên", "Bộ phận", "Số lượng"];
  const EXPECTED_ROWS = [
    ["NV001", "Nguyễn An", "QC", 12],
    ["NV002", "Trần Bình", "PE", 18],
    ["NV003", "Lê Chi", "QC", 15],
    ["NV004", "Phạm Dũng", "MFG", 22],
    ["NV005", "Hoàng Em", "PE", 16],
    ["NV006", "Vũ Giang", "QC", 19],
    ["NV007", "Đỗ Hạnh", "MFG", 14],
    ["NV008", "Bùi Khánh", "QC", 21]
  ];

  const RAW_ROWS = [
    EXPECTED_HEADERS,
    EXPECTED_ROWS[0],
    ["", "", "", ""],
    EXPECTED_ROWS[1],
    EXPECTED_ROWS[2],
    ["", "", "", ""],
    EXPECTED_ROWS[3],
    EXPECTED_ROWS[4],
    ["", "", "", ""],
    EXPECTED_ROWS[5],
    EXPECTED_ROWS[6],
    ["", "", "", ""],
    EXPECTED_ROWS[7]
  ];

  function normalize(v) {
    if (v === null || v === undefined) return "";
    if (typeof v === "number") return v;
    return String(v).trim();
  }

  function isBlankRow(row) {
    return (row || []).every((v) => normalize(v) === "");
  }

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function setStatus(text, kind) {
    const el = $("avpGraderStatus");
    if (!el) return;
    el.textContent = text;
    el.className = "avp-grader-status" + (kind ? " " + kind : "");
  }

  function downloadPracticeFile() {
    if (!window.XLSX) {
      setStatus("Không tải được thư viện Excel. Hãy kiểm tra mạng rồi thử lại.", "bad");
      return;
    }

    const ws = XLSX.utils.aoa_to_sheet(RAW_ROWS);
    ws["!cols"] = [
      { wch: 12 },
      { wch: 22 },
      { wch: 14 },
      { wch: 12 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DuLieu");

    const note = [
      ["BÀI THỰC HÀNH: XÓA DÒNG TRỐNG"],
      ["Yêu cầu"],
      ["1. Mở sheet DuLieu."],
      ["2. Xóa toàn bộ các dòng trống."],
      ["3. Không sửa tiêu đề và dữ liệu."],
      ["4. Lưu file rồi quay lại website để nộp."],
      [""],
      ["Hệ thống sẽ tự chấm theo rule, không so nguyên file."]
    ];
    const wsNote = XLSX.utils.aoa_to_sheet(note);
    wsNote["!cols"] = [{ wch: 58 }];
    XLSX.utils.book_append_sheet(wb, wsNote, "HuongDan");

    XLSX.writeFile(wb, "AVP_BaiMau_XoaDongTrong.xlsx");
    setStatus("Đã tạo file thực hành. Làm xong hãy nộp lại ngay ở đây.", "ok");
  }

  function sameHeaders(row) {
    return EXPECTED_HEADERS.every((h, i) => normalize(row?.[i]) === h);
  }

  function sameData(actual) {
    if (actual.length !== EXPECTED_ROWS.length) return false;

    for (let r = 0; r < EXPECTED_ROWS.length; r++) {
      for (let c = 0; c < EXPECTED_HEADERS.length; c++) {
        const a = normalize(actual[r]?.[c]);
        const e = normalize(EXPECTED_ROWS[r]?.[c]);

        if (String(a) !== String(e)) return false;
      }
    }
    return true;
  }

  function renderResult(result) {
    const box = $("avpGraderResult");
    if (!box) return;

    box.hidden = false;
    box.innerHTML = `
      <div class="avp-score-ring">
        <strong>${result.score}</strong>
        <span>/100</span>
      </div>

      <div class="avp-grade-copy">
        <h3>${result.score === 100 ? "Hoàn thành xuất sắc" : result.score >= 70 ? "Gần đúng rồi" : "Cần sửa thêm"}</h3>

        <div class="avp-grade-items">
          ${result.items.map(item => `
            <div class="avp-grade-item ${item.ok ? "pass" : "fail"}">
              <span>${item.ok ? "✓" : "×"}</span>
              <div>
                <b>${esc(item.label)} · ${item.points}đ</b>
                <small>${esc(item.detail)}</small>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  async function gradeFile(file) {
    if (!file) return;

    if (!window.XLSX) {
      setStatus("Không tải được thư viện Excel. Hãy kiểm tra mạng rồi thử lại.", "bad");
      return;
    }

    if (!/\.(xlsx|xls)$/i.test(file.name)) {
      setStatus("Chỉ nhận file Excel .xlsx hoặc .xls.", "bad");
      return;
    }

    setStatus("Đang đọc và chấm file trên thiết bị…");

    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array", cellDates: true });

      const hasSheet = wb.SheetNames.includes("DuLieu");
      let rows = [];

      if (hasSheet) {
        rows = XLSX.utils.sheet_to_json(wb.Sheets["DuLieu"], {
          header: 1,
          defval: "",
          raw: true,
          blankrows: true
        });
      }

      const header = rows[0] || [];
      const body = rows.slice(1);

      const blankCount = body.filter(isBlankRow).length;
      const nonBlankRows = body.filter((r) => !isBlankRow(r));

      const checks = [
        {
          label: "Đúng sheet DuLieu",
          points: 20,
          ok: hasSheet,
          detail: hasSheet ? "Tìm thấy sheet cần chấm." : "Không tìm thấy sheet DuLieu."
        },
        {
          label: "Giữ đúng tiêu đề",
          points: 20,
          ok: hasSheet && sameHeaders(header),
          detail: hasSheet && sameHeaders(header)
            ? "4 tiêu đề vẫn đúng."
            : "Tiêu đề đã bị đổi hoặc sai vị trí."
        },
        {
          label: "Xóa hết dòng trống",
          points: 30,
          ok: hasSheet && blankCount === 0,
          detail: !hasSheet
            ? "Chưa thể kiểm tra."
            : blankCount === 0
              ? "Không còn dòng trống."
              : `Vẫn còn ${blankCount} dòng trống.`
        },
        {
          label: "Giữ đủ dữ liệu",
          points: 30,
          ok: hasSheet && sameData(nonBlankRows),
          detail: !hasSheet
            ? "Chưa thể kiểm tra."
            : sameData(nonBlankRows)
              ? "Đủ 8 dòng và dữ liệu không bị thay đổi."
              : `Hiện có ${nonBlankRows.length}/8 dòng đúng cấu trúc hoặc dữ liệu đã bị sửa.`
        }
      ];

      const score = checks.reduce((sum, x) => sum + (x.ok ? x.points : 0), 0);

      renderResult({ score, items: checks });
      setStatus(
        score === 100
          ? "Chấm xong: 100/100. Bài đã đạt."
          : `Chấm xong: ${score}/100. Xem phần chi tiết bên dưới.`,
        score === 100 ? "ok" : "warn"
      );

    } catch (err) {
      console.error("[practice-grader]", err);
      setStatus("Không đọc được file này. Hãy lưu lại dưới dạng .xlsx rồi thử lại.", "bad");
    }
  }

  function init() {
    const dl = $("avpGraderDownload");
    const input = $("avpGraderFile");

    if (dl) dl.addEventListener("click", downloadPracticeFile);
    if (input) {
      input.addEventListener("change", () => {
        const file = input.files && input.files[0];
        gradeFile(file);
        input.value = "";
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
