/* AVP Vertical Navigation V1 — replaces the horizontal header and floating robot. */
(function(){
  "use strict";
  if(window.__AVP_VERTICAL_NAV_V1__)return;
  window.__AVP_VERTICAL_NAV_V1__=true;
  if(window.self!==window.top)return;

  const $=(s,r=document)=>r.querySelector(s);
  const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  const icon={
    home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg>',
    learn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 16H20"/></svg>',
    library:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h4v16H4zM10 4h4v16h-4zM16 4h4v16h-4z"/></svg>',
    practice:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h16v14H4z"/><path d="m10 9 5 3-5 3z"/></svg>',
    tools:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m14 7 3-3 3 3-3 3"/><path d="m3 21 11-11"/><path d="M7 4 4 7l13 13 3-3z"/></svg>',
    community:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    ai:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="15" rx="3"/><path d="M8 10h.01M16 10h.01M8 15h8M12 19v3"/></svg>',
    chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>',
    user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>'
  };
  const navItems=[
    {section:"TỔNG QUAN",items:[["index.html","Trang chủ","home"],["learning-coach.html","Lộ trình học","learn"]]},
    {section:"HỌC TẬP",items:[["excel-library.html","Thư viện kiến thức","library"],["practice-video.html","Thực hành","practice"]]},
    {section:"KHÁM PHÁ",items:[["tools-center.html","Công cụ","tools"],["community.html","Cộng đồng","community"]]},
    {section:"TRỢ LÝ",items:[["ai.html","Chat AI","ai"],["#chat-admin","Chat với Admin","chat","action"]]}
  ];
  const oldNav=document.querySelector(".top-simple-nav");
  const oldAuth=oldNav?.querySelector(".auth-nav-slot")||document.querySelector(".auth-nav-slot");
  const oldTheme=oldNav?.querySelector("#themeToggle")||document.getElementById("themeToggle");
  document.querySelectorAll(".top-simple-nav").forEach(n=>n.remove());
  document.querySelectorAll("#avpEdgeLauncher,.avp-edge-launcher,.avp-hub-fab,#avpEdgeMiniPreview,.avp-edge-mini-preview-v2,.avp-hub-backdrop").forEach(n=>n.remove());

  const trigger=document.createElement("button");
  trigger.className="avp-nav-trigger";
  trigger.type="button";
  trigger.setAttribute("aria-label","Mở điều hướng");
  trigger.setAttribute("aria-expanded","false");
  trigger.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
  const backdrop=document.createElement("div");
  backdrop.className="avp-nav-backdrop";
  backdrop.innerHTML='<aside class="avp-nav-drawer" role="dialog" aria-modal="true" aria-label="Điều hướng website"><div class="avp-nav-head"><a class="avp-nav-brand" href="index.html"><img src="avp-logo.svg" alt=""><span class="avp-nav-brand-copy"><strong>Anh Văn Phòng</strong><small>LEARN EXCEL WITH ME</small></span></a><button class="avp-nav-close" type="button" aria-label="Đóng menu">×</button></div><button class="avp-nav-search" type="button">'+icon.search+'<span>Tìm bài học, công cụ, công thức...</span></button><div class="avp-nav-content"></div><div class="avp-nav-footer"><a class="avp-nav-account" href="auth.html?tab=login">'+icon.user+'<span class="auth-nav-slot"></span></a></div></aside>';
  document.body.append(trigger,backdrop);
  const drawer=$(".avp-nav-drawer",backdrop),content=$(".avp-nav-content",drawer);
  const authSlot=$(".auth-nav-slot",drawer);
  if(oldAuth&&oldAuth!==authSlot){authSlot.replaceWith(oldAuth);}
  if(!$(".auth-nav-slot a",drawer))authSlot.innerHTML='<a href="auth.html?tab=login">Tài khoản / Đăng nhập</a>';

  navItems.forEach(group=>{
    const section=document.createElement("section");section.className="avp-nav-section";
    const label=document.createElement("span");label.className="avp-nav-section-label";label.textContent=group.section;
    const list=document.createElement("div");list.className="avp-nav-list";
    group.items.forEach(item=>{
      const isAction=item[3]==="action";
      const el=document.createElement(isAction?"button":"a");
      el.className=isAction?"avp-nav-action":"avp-nav-link";
      if(isAction){el.type="button";el.dataset.navAction="chat-admin";}
      else{el.href=item[0];if(page===item[0]||(item[0]==="learning-coach.html"&&/learning-chapter|quick-learn|professional-track/.test(page)))el.setAttribute("aria-current","page");}
      el.innerHTML='<span class="avp-nav-icon">'+icon[item[2]]+'</span><span>'+item[1]+'</span>';
      list.appendChild(el);
    });
    section.append(label,list);content.appendChild(section);
  });

  function open(){backdrop.classList.add("is-open");trigger.setAttribute("aria-expanded","true");document.body.classList.add("avp-nav-open");$(".avp-nav-close",drawer).focus();}
  function close(){backdrop.classList.remove("is-open");trigger.setAttribute("aria-expanded","false");document.body.classList.remove("avp-nav-open");trigger.focus();}
  trigger.addEventListener("click",open);
  $(".avp-nav-close",drawer).addEventListener("click",close);
  backdrop.addEventListener("click",e=>{if(e.target===backdrop)close();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&backdrop.classList.contains("is-open"))close();});
  drawer.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>close()));
  $(".avp-nav-search",drawer).addEventListener("click",()=>{
    close();
    if(typeof window.openGlobalSearch==="function"){window.openGlobalSearch();return;}
    let s=document.querySelector('script[src*="global-search.js"]');
    if(!s){s=document.createElement("script");s.src="global-search.js?v=20261031-nav1";s.async=true;document.head.appendChild(s);}
    s.addEventListener("load",()=>window.openGlobalSearch?.(),{once:true});
  });
  async function openAdminChat(){
    close();
    if(typeof window.AVPAdminChatOpen==="function"){window.AVPAdminChatOpen();return;}
    let s=document.querySelector('script[data-avp-admin-chat],script[src*="admin-chat.js"]');
    if(!s){s=document.createElement("script");s.src="admin-chat.js?v=20261031-nav1";s.async=true;document.head.appendChild(s);}
    for(let i=0;i<120&&!window.AVPAdminChatOpen;i++)await new Promise(r=>setTimeout(r,100));
    if(window.AVPAdminChatOpen)window.AVPAdminChatOpen();
    else window.dispatchEvent(new CustomEvent("avp:admin-chat-request-open"));
  }
  $('[data-nav-action="chat-admin"]',drawer).addEventListener("click",openAdminChat);
  if(oldTheme){oldTheme.classList.add("avp-nav-theme");$(".avp-nav-footer",drawer).appendChild(oldTheme);}
  window.AVPVerticalNavigation={open,close};
})();
