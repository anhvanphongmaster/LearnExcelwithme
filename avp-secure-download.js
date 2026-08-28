(function () {
  function authHref() {
    var dir = location.pathname.replace(/\/[^/]*$/, "/");
    if (!dir) dir = "/";
    var page = location.pathname.split("/").pop() || "index.html";
    return dir + "auth.html?v=3&next=" + encodeURIComponent(page) + "&tab=register";
  }
  function hasSession() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i) || "";
        if (k.indexOf("-auth-token") >= 0 && (localStorage.getItem(k) || "").indexOf("access_token") >= 0) return true;
      }
    } catch (e) {}
    return false;
  }
  function apply() {
    var logged = hasSession();
    var url = authHref();
    document.querySelectorAll("a.pv-download, a.pyt-dl-block, a.pyt-file-alt, a[href*='downloads/']").forEach(function (a) {
      if (!a.getAttribute("data-orig-href")) {
        var h = a.getAttribute("href") || "";
        if (h.indexOf("auth.html") < 0) a.setAttribute("data-orig-href", h);
      }
      if (!a.getAttribute("data-orig-label")) {
        var lab = (a.textContent || "Tải file").replace(/\s+/g," ").trim();
        a.setAttribute("data-orig-label", /đăng nhập để tải/i.test(lab) ? "Tải file" : (lab || "Tải file"));
      }
      if (logged) {
        a.setAttribute("href", a.getAttribute("data-orig-href") || "#");
        a.removeAttribute("onclick");
        a.textContent = a.getAttribute("data-orig-label") || "Tải file";
      } else {
        a.setAttribute("href", url);
        a.removeAttribute("download");
        a.setAttribute("onclick", "location.href=this.getAttribute('href');return false;");
        a.textContent = "Đăng nhập để tải";
      }
    });
  }
  apply();
  document.addEventListener("DOMContentLoaded", apply);
  setTimeout(apply, 300);
  setTimeout(apply, 1000);
})();
