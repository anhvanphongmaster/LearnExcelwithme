import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const auth = req.headers.get("Authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  if (!token) return json({ error: "login_required" }, 401);

  let toolId = "";
  try {
    const body = await req.json();
    toolId = String(body?.tool_id || "").trim();
  } catch (_) {
    return json({ error: "invalid_body" }, 400);
  }
  if (!/^[0-9a-f-]{36}$/i.test(toolId)) return json({ error: "invalid_tool_id" }, 400);

  const service = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { data: authData, error: authError } = await service.auth.getUser(token);
  if (authError || !authData?.user) return json({ error: "login_required" }, 401);

  const { data: tool, error: toolError } = await service
    .from("download_assets")
    .select("id,title,storage_path,source_path,is_active,category")
    .eq("id", toolId)
    .eq("category", "Kho Tool")
    .eq("is_active", true)
    .maybeSingle();

  if (toolError) return json({ error: "tool_lookup_failed" }, 500);
  if (!tool) return json({ error: "tool_not_found" }, 404);

  const path = String(tool.storage_path || tool.source_path || "").trim();
  if (!path.startsWith("tools/")) return json({ error: "tool_path_invalid" }, 409);

  const safeTitle = String(tool.title || "tool")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._ -]+/g, "")
    .trim()
    .replace(/\s+/g, "_") || "tool";

  const { data: signed, error: signedError } = await service.storage
    .from("site-downloads")
    .createSignedUrl(path, 60, { download: `${safeTitle}.zip` });

  if (signedError || !signed?.signedUrl) return json({ error: "file_unavailable" }, 404);

  try {
    await service.rpc("track_download_asset", { p_source_path: tool.source_path || path });
  } catch (_) {
    // Tracking is best-effort only and must never block the file delivery URL.
  }

  return json({
    download_url: signed.signedUrl,
    filename: `${safeTitle}.zip`,
  });
});
