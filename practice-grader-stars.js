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
  var serverCounts=null;
  async function refreshServerCounts(){
    var sb=window.avpSupabase;
    if(!sb)return {};
    var map={};
    try{
      var rpc=await sb.rpc("practice_grader_star_counts");
      if(rpc.error)rpc=await sb.rpc("practice_grader_star_counts",{p_user_ids:null});
      if(!rpc.error && Array.isArray(rpc.data)){
        rpc.data.forEach(function(x){
          var id=String(x.user_id||x.id||"");
          if(id)map[id]=Number(x.star_count||x.stars||0);
        });
      }
    }catch(e){}
    try{
      var res=await sb.from("practice_grader_stars").select("to_user_id");
      if(!res.error && Array.isArray(res.data)){
        res.data.forEach(function(x){
          var id=String(x.to_user_id||"");
          if(id)map[id]=(map[id]||0)+1;
        });
      }
    }catch(e){}
    serverCounts=map;
    return map;
  }
  function enhance(list){
    if(!list)return;
    list.querySelectorAll(".pg-board-row").forEach(function(row){
      var name=(row.querySelector(".pg-board-name")?.textContent||"Học viên").replace(" · Bạn","").trim();
      var self=row.classList.contains("me") || /· Bạn/.test(row.textContent||"");
      var k=row.getAttribute("data-user-id")||keyOf(row)||name;
      var n=Number((serverCounts||{})[k]||0);
      var exist=row.querySelector(".pg-star-btn");
      if(exist){
        var c=exist.querySelector(".pg-star-count");
        if(c && serverCounts) c.textContent=String(n);
        return;
      }
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

  async function notifyStarGift(sb, toId, fromUser, toName){
    if(!sb || !toId) return false;
    var fromName = (fromUser && (fromUser.user_metadata && (fromUser.user_metadata.full_name || fromUser.user_metadata.name))) || "Một học viên";
    var title = "Bạn vừa được tặng 1 sao";
    var content = fromName + " đã tặng bạn 1 sao trên bảng xếp hạng bài tập chấm điểm.";
    var tries = [
      ["practice_grader_gift_star", {p_to_user_id: toId}],
      ["notification_personal_create", {p_user_id: toId, p_title: title, p_content: content, p_type: "practice_grader_star"}],
      ["admin_system_notification_create", {p_title: title, p_content: content, p_category: "practice_grader_star", p_target_type: "user", p_target_user_id: toId, p_starts_at: new Date().toISOString(), p_expires_at: null, p_is_pinned: false}]
    ];
    for (var i=0;i<tries.length;i++){
      try{
        var res = await sb.rpc(tries[i][0], tries[i][1]);
        if(!res.error) return true;
      }catch(e){}
    }
    return false;
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

    var toId=row.getAttribute("data-user-id")||"";
    try{
      var sb=window.avpSupabase;
      if(!sb && window.AVPAccess && window.AVPAccess.client) sb=window.AVPAccess.client();
      if(sb && toId) await notifyStarGift(sb, toId, user, name);
    }catch(e){}
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
    refreshServerCounts().then(function(){enhance(list)});
    setTimeout(function(){refreshServerCounts().then(function(){enhance(list)})},1200);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);
  else boot();
})();
