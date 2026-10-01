import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

(() => {
  const cfg = window.AVP_SUPABASE_CONFIG || {};
  const configured = Boolean(
    cfg.url &&
    cfg.publishableKey &&
    !String(cfg.url).includes("PASTE_") &&
    !String(cfg.publishableKey).includes("PASTE_")
  );

  window.AVP_SUPABASE_CONFIGURED = configured;

  if (!configured) {
    window.avpSupabase = null;
    return;
  }

  // Admin dùng một client auth riêng, không chạy cloud-progress/profile hydration.
  // Tránh site-wide sync làm reload/đụng session trong lúc Admin đang xác thực.
  const client = createClient(cfg.url, cfg.publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  window.avpSupabase = client;
  window.avpAdminAuthReady = true;

  client.auth.onAuthStateChange((event, session) => {
    window.dispatchEvent(new CustomEvent("avp:admin-auth-state", {
      detail: { event, session }
    }));
  });
})();
