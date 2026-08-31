(function(){
  if(window.__avpRobotV1)return;
  window.__avpRobotV1=true;

  var css="\
#avpEdgeLauncher.is-robot{width:76px!important;height:90px!important;pointer-events:none!important;background:transparent!important;overflow:visible!important;z-index:2147483000!important}\
#avpEdgeLauncher.is-robot .avp-edge-main{width:76px!important;height:90px!important;background:transparent!important;border:0!important;box-shadow:none!important;pointer-events:auto!important;cursor:pointer!important}\
#avpEdgeLauncher.is-robot .avp-edge-main::before,#avpEdgeLauncher.is-robot .avp-bot-vid,#avpEdgeLauncher.is-robot .avp-bot-img{display:none!important}\
#avpEdgeLauncher.is-robot .avp-edge-menu{pointer-events:auto!important;z-index:2147483647!important;bottom:96px!important;left:50%!important;transform:translateX(-50%)!important}\
#avpEdgeLauncher.is-robot .avp-edge-menu *{pointer-events:auto!important}\
#avpEdgeLauncher.is-robot .avp-edge-badge{pointer-events:none!important}\
.avp-bot-25d{position:relative;width:56px;height:76px;margin:0 auto;filter:drop-shadow(0 6px 8px rgba(0,0,0,.35))}\
#avpEdgeLauncher.face-left .avp-bot-25d{transform:scaleX(-1)}\
.b25-head{position:absolute;left:14px;top:0;width:28px;height:22px;border-radius:8px 8px 6px 6px;background:linear-gradient(145deg,#5edc8a,#1f7a4a 58%,#0f3d28);box-shadow:inset 0 2px 0 rgba(255,255,255,.35)}\
.b25-eye{position:absolute;top:7px;width:6px;height:6px;border-radius:50%;background:#eafff2}\
.b25-eye.l{left:5px}.b25-eye.r{right:5px}\
.b25-smile{position:absolute;left:9px;bottom:3px;width:10px;height:5px;border:2px solid #0b2a1a;border-top:0;border-radius:0 0 8px 8px}\
.b25-body{position:absolute;left:10px;top:22px;width:36px;height:26px;border-radius:8px;background:linear-gradient(160deg,#3cb56f,#165533);color:#fff;font:800 10px/26px system-ui,sans-serif;text-align:center;box-shadow:inset 0 2px 0 rgba(255,255,255,.22)}\
.b25-arm{position:absolute;top:24px;width:7px;height:16px;border-radius:4px;background:linear-gradient(#2f9a5c,#0f3d28);transform-origin:top center}\
.b25-arm.l{left:4px}.b25-arm.r{right:4px}\
.b25-leg{position:absolute;top:46px;width:8px;height:16px;border-radius:4px;background:#0f3d28;transform-origin:top center}\
.b25-leg.l{left:16px}.b25-leg.r{right:16px}\
#avpBotTalk{position:absolute;left:50%;bottom:92px;transform:translateX(-50%);min-width:130px;max-width:190px;padding:7px 10px;border-radius:10px;background:#143526;color:#fff;font:700 12px/1.3 system-ui;display:none;z-index:2147483647;pointer-events:none;text-align:center}\
#avpBotTalk.show{display:block}\
#avpEdgeLauncher.is-lifted .b25-smile{width:12px;height:3px;border:0;background:#0b2a1a;top:14px;bottom:auto}\
#avpEdgeLauncher.is-lifted .b25-head:before,#avpEdgeLauncher.is-lifted .b25-head:after{content:'';position:absolute;top:12px;width:5px;height:10px;border-radius:50%;background:#2aa8ff}\
#avpEdgeLauncher.is-lifted .b25-head:before{left:3px}\
#avpEdgeLauncher.is-lifted .b25-head:after{right:3px}\
";
  var st=document.createElement("style");
  st.textContent=css;
  document.head.appendChild(st);

  function ready(fn){
    if(document.getElementById("avpEdgeLauncher"))fn();
    else setTimeout(function(){ready(fn);},50);
  }

  ready(function(){
    var el=document.getElementById("avpEdgeLauncher");
    var fab=document.getElementById("avpEdgeMain");
    if(!el||!fab)return;
    el.classList.add("is-robot","is-walking");

    var box=fab.querySelector(".avp-bot");
    if(!box || !box.querySelector(".b25-body")){
      var wrap=document.createElement("span");
      wrap.className="avp-bot avp-bot-25d";
      wrap.innerHTML='<span class="b25-head"><i class="b25-eye l"></i><i class="b25-eye r"></i><i class="b25-smile"></i></span><span class="b25-arm l"></span><span class="b25-body">AVP</span><span class="b25-arm r"></span><span class="b25-leg l"></span><span class="b25-leg r"></span>';
      if(box) box.replaceWith(wrap); else fab.insertBefore(wrap, fab.firstChild);
    }

    var talk=document.getElementById("avpBotTalk");
    if(!talk){
      talk=document.createElement("div");
      talk.id="avpBotTalk";
      el.appendChild(talk);
    }
    var lines=["Xin chào!","Học Excel vui nhé","Đi từng bước thôi","Chúc bạn học tốt"];
    var li=0, talkOn=localStorage.getItem("avp_bot_chat")!=="off";
    function hideTalk(){talk.classList.remove("show");}
    function showTalk(){
      if(!talkOn || el.classList.contains("open") || el.classList.contains("is-lifted")){hideTalk();return;}
      talk.textContent=lines[li%lines.length];
      talk.classList.add("show");
    }
    showTalk();
    setInterval(function(){
      li++;
      showTalk();
      setTimeout(hideTalk,2200);
    },5200);

    var legs=el.querySelectorAll(".b25-leg");
    var arms=el.querySelectorAll(".b25-arm");
    var x=16,dir=1,phase=0,lift=false,sy=null,sx=null,moved=false;

    function place(bottom){
      el.style.setProperty("left","0px","important");
      el.style.setProperty("right","auto","important");
      el.style.setProperty("top","auto","important");
      el.style.setProperty("bottom",(bottom==null?10:bottom)+"px","important");
      el.style.setProperty("transform","translateX("+x+"px)","important");
    }

    function tick(){
      var open=el.classList.contains("open");
      if(!open && !lift){
        el.classList.add("is-walking");
        x+=dir*2.2;
        var max=Math.max(20,(window.innerWidth||400)-86);
        if(x>=max){x=max;dir=-1;el.classList.add("face-left");}
        if(x<=12){x=12;dir=1;el.classList.remove("face-left");}
        place(10);
        phase+=0.28;
        var s=Math.sin(phase)*18;
        if(legs[0])legs[0].style.transform="rotate("+s+"deg)";
        if(legs[1])legs[1].style.transform="rotate("+(-s)+"deg)";
        if(arms[0])arms[0].style.transform="rotate("+(-s)+"deg)";
        if(arms[1])arms[1].style.transform="rotate("+s+"deg)";
      }else if(open && !lift){
        phase+=0.35;
        if(arms[1])arms[1].style.transform="rotate("+(-20+Math.sin(phase)*48)+"deg)";
        if(arms[0])arms[0].style.transform="rotate(8deg)";
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    fab.addEventListener("pointerdown",function(e){
      if(e.target.closest && e.target.closest(".avp-edge-menu"))return;
      if(e.button!=null && e.button!==0)return;
      sy=e.clientY;sx=e.clientX;moved=false;lift=false;
    });
    window.addEventListener("pointermove",function(e){
      if(sy==null)return;
      var dy=sy-e.clientY,dist=Math.hypot(e.clientX-sx,e.clientY-sy);
      if(dy>26 && dist>26){
        lift=true;moved=true;
        el.classList.add("is-lifted","is-crying");
        el.classList.remove("is-walking","open","is-greeting");
        var menu=document.getElementById("avpEdgeMenu");
        if(menu)menu.hidden=true;
        hideTalk();
        place(Math.max(10,window.innerHeight-e.clientY-40));
      }
    });
    window.addEventListener("pointerup",function(){
      sy=null;
      if(lift){
        lift=false;
        el.classList.remove("is-lifted","is-crying");
        el.classList.add("is-walking");
        place(10);
      }
    });
    fab.addEventListener("click",function(e){
      if(moved||lift)return;
      if(e.target.closest && e.target.closest(".avp-edge-menu"))return;
      var menu=document.getElementById("avpEdgeMenu");
      if(window.setAvpEdgeMenu) window.setAvpEdgeMenu(menu && menu.hidden);
    });
  });
})();
