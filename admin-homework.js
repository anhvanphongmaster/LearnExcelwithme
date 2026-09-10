(()=>{
  'use strict';
  if(window.__AVP_ADMIN_HOMEWORK_STANDALONE_V2__)return;
  window.__AVP_ADMIN_HOMEWORK_STANDALONE_V2__=true;

  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const rowsByTopic=(a,b)=>String(a.topic||'').localeCompare(String(b.topic||''),'vi')||Number(a.order_no||0)-Number(b.order_no||0);
  let rows=[],editingId=null,loaded=false;

  function injectCss(){
    if(document.querySelector('link[data-admin-homework-v2]'))return;
    const link=document.createElement('link');link.rel='stylesheet';link.href='admin-homework.css?v=20260910-standalone2';link.dataset.adminHomeworkV2='1';document.head.appendChild(link);
  }
  function buildUi(){
    if($('adminHomeworkStandalonePanel'))return true;
    const tabs=document.querySelector('.admin-view-tabs'),dashboard=$('adminDashboard');
    if(!tabs||!dashboard)return false;
    const youtubeTab=tabs.querySelector('[data-admin-view="youtube"]');
    const tab=document.createElement('button');tab.type='button';tab.dataset.adminView='homework';tab.setAttribute('role','tab');
    tab.innerHTML='<b>📝 YT Practice</b><small>Homework riêng · file & video</small>';
    youtubeTab?.after(tab) || tabs.appendChild(tab);

    const wrap=document.createElement('div');
    wrap.innerHTML=`
      <div class="admin-section-heading admin-view-section admin-view-hidden" data-admin-section="homework" hidden>
        <span>📝 YOUTUBE PRACTICE</span><h2>Homework tách riêng khỏi Project</h2>
      </div>
      <section class="admin-panel admin-view-section ahw-panel admin-view-hidden" data-admin-section="homework" id="adminHomeworkStandalonePanel" hidden>
        <div class="ahw-head">
          <div><span>HOMEWORK · HỆ RIÊNG</span><strong>Quản lý bài tập theo chủ đề</strong><p>Không đọc hoặc ghi <code>youtube_projects.parts</code>. Bài 2 trở đi có thể tự lấy video giải của bài liền trước làm video hướng dẫn.</p></div>
          <div class="ahw-head-actions"><a href="homework.html" target="_blank" rel="noopener">Xem trang học viên ↗</a><button type="button" id="ahwReload">↻ Làm mới</button></div>
        </div>
        <div class="ahw-kpis"><article><small>Chủ đề</small><strong id="ahwKpiTopics">0</strong></article><article><small>Đã phát hành</small><strong id="ahwKpiLive">0</strong></article><article><small>Bản nháp</small><strong id="ahwKpiDraft">0</strong></article><article><small>Có video giải</small><strong id="ahwKpiSolved">0</strong></article></div>
        <div class="ahw-toolbar"><label><span>Chủ đề</span><select id="ahwTopicFilter"><option value="all">Tất cả chủ đề</option></select></label><label><span>Trạng thái</span><select id="ahwStatusFilter"><option value="all">Tất cả</option><option value="published">Đã phát hành</option><option value="draft">Bản nháp</option></select></label><label class="ahw-search"><span>Tìm bài</span><input id="ahwSearch" type="search" placeholder="Tên bài hoặc chủ đề…"></label><button type="button" class="primary" id="ahwAdd">＋ Thêm Homework</button></div>
        <p class="ahw-message" id="ahwMessage" role="status"></p>
        <div class="ahw-list" id="ahwList"><div class="ahw-empty">Chọn YT Practice để tải dữ liệu.</div></div>
        <form class="ahw-editor" id="ahwEditor" hidden>
          <div class="ahw-editor-head"><div><span>HOMEWORK EDITOR</span><h3 id="ahwEditorTitle">Thêm Homework</h3></div><button type="button" id="ahwClose">Đóng</button></div>
          <div class="ahw-form">
            <label><span>Chủ đề</span><input id="ahwTopic" list="ahwTopicOptions" maxlength="100" required placeholder="Ví dụ: Power Query"><datalist id="ahwTopicOptions"></datalist></label>
            <label><span>STT trong chủ đề</span><input id="ahwOrder" type="number" min="1" max="9999" step="1" value="1" required></label>
            <label class="wide"><span>Tên bài</span><input id="ahwTitle" maxlength="180" required placeholder="Ví dụ: Chuẩn hóa 12 file bán hàng"></label>
            <div class="wide ahw-filebox">
              <div><span>File bài tập</span><small>Có thể upload file mới hoặc dán đường dẫn có sẵn.</small></div>
              <div class="ahw-filegrid"><input id="ahwFileInput" type="file" accept=".xlsx,.xls,.xlsm,.csv,.zip"><input id="ahwFileUrl" maxlength="1600" placeholder="https://... hoặc downloads/..."></div>
              <p id="ahwFileState">Chưa gắn file.</p>
            </div>
            <label class="wide"><span>Link video hướng dẫn</span><input id="ahwGuide" maxlength="1600" placeholder="https://youtu.be/..."><small id="ahwChainNote">Bài 1 cần nhập link hướng dẫn thủ công.</small></label>
            <label class="wide"><span>Link video giải bài</span><input id="ahwSolution" maxlength="1600" placeholder="Có thể gắn sau khi phát hành"></label>
            <label><span>Hint 1</span><textarea id="ahwHint1" rows="3" maxlength="1000" placeholder="Gợi ý nhẹ"></textarea></label>
            <label><span>Hint 2</span><textarea id="ahwHint2" rows="3" maxlength="1000" placeholder="Gợi ý rõ hơn"></textarea></label>
            <label><span>Trạng thái</span><select id="ahwStatus"><option value="draft">Bản nháp</option><option value="published">Phát hành</option></select><small>Không có video hướng dẫn thì không thể phát hành.</small></label>
            <div class="ahw-rule"><strong>Quy tắc nối video</strong><p>#01: nhập video hướng dẫn. Từ #02: nếu ô hướng dẫn đang trống, hệ thống lấy video giải của bài # trước đó trong cùng chủ đề.</p></div>
          </div>
          <div class="ahw-actions"><button type="submit" class="primary" id="ahwSave">Lưu Homework</button><button type="button" id="ahwCancel">Hủy</button></div>
        </form>
      </section>`;
    while(wrap.firstChild)dashboard.appendChild(wrap.firstChild);
    return true;
  }

  async function waitClient(){for(let i=0;i<60;i++){const c=window.avpSupabase||window.supabaseClient||window._supabaseClient;if(c?.rpc)return c;await new Promise(r=>setTimeout(r,100));}throw new Error('Supabase chưa sẵn sàng')}
  async function rpc(name,args={}){const c=await waitClient();const {data,error}=await c.rpc(name,args);if(error)throw error;return data}
  function msg(text,type=''){const el=$('ahwMessage');if(!el)return;el.textContent=text||'';el.className='ahw-message'+(type?' '+type:'')}
  function validUrl(v){const s=String(v||'').trim();if(!s)return true;if(/^(javascript|data|vbscript):/i.test(s))return false;if(/^https?:\/\/[^\s<>"']+$/i.test(s))return true;return /^\.?\/?[\wÀ-ỹ()[\] ._%-]+(?:\/[\wÀ-ỹ()[\] ._?&=%#-]+)*$/i.test(s)}
  function topicKey(v){return String(v||'').trim().toLocaleLowerCase('vi')}
  function getPrevious(topic,order,id=editingId){return rows.find(r=>String(r.id)!==String(id||'')&&topicKey(r.topic)===topicKey(topic)&&Number(r.order_no)===Number(order)-1)||null}
  function effectiveGuide(topic,order,current=''){
    const own=String(current||'').trim();if(own)return own;
    const n=Number(order||1);if(n<=1)return '';
    return String(getPrevious(topic,n)?.solution_video_url||'').trim();
  }
  function updateChainPreview({fill=false}={}){
    const topic=$('ahwTopic')?.value.trim()||'',order=Number($('ahwOrder')?.value||1),guide=$('ahwGuide'),note=$('ahwChainNote');if(!guide||!note)return;
    if(order<=1){note.textContent='Bài #01: cần gắn video hướng dẫn thủ công trước khi phát hành.';note.className='';return}
    const prev=getPrevious(topic,order),solution=String(prev?.solution_video_url||'').trim();
    if(solution){if(fill&&!guide.value.trim())guide.value=solution;note.textContent=`Tự nối từ bài #${String(order-1).padStart(2,'0')}: video giải của bài trước${guide.value.trim()===solution?' đang được dùng làm video hướng dẫn.':'.'}`;note.className='ok'}
    else{note.textContent=`Bài #${String(order-1).padStart(2,'0')} chưa có video giải. Bạn có thể lưu nháp, nhưng chưa thể phát hành nếu không nhập video hướng dẫn.`;note.className='warn'}
  }
  function setTopicOptions(){const topics=[...new Set(rows.map(r=>String(r.topic||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'vi'));const dl=$('ahwTopicOptions');if(dl)dl.innerHTML=topics.map(t=>`<option value="${esc(t)}"></option>`).join('');const select=$('ahwTopicFilter');if(select){const keep=select.value;select.innerHTML='<option value="all">Tất cả chủ đề</option>'+topics.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join('');select.value=[...select.options].some(o=>o.value===keep)?keep:'all'}}
  function updateKpis(){const topics=new Set(rows.map(r=>topicKey(r.topic)).filter(Boolean));$('ahwKpiTopics').textContent=topics.size;$('ahwKpiLive').textContent=rows.filter(r=>r.status==='published').length;$('ahwKpiDraft').textContent=rows.filter(r=>r.status==='draft').length;$('ahwKpiSolved').textContent=rows.filter(r=>String(r.solution_video_url||'').trim()).length}
  function resourceChip(ok,label){return `<span class="ahw-resource ${ok?'ok':'missing'}">${ok?'✓':'○'} ${esc(label)}</span>`}
  function render(){
    updateKpis();setTopicOptions();const host=$('ahwList');if(!host)return;
    const topic=$('ahwTopicFilter')?.value||'all',status=$('ahwStatusFilter')?.value||'all',q=String($('ahwSearch')?.value||'').trim().toLocaleLowerCase('vi');
    const list=rows.slice().sort(rowsByTopic).filter(r=>(topic==='all'||r.topic===topic)&&(status==='all'||r.status===status)&&(!q||`${r.topic} ${r.title}`.toLocaleLowerCase('vi').includes(q)));
    if(!list.length){host.innerHTML='<div class="ahw-empty">Chưa có Homework phù hợp.</div>';return}
    host.innerHTML=list.map(r=>{
      const guide=effectiveGuide(r.topic,r.order_no,r.guide_video_url),solution=String(r.solution_video_url||'').trim(),file=String(r.file_url||'').trim();
      return `<article class="ahw-row" data-id="${esc(r.id)}"><div class="ahw-order">#${String(r.order_no||1).padStart(2,'0')}</div><div class="ahw-copy"><span>${esc(r.topic)}</span><strong>${esc(r.title)}</strong><div>${resourceChip(!!guide,'Hướng dẫn')}${resourceChip(!!file,'File')}${resourceChip(!!solution,'Giải bài')}</div></div><span class="ahw-status ${r.status==='published'?'live':'draft'}">${r.status==='published'?'Đã phát hành':'Bản nháp'}</span><div class="ahw-row-actions"><button type="button" data-act="edit">Sửa</button><button type="button" class="danger" data-act="delete">Xóa</button></div></article>`
    }).join('')
  }
  async function load(){try{rows=await rpc('admin_homework_list_v1')||[];loaded=true;render();msg('Homework đang dùng hệ dữ liệu riêng, không phụ thuộc YouTube Projects.','ok')}catch(e){console.warn('Homework standalone',e);msg('Chưa tải được Homework: '+(e?.message||e),'error')}}
  function nextOrder(topic=''){const same=rows.filter(r=>!topic||topicKey(r.topic)===topicKey(topic));return Math.max(0,...same.map(r=>Number(r.order_no)||0))+1}
  function openEditor(row=null){editingId=row?.id||null;$('ahwEditor').hidden=false;$('ahwEditorTitle').textContent=row?'Sửa Homework':'Thêm Homework';$('ahwTopic').value=row?.topic||'';$('ahwOrder').value=row?.order_no||nextOrder();$('ahwTitle').value=row?.title||'';$('ahwFileUrl').value=row?.file_url||'';$('ahwFileInput').value='';$('ahwFileState').textContent=row?.file_url?'Đang giữ file hiện tại; chọn file mới để thay thế.':'Chưa gắn file.';$('ahwGuide').value=row?.guide_video_url||'';$('ahwSolution').value=row?.solution_video_url||'';$('ahwHint1').value=row?.hint1||'';$('ahwHint2').value=row?.hint2||'';$('ahwStatus').value=row?.status||'draft';updateChainPreview({fill:!row});$('ahwEditor').scrollIntoView({behavior:'smooth',block:'start'})}
  function closeEditor(){editingId=null;$('ahwEditor').hidden=true}
  async function uploadFile(file){if(!file)return '';if(file.size>20*1024*1024)throw new Error('File vượt quá 20 MB');const c=await waitClient();const safe=file.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]+/g,'-');const path=`homework/${Date.now()}-${Math.random().toString(36).slice(2,8)}-${safe}`;const {error}=await c.storage.from('site-downloads').upload(path,file,{upsert:false,contentType:file.type||undefined});if(error)throw error;const {data}=c.storage.from('site-downloads').getPublicUrl(path);return data?.publicUrl||''}
  async function save(e){
    e?.preventDefault();const topic=$('ahwTopic').value.trim(),order=Number($('ahwOrder').value||0),title=$('ahwTitle').value.trim();let fileUrl=$('ahwFileUrl').value.trim();let guide=$('ahwGuide').value.trim(),solution=$('ahwSolution').value.trim();const status=$('ahwStatus').value;
    if(!topic||!title||order<1)return msg('Cần nhập Chủ đề, STT hợp lệ và Tên bài.','error');
    updateChainPreview({fill:true});guide=$('ahwGuide').value.trim()||effectiveGuide(topic,order,'');
    if([fileUrl,guide,solution].some(v=>!validUrl(v)))return msg('Có đường dẫn không hợp lệ.','error');
    if(status==='published'&&!guide)return msg('Không thể phát hành: cần có video hướng dẫn. Với bài #02 trở đi, hãy gắn video giải cho bài liền trước hoặc nhập link hướng dẫn.','error');
    const btn=$('ahwSave');btn.disabled=true;
    try{
      const file=$('ahwFileInput').files?.[0];if(file){msg('Đang tải file bài tập lên…');fileUrl=await uploadFile(file);$('ahwFileUrl').value=fileUrl}
      await rpc('admin_homework_upsert_v1',{p_id:editingId||null,p_topic:topic,p_order_no:order,p_title:title,p_file_url:fileUrl||null,p_guide_video_url:guide||null,p_solution_video_url:solution||null,p_hint1:$('ahwHint1').value.trim()||null,p_hint2:$('ahwHint2').value.trim()||null,p_status:status});
      msg('Đã lưu Homework.','ok');closeEditor();await load()
    }catch(err){console.warn(err);msg(err?.message||'Không lưu được Homework.','error')}finally{btn.disabled=false}
  }
  async function removeRow(row){const ok=window.avpConfirm?await window.avpConfirm(`Xóa “${row.title}” khỏi Homework?`,{title:'Xóa Homework?',tone:'danger',ok:'Xóa',cancel:'Hủy'}):confirm(`Xóa “${row.title}”?`);if(!ok)return;try{await rpc('admin_homework_delete_v1',{p_id:row.id});msg('Đã xóa Homework.','ok');await load()}catch(e){msg(e?.message||'Không xóa được Homework.','error')}}
  function activateView(){
    document.querySelectorAll('.admin-view-tabs [data-admin-view]').forEach(b=>{const on=b.dataset.adminView==='homework';b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});
    document.querySelectorAll('[data-admin-section]').forEach(s=>{const show=s.dataset.adminSection==='homework';s.classList.toggle('admin-view-hidden',!show);if(s.dataset.adminSection==='homework')s.hidden=!show});
    try{localStorage.setItem('avp_admin_view_v1','homework')}catch{}
    if(!loaded)load();window.dispatchEvent(new CustomEvent('avp:admin-homework-open'))
  }
  function bind(){
    const tab=document.querySelector('.admin-view-tabs [data-admin-view="homework"]');tab?.addEventListener('click',e=>{e.preventDefault();activateView()});
    document.querySelectorAll('.admin-view-tabs [data-admin-view]:not([data-admin-view="homework"])').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-admin-section="homework"]').forEach(s=>{s.hidden=true;s.classList.add('admin-view-hidden')})}));
    $('ahwReload')?.addEventListener('click',load);$('ahwAdd')?.addEventListener('click',()=>openEditor());$('ahwClose')?.addEventListener('click',closeEditor);$('ahwCancel')?.addEventListener('click',closeEditor);$('ahwEditor')?.addEventListener('submit',save);$('ahwTopicFilter')?.addEventListener('change',render);$('ahwStatusFilter')?.addEventListener('change',render);$('ahwSearch')?.addEventListener('input',render);
    $('ahwTopic')?.addEventListener('change',()=>{if(!editingId)$('ahwOrder').value=nextOrder($('ahwTopic').value.trim());updateChainPreview({fill:true})});
    $('ahwOrder')?.addEventListener('change',()=>updateChainPreview({fill:true}));
    $('ahwFileInput')?.addEventListener('change',()=>{$('ahwFileState').textContent=$('ahwFileInput').files?.[0]?`Sẽ upload: ${$('ahwFileInput').files[0].name}`:($('ahwFileUrl').value?'Đang giữ file hiện tại.':'Chưa gắn file.')});
    $('ahwList')?.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const row=rows.find(r=>String(r.id)===String(b.closest('[data-id]')?.dataset.id));if(!row)return;b.dataset.act==='edit'?openEditor(row):removeRow(row)});
  }
  function boot(){injectCss();if(!buildUi())return setTimeout(boot,180);bind();try{if(localStorage.getItem('avp_admin_view_v1')==='homework')setTimeout(activateView,200)}catch{}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();