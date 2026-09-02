import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cfg = window.AVP_SUPABASE_CONFIG || {};
const configured =
  cfg.url &&
  cfg.publishableKey &&
  !String(cfg.url).includes("PASTE_") &&
  !String(cfg.publishableKey).includes("PASTE_");

const supabase = window.avpSupabase || (configured
  ? createClient(cfg.url, cfg.publishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    })
  : null);

const AUTH_TIMEOUT_MS=12000;

function withTimeout(promise, ms=AUTH_TIMEOUT_MS){
  let timer;
  return Promise.race([
    promise,
    new Promise((_,reject)=>{
      timer=setTimeout(()=>reject(new Error("AUTH_TIMEOUT")),ms);
    })
  ]).finally(()=>clearTimeout(timer));
}

async function nameTaken(handle){
  if(!supabase) return false;
  try{
    const { data, error } = await withTimeout(
      supabase.rpc("is_account_name_taken", { p_handle: handle }),
      8000
    );
    if(error) return false;
    return !!data;
  }catch(e){
    return false;
  }
}

function toAuthEmail(raw){
  raw = String(raw || "").trim();
  if(!raw) return "";
  if(raw.includes("@")) return raw.toLowerCase();
  const user = raw.toLowerCase().replace(/[^a-z0-9._-]/g, "");
  if(user.length < 3) return "";
  return user + "@avp-app.local";
}

function params(){
  return new URLSearchParams(location.search);
}

function isAdminEntry(){
  const p = params();
  const t = (p.get("redirect") || p.get("next") || "").toLowerCase();
  return t.indexOf("admin") >= 0 || p.get("admin") === "1";
}

function getSafeRedirect(){
  const target = params().get("redirect") || params().get("next") || "";
  if(!target) return "index.html";
  const file = String(target).split("?")[0].split("#")[0];
  if(/^[a-zA-Z0-9._-]+\.html$/.test(file) && !file.includes("..") && file !== "auth.html"){
    return file;
  }
  return "index.html";
}

function goAfterAuth(){
  const target = getSafeRedirect();
  try { location.replace(target); }
  catch(e){ location.href = target; }
}

function friendlyAuthError(error){
  const raw=(error?.message || String(error || "")).trim();
  const text=raw.toLowerCase();
  if(text.includes("email rate limit") || text.includes("confirmation email")){
    return "Supabase đang chặn gửi email. Tắt Confirm email rồi thử lại.";
  }
  if(text.includes("invalid login credentials")){
    return "Tên đăng nhập hoặc mật khẩu chưa đúng.";
  }
  if(text.includes("email not confirmed")){
    return "Tài khoản chưa xác nhận email. Tắt Confirm email trên Supabase hoặc xác nhận hộp thư.";
  }
  if(text.includes("user already registered")){
    return "Tên này đã được đăng ký. Hãy đăng nhập.";
  }
  if(text.includes("signup is disabled")){
    return "Đăng ký đang tạm khóa.";
  }
  if(text.includes("auth_timeout")){
    return "Máy chủ đang bận và phản hồi quá lâu. Vui lòng chờ một chút rồi thử lại.";
  }
  return raw || "Không xử lý được tài khoản. Thử lại sau.";
}

function msg(id, text, ok=false){
  const el=document.getElementById(id);
  if(!el) return;
  el.className=ok ? "auth-success" : "auth-error";
  el.textContent=text;
}

function showForm(id){
  document.querySelectorAll(".auth-form").forEach(x=>x.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
}

document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("authSwitchLogin")?.addEventListener("click",()=>showForm("loginForm"));
  document.getElementById("authSwitchRegister")?.addEventListener("click",()=>showForm("registerForm"));

  if(isAdminEntry()){
    showForm("loginForm");
    document.querySelectorAll(".auth-switch").forEach(el=>el.hidden=true);
    const h = document.querySelector("#loginForm h2");
    if(h) h.textContent = "Đăng nhập Admin";
  }else{
    const p=params();
    const mode=(p.get("tab") || p.get("mode") || "login").toLowerCase();
    if(mode==="register") showForm("registerForm");
    else showForm("loginForm");
  }

  document.getElementById("loginForm")?.addEventListener("submit", async e=>{
    e.preventDefault();
    if(!supabase){ msg("loginMessage","Chưa cấu hình Supabase."); return; }
    const submit=e.submitter || e.currentTarget.querySelector('button[type="submit"]');
    if(submit?.disabled) return;
    const raw=document.getElementById("loginEmail").value.trim();
    const email=toAuthEmail(raw);
    if(!email){ msg("loginMessage","Tên đăng nhập tối thiểu 3 ký tự."); return; }
    const password=document.getElementById("loginPassword").value;
    msg("loginMessage","Đang đăng nhập...",true);
    if(submit) submit.disabled=true;
    try{
      const { data, error }=await withTimeout(
        supabase.auth.signInWithPassword({email,password})
      );
      if(error){ msg("loginMessage",friendlyAuthError(error)); return; }
      if(!data || !data.session){ msg("loginMessage","Đăng nhập chưa tạo được phiên. Tắt Confirm email rồi thử lại."); return; }
      msg("loginMessage","✓ Đăng nhập thành công. Đang chuyển trang...",true);
      setTimeout(goAfterAuth, 250);
    }catch(error){
      msg("loginMessage",friendlyAuthError(error));
    }finally{
      if(submit) submit.disabled=false;
    }
  });

  document.getElementById("registerForm")?.addEventListener("submit", async e=>{
    e.preventDefault();
    if(!supabase){ msg("registerMessage","Chưa cấu hình Supabase."); return; }
    const submit=e.submitter || e.currentTarget.querySelector('button[type="submit"]');
    if(submit?.disabled) return;
    const name=(document.getElementById("registerName")?.value || "").trim();
    const raw=(document.getElementById("registerEmail")?.value || "").trim();
    const email=toAuthEmail(raw);
    if(!email){ msg("registerMessage","Tên đăng nhập tối thiểu 3 ký tự, không dấu."); return; }
    const password=document.getElementById("registerPassword").value;
    const password2=document.getElementById("registerPassword2").value;
    if(password.length<6){ msg("registerMessage","Mật khẩu tối thiểu 6 ký tự."); return; }
    if(password!==password2){ msg("registerMessage","Mật khẩu nhập lại chưa khớp."); return; }
    const handle=(name || raw).trim();
    if(submit) submit.disabled=true;
    try{
      if(await nameTaken(handle) || await nameTaken(raw)){
        msg("registerMessage","Tên này đã có người dùng.");
        return;
      }
      msg("registerMessage","Đang tạo tài khoản...",true);
      const { data, error }=await withTimeout(supabase.auth.signUp({
        email, password, options:{ data:{ display_name: name || raw } }
      }));
      if(error){ msg("registerMessage",friendlyAuthError(error)); return; }

      if(data && data.session){
        try{ await withTimeout(supabase.rpc("claim_account_name", { p_handle: handle }),8000); }catch(e){}
      }
      try{ await withTimeout(supabase.auth.signOut(),8000); }catch(e){}
      const loginInput=document.getElementById("loginEmail");
      if(loginInput) loginInput.value = raw;
      const pw=document.getElementById("loginPassword");
      if(pw){ pw.value=""; pw.focus(); }
      showForm("loginForm");
      msg("loginMessage","Đăng ký thành công. Nhập lại mật khẩu để đăng nhập.",true);
      msg("registerMessage","Đăng ký thành công. Hãy đăng nhập.",true);
    }catch(error){
      msg("registerMessage",friendlyAuthError(error));
    }finally{
      if(submit) submit.disabled=false;
    }
  });
});
