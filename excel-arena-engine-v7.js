(()=>{
  "use strict";
  const B=window.AVPArenaBank,$=id=>document.getElementById(id),qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const LEVELS=["Tân binh","Nền tảng","Vận dụng","Nâng cao","Pro","Master"];
  const DIFF_LABELS=["Cơ bản","Nền tảng","Vận dụng","Nâng cao","Chuyên sâu"];
  const MAX_DIFF=[1,2,3,4,5,5],LETTERS=["A","B","C","D"];
  const byConcept=new Map(),conceptById=new Map(),byTopic=new Map();

  (B?.concepts||[]).forEach(c=>{
    conceptById.set(c.id,c);
    if(!byTopic.has(c.topic))byTopic.set(c.topic,[]);
    byTopic.get(c.topic).push(c);
  });
  (B?.questions||[]).forEach(q=>{
    if(q.__arenaEnabled===false)return;
    if(!byConcept.has(q.conceptId))byConcept.set(q.conceptId,[]);
    byConcept.get(q.conceptId).push(q);
  });

  const activeQuestions=[...(B?.questions||[])].filter(q=>q.__arenaEnabled!==false);
  const S={mode:"learn",topic:"mixed",running:false,player:"",current:null,options:[],correctIndex:0,used:new Set(),usedConcept:new Set(),recent:[],persist:[],retry:[],recentFamilies:[],recentTopics:[],seq:0,correct:0,wrong:0,score:0,combo:0,bestCombo:0,lives:3,level:1,cycle:1,raf:0,start:0,duration:18000,locked:false,hiddenAt:0,slotBag:[],lastSlot:-1,boardRows:[]};

  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const norm=s=>String(s||"").trim().toUpperCase().replace(/\s+/g," ");
  function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function meta(id){return id==="mixed"?{id:"mixed",icon:"🔥",name:"Tổng hợp Excel",desc:"Tất cả chủ đề"}:B.topics.find(t=>t.id===id)||{id,icon:"⚡",name:id,desc:""}}
  function concepts(topic=S.topic){return topic==="mixed"?(B.concepts||[]):(byTopic.get(topic)||[])}
  function conceptCount(topic=S.topic){return concepts(topic).length}
  function familyKey(c){return c?.family||`answer:${norm(c?.answer)}`}

  function stageForSeq(seq){
    const n=Math.max(1,Number(seq)||1);
    if(S.topic==="mixed"){
      if(n<=8)return 1;
      if(n<=18)return 2;
      if(n<=30)return 3;
      if(n<=44)return 4;
      if(n<=60)return 5;
      return 6;
    }
    const list=concepts();
    let acc=0;
    for(let d=1;d<=5;d++){
      acc+=list.filter(c=>Number(c.difficulty)===d).length;
      if(n<=Math.max(1,acc))return d;
    }
    return 6;
  }
  function level(){return stageForSeq(S.seq)}
  function selectionLevel(){return stageForSeq(S.seq+1)}
  function maxDiffForSelection(){return MAX_DIFF[Math.min(selectionLevel()-1,MAX_DIFF.length-1)]||5}
  function eligible(c){if(!c||c.difficulty>maxDiffForSelection())return false;if(S.topic!=="mixed")return true;return selectionLevel()>=(c.mixedMinLevel||1)}
  function histKey(){return`avp_arena_s1_recent_${S.topic}`}
  function loadHist(){try{const x=JSON.parse(localStorage.getItem(histKey())||"[]");S.persist=Array.isArray(x)?x.filter(id=>conceptById.has(id)).slice(-120):[]}catch{S.persist=[]}}
  function remember(c){if(!c)return;const id=c.id,fam=familyKey(c);S.recent.push(id);if(S.recent.length>24)S.recent.shift();S.recentFamilies.push(fam);if(S.recentFamilies.length>10)S.recentFamilies.shift();S.recentTopics.push(c.topic);if(S.recentTopics.length>6)S.recentTopics.shift();S.persist=S.persist.filter(x=>x!==id);S.persist.push(id);S.persist=S.persist.slice(-120);try{localStorage.setItem(histKey(),JSON.stringify(S.persist))}catch{}}

  function chooseConcept(){
    let pool=concepts().filter(c=>eligible(c)&&!S.usedConcept.has(c.id));
    if(!pool.length){
      const allEligible=concepts().filter(eligible);
      const exhausted=allEligible.length>0&&allEligible.every(c=>S.usedConcept.has(c.id));
      if(exhausted){S.cycle++;S.usedConcept.clear();pool=allEligible}
    }
    if(!pool.length)return null;
    let f=pool.filter(c=>!S.recent.slice(-12).includes(c.id));if(f.length)pool=f;
    const old=new Set(S.persist.slice(-36));f=pool.filter(c=>!old.has(c.id));if(f.length>=2)pool=f;
    const recentFamilies=new Set(S.recentFamilies.slice(-6));f=pool.filter(c=>!recentFamilies.has(familyKey(c)));if(f.length>=2)pool=f;
    if(S.topic==="mixed"){const recentTopics=new Set(S.recentTopics.slice(-3));f=pool.filter(c=>!recentTopics.has(c.topic));if(f.length>=2)pool=f}
    return shuffle(pool)[0]||null;
  }

  function variant(c){const p=(byConcept.get(c.id)||[]).filter(q=>q.__arenaEnabled!==false);if(!p.length)return null;return p[0]||null}
  function pick(){
    if(S.mode==="learn"){
      const i=S.retry.findIndex(x=>x.due<=S.seq);
      if(i>=0){const item=S.retry[i],c=conceptById.get(item.id);if(c){const fam=familyKey(c),blocked=new Set(S.recentFamilies.slice(-4));if(!blocked.has(fam)){S.retry.splice(i,1);const q=variant(c);if(q){remember(c);return{...q,isRetry:true}}}else item.due+=2}}
    }
    const c=chooseConcept();if(!c)return null;const q=variant(c);if(!q)return null;const boss=S.mode==="rank"&&S.seq>0&&(S.seq+1)%10===0;S.usedConcept.add(c.id);S.used.add(q.id);remember(c);return boss?{...q,boss:true}:q;
  }

  function duration(q){if(S.mode==="learn")return 0;const d=Math.max(1,Math.min(5,Number(q.difficulty)||1));return Math.max(10000,20500-(S.level-1)*650-d*700)}
  function nextSlot(){if(!S.slotBag.length){let bag=shuffle([0,1,2,3]);if(bag[0]===S.lastSlot){const j=bag.findIndex(x=>x!==S.lastSlot);[bag[0],bag[j]]=[bag[j],bag[0]]}S.slotBag=bag}const slot=S.slotBag.shift();S.lastSlot=slot;return slot}
  function makeOptions(q){
    const correct=q.answer,current=conceptById.get(q.conceptId),currentFamily=familyKey(current);
    let pool=(byTopic.get(q.topic)||[]).filter(c=>c.id!==q.conceptId&&c.answer!==correct);
    pool=pool.filter(c=>c.difficulty<=Math.min(5,Math.max(2,(q.difficulty||1)+1)));
    const sameFamily=shuffle(pool.filter(c=>familyKey(c)===currentFamily)),otherFamily=shuffle(pool.filter(c=>familyKey(c)!==currentFamily)),chosen=[];
    if((q.difficulty||1)>=3&&sameFamily.length)chosen.push(sameFamily[0]);
    for(const c of otherFamily){if(!chosen.some(x=>x.answer===c.answer))chosen.push(c);if(chosen.length===3)break}
    if(chosen.length<3){for(const c of sameFamily){if(!chosen.some(x=>x.answer===c.answer))chosen.push(c);if(chosen.length===3)break}}
    if(chosen.length<3){for(const c of shuffle(B.concepts||[])){if(c.id!==q.conceptId&&c.answer!==correct&&!chosen.some(x=>x.answer===c.answer)){chosen.push(c);if(chosen.length===3)break}}}
    const slot=nextSlot(),opts=chosen.slice(0,3).map(c=>c.answer);opts.splice(slot,0,correct);return{opts,slot};
  }

  function initials(name){const p=String(name||"B").trim().split(/\s+/).filter(Boolean);return(p.length>1?(p[0][0]+p[p.length-1][0]):(p[0]?.[0]||"B")).toUpperCase()}
  function rankLabel(){const ahead=S.boardRows.filter(r=>!r.is_me&&Number(r.best_score||0)>S.score).length;return S.boardRows.length?`#${ahead+1} tạm`:`Season 1`}
  function hud(){S.level=level();$("hudLevel").textContent=S.level;$("hudTitle").textContent=LEVELS[S.level-1]||"Master";$("hudScore").textContent=S.score.toLocaleString("vi-VN");$("hudCombo").textContent=S.combo;$("hudAccuracy").textContent=`Đúng ${S.correct}`;$("hudQuestion").textContent=S.seq;$("hudPool").textContent=`${S.usedConcept.size}/${conceptCount()} · vòng ${S.cycle}`;$("hudLives").textContent=S.mode==="rank"?"❤️".repeat(Math.max(0,S.lives)):"∞";$("hudRank").textContent=S.mode==="rank"?rankLabel():"Học"}
  function fb(k,h){const e=$("arenaFeedback");e.className=`arena-feedback ${k||""}`.trim();e.innerHTML=h}
  function stopAnim(){if(S.raf)cancelAnimationFrame(S.raf);S.raf=0}
  function anim(now){if(S.mode!=="rank"||!S.running||S.locked||!S.current||document.hidden)return;const r=Math.max(0,1-(now-S.start)/S.duration);$("timerFill").style.width=`${r*100}%`;if(r<=0)return miss(null,"timeout");S.raf=requestAnimationFrame(anim)}
  function hintText(q){return `Nhóm ${meta(q.topic).name} · mức ${q.difficulty}/5. Đọc tình huống và chọn công cụ phù hợp nhất.`}
  function renderOptions(q){const made=makeOptions(q);S.options=made.opts;S.correctIndex=made.slot;$("answerGrid").innerHTML=S.options.map((a,i)=>`<button type="button" class="answer-option" data-answer-index="${i}"><span class="answer-letter">${LETTERS[i]}</span><span class="answer-copy"><strong>${esc(a)}</strong><small>Đáp án ${LETTERS[i]}</small></span></button>`).join("");qa(".answer-option",$("answerGrid")).forEach(b=>b.addEventListener("click",()=>choose(Number(b.dataset.answerIndex))))}
  function render(q){if(!q)return end("Không còn nội dung phù hợp ở mức hiện tại.");S.current=q;S.locked=false;S.seq++;S.level=level();S.duration=duration(q);S.start=performance.now();const d=Math.max(1,Math.min(5,Number(q.difficulty)||1));$("questionDifficulty").textContent=`Mức ${d} · ${DIFF_LABELS[d-1]}`;$("questionTopic").textContent=meta(q.topic).name;$("bossBadge").hidden=!q.boss;$("roundBadge").textContent=q.isRetry?"ÔN LẠI":`ROUND ${S.seq}`;$("questionPrompt").textContent=q.prompt;$("questionHint").querySelector("p").textContent=hintText(q);renderOptions(q);fb("",q.isRetry?"↻ Nội dung này đang được ôn lại sau khoảng nghỉ.":q.boss?"⚠ Boss Round · điểm thưởng cao hơn.":S.mode==="learn"?"Chọn đáp án rồi đọc phần Ghi nhớ trước khi sang câu tiếp theo.":"Chọn đáp án trước khi hết thời gian.");hud();updateRace();$("timerFill").style.width="100%";stopAnim();if(S.mode==="rank")S.raf=requestAnimationFrame(anim)}
  function retry(q){if(S.mode!=="learn"||!q?.conceptId||S.retry.some(x=>x.id===q.conceptId))return;S.retry.push({id:q.conceptId,due:S.seq+7+Math.floor(Math.random()*5)})}
  function later(ms){setTimeout(()=>{if(S.running)render(pick())},ms)}
  function showLearnNext(){const e=$("arenaFeedback");if(!e)return;const b=document.createElement("button");b.type="button";b.className="arena-learn-next";b.textContent="Tiếp tục →";b.addEventListener("click",()=>{if(S.running)render(pick())},{once:true});e.appendChild(b)}
  function points(q){const tr=S.mode==="rank"?Math.max(0,1-(performance.now()-S.start)/S.duration):.55,base=110*Math.max(1,q.difficulty||1),combo=Math.min(1.85,1+S.combo*.045),boss=q.boss?1.5:1;return Math.round((base+110*tr)*combo*boss)}
  function lockAnswers(selected){qa(".answer-option",$("answerGrid")).forEach((b,i)=>{b.disabled=true;if(i===S.correctIndex)b.classList.add("is-correct");if(selected!==null&&i===selected&&i!==S.correctIndex)b.classList.add("is-wrong")})}
  function flashRace(kind){const tr=$("raceTrack");if(!tr)return;tr.classList.remove("is-boost","is-hit");void tr.offsetWidth;tr.classList.add(kind==="good"?"is-boost":"is-hit");setTimeout(()=>tr.classList.remove("is-boost","is-hit"),500)}
  function choose(index){if(!S.running||S.locked||!S.current)return;if(index===S.correctIndex)correct(index);else miss(index,"wrong")}
  function lesson(q){return `<span class="arena-learn-note"><strong>Ghi nhớ:</strong> ${esc(q.learningNote||`${q.answer} — ${q.meaning}.`)}<br><strong>Dùng khi:</strong> ${esc(q.scenario||q.prompt)}</span>`}
  function correct(index){S.locked=true;stopAnim();lockAnswers(index);const q=S.current;S.correct++;S.combo++;S.bestCombo=Math.max(S.bestCombo,S.combo);const p=points(q);S.score+=p;flashRace("good");fb("good",`<strong>ĐÚNG · +${p}</strong><br>${lesson(q)}${S.combo>=3?`<br><span>Combo x${S.combo}</span>`:""}`);hud();updateRace();if(S.mode==="learn")showLearnNext();else later(q.boss?1300:950)}
  function miss(index,reason){if(S.locked||!S.current)return;S.locked=true;stopAnim();lockAnswers(index);const q=S.current;S.wrong++;S.combo=0;retry(q);if(S.mode==="rank")S.lives--;flashRace("bad");fb("bad",`<strong>${reason==="timeout"?"HẾT GIỜ":"CHƯA ĐÚNG"} · ${esc(q.answer)}</strong><br>${lesson(q)}${S.mode==="learn"?"<br><span>Nội dung này sẽ được ôn lại sau.</span>":""}`);hud();updateRace();if(S.mode==="rank"&&S.lives<=0)setTimeout(()=>end("Hết 3 mạng."),1500);else if(S.mode==="learn")showLearnNext();else later(1350)}

  async function client(timeout=5500){const t=Date.now();while(Date.now()-t<timeout){const c=window.avpSupabase||window.supabaseClient;if(c)return c;await new Promise(r=>setTimeout(r,80))}return window.avpSupabase||window.supabaseClient||null}
  async function session(){const c=await client();if(!c?.auth)return{c:null,u:null};try{const{data}=await c.auth.getSession();return{c,u:data?.session?.user||null}}catch{return{c:null,u:null}}}
  async function identity(){const{c,u}=await session();if(!u){S.player="";$("playerName").textContent="Chưa đăng nhập";$("loginMessage").textContent="Đăng nhập để chơi và ghi thành tích Rank.";return false}let n=u.user_metadata?.display_name||u.user_metadata?.full_name||u.email?.split("@")[0]||"Học viên";try{const{data,error}=await c.rpc("arena_identity_v1");if(!error&&data?.player_name)n=String(data.player_name)}catch{}S.player=n;$("playerName").textContent=n;$("playerInitial").textContent=initials(n);$("playerRaceName").textContent=n;$("loginMessage").textContent="Season 1 · BXH cũ đã reset.";return true}
  async function fetchRaceRows(topic=S.topic){const c=await client();if(!c?.rpc){S.boardRows=[];updateRace();return[]}try{const{data,error}=await c.rpc("arena_list_leaderboard_v1",{p_topic:topic,p_limit:100});if(error)throw error;S.boardRows=Array.isArray(data)?data:[];updateRace();return S.boardRows}catch(e){console.warn("[arena] race rows",e);S.boardRows=[];updateRace();return[]}}
  function fallbackRivals(){const base=Math.max(400,Math.ceil((S.score+250)/250)*250);return[0,1,2].map((_,i)=>({rank_no:"MỐC",player_name:`Mốc ${base+(i+1)*250}`,score:base+(i+1)*250,ghost:true}))}
  function updateRace(){const all=S.boardRows.filter(r=>!r.is_me).map(r=>({...r,score:Number(r.best_score||0)}));const ahead=all.filter(r=>r.score>S.score).sort((a,b)=>a.score-b.score);let rivals=ahead.slice(0,3);if(rivals.length<3){const behind=all.filter(r=>!rivals.includes(r)).sort((a,b)=>b.score-a.score);rivals=rivals.concat(behind.slice(0,3-rivals.length))}if(!rivals.length)rivals=fallbackRivals();const realNearest=ahead[0]||null;const target=Math.max(S.score+300,realNearest?.score||0,...rivals.map(r=>r.score||0),800);const cap=Math.ceil(target/100)*100;const pct=v=>Math.max(6,Math.min(92,6+(Number(v||0)/cap)*86));$("playerRacer").style.setProperty("--x",`${pct(S.score)}%`);$("playerRaceScore").textContent=S.score.toLocaleString("vi-VN");$("raceProgress").style.width=`${Math.min(100,(S.score/cap)*100)}%`;$("raceScale").textContent=`0 → ${cap.toLocaleString("vi-VN")}`;$("raceChase").textContent=realNearest?`Còn ${(realNearest.score-S.score).toLocaleString("vi-VN")} điểm tới #${realNearest.rank_no} ${realNearest.player_name}`:(all.length?"Bạn đang vượt nhóm đối thủ đang hiển thị.":"Chưa có người chơi khác · các mốc luyện tập đang hiển thị.");const lanes=[22,42,62];$("rivalLayer").innerHTML=rivals.map((r,i)=>`<div class="racer ${r.ghost?"racer-ghost":"racer-rival"}" style="--x:${pct(r.score)}%;--lane:${lanes[i]||22}%"><div class="racer-core"><span class="racer-avatar">${r.ghost?"•":esc(initials(r.player_name))}</span></div><div class="racer-label"><strong>${r.ghost?esc(r.player_name):`#${esc(r.rank_no)} ${esc(r.player_name)}`}</strong><small>${Number(r.score||0).toLocaleString("vi-VN")}</small></div></div>`).join("");hud()}
  async function submit(){if(S.mode!=="rank"||!S.player||S.score<=0)return;const c=await client();if(!c?.rpc)return;try{const{error}=await c.rpc("arena_submit_score_v1",{p_topic:S.topic,p_score:S.score,p_level:S.level,p_perfect_streak:S.bestCombo,p_correct_count:S.correct});if(error)throw error}catch(e){console.warn("[arena] submit",e);fb("warn","Điểm trên máy đã giữ, nhưng chưa đồng bộ được BXH.")}}
  function saveBest(){try{const k=`avp_arena_s1_best_${S.topic}`,o=Number(localStorage.getItem(k)||0);if(S.score>o)localStorage.setItem(k,String(S.score))}catch{}}
  async function end(reason="Đã dừng lượt chơi."){if(!S.running)return;S.running=false;S.locked=true;stopAnim();saveBest();if(S.mode==="rank")await submit();fb("warn",`<strong>${esc(reason)}</strong> ${S.mode==="rank"?"Rank":"Học"} kết thúc với ${S.score.toLocaleString("vi-VN")} điểm · ${S.correct} câu đúng · combo tốt nhất ${S.bestCombo}.`);$("stopArena").textContent="Đã dừng";$("stopArena").disabled=true;board(S.topic)}
  function reset(){stopAnim();Object.assign(S,{running:true,current:null,retry:[],recent:[],recentFamilies:[],recentTopics:[],seq:0,correct:0,wrong:0,score:0,combo:0,bestCombo:0,lives:3,level:1,cycle:1,locked:false,hiddenAt:0,slotBag:[],lastSlot:-1});S.used=new Set();S.usedConcept=new Set();loadHist();$("stopArena").textContent="Dừng";$("stopArena").disabled=false}
  async function start(){if(!activeQuestions.length||!B?.concepts?.length)return $("setupHint").textContent="Không tải được ngân hàng câu hỏi.";if(!await identity())return $("setupHint").textContent="Bạn cần đăng nhập trước khi vào Arena.";reset();document.body.classList.add("arena-playing");$("arenaSetup").hidden=true;$("arenaGame").hidden=false;$("currentMode").textContent=S.mode==="rank"?"RANK · 3 MẠNG":"HỌC";$("currentTopic").textContent=meta(S.topic).name;$("boardTopic").value=S.topic;hud();render(pick());fetchRaceRows(S.topic);window.scrollTo({top:0,behavior:"smooth"})}
  async function setup(){if(S.running)await end("Bạn đã rời lượt chơi.");document.body.classList.remove("arena-playing");$("arenaGame").hidden=true;$("arenaSetup").hidden=false;$("arenaSetup").scrollIntoView({behavior:"smooth",block:"start"})}
  function topics(){const r=$("topicGrid"),cards=[{id:"mixed",icon:"🔥",name:"Tổng hợp Excel",desc:"Đi từ nền tảng rồi mới mở nội dung khó",count:activeQuestions.length,concepts:B.concepts.length},...B.topics.map(t=>({...t,count:activeQuestions.filter(q=>q.topic===t.id).length,concepts:conceptCount(t.id)}))];r.innerHTML=cards.map(t=>`<button type="button" class="topic-card ${t.id==="mixed"?"mixed is-selected":""}" data-topic="${esc(t.id)}"><span class="topic-icon">${esc(t.icon)}</span><strong>${esc(t.name)}</strong><small>${esc(t.desc)}</small><em>${t.concepts} nội dung</em></button>`).join("");qa(".topic-card",r).forEach(b=>b.addEventListener("click",()=>{qa(".topic-card",r).forEach(x=>x.classList.remove("is-selected"));b.classList.add("is-selected");S.topic=b.dataset.topic||"mixed";$("boardTopic").value=S.topic;loadHist();board(S.topic)}))}
  function boardOptions(){const s=$("boardTopic");s.innerHTML=[{id:"mixed",name:"Tổng hợp Excel"},...B.topics].map(t=>`<option value="${esc(t.id)}">${esc(t.name)}</option>`).join("");s.value=S.topic}
  async function board(topic=$("boardTopic")?.value||"mixed"){const l=$("boardList");l.innerHTML="<li>Đang tải BXH Season 1…</li>";const c=await client();if(!c?.rpc)return l.innerHTML="<li>Chưa kết nối được BXH.</li>";try{const{data,error}=await c.rpc("arena_list_leaderboard_v1",{p_topic:topic,p_limit:100});if(error)throw error;const rows=Array.isArray(data)?data:[];if(!rows.length)return l.innerHTML="<li>Chưa có thành tích Rank ở chủ đề này. Bạn có thể là người đầu tiên.</li>";l.innerHTML=rows.map(x=>`<li class="${x.is_me?"is-me":""}"><span class="rank">#${x.rank_no}</span><span class="name">${esc(x.player_name)}${x.is_me?" · Bạn":""}</span><span class="score">${Number(x.best_score||0).toLocaleString("vi-VN")}</span><span class="level">Lv ${x.best_level||1}</span></li>`).join("")}catch(e){console.warn("[arena] board",e);l.innerHTML="<li>BXH đang tạm thời không tải được.</li>"}}
  function bind(){qa(".mode-card").forEach(b=>b.addEventListener("click",()=>{qa(".mode-card").forEach(x=>x.classList.remove("is-selected"));b.classList.add("is-selected");S.mode=b.dataset.mode==="rank"?"rank":"learn"}));$("startArena").addEventListener("click",start);$("backSetup").addEventListener("click",setup);$("stopArena").addEventListener("click",()=>end("Bạn đã dừng lượt chơi."));$("boardTopic").addEventListener("change",e=>board(e.target.value));$("refreshBoard").addEventListener("click",()=>board());document.addEventListener("keydown",e=>{if(!S.running||S.locked)return;const k=e.key.toLowerCase();const i=k==="a"?0:k==="b"?1:k==="c"?2:k==="d"?3:-1;if(i>=0){e.preventDefault();choose(i)}});document.addEventListener("visibilitychange",()=>{if(S.mode!=="rank"||!S.running||S.locked)return;if(document.hidden){S.hiddenAt=performance.now();stopAnim()}else if(S.hiddenAt){S.start+=performance.now()-S.hiddenAt;S.hiddenAt=0;S.raf=requestAnimationFrame(anim)}});window.addEventListener("pagehide",stopAnim,{once:true})}
  async function boot(){if(!activeQuestions.length||!B?.concepts?.length)return $("setupHint").textContent="Không tải được ngân hàng câu hỏi.";$("bankCount").textContent=activeQuestions.length.toLocaleString("vi-VN");$("topicCount").textContent=B.topics.length;$("setupHint").textContent="Chọn chế độ và chủ đề để bắt đầu.";loadHist();topics();boardOptions();bind();identity();board("mixed")}
  document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();
})();