(() => {
  'use strict';
  const BUCKET='tiktok-practice-files',MAX_BYTES=20*1024*1024;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().trim();
  function safeUrl(value){
    const raw=String(value||'').trim();if(!raw||/[\u0000-\u0020\\]/.test(raw))return '';
    try{const url=new URL(raw,location.href);return /^https?:$/.test(url.protocol)&&!url.username&&!url.password?url.href:''}catch(_){return ''}
  }
  function videoUrl(value){
    const safe=safeUrl(value);if(!safe)return '';
    const url=new URL(safe);if(url.protocol!=='https:'||url.port)return '';
    const host=url.hostname.toLowerCase(),path=url.pathname;
    if(['tiktok.com','www.tiktok.com','m.tiktok.com'].includes(host)&&(/^\/@[A-Za-z0-9._-]+\/video\/\d+\/?$/.test(path)||/^\/t\/[A-Za-z0-9]+\/?$/.test(path))){url.hostname='www.tiktok.com'}
    else if(!(['vm.tiktok.com','vt.tiktok.com'].includes(host)&&/^\/[A-Za-z0-9]+\/?$/.test(path)))return '';
    url.search='';url.hash='';url.pathname=path.replace(/\/$/,'');return url.href;
  }
  function uuid(){if(crypto.randomUUID)return crypto.randomUUID();const b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;const h=[...b].map(x=>x.toString(16).padStart(2,'0')).join('');return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`}
  async function bounded(promise){let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('connection_unavailable')),12000)})])}finally{clearTimeout(timer)}}
  async function client(){for(let i=0;i<40;i++){const sb=window.avpSupabase||window.supabaseClient;if(sb?.rpc)return sb;await new Promise(r=>setTimeout(r,100))}throw new Error('connection_unavailable')}
  async function rpc(name,args={},read=true){
    const sb=await client();let req=sb.rpc(name,args),timer;
    if(read&&typeof req.abortSignal==='function'){const controller=new AbortController();timer=setTimeout(()=>controller.abort(),12000);req=req.abortSignal(controller.signal)}
    try{const result=await req;if(result.error)throw result.error;return result.data}finally{clearTimeout(timer)}
  }
  function message(error,admin=false){
    const raw=String(error?.message||error||'');
    if(/PGRST202|42883/.test(String(error?.code))||/could not find the function|does not exist/i.test(raw))return admin?'Cần chạy SQL TIKTOK-CATALOG-V1.sql được gửi kèm bản cập nhật, rồi bấm Làm mới.':'Nội dung TikTok đang được cập nhật. Bạn hãy thử lại sau.';
    const messages={admin_required:'Tài khoản hiện tại không có quyền Admin.',login_required:'Bạn cần đăng nhập để tải file.',concurrent_change:'Nội dung đã thay đổi ở phiên khác. Hãy tải lại danh sách trước khi sửa tiếp.',topic_not_empty:'Chủ đề còn bài. Hãy xóa hoặc chuyển các bài sang chủ đề khác trước.',lesson_not_available:'Bài đã được ẩn hoặc chưa phát hành. Hãy cập nhật lại danh sách.',file_required:'Bài phát hành cần có file thực hành.',video_required:'Bài phát hành cần có link video TikTok hợp lệ.',invalid_video_url:'Chỉ nhận link video TikTok hoặc link chia sẻ vm/vt.tiktok.com.',file_not_found:'File chưa có trên hệ thống. Hãy chọn và tải lên lại.',invalid_file_path:'File không thuộc bài đang lưu. Hãy tải lên file cho bài này.',topic_not_found:'Chủ đề không còn tồn tại. Hãy cập nhật lại danh sách.',lesson_not_found:'Bài không còn tồn tại. Hãy cập nhật lại danh sách.',invalid_title:'Hãy nhập tên trong giới hạn cho phép.',invalid_file_url:'Link file không hợp lệ.',connection_unavailable:'Chưa kết nối được hệ thống. Hãy thử lại.',invalid_order:'Thứ tự phải là số nguyên từ 0 đến 9999.'};
    for(const [code,text] of Object.entries(messages))if(raw.includes(code))return text;
    if(error?.code==='23505')return 'Tên chủ đề, tên bài trong chủ đề hoặc video này đã được dùng. Hãy sửa bài hiện có để tránh trùng.';
    return admin?'Chưa xác nhận được thao tác. Hãy làm mới danh sách để kiểm tra trước khi thử lại.':'Kết nối đang gián đoạn. Hãy thử lại sau.';
  }
  function validateFile(file){if(!file||!file.size)throw new Error('File rỗng hoặc chưa được chọn.');if(file.size>MAX_BYTES)throw new Error('File không được vượt quá 20 MB.');if(!/\.(xlsx|xls|xlsm|csv|zip)$/i.test(file.name))throw new Error('Chỉ nhận XLSX, XLS, XLSM, CSV hoặc ZIP.')}
  async function upload(file,id){
    validateFile(file);const sb=await client(),session=await bounded(sb.auth.getSession());if(session.error)throw session.error;
    const uid=session.data?.session?.user?.id;if(!uid)throw new Error('login_required');
    const name=file.name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g,'-').slice(-110);
    const path=`${uid}/${id}/${uuid()}-${name}`;
    const ext=file.name.split('.').pop().toLowerCase(),types={xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',xls:'application/vnd.ms-excel',xlsm:'application/vnd.ms-excel.sheet.macroEnabled.12',csv:'text/csv',zip:'application/zip'};
    const res=await sb.storage.from(BUCKET).upload(path,file,{upsert:false,contentType:types[ext],cacheControl:'3600'});if(res.error)throw res.error;
    return {file_path:path,file_name:file.name,file_size:file.size,file_url:null};
  }
  async function removeFile(path){if(!path)return;try{const sb=await client();await sb.storage.from(BUCKET).remove([path])}catch(_){}}
  function explicitRejection(error){return /^(P0001|22\w{3}|23\w{3}|42501|PGRST202|42883)$/.test(String(error?.code||''))}
  async function download(id,button,notice){
    if(button?.disabled)return;if(button)button.disabled=true;
    let tab=null;
    try{
      // Button actions avoid the legacy download-link guards. Popup is opened within the click gesture.
      tab=window.open('about:blank','_blank');if(tab)tab.opener=null;
      const sb=await client(),session=await bounded(sb.auth.getSession());if(session.error)throw session.error;
      if(!session.data?.session?.user){if(tab)tab.close();tab=null;const next=location.pathname.split('/').pop()+location.search+location.hash;location.href='auth.html?next='+encodeURIComponent(next);return}
      const data=await rpc('tiktok_lesson_resource_v1',{p_id:id});let href='';
      if(data.file_path){const signed=await sb.storage.from(BUCKET).createSignedUrl(data.file_path,120);if(signed.error)throw signed.error;href=safeUrl(signed.data?.signedUrl)}else href=safeUrl(data.file_url);
      if(!href)throw new Error('file_not_found');
      if(tab)tab.location.replace(href);
      else if(notice){notice.hidden=false;notice.textContent='File đã sẵn sàng. ';const a=document.createElement('a');a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Bấm để mở file';a.dataset.avpPublicDownload='1';notice.appendChild(a)}
      else location.assign(href);
      try{window.AVPAnalytics?.trackEvent?.('download',{page:'practice-tiktok.html',lesson:id})}catch(_){}
    }catch(error){if(tab)tab.close();if(notice){notice.hidden=false;notice.textContent=message(error)}}finally{if(button?.isConnected)button.disabled=false}
  }
  window.AVPTikTok={BUCKET,MAX_BYTES,esc,normalize,safeUrl,videoUrl,uuid,client,rpc,message,upload,removeFile,validateFile,explicitRejection,download};
})();
