
;(function avpForceAssetRefresh(){
  try{
    const KEY="avp_asset_refresh_20260829_5file_final";
    const params=new URLSearchParams(location.search);
    if(!params.has("avprefresh") && sessionStorage.getItem(KEY)!=="1"){
      sessionStorage.setItem(KEY,"1");
      params.set("avprefresh","20260829");
      const qs=params.toString();
      location.replace(location.pathname+(qs?"?"+qs:"")+location.hash);
    }
  }catch(e){}
})();


import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cfg = window.AVP_SUPABASE_CONFIG || {};
const configured = Boolean(
  cfg.url &&
  cfg.publishableKey &&
  !String(cfg.url).includes("PASTE_") &&
  !String(cfg.publishableKey).includes("PASTE_")
);

window.AVP_SUPABASE_CONFIGURED = configured;

const supabase = configured
  ? createClient(cfg.url, cfg.publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

window.avpSupabase = supabase;

function loadAdminChatAssets() {
  if (!document.querySelector('link[data-avp-admin-chat]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'admin-chat.css?v=20260828-guestfinal1';
    link.dataset.avpAdminChat = '1';
    document.head.appendChild(link);
  }
  if (!document.querySelector('script[data-avp-admin-chat]')) {
    const script = document.createElement('script');
    script.src = 'admin-chat.js?v=20260828-guestfinal1';
    script.defer = true;
    script.dataset.avpAdminChat = '1';
    document.head.appendChild(script);
  }
}

// Chat phải xuất hiện cả khi chưa đăng nhập.
// Nạp module ngay; admin-chat.js sẽ tự chuyển Khách / User / Admin theo session.
loadAdminChatAssets();

const PROFILE_KEY = "avpUserProfile";

/*
  Chỉ đồng bộ dữ liệu học.
  Không đồng bộ theme, lịch sử tìm kiếm hay dữ liệu QC riêng.
*/
const PROGRESS_KEYS = [
  "completedCourses",
  "currentCourse",
  "quizBestScore",
  "avp_playground_progress_v1",
  "avpLearningPath30",
  "avpLearningPathLastVisit",
  "avpRecentActivities",
  "avp_bonus_xp_v1",
  "avp_activity_days_v1",
  "avp_learning_events_v1",
  "avp_daily_rewards_v1",
  "avp_excel_challenge_stats_v1",

  // V6–V11 learning system: these are the keys users expect to follow them
  // across phone / computer after signing in.
  "avp_lesson_progress_v1",
  "avp_xp_v2",
  "avp_quiz_done_v1",
  "avp_badge_unlock_dates_v9",
  "avp_bookmarks_v2",
  "avp_learning_history_v2",
  "avp_visit_days_v1",
  "avp_recent_lessons_v1",
  "avp_playground_completed_v1",
  "avp.practiceLab.v14"
];

const ARRAY_UNION_KEYS = new Set([
  "avp_activity_days_v1",
  "avp_visit_days_v1",
  "avp_bookmarks_v2",
  "avp_playground_completed_v1"
]);

const OBJECT_MERGE_KEYS = new Set([
  "avp_playground_progress_v1",
  "avp_daily_rewards_v1",
  "avp_lesson_progress_v1",
  "avp_quiz_done_v1",
  "avp_badge_unlock_dates_v9",
  "avp.practiceLab.v14"
]);

const EVENT_ARRAY_KEYS = new Set([
  "avpRecentActivities",
  "avp_learning_events_v1",
  "avp_learning_history_v2",
  "avp_recent_lessons_v1"
]);

const MAX_NUMBER_KEYS = new Set([
  "quizBestScore",
  "avp_bonus_xp_v1",
  "avp_xp_v2"
]);

/*
  Những key này phải phản ánh CHÍNH XÁC trạng thái hiện tại.
  Không được union với cloud vì người dùng có thể bỏ đánh dấu / reset.
*/
const EXACT_STATE_KEYS = new Set([
  "completedCourses",
  "avpLearningPath30",
  "avp_excel_challenge_stats_v1"
]);

let applyingCloud = false;
let syncTimer = null;
let syncInFlight = null;

// Tách dữ liệu local theo tài khoản.
// Các key học vẫn giữ tên cũ để toàn bộ website hiện tại tiếp tục hoạt động,
// nhưng khi đổi account chúng sẽ được xóa trước khi nạp cloud của account mới.
const PROGRESS_OWNER_KEY = "avp_progress_owner_v1";

function clearLocalAccountState() {
  const oldApplying = applyingCloud;
  applyingCloud = true;
  try {
    for (const key of PROGRESS_KEYS) localStorage.removeItem(key);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem("avp_cloud_last_sync_v11");

    // Bỏ các cờ hydrate cũ để trang hiện tại đọc lại dữ liệu của account mới.
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith("avpCloudHydrated:")) sessionStorage.removeItem(k);
    }
  } finally {
    applyingCloud = oldApplying;
  }
}

async function ensureLocalBelongsToUser(user) {
  if (!user || !user.id) return false;
  const uid = String(user.id);
  const owner = localStorage.getItem(PROGRESS_OWNER_KEY);

  // Có owner khác => đây là đổi tài khoản trên cùng máy.
  // Xóa sạch state của account trước, KHÔNG merge sang account mới.
  if (owner && owner !== uid) {
    clearLocalAccountState();
  }

  localStorage.setItem(PROGRESS_OWNER_KEY, uid);
  return Boolean(owner && owner !== uid);
}

function parseMaybe(value, fallback = null) {
  if (value === null || value === undefined) return fallback;
  try { return JSON.parse(value); } catch { return value; }
}

function stringifyStored(value) {
  return typeof value === "string" ? value : JSON.stringify(value);
}

function firstLetter(name) {
  const s = String(name || "").trim();
  return s ? Array.from(s)[0].toLocaleUpperCase("vi-VN") : "U";
}

function collectLocalProgress() {
  const out = {};
  for (const key of PROGRESS_KEYS) {
    const value = localStorage.getItem(key);
    if (value !== null) out[key] = value;
  }
  return out;
}

function uniqueArray(a, b) {
  const out = [];
  const seen = new Set();
  [...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])].forEach(v => {
    const id = typeof v === "object" ? JSON.stringify(v) : String(v);
    if (!seen.has(id)) {
      seen.add(id);
      out.push(v);
    }
  });
  return out;
}

function mergeEventArrays(localValue, cloudValue) {
  const a = Array.isArray(localValue) ? localValue : [];
  const b = Array.isArray(cloudValue) ? cloudValue : [];
  const map = new Map();

  [...b, ...a].forEach(item => {
    if (!item || typeof item !== "object") return;
    const id = item.url
      ? `url:${item.url}`
      : (item.time || `${item.date || ""}|${item.type || ""}|${item.title || ""}|${JSON.stringify(item)}`);
    const prev = map.get(id);
    const prevStamp = Number(prev?.at || 0) || Date.parse(prev?.time || prev?.date || 0) || 0;
    const nextStamp = Number(item.at || 0) || Date.parse(item.time || item.date || 0) || 0;
    if (!prev || nextStamp >= prevStamp) map.set(id, item);
  });

  return [...map.values()]
    .sort((x, y) => {
      const ax = Number(x.at || 0) || Date.parse(x.time || x.date || 0) || 0;
      const ay = Number(y.at || 0) || Date.parse(y.time || y.date || 0) || 0;
      return ax - ay;
    })
    .slice(-300);
}

function deepMergeRewards(localValue, cloudValue) {
  const result = {};
  const cloud = cloudValue && typeof cloudValue === "object" ? cloudValue : {};
  const local = localValue && typeof localValue === "object" ? localValue : {};

  for (const day of new Set([...Object.keys(cloud), ...Object.keys(local)])) {
    result[day] = {
      ...(cloud[day] && typeof cloud[day] === "object" ? cloud[day] : {}),
      ...(local[day] && typeof local[day] === "object" ? local[day] : {})
    };
  }
  return result;
}

function mergeProgress(localRaw = {}, cloudRaw = {}) {
  const merged = {};

  for (const key of PROGRESS_KEYS) {
    const lv = localRaw[key];
    const cv = cloudRaw[key];

    if (lv == null && cv == null) continue;
    if (lv == null) { merged[key] = cv; continue; }
    if (cv == null) { merged[key] = lv; continue; }

    const l = parseMaybe(lv);
    const c = parseMaybe(cv);

    if (EXACT_STATE_KEYS.has(key)) {
      /*
        Local là trạng thái người dùng vừa thao tác.
        Nếu local tồn tại thì ghi đúng local lên cloud, kể cả mảng rỗng.
      */
      merged[key] = typeof lv === "string" ? lv : JSON.stringify(lv);
      continue;
    }

    if (ARRAY_UNION_KEYS.has(key)) {
      const value = uniqueArray(c, l);
      if (key === "avpLearningPath30") value.sort((a,b) => Number(a)-Number(b));
      merged[key] = JSON.stringify(value);
      continue;
    }

    if (OBJECT_MERGE_KEYS.has(key)) {
      const value = key === "avp_daily_rewards_v1"
        ? deepMergeRewards(l, c)
        : { ...(c || {}), ...(l || {}) };
      merged[key] = JSON.stringify(value);
      continue;
    }

    if (EVENT_ARRAY_KEYS.has(key)) {
      merged[key] = JSON.stringify(mergeEventArrays(l, c));
      continue;
    }

    if (MAX_NUMBER_KEYS.has(key)) {
      merged[key] = String(Math.max(Number(l) || 0, Number(c) || 0));
      continue;
    }

    if (key === "avpLearningPathLastVisit") {
      // Keep the earliest start date so the 30-day path is not reset on a new device.
      merged[key] = String(l) < String(c) ? String(l) : String(c);
      continue;
    }

    // currentCourse and any future scalar: prefer the current browser if present.
    merged[key] = lv;
  }

  return merged;
}

function applyProgress(data) {
  if (!data || typeof data !== "object") return;

  applyingCloud = true;
  try {
    for (const key of PROGRESS_KEYS) {
      if (Object.prototype.hasOwnProperty.call(data, key) && data[key] != null) {
        localStorage.setItem(key, stringifyStored(data[key]));
      }
    }
  } finally {
    applyingCloud = false;
  }

  window.dispatchEvent(new CustomEvent("avp:cloud-progress-loaded"));
}

async function getUser() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user || null;
}

async function getProfile(user) {
  if (!supabase || !user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.warn("Profile load:", error.message);
    return null;
  }
  return data;
}

function emitSyncStatus(status, message = "") {
  const detail = { status, message, at: Date.now() };
  if (status === "synced") {
    localStorage.setItem("avp_cloud_last_sync_v11", String(detail.at));
  }
  window.dispatchEvent(new CustomEvent("avp:cloud-sync-status", { detail }));
}

async function saveProgressObject(user, payload) {
  const { error } = await supabase
    .from("user_progress")
    .upsert({
      user_id: user.id,
      data: payload,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });

  if (error) throw error;
}

async function syncProgressToCloud() {
  if (!supabase || applyingCloud) return false;

  if (syncInFlight) return syncInFlight;

  syncInFlight = (async () => {
    const user = await getUser();
    if (!user) return false;

    emitSyncStatus("syncing", "Đang đồng bộ...");

    try {
      const local = collectLocalProgress();

      const { data: cloudRow, error } = await supabase
        .from("user_progress")
        .select("data")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      const merged = mergeProgress(local, cloudRow?.data || {});
      applyProgress(merged);
      await saveProgressObject(user, merged);

      emitSyncStatus("synced", "Đã đồng bộ");
      return true;
    } catch (error) {
      console.warn("Cloud progress sync:", error.message || error);
      emitSyncStatus("error", "Không thể đồng bộ");
      return false;
    } finally {
      syncInFlight = null;
    }
  })();

  return syncInFlight;
}

function scheduleProgressSync(delay = 700) {
  if (!configured || applyingCloud) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => syncProgressToCloud(), delay);
}

async function loadAndMergeProgress() {
  if (!supabase) return false;
  const user = await getUser();
  if (!user) return false;

  emitSyncStatus("syncing", "Đang lấy tiến độ...");

  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select("data")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;

    const local = collectLocalProgress();
    const merged = mergeProgress(local, data?.data || {});
    applyProgress(merged);
    await saveProgressObject(user, merged);

    emitSyncStatus("synced", "Đã đồng bộ");
    return true;
  } catch (error) {
    console.warn("Cloud progress load:", error.message || error);
    emitSyncStatus("error", "Không thể lấy tiến độ");
    return false;
  }
}

async function syncProfileToCloud(profile) {
  if (!supabase) return false;
  const user = await getUser();
  if (!user) return false;

  const row = {
    id: user.id,
    display_name: profile.name || null,
    avatar: profile.avatar || "initial",
    goal: profile.goal || null,
    focus: profile.focus || null,
    note: profile.note || null,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from("profiles")
    .upsert(row, { onConflict: "id" });

  if (error) {
    console.warn("Profile save:", error.message);
    return false;
  }

  await updateAuthNav();
  return true;
}

async function loadProfileFromCloud() {
  const user = await getUser();
  if (!user) return null;

  const cloud = await getProfile(user);
  let local = {};

  try {
    local = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
  } catch {}

  if (!cloud) return local;

  /*
    Cloud is authoritative for profile once populated.
    Missing cloud fields may be filled from local data.
  */
  const profile = {
    name: cloud.display_name || local.name || user.user_metadata?.display_name ||
          user.email?.split("@")[0] || "Người học",
    avatar: cloud.avatar || local.avatar || "initial",
    goal: cloud.goal || local.goal || "Nâng cao kỹ năng Excel cho công việc",
    focus: cloud.focus || local.focus || "Excel thực tế",
    note: cloud.note || local.note || ""
  };

  applyingCloud = true;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } finally {
    applyingCloud = false;
  }

  return profile;
}


async function logoutUser() {
  if (!configured || !supabase) {
    location.href = "index.html";
    return;
  }

  try {
    await syncProgressToCloud();
  } catch {}

  try {
    await supabase.auth.signOut({ scope: "local" });
  } finally {
    location.href = "index.html";
  }
}

window.avpLogout = logoutUser;

async function updateAuthNav() {
  const user = await getUser();
  const profile = user ? await getProfile(user) : null;

  const name =
    profile?.display_name ||
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "Người dùng";

  document.querySelectorAll(".auth-nav-slot").forEach(slot => {
    if (!configured || !user) {
      slot.innerHTML = `<a href="auth.html" class="auth-nav-button">🔐 Đăng nhập</a>`;
      return;
    }

    slot.innerHTML = `
      <div class="auth-nav-user">
        <button type="button" class="auth-nav-button auth-user-toggle" aria-expanded="false">
          <span class="auth-nav-avatar">${firstLetter(name)}</span>
          <span>Tài khoản</span>
        </button>
        <div class="auth-dropdown">
          <a href="profile.html">👤 Hồ sơ</a>
          <a href="dashboard.html">📊 Tiến độ học</a>
          <a href="achievements.html">🏆 Thành tích</a>
          <button type="button" class="auth-sync-now">☁️ Đồng bộ ngay</button>
          <button type="button" class="auth-nav-button auth-logout-direct">↪ Đăng xuất</button>
        </div>
      </div>`;
  });

  document.querySelectorAll(".auth-user-toggle").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      btn.closest(".auth-nav-user")?.classList.toggle("open");
    });
  });

  document.querySelectorAll(".auth-sync-now").forEach(btn => {
    btn.addEventListener("click", async e => {
      e.stopPropagation();
      const old = btn.textContent;
      btn.textContent = "☁️ Đang đồng bộ...";
      const ok = await syncProgressToCloud();
      btn.textContent = ok ? "✓ Đã đồng bộ" : "⚠️ Đồng bộ lỗi";
      setTimeout(() => btn.textContent = old, 1300);
    });
  });

  document.querySelectorAll(".auth-logout, .auth-logout-direct").forEach(btn => {
    btn.addEventListener("click", async e => {
      e.stopPropagation();
      btn.disabled = true;
      const old = btn.textContent;
      btn.textContent = "Đang đăng xuất...";
      try {
        await logoutUser();
      } catch {
        btn.disabled = false;
        btn.textContent = old;
      }
    });
  });
}

/*
  localStorage không phát "storage" event trong chính tab vừa thay đổi.
  Patch setItem/removeItem để biết ngay khi một tính năng học cập nhật tiến độ.
*/
const nativeSetItem = Storage.prototype.setItem;
const nativeRemoveItem = Storage.prototype.removeItem;

Storage.prototype.setItem = function(key, value) {
  nativeSetItem.call(this, key, value);

  if (
    this === localStorage &&
    !applyingCloud &&
    (PROGRESS_KEYS.includes(String(key)) || String(key) === PROFILE_KEY)
  ) {
    if (String(key) === PROFILE_KEY) {
      try {
        const profile = JSON.parse(String(value));
        if (configured) {
          clearTimeout(syncTimer);
          syncTimer = setTimeout(() => syncProfileToCloud(profile), 650);
        }
      } catch {}
    } else {
      scheduleProgressSync();
    }
  }
};

Storage.prototype.removeItem = function(key) {
  nativeRemoveItem.call(this, key);

  if (
    this === localStorage &&
    !applyingCloud &&
    PROGRESS_KEYS.includes(String(key))
  ) {
    scheduleProgressSync();
  }
};

window.avpCloudSync = {
  syncProgressToCloud,
  loadProgressFromCloud: loadAndMergeProgress,
  syncProfileToCloud,
  loadProfileFromCloud,
  getUser,
  getProfile,
  mergeProgress,
  ensureLocalBelongsToUser,
  clearLocalAccountState,
  trackedKeys: [...PROGRESS_KEYS]
};

document.addEventListener("DOMContentLoaded", async () => {
  await updateAuthNav();

  document.addEventListener("click", () => {
    document.querySelectorAll(".auth-nav-user.open")
      .forEach(x => x.classList.remove("open"));
  });

  if (!configured) return;

  const user = await getUser();

  if (user) {
    await ensureLocalBelongsToUser(user);
    loadAdminChatAssets();
    await loadProfileFromCloud();
    await loadAndMergeProgress();
    await updateAuthNav();

    /*
      Một số trang đã render trước khi module lấy cloud về.
      Reload đúng 1 lần nếu cloud làm thay đổi localStorage để UI đọc dữ liệu mới.
    */
    const pageKey = `avpCloudHydrated:${user.id}:${location.pathname}`;
    if (!sessionStorage.getItem(pageKey)) {
      sessionStorage.setItem(pageKey, "1");
      setTimeout(() => location.reload(), 60);
      return;
    }
  }

  supabase.auth.onAuthStateChange(async (event) => {
    if (event === "SIGNED_IN") {
      const signedUser = await getUser();
      if (signedUser) await ensureLocalBelongsToUser(signedUser);
      loadAdminChatAssets();
      await loadProfileFromCloud();
      await loadAndMergeProgress();
    }
    await updateAuthNav();
  });

  window.addEventListener("beforeunload", () => {
    // Best-effort only; the normal debounce handles almost all saves.
    if (configured && !applyingCloud) scheduleProgressSync(0);
  });
});


/* ===== AVP WEBSITE REVIEW PROMPT V1 ===== */
(function(){
  if(/(?:^|\/)admin\.html(?:$|[?#])/.test(location.pathname+location.search)) return;
  const KEY_SUB='avp_site_review_submitted_v1';
  const KEY_LAST='avp_site_review_last_prompt_v1';
  const KEY_SESSION='avp_site_review_prompted_session_v1';
  const KEY_BROWSER='avp_site_review_browser_id_v1';
  const KEY_ACTIVE='avp_site_review_active_ms_v2';
  const KEY_THRESHOLD='avp_site_review_threshold_ms_v2';

  const MIN_MS=3*60*1000, MAX_MS=5*60*1000, COOLDOWN=12*60*60*1000;

  let activeMs=Math.max(0,Number(localStorage.getItem(KEY_ACTIVE)||0));
  let lastTick=Date.now(),timer=null,shown=false;
  function browserId(){
    let id=localStorage.getItem(KEY_BROWSER);
    if(!id){id=(crypto.randomUUID?.()||('b_'+Date.now()+'_'+Math.random().toString(36).slice(2)));localStorage.setItem(KEY_BROWSER,id)}
    return id;
  }
  function eligible(){
    if(localStorage.getItem(KEY_SUB)==='1') return false;
    if(sessionStorage.getItem(KEY_SESSION)==='1') return false;
    const last=Number(localStorage.getItem(KEY_LAST)||0);
    return !last || Date.now()-last>=COOLDOWN;
  }
  function css(){
    if(document.getElementById('avpReviewStyle'))return;
    const st=document.createElement('style');st.id='avpReviewStyle';st.textContent=`
    .avp-review-backdrop{position:fixed;inset:0;z-index:99998;background:rgba(15,23,42,.38);display:flex;align-items:flex-end;justify-content:center;padding:16px;padding-bottom:calc(16px + env(safe-area-inset-bottom));backdrop-filter:blur(2px)}
    .avp-review-card{width:min(100%,460px);background:#fff;color:#111827;border:1px solid rgba(15,23,42,.08);border-radius:22px;padding:20px;box-shadow:0 24px 70px rgba(15,23,42,.22);font-family:inherit}
    .avp-review-card h3{margin:0 0 7px;font-size:20px;line-height:1.3}.avp-review-card p{margin:0 0 16px;color:#667085;font-size:14px;line-height:1.55}
    .avp-review-stars{display:flex;gap:7px;margin-bottom:14px}.avp-review-star{border:0;background:#fff;padding:2px;font-size:31px;filter:grayscale(1);opacity:.36;transition:.15s;cursor:pointer}.avp-review-star.on{filter:none;opacity:1;transform:translateY(-1px)}
    .avp-review-card textarea{width:100%;box-sizing:border-box;min-height:96px;resize:vertical;border:1px solid #e5e7eb;border-radius:14px;padding:12px 13px;font:inherit;font-size:14px;outline:none;background:#fff;color:#111827}.avp-review-card textarea:focus{border-color:#cbd5e1;box-shadow:0 0 0 3px rgba(148,163,184,.14)}
    .avp-review-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:14px}.avp-review-actions button{border-radius:12px;padding:10px 15px;font-weight:700;font:inherit;cursor:pointer}.avp-review-later{background:#fff;border:1px solid #e5e7eb;color:#475467}.avp-review-send{background:#111827;color:#fff;border:1px solid #111827}.avp-review-send:disabled{opacity:.45;cursor:not-allowed}.avp-review-note{font-size:12px;color:#98a2b3;margin-top:9px}
    @media(min-width:700px){.avp-review-backdrop{align-items:center}.avp-review-card{padding:23px}}
    `;document.head.appendChild(st);
  }
  function closePrompt(){document.getElementById('avpReviewBackdrop')?.remove()}
  async function submitReview(rating,content,btn){
    const c=window.avpSupabase||window.supabaseClient;
    if(!c?.rpc) throw new Error('Supabase chưa sẵn sàng');
    btn.disabled=true;btn.textContent='Đang gửi…';
    try{
      const {data,error}=await c.rpc('submit_site_review',{p_rating:rating,p_content:content||null,p_browser_id:browserId(),p_page_path:location.pathname});
      if(error)throw error;
      localStorage.setItem(KEY_SUB,'1');
      closePrompt();
      const toast=document.createElement('div');toast.textContent='Cảm ơn bạn đã đánh giá website ❤️';toast.style='position:fixed;left:50%;bottom:24px;z-index:99999;transform:translateX(-50%);background:#111827;color:#fff;padding:11px 15px;border-radius:999px;font:600 13px system-ui;box-shadow:0 8px 30px rgba(0,0,0,.2)';document.body.appendChild(toast);setTimeout(()=>toast.remove(),2300);
    }catch(e){alert('Chưa gửi được đánh giá: '+(e?.message||e));btn.disabled=false;btn.textContent='Gửi đánh giá'}
  }
  function showPrompt(){
    if(shown||!eligible())return;

    shown=true;
    sessionStorage.setItem(KEY_SESSION,'1');
    localStorage.setItem(KEY_LAST,String(Date.now()));

    // Đã đủ thời gian và đã hiện popup: reset bộ đếm cho lần hỏi sau
    // nếu người dùng bấm "Để sau". Cooldown 12 giờ vẫn được giữ bởi KEY_LAST.
    activeMs=0;
    localStorage.setItem(KEY_ACTIVE,'0');
    localStorage.removeItem(KEY_THRESHOLD);

    css();
    const wrap=document.createElement('div');wrap.className='avp-review-backdrop';wrap.id='avpReviewBackdrop';wrap.innerHTML=`<div class="avp-review-card" role="dialog" aria-modal="true" aria-labelledby="avpReviewTitle"><h3 id="avpReviewTitle">Bạn thấy website của Anh Văn Phòng thế nào?</h3><p>Đánh giá của bạn giúp mình biết phần nào đang hữu ích và phần nào cần cải thiện.</p><div class="avp-review-stars" aria-label="Chọn số sao">${[1,2,3,4,5].map(i=>`<button type="button" class="avp-review-star" data-star="${i}" aria-label="${i} sao">★</button>`).join('')}</div><textarea id="avpReviewContent" maxlength="1000" placeholder="Bạn có góp ý gì cho website không? (không bắt buộc)"></textarea><div class="avp-review-actions"><button type="button" class="avp-review-later">Để sau</button><button type="button" class="avp-review-send" disabled>Gửi đánh giá</button></div><div class="avp-review-note">Sau khi gửi đánh giá, thông báo này sẽ không xuất hiện lại.</div></div>`;
    document.body.appendChild(wrap);let rating=0;const stars=[...wrap.querySelectorAll('[data-star]')],send=wrap.querySelector('.avp-review-send');
    stars.forEach(b=>b.onclick=()=>{rating=Number(b.dataset.star);stars.forEach(x=>x.classList.toggle('on',Number(x.dataset.star)<=rating));send.disabled=!rating});
    wrap.querySelector('.avp-review-later').onclick=closePrompt;
    send.onclick=()=>submitReview(rating,wrap.querySelector('#avpReviewContent').value.trim(),send);
  }
  function getThreshold(){
    let t=Number(localStorage.getItem(KEY_THRESHOLD)||0);

    if(!t || t<MIN_MS || t>MAX_MS){
      t=MIN_MS+Math.floor(Math.random()*(MAX_MS-MIN_MS+1));
      localStorage.setItem(KEY_THRESHOLD,String(t));
    }

    return t;
  }

  const threshold=getThreshold();

  function saveActive(){
    localStorage.setItem(KEY_ACTIVE,String(Math.max(0,Math.floor(activeMs))));
  }

  function tick(){
    const now=Date.now();

    // Chỉ tính thời gian sử dụng thực tế khi trang đang hiển thị và có focus.
    // Khi chuyển app/tab, thời gian đó không được cộng.
    if(!document.hidden && document.hasFocus()){
      activeMs+=Math.min(now-lastTick,5000);
      saveActive();
    }

    lastTick=now;

    if(activeMs>=threshold){
      clearInterval(timer);
      showPrompt();
    }
  }

  function boot(){
    if(!eligible())return;

    // Nếu thời gian tích lũy từ các trang trước đã đủ,
    // vẫn chờ DOM sẵn sàng rồi hiện ngay trong lần vào trang hiện tại.
    if(activeMs>=threshold){
      setTimeout(showPrompt,350);
      return;
    }

    timer=setInterval(tick,1000);

    document.addEventListener('visibilitychange',()=>{
      saveActive();
      lastTick=Date.now();
    });

    window.addEventListener('focus',()=>{
      lastTick=Date.now();
    });

    window.addEventListener('pagehide',()=>{
      saveActive();
    });

    window.addEventListener('beforeunload',()=>{
      saveActive();
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

/* ===== AVP AI CHAT LOADER V1 ===== */
(function(){
  if(document.getElementById('avpAiChatScript')) return;

  const css=document.createElement('link');
  css.rel='stylesheet';
  css.href='ai-chat.css?v=20260829-community-native1';
  css.id='avpAiChatCss';
  document.head.appendChild(css);

  const js=document.createElement('script');
  js.src='ai-chat.js?v=20260829-community-native1';
  js.defer=true;
  js.id='avpAiChatScript';
  document.head.appendChild(js);
})();
