(function(){
 const LAST='avp_cloud_last_sync_v11';
 function fmt(ts){if(!ts)return 'Chưa đồng bộ';const d=new Date(+ts);return d.toLocaleString('vi-VN',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit'});}
 function ensureChip(){if(document.getElementById('v11CloudChip'))return;const el=document.createElement('div');el.id='v11CloudChip';el.className='v11-cloud-chip';el.dataset.state='guest';el.innerHTML='<i class="v11-dot"></i><span>☁️ Đăng nhập để đồng bộ tiến độ</span>';document.body.appendChild(el);}
 async function state(){
   ensureChip(); const chip=document.getElementById('v11CloudChip');
   if(!window.AVP_SUPABASE_CONFIGURED||!window.avpCloudSync){chip.dataset.state='error';chip.querySelector('span').textContent='⚠️ Cloud chưa sẵn sàng';return null;}
   const u=await window.avpCloudSync.getUser();
   if(!u){chip.dataset.state='guest';chip.querySelector('span').innerHTML='☁️ <a href="auth.html" style="color:inherit">Đăng nhập để đồng bộ</a>';return null;}
   chip.dataset.state='synced';chip.querySelector('span').textContent='✓ Tiến độ có thể đồng bộ cloud';return u;
 }
 function addCenter(){
   const host=document.getElementById('personalDashboard')||document.querySelector('.profile-main')||document.querySelector('main');
   if(!host||document.getElementById('v11SyncCenter'))return;
   const card=document.createElement('section');card.id='v11SyncCenter';card.className='v11-sync-card';
   card.innerHTML='<div class="v11-sync-head"><div><span class="v11-sync-kicker">CLOUD LEARNING</span><h2>☁️ Đồng bộ tiến độ</h2><p>XP, quiz, huy hiệu, streak và bài đã học theo bạn sang thiết bị khác.</p></div></div><div class="v11-sync-state"><div class="v11-sync-stat"><small>TÀI KHOẢN</small><strong id="v11Account">Đang kiểm tra...</strong></div><div class="v11-sync-stat"><small>LẦN ĐỒNG BỘ CUỐI</small><strong id="v11Last">'+fmt(localStorage.getItem(LAST))+'</strong></div><div class="v11-sync-stat"><small>CHẾ ĐỘ DỰ PHÒNG</small><strong>Local + Cloud</strong></div></div><div class="v11-sync-actions"><button class="v11-sync-btn" id="v11SyncNow">Đồng bộ ngay</button><a class="v11-sync-btn secondary" href="auth.html" id="v11LoginLink">Đăng nhập</a></div><p class="v11-sync-note">Khi mất mạng, website vẫn lưu trên máy và sẽ đồng bộ lại khi có kết nối.</p>';
   if(host.id==='personalDashboard') host.prepend(card); else host.insertBefore(card,host.firstChild);
   const btn=card.querySelector('#v11SyncNow');
   btn.onclick=async()=>{if(!window.avpCloudSync)return;btn.disabled=true;btn.textContent='Đang đồng bộ...';const ok=await window.avpCloudSync.syncProgressToCloud();btn.disabled=false;btn.textContent=ok?'✓ Đã đồng bộ':'Thử lại';setTimeout(()=>btn.textContent='Đồng bộ ngay',1500)};
 }
 async function hydrate(){const u=await state();const a=document.getElementById('v11Account'),login=document.getElementById('v11LoginLink');if(a)a.textContent=u?(u.email||'Đã đăng nhập'):'Chưa đăng nhập';if(login)login.style.display=u?'none':'inline-flex';}
 document.addEventListener('DOMContentLoaded',()=>{ensureChip();addCenter();setTimeout(hydrate,200)});
 window.addEventListener('avp:cloud-sync-status',e=>{ensureChip();const chip=document.getElementById('v11CloudChip'),s=e.detail?.status||'idle';chip.dataset.state=s;chip.querySelector('span').textContent=s==='syncing'?'☁️ Đang đồng bộ...':s==='synced'?'✓ Đã lưu tiến độ lên cloud':s==='error'?'⚠️ Đồng bộ lỗi — dữ liệu vẫn lưu trên máy':'☁️ Đồng bộ';const last=document.getElementById('v11Last');if(last&&s==='synced')last.textContent=fmt(e.detail?.at||Date.now());});
 window.addEventListener('online',()=>{if(window.avpCloudSync)window.avpCloudSync.syncProgressToCloud()});
})();
