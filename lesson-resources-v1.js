(() => {
  'use strict';
  if (window.__AVP_LESSON_RESOURCES_V1__) return;
  window.__AVP_LESSON_RESOURCES_V1__ = true;

  const FILES = {
    'f01-excel-workspace': [{ href: 'downloads/phim-tat-thuc-hanh.xlsx', label: 'Phím tắt — file thực hành' }],
    'f02-data-entry-types': [
      { href: 'downloads/video-practice/input_01_dropdown.xlsx', label: 'Dropdown nhập liệu' },
      { href: 'downloads/video-practice/input_03_number_range.xlsx', label: 'Giới hạn số' },
      { href: 'downloads/video-practice/input_04_date_validation.xlsx', label: 'Nhập ngày hợp lệ' },
      { href: 'downloads/video-practice/input_11_flash_fill.xlsx', label: 'Flash Fill' }
    ],
    'f03-formatting-display': [
      { href: 'downloads/video-practice/05_center_across.xlsx', label: 'Center Across' },
      { href: 'downloads/video-practice/06_so_viet.xlsx', label: 'Số viết' },
      { href: 'downloads/video-practice/07_an_so_0.xlsx', label: 'Ẩn số 0' },
      { href: 'downloads/video-practice/28_conditional_format.xlsx', label: 'Conditional Format' }
    ],
    'f04-formulas-references': [{ href: 'downloads/cong-thuc-co-ban-thuc-hanh.xlsx', label: 'Công thức cơ bản' }],
    'f05-core-functions': [
      { href: 'downloads/video-practice/fx_01_sum_average.xlsx', label: 'SUM / AVERAGE' },
      { href: 'downloads/video-practice/fx_02_count.xlsx', label: 'COUNT' }
    ],
    'f06-data-table-structure': [{ href: 'downloads/filter-sort-thuc-hanh.xlsx', label: 'Sort & Filter — cấu trúc bảng' }],
    'd07-sort-filter': [
      { href: 'downloads/filter-sort-thuc-hanh.xlsx', label: 'Sort & Filter' },
      { href: 'downloads/video-practice/08_dan_dong_loc.xlsx', label: 'Dán vào dòng lọc' }
    ],
    'd08-find-replace': [{ href: 'downloads/xu-ly-text-thuc-hanh.xlsx', label: 'Xử lý text (gợi ý Find/Replace)' }],
    's10-text': [
      { href: 'downloads/xu-ly-text-thuc-hanh.xlsx', label: 'Xử lý văn bản' },
      { href: 'downloads/video-practice/20_TEXTBEFORE.xlsx', label: 'TEXTBEFORE' },
      { href: 'downloads/video-practice/fx_08_text_basic.xlsx', label: 'Hàm text cơ bản' },
      { href: 'downloads/video-practice/fx_10_textjoin.xlsx', label: 'TEXTJOIN' }
    ],
    'd09-data-validation': [
      { href: 'downloads/video-practice/input_01_dropdown.xlsx', label: 'Dropdown' },
      { href: 'downloads/video-practice/input_07_custom_validation.xlsx', label: 'Custom validation' },
      { href: 'downloads/video-practice/input_13_dynamic_dropdown.xlsx', label: 'Dropdown động' },
      { href: 'downloads/video-practice/input_14_dropdown_3level.xlsx', label: 'Dropdown 3 tầng' }
    ],
    's12-clean-control': [
      { href: 'downloads/video-practice/09_so_nhin_nhu_so_SUM_0.xlsx', label: 'Số nhìn như số — SUM = 0' },
      { href: 'downloads/video-practice/11_CHAR160.xlsx', label: 'CHAR 160' },
      { href: 'downloads/video-practice/25_xoa_trung_nhieu_cot.xlsx', label: 'Xóa trùng nhiều cột' },
      { href: 'downloads/video-practice/21_Fill_Down.xlsx', label: 'Fill Down' }
    ],
    's07-logic': [
      { href: 'downloads/video-practice/27_if_ifs.xlsx', label: 'IF / IFS' },
      { href: 'downloads/video-practice/fx_03_if_basic.xlsx', label: 'IF cơ bản' },
      { href: 'downloads/video-practice/fx_07_iferror.xlsx', label: 'IFERROR' }
    ],
    's08-conditional-aggregation': [
      { href: 'downloads/if-countif-sumif-thuc-hanh.xlsx', label: 'IF · COUNTIF · SUMIF' },
      { href: 'downloads/video-practice/26_sumifs_countifs.xlsx', label: 'SUMIFS / COUNTIFS' },
      { href: 'downloads/video-practice/fx_05_countif_sumif.xlsx', label: 'COUNTIF / SUMIF' }
    ],
    's09-lookup': [
      { href: 'downloads/vlookup-xlookup-thuc-hanh.xlsx', label: 'VLOOKUP / XLOOKUP' },
      { href: 'downloads/video-practice/14_XLOOKUP.xlsx', label: 'XLOOKUP' },
      { href: 'downloads/video-practice/fx_13_index_match.xlsx', label: 'INDEX / MATCH' }
    ],
    's11-date-time': [
      { href: 'downloads/ngay-gio-thuc-hanh.xlsx', label: 'Ngày giờ' },
      { href: 'downloads/video-practice/10_10_kieu_ngay.xlsx', label: '10 kiểu ngày' },
      { href: 'downloads/video-practice/24_ngay_dang_chu.xlsx', label: 'Ngày dạng chữ' },
      { href: 'downloads/video-practice/fx_11_dates.xlsx', label: 'Hàm ngày' }
    ],
    'x19-advanced-formulas': [
      { href: 'downloads/video-practice/fx_16_sumproduct.xlsx', label: 'SUMPRODUCT' },
      { href: 'downloads/video-practice/fx_17_let.xlsx', label: 'LET' },
      { href: 'downloads/video-practice/fx_18_formula_audit.xlsx', label: 'Formula Audit' },
      { href: 'downloads/video-practice/23_AGGREGATE.xlsx', label: 'AGGREGATE' }
    ],
    'x20-dynamic-array': [{ href: 'downloads/video-practice/fx_14_dynamic_array.xlsx', label: 'Dynamic Array' }],
    'a13-excel-table': [{ href: 'downloads/filter-sort-thuc-hanh.xlsx', label: 'Bảng nguồn (gợi ý Table)' }],
    'a14-pivottable': [
      { href: 'downloads/pivot-thuc-hanh.xlsx', label: 'PivotTable' },
      { href: 'downloads/video-practice/29_pivot_co_ban.xlsx', label: 'Pivot cơ bản' },
      { href: 'downloads/practice-lab/PivotTable-Practice.xlsx', label: 'Lab PivotTable' }
    ],
    'a15-kpi-analysis': [{ href: 'downloads/video-practice/fx_19_sales_kpi.xlsx', label: 'Sales KPI' }],
    'a18-report-audit-handover': [{ href: 'downloads/bao-cao-qc.xlsx', label: 'Báo cáo QC — bàn giao' }],
    'a19-reconciliation': [{ href: 'downloads/video-practice/pq_10_left_anti.xlsx', label: 'Left Anti — dòng lệch' }],
    'a16-charts-pareto': [
      { href: 'downloads/pareto-thuc-hanh.xlsx', label: 'Pareto' },
      { href: 'downloads/video-practice/28_conditional_format.xlsx', label: 'Conditional Format' }
    ],
    'a17-dashboard': [
      { href: 'downloads/video-practice/22_dashboard_thang.xlsx', label: 'Dashboard tháng' },
      { href: 'downloads/practice-lab/Dashboard-Practice.xlsx', label: 'Lab Dashboard' },
      { href: 'downloads/youtube-practice/Kien_Thuc_Tip_Trick_Pivot_Dashboard.xlsx', label: 'Tip Pivot / Dashboard' }
    ],
    'v23-kpi-cards': [{ href: 'downloads/video-practice/22_dashboard_thang.xlsx', label: 'Dashboard tháng (KPI)' }],
    'v24-slicer-timeline': [{ href: 'downloads/practice-lab/Dashboard-Practice.xlsx', label: 'Lab Dashboard — Slicer' }],
    'v25-dashboard-interaction': [
      { href: 'downloads/video-practice/22_dashboard_thang.xlsx', label: 'Dashboard tháng' },
      { href: 'downloads/practice-lab/Dashboard-Practice.xlsx', label: 'Lab Dashboard' }
    ],
    'pq28-import-sources': [
      { href: 'downloads/video-practice/pq_01_import_table.xlsx', label: 'Import Table' },
      { href: 'downloads/video-practice/PowerQuery_DEMO.xlsx', label: 'Power Query Demo' },
      { href: 'downloads/PowerQuery-Practice-10-Files.zip', label: '10 file nguồn PQ' }
    ],
    'x21-power-query-basics': [
      { href: 'downloads/video-practice/PowerQuery_DEMO.xlsx', label: 'Power Query Demo' },
      { href: 'downloads/video-practice/pq_01_import_table.xlsx', label: 'Import Table' },
      { href: 'downloads/video-practice/pq_02_change_types.xlsx', label: 'Đổi kiểu dữ liệu' }
    ],
    'pq30-transform-clean': [
      { href: 'downloads/video-practice/pq_03_columns.xlsx', label: 'Cột' },
      { href: 'downloads/video-practice/pq_04_filter_rows.xlsx', label: 'Lọc dòng' },
      { href: 'downloads/video-practice/pq_05_replace_clean.xlsx', label: 'Replace / Clean' }
    ],
    'pq31-schema-types': [
      { href: 'downloads/video-practice/pq_02_change_types.xlsx', label: 'Change Type' },
      { href: 'downloads/video-practice/pq_15_schema_drift.xlsx', label: 'Schema drift' }
    ],
    'x22-power-query-multi-source': [
      { href: 'downloads/video-practice/16_PQ_gop_thu_muc.xlsx', label: 'Gộp thư mục' },
      { href: 'downloads/video-practice/15_Unpivot.xlsx', label: 'Unpivot' },
      { href: 'downloads/video-practice/pq_09_merge_exact.xlsx', label: 'Merge' },
      { href: 'downloads/video-practice/18_PQ_10_sheet.xlsx', label: '10 sheet' }
    ],
    'pq33-refresh-performance': [
      { href: 'downloads/video-practice/pq_17_error_audit.xlsx', label: 'Error audit' },
      { href: 'downloads/video-practice/pq_18_parameters.xlsx', label: 'Parameters' }
    ],
    'x24-automation-workflow': [{ href: 'downloads/video-practice/fx_20_full_case.xlsx', label: 'Case công thức tổng hợp' }],
    'c40-sales-case': [
      { href: 'downloads/youtube-practice/Du_An_Sales_Du_Lieu_Tho.xlsx', label: 'Sales — dữ liệu thô' },
      { href: 'downloads/youtube-practice/Du_An_Sales_Sach.xlsx', label: 'Sales — đã sạch' },
      { href: 'downloads/video-practice/fx_19_sales_kpi.xlsx', label: 'Sales KPI' }
    ],
    'c41-qc-case': [
      { href: 'downloads/bao-cao-qc.xlsx', label: 'Báo cáo QC' },
      { href: 'downloads/sumproduct-qc-thuc-hanh.xlsx', label: 'SUMPRODUCT QC' },
      { href: 'downloads/conditional-formatting-qc-thuc-hanh.xlsx', label: 'CF QC' },
      { href: 'downloads/pareto-thuc-hanh.xlsx', label: 'Pareto' }
    ],
    'c42-end-to-end-case': [
      { href: 'downloads/video-practice/fx_20_full_case.xlsx', label: 'Case A–Z' },
      { href: 'downloads/PowerQuery-Practice-10-Files.zip', label: '10 file nguồn PQ' },
      { href: 'downloads/youtube-practice/Du_An_Sales_Du_Lieu_Tho.xlsx', label: 'Sales thô' }
    ]
  };

  const EMPTY_NOTE = {
    'x23-macro-vba': 'Module VBA chưa có file .xlsm trên repo. Học phần lý thuyết rồi luyện trên workbook đang làm.',
    'vb35-object-model': 'Chưa có file .xlsm Object Model. Giữ nguyên bài đọc — file sẽ gắn vào đây khi có.',
    'vb36-control-flow': 'Chưa có file .xlsm If/Loop. Giữ nguyên bài đọc — file sẽ gắn vào đây khi có.',
    'vb37-performance-security': 'Chưa có file .xlsm tối ưu/bảo mật. Giữ nguyên bài đọc — file sẽ gắn vào đây khi có.',
    'c39-tool-selection': 'Bài chọn công cụ — chưa có bộ 4 cách giải cùng một dữ liệu. Dùng case Sales/QC ở hai bài kế tiếp.'
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&', '<': '<', '>': '>', '"': '"', "'": '&#39;'
  }[ch]));

  const lessonId = () => new URLSearchParams(location.search).get('lesson') || '';

  function cardHtml(id) {
    const files = FILES[id] || [];
    if (!files.length) {
      const note = EMPTY_NOTE[id] || 'Bài này chưa gắn file riêng. Dùng khu thực hành chung hoặc file module liền kề.';
      return `<aside class="avp-lesson-files is-empty" data-avp-lesson-files data-lesson="${esc(id)}">
        <div class="avp-lesson-files-head"><span>FILE THỰC HÀNH</span><strong>Chưa có file riêng</strong></div>
        <p class="avp-lesson-files-note">${esc(note)}</p>
        <a class="avp-lesson-files-alt" href="practice-video.html">Mở khu thực hành →</a>
      </aside>`;
    }
    return `<aside class="avp-lesson-files" data-avp-lesson-files data-lesson="${esc(id)}">
      <div class="avp-lesson-files-head"><span>FILE THỰC HÀNH</span><strong>${files.length} file cho bài này</strong></div>
      <p class="avp-lesson-files-note">Tải file, làm theo mục Làm ngay trong từng phần. Cùng một kiểu card cho mọi bài.</p>
      <div class="avp-lesson-files-list">${files.map(file =>
        `<a class="avp-lesson-file" href="${esc(file.href)}" download><i>XLS</i><span>${esc(file.label)}</span></a>`).join('')}</div>
    </aside>`;
  }

  function paint() {
    const intro = document.getElementById('kvIntro');
    if (!intro) return;
    const id = lessonId();
    const existing = intro.querySelector('[data-avp-lesson-files]');
    if (existing && existing.getAttribute('data-lesson') === id) return;
    if (existing) existing.remove();
    const html = cardHtml(id);
    const start = intro.querySelector('.lp-start-here-v2');
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    const node = wrap.firstElementChild;
    if (start && start.nextSibling) intro.insertBefore(node, start.nextSibling);
    else if (start) start.after(node);
    else intro.insertAdjacentElement('afterbegin', node);
  }

  function boot() {
    paint();
    const intro = document.getElementById('kvIntro');
    if (!intro || intro.dataset.avpFilesObs === '1') return;
    intro.dataset.avpFilesObs = '1';
    new MutationObserver(paint).observe(intro, { childList: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
