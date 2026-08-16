const ACH_PG='avp_playground_progress_v1',ACH_ACTIVITY='avp_activity_days_v1';
const achRead=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
function achDate(k){const [y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d)}
function achStreak(days){const u=[...new Set(days)].sort();if(!u.length)return 0;let s=1;for(let i=u.length-1;i>0;i--){if(Math.round((achDate(u[i])-achDate(u[i-1]))/86400000)===1)s++;else break}const now=new Date(),last=achDate(u[u.length-1]);now.setHours(0,0,0,0);return Math.round((now-last)/86400000)<=1?s:0}
function achStats(){const courses=achRead('completedCourses',[]);const pg=achRead(ACH_PG,{});const pgDone=Object.values(pg).filter(Boolean).length;const quiz=Math.min(5,parseInt(localStorage.getItem('quizBestScore')||'0',10)||0);const bonus=Number(localStorage.getItem('avp_bonus_xp_v1')||0)||0;const streak=achStreak(achRead(ACH_ACTIVITY,[]));const challenge=achRead('avp_excel_challenge_stats_v1',{});const challengeCorrect=Array.isArray(challenge.correctUnique)?new Set(challenge.correctUnique.map(Number)).size:0;const challengeScore=Number(challenge.score)||0;const challengeXP=challengeCorrect*5;const learningPathXP=window.getLearningPathXP?window.getLearningPathXP():0;const courseXP=Number(localStorage.getItem('avp_xp_v2')||0)||0;const xp=Math.min(6,courses.length)*20+pgDone*10+quiz*10+bonus+challengeXP+learningPathXP+courseXP;return{courses:Math.min(6,courses.length),pgDone,quiz,bonus,streak,challengeCorrect,challengeScore,challengeXP,learningPathXP,courseXP,xp,level:Math.floor(xp/100)+1}}
function renderAchievements(){if(!window.avpGamification)return;window.avpGamification.syncRewards();const s=achStats();const quests=window.avpGamification.quests();const done=quests.filter(q=>q.value>=q.target).length;document.getElementById('achXP').textContent=s.xp;document.getElementById('achLevel').textContent=s.level;document.getElementById('achStreak').textContent=s.streak+' ngày';document.getElementById('dailyDone').textContent=done+'/'+quests.length;document.getElementById('dailyQuestGrid').innerHTML=quests.map(q=>{const ok=q.value>=q.target;return `<article class="quest ${ok?'done':''}"><div class="quest-icon">${q.icon}</div><div><strong>${q.title}</strong><small>${q.desc}</small><span class="quest-status">${ok?'✓ Hoàn thành':Math.min(q.value,q.target)+'/'+q.target}</span></div><div class="quest-reward">+${q.reward} XP</div></article>`}).join('');
const defs=[
['🌱','Bước đầu tiên','Hoàn thành 1 chuyên đề.',s.courses>=1],
['🧪','Formula Rookie','Hoàn thành 3 bài Playground.',s.pgDone>=3],
['🏆','Playground Master','Hoàn thành 10/10 Playground.',s.pgDone>=10],
['📚','Excel Journey','Hoàn thành 6/6 chuyên đề.',s.courses>=6],
['🎯','Quiz Ace','Đạt ít nhất 4/5 Quiz.',s.quiz>=4],
['🧠','Challenge Starter','Trả lời đúng 1 câu Excel Challenge.',s.challengeCorrect>=1],
['🔥','Challenge 10','Trả lời đúng 10 câu Challenge khác nhau.',s.challengeCorrect>=10],
['👑','Challenge Master','Trả lời đúng 25 câu Challenge khác nhau.',s.challengeCorrect>=25],
['💯','Challenge 280','Đạt ít nhất 280 điểm Excel Challenge.',s.challengeScore>=280],
['🔥','3-Day Streak','Học 3 ngày liên tiếp.',s.streak>=3],
['⚡','Daily Finisher','Hoàn thành 4 nhiệm vụ trong một ngày.',done>=4],
['💎','Office Pro','Đạt tổng 300 XP.',s.xp>=300]
];const unlocked=defs.filter(x=>x[3]).length;document.getElementById('achUnlocked').textContent=unlocked+'/'+defs.length;document.getElementById('badgeGrid').innerHTML=defs.map(b=>`<article class="badge ${b[3]?'unlocked':''}"><span class="badge-icon">${b[0]}</span><strong>${b[1]}</strong><small>${b[2]}</small><div class="lock">${b[3]?'✓ ĐÃ MỞ KHÓA':'🔒 CHƯA MỞ'}</div></article>`).join('');const within=s.xp%100;document.getElementById('achLevelBar').style.width=within+'%';document.getElementById('nextLevelTitle').textContent=`Level ${s.level} → Level ${s.level+1}`;document.getElementById('nextLevelText').textContent=`Bạn có ${s.xp} XP. Còn ${100-within} XP để lên Level ${s.level+1}. Challenge: ${s.challengeCorrect} câu đúng khác nhau (+${s.challengeXP} XP).`}
document.addEventListener('DOMContentLoaded',renderAchievements);window.addEventListener('avp:rewards-updated',renderAchievements);
window.addEventListener('avp:challenge-updated',renderAchievements);
