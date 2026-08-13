const AVP_ACTIVITY_KEY="avp_activity_days_v1";
const AVP_PG_KEY="avp_playground_progress_v1";

function avpSafeJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch(e){return fallback}}
function avpToday(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function avpDateFromKey(k){const [y,m,d]=k.split("-").map(Number);return new Date(y,m-1,d)}
function avpStreak(days){if(!days.length)return 0;const unique=[...new Set(days)].sort();let streak=1;for(let i=unique.length-1;i>0;i--){const a=avpDateFromKey(unique[i]),b=avpDateFromKey(unique[i-1]);if(Math.round((a-b)/86400000)===1)streak++;else break}const last=avpDateFromKey(unique[unique.length-1]),today=avpDateFromKey(avpToday());const gap=Math.round((today-last)/86400000);return gap<=1?streak:0}
function setText(id,text){const e=document.getElementById(id);if(e)e.textContent=text}
function setWidth(id,value){const e=document.getElementById(id);if(e)e.style.width=Math.max(0,Math.min(100,value))+"%"}

function renderDashboard(){
 const courses=avpSafeJSON("completedCourses",[]);
 const pg=avpSafeJSON(AVP_PG_KEY,{});
 const pgDone=Object.values(pg).filter(Boolean).length;
 const quizBest=Math.min(5,parseInt(localStorage.getItem("quizBestScore")||"0",10)||0);
 const lots=avpSafeJSON("dashboardLots",[]);
 const days=avpSafeJSON(AVP_ACTIVITY_KEY,[]);
 const streak=avpStreak(days);
 const courseDone=Math.min(6,courses.length);
 const courseXP=courseDone*20, pgXP=pgDone*10, quizXP=quizBest*10, bonusXP=Number(localStorage.getItem("avp_bonus_xp_v1")||0)||0;
 const xp=courseXP+pgXP+quizXP+bonusXP;
 const level=Math.floor(xp/100)+1;
 const levelXP=xp%100;
 const ranks=["Excel Starter","Excel Learner","Formula Builder","Data Explorer","Excel Specialist","Office Pro"];
 const rank=ranks[Math.min(ranks.length-1,Math.floor(xp/100))];
 setText("dashLevel",level); setText("dashRank",rank); setText("dashXP",xp+" XP tổng"); setWidth("dashLevelBar",levelXP); setText("dashLevelProgress",levelXP+" / 100 XP"); setText("dashNextLevel",(100-levelXP)+" XP tới Level "+(level+1));
 setText("statCourses",courseDone+"/6"); setText("statPlayground",pgDone+"/10"); setText("statQuiz",quizBest+"/5"); setText("statStreak",streak+" ngày");
 const coursePct=Math.round(courseDone/6*100), pgPct=Math.round(pgDone/10*100), quizPct=Math.min(100,quizBest*20);
 setWidth("courseSkill",coursePct); setText("courseSkillText",coursePct+"%"); setWidth("pgSkill",pgPct); setText("pgSkillText",pgPct+"%"); setWidth("quizSkill",quizPct); setText("quizSkillText",quizPct+"%");
 const overall=Math.round((coursePct+pgPct+quizPct)/3); setWidth("overallSkill",overall); setText("overallSkillText",overall+"%");
 const lessonOrder=[['phim-tat','Phím tắt Excel','phimtatexcel.html'],['cong-thuc','Công thức Excel','congthucexcel.html'],['pivot','Pivot Table','pivottable.html'],['pareto','Biểu đồ & Pareto','bieudopareto.html'],['filter-sort','Filter & Sort','filtersort.html'],['bao-cao','Báo cáo Excel','baocaoexcel.html']];
 let next=lessonOrder.find(x=>!courses.includes(x[0])); const ct=document.getElementById("continueTitle"),cp=document.getElementById("continueText"),cb=document.getElementById("continueButton");
 if(next){ct.textContent=next[1];cp.textContent=`Bạn đã hoàn thành ${courseDone}/6 chuyên đề. Tiếp tục bài này để tiến gần hơn tới hoàn thành lộ trình.`;cb.href=next[2];cb.textContent="Tiếp tục học →"}else if(pgDone<10){ct.textContent="Excel Playground";cp.textContent=`Lộ trình 6 chuyên đề đã hoàn thành. Còn ${10-pgDone} thử thách Playground để hoàn tất bộ thực hành.`;cb.href="playground.html";cb.textContent="Tiếp tục thực hành →"}else{ct.textContent="Bạn đang làm rất tốt 🎉";cp.textContent="Bạn đã hoàn thành lộ trình chính và 10 thử thách Playground. Hãy thử nâng điểm Quiz hoặc ôn lại các chuyên đề.";cb.href="baitapexcel.html";cb.textContent="Làm Quiz →"}
 const badges=[['badgeFirst',courseDone>=1],['badgeCourse',courseDone>=6],['badgePG',pgDone>=10],['badgeQuiz',quizBest>=4],['badgeStreak',streak>=3],['badgeData',Array.isArray(lots)&&lots.length>=3]];badges.forEach(([id,on])=>{const e=document.getElementById(id);if(e)e.classList.toggle('unlocked',on)});
 const acts=[]; if(courseDone)acts.push(`Đã hoàn thành <strong>${courseDone}/6 chuyên đề Excel</strong>.`); if(pgDone)acts.push(`Đã vượt qua <strong>${pgDone}/10 thử thách Playground</strong>.`); if(quizBest)acts.push(`Điểm Quiz tốt nhất hiện tại là <strong>${quizBest}/5</strong>.`); if(streak)acts.push(`Chuỗi học hiện tại: <strong>${streak} ngày</strong>.`); if(Array.isArray(lots)&&lots.length)acts.push(`Dashboard Lot đang lưu <strong>${lots.length} bản ghi</strong>.`);
 const box=document.getElementById("activityList");box.innerHTML=acts.length?acts.slice(0,5).map(t=>`<div class="activity"><span class="activity-dot"></span><div class="activity-text">${t}</div></div>`).join(''):`<div class="empty-state">Chưa có nhiều dữ liệu học tập. Hãy hoàn thành một bài học hoặc thử Excel Playground để Dashboard bắt đầu ghi nhận tiến độ.</div>`;
}
function resetDashboardData(){if(!confirm("Bạn muốn xóa toàn bộ tiến độ học, điểm Quiz, Playground và chuỗi ngày trên trình duyệt này?"))return;["completedCourses","currentCourse","quizBestScore",AVP_PG_KEY,AVP_ACTIVITY_KEY].forEach(k=>localStorage.removeItem(k));location.reload()}
document.addEventListener("DOMContentLoaded",renderDashboard);
