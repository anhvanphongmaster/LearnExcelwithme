(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const STORAGE_KEY='avp_homework_progress_v1';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl=v=>{
    const s=String(v||'').trim();
    if(!s||/^(javascript|data|vbscript):/i.test(s))return '';
    if(/^https?:\/\/[^\s<>"']+$/i.test(s))return s;
    return /^\.?\/?[\wÀ-ỹ()[\] ._%-]+(?:\/[\wÀ-ỹ()[\] ._?&=%#-]+)*$/i.test(s)?s:'';
  };
  const arr=v=>Array.isArray(v)?v:(typeof v==='string'?(()=>{try{const x=JSON.parse(v);return Array.isArray(x)?x:[]}catch{return[]}})():[]);
  const isExternal=url=>/^https?:\/\//i.test(String(url||''));
  const isGenericYoutubePractice=url=>/(^|\/)practice-youtube\.html(?:[?#].*)?$/i.test(String(url||'').trim());
  const followVideoUrl=item=>item.solutionUrl||(!isGenericYoutubePractice(item.nextUrl)?item.nextUrl:'');
  const linkAttrs=url=>isExternal(url)?' target="_blank" rel="noopener"':'';
  let items=[];

  async function waitClient(){
    for(let i=0;i<50;i++){
      const c=window.avpSupabase||window.supabaseClient||window._supabaseClient;
      if(c?.rpc)return c;
      await new Promise(r=>setTimeout(r,100));
    }
    return null;
  }
  function readProgress(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{return{}}}
  function getProgress(key){return readProgress()[key]||'not_started'}
  function setProgress(key,status){const data=readProgress();data[key]=status;localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}
  const statusLabel=s=>s==='done'?'Đã làm':s==='in_progress'?'Đang làm':'Chưa làm';

  function normalizeHomework(project,part){
    const hw=part?.homework;
    if(!hw||hw.enabled!==true||hw.status!=='published')return null;
    const partNo=Number(part.part_number||0)||1;
    const key=`${project.slug||project.id}-p${partNo}`;
    return {
      key,projectId:project.id,projectSlug:project.slug||'',projectNumber:Number(project.project_number||0),projectTitle:project.title||'YouTube Project',
      partNo,partTitle:part.title||`Phần ${partNo}`,videoUrl:safeUrl(part.video_url),
      title:String(hw.title||part.title||`Bài tập P${partNo}`).trim(),topic:String(hw.topic||project.title||'Excel').trim(),duration:Math.max(5,Math.min(60,Number(hw.duration_min||10))),
      context:String(hw.context||'').trim(),fileUrl:safeUrl(hw.file_url),tasks:arr(hw.tasks).map(x=>String(x||'').trim()).filter(Boolean),trap:String(hw.trap||'').trim(),
      hint1:String(hw.hint1||'').trim(),hint2:String(hw.hint2||'').trim(),solutionUrl:safeUrl(hw.solution_video_url),nextUrl:safeUrl(hw.next_url),
      nextLabel:String(hw.next_label||'Học tiếp').trim(),sortOrder:Number(hw.sort_order??part.sort_order??partNo)
    };
  }

  function flatten(projects){
    return (projects||[]).flatMap(project=>arr(project.parts)
      .filter(part=>part&&part.is_active!==false&&part.status!=='draft'&&part.status!=='archived')
      .map(part=>normalizeHomework(project,part)).filter(Boolean));
  }

  function populateTopics(){
    const select=$('hwTopic');if(!select)return;
    const topics=[...new Set(items.map(x=>x.topic).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'vi'));
    select.innerHTML='<option value="all">Tất cả chủ đề</option>'+topics.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join('');
  }

  function actionLink(url,label,kind,{download=false}={}){
    if(!url)return `<span class="hw-card-action ${kind} disabled" aria-disabled="true">${esc(label)}</span>`;
    return `<a class="hw-card-action ${kind}" href="${esc(url)}"${download?' download':''}${linkAttrs(url)}>${esc(label)}</a>`;
  }

  function card(item){
    const progress=getProgress(item.key);
    const followUrl=followVideoUrl(item);
    return `<article class="hw-card" data-hw-key="${esc(item.key)}">
      <div class="hw-card-top"><span class="hw-topic">${esc(item.topic)}</span><span class="hw-status ${progress}">${statusLabel(progress)}</span></div>
      <h2><button type="button" class="hw-card-title" data-hw-open="${esc(item.key)}">${esc(item.title)}</button></h2>
      <p>${esc(item.projectTitle)} · P${item.partNo} · ${esc(item.partTitle)}</p>
      <div class="hw-card-meta"><span>⏱ ${item.duration} phút</span><span>${followUrl?'✓ Đã có chữa bài + video tiếp theo':'○ Chữa bài + video tiếp theo: chưa phát hành'}</span></div>
      <div class="hw-card-actions" aria-label="Hành động Homework">
        ${actionLink(item.videoUrl,'▶ Xem video','source')}
        ${actionLink(item.fileUrl,'⬇ Tải','download',{download:true})}
        ${actionLink(followUrl,'▶ Xem chữa bài & video tiếp theo','solution')}
      </div>
      <button type="button" class="hw-card-detail" data-hw-open="${esc(item.key)}">Nhiệm vụ & Hint →</button>
    </article>`;
  }

  function renderLibrary(){
    const host=$('hwLibrary');if(!host)return;
    const topic=$('hwTopic')?.value||'all',progress=$('hwProgress')?.value||'all',sort=$('hwSort')?.value||'newest';
    let list=items.filter(x=>(topic==='all'||x.topic===topic)&&(progress==='all'||getProgress(x.key)===progress));
    list.sort((a,b)=>{
      const av=a.projectNumber*1000+a.sortOrder,bv=b.projectNumber*1000+b.sortOrder;
      return sort==='oldest'?av-bv:bv-av;
    });
    if(!items.length){
      host.innerHTML='<div class="hw-empty"><strong>Chưa có bài tập về nhà được phát hành</strong><p>Khi Homework mới được phát hành, card sẽ hiện đúng 3 hành động: xem video giao bài, tải file và xem video chữa bài + nội dung tiếp theo.</p></div>';
      return;
    }
    host.innerHTML=list.length?list.map(card).join(''):'<div class="hw-empty"><strong>Không có bài phù hợp bộ lọc</strong><p>Đổi Chủ đề hoặc Trạng thái để xem các bài khác.</p></div>';
  }

  function openDetail(key,{push=true}={}){
    const item=items.find(x=>x.key===key);if(!item)return;
    if(getProgress(key)==='not_started')setProgress(key,'in_progress');
    const followUrl=followVideoUrl(item);
    const detail=$('hwDetail'),library=$('hwLibrary'),toolbar=document.querySelector('.hw-toolbar');if(!detail||!library)return;
    detail.innerHTML=`
      <button class="hw-detail-back" type="button" data-hw-back>← Quay lại Kho Homework</button>
      <header class="hw-detail-head"><span class="eyebrow">HOMEWORK · ${esc(item.topic)}</span><h1>${esc(item.title)}</h1><p>${esc(item.context||`Bài tập ngắn nối từ ${item.projectTitle} · P${item.partNo}. Tập trung làm đúng phần khó trước khi xem lời giải.`)}</p><div class="hw-detail-meta"><span>⏱ ${item.duration} phút</span><span>${esc(item.projectTitle)}</span><span>P${item.partNo}</span></div></header>
      <section class="hw-block hw-source"><h2>1 · Video giao bài</h2><p>Đây là video hướng dẫn gốc; cuối video là bài tập về nhà này.</p>${item.videoUrl?`<a href="${esc(item.videoUrl)}" target="_blank" rel="noopener">▶ Xem video</a>`:'<p><strong>Video giao bài chưa được gắn link.</strong></p>'}</section>
      <section class="hw-block hw-file"><h2>2 · File thực hành</h2>${item.fileUrl?`<p>Dùng đúng file của bài để kết quả và video chữa khớp nhau.</p><a href="${esc(item.fileUrl)}" download${linkAttrs(item.fileUrl)}>⬇ Tải file thực hành</a>`:'<p>Admin chưa gắn file thực hành cho bài này.</p>'}</section>
      <section class="hw-block"><h2>3 · Nhiệm vụ</h2>${item.tasks.length?`<ol>${item.tasks.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>`:'<p>Admin chưa nhập nhiệm vụ cho bài này.</p>'}</section>
      ${item.trap?`<section class="hw-block hw-trap"><h2>4 · Điểm dễ sai / Cú bẫy</h2><p>${esc(item.trap)}</p></section>`:''}
      <div class="hw-hints">
        <details><summary>Hint 1 · Gợi ý nhẹ</summary><p>${esc(item.hint1||'Chưa có Hint 1.')}</p></details>
        <details><summary>Hint 2 · Gợi ý mạnh hơn</summary><p>${esc(item.hint2||'Chưa có Hint 2.')}</p></details>
      </div>
      <section class="hw-block"><div class="hw-progress-box"><div><h2>5 · Trạng thái của bạn</h2><p>Đây chỉ là tiến độ cá nhân, không phải điểm và không dùng để khóa bài khác.</p></div><button type="button" class="hw-progress-btn ${getProgress(key)==='done'?'done':''}" data-hw-done>${getProgress(key)==='done'?'✓ Đã làm xong · bấm để mở lại':'Tôi đã làm xong'}</button></div></section>
      <section class="hw-block hw-solution ${followUrl?'ready':'pending'}"><h2>6 · Chữa bài & video tiếp theo</h2>${followUrl?`<p>Chỉ nên xem sau khi bạn đã tự làm hoặc đã thử cả hai Hint. Video này chữa phần khó rồi nối sang nội dung tiếp theo.</p><a href="${esc(followUrl)}"${linkAttrs(followUrl)}>▶ Xem chữa bài & video tiếp theo</a>`:'<p>Chưa phát hành. Khi video tiếp theo lên, nút chữa bài sẽ được mở tại đây.</p>'}</section>`;
    library.hidden=true;if(toolbar)toolbar.hidden=true;detail.hidden=false;
    detail.querySelector('[data-hw-back]')?.addEventListener('click',()=>closeDetail());
    detail.querySelector('[data-hw-done]')?.addEventListener('click',()=>{
      const next=getProgress(key)==='done'?'in_progress':'done';setProgress(key,next);openDetail(key,{push:false});
    });
    if(push){history.replaceState(null,'',`homework.html?homework=${encodeURIComponent(key)}`)}
    scrollTo({top:0,behavior:'smooth'});
  }

  function closeDetail(){
    const detail=$('hwDetail'),library=$('hwLibrary'),toolbar=document.querySelector('.hw-toolbar');
    if(detail)detail.hidden=true;if(library)library.hidden=false;if(toolbar)toolbar.hidden=false;
    history.replaceState(null,'','homework.html');renderLibrary();scrollTo({top:0,behavior:'smooth'});
  }

  function bind(){
    ['hwTopic','hwProgress','hwSort'].forEach(id=>$(id)?.addEventListener('change',renderLibrary));
    $('hwLibrary')?.addEventListener('click',e=>{const btn=e.target.closest('[data-hw-open]');if(btn)openDetail(btn.dataset.hwOpen)});
  }

  async function load(){
    bind();
    try{
      const c=await waitClient();
      if(!c)throw new Error('Supabase chưa sẵn sàng');
      const {data,error}=await c.rpc('youtube_projects_public');if(error)throw error;
      items=flatten(Array.isArray(data)?data:[]);populateTopics();renderLibrary();
      const direct=new URLSearchParams(location.search).get('homework');if(direct&&items.some(x=>x.key===direct))openDetail(direct,{push:false});
    }catch(error){
      console.warn('Homework load failed',error);
      $('hwLibrary').innerHTML='<div class="hw-empty"><strong>Chưa tải được Homework</strong><p>Hệ thống đang không lấy được danh sách bài. Hãy tải lại trang sau.</p></div>';
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
