(() => {
  "use strict";

  const CACHE_PREFIX = "avpProfessionalRole:v1:";
  const CACHE_TTL_MS = 5 * 60 * 1000;

  async function waitClient() {
    for (let i = 0; i < 40; i++) {
      const sb = window.avpSupabase || window.supabaseClient || null;
      if (sb?.auth && sb?.rpc) return sb;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return null;
  }

  function readRoleCache(userId) {
    try {
      const raw = sessionStorage.getItem(CACHE_PREFIX + userId);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || Date.now() - Number(parsed.at || 0) > CACHE_TTL_MS) return null;
      if (typeof parsed.isAdmin !== "boolean") return null;
      return { isAdmin: parsed.isAdmin, verified: true, source: "cache" };
    } catch {
      return null;
    }
  }

  function writeRoleCache(userId, isAdmin) {
    try {
      sessionStorage.setItem(
        CACHE_PREFIX + userId,
        JSON.stringify({ isAdmin: isAdmin === true, at: Date.now() })
      );
    } catch {}
  }

  async function resolveAdmin(sb, user, options = {}) {
    if (!sb || !user?.id) {
      return { isAdmin: false, verified: false, source: "missing-session" };
    }

    if (!options.force) {
      const cached = readRoleCache(user.id);
      if (cached) return cached;
    }

    // Primary source: SECURITY DEFINER / server-side role check.
    try {
      const result = await sb.rpc("is_admin_user");
      if (!result?.error) {
        const isAdmin = result?.data === true;
        writeRoleCache(user.id, isAdmin);
        return { isAdmin, verified: true, source: "rpc" };
      }
    } catch {}

    // Fallback: own profile role. This prevents one transient RPC/schema error
    // from silently downgrading an Admin into the learner gate.
    try {
      const { data, error } = await sb
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && typeof data?.is_admin === "boolean") {
        const isAdmin = data.is_admin === true;
        writeRoleCache(user.id, isAdmin);
        return { isAdmin, verified: true, source: "profile" };
      }
    } catch {}

    // Security rule: an unverified role is never treated as Admin, but also
    // must not be mislabeled as a normal locked learner.
    return { isAdmin: false, verified: false, source: "unavailable" };
  }

  async function resolve(options = {}) {
    const sb = options.client || await waitClient();
    if (!sb) {
      return { ok: false, authenticated: false, canAccess: false, reason: "connection" };
    }

    let session = null;
    try {
      const response = await sb.auth.getSession();
      session = response?.data?.session || null;
    } catch {
      return { ok: false, authenticated: false, canAccess: false, reason: "connection", client: sb };
    }

    const user = session?.user || null;
    if (!user) {
      return { ok: true, authenticated: false, canAccess: false, reason: "login", client: sb };
    }

    const admin = await resolveAdmin(sb, user, { force: options.forceRole === true });
    if (admin.verified && admin.isAdmin) {
      return {
        ok: true,
        authenticated: true,
        canAccess: true,
        isAdmin: true,
        adminVerified: true,
        roleSource: admin.source,
        client: sb,
        user
      };
    }

    if (options.markActivity && admin.verified) {
      try { await sb.rpc("professional_track_mark_activity_v1"); } catch {}
    }

    let learnerData = null;
    try {
      const { data, error } = await sb.rpc("professional_track_access_status_v1");
      if (error) throw error;
      learnerData = data || {};
    } catch (error) {
      return {
        ok: false,
        authenticated: true,
        canAccess: false,
        isAdmin: false,
        adminVerified: admin.verified,
        reason: "connection",
        error,
        client: sb,
        user
      };
    }

    const learnerAllowed = learnerData?.status === "approved" && learnerData?.can_access === true;
    if (learnerAllowed) {
      return {
        ok: true,
        authenticated: true,
        canAccess: true,
        isAdmin: false,
        adminVerified: admin.verified,
        learnerData,
        client: sb,
        user
      };
    }

    if (!admin.verified) {
      return {
        ok: false,
        authenticated: true,
        canAccess: false,
        isAdmin: false,
        adminVerified: false,
        learnerData,
        reason: "role-check",
        client: sb,
        user
      };
    }

    return {
      ok: true,
      authenticated: true,
      canAccess: false,
      isAdmin: false,
      adminVerified: true,
      learnerData,
      reason: learnerData?.status || "locked",
      client: sb,
      user
    };
  }

  window.AVPProfessionalAccess = {
    waitClient,
    resolveAdmin,
    resolve,
    clearRoleCache(userId) {
      if (!userId) return;
      try { sessionStorage.removeItem(CACHE_PREFIX + userId); } catch {}
    }
  };
})();
