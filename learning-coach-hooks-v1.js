(() => {
  'use strict';
  const C=window.AVPLearningCoach;if(!C)return;

  function text(el){return String(el?.textContent||'').trim()}
  function currentLesson(){try{return new URLSearchParams(location.search).get('lesson')||''}catch{return''}}
  function lessonSkill(id){
    const moduleId=window.AVPLearningPlatform?.lessonToModule?.get?.(id)||'';
    return ({
      'excel-foundation':'foundation','data-cleaning':'cleaning','formula-lookup':'formula',
      'analysis-reporting':'analysis','dashboard-visual':'dashboard','power-query':'powerquery',
      'vba-optimization':'vba','workflow-cases':'workflow'
    })[moduleId]||'foundation';
  }

  document.addEventListener('click',e=>{
    const kv=e.target.closest?.('.kv-option');
    if(kv){
      setTimeout(()=>{
        if(!kv.classList.contains('wrong'))return;
        const card=kv.closest('.kv-question');
        const options=[...(card?.querySelectorAll('.kv-option')||[])];
        const correct=options.find(x=>x.classList.contains('correct'));
        const feedback=card?.querySelector('.kv-feedback');
        const lessonId=currentLesson();
        C.logMistake({
          source:'knowledge',
          skill:lessonSkill(lessonId),
          concept:`lesson-${lessonId}-q${card?.dataset.question||'0'}`,
          prompt:text(card?.querySelector('.kv-q-text')),
          correct:text(correct),
          chosen:text(kv),
          explain:text(feedback),
          lessonId,
          url:location.href
        });
      },0);
      return;
    }

    const arena=e.target.closest?.('.answer-option');
    if(arena){
      setTimeout(()=>{
        if(!arena.classList.contains('is-wrong'))return;
        const correct=document.querySelector('.answer-option.is-correct');
        const topic=text(document.getElementById('questionTopic'));
        const topicMap={
          'Phím tắt':'shortcuts','Hàm cơ bản':'basic-functions','Logic & điều kiện':'conditional','Tra cứu':'lookup',
          'Text':'text','Ngày & thời gian':'date-time','Dynamic Array':'dynamic-array','Làm sạch dữ liệu':'cleaning',
          'Excel Table':'excel-table','Pivot & phân tích':'pivot','Dashboard & biểu đồ':'dashboard','Power Query':'power-query',
          'Macro / VBA':'vba','Workflow & kiểm soát':'workflow'
        };
        const topicId=topicMap[topic]||'';
        C.logMistake({
          source:'arena',
          topic:topicId,
          concept:text(correct?.querySelector('strong'))||text(correct),
          prompt:text(document.getElementById('questionPrompt')),
          correct:text(correct?.querySelector('strong'))||text(correct),
          chosen:text(arena.querySelector('strong'))||text(arena),
          explain:text(document.getElementById('arenaFeedback')),
          url:location.href
        });
      },0);
    }
  },false);
})();
