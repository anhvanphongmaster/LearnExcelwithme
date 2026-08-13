
const PROFILE_KEY = 'avpUserProfile';
const PROFILE_ACTIVITY_KEY = 'avp_activity_days_v1';
const PG_KEY_PROFILE = 'avp_playground_progress_v1';

const PROFILE_DEFAULT = {
  name:'Người học Excel',
  avatar:'initial',
  goal:'Nâng cao kỹ năng Excel cho công việc',
  focus:'Excel thực tế',
  note:''
};

function pJSON(key,fallback){
  try{return JSON.parse(localStorage.getItem(key)) ?? fallback}
  catch(e){return fallback}
}

function getInitialFromName(name){
  const clean = String(name || '').trim();
  if(!clean) return 'A';
  return Array.from(clean)[0].toLocaleUpperCase('vi-VN');
}

/* Chuyển dữ liệu avatar chữ cũ (A, T, AV...) sang chế độ avatar theo tên. */
function normalizeAvatar(value){
  const emojiAvatars = ['📊','🧠','🚀','💼','⚡'];

  if(emojiAvatars.includes(value)){
    return value;
  }

  return 'initial';
}

function getProfile(){
  const stored = pJSON(PROFILE_KEY,{});
  const profile = {...PROFILE_DEFAULT,...stored};

  profile.avatar = normalizeAvatar(profile.avatar);

  /* Migration: ghi lại dạng mới để dữ liệu cũ không tiếp tục gây lỗi. */
  if(stored.avatar && stored.avatar !== profile.avatar){
    localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));
  }

  return profile;
}

function avatarLabel(avatar,name){
  if(avatar === 'initial'){
    return getInitialFromName(name);
  }

  const emojiAvatars = ['📊','🧠','🚀','💼','⚡'];
  return emojiAvatars.includes(avatar) ? avatar : getInitialFromName(name);
}

function calcProfileStats(){
  const courses=pJSON('completedCourses',[]);
  const pg=pJSON(PG_KEY_PROFILE,{});
  const quiz=Math.min(5,parseInt(localStorage.getItem('quizBestScore')||'0',10)||0);
  const pgDone=Object.values(pg).filter(Boolean).length;
  const bonus=Number(localStorage.getItem('avp_bonus_xp_v1')||0)||0;
  const xp=Math.min(6,courses.length)*20+pgDone*10+quiz*10+bonus;
  const level=Math.floor(xp/100)+1;
  return {courses:Math.min(6,courses.length),pg:pgDone,quiz,xp,level};
}

function updateInitialChoice(name){
  const btn=document.querySelector('.avatar-choice[data-avatar="initial"]');
  if(btn){
    btn.textContent=getInitialFromName(name);
  }
}

function renderProfile(){
  const p=getProfile();
  const s=calcProfileStats();

  document.getElementById('profileAvatar').textContent=avatarLabel(p.avatar,p.name);
  document.getElementById('profileNameView').textContent=p.name;
  document.getElementById('profileGoalView').textContent=p.goal;
  document.getElementById('profileXP').textContent=s.xp;
  document.getElementById('profileLevel').textContent=s.level;
  document.getElementById('profileCourseCount').textContent=s.courses+'/6';
  document.getElementById('profilePGCount').textContent=s.pg+'/10';

  document.getElementById('profileName').value=p.name;
  document.getElementById('profileGoal').value=p.goal;
  document.getElementById('profileFocus').value=p.focus;
  document.getElementById('profileNote').value=p.note||'';

  updateInitialChoice(p.name);

  document.querySelectorAll('.avatar-choice').forEach(b=>{
    b.classList.toggle('active',b.dataset.avatar===p.avatar);
  });

  renderProfileActivity();
}

function chooseAvatar(btn){
  document.querySelectorAll('.avatar-choice').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');

  const name=document.getElementById('profileName').value.trim() || PROFILE_DEFAULT.name;

  if(btn.dataset.avatar === 'initial'){
    document.getElementById('profileAvatar').textContent=getInitialFromName(name);
  }else{
    document.getElementById('profileAvatar').textContent=btn.dataset.avatar;
  }
}

function syncInitialAvatarLive(){
  const input=document.getElementById('profileName');
  if(!input) return;

  const name=input.value.trim() || PROFILE_DEFAULT.name;
  updateInitialChoice(name);

  const selected=document.querySelector('.avatar-choice.active');
  if(selected && selected.dataset.avatar === 'initial'){
    document.getElementById('profileAvatar').textContent=getInitialFromName(name);
  }

  /* Preview tên bên trái cũng thay đổi trực tiếp. */
  document.getElementById('profileNameView').textContent=name;
}

function saveProfile(){
  const selected=document.querySelector('.avatar-choice.active');

  const data={
    name:document.getElementById('profileName').value.trim() || PROFILE_DEFAULT.name,
    avatar:selected ? selected.dataset.avatar : 'initial',
    goal:document.getElementById('profileGoal').value.trim() || PROFILE_DEFAULT.goal,
    focus:document.getElementById('profileFocus').value,
    note:document.getElementById('profileNote').value.trim()
  };

  localStorage.setItem(PROFILE_KEY,JSON.stringify(data));
  if(window.avpCloudSync && window.AVP_SUPABASE_CONFIGURED){
    window.avpCloudSync.syncProfileToCloud(data).catch(console.warn);
  }
  renderProfile();
  showProfileToast('✓ Đã lưu hồ sơ');
}

function renderProfileActivity(){
  const box=document.getElementById('profileActivity');
  const s=calcProfileStats();
  const days=pJSON(PROFILE_ACTIVITY_KEY,[]);
  const items=[];

  if(s.pg) items.push(['🧪','Playground','Bạn đã hoàn thành '+s.pg+'/10 bài thực hành.']);
  if(s.courses) items.push(['📚','Lộ trình Excel','Bạn đã hoàn thành '+s.courses+'/6 chuyên đề.']);
  if(s.quiz) items.push(['🎯','Quiz tốt nhất','Điểm cao nhất hiện tại: '+s.quiz+'/5.']);
  if(days.length) items.push(['🔥','Hoạt động gần đây','Đã ghi nhận hoạt động học trong '+days.length+' ngày.']);

  if(!items.length){
    items.push(['🌱','Bắt đầu hành trình','Hãy hoàn thành một bài học hoặc Playground để tạo lịch sử hoạt động.']);
  }

  box.innerHTML=items.map(i=>`
    <div class="activity-item">
      <div class="activity-icon">${i[0]}</div>
      <div><strong>${i[1]}</strong><small>${i[2]}</small></div>
    </div>
  `).join('');
}

function showProfileToast(msg){
  const t=document.getElementById('profileToast');
  t.textContent=msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),1800);
}

document.addEventListener('DOMContentLoaded',function(){
  renderProfile();

  const input=document.getElementById('profileName');
  if(input){
    input.addEventListener('input',syncInitialAvatarLive);
    input.addEventListener('change',syncInitialAvatarLive);
  }
});
