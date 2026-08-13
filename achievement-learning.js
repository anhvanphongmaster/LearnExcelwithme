(() => {
  const $=id=>document.getElementById(id);

  function read(key,fallback){
    try{
      const raw=localStorage.getItem(key);
      return raw===null ? fallback : JSON.parse(raw);
    }catch{
      return fallback;
    }
  }

  function uniqueCount(arr){
    return Array.isArray(arr) ? new Set(arr.map(Number)).size : 0;
  }

  function setText(id,value){
    const el=$(id);
    if(el) el.textContent=value;
  }

  function setBar(id,current,total){
    const el=$(id);
    if(el) el.style.width=`${Math.min(100,total ? current/total*100 : 0)}%`;
  }

  function render(){
    const courses=read("completedCourses",[]);
    const playground=read("avp_playground_progress_v1",{});
    const challenge=read("avp_excel_challenge_stats_v1",{});
    const roadmap=read("avpLearningPath30",[]);
    const quiz=Math.min(5,Number(localStorage.getItem("quizBestScore")||0)||0);
    const bonus=Number(localStorage.getItem("avp_bonus_xp_v1")||0)||0;

    const courseDone=Math.min(6,uniqueCount(courses));
    const pgDone=Math.min(10,Object.values(playground||{}).filter(Boolean).length);
    const challengeDone=Math.min(28,uniqueCount(challenge.correctUnique));
    const roadmapDone=Math.min(30,uniqueCount(roadmap));

    const challengeXP=challengeDone*5;
    const roadmapXP=roadmapDone*15;
    const xp=courseDone*20 + pgDone*10 + quiz*10 + bonus + challengeXP + roadmapXP;
    const level=Math.floor(xp/100)+1;

    setText("hubXp",xp);
    setText("hubLevel",`Level ${level}`);
    setText("hubCourses",`${courseDone}/6`);
    setText("hubPlayground",`${pgDone}/10`);
    setText("hubChallenge",`${challengeDone}/28`);
    setText("hubRoadmap",`${roadmapDone}/30`);
    setText("hubQuiz",`${quiz}/5`);

    setText("courseProgressText",`${courseDone}/6`);
    setText("playgroundProgressText",`${pgDone}/10`);
    setText("challengeProgressText",`${challengeDone}/28`);
    setText("roadmapProgressText",`${roadmapDone}/30`);
    setText("quizProgressText",`${quiz}/5`);

    setBar("courseProgressBar",courseDone,6);
    setBar("playgroundProgressBar",pgDone,10);
    setBar("challengeProgressBar",challengeDone,28);
    setBar("roadmapProgressBar",roadmapDone,30);
    setBar("quizProgressBar",quiz,5);
  }

  document.addEventListener("DOMContentLoaded",render);
  window.addEventListener("avp:cloud-progress-loaded",render);
  window.addEventListener("avp:challenge-updated",render);
  window.addEventListener("storage",render);
})();
