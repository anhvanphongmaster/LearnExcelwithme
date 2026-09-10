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
  function renderTopics(){
    $('ttTopicStage').hidden=false;$('ttLessonStage').hidden=true;
    const mount=$('ttTopics');
    if(!topics.length){mount.innerHTML='<div class="tt-empty"><strong>Chưa có bài TikTok được phát hành</strong><p>Khi có video hướng dẫn mới, chủ đề và file thực hành sẽ xuất hiện tại đây.</p></div>';return}
    mount.innerHTML=`<div class="avp-roll-shell"><div class="avp-practice-roll tt-topic-roll" data-practice-roll data-roll-kind="topic" tabindex="0" aria-label="Chọn chủ đề TikTok"><div class="avp-roll-stage" data-practice-roll-stage>${topics.map(row=>`<article class="tt-topic-card" data-practice-roll-card><span>CHỦ ĐỀ</span><h3>${T.esc(row.title)}</h3><p>${T.esc(row.description||'Xem video và làm theo với file thực hành của từng bài.')}</p><small>${lessons.filter(item=>item.topic_id===row.id).length} bài có video</small><button type="button" data-tt-topic="${T.esc(row.id)}">Mở chủ đề →</button></article>`).join('')}</div><div class="avp-roll-dots" data-practice-roll-dots></div></div><p class="avp-roll-hint">Vuốt ngang hoặc dùng phím ← → để chọn chủ đề</p></div>`;
    const root=mount.querySelector('[data-practice-roll]');
    bindRollAccessibility(root,topics,'Chủ đề');
  }
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
    $('ttTopics').addEventListener('click',event=>{const button=event.target.closest('[data-tt-topic]');if(button&&!event.defaultPrevented&&button.closest('[data-practice-roll-card]').classList.contains('is-roll-active'))selectTopic(button.dataset.ttTopic)});
    $('ttBackTopics').addEventListener('click',()=>{selected='';setRoute('');showNotice('');renderTopics()});
    $('ttSearch').addEventListener('input',()=>renderLessons());$('ttSort').addEventListener('change',()=>renderLessons());
    $('ttLessons').addEventListener('click',event=>{const button=event.target.closest('[data-tt-download]');if(button){const notice=button.closest('article').querySelector('[data-tt-file-notice]');return T.download(button.dataset.ttDownload,button,notice)}if(event.target.closest('[data-tt-clear]')){$('ttSearch').value='';renderLessons()}});
    window.addEventListener('popstate',()=>{if(loaded){$('ttSearch').value='';showNotice('');applyRoute()}});load();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
