/* AVP Site Navigation V2 — vertical drawer, replacing the horizontal header and robot launcher. */
(()=>{"use strict";
if(window.__AVP_SITE_NAV_V2__)return;window.__AVP_SITE_NAV_V2__=true;
if(window.self!==window.top)return;
const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
if(["admin.html","office-quest-admin.html","office-quest-world.html"].includes(page))return;

const oldNav=document.querySelectorAll(".top-simple-nav");
oldNav.forEach(el=>el.remove());
document.querySelectorAll("#avpEdgeLauncher,.avp-edge-launcher,.avp-hub-fab,#avpEdgeMiniPreview,.avp-edge-mini-preview-v2,.avp-hub-backdrop,#avpChatLazyRoot").forEach(el=>el.remove());
const svg={home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',learn:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 16H20"/>',library:'<path d="M4 4h4v16H4zM10 4h4v16h-4zM16 4h4v16h-4z"/>',practice:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m10 8 6 4-6 4z"/>',tools:'<path d="m14 7 3-3 3 3-3 3"/><path d="m3 21 11-11"/><path d="m7 4-3 3 13 13 3-3z"/>',community:'<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a7 7 0 0 1 14 0v2M17 4a4 4 0 0 1 0 7m1 4a6 6 0 0 1 4 6"/>',ai:'<rect x="3" y="4" width="18" height="15" rx="3"/><path d="M8 10h.01M16 10h.01M8 15h8M12 19v3"/>',chat:'<path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"/>',search:'<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>'};
const ico=n=>'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(svg[n]||svg.home)+'</svg>';
const groups=[
["TỔNG QUAN",[["index.html","Trang chủ","home"],["learning-coach.html","Lộ trình học","learn"]]],
["HỌC TẬP",[["excel.html","Học Excel","learn"],["excel-handbook.html","Cẩm nang Excel A–Z · 12 chương","library"],["excel-knowledge-library.html","Thư viện kiến thức","library"],["excel-formula-library.html","Thư viện công thức","library"],["excel-shortcut-library.html","Phím tắt Excel","library"],["excel-dictionary.html","Từ điển Excel","library"],["excel-handbook.html","Excel Handbook","library"]]],
["THỰC HÀNH",[["practice-video.html","Khu thực hành","practice"],["practice-lab.html","Practice Lab","practice"],["practice-grader.html","Bài tập tự chấm","practice"],["excel-race.html","Excel Arena","practice"]]],
["KHÁM PHÁ",[["tools-center.html","Trung tâm công cụ","tools"],["tools-library.html","Kho Tool","tools"],["community.html","Cộng đồng","community"]]],
["TRỢ GIÚP",[["#chat-ai","Chat AI","ai","ai-action"],["#chat-admin","Chat với Admin","chat","action"]]]
];
const trigger=document.createElement("button");trigger.className="avp-nav-v2-trigger";trigger.type="button";trigger.setAttribute("aria-label","Mở menu điều hướng");trigger.setAttribute("aria-expanded","false");trigger.innerHTML='<span></span><span></span><span></span>';
const shade=document.createElement("div");shade.className="avp-nav-v2-shade";shade.innerHTML='<aside class="avp-nav-v2-drawer" role="dialog" aria-modal="true" aria-label="Điều hướng website"><div class="avp-nav-v2-head"><a href="index.html" class="avp-nav-v2-brand"><img src="avp-logo.svg" alt=""><span><b>Anh Văn Phòng</b><small>LEARN EXCEL WITH ME</small></span></a><button class="avp-nav-v2-close" aria-label="Đóng menu" type="button">'+ico("close")+'</button></div><button class="avp-nav-v2-search" type="button">'+ico("search")+'<span>Tìm bài học, công cụ, công thức...</span><kbd>⌘ K</kbd></button><div class="avp-nav-v2-items" role="navigation" aria-label="Các khu vực website"></div><div class="avp-nav-v2-foot"><a class="avp-nav-v2-account" href="account.html"><span class="avp-nav-v2-account-avatar" aria-hidden="true">A</span><span class="avp-nav-v2-account-label">Tài khoản</span></a></div></aside>'
document.body.append(trigger,shade);
const drawer=shade.querySelector("aside"),nav=shade.querySelector(".avp-nav-v2-items");
groups.forEach(([label,items])=>{const section=document.createElement("section");section.className="avp-nav-v2-group";const h=document.createElement("div");h.className="avp-nav-v2-label";h.textContent=label;section.append(h);items.forEach(([href,name,iconName,type])=>{const el=document.createElement(type==="action"||type==="ai-action"?"button":"a");el.className="avp-nav-v2-link";if(type==="action"||type==="ai-action"){el.type="button";el.dataset.navAction=type==="ai-action"?"chat-ai":"chat-admin";}else{el.href=href;if(page===href)el.setAttribute("aria-current","page");}el.innerHTML='<span class="avp-nav-v2-icon">'+ico(iconName)+'</span><span class="avp-nav-v2-text">'+name+'</span>'+(type==="action"?'<b class="avp-nav-v2-unread" hidden></b>':'');section.append(el)});nav.append(section)});

function open(){shade.classList.add("is-open");trigger.setAttribute("aria-expanded","true");document.body.classList.add("avp-nav-v2-open");shade.querySelector(".avp-nav-v2-close").focus()}
function close(){shade.classList.remove("is-open");trigger.setAttribute("aria-expanded","false");document.body.classList.remove("avp-nav-v2-open");trigger.focus()}
trigger.addEventListener("click",()=>shade.classList.contains("is-open")?close():open());shade.querySelector(".avp-nav-v2-close").addEventListener("click",close);shade.addEventListener("click",e=>{if(e.target===shade)close()});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&shade.classList.contains("is-open"))close()});
shade.querySelectorAll("a").forEach(a=>a.addEventListener("click",close));
shade.querySelector(".avp-nav-v2-search").addEventListener("click",()=>{close();if(window.openGlobalSearch){window.openGlobalSearch();return}const s=document.createElement("script");s.src="global-search.js?v=20261031-nav2";s.onload=()=>window.openGlobalSearch?.();document.head.append(s)});
document.documentElement.dataset.avpTheme="light";
document.documentElement.classList.remove("avp-theme-dark");
document.documentElement.classList.add("avp-theme-light");
document.body.classList.remove("dark-mode");
try{localStorage.removeItem("theme")}catch(_){}
async function openAdminChat(){close();if(window.AVPAdminChatOpen){window.AVPAdminChatOpen();return}let s=document.querySelector('script[src*="admin-chat.js"]');if(!s){s=document.createElement("script");s.src="admin-chat.js?v=20261031-nav2";s.async=true;document.head.append(s)}for(let i=0;i<120&&!window.AVPAdminChatOpen;i++)await new Promise(r=>setTimeout(r,100));if(window.AVPAdminChatOpen)window.AVPAdminChatOpen();else window.dispatchEvent(new CustomEvent("avp:admin-chat-request-open"))}
shade.querySelector('[data-nav-action="chat-admin"]').addEventListener("click",openAdminChat);
async function openAiChat(){
  close();
  if(!document.querySelector('script[src*="ai-chat.js"]')){
    const s=document.createElement("script");s.src="ai-chat.js?v=20261031-no-robot";s.async=true;document.head.append(s);
  }
  for(let i=0;i<120&&!document.getElementById("avpAiChatPanel");i++)await new Promise(r=>setTimeout(r,100));
  if(document.getElementById("avpAiChatPanel"))window.dispatchEvent(new CustomEvent("avp:open-ai-chat"));
}
shade.querySelector('[data-nav-action="chat-ai"]').addEventListener("click",openAiChat);
async function refreshAccountAvatar(){
 const slot=shade.querySelector(".avp-nav-v2-account-avatar");
 const link=shade.querySelector(".avp-nav-v2-account");
 if(!slot||!link)return;
 let client=window.avpSupabase||window.supabaseClient;
 for(let i=0;i<50&&!client;i++){await new Promise(r=>setTimeout(r,100));client=window.avpSupabase||window.supabaseClient;}
 if(!client?.auth)return;
 try{
  const {data:{user},error}=await client.auth.getUser();
  if(error||!user){slot.textContent="A";slot.style.backgroundImage="";slot.dataset.avatar="";link.querySelector(".avp-nav-v2-account-label").textContent="Tài khoản";return;}
  const {data:profile}=await client.from("profiles").select("display_name,avatar").eq("id",user.id).maybeSingle();
  const name=String(profile?.display_name||user.user_metadata?.display_name||user.email?.split("@")[0]||"Người học");
  const avatar=String(profile?.avatar||"initial");
  slot.replaceChildren();slot.style.backgroundImage="";slot.style.backgroundSize="cover";slot.style.backgroundPosition="center";
  if(avatar.startsWith("emoji:")){slot.textContent=avatar.slice(6);}
  else if(avatar!=="initial"&&!/^https?:\/\//i.test(avatar)){
   const url=client.storage.from("community-avatars").getPublicUrl(avatar)?.data?.publicUrl;
   if(url){const img=document.createElement("img");img.src=url;img.alt="";img.loading="lazy";slot.append(img);}else slot.textContent=Array.from(name)[0]?.toLocaleUpperCase("vi-VN")||"A";
  }else if(/^https?:\/\//i.test(avatar)){
   const img=document.createElement("img");img.src=avatar;img.alt="";img.loading="lazy";slot.append(img);
  }else slot.textContent=Array.from(name)[0]?.toLocaleUpperCase("vi-VN")||"A";
  slot.dataset.avatar=avatar;
  link.querySelector(".avp-nav-v2-account-label").textContent=name;
 }catch(e){console.warn("Account avatar navigation",e);}
}
async function refreshUnread(){
  const badge=shade.querySelector(".avp-nav-v2-unread");
  const client=window.avpSupabase||window.supabaseClient;
  if(!badge||!client?.rpc)return;
  try{
    const {data,error}=await client.rpc("avp_chat_my_unread_count");
    if(error)return;
    const count=Math.max(0,Number(data)||0);
    badge.hidden=count===0;
    badge.textContent=count>9?"9+":String(count);
    badge.setAttribute("aria-label",count+" tin nhắn chưa đọc");
  }catch(_){}
}
refreshUnread();
setInterval(refreshUnread,45000);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")refreshUnread()});
const sb=window.avpSupabase||window.supabaseClient;
sb?.auth?.onAuthStateChange?.(()=>{refreshUnread();refreshAccountAvatar()});\nwindow.addEventListener("avp:auth-changed",refreshAccountAvatar);\nrefreshAccountAvatar();
window.AVPVerticalNavigation={open,close,refreshUnread};
})();