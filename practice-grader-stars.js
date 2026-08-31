(function(){
  try{
    if(!document.getElementById("avpPgStarCssFile")){
      var l=document.createElement("link");
      l.id="avpPgStarCssFile";
      l.rel="stylesheet";
      l.href="practice-grader-stars.css?v=20260831-vis";
      document.head.appendChild(l);
    }
  }catch(e){}
})();
/*! practice-grader-stars.js — gắn nút tặng sao vào BXH sau khi list render */
(function(){
  "use strict";
  if(window.__avpPgStars)return;
  window.__avpPgStars=true;

  function $(id){return document.getElementById(id)}
  function store(){
    try{return JSON.parse(localStorage.getItem("avp_pg_stars_v1")||"{}")}catch(e){return {}}
  }
  function save(s){localStorage.setItem("avp_pg_stars_v1",JSON.stringify(s))}
  function today(){
    var d=new Date();
    return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
  }
  function keyOf(row){
    return (row.getAttribute("data-user-id")||row.querySelector(".pg-board-name")?.textContent||"").trim();
  }
  function enhance(list){
    if(!list)return;
    list.querySelectorAll(".pg-board-row").forEach(function(row){
      if(row.querySelector(".pg-star-btn"))return;
      var name=(row.querySelector(".pg-board-name")?.textContent||"Học viên").replace(" · Bạn","").trim();
      var self=row.classList.contains("me") || /· Bạn/.test(row.textContent||"");
      var s=store();
      var k=keyOf(row)||name;
      var n=Number((s.counts||{})[k]||0);
      var btn=document.createElement("button");
      btn.type="button";
      btn.className="pg-star-btn";
      btn.setAttribute("data-gift-star","1");
      btn.disabled=!!self;
      btn.title=self?"Không tự tặng sao":"Tặng 1 sao";
      btn.innerHTML="★ <b class=\"pg-star-count\">"+n+"</b>";
      row.appendChild(btn);
    });
  }
  async function gift(btn){
    var row=btn.closest(".pg-board-row");
    if(!row)return;
    var name=(row.querySelector(".pg-board-name")?.textContent||"học viên").replace(" · Bạn","").trim();
    if(row.classList.contains("me")||btn.disabled){
      alert("Không thể tự tặng sao cho mình.");
      return;
    }
    var user=null;
    if(window.AVPAccess&&window.AVPAccess.requireLogin){
      user=await window.AVPAccess.requireLogin({next:"practice-video.html#grader"});
    }
    if(!user){
      location.href="auth.html?next="+encodeURIComponent("practice-video.html#grader");
      return;
    }
    var s=store();
    s.given=s.given||{};
    s.counts=s.counts||{};
    var stamp=today()+"|"+name+"|"+(user.id||"");
    if(s.given[stamp]){
      alert("Hôm nay bạn đã tặng sao cho "+name+" rồi.");
      return;
    }
    s.given[stamp]=1;
    var k=keyOf(row)||name;
    s.counts[k]=(Number(s.counts[k])||0)+1;
    save(s);
    var c=btn.querySelector(".pg-star-count");
    if(c)c.textContent=String(s.counts[k]);
    btn.classList.add("is-given");
    alert("Đã tặng 1 sao cho "+name+".");
  }

  function boot(){
    var list=$("pgBoardList");
    if(!list)return;
    list.addEventListener("click",function(e){
      var btn=e.target.closest("[data-gift-star]");
      if(btn)gift(btn);
    });
    enhance(list);
    new MutationObserver(function(){enhance(list)}).observe(list,{childList:true,subtree:true});
    setTimeout(function(){enhance(list)},800);
    setTimeout(function(){enhance(list)},2000);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);
  else boot();
})();
