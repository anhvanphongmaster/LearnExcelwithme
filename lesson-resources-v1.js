(() => {
  'use strict';
  if (window.__AVP_LESSON_RESOURCES_V1__) return;
  window.__AVP_LESSON_RESOURCES_V1__ = true;

  const FILES = {
    'f01-excel-workspace': [{ href: 'downloads/phim-tat-thuc-hanh.xlsx', label: 'Phim tat' }],
    'f02-data-entry-types': [
      { href: 'downloads/video-practice/input_01_dropdown.xlsx', label: 'Dropdown' },
      { href: 'downloads/video-practice/input_03_number_range.xlsx', label: 'Gioi han so' },
      { href: 'downloads/video-practice/input_04_date_validation.xlsx', label: 'Nhap ngay' },
      { href: 'downloads/video-practice/input_11_flash_fill.xlsx', label: 'Flash Fill' }
    ],
    'f03-formatting-display': [
      { href: 'downloads/video-practice/05_center_across.xlsx', label: 'Center Across' },
      { href: 'downloads/video-practice/06_so_viet.xlsx', label: 'So viet' },
      { href: 'downloads/video-practice/07_an_so_0.xlsx', label: 'An so 0' },
      { href: 'downloads/video-practice/28_conditional_format.xlsx', label: 'Conditional Format' }
    ],
    'f04-formulas-references': [{ href: 'downloads/cong-thuc-co-ban-thuc-hanh.xlsx', label: 'Cong thuc co ban' }],
    'f05-core-functions': [
      { href: 'downloads/video-practice/fx_01_sum_average.xlsx', label: 'SUM / AVERAGE' },
      { href: 'downloads/video-practice/fx_02_count.xlsx', label: 'COUNT' }
    ],
    'f06-data-table-structure': [{ href: 'downloads/filter-sort-thuc-hanh.xlsx', label: 'Sort & Filter' }],
    'd07-sort-filter': [
      { href: 'downloads/filter-sort-thuc-hanh.xlsx', label: 'Sort & Filter' },
      { href: 'downloads/video-practice/08_dan_dong_loc.xlsx', label: 'Dan vao dong loc' }
    ],
    'd08-find-replace': [{ href: 'downloads/find-replace-thuc-hanh.xlsx', label: 'Find / Replace' }],
    's10-text': [
      { href: 'downloads/xu-ly-text-thuc-hanh.xlsx', label: 'Xu ly van ban' },
      { href: 'downloads/video-practice/20_TEXTBEFORE.xlsx', label: 'TEXTBEFORE' },
      { href: 'downloads/video-practice/fx_08_text_basic.xlsx', label: 'Ham text' },
      { href: 'downloads/video-practice/fx_10_textjoin.xlsx', label: 'TEXTJOIN' }
    ],
    'd09-data-validation': [
      { href: 'downloads/video-practice/input_01_dropdown.xlsx', label: 'Dropdown' },
      { href: 'downloads/video-practice/input_07_custom_validation.xlsx', label: 'Custom validation' },
      { href: 'downloads/video-practice/input_13_dynamic_dropdown.xlsx', label: 'Dropdown dong' },
      { href: 'downloads/video-practice/input_14_dropdown_3level.xlsx', label: 'Dropdown 3 tang' }
    ],
    's12-clean-control': [
      { href: 'downloads/video-practice/09_so_nhin_nhu_so_SUM_0.xlsx', label: 'SUM = 0' },
      { href: 'downloads/video-practice/11_CHAR160.xlsx', label: 'CHAR 160' },
      { href: 'downloads/video-practice/25_xoa_trung_nhieu_cot.xlsx', label: 'Xoa trung' },
      { href: 'downloads/video-practice/21_Fill_Down.xlsx', label: 'Fill Down' }
    ],
    's07-logic': [
      { href: 'downloads/video-practice/27_if_ifs.xlsx', label: 'IF / IFS' },
      { href: 'downloads/video-practice/fx_03_if_basic.xlsx', label: 'IF' },
      { href: 'downloads/video-practice/fx_07_iferror.xlsx', label: 'IFERROR' }
    ],
    's08-conditional-aggregation': [
      { href: 'downloads/if-countif-sumif-thuc-hanh.xlsx', label: 'IF COUNTIF SUMIF' },
      { href: 'downloads/video-practice/26_sumifs_countifs.xlsx', label: 'SUMIFS / COUNTIFS' },
      { href: 'downloads/video-practice/fx_05_countif_sumif.xlsx', label: 'COUNTIF / SUMIF' }
    ],
    's09-lookup': [
      { href: 'downloads/vlookup-xlookup-thuc-hanh.xlsx', label: 'VLOOKUP / XLOOKUP' },
      { href: 'downloads/video-practice/14_XLOOKUP.xlsx', label: 'XLOOKUP' },
      { href: 'downloads/video-practice/fx_13_index_match.xlsx', label: 'INDEX / MATCH' }
    ],
    's11-date-time': [
      { href: 'downloads/ngay-gio-thuc-hanh.xlsx', label: 'Ngay gio' },
      { href: 'downloads/video-practice/10_10_kieu_ngay.xlsx', label: '10 kieu ngay' },
      { href: 'downloads/video-practice/24_ngay_dang_chu.xlsx', label: 'Ngay dang chu' },
      { href: 'downloads/video-practice/fx_11_dates.xlsx', label: 'Ham ngay' }
    ],
    'x19-advanced-formulas': [
      { href: 'downloads/video-practice/fx_16_sumproduct.xlsx', label: 'SUMPRODUCT' },
      { href: 'downloads/video-practice/fx_17_let.xlsx', label: 'LET' },
      { href: 'downloads/video-practice/fx_18_formula_audit.xlsx', label: 'Formula Audit' },
      { href: 'downloads/video-practice/23_AGGREGATE.xlsx', label: 'AGGREGATE' }
    ],
    'x20-dynamic-array': [{ href: 'downloads/video-practice/fx_14_dynamic_array.xlsx', label: 'Dynamic Array' }],
    'a13-excel-table': [{ href: 'downloads/excel-table-thuc-hanh.xlsx', label: 'Excel Table' }],
    'a14-pivottable': [
      { href: 'downloads/pivot-thuc-hanh.xlsx', label: 'PivotTable' },
      { href: 'downloads/video-practice/29_pivot_co_ban.xlsx', label: 'Pivot co ban' },
      { href: 'downloads/practice-lab/PivotTable-Practice.xlsx', label: 'Lab PivotTable' }
    ],
    'a15-kpi-analysis': [{ href: 'downloads/video-practice/fx_19_sales_kpi.xlsx', label: 'Sales KPI' }],
    'a18-report-audit-handover': [{ href: 'downloads/ban-giao-bao-cao-thuc-hanh.xlsx', label: 'Checklist ban giao' }],
    'a19-reconciliation': [{ href: 'downloads/reconciliation-thuc-hanh.xlsx', label: 'Reconciliation' }],
    'a16-charts-pareto': [
      { href: 'downloads/pareto-thuc-hanh.xlsx', label: 'Pareto' },
      { href: 'downloads/video-practice/28_conditional_format.xlsx', label: 'Conditional Format' }
    ],
    'a17-dashboard': [
      { href: 'downloads/video-practice/22_dashboard_thang.xlsx', label: 'Dashboard thang' },
      { href: 'downloads/practice-lab/Dashboard-Practice.xlsx', label: 'Lab Dashboard' }
    ],
    'v23-kpi-cards': [{ href: 'downloads/kpi-cards-thuc-hanh.xlsx', label: 'KPI Cards' }],
    'v24-slicer-timeline': [{ href: 'downloads/slicer-timeline-thuc-hanh.xlsx', label: 'Slicer & Timeline' }],
    'v25-dashboard-interaction': [
      { href: 'downloads/video-practice/22_dashboard_thang.xlsx', label: 'Dashboard thang' },
      { href: 'downloads/practice-lab/Dashboard-Practice.xlsx', label: 'Lab Dashboard' }
    ],
    'pq28-import-sources': [
      { href: 'downloads/video-practice/pq_01_import_table.xlsx', label: 'Import Table' },
      { href: 'downloads/video-practice/PowerQuery_DEMO.xlsx', label: 'Power Query Demo' },
      { href: 'downloads/PowerQuery-Practice-10-Files.zip', label: '10 file nguon PQ' }
    ],
    'x21-power-query-basics': [
      { href: 'downloads/video-practice/PowerQuery_DEMO.xlsx', label: 'Power Query Demo' },
      { href: 'downloads/video-practice/pq_01_import_table.xlsx', label: 'Import Table' },
      { href: 'downloads/video-practice/pq_02_change_types.xlsx', label: 'Doi kieu du lieu' }
    ],
    'pq30-transform-clean': [
      { href: 'downloads/video-practice/pq_03_columns.xlsx', label: 'Cot' },
      { href: 'downloads/video-practice/pq_04_filter_rows.xlsx', label: 'Loc dong' },
      { href: 'downloads/video-practice/pq_05_replace_clean.xlsx', label: 'Replace / Clean' }
    ],
    'pq31-schema-types': [
      { href: 'downloads/video-practice/pq_02_change_types.xlsx', label: 'Change Type' },
      { href: 'downloads/video-practice/pq_15_schema_drift.xlsx', label: 'Schema drift' }
    ],
    'x22-power-query-multi-source': [
      { href: 'downloads/video-practice/16_PQ_gop_thu_muc.xlsx', label: 'Gop thu muc' },
      { href: 'downloads/video-practice/15_Unpivot.xlsx', label: 'Unpivot' },
      { href: 'downloads/video-practice/pq_09_merge_exact.xlsx', label: 'Merge' },
      { href: 'downloads/video-practice/18_PQ_10_sheet.xlsx', label: '10 sheet' }
    ],
    'pq33-refresh-performance': [{ href: 'downloads/pq-refresh-staging-thuc-hanh.xlsx', label: 'PQ Staging' }],
    'x23-macro-vba': [{ href: 'downloads/vba-macro-thuc-hanh.xlsm', label: 'Macro ChayBaoCao' }],
    'vb35-object-model': [{ href: 'downloads/vba-object-model-thuc-hanh.xlsm', label: 'Object Model GhiKPI' }],
    'vb36-control-flow': [{ href: 'downloads/vba-control-flow-thuc-hanh.xlsm', label: 'If Loop LocDonNG' }],
    'vb37-performance-security': [{ href: 'downloads/vba-performance-security-thuc-hanh.xlsm', label: 'Performance XuLyNhanh' }],
    'x24-automation-workflow': [{ href: 'downloads/workflow-tu-dong-thuc-hanh.xlsx', label: 'Workflow' }],
    'c39-tool-selection': [{ href: 'downloads/chon-cong-cu-thuc-hanh.xlsx', label: 'Chon dung cong cu' }],
    'c40-sales-case': [
      { href: 'downloads/youtube-practice/Du_An_Sales_Du_Lieu_Tho.xlsx', label: 'Sales tho' },
      { href: 'downloads/youtube-practice/Du_An_Sales_Sach.xlsx', label: 'Sales sach' },
      { href: 'downloads/video-practice/fx_19_sales_kpi.xlsx', label: 'Sales KPI' }
    ],
    'c41-qc-case': [
      { href: 'downloads/bao-cao-qc.xlsx', label: 'Bao cao QC' },
      { href: 'downloads/sumproduct-qc-thuc-hanh.xlsx', label: 'SUMPRODUCT QC' },
      { href: 'downloads/conditional-formatting-qc-thuc-hanh.xlsx', label: 'CF QC' },
      { href: 'downloads/pareto-thuc-hanh.xlsx', label: 'Pareto' }
    ],
    'c42-end-to-end-case': [
      { href: 'downloads/video-practice/fx_20_full_case.xlsx', label: 'Case A-Z' },
      { href: 'downloads/PowerQuery-Practice-10-Files.zip', label: '10 file nguon PQ' },
      { href: 'downloads/youtube-practice/Du_An_Sales_Du_Lieu_Tho.xlsx', label: 'Sales tho' }
    ]
  };

  const EMPTY_NOTE = {};

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&', '<': '<', '>': '>', '"': '"', "'": '&#39;'
  }[ch]));

  const lessonId = () => new URLSearchParams(location.search).get('lesson') || '';

  function cardHtml(id) {
    const files = FILES[id] || [];
    if (!files.length) {
      const note = EMPTY_NOTE[id] || 'Bai nay chua gan file rieng.';
      return `<aside class="avp-lesson-files is-empty" data-avp-lesson-files data-lesson="${esc(id)}">
        <div class="avp-lesson-files-head"><span>FILE THUC HANH</span><strong>Chua co file rieng</strong></div>
        <p class="avp-lesson-files-note">${esc(note)}</p>
        <a class="avp-lesson-files-alt" href="practice-video.html">Mo khu thuc hanh</a>
      </aside>`;
    }
    return `<aside class="avp-lesson-files" data-avp-lesson-files data-lesson="${esc(id)}">
      <div class="avp-lesson-files-head"><span>FILE THUC HANH</span><strong>${files.length} file cho bai nay</strong></div>
      <p class="avp-lesson-files-note">Tai file, lam theo muc Lam ngay.</p>
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
