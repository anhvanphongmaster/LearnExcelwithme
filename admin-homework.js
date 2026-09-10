(()=>{
  'use strict';
  if(window.__AVP_ADMIN_HOMEWORK_STANDALONE_V1__)return;
  window.__AVP_ADMIN_HOMEWORK_STANDALONE_V1__=true;
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let rows=[];

  async function waitClient(){
    for(let i=0;i<70;i++){
      const c=window.avpSupabase||window.supabaseClient||window._supabaseClient;
      if(c?.rpc)return c;
      await new Promise(r=>setTimeout(r,100));
    }
    throw new Error('Supabase chưa sẵn sàng');
  }
  async function rpc(name,args={}){
    const c=await waitClient();const {data,error}=await c.rpc(name,args);if(error)throw error;return data;
  }
  function msg(text,tone=''){
    const el=$('ahwMessage');if(!el)return;el.textContent=text||'';el.className=`ahw-message ${tone}`;
  }
  function isHttp(v){const s=String(v||'').trim();return !s||/^https?:\/\/[^\s<>"']+$/i.test(s)}
  function isFileUrl(v){const s=String(v||'').trim();return !s||isHttp(s)||/^\.?\/?[\wÀ-ỹ()[\] ._%-]+(?:\/[\wÀ-ỹ()[\] ._?&=%#-]+)*$/i.test(s)}
  function topicKey(v){return String(v||'').trim().toLocaleLowerCase('vi')}
  function currentId(){return String($('ahwId')?.value||'')}

  function previousFor(topic,order,id=''){
    const key=topicKey(topic);const n=Number(order||0);
    return rows.filter(r=>topicKey(r.topic)===key&&Number(r.order_no)<n&&String(r.id)!==String(id)).sort((a,b)=>Number(b.order_no)-Number(a.order_no))[0]||null;
  }
  function refreshGuideDefault(){
    const topic=$('ahwTopic')?.value.trim()||'';const order=Number($('ahwOrder')?.value||1);const guide=$('ahwGuide');const note=$('ahwGuideNote');if(!guide||!note)return;
    const prev=previousFor(topic,order,currentId());
    if(order<=1){note.textContent='Bài 01 phải gắn Video hướng dẫn thủ công trước khi phát hành.';return}
    if(guide.value.trim()){
      note.textContent=prev?.solution_video_url?`Đang dùng link đã nhập. Video giải Bài ${String(prev.order_no).padStart(2,'0')} có thể dùng làm mặc định nếu xóa link này.`:'Đang dùng link đã nhập thủ công.';
      return;
    }
    if(prev?.solution_video_url){
      guide.value=prev.solution_video_url;
      guide.dataset.auto='1';
      note.textContent=`Đã tự lấy Video giải của Bài ${String(prev.order_no).padStart(2,'0')} làm Video hướng dẫn.`;
    }else{
      guide.dataset.auto='';
      note.textContent='Bài trước chưa có Video giải. Hãy gắn Video hướng dẫn thủ công nếu muốn phát hành bài này.';
    }
  }
  function resetForm(){
    $('ahwId').value='';$('ahwTopic').value='';$('ahwOrder').value='1';$('ahwTitle').value='';$('ahwFile').value='';$('ahwGuide').value='';$('ahwGuide').dataset.auto='';$('ahwSolution').value='';$('ahwHint1').value='';$('ahwHint2').value='';$('ahwStatus').value='draft';
    $('ahwMode').textContent='BÀI MỚI';$('ahwEditorTitle').textContent='Tạo Homework';$('ahwDelete').hidden=true;msg('');refreshGuideDefault();
  }
  function fill(row){
    $('ahwId').value=row.id||'';$('ahwTopic').value=row.topic||'';$('ahwOrder').value=Number(row.order_no||1);$('ahwTitle').value=row.title||'';$('ahwFile').value=row.file_url||'';$('ahwGuide').value=row.guide_video_url||'';$('ahwGuide').dataset.auto='';$('ahwSolution').value=row.solution_video_url||'';$('ahwHint1').value=row.hint1||'';$('ahwHint2').value=row.hint2||'';$('ahwStatus').value=row.status==='published'?'published':'draft';
    $('ahwMode').textContent=`ĐANG SỬA · BÀI ${String(row.order_no).padStart(2,'0')}`;$('ahwEditorTitle').textContent=row.title||'Homework';$('ahwDelete').hidden=false;msg('Đã tải bài để chỉnh sửa.','ok');refreshGuideDefault();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function populateTopics(){
    const topics=[...new Set(rows.map(r=>String(r.topic||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'vi'));
    $('ahwTopicOptions').innerHTML=topics.map(t=>`<option value="${esc(t)}"></option>`).join('');
    const filter=$('ahwTopicFilter'),old=filter.value;
    filter.innerHTML='<option value="all">Tất cả chủ đề</option>'+topics.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join('');
    if([...filter.options].some(o=>o.value===old))filter.value=old;
  }
  function renderList(){
    const host=$('ahwList');if(!host)return;
    const filter=$('ahwTopicFilter')?.value||'all';
    const list=rows.filter(r=>filter==='all'||r.topic===filter);
    if(!list.length){host.innerHTML='<p class="ahw-empty">Chưa có Homework trong bộ lọc này.</p>';return}
    host.innerHTML=list.map(r=>`<button type="button" class="ahw-row ${r.status==='published'?'published':'draft'}" data-id="${esc(r.id)}"><span><b>${String(Number(r.order_no||0)).padStart(2,'0')}</b><em>${esc(r.topic)}</em></span><strong>${esc(r.title)}</strong><small>${r.status==='published'?'ĐANG PHÁT HÀNH':'BẢN NHÁP'}${r.solution_video_url?' · CÓ VIDEO GIẢI':' · CHƯA CÓ VIDEO GIẢI'}</small></button>`).join('');
  }
  async function load(){
    const host=$('ahwList');if(host)host.innerHTML='<p class="ahw-loading">Đang tải Homework…</p>';
    try{
      rows=(await rpc('admin_homework_list_v1'))||[];
      rows.sort((a,b)=>topicKey(a.topic).localeCompare(topicKey(b.topic),'vi')||Number(a.order_no)-Number(b.order_no));
      populateTopics();renderList();msg(`Đã tải ${rows.length} Homework.`,'ok');
    }catch(e){
      console.warn('Admin Homework load',e);
      if(host)host.innerHTML='<div class="ahw-denied"><strong>Không mở được Admin Homework</strong><p>'+esc(e.message||e)+'</p><a href="auth.html?next=admin-homework.html&admin=1&tab=login">Đăng nhập Admin →</a></div>';
      msg('Không tải được dữ liệu.','error');
    }
  }
  function collect(){return {
    p_id:$('ahwId').value||null,
    p_topic:$('ahwTopic').value.trim(),
    p_order_no:Number($('ahwOrder').value||1),
    p_title:$('ahwTitle').value.trim(),
    p_file_url:$('ahwFile').value.trim()||null,
    p_guide_video_url:$('ahwGuide').value.trim()||null,
    p_solution_video_url:$('ahwSolution').value.trim()||null,
    p_hint1:$('ahwHint1').value.trim()||null,
    p_hint2:$('ahwHint2').value.trim()||null,
    p_status:$('ahwStatus').value
  }}
  async function save(e){
    e?.preventDefault();refreshGuideDefault();const v=collect();
    if(!v.p_topic||!v.p_title||v.p_order_no<1)return msg('Cần Chủ đề, STT và Tên bài.','error');
    if(!isFileUrl(v.p_file_url)||!isHttp(v.p_guide_video_url)||!isHttp(v.p_solution_video_url))return msg('Có link/đường dẫn không hợp lệ. Video phải dùng http/https.','error');
    if(v.p_status==='published'&&!v.p_guide_video_url)return msg('Không thể phát hành: cần Video hướng dẫn. Bài 02+ sẽ tự lấy Video giải bài trước nếu có.','error');
    const btn=$('ahwSave');btn.disabled=true;msg('Đang lưu…');
    try{
      const saved=await rpc('admin_homework_upsert_v1',v);
      await load();
      const row=Array.isArray(saved)?saved[0]:saved;
      if(row?.id){const fresh=rows.find(x=>String(x.id)===String(row.id));if(fresh)fill(fresh)}
      msg(v.p_status==='published'?'Đã lưu và PHÁT HÀNH Homework.':'Đã lưu BẢN NHÁP.','ok');
    }catch(err){console.warn('Admin Homework save',err);msg('Lưu thất bại: '+(err.message||err),'error')}finally{btn.disabled=false}
  }
  async function remove(){
    const id=currentId();if(!id)return;
    const row=rows.find(r=>String(r.id)===id);const text=`Xóa Bài ${row?.order_no||''} · ${row?.title||'Homework'}?`;
    const ok=window.avpConfirm?await window.avpConfirm(text,{title:'Xóa Homework?',icon:'🗑️',tone:'danger',ok:'Xóa',cancel:'Hủy'}):confirm(text);if(!ok)return;
    try{await rpc('admin_homework_delete_v1',{p_id:id});resetForm();await load();msg('Đã xóa Homework.','ok')}catch(e){msg('Xóa thất bại: '+(e.message||e),'error')}
  }
  function bind(){
    $('ahwForm')?.addEventListener('submit',save);$('ahwNew')?.addEventListener('click',resetForm);$('ahwReset')?.addEventListener('click',resetForm);$('ahwReload')?.addEventListener('click',load);$('ahwDelete')?.addEventListener('click',remove);$('ahwTopicFilter')?.addEventListener('change',renderList);
    ['ahwTopic','ahwOrder'].forEach(id=>$(id)?.addEventListener('change',()=>{if($('ahwGuide').dataset.auto==='1'){$('ahwGuide').value='';$('ahwGuide').dataset.auto=''}refreshGuideDefault()}));
    $('ahwGuide')?.addEventListener('input',()=>{$('ahwGuide').dataset.auto=''});
    $('ahwList')?.addEventListener('click',e=>{const b=e.target.closest('[data-id]');if(!b)return;const row=rows.find(r=>String(r.id)===String(b.dataset.id));if(row)fill(row)});
  }
  function boot(){if(!$('adminHomeworkStandalone'))return;bind();resetForm();load()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
