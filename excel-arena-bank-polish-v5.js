(()=>{
  "use strict";
  const B=window.AVPArenaBank;
  if(!B?.concepts?.length||!B?.questions?.length)return;

  const byTopic=new Map();
  B.concepts.forEach((c,i)=>{
    c.__arenaOrder=i;
    c.__arenaOriginalDifficulty=Number(c.difficulty)||1;
    if(!byTopic.has(c.topic))byTopic.set(c.topic,[]);
    byTopic.get(c.topic).push(c);
  });

  const advancedTopics=new Set(["dynamic-array","power-query","vba","workflow"]);
  const force={
    "CTRL+C":1,"CTRL+V":1,"CTRL+Z":1,"SUM":1,"AVERAGE":1,"MAX":1,"MIN":1,"COUNT":1,
    "IF":1,"LEFT":1,"RIGHT":1,"LEN":1,"TODAY":1,"NOW":1,
    "XLOOKUP":2,"VLOOKUP":2,"IFS":2,"SUMIFS":2,"COUNTIFS":3,"F4":2,"CTRL+1":2,"ALT+=":2,"ALT+ENTER":2,
    "INDEX":3,"MATCH":3,"FILTER":3,"TEXTJOIN":3,"NETWORKDAYS":3,"DATEDIF":3,
    "XMATCH":4,"INDEX+MATCH":4,"OFFSET":4,"AGGREGATE":4,"SUMPRODUCT":4,"INDIRECT":5
  };

  byTopic.forEach((list,topic)=>{
    const sorted=list.slice().sort((a,b)=>
      (a.__arenaOriginalDifficulty-b.__arenaOriginalDifficulty)||
      (a.__arenaOrder-b.__arenaOrder)
    );
    const n=sorted.length;
    const d1=Math.max(advancedTopics.has(topic)?2:3,Math.ceil(n*(advancedTopics.has(topic)?.18:.28)));
    const d2=Math.max(2,Math.ceil(n*.26));
    const d3=Math.max(2,Math.ceil(n*.22));
    const d4=Math.max(1,Math.ceil(n*.15));
    sorted.forEach((c,i)=>{
      let d=i<d1?1:i<d1+d2?2:i<d1+d2+d3?3:i<d1+d2+d3+d4?4:5;
      if(Object.prototype.hasOwnProperty.call(force,c.answer))d=force[c.answer];
      c.difficulty=Math.max(1,Math.min(5,d));
    });
  });

  const conceptMap=new Map(B.concepts.map(c=>[c.id,c]));
  const groupIndex=new Map();
  const compact=s=>String(s||"").replace(/\s+/g," ").replace(/\s+([,.!?;:])/g,"$1").trim();
  const sentence=s=>{
    s=compact(s);
    if(!s)return "Chọn đáp án phù hợp nhất.";
    return /[.!?]$/.test(s)?s:`${s}.`;
  };

  B.questions.forEach(q=>{
    const c=conceptMap.get(q.conceptId);
    if(!c)return;
    const idx=groupIndex.get(c.id)||0;
    groupIndex.set(c.id,idx+1);
    q.difficulty=c.difficulty;

    const meaning=compact(c.meaning);
    const scenario=sentence(c.scenario);
    const boss=!!q.boss;

    if(boss){
      q.prompt=`${scenario} Chọn đáp án phù hợp nhất.`;
    }else if(idx%3===0){
      q.prompt=`Đâu là lựa chọn để ${meaning}?`;
    }else if(idx%3===1){
      q.prompt=scenario;
    }else{
      q.prompt=`Bạn muốn ${meaning}. Chọn đáp án đúng.`;
    }
  });

  B.concepts.forEach(c=>{
    delete c.__arenaOrder;
    delete c.__arenaOriginalDifficulty;
  });
})();
