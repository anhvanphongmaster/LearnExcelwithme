(() => {
"use strict";

const $=id=>document.getElementById(id);
const qa=s=>Array.from(document.querySelectorAll(s));
const DIFF_LABEL={basic:"🌱 Cơ bản",intermediate:"📘 Trung cấp",advanced:"🏆 Nâng cao"};
const TOPICS=[["all","Tất cả"],["clean","🧹 Làm sạch"],["pq","⚙️ Power Query"],["input","⌨️ Nhập liệu"],["formula","🧮 Công thức"],["format","🎨 Định dạng"]];

let currentTopic="all",currentDifficulty="all",currentRankDifficulty="basic";
let pendingLesson=null,pendingFile=null,xlsxPromise=null;
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
  root.querySelectorAll("[data-topic]").forEach(b=>b.onclick=()=>{currentTopic=b.dataset.topic;renderTopicTabs();renderLessons()});
}
function filteredLessons(){
  return lessons().slice()
    .sort((a,b)=>(a.topic||"").localeCompare(b.topic||"")||(a.order||0)-(b.order||0))
    .filter(l=>currentTopic==="all"||l.topic===currentTopic)
    .filter(l=>currentDifficulty==="all"||l.difficulty===currentDifficulty);
}
function card(l){
  const st=submissionCache.get(l.key),locked=!!st?.submitted,active=!!l.isActive;
  const badge=locked?`<b class="pg-status-locked">✓ ĐÃ NỘP · ${Number(st.score)||0}/${l.maxScore||100}</b>`:active?`<b>● ĐANG MỞ</b>`:`<b class="pg-status-soon">SẮP MỞ</b>`;
  const rules=(l.rules||[]).map(x=>`<span>${esc(x)}</span>`).join("");
  return `<article class="pg-card">
    <div class="pg-card-head"><span class="pg-difficulty ${esc(l.difficulty)}">${DIFF_LABEL[l.difficulty]||l.difficulty}</span>${badge}</div>
    <h3>${esc(l.title)}</h3><p>${esc(l.description||"")}</p>
    <div class="pg-rules">${rules}</div>
    ${active?`<div class="pg-actions">
      <button class="pg-btn primary" type="button" data-download="${esc(l.key)}">⬇️ Tải file</button>
      <label class="pg-btn submit${locked?" locked":""}">
        <input type="file" hidden accept=".xlsx,.xls" data-submit="${esc(l.key)}" ${locked?"disabled":""}>
        ${locked?"✓ Đã nộp":"📤 Nộp bài"}
      </label></div>`:`<div class="pg-coming-note">Bài đang được chuẩn bị.</div>`}
    <div class="pg-note">${locked?"Kết quả đã khóa. Admin mới có thể cho làm lại.":active?"Tải được nhiều lần, nhưng chỉ nộp chính thức 1 lần.":"Bài chưa mở."}</div>
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
  grid.querySelectorAll("[data-submit]").forEach(i=>i.onchange=e=>{const f=e.target.files?.[0];e.target.value="";const l=lessons().find(x=>x.key===i.dataset.submit);if(l&&f)onFilePicked(l,f)});
}
async function loadSubmissionStates(){
  const u=await requireLogin();if(!u)return;
  const sb=await getClient();if(!sb?.rpc)return;
  await Promise.all(lessons().map(async l=>{
    try{
      const {data,error}=await sb.rpc("practice_grader_my_submission",{p_lesson_key:l.key});
      if(error)throw error;
      submissionCache.set(l.key,Array.isArray(data)?(data[0]||{submitted:false}):(data||{submitted:false}));
    }catch(e){submissionCache.set(l.key,{submitted:false})}
  }));
  renderLessons();
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
async function buildWorkbook(l){
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
    default:
      throw new Error("WORKBOOK_NOT_READY");
  }
  appendData(XLSX,wb,rows,[12,22,16,14]);
  addGuide(XLSX,wb,`BÀI THỰC HÀNH: ${l.title}`,guide);
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
  }
};

async function grade(l,file){
  const XLSX=await loadXLSX(),buf=await file.arrayBuffer(),wb=XLSX.read(buf,{type:"array",cellDates:true,cellFormula:true});
  const fn=GRADERS[l.grader];
  if(!fn)throw new Error("GRADER_NOT_READY");
  return fn(XLSX,wb);
}

/* -------------------- Submission -------------------- */
async function onFilePicked(l,file){
  const u=await requireLogin();if(!u)return;
  if(submissionCache.get(l.key)?.submitted){alert("Bài này đã nộp chính thức.");return}
  if(!/\.(xlsx|xls)$/i.test(file.name)){alert("Chỉ nhận .xlsx hoặc .xls.");return}
  pendingLesson=l;pendingFile=file;
  $("pgSubmitFileName").textContent=`${file.name} · ${l.title}`;
  $("pgSubmitModal").hidden=false;document.body.classList.add("pg-publish-open");
}
function closeSubmit(){
  $("pgSubmitModal").hidden=true;document.body.classList.remove("pg-publish-open");
  pendingLesson=null;pendingFile=null;
}
async function submitOfficial(){
  const l=pendingLesson,f=pendingFile;if(!l||!f)return;
  const sb=await getClient();if(!sb?.rpc)return;
  const btn=$("pgSubmitConfirm");btn.disabled=true;btn.textContent="Đang chấm…";
  try{
    const result=await grade(l,f);
    const {error}=await sb.rpc("practice_grader_submit_once",{p_lesson_key:l.key,p_score:result.score});
    if(error)throw error;
    submissionCache.set(l.key,{submitted:true,score:result.score,passed:result.score>=70,difficulty:l.difficulty});
    closeSubmit();renderLessons();showResult(l,result);openPublish(l,result.score);await loadLeaderboard();
  }catch(e){
    const msg=String(e?.message||e);
    if(/ALREADY_SUBMITTED/i.test(msg)){alert("Bài này đã nộp trước đó. Admin mới có thể mở lại.");submissionCache.set(l.key,{submitted:true});closeSubmit();renderLessons()}
    else alert("Không nộp được bài: "+msg);
  }finally{btn.disabled=false;btn.textContent="Nộp chính thức"}
}
function showResult(l,r){
  const el=$("pgResult");if(!el)return;
  el.hidden=false;
  el.innerHTML=`<div class="pg-score"><strong>${r.score}</strong><span>/${l.maxScore||100}</span></div>
  <div class="pg-checks">${r.checks.map(x=>`<div class="pg-check ${x.ok?"ok":"bad"}"><b>${x.ok?"✓":"×"} ${esc(x.label)} · ${x.points}đ</b></div>`).join("")}</div>`;
}
function openPublish(l,score){
  $("pgPublishScore").textContent=String(score);
  $("pgPublishText").textContent=`${l.title} · ${DIFF_LABEL[l.difficulty]||l.difficulty} · ${score}/${l.maxScore||100}`;
  $("pgPublishModal").hidden=false;document.body.classList.add("pg-publish-open");
}
function closePublish(){$("pgPublishModal").hidden=true;document.body.classList.remove("pg-publish-open")}
async function setVisibility(v){
  const sb=await getClient();if(!sb?.rpc)return;
  const {error}=await sb.rpc("practice_grader_set_visibility",{p_visible:!!v});
  if(error){alert(error.message);return}
  closePublish();await loadLeaderboard();
}
async function loadLeaderboard(){
  const list=$("pgBoardList");if(!list)return;
  const sb=await getClient();if(!sb?.rpc)return;
  list.innerHTML='<li class="pg-board-empty">Đang tải…</li>';
  try{
    const {data,error}=await sb.rpc("practice_grader_leaderboard_v4",{p_difficulty:currentRankDifficulty,p_limit:50});
    if(error)throw error;
    const rows=Array.isArray(data)?data:[];
    list.innerHTML=rows.length?rows.map((r,i)=>{
      const rank=Number(r.rank_no)||(i+1),medal=rank===1?"🥇":rank===2?"🥈":rank===3?"🥉":`${rank}.`;
      return `<li class="pg-board-row${r.is_me?" me":""}"><span class="pg-board-rank">${medal}</span><span class="pg-board-name">${esc(r.display_name||"Học viên")}${r.is_me?" · Bạn":""}</span><span class="pg-board-score">${Number(r.total_score)||0}<small>đ</small></span><span class="pg-board-meta">${Number(r.submitted_lessons)||0} bài · TB ${Number(r.avg_score)||0}/100</span></li>`;
    }).join(""):'<li class="pg-board-empty">Chưa có thành tích công khai.</li>';
  }catch(e){list.innerHTML='<li class="pg-board-empty">BXH chưa tải được.</li>'}
}

function bind(){
  renderTopicTabs();
  qa("[data-pg-difficulty]").forEach(b=>b.onclick=()=>{currentDifficulty=b.dataset.pgDifficulty;qa("[data-pg-difficulty]").forEach(x=>x.classList.toggle("active",x===b));renderLessons()});
  qa("[data-rank-difficulty]").forEach(b=>b.onclick=()=>{currentRankDifficulty=b.dataset.rankDifficulty;qa("[data-rank-difficulty]").forEach(x=>x.classList.toggle("active",x===b));loadLeaderboard()});
  $("pgSubmitConfirm")?.addEventListener("click",submitOfficial);
  $("pgSubmitCancel")?.addEventListener("click",closeSubmit);
  $("pgSubmitClose")?.addEventListener("click",closeSubmit);
  qa("[data-pg-submit-close]").forEach(x=>x.onclick=closeSubmit);
  $("pgPublishYes")?.addEventListener("click",()=>setVisibility(true));
  $("pgPublishPrivate")?.addEventListener("click",()=>setVisibility(false));
  $("pgPublishClose")?.addEventListener("click",closePublish);
  qa("[data-pg-publish-close]").forEach(x=>x.onclick=closePublish);
  $("pgBoardRefresh")?.addEventListener("click",loadLeaderboard);
  renderLessons();loadSubmissionStates();loadLeaderboard();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true});else bind();
})();
