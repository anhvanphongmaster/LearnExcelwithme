(() => {
  const PER = 30;
  const BEST_HOC = "avp_excel_race_best_hoc";
  const BEST_RANK = "avp_excel_race_best_rank";
  const $ = (id) => document.getElementById(id);

  function avpDialog({ title, body, icon, tone, confirmText, cancelText, showCancel }) {
    return new Promise((resolve) => {
      const root = $("avpModal");
      if (!root) {
        resolve(!showCancel ? true : window.confirm(body || title));
        return;
      }
      const titleEl = $("avpModalTitle");
      const bodyEl = $("avpModalBody");
      const iconEl = $("avpModalIcon");
      const ok = $("avpModalOk");
      const cancel = $("avpModalCancel");
      root.className = "avp-modal tone-" + (tone || "ok");
      if (titleEl) titleEl.textContent = title || "Thông báo";
      if (bodyEl) bodyEl.textContent = body || "";
      if (iconEl) iconEl.textContent = icon || "📊";
      if (ok) ok.textContent = confirmText || "OK";
      if (cancel) {
        cancel.hidden = !showCancel;
        cancel.textContent = cancelText || "Hủy";
      }
      root.hidden = false;

      function close(val) {
        root.hidden = true;
        ok.onclick = null;
        cancel.onclick = null;
        root.querySelectorAll("[data-avp-close]").forEach((el) => {
          el.onclick = null;
        });
        resolve(val);
      }
      ok.onclick = () => close(true);
      if (cancel) cancel.onclick = () => close(false);
      root.querySelectorAll("[data-avp-close]").forEach((el) => {
        el.onclick = () => close(false);
      });
    });
  }
  function avpAlert(body, opts) {
    opts = opts || {};
    return avpDialog({
      title: opts.title || "Excel Race",
      body: body,
      icon: opts.icon || "📗",
      tone: opts.tone || "ok",
      confirmText: opts.ok || "Đã hiểu",
      showCancel: false
    });
  }
  function avpConfirm(body, opts) {
    opts = opts || {};
    return avpDialog({
      title: opts.title || "Xác nhận",
      body: body,
      icon: opts.icon || "⚠️",
      tone: opts.tone || "warn",
      confirmText: opts.ok || "Đồng ý",
      cancelText: opts.cancel || "Hủy",
      showCancel: true
    });
  }


  // Gợi ý ôn bài (ít file thật → trỏ practice-video + vài bài đã mở)
  const HINTS = [
    { minStreak: 5, label: "Bài tập theo video", href: "practice-video.html" },
    { minStreak: 10, label: "Dropdown 2 cấp (bài 13)", href: "practice-video.html" },
    { minStreak: 15, label: "Làm sạch → Pivot → Dashboard", href: "practice-video.html" },
    { minStreak: 20, label: "Excel Mobile", href: "excel-mobile.html" }
  ];

  let mode = "hoc"; // hoc | rank
  let all = [], level = 1, inLevel = [], idx = 0, streak = 0, best = 0;
  let lives = 3;
  let locked = false, playing = false, timerId = null, endsAt = 0, limitSec = 20;
  let speed = 0, targetSpeed = 0, offset = 0, crash = 0, shake = 0;
  let playerName = "";
  let claimToken = "";
  /** @type {{name:string,score:number}[]} */
  let rivals = [];

  let ac = null;
  function ctx() {
    if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; } }
    if (ac.state === "suspended") ac.resume();
    return ac;
  }
  function beep(freq, dur, type, vol) {
    const c = ctx(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || "square"; o.frequency.value = freq; g.gain.value = vol || 0.04;
    o.connect(g); g.connect(c.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    o.stop(c.currentTime + dur);
  }
  function sfxOk() { beep(660, 0.08); setTimeout(() => beep(880, 0.1), 70); }
  function sfxBad() { beep(180, 0.25, "sawtooth", 0.06); setTimeout(() => beep(120, 0.3, "sawtooth", 0.05), 80); }
  function sfxTick() { beep(900, 0.03, "sine", 0.025); }
  function sfxGo() { beep(440, 0.1, "triangle", 0.05); setTimeout(() => beep(660, 0.12, "triangle", 0.05), 100); }

  function timeForLevel(lv) {
    if (lv <= 3) return 20;
    if (lv <= 10) return 15;
    if (lv <= 25) return 12;
    return 10;
  }

  const cv = $("cv");
  const g = cv.getContext("2d");
  function draw() {
    const W = cv.width, H = cv.height;
    g.fillStyle = "#0f2a1c"; g.fillRect(0, 0, W, H);
    const sky = g.createLinearGradient(0, 0, 0, H * 0.42);
    sky.addColorStop(0, "#0a1810"); sky.addColorStop(1, "#1a3d2a");
    g.fillStyle = sky; g.fillRect(0, 0, W, H * 0.42);
    const horizon = H * 0.42;
    const cx = W / 2 + (shake ? (Math.random() - 0.5) * shake * 20 : 0);
    const segs = 40;
    for (let i = segs; i >= 0; i--) {
      const p1 = i / segs, p2 = (i + 1) / segs;
      const y1 = horizon + (H - horizon) * Math.pow(p1, 1.55);
      const y2 = horizon + (H - horizon) * Math.pow(p2, 1.55);
      const w1 = 40 + (W * 0.72) * Math.pow(p1, 1.4);
      const w2 = 40 + (W * 0.72) * Math.pow(p2, 1.4);
      g.fillStyle = i % 2 ? "#1b4d32" : "#17452c";
      g.fillRect(0, y1, W, Math.max(1, y2 - y1));
      const roadAlt = Math.floor((offset * 0.15 + i) % 2);
      g.fillStyle = roadAlt ? "#2b2b2b" : "#333";
      g.beginPath();
      g.moveTo(cx - w1 / 2, y1); g.lineTo(cx + w1 / 2, y1);
      g.lineTo(cx + w2 / 2, y2); g.lineTo(cx - w2 / 2, y2);
      g.closePath(); g.fill();
      if (Math.floor(offset * 0.2 + i) % 3 === 0) {
        const mw1 = w1 * 0.03, mw2 = w2 * 0.03;
        g.fillStyle = "#f1c40f";
        g.beginPath();
        g.moveTo(cx - mw1, y1); g.lineTo(cx + mw1, y1);
        g.lineTo(cx + mw2, y2); g.lineTo(cx - mw2, y2);
        g.closePath(); g.fill();
      }
    }
    const myScore = Math.max(streak || 0, best || 0, (level - 1) * 5 + idx);
    const carY = H * 0.78 + (crash ? Math.sin(Date.now() / 30) * 8 : 0);
    const carX = cx + (crash ? Math.sin(Date.now() / 25) * 30 : 0);

    // Xe đối thủ phía trước (mốc cao hơn bạn)
    const ahead = (rivals || [])
      .filter(function (r) { return r.score > myScore; })
      .sort(function (a, b) { return a.score - b.score; }); // gần nhất trước
    for (let ri = 0; ri < ahead.length && ri < 5; ri++) {
      const r = ahead[ri];
      const gap = Math.max(1, r.score - myScore);
      // gap 1..12 hiện trên đường; càng lớn càng gần horizon
      if (gap > 14) continue;
      const depth = Math.min(1, gap / 12); // 0 gần, 1 xa
      const y = horizon + (carY - horizon) * (0.12 + 0.62 * (1 - depth));
      const scale = 0.35 + 0.55 * (1 - depth);
      const lane = ((ri % 3) - 1) * (28 + depth * 20);
      const x = cx + lane;
      g.save();
      g.translate(x, y);
      g.scale(scale, scale);
      // xe đối thủ
      g.fillStyle = ri % 2 ? "#60a5fa" : "#c084fc";
      g.fillRect(-28, -20, 56, 28);
      g.fillStyle = ri % 2 ? "#1e40af" : "#6b21a8";
      g.fillRect(-20, -36, 40, 18);
      g.fillStyle = "#111";
      g.fillRect(-30, 4, 14, 10);
      g.fillRect(16, 4, 14, 10);
      g.restore();
      // tên + mốc trên đầu xe
      const label = r.name + " · " + r.score;
      g.font = "bold " + Math.max(11, Math.floor(13 * (1.1 - depth * 0.3))) + "px system-ui,sans-serif";
      g.textAlign = "center";
      const tw = g.measureText(label).width;
      const lx = x, ly = y - 28 * scale - 8;
      g.fillStyle = "rgba(0,0,0,0.55)";
      g.fillRect(lx - tw / 2 - 6, ly - 12, tw + 12, 18);
      g.strokeStyle = "rgba(255,255,255,0.25)";
      g.strokeRect(lx - tw / 2 - 6, ly - 12, tw + 12, 18);
      g.fillStyle = "#ffe566";
      g.fillText(label, lx, ly + 1);
    }

    // Xe của bạn
    g.save(); g.translate(carX, carY);
    if (crash) g.rotate(Math.sin(Date.now() / 40) * 0.25);
    g.fillStyle = "#2ecc71"; g.fillRect(-36, -28, 72, 36);
    g.fillStyle = "#1abc9c"; g.fillRect(-28, -48, 56, 24);
    g.fillStyle = "#0e6655"; g.fillRect(-24, -44, 48, 14);
    g.fillStyle = "#111"; g.fillRect(-40, 4, 18, 12); g.fillRect(22, 4, 18, 12);
    g.restore();
    // Tên bạn trên đầu xe
    if (playerName) {
      const meLabel = playerName + " · " + myScore;
      g.font = "bold 13px system-ui,sans-serif";
      g.textAlign = "center";
      const tw = g.measureText(meLabel).width;
      const ly = carY - 58;
      g.fillStyle = "rgba(15,42,28,0.75)";
      g.fillRect(carX - tw / 2 - 6, ly - 12, tw + 12, 18);
      g.fillStyle = "#4ade80";
      g.fillText(meLabel, carX, ly + 1);
    }
    if (speed > 10) {
      g.strokeStyle = "rgba(255,255,255,0.12)"; g.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        const x = (i * 97 + offset * 3) % W;
        g.beginPath(); g.moveTo(x, H * 0.5); g.lineTo(x - 20, H); g.stroke();
      }
    }
  }
  function loop() {
    offset += speed * 0.35;
    speed += (targetSpeed - speed) * 0.08;
    if (crash > 0) { crash = Math.max(0, crash - 0.02); shake = crash; } else shake = 0;
    draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  function bestKey() {
    const base = mode === "rank" ? BEST_RANK : BEST_HOC;
    return claimToken ? (base + ":" + claimToken) : base;
  }
  function loadBest() {
    try { best = Number(localStorage.getItem(bestKey()) || 0) || 0; } catch { best = 0; }
    $("best").textContent = String(best);
  }
  function saveBest() {
    if (streak > best) {
      best = streak;
      try { localStorage.setItem(bestKey(), String(best)); } catch {}
      $("best").textContent = String(best);
      pushLeaderboard();
    }
  }

  function normalizeName(n) {
    return String(n || "").trim().replace(/\s+/g, " ").slice(0, 20);
  }

  function setNameGate(need) {
    const row = document.querySelector(".name-row");
    const gate = $("nameGateMsg");
    const start = $("start");
    if (row) row.classList.toggle("need-lock", !!need);
    if (gate) gate.style.display = need ? "block" : "none";
    if (start) {
      if (need) {
        start.textContent = "🔒 Đăng nhập để chơi";
        start.style.opacity = "0.85";
      } else if (!playing) {
        start.textContent = "Bắt đầu";
        start.style.opacity = "";
      }
    }
  }

  function setNameStatus(text, kind) {
    const el = $("nameStatus");
    if (!el) return;
    el.textContent = text || "";
    el.className = "name-status" + (kind ? " " + kind : "");
  }

  function accountName(user) {
    // Fallback only. V4 display name comes from profiles through race_sync_identity_v4().
    if (!user) return "";
    var md = user.user_metadata || {};
    var n = md.display_name || md.full_name || md.name || "";
    if (!n && user.email) n = String(user.email).split("@")[0];
    return normalizeName(String(n).replace(/@avp-app\.local$/i, ""));
  }

  async function currentRaceUser() {
    if (window.avpCloudSync && window.avpCloudSync.getUser) {
      try {
        var cloudUser = await window.avpCloudSync.getUser();
        if (cloudUser) return cloudUser;
      } catch (e) {}
    }

    // supabase-auth.js is a module and may finish after this deferred script.
    // Wait for the shared client instead of treating the first early check as logged-out.
    var sb = await ensureSupabase();
    if (!sb || !sb.auth) return null;

    for (var attempt = 0; attempt < 20; attempt++) {
      try {
        if (sb.auth.getSession) {
          var s = await sb.auth.getSession();
          var sessionUser = s && s.data && s.data.session && s.data.session.user;
          if (sessionUser) return sessionUser;
        }
        var r = await sb.auth.getUser();
        var user = r && r.data && r.data.user ? r.data.user : null;
        if (user) return user;
      } catch (e) {}
      await new Promise(function(resolve){ setTimeout(resolve, 150); });
    }
    return null;
  }

  async function loadLocalIdentity() {
    const input = $("playerName");
    const user = await currentRaceUser();

    if (!user) {
      playerName = "";
      claimToken = "";
      if (input) { input.value = ""; input.disabled = true; }
      setNameStatus("Chưa đăng nhập", "err");
      setNameGate(true);
      const startBtn = $("start");
      if (startBtn && !playing) startBtn.textContent = "🔒 Đăng nhập để chơi";
      return false;
    }

    // claimToken is now the authenticated user id in memory only.
    claimToken = user.id || "";

    // Old browser token is used ONLY to reconnect a legacy Race row.
    // It is not used to lock/change the current name.
    var oldLegacyToken = "";
    try { oldLegacyToken = localStorage.getItem("avp_excel_race_claim_token") || ""; } catch (e) {}

    const client = await ensureSupabase();
    var syncedName = "";

    if (client && client.rpc) {
      try {
        const res = await client.rpc("race_sync_identity_v4", {
          p_legacy_claim_token: oldLegacyToken || null
        });
        if (res && res.error) throw res.error;
        const payload = res && res.data ? res.data : null;
        syncedName = payload && payload.player_name ? String(payload.player_name) : "";
        if (payload && payload.claimed_legacy === true) {
          try {
            // Legacy token is no longer needed after successful ownership migration.
            localStorage.removeItem("avp_excel_race_claim_token");
            localStorage.removeItem("avp_excel_race_player_name");
          } catch (e) {}
        }
      } catch (e) {
        console.error("[race] identity sync v4", e);
      }
    }

    playerName = normalizeName(syncedName || accountName(user) || "Học viên");
    if (input) {
      input.value = playerName;
      input.disabled = true;
      input.readOnly = true;
    }

    setNameStatus("Đang chơi với tài khoản: " + playerName, "ok");
    setNameGate(false);
    const gate = $("nameGateMsg");
    if (gate) gate.style.display = "none";

    // Reload the per-account local best after identity is known.
    loadBest();
    return true;
  }

  async function claimName() {
    // V3: tên Race lấy duy nhất từ tài khoản Supabase.
    // Không còn ghi/đọc bảng race_leaderboard + claim_token cũ.
    var ok = await loadLocalIdentity();
    return !!ok;
  }

  let rankPushTimer = null;
  function scheduleRankPush(delay) {
    if (mode !== "rank") return;
    if (rankPushTimer) clearTimeout(rankPushTimer);
    rankPushTimer = setTimeout(function () { pushLeaderboard(); }, delay == null ? 120 : delay);
  }

  async function pushLeaderboard() {
    if (mode !== "rank") return false;

    var ready = await loadLocalIdentity();
    if (!ready || !playerName || !claimToken) return false;

    const client = await ensureSupabase();
    if (!client || !client.rpc) {
      if ($("msg")) $("msg").textContent = "Không kết nối được Supabase để lưu Rank.";
      return false;
    }

    try {
      const res = await client.rpc("race_submit_score_v4", {
        p_best_streak: Math.max(best || 0, streak || 0),
        p_best_level: Math.max(level || 1, 1)
      });
      if (res && res.error) throw res.error;

      // Một record từng bị ẩn vì chỉ chơi Học phải được bật lại
      // ngay khi người dùng có thành tích Rank thật.
      if ((Math.max(best || 0, streak || 0) > 0) || (Math.max(level || 1, 1) > 1)) {
        const activate = await client.rpc("race_rank_activate_v4");
        if (activate && activate.error) {
          console.error("[race] activate rank", activate.error);
          throw activate.error;
        }
      }

      const payload = res && res.data ? res.data : null;
      if (payload && payload.player_name) {
        playerName = normalizeName(payload.player_name);
        const input = $("playerName");
        if (input) input.value = playerName;
      }

      await loadBoard();
      return true;
    } catch (e) {
      console.error("[race] score v4", e);
      if ($("msg")) $("msg").textContent = "Không lưu được Rank: " + (e.message || "RPC lỗi");
      return false;
    }
  }

  async function loadBoard() {
    const list = $("boardList");
    if (!list) return;

    const client = await ensureSupabase();
    if (!client || !client.rpc) {
      list.innerHTML = '<li class="muted">Chưa kết nối Supabase.</li>';
      return;
    }

    try {
      const { data, error } = await client.rpc("race_list_leaderboard_v4", { p_limit: 100 });
      if (error) throw error;

      const rows = Array.isArray(data) ? data : [];

      // Chỉ hiển thị người đã có thành tích Rank thực sự.
      // Người chỉ chơi Học (0 chuỗi, cấp 1) không làm nhiễu BXH.
      const visibleRows = rows.filter(function(row) {
        if (!row || !row.player_name) return false;
        return (Number(row.best_streak) || 0) > 0 ||
               (Number(row.best_level) || 1) > 1;
      });

      if (!visibleRows.length) {
        list.innerHTML = '<li class="muted">Chưa có thành tích Rank nào.</li>';
        rivals = [];
        return;
      }

      rivals = visibleRows
        .filter(function(row) {
          return row && row.player_name && row.is_me !== true;
        })
        .map(function(row) {
          return {
            name: String(row.player_name),
            score: Math.max(Number(row.best_streak) || 0, (Number(row.best_level) || 1) * 5)
          };
        })
        .filter(function(r){ return r.score > 0; })
        .sort(function(a,b){ return b.score-a.score; })
        .slice(0,12);

      list.innerHTML = visibleRows.map(function(row, i) {
        const me = row.is_me === true ? " me" : "";
        const rankNo = Number(row.rank_no) || (i + 1);
        const legacy = row.is_legacy === true ? ' <small class="race-legacy">cũ</small>' : "";
        return '<li class="' + me + '">' + rankNo + '. <b>' + escapeBoard(row.player_name) +
          '</b>' + legacy + ' — chuỗi ' + (Number(row.best_streak)||0) +
          ' · cấp ' + (Number(row.best_level)||1) + '</li>';
      }).join("");

      list.insertAdjacentHTML("beforeend", '<li class="muted board-foot">Top 100 · người chơi cũ vẫn được giữ nguyên điểm</li>');
    } catch (e) {
      console.error("[race] loadBoard v4", e);
      list.innerHTML = '<li class="muted">BXH chưa tải được: ' + escapeBoard(e.message || "RPC lỗi") + '</li>';
    }
  }

  function escapeBoard(s) {
    return String(s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  async function ensureSupabase() {
    if (window.avpSupabase) return window.avpSupabase;
    const t0 = Date.now();
    while (Date.now() - t0 < 4000) {
      if (window.avpSupabase) return window.avpSupabase;
      if (window.AVP_SUPABASE_CONFIGURED === false) break;
      await new Promise((r) => setTimeout(r, 100));
    }
    if (window.avpSupabase) return window.avpSupabase;
    // Fallback: tạo client trực tiếp từ config (không cần supabase-auth.js)
    const cfg = window.AVP_SUPABASE_CONFIG || {};
    if (!cfg.url || !cfg.publishableKey) return null;
    if (!window.supabase || !window.supabase.createClient) {
      await new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
        s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
      }).catch(() => null);
    }
    if (window.supabase && window.supabase.createClient) {
      window.avpSupabase = window.supabase.createClient(cfg.url, cfg.publishableKey);
      return window.avpSupabase;
    }
    return null;
  }

  async function trackPlay(kind) {
    try {
      const client = await ensureSupabase();
      if (!client) {
        console.warn("[race] no supabase client");
        return;
      }
      const { error } = await client.from("race_plays").insert({
        event: kind || "start",
        level: level || 1,
        streak: streak || 0,
        best_streak: best || 0,
        mode: (mode || "hoc") + "-2.5d"
      });
      if (error) console.warn("[race] insert failed:", error.message || error);
      else console.log("[race] tracked", kind || "start");
    } catch (e) {
      console.warn("[race] trackPlay", e);
    }
  }

  function shuffle(a) {
    const x = a.slice();
    for (let i = x.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [x[i], x[j]] = [x[j], x[i]];
    }
    return x;
  }
  function pool(lv) {
    const p = all.filter((q) => q.lv === lv);
    if (p.length) return p;
    return all.slice((lv - 1) * PER, lv * PER);
  }

  function updateHint() {
    const h = $("hint"), link = $("hintLink");
    let pick = null;
    for (let i = HINTS.length - 1; i >= 0; i--) {
      if (streak >= HINTS[i].minStreak) { pick = HINTS[i]; break; }
    }
    if (!pick) { h.hidden = true; return; }
    link.textContent = pick.label;
    link.href = pick.href;
    h.hidden = false;
  }

  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
  function paintTimer(left) {
    const fill = $("fill");
    fill.style.width = Math.max(0, Math.min(100, (left / limitSec) * 100)) + "%";
    fill.classList.toggle("warn", left <= 8 && left > 5);
    fill.classList.toggle("danger", left <= 5);
    $("sec").textContent = String(Math.max(0, Math.ceil(left)));
  }
  function startTimer() {
    stopTimer();
    limitSec = timeForLevel(level);
    endsAt = Date.now() + limitSec * 1000;
    paintTimer(limitSec);
    let lastSec = limitSec;
    timerId = setInterval(() => {
      const left = (endsAt - Date.now()) / 1000;
      const sec = Math.ceil(left);
      if (sec < lastSec && sec <= 5 && sec > 0) sfxTick();
      lastSec = sec;
      paintTimer(left);
      if (left <= 0) {
        stopTimer();
        if (!playing || locked) return;
        locked = true;
        $("msg").textContent = "Hết giờ!";
        onWrong("timeout");
      }
    }, 100);
  }

  function hud() {
    $("lv").textContent = String(level);
    $("pg").textContent = idx + "/" + Math.min(PER, inLevel.length || PER);
    $("st").textContent = String(streak);
    $("lives").textContent = mode === "hoc" ? "∞" : String(lives);
  }

  function showQ() {
    locked = false;
    if (idx >= inLevel.length) {
      level += 1;
      idx = 0;
      inLevel = shuffle(pool(level));
      trackPlay("level_up"); if (mode === "rank") scheduleRankPush(50);
      if (!inLevel.length) {
        stopTimer(); playing = false; targetSpeed = 0;
        $("msg").textContent = "Hết ngân hàng 2000 câu — quá đỉnh!";
        $("q").hidden = true; $("ans").hidden = true;
        $("start").hidden = false; $("start").textContent = "Chơi lại"; showStopBtn(false);
        return;
      }
      $("msg").textContent = "Lên cấp " + level + "! (" + timeForLevel(level) + "s/câu)";
    }
    const q = inLevel[idx];
    $("q").textContent = q.q; $("q").hidden = false; $("ans").hidden = false;
    const flip = Math.random() < 0.5;
    const L = flip ? { t: q.b, k: "b" } : { t: q.a, k: "a" };
    const R = flip ? { t: q.a, k: "a" } : { t: q.b, k: "b" };
    $("a1").textContent = L.t; $("a1").dataset.key = L.k; $("a1").className = "";
    $("a2").textContent = R.t; $("a2").dataset.key = R.k; $("a2").className = "";
    hud(); updateHint(); startTimer();
  }

  function softResetLevel() {
    // Học: về đầu cấp hiện tại, giữ level & streak một phần? — giữ streak = 0 trong cấp nhưng level same
    idx = 0;
    inLevel = shuffle(pool(level));
    targetSpeed = Math.max(4, targetSpeed * 0.5);
    $("msg").textContent = "Sai — làm lại từ đầu cấp " + level + ".";
    hud();
    setTimeout(showQ, 500);
  }

  function hardReset() {
    level = 1; idx = 0; streak = 0; lives = 3;
    inLevel = shuffle(pool(1));
    targetSpeed = 0; speed = 0;
    $("msg").textContent = "Về cấp 1 — câu đã xáo.";
    updateHint(); hud();
    setTimeout(showQ, 500);
  }

  function onWrong(reason) {
    locked = true;
    stopTimer();
    sfxBad();
    const wrongBtn = document.querySelector(".ans button.bad");
    raceFlash("bad", wrongBtn);
    // Giữ nguyên hiệu ứng rung/lắc canvas gốc.
    crash = 1;
    trackPlay(reason === "timeout" ? "timeout" : "crash");
    if (mode === "hoc") {
      // chỉ về đầu cấp, không mất level
      setTimeout(() => { crash = 0; softResetLevel(); }, 760);
      return;
    }
    // Rank: 3 mạng
    lives -= 1;
    hud();
    if (lives > 0) {
      $("msg").textContent = "Mất 1 mạng — còn " + lives + ".";
      idx = 0;
      inLevel = shuffle(pool(level));
      setTimeout(() => { crash = 0; showQ(); }, 760);
    } else {
      $("msg").textContent = "Hết mạng — về cấp 1.";
      setTimeout(() => { crash = 0; hardReset(); }, 760);
    }
  }


  function raceFlash(kind, btn) {
    const ok = kind === "ok";
    const panel = document.querySelector(".panel");
    const wrap = document.querySelector(".race-wrap");

    if (btn) {
      btn.classList.remove("race-answer-ok-fx", "race-answer-bad-fx");
      void btn.offsetWidth;
      btn.classList.add(ok ? "race-answer-ok-fx" : "race-answer-bad-fx");
    }

    if (panel) {
      panel.classList.remove("race-panel-ok-fx", "race-panel-bad-fx");
      void panel.offsetWidth;
      panel.classList.add(ok ? "race-panel-ok-fx" : "race-panel-bad-fx");
    }

    if (!ok && wrap) {
      wrap.classList.remove("race-screen-shake");
      void wrap.offsetWidth;
      wrap.classList.add("race-screen-shake");
      try {
        if (navigator.vibrate) navigator.vibrate([70, 35, 70]);
      } catch (e) {}
    }

    const pop = document.createElement("div");
    pop.className = "race-answer-pop " + (ok ? "ok" : "bad");
    pop.innerHTML = ok
      ? '<span>✓</span><b>ĐÚNG</b>'
      : '<span>×</span><b>SAI</b>';
    document.body.appendChild(pop);
    requestAnimationFrame(function(){ pop.classList.add("show"); });

    setTimeout(function(){
      pop.remove();
      if (btn) btn.classList.remove("race-answer-ok-fx", "race-answer-bad-fx");
      if (panel) panel.classList.remove("race-panel-ok-fx", "race-panel-bad-fx");
      if (wrap) wrap.classList.remove("race-screen-shake");
    }, ok ? 620 : 760);
  }

  function answer(btn) {
    if (!playing || locked) return;
    locked = true;
    stopTimer();
    const q = inLevel[idx];
    const ok = btn.dataset.key === q.c;
    btn.className = ok ? "ok" : "bad";
    if (ok) {
      sfxOk();
      raceFlash("ok", btn);
      streak += 1; saveBest(); idx += 1;
      if (mode === "rank") scheduleRankPush(80);
      targetSpeed = Math.min(26, 6 + streak * 0.4);
      $("msg").textContent = "Đúng!";
      hud(); updateHint();
      setTimeout(showQ, 560);
    } else {
      const other = btn.id === "a1" ? $("a2") : $("a1");
      other.className = "ok";
      onWrong("wrong");
    }
  }

  function setMode(m) {
    if (playing) return;
    mode = m;
    loadBest();
    $("lives").textContent = m === "hoc" ? "∞" : "3";
    $("msg").textContent = m === "hoc"
      ? "Mode Học: sai / hết giờ → làm lại từ đầu cấp hiện tại."
      : "Mode Rank: 3 mạng — sai mất 1 mạng và về đầu cấp hiện tại.";
    if (m === "rank") {
      loadLocalIdentity().then(function(){ loadBoard(); });
    }
  }

  

  function closeRaceModeChooser() {
    const modal = $("raceModeChooser");
    if (modal) modal.hidden = true;
    document.body.classList.remove("race-mode-open");
  }

  async function openRaceModeChooser() {
    if (playing) return;

    const ready = await loadLocalIdentity();
    if (!ready || !playerName || !claimToken) {
      $("msg").textContent = "Đăng nhập để chơi Race.";
      if (typeof setNameStatus === "function") setNameStatus("Cần đăng nhập", "err");
      setNameGate(true);
      location.href = "auth.html?next=" + encodeURIComponent("excel-race.html");
      return;
    }

    const modal = $("raceModeChooser");
    if (!modal) {
      start();
      return;
    }

    modal.hidden = false;
    document.body.classList.add("race-mode-open");
  }

  function chooseRaceModeAndStart(nextMode) {
    // Mở AudioContext ngay trong thao tác chạm của người dùng.
    // Nếu để sau các await, iOS/Safari có thể chặn toàn bộ âm thanh.
    try {
      const c = ctx();
      if (c && c.state === "suspended") c.resume();
      // phát âm cực nhỏ để "unlock" audio, gần như không nghe thấy
      if (c) beep(40, 0.015, "sine", 0.001);
    } catch (e) {}

    closeRaceModeChooser();
    setMode(nextMode);
    start();
  }

  function stopRace() {
    if (!playing && !$("countOverlay")?.hidden === false) {
      // allow stop during countdown
    }
    const overlay = $("countOverlay");
    if (overlay) overlay.hidden = true;
    stopTimer();
    playing = false;
    locked = false;
    targetSpeed = 0;
    speed = 0;
    crash = 0;
    $("q").hidden = true;
    $("ans").hidden = true;
    $("start").hidden = false;
    $("start").textContent = "Bắt đầu";
    if ($("stopRace")) $("stopRace").hidden = true;
    const row = document.querySelector(".race-go-row");
    if (row) row.classList.remove("has-stop");
    $("msg").textContent = mode === "rank"
      ? "Đã dừng. Mode RANK — bấm Bắt đầu để đua tiếp."
      : "Đã dừng. Mode Học — bấm Bắt đầu để luyện tiếp.";
    if (mode === "rank") pushLeaderboard();
    trackPlay("stop");
  }

  function showStopBtn(on) {
    const b = $("stopRace");
    const row = document.querySelector(".race-go-row");
    if (b) b.hidden = !on;
    if (row) row.classList.toggle("has-stop", !!on);
  }

  function startCountdownThen(run) {
    const overlay = $("countOverlay");
    const num = $("countNum");
    if (!overlay || !num) { run(); return; }
    let n = 3;
    overlay.hidden = false;
    num.textContent = String(n);
    $("msg").textContent = mode === "rank" ? "Rank — sẵn sàng đua!" : "Chuẩn bị…";
    $("start").hidden = true;
    showStopBtn(true);
    try { ctx(); } catch (e) {}
    function beepCount(step) {
      // 3→ low, 2→ mid, 1→ high, GO→ chord-ish
      const map = { 3: 523.25, 2: 659.25, 1: 783.99, 0: 1046.5 };
      const f = map[step] || 880;
      try { beep(f, step === 0 ? 0.22 : 0.12, step === 0 ? "triangle" : "square", step === 0 ? 0.07 : 0.05); } catch (e) {}
      if (step === 0) {
        try { setTimeout(function(){ beep(1318.5, 0.18, "triangle", 0.05); }, 90); } catch (e) {}
      }
    }
    beepCount(3);
    const tick = () => {
      if (n > 1) {
        n -= 1;
        num.textContent = String(n);
        num.style.animation = "none";
        void num.offsetWidth;
        num.style.animation = "";
        beepCount(n);
        setTimeout(tick, 700);
      } else {
        num.textContent = "GO!";
        beepCount(0);
        setTimeout(() => {
          overlay.hidden = true;
          run();
        }, 450);
      }
    };
    setTimeout(tick, 700);
  }

  async function start() {
    var ready = await loadLocalIdentity();
    if (!ready || !playerName || !claimToken) {
      $("msg").textContent = "Đăng nhập để chơi Race.";
      if (typeof setNameStatus === "function") setNameStatus("Cần đăng nhập", "err");
      setNameGate(true);
      location.href = "auth.html?next=" + encodeURIComponent("excel-race.html");
      return;
    }
    all = (window.EXCEL_RACE_QUESTIONS || []).slice();
    if (!all.length) { $("msg").textContent = "Thiếu excel-race-questions.js"; return; }

    startCountdownThen(function () {
      ctx();
      stopTimer();
      playing = true;
      level = 1; idx = 0; streak = 0; lives = 3;
      inLevel = shuffle(pool(1));
      targetSpeed = 5; speed = 3;
      $("start").hidden = true;
      showStopBtn(true);
      $("msg").textContent = "Xuất phát!";
      trackPlay("start");
      if (mode === "rank") scheduleRankPush(20);
      updateHint();
      showQ();
    });
  }
  $("start").onclick = openRaceModeChooser;

  if ($("chooseModeHoc")) {
    $("chooseModeHoc").onclick = () => chooseRaceModeAndStart("hoc");
  }

  if ($("chooseModeRank")) {
    $("chooseModeRank").onclick = () => chooseRaceModeAndStart("rank");
  }

  if ($("raceModeClose")) {
    $("raceModeClose").onclick = closeRaceModeChooser;
  }

  document.querySelectorAll("[data-race-mode-close]").forEach(el => {
    el.addEventListener("click", closeRaceModeChooser);
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !$("raceModeChooser")?.hidden) {
      closeRaceModeChooser();
    }
  });
  if ($("stopRace")) $("stopRace").onclick = () => {
    avpConfirm("Dừng cuộc đua hiện tại?\nĐiểm Rank (nếu có) vẫn được lưu khi cao hơn kỷ lục.", {
      title: "Dừng đua?",
      icon: "⏹",
      tone: "warn",
      ok: "Dừng",
      cancel: "Chơi tiếp"
    }).then(function (ok) { if (ok) stopRace(); });
  };
  $("a1").onclick = () => answer($("a1"));
  $("a2").onclick = () => answer($("a2"));
  if ($("nameSave")) $("nameSave").style.display = "none";
  if ($("boardRefresh")) $("boardRefresh").onclick = () => { loadBoard(); };
  if ($("boardJump")) $("boardJump").onclick = () => {
    const el = $("board");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    loadBoard();
  };
  // Mobile: tải lại BXH sau khi layout ổn
  setTimeout(function(){ if (typeof loadBoard === "function") loadBoard(); }, 800);
  setTimeout(function(){ if (typeof loadBoard === "function") loadBoard(); }, 2000);
  if ($("resetLocalBest")) $("resetLocalBest").onclick = async () => {
    const ok = await avpConfirm(
      "Bạn sắp đưa chuỗi / kỷ lục về 0.\n\n• Xóa điểm trên máy này\n• Xóa điểm của bạn trên bảng xếp hạng (nếu đã khóa tên)\n\nKhông ảnh hưởng bài học hay tài khoản đăng nhập.",
      {
        title: "Reset điểm đua?",
        icon: "📉",
        tone: "warn",
        ok: "Reset về 0",
        cancel: "Giữ nguyên"
      }
    );
    if (!ok) return;
    try {
      localStorage.setItem(BEST_HOC, "0");
      localStorage.setItem(BEST_RANK, "0");
      if (claimToken) {
        localStorage.setItem(BEST_HOC + ":" + claimToken, "0");
        localStorage.setItem(BEST_RANK + ":" + claimToken, "0");
      }
    } catch (e) {}
    best = 0; streak = 0;
    if ($("best")) $("best").textContent = "0";
    if ($("st")) $("st").textContent = "0";
    if (playerName) {
      const client = await ensureSupabase();
      if (client?.rpc) {
        const { error } = await client.rpc("race_reset_my_score_v4");
        if (error) console.warn("[race] reset v4", error);
      }
    }
    loadBoard();
    $("msg").textContent = "Đã reset điểm đua.";
    avpAlert("Điểm đua đã về 0. Bạn có thể bắt đầu lại từ đầu!", {
      title: "Đã reset",
      icon: "✅",
      tone: "ok"
    });
  };
  if ($("playerName")) {
    $("playerName").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); claimName(); }
    });
  }
  loadLocalIdentity();
  // Retry identity after auth boot; harmless if already loaded.
  setTimeout(function(){ loadLocalIdentity(); }, 900);
  setTimeout(function(){ loadLocalIdentity(); }, 2200);
  loadBoard();
  setInterval(function () { if (typeof loadBoard === "function") loadBoard(); }, 20000);
  mode = "hoc";
  loadBest();
  $("lives").textContent = "∞";
})();
