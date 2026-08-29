(function(){
  var KEY_PREFIX="avp_channel_vote_v2";
  var LEGACY_KEY="avp_channel_vote_v1";
  var META={
    youtube:{id:"channel-focus-youtube", title:"Tiếp tục làm thêm video YouTube"},
    tiktok:{id:"channel-focus-tiktok", title:"Tập trung làm trên TikTok"}
  };
  var isAdmin=false;

  function vnDay(){
    try{
      var parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Ho_Chi_Minh",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
      var o={}; parts.forEach(function(p){o[p.type]=p.value;});
      return o.year+"-"+o.month+"-"+o.day;
    }catch(e){ return new Date().toISOString().slice(0,10); }
  }
  function dayKey(){ return KEY_PREFIX+":"+vnDay(); }
  function voterKey(){
    try{
      var k=localStorage.getItem("avp_voter_key");
      if(!k){ k="v_"+Math.random().toString(36).slice(2)+Date.now().toString(36); localStorage.setItem("avp_voter_key",k); }
      return k;
    }catch(e){ return "v_anon_"+Date.now(); }
  }
  function picked(){
    try{
      var v=localStorage.getItem(dayKey())||"";
      // migrate lựa chọn cũ vào hôm nay một lần để Admin/user không thấy trạng thái biến mất sau update
      if(!v){
        var legacy=localStorage.getItem(LEGACY_KEY)||"";
        if(legacy && META[legacy]){ v=legacy; localStorage.setItem(dayKey(),v); }
      }
      return v;
    }catch(e){ return ""; }
  }
  function save(choice){ try{ localStorage.setItem(dayKey(),choice); }catch(e){} }
  function clearChoice(){
    try{
      localStorage.removeItem(dayKey());
      localStorage.removeItem(LEGACY_KEY);
    }catch(e){}
  }

  async function detectAdmin(){
    var sb=null;
    for(var i=0;i<20;i++){
      sb=window.avpSupabase||window.supabaseClient||null;
      if(sb && sb.rpc && sb.auth) break;
      await new Promise(function(r){setTimeout(r,150);});
    }
    if(!sb || !sb.rpc) return false;
    try{
      if(sb.auth && sb.auth.getSession) await sb.auth.getSession();
      var res=await sb.rpc("is_admin_user");
      isAdmin=!!(!res.error && res.data===true);
    }catch(e){ isAdmin=false; }
    return isAdmin;
  }

  function paint(choice, synced){
    document.querySelectorAll("[data-chvote]").forEach(function(b){
      var mine=b.getAttribute("data-chvote")===choice;
      b.classList.toggle("is-on", mine);
      b.classList.toggle("is-admin-cancel", !!(choice && mine && isAdmin));
      b.disabled=!!choice && !mine;
      b.setAttribute("aria-disabled", (choice && mine && !isAdmin)?"true":"false");
      if(mine && isAdmin){
        b.textContent="↩ Huỷ vote";
      }else{
        b.textContent=b.getAttribute("data-chvote")==="youtube"?"Tiếp tục làm thêm video YouTube":"Tập trung làm trên TikTok";
      }
    });
    var st=document.getElementById("pytChVoteSt");
    if(st){
      if(!choice) st.textContent="";
      else if(isAdmin) st.textContent="Admin · có thể huỷ để vote lại";
      else st.textContent=synced===false?"Đã lưu trên máy, đang chờ đồng bộ.":"Đã vote hôm nay · Mai vote lại";
    }
  }

  async function send(choice, opts){
    opts=opts||{};
    var m=META[choice]; if(!m) return false;
    var sb=window.avpSupabase||window.supabaseClient;
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
          synced=!!(data.ok || data.error==="already_voted" || data.error==="already_voted_today");
        }
      }catch(e){}
    }
    if(!opts.backfill) save(choice);
    paint(choice,synced);
    return synced;
  }

  async function cancel(choice, btn){
    var m=META[choice]; if(!m) return;
    var okAdmin=await detectAdmin();
    if(!okAdmin){ paint(choice,true); return; }
    var sb=window.avpSupabase||window.supabaseClient;
    if(!sb || !sb.rpc) return;
    var old=btn.textContent;
    btn.disabled=true; btn.textContent="Đang huỷ…";
    try{
      var res=await sb.rpc("admin_cancel_practice_lesson_vote",{
        p_lesson_id:m.id,
        p_voter_key:voterKey()
      });
      if(res.error) throw res.error;
      var data=res.data||{};
      if(data.ok===false) throw new Error(data.error||"cancel_failed");
      clearChoice();
      paint("",true);
    }catch(e){
      console.debug("admin cancel youtube vote",e);
      btn.disabled=false; btn.textContent=old;
      var st=document.getElementById("pytChVoteSt");
      if(st) st.textContent="Chưa huỷ được vote. Kiểm tra RPC Admin trong Supabase.";
    }
  }

  document.addEventListener("DOMContentLoaded",async function(){
    await detectAdmin();
    var old=picked();
    paint(old,!!old);
    if(old){ setTimeout(function(){ send(old,{backfill:true}); },300); }

    document.querySelectorAll("[data-chvote]").forEach(function(b){
      b.addEventListener("click",async function(){
        var access=window.AVPAccess;
        var user=access ? await access.requireLogin({
          next:"practice-video.html#youtube",
          reason:"Đăng nhập để vote."
        }) : null;
        if(!user){
          if(!access) location.href="auth.html?next="+encodeURIComponent("practice-video.html#youtube");
          return;
        }

        var choice=b.getAttribute("data-chvote");
        var oldChoice=picked();
        if(oldChoice){
          if(oldChoice===choice){
            var okAdmin=isAdmin || await detectAdmin();
            if(okAdmin) await cancel(choice,b);
          }
          return;
        }
        await send(choice);
        await detectAdmin();
        paint(picked(),true);
      });
    });

    // Nếu quyền admin/session đến chậm, kiểm tra lại và mở nút huỷ.
    setTimeout(async function(){ await detectAdmin(); paint(picked(),true); },900);
    setTimeout(async function(){ await detectAdmin(); paint(picked(),true); },2200);
  });
})();
