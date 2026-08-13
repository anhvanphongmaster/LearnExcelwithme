
(() => {
const KEY = "avpLearningPath30";
const VISIT_KEY = "avpLearningPathLastVisit";

const plan = [
 {d:1,w:1,t:"Làm quen giao diện Excel",desc:"Hiểu Workbook, Worksheet, Cell, Row, Column và vùng dữ liệu.",href:"excel.html",tag:"Nền tảng"},
 {d:2,w:1,t:"Nhập & định dạng dữ liệu",desc:"Định dạng số, ngày tháng, căn lề, font và màu hợp lý.",href:"excel.html",tag:"Nền tảng"},
 {d:3,w:1,t:"Phím tắt cơ bản",desc:"Luyện nhóm phím tắt giúp thao tác nhanh hơn.",href:"phimtatexcel.html",tag:"Tốc độ"},
 {d:4,w:1,t:"IF cơ bản",desc:"Dùng IF để phân loại OK/NG và tạo logic điều kiện.",href:"congthucexcel.html",tag:"Công thức"},
 {d:5,w:1,t:"COUNTIF & SUMIF",desc:"Đếm và tính tổng theo một điều kiện.",href:"congthucexcel.html",tag:"Công thức"},
 {d:6,w:1,t:"Thực hành công thức",desc:"Làm bài IF, COUNTIF và SUMIF trong Playground.",href:"playground.html",tag:"Thực hành"},
 {d:7,w:1,t:"Ôn tập tuần 1",desc:"Làm quiz và xem lại các nội dung chưa chắc.",href:"baitapexcel.html",tag:"Ôn tập"},

 {d:8,w:2,t:"VLOOKUP",desc:"Tra cứu dữ liệu theo mã và hiểu các đối số quan trọng.",href:"congthucexcel.html",tag:"Tra cứu"},
 {d:9,w:2,t:"XLOOKUP",desc:"Tra cứu linh hoạt hơn và xử lý trường hợp không tìm thấy.",href:"congthucexcel.html",tag:"Tra cứu"},
 {d:10,w:2,t:"COUNTIFS",desc:"Đếm dữ liệu với nhiều điều kiện cùng lúc.",href:"congthucexcel.html",tag:"Công thức"},
 {d:11,w:2,t:"SUMIFS",desc:"Tính tổng theo nhiều tiêu chí trong dữ liệu thực tế.",href:"congthucexcel.html",tag:"Công thức"},
 {d:12,w:2,t:"FILTER",desc:"Lọc mảng động theo điều kiện.",href:"filtersort.html",tag:"Excel hiện đại"},
 {d:13,w:2,t:"TEXTJOIN",desc:"Ghép nhiều dữ liệu thành một chuỗi có phân cách.",href:"congthucexcel.html",tag:"Xử lý text"},
 {d:14,w:2,t:"Thực hành tuần 2",desc:"Làm nhóm bài VLOOKUP, XLOOKUP, COUNTIFS, SUMIFS, FILTER.",href:"playground.html",tag:"Thực hành"},

 {d:15,w:3,t:"Filter & Sort",desc:"Lọc, sắp xếp và tìm nhanh dữ liệu lớn.",href:"filtersort.html",tag:"Dữ liệu"},
 {d:16,w:3,t:"Pivot Table cơ bản",desc:"Tạo Pivot Table và kéo thả trường dữ liệu.",href:"pivottable.html",tag:"Phân tích"},
 {d:17,w:3,t:"Pivot Table thực tế",desc:"Tổng hợp theo Lot, Model, NG Qty và nhóm dữ liệu.",href:"pivottable.html",tag:"Phân tích"},
 {d:18,w:3,t:"Biểu đồ Excel",desc:"Chọn biểu đồ phù hợp để trực quan hóa dữ liệu.",href:"bieudopareto.html",tag:"Biểu đồ"},
 {d:19,w:3,t:"Pareto 80/20",desc:"Tính % tích lũy và xác định nhóm lỗi trọng yếu.",href:"bieudopareto.html",tag:"QC"},
 {d:20,w:3,t:"NG Rate",desc:"Hiểu Input, NG Qty và tỷ lệ lỗi trong báo cáo chất lượng.",href:"playground.html",tag:"QC"},
 {d:21,w:3,t:"Ôn tập tuần 3",desc:"Kiểm tra lại Pivot, Filter, biểu đồ và Pareto.",href:"baitapexcel.html",tag:"Ôn tập"},

 {d:22,w:4,t:"Báo cáo Excel",desc:"Bố cục báo cáo rõ ràng, dễ đọc và có thứ tự ưu tiên.",href:"baocaoexcel.html",tag:"Báo cáo"},
 {d:23,w:4,t:"KPI & Top Defect",desc:"Xây dựng bảng theo dõi KPI, NG Rate và Top Defect.",href:"baocaoexcel.html",tag:"QC"},
 {d:24,w:4,t:"Formula Finder",desc:"Luyện cách chọn đúng hàm theo nhu cầu.",href:"formula-finder.html",tag:"Công cụ"},
 {d:25,w:4,t:"Tối ưu tốc độ Excel",desc:"Ôn nhóm phím tắt nâng cao và thao tác nhanh.",href:"phimtatexcel.html",tag:"Tốc độ"},
 {d:26,w:4,t:"Bài tập tổng hợp",desc:"Làm các bài kết hợp nhiều kỹ năng.",href:"baitapexcel.html",tag:"Thực hành"},
 {d:27,w:4,t:"Playground Challenge",desc:"Hoàn thành các bài Playground còn lại.",href:"playground.html",tag:"Thử thách"},
 {d:28,w:4,t:"Kiểm tra tiến độ",desc:"Mở Dashboard và xem kỹ năng nào còn yếu.",href:"dashboard.html",tag:"Đánh giá"},

 {d:29,w:5,t:"Mini Project",desc:"Tự tạo một báo cáo Excel nhỏ từ dữ liệu thô đến biểu đồ.",href:"baocaoexcel.html",tag:"Dự án"},
 {d:30,w:5,t:"Tổng kết 30 ngày",desc:"Xem thành tích, XP và chọn mục tiêu tiếp theo.",href:"achievements.html",tag:"Hoàn thành"}
];

function getDone(){
  try { return JSON.parse(localStorage.getItem(KEY) || "[]").map(Number); }
  catch { return []; }
}
function setDone(arr){
  localStorage.setItem(KEY, JSON.stringify([...new Set(arr)].sort((a,b)=>a-b)));
}
function addActivity(day){
  const key="avpRecentActivities";
  let a=[];
  try{a=JSON.parse(localStorage.getItem(key)||"[]")}catch{}
  a.unshift({type:"learning-path",title:`Hoàn thành Ngày ${day} trong Lộ trình 30 ngày`,time:new Date().toISOString()});
  localStorage.setItem(key,JSON.stringify(a.slice(0,20)));
}

function todayIndex(){
  const startRaw = localStorage.getItem(VISIT_KEY);
  if(!startRaw){
    localStorage.setItem(VISIT_KEY,new Date().toISOString().slice(0,10));
    return 1;
  }
  const start = new Date(startRaw+"T00:00:00");
  const now = new Date();
  const diff = Math.floor((new Date(now.getFullYear(),now.getMonth(),now.getDate())-start)/86400000)+1;
  return Math.max(1, Math.min(30, diff));
}

function render(filter="all"){
  const root=document.getElementById("learningPathGrid");
  if(!root) return;
  const done=getDone();
  const current=todayIndex();
  root.innerHTML="";
  let lastWeek=0;
  plan.forEach(item=>{
    if(filter!=="all" && String(item.w)!==filter) return;
    if(item.w!==lastWeek){
      lastWeek=item.w;
      const wh=document.createElement("div");
      wh.className="lp-week";
      wh.textContent=item.w===5 ? "🏁 Hai ngày tổng kết" : `Tuần ${item.w}`;
      root.appendChild(wh);
    }
    const card=document.createElement("article");
    card.className="lp-day"+(done.includes(item.d)?" done":"")+(item.d>current+1?" locked":"");
    card.innerHTML=`
      <div class="lp-day-top">
        <div style="display:flex;gap:13px;align-items:flex-start">
          <div class="lp-day-num">${done.includes(item.d)?"✓":item.d}</div>
          <div>
            <h3>${item.t}</h3>
            <div class="lp-topic">${item.desc}</div>
            <span class="lp-tag">${item.tag}</span>
          </div>
        </div>
      </div>
      <div class="lp-actions">
        <a class="lp-go" href="${item.href}">Mở bài →</a>
        <button class="lp-complete" data-day="${item.d}">${done.includes(item.d)?"Đã hoàn thành":"Đánh dấu hoàn thành"}</button>
      </div>`;
    root.appendChild(card);
  });
  updateStats();
  bindButtons();
}


function ensureCongratsBanner(){
  let banner=document.getElementById("lpCongratsBanner");
  if(banner) return banner;

  banner=document.createElement("section");
  banner.id="lpCongratsBanner";
  banner.className="lp-congrats";
  banner.setAttribute("role","status");
  banner.setAttribute("aria-live","polite");
  banner.innerHTML=`
    <div class="lp-congrats-icon">🎉</div>
    <div class="lp-congrats-copy">
      <strong>Chúc mừng bạn đã hoàn thành!</strong>
      <span>Bạn đã hoàn thành toàn bộ Lộ trình Excel 30 ngày. Quá tuyệt vời!</span>
    </div>
    <a href="achievements.html" class="lp-congrats-link">Xem thành tích →</a>
  `;

  const page=document.querySelector(".lp-page");
  const hero=document.querySelector(".lp-hero");
  if(page && hero){
    hero.insertAdjacentElement("afterend",banner);
  }
  return banner;
}

function celebrateCompletion(){
  const banner=ensureCongratsBanner();
  if(!banner) return;

  banner.classList.remove("show");

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

  setTimeout(()=>{
    banner.classList.add("show");
  },420);
}

function bindButtons(){
  document.querySelectorAll(".lp-complete").forEach(btn=>{
    btn.onclick=()=>{
      const d=Number(btn.dataset.day);
      let done=getDone();
      const beforeCount=done.length;
      const wasDone=done.includes(d);

      if(wasDone){
        done=done.filter(x=>x!==d);
      }else{
        done.push(d);
        addActivity(d);
      }

      setDone(done);
      const activeFilter=document.querySelector(".lp-filter.active")?.dataset.filter||"all";
      render(activeFilter);

      /* Chỉ chúc mừng khi người dùng vừa chuyển từ chưa đủ sang đủ 30/30 */
      const afterCount=getDone().length;
      if(beforeCount<30 && afterCount===30){
        celebrateCompletion();
      }
    };
  });
}

function updateStats(){
  const done=getDone().length;
  const pct=Math.round(done/30*100);
  const xp=done*15;
  const current=todayIndex();
  const c=document.getElementById("lpCompleted"); if(c)c.textContent=done;
  const p=document.getElementById("lpPercent"); if(p)p.textContent=pct+"%";
  const x=document.getElementById("lpXp"); if(x)x.textContent=xp;
  const t=document.getElementById("lpToday"); if(t)t.textContent=current;
  const bar=document.getElementById("lpProgressBar"); if(bar)bar.style.width=pct+"%";
  const meta=document.getElementById("lpProgressText"); if(meta)meta.textContent=`${done}/30 ngày hoàn thành`;

  const doneDays=getDone();
  const next=plan.find(i=>!doneDays.includes(i.d));
  const nt=document.getElementById("lpNextTitle");
  const nd=document.getElementById("lpNextDesc");
  const na=document.getElementById("lpNextLink");

  if(done===30){
    if(nt) nt.textContent="Bạn đã hoàn thành toàn bộ 30 ngày 🎉";
    if(nd) nd.textContent="Hãy xem thành tích và chọn mục tiêu Excel tiếp theo của bạn.";
    if(na){
      na.href="achievements.html";
      na.textContent="Xem thành tích →";
    }
  }else if(next){
    if(nt) nt.textContent=`Ngày ${next.d}: ${next.t}`;
    if(nd) nd.textContent=next.desc;
    if(na){
      na.href=next.href;
      na.textContent="Học ngay →";
    }
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  render();
  document.querySelectorAll(".lp-filter").forEach(b=>b.addEventListener("click",()=>{
    document.querySelectorAll(".lp-filter").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    render(b.dataset.filter);
  }));
  const reset=document.getElementById("lpReset");
  if(reset) reset.onclick=()=>{
    if(confirm("Xóa toàn bộ tiến độ Lộ trình 30 ngày trên trình duyệt này?")){
      localStorage.removeItem(KEY); render();
    }
  };
});
})();
