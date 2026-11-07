(() => {
  const init = () => {
    const modal = document.getElementById('avpcFolderModal');
    const openButton = document.getElementById('avpcFolderOpen');
    if (!modal || !openButton || modal.dataset.bound === '1') return;
    modal.dataset.bound = '1';
    let previousFocus = null;
    const close = () => {
      modal.hidden = true;
      document.body.classList.remove('avpc-folder-open');
      previousFocus?.focus?.();
    };
    const open = () => {
      previousFocus = document.activeElement;
      modal.hidden = false;
      document.body.classList.add('avpc-folder-open');
      modal.querySelector('.avpc-folder-close')?.focus();
    };
    openButton.addEventListener('click', open);
    modal.querySelectorAll('[data-avpc-folder-close]').forEach(el => el.addEventListener('click', close));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !modal.hidden) close();
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
