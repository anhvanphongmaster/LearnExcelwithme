(()=>{
  "use strict";
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  let projects=[], dynamic=false;
  function arr(v){if(Array.isArray(v))return v;if(typeof v==="string"){try{const x=JSON.parse(v);return Array.isArray(x)?x:[]}catch(e){}}return []}
  function safeUrl(v){
    const s=String(v||"").trim();
    if(!s||/^(javascript|data|vbscript):/i.test(s))return "";
    return /^(https?:\/\/|\.?\/?[\wÀ-ỹ()[\] ._%-]+(?:\/[\wÀ-ỹ()[\] ._?&=%#-]+)*)$/i.test(s)?s:"";
  }
  async function waitClient(){for(let i=0;i<45;i++){const c=window.avpSupabase||window.supabaseClient||window._supabaseClient;if(c?.rpc)return c;await new Promise(r=>setTimeout(r,120))}return null}
  function tone(v){return v==="raw"?"pyt-group-raw":v==="clean"?"pyt-group-clean":"pyt-group-neutral"}
  function icon(type){return type==="practice"?"⬇":type==="tips"?"⚡":type==="formula"?"📘":type==="guide"?"📖":"🔗"}
  function projectCard(p){
    const parts=arr(p.parts).filter(x=>x&&x.is_active!==false&&x.status!=="draft"&&x.status!=="archived");
    const cover=safeUrl(p.cover_image_url);
    return `<article class="pyt-project-card" data-practice-roll-card data-project="${esc(p.slug)}" data-project-id="${esc(p.id)}"><span>${esc(p.kicker||"PROJECT")} ${String(p.project_number||0).padStart(2,"0")}</span>${cover?`<figure class="pyt-project-cover"><img src="${esc(cover)}" alt="" loading="lazy"></figure>`:""}<div><h3>${esc(p.title)}</h3><p>${esc(p.summary||"")}</p></div><strong>Mở ${parts.length} phần của project →</strong></article>`;
  }
  function partCard(p,i){
    const image=safeUrl(p.image_url),video=safeUrl(p.video_url),num=p.part_number||i+1;
    return `<article class="pyt-card ${tone(p.tone)}" data-practice-roll-card><div class="pyt-top"><span class="pyt-num">P${esc(num)}</span><span class="pyt-badge ${video?"ok":"soon"}">${video?"Có video":"Sắp có video"}</span></div><h2>${esc(p.title)}</h2><p>${esc(p.description||"")}</p>${image?`<figure class="pyt-card-media"><img src="${esc(image)}" alt="${esc(p.image_alt||`Minh hoạ ${p.title}`)}" loading="lazy"></figure>`:""}${video?`<a class="pyt-yt" href="${esc(video)}" target="_blank" rel="noopener">▶ Xem trên YouTube</a>`:'<span class="pyt-muted">Video: sắp gắn link</span>'}</article>`;
  }
  function resourceLink(r,practice){
    const url=safeUrl(r.url);if(!url)return "";
    const cls=practice?`pyt-file-link ${r.tone==="raw"?"raw":r.tone==="clean"?"clean":"neutral"}`:"";
    return `<a${cls?` class="${cls}"`:""} href="${esc(url)}"${r.type==="practice"||/\.(xlsx|xls|csv|zip)(\?|#|$)/i.test(url)?" download":""}>${icon(r.type)} ${esc(r.label)}</a>`;
  }
  function renderDetail(project){
    const detail=$("youtubeProjectDetail"),library=$("youtubeProjectLibrary");if(!detail||!library)return;
    const parts=arr(project.parts).filter(x=>x&&x.is_active!==false&&x.status!=="draft"&&x.status!=="archived").sort((a,b)=>(a.sort_order??a.part_number??0)-(b.sort_order??b.part_number??0));
    const resources=arr(project.resources).filter(x=>x&&x.is_active!==false&&safeUrl(x.url)).sort((a,b)=>(a.sort_order??0)-(b.sort_order??0));
    const tools=resources.filter(r=>r.type!=="practice"),practice=resources.filter(r=>r.type==="practice");
    detail.innerHTML=`<button class="roll-back" type="button" id="youtubeProjectBack">← Quay lại Project Library</button><div class="avp-roll-head"><div><span>${esc(project.title).toUpperCase()}</span><h2>${parts.length} phần của project</h2></div><small>Phần ở giữa là phần đang chọn</small></div>${tools.length?`<div class="pyt-project-tools">${tools.map(r=>resourceLink(r,false)).join("")}</div>`:""}<div class="avp-roll-shell"><div class="avp-practice-roll pyt-phase-roll" data-practice-roll data-roll-kind="lesson" tabindex="0"><div class="avp-roll-stage" data-practice-roll-stage>${parts.map(partCard).join("")}</div><div class="avp-roll-dots" data-practice-roll-dots></div></div><p class="avp-roll-hint">Kéo / vuốt · lăn chuột · phím ← →</p></div>${practice.length?`<div class="pyt-stage-file"><strong>File thực hành dùng chung</strong><p>${practice.map(r=>resourceLink(r,true)).join("")}</p></div>`:""}`;
    library.hidden=true;detail.hidden=false;$("youtubeProjectBack")?.addEventListener("click",backToLibrary);
    window.AVPPracticeRoll?.initAll(detail);detail.scrollIntoView({behavior:"smooth",block:"start"});
  }
  function backToLibrary(){const detail=$("youtubeProjectDetail"),library=$("youtubeProjectLibrary");if(detail)detail.hidden=true;if(library){library.hidden=false;library.scrollIntoView({behavior:"smooth",block:"start"})}}
  function bindStage(){
    const stage=$("youtubeProjectStage");if(!stage||stage.dataset.youtubeBound==="1")return;stage.dataset.youtubeBound="1";
    stage.addEventListener("click",e=>{
      const card=e.target.closest("[data-project]");if(!card||!card.classList.contains("is-roll-active"))return;
      const p=projects.find(x=>String(x.id)===card.dataset.projectId||x.slug===card.dataset.project);
      if(p)return renderDetail(p);
      if(!dynamic&&card.dataset.project==="sales"){$("youtubeProjectLibrary").hidden=true;$("youtubeProjectDetail").hidden=false;window.AVPPracticeRoll?.initAll($("youtubeProjectDetail"));$("youtubeProjectDetail").scrollIntoView({behavior:"smooth",block:"start"})}
    });
    $("youtubeProjectBack")?.addEventListener("click",backToLibrary);
  }
  async function load(){
    bindStage();
    try{
      const c=await waitClient();if(!c)return;
      const {data,error}=await c.rpc("youtube_projects_public");if(error)throw error;
      const list=Array.isArray(data)?data:[];if(!list.length)return;
      projects=list;dynamic=true;
      const stage=$("youtubeProjectStage"),root=stage?.closest("[data-practice-roll]");if(!stage||!root)return;
      stage.innerHTML=projects.map(projectCard).join("");
      $("youtubeProjectSummary").textContent=`Mỗi chủ đề là một project hoàn chỉnh. Hiện có ${projects.length} project đang phát hành.`;
      window.AVPPracticeRoll?.reset(root);
    }catch(e){console.warn("YouTube Projects dùng dữ liệu tĩnh dự phòng",e)}
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",load,{once:true});else load();
})();
