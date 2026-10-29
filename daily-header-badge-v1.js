/* AVP Daily Navigation v2 — one recommended lesson per day; no legacy badge. */
(function(){
 'use strict';
 if(window.__AVP_DAILY_NAV_V2__)return;
 window.__AVP_DAILY_NAV_V2__=true;
 function loadAdminChat(){
  if(window.__AVP_ADMIN_CHAT_LOADED__||document.querySelector('script[data-avp-admin-chat]'))return;
  var s=document.createElement('script');s.src='admin-chat.js?v=20260830-v45presence';s.defer=true;s.dataset.avpAdminChat='1';
  s.onerror=function(){console.warn('[AVP chat] Không tải được admin-chat.js');};
  (document.head||document.documentElement).appendChild(s);
 }
 function ensureLink(){
  var nav=document.querySelector('.top-simple-links');if(!nav)return;
  var link=document.getElementById('avpDailyHeaderLinkV1');
  if(!link){
   link=document.createElement('a');link.id='avpDailyHeaderLinkV1';link.href='learning-coach.html';link.textContent='Hôm nay';link.setAttribute('data-avp-nav','today');
   var learn=nav.querySelector('[data-avp-nav="learn"]');
   if(learn&&learn.parentNode===nav)learn.insertAdjacentElement('afterend',link);else nav.insertBefore(link,nav.firstChild);
  }
  var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  link.classList.toggle('is-current',page==='learning-coach.html');
  if(page==='learning-coach.html')link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
 }
 function boot(){
  loadAdminChat();ensureLink();
  var nav=document.querySelector('.top-simple-links');
  if(nav&&!nav.__avpDailyNavObserver){nav.__avpDailyNavObserver=true;new MutationObserver(ensureLink).observe(nav,{childList:true});}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();