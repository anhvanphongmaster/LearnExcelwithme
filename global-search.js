(() => {
  'use strict';
  if(window.__AVP_GLOBAL_SEARCH_V3__)return;
  window.__AVP_GLOBAL_SEARCH_V3__=true;

  const ITEMS=[
    {icon:'🏠',title:'Trang chủ',desc:'LearnExcelwithme · hệ thống học Excel',url:'index.html',type:'Trang',keys:'home trang chu'},
    {icon:'📚',title:'Kho workbook',desc:'File thực hành và dữ liệu mẫu',url:'workbook-library.html',type:'Tài nguyên',keys:'workbook file excel tai ve du lieu mau'},
    {icon:'🏆',title:'Thử thách Excel',desc:'Excel Arena · Học và Rank',url:'excel-race.html',type:'Thử thách',keys:'excel arena quiz rank game thu thach'},
    {icon:'♧',title:'Bộ sưu tập cá nhân',desc:'Khung chức năng đang thiết kế',url:'index.html#avp-canonical-resources',type:'Cá nhân',keys:'bo suu tap saved bookmark'}
  ];

  const normalize=(s='')=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  const SITE_PAGES=["ai.html","auth.html","baitapexcel.html","baocaoexcel.html","bieudopareto.html","community.html","congthucexcel.html","contact.html","dashboard-dong.html","disclaimer.html","excel-data-format-library.html","excel-dictionary.html","excel-doctor.html","excel-formula-library.html","excel-handbook.html","excel-knowledge-library.html","excel-library.html","excel-mobile.html","excel-nang-cao.html","excel-operation-library.html","excel-race.html","excel-shortcut-library.html","excel.html","filtersort.html","focus-room.html","gioithieu.html","homework.html","index.html","intro.html","learning-coach.html","lienhe.html","office-quest-world.html","office-quest.html","open-source.html","phimtatexcel.html","pivottable.html","playground.html","power-pivot-dax.html","power-query-course.html","practice-grader.html","practice-guides.html","practice-lab.html","practice-tiktok.html","practice-video.html","practice-youtube.html","privacy.html","professional-access.html","professional-track.html","profile.html","qc-dashboard.html","quick-learn.html","sales-handbook.html","sales-professional.html","solver-whatif.html","tai-lieu-tham-khao.html","terms.html","tools-center.html","tools-library.html","vba-macro.html","workbook-library.html"];
  let indexPromise=null;
  function buildSiteIndex(){
    if(indexPromise)return indexPromise;
    indexPromise=(async()=>{
      let cached=null;try{const c=JSON.parse(sessionStorage.getItem('avpGlobalSearchIndexV4')||'null');if(c&&Date.now()-c.time<3600000&&Array.isArray(c.items))cached=c.items}catch{}
      if(cached){cached.forEach(x=>ITEMS.push(x));return}
      let cursor=0,added=[];
      async function worker(){while(cursor<SITE_PAGES.length){const path=SITE_PAGES[cursor++];try{
        const res=await fetch(path,{credentials:'same-origin'});if(!res.ok)continue;
        const doc=new DOMParser().parseFromString(await res.text(),'text/html');
        doc.querySelectorAll('script,style,noscript,svg,nav,footer').forEach(n=>n.remove());
        const pageTitle=(doc.querySelector('h1')?.textContent||doc.title||path).trim().replace(/\s+/g,' ');
        const meta=doc.querySelector('meta[name="description"]')?.content||'';
        const body=doc.body?.textContent||'';
        added.push({icon:'📄',title:pageTitle,desc:(meta||body).slice(0,220),url:path,type:'Trang',keys:path.replace(/[-_.]/g,' ')+' '+body.slice(0,24000)});
        doc.querySelectorAll('h1,h2,h3,h4').forEach(h=>{const title=(h.textContent||'').trim().replace(/\\s+/g,' ');if(title.length>2)added.push({icon:'🔎',title,desc:(h.parentElement?.innerText||'').slice(0,220),url:h.id?path+'#'+h.id:path,type:pageTitle,keys:title+' '+(h.parentElement?.innerText||'').slice(0,3500)+' '+path})});
        doc.querySelectorAll('a[href]').forEach(a=>{const title=(a.textContent||a.getAttribute('aria-label')||'').trim().replace(/\\s+/g,' '),href=a.getAttribute('href');if(title.length<3||!href||/^(mailto:|tel:|javascript:|#)/i.test(href))return;try{const u=new URL(href,location.href);if(u.origin===location.origin)added.push({icon:'↗',title,desc:'Liên kết trong '+pageTitle,url:u.pathname.replace(/^\\//,'')+u.search+u.hash,type:'Liên kết',keys:title+' '+pageTitle})}catch{}});
      }catch(e){}}}
      await Promise.all(Array.from({length:2},worker));
      // Load structured learning catalogs so search reaches individual learning objects, not only page text.
      const catalogScripts=['excel-formula-library-data.js','excel-shortcut-library-data.js','excel-knowledge-library-data.js','excel-data-format-library-data.js','excel-arena-questions.js','practice-lessons.js'];
      const loadScript=src=>new Promise(resolve=>{const el=document.createElement('script');el.src=src;el.async=true;el.onload=()=>resolve(true);el.onerror=()=>resolve(false);document.head.appendChild(el)});
      await Promise.all(catalogScripts.map(loadScript));
      const add=(icon,title,desc,url,type,keys='')=>{if(title)added.push({icon,title:String(title),desc:String(desc||'').slice(0,320),url,type,keys:String(keys||'')})};
      (window.AVP_FORMULA_BANK||[]).forEach(x=>add('ƒx',x.name||x.title,[x.description,x.question,x.explanation,x.formula].filter(Boolean).join(' · '),'excel-formula-library.html','Công thức',[x.name,x.formula,x.description,x.scenario,x.question,x.explanation].join(' ')));
      (window.AVP_NESTED_BANK||[]).forEach(x=>add('ƒx',x.name,[x.description,x.formula,x.question].filter(Boolean).join(' · '),'excel-formula-library.html','Công thức kết hợp',[x.name,x.formula,x.description,x.question].join(' ')));
      (window.AVP_SHORTCUT_BANK||[]).forEach(x=>add('⌨️',x.key+' — '+x.name,[x.description,x.scenario,x.question].filter(Boolean).join(' · '),'excel-shortcut-library.html','Phím tắt',[x.key,x.name,x.category,x.description,x.scenario,x.question,x.explanation].join(' ')));
      (window.AVP_KNOWLEDGE_BANK||[]).forEach(x=>add('📘',x.title,[x.category,x.summary,x.concept,x.principle,x.example,x.scenario,x.misconception,x.question,x.answer].filter(Boolean).join(' · '),'excel-knowledge-library.html','Kiến thức',[x.title,x.category,x.summary,x.concept,x.principle,x.example,x.scenario,x.misconception,x.question,x.answer].join(' ')));
      const dataLib=window.AVP_DATA_LIBRARY||{};
      (dataLib.items||[]).forEach(x=>add('🧩',x.title,[x.summary,x.when,x.concept,x.example,x.check,(x.rules||[]).join(' ')].filter(Boolean).join(' · '),'excel-data-format-library.html','Định dạng & dữ liệu',[x.title,x.summary,x.when,x.concept,x.example,x.check,(x.rules||[]).join(' ')].join(' ')));
      const arena=window.AVPArenaBank||{};
      (arena.topics||[]).forEach(x=>add('🏆','Arena · '+x.name,x.desc,'excel-race.html','Chủ đề thử thách',[x.name,x.desc,x.id].join(' ')));
      (arena.concepts||[]).forEach(x=>add('🎯',x.answer,x.meaning+' · '+x.scenario,'excel-race.html','Kiến thức thử thách',[x.answer,x.meaning,x.scenario,(x.aliases||[]).join(' ')].join(' ')));
      (window.AVP_PRACTICE_LESSONS||[]).filter(x=>x.isActive!==false).forEach(x=>add('📝',x.title,[x.topicLabel,x.description,x.fileName,x.difficulty].filter(Boolean).join(' · '),'practice-video.html','Bài thực hành',[x.title,x.topic,x.topicLabel,x.description,x.fileName,x.grader,x.gradingMode].join(' ')));
      const seen=new Set();added=added.filter(x=>{const k=x.title+'|'+x.url;if(seen.has(k))return false;seen.add(k);return true});
      added.forEach(x=>ITEMS.push(x));try{sessionStorage.setItem('avpGlobalSearchIndexV4',JSON.stringify({time:Date.now(),items:added}))}catch{}
    })();return indexPromise;
  }

  const recent=()=>{try{const value=JSON.parse(localStorage.getItem('avpSearchRecent')||'[]');return Array.isArray(value)?value.filter(x=>typeof x==='string').slice(0,5):[]}catch{return[]}};
  const saveRecent=q=>{q=q.trim();if(!q)return;try{localStorage.setItem('avpSearchRecent',JSON.stringify([q,...recent().filter(x=>normalize(x)!==normalize(q))].slice(0,5)))}catch(e){/* Search navigation must work even when browser storage is blocked or full. */}};
  const SEARCH_SYNONYMS={
    'cong no':['theo doi cong no','doi chieu cong no','phai thu','phai tra','thu no','tra no','receivable','payable','debt'],
    'doi soat':['doi chieu','kiem tra chenh lech','reconcile','reconciliation','so khop du lieu'],
    'xoa dong trong':['loai bo dong trong','blank rows','remove empty rows','lam sach du lieu'],
    'gop file':['combine files','append','merge','hop nhat du lieu','tong hop nhieu file'],
    'tong theo dieu kien':['sumifs','sumif','cong co dieu kien','tinh tong theo nhom'],
    'dem theo dieu kien':['countifs','countif','dem co dieu kien'],
    'loc du lieu':['filter','advanced filter','sap xep va loc'],
    'lam sach du lieu':['clean data','trim','clean','chuan hoa du lieu','remove duplicates'],
    'bao cao':['dashboard','report','tong hop','phan tich du lieu','kpi'],
    'cham bai':['tu cham','kiem tra bai lam','practice grader','grading','bai tap thuc hanh']
  };
  function editDistanceOne(a,b){if(Math.abs(a.length-b.length)>1)return false;let i=0,j=0,d=0;while(i<a.length&&j<b.length){if(a[i]===b[j]){i++;j++;continue}if(++d>1)return false;if(a.length>b.length)i++;else if(b.length>a.length)j++;else{i++;j++;}}return d+(i<a.length||j<b.length?1:0)<=1;}
  function score(item,q){if(!q)return 1;const t=normalize(item.title),k=normalize(item.keys||''),d=normalize(item.desc||''),all=t+' '+k+' '+d;if(all.includes(q))return 1400+q.length;const terms=q.split(' ').filter(Boolean);let expanded=[...terms];Object.entries(SEARCH_SYNONYMS).forEach(([key,values])=>{if(q.includes(key)||key.includes(q))expanded.push(...values.flatMap(v=>normalize(v).split(' ')))});let n=0,total=0;terms.forEach(p=>{let v=0;if(t===p)v=100;else if(t.startsWith(p))v=72;else if(t.includes(p))v=58;if(k.includes(p))v=Math.max(v,38);if(d.includes(p))v=Math.max(v,20);if(!v&&p.length>=5){const near=(t+' '+k+' '+d).split(' ').some(w=>w.length>=5&&editDistanceOne(p,w));if(near)v=12;}if(v){n++;total+=v}});const synonymHits=expanded.filter(p=>p.length>2&&all.includes(p)).length;total+=Math.min(5,synonymHits)*9;if(n===terms.length)return total+n*22;if(n===terms.length-1&&terms.length>=2)return total-5;return n?total-(terms.length-n)*52:0;}

  const nav=document.querySelector('nav.top-simple-nav')||document.querySelector('nav');
  if(nav&&!document.getElementById('avpSearchTrigger')){const trigger=document.createElement('button');trigger.type='button';trigger.id='avpSearchTrigger';trigger.className='top-search-button avp-search-trigger';trigger.setAttribute('aria-label','Tìm kiếm toàn website');trigger.textContent='⌕ Tìm kiếm';const theme=nav.querySelector('#themeToggle');theme?theme.parentNode.insertBefore(trigger,theme):nav.appendChild(trigger)}
  if(!document.getElementById('avpSearchTrigger')){const trigger=document.createElement('button');trigger.type='button';trigger.id='avpSearchTrigger';trigger.className='avp-search-trigger avp-search-floating';trigger.textContent='⌕ Tìm kiếm';trigger.setAttribute('aria-label','Tìm kiếm toàn website');document.body.appendChild(trigger)}


  const wrap=document.createElement('div');wrap.className='avp-spotlight-backdrop';wrap.id='avpSpotlightBackdrop';wrap.innerHTML=`<div class="avp-spotlight" role="dialog" aria-modal="true" aria-label="Tìm kiếm Learn Excel with Anh Van Phong"><div class="avp-spotlight-head"><span class="icon">🔎</span><input id="avpSpotlightInput" class="avp-spotlight-input" type="text" inputmode="search" autocapitalize="off" spellcheck="false" autocomplete="off" placeholder="Tìm XLOOKUP, Pivot, Power Query, VBA, Case Sales..."><span class="avp-esc">ESC</span></div><div class="avp-search-meta"><span id="avpSearchLabel">Gợi ý cho bạn</span><span id="avpSearchCount"></span></div><div class="avp-search-results" id="avpSearchResults"></div><div class="avp-search-footer"><span><kbd>↑</kbd> <kbd>↓</kbd> di chuyển</span><span><kbd>Enter</kbd> mở</span><span><kbd>Esc</kbd> đóng</span></div></div>`;document.body.appendChild(wrap);
  const input=document.getElementById('avpSpotlightInput'),results=document.getElementById('avpSearchResults'),label=document.getElementById('avpSearchLabel'),count=document.getElementById('avpSearchCount');let active=0,current=[];
  function render(raw=''){const q=normalize(raw);current=ITEMS.map(x=>({...x,_score:score(x,q)})).filter(x=>x._score>0).sort((a,b)=>b._score-a._score);if(!q){const history=recent().map(title=>current.find(x=>normalize(x.title)===normalize(title))).filter(Boolean);current=[...history,...current.filter(x=>!history.some(h=>h.url===x.url))].slice(0,10)}else current=current.slice(0,100);active=0;label.textContent=raw.trim()?`Kết quả cho “${raw.trim()}”`:(recent().length?'Đã mở gần đây & gợi ý':'Gợi ý cho bạn');count.textContent=raw.trim()?`${current.length} kết quả`:'';if(!current.length){results.innerHTML='<div class="avp-search-empty"><b>Không tìm thấy nội dung phù hợp</b>Thử “XLOOKUP”, “Pivot”, “Power Query”, “VBA” hoặc “Case Sales”.</div>';return}results.innerHTML=current.map((x,i)=>`<a class="avp-search-result ${i===0?'active':''}" data-index="${i}" href="${x.url}"><span class="avp-search-result-icon">${x.icon}</span><span><strong>${x.title}</strong><small>${x.desc}</small></span><span class="avp-search-type">${x.type}</span></a>`).join('');results.querySelectorAll('.avp-search-result').forEach(el=>{el.addEventListener('mouseenter',()=>setActive(Number(el.dataset.index)));el.addEventListener('click',()=>saveRecent(current[Number(el.dataset.index)]?.title||input.value))})}
  function setActive(i){const els=[...results.querySelectorAll('.avp-search-result')];if(!els.length)return;active=(i+els.length)%els.length;els.forEach((el,n)=>el.classList.toggle('active',n===active));els[active].scrollIntoView({block:'nearest'})}
  let returnFocus=null,previousBodyOverflow='';
  function open(){if(wrap.classList.contains('open'))return;returnFocus=document.activeElement;previousBodyOverflow=document.body.style.overflow;wrap.classList.add('open');document.body.style.overflow='hidden';render('');setTimeout(()=>{if(wrap.classList.contains('open'))input.focus()},30)}
  function close(){if(!wrap.classList.contains('open'))return;wrap.classList.remove('open');document.body.style.overflow=previousBodyOverflow;input.value='';if(returnFocus&&typeof returnFocus.focus==='function'&&returnFocus.isConnected)returnFocus.focus();returnFocus=null}
  function go(){if(!current[active])return;saveRecent(current[active].title);location.href=current[active].url}
  window.openGlobalSearch=open;window.closeGlobalSearch=close;
  wrap.addEventListener('click',e=>{if(e.target===wrap)close()});input.addEventListener('input',()=>render(input.value));input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();setActive(active+1)}else if(e.key==='ArrowUp'){e.preventDefault();setActive(active-1)}else if(e.key==='Enter'){e.preventDefault();go()}else if(e.key==='Escape')close()});document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();wrap.classList.contains('open')?close():open()}else if(e.key==='Escape'&&wrap.classList.contains('open'))close();else if(e.key==='Tab'&&wrap.classList.contains('open')){const focusable=[...wrap.querySelectorAll('input:not([disabled]),a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>el.getClientRects().length>0);if(!focusable.length){e.preventDefault();input.focus();return}const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&(document.activeElement===first||!wrap.contains(document.activeElement))){e.preventDefault();last.focus()}else if(!e.shiftKey&&(document.activeElement===last||!wrap.contains(document.activeElement))){e.preventDefault();first.focus()}}});render('');
  // Build the large site index only after the user starts typing; avoid blocking Safari on page load.
})();
