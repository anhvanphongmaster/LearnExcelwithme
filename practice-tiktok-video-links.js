(() => {
  "use strict";
  const links = new Map();

  function safeVideoUrl(value) {
    const url = String(value || "").trim();
    return /^https:\/\//i.test(url) ? url : "";
  }

  function icon() {
    return '<svg class="pv-tt-ico" viewBox="0 0 24 24" width="11" height="11" aria-hidden="true"><path fill="currentColor" d="M16.5 3c.4 2.4 1.9 4.1 4.2 4.4v2.3c-1.5.1-2.9-.4-4.2-1.3v6.5c0 3.4-2.7 6.1-6.1 6.1S4.3 18.3 4.3 14.9s2.7-6.1 6.1-6.1c.3 0 .6 0 .9.1v2.5c-.3-.1-.6-.2-.9-.2-2 0-3.6 1.6-3.6 3.7s1.6 3.7 3.6 3.7 3.6-1.6 3.6-3.7V3h2.5z"/></svg>';
  }

  function applyLinks() {
    const grid = document.getElementById("pvGrid");
    if (!grid || !links.size) return;
    grid.querySelectorAll("article[data-id]").forEach(card => {
      const url = links.get(card.dataset.id);
      const actions = card.querySelector(".pv-a");
      if (!url || !actions) return;
      let anchor = actions.querySelector(".pv-tiktok");
      if (!anchor) {
        anchor = document.createElement("a");
        anchor.className = "pv-tiktok";
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.title = "Xem trên TikTok";
        anchor.innerHTML = icon() + " TikTok";
        actions.prepend(anchor);
      }
      anchor.href = url;
      const badge = card.querySelector(".pv-badge");
      if (badge && !/video/i.test(badge.textContent || "")) {
        badge.className = "pv-badge pv-badge-available";
        badge.textContent = actions.querySelector(".pv-download") ? "Video+file" : "Video";
      }
    });
  }

  async function getClient() {
    for (let i = 0; i < 100; i++) {
      const client = window.avpSupabase || window.supabaseClient;
      if (client?.rpc) return client;
      await new Promise(resolve => setTimeout(resolve, 120));
    }
    return null;
  }

  async function loadLinks() {
    const client = await getClient();
    if (!client) return;
    const { data, error } = await client.rpc("get_practice_library_public");
    if (error || !Array.isArray(data)) return;
    data.forEach(row => {
      const url = safeVideoUrl(row?.video_url);
      if (row?.id && url && row.is_active !== false && row.status !== "draft" && row.status !== "archived") {
        links.set(String(row.id), url);
      }
    });
    applyLinks();
  }

  function boot() {
    const grid = document.getElementById("pvGrid");
    if (!grid) return;
    new MutationObserver(applyLinks).observe(grid, { childList: true, subtree: true });
    loadLinks();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
