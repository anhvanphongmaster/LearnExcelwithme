(() => {
  'use strict';

  if (window.__AVP_ADMIN_GROUPS_V2__) return;
  window.__AVP_ADMIN_GROUPS_V2__ = true;

  const LABELS = {
    overview: '📊 Tổng quan',
    users: '👥 Người dùng',
    race: '🏁 Excel Race',
    learning: '🎓 Học tập',
    grader: '🧪 Chấm điểm',
    professional: '🎯 Professional Track',
    practice: '📱 TikTok Practice',
    youtube: '▶️ YouTube Projects',
    homework: '📝 YT Practice',
    downloads: '📦 Tải xuống',
    tools: '🧰 Tool',
    inbox: '📥 Hộp thư',
    community: '📣 Cộng đồng',
    reviews: '⭐ Đánh giá',
    votes: '🗳️ Vote',
    engagement: '🖱️ Tương tác',
    analytics: '📈 Analytics'
  };

  const GROUPS = [
    ['overview', '📊', 'Tổng quan', ['overview']],
    ['people', '👥', 'Người dùng & Race', ['users', 'race']],
    ['learning', '🎓', 'Học tập & Chấm', ['learning', 'grader', 'professional']],
    ['content', '▶', 'Nội dung thực hành', ['practice', 'youtube', 'homework']],
    ['resources', '🧰', 'Tài nguyên', ['downloads', 'tools']],
    ['community', '💬', 'Cộng đồng', ['inbox', 'community', 'reviews']],
    ['insights', '📈', 'Phân tích', ['votes', 'engagement', 'analytics']]
  ];

  function buildGroupGrid(source) {
    let grid = document.querySelector('.admin-group-grid');

    if (grid) return grid;

    grid = document.createElement('div');
    grid.className = 'admin-group-grid';

    for (const [key, icon, title, targets] of GROUPS) {
      const card = document.createElement('section');
      card.className = 'admin-group-card';
      card.dataset.adminGroup = key;
      card.innerHTML = `
        <div class="admin-group-head">
          <span>${icon}</span>
          <div>
            <strong>${title}</strong>
            <small>${targets.length} khu quản lý</small>
          </div>
        </div>
        <div class="admin-group-links"></div>
      `;
      grid.appendChild(card);
    }

    source.before(grid);
    return grid;
  }

  function sync(source, grid) {
    for (const [key, , , targets] of GROUPS) {
      const links = grid.querySelector(
        '[data-admin-group="' + key + '"] .admin-group-links'
      );
      if (!links) continue;

      for (const target of targets) {
        const sourceButton = source.querySelector(
          '[data-admin-view="' + target + '"]'
        );
        if (!sourceButton) continue;

        let button = links.querySelector(
          '[data-target="' + target + '"]'
        );

        if (!button) {
          button = document.createElement('button');
          button.type = 'button';
          button.className = 'admin-group-link';
          button.dataset.target = target;
          button.addEventListener('click', () => sourceButton.click());
          links.appendChild(button);
        }

        button.textContent = LABELS[target] || target;
      }
    }

    const active =
      source.querySelector('[data-admin-view].active')?.dataset.adminView || '';

    grid.querySelectorAll('.admin-group-link').forEach(button => {
      button.classList.toggle(
        'is-active',
        button.dataset.target === active
      );
    });
  }

  function boot() {
    const source = document.querySelector('.admin-view-tabs');
    if (!source) return;

    source.classList.add('avp-admin-source-tabs');

    const grid = buildGroupGrid(source);
    const update = () => sync(source, grid);

    new MutationObserver(update).observe(source, {
      subtree: true,
      attributes: true,
      childList: true
    });

    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();