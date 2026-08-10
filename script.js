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