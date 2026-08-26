(() => {
  const PER = 30;
  const BEST_HOC = "avp_excel_race_best_hoc";
  const BEST_RANK = "avp_excel_race_best_rank";
  const NAME_KEY = "avp_excel_race_player_name";
  const TOKEN_KEY = "avp_excel_race_claim_token";
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

  function bestKey() { return mode === "rank" ? BEST_RANK : BEST_HOC; }
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
        start.textContent = "🔒 Khóa tên để bắt đầu";
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

  function loadLocalIdentity() {
    try {
      playerName = normalizeName(localStorage.getItem(NAME_KEY) || "");
      claimToken = localStorage.getItem(TOKEN_KEY) || "";
    } catch {
      playerName = "";
      claimToken = "";
    }
    const input = $("playerName");
    if (input && playerName) {
      input.value = playerName;
      input.disabled = true;
    }
    if (playerName && claimToken) {
      setNameStatus("Tên đã khóa: " + playerName, "ok");
      setNameGate(false);
    } else {
      setNameGate(true);
    }
  }

  async function claimName() {
    const input = $("playerName");
    const name = normalizeName(input ? input.value : "");
    if (name.length < 2) {
      setNameStatus("Tên tối thiểu 2 ký tự", "err");
      return false;
    }
    if (!/^[\p{L}\p{N} _.-]+$/u.test(name)) {
      setNameStatus("Tên chỉ gồm chữ, số, khoảng trắng, . _ -", "err");
      return false;
    }
    // already claimed this browser
    if (playerName && claimToken && playerName.toLowerCase() === name.toLowerCase()) {
      setNameStatus("Đang dùng: " + playerName, "ok");
      if (input) input.disabled = true;
      return true;
    }
    if (playerName && claimToken && playerName.toLowerCase() !== name.toLowerCase()) {
      setNameStatus("Máy này đã khóa tên \"" + playerName + "\". Xóa dữ liệu site để đổi.", "err");
      if (input) { input.value = playerName; input.disabled = true; }
      return false;
    }

    const token = (crypto.randomUUID && crypto.randomUUID()) ||
      (String(Date.now()) + "-" + Math.random().toString(16).slice(2));

    const client = await ensureSupabase();
    if (!client) {
      // offline fallback: local only
      playerName = name;
      claimToken = token;
      try {
        localStorage.setItem(NAME_KEY, playerName);
        localStorage.setItem(TOKEN_KEY, claimToken);
      } catch {}
      if (input) input.disabled = true;
      setNameStatus("Đã khóa (offline): " + playerName, "ok");
      setNameGate(false);
      return true;
    }

    const { error } = await client.from("race_leaderboard").insert({
      player_name: name,
      claim_token: token,
      best_streak: 0,
      best_level: 1
    });
    if (error) {
      const msg = (error.message || "") + (error.code || "");
      if (/duplicate|unique|23505/i.test(msg) || error.code === "23505") {
        setNameStatus("Tên \"" + name + "\" đã có người dùng", "err");
      } else {
        setNameStatus("Lỗi khóa tên: " + (error.message || "thử lại"), "err");
        console.warn(error);
      }
      return false;
    }
    playerName = name;
    claimToken = token;
    try {
      localStorage.setItem(NAME_KEY, playerName);
      localStorage.setItem(TOKEN_KEY, claimToken);
    } catch {}
    if (input) input.disabled = true;
    setNameStatus("Đã khóa: " + playerName, "ok");
    setNameGate(false);
    loadBoard();
    return true;
  }

  async function pushLeaderboard() {
    // Chỉ mode Rank mới ghi bảng xếp hạng
    if (mode !== "rank") return;
    if (!playerName || !claimToken) return;
    const client = await ensureSupabase();
    if (!client) return;
    try {
      // only update if token matches; only increase scores
      const { data, error } = await client
        .from("race_leaderboard")
        .select("best_streak,best_level,claim_token")
        .eq("player_name", playerName)
        .maybeSingle();
      if (error) { console.warn("[race] board read", error); return; }
      if (!data || data.claim_token !== claimToken) return;
      const nextStreak = Math.max(Number(data.best_streak) || 0, best || 0, streak || 0);
      const nextLevel = Math.max(Number(data.best_level) || 1, level || 1);
      if (nextStreak === data.best_streak && nextLevel === data.best_level) return;
      const { error: upErr } = await client
        .from("race_leaderboard")
        .update({
          best_streak: nextStreak,
          best_level: nextLevel,
          updated_at: new Date().toISOString()
        })
        .eq("player_name", playerName)
        .eq("claim_token", claimToken);
      if (upErr) console.warn("[race] board update", upErr);
      else loadBoard();
    } catch (e) {
      console.warn("[race] pushLeaderboard", e);
    }
  }

  async function loadBoard() {
    const list = $("boardList");
    if (!list) return;
    const client = await ensureSupabase();
    if (!client) {
      list.innerHTML = '<li class="muted">Chưa kết nối Supabase — chạy SQL leaderboard.</li>';
      return;
    }
    try {
      const { data, error } = await client
        .from("race_leaderboard")
        .select("player_name,best_streak,best_level,updated_at")
        .order("best_streak", { ascending: false })
        .order("best_level", { ascending: false })
        .limit(100); // Top 100 BXH Race
      if (error) {
        list.innerHTML = '<li class="muted">Lỗi tải BXH: ' + (error.message || "cần tạo bảng") + "</li>";
        return;
      }
      if (!data || !data.length) {
        list.innerHTML = '<li class="muted">Chưa có ai trên BXH — bạn sẽ là người đầu.</li>';
        rivals = [];
        return;
      }
      const rows = data.slice(0, 100);
      rivals = rows
        .filter(function (row) {
          return row && row.player_name && (!playerName || row.player_name !== playerName);
        })
        .map(function (row) {
          return {
            name: String(row.player_name),
            score: Math.max(Number(row.best_streak) || 0, (Number(row.best_level) || 1) * 5)
          };
        })
        .filter(function (r) { return r.score > 0; })
        .sort(function (a, b) { return b.score - a.score; })
        .slice(0, 12);
      list.innerHTML = rows.map(function (row, i) {
        const me = playerName && row.player_name === playerName ? " me" : "";
        return '<li class="' + me + '">' + (i + 1) + ". <b>" + escapeBoard(row.player_name) +
          "</b> — chuỗi " + row.best_streak + " · cấp " + row.best_level + "</li>";
      }).join("");
      list.insertAdjacentHTML("beforeend", '<li class="muted board-foot">Top 100 · cuộn để xem thêm</li>');
    } catch (e) {
      list.innerHTML = '<li class="muted">Không tải được BXH.</li>';
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
      trackPlay("level_up"); pushLeaderboard();
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
    crash = 1;
    trackPlay(reason === "timeout" ? "timeout" : "crash");
    if (mode === "hoc") {
      // chỉ về đầu cấp, không mất level
      setTimeout(() => { crash = 0; softResetLevel(); }, 700);
      return;
    }
    // Rank: 3 mạng
    lives -= 1;
    hud();
    if (lives > 0) {
      $("msg").textContent = "Mất 1 mạng — còn " + lives + ".";
      idx = 0;
      inLevel = shuffle(pool(level));
      setTimeout(() => { crash = 0; showQ(); }, 700);
    } else {
      $("msg").textContent = "Hết mạng — về cấp 1.";
      setTimeout(() => { crash = 0; hardReset(); }, 700);
    }
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
      streak += 1; saveBest(); idx += 1;
      targetSpeed = Math.min(26, 6 + streak * 0.4);
      $("msg").textContent = "Đúng!";
      hud(); updateHint();
      setTimeout(showQ, 280);
    } else {
      const other = btn.id === "a1" ? $("a2") : $("a1");
      other.className = "ok";
      onWrong("wrong");
    }
  }

  function setMode(m) {
    if (playing) return;
    mode = m;
    $("modeHoc").classList.toggle("active", m === "hoc");
    $("modeRank").classList.toggle("active", m === "rank");
    loadBest();
    $("lives").textContent = m === "hoc" ? "∞" : "3";
    $("msg").textContent = m === "hoc"
      ? "Mode Học: sai / hết giờ → làm lại từ đầu cấp hiện tại."
      : "Mode Rank: 3 mạng — hết mạng về cấp 1. Khó hơn, kỷ lục riêng.";
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
    if ($("modeHoc")) $("modeHoc").disabled = false;
    if ($("modeRank")) $("modeRank").disabled = false;
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

  function start() {
    if (typeof playerName !== "undefined" && (!playerName || !claimToken)) {
      $("msg").textContent = "Hãy nhập tên và bấm Khóa tên trước khi chơi.";
      if (typeof setNameStatus === "function") setNameStatus("Cần khóa tên trước", "err");
      setNameGate(true);
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
      if ($("modeHoc")) $("modeHoc").disabled = true;
      if ($("modeRank")) $("modeRank").disabled = true;
      $("msg").textContent = "Xuất phát!";
      trackPlay("start");
      if (typeof pushLeaderboard === "function") pushLeaderboard();
      updateHint();
      showQ();
    });
  }

  $("modeHoc").onclick = () => setMode("hoc");
  $("modeRank").onclick = () => setMode("rank");
  $("start").onclick = start;
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
  if ($("nameSave")) $("nameSave").onclick = () => { claimName(); };
  if ($("boardRefresh")) $("boardRefresh").onclick = () => { loadBoard(); };
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
    } catch (e) {}
    best = 0; streak = 0;
    if ($("best")) $("best").textContent = "0";
    if ($("st")) $("st").textContent = "0";
    if (playerName && claimToken) {
      const client = await ensureSupabase();
      if (client) {
        await client.from("race_leaderboard").update({
          best_streak: 0, best_level: 1, updated_at: new Date().toISOString()
        }).eq("player_name", playerName).eq("claim_token", claimToken);
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
  loadBoard();
  setInterval(function () { if (typeof loadBoard === "function") loadBoard(); }, 20000);
  setMode("hoc");
})();
