/*! learning-flow.js — V88 canonical learning route */
(function(){
  "use strict";
  if(window.__avpLearningFlowV88)return;
  window.__avpLearningFlowV88=true;

  const route=[{"file": "excel.html", "name": "Excel cơ bản"}, {"file": "phimtatexcel.html", "name": "Phím tắt Excel"}, {"file": "congthucexcel.html", "name": "Công thức Excel"}, {"file": "filtersort.html", "name": "Filter & Sort"}, {"file": "pivottable.html", "name": "PivotTable"}, {"file": "bieudopareto.html", "name": "Biểu đồ Pareto"}, {"file": "baocaoexcel.html", "name": "Báo cáo Excel / QC"}, {"file": "excel-nang-cao.html", "name": "Excel nâng cao"}, {"file": "power-query-course.html", "name": "Power Query"}, {"file": "power-pivot-dax.html", "name": "Power Pivot & DAX"}, {"file": "dashboard-dong.html", "name": "Dashboard động"}, {"file": "practice-lab.html", "name": "Practice Lab"}, {"file": "vba-macro.html", "name": "VBA / Macro"}, {"file": "solver-whatif.html", "name": "What-If & Solver"}];
  const current=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  const index=route.findIndex(x=>x.file.toLowerCase()===current);
  if(index<0)return;

  function el(tag,cls,text){
    const node=document.createElement(tag);
    if(cls)node.className=cls;
    if(text!=null)node.textContent=text;
    return node;
  }

  function makeButton(item,direction){
    const a=el("a","avp-learning-flow-btn "+direction);
    a.href=item.file;
    const small=el("small","",direction==="prev"?"BÀI TRƯỚC":"BÀI TIẾP THEO");
    const strong=el("strong","",(direction==="prev"?"← ":"")+item.name+(direction==="next"?" →":""));
    a.append(small,strong);
    return a;
  }

  function buildContext(){
    if(document.querySelector(".avp-learning-context"))return;
    const nav=document.querySelector(".top-simple-nav");
    if(!nav)return;

    const box=el("div","avp-learning-context");
    const learn=el("a","","Học");
    learn.href="skill-map.html";
    const sep=el("i","",">");
    const name=el("span","",route[index].name);
    box.append(learn,sep,name);
    nav.insertAdjacentElement("afterend",box);
  }

  function buildFooter(){
    if(document.querySelector(".avp-learning-flow"))return;

    const wrap=el("section","avp-learning-flow");
    wrap.setAttribute("aria-label","Điều hướng bài học");

    const head=el("div","avp-learning-flow-head");
    head.append(
      el("span","","LỘ TRÌNH HỌC EXCEL"),
      el("small","",`Bài ${index+1} / ${route.length}`)
    );

    const actions=el("div","avp-learning-flow-actions");

    if(index>0){
      actions.appendChild(makeButton(route[index-1],"prev"));
    }else{
      const back=el("a","avp-learning-flow-btn prev");
      back.href="skill-map.html";
      back.innerHTML="<small>LỘ TRÌNH</small><strong>← Skill Map</strong>";
      actions.appendChild(back);
    }

    const map=el("a","avp-learning-flow-map","Xem Skill Map");
    map.href="skill-map.html";
    actions.appendChild(map);

    if(index<route.length-1){
      actions.appendChild(makeButton(route[index+1],"next"));
    }else{
      const practice=el("a","avp-learning-flow-btn next");
      practice.href="practice-video.html";
      practice.innerHTML="<small>HOÀN THÀNH LỘ TRÌNH</small><strong>Đi thực hành →</strong>";
      actions.appendChild(practice);
    }

    wrap.append(head,actions);

    const footer=document.querySelector("footer");
    if(footer)footer.insertAdjacentElement("beforebegin",wrap);
    else document.body.appendChild(wrap);
  }

  function normalizeLegacyLinks(){
    document.querySelectorAll("a[href]").forEach(a=>{
      const text=(a.textContent||"").replace(/\s+/g," ").trim().toLowerCase();
      const href=(a.getAttribute("href")||"").split("?")[0].split("#")[0].toLowerCase();

      // Skill Map is now the canonical return point for lessons.
      if(
        href==="excel.html" &&
        (text.includes("quay lại học excel") || text.includes("xem lộ trình"))
      ){
        a.href="skill-map.html";
        a.textContent=text.includes("quay lại")?"← Quay lại Skill Map":"Xem Skill Map →";
      }

      // Old Master Learning is no longer the primary route.
      if(
        href==="master-learning.html" &&
        (text.includes("quay lại lộ trình") || text.includes("xem lộ trình"))
      ){
        a.href="skill-map.html";
        a.textContent=text.includes("quay lại")?"← Quay lại Skill Map":"Xem Skill Map →";
      }
    });
  }

  function boot(){
    buildContext();
    normalizeLegacyLinks();
    buildFooter();
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",boot,{once:true});
  }else{
    boot();
  }
})();
