(function(){
 const XPKEY='avp_xp_v2', QUIZKEY='avp_quiz_done_v1', MASTER_XP=300;
 const levels=[
  {name:'Rookie',min:0,max:80,icon:'🌱'},
  {name:'Explorer',min:80,max:180,icon:'🧭'},
  {name:'Analyst',min:180,max:300,icon:'📊'},
  {name:'Pro',min:300,max:400,icon:'⚡'},
  {name:'Master',min:400,max:600,icon:'🏆'}
 ];
 function xp(){return +(localStorage.getItem(XPKEY)||0)}
 function quiz(){try{return JSON.parse(localStorage.getItem(QUIZKEY)||'{}')}catch(e){return{}}}
 function level(v){return levels.find((x,i)=>v>=x.min&&(v<x.max||i===levels.length-1))||levels[levels.length-1]}
 function quizCount(){return Object.values(quiz()).filter(Boolean).length}
 function badges(v,q){return [
  ['🌱','Khởi động','Vượt 1 quiz',q>=1],['🔥','Chăm học','Vượt 5 quiz',q>=5],['📊','Data Analyst','Đạt 180 XP',v>=180],['🏆','Master Ready','Đạt 300 XP',v>=300]
 ]}
 function renderHome(){const anchor=document.getElementById('master-roadmap');if(!anchor||document.getElementById('g8Center'))return;const v=xp(),q=quizCount(),lv=level(v);const next=lv.max===800?800:lv.max;const pct=Math.max(0,Math.min(100,Math.round((v-lv.min)/(next-lv.min)*100)));const b=badges(v,q);const s=document.createElement('section');s.className='g8-center';s.id='g8Center';s.innerHTML=`<div class="g8-card"><div><span class="g8-kicker">⚡ HỆ THỐNG HỌC TẬP</span><h2 class="g8-title">${lv.icon} Level ${lv.name}</h2><p class="g8-sub">XP chỉ được cộng khi bạn vượt quiz cuối bài. Tiến độ này dùng để mở khóa các nội dung Master.</p><div class="g8-stats"><div class="g8-stat"><small>XP hiện tại</small><strong>${v}</strong></div><div class="g8-stat"><small>Quiz đã vượt</small><strong>${q}</strong></div><div class="g8-stat"><small>Master</small><strong>${v>=MASTER_XP?'Đã mở':'🔒 '+MASTER_XP+' XP'}</strong></div></div><div class="g8-progress"><i style="width:${pct}%"></i></div><div class="g8-next">${v>=400?'Bạn đã đạt cấp Master.':`Còn ${Math.max(0,next-v)} XP để đạt mốc ${levels[Math.min(levels.indexOf(lv)+1,levels.length-1)].name}.`}</div></div><div class="g8-badges">${b.map(x=>`<div class="g8-badge ${x[3]?'on':''}"><span>${x[0]}</span><b>${x[1]}</b><small>${x[3]?'Đã mở khóa':x[2]}</small></div>`).join('')}</div></div>`;anchor.parentNode.insertBefore(s,anchor)}
 function lockRoadmap(){const v=xp(),stage=document.querySelector('[data-roadmap-stage="3"]');if(stage){stage.classList.toggle('g8-locked',v<MASTER_XP);const links=stage.querySelectorAll('a');links.forEach(a=>{if(v<MASTER_XP){a.dataset.href=a.getAttribute('href')||'';a.removeAttribute('href')}})}const next=document.getElementById('roadmapNextLink');if(next&&v<MASTER_XP&&/vba|solver/.test(next.getAttribute('href')||'')){next.href='excel-nang-cao.html';next.textContent='Tích XP để mở Master →'}}
 function masterGate(){const f=(location.pathname.split('/').pop()||'').toLowerCase();if(!['vba-macro.html','solver-whatif.html'].includes(f)||xp()>=MASTER_XP)return;const main=document.querySelector('main');if(main)main.classList.add('g8-soft-hidden');document.querySelectorAll('.course-shell,.quiz-panel').forEach(x=>x.classList.add('g8-soft-hidden'));const gate=document.createElement('section');gate.className='g8-lockscreen';gate.innerHTML=`<div class="g8-lockbox"><div class="lockicon">🔒</div><h1>Nội dung Master chưa mở khóa</h1><p>Bạn đang có <strong>${xp()} XP</strong>. Hãy đạt <strong>${MASTER_XP} XP</strong> bằng cách học và vượt quiz ở các bài Cơ bản, Ứng dụng và Nâng cao.</p><a href="excel-nang-cao.html">Tiếp tục học để mở Master →</a></div>`;const header=document.querySelector('header');(header&&header.parentNode?header.parentNode:document.body).insertBefore(gate,header?header.nextSibling:document.body.firstChild)}
 function refresh(){renderHome();lockRoadmap();masterGate();const hv=document.getElementById('homeXpValue');if(hv)hv.textContent=xp()}
 document.addEventListener('DOMContentLoaded',refresh);window.addEventListener('avp:course-xp',()=>location.pathname.endsWith('index.html')?refresh():null);window.avpV8={xp,level,quizCount,MASTER_XP};
})();
