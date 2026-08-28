(function () {
  "use strict";

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

  function isStorageUrl(href) {
    return /^https?:\/\//i.test(href || "") && /supabase\.co\/storage\/v1\/object\//i.test(href || "");
  }

  function targetFor(a) {
    var resolved = (a.dataset && a.dataset.avpResolvedUrl) || "";
    if (isStorageUrl(resolved)) return resolved;

    var current = a.getAttribute("href") || "";
    if (isStorageUrl(current)) return current;

    var original = a.getAttribute("data-orig-href") || "";
    if (original && original.indexOf("auth.html") < 0) return original;

    return current || "#";
  }

  function applyOne(a) {
    if (!a) return;

    var current = a.getAttribute("href") || "";
    if (!a.getAttribute("data-orig-href") && current.indexOf("auth.html") < 0) {
      a.setAttribute("data-orig-href", current);
    }

    if (!a.getAttribute("data-orig-label")) {
      var lab = (a.textContent || "Tải file").replace(/\s+/g, " ").trim();
      a.setAttribute("data-orig-label", /đăng nhập để tải/i.test(lab) ? "Tải file" : (lab || "Tải file"));
    }

    if (hasSession()) {
      var target = targetFor(a);
      a.setAttribute("href", target);
      a.removeAttribute("onclick");
      if (isStorageUrl(target)) a.removeAttribute("download");
      a.textContent = a.getAttribute("data-orig-label") || "Tải file";
    } else {
      a.setAttribute("href", authHref());
      a.removeAttribute("download");
      a.setAttribute("onclick", "location.href=this.getAttribute('href');return false;");
      a.textContent = "Đăng nhập để tải";
    }
  }

  function apply(root) {
    var scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll("a.pv-download, a.pyt-dl-block, a.pyt-file-alt, a[href*='downloads/'], a[data-avp-resolved-url]").forEach(applyOne);
  }

  apply(document);
  document.addEventListener("DOMContentLoaded", function () { apply(document); });
  document.addEventListener("avp:downloads-resolved", function () { apply(document); });
  setTimeout(function () { apply(document); }, 300);
  setTimeout(function () { apply(document); }, 1200);
})();
