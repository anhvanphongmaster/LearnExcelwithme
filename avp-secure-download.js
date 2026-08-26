/**
 * Tải file: chưa login thì nút "Đăng nhập để tải" — bấm vào trang auth, không hiện hộp thoại.
 */
(function () {
  window.AVP_DL_FALLBACK = (typeof window.AVP_DL_FALLBACK === "boolean") ? window.AVP_DL_FALLBACK : true;

  function loginUrl() {
    var next = encodeURIComponent((location.pathname.split("/").pop() || "index.html"));
    return "auth.html?next=" + next;
  }

  async function waitSb(ms) {
    const t0 = Date.now();
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
    const sb = await waitSb(2500);
    if (!sb) return null;
    try {
      const { data } = await sb.auth.getUser();
      return data && data.user ? data.user : null;
    } catch (e) { return null; }
  }

  function storagePathFromHref(href) {
    if (!href) return "";
    var u = href.split("?")[0].split("#")[0];
    var i = u.indexOf("downloads/");
    if (i >= 0) return u.slice(i + "downloads/".length);
    return u.replace(/^\.\//, "");
  }

  function markDownloadButtons(loggedIn) {
    document.querySelectorAll("a.pv-download, a.pyt-dl-block, a.pyt-file-alt, a[data-secure-dl]").forEach(function (a) {
      a.setAttribute("data-secure-dl", "1");
      if (loggedIn) {
        if (a.classList.contains("pv-download")) a.textContent = "Tải file";
        a.classList.remove("need-login");
      } else {
        if (a.classList.contains("pv-download") || a.classList.contains("pyt-dl-block")) {
          a.textContent = "Đăng nhập để tải";
        }
        a.classList.add("need-login");
      }
    });
  }

  async function signedOrFallback(storagePath) {
    const sb = await waitSb(3000);
    if (sb) {
      try {
        const { data, error } = await sb.storage.from("practice-uploads").createSignedUrl(storagePath, 90);
        if (!error && data && data.signedUrl) {
          window.location.href = data.signedUrl;
          return;
        }
      } catch (e) {}
    }
    if (window.AVP_DL_FALLBACK) {
      window.location.href = "downloads/" + storagePath;
      return;
    }
    var st = document.getElementById("pvFileStatus");
    if (st) st.textContent = "File chưa có trên kho bảo mật.";
  }

  window.avpSecureDownload = async function (href) {
    const user = await currentUser();
    if (!user) {
      location.href = loginUrl();
      return;
    }
    var path = storagePathFromHref(href);
    if (!path) return;
    await signedOrFallback(path);
  };

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a.pv-download, a.pyt-dl-block, a.pyt-file-alt, a[data-secure-dl]");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (!href || href.indexOf("downloads/") < 0 && !a.hasAttribute("data-secure-dl")) return;
    e.preventDefault();
    window.avpSecureDownload(href);
  }, true);

  function boot() {
    currentUser().then(function (u) { markDownloadButtons(!!u); });
    setTimeout(function () { currentUser().then(function (u) { markDownloadButtons(!!u); }); }, 800);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  document.addEventListener("pv-rendered", boot);
})();
