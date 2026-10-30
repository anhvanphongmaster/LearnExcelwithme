(()=>{'use strict';
const KEY='avp-display-mode';
const viewport=document.querySelector('meta[name="viewport"]');
const desktopContent='width=1200, initial-scale=0.32, minimum-scale=0.1, maximum-scale=2, user-scalable=yes';
const mobileContent='width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes';
const embedded=(()=>{try{return new URLSearchParams(location.search).get('embed')==='1'||window.self!==window.top}catch(e){return true}})();
if(embedded)return;
let mode=window.matchMedia&&window.matchMedia('(max-width: 700px)').matches?'mobile':'desktop';
try{if(localStorage.getItem(KEY+'-user-choice')==='1')mode=localStorage.getItem(KEY)||mode}catch(e){}
let applyingInitialMode=true;
function setMode(next){
 mode=next==='mobile'?'mobile':'desktop';
 document.documentElement.dataset.avpDisplayMode=mode;
 if(viewport)viewport.setAttribute('content',mode==='desktop'?desktopContent:mobileContent);
 try{localStorage.setItem(KEY,mode);if(!applyingInitialMode)localStorage.setItem(KEY+'-user-choice','1')}catch(e){}
 document.querySelectorAll('[data-avp-display-mode]').forEach(b=>{
  const active=b.dataset.avpDisplayMode===mode;
  b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));
 });
}
function install(){
 const nav=document.querySelector('.top-simple-links');
 if(nav&&!nav.querySelector('[data-avp-display-mode]')){
  const group=document.createElement('span');group.className='avp-display-switch';group.setAttribute('aria-label','Chế độ hiển thị');
  group.innerHTML='<button type="button" data-avp-display-mode="mobile" aria-pressed="false" title="Dùng giao diện điện thoại">Mobile</button><button type="button" data-avp-display-mode="desktop" aria-pressed="false" title="Dùng giao diện máy tính">Desktop</button>';
  const theme=nav.querySelector('#themeToggle');
  nav.insertBefore(group,theme||null);
  group.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.avpDisplayMode)));
 }
 setMode(mode);applyingInitialMode=false;
}
const style=document.createElement('style');
style.textContent=`
.avp-display-switch{display:inline-flex!important;align-items:center;gap:3px;padding:3px!important;border:1px solid #d9e6dd!important;border-radius:999px!important;background:#f4f8f5!important;white-space:nowrap!important}
.avp-display-switch button{appearance:none!important;border:0!important;border-radius:999px!important;background:transparent!important;color:#496554!important;padding:8px 11px!important;font:750 11px/1.1 system-ui,sans-serif!important;cursor:pointer!important}
.avp-display-switch button.is-active{background:#08794f!important;color:#fff!important;box-shadow:0 2px 7px #0b583722!important}
html[data-avp-display-mode="desktop"] body{min-width:1200px!important}
html[data-avp-display-mode="desktop"] .top-simple-nav{min-width:1200px!important}
html[data-avp-display-mode="desktop"] .top-simple-links{flex-wrap:nowrap!important}
html[data-avp-display-mode="desktop"] .top-mobile-toggle{display:none!important}
html[data-avp-display-mode="desktop"] .top-simple-links{display:flex!important}
html[data-avp-display-mode="mobile"] body{min-width:0!important}
html[data-avp-display-mode="mobile"] .avp-display-switch{margin:5px 0}
@media(max-width:700px){
 html[data-avp-display-mode="desktop"] .top-simple-nav{overflow:visible!important}
 html[data-avp-display-mode="desktop"] .top-simple-links{overflow:visible!important;gap:7px!important}
 html[data-avp-display-mode="desktop"] .avp-display-switch button{padding:7px 8px!important;font-size:10px!important}
}
`;
document.head.appendChild(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
