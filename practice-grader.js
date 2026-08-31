(() => {
"use strict";

const $=id=>document.getElementById(id);
const qa=s=>Array.from(document.querySelectorAll(s));
const DIFF_LABEL={basic:"🌱 Cơ bản",intermediate:"📘 Trung cấp",advanced:"🏆 Nâng cao"};
const TOPICS=[["all","Tất cả"],["clean","🧹 Làm sạch"],["pq","⚙️ Power Query"],["input","⌨️ Nhập liệu"],["formula","🧮 Công thức"],["format","🎨 Định dạng"]];

let currentTopic="all",currentDifficulty="all",currentRankDifficulty="basic";
let pendingLesson=null,pendingFile=null,pendingAppealLesson=null,xlsxPromise=null;
let isAdminTester=false;
const submissionCache=new Map();

const lessons=()=>Array.isArray(window.AVP_PRACTICE_LESSONS)?window.AVP_PRACTICE_LESSONS:[];

async function getClient(){
  if(window.avpSupabase)return window.avpSupabase;
  for(let i=0;i<35;i++){
    if(window.avpSupabase)return window.avpSupabase;
    await new Promise(r=>setTimeout(r,100));
  }
  return null;
}

async function detectAdminTester(sb){
  try{
    const {data,error}=await sb.rpc("is_admin_user");
    if(error)return false;
    return data===true || data==="true";
  }catch(e){
    return false;
  }
}
async function requireLogin(){
  if(window.AVPAccess)return await window.AVPAccess.requireLogin({next:"practice-video.html#grader",reason:"Đăng nhập để làm bài chấm điểm."});
  const sb=await getClient();
  try{const {data,error}=await sb.auth.getUser();if(!error&&data?.user)return data.user}catch(e){}
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
function esc(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function centerTab(btn){
  try{btn?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})}catch(e){}
}
function resetLessonScroll(){
  const box=$("pgLessonScroll");
  if(box)box.scrollTo({top:0,behavior:"smooth"});
}

const norm=v=>v===null||v===undefined?"":(typeof v==="string"?v.trim():v);
const rowBlank=row=>(row||[]).every(v=>String(norm(v))==="");
const col=(rows,i)=>rows.map(r=>r?.[i]);
const isFormulaCell=c=>!!(c&&typeof c.f==="string"&&c.f.trim());
const hasFn=(f,fn)=>new RegExp(`(^|[^A-Z0-9_])${fn}\\s*\\(`,"i").test(String(f||""));
const cleanSpace=s=>String(s??"").trim().replace(/\s+/g," ");
const proper=s=>cleanSpace(s).toLocaleLowerCase("vi-VN").replace(/(^|[\s-])\p{L}/gu,m=>m.toLocaleUpperCase("vi-VN"));

function renderTopicTabs(){
  const root=$("pgTopicTabs");if(!root)return;
  root.innerHTML=TOPICS.map(([id,label])=>`<button type="button" class="pg-topic${id===currentTopic?" active":""}" data-topic="${id}">${label}</button>`).join("");
  root.querySelectorAll("[data-topic]").forEach(b=>b.onclick=()=>{currentTopic=b.dataset.topic;renderTopicTabs();renderLessons();resetLessonScroll();setTimeout(()=>centerTab(document.querySelector(`[data-topic="${currentTopic}"]`)),30)});
}
function filteredLessons(){
  return lessons().slice()
    .sort((a,b)=>(a.topic||"").localeCompare(b.topic||"")||(a.order||0)-(b.order||0))
    .filter(l=>currentTopic==="all"||l.topic===currentTopic)
    .filter(l=>currentDifficulty==="all"||l.difficulty===currentDifficulty);
}
function card(l){
  const st=submissionCache.get(l.key),submitted=!!st?.submitted,locked=submitted&&!isAdminTester,active=!!l.isActive;
  const num=String(Number(l.order)||1).padStart(2,"0");
  const appealStatus=st?.appeal_status||"";
  const status=submitted&&isAdminTester
    ? `<span class="pg-card-status done">🛠 ADMIN TEST</span>`
    : locked
    ? `<span class="pg-card-status done">✓ ĐÃ NỘP</span>`
    : active
      ? `<span class="pg-card-status open">● ĐANG MỞ</span>`
      : `<span class="pg-card-status soon">SẮP MỞ</span>`;

  const score=submitted
    ? `<div class="pg-card-score"><small>${isAdminTester?"Điểm test gần nhất":"Điểm hiện tại"}</small><strong>${Number(st.score)||0}<span>/${l.maxScore||100}</span></strong></div>`
    : "";

  const rules=(l.rules||[]).slice(0,4).map(x=>`<span>${esc(x)}</span>`).join("");

  let actions="";
  if(active&&!locked){
    actions=`<div class="pg-card-actions">
      <button class="pg-card-btn download" type="button" data-download="${esc(l.key)}">⬇️ Tải file</button><button class="pg-card-btn review" type="button" data-guide-open="${esc(l.key)}">📖 Hướng dẫn</button>
      <label class="pg-card-btn submit pg-file-submit">
        <span>${isAdminTester&&submitted?"🛠 Nộp test lại":"📤 Nộp bài"}</span>
        <input type="file" class="pg-file-input" accept=".xlsx,.xls" data-submit="${esc(l.key)}" aria-label="Nộp file Excel">
      </label>
    </div>`;
  }else if(active&&locked){
    const appealCopy=appealStatus==="pending"?"⏳ Đang chờ Admin":appealStatus==="approved"?"✓ Đã chấm lại":appealStatus==="rejected"?"✓ Đã phản hồi":"⚑ Báo chấm sai";
    actions=`<div class="pg-card-actions">
      <button class="pg-card-btn download" type="button" data-download="${esc(l.key)}">⬇️ Tải lại file</button>
      <button class="pg-card-btn review" type="button" data-review="${esc(l.key)}">🤖 Xem đánh giá</button>
      <button class="pg-card-btn visibility ${st?.is_public?"public":"private"}" type="button" data-visibility="${esc(l.key)}">
        ${st?.is_public?"🏆 Đang lên BXH":"🔒 Chưa lên BXH"}
      </button>
      <button class="pg-card-btn appeal${appealStatus?" has-status":""}" type="button" data-appeal="${esc(l.key)}" ${appealStatus?"disabled":""}>
        ${appealCopy}
      </button>
    </div>`;
  }else{
    actions=`<div class="pg-card-soon-note">Bài này chưa mở để nộp.</div>`;
  }

  return `<article class="pg-card pg-card-v9 ${locked?"is-done":active?"is-open":"is-soon"}" data-lesson-card="${esc(l.key)}">
    <div class="pg-card-topline">
      <div class="pg-card-index">#${num}</div>
      <div class="pg-card-badges">
        <span class="pg-difficulty ${esc(l.difficulty)}">${DIFF_LABEL[l.difficulty]||l.difficulty}</span>
        ${status}
      </div>
    </div>
    <div class="pg-card-main">
      <div class="pg-card-copy">
        <span class="pg-card-topic">${esc(l.topicLabel||"Bài tập")}</span>
        <h3>${esc(l.title)}</h3>
        <p>${esc(l.description||"")}</p>
      </div>
      ${score}
    </div>
    ${rules?`<div class="pg-card-rules">${rules}</div>`:""}
    ${actions}
    <div class="pg-card-foot">
      <span>${locked
        ? (appealStatus==="pending"?"Yêu cầu chấm lại đang chờ Admin xử lý":appealStatus==="approved"?"Admin đã duyệt và chấm lại":appealStatus==="rejected"?"Admin đã kiểm tra và giữ nguyên điểm":"Bài đã khóa · Có thể báo chấm sai nếu cần")
        : active?"Tải nhiều lần · Nộp chính thức 1 lần":"Đang chuẩn bị rule chấm"}</span>
    </div>
  </article>`;
}
function renderLessons(){
  const grid=$("pgLessonGrid");if(!grid)return;
  const list=filteredLessons();
  grid.innerHTML=list.length?list.map(card).join(""):`<article class="pg-card pg-coming"><h3>Không có bài phù hợp</h3></article>`;
  const active=lessons().filter(x=>x.isActive).length;
  const submitted=[...submissionCache.values()].filter(x=>x?.submitted).length;
  if($("pgEngineSummary"))$("pgEngineSummary").textContent=`${active}/${lessons().length} bài đang mở · ${submitted} bài đã nộp`;

  grid.querySelectorAll("[data-download]").forEach(b=>b.onclick=()=>{const l=lessons().find(x=>x.key===b.dataset.download);if(l)downloadLesson(l)});
  grid.querySelectorAll("[data-submit]").forEach(i=>{
    i.onchange=e=>{
      const f=e.target.files?.[0];
      const lessonKey=i.dataset.submit;
      const l=lessons().find(x=>x.key===lessonKey);
      if(l&&f)onFilePicked(l,f);
      e.target.value="";
    };
  });
  grid.querySelectorAll(".pg-file-submit").forEach(label=>{
    label.addEventListener("keydown",e=>{
      if((e.key==="Enter"||e.key===" ")&&!e.target.matches("input")){
        e.preventDefault();
        label.querySelector('input[type="file"]')?.click();
      }
    });
    label.setAttribute("tabindex","0");
    label.setAttribute("role","button");
  });
  grid.querySelectorAll("[data-review]").forEach(b=>b.onclick=()=>{const l=lessons().find(x=>x.key===b.dataset.review);if(l)showStoredReview(l)});
  grid.querySelectorAll("[data-guide-open]").forEach(b=>b.onclick=()=>window.AVPPracticeGuides?.open(b.dataset.guideOpen));
  grid.querySelectorAll("[data-visibility]").forEach(b=>b.onclick=()=>{const l=lessons().find(x=>x.key===b.dataset.visibility);if(l)toggleResultVisibility(l)});
  grid.querySelectorAll("[data-appeal]").forEach(b=>b.onclick=()=>{const l=lessons().find(x=>x.key===b.dataset.appeal);if(l)openAppeal(l)});
}
async function loadSubmissionStates(){
  const u=await requireLogin();if(!u)return;
  const sb=await getClient();if(!sb?.rpc)return;

  isAdminTester=await detectAdminTester(sb);
  submissionCache.clear();

  try{
    const bulk=await sb.rpc("practice_grader_my_submissions_v18");
    if(!bulk.error){
      const rows=Array.isArray(bulk.data)?bulk.data:[];
      const byKey=new Map(rows.map(r=>[String(r.lesson_key||""),r]));
      lessons().forEach(l=>{
        const row=byKey.get(String(l.key));
        submissionCache.set(l.key,row?{
          submitted:true,
          score:Number(row.score)||0,
          passed:!!row.passed,
          difficulty:l.difficulty,
          is_public:!!row.is_public,
          grading_details:row.grading_details||{},
          manual_reviewed:!!row.manual_reviewed,
          appeal_id:row.appeal_id||null,
          appeal_status:row.appeal_status||null,
          appeal_response:row.appeal_response||null,
          submitted_at:row.submitted_at||null
        }:{submitted:false,difficulty:l.difficulty});
      });
      renderLessons();
      renderProgress();
      return;
    }
  }catch(e){
    console.warn("[grader] bulk state fallback",e);
  }

  // Tương thích backend cũ.
  await Promise.all(lessons().map(async l=>{
    try{
      let res=await sb.rpc("practice_grader_my_submission_v12",{p_lesson_key:l.key});
      if(res.error)res=await sb.rpc("practice_grader_my_submission",{p_lesson_key:l.key});
      if(res.error)throw res.error;
      const row=Array.isArray(res.data)?(res.data[0]||{submitted:false}):(res.data||{submitted:false});
      submissionCache.set(l.key,row);
    }catch(e){
      submissionCache.set(l.key,{submitted:false,difficulty:l.difficulty});
    }
  }));

  renderLessons();
  renderProgress();
}


function renderProgress(){
  const all=lessons().filter(l=>l.isActive);
  const states=all.map(l=>({lesson:l,state:submissionCache.get(l.key)}));
  const done=states.filter(x=>x.state?.submitted);
  const total=all.length;
  const percent=total?Math.round(done.length/total*100):0;
  const avg=done.length?Math.round(done.reduce((s,x)=>s+(Number(x.state.score)||0),0)/done.length):0;

  const countLevel=level=>{
    const ls=all.filter(l=>l.difficulty===level);
    const d=ls.filter(l=>submissionCache.get(l.key)?.submitted).length;
    return `${d}/${ls.length}`;
  };

  if($("pgProgressPercent"))$("pgProgressPercent").textContent=`${percent}%`;
  if($("pgProgressBar"))$("pgProgressBar").style.width=`${percent}%`;
  if($("pgProgressDone"))$("pgProgressDone").textContent=`${done.length}/${total}`;
  if($("pgProgressAvg"))$("pgProgressAvg").textContent=String(avg);
  if($("pgProgressBasic"))$("pgProgressBasic").textContent=countLevel("basic");
  if($("pgProgressIntermediate"))$("pgProgressIntermediate").textContent=countLevel("intermediate");
  if($("pgProgressAdvanced"))$("pgProgressAdvanced").textContent=countLevel("advanced");
}

/* -------------------- Workbook generators -------------------- */
function addGuide(XLSX,wb,title,lines){
  const ws=XLSX.utils.aoa_to_sheet([[title],...lines.map(x=>[x])]);
  ws["!cols"]=[{wch:70}];
  XLSX.utils.book_append_sheet(wb,ws,"HuongDan");
}
function appendData(XLSX,wb,rows,widths){
  const ws=XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"]=(widths||[]).map(w=>({wch:w}));
  XLSX.utils.book_append_sheet(wb,ws,"DuLieu");
}
function addLessonIdentity(XLSX,wb,l){
  const meta=XLSX.utils.aoa_to_sheet([
    ["AVP_PRACTICE_FILE","1"],
    ["lesson_key",String(l.key||"")],
    ["grader",String(l.grader||"")],
    ["version","20260830-v17"]
  ]);
  XLSX.utils.book_append_sheet(wb,meta,"_AVP_META");

  // Ẩn sheet metadata. Người học không cần thao tác vào đây.
  wb.Workbook=wb.Workbook||{};
  wb.Workbook.Sheets=wb.Workbook.Sheets||[];
  const idx=wb.SheetNames.indexOf("_AVP_META");
  if(idx>=0){
    while(wb.Workbook.Sheets.length<wb.SheetNames.length){
      wb.Workbook.Sheets.push({});
    }
    wb.Workbook.Sheets[idx]={
      ...(wb.Workbook.Sheets[idx]||{}),
      name:"_AVP_META",
      Hidden:2
    };
  }
}
function readLessonIdentity(XLSX,wb){
  const ws=wb?.Sheets?.["_AVP_META"];
  if(!ws)return null;
  const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:"",raw:true});
  const map={};
  rows.forEach(r=>{
    const k=String(r?.[0]??"").trim();
    if(k)map[k]=String(r?.[1]??"").trim();
  });
  return map;
}


function rangeAddresses(XLSX,range){
  if(!range)return [];
  const r=XLSX.utils.decode_range(range);
  const out=[];
  for(let rr=r.s.r;rr<=r.e.r;rr++){
    for(let cc=r.s.c;cc<=r.e.c;cc++){
      out.push(XLSX.utils.encode_cell({r:rr,c:cc}));
    }
  }
  return out;
}
function tableSame(actual,expected,strict=false){
  const a=(actual||[]).filter(r=>!rowBlank(r));
  const e=(expected||[]).filter(r=>!rowBlank(r));
  if(a.length!==e.length)return false;
  const width=Math.max(0,...e.map(r=>r.length));
  for(let i=0;i<e.length;i++){
    for(let j=0;j<width;j++){
      const av=a[i]?.[j]??"";
      const ev=e[i]?.[j]??"";
      if(strict){
        if(typeof ev==="number"){
          if(typeof av!=="number"||Number(av)!==Number(ev))return false;
        }else if(String(av)!==String(ev))return false;
      }else{
        if(String(norm(av))!==String(norm(ev)))return false;
      }
    }
  }
  return true;
}
function buildFormulaRows(l){
  const funcs=l?.spec?.functions||[];
  const f=funcs.join("|").toUpperCase();

  if(/XLOOKUP|VLOOKUP|INDEX/.test(f)){
    return [
      ["Mã SP","Số lượng","Kết quả","","","Mã SP DM","Giá trị"],
      ["SP01",2,"","","","SP01",120000],
      ["SP02",5,"","","","SP02",85000],
      ["SP03",3,"","","","SP03",210000],
      ["SP04",8,"","","","SP04",45000],
      ["SP05",4,"","","","SP05",160000]
    ];
  }
  if(/SUMIF|COUNTIF/.test(f)){
    return [
      ["Nhóm","Số lượng","","","Kết quả"],
      ["A",5,"","",""],
      ["B",8,"","",""],
      ["A",7,"","",""],
      ["C",4,"","",""],
      ["B",6,"","",""],
      ["A",3,"","",""],
      ["C",9,"","",""],
      ["","","","Nhóm",""],
      ["","","","A",""],
      ["","","","B",""],
      ["","","","C",""]
    ];
  }
  if(/TODAY|DATE/.test(f)){
    return [
      ["Năm","Tháng","Ngày","Kết quả"],
      [2026,8,1,""],
      [2026,8,2,""],
      [2026,8,3,""],
      [2026,8,4,""],
      [2026,8,5,""]
    ];
  }
  if(/LEFT|RIGHT|MID|TEXTJOIN/.test(f)){
    return [
      ["Mã","Tên","Bộ phận","Kết quả"],
      ["NV-QC-001","An","QC",""],
      ["NV-PE-002","Bình","PE",""],
      ["NV-QC-003","Chi","QC",""],
      ["NV-MFG-004","Dũng","MFG",""],
      ["NV-PE-005","Em","PE",""]
    ];
  }
  return [
    ["Mã","Giá trị 1","Giá trị 2","Kết quả","Nhóm"],
    ["A",82,10,"","X"],
    ["B",65,20,"","Y"],
    ["C",91,30,"","X"],
    ["D",74,40,"","Y"],
    ["E",58,50,"","X"],
    ["F",88,60,"","Y"],
    ["G",70,70,"","X"],
    ["H",95,80,"","Y"],
    ["I",61,90,"","X"]
  ];
}
async function buildSpecWorkbook(l){
  const XLSX=await loadXLSX();
  const wb=XLSX.utils.book_new();
  const spec=l.spec||{};
  const guide=[
    `Bài: ${l.title}`,
    l.description||"",
    "Chỉ chỉnh sửa theo yêu cầu của bài. Không đổi tên sheet DuLieu.",
    "Mỗi tài khoản chỉ được nộp chính thức 1 lần."
  ];

  if(spec.kind==="table"){
    if(l.topic==="pq"){
      const source=XLSX.utils.aoa_to_sheet(spec.input||spec.expected||[]);
      XLSX.utils.book_append_sheet(wb,source,"Nguon1");

      const reference=XLSX.utils.aoa_to_sheet(spec.expected||[]);
      XLSX.utils.book_append_sheet(wb,reference,"Nguon2");

      const header=(spec.expected?.[0]||[]);
      const out=XLSX.utils.aoa_to_sheet([header]);
      XLSX.utils.book_append_sheet(wb,out,"DuLieu");
      guide.push("Dùng Power Query xử lý dữ liệu nguồn và đưa kết quả cuối vào sheet DuLieu.");
    }else{
      const ws=XLSX.utils.aoa_to_sheet(spec.input||[]);
      XLSX.utils.book_append_sheet(wb,ws,"DuLieu");

      if(l.topic==="input"){
        const source=XLSX.utils.aoa_to_sheet(spec.expected||[]);
        XLSX.utils.book_append_sheet(wb,source,"Nguon");
        guide.push("Nhập dữ liệu vào DuLieu dựa trên sheet Nguon.");
      }
    }
  }else if(spec.kind==="formula"){
    const rows=buildFormulaRows(l);
    const ws=XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb,ws,"DuLieu");
    guide.push(`Hoàn thành vùng ${spec.targetRange||"Kết quả"} bằng công thức Excel.`);
    if((spec.functions||[]).length)guide.push(`Bài yêu cầu sử dụng: ${(spec.functions||[]).join(" + ")}.`);
    guide.push("Không nhập tay kết quả thay cho công thức.");
  }else if(spec.kind==="format"){
    const ws=XLSX.utils.aoa_to_sheet(spec.input||[]);
    XLSX.utils.book_append_sheet(wb,ws,"DuLieu");
    guide.push(`Chỉ định dạng vùng ${spec.range||"B2:B6"}; không thay đổi giá trị.`);
    guide.push("Định dạng phải đúng yêu cầu hiển thị của bài.");
  }else{
    const ws=XLSX.utils.aoa_to_sheet([["Chưa có dữ liệu"]]);
    XLSX.utils.book_append_sheet(wb,ws,"DuLieu");
  }

  addGuide(XLSX,wb,`BÀI THỰC HÀNH: ${l.title}`,guide);
  addLessonIdentity(XLSX,wb,l);
  return {XLSX,wb};
}

function gradeSpecV18(XLSX,wb,l){
  const spec=l.spec||{};
  const {ws,rows}=sheetMatrix(XLSX,wb);

  if(spec.kind==="table"){
    const expected=spec.expected||[];
    const headerOK=headersEq(rows[0]||[],expected[0]||[]);
    const dataOK=tableSame(rows,expected,spec.compare==="strict");
    const rowCountOK=(rows||[]).filter(r=>!rowBlank(r)).length===(expected||[]).filter(r=>!rowBlank(r)).length;
    return enrichResult(makeChecks([
      {label:"Đúng sheet DuLieu",points:20,ok:!!ws},
      {label:"Đúng cấu trúc tiêu đề",points:20,ok:headerOK},
      {label:"Đúng số bản ghi",points:20,ok:rowCountOK},
      {label:l.topic==="pq"?"Kết quả Power Query đúng":"Dữ liệu kết quả đúng",points:40,ok:dataOK}
    ]));
  }

  if(spec.kind==="formula"){
    const addresses=rangeAddresses(XLSX,spec.targetRange);
    const formulaCells=addresses.map(a=>cell(ws,a));
    const hasAll=addresses.length>0&&formulaCells.every(isFormulaCell);
    const functions=spec.functions||[];
    const usesFns=hasAll&&functions.every(fn=>formulaCells.some(c=>hasFn(c?.f,fn)));
    const coverage=addresses.length>0&&formulaCells.filter(isFormulaCell).length===addresses.length;

    return enrichResult(makeChecks([
      {label:"Đúng sheet DuLieu",points:20,ok:!!ws},
      {label:"Có công thức thật",points:30,ok:hasAll},
      {label:`Dùng đúng hàm ${functions.join(" + ")}`,points:30,ok:usesFns},
      {label:"Công thức phủ đủ vùng yêu cầu",points:20,ok:coverage}
    ]));
  }

  if(spec.kind==="format"){
    const addresses=rangeAddresses(XLSX,spec.range);
    const cells=addresses.map(a=>cell(ws,a));
    const input=spec.input||[];
    const expectedValues=input.slice(1).map(r=>r[1]);
    const valuesOK=cells.length===expectedValues.length&&cells.every((c,i)=>Number(c?.v)===Number(expectedValues[i]));
    const wanted=String(spec.numFmt||"").replace(/\s+/g,"").toLowerCase();
    const formatOK=cells.length>0&&cells.every(c=>{
      const z=String(c?.z||"").replace(/\s+/g,"").toLowerCase();
      return z===wanted;
    });

    return enrichResult(makeChecks([
      {label:"Đúng sheet DuLieu",points:20,ok:!!ws},
      {label:"Giá trị không đổi",points:20,ok:valuesOK},
      {label:"Đúng định dạng yêu cầu",points:60,ok:formatOK}
    ]));
  }

  return enrichResult(makeChecks([
    {label:"Rule chấm đã sẵn sàng",points:100,ok:false}
  ]));
}

async function buildWorkbook(l){
  if(l?.grader==="spec_v18")return await buildSpecWorkbook(l);
  const XLSX=await loadXLSX(),wb=XLSX.utils.book_new();
  const base=[["Mã NV","Họ tên","Bộ phận","Số lượng"],
    ["NV001","Nguyễn An","QC",12],["NV002","Trần Bình","PE",18],["NV003","Lê Chi","QC",15],["NV004","Phạm Dũng","MFG",22],
    ["NV005","Hoàng Em","PE",16],["NV006","Vũ Giang","QC",19],["NV007","Đỗ Hạnh","MFG",14],["NV008","Bùi Khánh","QC",21]];
  let rows=base,guide=["Mỗi tài khoản chỉ được nộp chính thức 1 lần."];

  switch(l.grader){
    case "clean_blank_rows_v1":
      rows=[base[0],base[1],["","","",""],base[2],base[3],["","","",""],base[4],base[5],["","","",""],base[6],base[7],["","","",""],base[8]];
      guide.push("Xóa toàn bộ dòng trống. Không sửa dữ liệu.");
      break;
    case "clean_duplicates_v1":
      rows=[...base,base[3],base[5],base[3]];
      guide.push("Xóa toàn bộ dòng bị trùng hoàn toàn. Kết quả cuối giữ đúng 8 nhân viên.");
      break;
    case "clean_trim_v1":
      rows=[base[0],...base.slice(1).map((r,i)=>[r[0],i%2?`  ${r[1]} `:`${r[1]}   `,i%3?` ${r[2]} `:`  ${r[2]}  `,r[3]])];
      guide.push("Xóa khoảng trắng đầu/cuối và khoảng trắng thừa trong Họ tên, Bộ phận.");
      break;
    case "clean_case_v1":
      rows=[base[0],...base.slice(1).map((r,i)=>[r[0],i%2?r[1].toUpperCase():r[1].toLowerCase(),i%2?r[2].toLowerCase():r[2],r[3]])];
      guide.push("Họ tên về Proper Case. Bộ phận về chữ IN HOA.");
      break;
    case "clean_text_number_v1":
      rows=[base[0],...base.slice(1).map(r=>[r[0],r[1],r[2],String(r[3])])];
      guide.push("Chuyển toàn bộ Số lượng từ text thành Number, giữ nguyên giá trị.");
      break;
    case "clean_fill_blank_v1":
      rows=[base[0],...base.slice(1).map((r,i)=>[r[0],r[1],[1,4,6].includes(i)?"":r[2],r[3]])];
      guide.push("Điền Bộ phận còn thiếu theo dữ liệu chuẩn: NV002=PE, NV005=PE, NV007=MFG.");
      break;
    case "clean_special_v1":
      rows=[base[0],...base.slice(1).map((r,i)=>[`${i%3===0?"#":i%3===1?"@":""}${r[0]}${i%2?"!":""}`,r[1],r[2],r[3]])];
      guide.push("Mã NV cuối cùng phải đúng dạng NV001...NV008, không còn ký tự đặc biệt.");
      break;
    case "clean_phone_v1":
      rows=[["Mã NV","Họ tên","Số điện thoại"],
        ["NV001","Nguyễn An","912345678"],["NV002","Trần Bình","0912 345 679"],["NV003","Lê Chi","+84 913456780"],
        ["NV004","Phạm Dũng","0913-456-781"],["NV005","Hoàng Em","914456782"],["NV006","Vũ Giang","0914.456.783"],
        ["NV007","Đỗ Hạnh","+84915456784"],["NV008","Bùi Khánh","0915456785"]];
      guide.push("Chuẩn hóa thành chuỗi 10 chữ số, bắt đầu bằng 0.");
      break;
    case "clean_date_v1":
      rows=[["Mã NV","Họ tên","Ngày"],["NV001","Nguyễn An","01/08/2026"],["NV002","Trần Bình","02/08/2026"],["NV003","Lê Chi","03/08/2026"],["NV004","Phạm Dũng","04/08/2026"],["NV005","Hoàng Em","05/08/2026"],["NV006","Vũ Giang","06/08/2026"],["NV007","Đỗ Hạnh","07/08/2026"],["NV008","Bùi Khánh","08/08/2026"]];
      guide.push("Chuyển cột Ngày thành ngày Excel thật. Không để dạng text.");
      break;
    case "clean_mixed_v1":
      rows=[["Mã NV","Họ tên","Bộ phận","Số lượng"],
        ["NV001","  Nguyễn An ","qc","12"],["NV002","Trần Bình","PE",18],["","","",""],["NV003","Lê Chi   ","qc","15"],
        ["NV003","Lê Chi   ","qc","15"],["NV004"," phạm dũng","mfg","22"],["NV005","Hoàng Em","PE","16"],["NV006","Vũ Giang","QC","19"],
        ["NV007","Đỗ Hạnh","mfg","14"],["NV008","Bùi Khánh","QC","21"]];
      guide.push("Xóa dòng trống, xóa duplicate, làm sạch Họ tên, Bộ phận IN HOA, Số lượng là Number.");
      break;
    case "formula_if_v1":
      rows=[["Mã NV","Họ tên","Điểm","Kết quả"],["NV001","Nguyễn An",82,""],["NV002","Trần Bình",67,""],["NV003","Lê Chi",91,""],["NV004","Phạm Dũng",74,""],["NV005","Hoàng Em",59,""],["NV006","Vũ Giang",88,""]];
      guide.push('Dùng hàm IF: Điểm >= 70 => "Đạt", ngược lại => "Không đạt". Bắt buộc dùng công thức IF ở D2:D7.');
      break;
    case "formula_revenue_v1":
      rows=[["Mã SP","Số lượng","Đơn giá","Doanh thu"],["SP01",2,120000,""],["SP02",5,85000,""],["SP03",3,210000,""],["SP04",8,45000,""],["SP05",4,160000,""]];
      guide.push("Tính Doanh thu = Số lượng × Đơn giá ở D2:D6. Công thức tương đương được chấp nhận, nhập tay không được.");
      break;
    case "formula_sumif_v1":
      rows=[["Bộ phận","Số lượng"],["QC",12],["PE",18],["QC",15],["MFG",22],["PE",16],["QC",19],["MFG",14],["QC",21],[],["Bộ phận cần tính","Tổng"],["QC",""],["PE",""],["MFG",""]];
      guide.push("Dùng SUMIF tại B12:B14 để tính tổng Số lượng theo Bộ phận.");
      break;
    case "formula_xlookup_v1":
      rows=[["Mã SP","Số lượng","Đơn giá"],["SP01",2,""],["SP02",5,""],["SP03",3,""],["SP04",8,""],["SP05",4,""],[],["Danh mục","Đơn giá"],["SP01",120000],["SP02",85000],["SP03",210000],["SP04",45000],["SP05",160000]];
      guide.push("Dùng XLOOKUP tại C2:C6 để tra Đơn giá từ bảng Danh mục A9:B13.");
      break;
    case "format_number_v1":
      rows=[["Mã SP","Doanh thu"],["SP01",1250000],["SP02",985000],["SP03",2415000],["SP04",760000],["SP05",3100000]];
      guide.push("Giữ nguyên giá trị. Định dạng B2:B6 là Number có dấu phân cách hàng nghìn, 0 chữ số thập phân.");
      break;
    default:
      throw new Error("WORKBOOK_NOT_READY");
  }
  appendData(XLSX,wb,rows,[12,22,16,14]);
  addGuide(XLSX,wb,`BÀI THỰC HÀNH: ${l.title}`,guide);
  addLessonIdentity(XLSX,wb,l);
  return {XLSX,wb};
}
async function downloadLesson(l){
  const u=await requireLogin();if(!u||!l.isActive)return;
  try{const {XLSX,wb}=await buildWorkbook(l);XLSX.writeFile(wb,l.fileName||"AVP_Practice.xlsx")}
  catch(e){alert("Chưa tạo được file bài này: "+(e?.message||e))}
}

/* -------------------- Grading helpers -------------------- */
function sheetMatrix(XLSX,wb,name="DuLieu"){
  const ws=wb.Sheets[name];
  if(!ws)return {ws:null,rows:[]};
  return {ws,rows:XLSX.utils.sheet_to_json(ws,{header:1,defval:"",raw:true,blankrows:true})};
}
function cell(ws,addr){return ws?.[addr]||null}
function valueEq(a,b){return String(norm(a))===String(norm(b))}
function headersEq(row,headers){return headers.every((h,i)=>String(norm(row?.[i]))===h)}
function checkBase8(rows){
  const expected=[["NV001","Nguyễn An","QC",12],["NV002","Trần Bình","PE",18],["NV003","Lê Chi","QC",15],["NV004","Phạm Dũng","MFG",22],["NV005","Hoàng Em","PE",16],["NV006","Vũ Giang","QC",19],["NV007","Đỗ Hạnh","MFG",14],["NV008","Bùi Khánh","QC",21]];
  return rows.length===8&&expected.every((e,r)=>e.every((v,c)=>valueEq(rows[r]?.[c],v)));
}
function makeChecks(items){return {checks:items,score:items.reduce((s,x)=>s+(x.ok?x.points:0),0)}}


function feedbackCategory(label){
  const s=String(label||"").toLowerCase();
  if(s.includes("công thức")||s.includes("if")||s.includes("sumif")||s.includes("xlookup"))return "Công thức";
  if(s.includes("định dạng")||s.includes("format"))return "Định dạng";
  if(s.includes("sheet")||s.includes("tiêu đề")||s.includes("cấu trúc"))return "Cấu trúc";
  if(s.includes("kiểu")||s.includes("number")||s.includes("date"))return "Kiểu dữ liệu";
  return "Dữ liệu / kết quả";
}
function defaultFeedback(check){
  if(check.detail)return check.detail;
  if(check.ok)return "Đạt đúng yêu cầu.";
  const s=String(check.label||"").toLowerCase();
  if(s.includes("công thức thật"))return "Không phát hiện công thức Excel ở một hoặc nhiều ô bắt buộc. Nhập tay kết quả không được tính là công thức.";
  if(s.includes("dùng đúng"))return "Công thức có tồn tại nhưng hàm sử dụng không đúng hàm mà đề bài yêu cầu.";
  if(s.includes("định dạng"))return "Giá trị có thể đúng nhưng định dạng ô chưa khớp yêu cầu của bài.";
  if(s.includes("tiêu đề"))return "Tên cột hoặc vị trí tiêu đề đã bị thay đổi.";
  if(s.includes("sheet"))return "Thiếu sheet bắt buộc hoặc tên sheet đã bị đổi.";
  if(s.includes("kết quả đúng"))return "Có một hoặc nhiều ô cho kết quả khác đáp án chuẩn.";
  if(s.includes("duplicate"))return "Vẫn còn dữ liệu trùng hoặc đã xóa nhầm bản ghi cần giữ.";
  if(s.includes("dòng trống"))return "Vẫn còn dòng trống trong vùng dữ liệu.";
  return "Nội dung này chưa đạt rule chấm tự động của bài.";
}
function enrichResult(result){
  result.checks=(result.checks||[]).map(c=>({
    ...c,
    category:c.category||feedbackCategory(c.label),
    detail:defaultFeedback(c)
  }));
  return result;
}

const GRADERS={
  clean_blank_rows_v1(XLSX,wb){
    const {rows}=sheetMatrix(XLSX,wb),body=rows.slice(1),data=body.filter(r=>!rowBlank(r));
    return makeChecks([
      {label:"Đúng sheet DuLieu",points:20,ok:!!wb.Sheets.DuLieu},
      {label:"Giữ đúng tiêu đề",points:20,ok:headersEq(rows[0],["Mã NV","Họ tên","Bộ phận","Số lượng"])},
      {label:"Xóa hết dòng trống",points:30,ok:body.every(r=>!rowBlank(r))},
      {label:"Giữ đủ dữ liệu",points:30,ok:checkBase8(data)}
    ]);
  },
  clean_duplicates_v1(XLSX,wb){
    const {rows}=sheetMatrix(XLSX,wb),body=rows.slice(1).filter(r=>!rowBlank(r));
    const keys=body.map(r=>JSON.stringify(r.map(norm)));
    return makeChecks([
      {label:"Đúng sheet DuLieu",points:20,ok:!!wb.Sheets.DuLieu},
      {label:"Giữ đúng tiêu đề",points:20,ok:headersEq(rows[0],["Mã NV","Họ tên","Bộ phận","Số lượng"])},
      {label:"Không còn duplicate",points:30,ok:new Set(keys).size===keys.length},
      {label:"Đủ 8 bản ghi chuẩn",points:30,ok:checkBase8(body)}
    ]);
  },
  clean_trim_v1(XLSX,wb){
    const {rows}=sheetMatrix(XLSX,wb),body=rows.slice(1).filter(r=>!rowBlank(r));
    const names=["Nguyễn An","Trần Bình","Lê Chi","Phạm Dũng","Hoàng Em","Vũ Giang","Đỗ Hạnh","Bùi Khánh"];
    const dept=["QC","PE","QC","MFG","PE","QC","MFG","QC"];
    return makeChecks([
      {label:"Đúng sheet",points:20,ok:!!wb.Sheets.DuLieu},
      {label:"Đúng tiêu đề",points:20,ok:headersEq(rows[0],["Mã NV","Họ tên","Bộ phận","Số lượng"])},
      {label:"Họ tên sạch",points:30,ok:body.length===8&&body.every((r,i)=>r[1]===names[i])},
      {label:"Bộ phận sạch",points:30,ok:body.length===8&&body.every((r,i)=>r[2]===dept[i])}
    ]);
  },
  clean_case_v1(XLSX,wb){
    const {rows}=sheetMatrix(XLSX,wb),body=rows.slice(1).filter(r=>!rowBlank(r));
    const names=["Nguyễn An","Trần Bình","Lê Chi","Phạm Dũng","Hoàng Em","Vũ Giang","Đỗ Hạnh","Bùi Khánh"];
    const dept=["QC","PE","QC","MFG","PE","QC","MFG","QC"];
    return makeChecks([
      {label:"Đúng sheet",points:20,ok:!!wb.Sheets.DuLieu},
      {label:"Đúng tiêu đề",points:20,ok:headersEq(rows[0],["Mã NV","Họ tên","Bộ phận","Số lượng"])},
      {label:"Họ tên Proper Case",points:30,ok:body.length===8&&body.every((r,i)=>r[1]===names[i])},
      {label:"Bộ phận IN HOA",points:30,ok:body.length===8&&body.every((r,i)=>r[2]===dept[i])}
    ]);
  },
  clean_text_number_v1(XLSX,wb){
    const {rows}=sheetMatrix(XLSX,wb),body=rows.slice(1).filter(r=>!rowBlank(r));
    const vals=[12,18,15,22,16,19,14,21];
    return makeChecks([
      {label:"Đúng sheet",points:20,ok:!!wb.Sheets.DuLieu},
      {label:"Đúng tiêu đề",points:20,ok:headersEq(rows[0],["Mã NV","Họ tên","Bộ phận","Số lượng"])},
      {label:"Số lượng là Number",points:30,ok:body.length===8&&body.every(r=>typeof r[3]==="number")},
      {label:"Giá trị không đổi",points:30,ok:body.length===8&&body.every((r,i)=>Number(r[3])===vals[i])}
    ]);
  },
  clean_fill_blank_v1(XLSX,wb){
    const {rows}=sheetMatrix(XLSX,wb),body=rows.slice(1).filter(r=>!rowBlank(r)),dept=["QC","PE","QC","MFG","PE","QC","MFG","QC"];
    return makeChecks([
      {label:"Đúng sheet",points:20,ok:!!wb.Sheets.DuLieu},
      {label:"Đúng tiêu đề",points:20,ok:headersEq(rows[0],["Mã NV","Họ tên","Bộ phận","Số lượng"])},
      {label:"Hết ô trống",points:30,ok:body.length===8&&body.every(r=>String(norm(r[2]))!=="")},
      {label:"Giá trị điền đúng",points:30,ok:body.length===8&&body.every((r,i)=>r[2]===dept[i])}
    ]);
  },
  clean_special_v1(XLSX,wb){
    const {rows}=sheetMatrix(XLSX,wb),body=rows.slice(1).filter(r=>!rowBlank(r)),codes=Array.from({length:8},(_,i)=>`NV00${i+1}`);
    return makeChecks([
      {label:"Đúng sheet",points:20,ok:!!wb.Sheets.DuLieu},
      {label:"Đúng tiêu đề",points:20,ok:headersEq(rows[0],["Mã NV","Họ tên","Bộ phận","Số lượng"])},
      {label:"Hết ký tự lỗi",points:30,ok:body.length===8&&body.every(r=>/^NV\d{3}$/.test(String(r[0])))},
      {label:"Mã chuẩn chính xác",points:30,ok:body.length===8&&body.every((r,i)=>r[0]===codes[i])}
    ]);
  },
  clean_phone_v1(XLSX,wb){
    const {rows}=sheetMatrix(XLSX,wb),body=rows.slice(1).filter(r=>!rowBlank(r));
    const exp=["0912345678","0912345679","0913456780","0913456781","0914456782","0914456783","0915456784","0915456785"];
    return makeChecks([
      {label:"Đúng sheet",points:20,ok:!!wb.Sheets.DuLieu},
      {label:"Đúng tiêu đề",points:20,ok:headersEq(rows[0],["Mã NV","Họ tên","Số điện thoại"])},
      {label:"Đúng 10 chữ số",points:30,ok:body.length===8&&body.every(r=>/^0\d{9}$/.test(String(r[2])))},
      {label:"Số điện thoại chính xác",points:30,ok:body.length===8&&body.every((r,i)=>String(r[2])===exp[i])}
    ]);
  },
  clean_date_v1(XLSX,wb){
    const {ws,rows}=sheetMatrix(XLSX,wb),body=rows.slice(1).filter(r=>!rowBlank(r));
    const vals=Array.from({length:8},(_,i)=>new Date(Date.UTC(2026,7,i+1)));
    const isDateCell=i=>{const c=cell(ws,`C${i+2}`);return c&&(c.t==="d"||typeof c.v==="number")};
    const dateOK=(v,i)=>{
      if(v instanceof Date)return v.getUTCFullYear()===2026&&v.getUTCMonth()===7&&v.getUTCDate()===i+1;
      if(typeof v==="number"){const d=XLSX.SSF.parse_date_code(v);return d&&d.y===2026&&d.m===8&&d.d===i+1}
      return false;
    };
    return makeChecks([
      {label:"Đúng sheet",points:20,ok:!!ws},
      {label:"Đúng tiêu đề",points:20,ok:headersEq(rows[0],["Mã NV","Họ tên","Ngày"])},
      {label:"Kiểu ngày Excel hợp lệ",points:30,ok:body.length===8&&body.every((r,i)=>isDateCell(i))},
      {label:"Ngày không đổi",points:30,ok:body.length===8&&body.every((r,i)=>dateOK(r[2],i))}
    ]);
  },
  clean_mixed_v1(XLSX,wb){
    const {rows}=sheetMatrix(XLSX,wb),body=rows.slice(1),data=body.filter(r=>!rowBlank(r));
    const keys=data.map(r=>JSON.stringify(r.map(norm)));
    return makeChecks([
      {label:"Cấu trúc đúng",points:20,ok:headersEq(rows[0],["Mã NV","Họ tên","Bộ phận","Số lượng"])},
      {label:"Không dòng trống",points:20,ok:body.every(r=>!rowBlank(r))},
      {label:"Không duplicate",points:20,ok:new Set(keys).size===keys.length&&data.length===8},
      {label:"Text sạch",points:20,ok:data.length===8&&data.every(r=>cleanSpace(r[1])===r[1]&&String(r[2])===String(r[2]).toUpperCase())},
      {label:"Kiểu dữ liệu đúng",points:20,ok:data.length===8&&data.every(r=>typeof r[3]==="number")}
    ]);
  },
  formula_if_v1(XLSX,wb){
    const {ws,rows}=sheetMatrix(XLSX,wb),body=rows.slice(1).filter(r=>!rowBlank(r));
    const expected=["Đạt","Không đạt","Đạt","Đạt","Không đạt","Đạt"];
    const formulas=Array.from({length:6},(_,i)=>cell(ws,`D${i+2}`));
    const hasAll=formulas.every(isFormulaCell);
    const usesIF=formulas.every(c=>hasFn(c?.f,"IF"));
    const resultOK=body.length===6&&body.every((r,i)=>String(norm(r[3]))===expected[i]);
    return makeChecks([
      {label:"Đúng sheet/header",points:20,ok:!!ws&&headersEq(rows[0],["Mã NV","Họ tên","Điểm","Kết quả"])},
      {label:"Có công thức thật D2:D7",points:40,ok:hasAll},
      {label:"Dùng đúng hàm IF",points:20,ok:hasAll&&usesIF},
      {label:"Kết quả đúng",points:20,ok:resultOK}
    ]);
  },
  formula_revenue_v1(XLSX,wb){
    const {ws,rows}=sheetMatrix(XLSX,wb),body=rows.slice(1).filter(r=>!rowBlank(r));
    const exp=[240000,425000,630000,360000,640000];
    const formulas=Array.from({length:5},(_,i)=>cell(ws,`D${i+2}`));
    return makeChecks([
      {label:"Đúng sheet/header",points:20,ok:!!ws&&headersEq(rows[0],["Mã SP","Số lượng","Đơn giá","Doanh thu"])},
      {label:"Có công thức toàn bộ D2:D6",points:40,ok:formulas.every(isFormulaCell)},
      {label:"Kết quả đúng",points:40,ok:body.length===5&&body.every((r,i)=>Number(r[3])===exp[i])}
    ]);
  },
  formula_sumif_v1(XLSX,wb){
    const {ws,rows}=sheetMatrix(XLSX,wb);
    const formulas=["B12","B13","B14"].map(a=>cell(ws,a));
    const expected=[67,34,36];
    return makeChecks([
      {label:"Đúng cấu trúc bài",points:20,ok:!!ws&&String(norm(cell(ws,"A11")?.v))==="Bộ phận cần tính"},
      {label:"Có công thức thật B12:B14",points:40,ok:formulas.every(isFormulaCell)},
      {label:"Dùng đúng SUMIF",points:20,ok:formulas.every(c=>hasFn(c?.f,"SUMIF"))},
      {label:"Kết quả đúng",points:20,ok:["B12","B13","B14"].every((a,i)=>Number(cell(ws,a)?.v)===expected[i])}
    ]);
  },
  formula_xlookup_v1(XLSX,wb){
    const {ws}=sheetMatrix(XLSX,wb);
    const formulas=["C2","C3","C4","C5","C6"].map(a=>cell(ws,a));
    const expected=[120000,85000,210000,45000,160000];
    return makeChecks([
      {label:"Đúng cấu trúc bài",points:20,ok:!!ws&&String(norm(cell(ws,"A1")?.v))==="Mã SP"&&String(norm(cell(ws,"A8")?.v))==="Danh mục"},
      {label:"Có công thức thật C2:C6",points:40,ok:formulas.every(isFormulaCell)},
      {label:"Dùng đúng XLOOKUP",points:20,ok:formulas.every(c=>hasFn(c?.f,"XLOOKUP"))},
      {label:"Kết quả đúng",points:20,ok:["C2","C3","C4","C5","C6"].every((a,i)=>Number(cell(ws,a)?.v)===expected[i])}
    ]);
  },
  format_number_v1(XLSX,wb){
    const {ws,rows}=sheetMatrix(XLSX,wb);
    const exp=[1250000,985000,2415000,760000,3100000];
    const cells=["B2","B3","B4","B5","B6"].map(a=>cell(ws,a));
    const valuesOK=cells.every((c,i)=>Number(c?.v)===exp[i]);
    const fmtOK=cells.every(c=>{
      const z=String(c?.z||"");
      return z.includes("#,##0") || z.includes("#.##0") || /^[#0,.\s]+$/.test(z)&&z!=="General";
    });
    return makeChecks([
      {label:"Đúng cấu trúc bài",points:20,ok:!!ws&&headersEq(rows[0],["Mã SP","Doanh thu"]),detail:"Sheet DuLieu phải giữ nguyên 2 cột Mã SP và Doanh thu."},
      {label:"Giá trị không đổi",points:40,ok:valuesOK,detail:valuesOK?"Giá trị Doanh thu được giữ nguyên.":"Một hoặc nhiều giá trị Doanh thu đã bị thay đổi."},
      {label:"Đúng định dạng số",points:40,ok:fmtOK,detail:fmtOK?"B2:B6 đã có định dạng số hàng nghìn.":"B2:B6 chưa đồng nhất định dạng Number có dấu phân cách hàng nghìn và 0 chữ số thập phân."}
    ]);
  }
};

async function grade(l,file){
  if(!file||file.size<1000)throw new Error("FILE_INVALID");
  if(file.size>15*1024*1024)throw new Error("FILE_TOO_LARGE");

  const XLSX=await loadXLSX();
  const buf=await file.arrayBuffer();
  const wb=XLSX.read(buf,{
    type:"array",
    cellDates:true,
    cellFormula:true,
    cellNF:true,
    cellStyles:true
  });

  if(!wb?.SheetNames?.length)throw new Error("WORKBOOK_EMPTY");
  if(!wb.SheetNames.includes("DuLieu"))throw new Error("MISSING_DULIEU_SHEET");

  // Chống lấy file của bài khác nộp sang bài hiện tại.
  const identity=readLessonIdentity(XLSX,wb);
  if(!identity){
    throw new Error("WRONG_PRACTICE_FILE: File này không phải file gốc của bài đang nộp. Hãy tải lại file đúng từ chính card bài này.");
  }
  if(identity.AVP_PRACTICE_FILE!=="1"){
    throw new Error("WRONG_PRACTICE_FILE: Không nhận diện được file thực hành.");
  }
  if(identity.lesson_key!==String(l.key||"")){
    throw new Error(`WRONG_LESSON_FILE: Bạn đang nộp file của bài "${identity.lesson_key||"khác"}" vào bài "${l.key}". Hãy chọn đúng file.`);
  }
  if(identity.grader!==String(l.grader||"")){
    throw new Error("WRONG_GRADER_FILE: File không khớp rule chấm của bài hiện tại.");
  }

  let result;
  if(l.grader==="spec_v18"){
    result=gradeSpecV18(XLSX,wb,l);
  }else{
    const fn=GRADERS[l.grader];
    if(!fn)throw new Error("GRADER_NOT_READY");
    result=fn(XLSX,wb);
  }

  result.checks=result.checks||[];
  result.score=Math.max(0,Math.min(Number(result.score)||0,Number(l.maxScore)||100));
  result.grader=l.grader;
  result.version="v18-full100";
  return result;
}


async function uploadSubmissionFile(sb,user,l,file){
  const ext=(file.name.split(".").pop()||"xlsx").toLowerCase().replace(/[^a-z0-9]/g,"")||"xlsx";
  const path=`${user.id}/${l.key}/submission-${Date.now()}.${ext}`;
  const {error}=await sb.storage.from("practice-submissions").upload(path,file,{
    upsert:false,
    contentType:file.type||"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  if(error)throw error;
  return path;
}
async function removeSubmissionFile(sb,path){
  if(!path)return;
  try{await sb.storage.from("practice-submissions").remove([path])}catch(e){}
}

/* -------------------- Submission -------------------- */
async function onFilePicked(l,file){
  const u=await requireLogin();if(!u)return;
  if(submissionCache.get(l.key)?.submitted&&!isAdminTester){alert("Bài này đã nộp chính thức.");return}
  if(!/\.(xlsx|xls)$/i.test(file.name)){alert("Chỉ nhận .xlsx hoặc .xls.");return}
  pendingLesson=l;pendingFile=file;
  $("pgSubmitFileName").textContent=`${file.name} · ${l.title}${isAdminTester?" · ADMIN TEST":""}`;
  $("pgSubmitModal").hidden=false;document.body.classList.add("pg-publish-open");
}
function closeSubmit(){
  $("pgSubmitModal").hidden=true;document.body.classList.remove("pg-publish-open");
  pendingLesson=null;pendingFile=null;
}
async function submitOfficial(){
  const l=pendingLesson,f=pendingFile;
  if(!l||!f){
    closeSubmit();
    return;
  }

  const sb=await getClient();
  if(!sb?.rpc){
    closeSubmit();
    alert("Không kết nối được Supabase. Bạn có thể chọn bài khác và thử lại.");
    return;
  }

  const user=await requireLogin();
  if(!user){
    closeSubmit();
    return;
  }

  const btn=$("pgSubmitConfirm");
  if(btn){
    btn.disabled=true;
    btn.textContent="Đang chấm…";
  }

  let filePath=null;
  let stage="grade";

  try{
    // 1. Chấm file trên thiết bị.
    const result=await grade(l,f);

    // 2. Lưu bản gốc để Admin có thể xem nếu học viên khiếu nại.
    stage="upload";
    filePath=await uploadSubmissionFile(sb,user,l,f);

    // 3. Khóa lượt nộp trong DB.
    stage="save";
    const {data,error}=await sb.rpc("practice_grader_submit_once_v12",{
      p_lesson_key:l.key,
      p_score:result.score,
      p_file_path:filePath,
      p_grading_details:{
        score:result.score,
        grader:result.grader,
        version:result.version,
        checks:result.checks
      }
    });
    if(error)throw error;

    const state={
      submitted:true,
      score:result.score,
      passed:result.score>=70,
      difficulty:l.difficulty,
      is_public:false,
      grading_details:{
        score:result.score,
        grader:result.grader,
        version:result.version,
        checks:result.checks
      },
      appeal_status:null
    };

    submissionCache.set(l.key,state);

    // Luôn đóng modal trước khi dựng lại danh sách.
    closeSubmit();
    renderLessons();
    renderProgress();
    showResult(l,result);
    openPublish(l,result.score);
    await loadLeaderboard();

  }catch(e){
    // Nếu file đã upload nhưng DB chưa nhận bài, xóa file rác.
    if(filePath){
      await removeSubmissionFile(sb,filePath);
    }

    const msg=String(e?.message||e||"UNKNOWN_ERROR");

    // QUAN TRỌNG:
    // lỗi của một bài không được giữ modal/overlay và khóa các bài khác.
    closeSubmit();
    document.body.classList.remove("pg-publish-open");

    if(/ALREADY_SUBMITTED/i.test(msg)){
      alert("Bài này đã được nộp trước đó. Hệ thống sẽ tải lại trạng thái bài.");
      await loadSubmissionStates();
    }else{
      // Dựng lại card/input để người dùng có thể nộp bài khác ngay lập tức.
      renderLessons();

      let prefix="Không nộp được bài.";
      if(/WRONG_PRACTICE_FILE|WRONG_LESSON_FILE|WRONG_GRADER_FILE/i.test(msg)){
        prefix="Sai file bài tập.";
      }else if(stage==="grade"){
        prefix="Không chấm được file.";
      }else if(stage==="upload"){
        prefix="Không lưu được file bài nộp.";
      }else if(stage==="save"){
        prefix="File đã được chấm nhưng chưa lưu được kết quả.";
      }

      alert(prefix+" Bạn vẫn có thể nộp bài khác.\n\nChi tiết: "+msg);
    }

  }finally{
    const currentBtn=$("pgSubmitConfirm");
    if(currentBtn){
      currentBtn.disabled=false;
      currentBtn.textContent="Nộp chính thức";
    }

    // Safety reset tránh trạng thái kẹt sau lỗi mobile/Safari.
    if($("pgSubmitModal")?.hidden){
      pendingFile=null;
      if(!$("pgPublishModal") || $("pgPublishModal").hidden){
        document.body.classList.remove("pg-publish-open");
      }
    }
  }
}
function showResult(l,r){
  const panel=$("pgResult"),body=$("pgResultBody");if(!panel||!body)return;
  const checks=(r.checks||[]);
  $("pgResultTitle").textContent=`${l.title} · ${r.score}/${l.maxScore||100}`;
  body.innerHTML=`
    <div class="pg-score"><strong>${r.score}</strong><span>/${l.maxScore||100}</span></div>
    <div class="pg-auto-summary">${checks.filter(x=>x.ok).length}/${checks.length} tiêu chí đạt</div>
    <div class="pg-checks pg-checks-detailed">
      ${checks.map(x=>`
        <div class="pg-check ${x.ok?"ok":"bad"}">
          <div class="pg-check-title">
            <b>${x.ok?"✓":"×"} ${esc(x.label)} · ${x.points}đ</b>
            <span>${esc(x.category||feedbackCategory(x.label))}</span>
          </div>
          <small>${esc(x.detail||defaultFeedback(x))}</small>
        </div>`).join("")}
    </div>`;
  panel.hidden=false;
  panel.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function showStoredReview(l){
  const st=submissionCache.get(l.key);
  if(!st?.submitted)return;
  const details=st.grading_details||{};
  const checks=Array.isArray(details.checks)?details.checks:[];
  showResult(l,{score:Number(st.score)||0,checks});
}

function openPublish(l,score){
  pendingLesson=l;
  $("pgPublishScore").textContent=String(score);
  $("pgPublishText").textContent=`${l.title} · ${DIFF_LABEL[l.difficulty]||l.difficulty} · ${score}/${l.maxScore||100}`;
  $("pgPublishModal").hidden=false;document.body.classList.add("pg-publish-open");
}
function closePublish(){$("pgPublishModal").hidden=true;document.body.classList.remove("pg-publish-open")}

async function setResultVisibility(l,v){
  const sb=await getClient();if(!sb?.rpc||!l)return false;
  const {error}=await sb.rpc("practice_grader_set_result_visibility",{p_lesson_key:l.key,p_visible:!!v});
  if(error){alert("Không cập nhật được BXH: "+error.message);return false}
  const st=submissionCache.get(l.key)||{};
  st.is_public=!!v;submissionCache.set(l.key,st);
  renderLessons();await loadLeaderboard();
  return true;
}
async function setVisibility(v){
  const l=pendingLesson;
  if(!l)return;
  const ok=await setResultVisibility(l,v);
  if(ok)closePublish();
}
async function toggleResultVisibility(l){
  const st=submissionCache.get(l.key);
  if(!st?.submitted)return;
  await setResultVisibility(l,!st.is_public);
}

function openAppeal(l){
  const st=submissionCache.get(l.key);
  if(!st?.submitted)return;
  if(st.appeal_status){alert("Bài này đã có yêu cầu chấm lại hoặc đã được Admin xử lý.");return}
  pendingAppealLesson=l;
  $("pgAppealLesson").textContent=`${l.title} · Điểm hiện tại ${Number(st.score)||0}/${l.maxScore||100}`;
  $("pgAppealReason").value="";
  $("pgAppealKeepPublic").checked=!!st.is_public;
  $("pgAppealModal").hidden=false;
  document.body.classList.add("pg-publish-open");
}
function closeAppeal(){
  $("pgAppealModal").hidden=true;
  document.body.classList.remove("pg-publish-open");
  pendingAppealLesson=null;
}
async function sendAppeal(){
  const l=pendingAppealLesson;if(!l)return;
  const reason=String($("pgAppealReason")?.value||"").trim();
  if(reason.length<10){alert("Bạn hãy mô tả rõ lỗi chấm, tối thiểu 10 ký tự.");return}
  const btn=$("pgAppealSend");btn.disabled=true;btn.textContent="Đang gửi…";
  try{
    const keepPublic=!!$("pgAppealKeepPublic")?.checked;
    await setResultVisibility(l,keepPublic);
    const sb=await getClient();
    const {data,error}=await sb.rpc("practice_grader_create_appeal",{p_lesson_key:l.key,p_reason:reason});
    if(error)throw error;
    const st=submissionCache.get(l.key)||{};
    st.appeal_status="pending";st.appeal_id=data?.id||data?.appeal_id||null;st.is_public=keepPublic;
    submissionCache.set(l.key,st);
    closeAppeal();renderLessons();
    alert("Đã gửi yêu cầu chấm lại. Kết quả xử lý sẽ được gửi qua thông báo cá nhân trong Cộng đồng.");
  }catch(e){
    alert("Chưa gửi được yêu cầu: "+String(e?.message||e));
  }finally{btn.disabled=false;btn.textContent="Gửi yêu cầu"}
}

async function loadLeaderboard(){
  const list=$("pgBoardList");if(!list)return;
  const sb=await getClient();if(!sb?.rpc)return;
  list.innerHTML='<li class="pg-board-empty">Đang tải…</li>';
  try{
    const {data,error}=await sb.rpc("practice_grader_leaderboard_v4",{p_difficulty:currentRankDifficulty,p_limit:50});
    if(error)throw error;
    const rows=Array.isArray(data)?data:[];
    const starMap=await loadStarCounts(sb,rows);
    list.innerHTML=rows.length?rows.map((r,i)=>{
      const rank=Number(r.rank_no)||(i+1),medal=rank===1?"🥇":rank===2?"🥈":rank===3?"🥉":`${rank}.`;
      const uid=String(r.user_id||r.id||r.uid||"");
      const stars=Number(r.star_count||r.stars||starMap[uid]||0);
      const self=!!r.is_me;
      return `<li class="pg-board-row${self?" me":""}" data-user-id="${esc(uid)}" data-name="${esc(r.display_name||"Học viên")}">
        <span class="pg-board-rank">${medal}</span>
        <span class="pg-board-name">${esc(r.display_name||"Học viên")}${self?" · Bạn":""}</span>
        <span class="pg-board-score">${Number(r.total_score)||0}<small>đ</small></span>
        <button type="button" class="pg-star-btn" data-gift-star ${self?"disabled":""} title="${self?"Không tự tặng sao":"Tặng 1 sao"}">★ <b class="pg-star-count">${stars}</b></button>
        <span class="pg-board-meta">${Number(r.submitted_lessons)||0} bài · TB ${Number(r.avg_score)||0}/100</span>
      </li>`;
    }).join(""):'<li class="pg-board-empty">Chưa có thành tích công khai.</li>';
  }catch(e){list.innerHTML='<li class="pg-board-empty">BXH chưa tải được.</li>'}
}

function starStore(){
  try{return JSON.parse(localStorage.getItem("avp_pg_stars_v1")||"{}")}catch(e){return {counts:{},given:{}}}
}
function saveStarStore(s){
  localStorage.setItem("avp_pg_stars_v1",JSON.stringify(s));
}
function todayKey(){
  const d=new Date();
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}
async function loadStarCounts(sb,rows){
  const map={};
  if(!sb)return map;
  try{
    let rpc=await sb.rpc("practice_grader_star_counts");
    if(rpc.error)rpc=await sb.rpc("practice_grader_star_counts",{p_user_ids:null});
    if(!rpc.error && Array.isArray(rpc.data)){
      rpc.data.forEach(x=>{
        const id=String(x.user_id||x.id||"");
        if(id)map[id]=Number(x.star_count||x.stars||0);
      });
    }
  }catch(e){}
  try{
    const {data,error}=await sb.from("practice_grader_stars").select("to_user_id");
    if(!error && Array.isArray(data)){
      const c={};
      data.forEach(x=>{
        const id=String(x.to_user_id||"");
        if(id)c[id]=(c[id]||0)+1;
      });
      Object.assign(map,c);
    }
  }catch(e){}
  return map;
}
async function giftStar(btn){
  const row=btn.closest(".pg-board-row");
  if(!row)return;
  const toId=row.dataset.userId||"";
  const name=row.dataset.name||"học viên";
  if(row.classList.contains("me")||btn.disabled){
    alert("Không thể tự tặng sao cho mình.");
    return;
  }
  const user=await requireLogin();
  if(!user)return;
  const fromId=user.id||"";
  if(fromId&&toId&&fromId===toId){
    alert("Không thể tự tặng sao cho mình.");
    return;
  }
  const store=starStore();
  store.given=store.given||{};
  const stamp=todayKey()+"|"+(toId||name);
  if(store.given[fromId+"|"+stamp]){
    alert("Hôm nay bạn đã tặng sao cho "+name+" rồi.");
    return;
  }
  btn.disabled=true;
  const sb=await getClient();
  let saved=false;
  if(sb&&toId){
    try{
      const rpc=await sb.rpc("practice_grader_gift_star",{p_to_user_id:toId});
      if(!rpc.error)saved=true;
    }catch(e){}
    if(!saved){
      try{
        const ins=await sb.from("practice_grader_stars").insert({
          from_user_id:fromId,
          to_user_id:toId
        });
        if(!ins.error)saved=true;
      }catch(e){}
    }
    const fromName=user?.user_metadata?.full_name||user?.user_metadata?.name||"Một học viên";
    const title="Bạn vừa được tặng 1 sao";
    const content=fromName+" đã tặng bạn 1 sao trên bảng xếp hạng bài tập chấm điểm.";
    try{
      await sb.rpc("notification_personal_create",{p_user_id:toId,p_title:title,p_content:content,p_type:"practice_grader_star"});
    }catch(e){}
    try{
      await sb.rpc("admin_system_notification_create",{
        p_title:title,
        p_content:content,
        p_category:"practice_grader_star",
        p_target_type:"user",
        p_target_user_id:toId,
        p_starts_at:new Date().toISOString(),
        p_expires_at:null,
        p_is_pinned:false
      });
    }catch(e){}
  }
  store.given[fromId+"|"+stamp]=1;
  const key=toId||name;
  store.counts=store.counts||{};
  store.counts[key]=(Number(store.counts[key])||0)+1;
  saveStarStore(store);
  const countEl=btn.querySelector(".pg-star-count");
  if(countEl)countEl.textContent=String((Number(countEl.textContent)||0)+1);
  btn.classList.add("is-given");
  if(window.avpAlert)window.avpAlert("Đã tặng 1 sao cho "+name+".",{title:"Sao",icon:"⭐",tone:"ok"});
  else alert("Đã tặng 1 sao cho "+name+".");
}

function bind(){
  renderTopicTabs();
  qa("[data-pg-difficulty]").forEach(b=>b.onclick=()=>{currentDifficulty=b.dataset.pgDifficulty;qa("[data-pg-difficulty]").forEach(x=>x.classList.toggle("active",x===b));renderLessons();resetLessonScroll();centerTab(b)});
  qa("[data-rank-difficulty]").forEach(b=>b.onclick=()=>{currentRankDifficulty=b.dataset.rankDifficulty;qa("[data-rank-difficulty]").forEach(x=>x.classList.toggle("active",x===b));centerTab(b);const box=$("pgBoardScroll");if(box)box.scrollTo({top:0,behavior:"smooth"});loadLeaderboard()});
  $("pgSubmitConfirm")?.addEventListener("click",submitOfficial);
  $("pgSubmitCancel")?.addEventListener("click",closeSubmit);
  $("pgSubmitClose")?.addEventListener("click",closeSubmit);
  qa("[data-pg-submit-close]").forEach(x=>x.onclick=closeSubmit);
  $("pgPublishYes")?.addEventListener("click",()=>setVisibility(true));
  $("pgPublishPrivate")?.addEventListener("click",()=>setVisibility(false));
  $("pgPublishClose")?.addEventListener("click",closePublish);
  qa("[data-pg-publish-close]").forEach(x=>x.onclick=closePublish);
  $("pgBoardRefresh")?.addEventListener("click",loadLeaderboard);
  $("pgBoardList")?.addEventListener("click",e=>{
    const btn=e.target.closest("[data-gift-star]");
    if(btn)giftStar(btn);
  });
  $("pgResultClose")?.addEventListener("click",()=>{$("pgResult").hidden=true});
  $("pgAppealSend")?.addEventListener("click",sendAppeal);
  $("pgAppealCancel")?.addEventListener("click",closeAppeal);
  $("pgAppealClose")?.addEventListener("click",closeAppeal);
  qa("[data-pg-appeal-close]").forEach(x=>x.onclick=closeAppeal);
  renderLessons();loadSubmissionStates();loadLeaderboard();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true});else bind();
})();
