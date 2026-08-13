
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("cloudSyncStatus");
  const text = document.getElementById("cloudSyncStatusText");
  if (!root || !text) return;

  if (!window.AVP_SUPABASE_CONFIGURED) {
    root.dataset.state = "error";
    text.textContent = "⚠️ Chưa cấu hình Supabase";
    return;
  }

  window.addEventListener("avp:cloud-sync-status", e => {
    const state = e.detail?.status || "idle";
    root.dataset.state = state;
    text.textContent =
      state === "syncing" ? "☁️ Đang đồng bộ..." :
      state === "synced" ? "✓ Tiến độ đã lưu trên cloud" :
      state === "error" ? "⚠️ Đồng bộ gặp lỗi" :
      "☁️ Đồng bộ Supabase";
  });
});
