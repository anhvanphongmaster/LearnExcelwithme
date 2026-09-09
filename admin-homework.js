(()=>{
  'use strict';
  if(window.__AVP_ADMIN_HOMEWORK_V1__)return;window.__AVP_ADMIN_HOMEWORK_V1__=true;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clone=v=>JSON.parse(JSON.stringify(v));
  let rows=[],projectId='',partIndex=-1;
  const $=id=>document.getElementById(id);
  const safeUrl=v=>{const s=String(v||'').trim();if(!s)return true;if(/^(javascript|data|vbscript):/i.test(s))return false;return /^https?:\/\/[^\s<>"']+$/i.test(s)||/^\.?\/?[\wÀ-ỹ()[\] ._%-]+(?:\/[\wÀ-ỹ()[\] ._?&=%#-]+)*$/i.test(s)};
  const arr=v=>Array.isArray(v)?clone(v):(typeof v==='string'?(()=>{try{const x=JSON.parse(v);return Array.isArray(x)?x:[]}catch{return[]}})():[]);

  async function waitClient(){for(let i=0;i<60;i++){const c=window.avpSupabase||window.supabaseClient||window._supabaseClient;if(c?.rpc)return c;await new Promise(r=>setTimeout(r,100))}throw new Error('Supabase chưa sẵn sàng')}
  async function rpc(name,args={}){const c=await waitClient();const {data,error}=await c.rpc(name,args);if(error)throw error;return data}
  function msg(text,tone=''){const el=$('ahwMessage');if(!el)return;el.textContent=text||'';el.className=`ahw-message ${tone}`}

  function shell(){
    const host=document.getElementById('adminYoutubePanel');if(!host||document.getElementById('adminHomeworkPanel'))return !!host;
    const panel=document.createElement('section');panel.id='adminHomeworkPanel';panel.className='ahw-panel';panel.innerHTML=`
      <div class="ahw-head"><div><span>HOMEWORK THEO YOUTUBE</span><strong>Video → File → Nhiệm vụ → Hint → Video chữa</strong><p>Homework nằm ngay trong từng phần của YouTube Project, không tạo thêm một hệ dữ liệu riêng.</p></div><button type="button" id="ahwReload">↻ Tải lại</button></div>
      <div class="ahw-selectors"><label><span>Project</span><select id="ahwProject"></select></label><label><span>Phần / Video</span><select id="ahwPart"></select></label></div>
      <p class="ahw-source" id="ahwSource"><strong>Video gốc:</strong> Chọn một phần để chỉnh Homework.</p>
      <div class="ahw-form" id="ahwForm">
        <label class="ahw-toggle"><input id="ahwEnabled" type="checkbox"><span>Có Homework cho video này</span></label>
        <label><span>Trạng thái Homework</span><select id="ahwStatus"><option value="draft">Bản nháp</option><option value="published">Phát hành</option></select></label>
        <label class="wide"><span>Tiêu đề Homework</span><input id="ahwTitle" maxlength="180" placeholder="Ví dụ: Sửa lỗi lookup khi mã bị trùng"></label>
        <label><span>Chủ đề</span><input id="ahwTopic" maxlength="100" placeholder="Lookup / Power Query / Pivot..."></label>
        <label><span>Thời lượng (phút)</span><input id="ahwDuration" type="number" min="5" max="60" value="10"></label>
        <label class="wide"><span>Bối cảnh</span><textarea id="ahwContext" rows="3" maxlength="1200" placeholder="Tình huống thực tế và mục tiêu ngắn của bài..."></textarea></label>
        <label class="wide"><span>File thực hành · link / đường dẫn</span><input id="ahwFile" maxlength="1200" placeholder="downloads/...xlsx hoặc https://..."></label>
        <label class="wide"><span>Nhiệm vụ · mỗi dòng là một yêu cầu</span><textarea id="ahwTasks" rows="4" maxlength="2400" placeholder="Kiểm tra...&#10;Sửa...&#10;Đối chiếu..."></textarea></label>
        <label class="wide"><span>Điểm dễ sai / Cú bẫy</span><textarea id="ahwTrap" rows="2" maxlength="900"></textarea></label>
        <label class="wide"><span>Hint 1 · gợi ý nhẹ</span><textarea id="ahwHint1" rows="2" maxlength="900"></textarea></label>
        <label class="wide"><span>Hint 2 · gợi ý mạnh hơn</span><textarea id="ahwHint2" rows="2" maxlength="900"></textarea></label>
        <label class="wide"><span>Video chữa · để trống cho tới khi video sau phát hành</span><input id="ahwSolution" maxlength="1200" placeholder="https://youtu.be/..."></label>
        <label><span>Link học tiếp</span><input id="ahwNext" maxlength="1200" placeholder="practice-youtube.html hoặc https://..."></label>
        <label><span>Nhãn nút học tiếp</span><input id="ahwNextLabel" maxlength="100" value="Học tiếp"></label>
      </div>
      <div class="ahw-actions"><button type="button" id="ahwSave">Lưu Homework vào Project</button><button type="button" class="secondary" id="ahwClear">Đưa về Draft</button><p id="ahwMessage" class="ahw-message"></p></div>`;
    const toolbar=host.querySelector('.ayt-toolbar');(toolbar?.parentNode||host).insertBefore(panel,toolbar?.nextSibling||host.firstChild);
    $('ahwReload').addEventListener('click',load);
    $('ahwProject').addEventListener('change',()=>{projectId=$('ahwProject').value;renderParts();});
    $('ahwPart').addEventListener('change',()=>{partIndex=Number($('ahwPart').value);fill();});
    $('ahwSave').addEventListener('click',save);
    $('ahwClear').addEventListener('click',()=>{$('ahwStatus').value='draft';save()});
    return true;
  }

  function currentProject(){return rows.find(r=>String(r.id)===String(projectId))||null}
  function currentPart(){const p=currentProject();const parts=arr(p?.parts);return Number.isInteger(partIndex)&&partIndex>=0?parts[partIndex]:null}
  function emptyHomework(part){return {enabled:false,status:'draft',title:part?.title||'',topic:'',duration_min:10,context:'',file_url:'',tasks:[],trap:'',hint1:'',hint2:'',solution_video_url:'',next_url:'practice-youtube.html',next_label:'Học tiếp'}}

  function renderProjects(){
    const el=$('ahwProject');if(!el)return;
    el.innerHTML=rows.length?rows.map(r=>`<option value="${esc(r.id)}">#${String(r.project_number||0).padStart(2,'0')} · ${esc(r.title)}</option>`).join(''):'<option value="">Chưa có project</option>';
    if(!rows.some(r=>String(r.id)===String(projectId)))projectId=rows[0]?.id||'';
    el.value=projectId;renderParts();
  }
  function renderParts(){
    const p=currentProject(),parts=arr(p?.parts),el=$('ahwPart');if(!el)return;
    el.innerHTML=parts.length?parts.map((part,i)=>`<option value="${i}">P${esc(part.part_number||i+1)} · ${esc(part.title||'Chưa đặt tên')}${part.homework?.enabled?' · Homework':''}</option>`).join(''):'<option value="-1">Project chưa có phần</option>';
    partIndex=parts.length?Math.min(Math.max(partIndex,0),parts.length-1):-1;el.value=String(partIndex);fill();
  }
  function fill(){
    const part=currentPart(),p=currentProject();if(!part){msg('Chọn project có ít nhất một phần.');return}
    const hw={...emptyHomework(part),...(part.homework||{})};
    $('ahwEnabled').checked=hw.enabled===true;$('ahwStatus').value=hw.status==='published'?'published':'draft';$('ahwTitle').value=hw.title||part.title||'';$('ahwTopic').value=hw.topic||p?.title||'';$('ahwDuration').value=Math.max(5,Math.min(60,Number(hw.duration_min||10)));$('ahwContext').value=hw.context||'';$('ahwFile').value=hw.file_url||'';$('ahwTasks').value=arr(hw.tasks).join('\n');$('ahwTrap').value=hw.trap||'';$('ahwHint1').value=hw.hint1||'';$('ahwHint2').value=hw.hint2||'';$('ahwSolution').value=hw.solution_video_url||'';$('ahwNext').value=hw.next_url||'practice-youtube.html';$('ahwNextLabel').value=hw.next_label||'Học tiếp';
    $('ahwSource').innerHTML=`<strong>Video gốc:</strong> ${part.video_url?`<a href="${esc(part.video_url)}" target="_blank" rel="noopener">${esc(part.video_url)}</a>`:'Chưa gắn link YouTube cho phần này.'}`;msg(hw.enabled?`Homework hiện đang ${hw.status==='published'?'phát hành':'ở bản nháp'}.`:'Video này chưa bật Homework.');
  }

  async function load(){
    if(!shell())return;
    msg('Đang tải YouTube Projects…');
    try{rows=await rpc('admin_youtube_projects_list',{p_search:'',p_status:'all'})||[];renderProjects();msg(`Đã tải ${rows.length} project.`,'ok')}catch(e){console.warn('Admin Homework',e);msg('Không tải được project: '+(e.message||e),'error')}
  }

  function collect(){
    return {
      enabled:$('ahwEnabled').checked,status:$('ahwStatus').value,title:$('ahwTitle').value.trim(),topic:$('ahwTopic').value.trim(),duration_min:Math.max(5,Math.min(60,Number($('ahwDuration').value||10))),context:$('ahwContext').value.trim(),file_url:$('ahwFile').value.trim(),tasks:$('ahwTasks').value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean),trap:$('ahwTrap').value.trim(),hint1:$('ahwHint1').value.trim(),hint2:$('ahwHint2').value.trim(),solution_video_url:$('ahwSolution').value.trim(),next_url:$('ahwNext').value.trim(),next_label:$('ahwNextLabel').value.trim()||'Học tiếp'
    };
  }
  async function save(){
    const selectedProject=currentProject(),part=currentPart();if(!selectedProject||!part)return msg('Chưa chọn phần để lưu.','error');
    const hw=collect();
    if(hw.enabled&&(!hw.title||!hw.tasks.length))return msg('Homework đang bật thì cần Tiêu đề và ít nhất 1 Nhiệm vụ.','error');
    if([hw.file_url,hw.solution_video_url,hw.next_url].some(x=>!safeUrl(x)))return msg('Có link/đường dẫn không hợp lệ.','error');
    const btn=$('ahwSave');btn.disabled=true;msg('Đang lưu…');
    try{
      const fresh=await rpc('admin_youtube_projects_list',{p_search:'',p_status:'all'})||[];
      const project=fresh.find(r=>String(r.id)===String(selectedProject.id));if(!project)throw new Error('Không tìm thấy project sau khi tải lại');
      const parts=arr(project.parts);const signature=String(part.part_number||partIndex+1)+'|'+String(part.title||'');let idx=parts.findIndex(x=>String(x.part_number||'')+'|'+String(x.title||'')===signature);if(idx<0)idx=partIndex;if(!parts[idx])throw new Error('Không tìm thấy phần cần cập nhật');
      parts[idx]={...parts[idx],homework:hw};
      await rpc('admin_youtube_project_save',{p_id:project.id,p_slug:project.slug,p_project_number:project.project_number,p_title:project.title,p_summary:project.summary||'',p_kicker:project.kicker||'PROJECT',p_cover_image_url:project.cover_image_url||null,p_parts:parts,p_resources:arr(project.resources),p_status:project.status,p_is_active:project.is_active,p_sort_order:project.sort_order||0});
      rows=fresh.map(r=>String(r.id)===String(project.id)?{...project,parts}:r);projectId=project.id;partIndex=idx;renderProjects();msg(`Đã lưu Homework P${parts[idx].part_number||idx+1} · ${hw.status==='published'&&hw.enabled?'ĐANG PHÁT HÀNH':'BẢN NHÁP/ẨN'}.`,'ok');
    }catch(e){console.warn('Save Homework',e);msg('Lưu thất bại: '+(e.message||e),'error')}finally{btn.disabled=false}
  }

  function boot(){if(shell())load();else{let tries=0;const timer=setInterval(()=>{tries++;if(shell()){clearInterval(timer);load()}else if(tries>50)clearInterval(timer)},120)}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
