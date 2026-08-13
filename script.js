/* ===== TỰ ĐỘNG ĐÁNH DẤU MENU HIỆN TẠI ===== */

const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

const menuLinks =
    document.querySelectorAll("nav a");

menuLinks.forEach(function(link) {

    const linkPage =
        link.getAttribute("href");

    if (linkPage === currentPage) {
        link.classList.add("active");
    }

});


/* ===== NÚT LÊN ĐẦU TRANG ===== */

window.addEventListener("scroll", function() {

    const button =
        document.getElementById("backToTop");

    if (!button) return;

    if (window.scrollY > 300) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }

});


function lenDauTrang() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
/* ===== HIGHLIGHT MENU KHI CUỘN ===== */

const introSection = document.getElementById("gioithieu");

if (introSection) {

    window.addEventListener("scroll", function () {

        const introTop = introSection.offsetTop;
        const introBottom =
            introTop + introSection.offsetHeight;

        const scrollPosition =
            window.scrollY + 150;

        const homeLink =
            document.querySelector('nav a[href="index.html"]');

        const introLink =
            document.querySelector('nav a[href="#gioithieu"]');

        if (!homeLink || !introLink) return;

        if (
            scrollPosition >= introTop &&
            scrollPosition < introBottom
        ) {

            homeLink.classList.remove("active");
            introLink.classList.add("active");

        } else {

            introLink.classList.remove("active");

            if (scrollPosition < introTop) {
                homeLink.classList.add("active");
            }

        }

    });

}
/* ===== HIGHLIGHT HỌC EXCEL KHI CUỘN ===== */

const excelSection = document.getElementById("hocexcel");

if (excelSection) {

    window.addEventListener("scroll", function () {

        const excelTop = excelSection.offsetTop;
        const excelBottom =
            excelTop + excelSection.offsetHeight;

        const scrollPosition =
            window.scrollY + 150;

        const homeLink =
            document.querySelector('nav a[href="index.html"]');

        const introLink =
            document.querySelector('nav a[href="#gioithieu"]');

        const excelLink =
            document.querySelector('nav a[href="#hocexcel"]');

        if (!excelLink) return;

        if (
            scrollPosition >= excelTop &&
            scrollPosition < excelBottom
        ) {

            if (homeLink) {
                homeLink.classList.remove("active");
            }

            if (introLink) {
                introLink.classList.remove("active");
            }

            excelLink.classList.add("active");

        } else {

            excelLink.classList.remove("active");

        }

    });

}/* ===== HIGHLIGHT LIÊN HỆ KHI CUỘN ===== */

const contactSection =
    document.getElementById("lienhe");

if (contactSection) {

    window.addEventListener("scroll", function () {

        const contactTop = contactSection.offsetTop;
        const contactBottom =
            contactTop + contactSection.offsetHeight;

        const scrollPosition =
            window.scrollY + 150;

        const homeLink =
            document.querySelector('nav a[href="index.html"]');

        const introLink =
            document.querySelector('nav a[href="#gioithieu"]');

        const excelLink =
            document.querySelector('nav a[href="#hocexcel"]');

        const contactLink =
            document.querySelector('nav a[href="#lienhe"]');

        if (!contactLink) return;

        if (
            scrollPosition >= contactTop &&
            scrollPosition < contactBottom
        ) {

            if (homeLink) {
                homeLink.classList.remove("active");
            }

            if (introLink) {
                introLink.classList.remove("active");
            }

            if (excelLink) {
                excelLink.classList.remove("active");
            }

            contactLink.classList.add("active");

        } else {

            contactLink.classList.remove("active");

        }

    });
}


window.addEventListener("DOMContentLoaded", function () {

    const savedTheme =
        localStorage.getItem("theme");

    const button =
        document.getElementById("themeToggle");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        if (button) {
            button.textContent = "☀️";
        }

    } else {

        document.body.classList.remove("dark-mode");

        if (button) {
            button.textContent = "🌙";
        }
    }

});
/* ===== DARK MODE ===== */

document.addEventListener("DOMContentLoaded", function () {

    const themeToggle =
        document.getElementById("themeToggle");

    if (!themeToggle) return;


    /* ĐỌC CHẾ ĐỘ ĐÃ LƯU */

    const savedTheme =
        localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        themeToggle.textContent = "☀️";

    } else {

        document.body.classList.remove("dark-mode");

        themeToggle.textContent = "🌙";

    }


    /* KHI BẤM NÚT */

    themeToggle.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

        if (
            document.body.classList.contains("dark-mode")
        ) {

            themeToggle.textContent = "☀️";

            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            themeToggle.textContent = "🌙";

            localStorage.setItem(
                "theme",
                "light"
            );

        }

    });

});
/* ===== THANH TIẾN ĐỘ CUỘN ===== */

window.addEventListener("scroll", function () {

    const progress =
        document.getElementById("scrollProgress");

    if (!progress) return;

    const scrollTop =
        document.documentElement.scrollTop ||
        document.body.scrollTop;

    const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const percent =
        (scrollTop / scrollHeight) * 100;

    progress.style.width =
        percent + "%";
});
/* ===== HIỆU ỨNG CARD KHI CUỘN ===== */

const revealElements =
    document.querySelectorAll(
        ".card, .course-card, .box, .kpi-box, .action-box, .featured-card"
    );

revealElements.forEach(function(element) {
    element.classList.add("reveal");
});

const revealObserver =
    new IntersectionObserver(
        function(entries) {

            entries.forEach(function(entry) {

                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }

            });

        },
        {
            threshold: 0.12
        }
    );

revealElements.forEach(function(element) {
    revealObserver.observe(element);
});
const statNumbers = document.querySelectorAll(".stat-number");

const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const element = entry.target;
            const target = Number(element.dataset.target);
            const suffix = element.dataset.suffix || "";

            let current = 0;

            const speed = Math.max(20, Math.floor(1000 / target));

            const counter = setInterval(() => {

                current++;

                element.textContent = current + suffix;

                if (current >= target) {
                    clearInterval(counter);
                    element.textContent = target + suffix;
                }

            }, speed);

            observer.unobserve(element);
        }
    });
});

statNumbers.forEach(number => {
    statObserver.observe(number);
});
const statCards = document.querySelectorAll(".stat-card");

const cardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show-stat");

            observer.unobserve(entry.target);
        }

    });
});

statCards.forEach(card => {
    cardObserver.observe(card);
});
const searchInput = document.getElementById("searchInput");
const searchSuggestions = document.getElementById("searchSuggestions");

const lessons = [
    {
        name: "Phím tắt Excel",
        keywords: ["phím tắt", "shortcut", "ctrl", "excel"],
        link: "phimtatexcel.html"
    },
    {
        name: "Công thức Excel",
        keywords: ["công thức", "formula", "vlookup", "sumif", "countif"],
        link: "congthucexcel.html"
    },
    {
        name: "Pivot Table",
        keywords: ["pivot", "pivot table", "tổng hợp dữ liệu"],
        link: "pivottable.html"
    },
    {
        name: "Biểu đồ Pareto",
        keywords: ["pareto", "80/20", "biểu đồ"],
        link: "bieudopareto.html"
    },
    {
        name: "Filter & Sort",
        keywords: ["filter", "sort", "lọc", "sắp xếp"],
        link: "filtersort.html"
    },
    {
        name: "Báo cáo Excel",
        keywords: ["báo cáo", "report", "dashboard", "ng rate"],
        link: "baocaoexcel.html"
    }
];

if (searchInput && searchSuggestions) {

    searchInput.addEventListener("input", function () {

        const keyword = this.value.toLowerCase().trim();

        searchSuggestions.innerHTML = "";

        if (keyword === "") {
            searchSuggestions.style.display = "none";
            return;
        }

        const results = lessons.filter(lesson => {

            return (
                lesson.name.toLowerCase().includes(keyword) ||
                lesson.keywords.some(item =>
                    item.toLowerCase().includes(keyword)
                )
            );

        });

        if (results.length === 0) {

            searchSuggestions.innerHTML =
                '<div class="search-suggestion">Không tìm thấy bài học</div>';

            searchSuggestions.style.display = "block";

            return;
        }

        results.forEach(lesson => {

            const link = document.createElement("a");

            link.href = lesson.link;
            link.className = "search-suggestion";
            link.textContent = "📘 " + lesson.name;

            searchSuggestions.appendChild(link);

        });

        searchSuggestions.style.display = "block";

    });

}
/* ===== TIẾN ĐỘ HỌC EXCEL ===== */

function danhDauDaHoc(button) {

    if (!button) return;

    const course = String(button.dataset.course || "").trim();

    const validCourses = [
        "phim-tat",
        "cong-thuc",
        "pivot",
        "pareto",
        "filter-sort",
        "bao-cao"
    ];

    if (!validCourses.includes(course)) {
        console.warn("Course ID không hợp lệ:", course);
        return;
    }

    let completedCourses = [];

    try {
        const saved = JSON.parse(localStorage.getItem("completedCourses") || "[]");
        completedCourses = Array.isArray(saved) ? saved : [];
    } catch {
        completedCourses = [];
    }

    /* Xóa dữ liệu trùng / ID rác trước khi xử lý */
    completedCourses = [...new Set(
        completedCourses.filter(item => validCourses.includes(item))
    )];

    const isCompleted = completedCourses.includes(course);

    if (isCompleted) {

        /* Chỉ xóa ĐÚNG course đang bấm */
        completedCourses = completedCourses.filter(item => item !== course);

    } else {

        /* Chỉ thêm ĐÚNG course đang bấm */
        completedCourses.push(course);

        if (window.avpRecordLearningEvent) {
            window.avpRecordLearningEvent(
                "course_complete",
                { course: course }
            );
        }
    }

    /*
      Lưu một lần duy nhất.
      capNhatTienDo() sẽ render lại TOÀN BỘ 6 card từ dữ liệu này,
      tránh việc DOM của card khác bị thay đổi ngoài ý muốn.
    */
    localStorage.setItem(
        "completedCourses",
        JSON.stringify(completedCourses)
    );

    capNhatTienDo();
}


function capNhatTienDo() {

    const totalCourses = 6;

    const validCourseIds = [
        "phim-tat",
        "cong-thuc",
        "pivot",
        "pareto",
        "filter-sort",
        "bao-cao"
    ];

    let completedCourses = [];

    try {
        const savedCourses =
            JSON.parse(localStorage.getItem("completedCourses") || "[]");

        completedCourses = Array.isArray(savedCourses)
            ? [...new Set(savedCourses.filter(id => validCourseIds.includes(id)))]
            : [];
    } catch {
        completedCourses = [];
    }

    /* Tự sửa dữ liệu cũ nếu từng bị trùng / lỗi */
    localStorage.setItem(
        "completedCourses",
        JSON.stringify(completedCourses)
    );

    const completed =
        completedCourses.length;

    const percent =
        Math.round((completed / totalCourses) * 100);

    const progressText =
        document.getElementById("progressText");

    const progressFill =
        document.getElementById("progressFill");

    const progressPercent =
        document.getElementById("progressPercent");
const nextLesson =
    document.getElementById("nextLesson");

const lessonOrder = [
    {
        id: "phim-tat",
        name: "Phím tắt Excel",
        link: "phimtatexcel.html"
    },
    {
        id: "cong-thuc",
        name: "Công thức Excel",
        link: "congthucexcel.html"
    },
    {
        id: "pivot",
        name: "Pivot Table",
        link: "pivottable.html"
    },
    {
        id: "pareto",
        name: "Biểu đồ & Pareto",
        link: "bieudopareto.html"
    },
    {
        id: "filter-sort",
        name: "Filter & Sort",
        link: "filtersort.html"
    },
    {
        id: "bao-cao",
        name: "Báo cáo Excel",
        link: "baocaoexcel.html"
    }
];

const nextLessonText =
    document.getElementById("nextLessonText");

const nextLessonButton =
    document.getElementById("nextLessonButton");

if (
    nextLesson &&
    nextLessonText &&
    nextLessonButton
) {

    const next =
        lessonOrder.find(
            lesson =>
                !completedCourses.includes(lesson.id)
        );

    if (next) {

        nextLessonText.textContent =
            "👉 Bài tiếp theo: " + next.name;

        nextLessonButton.href =
            next.link;

        nextLessonButton.style.display =
            "inline-block";

    } else {

        nextLessonText.textContent =
            "🏆 Bạn đã hoàn thành toàn bộ lộ trình!";

        nextLessonButton.style.display =
            "none";
    }

}

    if (progressText) {
        progressText.textContent =
            completed + "/" + totalCourses + " chuyên đề";
    }

    if (progressFill) {
        progressFill.style.width =
            percent + "%";
    }

    if (progressPercent) {
        progressPercent.textContent =
            "Hoàn thành " + percent + "%";
    }
const completionMessage =
    document.getElementById("completionMessage");
if (completionMessage) {

    if (completed >= 6) {

        completionMessage.style.display = "block";

        completionMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    } else {

        completionMessage.style.display = "none";

    }

}
    /* Khôi phục trạng thái các nút */

    const buttons =
        document.querySelectorAll(".complete-btn");

    buttons.forEach(function(button) {

        const course =
            button.dataset.course;

        if (completedCourses.includes(course)) {

            button.classList.add("completed");
            button.textContent = "✅ Đã học";

        } else {

            button.classList.remove("completed");
            button.textContent = "✓ Đánh dấu đã học";
        }

    });
    const currentCourse =
    localStorage.getItem("currentCourse");
    const statusLabels =
    document.querySelectorAll(".course-status");
    

statusLabels.forEach(function(label) {

    const course =
        label.dataset.statusFor;

    if (completedCourses.includes(course)) {

        label.textContent = "✅ Đã học";
        label.classList.add("completed");

    } else if (course === currentCourse) {

        label.textContent = "🟡 Đang học";
        label.classList.remove("completed");

    } else {

        label.textContent = "Chưa học";
        label.classList.remove("completed");

    }

});
/* ===== CẬP NHẬT LỘ TRÌNH ===== */

const pathItems =
    document.querySelectorAll(".path-item");

pathItems.forEach(function(item) {

    const course =
        item.dataset.course;

    if (completedCourses.includes(course)) {

        item.classList.add("completed-path");

    } else {

        item.classList.remove("completed-path");

    }

});
}


document.addEventListener(
    "DOMContentLoaded",
    capNhatTienDo
);
function datLaiTienDo() {

    const confirmReset =
        confirm("Bạn có chắc muốn đặt lại toàn bộ tiến độ học không?");

    if (!confirmReset) return;

    localStorage.removeItem("completedCourses");

    capNhatTienDo();
}
function batDauHoc(course) {

    localStorage.setItem("currentCourse", course);

}
/* ===== TÌM KIẾM CHUYÊN ĐỀ EXCEL ===== */

document.addEventListener("DOMContentLoaded", function () {

    const courseSearchInput =
        document.getElementById("courseSearchInput");

    const courseCards =
        document.querySelectorAll(".course-card");

    if (!courseSearchInput || courseCards.length === 0) {
        return;
    }

    courseSearchInput.addEventListener("input", function () {

        const keyword =
            this.value.toLowerCase().trim();

        courseCards.forEach(function (card) {

            const text =
                card.textContent.toLowerCase();

            if (text.includes(keyword)) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }

        });

    });

});
/* ===== LỌC BÀI HỌC THEO TRẠNG THÁI ===== */

function locKhoaHoc(status, clickedButton) {

    const completedCourses =
        JSON.parse(
            localStorage.getItem("completedCourses")
        ) || [];

    const currentCourse =
        localStorage.getItem("currentCourse");

    const cards =
        document.querySelectorAll(".course-card");

    cards.forEach(function(card) {

        const completeButton =
            card.querySelector(".complete-btn");

        if (!completeButton) return;

        const course =
            completeButton.dataset.course;

        let show = false;

        if (status === "all") {

            show = true;

        } else if (status === "completed") {

            show =
                completedCourses.includes(course);

        } else if (status === "learning") {

            show =
                course === currentCourse &&
                !completedCourses.includes(course);

        } else if (status === "not-started") {

            show =
                !completedCourses.includes(course) &&
                course !== currentCourse;
        }

        card.style.display =
            show ? "" : "none";

    });


    document
        .querySelectorAll(".filter-btn")
        .forEach(function(button) {

            button.classList.remove("active-filter");

        });

    if (clickedButton) {
        clickedButton.classList.add("active-filter");
    }

}
/* ===== XEM / ẨN ĐÁP ÁN ===== */

function toggleAnswer(answerId) {

    const answer =
        document.getElementById(answerId);

    if (!answer) return;

    if (answer.style.display === "block") {

        answer.style.display = "none";

    } else {

        answer.style.display = "block";

    }

}

/* ===== NGÂN HÀNG 25 CÂU HỎI EXCEL ===== */

const quizBank = [

    {
        question: "Hàm nào dùng để tính tổng?",
        options: ["COUNT", "SUM", "IF", "MAX"],
        answer: 1
    },

    {
        question: "Hàm nào dùng để tính trung bình?",
        options: ["AVERAGE", "SUM", "COUNT", "MIN"],
        answer: 0
    },

    {
        question: "Hàm nào tìm giá trị lớn nhất?",
        options: ["MIN", "MAX", "SUM", "IF"],
        answer: 1
    },

    {
        question: "Hàm IF dùng để làm gì?",
        options: [
            "Kiểm tra điều kiện",
            "Tạo biểu đồ",
            "Sắp xếp dữ liệu",
            "Đổi màu ô"
        ],
        answer: 0
    },

    {
        question: "VLOOKUP thường dùng để làm gì?",
        options: [
            "Tra cứu dữ liệu theo cột",
            "Tính tổng",
            "Đếm ô",
            "Tạo Pivot Table"
        ],
        answer: 0
    },

    {
        question: "XLOOKUP dùng để làm gì?",
        options: [
            "Tra cứu dữ liệu",
            "Tạo biểu đồ",
            "Lọc dữ liệu",
            "Gộp ô"
        ],
        answer: 0
    },

    {
        question: "COUNTIF dùng để làm gì?",
        options: [
            "Đếm theo điều kiện",
            "Tính tổng",
            "Tính trung bình",
            "Tạo biểu đồ"
        ],
        answer: 0
    },

    {
        question: "SUMIF dùng để làm gì?",
        options: [
            "Tính tổng theo điều kiện",
            "Đếm ký tự",
            "Tìm giá trị nhỏ nhất",
            "Sắp xếp dữ liệu"
        ],
        answer: 0
    },

    {
        question: "Nếu Input Qty = 500 và NG Qty = 10 thì NG Rate bằng bao nhiêu?",
        options: ["1%", "2%", "5%", "10%"],
        answer: 1
    },

    {
        question: "Nếu Input Qty = 400 và NG Qty = 20 thì NG Rate bằng bao nhiêu?",
        options: ["2%", "4%", "5%", "8%"],
        answer: 2
    },

    {
        question: "Pivot Table chủ yếu dùng để làm gì?",
        options: [
            "Tổng hợp và phân tích dữ liệu",
            "Đổi font chữ",
            "Chèn ảnh",
            "Đổi tên file"
        ],
        answer: 0
    },

    {
        question: "Trong Pivot Table, khu vực Rows dùng để làm gì?",
        options: [
            "Phân nhóm dữ liệu theo hàng",
            "Tính tổng",
            "Lọc dữ liệu",
            "Tạo công thức"
        ],
        answer: 0
    },

    {
        question: "Trong Pivot Table, Values thường dùng để làm gì?",
        options: [
            "Tính toán dữ liệu",
            "Đổi màu bảng",
            "Đặt tên sheet",
            "Ẩn cột"
        ],
        answer: 0
    },

    {
        question: "Pareto thường gắn với nguyên tắc nào?",
        options: ["50/50", "80/20", "70/30", "90/10"],
        answer: 1
    },

    {
        question: "Biểu đồ Pareto thường dùng để làm gì?",
        options: [
            "Xác định vấn đề ưu tiên",
            "Viết công thức",
            "Đổi định dạng ngày",
            "Chèn hyperlink"
        ],
        answer: 0
    },

    {
        question: "Filter trong Excel dùng để làm gì?",
        options: [
            "Lọc dữ liệu",
            "Tạo biểu đồ",
            "Đổi màu chữ",
            "Tính tổng"
        ],
        answer: 0
    },

    {
        question: "Sort Largest to Smallest nghĩa là gì?",
        options: [
            "Sắp xếp từ lớn xuống nhỏ",
            "Sắp xếp từ nhỏ lên lớn",
            "Lọc dữ liệu",
            "Xóa dữ liệu"
        ],
        answer: 0
    },

    {
        question: "Ctrl + C dùng để làm gì?",
        options: ["Copy", "Paste", "Save", "Undo"],
        answer: 0
    },

    {
        question: "Ctrl + V dùng để làm gì?",
        options: ["Paste", "Copy", "Undo", "Save"],
        answer: 0
    },

    {
        question: "Ctrl + Z dùng để làm gì?",
        options: ["Undo", "Redo", "Copy", "Print"],
        answer: 0
    },

    {
        question: "Ctrl + S dùng để làm gì?",
        options: ["Lưu file", "Mở file", "Đóng file", "In file"],
        answer: 0
    },

    {
        question: "Ctrl + Shift + L trong Excel dùng để làm gì?",
        options: [
            "Bật hoặc tắt Filter",
            "Tạo Pivot",
            "Lưu file",
            "Chèn biểu đồ"
        ],
        answer: 0
    },

    {
        question: "Hàm LEN dùng để làm gì?",
        options: [
            "Đếm số ký tự",
            "Đếm số ô",
            "Tính tổng",
            "Tìm giá trị lớn nhất"
        ],
        answer: 0
    },

    {
        question: "Hàm TODAY() trả về gì?",
        options: [
            "Ngày hiện tại",
            "Giờ hiện tại",
            "Tên người dùng",
            "Tên sheet"
        ],
        answer: 0
    },

    {
        question: "Hàm NOW() trả về gì?",
        options: [
            "Ngày và giờ hiện tại",
            "Chỉ ngày",
            "Chỉ giờ",
            "Số dòng"
        ],
        answer: 0
    }

];


let currentQuiz = [];
let previousQuiz = [];
let quizAttempt = 1;

/* ===== RANDOM 5 CÂU ===== */
function taoBoCauHoiMoi() {

    let availableQuestions =
        quizBank.filter(function(question) {

            return !previousQuiz.includes(question);

        });


    /* Nếu số câu còn lại ít hơn 5
       thì cho phép dùng lại toàn bộ ngân hàng */

    if (availableQuestions.length < 5) {
        availableQuestions = [...quizBank];
    }


    const shuffled =
        [...availableQuestions]
            .sort(() => Math.random() - 0.5);


    currentQuiz =
        shuffled.slice(0, 5);


    /* Lưu 5 câu hiện tại
       để lượt sau không bị trùng */

    previousQuiz =
        [...currentQuiz];


    hienThiQuiz();

}


/* ===== HIỂN THỊ CÂU HỎI ===== */

function hienThiQuiz() {

    const container =
        document.getElementById("quizQuestions");

    const result =
        document.getElementById("quizResult");

    if (!container) return;

    container.innerHTML = "";

    if (result) {
        result.style.display = "none";
        result.textContent = "";
    }


    currentQuiz.forEach(function(item, index) {

        const questionBox =
            document.createElement("div");

        questionBox.className =
            "quiz-question";


        const questionTitle =
            document.createElement("p");

        questionTitle.innerHTML =
            "<strong>" +
            (index + 1) +
            ". " +
            item.question +
            "</strong>";

        questionBox.appendChild(
            questionTitle
        );


        item.options.forEach(function(option, optionIndex) {

            const label =
                document.createElement("label");

            const radio =
                document.createElement("input");

            radio.type = "radio";
            radio.addEventListener(
    "change",
    capNhatTienDoQuiz
);

            radio.name =
                "q" + index;

            radio.value =
                optionIndex;

            label.appendChild(radio);

            label.appendChild(
                document.createTextNode(
                    " " + option
                )
            );

            questionBox.appendChild(label);

        });


        container.appendChild(
            questionBox
        );

    });

}


/* ===== CHẤM ĐIỂM ===== */
/* ===== TIẾN ĐỘ TRẮC NGHIỆM ===== */

function capNhatTienDoQuiz() {

    const selectedAnswers =
        document.querySelectorAll(
            '#quizQuestions input[type="radio"]:checked'
        ).length;

    const percent =
        Math.round((selectedAnswers / 5) * 100);

    const fill =
        document.getElementById("quizProgressFill");

    const percentText =
        document.getElementById("quizProgressPercent");

    const progressText =
        document.getElementById("quizProgressText");

    const submitButton =
        document.getElementById("submitQuizBtn");


    if (fill) {
        fill.style.width = percent + "%";
    }

    if (percentText) {
        percentText.textContent = percent + "%";
    }

    if (progressText) {
        progressText.textContent =
            "Đã trả lời " + selectedAnswers + "/5 câu";
    }

    if (submitButton) {
        submitButton.disabled =
            selectedAnswers < 5;
    }

}
function chamDiemQuiz() {

    let score = 0;

    const questionBoxes =
        document.querySelectorAll(
            "#quizQuestions .quiz-question"
        );


    currentQuiz.forEach(function(item, index) {

        const selected =
            document.querySelector(
                'input[name="q' +
                index +
                '"]:checked'
            );

        const box =
            questionBoxes[index];

        box.classList.remove(
            "quiz-correct",
            "quiz-wrong"
        );


        if (
            selected &&
            Number(selected.value) === item.answer
        ) {

            score++;

            box.classList.add(
                "quiz-correct"
            );

        } else {

            box.classList.add(
                "quiz-wrong"
            );

        }

    });


    const result =
        document.getElementById(
            "quizResult"
        );

    if (!result) return;

    result.style.display =
        "block";


    if (score === 5) {

        result.textContent =
            "🏆 Xuất sắc! Bạn đạt 5/5.";

        result.style.background =
            "#d8f3dc";

        result.style.color =
            "#146c2e";

    } else if (score >= 3) {

        result.textContent =
            "👍 Bạn đạt " +
            score +
            "/5.";

        result.style.background =
            "#fff3cd";

        result.style.color =
            "#856404";

    } else {

        result.textContent =
            "📚 Bạn đạt " +
            score +
            "/5.";

        result.style.background =
            "#f8d7da";

        result.style.color =
            "#842029";

    }


    /*
        Sau khi nộp bài, đợi một chút
        rồi random sang bộ 5 câu mới.
    */

    setTimeout(function() {

    quizAttempt++;

    const attemptElement =
        document.getElementById("quizAttempt");

    if (attemptElement) {

        attemptElement.textContent =
            "Lượt: " + quizAttempt;

    }

    taoBoCauHoiMoi();

        window.scrollTo({
            top:
                document
                .querySelector(".quiz-section")
                .offsetTop - 80,

            behavior: "smooth"
        });

    }, 2500);
const attemptElement =
    document.getElementById("quizAttempt");

const currentScoreElement =
    document.getElementById("quizCurrentScore");

const bestScoreElement =
    document.getElementById("quizBestScore");


if (currentScoreElement) {

    currentScoreElement.textContent =
        "Điểm hiện tại: " + score + "/5";

}


/* ===== LƯU ĐIỂM CAO NHẤT ===== */

let bestScore =
    Number(
        localStorage.getItem("quizBestScore")
    ) || 0;

if (score > bestScore) {

    bestScore = score;

    localStorage.setItem(
        "quizBestScore",
        bestScore
    );

}

if (bestScoreElement) {

    bestScoreElement.textContent =
        "Kỷ lục: " + bestScore + "/5";

}

if (window.avpRecordLearningEvent) {
    window.avpRecordLearningEvent("quiz_attempt", { score: score });
}
}


/* ===== ĐỔI BỘ CÂU HỎI THỦ CÔNG ===== */

function lamLaiQuiz() {

    taoBoCauHoiMoi();

}


/* ===== TẠO QUIZ KHI MỞ TRANG ===== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        if (
            document.getElementById(
                "quizQuestions"
            )
        ) {

            taoBoCauHoiMoi();

        }
const bestScoreElement =
    document.getElementById("quizBestScore");

const savedBestScore =
    Number(
        localStorage.getItem("quizBestScore")
    ) || 0;

if (bestScoreElement) {

    bestScoreElement.textContent =
        "Kỷ lục: " + savedBestScore + "/5";

}
    }
);
/* ===== 100 PHÍM TẮT EXCEL ===== */

const excelShortcuts = [

    /* CƠ BẢN */
    ["Ctrl + C", "Sao chép", "Cơ bản"],
    ["Ctrl + V", "Dán", "Cơ bản"],
    ["Ctrl + X", "Cắt", "Cơ bản"],
    ["Ctrl + Z", "Hoàn tác", "Cơ bản"],
    ["Ctrl + Y", "Làm lại", "Cơ bản"],
    ["Ctrl + S", "Lưu file", "Cơ bản"],
    ["Ctrl + O", "Mở file", "Cơ bản"],
    ["Ctrl + N", "Tạo workbook mới", "Cơ bản"],
    ["Ctrl + P", "In", "Cơ bản"],
    ["Ctrl + F", "Tìm kiếm", "Cơ bản"],

    /* CHỈNH SỬA */
    ["F2", "Chỉnh sửa ô hiện tại", "Chỉnh sửa"],
    ["Delete", "Xóa nội dung ô", "Chỉnh sửa"],
    ["Ctrl + H", "Find & Replace", "Chỉnh sửa"],
    ["Ctrl + D", "Fill Down", "Chỉnh sửa"],
    ["Ctrl + R", "Fill Right", "Chỉnh sửa"],
    ["Ctrl + Enter", "Điền cùng giá trị vào vùng đã chọn", "Chỉnh sửa"],
    ["Alt + Enter", "Xuống dòng trong cùng một ô", "Chỉnh sửa"],
    ["Ctrl + ;", "Nhập ngày hiện tại", "Chỉnh sửa"],
    ["Ctrl + Shift + ;", "Nhập giờ hiện tại", "Chỉnh sửa"],
    ["Ctrl + K", "Chèn hyperlink", "Chỉnh sửa"],

    /* ĐIỀU HƯỚNG */
    ["Ctrl + Home", "Về ô A1", "Điều hướng"],
    ["Ctrl + End", "Đi tới ô cuối vùng dữ liệu", "Điều hướng"],
    ["Ctrl + ↑", "Đi tới mép trên vùng dữ liệu", "Điều hướng"],
    ["Ctrl + ↓", "Đi tới mép dưới vùng dữ liệu", "Điều hướng"],
    ["Ctrl + ←", "Đi tới mép trái vùng dữ liệu", "Điều hướng"],
    ["Ctrl + →", "Đi tới mép phải vùng dữ liệu", "Điều hướng"],
    ["Page Up", "Cuộn lên một màn hình", "Điều hướng"],
    ["Page Down", "Cuộn xuống một màn hình", "Điều hướng"],
    ["Alt + Page Up", "Cuộn sang trái", "Điều hướng"],
    ["Alt + Page Down", "Cuộn sang phải", "Điều hướng"],

    /* CHỌN DỮ LIỆU */
    ["Ctrl + A", "Chọn vùng dữ liệu / toàn sheet", "Chọn dữ liệu"],
    ["Shift + Space", "Chọn toàn bộ hàng", "Chọn dữ liệu"],
    ["Ctrl + Space", "Chọn toàn bộ cột", "Chọn dữ liệu"],
    ["Ctrl + Shift + ↑", "Chọn tới mép trên vùng dữ liệu", "Chọn dữ liệu"],
    ["Ctrl + Shift + ↓", "Chọn tới mép dưới vùng dữ liệu", "Chọn dữ liệu"],
    ["Ctrl + Shift + ←", "Chọn tới mép trái vùng dữ liệu", "Chọn dữ liệu"],
    ["Ctrl + Shift + →", "Chọn tới mép phải vùng dữ liệu", "Chọn dữ liệu"],
    ["Shift + Arrow", "Mở rộng vùng chọn từng ô", "Chọn dữ liệu"],
    ["Ctrl + Shift + Space", "Chọn toàn bộ bảng hiện tại", "Chọn dữ liệu"],
    ["Ctrl + Shift + End", "Chọn tới ô cuối vùng dùng", "Chọn dữ liệu"],

    /* ĐỊNH DẠNG */
    ["Ctrl + B", "In đậm", "Định dạng"],
    ["Ctrl + I", "In nghiêng", "Định dạng"],
    ["Ctrl + U", "Gạch chân", "Định dạng"],
    ["Ctrl + 1", "Mở Format Cells", "Định dạng"],
    ["Ctrl + Shift + $", "Định dạng tiền tệ", "Định dạng"],
    ["Ctrl + Shift + %", "Định dạng phần trăm", "Định dạng"],
    ["Ctrl + Shift + #", "Định dạng ngày", "Định dạng"],
    ["Ctrl + Shift + @", "Định dạng giờ", "Định dạng"],
    ["Ctrl + Shift + !", "Định dạng số có phân cách hàng nghìn", "Định dạng"],
    ["Ctrl + Shift + ~", "Định dạng General", "Định dạng"],

    /* CÔNG THỨC */
    ["Alt + =", "AutoSum", "Công thức"],
    ["F4", "Khóa/mở khóa tham chiếu $ trong công thức", "Công thức"],
    ["Ctrl + `", "Hiện/ẩn công thức", "Công thức"],
    ["Shift + F3", "Mở Insert Function", "Công thức"],
    ["Ctrl + Shift + Enter", "Nhập công thức mảng kiểu cũ", "Công thức"],
    ["F9", "Tính toán lại workbook", "Công thức"],
    ["Shift + F9", "Tính toán lại sheet hiện tại", "Công thức"],
    ["Ctrl + Alt + F9", "Tính lại toàn bộ workbook", "Công thức"],
    ["Ctrl + Shift + U", "Mở rộng/thụ gọn Formula Bar", "Công thức"],
    ["Ctrl + Shift + A", "Chèn tên đối số hàm", "Công thức"],

    /* SHEET / WORKBOOK */
    ["Shift + F11", "Tạo worksheet mới", "Sheet"],
    ["Ctrl + Page Up", "Sang sheet trước", "Sheet"],
    ["Ctrl + Page Down", "Sang sheet sau", "Sheet"],
    ["Alt + H + O + R", "Đổi tên sheet", "Sheet"],
    ["Alt + H + D + S", "Xóa sheet", "Sheet"],
    ["Ctrl + Tab", "Chuyển workbook Excel đang mở", "Sheet"],
    ["Ctrl + F4", "Đóng workbook hiện tại", "Sheet"],
    ["Alt + F4", "Thoát Excel", "Sheet"],
    ["Ctrl + Shift + F1", "Ẩn/hiện Ribbon", "Sheet"],
    ["Ctrl + F1", "Thu gọn/mở rộng Ribbon", "Sheet"],

    /* HÀNG / CỘT */
    ["Ctrl + +", "Chèn ô/hàng/cột", "Hàng & Cột"],
    ["Ctrl + -", "Xóa ô/hàng/cột", "Hàng & Cột"],
    ["Ctrl + 9", "Ẩn hàng", "Hàng & Cột"],
    ["Ctrl + 0", "Ẩn cột", "Hàng & Cột"],
    ["Ctrl + Shift + 9", "Hiện hàng", "Hàng & Cột"],
    ["Ctrl + Shift + 0", "Hiện cột", "Hàng & Cột"],
    ["Alt + H + O + A", "AutoFit chiều cao hàng", "Hàng & Cột"],
    ["Alt + H + O + I", "AutoFit chiều rộng cột", "Hàng & Cột"],
    ["Alt + H + O + H", "Đặt chiều cao hàng", "Hàng & Cột"],
    ["Alt + H + O + W", "Đặt chiều rộng cột", "Hàng & Cột"],

    /* TABLE / FILTER */
    ["Ctrl + T", "Tạo Table", "Table & Filter"],
    ["Ctrl + Shift + L", "Bật/tắt Filter", "Table & Filter"],
    ["Alt + ↓", "Mở menu Filter/Data Validation", "Table & Filter"],
    ["Ctrl + Shift + +", "Chèn hàng/cột trong Table", "Table & Filter"],
    ["Ctrl + A", "Chọn dữ liệu trong Table", "Table & Filter"],
    ["Tab", "Chuyển sang ô tiếp theo trong Table", "Table & Filter"],
    ["Shift + Tab", "Quay lại ô trước trong Table", "Table & Filter"],
    ["Alt + A + C", "Clear Filter", "Table & Filter"],
    ["Alt + A + S + A", "Sort A to Z / Smallest to Largest", "Table & Filter"],
    ["Alt + A + S + D", "Sort Z to A / Largest to Smallest", "Table & Filter"],

    /* PIVOT / DATA */
    ["Alt + N + V", "Tạo PivotTable", "Pivot & Data"],
    ["Alt + A + R + A", "Refresh All", "Pivot & Data"],
    ["Alt + F5", "Refresh PivotTable hiện tại", "Pivot & Data"],
    ["Ctrl + Alt + F5", "Refresh All Connections", "Pivot & Data"],
    ["Alt + A + M", "Remove Duplicates", "Pivot & Data"],
    ["Alt + A + E", "Text to Columns", "Pivot & Data"],
    ["Alt + A + V + V", "Data Validation", "Pivot & Data"],
    ["Ctrl + E", "Flash Fill", "Pivot & Data"],
    ["Alt + A + Q", "Advanced Filter", "Pivot & Data"],
    ["Alt + A + W", "What-If Analysis", "Pivot & Data"]

];


/* ===== HIỂN THỊ 100 PHÍM TẮT ===== */

function renderShortcuts(shortcuts) {

    const container =
        document.getElementById("shortcutContainer");

    if (!container) return;

    container.innerHTML = "";

    shortcuts.forEach(function(item, index) {

        const card =
            document.createElement("div");

        card.className = "shortcut-card";

        card.innerHTML = `
            <div class="shortcut-index">
                ${String(index + 1).padStart(2, "0")}
            </div>

            <div class="shortcut-key">
                ${item[0]}
            </div>

            <div class="shortcut-description">
                ${item[1]}
            </div>

            <div class="shortcut-category">
                ${item[2]}
            </div>
        `;

        container.appendChild(card);

    });

}


/* ===== TÌM KIẾM PHÍM TẮT ===== */

document.addEventListener("DOMContentLoaded", function () {

    const search =
        document.getElementById("shortcutSearch");

    if (!search) return;

    renderShortcuts(excelShortcuts);

    search.addEventListener("input", function () {

    capNhatDanhSachPhimTat();

});

        const keyword =
            this.value.toLowerCase().trim();

        const results =
            excelShortcuts.filter(function(item) {

                return (
                    item[0].toLowerCase().includes(keyword) ||
                    item[1].toLowerCase().includes(keyword) ||
                    item[2].toLowerCase().includes(keyword)
                );

            });

        renderShortcuts(results);

    });


let shortcutCategory = "Tất cả";

function locPhimTat(category, button) {

    shortcutCategory = category;

    document
        .querySelectorAll(".shortcut-filter")
        .forEach(function(btn) {
            btn.classList.remove("active");
        });

    if (button) {
        button.classList.add("active");
    }

    capNhatDanhSachPhimTat();
}


function capNhatDanhSachPhimTat() {

    const search =
        document.getElementById("shortcutSearch");

    const keyword =
        search
            ? search.value.toLowerCase().trim()
            : "";

    const results =
        excelShortcuts.filter(function(item) {

            const matchSearch =
                item[0].toLowerCase().includes(keyword) ||
                item[1].toLowerCase().includes(keyword) ||
                item[2].toLowerCase().includes(keyword);

            const matchCategory =
                shortcutCategory === "Tất cả" ||
                item[2] === shortcutCategory;

            return matchSearch && matchCategory;
        });

    renderShortcuts(results);
}
/* ===== HIGHLIGHT MENU THEO TRANG HIỆN TẠI ===== */

document.addEventListener("DOMContentLoaded", function () {

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const menuLinks =
        document.querySelectorAll("nav a");

    menuLinks.forEach(function(link) {

        link.classList.remove("active");

        const href =
            link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
        }

    });

});
/* ===== EXCEL FORMULA FINDER ===== */

const formulaDatabase = [

    {
        keywords: [
            "tính tổng theo điều kiện",
            "sumif",
            "sumifs",
            "tổng theo model",
            "tổng ng theo model"
        ],
        title: "SUMIF / SUMIFS",
        formula: '=SUMIFS(E:E,B:B,"FPC-A01")',
        description:
            "Dùng để tính tổng theo một hoặc nhiều điều kiện.",
        example:
            "Ví dụ: cộng NG Qty ở cột E cho Model FPC-A01 ở cột B."
    },

    {
        keywords: [
            "tra cứu dữ liệu",
            "tra cứu mã",
            "vlookup",
            "xlookup",
            "lấy tên sản phẩm"
        ],
        title: "XLOOKUP / VLOOKUP",
        formula: '=XLOOKUP(A2,H:H,I:I,"Không tìm thấy")',
        description:
            "Dùng để tìm một giá trị và trả về dữ liệu tương ứng.",
        example:
            "Ví dụ: lấy tên sản phẩm dựa trên mã sản phẩm ở ô A2."
    },

    {
        keywords: [
            "đếm số lỗi",
            "đếm ng",
            "countif",
            "countifs"
        ],
        title: "COUNTIF / COUNTIFS",
        formula: '=COUNTIF(F:F,"NG")',
        description:
            "Dùng để đếm số ô thỏa mãn điều kiện.",
        example:
            "Ví dụ: đếm số dòng có trạng thái NG ở cột F."
    },

    {
        keywords: [
            "pass ng",
            "kiểm tra điều kiện",
            "if",
            "ng rate lớn hơn",
            "ng rate >"
        ],
        title: "IF",
        formula: '=IF(F2<=3%,"PASS","NG")',
        description:
            "Dùng để trả về kết quả khác nhau tùy điều kiện.",
        example:
            "Nếu NG Rate ở F2 nhỏ hơn hoặc bằng 3% thì PASS, ngược lại NG."
    },

    {
        keywords: [
            "tính ng rate",
            "ng rate",
            "tỷ lệ lỗi"
        ],
        title: "Tính NG Rate",
        formula: '=IF(D2=0,0,E2/D2)',
        description:
            "Tính tỷ lệ lỗi bằng NG Qty chia Input Qty.",
        example:
            "Nếu Input Qty ở D2 và NG Qty ở E2 thì kết quả là NG Rate."
    },

    {
        keywords: [
            "tìm giá trị lớn nhất",
            "max",
            "lớn nhất"
        ],
        title: "MAX",
        formula: '=MAX(E2:E100)',
        description:
            "Trả về giá trị lớn nhất trong vùng.",
        example:
            "Ví dụ: tìm NG Qty lớn nhất từ E2 đến E100."
    },

    {
        keywords: [
            "tìm giá trị nhỏ nhất",
            "min",
            "nhỏ nhất"
        ],
        title: "MIN",
        formula: '=MIN(E2:E100)',
        description:
            "Trả về giá trị nhỏ nhất trong vùng.",
        example:
            "Ví dụ: tìm NG Qty nhỏ nhất."
    },

    {
        keywords: [
            "tính trung bình",
            "average",
            "trung bình"
        ],
        title: "AVERAGE",
        formula: '=AVERAGE(E2:E100)',
        description:
            "Tính giá trị trung bình của một vùng.",
        example:
            "Ví dụ: tính NG Qty trung bình."
    },

    {
        keywords: [
            "xếp hạng",
            "rank",
            "thứ hạng"
        ],
        title: "RANK",
        formula: '=RANK(E2,$E$2:$E$100,0)',
        description:
            "Xếp hạng giá trị từ lớn xuống nhỏ.",
        example:
            "Ví dụ: xếp hạng NG Qty của từng Lot."
    },

    {
        keywords: [
            "nối chuỗi",
            "ghép chữ",
            "concatenate",
            "textjoin"
        ],
        title: "TEXTJOIN",
        formula: '=TEXTJOIN("-",TRUE,A2,B2,C2)',
        description:
            "Ghép nhiều ô thành một chuỗi.",
        example:
            "Ví dụ: ghép Model, Lot No và Process bằng dấu -."
    },

    {
        keywords: [
            "đếm ký tự",
            "len",
            "độ dài chuỗi"
        ],
        title: "LEN",
        formula: '=LEN(A2)',
        description:
            "Đếm số ký tự trong một ô.",
        example:
            "Ví dụ: kiểm tra độ dài mã sản phẩm."
    },

    {
        keywords: [
            "lấy ký tự bên trái",
            "left"
        ],
        title: "LEFT",
        formula: '=LEFT(A2,3)',
        description:
            "Lấy số ký tự từ bên trái.",
        example:
            "Ví dụ: lấy 3 ký tự đầu của mã."
    },

    {
        keywords: [
            "lấy ký tự bên phải",
            "right"
        ],
        title: "RIGHT",
        formula: '=RIGHT(A2,4)',
        description:
            "Lấy số ký tự từ bên phải.",
        example:
            "Ví dụ: lấy 4 ký tự cuối của Lot No."
    },

    {
        keywords: [
            "lấy ký tự ở giữa",
            "mid"
        ],
        title: "MID",
        formula: '=MID(A2,3,5)',
        description:
            "Lấy một đoạn ký tự ở giữa chuỗi.",
        example:
            "Ví dụ: lấy 5 ký tự từ vị trí thứ 3."
    },

    {
        keywords: [
            "xóa khoảng trắng",
            "trim",
            "khoảng trắng thừa"
        ],
        title: "TRIM",
        formula: '=TRIM(A2)',
        description:
            "Xóa khoảng trắng thừa trong chuỗi.",
        example:
            "Dùng khi dữ liệu copy từ hệ thống có nhiều khoảng trắng."
    },

    {
        keywords: [
            "ngày hôm nay",
            "today",
            "ngày hiện tại"
        ],
        title: "TODAY",
        formula: '=TODAY()',
        description:
            "Trả về ngày hiện tại.",
        example:
            "Có thể dùng để tính số ngày tồn tại của một Issue."
    },

    {
        keywords: [
            "ngày giờ hiện tại",
            "now",
            "giờ hiện tại"
        ],
        title: "NOW",
        formula: '=NOW()',
        description:
            "Trả về ngày và giờ hiện tại.",
        example:
            "Dùng để ghi thời gian cập nhật báo cáo."
    },

    {
        keywords: [
            "đếm ô có dữ liệu",
            "counta"
        ],
        title: "COUNTA",
        formula: '=COUNTA(A2:A100)',
        description:
            "Đếm số ô không trống.",
        example:
            "Ví dụ: đếm số Lot có dữ liệu."
    },

    {
        keywords: [
            "đếm số",
            "count"
        ],
        title: "COUNT",
        formula: '=COUNT(E2:E100)',
        description:
            "Đếm các ô chứa số.",
        example:
            "Ví dụ: đếm số dòng có NG Qty dạng số."
    },

    {
        keywords: [
            "làm tròn",
            "round"
        ],
        title: "ROUND",
        formula: '=ROUND(F2,4)',
        description:
            "Làm tròn số đến số chữ số mong muốn.",
        example:
            "Ví dụ: làm tròn NG Rate đến 4 chữ số thập phân."
    }

];


/* ===== TÌM CÔNG THỨC ===== */

function timCongThucExcel() {

    const input =
        document.getElementById("formulaQuery");

    const resultBox =
        document.getElementById("formulaResult");

    if (!input || !resultBox) return;

    const keyword =
        input.value.toLowerCase().trim();

    if (keyword === "") {

        resultBox.innerHTML =
            "<p>⚠️ Hãy nhập yêu cầu cần làm trong Excel.</p>";

        return;
    }

    const result =
        formulaDatabase.find(function(item) {

            return item.keywords.some(function(key) {

                return (
                    keyword.includes(key) ||
                    key.includes(keyword)
                );

            });

        });


    if (!result) {

        resultBox.innerHTML = `
            <h3>🤔 Chưa tìm thấy công thức phù hợp</h3>

            <p>
                Thử nhập ngắn hơn, ví dụ:
                <strong>tổng theo điều kiện</strong>,
                <strong>tra cứu</strong>,
                <strong>đếm lỗi</strong>,
                <strong>NG Rate</strong>.
            </p>
        `;

        return;
    }


    resultBox.innerHTML = `
        <h2>✅ ${result.title}</h2>

        <p>${result.description}</p>

        <div class="formula-code">
            ${result.formula}
        </div>

        <p>
            <strong>Ví dụ:</strong>
            ${result.example}
        </p>

        <button
            class="copy-formula-btn"
            onclick="copyFormula(this)"
            data-formula='${result.formula.replace(/'/g, "&#39;")}'
        >
            📋 Sao chép công thức
        </button>
    `;

}


/* ===== NÚT GỢI Ý ===== */

function dienYeuCau(text) {

    const input =
        document.getElementById("formulaQuery");

    if (!input) return;

    input.value = text;

    timCongThucExcel();

}


/* ===== COPY CÔNG THỨC ===== */

function copyFormula(button) {

    const formula =
        button.dataset.formula;

    navigator.clipboard.writeText(formula);

    const oldText =
        button.textContent;

    button.textContent =
        "✅ Đã sao chép";

    setTimeout(function() {

        button.textContent =
            oldText;

    }, 1500);

}
/* ===== FORMULA BUILDER ===== */

function taoCongThucNgRate() {

    const inputCell =
        document.getElementById("inputCell").value.trim();

    const ngCell =
        document.getElementById("ngCell").value.trim();

    const result =
        document.getElementById("builderResult");

    if (!inputCell || !ngCell) {

        result.innerHTML =
            "<p>⚠️ Hãy nhập ô Input Qty và NG Qty.</p>";

        return;
    }

    const formula =
        `=IF(${inputCell}=0,0,${ngCell}/${inputCell})`;

    hienThiCongThucBuilder(
        "NG Rate",
        formula
    );
}


function taoCongThucPassNg() {

    const inputCell =
        document.getElementById("inputCell").value.trim();

    const ngCell =
        document.getElementById("ngCell").value.trim();

    const target =
        document.getElementById("targetRate").value.trim();

    const result =
        document.getElementById("builderResult");

    if (!inputCell || !ngCell || !target) {

        result.innerHTML =
            "<p>⚠️ Hãy nhập đủ Input Qty, NG Qty và Target.</p>";

        return;
    }

    const formula =
        `=IF(${inputCell}=0,"",IF(${ngCell}/${inputCell}<=${target},"PASS","NG"))`;

    hienThiCongThucBuilder(
        "PASS / NG",
        formula
    );
}


function hienThiCongThucBuilder(title, formula) {

    const result =
        document.getElementById("builderResult");

    if (!result) return;

    result.innerHTML = `
        <h3>${title}</h3>

        <div class="formula-code">
            ${formula}
        </div>

        <button
            class="copy-formula-btn"
            onclick="copyBuilderFormula(this)"
            data-formula='${formula.replace(/'/g, "&#39;")}'
        >
            📋 Sao chép công thức
        </button>
    `;
}


function copyBuilderFormula(button) {

    const formula =
        button.dataset.formula;

    navigator.clipboard.writeText(formula);

    button.textContent =
        "✅ Đã sao chép";

    setTimeout(function() {

        button.textContent =
            "📋 Sao chép công thức";

    }, 1500);
}
/* ===== SUMIFS BUILDER ===== */

function taoSumifs() {

    const sumRange =
        document.getElementById("sumRange").value.trim();

    const criteriaRange =
        document.getElementById("sumCriteriaRange").value.trim();

    const criteria =
        document.getElementById("sumCriteria").value.trim();

    if (!sumRange || !criteriaRange || !criteria) {
        hienThiAdvancedFormula(
            "⚠️ Hãy nhập đủ thông tin SUMIFS."
        );
        return;
    }

    const formula =
        `=SUMIFS(${sumRange},${criteriaRange},"${criteria}")`;

    hienThiAdvancedFormula(formula);
}


/* ===== COUNTIFS BUILDER ===== */

function taoCountifs() {

    const range =
        document.getElementById("countCriteriaRange").value.trim();

    const criteria =
        document.getElementById("countCriteria").value.trim();

    if (!range || !criteria) {
        hienThiAdvancedFormula(
            "⚠️ Hãy nhập vùng và điều kiện COUNTIFS."
        );
        return;
    }

    const formula =
        `=COUNTIFS(${range},"${criteria}")`;

    hienThiAdvancedFormula(formula);
}


/* ===== XLOOKUP BUILDER ===== */

function taoXlookup() {

    const value =
        document.getElementById("lookupValue").value.trim();

    const lookupRange =
        document.getElementById("lookupRange").value.trim();

    const returnRange =
        document.getElementById("returnRange").value.trim();

    if (!value || !lookupRange || !returnRange) {
        hienThiAdvancedFormula(
            "⚠️ Hãy nhập đủ thông tin XLOOKUP."
        );
        return;
    }

    const formula =
        `=XLOOKUP(${value},${lookupRange},${returnRange},"Không tìm thấy")`;

    hienThiAdvancedFormula(formula);
}


/* ===== HIỂN THỊ KẾT QUẢ ===== */

function hienThiAdvancedFormula(formula) {

    const result =
        document.getElementById("advancedBuilderResult");

    if (!result) return;

    if (formula.startsWith("⚠️")) {

        result.innerHTML =
            `<p>${formula}</p>`;

        return;
    }

    result.innerHTML = `
        <div class="formula-code">
            ${formula}
        </div>

        <button
            class="copy-formula-btn"
            onclick="copyBuilderFormula(this)"
            data-formula='${formula.replace(/'/g, "&#39;")}'
        >
            📋 Sao chép công thức
        </button>
    `;
}
/* ===== FORMULA TESTER ===== */

function testNgFormula() {

    const inputQty =
        Number(
            document.getElementById("testInputQty").value
        );

    const ngQty =
        Number(
            document.getElementById("testNgQty").value
        );

    const target =
        Number(
            document.getElementById("testTarget").value
        );

    const result =
        document.getElementById("testerResult");

    if (!result) return;

    if (
        inputQty <= 0 ||
        ngQty < 0 ||
        target < 0
    ) {

        result.innerHTML = `
            <div class="test-result-card ng">
                ⚠️ Hãy nhập dữ liệu hợp lệ.
            </div>
        `;

        return;
    }


    const ngRate =
        (ngQty / inputQty) * 100;

    const status =
        ngRate <= target
            ? "PASS"
            : "NG";


    const statusClass =
        status === "PASS"
            ? "pass"
            : "ng";


    result.innerHTML = `
        <div class="test-result-card ${statusClass}">

            <p>
                <strong>Input Qty:</strong>
                ${inputQty}
            </p>

            <p>
                <strong>NG Qty:</strong>
                ${ngQty}
            </p>

            <p>
                <strong>NG Rate:</strong>
                ${ngRate.toFixed(2)}%
            </p>

            <p>
                <strong>Target:</strong>
                ${target}%
            </p>

            <p>
                <strong>Kết quả:</strong>
                ${status === "PASS"
                    ? "✅ PASS"
                    : "❌ NG"}
            </p>

        </div>
    `;

}
/* ===== MINI QC DASHBOARD ===== */

let dashboardLots =
    JSON.parse(
        localStorage.getItem("dashboardLots")
    ) || [];

function themLotDashboard() {

    const lot =
        document.getElementById("dashLot").value.trim();

    const model =
        document.getElementById("dashModel").value.trim();

    const process =
        document.getElementById("dashProcess").value.trim();

    const input =
        Number(
            document.getElementById("dashInput").value
        );

    const ng =
        Number(
            document.getElementById("dashNg").value
        );

    const target =
        Number(
            document.getElementById("dashTarget").value
        );


    if (
        !lot ||
        !model ||
        !process ||
        input <= 0 ||
        ng < 0 ||
        target < 0
    ) {

        alert("Hãy nhập đầy đủ dữ liệu Lot.");

        return;
    }


    dashboardLots.push({
        lot: lot,
        model: model,
        process: process,
        input: input,
        ng: ng,
        target: target
    });


    /* LƯU DỮ LIỆU */

    localStorage.setItem(
        "dashboardLots",
        JSON.stringify(dashboardLots)
    );


    /* XÓA NỘI DUNG SAU KHI THÊM */

    document.getElementById("dashLot").value = "";
    document.getElementById("dashModel").value = "";
    document.getElementById("dashProcess").value = "";
    document.getElementById("dashInput").value = "";
    document.getElementById("dashNg").value = "";


    /* CẬP NHẬT DASHBOARD + BIỂU ĐỒ */

    capNhatDashboard();

}
/* ===== BIỂU ĐỒ NG RATE THEO LOT ===== */
function capNhatBieuDoDashboard() {

    const chart =
        document.getElementById("dashboardChart");

    if (!chart) return;


    const modelElement =
        document.getElementById("filterModel");

    const processElement =
        document.getElementById("filterProcess");


    const filterModel =
        modelElement
            ? modelElement.value
            : "all";

    const filterProcess =
        processElement
            ? processElement.value
            : "all";


    const filteredLots =
        dashboardLots.filter(function(item) {

            const modelOk =
                filterModel === "all" ||
                item.model === filterModel;

            const processOk =
                filterProcess === "all" ||
                item.process === filterProcess;

            return modelOk && processOk;

        });


    chart.innerHTML = "";


    if (filteredLots.length === 0) {

        chart.innerHTML =
            "<p>Chưa có dữ liệu để hiển thị biểu đồ.</p>";

        return;
    }


    const rates =
        filteredLots.map(function(item) {

            if (!item.input || item.input <= 0) {
                return 0;
            }

            return (
                item.ng / item.input
            ) * 100;

        });


    const maxRate =
        Math.max(
            ...rates,
            5
        );


    filteredLots.forEach(
        function(item, index) {

            const rate =
                rates[index];

            const height =
                Math.max(
                    4,
                    Math.min(
                        (rate / maxRate) * 100,
                        100
                    )
                );

            const isNg =
                rate > Number(item.target);


            const lotElement =
                document.createElement("div");

            lotElement.className =
                "chart-lot";


            lotElement.innerHTML = `

                <div class="chart-bar-wrap">

                    <div
                        class="chart-bar ${isNg ? "ng" : ""}"
                        style="height: ${height}%"
                        title="${item.lot}: ${rate.toFixed(2)}%"
                    >
                    </div>

                </div>

                <div class="chart-value">
                    ${rate.toFixed(2)}%
                </div>

                <div class="chart-label">
                    ${item.lot}
                </div>

            `;


            chart.appendChild(
                lotElement
            );

        }
    );

}

function xoaLotDashboard(index) {

    dashboardLots.splice(index, 1);

    localStorage.setItem(
        "dashboardLots",
        JSON.stringify(dashboardLots)
    );

    capNhatDashboard();

}


function capNhatDashboard() {

    const body =
        document.getElementById("dashboardBody");

    if (!body) return;
capNhatBoLocDashboard();
capNhatTopNgLots();
capNhatCanhBaoQC();
const filterModel =
    document.getElementById("filterModel")
        ? document.getElementById("filterModel").value
        : "all";

const filterProcess =
    document.getElementById("filterProcess")
        ? document.getElementById("filterProcess").value
        : "all";

const filteredLots =
    dashboardLots.filter(function(item) {

        const modelOk =
            filterModel === "all" ||
            item.model === filterModel;

        const processOk =
            filterProcess === "all" ||
            item.process === filterProcess;

        return modelOk && processOk;

    });
    body.innerHTML = "";

    let totalInput = 0;
    let totalNg = 0;


   filteredLots.forEach(function(item, index) {

        totalInput += item.input;
        totalNg += item.ng;

        const rate =
            (item.ng / item.input) * 100;

        const status =
            rate <= item.target
                ? "PASS"
                : "NG";


        const row =
            document.createElement("tr");
row.innerHTML = `
    <td>${item.lot}</td>
    <td>${item.model}</td>
    <td>${item.process}</td>

    <td>${item.input}</td>
    <td>${item.ng}</td>

    <td>${rate.toFixed(2)}%</td>
    <td>${item.target}%</td>

    <td class="${
        status === "PASS"
            ? "dashboard-pass"
            : "dashboard-ng"
    }">
        ${
            status === "PASS"
                ? "✅ PASS"
                : "❌ NG"
        }
    </td>

    <td>
        <button
            class="dashboard-delete"
          onclick="xoaLotDashboard(${dashboardLots.indexOf(item)})"
        >
            Xóa
        </button>
    </td>
`;

        body.appendChild(row);

    });


    const totalRate =
        totalInput > 0
            ? (totalNg / totalInput) * 100
            : 0;


    document.getElementById(
        "dashTotalInput"
    ).textContent = totalInput;

    document.getElementById(
        "dashTotalNg"
    ).textContent = totalNg;

    document.getElementById(
        "dashNgRate"
    ).textContent =
        totalRate.toFixed(2) + "%";

   document.getElementById(
    "dashLotCount"
).textContent =
    filteredLots.length;
capNhatBieuDoDashboard();
}

/* ===== FORMULA TESTER ===== */

function testNgFormula() {

    const inputQty = Number(
        document.getElementById("testInputQty").value
    );

    const ngQty = Number(
        document.getElementById("testNgQty").value
    );

    const target = Number(
        document.getElementById("testTarget").value
    );

    const result =
        document.getElementById("testerResult");

    if (!result) return;

    if (
        inputQty <= 0 ||
        ngQty < 0 ||
        target < 0
    ) {

        result.innerHTML = `
            <div class="test-result-card ng">
                ⚠️ Hãy nhập dữ liệu hợp lệ.
            </div>
        `;

        return;
    }

    const ngRate =
        (ngQty / inputQty) * 100;

    const status =
        ngRate <= target ? "PASS" : "NG";

    const statusClass =
        status === "PASS" ? "pass" : "ng";

    result.innerHTML = `
        <div class="test-result-card ${statusClass}">

            <p>
                <strong>Input Qty:</strong>
                ${inputQty}
            </p>

            <p>
                <strong>NG Qty:</strong>
                ${ngQty}
            </p>

            <p>
                <strong>NG Rate:</strong>
                ${ngRate.toFixed(2)}%
            </p>

            <p>
                <strong>Target:</strong>
                ${target}%
            </p>

            <p>
                <strong>Kết quả:</strong>
                ${status === "PASS"
                    ? "✅ PASS"
                    : "❌ NG"}
            </p>

        </div>
    `;
}
document.addEventListener(
    "DOMContentLoaded",
    function() {

        if (
            document.getElementById(
                "dashboardBody"
            )
        ) {

            capNhatDashboard();

        }

    }
);
function xoaToanBoDashboard() {

    const confirmDelete =
        confirm(
            "Bạn có chắc muốn xóa toàn bộ dữ liệu Dashboard không?"
        );

    if (!confirmDelete) return;

    dashboardLots = [];

    localStorage.removeItem(
        "dashboardLots"
    );

    capNhatDashboard();

}
/* ===== XUẤT DASHBOARD RA CSV ===== */

function xuatDashboardCSV() {

    if (dashboardLots.length === 0) {

        alert("Chưa có dữ liệu để xuất.");

        return;
    }


    const rows = [
    [
        "Lot No",
        "Model",
        "Process",
        "Input Qty",
        "NG Qty",
        "NG Rate",
        "Target",
        "Result"
    ]
];


    dashboardLots.forEach(function(item) {

        const rate =
            (item.ng / item.input) * 100;

        const status =
            rate <= item.target
                ? "PASS"
                : "NG";


        rows.push([
    item.lot,
    item.model,
    item.process,
    item.input,
    item.ng,
    rate.toFixed(2) + "%",
    item.target + "%",
    status
]);
    });


    const csvContent =
        rows
            .map(function(row) {

                return row
                    .map(function(value) {

                        return `"${String(value).replace(/"/g, '""')}"`;

                    })
                    .join(",");

            })
            .join("\n");


    const bom =
        "\uFEFF";

    const blob =
        new Blob(
            [bom + csvContent],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "mini-qc-dashboard.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}
function capNhatBoLocDashboard() {

    const modelSelect =
        document.getElementById("filterModel");

    const processSelect =
        document.getElementById("filterProcess");

    if (!modelSelect || !processSelect) return;


    const currentModel =
        modelSelect.value;

    const currentProcess =
        processSelect.value;


    const models =
        [...new Set(
            dashboardLots
                .map(item => item.model)
                .filter(Boolean)
        )];


    const processes =
        [...new Set(
            dashboardLots
                .map(item => item.process)
                .filter(Boolean)
        )];


    modelSelect.innerHTML =
        '<option value="all">Tất cả Model</option>';

    models.forEach(function(model) {

        const option =
            document.createElement("option");

        option.value = model;
        option.textContent = model;

        modelSelect.appendChild(option);

    });


    processSelect.innerHTML =
        '<option value="all">Tất cả Process</option>';

    processes.forEach(function(process) {

        const option =
            document.createElement("option");

        option.value = process;
        option.textContent = process;

        processSelect.appendChild(option);

    });


    if (models.includes(currentModel)) {
        modelSelect.value = currentModel;
    }

    if (processes.includes(currentProcess)) {
        processSelect.value = currentProcess;
    }

}
function capNhatTopNgLots() {

    const container =
        document.getElementById("topNgLots");

    if (!container) return;


    const modelElement =
        document.getElementById("filterModel");

    const processElement =
        document.getElementById("filterProcess");


    const filterModel =
        modelElement ? modelElement.value : "all";

    const filterProcess =
        processElement ? processElement.value : "all";


    const filteredLots =
        dashboardLots.filter(function(item) {

            const modelOk =
                filterModel === "all" ||
                item.model === filterModel;

            const processOk =
                filterProcess === "all" ||
                item.process === filterProcess;

            return modelOk && processOk;

        });


    const topLots =
        filteredLots
            .filter(function(item) {
                return item.input > 0;
            })
            .map(function(item) {

                return {
                    lot: item.lot,
                    model: item.model,
                    process: item.process,
                    rate:
                        (item.ng / item.input) * 100
                };

            })
            .sort(function(a, b) {
                return b.rate - a.rate;
            })
            .slice(0, 3);


    if (topLots.length === 0) {

        container.innerHTML =
            "<p>Chưa có dữ liệu.</p>";

        return;
    }


    const medals = ["🥇", "🥈", "🥉"];

    container.innerHTML =
        topLots.map(function(item, index) {

            return `
                <div class="top-ng-item">

                    <span class="top-ng-rank">
                        ${medals[index]}
                    </span>

                    <div>
                        <strong>${item.lot}</strong>

                        <small>
                            ${item.model || "-"}
                            •
                            ${item.process || "-"}
                        </small>
                    </div>

                    <span class="top-ng-rate">
                        ${item.rate.toFixed(2)}%
                    </span>

                </div>
            `;

        }).join("");

}
function capNhatCanhBaoQC() {

    const box =
        document.getElementById("qcAlertBox");

    const title =
        document.getElementById("qcAlertTitle");

    const text =
        document.getElementById("qcAlertText");

    if (!box || !title || !text) return;


    const modelElement =
        document.getElementById("filterModel");

    const processElement =
        document.getElementById("filterProcess");


    const filterModel =
        modelElement ? modelElement.value : "all";

    const filterProcess =
        processElement ? processElement.value : "all";


    const filteredLots =
        dashboardLots.filter(function(item) {

            const modelOk =
                filterModel === "all" ||
                item.model === filterModel;

            const processOk =
                filterProcess === "all" ||
                item.process === filterProcess;

            return modelOk && processOk;

        });


    if (filteredLots.length === 0) {

        box.className =
            "qc-alert-box qc-alert-empty";

        title.textContent =
            "Chưa có dữ liệu";

        text.textContent =
            "Hãy thêm Lot để Dashboard bắt đầu phân tích.";

        return;
    }


    const analyzedLots =
        filteredLots.map(function(item) {

            const rate =
                item.input > 0
                    ? (item.ng / item.input) * 100
                    : 0;

            return {
                ...item,
                rate: rate
            };

        });


    const ngLots =
        analyzedLots.filter(function(item) {

            return item.rate >
                Number(item.target);

        });


    const worstLot =
        [...analyzedLots].sort(function(a, b) {

            return b.rate - a.rate;

        })[0];


    if (ngLots.length === 0) {

        box.className =
            "qc-alert-box qc-alert-pass";

        title.textContent =
            "✅ Tất cả Lot đang PASS";

        text.textContent =
            filteredLots.length +
            " Lot đều nằm trong Target.";

        return;
    }


    box.className =
        "qc-alert-box qc-alert-danger";

    title.textContent =
        "⚠️ Phát hiện " +
        ngLots.length +
        " Lot vượt Target";

    text.textContent =
        "Ưu tiên kiểm tra Lot " +
        worstLot.lot +
        " — NG Rate " +
        worstLot.rate.toFixed(2) +
        "% / Target " +
        worstLot.target +
        "%.";

}
/* ===== CÔNG THỨC EXCEL HÔM NAY ===== */

const dailyFormulas = [

    {
        name: "XLOOKUP",
        description:
            "Tra cứu dữ liệu hiện đại và linh hoạt hơn VLOOKUP.",
        formula:
            '=XLOOKUP(A2,H:H,I:I,"Không tìm thấy")',
        search:
            "xlookup"
    },

    {
        name: "SUMIFS",
        description:
            "Tính tổng dữ liệu theo nhiều điều kiện.",
        formula:
            '=SUMIFS(E:E,B:B,"Model A",C:C,"NG")',
        search:
            "sumifs"
    },

    {
        name: "COUNTIFS",
        description:
            "Đếm số dòng thỏa mãn nhiều điều kiện.",
        formula:
            '=COUNTIFS(B:B,"Model A",F:F,"NG")',
        search:
            "countifs"
    },

    {
        name: "IF",
        description:
            "Kiểm tra điều kiện và trả về kết quả tương ứng.",
        formula:
            '=IF(E2>3%,"NG","PASS")',
        search:
            "if"
    },

    {
        name: "IFERROR",
        description:
            "Thay lỗi Excel bằng nội dung dễ đọc hơn.",
        formula:
            '=IFERROR(A2/B2,0)',
        search:
            "iferror"
    },

    {
        name: "TEXTJOIN",
        description:
            "Ghép nhiều ô thành một chuỗi văn bản.",
        formula:
            '=TEXTJOIN("-",TRUE,A2,B2,C2)',
        search:
            "textjoin"
    },

    {
        name: "UNIQUE",
        description:
            "Lấy danh sách giá trị không trùng lặp.",
        formula:
            '=UNIQUE(A2:A100)',
        search:
            "unique"
    },

    {
        name: "FILTER",
        description:
            "Lọc dữ liệu bằng công thức.",
        formula:
            '=FILTER(A2:E100,E2:E100="NG")',
        search:
            "filter"
    }

];


let currentDailyFormula = null;


function doiCongThucHomNay() {

    if (!dailyFormulas.length) return;


    let randomIndex;

    do {

        randomIndex =
            Math.floor(
                Math.random() *
                dailyFormulas.length
            );

    } while (
        dailyFormulas.length > 1 &&
        currentDailyFormula ===
            dailyFormulas[randomIndex]
    );


    currentDailyFormula =
        dailyFormulas[randomIndex];


    document.getElementById(
        "dailyFormulaName"
    ).textContent =
        currentDailyFormula.name;


    document.getElementById(
        "dailyFormulaDescription"
    ).textContent =
        currentDailyFormula.description;


    document.getElementById(
        "dailyFormulaCode"
    ).textContent =
        currentDailyFormula.formula;

}


function copyDailyFormula() {

    if (!currentDailyFormula) return;

    navigator.clipboard.writeText(
        currentDailyFormula.formula
    );

}


function moCongThucTrongFinder() {

    if (!currentDailyFormula) return;

    const input =
        document.getElementById(
            "formulaQuery"
        );

    if (!input) return;


    input.value =
        currentDailyFormula.search;


    if (
        typeof timCongThucExcel ===
        "function"
    ) {

        timCongThucExcel();

    }


    input.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


document.addEventListener(
    "DOMContentLoaded",
    function() {

        if (
            document.getElementById(
                "dailyFormulaName"
            )
        ) {

            doiCongThucHomNay();

        }

    }
);
/* ===== EXCEL CHALLENGE ===== */

const excelChallenges = [

    {
        question:
            "Bạn muốn tính tổng NG Qty theo từng Model. Nên dùng hàm nào?",
        options: [
            "SUMIFS",
            "LEFT",
            "LEN",
            "TODAY"
        ],
        answer: 0,
        explanation:
            "SUMIFS dùng để tính tổng theo một hoặc nhiều điều kiện."
    },

    {
        question:
            "Bạn muốn đếm số dòng có trạng thái NG. Nên dùng hàm nào?",
        options: [
            "COUNTIF",
            "SUM",
            "AVERAGE",
            "RIGHT"
        ],
        answer: 0,
        explanation:
            "COUNTIF dùng để đếm số ô thỏa mãn một điều kiện."
    },

    {
        question:
            "Bạn muốn lấy tên sản phẩm dựa trên mã sản phẩm. Nên dùng hàm nào?",
        options: [
            "XLOOKUP",
            "MAX",
            "ROUND",
            "TRIM"
        ],
        answer: 0,
        explanation:
            "XLOOKUP phù hợp để tra cứu một giá trị và trả về dữ liệu tương ứng."
    },

    {
        question:
            "Bạn muốn hiển thị PASS nếu NG Rate <= 3%, ngược lại hiển thị NG. Nên dùng hàm nào?",
        options: [
            "IF",
            "SUM",
            "COUNT",
            "LEFT"
        ],
        answer: 0,
        explanation:
            "IF dùng để kiểm tra điều kiện và trả về kết quả tương ứng."
    },

    {
        question:
            "Bạn cần tổng hợp NG Qty theo Model và Process. Công cụ nào phù hợp nhất?",
        options: [
            "Pivot Table",
            "Find",
            "Format Cells",
            "Freeze Panes"
        ],
        answer: 0,
        explanation:
            "Pivot Table rất phù hợp để tổng hợp và phân tích dữ liệu theo nhiều nhóm."
    },

    {
        question:
            "Bạn muốn tìm nhóm lỗi gây ảnh hưởng lớn nhất. Biểu đồ nào phù hợp?",
        options: [
            "Pareto",
            "Scatter",
            "Area",
            "Radar"
        ],
        answer: 0,
        explanation:
            "Pareto giúp xác định các lỗi ưu tiên theo nguyên tắc 80/20."
    },

    {
        question:
            "Bạn muốn loại bỏ khoảng trắng thừa trong dữ liệu. Dùng hàm nào?",
        options: [
            "TRIM",
            "MID",
            "NOW",
            "MAX"
        ],
        answer: 0,
        explanation:
            "TRIM loại bỏ khoảng trắng thừa trong chuỗi."
    },

    {
        question:
            "Bạn muốn lấy 4 ký tự cuối của Lot No. Dùng hàm nào?",
        options: [
            "RIGHT",
            "LEFT",
            "SUMIF",
            "COUNT"
        ],
        answer: 0,
        explanation:
            "RIGHT lấy một số ký tự từ bên phải chuỗi."
    }

];


let currentChallenge = null;


function taoChallengeMoi() {

    const questionElement =
        document.getElementById(
            "challengeQuestion"
        );

    const optionsElement =
        document.getElementById(
            "challengeOptions"
        );

    const resultElement =
        document.getElementById(
            "challengeResult"
        );

    if (
        !questionElement ||
        !optionsElement ||
        !resultElement
    ) {
        return;
    }


    const randomIndex =
        Math.floor(
            Math.random() *
            excelChallenges.length
        );


    currentChallenge =
        excelChallenges[randomIndex];


    questionElement.textContent =
        currentChallenge.question;


    optionsElement.innerHTML = "";

    resultElement.textContent = "";


    currentChallenge.options
        .forEach(function(option, index) {

            const button =
                document.createElement("button");

            button.className =
                "challenge-option";

            button.textContent =
                option;


            button.addEventListener(
                "click",
                function() {

                    chamChallenge(
                        index,
                        button
                    );

                }
            );


            optionsElement.appendChild(
                button
            );

        });

}


function chamChallenge(
    selectedIndex,
    selectedButton
) {

    if (!currentChallenge) return;


    const buttons =
        document.querySelectorAll(
            ".challenge-option"
        );

    const result =
        document.getElementById(
            "challengeResult"
        );


    buttons.forEach(function(button) {

        button.disabled = true;

    });


    if (
        selectedIndex ===
        currentChallenge.answer
    ) {

        selectedButton.classList.add(
            "correct"
        );

        result.textContent =
            "✅ Chính xác! " +
            currentChallenge.explanation;

    } else {

        selectedButton.classList.add(
            "wrong"
        );

        buttons[
            currentChallenge.answer
        ].classList.add(
            "correct"
        );

        result.textContent =
            "❌ Chưa đúng. " +
            currentChallenge.explanation;

    }

}


document.addEventListener(
    "DOMContentLoaded",
    function() {

        if (
            document.getElementById(
                "challengeQuestion"
            )
        ) {

            taoChallengeMoi();

        }

    }
);

/* ===== ANH VAN PHONG GLOBAL ENHANCEMENTS ===== */
document.addEventListener("DOMContentLoaded", function () {
    // Automatically mark the current page in the navigation.
    const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll("nav a[href]").forEach(function (link) {
        const href = (link.getAttribute("href") || "").split("#")[0].toLowerCase();
        if (href === current) link.classList.add("active");
    });

    // Gentle reveal animation; skipped for the main hero to keep it immediate.
    const revealTargets = document.querySelectorAll(
        "main > section, .courses, .featured, .quick-access, .download-section, .latest-section, .stats-section, .intro, .home-contact"
    );

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("avp-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        revealTargets.forEach(function (el) {
            el.classList.add("avp-reveal");
            observer.observe(el);
        });
    }
});


/* ===== AVP DAILY ACTIVITY TRACKER ===== */
(function(){
    try {
        const key = "avp_activity_days_v1";
        const now = new Date();
        const today = now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-"+String(now.getDate()).padStart(2,"0");
        let days = JSON.parse(localStorage.getItem(key) || "[]");
        if (!Array.isArray(days)) days = [];
        if (!days.includes(today)) {
            days.push(today);
            days = days.slice(-120);
            localStorage.setItem(key, JSON.stringify(days));
        }
    } catch(e) {}
})();
