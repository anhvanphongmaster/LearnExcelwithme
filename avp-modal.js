/*! avp-modal.js — hộp thoại giữa màn hình */
(function (w) {
  if (w.avpAlert && w.avpConfirm) return;
  var css = ".avp-ui-modal[hidden]{display:none!important}.avp-ui-modal{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px}.avp-ui-modal-back{position:absolute;inset:0;background:rgba(6,20,12,.72);backdrop-filter:blur(5px)}.avp-ui-modal-card{position:relative;width:min(400px,100%);border-radius:16px;padding:22px 20px 16px;background:linear-gradient(180deg,#f0fdf4 0%,#fff 42%);border:2px solid #86efac;box-shadow:0 0 0 4px rgba(34,197,94,.12),0 20px 50px rgba(0,0,0,.35);text-align:center;animation:avpUiIn .22s cubic-bezier(.22,1,.36,1)}.avp-ui-modal.tone-warn .avp-ui-modal-card{background:linear-gradient(180deg,#fffbeb,#fff 42%);border-color:#fbbf24}.avp-ui-modal.tone-danger .avp-ui-modal-card{background:linear-gradient(180deg,#fef2f2,#fff 42%);border-color:#fca5a5}@keyframes avpUiIn{from{transform:scale(.92) translateY(8px);opacity:0}to{transform:none;opacity:1}}.avp-ui-icon{width:52px;height:52px;margin:0 auto 10px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:26px;background:#dcfce7;border:1px solid #86efac}.avp-ui-modal.tone-warn .avp-ui-icon{background:#fef3c7;border-color:#fcd34d}.avp-ui-modal.tone-danger .avp-ui-icon{background:#fee2e2;border-color:#fca5a5}.avp-ui-title{margin:0 0 8px;font-size:17px;font-weight:900;color:#145a32}.avp-ui-modal.tone-warn .avp-ui-title{color:#92400e}.avp-ui-modal.tone-danger .avp-ui-title{color:#991b1b}.avp-ui-body{margin:0 0 16px;font-size:14px;line-height:1.5;color:#3f4f47;white-space:pre-line}.avp-ui-actions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}.avp-ui-btn{border:0;border-radius:10px;padding:10px 18px;font-weight:800;font-size:14px;cursor:pointer;min-width:100px}.avp-ui-ok{background:linear-gradient(180deg,#4ade80,#16a34a);color:#052e16}.avp-ui-modal.tone-warn .avp-ui-ok{background:linear-gradient(180deg,#fbbf24,#d97706);color:#1c1005}.avp-ui-modal.tone-danger .avp-ui-ok{background:linear-gradient(180deg,#f87171,#dc2626);color:#fff}.avp-ui-cancel{background:#e5e7eb;color:#374151}";
  function ensure() {
    if (!document.getElementById("avpUiModalStyle")) {
      var st = document.createElement("style"); st.id = "avpUiModalStyle"; st.textContent = css; document.head.appendChild(st);
    }
    if (!document.getElementById("avpUiModal")) {
      var d = document.createElement("div");
      d.id = "avpUiModal"; d.className = "avp-ui-modal tone-ok"; d.hidden = true;
      d.innerHTML = '<div class="avp-ui-modal-back" data-avp-ui-close></div><div class="avp-ui-modal-card" role="dialog" aria-modal="true"><div class="avp-ui-icon" id="avpUiIcon">📊</div><h3 class="avp-ui-title" id="avpUiTitle">Thông báo</h3><p class="avp-ui-body" id="avpUiBody"></p><div class="avp-ui-actions"><button type="button" class="avp-ui-btn avp-ui-cancel" id="avpUiCancel" hidden>Hủy</button><button type="button" class="avp-ui-btn avp-ui-ok" id="avpUiOk">OK</button></div></div>';
      (document.body || document.documentElement).appendChild(d);
    }
  }
  function dialog(opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      ensure();
      var root = document.getElementById("avpUiModal");
      document.getElementById("avpUiTitle").textContent = opts.title || "Excel";
      document.getElementById("avpUiBody").textContent = opts.body || "";
      document.getElementById("avpUiIcon").textContent = opts.icon || "📊";
      var ok = document.getElementById("avpUiOk");
      var cancel = document.getElementById("avpUiCancel");
      root.className = "avp-ui-modal tone-" + (opts.tone || "ok");
      ok.textContent = opts.okText || "Đã hiểu";
      cancel.hidden = !opts.showCancel;
      cancel.textContent = opts.cancelText || "Hủy";
      root.hidden = false;
      function close(v) { root.hidden = true; ok.onclick = null; cancel.onclick = null; resolve(v); }
      ok.onclick = function () { close(true); };
      cancel.onclick = function () { close(false); };
      root.querySelectorAll("[data-avp-ui-close]").forEach(function (el) { el.onclick = function () { close(false); }; });
    });
  }
  w.avpAlert = function (body, opts) {
    opts = opts || {};
    return dialog({ title: opts.title || "Thông báo", body: body, icon: opts.icon || "📗", tone: opts.tone || "ok", okText: opts.ok || "Đã hiểu", showCancel: false });
  };
  w.avpConfirm = function (body, opts) {
    opts = opts || {};
    return dialog({ title: opts.title || "Xác nhận", body: body, icon: opts.icon || "⚠️", tone: opts.tone || "warn", okText: opts.ok || "Đồng ý", cancelText: opts.cancel || "Hủy", showCancel: true });
  };
})(window);
