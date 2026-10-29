const PROFILE_KEY='avpUserProfile';
const PROFILE_DEFAULT={name:'Người học Excel',avatar:'initial',goal:'Nâng cao kỹ năng Excel cho công việc',focus:'Excel thực tế',note:''};
function pJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch(e){return fallback}}
function getInitialFromName(name){const clean=String(name||'').trim();return clean?Array.from(clean)[0].toLocaleUpperCase('vi-VN'):'A'}
function normalizeAvatar(value){return ['📊','🧠','🚀','💼','⚡'].includes(value)?value:'initial'}
function getProfile(){const stored=pJSON(PROFILE_KEY,{});const profile={...PROFILE_DEFAULT,...stored};profile.avatar=normalizeAvatar(profile.avatar);if(stored.avatar&&stored.avatar!==profile.avatar)localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));return profile}
function avatarLabel(avatar,name){return avatar==='initial'?getInitialFromName(name):normalizeAvatar(avatar)}
function updateInitialChoice(name){const btn=document.querySelector('.avatar-choice[data-avatar="initial"]');if(btn)btn.textContent=getInitialFromName(name)}
function renderProfile(){
 const p=getProfile();
 document.getElementById('profileAvatar').textContent=avatarLabel(p.avatar,p.name);
 document.getElementById('profileNameView').textContent=p.name;
 document.getElementById('profileGoalView').textContent=p.goal;
 document.getElementById('profileName').value=p.name;
 document.getElementById('profileGoal').value=p.goal;
 document.getElementById('profileFocus').value=p.focus;
 document.getElementById('profileNote').value=p.note||'';
 updateInitialChoice(p.name);
 document.querySelectorAll('.avatar-choice').forEach(b=>b.classList.toggle('active',b.dataset.avatar===p.avatar));
}
function chooseAvatar(btn){
 document.querySelectorAll('.avatar-choice').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
 const name=document.getElementById('profileName').value.trim()||PROFILE_DEFAULT.name;
 document.getElementById('profileAvatar').textContent=btn.dataset.avatar==='initial'?getInitialFromName(name):btn.dataset.avatar;
}
function syncInitialAvatarLive(){
 const input=document.getElementById('profileName');if(!input)return;
 const name=input.value.trim()||PROFILE_DEFAULT.name;updateInitialChoice(name);
 const selected=document.querySelector('.avatar-choice.active');
 if(selected&&selected.dataset.avatar==='initial')document.getElementById('profileAvatar').textContent=getInitialFromName(name);
 document.getElementById('profileNameView').textContent=name;
}
function saveProfile(){
 const selected=document.querySelector('.avatar-choice.active');
 const data={name:document.getElementById('profileName').value.trim()||PROFILE_DEFAULT.name,avatar:selected?selected.dataset.avatar:'initial',goal:document.getElementById('profileGoal').value.trim()||PROFILE_DEFAULT.goal,focus:document.getElementById('profileFocus').value,note:document.getElementById('profileNote').value.trim()};
 localStorage.setItem(PROFILE_KEY,JSON.stringify(data));
 if(window.avpCloudSync&&window.AVP_SUPABASE_CONFIGURED)window.avpCloudSync.syncProfileToCloud(data).catch(console.warn);
 renderProfile();showProfileToast('✓ Đã lưu hồ sơ');
}
function showProfileToast(msg){const t=document.getElementById('profileToast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
document.addEventListener('DOMContentLoaded',()=>{renderProfile();const input=document.getElementById('profileName');if(input){input.addEventListener('input',syncInitialAvatarLive);input.addEventListener('change',syncInitialAvatarLive)}});
