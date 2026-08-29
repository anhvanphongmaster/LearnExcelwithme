(() => {
  "use strict";

  window.AVP_PRACTICE_LESSONS = [
    {
      key: "clean_blank_rows_01",
      title: "Xóa dòng trống",
      topic: "clean",
      topicLabel: "Làm sạch dữ liệu",
      difficulty: "basic",
      order: 1,
      maxScore: 100,
      isActive: true,
      grader: "clean_blank_rows_v1",
      fileName: "AVP_BaiMau_XoaDongTrong.xlsx",
      description: "Xóa toàn bộ dòng trống trong sheet DuLieu, giữ nguyên tiêu đề và dữ liệu gốc.",
      rules: [
        "20đ · đúng sheet",
        "20đ · đúng tiêu đề",
        "30đ · hết dòng trống",
        "30đ · giữ đủ dữ liệu"
      ]
    },

    {
      key: "clean_duplicates_02",
      title: "Xóa dữ liệu trùng",
      topic: "clean",
      topicLabel: "Làm sạch dữ liệu",
      difficulty: "basic",
      order: 2,
      maxScore: 100,
      isActive: false,
      grader: null,
      description: "Xóa bản ghi trùng nhưng giữ đúng dữ liệu duy nhất.",
      rules: []
    },

    {
      key: "pq_append_01",
      title: "Gộp dữ liệu bằng Power Query",
      topic: "pq",
      topicLabel: "Power Query",
      difficulty: "intermediate",
      order: 1,
      maxScore: 100,
      isActive: false,
      grader: null,
      description: "Gộp nhiều nguồn và giữ đúng cấu trúc đầu ra.",
      rules: []
    },

    {
      key: "input_validation_01",
      title: "Data Validation cơ bản",
      topic: "input",
      topicLabel: "Nhập liệu",
      difficulty: "basic",
      order: 1,
      maxScore: 100,
      isActive: false,
      grader: null,
      description: "Thiết lập rule nhập liệu đúng yêu cầu.",
      rules: []
    },

    {
      key: "formula_if_01",
      title: "Hàm IF theo điều kiện",
      topic: "formula",
      topicLabel: "Công thức",
      difficulty: "basic",
      order: 1,
      maxScore: 100,
      isActive: false,
      grader: null,
      description: "Hoàn thành kết quả theo điều kiện bằng công thức phù hợp.",
      rules: []
    },

    {
      key: "format_report_01",
      title: "Định dạng báo cáo",
      topic: "format",
      topicLabel: "Định dạng",
      difficulty: "advanced",
      order: 1,
      maxScore: 100,
      isActive: false,
      grader: null,
      description: "Chuẩn hóa bố cục và định dạng báo cáo theo tiêu chí.",
      rules: []
    }
  ];
})();
