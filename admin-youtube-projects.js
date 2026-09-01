(()=>{
  "use strict";
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const clone=v=>JSON.parse(JSON.stringify(v));
  let rows=[], loaded=false, editing=null;

  async function waitClient(){
    for(let i=0;i<60;i++){
      const c=window.avpSupabase||window.supabaseClient||window._supabaseClient;
      if(c?.rpc)return c;
      await new Promise(r=>setTimeout(r,100));
    }
    throw new Error("Supabase chưa sẵn sàng");
  }
  async function rpc(name,args={}){
    const c=await waitClient();
    const {data,error}=await c.rpc(name,args);
    if(error)throw error;
    return data;
  }
  function toast(message){
    const t=$("adminToast");if(!t)return;
    t.textContent=message;t.classList.add("show");
    clearTimeout(t._aytTimer);t._aytTimer=setTimeout(()=>t.classList.remove("show"),1900);
  }
  function arr(v){
    if(Array.isArray(v))return clone(v);
    if(typeof v==="string"){try{const x=JSON.parse(v);return Array.isArray(x)?x:[]}catch(e){return []}}
    return [];
  }
  function statusLabel(row){
    if(!row.is_active)return ["Đang ẩn","hidden"];
    if(row.status==="draft")return ["Bản nháp","draft"];
    if(row.status==="archived")return ["Lưu trữ","archived"];
    return ["Đang hiện","live"];
  }
  function updateKpis(){
    const allParts=rows.flatMap(r=>arr(r.parts));
    $("aytKpiProjects").textContent=rows.length;
    $("aytKpiLive").textContent=rows.filter(r=>r.is_active&&r.status==="published").length;
    $("aytKpiParts").textContent=allParts.length;
    $("aytKpiVideos").textContent=allParts.filter(p=>String(p.video_url||"").trim()).length;
  }
  function renderList(){
    updateKpis();
    const host=$("aytProjectList");if(!host)return;
    if(!rows.length){host.innerHTML='<div class="admin-users-empty">Chưa có project phù hợp.</div>';return}
    host.innerHTML=rows.map(row=>{
      const st=statusLabel(row),parts=arr(row.parts),resources=arr(row.resources);
      return `<article class="ayt-project-row" data-ayt-id="${esc(row.id)}">
        <div class="ayt-project-no">#${String(row.project_number||0).padStart(2,"0")}</div>
        <div class="ayt-project-copy"><strong>${esc(row.title||"Project chưa đặt tên")}</strong><small>${esc(row.summary||"Chưa có mô tả")}</small></div>
        <div class="ayt-project-meta"><span class="ayt-chip ${st[1]}">${st[0]}</span><span class="ayt-chip">${parts.length} phần</span><span class="ayt-chip">${resources.length} tài nguyên</span><span class="ayt-chip">${esc(row.slug)}</span></div>
        <div class="ayt-row-actions"><button type="button" data-ayt-act="edit">Sửa</button><button type="button" class="secondary" data-ayt-act="toggle">${row.is_active?"Ẩn":"Hiện"}</button><button type="button" class="danger" data-ayt-act="archive">Lưu trữ</button></div>
      </article>`;
    }).join("");
  }
  async function load(){
    const notice=$("aytNotice");
    try{
      rows=await rpc("admin_youtube_projects_list",{p_search:$("aytSearch")?.value.trim()||"",p_status:$("aytStatus")?.value||"all"})||[];
      loaded=true;renderList();if(notice)notice.hidden=true;
    }catch(e){
      console.warn("YouTube project manager",e);
      if(notice){notice.hidden=false;notice.innerHTML='Chưa dùng được YouTube Projects. Hãy chạy SQL <code>YOUTUBE-PROJECT-MANAGEMENT-V1.sql</code> rồi tải lại trang.'}
    }
  }
  function emptyProject(){return {id:null,slug:"",project_number:rows.length+1,title:"",summary:"",kicker:"PROJECT",cover_image_url:"",status:"draft",is_active:true,sort_order:rows.length,parts:[],resources:[]}}
  function emptyPart(){return {part_number:(editing?.parts?.length||0)+1,title:"",description:"",tone:"neutral",image_url:"",image_alt:"",video_url:"",status:"published",is_active:true,sort_order:editing?.parts?.length||0}}
  function emptyResource(){return {type:"practice",label:"",url:"",tone:"neutral",is_active:true,sort_order:editing?.resources?.length||0}}

  function renderParts(){
    const host=$("aytParts");if(!host)return;
    if(!editing.parts.length){host.innerHTML='<div class="ayt-builder-empty">Chưa có phần. Bấm “Thêm phần” để tạo P1.</div>';return}
    host.innerHTML=editing.parts.map((p,i)=>`<details class="ayt-item" data-ayt-part="${i}" ${i===editing.parts.length-1?"open":""}>
      <summary><strong>P${esc(p.part_number||i+1)} · ${esc(p.title||"Phần chưa đặt tên")}</strong><small>${p.video_url?"Đã gắn video":"Chưa có video"}</small></summary>
      <div class="ayt-item-body"><div class="ayt-item-grid">
        <label><span>Số phần</span><input data-pf="part_number" type="number" min="1" value="${esc(p.part_number||i+1)}"></label>
        <label class="span2"><span>Tiêu đề</span><input data-pf="title" maxlength="180" value="${esc(p.title)}"></label>
        <label class="wide"><span>Mô tả</span><textarea data-pf="description" rows="2" maxlength="500">${esc(p.description)}</textarea></label>
        <label><span>Nhóm màu</span><select data-pf="tone"><option value="raw" ${p.tone==="raw"?"selected":""}>P1–P3 · cam nhẹ</option><option value="clean" ${p.tone==="clean"?"selected":""}>P4–P6 · xanh nhẹ</option><option value="neutral" ${!p.tone||p.tone==="neutral"?"selected":""}>Trung tính</option></select></label>
        <label class="span2"><span>Link YouTube</span><input data-pf="video_url" maxlength="1200" value="${esc(p.video_url)}" placeholder="https://youtu.be/..."></label>
        <label class="wide"><span>Ảnh minh hoạ</span><input data-pf="image_url" maxlength="1200" value="${esc(p.image_url)}" placeholder="youtube-p1-append.svg hoặc https://..."></label>
        <label class="span2"><span>Alt ảnh</span><input data-pf="image_alt" maxlength="260" value="${esc(p.image_alt)}"></label>
        <label><span>Trạng thái</span><select data-pf="status"><option value="published" ${p.status!=="draft"&&p.status!=="archived"?"selected":""}>Phát hành</option><option value="draft" ${p.status==="draft"?"selected":""}>Bản nháp</option><option value="archived" ${p.status==="archived"?"selected":""}>Lưu trữ</option></select></label>
        <label><span>Thứ tự</span><input data-pf="sort_order" type="number" value="${esc(p.sort_order??i)}"></label>
        <label><span>Hiển thị</span><select data-pf="is_active"><option value="true" ${p.is_active!==false?"selected":""}>Hiện</option><option value="false" ${p.is_active===false?"selected":""}>Ẩn</option></select></label>
      </div><div class="ayt-item-actions"><button class="danger" type="button" data-ayt-remove-part="${i}">Bỏ phần này</button></div></div>
    </details>`).join("");
  }
  function renderResources(){
    const host=$("aytResources");if(!host)return;
    if(!editing.resources.length){host.innerHTML='<div class="ayt-builder-empty">Chưa có file thực hành hoặc tài liệu đi kèm.</div>';return}
    host.innerHTML=editing.resources.map((r,i)=>`<details class="ayt-item" data-ayt-resource="${i}" ${i===editing.resources.length-1?"open":""}>
      <summary><strong>${esc(r.label||"Tài nguyên chưa đặt tên")}</strong><small>${esc(r.type||"other")}</small></summary>
      <div class="ayt-item-body"><div class="ayt-item-grid">
        <label><span>Loại</span><select data-rf="type"><option value="practice" ${r.type==="practice"?"selected":""}>File thực hành</option><option value="tips" ${r.type==="tips"?"selected":""}>Tips & Tricks</option><option value="formula" ${r.type==="formula"?"selected":""}>Công thức</option><option value="guide" ${r.type==="guide"?"selected":""}>Hướng dẫn</option><option value="other" ${!["practice","tips","formula","guide"].includes(r.type)?"selected":""}>Khác</option></select></label>
        <label class="span2"><span>Tên hiển thị</span><input data-rf="label" maxlength="180" value="${esc(r.label)}"></label>
        <label class="wide"><span>Link / đường dẫn file</span><input data-rf="url" maxlength="1200" value="${esc(r.url)}" placeholder="downloads/youtube-practice/... hoặc https://..."></label>
        <label><span>Nhóm màu</span><select data-rf="tone"><option value="raw" ${r.tone==="raw"?"selected":""}>Cam nhẹ</option><option value="clean" ${r.tone==="clean"?"selected":""}>Xanh nhẹ</option><option value="neutral" ${!r.tone||r.tone==="neutral"?"selected":""}>Trung tính</option></select></label>
        <label><span>Thứ tự</span><input data-rf="sort_order" type="number" value="${esc(r.sort_order??i)}"></label>
        <label><span>Hiển thị</span><select data-rf="is_active"><option value="true" ${r.is_active!==false?"selected":""}>Hiện</option><option value="false" ${r.is_active===false?"selected":""}>Ẩn</option></select></label>
      </div><div class="ayt-item-actions"><button class="danger" type="button" data-ayt-remove-resource="${i}">Bỏ tài nguyên này</button></div></div>
    </details>`).join("");
  }
  function openEditor(row){
    editing=row?{...clone(row),parts:arr(row.parts),resources:arr(row.resources)}:emptyProject();
    $("aytEditor").hidden=false;$("aytEditorTitle").textContent=row?"Sửa project":"Thêm project";
    $("aytId").value=editing.id||"";$("aytSlug").value=editing.slug||"";$("aytNumber").value=editing.project_number||1;$("aytTitle").value=editing.title||"";$("aytSummary").value=editing.summary||"";$("aytKicker").value=editing.kicker||"PROJECT";$("aytCover").value=editing.cover_image_url||"";$("aytProjectStatus").value=editing.status||"draft";$("aytOrder").value=editing.sort_order||0;$("aytActive").checked=editing.is_active!==false;
    renderParts();renderResources();$("aytEditor").scrollIntoView({behavior:"smooth",block:"start"});
  }
  function closeEditor(){editing=null;if($("aytEditor"))$("aytEditor").hidden=true}
  function syncPartField(target){
    const box=target.closest("[data-ayt-part]"),i=Number(box?.dataset.aytPart),key=target.dataset.pf;if(!editing?.parts?.[i]||!key)return;
    let value=target.value;if(["part_number","sort_order"].includes(key))value=Number(value||0);if(key==="is_active")value=value==="true";editing.parts[i][key]=value;
    const sum=box.querySelector("summary strong");if(sum)sum.textContent=`P${editing.parts[i].part_number||i+1} · ${editing.parts[i].title||"Phần chưa đặt tên"}`;
  }
  function syncResourceField(target){
    const box=target.closest("[data-ayt-resource]"),i=Number(box?.dataset.aytResource),key=target.dataset.rf;if(!editing?.resources?.[i]||!key)return;
    let value=target.value;if(key==="sort_order")value=Number(value||0);if(key==="is_active")value=value==="true";editing.resources[i][key]=value;
    const sum=box.querySelector("summary strong");if(sum)sum.textContent=editing.resources[i].label||"Tài nguyên chưa đặt tên";
  }
  function validUrl(value){
    const s=String(value||"").trim();
    if(!s)return true;
    if(/^(javascript|data|vbscript):/i.test(s))return false;
    if(/^https?:\/\/[^\s<>"']+$/i.test(s))return true;
    return /^\.?\/?[\wÀ-ỹ()[\] ._%-]+(?:\/[\wÀ-ỹ()[\] ._?&=%#-]+)*$/i.test(s);
  }
  async function save(){
    if(!editing)return;
    editing={...editing,slug:$("aytSlug").value.trim().toLowerCase().replace(/[^a-z0-9-]+/g,"-").replace(/^-+|-+$/g,""),project_number:Number($("aytNumber").value||0),title:$("aytTitle").value.trim(),summary:$("aytSummary").value.trim(),kicker:$("aytKicker").value.trim()||"PROJECT",cover_image_url:$("aytCover").value.trim(),status:$("aytProjectStatus").value,is_active:$("aytActive").checked,sort_order:Number($("aytOrder").value||0)};
    if(!editing.slug||!editing.title)return toast("Cần nhập slug và tên project");
    if(!validUrl(editing.cover_image_url)||editing.parts.some(p=>!validUrl(p.video_url)||!validUrl(p.image_url))||editing.resources.some(r=>!validUrl(r.url)))return toast("Có link không hợp lệ");
    if(editing.parts.some(p=>!String(p.title||"").trim()))return toast("Mỗi phần phải có tiêu đề");
    if(editing.resources.some(r=>!String(r.label||"").trim()||!String(r.url||"").trim()))return toast("Mỗi tài nguyên cần tên và đường dẫn");
    const button=$("aytSave");button.disabled=true;
    try{
      await rpc("admin_youtube_project_save",{p_id:editing.id||null,p_slug:editing.slug,p_project_number:editing.project_number,p_title:editing.title,p_summary:editing.summary,p_kicker:editing.kicker,p_cover_image_url:editing.cover_image_url||null,p_parts:editing.parts,p_resources:editing.resources,p_status:editing.status,p_is_active:editing.is_active,p_sort_order:editing.sort_order});
      toast("Đã lưu project");closeEditor();await load();
    }catch(e){console.warn(e);toast(e.message||"Không lưu được project")}finally{button.disabled=false}
  }
  function bind(){
    $("aytAddProject")?.addEventListener("click",()=>openEditor(null));$("aytReload")?.addEventListener("click",load);$("aytSearchButton")?.addEventListener("click",load);$("aytStatus")?.addEventListener("change",load);$("aytSearch")?.addEventListener("keydown",e=>{if(e.key==="Enter")load()});$("aytClose")?.addEventListener("click",closeEditor);$("aytCancel")?.addEventListener("click",closeEditor);$("aytSave")?.addEventListener("click",save);
    $("aytAddPart")?.addEventListener("click",()=>{if(!editing)return;editing.parts.push(emptyPart());renderParts()});$("aytAddResource")?.addEventListener("click",()=>{if(!editing)return;editing.resources.push(emptyResource());renderResources()});
    $("aytParts")?.addEventListener("input",e=>{if(e.target.dataset.pf)syncPartField(e.target)});$("aytParts")?.addEventListener("change",e=>{if(e.target.dataset.pf)syncPartField(e.target)});$("aytResources")?.addEventListener("input",e=>{if(e.target.dataset.rf)syncResourceField(e.target)});$("aytResources")?.addEventListener("change",e=>{if(e.target.dataset.rf)syncResourceField(e.target)});
    $("aytParts")?.addEventListener("click",e=>{const b=e.target.closest("[data-ayt-remove-part]");if(!b||!editing)return;if(!confirm("Bỏ phần này khỏi project? Thay đổi chỉ có hiệu lực sau khi bấm Lưu."))return;editing.parts.splice(Number(b.dataset.aytRemovePart),1);renderParts()});
    $("aytResources")?.addEventListener("click",e=>{const b=e.target.closest("[data-ayt-remove-resource]");if(!b||!editing)return;if(!confirm("Bỏ tài nguyên này khỏi project? Thay đổi chỉ có hiệu lực sau khi bấm Lưu."))return;editing.resources.splice(Number(b.dataset.aytRemoveResource),1);renderResources()});
    $("aytProjectList")?.addEventListener("click",async e=>{const b=e.target.closest("[data-ayt-act]"),row=b&&rows.find(x=>String(x.id)===b.closest("[data-ayt-id]")?.dataset.aytId);if(!b||!row)return;const act=b.dataset.aytAct;if(act==="edit")return openEditor(row);if(act==="toggle"){b.disabled=true;try{await rpc("admin_youtube_project_set_active",{p_id:row.id,p_active:!row.is_active});toast(row.is_active?"Đã ẩn project":"Đã hiện project");await load()}catch(err){toast("Không đổi được trạng thái");b.disabled=false}}if(act==="archive"){if(!confirm("Lưu trữ project này? Project sẽ biến khỏi trang YouTube nhưng dữ liệu vẫn được giữ."))return;b.disabled=true;try{await rpc("admin_youtube_project_archive",{p_id:row.id});toast("Đã lưu trữ project");await load()}catch(err){toast("Không lưu trữ được");b.disabled=false}}});
    window.addEventListener("avp:admin-youtube-open",()=>{if(!loaded)load()});
  }
  function boot(){bind();try{if(localStorage.getItem("avp_admin_view_v1")==="youtube")setTimeout(load,250)}catch(e){}}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
