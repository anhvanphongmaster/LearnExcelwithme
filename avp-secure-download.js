(() => {
  "use strict";

  function loadAccess() {
    if (window.AVPAccess) return Promise.resolve(window.AVPAccess);
    if (window.__avpAccessLoading) return window.__avpAccessLoading;

    window.__avpAccessLoading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "avp-access.js?v=20260830-access1";
      s.defer = true;
      s.onload = () => resolve(window.AVPAccess || null);
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return window.__avpAccessLoading;
  }

  // Compatibility: old pages can keep including avp-secure-download.js.
  loadAccess().catch(err => console.warn("[AVP access] load failed", err));
})();
