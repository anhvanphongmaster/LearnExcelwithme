(() => {
  "use strict";

  if (window.AVPAccess) return;

  const STATE = {
    user: undefined,
    checkedAt: 0,
    loading: null
  };

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function nextUrl(fallback) {
    const here = location.pathname.split("/").pop() || "index.html";
    return fallback || (here + location.search + location.hash);
  }

  async function client() {
    for (let i = 0; i < 30; i++) {
      const sb = window.avpSupabase || window.supabaseClient || window._supabaseClient || null;
      if (sb?.auth) return sb;
      await sleep(100);
    }
    return null;
  }

  async function getUser(force=false) {
    const now = Date.now();
    if (!force && STATE.user !== undefined && now - STATE.checkedAt < 2500) {
      return STATE.user;
    }
    if (!force && STATE.loading) return STATE.loading;

    STATE.loading = (async () => {
      const sb = await client();
      if (!sb?.auth) {
        STATE.user = null;
        STATE.checkedAt = Date.now();
        return null;
      }
      try {
        const { data, error } = await sb.auth.getUser();
        STATE.user = error ? null : (data?.user || null);
      } catch (e) {
        STATE.user = null;
      }
      STATE.checkedAt = Date.now();
      return STATE.user;
    })();

    try {
      return await STATE.loading;
    } finally {
      STATE.loading = null;
    }
  }

  function goLogin(next) {
    location.href = "auth.html?next=" + encodeURIComponent(nextUrl(next));
  }

  async function requireLogin(options={}) {
    const opts = typeof options === "string" ? { reason: options } : (options || {});
    const user = await getUser(true);
    if (user) return user;

    if (opts.redirect !== false) {
      goLogin(opts.next);
    }
    return null;
  }

  async function isLoggedIn() {
    return !!(await getUser());
  }

  function isDownloadLink(a) {
    if (!a || a.tagName !== "A") return false;
    if (a.dataset.avpPublicDownload === "1") return false;
    const href = a.getAttribute("href") || "";
    return (
      a.matches(".pv-download,.pyt-dl-block,.pyt-file-alt,[data-avp-protected-download]") ||
      href.includes("downloads/")
    );
  }

  async function guardDownloadClick(e) {
    const a = e.target?.closest?.("a");
    if (!isDownloadLink(a)) return;

    const user = await getUser(true);
    if (user) return;

    e.preventDefault();
    e.stopImmediatePropagation();
    goLogin(nextUrl());
  }

  // Capture phase: one guard for all old/new download links.
  document.addEventListener("click", e => {
    const a = e.target?.closest?.("a");
    if (!isDownloadLink(a)) return;

    // We must stop the browser before async auth check.
    e.preventDefault();
    e.stopImmediatePropagation();

    (async () => {
      const user = await getUser(true);
      if (!user) {
        goLogin(nextUrl());
        return;
      }

      // Restore the intended action only after auth is confirmed.
      const href = a.dataset.origHref || a.getAttribute("href");
      if (!href) return;

      if (a.hasAttribute("download")) {
        const temp = document.createElement("a");
        temp.href = href;
        temp.download = a.getAttribute("download") || "";
        temp.rel = "noopener";
        temp.style.display = "none";
        document.body.appendChild(temp);
        temp.click();
        temp.remove();
      } else {
        location.href = href;
      }
    })();
  }, true);

  // Keep auth cache correct after login/logout.
  window.addEventListener("avp:auth-changed", () => {
    STATE.user = undefined;
    STATE.checkedAt = 0;
  });

  window.AVPAccess = {
    client,
    getUser,
    isLoggedIn,
    requireLogin,
    goLogin
  };
})();
