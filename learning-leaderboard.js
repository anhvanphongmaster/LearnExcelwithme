/**
 * Learning leaderboard — streak đăng nhập (chỉ user đã login, ẩn admin)
 */
(function () {
  const VISIT_KEY = "avp_visit_days_v1";
  const XP_KEY = "avp_xp_v2";

  function $(id) { return document.getElementById(id); }

  function todayStr() {
    const d = new Date();
    const z = (n) => String(n).padStart(2, "0");
    // local date YYYY-MM-DD
    return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate());
  }

  function getVisits() {
    try {
      const v = JSON.parse(localStorage.getItem(VISIT_KEY) || "[]");
      return Array.isArray(v) ? v : [];
    } catch (e) {
      return [];
    }
  }

  function trackToday() {
    const t = todayStr();
    let v = getVisits();
    if (!v.includes(t)) {
      v.push(t);
      v = v.slice(-120);
      try { localStorage.setItem(VISIT_KEY, JSON.stringify(v)); } catch (e) {}
    }
    return v;
  }

  function calcStreak(days) {
    const set = new Set(days);
    let n = 0;
    const d = new Date();
    for (;;) {
      const s = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      if (set.has(s)) {
        n++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return n;
  }

  function getXp() {
    const n = parseInt(localStorage.getItem(XP_KEY) || "0", 10);
    return isNaN(n) ? 0 : n;
  }

  function badge(streak) {
    if (streak >= 30) return "🔥 30 ngày";
    if (streak >= 7) return "⚡ 7 ngày";
    if (streak >= 3) return "✨ 3 ngày";
    return "";
  }


  function medal(rank) {
    if (rank === 1) return '<span class="lb-medal lb-gold" title="Top 1">🥇</span>';
    if (rank === 2) return '<span class="lb-medal lb-silver" title="Top 2">🥈</span>';
    if (rank === 3) return '<span class="lb-medal lb-bronze" title="Top 3">🥉</span>';
    return "";
  }

  function podiumTitle(rank) {
    if (rank === 1) return '<em class="lb-title lb-title-1">Ngọn lửa bền</em>';
    if (rank === 2) return '<em class="lb-title lb-title-2">Siêng năng</em>';
    if (rank === 3) return '<em class="lb-title lb-title-3">Đều đặn</em>';
    return "";
  }

  function extraTags(r, rank) {
    if (rank <= 3) return "";
    const xp = Number(r.xp) || 0;
    const days = Number(r.total_days) || 0;
    const bits = [];
    if (xp > 0) bits.push('<em class="lb-tag">XP ' + xp + "</em>");
    else bits.push('<em class="lb-tag lb-tag-muted">XP Quiz — đang tích lũy</em>');
    if (days > 0) bits.push('<em class="lb-tag">📅 ' + days + " ngày học</em>");
    return '<span class="lb-tags">' + bits.join("") + "</span>";
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function waitSupabase(ms) {
    const t0 = Date.now();
    while (Date.now() - t0 < (ms || 4000)) {
      if (window.avpSupabase) return window.avpSupabase;
      if (window.AVP_SUPABASE_CONFIGURED === false) return null;
      await new Promise((r) => setTimeout(r, 80));
    }
    return window.avpSupabase || null;
  }

  async function getUser() {
    if (window.avpCloudSync && window.avpCloudSync.getUser) {
      try { return await window.avpCloudSync.getUser(); } catch (e) {}
    }
    const sb = await waitSupabase(2000);
    if (!sb) return null;
    try {
      const { data } = await sb.auth.getUser();
      return data && data.user ? data.user : null;
    } catch (e) {
      return null;
    }
  }

  async function isAdmin(sb) {
    try {
      const { data, error } = await sb.rpc("is_admin_user");
      if (!error && data === true) return true;
    } catch (e) {}
    return false;
  }

  async function displayName(sb, user) {
    try {
      if (window.avpCloudSync && window.avpCloudSync.getProfile) {
        const p = await window.avpCloudSync.getProfile(user);
        if (p && (p.display_name || p.name)) return p.display_name || p.name;
      }
      const { data } = await sb.from("profiles").select("display_name,name").eq("id", user.id).maybeSingle();
      if (data && (data.display_name || data.name)) return data.display_name || data.name;
    } catch (e) {}
    const email = user.email || "";
    if (email) return email.split("@")[0];
    return "Học viên";
  }

  async function pushScore(sb, user) {
    if (await isAdmin(sb)) return; // admin không vào BXH

    const visits = trackToday();
    const streak = calcStreak(visits);
    const totalDays = visits.length;
    const xp = getXp();
    const name = await displayName(sb, user);

    const row = {
      user_id: user.id,
      display_name: String(name).slice(0, 40),
      current_streak: streak,
      best_streak: streak, // server can max() on upsert via RPC; client sends current
      total_days: totalDays,
      xp: xp,
      updated_at: new Date().toISOString()
    };

    // Prefer RPC (handles best_streak max + admin skip)
    try {
      const { error } = await sb.rpc("upsert_learning_leaderboard", {
        p_display_name: row.display_name,
        p_current_streak: row.current_streak,
        p_total_days: row.total_days,
        p_xp: row.xp
      });
      if (!error) return;
      console.warn("[learn-board] rpc", error.message || error);
    } catch (e) {
      console.warn("[learn-board] rpc missing?", e);
    }

    // Fallback direct upsert
    try {
      const { data: old } = await sb
        .from("learning_leaderboard")
        .select("best_streak")
        .eq("user_id", user.id)
        .maybeSingle();
      row.best_streak = Math.max(Number(old && old.best_streak) || 0, streak);
      const { error } = await sb.from("learning_leaderboard").upsert(row, { onConflict: "user_id" });
      if (error) console.warn("[learn-board] upsert", error.message || error);
    } catch (e) {
      console.warn("[learn-board] upsert fail", e);
    }
  }

  async function loadBoard() {
    const list = $("learnBoardList");
    const note = $("learnBoardNote");
    if (!list) return;

    const sb = await waitSupabase(4000);
    if (!sb) {
      list.innerHTML = '<li class="lb-muted">Chưa có xếp hạng.</li>';
      return;
    }

    let rows = [];
    try {
      const { data, error } = await sb.rpc("list_learning_leaderboard");
      if (!error && Array.isArray(data)) rows = data;
      if (!rows.length || rows.length < 30) {
        const res = await sb
          .from("learning_leaderboard")
          .select("display_name,current_streak,best_streak,total_days,xp")
          .order("current_streak", { ascending: false })
          .order("xp", { ascending: false })
          .limit(30); // Top 30
        if (res.error) {
          list.innerHTML = '<li class="lb-muted">Chưa có dữ liệu xếp hạng.</li>';
          return;
        }
        rows = res.data || [];
      }
    } catch (e) {
      list.innerHTML = '<li class="lb-muted">Chưa có xếp hạng.</li>';
      return;
    }

    if (!rows.length) {
      list.innerHTML = '<li class="lb-muted">Chưa có xếp hạng.</li>';
      return;
    }

    rows = rows.slice(0, 30);

    list.classList.add("lb-clip3");
    list.innerHTML = rows.map(function (r, i) {
      const st = Number(r.current_streak) || 0;
      const b = badge(st);
      return (
        '<li class="lb-row' + (i < 3 ? " lb-podium-" + (i + 1) : "") + '">' +
          '<span class="lb-rank">' + medal(i + 1) + (i >= 3 ? (i + 1) : "") + "</span>" +
          '<span class="lb-name">' + '<span class="lb-name-row">' + escapeHtml(r.display_name) + podiumTitle(i + 1) + '</span>' + extraTags(r, i + 1) + "</span>" +
          '<span class="lb-meta">🔥 ' + st + " ngày" +
            (b ? ' <em class="lb-badge">' + b + "</em>" : "") +
            " · XP " + (Number(r.xp) || 0) +
          "</span>" +
        "</li>"
      );
    }).join("");


    // Người đăng nhập nhưng không vào Top 30
    (async function () {
      const user = await getUser();
      if (!user) return;
      const myName = (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || (user.email || "").split("@")[0] || "";
      const onBoard = rows.some(function (r) {
        return String(r.display_name || "").trim().toLowerCase() === String(myName).trim().toLowerCase();
      });
      var box = document.getElementById("lbSelfNote");
      if (box) box.remove();
      if (onBoard) return;
      const xp = getXp();
      const st = calcStreak(getVisits());
      var n = document.createElement("p");
      n.id = "lbSelfNote";
      n.className = "lb-self-note";
      n.innerHTML = "Bạn chưa vào BXH Top 30 · thành tích hiện tại: <b>XP Quiz " + xp + "</b> · chuỗi <b>" + st + " ngày</b>";
      list.insertAdjacentElement("afterend", n);
    })();

    var oldHint = document.getElementById("lbMoreWrap");
    if (oldHint) oldHint.remove();
    if (rows.length > 3) {
      var hint = document.createElement("div");
      hint.id = "lbMoreWrap";
      hint.className = "lb-more-wrap";
      hint.innerHTML =
        '<div class="lb-more-hint-ui" aria-hidden="true">' +
          '<span class="lb-chevs">' +
            '<span class="lb-chev">▾</span>' +
            '<span class="lb-chev">▾</span>' +
            '<span class="lb-chev">▾</span>' +
          "</span>" +
          '<span class="lb-more-txt">Cuộn trong khung để xem thêm</span>' +
          
        "</div>";
      list.insertAdjacentElement("afterend", hint);
    }
  }

  async function renderGate() {
    const note = $("learnBoardNote");
    if (!note) return;
    const user = await getUser();
    if (!user) {
      note.hidden = false;
      note.className = "learn-board-note learn-board-note--guest";
      note.innerHTML = "👤 <a href=\"auth.html\">Đăng ký / Đăng nhập</a> để xuất hiện trên bảng xếp hạng.";
      return;
    }
    const sb = await waitSupabase(2500);
    if (sb && (await isAdmin(sb))) {
      note.hidden = false;
      note.className = "learn-board-note";
      note.textContent = "Tài khoản admin không xếp hạng học viên.";
      return;
    }
    const streak = calcStreak(trackToday());
    note.hidden = false;
    note.className = "learn-board-note";
    note.textContent = "Chuỗi của bạn: " + streak + " ngày";
  }

  async function init() {
    if (!$("learnBoard")) return;
    trackToday();
    await renderGate();
    await loadBoard();

    const user = await getUser();
    if (user) {
      const sb = await waitSupabase(3000);
      if (sb) await pushScore(sb, user);
      await loadBoard();
    }

    const btn = $("learnBoardRefresh");
    if (btn) btn.addEventListener("click", function () { loadBoard(); renderGate(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
