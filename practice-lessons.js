(() => {
  "use strict";
  window.AVP_PRACTICE_LESSONS = [
  {
    "key": "clean_blank_rows_01",
    "title": "Xóa dòng trống",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "basic",
    "order": 1,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_01_blank_rows.xlsx",
    "description": "Xóa toàn bộ dòng trống, không làm mất dữ liệu hợp lệ",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã NV",
          "Họ tên",
          "Bộ phận",
          "Số lượng"
        ],
        [
          "NV001",
          "Nguyễn An",
          "QC",
          12
        ],
        [
          "",
          "",
          "",
          ""
        ],
        [
          "NV002",
          "Trần Bình",
          "PE",
          18
        ],
        [
          "NV003",
          "Lê Chi",
          "QC",
          15
        ],
        [
          "",
          "",
          "",
          ""
        ],
        [
          "NV004",
          "Phạm Dũng",
          "MFG",
          22
        ],
        [
          "NV005",
          "Hoàng Em",
          "PE",
          16
        ],
        [
          "NV006",
          "Vũ Giang",
          "QC",
          19
        ],
        [
          "NV007",
          "Đỗ Hạnh",
          "MFG",
          14
        ],
        [
          "NV008",
          "Bùi Khánh",
          "QC",
          21
        ]
      ],
      "expected": [
        [
          "Mã NV",
          "Họ tên",
          "Bộ phận",
          "Số lượng"
        ],
        [
          "NV001",
          "Nguyễn An",
          "QC",
          12
        ],
        [
          "NV002",
          "Trần Bình",
          "PE",
          18
        ],
        [
          "NV003",
          "Lê Chi",
          "QC",
          15
        ],
        [
          "NV004",
          "Phạm Dũng",
          "MFG",
          22
        ],
        [
          "NV005",
          "Hoàng Em",
          "PE",
          16
        ],
        [
          "NV006",
          "Vũ Giang",
          "QC",
          19
        ],
        [
          "NV007",
          "Đỗ Hạnh",
          "MFG",
          14
        ],
        [
          "NV008",
          "Bùi Khánh",
          "QC",
          21
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_duplicates_02",
    "title": "Xóa dữ liệu trùng",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "basic",
    "order": 2,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_02_duplicates.xlsx",
    "description": "Loại bỏ các dòng bị trùng hoàn toàn",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã NV",
          "Họ tên",
          "Bộ phận",
          "Số lượng"
        ],
        [
          "NV001",
          "Nguyễn An",
          "QC",
          12
        ],
        [
          "NV002",
          "Trần Bình",
          "PE",
          18
        ],
        [
          "NV003",
          "Lê Chi",
          "QC",
          15
        ],
        [
          "NV004",
          "Phạm Dũng",
          "MFG",
          22
        ],
        [
          "NV005",
          "Hoàng Em",
          "PE",
          16
        ],
        [
          "NV006",
          "Vũ Giang",
          "QC",
          19
        ],
        [
          "NV007",
          "Đỗ Hạnh",
          "MFG",
          14
        ],
        [
          "NV008",
          "Bùi Khánh",
          "QC",
          21
        ],
        [
          "NV003",
          "Lê Chi",
          "QC",
          15
        ],
        [
          "NV005",
          "Hoàng Em",
          "PE",
          16
        ],
        [
          "NV003",
          "Lê Chi",
          "QC",
          15
        ]
      ],
      "expected": [
        [
          "Mã NV",
          "Họ tên",
          "Bộ phận",
          "Số lượng"
        ],
        [
          "NV001",
          "Nguyễn An",
          "QC",
          12
        ],
        [
          "NV002",
          "Trần Bình",
          "PE",
          18
        ],
        [
          "NV003",
          "Lê Chi",
          "QC",
          15
        ],
        [
          "NV004",
          "Phạm Dũng",
          "MFG",
          22
        ],
        [
          "NV005",
          "Hoàng Em",
          "PE",
          16
        ],
        [
          "NV006",
          "Vũ Giang",
          "QC",
          19
        ],
        [
          "NV007",
          "Đỗ Hạnh",
          "MFG",
          14
        ],
        [
          "NV008",
          "Bùi Khánh",
          "QC",
          21
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_trim_03",
    "title": "Xóa khoảng trắng thừa",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "basic",
    "order": 3,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_03_trim.xlsx",
    "description": "Làm sạch khoảng trắng đầu/cuối trong dữ liệu text",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã NV",
          "Họ tên",
          "Bộ phận",
          "Số lượng"
        ],
        [
          "NV001",
          "  Nguyễn An ",
          " QC  ",
          12
        ],
        [
          "NV002",
          "  Trần Bình ",
          " PE  ",
          18
        ],
        [
          "NV003",
          "  Lê Chi ",
          " QC  ",
          15
        ],
        [
          "NV004",
          "  Phạm Dũng ",
          " MFG  ",
          22
        ],
        [
          "NV005",
          "  Hoàng Em ",
          " PE  ",
          16
        ],
        [
          "NV006",
          "  Vũ Giang ",
          " QC  ",
          19
        ],
        [
          "NV007",
          "  Đỗ Hạnh ",
          " MFG  ",
          14
        ],
        [
          "NV008",
          "  Bùi Khánh ",
          " QC  ",
          21
        ]
      ],
      "expected": [
        [
          "Mã NV",
          "Họ tên",
          "Bộ phận",
          "Số lượng"
        ],
        [
          "NV001",
          "Nguyễn An",
          "QC",
          12
        ],
        [
          "NV002",
          "Trần Bình",
          "PE",
          18
        ],
        [
          "NV003",
          "Lê Chi",
          "QC",
          15
        ],
        [
          "NV004",
          "Phạm Dũng",
          "MFG",
          22
        ],
        [
          "NV005",
          "Hoàng Em",
          "PE",
          16
        ],
        [
          "NV006",
          "Vũ Giang",
          "QC",
          19
        ],
        [
          "NV007",
          "Đỗ Hạnh",
          "MFG",
          14
        ],
        [
          "NV008",
          "Bùi Khánh",
          "QC",
          21
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_case_04",
    "title": "Chuẩn hóa chữ hoa/thường",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "basic",
    "order": 4,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_04_case.xlsx",
    "description": "Chuẩn hóa Họ tên và Bộ phận về đúng kiểu chữ",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã NV",
          "Họ tên",
          "Bộ phận",
          "Số lượng"
        ],
        [
          "NV001",
          "NGUYỄN AN",
          "qc",
          12
        ],
        [
          "NV002",
          "TRẦN BÌNH",
          "pe",
          18
        ],
        [
          "NV003",
          "LÊ CHI",
          "qc",
          15
        ],
        [
          "NV004",
          "PHẠM DŨNG",
          "mfg",
          22
        ],
        [
          "NV005",
          "HOÀNG EM",
          "pe",
          16
        ],
        [
          "NV006",
          "VŨ GIANG",
          "qc",
          19
        ],
        [
          "NV007",
          "ĐỖ HẠNH",
          "mfg",
          14
        ],
        [
          "NV008",
          "BÙI KHÁNH",
          "qc",
          21
        ]
      ],
      "expected": [
        [
          "Mã NV",
          "Họ tên",
          "Bộ phận",
          "Số lượng"
        ],
        [
          "NV001",
          "Nguyễn An",
          "QC",
          12
        ],
        [
          "NV002",
          "Trần Bình",
          "PE",
          18
        ],
        [
          "NV003",
          "Lê Chi",
          "QC",
          15
        ],
        [
          "NV004",
          "Phạm Dũng",
          "MFG",
          22
        ],
        [
          "NV005",
          "Hoàng Em",
          "PE",
          16
        ],
        [
          "NV006",
          "Vũ Giang",
          "QC",
          19
        ],
        [
          "NV007",
          "Đỗ Hạnh",
          "MFG",
          14
        ],
        [
          "NV008",
          "Bùi Khánh",
          "QC",
          21
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_text_number_05",
    "title": "Text thành Number",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "basic",
    "order": 5,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_05_text_number.xlsx",
    "description": "Chuyển Số lượng dạng text thành số thật",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã NV",
          "Họ tên",
          "Bộ phận",
          "Số lượng"
        ],
        [
          "NV001",
          "Nguyễn An",
          "QC",
          "12"
        ],
        [
          "NV002",
          "Trần Bình",
          "PE",
          "18"
        ],
        [
          "NV003",
          "Lê Chi",
          "QC",
          "15"
        ],
        [
          "NV004",
          "Phạm Dũng",
          "MFG",
          "22"
        ],
        [
          "NV005",
          "Hoàng Em",
          "PE",
          "16"
        ],
        [
          "NV006",
          "Vũ Giang",
          "QC",
          "19"
        ],
        [
          "NV007",
          "Đỗ Hạnh",
          "MFG",
          "14"
        ],
        [
          "NV008",
          "Bùi Khánh",
          "QC",
          "21"
        ]
      ],
      "expected": [
        [
          "Mã NV",
          "Họ tên",
          "Bộ phận",
          "Số lượng"
        ],
        [
          "NV001",
          "Nguyễn An",
          "QC",
          12
        ],
        [
          "NV002",
          "Trần Bình",
          "PE",
          18
        ],
        [
          "NV003",
          "Lê Chi",
          "QC",
          15
        ],
        [
          "NV004",
          "Phạm Dũng",
          "MFG",
          22
        ],
        [
          "NV005",
          "Hoàng Em",
          "PE",
          16
        ],
        [
          "NV006",
          "Vũ Giang",
          "QC",
          19
        ],
        [
          "NV007",
          "Đỗ Hạnh",
          "MFG",
          14
        ],
        [
          "NV008",
          "Bùi Khánh",
          "QC",
          21
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_fill_blank_06",
    "title": "Điền ô trống",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "basic",
    "order": 6,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_06_fill_blank.xlsx",
    "description": "Điền đúng Bộ phận bị thiếu",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã NV",
          "Họ tên",
          "Bộ phận",
          "Số lượng"
        ],
        [
          "NV001",
          "Nguyễn An",
          "QC",
          12
        ],
        [
          "NV002",
          "Trần Bình",
          "",
          18
        ],
        [
          "NV003",
          "Lê Chi",
          "QC",
          15
        ],
        [
          "NV004",
          "Phạm Dũng",
          "MFG",
          22
        ],
        [
          "NV005",
          "Hoàng Em",
          "",
          16
        ],
        [
          "NV006",
          "Vũ Giang",
          "QC",
          19
        ],
        [
          "NV007",
          "Đỗ Hạnh",
          "",
          14
        ],
        [
          "NV008",
          "Bùi Khánh",
          "QC",
          21
        ]
      ],
      "expected": [
        [
          "Mã NV",
          "Họ tên",
          "Bộ phận",
          "Số lượng"
        ],
        [
          "NV001",
          "Nguyễn An",
          "QC",
          12
        ],
        [
          "NV002",
          "Trần Bình",
          "PE",
          18
        ],
        [
          "NV003",
          "Lê Chi",
          "QC",
          15
        ],
        [
          "NV004",
          "Phạm Dũng",
          "MFG",
          22
        ],
        [
          "NV005",
          "Hoàng Em",
          "PE",
          16
        ],
        [
          "NV006",
          "Vũ Giang",
          "QC",
          19
        ],
        [
          "NV007",
          "Đỗ Hạnh",
          "MFG",
          14
        ],
        [
          "NV008",
          "Bùi Khánh",
          "QC",
          21
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_special_chars_07",
    "title": "Xóa ký tự đặc biệt",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "basic",
    "order": 7,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_07_special_chars.xlsx",
    "description": "Loại bỏ ký tự đặc biệt khỏi Mã NV",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã NV",
          "Họ tên",
          "Bộ phận",
          "Số lượng"
        ],
        [
          "#NV001!",
          "Nguyễn An",
          "QC",
          12
        ],
        [
          "@NV002",
          "Trần Bình",
          "PE",
          18
        ],
        [
          "#NV003!",
          "Lê Chi",
          "QC",
          15
        ],
        [
          "@NV004",
          "Phạm Dũng",
          "MFG",
          22
        ],
        [
          "#NV005!",
          "Hoàng Em",
          "PE",
          16
        ],
        [
          "@NV006",
          "Vũ Giang",
          "QC",
          19
        ],
        [
          "#NV007!",
          "Đỗ Hạnh",
          "MFG",
          14
        ],
        [
          "@NV008",
          "Bùi Khánh",
          "QC",
          21
        ]
      ],
      "expected": [
        [
          "Mã NV",
          "Họ tên",
          "Bộ phận",
          "Số lượng"
        ],
        [
          "NV001",
          "Nguyễn An",
          "QC",
          12
        ],
        [
          "NV002",
          "Trần Bình",
          "PE",
          18
        ],
        [
          "NV003",
          "Lê Chi",
          "QC",
          15
        ],
        [
          "NV004",
          "Phạm Dũng",
          "MFG",
          22
        ],
        [
          "NV005",
          "Hoàng Em",
          "PE",
          16
        ],
        [
          "NV006",
          "Vũ Giang",
          "QC",
          19
        ],
        [
          "NV007",
          "Đỗ Hạnh",
          "MFG",
          14
        ],
        [
          "NV008",
          "Bùi Khánh",
          "QC",
          21
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_phone_08",
    "title": "Chuẩn hóa số điện thoại",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "basic",
    "order": 8,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_08_phone.xlsx",
    "description": "Chuẩn hóa số điện thoại thành 10 ký tự bắt đầu bằng 0",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã NV",
          "Họ tên",
          "Số điện thoại"
        ],
        [
          "NV001",
          "Nguyễn An",
          "912345678"
        ],
        [
          "NV002",
          "Trần Bình",
          "0912345679 "
        ],
        [
          "NV003",
          "Lê Chi",
          "0913 456 780"
        ],
        [
          "NV004",
          "Phạm Dũng",
          "0913-456-781"
        ],
        [
          "NV005",
          "Hoàng Em",
          "914456782"
        ],
        [
          "NV006",
          "Vũ Giang",
          "0914456783"
        ],
        [
          "NV007",
          "Đỗ Hạnh",
          "091 545 6784"
        ],
        [
          "NV008",
          "Bùi Khánh",
          "0915456785"
        ]
      ],
      "expected": [
        [
          "Mã NV",
          "Họ tên",
          "Số điện thoại"
        ],
        [
          "NV001",
          "Nguyễn An",
          "0912345678"
        ],
        [
          "NV002",
          "Trần Bình",
          "0912345679"
        ],
        [
          "NV003",
          "Lê Chi",
          "0913456780"
        ],
        [
          "NV004",
          "Phạm Dũng",
          "0913456781"
        ],
        [
          "NV005",
          "Hoàng Em",
          "0914456782"
        ],
        [
          "NV006",
          "Vũ Giang",
          "0914456783"
        ],
        [
          "NV007",
          "Đỗ Hạnh",
          "0915456784"
        ],
        [
          "NV008",
          "Bùi Khánh",
          "0915456785"
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_date_09",
    "title": "Chuẩn hóa ngày",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "intermediate",
    "order": 9,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_09_date.xlsx",
    "description": "Chuẩn hóa ngày về cùng dạng ngày hợp lệ",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Ngày"
        ],
        [
          "A01",
          "01/08/2026"
        ],
        [
          "A02",
          "2-8-2026"
        ],
        [
          "A03",
          "2026/08/03"
        ],
        [
          "A04",
          "04.08.2026"
        ],
        [
          "A05",
          "5/8/26"
        ]
      ],
      "expected": [
        [
          "Mã",
          "Ngày"
        ],
        [
          "A01",
          "01/08/2026"
        ],
        [
          "A02",
          "02/08/2026"
        ],
        [
          "A03",
          "03/08/2026"
        ],
        [
          "A04",
          "04/08/2026"
        ],
        [
          "A05",
          "05/08/2026"
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_email_10",
    "title": "Chuẩn hóa email",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "intermediate",
    "order": 10,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_10_email.xlsx",
    "description": "Xóa khoảng trắng và chuẩn hóa email về chữ thường",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Email"
        ],
        [
          "NV01",
          " TUAN@EXAMPLE.COM "
        ],
        [
          "NV02",
          "Lan@Example.com"
        ],
        [
          "NV03",
          " binh@example.COM "
        ]
      ],
      "expected": [
        [
          "Mã",
          "Email"
        ],
        [
          "NV01",
          "tuan@example.com"
        ],
        [
          "NV02",
          "lan@example.com"
        ],
        [
          "NV03",
          "binh@example.com"
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_leading_zero_11",
    "title": "Khôi phục số 0 đầu mã",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "intermediate",
    "order": 11,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_11_leading_zero.xlsx",
    "description": "Chuẩn hóa mã thành đúng 6 ký tự",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã KH",
          "Tên"
        ],
        [
          1234,
          "A"
        ],
        [
          "000125",
          "B"
        ],
        [
          126,
          "C"
        ],
        [
          "001127",
          "D"
        ]
      ],
      "expected": [
        [
          "Mã KH",
          "Tên"
        ],
        [
          "001234",
          "A"
        ],
        [
          "000125",
          "B"
        ],
        [
          "000126",
          "C"
        ],
        [
          "001127",
          "D"
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_replace_text_12",
    "title": "Thay thế giá trị không chuẩn",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "intermediate",
    "order": 12,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_12_replace_text.xlsx",
    "description": "Chuẩn hóa tên tỉnh/thành về một cách viết thống nhất",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Tỉnh"
        ],
        [
          "A",
          "HCM"
        ],
        [
          "B",
          "HcM"
        ],
        [
          "C",
          "TP HCM"
        ],
        [
          "D",
          "Hà Nội"
        ],
        [
          "E",
          "Ha noi"
        ]
      ],
      "expected": [
        [
          "Mã",
          "Tỉnh"
        ],
        [
          "A",
          "TP.HCM"
        ],
        [
          "B",
          "TP.HCM"
        ],
        [
          "C",
          "TP.HCM"
        ],
        [
          "D",
          "Hà Nội"
        ],
        [
          "E",
          "Hà Nội"
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_remove_nonprint_13",
    "title": "Xóa ký tự xuống dòng",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "intermediate",
    "order": 13,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_13_remove_nonprint.xlsx",
    "description": "Loại bỏ ký tự xuống dòng/tab trong Họ tên",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Họ tên"
        ],
        [
          "A",
          "Nguyễn\nAn"
        ],
        [
          "B",
          "Trần\tBình"
        ],
        [
          "C",
          " Lê Chi\n"
        ]
      ],
      "expected": [
        [
          "Mã",
          "Họ tên"
        ],
        [
          "A",
          "Nguyễn An"
        ],
        [
          "B",
          "Trần Bình"
        ],
        [
          "C",
          "Lê Chi"
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_blank_to_zero_14",
    "title": "Điền số 0 cho ô số trống",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "intermediate",
    "order": 14,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_14_blank_to_zero.xlsx",
    "description": "Thay ô trống trong Số lượng bằng 0",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Số lượng"
        ],
        [
          "A",
          10
        ],
        [
          "B",
          ""
        ],
        [
          "C",
          5
        ],
        [
          "D",
          ""
        ],
        [
          "E",
          8
        ]
      ],
      "expected": [
        [
          "Mã",
          "Số lượng"
        ],
        [
          "A",
          10
        ],
        [
          "B",
          0
        ],
        [
          "C",
          5
        ],
        [
          "D",
          0
        ],
        [
          "E",
          8
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_remove_errors_15",
    "title": "Loại giá trị lỗi nghiệp vụ",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "intermediate",
    "order": 15,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_15_remove_errors.xlsx",
    "description": "Xóa các dòng có Số lượng âm",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Số lượng"
        ],
        [
          "A",
          10
        ],
        [
          "B",
          -1
        ],
        [
          "C",
          5
        ],
        [
          "D",
          -8
        ],
        [
          "E",
          3
        ]
      ],
      "expected": [
        [
          "Mã",
          "Số lượng"
        ],
        [
          "A",
          10
        ],
        [
          "C",
          5
        ],
        [
          "E",
          3
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_mixed_16",
    "title": "Làm sạch hỗn hợp 1",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "advanced",
    "order": 16,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_16_mixed.xlsx",
    "description": "Xử lý đồng thời dòng trống, trùng và khoảng trắng",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Tên",
          "BP"
        ],
        [
          "A",
          " An ",
          "qc"
        ],
        [
          "",
          "",
          ""
        ],
        [
          "B",
          "Bình",
          " PE "
        ],
        [
          "A",
          " An ",
          "qc"
        ],
        [
          "C",
          "Chi ",
          "mfg"
        ]
      ],
      "expected": [
        [
          "Mã",
          "Tên",
          "BP"
        ],
        [
          "A",
          "An",
          "QC"
        ],
        [
          "B",
          "Bình",
          "PE"
        ],
        [
          "C",
          "Chi",
          "MFG"
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_mixed2_17",
    "title": "Làm sạch hỗn hợp 2",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "advanced",
    "order": 17,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_17_mixed2.xlsx",
    "description": "Chuẩn hóa mã, email và số lượng trong cùng file",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Email",
          "SL"
        ],
        [
          " #A01 ",
          " A@EXAMPLE.COM ",
          "10"
        ],
        [
          "@A02!",
          "b@example.com ",
          "5"
        ],
        [
          "A03",
          " C@Example.Com",
          "8"
        ]
      ],
      "expected": [
        [
          "Mã",
          "Email",
          "SL"
        ],
        [
          "A01",
          "a@example.com",
          10
        ],
        [
          "A02",
          "b@example.com",
          5
        ],
        [
          "A03",
          "c@example.com",
          8
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_full_case_18",
    "title": "Case làm sạch nhân sự",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "advanced",
    "order": 18,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_18_full_case.xlsx",
    "description": "Hoàn thiện một bảng nhân sự có nhiều lỗi kết hợp",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã NV",
          "Họ tên",
          "Bộ phận",
          "Số lượng"
        ],
        [
          " NV001 ",
          " NGUYỄN AN ",
          "qc",
          "12"
        ],
        [
          "NV002",
          "trần bình",
          " PE ",
          "18"
        ],
        [
          "",
          "",
          "",
          ""
        ],
        [
          "NV003",
          "Lê Chi",
          "qc",
          "15"
        ],
        [
          "NV002",
          "trần bình",
          " PE ",
          "18"
        ]
      ],
      "expected": [
        [
          "Mã NV",
          "Họ tên",
          "Bộ phận",
          "Số lượng"
        ],
        [
          "NV001",
          "Nguyễn An",
          "QC",
          12
        ],
        [
          "NV002",
          "Trần Bình",
          "PE",
          18
        ],
        [
          "NV003",
          "Lê Chi",
          "QC",
          15
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_full_sales_19",
    "title": "Case làm sạch bán hàng",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "advanced",
    "order": 19,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_19_full_sales.xlsx",
    "description": "Chuẩn hóa dữ liệu bán hàng trước khi phân tích",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã ĐH",
          "Tỉnh",
          "SL",
          "Đơn giá"
        ],
        [
          " DH01 ",
          "hcm",
          "2",
          "120000"
        ],
        [
          "DH02",
          "Ha noi",
          "3",
          "85000"
        ],
        [
          "DH02",
          "Ha noi",
          "3",
          "85000"
        ],
        [
          "",
          "",
          "",
          ""
        ],
        [
          "DH03",
          "HCM",
          "1",
          "210000"
        ]
      ],
      "expected": [
        [
          "Mã ĐH",
          "Tỉnh",
          "SL",
          "Đơn giá"
        ],
        [
          "DH01",
          "TP.HCM",
          2,
          120000
        ],
        [
          "DH02",
          "Hà Nội",
          3,
          85000
        ],
        [
          "DH03",
          "TP.HCM",
          1,
          210000
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "clean_audit_clean_20",
    "title": "Kiểm tra chất lượng sau làm sạch",
    "topic": "clean",
    "topicLabel": "Làm sạch dữ liệu",
    "difficulty": "advanced",
    "order": 20,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_CLEAN_20_audit_clean.xlsx",
    "description": "Đưa dữ liệu về bộ chuẩn cuối cùng không còn lỗi",
    "gradingMode": "data",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · dữ liệu sau làm sạch đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Tên",
          "Nhóm",
          "SL"
        ],
        [
          "A01",
          " An ",
          "a",
          "10"
        ],
        [
          "A02",
          "Bình",
          "B",
          5
        ],
        [
          "A02",
          "Bình",
          "B",
          5
        ],
        [
          "A03",
          "Chi ",
          " c ",
          "7"
        ]
      ],
      "expected": [
        [
          "Mã",
          "Tên",
          "Nhóm",
          "SL"
        ],
        [
          "A01",
          "An",
          "A",
          10
        ],
        [
          "A02",
          "Bình",
          "B",
          5
        ],
        [
          "A03",
          "Chi",
          "C",
          7
        ]
      ],
      "compare": "normalized"
    }
  },
  {
    "key": "pq_append_01",
    "title": "Append 3 bảng",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "basic",
    "order": 1,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_01_append.xlsx",
    "description": "Gộp các bảng cùng cấu trúc thành một bảng kết quả",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Tháng",
          "SL"
        ],
        [
          "A",
          1,
          5
        ],
        [
          "B",
          1,
          8
        ],
        [
          "A",
          2,
          7
        ],
        [
          "C",
          2,
          4
        ],
        [
          "B",
          3,
          6
        ]
      ],
      "expected": [
        [
          "Mã",
          "Tháng",
          "SL"
        ],
        [
          "A",
          1,
          5
        ],
        [
          "B",
          1,
          8
        ],
        [
          "A",
          2,
          7
        ],
        [
          "C",
          2,
          4
        ],
        [
          "B",
          3,
          6
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_merge_02",
    "title": "Merge tra nhóm",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "basic",
    "order": 2,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_02_merge.xlsx",
    "description": "Ghép cột Nhóm từ bảng danh mục vào dữ liệu chính",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "SL",
          "Nhóm"
        ],
        [
          "A",
          5,
          ""
        ],
        [
          "B",
          8,
          ""
        ],
        [
          "C",
          4,
          ""
        ]
      ],
      "expected": [
        [
          "Mã",
          "SL",
          "Nhóm"
        ],
        [
          "A",
          5,
          "X"
        ],
        [
          "B",
          8,
          "Y"
        ],
        [
          "C",
          4,
          "X"
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_filter_03",
    "title": "Lọc dữ liệu hợp lệ",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "basic",
    "order": 3,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_03_filter.xlsx",
    "description": "Giữ các dòng có SL lớn hơn hoặc bằng 5",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "SL"
        ],
        [
          "A",
          5
        ],
        [
          "B",
          2
        ],
        [
          "C",
          8
        ],
        [
          "D",
          4
        ],
        [
          "E",
          6
        ]
      ],
      "expected": [
        [
          "Mã",
          "SL"
        ],
        [
          "A",
          5
        ],
        [
          "C",
          8
        ],
        [
          "E",
          6
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_group_04",
    "title": "Group By tổng SL",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "basic",
    "order": 4,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_04_group.xlsx",
    "description": "Nhóm theo Nhóm và tính tổng Số lượng",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Nhóm",
          "Tổng SL"
        ],
        [
          "A",
          12
        ],
        [
          "B",
          9
        ],
        [
          "C",
          5
        ]
      ],
      "expected": [
        [
          "Nhóm",
          "Tổng SL"
        ],
        [
          "A",
          12
        ],
        [
          "B",
          9
        ],
        [
          "C",
          5
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_split_05",
    "title": "Split cột Họ tên",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "basic",
    "order": 5,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_05_split.xlsx",
    "description": "Tách Họ tên thành Họ và Tên",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Họ tên",
          "Họ",
          "Tên"
        ],
        [
          "Nguyễn An",
          "",
          ""
        ],
        [
          "Trần Bình",
          "",
          ""
        ],
        [
          "Lê Chi",
          "",
          ""
        ]
      ],
      "expected": [
        [
          "Họ tên",
          "Họ",
          "Tên"
        ],
        [
          "Nguyễn An",
          "Nguyễn",
          "An"
        ],
        [
          "Trần Bình",
          "Trần",
          "Bình"
        ],
        [
          "Lê Chi",
          "Lê",
          "Chi"
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_combine_06",
    "title": "Combine Folder",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "basic",
    "order": 6,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_06_combine.xlsx",
    "description": "Gộp dữ liệu nhiều file tháng thành một bảng",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "File",
          "Mã",
          "SL"
        ],
        [
          "T1",
          "A",
          2
        ],
        [
          "T1",
          "B",
          3
        ],
        [
          "T2",
          "A",
          4
        ],
        [
          "T2",
          "C",
          5
        ]
      ],
      "expected": [
        [
          "File",
          "Mã",
          "SL"
        ],
        [
          "T1",
          "A",
          2
        ],
        [
          "T1",
          "B",
          3
        ],
        [
          "T2",
          "A",
          4
        ],
        [
          "T2",
          "C",
          5
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_unpivot_07",
    "title": "Unpivot tháng",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "basic",
    "order": 7,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_07_unpivot.xlsx",
    "description": "Chuyển dữ liệu tháng từ cột sang dòng",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Tháng",
          "Doanh số"
        ],
        [
          "A",
          "T1",
          10
        ],
        [
          "A",
          "T2",
          12
        ],
        [
          "B",
          "T1",
          8
        ],
        [
          "B",
          "T2",
          9
        ]
      ],
      "expected": [
        [
          "Mã",
          "Tháng",
          "Doanh số"
        ],
        [
          "A",
          "T1",
          10
        ],
        [
          "A",
          "T2",
          12
        ],
        [
          "B",
          "T1",
          8
        ],
        [
          "B",
          "T2",
          9
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_pivot_08",
    "title": "Pivot nhóm",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "basic",
    "order": 8,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_08_pivot.xlsx",
    "description": "Tạo kết quả tổng hợp theo nhóm",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "A",
          "B"
        ],
        [
          "X",
          5,
          3
        ],
        [
          "Y",
          2,
          7
        ]
      ],
      "expected": [
        [
          "Mã",
          "A",
          "B"
        ],
        [
          "X",
          5,
          3
        ],
        [
          "Y",
          2,
          7
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_replace_09",
    "title": "Replace Values",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "intermediate",
    "order": 9,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_09_replace.xlsx",
    "description": "Chuẩn hóa tên tỉnh trong Power Query",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Tỉnh"
        ],
        [
          "A",
          "HCM"
        ],
        [
          "B",
          "Ha noi"
        ],
        [
          "C",
          "HCM"
        ]
      ],
      "expected": [
        [
          "Mã",
          "Tỉnh"
        ],
        [
          "A",
          "TP.HCM"
        ],
        [
          "B",
          "Hà Nội"
        ],
        [
          "C",
          "TP.HCM"
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_type_10",
    "title": "Change Type",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "intermediate",
    "order": 10,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_10_type.xlsx",
    "description": "Chuyển SL và Đơn giá về kiểu số",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "SL",
          "Đơn giá"
        ],
        [
          "A",
          "2",
          "120000"
        ],
        [
          "B",
          "3",
          "85000"
        ]
      ],
      "expected": [
        [
          "Mã",
          "SL",
          "Đơn giá"
        ],
        [
          "A",
          2,
          120000
        ],
        [
          "B",
          3,
          85000
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_index_11",
    "title": "Thêm Index",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "intermediate",
    "order": 11,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_11_index.xlsx",
    "description": "Tạo cột STT bắt đầu từ 1",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "STT",
          "Mã"
        ],
        [
          "",
          "A"
        ],
        [
          "",
          "B"
        ],
        [
          "",
          "C"
        ]
      ],
      "expected": [
        [
          "STT",
          "Mã"
        ],
        [
          1,
          "A"
        ],
        [
          2,
          "B"
        ],
        [
          3,
          "C"
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_conditional_12",
    "title": "Conditional Column",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "intermediate",
    "order": 12,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_12_conditional.xlsx",
    "description": "Tạo Nhóm SL theo điều kiện",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "SL",
          "Nhóm"
        ],
        [
          "A",
          2,
          ""
        ],
        [
          "B",
          8,
          ""
        ],
        [
          "C",
          5,
          ""
        ]
      ],
      "expected": [
        [
          "Mã",
          "SL",
          "Nhóm"
        ],
        [
          "A",
          2,
          "Thấp"
        ],
        [
          "B",
          8,
          "Cao"
        ],
        [
          "C",
          5,
          "Cao"
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_custom_13",
    "title": "Custom Column doanh thu",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "intermediate",
    "order": 13,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_13_custom.xlsx",
    "description": "Tạo Doanh thu = SL × Đơn giá",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "SL",
          "Đơn giá",
          "Doanh thu"
        ],
        [
          "A",
          2,
          120000,
          ""
        ],
        [
          "B",
          3,
          85000,
          ""
        ]
      ],
      "expected": [
        [
          "Mã",
          "SL",
          "Đơn giá",
          "Doanh thu"
        ],
        [
          "A",
          2,
          120000,
          240000
        ],
        [
          "B",
          3,
          85000,
          255000
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_anti_join_14",
    "title": "Left Anti tìm thiếu",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "intermediate",
    "order": 14,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_14_anti_join.xlsx",
    "description": "Giữ các mã có ở CheckData nhưng chưa có Final",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã"
        ],
        [
          "B"
        ],
        [
          "D"
        ]
      ],
      "expected": [
        [
          "Mã"
        ],
        [
          "B"
        ],
        [
          "D"
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_remove_columns_15",
    "title": "Xóa cột thừa",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "intermediate",
    "order": 15,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_15_remove_columns.xlsx",
    "description": "Giữ lại đúng các cột cần cho báo cáo",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Tên",
          "SL"
        ],
        [
          "A",
          "An",
          2
        ],
        [
          "B",
          "Bình",
          3
        ]
      ],
      "expected": [
        [
          "Mã",
          "Tên",
          "SL"
        ],
        [
          "A",
          "An",
          2
        ],
        [
          "B",
          "Bình",
          3
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_reorder_16",
    "title": "Sắp xếp lại cột",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "advanced",
    "order": 16,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_16_reorder.xlsx",
    "description": "Đưa các cột về thứ tự chuẩn",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Tên",
          "SL",
          "Đơn giá"
        ],
        [
          "A",
          "An",
          2,
          100
        ],
        [
          "B",
          "Bình",
          3,
          200
        ]
      ],
      "expected": [
        [
          "Mã",
          "Tên",
          "SL",
          "Đơn giá"
        ],
        [
          "A",
          "An",
          2,
          100
        ],
        [
          "B",
          "Bình",
          3,
          200
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_date_locale_17",
    "title": "Date Using Locale",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "advanced",
    "order": 17,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_17_date_locale.xlsx",
    "description": "Chuẩn hóa ngày theo locale Việt Nam",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Ngày"
        ],
        [
          "A",
          "01/08/2026"
        ],
        [
          "B",
          "02/08/2026"
        ]
      ],
      "expected": [
        [
          "Mã",
          "Ngày"
        ],
        [
          "A",
          "01/08/2026"
        ],
        [
          "B",
          "02/08/2026"
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_folder_case_18",
    "title": "Case Folder 5 file",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "advanced",
    "order": 18,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_18_folder_case.xlsx",
    "description": "Tạo bảng Master kết quả từ nhiều file",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Nguồn",
          "SL"
        ],
        [
          "A",
          "F1",
          2
        ],
        [
          "B",
          "F2",
          3
        ],
        [
          "C",
          "F3",
          4
        ],
        [
          "D",
          "F4",
          5
        ],
        [
          "E",
          "F5",
          6
        ]
      ],
      "expected": [
        [
          "Mã",
          "Nguồn",
          "SL"
        ],
        [
          "A",
          "F1",
          2
        ],
        [
          "B",
          "F2",
          3
        ],
        [
          "C",
          "F3",
          4
        ],
        [
          "D",
          "F4",
          5
        ],
        [
          "E",
          "F5",
          6
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_master_case_19",
    "title": "Case Master Data",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "advanced",
    "order": 19,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_19_master_case.xlsx",
    "description": "Hoàn thiện bảng Master sạch sau query",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Tên",
          "SL"
        ],
        [
          "A",
          "An",
          2
        ],
        [
          "B",
          "Bình",
          3
        ],
        [
          "C",
          "Chi",
          4
        ]
      ],
      "expected": [
        [
          "Mã",
          "Tên",
          "SL"
        ],
        [
          "A",
          "An",
          2
        ],
        [
          "B",
          "Bình",
          3
        ],
        [
          "C",
          "Chi",
          4
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "pq_audit_query_20",
    "title": "Kiểm tra kết quả Query",
    "topic": "pq",
    "topicLabel": "Power Query",
    "difficulty": "advanced",
    "order": 20,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_PQ_20_audit_query.xlsx",
    "description": "Đối chiếu đầu ra cuối cùng của query",
    "gradingMode": "query-output",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc đầu ra",
      "60đ · kết quả Query đúng"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Tổng SL"
        ],
        [
          "A",
          9
        ],
        [
          "B",
          7
        ],
        [
          "C",
          4
        ]
      ],
      "expected": [
        [
          "Mã",
          "Tổng SL"
        ],
        [
          "A",
          9
        ],
        [
          "B",
          7
        ],
        [
          "C",
          4
        ]
      ],
      "compare": "normalized",
      "note": "Chấm đầu ra DuLieu; hệ thống không dựa vào thao tác bấm chuột."
    }
  },
  {
    "key": "formula_sum_01",
    "title": "SUM tổng doanh thu",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "basic",
    "order": 1,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_01_sum.xlsx",
    "description": "Tính tổng Doanh thu",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "SUM"
      ],
      "sourceRange": "B2:B6",
      "targetRange": "B8",
      "formulaLabel": "SUM"
    }
  },
  {
    "key": "formula_average_02",
    "title": "AVERAGE điểm",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "basic",
    "order": 2,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_02_average.xlsx",
    "description": "Tính điểm trung bình",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "AVERAGE"
      ],
      "sourceRange": "B2:B6",
      "targetRange": "B8",
      "formulaLabel": "AVERAGE"
    }
  },
  {
    "key": "formula_if_03",
    "title": "IF phân loại",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "basic",
    "order": 3,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_03_if.xlsx",
    "description": "Phân loại Đạt/Không đạt theo điểm",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "IF"
      ],
      "sourceRange": "B2:B6",
      "targetRange": "C2:C6",
      "formulaLabel": "IF"
    }
  },
  {
    "key": "formula_countif_04",
    "title": "COUNTIF đếm nhóm",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "basic",
    "order": 4,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_04_countif.xlsx",
    "description": "Đếm số dòng thuộc nhóm A",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "COUNTIF"
      ],
      "sourceRange": "B2:B8",
      "targetRange": "E2",
      "formulaLabel": "COUNTIF"
    }
  },
  {
    "key": "formula_sumif_05",
    "title": "SUMIF tổng theo nhóm",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "basic",
    "order": 5,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_05_sumif.xlsx",
    "description": "Tính tổng SL theo nhóm",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "SUMIF"
      ],
      "sourceRange": "A2:B8",
      "targetRange": "E2:E4",
      "formulaLabel": "SUMIF"
    }
  },
  {
    "key": "formula_xlookup_06",
    "title": "XLOOKUP tra đơn giá",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "basic",
    "order": 6,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_06_xlookup.xlsx",
    "description": "Tra đơn giá theo mã sản phẩm",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "XLOOKUP"
      ],
      "sourceRange": "A2:A6",
      "targetRange": "C2:C6",
      "formulaLabel": "XLOOKUP"
    }
  },
  {
    "key": "formula_vlookup_07",
    "title": "VLOOKUP tra bộ phận",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "basic",
    "order": 7,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_07_vlookup.xlsx",
    "description": "Tra Bộ phận theo Mã NV",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "VLOOKUP"
      ],
      "sourceRange": "A2:A6",
      "targetRange": "C2:C6",
      "formulaLabel": "VLOOKUP"
    }
  },
  {
    "key": "formula_index_match_08",
    "title": "INDEX MATCH tra cứu",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "basic",
    "order": 8,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_08_index_match.xlsx",
    "description": "Tra giá trị bằng INDEX kết hợp MATCH",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "INDEX",
        "MATCH"
      ],
      "sourceRange": "A2:A6",
      "targetRange": "C2:C6",
      "formulaLabel": "INDEX+MATCH"
    }
  },
  {
    "key": "formula_left_09",
    "title": "LEFT tách mã",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "intermediate",
    "order": 9,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_09_left.xlsx",
    "description": "Lấy 2 ký tự đầu của mã",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "LEFT"
      ],
      "sourceRange": "A2:A6",
      "targetRange": "B2:B6",
      "formulaLabel": "LEFT"
    }
  },
  {
    "key": "formula_right_10",
    "title": "RIGHT tách số",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "intermediate",
    "order": 10,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_10_right.xlsx",
    "description": "Lấy 3 ký tự cuối của mã",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "RIGHT"
      ],
      "sourceRange": "A2:A6",
      "targetRange": "B2:B6",
      "formulaLabel": "RIGHT"
    }
  },
  {
    "key": "formula_mid_11",
    "title": "MID tách chuỗi",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "intermediate",
    "order": 11,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_11_mid.xlsx",
    "description": "Lấy phần giữa chuỗi mã",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "MID"
      ],
      "sourceRange": "A2:A6",
      "targetRange": "B2:B6",
      "formulaLabel": "MID"
    }
  },
  {
    "key": "formula_textjoin_12",
    "title": "TEXTJOIN ghép chuỗi",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "intermediate",
    "order": 12,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_12_textjoin.xlsx",
    "description": "Ghép các thành phần thành mô tả",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "TEXTJOIN"
      ],
      "sourceRange": "A2:C6",
      "targetRange": "D2:D6",
      "formulaLabel": "TEXTJOIN"
    }
  },
  {
    "key": "formula_date_13",
    "title": "DATE tạo ngày",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "intermediate",
    "order": 13,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_13_date.xlsx",
    "description": "Tạo ngày từ Năm/Tháng/Ngày",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "DATE"
      ],
      "sourceRange": "A2:C6",
      "targetRange": "D2:D6",
      "formulaLabel": "DATE"
    }
  },
  {
    "key": "formula_today_14",
    "title": "TODAY kiểm hạn",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "intermediate",
    "order": 14,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_14_today.xlsx",
    "description": "So sánh ngày hết hạn với ngày hiện tại",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "TODAY",
        "IF"
      ],
      "sourceRange": "A2:A6",
      "targetRange": "B2:B6",
      "formulaLabel": "TODAY"
    }
  },
  {
    "key": "formula_round_15",
    "title": "ROUND làm tròn",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "intermediate",
    "order": 15,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_15_round.xlsx",
    "description": "Làm tròn số về 2 chữ số",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "ROUND"
      ],
      "sourceRange": "A2:A6",
      "targetRange": "B2:B6",
      "formulaLabel": "ROUND"
    }
  },
  {
    "key": "formula_iferror_16",
    "title": "IFERROR xử lý lỗi",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "advanced",
    "order": 16,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_16_iferror.xlsx",
    "description": "Bọc công thức tra cứu để xử lý lỗi",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "IFERROR"
      ],
      "sourceRange": "A2:A6",
      "targetRange": "B2:B6",
      "formulaLabel": "IFERROR"
    }
  },
  {
    "key": "formula_and_17",
    "title": "AND nhiều điều kiện",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "advanced",
    "order": 17,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_17_and.xlsx",
    "description": "Kiểm tra đồng thời nhiều điều kiện",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "IF",
        "AND"
      ],
      "sourceRange": "A2:C6",
      "targetRange": "D2:D6",
      "formulaLabel": "AND"
    }
  },
  {
    "key": "formula_or_18",
    "title": "OR điều kiện thay thế",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "advanced",
    "order": 18,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_18_or.xlsx",
    "description": "Đánh dấu nếu thỏa ít nhất một điều kiện",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "IF",
        "OR"
      ],
      "sourceRange": "A2:C6",
      "targetRange": "D2:D6",
      "formulaLabel": "OR"
    }
  },
  {
    "key": "formula_subtotal_19",
    "title": "SUBTOTAL tổng lọc",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "advanced",
    "order": 19,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_19_subtotal.xlsx",
    "description": "Tính tổng tương thích Filter",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "SUBTOTAL"
      ],
      "sourceRange": "A2:A10",
      "targetRange": "A12",
      "formulaLabel": "SUBTOTAL"
    }
  },
  {
    "key": "formula_case_formula_20",
    "title": "Case công thức tổng hợp",
    "topic": "formula",
    "topicLabel": "Công thức",
    "difficulty": "advanced",
    "order": 20,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMULA_20_case_formula.xlsx",
    "description": "Hoàn thiện bảng bằng nhiều công thức bắt buộc",
    "gradingMode": "formula",
    "rules": [
      "20đ · đúng file",
      "20đ · có công thức thật",
      "30đ · đúng hàm yêu cầu",
      "30đ · công thức phủ đủ vùng"
    ],
    "spec": {
      "kind": "formula",
      "functions": [
        "IF",
        "SUMIF",
        "XLOOKUP"
      ],
      "sourceRange": "A2:D8",
      "targetRange": "E2:G8",
      "formulaLabel": "CASE"
    }
  },
  {
    "key": "input_required_01",
    "title": "Điền đủ trường bắt buộc",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "basic",
    "order": 1,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_01_required.xlsx",
    "description": "Điền đầy đủ các ô còn thiếu",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Tên",
          "BP"
        ],
        [
          "A",
          "An",
          ""
        ],
        [
          "B",
          "",
          "PE"
        ],
        [
          "C",
          "Chi",
          "QC"
        ]
      ],
      "expected": [
        [
          "Mã",
          "Tên",
          "BP"
        ],
        [
          "A",
          "An",
          "QC"
        ],
        [
          "B",
          "Bình",
          "PE"
        ],
        [
          "C",
          "Chi",
          "QC"
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_code_02",
    "title": "Nhập mã đúng chuẩn",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "basic",
    "order": 2,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_02_code.xlsx",
    "description": "Chuẩn hóa mã theo mẫu NVxxx",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Tên"
        ],
        [
          "",
          "An"
        ],
        [
          "",
          "Bình"
        ],
        [
          "",
          "Chi"
        ]
      ],
      "expected": [
        [
          "Mã",
          "Tên"
        ],
        [
          "NV001",
          "An"
        ],
        [
          "NV002",
          "Bình"
        ],
        [
          "NV003",
          "Chi"
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_phone_03",
    "title": "Nhập số điện thoại",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "basic",
    "order": 3,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_03_phone.xlsx",
    "description": "Điền đúng số điện thoại 10 chữ số",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Tên",
          "SĐT"
        ],
        [
          "An",
          ""
        ],
        [
          "Bình",
          ""
        ],
        [
          "Chi",
          ""
        ]
      ],
      "expected": [
        [
          "Tên",
          "SĐT"
        ],
        [
          "An",
          "0912345678"
        ],
        [
          "Bình",
          "0987654321"
        ],
        [
          "Chi",
          "0901122334"
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_email_04",
    "title": "Nhập email",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "basic",
    "order": 4,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_04_email.xlsx",
    "description": "Điền email đúng định dạng",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Tên",
          "Email"
        ],
        [
          "An",
          ""
        ],
        [
          "Bình",
          ""
        ],
        [
          "Chi",
          ""
        ]
      ],
      "expected": [
        [
          "Tên",
          "Email"
        ],
        [
          "An",
          "an@example.com"
        ],
        [
          "Bình",
          "binh@example.com"
        ],
        [
          "Chi",
          "chi@example.com"
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_date_05",
    "title": "Nhập ngày",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "basic",
    "order": 5,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_05_date.xlsx",
    "description": "Điền đúng ngày theo đề bài",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Ngày"
        ],
        [
          "A",
          ""
        ],
        [
          "B",
          ""
        ],
        [
          "C",
          ""
        ]
      ],
      "expected": [
        [
          "Mã",
          "Ngày"
        ],
        [
          "A",
          "01/08/2026"
        ],
        [
          "B",
          "02/08/2026"
        ],
        [
          "C",
          "03/08/2026"
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_quantity_06",
    "title": "Nhập số lượng",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "basic",
    "order": 6,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_06_quantity.xlsx",
    "description": "Điền đúng số lượng theo phiếu",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "SL"
        ],
        [
          "A",
          ""
        ],
        [
          "B",
          ""
        ],
        [
          "C",
          ""
        ]
      ],
      "expected": [
        [
          "Mã",
          "SL"
        ],
        [
          "A",
          12
        ],
        [
          "B",
          8
        ],
        [
          "C",
          15
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_price_07",
    "title": "Nhập đơn giá",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "basic",
    "order": 7,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_07_price.xlsx",
    "description": "Điền đúng đơn giá",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Đơn giá"
        ],
        [
          "A",
          ""
        ],
        [
          "B",
          ""
        ],
        [
          "C",
          ""
        ]
      ],
      "expected": [
        [
          "Mã",
          "Đơn giá"
        ],
        [
          "A",
          120000
        ],
        [
          "B",
          85000
        ],
        [
          "C",
          210000
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_status_08",
    "title": "Nhập trạng thái",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "basic",
    "order": 8,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_08_status.xlsx",
    "description": "Điền đúng trạng thái hồ sơ",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Trạng thái"
        ],
        [
          "A",
          ""
        ],
        [
          "B",
          ""
        ],
        [
          "C",
          ""
        ]
      ],
      "expected": [
        [
          "Mã",
          "Trạng thái"
        ],
        [
          "A",
          "Đạt"
        ],
        [
          "B",
          "Chờ"
        ],
        [
          "C",
          "Không đạt"
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_department_09",
    "title": "Chọn bộ phận",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "intermediate",
    "order": 9,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_09_department.xlsx",
    "description": "Điền đúng bộ phận theo danh sách",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "BP"
        ],
        [
          "A",
          ""
        ],
        [
          "B",
          ""
        ],
        [
          "C",
          ""
        ]
      ],
      "expected": [
        [
          "Mã",
          "BP"
        ],
        [
          "A",
          "QC"
        ],
        [
          "B",
          "PE"
        ],
        [
          "C",
          "MFG"
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_shift_10",
    "title": "Nhập ca làm việc",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "intermediate",
    "order": 10,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_10_shift.xlsx",
    "description": "Điền đúng ca làm việc",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Ca"
        ],
        [
          "A",
          ""
        ],
        [
          "B",
          ""
        ],
        [
          "C",
          ""
        ]
      ],
      "expected": [
        [
          "Mã",
          "Ca"
        ],
        [
          "A",
          "Ca 1"
        ],
        [
          "B",
          "Ca 2"
        ],
        [
          "C",
          "Ca 3"
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_warehouse_11",
    "title": "Nhập vị trí kho",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "intermediate",
    "order": 11,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_11_warehouse.xlsx",
    "description": "Điền đúng vị trí kho",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Vị trí"
        ],
        [
          "A",
          ""
        ],
        [
          "B",
          ""
        ],
        [
          "C",
          ""
        ]
      ],
      "expected": [
        [
          "Mã",
          "Vị trí"
        ],
        [
          "A",
          "A01"
        ],
        [
          "B",
          "B02"
        ],
        [
          "C",
          "C03"
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_lot_12",
    "title": "Nhập LOT",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "intermediate",
    "order": 12,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_12_lot.xlsx",
    "description": "Điền đúng mã LOT",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "SP",
          "LOT"
        ],
        [
          "P1",
          ""
        ],
        [
          "P2",
          ""
        ],
        [
          "P3",
          ""
        ]
      ],
      "expected": [
        [
          "SP",
          "LOT"
        ],
        [
          "P1",
          "LOT260801"
        ],
        [
          "P2",
          "LOT260802"
        ],
        [
          "P3",
          "LOT260803"
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_serial_13",
    "title": "Nhập Serial",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "intermediate",
    "order": 13,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_13_serial.xlsx",
    "description": "Điền serial duy nhất cho từng dòng",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Serial"
        ],
        [
          "A",
          ""
        ],
        [
          "B",
          ""
        ],
        [
          "C",
          ""
        ]
      ],
      "expected": [
        [
          "Mã",
          "Serial"
        ],
        [
          "A",
          "SN0001"
        ],
        [
          "B",
          "SN0002"
        ],
        [
          "C",
          "SN0003"
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_percentage_14",
    "title": "Nhập tỷ lệ",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "intermediate",
    "order": 14,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_14_percentage.xlsx",
    "description": "Điền tỷ lệ theo dữ liệu cho trước",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Nhóm",
          "Tỷ lệ"
        ],
        [
          "A",
          ""
        ],
        [
          "B",
          ""
        ],
        [
          "C",
          ""
        ]
      ],
      "expected": [
        [
          "Nhóm",
          "Tỷ lệ"
        ],
        [
          "A",
          0.25
        ],
        [
          "B",
          0.5
        ],
        [
          "C",
          0.75
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_qc_15",
    "title": "Phiếu QC cơ bản",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "intermediate",
    "order": 15,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_15_qc.xlsx",
    "description": "Hoàn thiện kết quả kiểm tra QC",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Item",
          "KQ"
        ],
        [
          "A",
          ""
        ],
        [
          "B",
          ""
        ],
        [
          "C",
          ""
        ]
      ],
      "expected": [
        [
          "Item",
          "KQ"
        ],
        [
          "A",
          "OK"
        ],
        [
          "B",
          "NG"
        ],
        [
          "C",
          "OK"
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_sales_16",
    "title": "Phiếu bán hàng",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "advanced",
    "order": 16,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_16_sales.xlsx",
    "description": "Hoàn thiện dữ liệu đơn hàng",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã ĐH",
          "SL",
          "Giá"
        ],
        [
          "D1",
          "",
          ""
        ],
        [
          "D2",
          "",
          ""
        ]
      ],
      "expected": [
        [
          "Mã ĐH",
          "SL",
          "Giá"
        ],
        [
          "D1",
          2,
          120000
        ],
        [
          "D2",
          3,
          85000
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_inventory_17",
    "title": "Phiếu tồn kho",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "advanced",
    "order": 17,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_17_inventory.xlsx",
    "description": "Điền số liệu tồn kho cuối kỳ",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Tồn cuối"
        ],
        [
          "A",
          ""
        ],
        [
          "B",
          ""
        ],
        [
          "C",
          ""
        ]
      ],
      "expected": [
        [
          "Mã",
          "Tồn cuối"
        ],
        [
          "A",
          18
        ],
        [
          "B",
          7
        ],
        [
          "C",
          25
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_attendance_18",
    "title": "Bảng chấm công",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "advanced",
    "order": 18,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_18_attendance.xlsx",
    "description": "Điền số công theo bảng nguồn",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "NV",
          "Công"
        ],
        [
          "A",
          ""
        ],
        [
          "B",
          ""
        ],
        [
          "C",
          ""
        ]
      ],
      "expected": [
        [
          "NV",
          "Công"
        ],
        [
          "A",
          21
        ],
        [
          "B",
          20
        ],
        [
          "C",
          19
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_mixed_19",
    "title": "Case nhập liệu hỗn hợp",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "advanced",
    "order": 19,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_19_mixed.xlsx",
    "description": "Hoàn thiện nhiều loại dữ liệu trong cùng bảng",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Tên",
          "SL",
          "Ngày"
        ],
        [
          "A",
          "",
          "",
          ""
        ],
        [
          "B",
          "",
          "",
          ""
        ]
      ],
      "expected": [
        [
          "Mã",
          "Tên",
          "SL",
          "Ngày"
        ],
        [
          "A",
          "An",
          5,
          "01/08/2026"
        ],
        [
          "B",
          "Bình",
          8,
          "02/08/2026"
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "input_audit_20",
    "title": "Kiểm tra nhập liệu cuối",
    "topic": "input",
    "topicLabel": "Nhập liệu",
    "difficulty": "advanced",
    "order": 20,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_INPUT_20_audit.xlsx",
    "description": "Đưa bảng về đúng bộ dữ liệu chuẩn",
    "gradingMode": "input",
    "rules": [
      "20đ · đúng file",
      "20đ · đúng cấu trúc",
      "60đ · nhập đúng dữ liệu"
    ],
    "spec": {
      "kind": "table",
      "input": [
        [
          "Mã",
          "Tên",
          "SL"
        ],
        [
          "A",
          "",
          ""
        ],
        [
          "B",
          "",
          ""
        ],
        [
          "C",
          "",
          ""
        ]
      ],
      "expected": [
        [
          "Mã",
          "Tên",
          "SL"
        ],
        [
          "A",
          "An",
          2
        ],
        [
          "B",
          "Bình",
          3
        ],
        [
          "C",
          "Chi",
          4
        ]
      ],
      "compare": "strict"
    }
  },
  {
    "key": "format_thousands_01",
    "title": "Phân cách hàng nghìn",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "basic",
    "order": 1,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_01_thousands.xlsx",
    "description": "Định dạng số có dấu phân cách hàng nghìn",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "#,##0"
    }
  },
  {
    "key": "format_currency_vnd_02",
    "title": "Tiền VND",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "basic",
    "order": 2,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_02_currency_vnd.xlsx",
    "description": "Định dạng số tiền VND",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "#,##0 \"₫\""
    }
  },
  {
    "key": "format_decimal1_03",
    "title": "1 chữ số thập phân",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "basic",
    "order": 3,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_03_decimal1.xlsx",
    "description": "Hiển thị 1 chữ số thập phân",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "0.0"
    }
  },
  {
    "key": "format_decimal2_04",
    "title": "2 chữ số thập phân",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "basic",
    "order": 4,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_04_decimal2.xlsx",
    "description": "Hiển thị 2 chữ số thập phân",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "0.00"
    }
  },
  {
    "key": "format_percent0_05",
    "title": "Phần trăm 0 số lẻ",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "basic",
    "order": 5,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_05_percent0.xlsx",
    "description": "Định dạng phần trăm không có số lẻ",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "0%"
    }
  },
  {
    "key": "format_percent1_06",
    "title": "Phần trăm 1 số lẻ",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "basic",
    "order": 6,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_06_percent1.xlsx",
    "description": "Định dạng phần trăm 1 số lẻ",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "0.0%"
    }
  },
  {
    "key": "format_date_dmy_07",
    "title": "Ngày dd/mm/yyyy",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "basic",
    "order": 7,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_07_date_dmy.xlsx",
    "description": "Định dạng ngày theo dd/mm/yyyy",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "dd/mm/yyyy"
    }
  },
  {
    "key": "format_date_short_08",
    "title": "Ngày dd/mm/yy",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "basic",
    "order": 8,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_08_date_short.xlsx",
    "description": "Định dạng ngày rút gọn",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "dd/mm/yy"
    }
  },
  {
    "key": "format_month_year_09",
    "title": "Tháng/năm",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "intermediate",
    "order": 9,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_09_month_year.xlsx",
    "description": "Hiển thị mm/yyyy",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "mm/yyyy"
    }
  },
  {
    "key": "format_time_hm_10",
    "title": "Giờ phút",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "intermediate",
    "order": 10,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_10_time_hm.xlsx",
    "description": "Hiển thị hh:mm",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "hh:mm"
    }
  },
  {
    "key": "format_code4_11",
    "title": "Mã 4 chữ số",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "intermediate",
    "order": 11,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_11_code4.xlsx",
    "description": "Hiển thị số với 4 chữ số có số 0 đầu",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "0000"
    }
  },
  {
    "key": "format_code6_12",
    "title": "Mã 6 chữ số",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "intermediate",
    "order": 12,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_12_code6.xlsx",
    "description": "Hiển thị số với 6 chữ số có số 0 đầu",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "000000"
    }
  },
  {
    "key": "format_negative_13",
    "title": "Số âm trong ngoặc",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "intermediate",
    "order": 13,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_13_negative.xlsx",
    "description": "Định dạng số âm trong ngoặc",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "#,##0;(#,##0)"
    }
  },
  {
    "key": "format_accounting_14",
    "title": "Kế toán đơn giản",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "intermediate",
    "order": 14,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_14_accounting.xlsx",
    "description": "Định dạng tiền kiểu kế toán",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "#,##0.00"
    }
  },
  {
    "key": "format_scientific_15",
    "title": "Khoa học",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "intermediate",
    "order": 15,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_15_scientific.xlsx",
    "description": "Hiển thị số dạng khoa học",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "0.00E+00"
    }
  },
  {
    "key": "format_fraction_16",
    "title": "Phân số",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "advanced",
    "order": 16,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_16_fraction.xlsx",
    "description": "Hiển thị số dưới dạng phân số",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "# ?/?"
    }
  },
  {
    "key": "format_text_17",
    "title": "Định dạng Text",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "advanced",
    "order": 17,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_17_text.xlsx",
    "description": "Đặt ô về định dạng Text",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "@"
    }
  },
  {
    "key": "format_custom_unit_18",
    "title": "Thêm đơn vị sp",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "advanced",
    "order": 18,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_18_custom_unit.xlsx",
    "description": "Hiển thị đơn vị sp sau số",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "#,##0 \"sp\""
    }
  },
  {
    "key": "format_custom_kg_19",
    "title": "Thêm đơn vị kg",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "advanced",
    "order": 19,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_19_custom_kg.xlsx",
    "description": "Hiển thị đơn vị kg sau số",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "0.00 \"kg\""
    }
  },
  {
    "key": "format_format_case_20",
    "title": "Case định dạng báo cáo",
    "topic": "format",
    "topicLabel": "Định dạng",
    "difficulty": "advanced",
    "order": 20,
    "maxScore": 100,
    "isActive": true,
    "grader": "spec_v18",
    "fileName": "AVP_FORMAT_20_format_case.xlsx",
    "description": "Định dạng cột số theo mẫu báo cáo",
    "gradingMode": "format",
    "rules": [
      "20đ · đúng file",
      "20đ · giá trị không đổi",
      "60đ · định dạng đúng"
    ],
    "spec": {
      "kind": "format",
      "input": [
        [
          "Mã",
          "Giá trị"
        ],
        [
          "A",
          1250
        ],
        [
          "B",
          98500
        ],
        [
          "C",
          241500
        ],
        [
          "D",
          7600
        ],
        [
          "E",
          310000
        ]
      ],
      "range": "B2:B6",
      "numFmt": "#,##0"
    }
  }
];
})();
