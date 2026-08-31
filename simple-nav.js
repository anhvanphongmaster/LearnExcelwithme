
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
   V89 — GLOBAL CTA SYSTEM
   One semantic CTA palette for the whole website.
   ========================================================= */
(function loadAvpCtaSystem(){
  if(document.getElementById("avpCtaSystemCss")) return;

  const link=document.createElement("link");
  link.id="avpCtaSystemCss";
  link.rel="stylesheet";
  link.href="avp-cta-system.css?v=20260831-v93";
  document.head.appendChild(link);

  if(!document.getElementById("avpCtaSystemJs")){
    const s=document.createElement("script");
    s.id="avpCtaSystemJs";
    s.src="avp-cta-system.js?v=20260831-v93";
    s.defer=true;
    document.head.appendChild(s);
  }
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


/* Ensure learning hub FAB on pages missing avp-core */
(function(){
  try{
    const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
    const noCore=new Set(["certificate.html"]);
    if(!noCore.has(page) && !document.querySelector('script[src="avp-core.js"],script[src*="/avp-core.js"]')){
      if(!document.querySelector('link[href="avp-core.css"]')){
        var l=document.createElement("link");
        l.rel="stylesheet"; l.href="avp-core.css";
        document.head.appendChild(l);
      }
      var s=document.createElement("script");
      s.src="avp-core.js"; s.defer=true;
      document.head.appendChild(s);
    }
  }catch(e){}
})();

/* === AVP site motion (visual only — no data) === */
(function () {
  try {
    if (!document.getElementById("avpSiteMotionCss")) {
      var link = document.createElement("link");
      link.id = "avpSiteMotionCss";
      link.rel = "stylesheet";
      link.href = "avp-site-motion.css?v=20260831-v94c";
      document.head.appendChild(link);
    }
    if (!document.querySelector('script[src*="avp-site-motion.js"]') && !window.__avpSiteMotionV94 && !window.__avpSiteMotion) {
      var s = document.createElement("script");
      s.src = "avp-site-motion.js?v=20260831-v94c";
      s.defer = true;
      document.head.appendChild(s);
    }
  } catch (e) {}
})();

/* Zoom copy V56 — file riêng, luôn gắn cuối, không phụ thuộc vá cũ */
(function () {
  try {
    if (document.querySelector('script[src*="avp-zoom-copy-v56.js"]')) return;
    var s = document.createElement("script");
    s.src = "avp-zoom-copy-v56.js?v=20260831-b";
    s.defer = true;
    document.head.appendChild(s);
  } catch (e) {}
})();



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
          "skill-map.html","master-learning.html","learning-path.html","excel.html",
          "phimtatexcel.html","congthucexcel.html","filtersort.html","pivottable.html",
          "bieudopareto.html","baocaoexcel.html","excel-nang-cao.html",
          "power-query-course.html","power-pivot-dax.html","dashboard-dong.html",
          "vba-macro.html","solver-whatif.html","focus-room.html","certificate.html"
        ]),
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

      "certificate.html": ["skill-map.html", "Skill Map"],
      "master-learning.html": ["index.html", "Trang chủ"],
      "learning-path.html": ["skill-map.html", "Skill Map"],
      "practice-lab.html": ["index.html", "Trang chủ"],
      "dashboard.html": ["index.html", "Trang chủ"],
      "profile.html": ["dashboard.html", "Hồ sơ & Thành tích"],
      "achievements.html": ["dashboard.html", "Hồ sơ & Thành tích"],
      "achievement-learning.html": ["achievements.html", "Thành tích"],
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

/* ===== UNIFIED LESSON PATH NAVIGATION ===== */
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    const current = (location.pathname.split("/").pop() || "").toLowerCase();
    const topics = [
      ["excel.html", "Excel cơ bản", "Beginner"],
      ["phimtatexcel.html", "Phím tắt", "Beginner"],
      ["congthucexcel.html", "Công thức", "Beginner"],
      ["filtersort.html", "Filter & Sort", "Beginner"],
      ["pivottable.html", "PivotTable", "Analyst"],
      ["bieudopareto.html", "Pareto", "Analyst"],
      ["baocaoexcel.html", "Báo cáo QC", "Analyst"],
      ["excel-nang-cao.html", "Excel nâng cao", "Advanced"],
      ["power-query-course.html", "Power Query", "Advanced"],
      ["power-pivot-dax.html", "Power Pivot & DAX", "Advanced"],
      ["dashboard-dong.html", "Dashboard động", "Advanced"],
      ["practice-lab.html", "Practice Lab", "Advanced"],
      ["vba-macro.html", "VBA / Macro", "Master"],
      ["solver-whatif.html", "What-If & Solver", "Master"]
    ];
    const idx = topics.findIndex(function(item){ return item[0] === current; });
    if(idx < 0) return;
    document.body.classList.add("core-topic-page");
    try{
      localStorage.setItem("avp_last_lesson_v1", JSON.stringify({
        url: topics[idx][0],
        title: topics[idx][1],
        stage: topics[idx][2],
        index: idx,
        ts: Date.now()
      }));
    }catch(e){}
    if(document.querySelector(".core-topic-nav")) return;

    const box = document.createElement("div");
    box.className = "core-topic-nav";
    box.setAttribute("aria-label", "Điều hướng lộ trình học");

    const top = document.createElement("div");
    top.className = "core-topic-top";

    const crumb = document.createElement("div");
    crumb.className = "core-topic-crumb";
    crumb.innerHTML = '<a href="index.html">Trang chủ</a><span>›</span><a href="skill-map.html">Lộ trình</a><span>›</span><strong>' + topics[idx][2] + " • " + topics[idx][1] + '</strong>';
    top.appendChild(crumb);

    const status = document.createElement("div");
    status.className = "core-topic-status";
    status.textContent = "Bài " + (idx + 1) + "/" + topics.length;
    top.appendChild(status);
    box.appendChild(top);

    const actions = document.createElement("div");
    actions.className = "core-topic-actions";

    const prev = document.createElement("a");
    prev.className = "core-topic-prev";
    if(idx > 0){
      prev.href = topics[idx-1][0];
      prev.textContent = "← " + topics[idx-1][1];
    } else {
      prev.href = "skill-map.html";
      prev.textContent = "← Skill Map";
    }
    actions.appendChild(prev);

    const all = document.createElement("a");
    all.href = "skill-map.html";
    all.className = "core-topic-all";
    all.textContent = "Skill Map";
    actions.appendChild(all);

    const next = document.createElement("a");
    next.className = "core-topic-next";
    if(idx < topics.length-1){
      next.href = topics[idx+1][0];
      next.textContent = topics[idx+1][1] + " →";
    } else {
      next.href = "skill-map.html";
      next.textContent = "Xem Skill Map →";
    }
    actions.appendChild(next);
    box.appendChild(actions);

    const header = document.querySelector("body > header, .page-header, .pq-hero, .pl-hero, .hero");
    if(header) header.insertAdjacentElement("afterend", box);
    else {
      const topNav = document.querySelector(".top-simple-nav");
      if(topNav) topNav.insertAdjacentElement("afterend", box);
      else document.body.insertAdjacentElement("afterbegin", box);
    }

    function hideDupBack(){
      document.querySelectorAll(".avp-page-back-wrap").forEach(function(el){ el.style.display = "none"; });
    }
    hideDupBack();
    setTimeout(hideDupBack, 200);
  });
})();

document.addEventListener("DOMContentLoaded", function(){
  document.querySelectorAll(".site-footer-brand").forEach(function(el){
    el.textContent = "© 2026 Learn Excel with Anh Van Phong. Bảo lưu mọi quyền.";
  });
});

(function(){
  try{
    if(document.getElementById("avpMiniBounceCss"))return;
    var l=document.createElement("link");
    l.id="avpMiniBounceCss";
    l.rel="stylesheet";
    l.href="home-mini-bounce.css?v=20260831-desk";
    document.head.appendChild(l);
  }catch(e){}
})();

(function(){
  try{
    var page=(location.pathname.split("/").pop()||"").toLowerCase();
    if(!/practice-video|practice-grader/.test(page))return;
    if(document.querySelector('script[src*="practice-grader-stars.js"]'))return;
    var s=document.createElement("script");
    s.src="practice-grader-stars.js?v=20260831-s2";
    s.defer=true;
    document.head.appendChild(s);
    if(!document.getElementById("avpPgStarCss")){
      var l=document.createElement("link");
      l.id="avpPgStarCss";
      l.rel="stylesheet";
      l.href="practice-grader.css?v=20260831-star1";
      document.head.appendChild(l);
    }
  }catch(e){}
})();
