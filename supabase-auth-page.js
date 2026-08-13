
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
      msg("loginMessage",error.message);
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
      msg("registerMessage",error.message);
      return;
    }

    if(data.session){
      msg("registerMessage","✓ Đăng ký thành công.",true);
      goAfterAuth(600);
    }else{
      msg("registerMessage","✓ Đã tạo tài khoản. Hãy kiểm tra email để xác nhận.",true);
    }
  });
});
