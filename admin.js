(() => {
  'use strict';

  if (window.__AVP_ADMIN_BOOTED__) return;
  window.__AVP_ADMIN_BOOTED__ = true;

  const CACHE_TTL = 1800;
  const rpcCache = new Map();
  let manualHealth = false;

  const EMPTY_ARRAY_RPCS = new Set([
    'admin_analytics_trend',
    'admin_analytics_top_tools',
    'admin_analytics_top_pages',
    'admin_learning_funnel',
    'admin_top_completed_lessons',
    'admin_quiz_difficulty',
    'admin_new_user_trend',
    'admin_list_saved_feedback'
  ]);

  const HEALTH_RPCS = new Set([
    'admin_tiktok_summary_v1',
    'admin_download_summary',
    'avp_chat_admin_threads'
  ]);

  const DEFERRED_RPCS = {
    analytics: new Set([
      'admin_analytics_trend',
      'admin_analytics_top_tools',
      'admin_analytics_top_pages',
      'admin_feature_usage_summary'
    ]),
    learning: new Set([
      'admin_learning_funnel',
      'admin_top_completed_lessons',
      'admin_quiz_difficulty',
      'admin_new_user_trend'
    ]),
    engagement: new Set([
      'admin_engagement_summary_v2',
      'admin_list_saved_feedback'
    ]),
    retention: new Set([
      'admin_user_retention_summary'
    ])
  };

  const CACHEABLE_RPCS = new Set([
    'admin_analytics_summary',
    'admin_analytics_trend',
    'admin_analytics_top_tools',
    'admin_analytics_top_pages',
    'admin_learning_summary',
    'admin_learning_funnel',
    'admin_top_completed_lessons',
    'admin_quiz_difficulty',
    'admin_new_user_trend',
    'admin_engagement_summary_v2',
    'admin_feature_usage_summary',
    'admin_um_list_users',
    'admin_tiktok_summary_v1',
    'admin_download_summary',
    'avp_chat_admin_threads',
    'admin_system_notification_list',
    'admin_list_saved_feedback'
  ]);

  function currentView() {
    try {
      return localStorage.getItem('avp_admin_view_v1') || 'overview';
    } catch {
      return 'overview';
    }
  }

  function emptyRpcResult(name) {
    return EMPTY_ARRAY_RPCS.has(name) ? [] : {};
  }

  function isHealthRequest(name, args) {
    const a = args || {};
    return (
      (name === 'admin_analytics_summary' && Number(a.p_days) === 1) ||
      (name === 'admin_um_list_users' && Number(a.p_limit) === 1) ||
      HEALTH_RPCS.has(name) ||
      (name === 'admin_system_notification_list' && Number(a.p_limit) === 1)
    );
  }

  function isDeferred(name) {
    const view = currentView();
    return (
      (DEFERRED_RPCS.analytics.has(name) && view !== 'analytics') ||
      (DEFERRED_RPCS.learning.has(name) && view !== 'learning') ||
      (DEFERRED_RPCS.engagement.has(name) && view !== 'engagement') ||
      (DEFERRED_RPCS.retention.has(name) && view !== 'retention')
    );
  }

  function resetHealthUi() {
    if (manualHealth) return;

    document.querySelectorAll('#adminHealthGrid [data-health]').forEach(card => {
      card.classList.remove('ok', 'warn', 'bad');

      const status = card.querySelector('strong');
      const hint = card.querySelector('small');

      if (status) status.textContent = 'Chưa kiểm tra';
      if (hint) hint.textContent = 'Bấm “Kiểm tra” khi cần chẩn đoán.';
    });
  }

  function installRpcGate(client) {
    if (!client?.rpc || client.__avpAdminRpcGate) return;

    const rpc = client.rpc.bind(client);
    client.__avpAdminRpcGate = true;

    client.rpc = (name, args) => {
      const params = args || {};

      // Health probes must reach Supabase. Returning a synthetic empty result here
      // falsely marked broken RPCs as healthy and also swallowed real requests that
      // happened to use the same arguments (for example a one-day report).
      if (isHealthRequest(name, params)) {
        return rpc(name, args);
      }

      if (isDeferred(name)) {
        return Promise.resolve({
          data: emptyRpcResult(name),
          error: null
        });
      }

      if (!CACHEABLE_RPCS.has(name)) {
        return rpc(name, args);
      }

      let key;
      try {
        key = name + '|' + JSON.stringify(params);
      } catch {
        key = name;
      }

      const now = Date.now();
      const cached = rpcCache.get(key);

      if (cached && now - cached.createdAt < CACHE_TTL) {
        return cached.promise;
      }

      // Do not cache failed RPC responses: a transient auth/network/schema error
      // must not poison manual refreshes for the full 30-minute cache window.
      let promise;
      promise = rpc(name, args).then(
        result => {
          if (result?.error) {
            const current = rpcCache.get(key);
            if (current?.promise === promise) rpcCache.delete(key);
          }
          return result;
        },
        error => {
          const current = rpcCache.get(key);
          if (current?.promise === promise) rpcCache.delete(key);
          throw error;
        }
      );
      rpcCache.set(key, { createdAt: now, promise });

      setTimeout(() => {
        const current = rpcCache.get(key);
        if (current?.promise === promise) rpcCache.delete(key);
      }, CACHE_TTL + 80);

      return promise;
    };
  }

  async function waitForSupabase() {
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const client = window.avpSupabase || window.supabaseClient || null;

      if (client?.rpc) {
        installRpcGate(client);
        return client;
      }

      await new Promise(resolve => setTimeout(resolve, 75));
    }

    return null;
  }

  function ensureAdminStyles() {
    const styles = [
      ['admin-ui-v2.css?v=20260913-adminui3', 'avpAdminUiV2'],
      ['admin-ui-v2-final.css?v=20260913-adminfinal2', 'avpAdminUiFinal']
    ];

    for (const [href, marker] of styles) {
      if (document.querySelector(`link[data-${marker}]`)) continue;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset[marker] = '1';
      document.head.appendChild(link);
    }
  }

  function bindAdminGuards() {
    document.addEventListener('click', event => {
      const healthButton = event.target.closest('#adminHealthReload');

      if (healthButton) {
        manualHealth = true;
        setTimeout(() => {
          manualHealth = false;
        }, 8000);
        return;
      }

      const tab = event.target.closest('.admin-view-tabs [data-admin-view]');
      if (!tab) return;

      const view = tab.dataset.adminView;

      if (view === 'overview') {
        setTimeout(resetHealthUi, 180);
      }

      if (view === 'learning' || view === 'analytics') {
        setTimeout(() => document.getElementById('adminRefresh')?.click(), 120);
      }
    }, true);
  }

  async function loadCore() {
    const script = document.createElement('script');
    script.src = 'admin-core-v1.js?v=20261004-remove-doctor2';
    script.defer = true;

    script.onload = () => {
      setTimeout(resetHealthUi, 350);
      setTimeout(resetHealthUi, 1200);
    };

    script.onerror = () => {
      console.error('[Admin] Không tải được admin-core-v1.js');
    };

    document.head.appendChild(script);
  }

  async function boot() {
    ensureAdminStyles();
    bindAdminGuards();
    await waitForSupabase();
    await loadCore();
  }

  boot();
})();