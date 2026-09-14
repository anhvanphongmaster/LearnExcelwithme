/* AVP Daily Header Badge v1 — mirrors the existing 5-item daily pack state. */
(function(){
  'use strict';
  if(window.__AVP_DAILY_HEADER_BADGE_V1__) return;
  window.__AVP_DAILY_HEADER_BADGE_V1__=true;

  var PACKS=[
    ['b01-freeze','b13-hyperlink','t01-index-match','n01-let','c01-week-close'],
    ['b02-print-fit','b14-split-window','t02-countif-wild','n02-lambda','c02-ar-match'],
    ['b03-paste-values','b15-linked-picture','t03-textjoin','n03-filter-unique','c03-stock-gap']
  ];
  var START='2026-09-14';
  var DAILY_KEY='avp_coach_daily_v1';
  var START_KEY='avp_coach_daily_start_v1';
  var BADGE_ID='avpDailyHeaderBadgeV1';
  var LINK_ID='avpDailyHeaderLinkV1';

  function read(key,fallback){
    try{var v=JSON.parse(localStorage.getItem(key)||'null');return v==null?fallback:v;}catch(e){return fallback;}
  }
  function todayVN(){
    try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
    catch(e){return new Date().toISOString().slice(0,10);}
  }
  function dayDiff(a,b){
    var x=a.split('-').map(Number),y=b.split('-').map(Number);
    return Math.floor((Date.UTC(y[0],y[1]-1,y[2])-Date.UTC(x[0],x[1]-1,x[2]))/86400000);
  }
  function authId(){
    try{
      if(window.AVPAuthUser&&window.AVPAuthUser.id) return 'u:'+window.AVPAuthUser.id;
      if(window.__AVP_USER_ID__) return 'u:'+window.__AVP_USER_ID__;
      var keys=Object.keys(localStorage);
      for(var i=0;i<keys.length;i++){
        if(keys[i].indexOf('sb-')!==0||keys[i].indexOf('auth-token')<0) continue;
        var raw=read(keys[i],null), id=raw&&raw.user&&raw.user.id;
        if(!id&&raw&&raw.currentSession&&raw.currentSession.user) id=raw.currentSession.user.id;
        if(id) return 'u:'+id;
      }
    }catch(e){}
    try{
      var guest=localStorage.getItem('avp_coach_learner_id');
      if(guest) return 'g:'+guest;
    }catch(e){}
    return 'g';
  }
  function dailyStart(){
    var map=read(START_KEY,{}), id=authId();
    return map&&map[id]||START;
  }
  function currentPack(){
    var d=todayVN(), start=dailyStart(), n=PACKS.length, i=dayDiff(start,d)%n;
    if(i<0)i+=n;
    return {date:d,ids:PACKS[i]};
  }
  function ensureStyle(){
    if(document.getElementById('avpDailyHeaderBadgeStyleV1')) return;
    var s=document.createElement('style');s.id='avpDailyHeaderBadgeStyleV1';
    s.textContent='#'+BADGE_ID+'{display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;margin-left:5px;border-radius:50%;background:#c62828;color:#fff;font-size:10px;font-weight:700;line-height:15px;vertical-align:2px;box-sizing:border-box;animation:none!important;box-shadow:none!important}#'+LINK_ID+'{display:inline-flex;align-items:center}';
    (document.head||document.documentElement).appendChild(s);
  }
  function ensureLink(){
    var nav=document.querySelector('.top-simple-links');
    if(!nav) return null;
    var link=document.getElementById(LINK_ID);
    if(!link){
      link=document.createElement('a');link.id=LINK_ID;link.href='learning-coach.html';link.textContent='Hôm nay';link.setAttribute('data-avp-nav','today');
      var learn=nav.querySelector('a[href="skill-map.html"]');
      if(learn&&learn.parentNode===nav) learn.insertAdjacentElement('afterend',link); else nav.insertBefore(link,nav.firstChild);
    }
    return link;
  }
  function render(){
    var link=ensureLink();
    if(!link) return;
    ensureStyle();
    var pack=currentPack(), all=read(DAILY_KEY,{}), row=all&&all[pack.date]||{}, done=row&&row.itemDone||{};
    var count=pack.ids.filter(function(id){return done[id]===true;}).length;
    var badge=document.getElementById(BADGE_ID);
    if(!badge){badge=document.createElement('span');badge.id=BADGE_ID;badge.setAttribute('aria-label','Chưa hoàn thành đủ 5 bài hôm nay');badge.textContent='!';link.appendChild(badge);}
    badge.hidden=count>=5;
    link.title=count>=5?'Đã hoàn thành 5/5 bài hôm nay':'Đã hoàn thành '+count+'/5 bài hôm nay';
    var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    link.classList.toggle('is-current',page==='learning-coach.html');
    if(page==='learning-coach.html') link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
  }
  function boot(){
    render();
    var nav=document.querySelector('.top-simple-links');
    if(nav&&!nav.__avpDailyObserver){
      nav.__avpDailyObserver=true;
      new MutationObserver(render).observe(nav,{childList:true});
    }
    setInterval(render,15000);
    document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')render();});
    window.addEventListener('storage',render);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
