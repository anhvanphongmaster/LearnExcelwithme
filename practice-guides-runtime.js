
(() => {
"use strict";
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const guides=()=>Array.isArray(window.AVP_PRACTICE_GUIDES)?window.AVP_PRACTICE_GUIDES:[];
const diff=v=>v==="basic"?"Cơ bản":v==="intermediate"?"Trung cấp":"Nâng cao";

function render(){
  const root=$("pgGuideList"); if(!root)return;
  const q=String($("pgGuideSearch")?.value||"").trim().toLowerCase();
  const topic=$("pgGuideTopic")?.value||"all";
  const level=$("pgGuideDifficulty")?.value||"all";
  const list=guides().filter(g=>{
    const hay=`${g.title} ${g.topicLabel} ${g.objective}`.toLowerCase();
    return (!q||hay.includes(q))&&(topic==="all"||g.topic===topic)&&(level==="all"||g.difficulty===level);
  });
  root.innerHTML=list.length?list.map(g=>`
    <article class="pg-guide-item">
      <div class="pg-guide-badges"><span>${esc(g.topicLabel)}</span><span>${esc(diff(g.difficulty))}</span></div>
      <h3>${esc(g.title)}</h3>
      <p>${esc(g.objective)}</p>
      <button type="button" class="pg-guide-open" data-guide="${esc(g.lessonKey)}">📖 Xem hướng dẫn</button>
    </article>`).join(""):`<div class="pg-board-empty">Không tìm thấy hướng dẫn phù hợp.</div>`;
  root.querySelectorAll("[data-guide]").forEach(b=>b.onclick=()=>open(b.dataset.guide));
}
function open(key){
  const g=guides().find(x=>x.lessonKey===key); if(!g)return;
  const body=$("pgGuideModalBody"); if(!body)return;
  body.innerHTML=`
    <span class="pg-guide-kicker">${esc(g.topicLabel)} · ${esc(diff(g.difficulty))}</span>
    <h3>${esc(g.title)}</h3>
    <div class="pg-guide-objective">${esc(g.objective)}</div>
    <div class="pg-guide-block"><strong>Gợi ý cách làm</strong><ol>${g.steps.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div>
    <div class="pg-guide-block"><strong>Lỗi dễ gặp</strong><ul>${g.pitfalls.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
    <div class="pg-guide-block"><strong>Kiểm tra trước khi nộp</strong><ul>${g.checks.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
    <div class="pg-guide-warning">${esc(g.note)}</div>`;
  $("pgGuideModal").hidden=false;
  document.body.classList.add("pg-publish-open");
}
function close(){
  if($("pgGuideModal"))$("pgGuideModal").hidden=true;
  document.body.classList.remove("pg-publish-open");
}
window.AVPPracticeGuides={open,render};
function init(){
  $("pgGuideSearch")?.addEventListener("input",render);
  $("pgGuideTopic")?.addEventListener("change",render);
  $("pgGuideDifficulty")?.addEventListener("change",render);
  $("pgGuideClose")?.addEventListener("click",close);
  document.querySelectorAll("[data-pg-guide-close]").forEach(x=>x.onclick=close);
  render();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
