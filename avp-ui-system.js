/*! AVP UI System V1 — accessible, queued dialogs shared by learner + Admin. */
(function(w,d){
  'use strict';
  if(w.__AVP_UI_SYSTEM__)return;
  w.__AVP_UI_SYSTEM__=true;

  const nativeAlert=w.alert?.bind(w);
  const queue=[];
  let active=false,lastFocus=null;

  function ensureCss(){
    if(d.querySelector('link[data-avp-ui-system]'))return;
    const link=d.createElement('link');link.rel='stylesheet';link.href='avp-ui-system.css?v=20260909-ui1';link.dataset.avpUiSystem='1';d.head.appendChild(link);
  }
  function ensureSemanticCss(){
    if(d.querySelector('link[data-avp-semantic-soft]'))return;
    const link=d.createElement('link');link.rel='stylesheet';link.href='avp-semantic-soft.css?v=20260909-semsoft2';link.dataset.avpSemanticSoft='1';d.head.appendChild(link);
  }
  function ensureReadabilityCss(){
    if(d.querySelector('link[data-avp-readability-guard]'))return;
    const link=d.createElement('link');link.rel='stylesheet';link.href='avp-readability-guard.css?v=20260909-read1';link.dataset.avpReadabilityGuard='1';d.head.appendChild(link);
  }
  function ensureSemanticHierarchy(){
    if(w.__AVP_SEMANTIC_HIERARCHY_V3__||d.querySelector('script[data-avp-semantic-hierarchy]'))return;
    const script=d.createElement('script');
    script.src='avp-semantic-hierarchy-v3.js?v=20260909-sem4';
    script.defer=true;
    script.dataset.avpSemanticHierarchy='3';
    (d.head||d.documentElement).appendChild(script);
  }
  function ensureRoot(){
    let root=d.getElementById('avpUiModal');if(root)return root;
    root=d.createElement('div');root.id='avpUiModal';root.className='avp-ui-modal tone-info';root.hidden=true;
    root.innerHTML='<div class="avp-ui-modal-back" data-avp-ui-dismiss></div><section class="avp-ui-modal-card" role="dialog" aria-modal="true" aria-labelledby="avpUiTitle" aria-describedby="avpUiBody"><button type="button" class="avp-ui-close" data-avp-ui-dismiss aria-label="Đóng">×</button><div class="avp-ui-modal-head"><div class="avp-ui-icon" id="avpUiIcon" aria-hidden="true">ℹ️</div><div class="avp-ui-heading"><p class="avp-ui-subtitle" id="avpUiSubtitle">ANH VĂN PHÒNG</p><h3 class="avp-ui-title" id="avpUiTitle">Thông báo</h3></div></div><div class="avp-ui-body" id="avpUiBody"></div><label class="avp-ui-prompt-wrap" id="avpUiPromptWrap" hidden><span class="avp-ui-prompt-label" id="avpUiPromptLabel">Nhập nội dung</span><input class="avp-ui-prompt" id="avpUiPrompt" type="text" autocomplete="off"></label><div class="avp-ui-actions"><button type="button" class="avp-ui-btn avp-ui-cancel" id="avpUiCancel" hidden>Hủy</button><button type="button" class="avp-ui-btn avp-ui-ok" id="avpUiOk">Đã hiểu</button></div></section>';
    (d.body||d.documentElement).appendChild(root);return root;
  }
  function iconFor(tone,type){
    if(type==='prompt')return '✎';
    if(tone==='danger')return '!';
    if(tone==='warn')return '⚠';
    if(tone==='ok')return '✓';
    return 'i';
  }
  function next(){
    if(active||!queue.length)return;
    active=true;ensureCss();ensureSemanticCss();ensureReadabilityCss();ensureSemanticHierarchy();const task=queue.shift(),opts=task.opts||{},root=ensureRoot();
    lastFocus=d.activeElement instanceof HTMLElement?d.activeElement:null;
    root.className='avp-ui-modal tone-'+(opts.tone||'info');
    const type=opts.type||'alert';
    const title=d.getElementById('avpUiTitle'),body=d.getElementById('avpUiBody'),icon=d.getElementById('avpUiIcon');
    const subtitle=d.getElementById('avpUiSubtitle'),ok=d.getElementById('avpUiOk'),cancel=d.getElementById('avpUiCancel');
    const wrap=d.getElementById('avpUiPromptWrap'),input=d.getElementById('avpUiPrompt'),label=d.getElementById('avpUiPromptLabel');
    title.textContent=opts.title|| (type==='confirm'?'Xác nhận':type==='prompt'?'Nhập thông tin':'Thông báo');
    body.textContent=String(opts.body??'');
    subtitle.textContent=opts.subtitle||'ANH VĂN PHÒNG';
    icon.textContent=opts.icon||iconFor(opts.tone,type);
    ok.textContent=opts.okText|| (type==='confirm'?'Đồng ý':type==='prompt'?'Xác nhận':'Đã hiểu');
    cancel.textContent=opts.cancelText||'Hủy';
    cancel.hidden=type==='alert';
    wrap.hidden=type!=='prompt';
    if(type==='prompt'){
      label.textContent=opts.inputLabel||'Nhập nội dung';input.value=String(opts.defaultValue??'');input.placeholder=opts.placeholder||'';
      input.maxLength=Number.isFinite(opts.maxLength)?opts.maxLength:524288;
    }
    root.hidden=false;d.body?.classList.add('avp-ui-dialog-open');
    const card=root.querySelector('.avp-ui-modal-card');
    const focusables=()=>[...card.querySelectorAll('button:not([hidden]):not(:disabled),input:not([hidden]):not(:disabled),textarea:not([hidden]):not(:disabled),select:not([hidden]):not(:disabled),a[href]')];
    let done=false;
    function close(value){
      if(done)return;done=true;root.hidden=true;d.body?.classList.remove('avp-ui-dialog-open');
      root.removeEventListener('keydown',onKey);ok.onclick=cancel.onclick=null;root.querySelectorAll('[data-avp-ui-dismiss]').forEach(el=>el.onclick=null);
      try{lastFocus?.focus({preventScroll:true})}catch(_){ }
      active=false;task.resolve(value);queueMicrotask(next);
    }
    function onKey(e){
      if(e.key==='Escape'){e.preventDefault();close(type==='prompt'?null:false);return}
      if(e.key==='Enter'&&type==='prompt'&&d.activeElement===input){e.preventDefault();close(input.value);return}
      if(e.key==='Tab'){
        const a=focusables();if(!a.length)return;const first=a[0],last=a[a.length-1];
        if(e.shiftKey&&d.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&d.activeElement===last){e.preventDefault();first.focus()}
      }
    }
    root.addEventListener('keydown',onKey);
    ok.onclick=()=>close(type==='prompt'?input.value:true);
    cancel.onclick=()=>close(type==='prompt'?null:false);
    root.querySelectorAll('[data-avp-ui-dismiss]').forEach(el=>el.onclick=()=>close(type==='prompt'?null:false));
    requestAnimationFrame(()=>{if(type==='prompt')input.focus();else ok.focus()});
  }
  function open(opts){return new Promise(resolve=>{queue.push({opts,resolve});next()})}

  w.avpAlert=(body,opts={})=>open({type:'alert',body,...opts,okText:opts.okText||opts.ok});
  w.avpConfirm=(body,opts={})=>open({type:'confirm',body,...opts,okText:opts.okText||opts.ok,cancelText:opts.cancelText||opts.cancel});
  w.avpPrompt=(body,opts={})=>open({type:'prompt',body,...opts,defaultValue:opts.defaultValue??opts.value,okText:opts.okText||opts.ok,cancelText:opts.cancelText||opts.cancel});
  w.avpDialog=open;
  w.__AVP_NATIVE_ALERT__=nativeAlert;

  function inferredTone(message){
    const text=String(message??'').toLowerCase();
    if(/(không|chưa|lỗi|thất bại|không thể|bị chặn|thiếu|sai)/.test(text))return 'danger';
    if(/(cảnh báo|lưu ý|xác nhận|hết|đã nộp)/.test(text))return 'warn';
    if(/(đã |thành công|pass|hoàn tất|sẵn sàng|sao chép)/.test(text))return 'ok';
    return 'info';
  }
  // Alert has no meaningful return value in this codebase, so it can be safely unified globally.
  w.alert=function(message){const text=String(message??'');w.avpAlert(text,{tone:inferredTone(text)});};
  ensureCss();ensureSemanticCss();ensureReadabilityCss();ensureSemanticHierarchy();
})(window,document);
