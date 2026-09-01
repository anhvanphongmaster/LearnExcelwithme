/**
 * Video practice library — data + render
 * 01–04: Power Query cũ (đã có file)
 * 05–22: 18 video sắp ra (Coming soon cho đến khi zip nằm trong manifest)
 */
(function () {
  const videoPracticeData = [
    {
        "id": "c2-sum-text",
        "number": 1,
        "icon": "0",
        "title": "Số nhìn như số nhưng SUM ra 0",
        "category": "Làm sạch dữ liệu",
        "skill": "VALUE • Convert to Number • Paste Special Multiply",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "file": "09_so_nhin_nhu_so_SUM_0.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Cơ bản"
    },
    {
        "id": "clean-02-blank",
        "category": "Làm sạch dữ liệu",
        "number": 2,
        "icon": "🧽",
        "title": "Xóa dòng trống và ô trống đúng cách",
        "skill": "Go To Special • Filter blanks • không xóa nhầm dữ liệu",
        "file": "clean_02_blank_rows.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "clean-03-case",
        "category": "Làm sạch dữ liệu",
        "number": 3,
        "icon": "🔤",
        "title": "Chuẩn hóa chữ HOA/thường/tên riêng",
        "skill": "UPPER • LOWER • PROPER • TRIM",
        "file": "clean_03_case_text.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "clean-04-split",
        "category": "Làm sạch dữ liệu",
        "number": 4,
        "icon": "✂️",
        "title": "Tách dữ liệu dính trong một cột",
        "skill": "Text to Columns • LEFT/RIGHT/MID • delimiter",
        "file": "clean_04_split_text.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "v04-so-viet",
        "number": 5,
        "icon": "VN",
        "title": "Số kiểu Việt 1.234.567 Excel không cộng",
        "category": "Làm sạch dữ liệu",
        "skill": "SUBSTITUTE • VALUE • dấu chấm nghìn",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "file": "06_so_viet.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Cơ bản"
    },
    {
        "id": "video-01",
        "number": 6,
        "icon": "🧹",
        "title": "Làm sạch dữ liệu • Cột trùng",
        "category": "Làm sạch dữ liệu",
        "skill": "Trim • Clean • Kiểu dữ liệu • Column Quality",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "file": "01_PowerQuery_DEMO.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Cơ bản"
    },
    {
        "id": "clean-07-leadingzero",
        "category": "Làm sạch dữ liệu",
        "number": 7,
        "icon": "0️⃣",
        "title": "Giữ mã có số 0 ở đầu",
        "skill": "Text format • TEXT • Custom format",
        "file": "clean_07_leading_zero.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "clean-08-nonprint",
        "category": "Làm sạch dữ liệu",
        "number": 8,
        "icon": "🫥",
        "title": "Xóa ký tự ẩn xuống dòng trong ô",
        "skill": "CLEAN • SUBSTITUTE • CHAR(10)",
        "file": "clean_08_nonprinting.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "clean-09-phone",
        "category": "Làm sạch dữ liệu",
        "number": 9,
        "icon": "📞",
        "title": "Chuẩn hóa số điện thoại lộn xộn",
        "skill": "SUBSTITUTE • RIGHT • TEXT • chuẩn 10 số",
        "file": "clean_09_phone.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "clean-10-email",
        "category": "Làm sạch dữ liệu",
        "number": 10,
        "icon": "✉️",
        "title": "Phát hiện email sai định dạng",
        "skill": "SEARCH • IF • ký tự @ và dấu chấm",
        "file": "clean_10_email.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "clean-11-error",
        "category": "Làm sạch dữ liệu",
        "number": 11,
        "icon": "⚠️",
        "title": "Làm sạch ô lỗi #N/A, #VALUE!, #DIV/0!",
        "skill": "IFERROR • IFNA • kiểm tra nguồn lỗi",
        "file": "clean_11_formula_errors.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "clean-12-mixed",
        "category": "Làm sạch dữ liệu",
        "number": 12,
        "icon": "🧩",
        "title": "Một cột trộn số, text và ngày",
        "skill": "TYPE • ISTEXT • ISNUMBER • chuẩn kiểu dữ liệu",
        "file": "clean_12_mixed_types.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "v01-char160",
        "number": 13,
        "icon": "👻",
        "title": "Khoảng trắng ma CHAR(160)",
        "category": "Làm sạch dữ liệu",
        "skill": "LEN • CODE • MID • SUBSTITUTE CHAR(160)",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "file": "11_CHAR160.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Trung cấp"
    },
    {
        "id": "clean-14-dup-one",
        "category": "Làm sạch dữ liệu",
        "number": 14,
        "icon": "👥",
        "title": "Tìm và xử lý trùng theo một khóa",
        "skill": "COUNTIF • Conditional Formatting • Remove Duplicates",
        "file": "clean_14_duplicate_key.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "clean-dup-multi",
        "number": 15,
        "icon": "🧬",
        "title": "Xóa trùng theo nhiều cột",
        "category": "Làm sạch dữ liệu",
        "skill": "Remove Duplicates • UNIQUE • điều kiện 2–3 cột",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "file": "25_xoa_trung_nhieu_cot.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Nâng cao"
    },
    {
        "id": "clean-16-outlier",
        "category": "Làm sạch dữ liệu",
        "number": 16,
        "icon": "📏",
        "title": "Bắt giá trị bất thường trước khi báo cáo",
        "skill": "MIN/MAX • MEDIAN • ngưỡng nghiệp vụ",
        "file": "clean_16_outliers.xlsx",
        "level": "Nâng cao",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "clean-17-reconcile",
        "category": "Làm sạch dữ liệu",
        "number": 17,
        "icon": "🕵️",
        "title": "Tìm bản ghi bị thiếu giữa hai danh sách",
        "skill": "XLOOKUP • COUNTIF • đối soát mã",
        "file": "clean_17_reconcile.xlsx",
        "level": "Nâng cao",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "clean-18-quality",
        "category": "Làm sạch dữ liệu",
        "number": 18,
        "icon": "🧪",
        "title": "Tạo cột kiểm tra chất lượng dữ liệu",
        "skill": "IF • AND/OR • cờ lỗi nhiều điều kiện",
        "file": "clean_18_quality_flag.xlsx",
        "level": "Nâng cao",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "clean-date-text",
        "number": 19,
        "icon": "📅",
        "title": "Ngày dạng chữ → ngày thật (DATEVALUE)",
        "category": "Làm sạch dữ liệu",
        "skill": "DATEVALUE • Text to Columns • chuẩn dd/mm/yyyy",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "file": "24_ngay_dang_chu.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Nâng cao"
    },
    {
        "id": "clean-20-case",
        "category": "Làm sạch dữ liệu",
        "number": 20,
        "icon": "🏁",
        "title": "Case tổng hợp: cứu một file dữ liệu bẩn",
        "skill": "Trim • kiểu dữ liệu • trùng • ngày • lỗi • đối soát",
        "file": "clean_20_full_case.xlsx",
        "level": "Case thực tế",
        "filterTags": [
            "Làm sạch dữ liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "pq-01-import",
        "category": "Power Query",
        "number": 1,
        "icon": "📥",
        "title": "Nạp bảng Excel vào Power Query đúng chuẩn",
        "skill": "From Table/Range • Headers • Data Type",
        "file": "pq_01_import_table.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Power Query"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "pq-02-types",
        "category": "Power Query",
        "number": 2,
        "icon": "🔢",
        "title": "Sửa kiểu dữ liệu trước khi biến đổi",
        "skill": "Change Type • Using Locale • lỗi kiểu dữ liệu",
        "file": "pq_02_change_types.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Power Query"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "pq-03-cols",
        "category": "Power Query",
        "number": 3,
        "icon": "🧱",
        "title": "Giữ, xóa và sắp xếp cột có chủ đích",
        "skill": "Choose Columns • Remove Columns • Reorder",
        "file": "pq_03_columns.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Power Query"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "pq-04-filter",
        "category": "Power Query",
        "number": 4,
        "icon": "🔎",
        "title": "Lọc dữ liệu ngay trong Power Query",
        "skill": "Filter Rows • Sort • Remove Empty",
        "file": "pq_04_filter_rows.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Power Query"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "pq-05-replace",
        "category": "Power Query",
        "number": 5,
        "icon": "🧹",
        "title": "Replace và chuẩn hóa giá trị hàng loạt",
        "skill": "Replace Values • Trim • Clean • Capitalize",
        "file": "pq_05_replace_clean.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Power Query"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "v13-filldown",
        "number": 6,
        "icon": "⬇️",
        "title": "Skip row + Fill Down trong Power Query",
        "category": "Power Query",
        "skill": "Skip rows • Fill Down • Promote headers",
        "filterTags": [
            "Power Query"
        ],
        "file": "21_Fill_Down.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Cơ bản"
    },
    {
        "id": "pq-07-groupby",
        "category": "Power Query",
        "number": 7,
        "icon": "Σ",
        "title": "Group By: tổng hợp không cần Pivot",
        "skill": "Group By • Sum • Count Rows • Average",
        "file": "pq_07_group_by.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Power Query"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "v08-unpivot",
        "number": 8,
        "icon": "↔️",
        "title": "Unpivot: báo cáo nằm ngang thành dữ liệu",
        "category": "Power Query",
        "skill": "Unpivot Columns • Rename • Change Type",
        "filterTags": [
            "Power Query"
        ],
        "file": "15_Unpivot.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Trung cấp"
    },
    {
        "id": "pq-09-merge",
        "category": "Power Query",
        "number": 9,
        "icon": "🔗",
        "title": "Merge hai bảng theo mã chính xác",
        "skill": "Merge Queries • Left Outer • Expand",
        "file": "pq_09_merge_exact.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Power Query"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "pq-10-antijoin",
        "category": "Power Query",
        "number": 10,
        "icon": "🧭",
        "title": "Left Anti: tìm dòng bị thiếu trong Master",
        "skill": "Merge Queries • Left Anti • đối soát",
        "file": "pq_10_left_anti.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Power Query"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "c1-pq-10sheet",
        "number": 11,
        "icon": "📋",
        "title": "Gộp nhiều sheet rồi phát hiện dữ liệu bẩn",
        "category": "Power Query",
        "skill": "Append sheets • Column quality • lỗi sau khi gộp",
        "filterTags": [
            "Power Query"
        ],
        "file": "18_PQ_10_sheet.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Trung cấp"
    },
    {
        "id": "video-02",
        "number": 12,
        "icon": "📂",
        "title": "Gộp file / thư mục / nhiều sheet bằng Power Query",
        "category": "Power Query",
        "skill": "From Folder • Append • From File (sheet) • Combine",
        "filterTags": [
            "Power Query"
        ],
        "file": "02_PowerQuery-11-Files.zip",
        "folder": "downloads/video-practice/",
        "level": "Trung cấp"
    },
    {
        "id": "pq-13-custom",
        "category": "Power Query",
        "number": 13,
        "icon": "🧮",
        "title": "Conditional Column và Custom Column",
        "skill": "Add Column • Conditional • Custom • kiểu dữ liệu",
        "file": "pq_13_custom_column.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Power Query"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "v10-fuzzy",
        "number": 14,
        "icon": "🔗",
        "title": "Fuzzy merge tên gần giống",
        "category": "Power Query",
        "skill": "Merge Queries • Fuzzy Matching • Threshold",
        "filterTags": [
            "Power Query"
        ],
        "file": "17_Fuzzy_merge.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Trung cấp"
    },
    {
        "id": "pq-15-schema",
        "category": "Power Query",
        "number": 15,
        "icon": "🧯",
        "title": "Gộp file khi header bị lệch và thiếu cột",
        "skill": "Schema drift • Rename • MissingField • Append",
        "file": "pq_15_schema_drift.xlsx",
        "level": "Nâng cao",
        "filterTags": [
            "Power Query"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "video-03",
        "number": 16,
        "icon": "📊",
        "title": "Tạo PivotTable từ kết quả Power Query",
        "category": "Power Query",
        "skill": "Close & Load • Pivot • Refresh",
        "filterTags": [
            "Power Query"
        ],
        "file": "02_PowerQuery-11-Files.zip",
        "folder": "downloads/video-practice/",
        "level": "Nâng cao"
    },
    {
        "id": "pq-17-errors",
        "category": "Power Query",
        "number": 17,
        "icon": "🚨",
        "title": "Bắt lỗi sau Refresh thay vì tin 0% Error",
        "skill": "Keep Errors • Remove Errors • kiểm tra số dòng",
        "file": "pq_17_error_audit.xlsx",
        "level": "Nâng cao",
        "filterTags": [
            "Power Query"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "pq-18-parameter",
        "category": "Power Query",
        "number": 18,
        "icon": "🎛️",
        "title": "Dùng Parameter để đổi nguồn và khoảng thời gian",
        "skill": "Manage Parameters • Source • Filter động",
        "file": "pq_18_parameters.xlsx",
        "level": "Nâng cao",
        "filterTags": [
            "Power Query"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "v14-distinct",
        "number": 19,
        "icon": "🎯",
        "title": "Làm sạch → Pivot → Dashboard",
        "category": "Power Query",
        "skill": "Clean • Pivot • Slicer • Dashboard tháng",
        "filterTags": [
            "Power Query"
        ],
        "file": "22_dashboard_thang.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Nâng cao"
    },
    {
        "id": "video-04",
        "number": 20,
        "icon": "📈",
        "title": "Dashboard QC từ Pivot Power Query",
        "category": "Power Query",
        "skill": "KPI • Slicer • PivotChart",
        "filterTags": [
            "Power Query"
        ],
        "file": "02_PowerQuery-11-Files.zip",
        "folder": "downloads/video-practice/",
        "level": "Case thực tế"
    },
    {
        "id": "input-01-list",
        "category": "Nhập liệu",
        "number": 1,
        "icon": "✅",
        "title": "Dropdown 1 tầng cho dữ liệu chuẩn ngay từ đầu",
        "skill": "Data Validation • List • nguồn danh mục",
        "file": "input_01_dropdown.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Nhập liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "valid-1tang-trung",
        "number": 2,
        "icon": "✅",
        "title": "Dropdown 1 tầng + chặn nhập trùng",
        "category": "Nhập liệu",
        "skill": "Data Validation list • COUNTIF chặn trùng",
        "filterTags": [
            "Nhập liệu"
        ],
        "file": "NhapLieu_Dropdown2_ChanTrung.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Cơ bản"
    },
    {
        "id": "input-03-number",
        "category": "Nhập liệu",
        "number": 3,
        "icon": "🔢",
        "title": "Chặn nhập số ngoài khoảng cho phép",
        "skill": "Data Validation • Whole number • Between",
        "file": "input_03_number_range.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Nhập liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "input-04-date",
        "category": "Nhập liệu",
        "number": 4,
        "icon": "📅",
        "title": "Chỉ cho nhập ngày hợp lệ",
        "skill": "Data Validation • Date • Start/End date",
        "file": "input_04_date_validation.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Nhập liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "input-05-length",
        "category": "Nhập liệu",
        "number": 5,
        "icon": "🔠",
        "title": "Giới hạn độ dài mã nhân viên",
        "skill": "Text length • Error Alert • mã cố định",
        "file": "input_05_text_length.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Nhập liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "input-06-message",
        "category": "Nhập liệu",
        "number": 6,
        "icon": "💬",
        "title": "Tạo hướng dẫn ngay khi người dùng chọn ô",
        "skill": "Input Message • Error Alert • Stop/Warning",
        "file": "input_06_input_message.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Nhập liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "input-07-custom",
        "category": "Nhập liệu",
        "number": 7,
        "icon": "🧠",
        "title": "Data Validation bằng công thức Custom",
        "skill": "Custom Formula • COUNTIF • AND",
        "file": "input_07_custom_validation.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Nhập liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "c3-ngay",
        "number": 8,
        "icon": "🗓️",
        "title": "10 người nhập 10 kiểu ngày",
        "category": "Nhập liệu",
        "skill": "Chuẩn hóa ngày nhập • Data Validation date",
        "filterTags": [
            "Nhập liệu"
        ],
        "file": "10_10_kieu_ngay.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Trung cấp"
    },
    {
        "id": "input-09-future",
        "category": "Nhập liệu",
        "number": 9,
        "icon": "⏳",
        "title": "Không cho nhập ngày tương lai",
        "skill": "TODAY • Custom Validation • kiểm soát ngày",
        "file": "input_09_no_future_date.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Nhập liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "input-10-code",
        "category": "Nhập liệu",
        "number": 10,
        "icon": "🪪",
        "title": "Chặn trùng mã nhân viên khi nhập",
        "skill": "COUNTIF • Custom Validation • unique key",
        "file": "input_10_unique_code.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Nhập liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "input-11-flash",
        "category": "Nhập liệu",
        "number": 11,
        "icon": "⚡",
        "title": "Flash Fill để nhập nhanh dữ liệu theo mẫu",
        "skill": "Flash Fill • Ctrl+E • nhận diện pattern",
        "file": "input_11_flash_fill.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Nhập liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "input-12-protect",
        "category": "Nhập liệu",
        "number": 12,
        "icon": "🔒",
        "title": "Chỉ mở đúng vùng cho phép nhập",
        "skill": "Locked cells • Protect Sheet • vùng input",
        "file": "input_12_protect_input.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Nhập liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "v06-dropdown-2tang",
        "number": 13,
        "icon": "📑",
        "title": "Dropdown 2 tầng: bộ phận → tên",
        "category": "Nhập liệu",
        "skill": "INDIRECT • Named range • Data Validation",
        "filterTags": [
            "Nhập liệu"
        ],
        "file": "13_dropdown_2_tang.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Trung cấp"
    },
    {
        "id": "input-13-dynamic",
        "category": "Nhập liệu",
        "number": 14,
        "icon": "♻️",
        "title": "Dropdown tự mở rộng khi danh mục tăng",
        "skill": "Excel Table • Data Validation • danh sách động",
        "file": "input_13_dynamic_dropdown.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Nhập liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "input-14-3level",
        "category": "Nhập liệu",
        "number": 15,
        "icon": "🪜",
        "title": "Dropdown 3 tầng: Khu vực → Tỉnh → Cửa hàng",
        "skill": "Named Range • INDIRECT • dependent list",
        "file": "input_14_dropdown_3level.xlsx",
        "level": "Nâng cao",
        "filterTags": [
            "Nhập liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "b01-filter-zone",
        "number": 16,
        "icon": "📌",
        "title": "Làm việc đúng vùng đang Filter (dán / copy)",
        "category": "Nhập liệu",
        "skill": "Filter • Visible cells only • Alt+; • dán đúng dòng",
        "filterTags": [
            "Nhập liệu"
        ],
        "file": "08_dan_dong_loc.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Nâng cao"
    },
    {
        "id": "v11-skip-blanks",
        "number": 17,
        "icon": "📋",
        "title": "Paste Special Skip Blanks",
        "category": "Nhập liệu",
        "skill": "Paste Special • Skip blanks • không đè dữ liệu cũ",
        "filterTags": [
            "Nhập liệu"
        ],
        "file": "19_Skip_Blanks.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Nâng cao"
    },
    {
        "id": "input-17-team",
        "category": "Nhập liệu",
        "number": 18,
        "icon": "👨‍👩‍👧‍👦",
        "title": "Template cho nhiều người nhập mà ít sai",
        "skill": "Validation • quy tắc nhập • cột kiểm tra",
        "file": "input_17_team_template.xlsx",
        "level": "Nâng cao",
        "filterTags": [
            "Nhập liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "input-18-audit",
        "category": "Nhập liệu",
        "number": 19,
        "icon": "🚦",
        "title": "Cảnh báo lỗi nhập ngay trên cùng một dòng",
        "skill": "IF • AND/OR • Conditional Formatting",
        "file": "input_18_input_audit.xlsx",
        "level": "Nâng cao",
        "filterTags": [
            "Nhập liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "input-20-case",
        "category": "Nhập liệu",
        "number": 20,
        "icon": "🏁",
        "title": "Case tổng hợp: form nhập liệu phòng kinh doanh",
        "skill": "Dropdown • Validation • Protect • kiểm tra trùng",
        "file": "input_20_full_case.xlsx",
        "level": "Case thực tế",
        "filterTags": [
            "Nhập liệu"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fx-01-sumavg",
        "category": "Công thức",
        "number": 1,
        "icon": "➕",
        "title": "SUM và AVERAGE từ dữ liệu thực tế",
        "skill": "SUM • AVERAGE • tham chiếu vùng",
        "file": "fx_01_sum_average.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Công thức"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fx-02-count",
        "category": "Công thức",
        "number": 2,
        "icon": "🔢",
        "title": "COUNT, COUNTA và COUNTBLANK khác nhau thế nào",
        "skill": "COUNT • COUNTA • COUNTBLANK",
        "file": "fx_02_count.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Công thức"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fx-03-if",
        "category": "Công thức",
        "number": 3,
        "icon": "🔀",
        "title": "IF cơ bản: đạt hay không đạt",
        "skill": "IF • toán tử so sánh • TRUE/FALSE",
        "file": "fx_03_if_basic.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Công thức"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "ct-if-ifs",
        "number": 4,
        "icon": "🔀",
        "title": "IF / IFS phân loại dữ liệu",
        "category": "Công thức",
        "skill": "IF • IFS • lồng điều kiện có kiểm soát",
        "filterTags": [
            "Công thức"
        ],
        "file": "27_if_ifs.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Cơ bản"
    },
    {
        "id": "fx-05-countif",
        "category": "Công thức",
        "number": 5,
        "icon": "🎯",
        "title": "COUNTIF và SUMIF một điều kiện",
        "skill": "COUNTIF • SUMIF • wildcard",
        "file": "fx_05_countif_sumif.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Công thức"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "ct-sumifs",
        "number": 6,
        "icon": "➕",
        "title": "SUMIFS / COUNTIFS theo nhiều điều kiện",
        "category": "Công thức",
        "skill": "SUMIFS • COUNTIFS • tiêu chí ngày / khu vực",
        "filterTags": [
            "Công thức"
        ],
        "file": "26_sumifs_countifs.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Cơ bản"
    },
    {
        "id": "fx-07-iferror",
        "category": "Công thức",
        "number": 7,
        "icon": "🛡️",
        "title": "IFERROR: báo cáo sạch lỗi nhưng không che sai",
        "skill": "IFERROR • IFNA • kiểm tra nguyên nhân",
        "file": "fx_07_iferror.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Công thức"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fx-08-text",
        "category": "Công thức",
        "number": 8,
        "icon": "✂️",
        "title": "LEFT, RIGHT, MID xử lý mã và chuỗi",
        "skill": "LEFT • RIGHT • MID • FIND",
        "file": "fx_08_text_basic.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Công thức"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "v12-textbefore",
        "number": 9,
        "icon": "✂️",
        "title": "Tách họ tên bằng TEXTBEFORE",
        "category": "Công thức",
        "skill": "TEXTBEFORE • TEXTAFTER • TEXTSPLIT",
        "filterTags": [
            "Công thức"
        ],
        "file": "20_TEXTBEFORE.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Trung cấp"
    },
    {
        "id": "fx-10-textjoin",
        "category": "Công thức",
        "number": 10,
        "icon": "🧵",
        "title": "TEXTJOIN ghép dữ liệu mà bỏ ô trống",
        "skill": "TEXTJOIN • CONCAT • delimiter",
        "file": "fx_10_textjoin.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Công thức"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fx-11-date",
        "category": "Công thức",
        "number": 11,
        "icon": "🗓️",
        "title": "TODAY, EOMONTH và tính hạn xử lý",
        "skill": "TODAY • EOMONTH • DAYS • WORKDAY",
        "file": "fx_11_dates.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Công thức"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "v07-xlookup",
        "number": 12,
        "icon": "🔍",
        "title": "XLOOKUP không còn #N/A",
        "category": "Công thức",
        "skill": "XLOOKUP • if_not_found • tra cứu an toàn",
        "filterTags": [
            "Công thức"
        ],
        "file": "14_XLOOKUP.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Trung cấp"
    },
    {
        "id": "fx-13-indexmatch",
        "category": "Công thức",
        "number": 13,
        "icon": "🧭",
        "title": "INDEX + MATCH khi không muốn VLOOKUP",
        "skill": "INDEX • MATCH • lookup linh hoạt",
        "file": "fx_13_index_match.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Công thức"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fx-14-dynamic",
        "category": "Công thức",
        "number": 14,
        "icon": "🌊",
        "title": "FILTER, SORT, UNIQUE với mảng động",
        "skill": "FILTER • SORT • UNIQUE • spill",
        "file": "fx_14_dynamic_array.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Công thức"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "v15-aggregate",
        "number": 15,
        "icon": "🧮",
        "title": "AGGREGATE bỏ lỗi và dòng ẩn",
        "category": "Công thức",
        "skill": "AGGREGATE • bỏ #DIV/0! • bỏ dòng ẩn Filter",
        "filterTags": [
            "Công thức"
        ],
        "file": "23_AGGREGATE.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Nâng cao"
    },
    {
        "id": "fx-16-sumproduct",
        "category": "Công thức",
        "number": 16,
        "icon": "🧮",
        "title": "SUMPRODUCT cho nhiều điều kiện không cột phụ",
        "skill": "SUMPRODUCT • boolean logic • điều kiện",
        "file": "fx_16_sumproduct.xlsx",
        "level": "Nâng cao",
        "filterTags": [
            "Công thức"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fx-17-let",
        "category": "Công thức",
        "number": 17,
        "icon": "🧠",
        "title": "LET giúp công thức dài dễ đọc hơn",
        "skill": "LET • biến • tái sử dụng biểu thức",
        "file": "fx_17_let.xlsx",
        "level": "Nâng cao",
        "filterTags": [
            "Công thức"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fx-18-audit",
        "category": "Công thức",
        "number": 18,
        "icon": "🔍",
        "title": "Bắt lỗi công thức khi kéo sai tham chiếu",
        "skill": "F4 • absolute/relative • Trace Precedents",
        "file": "fx_18_formula_audit.xlsx",
        "level": "Nâng cao",
        "filterTags": [
            "Công thức"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fx-19-kpi",
        "category": "Công thức",
        "number": 19,
        "icon": "📊",
        "title": "Bộ công thức KPI bán hàng thực tế",
        "skill": "SUMIFS • COUNTIFS • XLOOKUP • tỷ lệ",
        "file": "fx_19_sales_kpi.xlsx",
        "level": "Nâng cao",
        "filterTags": [
            "Công thức"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fx-20-case",
        "category": "Công thức",
        "number": 20,
        "icon": "🏁",
        "title": "Case tổng hợp: báo cáo bán hàng bằng công thức",
        "skill": "Lookup • điều kiện • ngày • mảng động • KPI",
        "file": "fx_20_full_case.xlsx",
        "level": "Case thực tế",
        "filterTags": [
            "Công thức"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fmt-01-number",
        "category": "Format",
        "number": 1,
        "icon": "💰",
        "title": "Định dạng số, tiền và phần trăm đúng chuẩn",
        "skill": "Number • Currency • Accounting • Percentage",
        "file": "fmt_01_number_formats.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Format"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fmt-02-date",
        "category": "Format",
        "number": 2,
        "icon": "📅",
        "title": "Hiển thị ngày tháng theo nhiều kiểu",
        "skill": "Date • Custom dd/mm/yyyy • mmm-yy",
        "file": "fmt_02_date_formats.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Format"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fmt-03-align",
        "category": "Format",
        "number": 3,
        "icon": "📐",
        "title": "Căn lề, Wrap Text và xuống dòng hợp lý",
        "skill": "Alignment • Wrap Text • Alt+Enter",
        "file": "fmt_03_alignment.xlsx",
        "level": "Cơ bản",
        "filterTags": [
            "Format"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "v02-center-across",
        "number": 4,
        "icon": "↔️",
        "title": "Đừng Merge — Center Across Selection",
        "category": "Format",
        "skill": "Alignment • Center Across • Sort an toàn",
        "filterTags": [
            "Format"
        ],
        "file": "05_center_across.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Cơ bản"
    },
    {
        "id": "v05-an-so-0",
        "number": 5,
        "icon": "🚫",
        "title": "Custom format ẩn số 0",
        "category": "Format",
        "skill": "Custom format 0;-0;;@ • #,##0;-#,##0;;@",
        "filterTags": [
            "Format"
        ],
        "file": "07_an_so_0.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Cơ bản"
    },
    {
        "id": "fmt-cf-basic",
        "number": 6,
        "icon": "🎨",
        "title": "Conditional Formatting cơ bản",
        "category": "Format",
        "skill": "Highlight • Color scale • Rule theo giá trị",
        "filterTags": [
            "Format"
        ],
        "file": "28_conditional_format.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Cơ bản"
    },
    {
        "id": "fmt-07-cfformula",
        "category": "Format",
        "number": 7,
        "icon": "🎨",
        "title": "Conditional Formatting bằng công thức",
        "skill": "New Rule • Use a formula • khóa tham chiếu",
        "file": "fmt_07_cf_formula.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Format"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fmt-08-banding",
        "category": "Format",
        "number": 8,
        "icon": "🦓",
        "title": "Tô xen kẽ dòng không cần tô tay",
        "skill": "Table Style • MOD/ROW • Conditional Formatting",
        "file": "fmt_08_banded_rows.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Format"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fmt-09-unit",
        "category": "Format",
        "number": 9,
        "icon": "🏷️",
        "title": "Hiển thị K, M, tỷ mà không đổi giá trị gốc",
        "skill": "Custom Number Format • nghìn/triệu/tỷ",
        "file": "fmt_09_units.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Format"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fmt-10-databar",
        "category": "Format",
        "number": 10,
        "icon": "📶",
        "title": "Data Bar và Icon Set để nhìn KPI nhanh",
        "skill": "Data Bars • Icon Sets • Rule thresholds",
        "file": "fmt_10_data_bars.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Format"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fmt-11-print",
        "category": "Format",
        "number": 11,
        "icon": "🖨️",
        "title": "Setup trang in vừa một trang mà không bóp chữ",
        "skill": "Print Area • Orientation • Scaling • Margins",
        "file": "fmt_11_print_setup.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Format"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fmt-12-freeze",
        "category": "Format",
        "number": 12,
        "icon": "🧊",
        "title": "Freeze Panes đúng hàng và cột cần theo dõi",
        "skill": "Freeze Panes • Freeze Top Row • First Column",
        "file": "fmt_12_freeze_panes.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Format"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fmt-13-view",
        "category": "Format",
        "number": 13,
        "icon": "👀",
        "title": "Tạo sheet dễ đọc khi dữ liệu rất dài",
        "skill": "Zoom • Gridlines • Group • Hide/Unhide",
        "file": "fmt_13_sheet_view.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Format"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fmt-14-style",
        "category": "Format",
        "number": 14,
        "icon": "🧱",
        "title": "Dùng Cell Styles để đồng bộ báo cáo",
        "skill": "Cell Styles • Theme • Format Painter",
        "file": "fmt_14_cell_styles.xlsx",
        "level": "Trung cấp",
        "filterTags": [
            "Format"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fmt-15-report",
        "category": "Format",
        "number": 15,
        "icon": "🧾",
        "title": "Biến bảng thô thành báo cáo chuyên nghiệp",
        "skill": "Hierarchy • spacing • header • subtotal",
        "file": "fmt_15_report_layout.xlsx",
        "level": "Nâng cao",
        "filterTags": [
            "Format"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fmt-16-protect",
        "category": "Format",
        "number": 16,
        "icon": "🛡️",
        "title": "Khóa format nhưng vẫn cho người khác nhập",
        "skill": "Protection • Locked/Unlocked • Protect Sheet",
        "file": "fmt_16_protect_format.xlsx",
        "level": "Nâng cao",
        "filterTags": [
            "Format"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "pivot-basic",
        "number": 17,
        "icon": "📉",
        "title": "PivotTable cơ bản (không cần Power Query)",
        "category": "Format",
        "skill": "Insert Pivot • Rows/Columns/Values • Refresh",
        "filterTags": [
            "Format"
        ],
        "file": "29_pivot_co_ban.xlsx",
        "folder": "downloads/video-practice/",
        "level": "Nâng cao"
    },
    {
        "id": "fmt-18-pivotfmt",
        "category": "Format",
        "number": 18,
        "icon": "📊",
        "title": "Format PivotTable để Refresh không vỡ giao diện",
        "skill": "PivotTable Options • Preserve Formatting • Layout",
        "file": "fmt_18_pivot_format.xlsx",
        "level": "Nâng cao",
        "filterTags": [
            "Format"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fmt-19-dashboard",
        "category": "Format",
        "number": 19,
        "icon": "📈",
        "title": "Bố cục Dashboard gọn trên một màn hình",
        "skill": "KPI cards • alignment • visual hierarchy",
        "file": "fmt_19_dashboard_layout.xlsx",
        "level": "Nâng cao",
        "filterTags": [
            "Format"
        ],
        "folder": "downloads/video-practice/"
    },
    {
        "id": "fmt-20-case",
        "category": "Format",
        "number": 20,
        "icon": "🏁",
        "title": "Case tổng hợp: makeover báo cáo quản trị",
        "skill": "Number format • CF • print • hierarchy • dashboard",
        "file": "fmt_20_full_case.xlsx",
        "level": "Case thực tế",
        "filterTags": [
            "Format"
        ],
        "folder": "downloads/video-practice/"
    }
];



  const practiceTopicPollData = [
    { id: "clean_data", icon: "🧹", title: "Thêm nội dung chủ đề LÀM SẠCH DỮ LIỆU" },
    { id: "power_query", icon: "⚙️", title: "Thêm nội dung chủ đề POWER QUERY" },
    { id: "data_entry", icon: "⌨️", title: "Thêm nội dung chủ đề NHẬP LIỆU" },
    { id: "formula", icon: "ƒx", title: "Thêm nội dung chủ đề CÔNG THỨC" },
    { id: "format", icon: "🎨", title: "Thêm nội dung chủ đề FORMAT" },
    { id: "new_topic", icon: "✨", title: "Ra thêm chủ đề mới" }
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
    if (item && item.sourcePath) return item.file || String(item.sourcePath).split("/").pop() || "file.xlsx";
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

  function practiceStaticHref(item, fileName) {
    if (!fileName) return "";

    /* File ZIP Power Query này đang nằm ở ROOT repo, không nằm trong
       downloads/video-practice/. Đây là đường dẫn thực tế của source. */
    if (
      fileName === "PowerQuery-11-Files.zip" ||
      fileName === "02_PowerQuery-11-Files.zip"
    ) {
      return "PowerQuery-11-Files.zip";
    }

    if (item && item.sourcePath) return item.sourcePath;
    if (item && item.fileUrl) return item.fileUrl;

    return ((item && item.folder) || "downloads/video-practice/") + fileName;
  }

  function downloadBlock(item, fileName) {
    const names = [];
    function add(f) { if (f && names.indexOf(f) === -1) names.push(f); }
    add(fileName);
    (item.extraFiles || []).forEach(add);

    return names.map(function (f) {
      const href = practiceStaticHref(item, f);
      const remote = /^https?:\/\//i.test(href);
      return '<a class="pv-download" data-avp-static-href="' +
        escapeHtml(href) + '" href="' + escapeHtml(href) + '"' +
        (remote ? ' target="_blank" rel="noopener noreferrer"' : ' download="' + escapeHtml(f) + '"') +
        ' title="' + escapeHtml(f) + '">Tải file</a>';
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



  async function currentUser() {
    if (window.AVPAccess) return await window.AVPAccess.getUser(true);
    var sb = window.avpSupabase || window.supabaseClient || null;
    if (!sb || !sb.auth) return null;
    try {
      var r = await sb.auth.getUser();
      return r && r.data && r.data.user ? r.data.user : null;
    } catch (e) { return null; }
  }
  function askLogin(reason) {
    if (window.AVPAccess) {
      window.AVPAccess.goLogin("practice-video.html");
      return Promise.resolve(false);
    }
    location.href = "auth.html?next=" + encodeURIComponent("practice-video.html");
    return Promise.resolve(false);
  }
  async function requireLogin(reason) {
    if (window.AVPAccess) {
      return await window.AVPAccess.requireLogin({
        next: "practice-video.html",
        reason: reason || "Đăng nhập để tiếp tục."
      });
    }
    var u = await currentUser();
    if (u) return u;
    await askLogin(reason);
    return null;
  }

  var __pvIsAdmin = false;
  var __pvAdminChecked = false;
  var __pvAdminChecking = null;
  async function detectPracticeAdmin(force) {
    if (__pvAdminChecked && !force) return __pvIsAdmin;
    if (__pvAdminChecking && !force) return __pvAdminChecking;

    __pvAdminChecking = (async function () {
      // supabase-auth.js is a module and can finish after this script.
      // Wait/retry instead of permanently caching false on the first early check.
      var sb = null;
      for (var attempt = 0; attempt < 20; attempt++) {
        sb = window.avpSupabase || window.supabaseClient || null;
        if (sb && sb.rpc && sb.auth) break;
        await new Promise(function(resolve){ setTimeout(resolve, 150); });
      }

      if (!sb || !sb.rpc) {
        __pvAdminChecked = false;
        __pvIsAdmin = false;
        syncLessonVoteButtons();
        syncTopicVoteButtons();
        return false;
      }

      try {
        // Make sure an authenticated session is actually ready before asking the RPC.
        if (sb.auth && sb.auth.getSession) {
          try { await sb.auth.getSession(); } catch (ignore) {}
        }
        var res = await sb.rpc("is_admin_user");
        if (res && res.error) throw res.error;
        __pvIsAdmin = !!(res && res.data === true);
        __pvAdminChecked = true;
      } catch (e) {
        console.debug("admin detect", e);
        // Do not permanently cache a transient failure.
        __pvIsAdmin = false;
        __pvAdminChecked = false;
      }

      syncLessonVoteButtons();
      syncTopicVoteButtons();
      return __pvIsAdmin;
    })();

    try {
      return await __pvAdminChecking;
    } finally {
      __pvAdminChecking = null;
    }
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
  function vnDayKey() {
    try {
      var parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).formatToParts(new Date());
      var m = {};
      parts.forEach(function (p) { if (p.type !== "literal") m[p.type] = p.value; });
      return m.year + "-" + m.month + "-" + m.day;
    } catch (e) {
      var d = new Date(Date.now() + 7 * 60 * 60 * 1000);
      return d.toISOString().slice(0, 10);
    }
  }
  function votedMap() {
    try { return JSON.parse(localStorage.getItem("avp_practice_votes") || "{}") || {}; }
    catch (e) { return {}; }
  }
  function voteStorageKey(id) {
    return id + "|" + vnDayKey();
  }
  function markVoted(id) {
    var m = votedMap();
    m[voteStorageKey(id)] = true;
    try { localStorage.setItem("avp_practice_votes", JSON.stringify(m)); } catch (e) {}
  }
  function unmarkVoted(id) {
    var m = votedMap();
    delete m[voteStorageKey(id)];
    try { localStorage.setItem("avp_practice_votes", JSON.stringify(m)); } catch (e) {}
  }
  function hasVoted(id) {
    return !!votedMap()[voteStorageKey(id)];
  }

  async function submitVote(item, voteType, btn) {
    var user = await requireLogin("Đăng nhập để vote. Mỗi tài khoản có thể vote lại khi sang ngày mới.");
    if (!user) return;
    if (hasVoted(item.id)) {
      if (btn) setLessonVoteButtonState(btn, true);
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
    if (btn) setLessonVoteButtonState(btn, true);
    loadPublicVoteSummary();
    loadDailyVoteRanking(vnDateParts(0).iso);
  }

  async function cancelLessonVote(item, btn) {
    if (!__pvIsAdmin) return;
    var sb = window.avpSupabase || window.supabaseClient || null;
    if (!sb || !sb.rpc) return;
    if (btn) { btn.disabled = true; btn.textContent = "Đang huỷ…"; }
    try {
      var res = await sb.rpc("admin_cancel_practice_lesson_vote", {
        p_lesson_id: item.id,
        p_voter_key: voterKey()
      });
      if (res && res.error) throw res.error;
      var payload = res && res.data;
      if (payload && payload.ok === false) throw new Error(payload.error || "cancel_failed");
      unmarkVoted(item.id);
      setLessonVoteButtonState(btn, false);
      await loadPublicVoteSummary();
      await loadDailyVoteRanking(vnDateParts(0).iso);
    } catch (e) {
      console.debug("admin cancel lesson vote", e);
      if (btn) setLessonVoteButtonState(btn, true);
    }
  }


  async function loadPublicVoteSummary() {
    var box = document.getElementById("pvPublicVotes");
    var needEl = document.getElementById("pvPublicNeed");
    var moreEl = document.getElementById("pvPublicMore");
    var note = document.getElementById("pvPublicVotesNote");
    if (!box || !needEl || !moreEl) return;

    var sb = window.avpSupabase || window.supabaseClient || null;
    if (!sb || !sb.rpc) {
      if (note) note.textContent = "Lượt vote sẽ tự cập nhật khi kết nối máy chủ sẵn sàng.";
      return;
    }

    try {
      var res = await sb.rpc("public_practice_vote_summary");
      if (res && res.error) throw res.error;
      var rows = (res && res.data) || [];
      var need = 0, more = 0;
      rows.forEach(function (r) {
        var v = Number(r.votes) || 0;
        if (r.vote_type === "need_more_guide") more += v;
        else if (r.vote_type === "need_guide") need += v;
      });
      needEl.textContent = String(need);
      moreEl.textContent = String(more);
      box.classList.add("is-loaded");
      if (note) note.textContent = "Tổng vote đang có · Dashboard bên dưới hiển thị riêng theo từng ngày.";
    } catch (e) {
      console.debug("public practice vote summary", e);
      if (note) note.textContent = "Chưa tải được lượt vote. Hãy chạy file practice-votes-dashboard-v2.sql một lần trong Supabase.";
    }
  }

  function vnDateParts(offsetDays) {
    var now = new Date();
    var vnNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
    vnNow.setDate(vnNow.getDate() + (offsetDays || 0));
    var y = vnNow.getFullYear();
    var m = String(vnNow.getMonth() + 1).padStart(2, "0");
    var d = String(vnNow.getDate()).padStart(2, "0");
    return { iso: y + "-" + m + "-" + d, date: vnNow };
  }

  function renderDailyRows(rows) {
    var list = document.getElementById("pvDailyList");
    var summary = document.getElementById("pvDaySummary");
    var hint = document.getElementById("pvDailyHint");
    if (!list || !summary) return;
    rows = Array.isArray(rows) ? rows.slice() : [];
    // Trang Bài tập chỉ hiển thị vote của từng bài học.
    // Loại các vote kênh như focus_youtube / focus_tiktok khỏi dashboard này.
    rows = rows.filter(function(r){
      return r && (r.vote_type === "need_guide" || r.vote_type === "need_more_guide");
    });
    rows.sort(function (a, b) { return (Number(b.votes) || 0) - (Number(a.votes) || 0); });
    rows = rows.slice(0, 9);
    var total = 0, need = 0, more = 0;
    rows.forEach(function(r){ var v=Number(r.votes)||0; total+=v; if(r.vote_type==="need_more_guide") more+=v; else need+=v; });
    summary.innerHTML = '<div class="pv-day-stat"><small>Tổng vote</small><strong>' + total + '</strong></div>' +
      '<div class="pv-day-stat"><small>Cần hướng dẫn</small><strong>' + need + '</strong></div>' +
      '<div class="pv-day-stat"><small>Hướng dẫn thêm</small><strong>' + more + '</strong></div>';
    if (!rows.length) {
      list.innerHTML = '<div class="pv-daily-empty">Hôm này chưa có lượt vote nào. Khi có vote mới, bảng xếp hạng sẽ cập nhật tại đây.</div>';
      if (hint) hint.style.display = "none";
      return;
    }
    var max = Math.max(1, ...rows.map(function(r){ return Number(r.votes)||0; }));
    var labels = {need_guide:"Cần hướng dẫn",need_more_guide:"Cần hướng dẫn thêm"};
    list.innerHTML = rows.map(function(r,i){
      var v=Number(r.votes)||0;
      var pct=Math.max(7,Math.round(v/max*100));
      var num=r.lesson_number!=null?String(r.lesson_number).padStart(2,"0"):"—";
      var title=escapeHtml(r.lesson_title||r.lesson_id||"Bài thực hành");
      var kind=r.vote_type==="need_more_guide"?"more":"need";
      return '<div class="pv-daily-row top-' + (i+1) + '">' +
        '<div class="pv-daily-rank">' + (i+1) + '</div>' +
        '<div><div class="pv-daily-title"><span class="num">#' + num + '</span> ' + title + '</div>' +
        '<div class="pv-daily-meta"><span class="pv-daily-tag ' + kind + '">' + (labels[r.vote_type]||r.vote_type) + '</span></div>' +
        '<div class="pv-daily-bar"><span style="width:' + pct + '%"></span></div></div>' +
        '<div class="pv-daily-count"><strong>' + v + '</strong><small>vote</small></div></div>';
    }).join("");
    if (hint) {
      hint.style.display = rows.length > 3 ? "block" : "none";
      hint.textContent = "↔ Cuộn ngang để xem tối đa 9 bài";
    }
  }

  async function loadDailyVoteRanking(dayIso) {
    var list = document.getElementById("pvDailyList");
    if (list) list.innerHTML = '<div class="pv-daily-empty">Đang tải xếp hạng…</div>';
    var sb = window.avpSupabase || window.supabaseClient || null;
    if (!sb || !sb.rpc) { renderDailyRows([]); return; }
    try {
      var res = await sb.rpc("public_list_practice_votes_by_day", { p_day: dayIso });
      if (res && res.error) throw res.error;
      renderDailyRows((res && res.data) || []);
    } catch (e) {
      console.debug("daily vote ranking", e);
      if (list) list.innerHTML = '<div class="pv-daily-empty">Chưa tải được vote theo ngày. Hãy chạy file SQL dashboard vote mới trong Supabase.</div>';
    }
  }

  function initDailyVoteDashboard() {
    var tabs = document.getElementById("pvDayTabs");
    if (!tabs) return;
    var defs = [
      {off:0,label:"Hôm nay"},
      {off:-1,label:"Hôm qua"},
      {off:-2,label:"2 ngày trước"}
    ];
    tabs.innerHTML = defs.map(function(x,i){
      var d=vnDateParts(x.off);
      var dd=String(d.date.getDate()).padStart(2,"0") + "/" + String(d.date.getMonth()+1).padStart(2,"0");
      return '<button type="button" class="pv-day-tab' + (i===0?' active':'') + '" data-day="' + d.iso + '" role="tab">' + x.label + '<span>' + dd + '</span></button>';
    }).join("");
    tabs.addEventListener("click",function(e){
      var btn=e.target.closest(".pv-day-tab"); if(!btn) return;
      tabs.querySelectorAll(".pv-day-tab").forEach(function(b){b.classList.toggle("active",b===btn);});
      loadDailyVoteRanking(btn.getAttribute("data-day"));
    });
    loadDailyVoteRanking(vnDateParts(0).iso);
  }



  function topicVoteMap() {
    try { return JSON.parse(localStorage.getItem("avp_practice_topic_votes") || "{}") || {}; }
    catch (e) { return {}; }
  }
  function topicVoteStorageKey(topicId) { return topicId + "|" + vnDayKey(); }
  function hasTopicVoted(topicId) { return !!topicVoteMap()[topicVoteStorageKey(topicId)]; }
  function markTopicVoted(topicId) {
    var m = topicVoteMap();
    m[topicVoteStorageKey(topicId)] = true;
    try { localStorage.setItem("avp_practice_topic_votes", JSON.stringify(m)); } catch (e) {}
  }
  function unmarkTopicVoted(topicId) {
    var m = topicVoteMap();
    delete m[topicVoteStorageKey(topicId)];
    try { localStorage.setItem("avp_practice_topic_votes", JSON.stringify(m)); } catch (e) {}
  }

  function setTopicVoteButtonState(btn, voted) {
    if (!btn) return;
    var adminCancel = !!(voted && __pvIsAdmin);
    btn.disabled = false;
    btn.setAttribute("aria-disabled", voted && !adminCancel ? "true" : "false");
    btn.classList.toggle("is-voted", !!voted);
    btn.classList.toggle("is-admin-cancel", adminCancel);
    btn.dataset.adminCancel = adminCancel ? "1" : "0";
    btn.textContent = adminCancel ? "↩ Huỷ vote" : (voted ? "✓ Đã vote hôm nay" : "Vote");
    var control = btn.closest(".pv-topic-vote-control");
    var status = control ? control.querySelector(".pv-topic-vote-status") : null;
    if (status) {
      status.textContent = adminCancel ? "Admin · có thể huỷ để test" : (voted ? "Bạn có thể vote lại vào ngày mai" : "");
      status.hidden = !voted;
    }
  }

  function syncTopicVoteButtons() {
    document.querySelectorAll(".pv-topic-vote-btn[data-topic-vote]").forEach(function(btn){
      setTopicVoteButtonState(btn, hasTopicVoted(btn.getAttribute("data-topic-vote")));
    });
  }

  function topicPollHTML() {
    return '<section class="pv-panel tone-default pv-topic-poll-panel" id="pvTopicPoll" aria-live="polite">' +
      '<header class="pv-panel-h">' +
        '<span class="pv-panel-name">CÁC BẠN ĐÓNG GÓP Ý TƯỞNG NHÉ</span>' +
        '<span class="pv-panel-count">6 lựa chọn</span>' +
      '</header>' +
      '<div class="pv-panel-body pv-topic-panel-body">' +
        '<div class="pv-topic-panel-intro">' +
          '<strong>📊 Bình chọn chủ đề tiếp theo</strong>' +
          '<span>Xếp hạng theo lượt vote</span>' +
        '</div>' +
        '<div class="pv-topic-list">' +
          practiceTopicPollData.map(function(topic){
            var voted = hasTopicVoted(topic.id);
            return '<article class="pv-topic-row" data-topic-id="' + topic.id + '">' +
              '<div class="pv-topic-name">' +
                '<span class="pv-topic-icon">' + topic.icon + '</span>' +
                '<strong>' + escapeHtml(topic.title) + '</strong>' +
              '</div>' +
              '<div class="pv-topic-action">' +
                '<div class="pv-topic-vote-control">' +
                  '<button type="button" class="pv-topic-vote-btn' + (voted ? ' is-voted' : '') + '" data-topic-vote="' + topic.id + '">' +
                    (voted ? '✓ Đã vote hôm nay' : 'Vote') +
                  '</button>' +
                  '<small class="pv-topic-vote-status"' + (voted ? '' : ' hidden') + '>' +
                    (voted ? 'Bạn có thể vote lại vào ngày mai' : '') +
                  '</small>' +
                '</div>' +
                '<div class="pv-topic-progress-wrap">' +
                  '<div class="pv-topic-progress"><span data-topic-bar="' + topic.id + '" style="width:0%"></span></div>' +
                  '<span class="pv-topic-percent" data-topic-percent="' + topic.id + '">0%</span>' +
                '</div>' +
                '<strong class="pv-topic-total" data-topic-total="' + topic.id + '">0 lượt</strong>' +
              '</div>' +
            '</article>';
          }).join("") +
        '</div>' +
        '<p class="pv-topic-note" id="pvTopicVoteNote">Phần trăm được tính trên tổng số vote của tất cả lựa chọn.</p>' +
      '</div>' +
    '</section>';
  }


  function renderTopicVoteSummary(rows) {
    var totals = {};
    practiceTopicPollData.forEach(function(t){ totals[t.id] = 0; });
    (Array.isArray(rows) ? rows : []).forEach(function(r){
      if (Object.prototype.hasOwnProperty.call(totals, r.topic_id)) {
        totals[r.topic_id] = Number(r.votes) || 0;
      }
    });

    var grandTotal = 0;
    practiceTopicPollData.forEach(function(topic){
      grandTotal += totals[topic.id] || 0;
    });

    practiceTopicPollData.forEach(function(topic){
      var total = totals[topic.id] || 0;
      var pct = grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0;

      var bar = document.querySelector('[data-topic-bar="' + topic.id + '"]');
      var pe = document.querySelector('[data-topic-percent="' + topic.id + '"]');
      var te = document.querySelector('[data-topic-total="' + topic.id + '"]');

      if (bar) bar.style.width = pct + "%";
      if (pe) pe.textContent = pct + "%";
      if (te) te.textContent = total + " lượt";
    });
  }

  async function loadTopicVoteSummary() {
    if (!document.getElementById("pvTopicPoll")) return;
    var note = document.getElementById("pvTopicVoteNote");
    var sb = window.avpSupabase || window.supabaseClient || null;
    if (!sb || !sb.rpc) {
      if (note) note.textContent = "Đang chờ kết nối máy chủ…";
      return;
    }
    try {
      var res = await sb.rpc("public_practice_topic_vote_summary");
      if (res && res.error) throw res.error;
      renderTopicVoteSummary((res && res.data) || []);
      if (note) note.textContent = "Phần trăm được tính trên tổng số vote của tất cả lựa chọn.";
    } catch (e) {
      console.debug("topic vote summary", e);
      if (note) note.textContent = "Chưa tải được dashboard. Hãy chạy SQL vote chủ đề trong Supabase.";
    }
  }

  async function submitTopicVote(topicId, btn) {
    var topic = practiceTopicPollData.find(function(t){ return t.id === topicId; });
    if (!topic) return;

    var user = await requireLogin("Đăng nhập để bình chọn chủ đề.");
    if (!user) return;

    if (hasTopicVoted(topicId)) {
      setTopicVoteButtonState(btn, true);
      return;
    }

    var sb = window.avpSupabase || window.supabaseClient || null;
    if (!sb || !sb.rpc) return;
    if (btn) { btn.disabled = true; btn.textContent = "Đang gửi…"; }

    try {
      var res = await sb.rpc("vote_practice_topic", { p_topic_id: topic.id, p_topic_title: topic.title });
      if (res && res.error) throw res.error;
      var payload = res && res.data;
      if (payload && payload.ok === false && payload.error !== "already_voted_today") {
        throw new Error(payload.error || "vote_failed");
      }
      markTopicVoted(topicId);
      setTopicVoteButtonState(btn, true);
      await loadTopicVoteSummary();
    } catch (e) {
      console.debug("topic vote", e);
      if (btn) { btn.disabled = false; btn.textContent = "Vote"; }
      var note = document.getElementById("pvTopicVoteNote");
      if (note) note.textContent = "Chưa gửi được vote. Kiểm tra Supabase rồi thử lại.";
    }
  }

  async function cancelTopicVote(topicId, btn) {
    if (!__pvIsAdmin) return;
    var sb = window.avpSupabase || window.supabaseClient || null;
    if (!sb || !sb.rpc) return;
    if (btn) { btn.disabled = true; btn.textContent = "Đang huỷ…"; }
    try {
      var res = await sb.rpc("admin_cancel_practice_topic_vote", { p_topic_id: topicId });
      if (res && res.error) throw res.error;
      var payload = res && res.data;
      if (payload && payload.ok === false) throw new Error(payload.error || "cancel_failed");
      unmarkTopicVoted(topicId);
      setTopicVoteButtonState(btn, false);
      await loadTopicVoteSummary();
    } catch (e) {
      console.debug("admin cancel topic vote", e);
      if (btn) setTopicVoteButtonState(btn, true);
    }
  }

  var __pvTopicVoteBound = false;
  var __pvTopicVoteDay = vnDayKey();
  var __pvTopicVoteDayTimer = null;
  function bindTopicVotes() {
    if (__pvTopicVoteBound) return;
    __pvTopicVoteBound = true;
    document.addEventListener("click", async function(e){
      var btn = e.target.closest(".pv-topic-vote-btn");
      if (!btn) return;
      e.preventDefault();
      var topicId = btn.getAttribute("data-topic-vote");
      var alreadyVoted = hasTopicVoted(topicId);
      if (alreadyVoted) {
        var isAdminNow = __pvIsAdmin || await detectPracticeAdmin(true);
        if (isAdminNow) {
          await cancelTopicVote(topicId, btn);
        } else {
          setTopicVoteButtonState(btn, true);
        }
        return;
      }
      await submitTopicVote(topicId, btn);
    });

    if (!__pvTopicVoteDayTimer) {
      __pvTopicVoteDayTimer = setInterval(function(){
        var today = vnDayKey();
        if (today !== __pvTopicVoteDay) {
          __pvTopicVoteDay = today;
          syncTopicVoteButtons();
          syncLessonVoteButtons();
          loadTopicVoteSummary();
          loadDailyVoteRanking(vnDateParts(0).iso);
        }
      }, 60000);
    }
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

  function lessonVoteCopy(item, voted) {
    var hasVideo = !!tiktokUrl(item);
    var label = hasVideo ? "Cần hướng dẫn thêm" : "Cần hướng dẫn";
    return {
      label: voted ? "✓ " + label : label,
      hint: voted
        ? "Đã vote hôm nay · Mai vote lại"
        : (hasVideo ? "Cần admin ra video hướng dẫn thêm" : "Cần admin ra video hướng dẫn")
    };
  }

  function setLessonVoteButtonState(btn, voted) {
    if (!btn) return;
    var id = btn.getAttribute("data-vote-id");
    var item = videoPracticeData.find(function(x){ return x.id === id; });
    if (!item) return;
    var copy = lessonVoteCopy(item, voted);
    var adminCancel = !!(voted && __pvIsAdmin);
    btn.disabled = false;
    btn.setAttribute("aria-disabled", voted && !adminCancel ? "true" : "false");
    btn.classList.toggle("pv-vote-done", !!voted);
    btn.classList.toggle("pv-admin-cancel", adminCancel);
    btn.dataset.adminCancel = adminCancel ? "1" : "0";
    btn.textContent = adminCancel ? "↩ Huỷ vote" : copy.label;
    var row = btn.closest(".pv-vote-row");
    var hint = row ? row.querySelector(".pv-vote-hint") : null;
    if (hint) hint.textContent = adminCancel ? "Admin · huỷ vote để test lại" : copy.hint;
  }

  function syncLessonVoteButtons() {
    document.querySelectorAll(".pv-vote[data-vote-id]").forEach(function(btn){
      setLessonVoteButtonState(btn, hasVoted(btn.getAttribute("data-vote-id")));
    });
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
    if (item.badge) badge = '<span class="pv-badge pv-badge-available">' + escapeHtml(item.badge) + '</span>';

    const ico = '<svg class="pv-tt-ico" viewBox="0 0 24 24" width="11" height="11" aria-hidden="true"><path fill="currentColor" d="M16.5 3c.4 2.4 1.9 4.1 4.2 4.4v2.3c-1.5.1-2.9-.4-4.2-1.3v6.5c0 3.4-2.7 6.1-6.1 6.1S4.3 18.3 4.3 14.9s2.7-6.1 6.1-6.1c.3 0 .6 0 .9.1v2.5c-.3-.1-.6-.2-.9-.2-2 0-3.6 1.6-3.6 3.7s1.6 3.7 3.6 3.7 3.6-1.6 3.6-3.7V3h2.5z"/></svg>';
    const tkBtn = tk
      ? '<a class="pv-tiktok" href="' + tk + '" target="_blank" rel="noopener noreferrer" title="Xem trên TikTok">' + ico + ' TikTok</a>'
      : '';
    const downloadHref = practiceStaticHref(item, fileName);
    const isRemoteDownload = /^https?:\/\//i.test(downloadHref);
    const fileBtn = avail
      ? '<a class="pv-download" data-avp-static-href="' + escapeHtml(downloadHref) +
        '" href="' + escapeHtml(downloadHref) + '"' +
        (isRemoteDownload
          ? ' target="_blank" rel="noopener noreferrer"'
          : ' download="' + escapeHtml(fileName) + '"') +
        ' title="' + escapeHtml(fileName) + '">Tải file</a>'
      : '';
    const tags = (item.filterTags || [item.category]).join(" ");
    const hasVideo = !!tk;
    let voteRowHtml;
    const voteType = hasVideo ? "need_more_guide" : "need_guide";
      const voted = hasVoted(item.id);
      const voteCopy = lessonVoteCopy(item, voted);
      const voteBtn = '<button type="button" class="pv-vote' + (voted ? ' pv-vote-done' : '') + '" data-vote-id="' + item.id + '" data-vote-type="' + voteType + '" aria-disabled="' + (voted ? 'true' : 'false') + '">' + voteCopy.label + '</button>';
      voteRowHtml =
        '<div class="pv-vote-row' + (voted ? ' is-voted' : '') + '">' +
          voteBtn +
          '<span class="pv-vote-arrow" aria-hidden="true">→</span>' +
          '<span class="pv-vote-hint">' + voteCopy.hint + '</span>' +
        '</div>';
    const num = localNum != null ? localNum : item.number;
    const skillRaw = item.skill || "";
    const levelRaw = item.level || "";
    const levelSlug = levelRaw === "Cơ bản" ? "basic" : (levelRaw === "Trung cấp" ? "mid" : (levelRaw === "Nâng cao" ? "advanced" : "case"));
    const levelBadge = levelRaw ? '<span class="pv-level pv-level-' + levelSlug + '">' + escapeHtml(levelRaw) + '</span>' : '';
    const skill = '<div class="pv-skill">' + levelBadge + (skillRaw ? highlightText(skillRaw, q) : "&nbsp;") + "</div>";
    const matched = !!(q && (
      String(item.title).toLowerCase().indexOf(q) >= 0 ||
      String(skillRaw).toLowerCase().indexOf(q) >= 0 ||
      String(item.category || "").toLowerCase().indexOf(q) >= 0 ||
      String(item.level || "").toLowerCase().indexOf(q) >= 0
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
grid.addEventListener("click", async function (e) {
      var btn = e.target.closest(".pv-vote");
      if (!btn) return;
      e.preventDefault();
      var id = btn.getAttribute("data-vote-id");
      var type = btn.getAttribute("data-vote-type") || "need_guide";
      var item = videoPracticeData.find(function (x) { return x.id === id; });
      if (!item) return;

      // Nếu đã vote, kiểm tra quyền Admin NGAY LÚC BẤM.
      // Cách này không phụ thuộc trạng thái disabled/cache được render trước đó.
      if (hasVoted(id)) {
        btn.disabled = false;
        var isAdminNow = __pvIsAdmin || await detectPracticeAdmin(true);
        if (isAdminNow) {
          await cancelLessonVote(item, btn);
        } else {
          setLessonVoteButtonState(btn, true);
        }
        return;
      }

      if (btn.disabled) return;
      submitVote(item, type, btn);
    });
  }

  const AVP_TOPIC_META=[
    {cat:"Làm sạch dữ liệu",poll:"clean_data",icon:"🧹",title:"Làm sạch dữ liệu",desc:"Text, ngày, khoảng trắng, duplicate và dữ liệu lỗi."},
    {cat:"Power Query",poll:"power_query",icon:"⚙️",title:"Power Query",desc:"Import, transform, append, merge, folder và refresh."},
    {cat:"Nhập liệu",poll:"data_entry",icon:"⌨️",title:"Nhập liệu",desc:"Validation, dropdown, kiểm soát nhập và biểu mẫu."},
    {cat:"Công thức",poll:"formula",icon:"ƒx",title:"Công thức",desc:"Lookup, điều kiện, mảng động và KPI."},
    {cat:"Format",poll:"format",icon:"🎨",title:"Format",desc:"Định dạng, Conditional Formatting, print và bố cục."}
  ];

  function rollFrame(cards,kind,start){
    return '<div class="avp-roll-shell"><div class="avp-practice-roll '+(kind==='lesson'?'lesson-roll':'')+'" data-practice-roll data-roll-kind="'+kind+'" data-start="'+(start||0)+'" tabindex="0"><div class="avp-roll-stage" data-practice-roll-stage>'+cards+'</div><div class="avp-roll-dots" data-practice-roll-dots></div></div><p class="avp-roll-hint">Kéo / vuốt · lăn chuột · phím ← →</p></div>';
  }

  function topicOverviewHTML(){
    const counts={};videoPracticeData.forEach(x=>counts[x.category]=(counts[x.category]||0)+1);
    const cards=AVP_TOPIC_META.map((m,i)=>'<article class="roll-topic-card" data-practice-roll-card data-topic-open="'+escapeHtml(m.cat)+'"><span class="rt-num">0'+(i+1)+'</span><div><div class="rt-icon">'+m.icon+'</div><h3>'+escapeHtml(m.title)+'</h3><p>'+escapeHtml(m.desc)+'</p></div><div class="rt-foot"><span>'+Number(counts[m.cat]||0)+' bài</span><b>Mở chủ đề →</b></div></article>').join('')+
      '<article class="roll-topic-card contribute" data-practice-roll-card data-topic-contribute="1"><span class="rt-num">06</span><div><div class="rt-icon">✨</div><h3>Đóng góp nội dung</h3><p>Vote chủ đề bạn muốn được bổ sung hoặc đề xuất ra thêm chủ đề mới.</p></div><div class="rt-foot"><span>Vote mỗi ngày</span><b>Mở đóng góp →</b></div></article>';
    return '<div class="pv-roll-home">'+rollFrame(cards,'topic',0)+'</div>';
  }

  function contributionHTML(){
    return '<div class="pv-roll-detail"><button class="roll-back" type="button" data-topic-back>← Quay lại 5 chủ đề</button><div class="roll-detail-title"><strong>Đóng góp nội dung</strong><p>Vote nhu cầu học tập. Hệ thống vote hiện tại được giữ nguyên.</p></div><div class="pv-roll-vote-panel">'+topicPollHTML()+'</div></div>';
  }

  function topicDetailHTML(cat,q){
    const list=videoPracticeData.filter(x=>x.category===cat).filter(item=>!q||((item.title+' '+(item.skill||'')+' '+(item.level||'')).toLowerCase().includes(q))).sort((a,b)=>(a.number||0)-(b.number||0));
    if(!list.length)return '<div class="pv-roll-detail"><button class="roll-back" type="button" data-topic-back>← Quay lại 5 chủ đề</button><p class="pv-empty">Không tìm thấy bài phù hợp.</p></div>';
    const cards=list.map((item,idx)=>{let h=cardHTML(item,idx+1,q);return h.replace('<article ','<article data-practice-roll-card ');}).join('');
    return '<div class="pv-roll-detail"><button class="roll-back" type="button" data-topic-back>← Quay lại 5 chủ đề</button><div class="avp-roll-head"><div><span>'+escapeHtml(cat.toUpperCase())+'</span><h3>'+list.length+' bài thực hành</h3></div><small>Chọn bài ở giữa để thao tác</small></div>'+rollFrame(cards,'lesson',0)+'</div>';
  }

  let __pvCurrentTopic=null;
  function render(filter, query) {
    const grid=document.getElementById("pvGrid");if(!grid)return;
    const q=(query||"").trim().toLowerCase();
    if(filter&&filter!=="all")__pvCurrentTopic=filter;
    grid.innerHTML=__pvCurrentTopic?topicDetailHTML(__pvCurrentTopic,q):topicOverviewHTML();
    bindVotes();bindTopicVotes();
    grid.querySelectorAll('[data-topic-open]').forEach(card=>card.addEventListener('click',()=>{
      __pvCurrentTopic=card.getAttribute('data-topic-open');
      render(__pvCurrentTopic,"");
      grid.scrollIntoView({behavior:'smooth',block:'start'});
    }));
    grid.querySelector('[data-topic-contribute]')?.addEventListener('click',()=>{grid.innerHTML=contributionHTML();bindTopicVotes();setTimeout(loadTopicVoteSummary,0);grid.querySelector('[data-topic-back]')?.addEventListener('click',()=>{__pvCurrentTopic=null;render('all','')});});
    grid.querySelector('[data-topic-back]')?.addEventListener('click',()=>{__pvCurrentTopic=null;render('all','')});
    window.AVPPracticeRoll?.initAll(grid);
  }


  async function loadDynamicPracticeLibrary() {
    var sb = null;
    for (var attempt = 0; attempt < 20; attempt++) {
      sb = window.avpSupabase || window.supabaseClient || null;
      if (sb && sb.rpc) break;
      await new Promise(function(resolve){ setTimeout(resolve, 150); });
    }
    if (!sb || !sb.rpc) return false;
    try {
      var res = await sb.rpc("get_practice_library_public");
      if (res.error || !Array.isArray(res.data) || !res.data.length) return false;
      var rows = res.data.filter(function(r){ return r && r.is_active && r.status === "published"; });
      var mapped = rows.map(function(r){
        var path = r.source_path || "";
        var slash = path.lastIndexOf("/");
        return {
          id: r.id,
          number: r.lesson_number || 0,
          icon: r.icon || "📘",
          title: r.title || "Bài thực hành",
          category: r.category || "Khác",
          skill: r.skill || "",
          filterTags: [r.category || "Khác"],
          file: path ? path.slice(slash + 1) : "",
          folder: path ? path.slice(0, slash + 1) : "downloads/video-practice/",
          sourcePath: path || "",
          fileUrl: r.file_url || "",
          tiktok: r.video_url || "",
          level: r.level || "Cơ bản",
          badge: r.badge || "",
          sortOrder: r.sort_order || 0
        };
      });
      if (mapped.length) {
        videoPracticeData.splice(0, videoPracticeData.length);
        mapped.forEach(function(x){ videoPracticeData.push(x); });
        return true;
      }
    } catch (e) {
      console.warn("Practice library dynamic fallback:", e);
    }
    return false;
  }

  function init() {
    updateSummary();
    setTimeout(function(){ detectPracticeAdmin(false); },120);
    setTimeout(function(){ if(!__pvIsAdmin)detectPracticeAdmin(true); },900);
    setTimeout(function(){ if(!__pvIsAdmin)detectPracticeAdmin(true); },2200);
    setTimeout(loadPublicVoteSummary,180);
    setTimeout(initDailyVoteDashboard,220);
    render("all","");bindVotes();bindTopicVotes();
    loadDynamicPracticeLibrary().then(function(changed){if(changed){updateSummary();__pvCurrentTopic=null;render("all","");}});
    const search=document.getElementById("pvSearch");
    if(search){search.addEventListener("input",function(){if(__pvCurrentTopic)render(__pvCurrentTopic,search.value||"");});}
    // BXH giữ rail ngang 3 thẻ; không dùng carousel 3D để bộ lọc ngày luôn hiện.
  }

document.addEventListener("DOMContentLoaded", init);


  async function avpWaitAccessForPracticeDownload() {
    if (window.AVPAccess) return window.AVPAccess;
    for (let i = 0; i < 30; i++) {
      await new Promise(function(resolve){ setTimeout(resolve, 50); });
      if (window.AVPAccess) return window.AVPAccess;
    }
    return null;
  }

  async function avpDownloadPracticeFile(anchor) {
    const href =
      anchor.getAttribute("data-avp-static-href") ||
      anchor.getAttribute("href") ||
      "";
    if (!href) return;

    const access = await avpWaitAccessForPracticeDownload();
    if (access && typeof access.getUser === "function") {
      const user = await access.getUser(true);
      if (!user) {
        access.goLogin("practice-video.html#tiktok");
        return;
      }
    }

    /* URL ngoài website: sau auth thì mở trực tiếp. */
    if (/^https?:\/\//i.test(href)) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    const absolute = new URL(href, location.href).href;

    try {
      const response = await fetch(absolute, {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("HTTP " + response.status + " • " + href);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const temp = document.createElement("a");
      temp.href = blobUrl;
      temp.download =
        anchor.getAttribute("download") ||
        anchor.getAttribute("title") ||
        href.split("/").pop() ||
        "practice-file";
      temp.rel = "noopener";
      temp.style.display = "none";

      /* Không có class pv-download, href là blob: => các guard khác bỏ qua. */
      document.body.appendChild(temp);
      temp.click();
      temp.remove();

      setTimeout(function(){
        URL.revokeObjectURL(blobUrl);
      }, 30000);
    } catch (err) {
      console.error("[TikTok Practice download]", err);
      alert(
        "Không tải được file.\\n\\nĐường dẫn: " + href +
        "\\nLỗi: " + (err && err.message ? err.message : "Không xác định")
      );
    }
  }

  /* Capture-phase và đăng ký từ practice-video.js để chặn trước
     avp-access/download-manager. */
  document.addEventListener("click", function(e){
    const a = e.target && e.target.closest
      ? e.target.closest("a.pv-download")
      : null;
    if (!a) return;

    e.preventDefault();
    e.stopImmediatePropagation();
    avpDownloadPracticeFile(a);
  }, true);

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
    btn.addEventListener("click", async function () {
      var u = await requireLogin("Đăng nhập mới gửi ý tưởng / thắc mắc.");
      if (!u) return;
      modal.hidden = false;
    });
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
    btn.addEventListener("click", async function(){
      var u = await requireLogin("Đăng nhập mới gửi file Excel.");
      if (!u) return;
      modal.hidden = false; if(st) st.textContent="";
    });
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
