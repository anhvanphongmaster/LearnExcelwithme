(() => {
  'use strict';
  if (window.__AVP_LAUNCHER_UNIFY_V1__) return;
  window.__AVP_LAUNCHER_UNIFY_V1__ = true;

  const LEGACY_IDS = ['avpChatBubble', 'avpAiChatBubble'];

  function robotReady() {
    return !!document.getElementById('avpEdgeMain') &&
      document.documentElement.classList.contains('avp-has-robot');
  }

  function suppressLegacyLauncher(el) {
    if (!el || el.dataset.avpLauncherSuppressed === '1') return;
    el.dataset.avpLauncherSuppressed = '1';
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('tabindex', '-1');
    el.style.setProperty('display', 'none', 'important');
    el.style.setProperty('visibility', 'hidden', 'important');
    el.style.setProperty('pointer-events', 'none', 'important');
  }

  function sync() {
    if (!robotReady()) return;
    LEGACY_IDS.forEach(id => suppressLegacyLauncher(document.getElementById(id)));
  }

  function nodeMayMatter(node) {
    if (!(node instanceof Element)) return false;
    if (node.id === 'avpEdgeMain' || LEGACY_IDS.includes(node.id)) return true;
    return !!node.querySelector?.('#avpEdgeMain,#avpChatBubble,#avpAiChatBubble');
  }

  function startObserver() {
    sync();
    const root = document.body || document.documentElement;
    if (!root || typeof MutationObserver === 'undefined') return;
    const observer = new MutationObserver(records => {
      if (!records.some(r => [...r.addedNodes].some(nodeMayMatter))) return;
      queueMicrotask(sync);
    });
    observer.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver, { once: true });
  } else {
    startObserver();
  }

  // Covers deferred/dynamic chat loaders without polling the whole page.
  [0, 120, 500, 1500, 3500].forEach(ms => setTimeout(sync, ms));

  window.AVPLauncherUnifier = { refresh: sync };
})();
