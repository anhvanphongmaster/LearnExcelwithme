(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl=v=>{
    const s=String(v||'').trim();
    if(!s||/^(javascript|data|vbscript):/i.test(s))return '';
    if(/^https?:\/\/[^\s<>"']+$/i.test(s))return s;
    return /^\.?\/?[\wÀ-ỹ()[\] ._%-]+(?:\/[\wÀ-ỹ()[\] ._?&=%#-]+)*$/i.test(s)?s:'';
  };
  let rows=[];

  async function waitClient(){
    for(let i=0;i<60;i++){
      const c=window.avpSupabase||window.supabaseClient||window._supabaseClient;
      if(c?.rpc)return c;
      await new Promise(r=>setTimeout(r,100));
    }
    return null;
  }
  function groupRows(){
    const map=new Map();
    rows.forEach(row=>{
      const topic=String(row.topic||'Khác').trim()||'Khác';
      if(!map.has(topic))map.set(topic,[]);
      map.get(topic).push(row);
    });
    return [...map.entries()].map(([topic,items])=>({
      topic,
      items:items.sort((a,b)=>Number(a.order_no||0)-Number(b.order_no||0)),
      solved:items.filter(x=>safeUrl(x.solution_video_url)).length
    })).sort((a,b)=>a.topic.localeCompare(b.topic,'vi'));
  }
  function topicCard(group,index){
    return `<button type="button" class="hw-topic-card tone-${index%5+1}" data-hw-topic="${esc(group.topic)}">
      <span class="hw-topic-no">CHỦ ĐỀ ${String(index+1).padStart(2,'0')}</span>
      <strong>${esc(group.topic)}</strong>
      <p>${group.items.length} bài tập / ${group.solved} video giải bài</p>
      <b>Mở chủ đề →</b>
    </button>`;
  }
  function renderTopics(){
    const host=$('hwTopicList');if(!host)return;
    const groups=groupRows();
    if(!groups.length){
      host.innerHTML='<div class="hw-empty"><strong>Chưa có Homework được phát hành</strong><p>Khi Admin phát hành bài đầu tiên, chủ đề sẽ xuất hiện tại đây.</p></div>';
      return;
    }
    host.innerHTML=groups.map(topicCard).join('');
  }
  function action(url,label,cls,{download=false}={}){
    const valid=safeUrl(url);
    if(!valid)return `<span class="hw-action ${cls} is-disabled" aria-disabled="true">${esc(label)}</span>`;
    return `<a class="hw-action ${cls}" href="${esc(valid)}" ${download?'download':'target="_blank" rel="noopener"'}>${esc(label)}</a>`;
  }
  function lessonCard(item){
    const n=String(Number(item.order_no||0)).padStart(2,'0');
    return `<article class="hw-card" data-practice-roll-card data-homework-id="${esc(item.id)}">
      <div class="hw-card-head"><span>BÀI ${n}</span><em>${safeUrl(item.solution_video_url)?'Đã có video giải':'Chưa có video giải'}</em></div>
      <h3>${esc(item.title)}</h3>
      <div class="hw-card-actions">
        ${action(item.guide_video_url,'▶ Video hướng dẫn','is-guide')}
        ${action(item.file_url,'⬇ Tải file bài tập','is-file',{download:true})}
        ${action(item.solution_video_url,'▶ Video giải bài tập','is-solution')}
      </div>
      <div class="hw-card-hints">
        <button type="button" data-hint="1" data-homework-id="${esc(item.id)}">Hint 1</button>
        <button type="button" data-hint="2" data-homework-id="${esc(item.id)}">Hint 2</button>
      </div>
    </article>`;
  }
  function openTopic(topic){
    const group=groupRows().find(x=>x.topic===topic);if(!group)return;
    $('hwTopicView').hidden=true;$('hwLessonView').hidden=false;
    $('hwTopicKicker').textContent='HOMEWORK · '+topic.toUpperCase();
    $('hwTopicTitle').textContent=topic;
    $('hwTopicCount').textContent=`${group.items.length} bài tập · ${group.solved} video giải bài`;
    const stage=$('hwLessonStage');
    stage.innerHTML=group.items.map(lessonCard).join('');
    const roll=$('hwLessonRoll');
    delete roll.dataset.rollReady;
    roll._avpPracticeRoll=null;
    requestAnimationFrame(()=>window.AVPPracticeRoll?.init(roll));
    history.replaceState(null,'',`homework.html?topic=${encodeURIComponent(topic)}`);
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function closeTopic(){
    $('hwLessonView').hidden=true;$('hwTopicView').hidden=false;
    history.replaceState(null,'','homework.html');
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function openHint(item,number){
    const dialog=$('hwHintDialog');if(!dialog)return;
    const text=number===1?item.hint1:item.hint2;
    $('hwHintLabel').textContent=`HINT ${number} · BÀI ${String(Number(item.order_no||0)).padStart(2,'0')}`;
    $('hwHintTitle').textContent=item.title;
    $('hwHintText').textContent=String(text||`Bài này chưa có Hint ${number}.`);
    dialog.classList.toggle('is-hint2',number===2);
    if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
  }
  function bind(){
    $('hwTopicList')?.addEventListener('click',e=>{
      const btn=e.target.closest('[data-hw-topic]');if(btn)openTopic(btn.dataset.hwTopic);
    });
    $('hwTopicBack')?.addEventListener('click',closeTopic);
    $('hwLessonStage')?.addEventListener('click',e=>{
      const btn=e.target.closest('[data-hint]');if(!btn)return;
      const item=rows.find(x=>String(x.id)===String(btn.dataset.homeworkId));
      if(item)openHint(item,Number(btn.dataset.hint));
    });
    $('hwHintDialog')?.addEventListener('click',e=>{if(e.target===$('hwHintDialog'))$('hwHintDialog').close?.()});
  }
  async function load(){
    bind();
    try{
      const c=await waitClient();if(!c)throw new Error('Supabase chưa sẵn sàng');
      const {data,error}=await c.rpc('homework_public_v1');if(error)throw error;
      rows=(Array.isArray(data)?data:[]).map(x=>({...x,order_no:Number(x.order_no||0)}));
      renderTopics();
      const direct=new URLSearchParams(location.search).get('topic');
      if(direct&&groupRows().some(x=>x.topic===direct))openTopic(direct);
    }catch(error){
      console.warn('Homework standalone load failed',error);
      $('hwTopicList').innerHTML='<div class="hw-empty"><strong>Chưa tải được Homework</strong><p>Hệ thống đang không lấy được danh sách bài. Hãy tải lại trang sau.</p></div>';
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
