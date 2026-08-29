(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const qa = s => Array.from(document.querySelectorAll(s));

  const TOPICS = [
    ["all","Tất cả"],
    ["clean","🧹 Làm sạch"],
    ["pq","⚙️ Power Query"],
    ["input","⌨️ Nhập liệu"],
    ["formula","🧮 Công thức"],
    ["format","🎨 Định dạng"]
  ];

  const DIFF_LABEL = {
    basic: "🌱 Cơ bản",
    intermediate: "📘 Trung cấp",
    advanced: "🏆 Nâng cao"
  };

  let currentTopic = "all";
  let currentDifficulty = "all";
  let currentRankDifficulty = "basic";
  let pendingFile = null;
  let pendingLesson = null;
  let xlsxPromise = null;
  const submissionCache = new Map();

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
    HEADERS,DATA[0],["","","",""],DATA[1],DATA[2],["","","",""],
    DATA[3],DATA[4],["","","",""],DATA[5],DATA[6],["","","",""],DATA[7]
  ];

  const lessons = () => Array.isArray(window.AVP_PRACTICE_LESSONS) ? window.AVP_PRACTICE_LESSONS : [];

  async function getClient(){
    if(window.avpSupabase)return window.avpSupabase;
    for(let i=0;i<35;i++){
      if(window.avpSupabase)return window.avpSupabase;
      await new Promise(r=>setTimeout(r,100));
    }
    return null;
  }

  async function requireLogin(){
    if(window.AVPAccess){
      return await window.AVPAccess.requireLogin({
        next:"practice-video.html#grader",
        reason:"Đăng nhập để làm bài chấm điểm."
      });
    }
    const sb=await getClient();
    try{
      const {data,error}=await sb.auth.getUser();
      if(!error&&data?.user)return data.user;
    }catch(e){}
    location.href="auth.html?next="+encodeURIComponent("practice-video.html#grader");
    return null;
  }

  function loadXLSX(){
    if(window.XLSX)return Promise.resolve(window.XLSX);
    if(xlsxPromise)return xlsxPromise;
    xlsxPromise=new Promise((resolve,reject)=>{
      const s=document.createElement("script");
      s.src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
      s.async=true;
      s.onload=()=>window.XLSX?resolve(window.XLSX):reject(new Error("XLSX_NOT_READY"));
      s.onerror=()=>reject(new Error("XLSX_LOAD_FAILED"));
      document.head.appendChild(s);
    });
    return xlsxPromise;
  }

  function escapeHtml(s){
    return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  function renderTopicTabs(){
    const root=$("pgTopicTabs");
    if(!root)return;
    root.innerHTML=TOPICS.map(([id,label])=>`
      <button type="button" class="pg-topic${id===currentTopic?" active":""}" data-topic="${id}">${label}</button>
    `).join("");

    root.querySelectorAll("[data-topic]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        currentTopic=btn.dataset.topic;
        renderTopicTabs();
        renderLessons();
      });
    });
  }

  function filteredLessons(){
    return lessons()
      .slice()
      .sort((a,b)=>(a.topic||"").localeCompare(b.topic||"") || (a.order||0)-(b.order||0))
      .filter(l=>currentTopic==="all"||l.topic===currentTopic)
      .filter(l=>currentDifficulty==="all"||l.difficulty===currentDifficulty);
  }

  function lessonCard(l){
    const st=submissionCache.get(l.key);
    const locked=!!st?.submitted;
    const active=!!l.isActive;
    const status=locked
      ? `<b class="pg-status-locked">✓ ĐÃ NỘP · ${Number(st.score)||0}/${l.maxScore||100}</b>`
      : active
        ? `<b>● ĐANG MỞ</b>`
        : `<b class="pg-status-soon">SẮP MỞ</b>`;

    const rules=(l.rules||[]).length
      ? `<div class="pg-rules">${l.rules.map(x=>`<span>${escapeHtml(x)}</span>`).join("")}</div>`
      : "";

    const actions=active
      ? `<div class="pg-actions">
          <button type="button" class="pg-btn primary" data-download="${escapeHtml(l.key)}">⬇️ Tải file</button>
          <label class="pg-btn submit${locked?" locked":""}">
            <input type="file" data-submit="${escapeHtml(l.key)}" accept=".xlsx,.xls" hidden ${locked?"disabled":""}>
            ${locked?"✓ Đã nộp":"📤 Nộp bài"}
          </label>
        </div>`
      : `<div class="pg-coming-note">Rule chấm và file bài này đang được chuẩn bị.</div>`;

    return `<article class="pg-card" data-lesson-card="${escapeHtml(l.key)}">
      <div class="pg-card-head">
        <span class="pg-difficulty ${escapeHtml(l.difficulty)}">${DIFF_LABEL[l.difficulty]||l.difficulty}</span>
        ${status}
      </div>
      <h3>${escapeHtml(l.title)}</h3>
      <p>${escapeHtml(l.description||"")}</p>
      ${rules}
      ${actions}
      <div class="pg-note">${locked
        ? `Kết quả đã khóa. Admin mới có thể cho làm lại.`
        : active
          ? `Bạn có thể tải file nhiều lần nhưng chỉ được nộp chính thức 1 lần.`
          : `Bài chưa mở.`}</div>
    </article>`;
  }

  function renderLessons(){
    const list=filteredLessons();
    const grid=$("pgLessonGrid");
    if(!grid)return;

    grid.innerHTML=list.length
      ? list.map(lessonCard).join("")
      : `<article class="pg-card pg-coming"><h3>Không có bài phù hợp</h3><p>Hãy đổi chủ đề hoặc cấp độ.</p></article>`;

    const total=lessons().length;
    const active=lessons().filter(x=>x.isActive).length;
    const submitted=[...submissionCache.values()].filter(x=>x?.submitted).length;
    if($("pgEngineSummary")){
      $("pgEngineSummary").textContent=`${active}/${total} bài đang mở · ${submitted} bài đã nộp`;
    }

    grid.querySelectorAll("[data-download]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const l=lessons().find(x=>x.key===btn.dataset.download);
        if(l)downloadLesson(l);
      });
    });
    grid.querySelectorAll("[data-submit]").forEach(input=>{
      input.addEventListener("change",e=>{
        const file=e.target.files?.[0];
        e.target.value="";
        const l=lessons().find(x=>x.key===input.dataset.submit);
        if(l&&file)onFilePicked(l,file);
      });
    });
  }

  async function loadSubmissionStates(){
    const user=await requireLogin();
    if(!user)return;
    const sb=await getClient();
    if(!sb?.rpc)return;

    await Promise.all(lessons().map(async l=>{
      try{
        const {data,error}=await sb.rpc("practice_grader_my_submission",{p_lesson_key:l.key});
        if(error)throw error;
        const row=Array.isArray(data)?data[0]:(data||null);
        submissionCache.set(l.key,row||{submitted:false});
      }catch(e){
        submissionCache.set(l.key,{submitted:false});
      }
    }));
    renderLessons();
  }

  async function downloadLesson(l){
    const user=await requireLogin();
    if(!user||!l.isActive)return;

    if(l.grader==="clean_blank_rows_v1"){
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
        XLSX.writeFile(wb,l.fileName||"AVP_Practice.xlsx");
      }catch(e){
        alert("Không tạo được file thực hành. Kiểm tra mạng rồi thử lại.");
      }
      return;
    }

    if(l.fileUrl){
      location.href=l.fileUrl;
    }
  }

  function openSubmitModal(l,file){
    pendingLesson=l;
    pendingFile=file;
    $("pgSubmitFileName").textContent=`${file.name} · ${l.title}`;
    $("pgSubmitModal").hidden=false;
    document.body.classList.add("pg-publish-open");
  }
  function closeSubmitModal(){
    $("pgSubmitModal").hidden=true;
    document.body.classList.remove("pg-publish-open");
    pendingLesson=null;
    pendingFile=null;
  }

  async function onFilePicked(l,file){
    const user=await requireLogin();
    if(!user)return;
    const st=submissionCache.get(l.key);
    if(st?.submitted){
      alert("Bài này đã được nộp chính thức và không thể nộp lại.");
      return;
    }
    if(!/\.(xlsx|xls)$/i.test(file.name)){
      alert("Chỉ nhận file Excel .xlsx hoặc .xls.");
      return;
    }
    openSubmitModal(l,file);
  }

  const norm=v=>v===null||v===undefined?"":(typeof v==="number"?v:String(v).trim());
  const blankRow=row=>(row||[]).every(v=>norm(v)==="");
  const sameHeaders=row=>HEADERS.every((h,i)=>norm(row?.[i])===h);
  const sameData=rows=>rows.length===DATA.length && DATA.every((exp,r)=>exp.every((v,c)=>String(norm(rows[r]?.[c]))===String(norm(v))));

  async function gradeByRule(l,file){
    if(l.grader!=="clean_blank_rows_v1")throw new Error("GRADER_NOT_READY");

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
      {label:"Đúng sheet DuLieu",points:20,ok:hasSheet},
      {label:"Giữ đúng tiêu đề",points:20,ok:hasSheet&&sameHeaders(header)},
      {label:"Xóa hết dòng trống",points:30,ok:hasSheet&&blanks===0},
      {label:"Giữ đủ dữ liệu",points:30,ok:hasSheet&&sameData(dataRows)}
    ];
    return {score:checks.reduce((s,x)=>s+(x.ok?x.points:0),0),checks};
  }

  async function submitOfficial(){
    const l=pendingLesson,file=pendingFile;
    if(!l||!file)return;

    const sb=await getClient();
    if(!sb?.rpc)return;

    const btn=$("pgSubmitConfirm");
    btn.disabled=true;
    btn.textContent="Đang chấm…";

    try{
      const {score,checks}=await gradeByRule(l,file);

      const {error}=await sb.rpc("practice_grader_submit_once",{
        p_lesson_key:l.key,
        p_score:score
      });
      if(error)throw error;

      submissionCache.set(l.key,{submitted:true,score,passed:score>=70,difficulty:l.difficulty});
      closeSubmitModal();
      renderLessons();
      openPublishModal(l,score);

      const result=$("pgResult");
      if(result){
        result.hidden=false;
        result.innerHTML=`<div class="pg-score"><strong>${score}</strong><span>/${l.maxScore||100}</span></div>
        <div class="pg-checks">${checks.map(x=>`<div class="pg-check ${x.ok?"ok":"bad"}"><b>${x.ok?"✓":"×"} ${escapeHtml(x.label)} · ${x.points}đ</b></div>`).join("")}</div>`;
      }
      await loadLeaderboard();
    }catch(e){
      const msg=String(e?.message||e);
      if(/ALREADY_SUBMITTED/i.test(msg)){
        alert("Bài này đã được nộp trước đó. Admin mới có thể mở lại.");
        submissionCache.set(l.key,{submitted:true});
        closeSubmitModal();
        renderLessons();
      }else{
        alert("Không nộp được bài: "+msg);
      }
    }finally{
      btn.disabled=false;
      btn.textContent="Nộp chính thức";
    }
  }

  function openPublishModal(l,score){
    pendingLesson=l;
    $("pgPublishScore").textContent=String(score);
    $("pgPublishText").textContent=`${l.title} · ${DIFF_LABEL[l.difficulty]||l.difficulty} · ${score}/${l.maxScore||100}`;
    $("pgPublishModal").hidden=false;
    document.body.classList.add("pg-publish-open");
  }
  function closePublishModal(){
    $("pgPublishModal").hidden=true;
    document.body.classList.remove("pg-publish-open");
  }

  async function setVisibility(v){
    const sb=await getClient();
    if(!sb?.rpc)return;
    const {error}=await sb.rpc("practice_grader_set_visibility",{p_visible:!!v});
    if(error){
      alert("Không cập nhật được quyền BXH: "+error.message);
      return;
    }
    closePublishModal();
    await loadLeaderboard();
  }

  async function loadLeaderboard(){
    const list=$("pgBoardList");
    if(!list)return;
    const sb=await getClient();
    if(!sb?.rpc)return;

    list.innerHTML='<li class="pg-board-empty">Đang tải thành tích…</li>';
    try{
      const {data,error}=await sb.rpc("practice_grader_leaderboard_v4",{
        p_difficulty:currentRankDifficulty,
        p_limit:50
      });
      if(error)throw error;
      const rows=Array.isArray(data)?data:[];
      list.innerHTML=rows.length?rows.map((row,i)=>{
        const rank=Number(row.rank_no)||(i+1);
        const medal=rank===1?"🥇":rank===2?"🥈":rank===3?"🥉":`${rank}.`;
        return `<li class="pg-board-row${row.is_me?" me":""}">
          <span class="pg-board-rank">${medal}</span>
          <span class="pg-board-name">${escapeHtml(row.display_name||"Học viên")}${row.is_me?" · Bạn":""}</span>
          <span class="pg-board-score">${Number(row.total_score)||0}<small>đ</small></span>
          <span class="pg-board-meta">${Number(row.submitted_lessons)||0} bài · TB ${Number(row.avg_score)||0}/100</span>
        </li>`;
      }).join(""):'<li class="pg-board-empty">Chưa có thành tích công khai ở cấp độ này.</li>';
    }catch(e){
      list.innerHTML='<li class="pg-board-empty">BXH chưa tải được.</li>';
    }
  }

  function bind(){
    renderTopicTabs();

    qa("[data-pg-difficulty]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        currentDifficulty=btn.dataset.pgDifficulty;
        qa("[data-pg-difficulty]").forEach(x=>x.classList.toggle("active",x===btn));
        renderLessons();
      });
    });

    qa("[data-rank-difficulty]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        currentRankDifficulty=btn.dataset.rankDifficulty;
        qa("[data-rank-difficulty]").forEach(x=>x.classList.toggle("active",x===btn));
        loadLeaderboard();
      });
    });

    $("pgSubmitConfirm")?.addEventListener("click",submitOfficial);
    $("pgSubmitCancel")?.addEventListener("click",closeSubmitModal);
    $("pgSubmitClose")?.addEventListener("click",closeSubmitModal);
    qa("[data-pg-submit-close]").forEach(el=>el.addEventListener("click",closeSubmitModal));

    $("pgPublishYes")?.addEventListener("click",()=>setVisibility(true));
    $("pgPublishPrivate")?.addEventListener("click",()=>setVisibility(false));
    $("pgPublishClose")?.addEventListener("click",closePublishModal);
    qa("[data-pg-publish-close]").forEach(el=>el.addEventListener("click",closePublishModal));

    $("pgBoardRefresh")?.addEventListener("click",loadLeaderboard);

    document.addEventListener("keydown",e=>{
      if(e.key==="Escape"){
        if(!$("pgSubmitModal")?.hidden)closeSubmitModal();
        if(!$("pgPublishModal")?.hidden)closePublishModal();
      }
    });

    renderLessons();
    loadSubmissionStates();
    loadLeaderboard();
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true});
  else bind();
})();
