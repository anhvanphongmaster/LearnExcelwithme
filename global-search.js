(() => {
'use strict';
if (window.__AVP_GLOBAL_SEARCH_V3__) return;
window.__AVP_GLOBAL_SEARCH_V3__ = true;

const INDEX_FILES = Array.from({length:10},(_,i)=>'search-index-'+String(i+1).padStart(2,'0')+'.json');
const DICTIONARY_URL='search-dictionary.js';
const RESOURCE_URL='search-resources.json';
const SUPABASE_URL='https://itnnbyhlpfredaqyhlpr.supabase.co';
const SUPABASE_KEY='sb_publishable_MiK_gkzfQUwPn3_-TYZESg_FxuWYTV5';
const $=id=>document.getElementById(id);
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SYNONYMS=[
['cong no','phai thu','phai tra','cong no phai thu','cong no phai tra','theo doi no','no khach hang','no nha cung cap','accounts receivable','accounts payable'],
['xoa dong trong','dong rong','blank rows','remove blank rows','go to special','lam sach du lieu','clean data'],
['power query gop file','combine files','combine folder','folder combine','gop nhieu file','append queries','append multiple files','merge queries','power query'],
['doi soat','reconciliation','kiem tra chenh lech','so sanh du lieu','control total'],
['tim ham','cong thuc','excel function','formula','tra cuu ham'],
['phim tat','shortcut','keyboard shortcut','to hop phim'],
['bao cao qc','quality control','kiem soat chat luong','defect','loi san pham']
];
const expand=q=>{
 const n=norm(q),out=new Set([n]);
 for(const group of SYNONYMS) if(n.length>=3&&group.some(x=>n.includes(norm(x))||norm(x).includes(n))) group.forEach(x=>out.add(norm(x)));
 return [...out].filter(Boolean);
};
function distance(a,b){
 if(Math.abs(a.length-b.length)>2)return 3;
 let prev=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){
  const cur=[i];let min=i;
  for(let j=1;j<=b.length;j++){const v=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));cur[j]=v;if(v<min)min=v}
  if(min>2)return 3;prev=cur;
 }
 return prev[b.length];
}
let docs=[],resources=[],dictionary=[],contentRecords=[],catalog=[],loaded=false,loading=null;
async function loadData(){
 if(loaded)return;
 if(loading)return loading;
 loading=(async()=>{
  const parts=await Promise.all(INDEX_FILES.map(async file=>{try{const r=await fetch(file,{cache:'force-cache'});if(!r.ok)throw Error(file);return await r.json()}catch(_){return {documents:[]}}}));
  docs=parts.flatMap(x=>Array.isArray(x.documents)?x.documents:[]);
  try{const deep=await fetch('search-deep-index.json',{cache:'force-cache'});if(deep.ok){const j=await deep.json();if(Array.isArray(j.documents))docs.push(...j.documents)}}catch(_){}
  try{const race=await fetch('search-race-index.json',{cache:'force-cache'});if(race.ok){const j=await race.json();if(Array.isArray(j.documents))docs.push(...j.documents)}}catch(_){}
  try{const r=await fetch(RESOURCE_URL,{cache:'force-cache'});if(r.ok){const j=await r.json();resources=Array.isArray(j.resources)?j.resources:[]}}catch(_){}
  try{const r=await fetch('search-content-records.json',{cache:'force-cache'});if(r.ok){const j=await r.json();contentRecords=Array.isArray(j.records)?j.records:[]}}catch(_){}
  try{
   if(!window.AVP_EXCEL_DICTIONARY){
    await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=DICTIONARY_URL;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});
   }
   dictionary=Array.isArray(window.AVP_EXCEL_DICTIONARY)?window.AVP_EXCEL_DICTIONARY:[];
  }catch(_){}
  buildCatalog();
  loaded=true;
 })();
 return loading;
}
function tokens(s){return norm(s).split(/\s+/).filter(Boolean)}
function buildCatalog(){
 const all=[];
 docs.forEach(d=>{
  let url=d.url||'index.html';
  if(d.type==='Hàm Excel')url='excel-formula-library.html?q='+encodeURIComponent(d.title||'');
  else if(d.type==='Phím tắt')url='excel-shortcut-library.html?q='+encodeURIComponent(d.title||'');
  else if(d.type==='Thư viện kiến thức')url='excel-knowledge-library.html?q='+encodeURIComponent(d.title||'');
  else if(d.type==='Thư viện dữ liệu')url='excel-data-format-library.html?q='+encodeURIComponent(d.title||'');
  else if(d.type==='Thư viện Excel')url='excel-dictionary.html?q='+encodeURIComponent(d.title||'');
  all.push({title:d.title,description:d.description||d.content?.slice(0,180)||'Trang nội dung',url,type:d.type||'Trang',icon:'📄',content:d.content||'',keywords:d.title+' '+d.url});
 });
 resources.forEach(r=>all.push({title:r.title,description:r.description,url:r.url,type:r.type||'Tài nguyên',icon:'📊',content:r.keywords||''}));
 contentRecords.forEach(r=>all.push({title:r.title,description:r.description||'Nội dung học và dữ liệu thực hành',url:r.url,type:r.type||'Nội dung',icon:'📚',content:[r.content,r.description].join(' ')}));
 dictionary.forEach(d=>all.push({title:d.title,description:d.purpose||d.subtitle||'Thư viện kiến thức Excel',url:'excel-dictionary.html?q='+encodeURIComponent(d.title||''),type:d.type||'Thư viện Excel',icon:'🧮',content:[d.keywords,d.syntax,d.example,d.advanced,d.related,d.causes,d.checks,d.fixes,d.parts].flat(Infinity).join(' ')}));
 catalog=all.map(x=>{const title=norm(x.title),body=norm([x.description,x.content,x.keywords,x.purpose,x.syntax,x.example,x.advanced,x.subtitle,x.type].join(' '));return {...x,_title:title,_body:body,_titleTokens:new Set(tokens(title)),_bodyTokens:new Set(tokens(body))}});
}
function scoreItem(item,query,expanded){
 const title=item._title,body=item._body,q=norm(query),qt=tokens(q),tt=item._titleTokens,bt=item._bodyTokens;
 let score=0,matched=0;
 const phraseHit=title.includes(q)||body.includes(q);
 let expandedHit=false;
 if(title===q)score+=150;
 if(title.includes(q))score+=85;
 if(body.includes(q))score+=45;
 for(const term of qt){
  let hit=false;
  if(tt.has(term)){score+=24;hit=true}
  else if(term.length>=3&&bt.has(term)){score+=9;hit=true}
  else if(term.length>=4){
   let best=3;
   for(const t of bt){if(t[0]!==term[0]||Math.abs(t.length-term.length)>1)continue;best=Math.min(best,distance(term,t));if(best===0)break}
   if(best===1){score+=4;hit=true}
  }
  if(hit)matched++;
 }
 for(const variant of expanded){if(variant===q)continue;if(title.includes(variant)||body.includes(variant)){expandedHit=true;score+=title.includes(variant)?18:7}}
 if(qt.length>1&&!phraseHit&&!expandedHit&&(qt.some(t=>t.length<3)||matched<qt.length))return 0;
 if(qt.length>1&&matched===qt.length)score+=20;
 return score;
}
function makeRows(q){
 const variants=expand(q);
 return catalog.map(x=>({...x,_score:scoreItem(x,q,variants)})).filter(x=>x._score>0).sort((a,b)=>b._score-a._score);
}
async function fetchTools(q){
 try{
  const n=norm(q),terms=new Set([String(q||'').trim()]);
  const semantic=[
   {keys:['cong no','phai thu','phai tra','no khach hang','no nha cung cap'],terms:['công nợ','Quản Lý Công Nợ Tự Động','phải thu','phải trả','thanh toán','quá hạn']},
   {keys:['doi soat','so sanh','chenh lech','compare file'],terms:['đối soát','so sánh file','Compare 2 Files Pro','chênh lệch']},
   {keys:['xoa dong trong','dong rong','blank rows','clean data','lam sach du lieu'],terms:['làm sạch dữ liệu','ô trống','dòng trống','Excel Data Cleaner Pro']},
   {keys:['power query gop file','gop file','combine files'],terms:['Power Query','gộp file','kết hợp nhiều file']}
  ];
  for(const group of semantic)if(group.keys.some(k=>n.includes(norm(k))||norm(k).includes(n)))group.terms.forEach(x=>terms.add(x));
  const batches=await Promise.all([...terms].filter(Boolean).slice(0,7).map(term=>fetch(SUPABASE_URL+'/rest/v1/rpc/tool_catalog_v2',{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify({p_search:term})}).then(r=>r.ok?r.json():[]).catch(()=>[])));
  const rows=[...new Map(batches.flat().filter(Boolean).map(t=>[String(t.id||t.title),t])).values()];
  return rows.map(t=>{const item={title:t.title||'Tool',description:[t.application,t.description].filter(Boolean).join(' · '),url:'tools-library.html?search='+encodeURIComponent(t.title||''),type:'Kho Tool',icon:'🧰',content:[t.title,t.application,t.description].join(' ')};const title=norm(item.title),body=norm([item.description,item.content].join(' '));const prepared={...item,_title:title,_body:body,_titleTokens:new Set(tokens(title)),_bodyTokens:new Set(tokens(body))};return {...prepared,_score:scoreItem(prepared,q,expand(q))+55}});
 }catch(_){return []}
}
const wrap=document.createElement('div');wrap.className='avp-spotlight-backdrop';wrap.id='avpSpotlightBackdrop';
wrap.innerHTML='<div class="avp-spotlight" role="dialog" aria-modal="true" aria-label="Tìm kiếm toàn website"><div class="avp-spotlight-head"><span class="icon">⌕</span><input id="avpSpotlightInput" class="avp-spotlight-input" type="search" autocomplete="off" placeholder="Tìm bài học, công thức, câu hỏi, workbook, file, công cụ..."><span class="avp-esc">ESC</span></div><div class="avp-search-meta"><span id="avpSearchLabel">Tìm trên toàn website</span><span id="avpSearchCount"></span></div><div class="avp-search-results" id="avpSearchResults"></div><div class="avp-search-footer"><span><kbd>↑</kbd> <kbd>↓</kbd> di chuyển</span><span><kbd>Enter</kbd> mở</span><span><kbd>Esc</kbd> đóng</span></div></div>';
(document.body||document.documentElement).appendChild(wrap);
const input=$('avpSpotlightInput'),results=$('avpSearchResults'),label=$('avpSearchLabel'),count=$('avpSearchCount');
let current=[],active=0,returnFocus=null,previousOverflow='',searchTimer=0,requestId=0;
function saveRecent(item){try{const old=JSON.parse(localStorage.getItem('avpSearchRecent')||'[]');localStorage.setItem('avpSearchRecent',JSON.stringify([item,...old.filter(x=>x!==item)].slice(0,6)))}catch(_){}}
function resultUrl(x){if(/\.(xlsx|xlsm|xls|zip|pdf)$/i.test(x.url))return new URL(x.url,location.href).href;return new URL(x.url,location.href).href}
let visibleLimit=25;
function draw(items,q,loadingTools=false){
 current=items;active=0;visibleLimit=25;
 label.textContent=q?'Kết quả trên toàn website':'Tìm kiếm toàn website';
 count.textContent=(items.length?items.length+' kết quả':'')+(loadingTools?' · đang tìm trong Kho Tool':'');
 if(!items.length){results.innerHTML='<div class="avp-search-empty"><b>Chưa tìm thấy nội dung phù hợp</b>Thử từ khóa khác, bỏ dấu hoặc nhập một cụm gần nghĩa.</div>';return}
 renderVisible();
}
function renderVisible(){
 const shown=current.slice(0,visibleLimit);
 results.innerHTML=shown.map((x,i)=>'<a class="avp-search-result '+(i===0?'active':'')+'" data-index="'+i+'" href="'+esc(resultUrl(x))+'"><span class="avp-search-result-icon">'+(x.icon||'🔎')+'</span><span><strong>'+esc(x.title)+'</strong><small>'+esc(x.description||'')+'</small></span><span class="avp-search-type">'+esc(x.type||'Nội dung')+'</span></a>').join('');
 if(current.length>visibleLimit)results.insertAdjacentHTML('beforeend','<button class="avp-search-more" type="button">Hiển thị thêm '+Math.min(25,current.length-visibleLimit)+' / '+current.length+' kết quả</button>');
 results.querySelectorAll('.avp-search-result').forEach(el=>{el.addEventListener('mouseenter',()=>setActive(+el.dataset.index));el.addEventListener('click',()=>saveRecent(current[+el.dataset.index]?.title||''))});
 results.querySelector('.avp-search-more')?.addEventListener('click',()=>{visibleLimit=Math.min(visibleLimit+25,current.length);renderVisible()});
}
function setActive(i){const els=[...results.querySelectorAll('.avp-search-result')];if(!els.length)return;active=(i+els.length)%els.length;els.forEach((el,n)=>el.classList.toggle('active',n===active));els[active].scrollIntoView({block:'nearest'})}
async function search(q){
 const id=++requestId;
 if(!q.trim()){draw([],q);return}
 await loadData();if(id!==requestId)return;
 const local=makeRows(q);
 draw(local,q,true);
 const remote=await fetchTools(q);
 if(id!==requestId)return;
 const merged=[...remote,...local].sort((a,b)=>b._score-a._score);
 const unique=merged.filter((x,i)=>merged.findIndex(y=>y.title===x.title&&y.url===x.url)===i);
 draw(unique,q,false);
}
function open(){
 if(wrap.classList.contains('open'))return;
 returnFocus=document.activeElement;previousOverflow=document.body.style.overflow;
 wrap.classList.add('open');document.body.style.overflow='hidden';input.value='';draw([], '');
 loadData().catch(()=>{});
 setTimeout(()=>{if(wrap.classList.contains('open'))input.focus()},30);
}
function close(){if(!wrap.classList.contains('open'))return;wrap.classList.remove('open');document.body.style.overflow=previousOverflow;if(returnFocus?.isConnected)returnFocus.focus();returnFocus=null}
function go(){const item=current[active];if(!item)return;saveRecent(item.title);location.href=resultUrl(item)}
window.openGlobalSearch=open;window.closeGlobalSearch=close;
document.addEventListener('click',e=>{const trigger=e.target?.closest?.('#avpSearchTrigger');if(trigger){e.preventDefault();open()}});
wrap.addEventListener('click',e=>{if(e.target===wrap)close()});
input.addEventListener('input',()=>{clearTimeout(searchTimer);const q=input.value;searchTimer=setTimeout(()=>search(q),120)});
input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();setActive(active+1)}else if(e.key==='ArrowUp'){e.preventDefault();setActive(active-1)}else if(e.key==='Enter'){e.preventDefault();go()}else if(e.key==='Escape')close()});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();wrap.classList.contains('open')?close():open()}else if(e.key==='Escape'&&wrap.classList.contains('open'))close()});

})();