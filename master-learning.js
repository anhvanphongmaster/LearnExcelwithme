(function(){
 const XPKEY='avp_xp_v2', QKEY='avp_quiz_done_v1';
 const stages=[
  {id:'beginner',name:'Beginner',icon:'🌱',desc:'Nền tảng thao tác và công thức cốt lõi.',prereq:'Mở ngay',lessons:[['excel.html','Kiến thức Excel cơ bản'],['phimtatexcel.html','100 phím tắt Excel'],['congthucexcel.html','100 công thức Excel'],['filtersort.html','Filter & Sort']]},
  {id:'analyst',name:'Analyst',icon:'📊',desc:'Tổng hợp, phân tích và báo cáo dữ liệu.',prereq:'Vượt đủ 4 quiz Beginner',lessons:[['pivottable.html','PivotTable'],['bieudopareto.html','Biểu đồ Pareto'],['baocaoexcel.html','Báo cáo Excel / QC']]},
  {id:'advanced',name:'Advanced',icon:'🚀',desc:'Mô hình dữ liệu và dashboard thực chiến.',prereq:'Vượt đủ 3 quiz Analyst',lessons:[['excel-nang-cao.html','Excel nâng cao thực chiến'],['power-query-course.html','Power Query thực chiến'],['power-pivot-dax.html','Power Pivot & DAX'],['dashboard-dong.html','Dashboard động chuyên nghiệp'],['practice-lab.html','Practice Lab thực chiến']]},
  {id:'master',name:'Master',icon:'🏆',desc:'Tự động hóa và tối ưu mô hình.',prereq:'Hoàn thành toàn bộ Advanced + đạt 300 XP',lessons:[['vba-macro.html','VBA / Macro tự động hóa'],['solver-whatif.html','What-If Analysis & Solver']]}
 ];
 const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(e){return f}};
 const q=()=>read(QKEY,{}), xp=()=>Number(localStorage.getItem(XPKEY)||0)||0;
 function lessonDone(url){return !!q()[url]}
 function stageDone(s){return s.lessons.every(x=>lessonDone(x[0]))}
 function unlocked(index){if(index===0)return true;if(index===1)return stageDone(stages[0]);if(index===2)return stageDone(stages[1]);if(index===3)return stageDone(stages[2])&&xp()>=300;return false}
 function allDone(){return stages.every(stageDone)}
 function totals(){const total=stages.reduce((n,s)=>n+s.lessons.length,0),done=stages.reduce((n,s)=>n+s.lessons.filter(x=>lessonDone(x[0])).length,0);return{total,done,pct:Math.round(done/total*100)}}
 function nextLesson(){for(let i=0;i<stages.length;i++){if(!unlocked(i))continue;const l=stages[i].lessons.find(x=>!lessonDone(x[0]));if(l)return{stage:stages[i],lesson:l}}return null}
 function render(){const root=document.getElementById('masterLearningRoot');if(!root)return;const t=totals(),v=xp(),n=nextLesson(),finished=allDone();
  document.getElementById('mlDone').textContent=`${t.done}/${t.total}`;document.getElementById('mlXP').textContent=v;document.getElementById('mlPct').textContent=t.pct+'%';document.getElementById('mlLevel').textContent=v>=400?'Master':v>=300?'Pro':v>=180?'Analyst':v>=80?'Explorer':'Rookie';document.getElementById('mlProgress').style.width=t.pct+'%';
  const grid=document.getElementById('mlGrid');grid.innerHTML=stages.map((s,i)=>{const d=s.lessons.filter(x=>lessonDone(x[0])).length,lock=!unlocked(i),done=stageDone(s);return `<article class="ml-stage ${lock?'is-locked':''} ${done?'is-done':''} ${!lock&&!done?'is-current':''}"><div class="ml-stage-num">0${i+1}</div><h3>${s.icon} ${s.name}</h3><p>${s.desc}</p><span class="ml-stage-status">${done?'✓ Hoàn thành':lock?'🔒 Chưa mở':`${d}/${s.lessons.length} quiz`}</span><ul class="ml-lessons">${s.lessons.map(l=>{const ld=lessonDone(l[0]);return `<li class="${ld?'done':''} ${lock?'locked':''}">${lock?`<span><i class="ml-dot">🔒</i>${l[1]}</span>`:`<a href="${l[0]}"><i class="ml-dot">${ld?'✓':'•'}</i>${l[1]}</a>`}</li>`}).join('')}</ul><div class="ml-prereq"><b>Điều kiện:</b> ${s.prereq}</div></article>`}).join('');
  const nextTitle=document.getElementById('mlNextTitle'),nextDesc=document.getElementById('mlNextDesc'),nextLink=document.getElementById('mlNextLink');if(finished){nextTitle.textContent='Bạn đã hoàn thành Master Learning Path 🎉';nextDesc.textContent='Chứng nhận hoàn thành đã được mở khóa.';nextLink.href='certificate.html';nextLink.textContent='Xem chứng nhận →'}else if(n){nextTitle.textContent=`${n.stage.icon} ${n.lesson[1]}`;nextDesc.textContent=`Tiếp tục chặng ${n.stage.name}. Vượt quiz cuối bài để ghi nhận tiến độ.`;nextLink.href=n.lesson[0];nextLink.textContent='Học tiếp →'}else{nextTitle.textContent='Chặng tiếp theo đang bị khóa';nextDesc.textContent=xp()<300?'Bạn cần hoàn thành các quiz trước và đạt 300 XP để mở Master.':'Hoàn thành các quiz prerequisite để tiếp tục.';nextLink.href='dashboard.html';nextLink.textContent='Xem Dashboard →'}
  const cert=document.getElementById('mlCertLink'),state=document.getElementById('mlCertState');if(finished&&v>=400){cert.classList.remove('disabled');cert.href='certificate.html';state.textContent='✓ Đủ điều kiện cấp chứng nhận'}else{cert.classList.add('disabled');cert.removeAttribute('href');state.textContent=`Cần hoàn thành ${t.total-t.done} quiz và đạt 400 XP (hiện ${v} XP)`}
 }
 document.addEventListener('DOMContentLoaded',render);window.addEventListener('avp:course-xp',()=>setTimeout(render,80));window.addEventListener('storage',render);
 window.avpMasterLearning={stages,unlocked,allDone,totals,nextLesson};
})();
