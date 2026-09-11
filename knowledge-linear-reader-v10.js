(() => {
  'use strict';
  if(window.__AVP_LINEAR_READER_V10__) return;
  window.__AVP_LINEAR_READER_V10__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function cleanLabel(text){
    return String(text||'').replace(/^\s*\d+\s*/,'').replace(/\s+/g,' ').trim();
  }

  function outlineItems(){
    const sidebar=$('#kvSidebar');
    if(!sidebar) return [];
    return $$('[data-outline]',sidebar).map((b,i)=>({
      index:Number(b.dataset.outline),
      label:cleanLabel(b.textContent),
      extension:b.dataset.kind==='extension',
      active:b.classList.contains('active')
    }));
  }

  function activate(index){
    const sidebar=$('#kvSidebar');
    sidebar?.querySelector(`[data-outline="${index}"]`)?.click();
  }

  function buildNavigator(){
    const host=$('#kvSections');
    if(!host) return;
    let nav=$('#avpReaderNavigatorV10');
    if(!nav){
      nav=document.createElement('section');
      nav.id='avpReaderNavigatorV10';
      nav.className='avp-reader-navigator-v10';
      host.parentNode.insertBefore(nav,host);
    }
    const items=outlineItems();
    if(!items.length) return;
    const activePos=Math.max(0,items.findIndex(x=>x.active));
    const current=items[activePos]||items[0];
    nav.innerHTML=`
      <div class="avp-reader-current-v10">
        <small>BẠN ĐANG HỌC</small>
        <strong>Bước ${activePos+1}/${items.length} · ${esc(current.extension?'Học thêm — '+current.label:current.label)}</strong>
      </div>
      <div class="avp-reader-controls-v10">
        <button type="button" data-reader-prev ${activePos===0?'disabled':''}>← Bước trước</button>
        <select data-reader-select aria-label="Chọn bước trong bài">
          ${items.map((x,i)=>`<option value="${x.index}" ${i===activePos?'selected':''}>${x.extension?'Học thêm':'Bước '+(i+1)} — ${esc(x.label)}</option>`).join('')}
        </select>
        <button type="button" data-reader-next ${activePos===items.length-1?'disabled':''}>Bước tiếp →</button>
      </div>`;
    $('[data-reader-prev]',nav)?.addEventListener('click',()=>{if(activePos>0)activate(items[activePos-1].index)});
    $('[data-reader-next]',nav)?.addEventListener('click',()=>{if(activePos<items.length-1)activate(items[activePos+1].index)});
    $('[data-reader-select]',nav)?.addEventListener('change',e=>activate(Number(e.target.value)));
  }

  function renameDetails(){
    const sum=$('.avp-focus-summary-v9>summary');
    const vis=$('.avp-focus-visual-v9>summary');
    if(sum) sum.firstChild.textContent='Bấm để mở · Mục tiêu, ứng dụng & kiến thức nền';
    if(vis) vis.firstChild.textContent='Bấm để mở · Minh họa thao tác';
  }

  function labelFlowButtons(){
    const items=outlineItems();
    if(!items.length) return;
    $$('[data-flow-section]').forEach(btn=>{
      const idx=Number(btn.dataset.flowSection);
      const pos=items.findIndex(x=>x.index===idx);
      const item=items[pos];
      if(!item) return;
      const isForward=btn.classList.contains('next');
      btn.textContent=isForward?`Bước ${pos+1}: ${item.label} →`:`← Bước ${pos+1}: ${item.label}`;
    });
  }

  function simplifyCourseNav(){
    const nav=$('#kvCourseNav');
    if(!nav) return;
    $$('.kv-course-edge strong',nav).forEach(el=>{
      const txt=el.textContent.trim();
      if(txt.length>64) el.textContent=txt.slice(0,61).replace(/\s+\S*$/,'')+'…';
    });
  }

  function enhance(){
    document.body.classList.add('avp-linear-reader-v10');
    renameDetails();
    buildNavigator();
    labelFlowButtons();
    simplifyCourseNav();
  }

  function observe(){
    const sections=$('#kvSections');
    const sidebar=$('#kvSidebar');
    const intro=$('#kvIntro');
    if(sections) new MutationObserver(()=>{buildNavigator();labelFlowButtons()}).observe(sections,{childList:true,subtree:true});
    if(sidebar) new MutationObserver(()=>buildNavigator()).observe(sidebar,{attributes:true,subtree:true,attributeFilter:['class','aria-current']});
    if(intro) new MutationObserver(()=>renameDetails()).observe(intro,{childList:true,subtree:true});
  }

  const boot=()=>requestAnimationFrame(()=>{enhance();observe()});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
