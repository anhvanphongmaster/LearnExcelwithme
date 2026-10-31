(()=>{'use strict';
if(window.__AVP_FLOATING_MAP__)return;window.__AVP_FLOATING_MAP__=true;
const KEY='avp_map_mini_enabled_v1',LAST='avp_learning_map_last_location_v1';
const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
const isHome=page==='index.html'||page==='';
const style=document.createElement('style');style.textContent=`
@view-transition{navigation:auto}
::view-transition-old(root){animation:avp-page-out .34s cubic-bezier(.2,.75,.25,1) both}
::view-transition-new(root){animation:avp-page-in .48s cubic-bezier(.16,1,.3,1) both}
@keyframes avp-page-out{to{opacity:.72;filter:blur(2px)}}
@keyframes avp-page-in{from{opacity:.72;filter:blur(2px)}to{opacity:1;filter:blur(0)}}
#avpMapOverlay{position:fixed;inset:0;z-index:2147483000;background:#e9f0e6;opacity:0;visibility:hidden;transform:scale(.94);clip-path:inset(4% 4% 4% 4% round 28px);transition:opacity .42s cubic-bezier(.16,1,.3,1),transform .58s cubic-bezier(.16,1,.3,1),clip-path .58s cubic-bezier(.16,1,.3,1),visibility .58s}
#avpMapOverlay.open{opacity:1;visibility:visible;transform:scale(1);clip-path:inset(0 round 0)}
#avpMapOverlay iframe{width:100%;height:100%;border:0;display:block}
#avpMapClose{position:absolute;right:20px;top:18px;z-index:3;width:44px;height:44px;border:1px solid #cad8c8;border-radius:50%;background:#fffffff0;color:#24422f;font-size:25px;cursor:pointer;box-shadow:0 8px 24px #173a2424}
#avpMapMini{position:fixed;z-index:2147482000;right:0;top:42%;width:72px;height:112px;border:1px solid #b9d0b7;border-right:0;border-radius:18px 0 0 18px;background:linear-gradient(145deg,#f8fff4,#dcebd7);box-shadow:0 12px 34px #193d2833;display:none;align-items:center;justify-content:center;flex-direction:column;gap:5px;color:#244b32;cursor:grab;touch-action:none;user-select:none;transition:top .22s cubic-bezier(.2,.8,.2,1),transform .32s cubic-bezier(.16,1,.3,1),box-shadow .32s}
#avpMapMini.show{display:flex;animation:avp-mini-in .62s cubic-bezier(.16,1,.3,1) both}
@keyframes avp-mini-in{0%{opacity:0;transform:translate(100%,12px) scale(.65)}65%{opacity:1;transform:translate(-8px,0) scale(1.04)}100%{opacity:1;transform:translate(0,0) scale(1)}}
#avpMapMini:active{cursor:grabbing;box-shadow:0 16px 40px #193d2844}
#avpMapMini .avp-mini-art{width:48px;height:62px;border-radius:10px;background:radial-gradient(circle at 30% 24%,#78ae7d 0 5px,transparent 6px),radial-gradient(circle at 70% 42%,#78ae7d 0 6px,transparent 7px),radial-gradient(circle at 40% 76%,#78ae7d 0 5px,transparent 6px),linear-gradient(135deg,#e5f0df,#c6dfc0);border:1px solid #aac7a5;position:relative;overflow:hidden}
#avpMapMini .avp-mini-art:after{content:"";position:absolute;width:70px;height:35px;border:3px dotted #4d9860;border-radius:50%;transform:rotate(-32deg);left:-12px;top:13px}
#avpMapMini b{font-size:10px;letter-spacing:.04em}#avpMapMini small{font-size:9px;color:#64806a}
@media(max-width:650px){#avpMapClose{right:12px;top:12px;width:40px;height:40px}#avpMapMini{width:62px;height:98px}#avpMapMini .avp-mini-art{width:40px;height:52px}}
`;document.head.append(style);
const overlay=document.createElement('div');overlay.id='avpMapOverlay';overlay.setAttribute('aria-hidden','true');overlay.innerHTML='<button id="avpMapClose" type="button" aria-label="Đóng bản đồ">×</button><iframe title="Bản đồ hành trình" src="learning-map.html?embed=1&v=3"></iframe>';document.body.append(overlay);
const mini=document.createElement('button');mini.id='avpMapMini';mini.type='button';mini.setAttribute('aria-label','Mở lại bản đồ hành trình');mini.innerHTML='<span class="avp-mini-art"></span><b>BẢN ĐỒ</b><small>Hành trình</small>';document.body.append(mini);
function open(){overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');mini.classList.remove('show');}
function close(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');}
function enableMini(){try{localStorage.setItem(KEY,'1')}catch(_){}if(!isHome)mini.classList.add('show')}
function go(url,id){try{localStorage.setItem(KEY,'1');if(id)localStorage.setItem(LAST,id)}catch(_){}overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');if(url)location.href=url}
document.getElementById('avpMapClose').addEventListener('click',close);
mini.addEventListener('click',()=>{if(!dragged)open()});
let startY=0,startTop=0,dragging=false,dragged=false;
mini.addEventListener('pointerdown',e=>{dragging=true;dragged=false;startY=e.clientY;startTop=mini.getBoundingClientRect().top;mini.setPointerCapture(e.pointerId)});
mini.addEventListener('pointermove',e=>{if(!dragging)return;const dy=e.clientY-startY;if(Math.abs(dy)>5)dragged=true;const max=innerHeight-mini.offsetHeight-8;mini.style.top=Math.max(8,Math.min(max,startTop+dy))+'px'});
mini.addEventListener('pointerup',()=>{if(!dragging)return;dragging=false;if(dragged){const t=mini.getBoundingClientRect().top;mini.style.top=Math.max(8,Math.min(innerHeight-mini.offsetHeight-8,t))+'px';setTimeout(()=>dragged=false,80)}});
mini.addEventListener('pointercancel',()=>dragging=false);
window.addEventListener('message',e=>{if(e.origin!==location.origin||e.data?.type!=='AVP_MAP_NAVIGATE')return;go(e.data.url,e.data.id)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))close()});
window.AVPFloatingMap={open,close,go,enableMini};
try{if(localStorage.getItem(KEY)==='1'&&!isHome)mini.classList.add('show')}catch(_){}
document.addEventListener('click',e=>{const card=e.target.closest?.('[data-open-learning-map]');if(card){e.preventDefault();open()}});
})();