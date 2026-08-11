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

    const course = button.dataset.course;

    let completedCourses =
        JSON.parse(localStorage.getItem("completedCourses")) || [];

    if (completedCourses.includes(course)) {

        completedCourses =
            completedCourses.filter(item => item !== course);

        button.classList.remove("completed");

        button.textContent =
            "✓ Đánh dấu đã học";

    } else {

        completedCourses.push(course);

        button.classList.add("completed");

        button.textContent =
            "✅ Đã học";
    }

    localStorage.setItem(
        "completedCourses",
        JSON.stringify(completedCourses)
    );

    capNhatTienDo();
}


function capNhatTienDo() {

    const totalCourses = 6;

    const completedCourses =
        JSON.parse(localStorage.getItem("completedCourses")) || [];

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

});