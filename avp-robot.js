(() => {
  'use strict';

  if (window.__AVPRobotControllerV3) return;
  window.__AVPRobotControllerV3 = true;

  const bridge = window.__AVPRobotBridge;
  if (!bridge || bridge.embedded) return;

  const { launcher, fab, edgeMenu, pageContext } = bridge;
  if (!launcher || !fab || !edgeMenu || !pageContext) return;

  const HOME = !!bridge.canPatrol;
  const PAD = 16;
  const DOCK_GAP = 8;
  const DOCK_KEY = 'avp_bot_dock_right_y_v3';
  const LEGACY_DOCK_KEYS = ['avp_bot_dock_right_y_v1'];
  const WALK_KEY = 'avp_bot_walk_x_v1';
  const SPEED = 0.72;
  const DRAG_THRESHOLD = 7;

  let walkX = PAD;
  let walkDir = 1;
  let pointerId = null;
  let pointerStart = null;
  let dragging = false;
  let moved = false;
  let bubbleToken = 0;
  let raf = 0;
  let alive = true;

  try {
    const saved = JSON.parse(localStorage.getItem(WALK_KEY) || 'null');
    if (saved && Number.isFinite(Number(saved.x))) {
      walkX = Number(saved.x);
      walkDir = saved.dir === -1 ? -1 : 1;
    }
  } catch (_) {}

  const bubble = document.createElement('div');
  bubble.className = 'avp-bot-bubble avp-bot-bubble-v3';
  bubble.id = 'avpBotBubble';
  bubble.hidden = true;
  document.body.appendChild(bubble);

  const genericLines = [
    'Cần hỏi ngay trong lúc làm? Bấm AVP để mở Hỏi AI hoặc Chat Admin.',
    'Nếu đang bí, hãy hỏi đúng lỗi hoặc bước bạn đang vướng để nhận câu trả lời sát hơn.',
    'Làm trực tiếp trên file sẽ nhớ lâu hơn chỉ xem cách làm.',
    'Không cần học tất cả cùng lúc. Chọn đúng một mục rồi làm đến khi hiểu.',
    'Nếu cần người hỗ trợ, AVP vẫn giữ Hỏi AI, Từ điển, Cộng đồng và Chat Admin.',
    'Khi đã hiểu một bước, tự làm lại từ đầu sẽ giúp bạn nhớ chắc hơn.'
  ];

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const width = () => Math.max(56, launcher.offsetWidth || fab.offsetWidth || 56);
  const height = () => Math.max(72, launcher.offsetHeight || fab.offsetHeight || 72);
  const maxWalkX = () => Math.max(PAD, window.innerWidth - width() - PAD);

  function persistWalk() {
    try {
      localStorage.setItem(WALK_KEY, JSON.stringify({ x: walkX, dir: walkDir }));
    } catch (_) {}
  }

  function legacyDockY() {
    for (const key of LEGACY_DOCK_KEYS) {
      try {
        const raw = localStorage.getItem(key);
        const value = Number(raw);
        if (raw !== null && Number.isFinite(value)) return value;
      } catch (_) {}
    }
    return Math.round(window.innerHeight * 0.56);
  }

  function savedDockY() {
    try {
      const raw = localStorage.getItem(DOCK_KEY);
      const value = Number(raw);
      if (raw !== null && Number.isFinite(value)) return value;
    } catch (_) {}
    return legacyDockY();
  }

  function persistDock(y) {
    try {
      localStorage.setItem(DOCK_KEY, String(Math.round(y)));
    } catch (_) {}
  }

  function dockTop(y) {
    const maxTop = Math.max(DOCK_GAP, window.innerHeight - height() - DOCK_GAP);
    return clamp(Number.isFinite(Number(y)) ? Number(y) : savedDockY(), DOCK_GAP, maxTop);
  }

  function applyHomePosition(x, bottom = PAD) {
    launcher.classList.remove('is-docked-right', 'is-left');
    launcher.classList.add('is-right');
    launcher.style.left = `${Math.round(x)}px`;
    launcher.style.right = 'auto';
    launcher.style.top = 'auto';
    launcher.style.bottom = `${Math.round(bottom)}px`;
  }

  function applyDock(y, animate = false) {
    const top = dockTop(y);
    const left = Math.max(DOCK_GAP, window.innerWidth - width() - DOCK_GAP);

    if (animate) launcher.classList.add('is-snapping');
    launcher.classList.add('is-right', 'is-docked-right', 'is-stationary');
    launcher.classList.remove('is-left', 'is-walking', 'face-left');

    launcher.style.left = `${Math.round(left)}px`;
    launcher.style.right = 'auto';
    launcher.style.top = `${Math.round(top)}px`;
    launcher.style.bottom = 'auto';

    persistDock(top);
    if (!edgeMenu.hidden) requestAnimationFrame(() => bridge.positionMenu?.());

    if (animate) {
      setTimeout(() => launcher.classList.remove('is-snapping'), 260);
    }
  }

  function hideBubble() {
    bubbleToken += 1;
    bubble.classList.remove('show');
    bubble.hidden = true;
  }

  function placeBubble() {
    if (bubble.hidden) return;

    const r = launcher.getBoundingClientRect();
    const bw = Math.min(260, Math.max(180, window.innerWidth - 24));
    const bh = bubble.offsetHeight || 72;
    let left;
    let top;

    if (!HOME && launcher.classList.contains('is-docked-right')) {
      left = r.left - bw - 10;
      top = r.top + r.height / 2 - bh / 2;
    } else {
      left = r.left + r.width / 2 - bw / 2;
      top = r.top - bh - 10;
    }

    left = clamp(left, 12, Math.max(12, window.innerWidth - bw - 12));
    top = clamp(top, 12, Math.max(12, window.innerHeight - bh - 12));

    bubble.style.width = `${Math.round(bw)}px`;
    bubble.style.left = `${Math.round(left)}px`;
    bubble.style.top = `${Math.round(top)}px`;
    bubble.style.bottom = 'auto';
  }

  function showLine(text, ms = 3000) {
    const message = String(text || '').trim();
    if (!message || document.visibilityState !== 'visible' || !alive) {
      return Promise.resolve(false);
    }

    const token = ++bubbleToken;
    bubble.textContent = message;
    bubble.hidden = false;
    bubble.classList.add('show');
    requestAnimationFrame(placeBubble);

    return new Promise(resolve => {
      setTimeout(() => {
        if (alive && token === bubbleToken) {
          bubble.classList.remove('show');
          bubble.hidden = true;
        }
        resolve(true);
      }, ms);
    });
  }

  window.AVPBotSay = (text, ms) => showLine(text, ms || 3000);

  function pick(items) {
    return Array.isArray(items) && items.length
      ? items[Math.floor(Math.random() * items.length)]
      : '';
  }

  function contextualLine() {
    const suggestions = pageContext.suggestions || [];
    const lines = [...(pageContext.lines || []), ...genericLines];
    if (suggestions.length && Math.random() < 0.34) return pick(suggestions);
    return pick(lines) || pageContext.intro || '';
  }

  function nextTalkDelay() {
    if (pageContext.kind === 'home') return 38000 + Math.floor(Math.random() * 28000);
    if (pageContext.kind === 'game') return 30000 + Math.floor(Math.random() * 24000);
    if (pageContext.kind === 'practice') return 52000 + Math.floor(Math.random() * 43000);
    if (pageContext.kind === 'professional') return 50000 + Math.floor(Math.random() * 38000);
    if (pageContext.kind === 'map') return 45000 + Math.floor(Math.random() * 32000);
    return 90000;
  }

  function canSpeak() {
    return alive &&
      document.visibilityState === 'visible' &&
      !dragging &&
      !launcher.classList.contains('open');
  }

  async function talkLoop() {
    if (!pageContext.autoTalk) return;

    await new Promise(r => setTimeout(r, pageContext.kind === 'practice' ? 1800 : 2800));
    if (!alive) return;

    if (canSpeak() && pageContext.intro) {
      await showLine(pageContext.intro, pageContext.kind === 'practice' ? 3400 : 3000);
    }

    while (alive) {
      await new Promise(r => setTimeout(r, nextTalkDelay()));
      if (!alive || !canSpeak()) continue;

      const unread = Number(bridge.unreadNow?.() || 0);
      if (unread > 0) {
        await showLine(
          unread > 1 ? `Bạn có ${unread} thông báo mới chưa đọc.` : 'Bạn có thông báo mới chưa đọc.',
          2800
        );
        continue;
      }

      await showLine(contextualLine(), 3000);
    }
  }

  function proAccessMessage(state) {
    if (pageContext.kind !== 'professional-access' || !state) return '';

    const phase = String(state.phase || state.status || '').toLowerCase();
    if (state.isAdmin || state.canAccess || phase === 'approved') {
      return 'Khu Pro đã được mở. Bạn có thể vào Professional Track và bắt đầu luyện case chuyên sâu.';
    }

    if (phase === 'locked' || phase === 'insufficient') {
      const limits = state.limits || { basic: 1500, intermediate: 1300, advanced: 1000, days: 5 };
      const missing = [];
      if (Number(state.basicScore || 0) < Number(limits.basic || 1500)) {
        missing.push(`Cơ bản ${Number(state.basicScore || 0).toLocaleString('vi-VN')}/${Number(limits.basic || 1500).toLocaleString('vi-VN')} điểm`);
      }
      if (Number(state.intermediateScore || 0) < Number(limits.intermediate || 1300)) {
        missing.push(`Trung cấp ${Number(state.intermediateScore || 0).toLocaleString('vi-VN')}/${Number(limits.intermediate || 1300).toLocaleString('vi-VN')} điểm`);
      }
      if (Number(state.advancedScore || 0) < Number(limits.advanced || 1000)) {
        missing.push(`Nâng cao ${Number(state.advancedScore || 0).toLocaleString('vi-VN')}/${Number(limits.advanced || 1000).toLocaleString('vi-VN')} điểm`);
      }
      if (Number(state.activeDays || 0) < Number(limits.days || 5)) {
        missing.push(`${Number(state.activeDays || 0)}/${Number(limits.days || 5)} ngày hoạt động`);
      }

      const detail = missing.length ? ` Bạn còn thiếu: ${missing.join(', ')}.` : '';
      return `Bạn chưa đủ điều kiện vào khu Pro.${detail} Hãy tiếp tục làm Bài tập tự chấm để tích điểm; khi đủ điều kiện hệ thống sẽ mở bước tiếp theo.`;
    }

    if (phase === 'eligible') {
      return 'Bạn đã đủ điểm và ngày hoạt động. Bước tiếp theo là nộp chứng chỉ để Admin xác nhận quyền vào khu Pro.';
    }
    if (phase === 'pending') {
      return 'Hồ sơ Pro đang được Admin xét duyệt. Bạn không cần tích thêm điểm cho bước mở khóa này.';
    }
    if (phase === 'rejected') {
      return 'Hồ sơ Pro cần bổ sung. Hãy xem ghi chú của Admin trên trang này rồi nộp lại phần còn thiếu.';
    }
    if (phase === 'login') {
      return 'Bạn cần đăng nhập để hệ thống kiểm tra điểm và điều kiện vào khu Pro.';
    }
    return '';
  }

  function announceProAccess(state) {
    const message = proAccessMessage(state);
    if (!message) return;
    setTimeout(() => {
      if (canSpeak()) showLine(message, 4600);
    }, 400);
  }

  window.addEventListener('avp:professional-access-state', e => announceProAccess(e.detail));
  if (window.AVPProfessionalAccessState) announceProAccess(window.AVPProfessionalAccessState);

  function beginPointer(e) {
    if (e.button != null && e.button !== 0) return;
    pointerId = e.pointerId;
    pointerStart = { x: e.clientX, y: e.clientY };
    dragging = false;
    moved = false;
    try { fab.setPointerCapture(pointerId); } catch (_) {}
  }

  function movePointer(e) {
    if (pointerStart == null || e.pointerId !== pointerId) return;

    const dx = e.clientX - pointerStart.x;
    const dy = e.clientY - pointerStart.y;
    const dist = Math.hypot(dx, dy);

    if (HOME) {
      // Preserve the original homepage behavior: only lifting upward starts the crying drag.
      if (!dragging && (-dy <= 18 || dist <= 18)) return;
      if (!dragging) {
        dragging = true;
        moved = true;
        hideBubble();
        bridge.closeMenu?.();
        launcher.classList.add('is-lifted', 'is-crying');
        launcher.classList.remove('is-walking', 'is-stationary', 'is-greeting');
      }

      const bottom = Math.max(PAD, window.innerHeight - e.clientY - 36);
      const left = clamp(e.clientX - width() / 2, PAD, maxWalkX());
      applyHomePosition(left, bottom);
      e.preventDefault();
      return;
    }

    if (!dragging && dist < DRAG_THRESHOLD) return;
    if (!dragging) {
      dragging = true;
      moved = true;
      hideBubble();
      bridge.closeMenu?.();
      launcher.classList.add('is-lifted', 'is-crying', 'is-dragging');
      launcher.classList.remove('is-walking', 'is-stationary', 'is-greeting');
    }

    const left = clamp(e.clientX - width() / 2, DOCK_GAP, Math.max(DOCK_GAP, window.innerWidth - width() - DOCK_GAP));
    const top = clamp(e.clientY - height() / 2, DOCK_GAP, Math.max(DOCK_GAP, window.innerHeight - height() - DOCK_GAP));

    launcher.style.left = `${Math.round(left)}px`;
    launcher.style.right = 'auto';
    launcher.style.top = `${Math.round(top)}px`;
    launcher.style.bottom = 'auto';
    e.preventDefault();
  }

  function endPointer(e) {
    if (pointerStart == null) return;

    try {
      if (pointerId != null) fab.releasePointerCapture(pointerId);
    } catch (_) {}

    pointerStart = null;
    pointerId = null;

    if (!moved) {
      dragging = false;
      return;
    }

    fab.dataset.justDragged = '1';
    fab.dataset.justLifted = '1';
    setTimeout(() => {
      delete fab.dataset.justDragged;
      delete fab.dataset.justLifted;
    }, 320);

    launcher.classList.remove('is-lifted', 'is-crying', 'is-dragging');
    dragging = false;
    moved = false;

    if (HOME) {
      applyHomePosition(walkX, PAD);
      if (!launcher.classList.contains('open')) launcher.classList.add('is-walking');
    } else {
      // One invariant on every non-home page: snap right, preserve the user's vertical position.
      applyDock(launcher.getBoundingClientRect().top, true);
    }
  }

  fab.addEventListener('pointerdown', beginPointer, { passive: true });
  fab.addEventListener('pointermove', movePointer, { passive: false });
  fab.addEventListener('pointerup', endPointer, { passive: true });
  fab.addEventListener('pointercancel', endPointer, { passive: true });

  window.addEventListener('avp:chat-new-message', e => {
    if (!canSpeak()) return;
    const sender = String(e.detail?.sender || 'Admin').trim();
    showLine(`Bạn có tin nhắn mới từ ${sender}. Bấm AVP để xem.`, 3200);
  });

  window.addEventListener('avp:course-xp', () => {
    if (document.visibilityState !== 'visible') return;
    launcher.classList.remove('is-walking', 'is-stationary');
    launcher.classList.add('is-greeting');
    showLine('Đã ghi nhận hoàn thành. Bạn có thể học bài tiếp theo hoặc sang Khu bài tập để luyện lại.', 3600)
      .finally(() => {
        if (!alive) return;
        launcher.classList.remove('is-greeting');
        if (HOME) launcher.classList.add('is-walking');
        else launcher.classList.add('is-stationary');
      });
  });

  function frame() {
    if (!alive) return;

    if (HOME && !dragging && launcher.classList.contains('is-walking') && !launcher.classList.contains('open')) {
      walkX += walkDir * SPEED;
      const mx = maxWalkX();
      if (walkX >= mx) { walkX = mx; walkDir = -1; }
      if (walkX <= PAD) { walkX = PAD; walkDir = 1; }
      applyHomePosition(walkX, PAD);
      launcher.classList.toggle('face-left', walkDir < 0);

      if (!window.__avpBotSaveT || Date.now() - window.__avpBotSaveT > 600) {
        window.__avpBotSaveT = Date.now();
        persistWalk();
      }
    }

    placeBubble();
    raf = requestAnimationFrame(frame);
  }

  function onResize() {
    if (HOME) {
      walkX = clamp(walkX, PAD, maxWalkX());
      applyHomePosition(walkX, PAD);
      persistWalk();
    } else {
      applyDock(savedDockY(), false);
    }
    placeBubble();
    if (!edgeMenu.hidden) requestAnimationFrame(() => bridge.positionMenu?.());
  }

  function cleanup() {
    if (!alive) return;
    alive = false;
    hideBubble();
    if (raf) cancelAnimationFrame(raf);
    if (HOME) persistWalk();
    else persistDock(launcher.getBoundingClientRect().top);
  }

  if (HOME) {
    launcher.classList.remove('is-docked-right', 'is-stationary');
    launcher.classList.add('is-walking', 'is-right');
    applyHomePosition(walkX, PAD);
  } else {
    launcher.classList.remove('is-walking', 'face-left');
    applyDock(savedDockY(), false);
  }

  requestAnimationFrame(frame);
  talkLoop();

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('pagehide', cleanup, { once: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      hideBubble();
      if (HOME) persistWalk();
      else persistDock(launcher.getBoundingClientRect().top);
    }
  });
})();
