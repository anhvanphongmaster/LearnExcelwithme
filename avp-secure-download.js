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
        var v = localStorage.getItem(k) || "";
        if (k.indexOf("-auth-token") >= 0 && v.indexOf("access_token") >= 0) return true;
      }
    } catch (e) {}
    return false;
  }

  function isRemote(href) {
    return /^https?:\/\//i.test(href || "");
  }

  function applyOne(a) {
    if (!a) return;

    var current = a.getAttribute("href") || "";

    // Khi practice-video.js đã trả URL Supabase, giữ nguyên URL đó làm nguồn thật.
    if (isRemote(current) && current.indexOf("auth.html") < 0) {
      a.setAttribute("data-orig-href", current);
    } else if (!a.getAttribute("data-orig-href") && current.indexOf("auth.html") < 0) {
      a.setAttribute("data-orig-href", current);
    }

    if (!a.getAttribute("data-orig-label")) {
      var label = (a.textContent || "Tải file").replace(/\s+/g, " ").trim();
      a.setAttribute("data-orig-label", /đăng nhập để tải/i.test(label) ? "Tải file" : (label || "Tải file"));
    }

    if (hasSession()) {
      var target = a.getAttribute("data-orig-href") || current || "#";
      a.setAttribute("href", target);
      a.removeAttribute("onclick");
      if (isRemote(target)) a.removeAttribute("download");
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
    scope.querySelectorAll("a.pv-download, a.pyt-dl-block, a.pyt-file-alt").forEach(applyOne);
  }

  function startObserver() {
    if (!document.documentElement) return;
    new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          if (!n || n.nodeType !== 1) return;
          if (n.matches && n.matches("a.pv-download, a.pyt-dl-block, a.pyt-file-alt")) applyOne(n);
          apply(n);
        });
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      apply(document);
      startObserver();
    }, { once: true });
  } else {
    apply(document);
    startObserver();
  }
})();
