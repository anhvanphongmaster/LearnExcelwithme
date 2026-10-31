/* One-time cleanup of retired learning XP/progress keys. Practice-grader submissions are not touched. */
(function(){
  try{
    var marker='avp_learning_reset_20261030_v1';
    if(localStorage.getItem(marker))return;
    ['avp_coach_exp_v2','avp_xp_v2','avp_quiz_done_v1','avp_lesson_progress_v1',
     'avp_coach_daily_v1','avp_coach_daily_start_v1','avp_coach_cases_v1',
     'avp_learning_achievements_v1','avp_learning_streak_v1','avp_last_lesson_v1','avp_daily_xp_v3'].forEach(function(k){localStorage.removeItem(k)});
    localStorage.setItem(marker,'1');
  }catch(e){}
})();

(function avpHideEmbeddedChrome(){
  var embedded=false;
  try{
    embedded=new URLSearchParams(location.search).get("embed")==="1" || window.self!==window.top;
  }catch(e){
    embedded=window.self!==window.top;
  }
  if(!embedded)return;
  document.documentElement.classList.add("avp-embedded-frame","avp-embedded-youtube");
  function hide(){
    var n=document.querySelector(".top-simple-nav");
    if(n){n.hidden=true;n.style.display="none";}
    var l=document.getElementById("avpEdgeLauncher");
    if(l){l.hidden=true;l.style.display="none";}
    document.querySelectorAll(".avp-install-banner,.avp-edge-mini-preview-v2").forEach(function(el){el.remove();});
  }
  hide();
  document.addEventListener("DOMContentLoaded",hide);
  setTimeout(hide,0);
  setTimeout(hide,300);
  setTimeout(hide,900);
  setTimeout(hide,1800);
})();

/* =========================================================
   V83 — GLOBAL SITE MAINTENANCE
   State is controlled from Admin > Tổng quan.
   Fail-open: if Supabase/RPC is unavailable, the website is not blocked.
   Admin and auth pages remain accessible so maintenance cannot lock Admin out.
   ========================================================= */
(function(){
  "use strict";

  const CHECK_MS=30000;
  const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  const operatorPages=new Set(["admin.html","auth.html"]);
  let timer=null;
  let countdownTimer=null;
  let lastEnabled=false;

  function escText(v){ return String(v??""); }

  async function waitClient(timeout=5000){
    const start=Date.now();
    while(Date.now()-start<timeout){
      const c=window.avpSupabase||window.supabaseClient;
      if(c) return c;
      await new Promise(r=>setTimeout(r,80));
    }
    return window.avpSupabase||window.supabaseClient||null;
  }

  async function isAdmin(client){
    try{
      const {data:sess}=await client.auth.getSession();
      if(!sess?.session?.user) return false;
      const {data,error}=await client.rpc("avp_is_admin");
      if(error) return false;
      return data===true;
    }catch(e){ return false; }
  }

  function removeOverlay(reload){
    clearInterval(countdownTimer);
    countdownTimer=null;
    document.documentElement.classList.remove("avp-maintenance-active");
    document.getElementById("avpSiteMaintenance")?.remove();
    if(reload) location.reload();
  }

  function formatEnd(iso){
    if(!iso) return "";
    const d=new Date(iso);
    if(Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("vi-VN",{
      day:"2-digit",month:"2-digit",year:"numeric",
      hour:"2-digit",minute:"2-digit"
    });
  }

  function countdownText(iso){
    const end=new Date(iso).getTime();
    if(!Number.isFinite(end)) return "";
    const diff=end-Date.now();
    if(diff<=0) return "Đang hoàn thiện các bước cuối";
    const total=Math.floor(diff/1000);
    const d=Math.floor(total/86400);
    const h=Math.floor((total%86400)/3600);
    const m=Math.floor((total%3600)/60);
    const s=total%60;
    if(d>0) return `${d} ngày ${h} giờ ${m} phút`;
    if(h>0) return `${h} giờ ${m} phút ${s} giây`;
    return `${m} phút ${s} giây`;
  }

  function mountOverlay(row){
    lastEnabled=true;
    let root=document.getElementById("avpSiteMaintenance");
    if(!root){
      root=document.createElement("div");
      root.id="avpSiteMaintenance";
      root.className="avp-site-maintenance";
      root.setAttribute("role","dialog");
      root.setAttribute("aria-modal","true");
      root.innerHTML=`
        <div class="avp-maintenance-card">
          <div class="avp-maintenance-brand">AVP</div>
          <span class="avp-maintenance-kicker">SYSTEM MAINTENANCE</span>
          <h1 id="avpMaintenanceTitle"></h1>
          <p id="avpMaintenanceMessage"></p>

          <div class="avp-maintenance-time" id="avpMaintenanceTime" hidden>
            <small>DỰ KIẾN HOÀN TẤT</small>
            <strong id="avpMaintenanceEnd"></strong>
            <span id="avpMaintenanceCountdown"></span>
          </div>

          <div class="avp-maintenance-status">
            <i></i>
            <span>Hệ thống đang được cập nhật</span>
          </div>
          <small class="avp-maintenance-foot">Trang sẽ tự mở lại khi quá trình bảo trì kết thúc.</small>
        </div>`;
      document.body.appendChild(root);
    }

    document.documentElement.classList.add("avp-maintenance-active");
    root.querySelector("#avpMaintenanceTitle").textContent=escText(row.title||"Website đang được bảo trì");
    root.querySelector("#avpMaintenanceMessage").textContent=escText(row.message||"Website đang được cập nhật. Vui lòng quay lại sau.");

    const timeBox=root.querySelector("#avpMaintenanceTime");
    const endEl=root.querySelector("#avpMaintenanceEnd");
    const countEl=root.querySelector("#avpMaintenanceCountdown");
    const hasEnd=!!row.estimated_end && !!formatEnd(row.estimated_end);

    timeBox.hidden=!hasEnd;
    if(hasEnd){
      endEl.textContent=formatEnd(row.estimated_end);
      countEl.hidden=row.show_countdown===false;

      clearInterval(countdownTimer);
      const tick=()=>{
        if(row.show_countdown===false) return;
        countEl.textContent=countdownText(row.estimated_end);
      };
      tick();
      countdownTimer=setInterval(tick,1000);
    }
  }

  function mountAdminBadge(){
    if(document.getElementById("avpMaintenanceAdminBadge")) return;
    const b=document.createElement("a");
    b.id="avpMaintenanceAdminBadge";
    b.className="avp-maintenance-admin-badge";
    b.href="admin.html";
    b.textContent="🛠️ BẢO TRÌ ĐANG BẬT";
    b.title="Bạn là Admin nên website không bị khóa trên tài khoản này.";
    document.body.appendChild(b);
  }

  async function checkMaintenance(){
    if(operatorPages.has(page)) return;

    const client=await waitClient();
    if(!client) return;

    try{
      const {data,error}=await client.rpc("site_maintenance_public_v83");
      if(error) throw error;
      const row=Array.isArray(data)?data[0]:data;
      const enabled=!!row?.enabled;

      if(!enabled){
        document.getElementById("avpMaintenanceAdminBadge")?.remove();
        if(lastEnabled && document.getElementById("avpSiteMaintenance")){
          removeOverlay(true);
        }else{
          lastEnabled=false;
          removeOverlay(false);
        }
        return;
      }

      if(await isAdmin(client)){
        lastEnabled=true;
        removeOverlay(false);
        mountAdminBadge();
        return;
      }

      document.getElementById("avpMaintenanceAdminBadge")?.remove();
      mountOverlay(row||{});
    }catch(err){
      console.warn("[AVP maintenance] check failed:",err);
      /* Fail-open intentionally. */
    }
  }

  function boot(){
    checkMaintenance();
    clearInterval(timer);
    timer=setInterval(checkMaintenance,CHECK_MS);
    document.addEventListener("visibilitychange",()=>{
      if(document.visibilityState==="visible") checkMaintenance();
    });
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",boot,{once:true});
  }else{
    boot();
  }
})();


/* Legacy robot auto-loader removed. Site navigation is now handled by site-navigation-v1.js. */

/* === AVP site motion (visual only — no data) === */
(function () {
  try {
    if (!document.getElementById("avpSiteMotionCss")) {
      var link = document.createElement("link");
      link.id = "avpSiteMotionCss";
      link.rel = "stylesheet";
      link.href = "avp-site-motion.css?v=20261030-motion-sync2";
      document.head.appendChild(link);
    }
    var page=(location.pathname.split("/").pop()||"").toLowerCase();
    if(/practice-video|practice-grader|index\.html|^$/.test(page)) return;
    if(document.querySelector('script[src*="home-page-motion"]')) return;
    if (!document.querySelector('script[src*="avp-site-motion.js"]') && !window.__avpSiteMotionV94 && !window.__avpSiteMotion) {
      var s = document.createElement("script");
      s.src = "avp-site-motion.js?v=20261030-motion-sync2";
      s.defer = true;
      document.head.appendChild(s);
    }
  } catch (e) {}
})();

/* Chuyển trang/zoom do avp-site-motion.js quản lý duy nhất. */



(function(){
  document.addEventListener("DOMContentLoaded", function(){
    const nav = document.querySelector(".top-simple-nav");
    const toggle = document.querySelector(".top-mobile-toggle");
    if(nav && nav.parentNode !== document.body){
      document.body.insertBefore(nav, document.body.firstChild);
    } else if(nav && document.body.firstElementChild !== nav){
      document.body.insertBefore(nav, document.body.firstChild);
    }

    function closeMenu(){
      if(!nav || !toggle) return;
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Mở menu");
      toggle.innerHTML = "☰";
    }

    function openMenu(){
      if(!nav || !toggle) return;
      nav.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Đóng menu");
      toggle.innerHTML = "✕";
    }
    /* AVP V62: bỏ hẳn brand phụ "📗 Learn Excel". */
    if(nav){
      nav.querySelectorAll(".top-simple-brand").forEach(function(el){ el.remove(); });

      /* V82: một header duy nhất, chỉ 4 hướng chính.
         Trang con được đánh dấu theo khu thay vì nhồi thêm link vào header. */
      const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
      const groups={
        home:new Set(["","index.html","gioithieu.html","lienhe.html","terms.html","privacy.html","disclaimer.html","open-source.html"]),
        learn:new Set([
          "excel.html",
          "phimtatexcel.html","congthucexcel.html","filtersort.html","pivottable.html",
          "bieudopareto.html","baocaoexcel.html","excel-nang-cao.html",
          "power-query-course.html","power-pivot-dax.html","dashboard-dong.html",
          "vba-macro.html","solver-whatif.html","focus-room.html","certificate.html"
        ]),
        ai:new Set(["ai.html"]),
        practice:new Set([
          "practice-video.html","practice-youtube.html","practice-lab.html",
          "baitapexcel.html","excel-race.html"
        ]),
        tools:new Set([
          "tools-center.html","excel-mobile.html","formula-finder.html",
          "qc-dashboard.html","playground.html"
        ])
      };

      let current=null;
      Object.keys(groups).some(function(key){
        if(groups[key].has(page)){ current=key; return true; }
        return false;
      });

      nav.querySelectorAll("[data-avp-nav]").forEach(function(link){
        const on=link.dataset.avpNav===current;
        link.classList.toggle("is-current",on);
        if(on) link.setAttribute("aria-current","page");
        else link.removeAttribute("aria-current");
      });
    }

    if(nav && !nav.querySelector(".auth-nav-slot")){
      const slot=document.createElement("span");
      slot.className="auth-nav-slot";
      const links=nav.querySelector(".top-simple-links");
      if(links) links.appendChild(slot);
    }

    if(nav && toggle){
      toggle.setAttribute("type", "button");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Mở menu");
      toggle.innerHTML = "☰";

      toggle.addEventListener("click", function(e){
        e.stopPropagation();
        if(nav.classList.contains("open")){
          closeMenu();
        }else{
          openMenu();
        }
      });

      document.addEventListener("click", function(e){
        if(nav.classList.contains("open") && !nav.contains(e.target)){
          closeMenu();
        }
      });

      nav.querySelectorAll(".top-simple-links a, .top-simple-links button").forEach(function(el){
        el.addEventListener("click", function(){
          if(window.innerWidth <= 900){
            setTimeout(closeMenu, 120);
          }
        });
      });

      window.addEventListener("resize", function(){
        if(window.innerWidth > 900){
          closeMenu();
        }
      });
    }
  });
})();


/* ===== GLOBAL BACK TO TOP ===== */
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    let button = document.querySelector(".avp-back-to-top");

    /* Reuse old button if page already has one */
    const oldButton = document.getElementById("backToTop");
    if (!button && oldButton) {
      oldButton.classList.add("avp-back-to-top");
      oldButton.removeAttribute("onclick");
      oldButton.textContent = "↑";
      button = oldButton;
    }

    /* Create button on pages that do not have one */
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "avp-back-to-top";
      button.setAttribute("aria-label", "Cuộn lên đầu trang");
      button.setAttribute("title", "Lên đầu trang");
      button.textContent = "↑";
      document.body.appendChild(button);
    }

    function updateBackToTop(){
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      if (scrollTop > 320) {
        button.classList.add("show");
      } else {
        button.classList.remove("show");
      }
    }

    button.addEventListener("click", function(){
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();
  });
})();


/* ===== SMART PARENT NAVIGATION ===== */
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    const pageName = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if(pageName === "" || pageName === "index.html") return;
    return; /* nav already has Trang chủ — no second back button */

    /*
      Không dùng history.back() cho điều hướng học tập.
      Một URL có thể được mở từ Trang chủ, Search, Dashboard, QR hoặc link trực tiếp;
      history.back() vì thế dễ đưa người học tới một nơi không liên quan.
    */
    const coreTopicPages = new Set([
      "phimtatexcel.html","congthucexcel.html","pivottable.html",
      "bieudopareto.html","filtersort.html","baocaoexcel.html"
    ]);
    if(coreTopicPages.has(pageName)) return;

    const parentRoutes = {
      "phimtatexcel.html": ["excel.html", "6 chuyên đề Excel"],
      "congthucexcel.html": ["excel.html", "6 chuyên đề Excel"],
      "pivottable.html": ["excel.html", "6 chuyên đề Excel"],
      "bieudopareto.html": ["excel.html", "6 chuyên đề Excel"],
      "filtersort.html": ["excel.html", "6 chuyên đề Excel"],
      "baocaoexcel.html": ["excel.html", "6 chuyên đề Excel"],

      "power-query-course.html": ["excel-nang-cao.html", "Kỹ năng nâng cao"],
      "power-pivot-dax.html": ["excel-nang-cao.html", "Kỹ năng nâng cao"],
      "dashboard-dong.html": ["excel-nang-cao.html", "Kỹ năng nâng cao"],
      "vba-macro.html": ["excel-nang-cao.html", "Kỹ năng nâng cao"],
      "solver-whatif.html": ["excel-nang-cao.html", "Kỹ năng nâng cao"],

      "certificate.html": ["learning-coach.html", "Bài học hôm nay"],
      "master-learning.html": ["index.html", "Trang chủ"],
      "practice-lab.html": ["index.html", "Trang chủ"],
      "formula-finder.html": ["tools-center.html", "Công cụ"],
      "tools-center.html": ["index.html", "Trang chủ"],
      "qc-dashboard.html": ["tools-center.html", "Công cụ"],
      "excel-mobile.html": ["tools-center.html", "Công cụ"],
      "playground.html": ["tools-center.html", "Công cụ"],
      "excel.html": ["index.html", "Trang chủ"],
      "excel-nang-cao.html": ["index.html", "Trang chủ"],
      "gioithieu.html": ["index.html", "Trang chủ"],
      "lienhe.html": ["index.html", "Trang chủ"],
      "auth.html": ["index.html", "Trang chủ"],
      "privacy.html": ["index.html", "Trang chủ"],
      "terms.html": ["index.html", "Trang chủ"],
      "disclaimer.html": ["index.html", "Trang chủ"],
      "open-source.html": ["index.html", "Trang chủ"]
    };

    const route = parentRoutes[pageName] || ["index.html", "Trang chủ"];
    const wrap = document.createElement("div");
    wrap.className = "avp-page-back-wrap";

    const link = document.createElement("a");
    link.className = "avp-page-back";
    link.href = route[0];
    link.setAttribute("aria-label", "Về " + route[1]);
    link.innerHTML = '<span class="avp-page-back-arrow">←</span><span>Về ' + route[1] + '</span>';
    wrap.appendChild(link);

    const nav = document.querySelector(".top-simple-nav");
    const bannerSelectors = [
      ".lp-hero", ".avp-hero", ".page-header", ".qc-hero", ".tools-hero",
      ".profile-hero", ".dashboard-hero", ".achievement-hero", ".playground-hero",
      ".formula-hero", ".hero", "body > header"
    ];
    let banner = null;
    for(const selector of bannerSelectors){
      const found = document.querySelector(selector);
      if(found){ banner = found; break; }
    }
    if(banner){
      if(nav && (banner.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING)){
        nav.insertAdjacentElement("afterend", wrap);
      }else{
        banner.insertAdjacentElement("afterend", wrap);
      }
    }else if(nav){
      nav.insertAdjacentElement("afterend", wrap);
    }else{
      document.body.insertAdjacentElement("afterbegin", wrap);
    }
  });
})();

document.addEventListener("DOMContentLoaded", function(){
  document.querySelectorAll(".site-footer-brand").forEach(function(el){
    el.textContent = "© 2026 Learn Excel with Anh Van Phong. Bảo lưu mọi quyền.";
  });
});

(function(){
  try{
    var page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
    if(page && page!=="index.html")return;
    if(document.getElementById("avpMiniBounceCss"))return;
    var l=document.createElement("link");
    l.id="avpMiniBounceCss";
    l.rel="stylesheet";
    l.href="home-mini-bounce.css?v=20260831-desk";
    document.head.appendChild(l);
  }catch(e){}
})();

/* Redirect the retired Skill Map entry to the new daily learning page. */
document.addEventListener("DOMContentLoaded",function(){
  document.querySelectorAll('.top-simple-links a[data-avp-nav="learn"]').forEach(function(a){
    a.href="learning-coach.html";
  });
});


/* AVP VERTICAL NAVIGATION V2 — replaces legacy horizontal header and robot launcher. */
(function(){
  if(window.self!==window.top)return;
  function loadAsset(tag,selector,src){
    if(document.querySelector(selector))return;
    var el=document.createElement(tag);
    if(tag==="link"){el.rel="stylesheet";el.href=src;}
    else{el.src=src;el.defer=true;}
    el.dataset.avpSiteNavigationV2="1";
    (document.head||document.documentElement).appendChild(el);
  }
  loadAsset("link",'link[data-avp-site-navigation-v2-css]',"site-navigation-v2.css?v=20261031-1");
  loadAsset("script",'script[data-avp-site-navigation-v2-js]',"site-navigation-v2.js?v=20261031-1");
})();
