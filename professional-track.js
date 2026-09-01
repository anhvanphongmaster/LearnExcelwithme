(() => {
  "use strict";
  const $=id=>document.getElementById(id);
  const LIMITS={basic:1500,intermediate:1300,advanced:1000,days:5};

  async function client(){
    for(let i=0;i<40;i++){
      const sb=window.avpSupabase||window.supabaseClient||null;
      if(sb?.rpc)return sb;
      await new Promise(r=>setTimeout(r,100));
    }
    return null;
  }

  function fmt(n){return Number(n||0).toLocaleString("vi-VN")}
  function setCriterion(key,value,limit){
    const ids={basic:"ptBasic",intermediate:"ptIntermediate",advanced:"ptAdvanced",days:"ptDays"};
    const stateIds={basic:"ptBasicState",intermediate:"ptIntermediateState",advanced:"ptAdvancedState",days:"ptDaysState"};
    const ok=Number(value)>=Number(limit);
    if($(ids[key]))$(ids[key]).textContent=`${fmt(value)} / ${fmt(limit)}`;
    if($(stateIds[key]))$(stateIds[key]).textContent=ok?"Đã đạt":"Chưa đạt";
    document.querySelector(`[data-criterion="${key}"]`)?.classList.toggle("ok",ok);
    document.querySelector(`[data-criterion="${key}"]`)?.classList.toggle("missing",!ok);
  }

  function setStatus(kind,title,text,badge){
    $("ptStatusTitle").textContent=title;
    $("ptStatusText").textContent=text;
    $("ptStatusBadge").textContent=badge;
    $("ptStatusBadge").className=`pt-status-badge ${kind||""}`.trim();
  }

  function render(s){
    const basic=Number(s.basic_score)||0;
    const intermediate=Number(s.intermediate_score)||0;
    const advanced=Number(s.advanced_score)||0;
    const days=Number(s.active_days)||0;
    setCriterion("basic",basic,LIMITS.basic);
    setCriterion("intermediate",intermediate,LIMITS.intermediate);
    setCriterion("advanced",advanced,LIMITS.advanced);
    setCriterion("days",days,LIMITS.days);

    const action=$("ptActionArea");
    $("ptApplyCard").hidden=true;
    $("ptProgramCard").hidden=true;

    if(s.can_access || s.status==="approved"){
      setStatus("approved","Bạn đã được mở khóa","Hồ sơ đã được Admin xác nhận. Quyền truy cập Lộ trình Excel Chuyên nghiệp được giữ vĩnh viễn.","ĐÃ PHÊ DUYỆT");
      action.innerHTML="<p>✓ Bạn đã hoàn tất toàn bộ quy trình xét duyệt.</p>";
      $("ptProgramCard").hidden=false;
      return;
    }

    if(s.status==="pending"){
      setStatus("pending","Hồ sơ đang được Admin xét duyệt","Bạn đã nộp chứng chỉ. Nội dung chuyên sâu sẽ mở sau khi Admin xác nhận.","ĐANG XÉT DUYỆT");
      action.innerHTML=`<p>Đã nộp: <strong>${s.submitted_at?new Date(s.submitted_at).toLocaleString("vi-VN"):"—"}</strong>. Vui lòng chờ Admin kiểm tra.</p>`;
      return;
    }

    if(s.status==="rejected"){
      setStatus("rejected","Hồ sơ cần bổ sung","Admin chưa phê duyệt hồ sơ hiện tại. Bạn có thể xem ghi chú và nộp lại khi đã bổ sung.","CẦN BỔ SUNG");
      action.innerHTML=`<p><strong>Ghi chú Admin:</strong> ${escapeHtml(s.admin_note||"Hồ sơ chưa đáp ứng yêu cầu.")}</p>`;
      if(s.eligible)$("ptApplyCard").hidden=false;
      return;
    }

    if(s.eligible){
      setStatus("","Bạn đã đủ điều kiện sơ bộ","Bạn đã đạt đủ điểm và đủ ngày hoạt động. Bước cuối là nộp chứng chỉ để Admin xác nhận.","ĐỦ ĐIỀU KIỆN");
      action.innerHTML="<p>✓ Tất cả điều kiện tự động đã hoàn thành. Hãy nộp chứng chỉ ở phần bên dưới.</p>";
      $("ptApplyCard").hidden=false;
      return;
    }

    setStatus("","Tiếp tục hoàn thành điều kiện","Bạn cần đạt đủ cả 3 mốc điểm và có ít nhất 5 ngày hoạt động thực tế trên website trước khi nộp hồ sơ.","CHƯA ĐỦ ĐIỀU KIỆN");
    action.innerHTML="<p>Khi đủ 4 điều kiện tự động, nút nộp chứng chỉ sẽ được mở.</p>";
  }

  function escapeHtml(v){
    return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  }

  async function submitApplication(sb){
    const file=$("ptCertificateFile")?.files?.[0];
    const note=String($("ptApplicantNote")?.value||"").trim();
    if(!file)return alert("Hãy chọn file chứng chỉ hoặc xác nhận thành tích.");
    if(file.size>8*1024*1024)return alert("File vượt quá 8 MB.");
    if(!["application/pdf","image/png","image/jpeg"].includes(file.type)){
      return alert("Chỉ nhận PDF, PNG, JPG hoặc JPEG.");
    }

    const {data:{user}}=await sb.auth.getUser();
    if(!user)return alert("Bạn cần đăng nhập.");

    const btn=$("ptSubmitApplication");
    btn.disabled=true;btn.textContent="Đang nộp hồ sơ…";
    let uploadedPath=null;
    try{
      const ext=(file.name.split(".").pop()||"file").toLowerCase().replace(/[^a-z0-9]/g,"");
      uploadedPath=`${user.id}/${Date.now()}-${crypto.randomUUID?.()||Math.random().toString(36).slice(2)}.${ext}`;
      const up=await sb.storage.from("professional-track-certificates").upload(uploadedPath,file,{upsert:false,contentType:file.type});
      if(up.error)throw up.error;

      const {error}=await sb.rpc("professional_track_apply_v1",{
        p_certificate_path:uploadedPath,
        p_applicant_note:note||null
      });
      if(error)throw error;

      await load();
      alert("Đã nộp hồ sơ. Admin sẽ kiểm tra và xác nhận quyền truy cập.");
    }catch(e){
      if(uploadedPath){
        try{await sb.storage.from("professional-track-certificates").remove([uploadedPath])}catch(_){}
      }
      alert("Chưa nộp được hồ sơ: "+String(e?.message||e));
    }finally{
      btn.disabled=false;btn.textContent="Nộp hồ sơ xét duyệt";
    }
  }

  async function load(){
    const sb=await client();
    if(!sb){
      setStatus("rejected","Chưa kết nối được hệ thống","Không tìm thấy Supabase client. Hãy tải lại trang.","LỖI KẾT NỐI");
      return;
    }

    const {data:{session}}=await sb.auth.getSession();
    if(!session?.user){
      setStatus("","Bạn cần đăng nhập","Điều kiện tham gia gắn với tài khoản và kết quả chấm điểm của từng học viên.","YÊU CẦU ĐĂNG NHẬP");
      $("ptActionArea").innerHTML='<p><a href="auth.html?next=professional-track.html">Đăng nhập để kiểm tra điều kiện →</a></p>';
      return;
    }

    try{await sb.rpc("professional_track_mark_activity_v1")}catch(_){}

    const {data,error}=await sb.rpc("professional_track_access_status_v1");
    if(error)throw error;
    render(data||{});
  }

  document.addEventListener("DOMContentLoaded",()=>{
    $("ptSubmitApplication")?.addEventListener("click",async()=>{
      const sb=await client();if(sb)submitApplication(sb);
    });
    load().catch(e=>{
      console.error(e);
      setStatus("rejected","Chưa kiểm tra được điều kiện",String(e?.message||e),"CHƯA SẴN SÀNG");
    });
  });
})();
