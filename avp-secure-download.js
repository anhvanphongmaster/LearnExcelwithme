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

  function isManagedAbsoluteUrl(href) {
    if (!href) return false;
    return /^https?:\/\//i.test(href) && /supabase\.co\/storage\/v1\/object\//i.test(href);
  }

  function rememberCurrentTarget(a) {
    var current = a.getAttribute("href") || "";
    var resolved = a.dataset ? (a.dataset.avpResolvedUrl || "") : "";

    // download-manager đã resolve sang Supabase: luôn coi đây là link thật mới nhất.
    if (resolved && isManagedAbsoluteUrl(resolved)) {
      a.setAttribute("data-orig-href", resolved);
      return resolved;
    }

    // Nếu href hiện tại đã là URL Storage thì cập nhật orig-href, không giữ path GitHub cũ.
    if (isManagedAbsoluteUrl(current)) {
      a.setAttribute("data-orig-href", current);
      return current;
    }

    if (!a.getAttribute("data-orig-href")) {
      if (current.indexOf("auth.html") < 0) a.setAttribute("data-orig-href", current);
    }

    return a.getAttribute("data-orig-href") || current || "#";
  }

  function applyOne(a) {
    if (!a) return;

    var logged = hasSession();
    var url = authHref();
    var target = rememberCurrentTarget(a);

    if (!a.getAttribute("data-orig-label")) {
      var lab = (a.textContent || "Tải file").replace(/\s+/g, " ").trim();
      a.setAttribute("data-orig-label", /đăng nhập để tải/i.test(lab) ? "Tải file" : (lab || "Tải file"));
    }

    if (logged) {
      // Kiểm tra lại ngay trước khi set href vì download-manager có thể vừa đổi URL.
      target = rememberCurrentTarget(a);
      a.setAttribute("href", target || "#");
      a.removeAttribute("onclick");
      if (isManagedAbsoluteUrl(target)) a.removeAttribute("download");
      a.textContent = a.getAttribute("data-orig-label") || "Tải file";
    } else {
      a.setAttribute("href", url);
      a.removeAttribute("download");
      a.setAttribute("onclick", "location.href=this.getAttribute('href');return false;");
      a.textContent = "Đăng nhập để tải";
    }
  }

  function apply(root) {
    var scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll("a.pv-download, a.pyt-dl-block, a.pyt-file-alt, a[href*='downloads/'], a[data-avp-resolved-url]").forEach(applyOne);
    if (root && root.matches && root.matches("a.pv-download, a.pyt-dl-block, a.pyt-file-alt, a[href*='downloads/'], a[data-avp-resolved-url]")) applyOne(root);
  }

  apply(document);
  document.addEventListener("DOMContentLoaded", function(){ apply(document); });
  setTimeout(function(){ apply(document); }, 300);
  setTimeout(function(){ apply(document); }, 1000);
  setTimeout(function(){ apply(document); }, 2000);

  // Dynamic library/download-manager có thể thay href sau khi trang đã load.
  // Khi đó cập nhật lại data-orig-href thay vì kéo link về GitHub cũ.
  try {
    new MutationObserver(function(mutations){
      mutations.forEach(function(m){
        if (m.type === "attributes" && m.target && m.target.tagName === "A") {
          applyOne(m.target);
        }
        if (m.addedNodes) {
          m.addedNodes.forEach(function(n){ if (n.nodeType === 1) apply(n); });
        }
      });
    }).observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["href", "data-avp-resolved-url"]
    });
  } catch (e) {}
})();
