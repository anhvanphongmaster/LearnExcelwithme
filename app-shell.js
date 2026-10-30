(() => {
  'use strict';

  const SETTINGS_KEY = 'avp-settings-v1';
  const LEGACY_DISPLAY_KEY = 'avp-display-mode';
  const EXCLUDE = new Set([
    'app-shell.html',
    'admin.html',
    'office-quest-admin.html',
    'office-quest-world.html',
    'auth.html'
  ]);

  const BASE = (() => {
    const p = location.pathname;
    const i = p.toLowerCase().indexOf('/learnexcelwithme');
    if (i >= 0) {
      const end = i + '/LearnExcelwithme'.length;
      return p.slice(0, end).replace(/\/?$/, '/');
    }
    // local file or root deploy
    const parts = p.split('/');
    parts.pop();
    return (parts.join('/') || '') + '/';
  })();

  const defaults = { language: 'vi', theme: 'light', layout: 'mobile' };
  let prefs = { ...defaults };
  try {
    prefs = { ...prefs, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
  } catch (_) {}
  // migrate legacy display-mode key once
  try {
    const leg = localStorage.getItem(LEGACY_DISPLAY_KEY);
    if (leg === 'desktop' || leg === 'mobile') {
      if (!localStorage.getItem(SETTINGS_KEY)) prefs.layout = leg;
    }
  } catch (_) {}

  const header = document.getElementById('avpShellHeader');
  const frame = document.getElementById('avpShellFrame');
  const loading = document.getElementById('avpShellLoading');
  const settingsDlg = document.getElementById('avpShellSettings');
  let lastChildPath = '';
  let syncLock = false;

  function pageName(pathname) {
    const seg = (pathname || '').split('/').pop() || 'index.html';
    return seg.toLowerCase() || 'index.html';
  }

  function isExcluded(pathname) {
    return EXCLUDE.has(pageName(pathname));
  }

  function applyPrefs() {
    const root = document.documentElement;
    root.lang = prefs.language === 'en' ? 'en' : 'vi';
    root.dataset.avpTheme = prefs.theme === 'dark' ? 'dark' : 'light';
    root.dataset.avpLayout = prefs.layout === 'desktop' ? 'desktop' : 'mobile';
    root.dataset.avpDisplayMode = root.dataset.avpLayout; // compat with existing CSS
    document.body.classList.toggle('dark-mode', prefs.theme === 'dark');
    // Always device-width — never force 1200px zoom viewport
    const vp = document.querySelector('meta[name="viewport"]');
    if (vp) vp.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');
    renderSettings();
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(prefs));
      localStorage.setItem(LEGACY_DISPLAY_KEY, prefs.layout);
    } catch (_) {}
    // notify child if same-origin
    postToChild({ type: 'avp-shell-prefs', prefs: { ...prefs } });
  }

  function savePref(key, value) {
    prefs[key] = value;
    applyPrefs();
  }

  function renderSettings() {
    if (!settingsDlg) return;
    settingsDlg.querySelectorAll('[data-setting]').forEach((btn) => {
      const on = prefs[btn.dataset.setting] === btn.dataset.value;
      btn.setAttribute('aria-pressed', String(on));
    });
    document.querySelectorAll('[data-shell-layout]').forEach((btn) => {
      const on = prefs.layout === btn.dataset.shellLayout;
      btn.setAttribute('aria-pressed', String(on));
    });
    document.querySelectorAll('[data-shell-theme]').forEach((btn) => {
      const on = prefs.theme === btn.dataset.shellTheme;
      btn.setAttribute('aria-pressed', String(on));
    });
  }

  function publicUrlFromChild(href) {
    try {
      const u = new URL(href, location.href);
      u.searchParams.delete('embed');
      u.searchParams.delete('avp_content');
      return u.pathname + u.search + u.hash;
    } catch (_) {
      return location.pathname;
    }
  }

  function setLoading(on) {
    if (!loading) return;
    loading.classList.toggle('is-on', !!on);
    loading.setAttribute('aria-hidden', on ? 'false' : 'true');
  }

  function loadChild(url, { push } = { push: false }) {
    if (!frame) return;
    setLoading(true);
    const target = (() => {
      try {
        const u = new URL(url, location.href);
        u.searchParams.set('embed', '1');
        u.searchParams.set('avp_content', '1');
        return u.href;
      } catch (_) {
        return url;
      }
    })();

    // Update browser URL to the real public route (without embed markers)
    const pub = publicUrlFromChild(target);
    syncLock = true;
    try {
      if (push) history.pushState({ avpShell: true, path: pub }, '', pub);
      else history.replaceState({ avpShell: true, path: pub }, '', pub);
    } catch (_) {}
    syncLock = false;

    lastChildPath = pub;
    frame.src = target;
  }

  function onFrameLoad() {
    setLoading(false);
    try {
      const win = frame.contentWindow;
      if (!win) return;
      const childLoc = win.location;
      // same-origin only
      if (childLoc.origin !== location.origin) return;
      const pub = publicUrlFromChild(childLoc.href);
      if (pub && pub !== lastChildPath) {
        lastChildPath = pub;
        syncLock = true;
        history.replaceState({ avpShell: true, path: pub }, '', pub);
        syncLock = false;
      }
      // re-apply prefs into child documentElement for theme continuity
      try {
        const doc = frame.contentDocument;
        if (doc && doc.documentElement) {
          doc.documentElement.dataset.avpTheme = prefs.theme;
          doc.documentElement.dataset.avpLayout = prefs.layout;
          doc.documentElement.dataset.avpDisplayMode = prefs.layout;
          doc.documentElement.lang = prefs.language === 'en' ? 'en' : 'vi';
          doc.body && doc.body.classList.toggle('dark-mode', prefs.theme === 'dark');
        }
      } catch (_) {}
      attachChildObservers();
    } catch (_) {
      // cross-origin: ignore
    }
  }

  let childClickBound = false;
  function attachChildObservers() {
    try {
      const doc = frame.contentDocument;
      if (!doc || childClickBound === doc) return;
      childClickBound = doc;
      // Intercept same-origin top navigations from links targeting _top/_parent/blank-less
      doc.addEventListener(
        'click',
        (e) => {
          const a = e.target.closest && e.target.closest('a[href]');
          if (!a) return;
          if (a.hasAttribute('download')) return;
          if (a.target && a.target !== '' && a.target !== '_self') return;
          let url;
          try {
            url = new URL(a.getAttribute('href'), doc.baseURI || location.href);
          } catch (_) {
            return;
          }
          if (url.origin !== location.origin) return;
          // keep downloads and hash-only on same page inside iframe
          const name = pageName(url.pathname);
          if (isExcluded(name)) {
            // leave shell — full page
            return;
          }
          // HTML or directory routes stay in shell
          if (/\.html?$/i.test(url.pathname) || url.pathname.endsWith('/') || !url.pathname.split('/').pop().includes('.')) {
            e.preventDefault();
            loadChild(url.href, { push: true });
          }
        },
        true
      );
    } catch (_) {}
  }

  function postToChild(msg) {
    try {
      frame && frame.contentWindow && frame.contentWindow.postMessage(msg, location.origin);
    } catch (_) {}
  }

  function wireHeader() {
    document.querySelectorAll('[data-shell-nav]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href) return;
        let url;
        try {
          url = new URL(href, location.origin + BASE);
        } catch (_) {
          return;
        }
        if (isExcluded(pageName(url.pathname))) return; // normal navigation
        e.preventDefault();
        loadChild(url.href, { push: true });
      });
    });

    const openBtn = document.getElementById('avpShellSettingsBtn');
    if (openBtn && settingsDlg) {
      openBtn.addEventListener('click', () => {
        renderSettings();
        if (typeof settingsDlg.showModal === 'function') settingsDlg.showModal();
        else settingsDlg.setAttribute('open', '');
      });
    }
    if (settingsDlg) {
      settingsDlg.addEventListener('click', (e) => {
        if (e.target === settingsDlg) settingsDlg.close && settingsDlg.close();
        const b = e.target.closest && e.target.closest('[data-setting]');
        if (b) savePref(b.dataset.setting, b.dataset.value);
      });
    }
    document.querySelectorAll('[data-shell-layout]').forEach((b) => {
      b.addEventListener('click', () => savePref('layout', b.dataset.shellLayout));
    });
    document.querySelectorAll('[data-shell-theme]').forEach((b) => {
      b.addEventListener('click', () => savePref('theme', b.dataset.shellTheme));
    });
  }

  function onPopState() {
    if (syncLock) return;
    loadChild(location.href, { push: false });
  }

  // Register SW from shell as well (scope under BASE)
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    const swUrl = BASE + 'sw.js';
    navigator.serviceWorker.register(swUrl, { scope: BASE }).catch(() => {});
  }

  // Boot
  applyPrefs();
  wireHeader();
  frame.addEventListener('load', onFrameLoad);
  window.addEventListener('popstate', onPopState);
  registerSW();

  // Initial child
  const initialName = pageName(location.pathname);
  if (initialName === 'app-shell.html') {
    loadChild(BASE + 'index.html' + location.search + location.hash, { push: false });
  } else if (isExcluded(initialName)) {
    // Should not happen if SW is correct; hard navigate
    location.replace(location.pathname + location.search + location.hash);
  } else {
    loadChild(location.href, { push: false });
  }
})();
