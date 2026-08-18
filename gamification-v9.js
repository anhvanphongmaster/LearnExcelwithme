(function(){
 const XPKEY='avp_xp_v2', QUIZKEY='avp_quiz_done_v1', DATEKEY='avp_badge_unlock_dates_v9', INITKEY='avp_badge_v9_initialized';
 const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch(e){return f}};
 const xp=()=>Number(localStorage.getItem(XPKEY)||0)||0;
 const quizMap=()=>read(QUIZKEY,{});
 const quizCount=()=>Object.values(quizMap()).filter(Boolean).length;
 const completed=()=>{const x=read('completedCourses',[]);return Array.isArray(x)?x.length:0};
 const pgDone=()=>Object.values(read('avp_playground_progress_v1',{})).filter(Boolean).length;
 const today=()=>new Date().toISOString().slice(0,10);
 const fmt=s=>{if(!s)return '';const [y,m,d]=s.split('-');return `${d}/${m}/${y}`};
 const defs=()=>{
  const v=xp(),q=quizCount(),c=completed(),pg=pgDone();
  return [
   {id:'starter',icon:'🌱',name:'Khởi động',desc:'Vượt quiz đầu tiên',value:q,target:1,ok:q>=1},
   {id:'habit',icon:'🔥',name:'Chăm học',desc:'Vượt 5 quiz cuối bài',value:q,target:5,ok:q>=5},
   {id:'analyst',icon:'📊',name:'Data Analyst',desc:'Đạt 180 XP',value:v,target:180,ok:v>=180},
   {id:'master-ready',icon:'🏆',name:'Master Ready',desc:'Đạt 300 XP để mở Master',value:v,target:300,ok:v>=300},
   {id:'quiz-pro',icon:'🎯',name:'Quiz Pro',desc:'Vượt 8 quiz cuối bài',value:q,target:8,ok:q>=8},
   {id:'roadmap',icon:'🧭',name:'Roadmap Finisher',desc:'Hoàn thành 6 chuyên đề nền tảng',value:c,target:6,ok:c>=6},
   {id:'practice',icon:'🧪',name:'Practice Hero',desc:'Hoàn thành 10 bài Playground',value:pg,target:10,ok:pg>=10},
   {id:'excel-master',icon:'👑',name:'Excel Master',desc:'Đạt 400 XP và hoàn thành lộ trình Master',value:v,target:400,ok:v>=400}
  ];
 };
 function saveUnlockDates(showPopup){
  const dates=read(DATEKEY,{}), first=!localStorage.getItem(INITKEY); let newly=[];
  defs().forEach(b=>{if(b.ok&&!dates[b.id]){dates[b.id]=today(); if(!first)newly.push(b)}});
  localStorage.setItem(DATEKEY,JSON.stringify(dates));
  if(first)localStorage.setItem(INITKEY,'1');
  if(showPopup&&newly.length)queuePopups(newly,dates);
  return dates;
 }
 function progressPct(b){return Math.max(0,Math.min(100,Math.round((b.value/b.target)*100)))}
 function nextBadge(){return defs().filter(b=>!b.ok).sort((a,b)=>progressPct(b)-progressPct(a))[0]||null}
 function queuePopups(items,dates){
  let i=0; function one(){if(i>=items.length)return; const b=items[i++];
   const el=document.createElement('div');el.className='g9-unlock';el.innerHTML=`<button aria-label="Đóng">×</button><div class="g9-confetti">✦ ✦ ✦</div><div class="g9-unlock-icon">${b.icon}</div><small>HUY HIỆU MỚI</small><h3>${b.name}</h3><p>${b.desc}</p><strong>✓ Mở khóa ${fmt(dates[b.id])}</strong>`;
   document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add('show'));
   const close=()=>{el.classList.remove('show');setTimeout(()=>{el.remove();one()},260)};
   el.querySelector('button').onclick=close;setTimeout(close,4200);
  } one();
 }
 function profilePanel(){
  if(!document.body.classList.contains('profile-page')||document.getElementById('g9ProfileBadges'))return;
  const host=document.querySelector('.profile-main section');if(!host)return; const dates=saveUnlockDates(false),bs=defs(),unlocked=bs.filter(x=>x.ok).length,n=nextBadge();
  const panel=document.createElement('div');panel.className='profile-panel g9-profile-badges';panel.id='g9ProfileBadges';
  panel.innerHTML=`<div class="g9-profile-head"><div><span class="g9-eyebrow">MY ACHIEVEMENTS</span><h2>🏅 Huy hiệu đã kiếm được</h2><p>${unlocked}/${bs.length} huy hiệu đã mở khóa.</p></div><a href="achievements.html">Xem tất cả →</a></div>${n?`<div class="g9-next-badge"><div><b>Tiếp theo: ${n.icon} ${n.name}</b><span>${n.desc}</span></div><strong>${Math.min(n.value,n.target)}/${n.target}</strong><div class="g9-track"><i style="width:${progressPct(n)}%"></i></div></div>`:''}<div class="g9-profile-grid">${bs.map(b=>`<article class="g9-mini-badge ${b.ok?'on':''}"><span>${b.icon}</span><div><b>${b.name}</b><small>${b.ok?'Mở khóa '+fmt(dates[b.id]):b.desc}</small></div></article>`).join('')}</div>`;
  host.appendChild(panel);
 }
 function achievementsEnhance(){
  if(!document.body.classList.contains('ach-page'))return; const grid=document.getElementById('badgeGrid');if(!grid)return;
  const dates=saveUnlockDates(false),bs=defs();
  let sec=document.getElementById('g9BadgeCollection');
  if(!sec){sec=document.createElement('section');sec.id='g9BadgeCollection';sec.className='ach-section g9-ach-section';grid.closest('.ach-section').insertAdjacentElement('afterend',sec)}
  const n=nextBadge(); sec.innerHTML=`<div class="section-head"><div><span class="eyebrow">SKILL BADGES</span><h2>✨ Huy hiệu kỹ năng mới</h2></div><div class="g9-count">${bs.filter(b=>b.ok).length}/${bs.length} đã mở</div></div>${n?`<div class="g9-next-wide"><div><b>Huy hiệu gần nhất: ${n.icon} ${n.name}</b><span>${n.desc}</span></div><strong>${progressPct(n)}%</strong><div class="g9-track"><i style="width:${progressPct(n)}%"></i></div></div>`:''}<div class="g9-ach-grid">${bs.map(b=>`<article class="g9-ach-badge ${b.ok?'on':''}"><div class="g9-ach-icon">${b.icon}</div><div class="g9-ach-copy"><h3>${b.name}</h3><p>${b.desc}</p><div class="g9-track"><i style="width:${progressPct(b)}%"></i></div><small>${b.ok?`✓ Mở khóa ngày ${fmt(dates[b.id])}`:`Tiến độ ${Math.min(b.value,b.target)}/${b.target}`}</small></div></article>`).join('')}</div>`;
 }
 function homeNext(){
  if(!document.getElementById('g8Center')||document.getElementById('g9NextBadge'))return;const n=nextBadge();if(!n)return;
  const el=document.createElement('div');el.id='g9NextBadge';el.className='g9-home-next';el.innerHTML=`<span>${n.icon}</span><div><small>HUY HIỆU TIẾP THEO</small><b>${n.name}</b><em>${n.desc} • ${Math.min(n.value,n.target)}/${n.target}</em></div><div class="g9-ring">${progressPct(n)}%</div>`;
  document.getElementById('g8Center').appendChild(el);
 }
 function init(){saveUnlockDates(true);setTimeout(()=>{profilePanel();achievementsEnhance();homeNext()},120)}
 document.addEventListener('DOMContentLoaded',init);
 window.addEventListener('avp:course-xp',()=>setTimeout(()=>{saveUnlockDates(true);profilePanel();achievementsEnhance();},80));
 window.addEventListener('storage',()=>{profilePanel();achievementsEnhance();});
 window.avpV9={defs,nextBadge,saveUnlockDates};
})();
