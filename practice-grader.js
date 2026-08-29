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
  }

  async function downloadDemo() {
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

  function init() {
    $("pgDownloadDemo")?.addEventListener("click", downloadDemo);
    $("pgSubmitDemo")?.addEventListener("change", e => {
      const file = e.target.files?.[0];
      gradeFile(file);
      e.target.value = "";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
