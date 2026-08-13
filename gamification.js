(() => {
  const EVENT_KEY='avp_learning_events_v1';
  const BONUS_KEY='avp_bonus_xp_v1';
  const REWARD_KEY='avp_daily_rewards_v1';
  const ACTIVITY_KEY='avp_activity_days_v1';
  const PG_KEY='avp_playground_progress_v1';
  const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

  function eventsToday(){return read(EVENT_KEY,[]).filter(e=>e.date===today())}
  function count(type){return eventsToday().filter(e=>e.type===type).length}
  function quests(){return [
    {id:'visit',icon:'🌱',title:'Khởi động ngày mới',desc:'Mở Learn Excel with Anh Van Phong hôm nay.',target:1,value:count('visit'),reward:5},
    {id:'playground',icon:'🧪',title:'Luyện công thức',desc:'Hoàn thành 1 bài Playground mới.',target:1,value:count('playground_complete'),reward:15},
    {id:'course',icon:'📚',title:'Tiến thêm một chuyên đề',desc:'Đánh dấu hoàn thành 1 chuyên đề Excel.',target:1,value:count('course_complete'),reward:20},
    {id:'quiz',icon:'🎯',title:'Kiểm tra kiến thức',desc:'Nộp ít nhất 1 lượt Quiz.',target:1,value:count('quiz_attempt'),reward:10}
  ]}
  function syncRewards(){
    const all=read(REWARD_KEY,{}), day=all[today()]||{};
    let bonus=Number(localStorage.getItem(BONUS_KEY)||0)||0, changed=false;
    quests().forEach(q=>{if(q.value>=q.target&&!day[q.id]){day[q.id]=true;bonus+=q.reward;changed=true}});
    if(changed){all[today()]=day;save(REWARD_KEY,all);localStorage.setItem(BONUS_KEY,String(bonus));window.dispatchEvent(new CustomEvent('avp:rewards-updated',{detail:{bonus}}))}
  }
  window.avpRecordLearningEvent=(type,data={})=>{
    const arr=read(EVENT_KEY,[]); const d=today();
    if(type==='visit' && arr.some(e=>e.type==='visit'&&e.date===d)) return;
    arr.push({type,date:d,time:new Date().toISOString(),...data});
    save(EVENT_KEY,arr.slice(-300)); syncRewards();
  };
  window.avpGamification={today,read,quests,syncRewards,getBonus:()=>Number(localStorage.getItem(BONUS_KEY)||0)||0};

  document.addEventListener('DOMContentLoaded',()=>{
    let days=read(ACTIVITY_KEY,[]); const d=today(); if(!days.includes(d)){days.push(d);save(ACTIVITY_KEY,days.slice(-365))}
    window.avpRecordLearningEvent('visit',{page:location.pathname.split('/').pop()||'index.html'}); syncRewards();
  });
})();
// Learning Path bonus: +15 XP per completed day.
window.getLearningPathXP = function(){
  try{
    const days = JSON.parse(localStorage.getItem("avpLearningPath30") || "[]");
    return Array.isArray(days) ? days.length * 15 : 0;
  }catch(e){ return 0; }
};


// Excel Challenge bonus: +5 XP for each unique question answered correctly.
window.getChallengeXP = function(){
  try{
    const stats = JSON.parse(localStorage.getItem("avp_excel_challenge_stats_v1") || "{}");
    const unique = Array.isArray(stats.correctUnique) ? new Set(stats.correctUnique.map(Number)).size : 0;
    return unique * 5;
  }catch(e){
    return 0;
  }
};
