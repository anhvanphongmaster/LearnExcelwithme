/**
 * Moi link downloads/: chua login = "Dang nhap de tai", da login = "Tai file"
 * Khong hien hop thoai.
 */
(function () {
  window.AVP_DL_FALLBACK = (typeof window.AVP_DL_FALLBACK === "boolean") ? window.AVP_DL_FALLBACK : true;
  var SEL = 'a[href*="downloads/"], a.pv-download, a.pyt-dl-block, a.pyt-file-alt, a[data-secure-dl]';

  function loginUrl() {
    return "auth.html?next=" + encodeURIComponent((location.pathname.split("/").pop() || "index.html"));
  }
  async function waitSb(ms) {
    var t0 = Date.now();
    while (Date.now() - t0 < (ms || 4000)) {
      if (window.avpSupabase) return window.avpSupabase;
      await new Promise(function (r) { setTimeout(r, 80); });
    }
    return window.avpSupabase || null;
  }
  async function currentUser() {
    if (window.avpCloudSync && window.avpCloudSync.getUser) {
      try { return await window.avpCloudSync.getUser(); } catch (e) {}
    }
    var sb = await waitSb(2500);
    if (!sb || !sb.auth) return null;
    try {
      var r = await sb.auth.getUser();
      return r && r.data && r.data.user ? r.data.user : null;
    } catch (e) { return null; }
  }
  function pathFromHref(href) {
    if (!href) return "";
    var u = href.split("?")[0].split("#")[0];
    var i = u.indexOf("downloads/");
    return i >= 0 ? u.slice(i + "downloads/".length) : "";
  }
  function isDownloadLink(a) {
    var href = a.getAttribute("href") || "";
    return href.indexOf("downloads/") >= 0 || a.hasAttribute("data-secure-dl");
  }
  function defaultLabel(a) {
    if (a.classList.contains("pv-download")) return "Tải file";
    if (a.getAttribute("data-dl-label")) return a.getAttribute("data-dl-label");
    var t = (a.getAttribute("data-orig-label") || a.textContent || "Tải file").trim();
    if (!t || /đăng nhập để tải/i.test(t)) return "Tải file";
    return t;
  }
  function mark(loggedIn) {
    document.querySelectorAll(SEL).forEach(function (a) {
      if (!isDownloadLink(a)) return;
      if (!a.getAttribute("data-orig-label")) {
        a.setAttribute("data-orig-label", (a.textContent || "Tải file").trim());
      }
      a.setAttribute("data-secure-dl", "1");
      if (loggedIn) {
        a.textContent = defaultLabel(a);
        a.classList.remove("need-login");
      } else {
        a.textContent = "Đăng nhập để tải";
        a.classList.add("need-login");
      }
    });
  }
  async function download(href) {
    var user = await currentUser();
    if (!user) { location.href = loginUrl(); return; }
    var path = pathFromHref(href);
    if (!path) return;
    var sb = await waitSb(2500);
    if (sb && sb.storage) {
      try {
        var res = await sb.storage.from("practice-uploads").createSignedUrl(path, 90);
        if (res && res.data && res.data.signedUrl) {
          location.href = res.data.signedUrl;
          return;
        }
      } catch (e) {}
    }
    if (window.AVP_DL_FALLBACK) location.href = "downloads/" + path;
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest(SEL);
    if (!a || !isDownloadLink(a)) return;
    e.preventDefault();
    download(a.getAttribute("href") || "");
  }, true);

  var logged = false;
  function refresh() { mark(logged); }
  function boot() {
    currentUser().then(function (u) { logged = !!u; mark(logged); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 600);
  setTimeout(boot, 1600);
  if (window.MutationObserver) {
    var mo = new MutationObserver(function () { refresh(); });
    function watch() {
      if (document.body) mo.observe(document.body, { childList: true, subtree: true });
    }
    if (document.body) watch();
    else document.addEventListener("DOMContentLoaded", watch);
  }
})();
