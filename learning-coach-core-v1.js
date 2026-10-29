(() => {
  'use strict';
  if (window.AVPLearningCoach) return;
  const KEYS={profile:'avp_coach_profile_v1',mistakes:'avp_coach_mistakes_v1',daily:'avp_coach_daily_v1',cases:'avp_coach_cases_v1',learner:'avp_coach_learner_id'};
  const SKILLS={
    foundation:{name:'Nền tảng Excel'},
    cleaning:{name:'Dữ liệu & Làm sạch'},
    formula:{name:'Công thức & Tra cứu'},
    analysis:{name:'Phân tích & Báo cáo'},
    dashboard:{name:'Dashboard'},
    powerquery:{name:'Power Query'},
    vba:{name:'Macro / VBA'},
    workflow:{name:'Workflow & Case'}
  };
  const TOPIC_TO_SKILL={shortcuts:'foundation','basic-functions':'foundation','excel-table':'analysis',conditional:'formula',lookup:'formula',text:'cleaning','date-time':'formula','dynamic-array':'formula',cleaning:'cleaning',pivot:'analysis',dashboard:'dashboard','power-query':'powerquery',vba:'vba',workflow:'workflow'};
  const read=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return v==null?fallback:v}catch(_){return fallback}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch(_){}return value};
  const norm=v=>String(v??'').trim();
  const safeId=v=>norm(v).toLowerCase().replace(/[^a-z0-9_-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80);
  function localDate(){const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)}
  function authUserId(){
    try{
      if(window.AVPAuthUser?.id)return String(window.AVPAuthUser.id);
      if(window.__AVP_USER_ID__)return String(window.__AVP_USER_ID__);
      for(const key of Object.keys(localStorage)){
        if(!key.startsWith('sb-')||!key.includes('auth-token'))continue;
        const raw=JSON.parse(localStorage.getItem(key)||'null');
        const id=raw?.user?.id||raw?.currentSession?.user?.id||raw?.currentUser?.id;
        if(id)return String(id);
      }
    }catch(_){}
    return '';
  }
  function getLearnerId(){
    const auth=authUserId();if(auth)return 'u:'+auth;
    let id='';try{id=localStorage.getItem(KEYS.learner)||''}catch(_){}
    if(!id){id=(crypto.randomUUID&&crypto.randomUUID())||('g-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10));try{localStorage.setItem(KEYS.learner,id)}catch(_){}}
    return 'g:'+id;
  }
  function getProfile(){return read(KEYS.profile,null)}
  function setProfile(profile){return write(KEYS.profile,{...profile,updatedAt:new Date().toISOString()})}
  function resetProfile(){try{localStorage.removeItem(KEYS.profile)}catch(_){}}
  function getMistakes(){const rows=read(KEYS.mistakes,[]);return Array.isArray(rows)?rows.sort((a,b)=>new Date(b.lastAt||0)-new Date(a.lastAt||0)):[]}
  function logMistake(input={}){
    const skill=input.skill||TOPIC_TO_SKILL[input.topic]||'foundation';
    const concept=norm(input.concept||input.conceptId||input.correct||input.prompt||'mistake');
    const id=safeId((input.source||'web')+'-'+skill+'-'+concept)||('mistake-'+Date.now());
    const rows=getMistakes(),idx=rows.findIndex(x=>x.id===id),now=new Date().toISOString();
    const row={id,source:norm(input.source||'web'),skill,topic:norm(input.topic),concept,prompt:norm(input.prompt),correct:norm(input.correct),chosen:norm(input.chosen),explain:norm(input.explain),url:norm(input.url),count:1,resolved:false,firstAt:now,lastAt:now};
    if(idx>=0){const old=rows[idx];rows[idx]={...old,...row,count:(Number(old.count)||0)+1,firstAt:old.firstAt||now,lastAt:now,resolved:false}}
    else rows.unshift(row);
    write(KEYS.mistakes,rows.slice(0,120));window.dispatchEvent(new CustomEvent('avp:coach-mistakes-changed'));return row;
  }
  function resolveMistake(id,resolved=true){
    const rows=getMistakes(),row=rows.find(x=>x.id===id);
    if(row){row.resolved=!!resolved;row.resolvedAt=resolved?new Date().toISOString():null;write(KEYS.mistakes,rows)}
    window.dispatchEvent(new CustomEvent('avp:coach-mistakes-changed'));return row||null;
  }
  function clearResolved(){write(KEYS.mistakes,getMistakes().filter(x=>!x.resolved))}
  function unresolvedMistakes(){return getMistakes().filter(x=>!x.resolved)}
  function getDaily(){return read(KEYS.daily,{})}
  function markDaily(date,data={}){
    const all=getDaily();all[date]={...(all[date]||{}),...data,updatedAt:new Date().toISOString()};
    const keys=Object.keys(all).sort().slice(-90),trimmed={};keys.forEach(k=>{trimmed[k]=all[k]});write(KEYS.daily,trimmed);return trimmed[date];
  }
  function getCases(){return read(KEYS.cases,{})}
  function markCase(id,data={}){const all=getCases();all[id]={...(all[id]||{}),...data,updatedAt:new Date().toISOString()};write(KEYS.cases,all);return all[id]}
  function skillMeta(skill){return SKILLS[skill]||SKILLS.foundation}
  function skillFromTopic(topic){return TOPIC_TO_SKILL[topic]||'foundation'}
  window.AVPLearningCoach=Object.freeze({version:'coach-v2-one-daily',KEYS,SKILLS,TOPIC_TO_SKILL,getProfile,setProfile,resetProfile,getMistakes,logMistake,resolveMistake,clearResolved,unresolvedMistakes,getDaily,markDaily,getCases,markCase,skillMeta,skillFromTopic,localDate,getLearnerId});
})();