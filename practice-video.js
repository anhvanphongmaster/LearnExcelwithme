(() => {
  'use strict';
  const $=id=>document.getElementById(id),T=window.AVPTikTok;
  if(!T)return;
  let topics=[],lessons=[],selected='',loading=null,loaded=false;
  const currentTopic=()=>topics.find(row=>row.id===selected);
  function route(){const q=new URLSearchParams(location.search);return {topic:q.get('topic')||'',lesson:q.get('lesson')||''}}
  function setRoute(topic,lesson='',replace=false){const url=new URL(location.href);url.searchParams.delete('topic');url.searchParams.delete('lesson');url.hash='';if(topic)url.searchParams.set('topic',topic);if(lesson)url.searchParams.set('lesson',lesson);history[replace?'replaceState':'pushState'](null,'',url.pathname+url.search);}
  function showNotice(text){$('ttNotice').hidden=!text;$('ttNotice').textContent=text||''}
  function bindRollAccessibility(root,rows,label){
    if(!root)return;
    const sync=()=>{
      root.querySelectorAll('[data-practice-roll-card]').forEach(card=>{
        const active=card.classList.contains('is-roll-active');
        card.querySelectorAll('a,button').forEach(el=>{el.tabIndex=active?0:-1});
      });
      root.querySelectorAll('[data-practice-roll-dot]').forEach((dot,index)=>{
        dot.setAttribute('aria-label',`${label} ${index+1}: ${rows[index]?.title||''}`);
        dot.setAttribute('aria-pressed',String(dot.classList.contains('active')));
      });
    };
    root.addEventListener('avp:roll-change',sync);
    window.AVPPracticeRoll?.initAll(root.parentElement||document);
    sync();
  }
  const topicFolders=[
    {id:'data',title:'Dữ liệu',icon:'▤',desc:'Làm sạch, chuẩn hóa và kết hợp dữ liệu',keys:/data|dữ liệu|power query|query|làm sạch|gộp|combine|transform|unpivot|merge/i},
    {id:'report',title:'Báo cáo',icon:'▥',desc:'Báo cáo, biểu đồ, KPI và dashboard',keys:/báo cáo|report|dashboard|kpi|pivot|biểu đồ|chart|phân tích|analysis/i},
    {id:'formula',title:'Công thức',icon:'ƒx',desc:'Hàm Excel và xử lý nghiệp vụ',keys:/công thức|formula|hàm|function|lookup|tính toán|nghiệp vụ|excel công việc/i},
    {id:'automation',title:'Tự động hóa',icon:'↻',desc:'Tối ưu thao tác và quy trình lặp lại',keys:/tự động|automation|vba|macro|power pivot|dax|nâng cao/i},
    {id:'troubleshoot',title:'Sửa lỗi Excel',icon:'⌕',desc:'Tìm nguyên nhân và xử lý lỗi',keys:/lỗi|error|sửa lỗi|debug|kiểm tra|troubleshoot|khắc phục/i}
  ];
  let openFolder='';
  function folderFor(topic){
    const text=String(topic.title||'')+' '+String(topic.description||'');
    return topicFolders.find(folder=>folder.keys.test(text))?.id||'formula';
  }
  function renderTopics(){
    $('ttTopicStage').hidden=false;$('ttLessonStage').hidden=true;
    const mount=$('ttTopics');
    if(!topics.length){mount.innerHTML='<div class="tt-empty"><strong>Chưa có bài TikTok được phát hành</strong><p>Khi có video hướng dẫn mới, chủ đề và file thực hành sẽ xuất hiện tại đây.</p></div>';return}
    mount.innerHTML='<div class="tt-folder-grid" aria-label="Thư mục chủ đề TikTok">'+topicFolders.map(folder=>{
      const count=topics.filter(topic=>folderFor(topic)===folder.id).length;
      return '<button type="button" class="tt-folder-tile" data-tt-folder="'+folder.id+'"><span class="tt-folder-icon">'+folder.icon+'</span><strong>'+T.esc(folder.title)+'</strong><small>'+count+' chủ đề</small></button>';
    }).join('')+'</div><div class="tt-folder-backdrop" id="ttFolderBackdrop" hidden><section class="tt-folder-window" role="dialog" aria-modal="true" aria-labelledby="ttFolderTitle"><button type="button" class="tt-folder-close" data-tt-folder-close aria-label="Đóng thư mục">×</button><div class="tt-folder-heading"><span class="tt-folder-icon" id="ttFolderIcon">▤</span><div><h3 id="ttFolderTitle">Chủ đề</h3><p id="ttFolderDesc"></p></div></div><div class="tt-folder-topics" id="ttFolderTopics"></div></section></div>';
  }
  function openTopicFolder(id){
    const folder=topicFolders.find(item=>item.id===id);if(!folder)return;
    openFolder=id;
    const back=$('ttFolderBackdrop'),list=$('ttFolderTopics');
    $('ttFolderTitle').textContent=folder.title;$('ttFolderDesc').textContent=folder.desc;$('ttFolderIcon').textContent=folder.icon;
    const rows=topics.filter(topic=>folderFor(topic)===id);
    list.innerHTML=rows.length?rows.map(topic=>'<button type="button" class="tt-folder-topic" data-tt-topic="'+T.esc(topic.id)+'"><span class="tt-folder-topic-icon">'+folder.icon+'</span><span><strong>'+T.esc(topic.title)+'</strong><small>'+T.esc(topic.description||'Mở các video và file thực hành trong chủ đề này')+'</small></span><b>›</b></button>').join(''):'<p class="tt-folder-empty">Chưa có chủ đề trong thư mục này.</p>';
    back.hidden=false;document.body.classList.add('tt-folder-open');
  }
  function closeTopicFolder(){const back=$('ttFolderBackdrop');if(back)back.hidden=true;document.body.classList.remove('tt-folder-open');}
  function lessonCard(row){
    const date=row.published_at?new Date(row.published_at).toLocaleDateString('vi-VN'):'';
    return `<article class="tt-lesson-card" id="tt-lesson-${T.esc(row.id)}" data-practice-roll-card><div class="tt-lesson-meta"><span>VIDEO TIKTOK</span>${date?`<time datetime="${T.esc(row.published_at)}">${T.esc(date)}</time>`:''}</div><h3>${T.esc(row.title)}</h3>${row.description?`<p>${T.esc(row.description)}</p>`:''}<div class="tt-lesson-actions"><a class="tt-watch" href="${T.esc(T.videoUrl(row.tiktok_url))}" target="_blank" rel="noopener noreferrer">▶ Xem TikTok</a><button type="button" data-tt-download="${T.esc(row.id)}">↓ Tải file thực hành</button></div><p class="tt-file-caption">${T.esc(row.file_name||'File thực hành')} · Đăng nhập để tải</p><p class="tt-action-notice" data-tt-file-notice role="status" hidden></p></article>`;
  }
  function renderLessons(highlight=''){
    const topic=currentTopic();if(!topic){selected='';renderTopics();return}
    $('ttTopicStage').hidden=true;$('ttLessonStage').hidden=false;
    $('ttTopicTitle').textContent=topic.title;$('ttTopicDescription').textContent=topic.description||'Xem video hướng dẫn và tải đúng file của bài bạn muốn luyện.';
    const query=T.normalize($('ttSearch').value),order=$('ttSort').value;
    const all=lessons.filter(row=>row.topic_id===selected);
    const rows=all.filter(row=>T.normalize(row.title+' '+row.description).includes(query)).sort((a,b)=>order==='oldest'?String(a.published_at||'').localeCompare(String(b.published_at||'')):order==='ordered'?(a.sort_order-b.sort_order)||a.title.localeCompare(b.title,'vi'):String(b.published_at||'').localeCompare(String(a.published_at||'')));
    $('ttResultCount').textContent=`${rows.length}/${all.length} bài`;
    const startIndex=Math.max(0,rows.findIndex(row=>row.id===highlight));
    if(rows.length){
      $('ttLessons').innerHTML=`<div class="avp-roll-shell tt-lesson-roll-shell"><div class="avp-practice-roll lesson-roll tt-lesson-roll" data-practice-roll data-roll-kind="lesson" data-start="${startIndex}" tabindex="0" aria-label="Các bài TikTok trong chủ đề ${T.esc(topic.title)}"><div class="avp-roll-stage" data-practice-roll-stage>${rows.map(lessonCard).join('')}</div><div class="avp-roll-dots" data-practice-roll-dots></div></div><p class="avp-roll-hint">Vuốt ngang hoặc dùng phím ← → để chuyển bài</p></div>`;
      const root=$('ttLessons').querySelector('[data-practice-roll]');
      const card=highlight?$('tt-lesson-'+highlight):null;
      if(card)card.classList.add('tt-highlight');
      bindRollAccessibility(root,rows,'Bài');
    }else{
      $('ttLessons').innerHTML='<div class="tt-empty"><strong>Không tìm thấy bài phù hợp</strong><p>Thử tên bài ngắn hơn hoặc xóa từ khóa.</p><button type="button" data-tt-clear>Xóa tìm kiếm</button></div>';
      if(highlight)showNotice('Bài trong liên kết không còn được phát hành. Bạn có thể chọn bài khác trong chủ đề này.');
    }
  }
  function selectTopic(id,push=true){if(!topics.some(row=>row.id===id))return;selected=id;$('ttSearch').value='';if(push)setRoute(id);showNotice('');renderLessons();$('ttTopicTitle').focus({preventScroll:true});$('ttLessonStage').scrollIntoView({block:'start',behavior:'smooth'})}
  function applyRoute(){
    const r=route(),lesson=r.lesson?lessons.find(row=>row.id===r.lesson):null;
    selected=lesson?.topic_id||r.topic;
    if(selected&&topics.some(row=>row.id===selected)){renderLessons(r.lesson);return}
    selected='';renderTopics();if(r.topic||r.lesson)showNotice('Chủ đề hoặc bài trong liên kết chưa được phát hành. Hãy chọn nội dung đang có.');
  }
  function load(force=false){
    if(loading)return loading;if(loaded&&!force)return Promise.resolve();
    $('ttReload').disabled=true;showNotice('Đang tải nội dung TikTok…');
    loading=(async()=>{
      try{
        const data=await T.rpc('tiktok_catalog_v1');
        lessons=(Array.isArray(data?.lessons)?data.lessons:[]).filter(row=>T.videoUrl(row.tiktok_url));
        topics=(Array.isArray(data?.topics)?data.topics:[]).filter(row=>lessons.some(item=>item.topic_id===row.id));
        lessons=lessons.filter(row=>topics.some(topic=>topic.id===row.topic_id));loaded=true;showNotice('');applyRoute();
      }catch(error){loaded=false;topics=[];lessons=[];selected='';$('ttTopicStage').hidden=false;$('ttLessonStage').hidden=true;$('ttTopics').innerHTML='';showNotice(T.message(error))}
      finally{loading=null;$('ttReload').disabled=false}
    })();return loading;
  }
  function boot(){
    if(!$('ttTopics'))return;
    $('ttReload').addEventListener('click',()=>load(true));
    $('ttTopics').addEventListener('click',event=>{
      const folderButton=event.target.closest('[data-tt-folder]');
      if(folderButton){openTopicFolder(folderButton.dataset.ttFolder);return}
      const topicButton=event.target.closest('[data-tt-topic]');
      if(topicButton){const id=topicButton.dataset.ttTopic;closeTopicFolder();selectTopic(id);return}
      if(event.target.closest('[data-tt-folder-close]'))closeTopicFolder();
      if(event.target.id==='ttFolderBackdrop')closeTopicFolder();
    });
    $('ttTopics').addEventListener('keydown',event=>{if(event.key==='Escape')closeTopicFolder()});
    $('ttBackTopics').addEventListener('click',()=>{selected='';setRoute('');showNotice('');renderTopics()});
    $('ttSearch').addEventListener('input',()=>renderLessons());$('ttSort').addEventListener('change',()=>renderLessons());
    $('ttLessons').addEventListener('click',event=>{const button=event.target.closest('[data-tt-download]');if(button){const notice=button.closest('article').querySelector('[data-tt-file-notice]');return T.download(button.dataset.ttDownload,button,notice)}if(event.target.closest('[data-tt-clear]')){$('ttSearch').value='';renderLessons()}});
    window.addEventListener('popstate',()=>{if(loaded){$('ttSearch').value='';showNotice('');applyRoute()}});load();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
