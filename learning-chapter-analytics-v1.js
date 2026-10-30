/* Learning analytics for the 12-chapter curriculum.
   Stable chapter/lesson IDs let unfinished chapters join the same ranking later. */
(function(){
 'use strict';
 var page=(location.pathname.split('/').filter(Boolean).pop()||'learning-chapter.html').toLowerCase();
 var match=page.match(/^learning-chapter(?:-(\d+))?\.html$/);
 if(!match)return;
 var chapterNo=match[1]?Number(match[1]):1;
 if(chapterNo<1||chapterNo>12)return;
 var chapterTitles=[
  'Nhập môn Excel','Thao tác và phím tắt Excel','Nền tảng công thức Excel',
  'Hàm Excel từ cơ bản đến nâng cao','Công cụ xử lý dữ liệu trên Ribbon',
  'Tổ chức và kiểm soát dữ liệu','PivotTable và PivotChart',
  'Biểu đồ và Dashboard','Power Query','Phân tích dữ liệu',
  'Tự động hóa Excel','Quy trình báo cáo doanh nghiệp'
 ];
 var chapterId='chapter-'+String(chapterNo).padStart(2,'0');
 var chapterTitle=chapterTitles[chapterNo-1];
 var root=document.querySelector('[data-avp-chapter-id],main,.c1-wrap')||document.body;
 root.setAttribute('data-avp-chapter-id',chapterId);
 root.setAttribute('data-avp-chapter-title',chapterTitle);

 function track(name,meta){
  if(!window.avpAnalytics||typeof window.avpAnalytics.track!=='function')return;
  window.avpAnalytics.track(name,{
   page:page,
   tool_name:meta.content_title,
   metadata:meta
  });
 }
 function safeText(node,limit){
  return String(node&&node.textContent||'').replace(/\s+/g,' ').trim().slice(0,limit||120);
 }
 function bind(){
  var articles=[...document.querySelectorAll('.c1-lesson,[data-avp-lesson]')];
  var details=[...document.querySelectorAll('.c1-detail,details[data-avp-lesson-id]')];
  details.forEach(function(detail,index){
   if(detail.dataset.avpLearningBound==='1')return;
   detail.dataset.avpLearningBound='1';
   var article=detail.closest('.c1-lesson,[data-avp-lesson]')||articles[index]||detail.parentElement;
   var articleIndex=articles.indexOf(article);
   if(articleIndex<0)articleIndex=index;
   var lessonNo=articleIndex+1;
   var lessonId=detail.dataset.avpLessonId||article.dataset.avpLessonId||chapterId+'-lesson-'+String(lessonNo).padStart(2,'0');
   var title=safeText(article.querySelector('h3,[data-avp-lesson-title]')||detail.querySelector('summary'))||('Bài '+lessonNo);
   var summary=safeText(article.querySelector('p,[data-avp-lesson-summary]'),120);
   var meta={
    content_id:lessonId,
    content_title:title,
    content_summary:summary,
    chapter_id:chapterId,
    chapter_title:chapterTitle,
    lesson_no:lessonNo
   };
   detail.dataset.avpContentId=lessonId;
   detail.addEventListener('toggle',function(){
    if(!detail.open)return;
    var key='avp_learning_start_'+lessonId;
    try{if(sessionStorage.getItem(key)==='1')return;sessionStorage.setItem(key,'1');}catch(_){}
    track('learning_lesson_start',meta);
   });
   var check=detail.querySelector('input[type="checkbox"]');
   if(!check){
    var body=detail.querySelector('.c1-detail-body')||detail;
    var label=document.createElement('label');
    label.className='avp-learning-complete-control';
    label.style.cssText='display:flex;align-items:flex-start;gap:9px;margin-top:14px;padding:11px 12px;border:1px solid #dcebe1;border-radius:11px;background:#f5faf6;color:#315b43;font-size:12px;line-height:1.5;';
    check=document.createElement('input');
    check.type='checkbox';
    check.className='avp-learning-complete';
    check.style.cssText='margin-top:2px;accent-color:#08794f;';
    label.appendChild(check);
    var text=document.createElement('span');
    text.textContent='Tôi đã tự học và thực hành xong bài này.';
    label.appendChild(text);
    body.appendChild(label);
   }
   if(check.dataset.avpLearningCompleteBound!=='1'){
    check.dataset.avpLearningCompleteBound='1';
    check.addEventListener('change',function(){
     if(check.checked)track('learning_lesson_complete',meta);
    });
   }
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});
 else bind();
})();
