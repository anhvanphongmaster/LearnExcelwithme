(() => {
  const PER = 30;
  const BEST_HOC = "avp_excel_race_best_hoc";
  const BEST_RANK = "avp_excel_race_best_rank";
  const $ = (id) => document.getElementById(id);

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
    const carY = H * 0.78 + (crash ? Math.sin(Date.now() / 30) * 8 : 0);
    const carX = cx + (crash ? Math.sin(Date.now() / 25) * 30 : 0);
    g.save(); g.translate(carX, carY);
    if (crash) g.rotate(Math.sin(Date.now() / 40) * 0.25);
    g.fillStyle = "#2ecc71"; g.fillRect(-36, -28, 72, 36);
    g.fillStyle = "#1abc9c"; g.fillRect(-28, -48, 56, 24);
    g.fillStyle = "#0e6655"; g.fillRect(-24, -44, 48, 14);
    g.fillStyle = "#111"; g.fillRect(-40, 4, 18, 12); g.fillRect(22, 4, 18, 12);
    g.restore();
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
    }
  }

  async function waitSupabase(ms) {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      if (window.avpSupabase) return window.avpSupabase;
      if (window.AVP_SUPABASE_CONFIGURED === false) return null;
      await new Promise((r) => setTimeout(r, 80));
    }
    return window.avpSupabase || null;
  }

  async function trackPlay(kind) {
    try {
      const client = await waitSupabase(5000);
      if (!client) return;
      const { error } = await client.from("race_plays").insert({
        event: kind || "start",
        level: level || 1,
        streak: streak || 0,
        best_streak: best || 0,
        mode: (mode || "hoc") + "-2.5d"
      });
      if (error) console.warn("[race] insert failed:", error.message || error);
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
      trackPlay("level_up");
      if (!inLevel.length) {
        stopTimer(); playing = false; targetSpeed = 0;
        $("msg").textContent = "Hết ngân hàng 2000 câu — quá đỉnh!";
        $("q").hidden = true; $("ans").hidden = true;
        $("start").hidden = false; $("start").textContent = "Chơi lại";
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

  function start() {
    all = (window.EXCEL_RACE_QUESTIONS || []).slice();
    if (!all.length) { $("msg").textContent = "Thiếu excel-race-questions.js"; return; }
    ctx(); sfxGo();
    stopTimer();
    playing = true;
    level = 1; idx = 0; streak = 0; lives = 3;
    inLevel = shuffle(pool(1));
    targetSpeed = 5; speed = 3;
    $("start").hidden = true;
    $("modeHoc").disabled = true;
    $("modeRank").disabled = true;
    $("msg").textContent = "Xuất phát!";
    trackPlay("start");
    updateHint();
    showQ();
  }

  $("modeHoc").onclick = () => setMode("hoc");
  $("modeRank").onclick = () => setMode("rank");
  $("start").onclick = start;
  $("a1").onclick = () => answer($("a1"));
  $("a2").onclick = () => answer($("a2"));
  setMode("hoc");
})();
