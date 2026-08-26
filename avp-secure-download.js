/**
 * Tải file thực hành — bắt đăng nhập + ưu tiên Supabase Storage (bucket: practice-uploads)
 * Bật fallback GitHub khi file chưa up Storage: window.AVP_DL_FALLBACK = true
 * Sau khi up hết Storage + xóa downloads/ trên GitHub: đặt AVP_DL_FALLBACK = false
 */
(function () {
  window.AVP_DL_FALLBACK = (typeof window.AVP_DL_FALLBACK === "boolean") ? window.AVP_DL_FALLBACK : true;

  function toast(msg) {
    if (window.avpAlert) return window.avpAlert(msg, { title: "Tải file", icon: "📁", tone: "warn" });
    alert(msg);
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

  async function signedOrFallback(storagePath, filename) {
    const sb = await waitSb(3000);
    if (sb) {
      try {
        const { data, error } = await sb.storage.from("practice-uploads").createSignedUrl(storagePath, 90);
        if (!error && data && data.signedUrl) {
          window.location.href = data.signedUrl;
          return true;
        }
      } catch (e) {}
    }
    if (window.AVP_DL_FALLBACK) {
      window.location.href = "downloads/" + storagePath;
      return true;
    }
    if (window.avpAlert) window.avpAlert("File chưa có trên kho bảo mật. Liên hệ admin.", { title: "Không tải được", icon: "📂", tone: "danger" });
    else alert("File chưa có trên kho bảo mật. Liên hệ admin.");
    return false;
  }

  window.avpSecureDownload = async function (href, filename) {
    const user = await currentUser();
    if (!user) {
      var next = encodeURIComponent(location.pathname.split("/").pop() || "index.html");
      function goLogin(){ location.href = "auth.html?next=" + next; }
      if (window.avpConfirm) {
        window.avpConfirm("Bạn cần đăng nhập để tải file thực hành.\nChưa có tài khoản thì bấm Có để đăng ký.", {
          title: "Tải file thực hành",
          icon: "🔐",
          tone: "warn",
          ok: "Có, đi đăng nhập",
          cancel: "Không"
        }).then(function (ok) { if (ok) goLogin(); });
      } else {
        if (confirm("Đăng nhập mới được tải file. Đi đăng nhập?")) goLogin();
      }
      return;
    }
    var path = storagePathFromHref(href);
    if (!path) { toast("Không tìm thấy file."); return; }
    await signedOrFallback(path, filename || path.split("/").pop());
  };

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a.pv-download, a.pyt-dl-block, a.pyt-file-alt, a[data-secure-dl]");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (!href || href === "#" || href.indexOf("javascript:") === 0) return;
    if (href.indexOf("downloads/") < 0 && !a.hasAttribute("data-secure-dl")) return;
    e.preventDefault();
    window.avpSecureDownload(href, a.getAttribute("download") || "");
  }, true);
})();
