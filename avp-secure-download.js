/**
 * Chưa login: đổi HREF nút tải thành auth.html — bấm là sang đăng ký, không cần bắt click.
 */
(function () {
  window.AVP_DL_FALLBACK = (typeof window.AVP_DL_FALLBACK === "boolean") ? window.AVP_DL_FALLBACK : true;
  var SEL = "a.pv-download, a.pyt-dl-block, a.pyt-file-alt, a[href*='downloads/']";

  function loginUrl() {
    var page = (location.pathname.split("/").pop() || "index.html");
    return "auth.html?next=" + encodeURIComponent(page) + "&tab=register";
  }

  function hasSession() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i) || "";
        if (k.indexOf("-auth-token") >= 0) {
          var v = localStorage.getItem(k) || "";
          if (v.indexOf("access_token") >= 0) return true;
        }
      }
    } catch (e) {}
    return false;
  }

  function apply(loggedIn) {
    document.querySelectorAll(SEL).forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (!a.getAttribute("data-orig-href")) {
        if (href.indexOf("auth.html") < 0) a.setAttribute("data-orig-href", href);
      }
      var orig = a.getAttribute("data-orig-href") || href;
      if (!a.getAttribute("data-orig-label")) {
        var lab = (a.textContent || "Tải file").replace(/\s+/g, " ").trim();
        if (/đăng nhập để tải/i.test(lab)) lab = "Tải file";
        a.setAttribute("data-orig-label", lab || "Tải file");
      }
      if (loggedIn) {
        a.setAttribute("href", orig);
        a.setAttribute("download", "");
        a.textContent = a.getAttribute("data-orig-label") || "Tải file";
        a.classList.remove("need-login");
      } else {
        a.setAttribute("href", loginUrl());
        a.removeAttribute("download");
        a.textContent = "Đăng nhập để tải";
        a.classList.add("need-login");
      }
    });
  }

  apply(hasSession());
  function boot() { apply(hasSession()); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  setTimeout(boot, 400);
  setTimeout(boot, 1200);

  var lock = false;
  if (window.MutationObserver) {
    var mo = new MutationObserver(function () {
      if (lock) return;
      lock = true;
      apply(hasSession());
      setTimeout(function () { lock = false; }, 50);
    });
    function watch() { if (document.body) mo.observe(document.body, { childList: true, subtree: true }); }
    if (document.body) watch();
    else document.addEventListener("DOMContentLoaded", watch);
  }
})();
