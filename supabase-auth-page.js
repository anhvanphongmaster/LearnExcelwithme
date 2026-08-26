
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cfg = window.AVP_SUPABASE_CONFIG || {};
const configured =
  cfg.url &&
  cfg.publishableKey &&
  !cfg.url.includes("PASTE_") &&
  !cfg.publishableKey.includes("PASTE_");

const supabase = configured ? createClient(cfg.url, cfg.publishableKey) : null;



async function nameTaken(handle){
  if(!supabase) return false;
  try{
    const { data, error } = await supabase.rpc("is_account_name_taken", { p_handle: handle });
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

function getSafeRedirect(){
  const params=new URLSearchParams(location.search);
  const target=params.get("redirect") || params.get("next");

  if(!target) return "index.html";

  /*
    Chỉ cho phép file HTML nội bộ, không nhận URL bên ngoài.
  */
  if(
    /^[a-zA-Z0-9._-]+\.html(?:[?#].*)?$/.test(target) &&
    !target.includes("..")
  ){
    return target;
  }

  return "index.html";
}

function goAfterAuth(delay=500){
  const target=getSafeRedirect();
  setTimeout(()=>location.href=target,delay);
}


function friendlyAuthError(error){
  const raw=(error?.message || String(error || "")).trim();
  const text=raw.toLowerCase();

  if(text.includes("email rate limit exceeded") || text.includes("error sending confirmation email")){
    return "Supabase đang chặn gửi email. Vào Authentication → Providers → Email → tắt Confirm email. Rồi đăng ký lại bằng tên đăng nhập.";
  }
  if(text.includes("invalid login credentials")){
    return "Email hoặc mật khẩu chưa đúng. Vui lòng kiểm tra lại.";
  }
  if(text.includes("email not confirmed")){
    return "Tài khoản chưa được kích hoạt vì Supabase vẫn đang yêu cầu xác nhận email. Vui lòng liên hệ quản trị viên.";
  }
  if(text.includes("user already registered")){
    return "Email này đã được đăng ký. Bạn có thể chuyển sang tab Đăng nhập.";
  }
  if(text.includes("signup is disabled")){
    return "Chức năng đăng ký hiện đang tạm khóa. Vui lòng thử lại sau.";
  }

  return "Có lỗi xảy ra khi xử lý tài khoản. Vui lòng thử lại sau.";
}

function msg(id, text, ok=false){
  const el=document.getElementById(id);
  if(!el) return;
  el.className=ok ? "auth-success" : "auth-error";
  el.textContent=text;
}

document.addEventListener("DOMContentLoaded",()=>{
  const wantTab=new URLSearchParams(location.search).get("tab");
  if(wantTab==="register"){
    const tab=[...document.querySelectorAll(".auth-tab")].find(x=>x.dataset.target==="registerForm");
    if(tab) tab.click();
  }

  document.querySelectorAll(".auth-tab").forEach(tab=>{
    tab.addEventListener("click",()=>{
      document.querySelectorAll(".auth-tab").forEach(x=>x.classList.remove("active"));
      document.querySelectorAll(".auth-form").forEach(x=>x.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.target)?.classList.add("active");
    });
  });

  
  ["registerName","registerEmail"].forEach(function(id){
    const el=document.getElementById(id);
    if(!el) return;
    el.addEventListener("blur", async function(){
      const v=el.value.trim();
      if(v.length<2) return;
      if(await nameTaken(v)){
        msg("registerMessage","Tên "" + v + "" đã có người dùng.");
      }else{
        const box=document.getElementById("registerMessage");
        if(box && /đã có người/.test(box.textContent||"")) box.textContent="";
      }
    });
  });

  document.getElementById("loginForm")?.addEventListener("submit",async e=>{
    e.preventDefault();
    if(!supabase){
      msg("loginMessage","Chưa cấu hình Supabase trong supabase-config.js.");
      return;
    }

    const raw=document.getElementById("loginEmail").value.trim();
    const email=toAuthEmail(raw);
    if(!email){
      msg("loginMessage","Tên đăng nhập tối thiểu 3 ký tự, không dấu, không cách.");
      return;
    }
    const password=document.getElementById("loginPassword").value;

    msg("loginMessage","Đang đăng nhập...",true);

    const { error }=await supabase.auth.signInWithPassword({email,password});

    if(error){
      msg("loginMessage",friendlyAuthError(error));
      return;
    }

    msg("loginMessage","✓ Đăng nhập thành công.",true);
    goAfterAuth(500);
  });

  document.getElementById("registerForm")?.addEventListener("submit",async e=>{
    e.preventDefault();
    if(!supabase){
      msg("registerMessage","Chưa cấu hình Supabase trong supabase-config.js.");
      return;
    }

    const name=document.getElementById("registerName").value.trim();
    const raw=document.getElementById("registerEmail").value.trim();
    const email=toAuthEmail(raw);
    if(!email){
      msg("registerMessage","Tên đăng nhập tối thiểu 3 ký tự, không dấu, không cách.");
      return;
    }
    const password=document.getElementById("registerPassword").value;
    const password2=document.getElementById("registerPassword2").value;

    if(password.length<6){
      msg("registerMessage","Mật khẩu cần ít nhất 6 ký tự.");
      return;
    }
    if(password!==password2){
      msg("registerMessage","Mật khẩu nhập lại chưa khớp.");
      return;
    }

    const handle = (name || raw).trim();
    if(await nameTaken(handle) || await nameTaken(raw)){
      msg("registerMessage","Tên này đã có người dùng. Hãy chọn tên khác.");
      return;
    }

    msg("registerMessage","Đang tạo tài khoản...",true);

    const { data, error }=await supabase.auth.signUp({
      email,
      password,
      options:{
        data:{display_name:name}
      }
    });

    if(error){
      msg("registerMessage",friendlyAuthError(error));
      return;
    }

    if(data.session){
      try{ await supabase.rpc("claim_account_name", { p_handle: (name || raw).trim() }); }catch(e){}
      msg("registerMessage","✓ Tạo tài khoản thành công! Đang đăng nhập...",true);
      goAfterAuth(600);
    }else{
      msg("registerMessage","Tài khoản đã được tạo nhưng Supabase vẫn đang bật xác nhận email. Hãy tắt Confirm email trong Authentication → Sign In / Providers → Email rồi thử lại.");
    }
  });
});
