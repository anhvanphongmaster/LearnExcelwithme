(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const qa = s => Array.from(document.querySelectorAll(s));

  const LESSON = {
    key: "clean_blank_rows_01",
    title: "Xóa dòng trống",
    difficulty: "basic"
  };

  const HEADERS = ["Mã NV", "Họ tên", "Bộ phận", "Số lượng"];
  const DATA = [
    ["NV001","Nguyễn An","QC",12],
    ["NV002","Trần Bình","PE",18],
    ["NV003","Lê Chi","QC",15],
    ["NV004","Phạm Dũng","MFG",22],
    ["NV005","Hoàng Em","PE",16],
    ["NV006","Vũ Giang","QC",19],
    ["NV007","Đỗ Hạnh","MFG",14],
    ["NV008","Bùi Khánh","QC",21]
  ];
  const RAW = [
    HEADERS, DATA[0],["","","",""],DATA[1],DATA[2],["","","",""],
    DATA[3],DATA[4],["","","",""],DATA[5],DATA[6],["","","",""],DATA[7]
  ];

  let xlsxPromise = null;
  let pendingFile = null;
  let currentRankDifficulty = "basic";
  let currentSubmission = null;

  function note(text, kind="") {
    const el = $("pgFileNote");
    if (!el) return;
    el.textContent = text;
    el.className = "pg-note" + (kind ? " " + kind : "");
  }

  async function getClient() {
    if (window.avpSupabase) return window.avpSupabase;
    for (let i=0;i<35;i++) {
      if (window.avpSupabase) return window.avpSupabase;
      await new Promise(r=>setTimeout(r,100));
    }
    return null;
  }

  async function getUser() {
    if (window.AVPAccess) return await window.AVPAccess.getUser(true);
    const sb = await getClient();
    if (!sb?.auth) return null;
    try {
      const {data,error} = await sb.auth.getUser();
      return error ? null : (data?.user || null);
    } catch(e) { return null; }
  }

  async function requireLogin() {
    if (window.AVPAccess) {
      return await window.AVPAccess.requireLogin({
        next:"practice-video.html#grader",
        reason:"Đăng nhập để làm bài chấm điểm."
      });
    }
    const u = await getUser();
    if (u) return u;
    location.href="auth.html?next="+encodeURIComponent("practice-video.html#grader");
    return null;
  }

  function loadXLSX() {
    if (window.XLSX) return Promise.resolve(window.XLSX);
    if (xlsxPromise) return xlsxPromise;
    note("Đang mở bộ đọc Excel…");
    xlsxPromise = new Promise((resolve,reject)=>{
      const s=document.createElement("script");
      s.src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
      s.async=true;
      s.onload=()=>window.XLSX?resolve(window.XLSX):reject(new Error("XLSX_NOT_READY"));
      s.onerror=()=>reject(new Error("XLSX_LOAD_FAILED"));
      document.head.appendChild(s);
    });
    return xlsxPromise;
  }

  async function downloadDemo() {
    const user=await requireLogin();
    if(!user)return;
    try{
      const XLSX=await loadXLSX();
      const wb=XLSX.utils.book_new();
      const ws=XLSX.utils.aoa_to_sheet(RAW);
      ws["!cols"]=[{wch:12},{wch:22},{wch:14},{wch:12}];
      XLSX.utils.book_append_sheet(wb,ws,"DuLieu");
      const guide=XLSX.utils.aoa_to_sheet([
        ["BÀI THỰC HÀNH: XÓA DÒNG TRỐNG"],
        ["Mỗi tài khoản chỉ được nộp chính thức bài này 1 lần."],
        ["1. Mở sheet DuLieu."],
        ["2. Xóa toàn bộ các dòng trống."],
        ["3. Không sửa tiêu đề và dữ liệu."],
        ["4. Kiểm tra kỹ trước khi nộp."]
      ]);
      guide["!cols"]=[{wch:62}];
      XLSX.utils.book_append_sheet(wb,guide,"HuongDan");
      XLSX.writeFile(wb,"AVP_BaiMau_XoaDongTrong.xlsx");
      note("Đã tạo file. Bạn có thể tải lại nhiều lần nhưng chỉ được nộp 1 lần.","ok");
    }catch(e){
      console.error("[grader download]",e);
      note("Không mở được bộ đọc Excel. Kiểm tra mạng rồi thử lại.","bad");
    }
  }

  const norm=v=>{
    if(v===null||v===undefined)return "";
    if(typeof v==="number")return v;
    return String(v).trim();
  };
  const blankRow=row=>(row||[]).every(v=>norm(v)==="");
  const sameHeaders=row=>HEADERS.every((h,i)=>norm(row?.[i])===h);
  const sameData=rows=>rows.length===DATA.length && DATA.every((exp,r)=>exp.every((v,c)=>String(norm(rows[r]?.[c]))===String(norm(v))));

  async function checkSubmission() {
    const user=await getUser();
    if(!user)return null;
    const sb=await getClient();
    if(!sb?.rpc)return null;
    try{
      const {data,error}=await sb.rpc("practice_grader_my_submission",{p_lesson_key:LESSON.key});
      if(error)throw error;
      currentSubmission=Array.isArray(data)?data[0]:(data||null);
      applySubmissionState();
      return currentSubmission;
    }catch(e){
      console.warn("[grader submission state]",e);
      return null;
    }
  }

  function applySubmissionState() {
    const input=$("pgSubmitDemo");
    const label=input?.closest(".pg-btn.submit");
    const status=$("pgLessonStatus");

    if(currentSubmission?.submitted){
      if(label){
        label.classList.add("locked");
        label.setAttribute("aria-disabled","true");
        label.childNodes.forEach?.(()=>{});
      }
      if(input) input.disabled=true;
      if(status){
        status.textContent=`✓ ĐÃ NỘP · ${Number(currentSubmission.score)||0}/100`;
        status.className="pg-status-locked";
      }
      note(`Bài đã khóa với ${Number(currentSubmission.score)||0}/100. Admin mới có thể mở lại lượt nộp.`,"ok");
    }else{
      if(label) label.classList.remove("locked");
      if(input) input.disabled=false;
      if(status){
        status.textContent="● ĐANG MỞ";
        status.className="";
      }
    }
  }

  function openSubmitConfirm(file){
    pendingFile=file;
    if($("pgSubmitFileName"))$("pgSubmitFileName").textContent=file?.name||"Chưa chọn file";
    $("pgSubmitModal").hidden=false;
    document.body.classList.add("pg-publish-open");
  }
  function closeSubmitConfirm(){
    $("pgSubmitModal").hidden=true;
    document.body.classList.remove("pg-publish-open");
    pendingFile=null;
  }

  async function onFilePicked(file){
    if(!file)return;
    const user=await requireLogin();
    if(!user)return;
    await checkSubmission();
    if(currentSubmission?.submitted){
      note("Bài này đã được nộp chính thức trước đó và không thể nộp lại.","bad");
      return;
    }
    if(!/\.(xlsx|xls)$/i.test(file.name)){
      note("Chỉ nhận file Excel .xlsx hoặc .xls.","bad");
      return;
    }
    openSubmitConfirm(file);
  }

  async function gradeAndSubmit(file){
    if(!file)return;
    const sb=await getClient();
    if(!sb?.rpc){
      note("Chưa kết nối Supabase.","bad");
      return;
    }

    const btn=$("pgSubmitConfirm");
    if(btn){btn.disabled=true;btn.textContent="Đang chấm…";}

    try{
      const XLSX=await loadXLSX();
      const buf=await file.arrayBuffer();
      const wb=XLSX.read(buf,{type:"array",cellDates:true});
      const hasSheet=wb.SheetNames.includes("DuLieu");
      let rows=[];
      if(hasSheet){
        rows=XLSX.utils.sheet_to_json(wb.Sheets["DuLieu"],{header:1,defval:"",raw:true,blankrows:true});
      }
      const header=rows[0]||[];
      const body=rows.slice(1);
      const blanks=body.filter(blankRow).length;
      const dataRows=body.filter(r=>!blankRow(r));

      const checks=[
        {label:"Đúng sheet DuLieu",points:20,ok:hasSheet,detail:hasSheet?"Tìm thấy sheet cần chấm.":"Không tìm thấy sheet DuLieu."},
        {label:"Giữ đúng tiêu đề",points:20,ok:hasSheet&&sameHeaders(header),detail:hasSheet&&sameHeaders(header)?"4 tiêu đề vẫn đúng.":"Tiêu đề đã bị đổi hoặc sai vị trí."},
        {label:"Xóa hết dòng trống",points:30,ok:hasSheet&&blanks===0,detail:!hasSheet?"Chưa thể kiểm tra.":blanks===0?"Không còn dòng trống.":`Vẫn còn ${blanks} dòng trống.`},
        {label:"Giữ đủ dữ liệu",points:30,ok:hasSheet&&sameData(dataRows),detail:!hasSheet?"Chưa thể kiểm tra.":sameData(dataRows)?"Đủ 8 dòng và dữ liệu không bị thay đổi.":`Hiện có ${dataRows.length}/8 dòng hoặc dữ liệu đã bị sửa.`}
      ];
      const score=checks.reduce((s,x)=>s+(x.ok?x.points:0),0);

      const {data,error}=await sb.rpc("practice_grader_submit_once",{
        p_lesson_key:LESSON.key,
        p_score:score
      });
      if(error)throw error;

      closeSubmitConfirm();
      renderResult(score,checks);
      currentSubmission={submitted:true,score:score};
      applySubmissionState();
      setTimeout(()=>openPublishModal(score),250);
      await loadLeaderboard();
    }catch(e){
      console.error("[grader submit]",e);
      const msg=String(e?.message||e||"");
      if(/ALREADY_SUBMITTED/i.test(msg)){
        closeSubmitConfirm();
        note("Bài này đã được nộp trước đó. Mỗi bài chỉ có 1 lượt nộp chính thức.","bad");
        await checkSubmission();
      }else{
        note("Không nộp được bài: "+msg,"bad");
      }
    }finally{
      if(btn){btn.disabled=false;btn.textContent="Nộp chính thức";}
    }
  }

  function renderResult(score,checks){
    const result=$("pgResult");
    if(!result)return;
    result.hidden=false;
    result.innerHTML=`
      <div class="pg-score"><strong>${score}</strong><span>/100</span></div>
      <div class="pg-checks">
        ${checks.map(x=>`
          <div class="pg-check ${x.ok?"ok":"bad"}">
            <b>${x.ok?"✓":"×"} ${x.label} · ${x.points}đ</b>
            <small>${x.detail}</small>
          </div>`).join("")}
      </div>`;
    note(`Đã nộp chính thức: ${score}/100. Bài đã được khóa.`,score>=70?"ok":"warn");
  }

  function openPublishModal(score){
    $("pgPublishScore").textContent=String(score);
    $("pgPublishText").textContent=`Điểm chính thức ${score}/100 · Cấp độ Cơ bản.`;
    $("pgPublishModal").hidden=false;
    document.body.classList.add("pg-publish-open");
  }
  function closePublishModal(){
    $("pgPublishModal").hidden=true;
    document.body.classList.remove("pg-publish-open");
  }

  async function setVisibility(visible){
    const sb=await getClient();
    if(!sb?.rpc)return;
    try{
      const {error}=await sb.rpc("practice_grader_set_visibility",{p_visible:!!visible});
      if(error)throw error;
      closePublishModal();
      note(visible?"Đã công khai thành tích lên bảng xếp hạng.":"Kết quả được giữ riêng tư.","ok");
      await loadLeaderboard();
    }catch(e){
      note("Không cập nhật được quyền hiển thị: "+(e?.message||e),"bad");
    }
  }

  function escapeHtml(s){
    return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  async function loadLeaderboard(){
    const list=$("pgBoardList");
    if(!list)return;
    const sb=await getClient();
    if(!sb?.rpc){
      list.innerHTML='<li class="pg-board-empty">Chưa kết nối BXH.</li>';
      return;
    }
    list.innerHTML='<li class="pg-board-empty">Đang tải thành tích…</li>';
    try{
      const {data,error}=await sb.rpc("practice_grader_leaderboard_v4",{
        p_difficulty:currentRankDifficulty,
        p_limit:50
      });
      if(error)throw error;
      const rows=Array.isArray(data)?data:[];
      if(!rows.length){
        list.innerHTML='<li class="pg-board-empty">Chưa có thành tích công khai ở cấp độ này.</li>';
        return;
      }
      list.innerHTML=rows.map((row,i)=>{
        const rank=Number(row.rank_no)||(i+1);
        const medal=rank===1?"🥇":rank===2?"🥈":rank===3?"🥉":`${rank}.`;
        return `<li class="pg-board-row${row.is_me?" me":""}">
          <span class="pg-board-rank">${medal}</span>
          <span class="pg-board-name">${escapeHtml(row.display_name||"Học viên")}${row.is_me?" · Bạn":""}</span>
          <span class="pg-board-score">${Number(row.total_score)||0}<small>đ</small></span>
          <span class="pg-board-meta">${Number(row.submitted_lessons)||0} bài · TB ${Number(row.avg_score)||0}/100</span>
        </li>`;
      }).join("");
    }catch(e){
      console.error("[grader leaderboard]",e);
      list.innerHTML='<li class="pg-board-empty">BXH chưa tải được.</li>';
    }
  }

  function bindRankTabs(){
    qa("[data-rank-difficulty]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        currentRankDifficulty=btn.dataset.rankDifficulty;
        qa("[data-rank-difficulty]").forEach(x=>x.classList.toggle("active",x===btn));
        loadLeaderboard();
      });
    });
  }

  function init(){
    $("pgDownloadDemo")?.addEventListener("click",downloadDemo);
    $("pgSubmitDemo")?.addEventListener("change",e=>{
      const file=e.target.files?.[0];
      e.target.value="";
      onFilePicked(file);
    });

    $("pgSubmitConfirm")?.addEventListener("click",()=>gradeAndSubmit(pendingFile));
    $("pgSubmitCancel")?.addEventListener("click",closeSubmitConfirm);
    $("pgSubmitClose")?.addEventListener("click",closeSubmitConfirm);
    qa("[data-pg-submit-close]").forEach(el=>el.addEventListener("click",closeSubmitConfirm));

    $("pgPublishYes")?.addEventListener("click",()=>setVisibility(true));
    $("pgPublishPrivate")?.addEventListener("click",()=>setVisibility(false));
    $("pgPublishClose")?.addEventListener("click",closePublishModal);
    qa("[data-pg-publish-close]").forEach(el=>el.addEventListener("click",closePublishModal));
    $("pgHideFromBoard")?.addEventListener("click",()=>setVisibility(false));

    $("pgBoardRefresh")?.addEventListener("click",loadLeaderboard);
    bindRankTabs();

    document.addEventListener("keydown",e=>{
      if(e.key==="Escape"){
        if(!$("pgSubmitModal")?.hidden)closeSubmitConfirm();
        if(!$("pgPublishModal")?.hidden)closePublishModal();
      }
    });

    checkSubmission();
    loadLeaderboard();
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",init,{once:true});
  }else init();
})();
