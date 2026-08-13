
(() => {
const USERS_KEY="avp_demo_users_v1";
const SESSION_KEY="avp_demo_session_v1";

function jget(key,fallback){
  try{return JSON.parse(localStorage.getItem(key)||"null") ?? fallback}catch{return fallback}
}
function jset(key,val){localStorage.setItem(key,JSON.stringify(val))}
function initial(name){
  const s=String(name||"").trim();
  return s ? Array.from(s)[0].toLocaleUpperCase("vi-VN") : "U";
}
function currentUser(){
  const session=jget(SESSION_KEY,null);
  if(!session) return null;
  const users=jget(USERS_KEY,[]);
  return users.find(u=>u.email===session.email)||null;
}
function updateAuthNav(){
  document.querySelectorAll(".auth-nav-slot").forEach(slot=>{
    const user=currentUser();
    if(!user){
      slot.innerHTML=`<a href="auth.html" class="auth-nav-button">🔐 Đăng nhập</a>`;
      return;
    }
    slot.innerHTML=`
      <div class="auth-nav-user">
        <button type="button" class="auth-nav-button auth-user-toggle">
          <span class="auth-nav-avatar">${initial(user.name)}</span>
          <span>${user.name}</span>
        </button>
        <div class="auth-dropdown">
          <a href="profile.html">👤 Hồ sơ</a>
          <a href="dashboard.html">📊 Dashboard</a>
          <a href="achievements.html">🏆 Thành tích</a>
          <button type="button" class="danger auth-logout">↪ Đăng xuất</button>
        </div>
      </div>`;
  });

  document.querySelectorAll(".auth-user-toggle").forEach(btn=>{
    btn.addEventListener("click",(e)=>{
      e.stopPropagation();
      btn.closest(".auth-nav-user")?.classList.toggle("open");
    });
  });
  document.querySelectorAll(".auth-logout").forEach(btn=>{
    btn.addEventListener("click",()=>{
      localStorage.removeItem(SESSION_KEY);
      updateAuthNav();
      if(location.pathname.endsWith("auth.html")) location.href="index.html";
    });
  });
}
function syncProfileForUser(user){
  if(!user) return;
  const profileKey="avpUserProfile";
  let profile={};
  try{profile=JSON.parse(localStorage.getItem(profileKey)||"{}")}catch{}
  profile.name=user.name;
  profile.avatar=profile.avatar||"initial";
  localStorage.setItem(profileKey,JSON.stringify(profile));
}

document.addEventListener("DOMContentLoaded",()=>{
  updateAuthNav();

  document.addEventListener("click",()=>{
    document.querySelectorAll(".auth-nav-user.open").forEach(x=>x.classList.remove("open"));
  });

  document.querySelectorAll(".auth-tab").forEach(tab=>{
    tab.addEventListener("click",()=>{
      document.querySelectorAll(".auth-tab").forEach(x=>x.classList.remove("active"));
      document.querySelectorAll(".auth-form").forEach(x=>x.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.target)?.classList.add("active");
    });
  });

  const register=document.getElementById("registerForm");
  register?.addEventListener("submit",(e)=>{
    e.preventDefault();
    const name=document.getElementById("registerName").value.trim();
    const email=document.getElementById("registerEmail").value.trim().toLowerCase();
    const pass=document.getElementById("registerPassword").value;
    const pass2=document.getElementById("registerPassword2").value;
    const msg=document.getElementById("registerMessage");

    if(!name || !email || !pass){msg.className="auth-error";msg.textContent="Vui lòng nhập đủ thông tin.";return}
    if(pass.length<6){msg.className="auth-error";msg.textContent="Mật khẩu cần ít nhất 6 ký tự.";return}
    if(pass!==pass2){msg.className="auth-error";msg.textContent="Mật khẩu nhập lại chưa khớp.";return}

    const users=jget(USERS_KEY,[]);
    if(users.some(u=>u.email===email)){msg.className="auth-error";msg.textContent="Email này đã được đăng ký trên trình duyệt này.";return}

    users.push({name,email,password:pass,createdAt:new Date().toISOString()});
    jset(USERS_KEY,users);
    jset(SESSION_KEY,{email});
    syncProfileForUser({name,email});
    msg.className="auth-success";
    msg.textContent="✓ Đăng ký thành công. Đang chuyển về Trang chủ...";
    setTimeout(()=>location.href="index.html",700);
  });

  const login=document.getElementById("loginForm");
  login?.addEventListener("submit",(e)=>{
    e.preventDefault();
    const email=document.getElementById("loginEmail").value.trim().toLowerCase();
    const pass=document.getElementById("loginPassword").value;
    const msg=document.getElementById("loginMessage");
    const users=jget(USERS_KEY,[]);
    const user=users.find(u=>u.email===email && u.password===pass);

    if(!user){msg.className="auth-error";msg.textContent="Email hoặc mật khẩu chưa đúng.";return}
    jset(SESSION_KEY,{email});
    syncProfileForUser(user);
    msg.className="auth-success";
    msg.textContent="✓ Đăng nhập thành công. Đang chuyển về Trang chủ...";
    setTimeout(()=>location.href="index.html",600);
  });
});
})();
