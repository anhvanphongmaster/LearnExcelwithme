
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cfg = window.AVP_SUPABASE_CONFIG || {};
const configured =
  cfg.url &&
  cfg.publishableKey &&
  !cfg.url.includes("PASTE_") &&
  !cfg.publishableKey.includes("PASTE_");

const supabase = configured ? createClient(cfg.url, cfg.publishableKey) : null;

function getSafeRedirect(){
  const params=new URLSearchParams(location.search);
  const target=params.get("redirect");

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
    return "Hệ thống tài khoản đang yêu cầu gửi email xác nhận. Quản trị viên cần tắt Confirm email trong Supabase để đăng ký trực tiếp.";
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
  document.querySelectorAll(".auth-tab").forEach(tab=>{
    tab.addEventListener("click",()=>{
      document.querySelectorAll(".auth-tab").forEach(x=>x.classList.remove("active"));
      document.querySelectorAll(".auth-form").forEach(x=>x.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.target)?.classList.add("active");
    });
  });

  document.getElementById("loginForm")?.addEventListener("submit",async e=>{
    e.preventDefault();
    if(!supabase){
      msg("loginMessage","Chưa cấu hình Supabase trong supabase-config.js.");
      return;
    }

    const email=document.getElementById("loginEmail").value.trim().toLowerCase();
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
    const email=document.getElementById("registerEmail").value.trim().toLowerCase();
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
      msg("registerMessage","✓ Tạo tài khoản thành công! Đang đăng nhập...",true);
      goAfterAuth(600);
    }else{
      msg("registerMessage","Tài khoản đã được tạo nhưng Supabase vẫn đang bật xác nhận email. Hãy tắt Confirm email trong Authentication → Sign In / Providers → Email rồi thử lại.");
    }
  });
});
