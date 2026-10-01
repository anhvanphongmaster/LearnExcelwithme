(() => {
  'use strict';

  if (window.__AVP_ADMIN_GRADER_LAZY_V1__) return;
  window.__AVP_ADMIN_GRADER_LAZY_V1__ = true;

  let loaded = false;
  let loading = false;

  function loadCore() {
    if (loaded || loading) return;
    loading = true;

    const script = document.createElement('script');
    script.src = 'admin-grader-core-v1.js?v=20261001-grader1';
    script.defer = true;

    script.onload = () => {
      loaded = true;
      loading = false;
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('avp:admin-grader-open'));
      }, 0);
    };

    script.onerror = () => {
      loading = false;
      console.error('[Admin Grader] Không tải được admin-grader-core-v1.js');
    };

    document.head.appendChild(script);
  }

  window.addEventListener('avp:admin-grader-open', loadCore);
})();