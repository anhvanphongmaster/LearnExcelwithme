(()=>{"use strict";
const $=id=>document.getElementById(id);
const parse=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key));return v??fallback}catch(_){return fallback}};
const arr=v=>Array.isArray(v)?v:(v&&typeof v==="object"?Object.values(v):[]);
const clean=s=>String(s??"").replace(/[<>]/g,"").trim();
let user=null;
function displayName(u){return clean(u?.user_metadata?.display_name||u?.user_metadata?.full_name||u?.email?.split("@")[0]||"Người học")}
function setIdentity(){const n=displayName(user);$("accountName").textContent=n;$("accountEmail").textContent=user?.email||"Chưa đăng nhập";$("accountAvatar").textContent=Array.from(n)[0]?.toLocaleUpperCase("vi-VN")||"A";$("accountStatus").textContent=user?"Đã đăng nhập":"Khách";$("displayName").value=n;$("accountEmailInput").value=user?.email||""}
function switchTab(name){document.querySelectorAll(".account-tab").forEach(b=>b.classList.toggle("is-active",b.dataset.tab===name));document.querySelectorAll(".account-panel").forEach(p=>p.classList.toggle("is-active",p.id==="panel-"+name));}
function countCompleted(){const keys=["avp_playground_completed_v1","avp_recent_lessons_v1","avp_learning_events_v1","avp_learning_history_v2"];const seen=new Set();keys.forEach(k=>arr(parse(k,[])).forEach(x=>{if(x&&typeof x==="object"&&(x.completed||x.status==="completed"||x.type==="lesson_completed"))seen.add(String(x.id||x.lesson_id||x.title||JSON.stringify(x)));}));return seen.size}
function renderAchievements(){
 const days=new Set([...arr(parse("avp_activity_days_v1",[])),...arr(parse("avp_visit_days_v1",[]))].map(x=>typeof x==="string"?x:(x?.date||x?.day||"")).filter(Boolean));
 const badges=arr(parse("avp_badge_unlock_dates_v9",[]));
 const xp=Number(parse("avp_bonus_xp_v1",0)||0)+Number(parse("avp_xp_v2",0)||0);
 const stats=[ [days.size,"Ngày hoạt động"],[countCompleted(),"Bài đã hoàn thành"],[badges.length,"Huy hiệu"],[Number.isFinite(xp)?xp:0,"Điểm tích lũy"] ];
 $("accountStats").innerHTML=stats.map(([v,l])=>'<article><strong>'+v+'</strong><span>'+l+'</span></article>').join("");
 const events=[...arr(parse("avpRecentActivities",[])),...arr(parse("avp_learning_events_v1",[])),...arr(parse("avp_learning_history_v2",[])),...arr(parse("avp_recent_lessons_v1",[]))].filter(x=>x&&typeof x==="object").slice(-8).reverse();
 $("accountActivity").innerHTML=events.length?events.map(x=>{const title=clean(x.title||x.lesson_title||x.name||x.label||"Hoạt động học tập");const detail=clean(x.description||x.chapter||x.category||x.type||"");const date=clean(x.date||x.created_at||x.timestamp||"");return '<article class="account-activity-item"><span class="activity-mark">✓</span><div><b>'+title+'</b><small>'+[detail,date].filter(Boolean).join(" · ")+'</small></div></article>'}).join(""):'<p class="account-empty">Chưa có hoạt động đủ dữ liệu để hiển thị.</p>';
}
function renderCollection(){
 const keys=["avp_bookmarks_v2","avp_saved_items_v1","avp_collection_v1"];
 const items=[];keys.forEach(k=>arr(parse(k,[])).forEach(x=>{if(typeof x==="string")items.push({title:x});else if(x&&typeof x==="object")items.push(x)}));
 const unique=[...new Map(items.map((x,i)=>[String(x.id||x.url||x.href||x.title||i),x])).values()];
 $("accountCollection").innerHTML=unique.length?unique.map(x=>{const title=clean(x.title||x.name||x.label||"Nội dung đã lưu");const desc=clean(x.description||x.category||x.type||"");const href=/^(https?:|\/|[a-z0-9-]+\.html)/i.test(x.url||x.href||"")?(x.url||x.href):"";return '<article class="collection-card"><span class="collection-icon">◇</span><div><b>'+title+'</b><small>'+desc+'</small>'+(href?'<a href="'+href.replace(/"/g,"%22")+'">Mở nội dung →</a>':"")+'</div></article>'}).join(""):'<div class="account-empty">Chưa tìm thấy nội dung đã lưu. Khi bạn lưu công thức, bài học hoặc tài liệu, chúng sẽ xuất hiện tại đây nếu tính năng đó ghi vào bộ sưu tập tài khoản.</div>';
}
async function loadUser(){for(let i=0;i<50&&!window.avpSupabase;i++)await new Promise(r=>setTimeout(r,100));const sb=window.avpSupabase;if(!sb){$("accountStatus").textContent="Chưa kết nối dịch vụ tài khoản";$("accountName").textContent="Tài khoản chưa sẵn sàng";return}try{const {data,error}=await sb.auth.getUser();if(error)throw error;user=data?.user||null;setIdentity();if(!user){$("accountFeedback").textContent="Bạn cần đăng nhập để lưu thông tin cá nhân.";}}catch(e){$("accountStatus").textContent="Không thể tải tài khoản";$("accountEmail").textContent="Kiểm tra kết nối rồi tải lại trang";}}
async function save(){if(!user||!window.avpSupabase){$("accountFeedback").textContent="Hãy đăng nhập trước khi lưu.";return}const name=clean($("displayName").value).slice(0,60);if(!name){$("accountFeedback").textContent="Tên hiển thị không được để trống.";return}const btn=$("saveAccount");btn.disabled=true;btn.textContent="Đang lưu…";try{const {data,error}=await window.avpSupabase.auth.updateUser({data:{...user.user_metadata,display_name:name}});if(error)throw error;user=data.user||user;setIdentity();$("accountFeedback").textContent="Đã cập nhật hồ sơ.";window.dispatchEvent(new CustomEvent("avp:auth-changed"));}catch(e){$("accountFeedback").textContent="Lưu thất bại: "+clean(e.message||"Lỗi kết nối");}finally{btn.disabled=false;btn.textContent="Lưu thay đổi"}}
document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(".account-tab").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));$("saveAccount").addEventListener("click",save);renderAchievements();renderCollection();loadUser();});
})();