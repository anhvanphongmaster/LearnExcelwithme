(() => {
  'use strict';
  const T=window.AVPTikTok,$=id=>document.getElementById(id);if(!T)return;
  let topics=[],lessons=[],selected='',loading=null,loaded=false,busy=false,topicEdit=null,lessonEdit=null,dirty=false,fileCleared=false;
  const topic=()=>topics.find(row=>row.id===selected);
  function notice(text){$('attNotice').hidden=!text;$('attNotice').textContent=text||''}
  function formMessage(form,text){const node=form.querySelector('.att-form-message');node.hidden=!text;node.textContent=text||''}
  function hasEditor(){return !$('attTopicForm').hidden||!$('attLessonForm').hidden}
  function closeEditor(force=false){if(busy&&!force)return false;if(dirty&&!force)return false;$('attTopicForm').hidden=true;$('attLessonForm').hidden=true;dirty=false;return true}
  async function requestCloseEditor(){if(busy)return false;if(dirty){const ok=await window.avpConfirm('Các thay đổi chưa lưu sẽ bị bỏ.',{title:'Bỏ thay đổi chưa lưu?',tone:'warn',ok:'Bỏ thay đổi',cancel:'Tiếp tục sửa'});if(!ok)return false}return closeEditor(true)}
  function topicCard(row){const list=lessons.filter(item=>item.topic_id===row.id),live=list.filter(item=>item.status==='published').length;return `<article class="att-topic-card"><div><span class="att-badge ${row.is_active?'live':''}">${row.is_active?'Đang bật':'Đang ẩn'}</span><h3>${T.esc(row.title)}</h3><p>${T.esc(row.description||'')}</p><small>${list.length} bài · ${live} đã phát hành</small></div><div class="att-row-actions"><button type="button" data-att-open-topic="${T.esc(row.id)}" class="primary">Quản lý bài →</button><button type="button" data-att-edit-topic="${T.esc(row.id)}">Sửa chủ đề</button><button type="button" data-att-delete-topic="${T.esc(row.id)}" class="danger">Xóa</button></div></article>`}
  function render(){
    $('attTopicsCount').textContent=topics.length;$('attLiveCount').textContent=lessons.filter(row=>row.status==='published'&&topics.some(t=>t.id===row.topic_id&&t.is_active)).length;$('attDraftCount').textContent=lessons.filter(row=>row.status==='draft').length;
    $('attTopicList').innerHTML=topics.length?topics.map(topicCard).join(''):'<div class="att-empty"><strong>Chưa có chủ đề TikTok</strong><p>Bấm Thêm chủ đề để bắt đầu. Sau đó thêm bài và lưu nháp hoặc phát hành.</p></div>';
    const row=topic();if(!row)selected='';
    $('attTopicsView').hidden=Boolean(row);$('attLessonsView').hidden=!row;
    if(row){$('attTopicHeading').textContent=row.title;$('attTopicHint').textContent=row.is_active?'Các bài phát hành sẽ xuất hiện trên trang TikTok.':'Chủ đề đang ẩn. Các bài bên trong chưa công khai.';renderLessons()}
  }
  function renderLessons(){
    const query=T.normalize($('attSearch').value),status=$('attStatusFilter').value;
    const rows=lessons.filter(row=>row.topic_id===selected&&T.normalize(row.title+' '+row.description).includes(query)&&(status==='all'||row.status===status));
    $('attLessonList').innerHTML=rows.length?rows.map(row=>`<article class="att-lesson-row"><div><span class="att-badge ${row.status==='published'?'live':''}">${row.status==='published'?'Đã phát hành':'Bản nháp'}</span><h4>${T.esc(row.title)}</h4><p>${T.esc(row.description||'')}</p><small>${row.tiktok_url?'✓ Có video':'Chưa gắn video'} · ${row.file_path||row.file_url?'✓ Có file':'Chưa gắn file'} · Thứ tự ${Number(row.sort_order)||0}</small></div><div class="att-row-actions"><button type="button" data-att-edit-lesson="${T.esc(row.id)}">Sửa bài</button>${row.tiktok_url?`<a href="${T.esc(T.videoUrl(row.tiktok_url))}" target="_blank" rel="noopener noreferrer">Xem TikTok ↗</a>`:''}${row.file_path||row.file_url?`<button type="button" data-att-file="${T.esc(row.id)}">Xem file</button>`:''}<button type="button" data-att-toggle="${T.esc(row.id)}">${row.status==='published'?'Đưa về nháp':'Phát hành'}</button><button type="button" data-att-delete-lesson="${T.esc(row.id)}" class="danger">Xóa bài</button>${row.status==='published'&&topic()?.is_active?`<a href="practice-tiktok.html?topic=${T.esc(row.topic_id)}&lesson=${T.esc(row.id)}" target="_blank" rel="noopener">Xem trên website ↗</a>`:''}</div><p class="att-action-notice" role="status" hidden></p></article>`).join(''):'<div class="att-empty">Chưa có bài phù hợp. Bạn có thể thêm bài mới hoặc đổi bộ lọc.</div>';
  }
  function load(force=false){
    if(loading)return loading;if(loaded&&!force){render();return Promise.resolve(true)}
    $('attReload').disabled=true;notice('Đang tải chủ đề và bài TikTok…');
    loading=(async()=>{try{const data=await T.rpc('admin_tiktok_catalog_v1');topics=Array.isArray(data?.topics)?data.topics:[];lessons=Array.isArray(data?.lessons)?data.lessons:[];loaded=true;render();notice('');return true}catch(error){loaded=false;notice(T.message(error,true));return false}finally{loading=null;$('attReload').disabled=busy}})();return loading;
  }
  async function openTopic(row){
    if(!loaded||!(await requestCloseEditor()))return;topicEdit=row||null;$('attTopicForm').reset();$('attTopicFormTitle').textContent=row?'Sửa chủ đề':'Thêm chủ đề';$('attTopicTitle').value=row?.title||'';$('attTopicDescription').value=row?.description||'';$('attTopicOrder').value=row?.sort_order??topics.length;$('attTopicActive').checked=row?row.is_active:true;formMessage($('attTopicForm'),'');$('attTopicForm').hidden=false;$('attTopicTitle').focus();$('attTopicForm').scrollIntoView({block:'start',behavior:'smooth'});
  }
  function fileMode(){const mode=$('attFileMode').value;$('attUploadGroup').hidden=mode!=='upload';$('attLinkGroup').hidden=mode!=='link';$('attCurrentFile').textContent=!fileCleared&&lessonEdit?.file_path?`File đang gắn: ${lessonEdit.file_name||'File thực hành'}`:'Chưa có file tải lên.';$('attClearFile').hidden=fileCleared||!lessonEdit?.file_path}
  async function openLesson(row){
    if(!loaded||!(await requestCloseEditor()))return;lessonEdit=row||{id:T.uuid(),topic_id:selected};fileCleared=false;
    $('attLessonForm').reset();$('attLessonFormTitle').textContent=row?'Sửa bài TikTok':'Thêm bài TikTok';$('attLessonTopic').innerHTML=topics.map(t=>`<option value="${T.esc(t.id)}">${T.esc(t.title)}${t.is_active?'':' (đang ẩn)'}</option>`).join('');$('attLessonTopic').value=lessonEdit.topic_id;
    $('attLessonTitle').value=row?.title||'';$('attLessonDescription').value=row?.description||'';$('attLessonVideo').value=row?.tiktok_url||'';$('attLessonOrder').value=row?.sort_order??lessons.filter(x=>x.topic_id===selected).length;$('attLessonStatus').value=row?.status||'draft';$('attFileMode').value=row?.file_url?'link':'upload';$('attFileUrl').value=row?.file_url||'';fileMode();formMessage($('attLessonForm'),'');$('attLessonForm').hidden=false;$('attLessonTitle').focus();$('attLessonForm').scrollIntoView({block:'start',behavior:'smooth'});
  }
  function orderValue(id){const value=$(id).value.trim(),n=Number(value);if(!value||!Number.isInteger(n)||n<0||n>9999)throw new Error('invalid_order');return n}
  async function mutate(work,form=null){
    if(busy)return false;busy=true;
    const controls=[...$('adminTikTokPanel').querySelectorAll('button,input,textarea,select')],states=controls.map(n=>n.disabled);controls.forEach(n=>n.disabled=true);if(form)formMessage(form,'Đang lưu…');
    try{await work();return true}catch(error){const text=T.message(error,true);if(form)formMessage(form,text);else notice(text);return false}finally{busy=false;controls.forEach((n,i)=>{if(n.isConnected)n.disabled=states[i]});$('attReload').disabled=false}
  }
  async function saveTopic(event){
    event.preventDefault();if(busy)return;const form=$('attTopicForm');let payload;
    try{payload={id:topicEdit?.id||T.uuid(),expected_updated_at:topicEdit?.updated_at||null,title:$('attTopicTitle').value.trim(),description:$('attTopicDescription').value.trim(),sort_order:orderValue('attTopicOrder'),is_active:$('attTopicActive').checked};if(!payload.title||payload.title.length>100)throw new Error('invalid_title')}catch(error){formMessage(form,T.message(error,true));return}
    await mutate(async()=>{const row=await T.rpc('admin_tiktok_save_topic_v1',{p_topic:payload},false);selected=row.id;closeEditor(true);const refreshed=await load(true);notice(refreshed?'Đã lưu chủ đề. Bạn có thể thêm bài bên trong.':'Chủ đề đã lưu; danh sách chưa cập nhật được. Bấm Làm mới trước khi thêm bài.');},form);
  }
  async function saveLesson(event){
    event.preventDefault();if(busy)return;const form=$('attLessonForm'),old=lessonEdit;let payload,file=null;
    try{
      const raw=$('attLessonVideo').value.trim(),url=T.videoUrl(raw);if(raw&&!url)throw new Error('invalid_video_url');
      payload={id:old.id,expected_updated_at:old.updated_at||null,topic_id:$('attLessonTopic').value,title:$('attLessonTitle').value.trim(),description:$('attLessonDescription').value.trim(),sort_order:orderValue('attLessonOrder'),status:$('attLessonStatus').value,tiktok_url:url||null,file_path:null,file_url:null,file_name:null,file_size:null};
      if(!payload.title||payload.title.length>180)throw new Error('invalid_title');
      if($('attFileMode').value==='link'){const rawFile=$('attFileUrl').value.trim();payload.file_url=T.safeUrl(rawFile)||null;if(rawFile&&!payload.file_url)throw new Error('invalid_file_url');payload.file_name=payload.file_url?'File thực hành':null}
      else{file=$('attFileInput').files?.[0]||null;if(file)T.validateFile(file);else if(!fileCleared){payload.file_path=old.file_path||null;payload.file_name=old.file_name||null;payload.file_size=old.file_size||null}}
      if(payload.status==='published'){if(!url)throw new Error('video_required');if(!file&&!payload.file_path&&!payload.file_url)throw new Error('file_required')}
    }catch(error){formMessage(form,/^File |^Chỉ nhận/.test(error.message)?error.message:T.message(error,true));return}
    await mutate(async()=>{
      let uploaded=null,committed=false;
      try{
        if(file){uploaded=await T.upload(file,payload.id);Object.assign(payload,uploaded)}
        const row=await T.rpc('admin_tiktok_save_lesson_v1',{p_lesson:payload},false);committed=true;selected=row.topic_id;
        if(old.file_path&&old.file_path!==row.file_path)await T.removeFile(old.file_path);
        closeEditor(true);const refreshed=await load(true);notice(refreshed?(row.status==='published'?'Đã phát hành bài TikTok.':'Đã lưu bản nháp. Bài chưa hiện trên trang TikTok.'):'Bài đã lưu; danh sách chưa cập nhật được. Bấm Làm mới trước khi sửa tiếp.');
      }catch(error){if(uploaded&&!committed&&T.explicitRejection(error))await T.removeFile(uploaded.file_path);throw error}
    },form);
  }
  async function toggleLesson(row){
    if(!row||busy||!(await requestCloseEditor()))return;const published=row.status!=='published';
    if(published&&(!T.videoUrl(row.tiktok_url)||(!row.file_path&&!row.file_url))){notice('Hãy sửa bài và gắn đủ video TikTok cùng file thực hành trước khi phát hành.');return}
    const ok=await window.avpConfirm(published?'Bài sẽ xuất hiện trên trang TikTok Practice.':'Bài sẽ được đưa về bản nháp và ẩn khỏi trang TikTok Practice.',{title:published?'Phát hành bài TikTok?':'Đưa bài về nháp?',tone:published?'ok':'warn',ok:published?'Phát hành':'Đưa về nháp',cancel:'Hủy'});if(!ok)return;
    await mutate(async()=>{await T.rpc('admin_tiktok_save_lesson_v1',{p_lesson:{...row,status:published?'published':'draft',expected_updated_at:row.updated_at}},false);await load(true);});
  }
  async function deleteItem(kind,row){
    if(!row||busy||!(await requestCloseEditor()))return;
    if(kind==='topic'&&lessons.some(x=>x.topic_id===row.id)){notice('Chủ đề còn bài. Hãy xóa hoặc chuyển các bài sang chủ đề khác trước.');return}
    const ok=await window.avpConfirm(`${kind==='topic'?'Chủ đề':'Bài'} “${row.title}” sẽ bị xóa khỏi hệ thống.`,{title:`Xóa ${kind==='topic'?'chủ đề':'bài'}?`,icon:"🗑️",tone:"danger",ok:"Xóa",cancel:"Hủy"});if(!ok)return;
    await mutate(async()=>{const result=await T.rpc('admin_tiktok_delete_v1',{p_kind:kind,p_id:row.id,p_expected_updated_at:row.updated_at},false);if(result?.file_path)await T.removeFile(result.file_path);await load(true);});
  }
  function boot(){
    if(!$('adminTikTokPanel'))return;
    $('attReload').addEventListener('click',async()=>{if(await requestCloseEditor())load(true)});
    $('attAddTopic').addEventListener('click',()=>openTopic());$('attAddLesson').addEventListener('click',()=>openLesson());
    $('attBackTopics').addEventListener('click',async()=>{if(await requestCloseEditor()){selected='';render()}});
    $('attTopicForm').addEventListener('submit',saveTopic);$('attLessonForm').addEventListener('submit',saveLesson);
    ['attTopicForm','attLessonForm'].forEach(id=>{$(id).addEventListener('input',()=>dirty=true);$(id).addEventListener('change',()=>dirty=true)});
    $('attFileMode').addEventListener('change',fileMode);$('attClearFile').addEventListener('click',()=>{fileCleared=true;dirty=true;$('attFileInput').value='';fileMode()});
    $('attSearch').addEventListener('input',renderLessons);$('attStatusFilter').addEventListener('change',renderLessons);
    $('adminTikTokPanel').addEventListener('click',async event=>{
      const b=event.target.closest('button');if(!b||b.disabled||busy)return;
      if(b.hasAttribute('data-att-close'))return requestCloseEditor();
      if(b.dataset.attOpenTopic&&(await requestCloseEditor())){selected=b.dataset.attOpenTopic;$('attSearch').value='';$('attStatusFilter').value='all';render();return}
      if(b.dataset.attEditTopic)return openTopic(topics.find(r=>r.id===b.dataset.attEditTopic));
      if(b.dataset.attDeleteTopic)return deleteItem('topic',topics.find(r=>r.id===b.dataset.attDeleteTopic));
      if(b.dataset.attEditLesson)return openLesson(lessons.find(r=>r.id===b.dataset.attEditLesson));
      if(b.dataset.attToggle)return toggleLesson(lessons.find(r=>r.id===b.dataset.attToggle));
      if(b.dataset.attDeleteLesson)return deleteItem('lesson',lessons.find(r=>r.id===b.dataset.attDeleteLesson));
      if(b.dataset.attFile)return T.download(b.dataset.attFile,b,b.closest('article').querySelector('.att-action-notice'));
    });
    window.addEventListener('avp:admin-tiktok-open',()=>load());
    // Covers a restored Admin tab whose activation happened before this deferred script.
    if(!$('adminDashboard')?.hidden&&document.querySelector('[data-admin-view="practice"].active'))load();
    window.addEventListener('beforeunload',event=>{if(dirty||busy){event.preventDefault();event.returnValue=''}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
