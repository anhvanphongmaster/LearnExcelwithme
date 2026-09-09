/*! AVP Semantic Hierarchy V3 — outcome-aware status + back-navigation hierarchy. */
(function(w,d){
  'use strict';
  if(w.__AVP_SEMANTIC_HIERARCHY_V3__)return;
  w.__AVP_SEMANTIC_HIERARCHY_V3__=true;

  const TONES=['avp-semantic-fail','avp-semantic-warning','avp-semantic-pass','avp-semantic-draft'];
  const STATUS_SELECTOR=[
    '[class*="status"]','[class*="state"]','[class*="notice"]','[class*="message"]',
    '[class*="feedback"]','[class*="result"]','[class*="score"]','[role="status"]','[role="alert"]'
  ].join(',');
  const BACK_SELECTOR='a[class*="back"],button[class*="back"],[data-pro-back],.pw-backline a,.roll-back,.pro-back,.pro-flow-back,.pro-case-list-back';
  const ROOT_TARGETS=new Set([
    'index.html','practice-video.html','skill-map.html','tools-center.html','professional-access.html',
    'professional-track.html','excel.html','power-query-course.html','practice-grader.html',
    'practice-youtube.html','practice-tiktok.html','tai-lieu-tham-khao.html','excel-handbook.html','sales-handbook.html'
  ]);

  const FAIL_RE=/(?:\bFAIL(?:ED)?\b|không\s+đạt|chưa\s+đạt|không\s+qua|điểm\s+không\s+đạt|cần\s+sửa|cần\s+nộp\s+lại|sai\s+(?:công\s+thức|kết\s+quả|dữ\s+liệu)|thất\s+bại|\bERROR\b|\bFAILED\b|\brevision\b|\brejected\b)/i;
  const WARN_RE=/(?:cảnh\s+báo|lưu\s+ý|đang\s+chờ|đang\s+xử\s+lý|đang\s+chấm|cần\s+admin|cần\s+kiểm\s+tra|chưa\s+sẵn\s+sàng|\bpending\b|\bwarning\b|\bwarn\b)/i;
  const PASS_RE=/(?:\bPASS\b|đã\s+đạt|hoàn\s+thành|thành\s+công|đã\s+phê\s+duyệt|\bapproved\b|\bcompleted\b)/i;
  const DRAFT_RE=/(?:\bdraft\b|bản\s+nháp|xem\s+trước|admin\s+test|preview)/i;
  const BACK_TEXT_RE=/^(?:\s*(?:←|‹|«))|(?:quay\s+lại|trở\s+lại|về\s+(?:trang|màn|khu|hub|lộ\s+trình))/i;
  const ROOT_TEXT_RE=/(?:trang\s+chủ|practice\s+hub|thực\s+hành|lộ\s+trình|professional\s+track|khu\s+học|khu\s+công\s+cụ)/i;

  function ensureCss(){
    if(d.querySelector('link[data-avp-semantic-hierarchy]'))return;
    const link=d.createElement('link');
    link.rel='stylesheet';
    link.href='avp-semantic-hierarchy-v3.css?v=20260909-sem3';
    link.dataset.avpSemanticHierarchy='3';
    (d.head||d.documentElement).appendChild(link);
  }

  function cleanText(el){
    return String(el?.innerText||el?.textContent||'').replace(/\s+/g,' ').trim();
  }

  function scoreRatio(text){
    const re=/(-?\d+(?:[.,]\d+)?)\s*\/\s*(\d+(?:[.,]\d+)?)/g;
    let match;
    while((match=re.exec(text))){
      const earned=Number(match[1].replace(',','.'));
      const max=Number(match[2].replace(',','.'));
      // Only treat real score scales as pass/fail. Progress such as 2/3 Case is not a failed score.
      if(Number.isFinite(earned)&&Number.isFinite(max)&&max>=10)return earned/max;
    }
    return null;
  }

  function setTone(el,tone){
    if(!el?.classList)return;
    TONES.forEach(name=>{if(name!==tone)el.classList.remove(name)});
    if(tone)el.classList.add(tone);
  }

  function classifyStatus(el){
    if(!el||el===d.body||el===d.documentElement)return;
    const text=cleanText(el);
    if(!text||text.length>2200)return;

    const hasFailure=FAIL_RE.test(text);
    const ratio=scoreRatio(text);
    if(ratio!==null){
      if(ratio<0.7){setTone(el,'avp-semantic-fail');return}
      if(hasFailure){setTone(el,'avp-semantic-warning');return}
      setTone(el,'avp-semantic-pass');
      return;
    }

    // Without a score, explicit failure is still a real failure state.
    if(hasFailure){setTone(el,'avp-semantic-fail');return}
    if(WARN_RE.test(text)){setTone(el,'avp-semantic-warning');return}
    if(DRAFT_RE.test(text)){setTone(el,'avp-semantic-draft');return}
    if(PASS_RE.test(text)){setTone(el,'avp-semantic-pass');return}
  }

  function hrefFile(el){
    if(el.tagName!=='A')return '';
    const raw=String(el.getAttribute('href')||'').trim();
    if(!raw||raw.startsWith('#')||/^javascript:/i.test(raw))return '';
    try{
      const url=new URL(raw,location.href);
      if(url.origin!==location.origin)return '';
      return (url.pathname.split('/').pop()||'index.html').toLowerCase();
    }catch(_){return ''}
  }

  function isBackCandidate(el){
    if(!el?.matches?.('a,button,[role="button"]'))return false;
    if(el.matches(BACK_SELECTOR))return true;
    return BACK_TEXT_RE.test(cleanText(el));
  }

  function classifyBack(el){
    if(!isBackCandidate(el))return;
    const text=cleanText(el);
    const file=hrefFile(el);
    const root=ROOT_TEXT_RE.test(text)||(file&&ROOT_TARGETS.has(file));
    el.classList.toggle('avp-nav-back-root',!!root);
    el.classList.toggle('avp-nav-back-step',!root);
    if(!el.getAttribute('aria-label'))el.setAttribute('aria-label',root?'Quay lại đầu luồng':'Quay lại bước trước');
  }

  function scan(root){
    const scope=root?.querySelectorAll?root:d;
    if(root?.matches?.(STATUS_SELECTOR))classifyStatus(root);
    if(root?.matches?.('a,button,[role="button"]'))classifyBack(root);
    scope.querySelectorAll?.(STATUS_SELECTOR).forEach(classifyStatus);
    scope.querySelectorAll?.('a,button,[role="button"]').forEach(el=>{if(isBackCandidate(el))classifyBack(el)});
  }

  let queued=false;
  function schedule(root){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      scan(root&&root.isConnected?root:d);
    });
  }

  function boot(){
    ensureCss();
    scan(d);
    const observer=new MutationObserver(records=>{
      let root=null;
      for(const record of records){
        if(record.type==='childList'&&record.target){root=record.target;break}
        if(record.type==='characterData'&&record.target?.parentElement){root=record.target.parentElement;break}
      }
      schedule(root||d);
    });
    observer.observe(d.body||d.documentElement,{subtree:true,childList:true,characterData:true});
    w.AVPSemanticHierarchy={refresh:()=>scan(d)};
  }

  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})(window,document);
