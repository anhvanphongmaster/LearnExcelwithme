(function(){
  var KEY="avp_channel_vote_v1";
  var META={
    youtube:{id:"channel-focus-youtube", title:"Tiếp tục làm thêm video YouTube"},
    tiktok:{id:"channel-focus-tiktok", title:"Tập trung làm trên TikTok"}
  };
  function voterKey(){
    try{
      var k=localStorage.getItem("avp_voter_key");
      if(!k){ k="v_"+Math.random().toString(36).slice(2)+Date.now().toString(36); localStorage.setItem("avp_voter_key",k); }
      return k;
    }catch(e){ return "v_anon_"+Date.now(); }
  }
  function picked(){ try{ return localStorage.getItem(KEY)||""; }catch(e){ return ""; } }
  function paint(choice, synced){
    document.querySelectorAll("[data-chvote]").forEach(function(b){
      b.classList.toggle("is-on", b.getAttribute("data-chvote")===choice);
      if(choice) b.disabled=true;
    });
    var st=document.getElementById("pytChVoteSt");
    if(st && choice) st.textContent=synced===false?"Đã lưu trên máy, đang chờ đồng bộ.":"Đã ghi nhận vote.";
  }
  async function send(choice, opts){
    opts=opts||{};
    var m=META[choice]; if(!m) return false;
    var sb=window.avpSupabase;
    var synced=false;
    if(sb && sb.rpc){
      try{
        var res=await sb.rpc("vote_practice_lesson",{
          p_lesson_id:m.id,
          p_lesson_number:null,
          p_lesson_title:m.title,
          p_vote_type:choice==="youtube"?"focus_youtube":"focus_tiktok",
          p_voter_key:voterKey()
        });
        if(!res.error){
          var data=res.data||{};
          synced=!!(data.ok || data.error==="already_voted");
        }
      }catch(e){}
    }
    if(!opts.backfill){ try{ localStorage.setItem(KEY,choice); }catch(e){} }
    paint(choice,synced);
    return synced;
  }
  document.addEventListener("DOMContentLoaded",function(){
    var old=picked();
    if(old){
      paint(old,false);
      /* Backfill votes that were stored locally before Supabase accepted channel vote types. */
      setTimeout(function(){ send(old,{backfill:true}); },300);
    }else{
      document.querySelectorAll("[data-chvote]").forEach(function(b){
        b.addEventListener("click",function(){
          if(picked()) return;
          send(b.getAttribute("data-chvote"));
        });
      });
    }
  });
})();
