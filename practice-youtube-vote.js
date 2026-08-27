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
    }catch(e){ return "v_anon"; }
  }
  function picked(){ try{ return localStorage.getItem(KEY)||""; }catch(e){ return ""; } }
  function paint(choice){
    document.querySelectorAll("[data-chvote]").forEach(function(b){
      b.classList.toggle("is-on", b.getAttribute("data-chvote")===choice);
      if(choice) b.disabled=true;
    });
    var st=document.getElementById("pytChVoteSt");
    if(st && choice) st.textContent="Đã ghi nhận vote.";
  }
  async function send(choice){
    var m=META[choice]; if(!m) return;
    var sb=window.avpSupabase;
    if(sb && sb.rpc){
      try{
        await sb.rpc("vote_practice_lesson",{
          p_lesson_id:m.id,
          p_lesson_number:null,
          p_lesson_title:m.title,
          p_vote_type:choice==="youtube"?"focus_youtube":"focus_tiktok",
          p_voter_key:voterKey()
        });
      }catch(e){}
    }
    try{ localStorage.setItem(KEY,choice); }catch(e){}
    paint(choice);
  }
  document.addEventListener("DOMContentLoaded",function(){
    paint(picked());
    document.querySelectorAll("[data-chvote]").forEach(function(b){
      b.addEventListener("click",function(){
        if(picked()) return;
        send(b.getAttribute("data-chvote"));
      });
    });
  });
})();
