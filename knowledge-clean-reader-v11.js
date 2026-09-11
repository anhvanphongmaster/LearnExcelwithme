(() => {
  'use strict';
  if(window.__AVP_CLEAN_READER_V11__) return;
  window.__AVP_CLEAN_READER_V11__=true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let syncQueued=false;

  function cleanLabel(text){
    return String(text||'').replace(/^\s*\d+[\.\-]?\s*/,'').replace(/\s+/g,' ').trim();
  }

  function sourceItems(){
    const sidebar=$('#kvSidebar');
    if(!sidebar) return [];
    return $$('[data-outline]',sidebar).map((b,i)=>({
      index:Number(b.dataset.outline),
      label:cleanLabel(b.textContent),
      extension:b.dataset.kind==='extension',
      active:b.classList.contains('active'),
      source:b,
      pos:i
    }));
  }

  function activate(index){
    const item=sourceItems().find(x=>x.index===Number(index));
    item?.source?.click();
    queueSync();
  }

  function compactCourseNav(){
    const nav=$('#kvCourseNav');
    if(!nav || nav.dataset.v11Compacted==='1') return;
    nav.dataset.v11Compacted='1';
    const prev=$('.kv-course-edge.prev',nav), next=$('.kv-course-edge.next',nav);
    if(prev){
      const strong=$('strong',prev); if(strong){ strong.title=strong.textContent.trim(); strong.textContent='← '+strong.textContent.replace(/^\d+\s*·\s*/,'').trim(); }
    }
    if(next){
      const strong=$('strong',next); if(strong){ strong.title=strong.textContent.trim(); strong.textContent=strong.textContent.replace(/^\d+\s*·\s*/,'').trim()+' →'; }
    }
  }

  function buildMore(){
    const intro=$('#kvIntro');
    if(!intro || $('#avpMoreV11',intro)) return;
    const grid=$('.kv-intro-grid',intro);
    const prereq=$('.kv-prereq',intro);
    const visual=$('.lp-visual-v3',intro);
    const wrap=document.createElement('div');
    wrap.id='avpMoreV11';
    wrap.className='avp-more-v11';

    if(grid || prereq){
      const d=document.createElement('details');
      d.innerHTML='<summary>Mục tiêu & kiến thức cần biết</summary><div class="avp-more-body-v11"></div>';
      const body=$('.avp-more-body-v11',d);
      if(grid) body.appendChild(grid);
      if(prereq) body.appendChild(prereq);
      wrap.appendChild(d);
    }
    if(visual){
      const d=document.createElement('details');
      d.innerHTML='<summary>Minh họa thao tác</summary><div class="avp-more-body-v11"></div>';
      $('.avp-more-body-v11',d).appendChild(visual);
      wrap.appendChild(d);
    }
    if(wrap.children.length) intro.appendChild(wrap);
  }

  function buildStepNav(){
    const sections=$('#kvSections');
    if(!sections) return;
    let nav=$('#avpStepNavV11');
    if(!nav){
      nav=document.createElement('section');
      nav.id='avpStepNavV11';
      nav.className='avp-step-nav-v11';
      nav.innerHTML='<div class="avp-step-head-v11"><div class="avp-step-current-v11"></div><button type="button" class="avp-step-toggle-v11" aria-expanded="false">Xem các bước</button></div><div class="avp-step-list-v11"></div>';
      sections.parentNode.insertBefore(nav,sections);
      $('.avp-step-toggle-v11',nav).addEventListener('click',()=>{
        const open=!nav.classList.contains('open');
        nav.classList.toggle('open',open);
        const toggle=$('.avp-step-toggle-v11',nav);
        toggle.setAttribute('aria-expanded',open?'true':'false');
        toggle.textContent=open?'Đóng danh sách':'Xem các bước';
      });
    }
    syncStepNav();
  }

  function syncStepNav(){
    const nav=$('#avpStepNavV11');
    if(!nav) return;
    const items=sourceItems();
    if(!items.length) return;
    const activePos=Math.max(0,items.findIndex(x=>x.active));
    const current=items[activePos]||items[0];
    const currentHtml=`<small>BẠN ĐANG Ở</small><strong>${current.extension?'Học thêm':'Bước '+(activePos+1)+'/'+items.length} · ${esc(current.label)}</strong>`;
    const currentHost=$('.avp-step-current-v11',nav);
    if(currentHost.innerHTML!==currentHtml) currentHost.innerHTML=currentHtml;

    const list=$('.avp-step-list-v11',nav);
    const listHtml=items.map((x,i)=>`<button type="button" data-v11-step="${x.index}" class="${x.active?'active':''}"><span class="num">${x.extension?'＋':i+1}</span><span>${x.extension?'Học thêm — ':''}${esc(x.label)}</span></button>`).join('');
    if(list.innerHTML!==listHtml){
      list.innerHTML=listHtml;
      $$('[data-v11-step]',list).forEach(b=>b.addEventListener('click',()=>{
        activate(Number(b.dataset.v11Step));
        nav.classList.remove('open');
        const toggle=$('.avp-step-toggle-v11',nav);
        toggle.setAttribute('aria-expanded','false');
        toggle.textContent='Xem các bước';
      }));
    }
  }

  function labelFlow(){
    const items=sourceItems();
    if(!items.length) return;
    $$('[data-flow-section]').forEach(btn=>{
      const target=Number(btn.dataset.flowSection);
      const pos=items.findIndex(x=>x.index===target);
      const item=items[pos];
      if(!item) return;
      const label=btn.classList.contains('next')?`Tiếp: ${item.label} →`:`← Trước: ${item.label}`;
      if(btn.textContent!==label) btn.textContent=label;
    });
  }

  function queueSync(){
    if(syncQueued) return;
    syncQueued=true;
    requestAnimationFrame(()=>{
      syncQueued=false;
      syncStepNav();
      labelFlow();
    });
  }

  function enhance(){
    document.body.classList.remove('avp-focus-reader-v9','avp-linear-reader-v10');
    document.body.classList.add('avp-clean-reader-v11');
    compactCourseNav();
    buildMore();
    buildStepNav();
    labelFlow();
  }

  function observe(){
    const sidebar=$('#kvSidebar');
    if(sidebar){
      new MutationObserver(queueSync).observe(sidebar,{subtree:true,attributes:true,attributeFilter:['class','aria-current']});
    }
    document.addEventListener('click',e=>{
      if(e.target.closest('[data-flow-section],[data-outline]')) queueSync();
    });
    window.addEventListener('hashchange',queueSync);
  }

  const boot=()=>requestAnimationFrame(()=>{enhance();observe()});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
