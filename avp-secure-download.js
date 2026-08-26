/**
 * Nút tải: chưa login hiện "Đăng nhập để tải" — bấm đi thẳng auth.html
 */
(function () {
  window.AVP_DL_FALLBACK = (typeof window.AVP_DL_FALLBACK === "boolean") ? window.AVP_DL_FALLBACK : true;
  var SEL = 'a[href*="downloads/"], a.pv-download, a.pyt-dl-block, a.pyt-file-alt, a[data-secure-dl]';

  function loginUrl() {
    var page = (location.pathname.split("/").pop() || "index.html");
    return "auth.html?next=" + encodeURIComponent(page) + "&tab=register";
  }

  function hasLocalSession() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i) || "";
        if (k.indexOf("sb-") === 0 && k.indexOf("-auth-token") >= 0) {
          var v = localStorage.getItem(k) || "";
          if (v.indexOf("access_token") >= 0) return true;
        }
      }
    } catch (e) {}
    return false;
  }

  async function waitSb(ms) {
    var t0 = Date.now();
    while (Date.now() - t0 < (ms || 2500)) {
      if (window.avpSupabase) return window.avpSupabase;
      await new Promise(function (r) { setTimeout(r, 60); });
    }
    return window.avpSupabase || null;
  }

  async function currentUser() {
    if (!hasLocalSession() && !window.avpSupabase) return null;
    if (window.avpCloudSync && window.avpCloudSync.getUser) {
      try { return await window.avpCloudSync.getUser(); } catch (e) {}
    }
    var sb = await waitSb(2000);
    if (!sb || !sb.auth) return null;
    try {
      var r = await sb.auth.getUser();
      return r && r.data && r.data.user ? r.data.user : null;
    } catch (e) { return null; }
  }

  function pathFromHref(href) {
    if (!href) return "";
    var u = String(href).split("?")[0].split("#")[0];
    var i = u.indexOf("downloads/");
    return i >= 0 ? u.slice(i + "downloads/".length) : "";
  }

  function mark(loggedIn) {
    document.querySelectorAll(SEL).forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href.indexOf("downloads/") < 0 && !a.hasAttribute("data-secure-dl")) return;
      if (!a.getAttribute("data-orig-label")) {
        var raw = (a.textContent || "Tải file").trim();
        a.setAttribute("data-orig-label", /đăng nhập để tải/i.test(raw) ? "Tải file" : raw);
      }
      a.setAttribute("data-secure-dl", "1");
      if (loggedIn) {
        a.textContent = a.getAttribute("data-orig-label") || "Tải file";
        a.classList.remove("need-login");
      } else {
        a.textContent = "Đăng nhập để tải";
        a.classList.add("need-login");
      }
    });
  }

  async function doDownload(href) {
    var path = pathFromHref(href);
    var sb = await waitSb(2000);
    if (sb && sb.storage && path) {
      try {
        var res = await sb.storage.from("practice-uploads").createSignedUrl(path, 90);
        if (res && res.data && res.data.signedUrl) {
          location.href = res.data.signedUrl;
          return;
        }
      } catch (e) {}
    }
    if (window.AVP_DL_FALLBACK && path) location.href = "downloads/" + path;
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest(SEL);
    if (!a) return;
    var href = a.getAttribute("href") || "";
    var isDl = href.indexOf("downloads/") >= 0 || a.hasAttribute("data-secure-dl") || a.classList.contains("need-login");
    if (!isDl) return;
    e.preventDefault();
    e.stopPropagation();
    if (a.classList.contains("need-login") || !hasLocalSession()) {
      location.href = loginUrl();
      return;
    }
    currentUser().then(function (u) {
      if (!u) location.href = loginUrl();
      else doDownload(href);
    });
  }, true);

  function boot() {
    if (!hasLocalSession()) { mark(false); return; }
    currentUser().then(function (u) { mark(!!u); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 700);

  if (window.MutationObserver) {
    document.addEventListener("DOMContentLoaded", function () {
      new MutationObserver(function () { boot(); }).observe(document.body, { childList: true, subtree: true });
    });
  }
})();
