(function(){
 if((location.pathname.split('/').pop()||'').toLowerCase()==='admin.html')return;
 function ensureChip(){if(document.getElementById('v11CloudChip'))return;const el=document.createElement('div');el.id='v11CloudChip';el.className='v11-cloud-chip';el.dataset.state='guest';el.innerHTML='<i class="v11-dot"></i><span>☁️ Kiểm tra kết nối tài khoản...</span>';document.body.appendChild(el);}
 async function hydrate(){
   ensureChip();const chip=document.getElementById('v11CloudChip');
   if(!window.AVP_SUPABASE_CONFIGURED||!window.avpCloudSync){chip.dataset.state='error';chip.querySelector('span').textContent='⚠️ Cloud chưa sẵn sàng';return;}
   const u=await window.avpCloudSync.getUser();
   chip.dataset.state=u?'synced':'guest';
   chip.querySelector('span').textContent=u?'✓ Tài khoản đã kết nối':'☁️ Đăng nhập để kết nối tài khoản';
 }
 document.addEventListener('DOMContentLoaded',()=>{ensureChip();setTimeout(hydrate,200)});
 window.addEventListener('online',hydrate);
 window.addEventListener('avp:auth-changed',hydrate);
})();