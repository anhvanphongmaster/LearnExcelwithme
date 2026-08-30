/*! avp-cta-system.js — V89 semantic CTA classifier */
(function(){
  "use strict";
  if(window.__avpCtaSystemV89)return;
  window.__avpCtaSystemV89=true;

  const SKIP_SELECTOR=[
    "nav",
    ".top-simple-nav",
    ".filter-bar",
    ".filters",
    ".tabs",
    ".tab-list",
    ".choice-list",
    ".quiz-options",
    ".ph-choices",
    ".race-mode-options",
    "[role='tablist']"
  ].join(",");

  const CONTROL_CLASSES=[
    "filter-btn","formula-filter","shortcut-filter","lp-filter","pv-filter",
    "pg-filter","tools-tab","auth-tab","ph-choice","race-mode-option",
    "avatar-choice","ml-chip","report-preset"
  ];

  function normalize(text){
    return (text||"")
      .replace(/\s+/g," ")
      .trim()
      .toLowerCase();
  }

  function hasControlClass(el){
    return CONTROL_CLASSES.some(c=>el.classList.contains(c));
  }

  function cleanSemanticClasses(el){
    el.classList.remove(
      "avp-cta-primary","avp-cta-secondary","avp-cta-neutral",
      "avp-cta-danger","avp-cta-warning","avp-cta-youtube"
    );
  }

  function classify(el){
    if(!el || el.nodeType!==1)return;
    if(el.dataset.avpCtaLocked==="1")return;
    if(el.closest(SKIP_SELECTOR) || hasControlClass(el))return;

    const tag=el.tagName;
    if(!["A","BUTTON","INPUT"].includes(tag))return;

    const type=(el.getAttribute("type")||"").toLowerCase();
    if(tag==="INPUT" && !["submit","button"].includes(type))return;

    const text=normalize(
      tag==="INPUT" ? el.value : el.textContent
    );
    if(!text)return;

    cleanSemanticClasses(el);

    const href=(el.getAttribute("href")||"").toLowerCase();
    const cls=(el.className||"").toString().toLowerCase();

    // Brand exception.
    if(
      href.includes("youtube.com") ||
      href.includes("youtu.be") ||
      cls.includes("pyt-yt") ||
      (cls.split(/\s+/).includes("youtube") &&
       (href.includes("youtube") || href.includes("youtu.be")))
    ){
      el.classList.add("avp-cta-auto","avp-cta-youtube");
      return;
    }

    // Destructive actions.
    if(
      cls.includes("danger") ||
      /(xóa|xoá|delete|tắt bảo trì|hủy tài khoản|huỷ tài khoản|reset toàn bộ|xóa toàn bộ|xoá toàn bộ)/i.test(text)
    ){
      el.classList.add("avp-cta-auto","avp-cta-danger");
      return;
    }

    // Back / close / reload are supportive, not primary.
    if(
      /^(←\s*)?(quay lại|về |trở lại)|^(đóng|hủy|huỷ|bỏ qua|làm mới|tải trạng thái|kiểm tra lại|xem skill map)/i.test(text) ||
      text.includes("quay lại") ||
      text.includes("về trang chủ") ||
      text.includes("bài trước")
    ){
      el.classList.add("avp-cta-auto","avp-cta-secondary");
      return;
    }

    // Warning/irreversible-but-not-destructive operational actions.
    if(
      /(khôi phục|reset tiến độ|xóa tiến độ|xoá tiến độ)/i.test(text)
    ){
      el.classList.add("avp-cta-auto","avp-cta-warning");
      return;
    }

    // Main user intent.
    // Cards with lots of descriptive copy are not recolored automatically.
    const compactActionText=text.length<=52;
    if(
      (tag==="INPUT" && type==="submit") ||
      (compactActionText &&
       /(bắt đầu|học tiếp|tiếp tục|bài tiếp theo|đi thực hành|làm bài|làm ngay|vào học|mở bài|xem bài|nộp bài|gửi bài|lưu|áp dụng|đăng nhập|đăng ký|tải file|tải toàn bộ|download|chấm điểm|kiểm tra kết quả|xác nhận|hoàn thành|đánh dấu đã học|thử ngay|tạo |xuất |tra cứu|tìm kiếm ngay)/i.test(text))
    ){
      el.classList.add("avp-cta-auto","avp-cta-primary");
      return;
    }

    // Existing explicit semantics.
    if(
      cls.split(/\s+/).includes("primary") ||
      cls.includes("next-lesson-btn") ||
      cls.includes("continue-btn") ||
      cls.includes("auth-submit") ||
      cls.includes("complete-btn")
    ){
      el.classList.add("avp-cta-auto","avp-cta-primary");
      return;
    }

    if(
      cls.split(/\s+/).includes("secondary") ||
      cls.split(/\s+/).includes("ghost")
    ){
      el.classList.add("avp-cta-auto","avp-cta-secondary");
      return;
    }
  }

  function scan(root){
    if(!root || root.nodeType!==1 && root.nodeType!==9)return;
    if(root.matches && root.matches("a[href],button,input[type='submit'],input[type='button']")){
      classify(root);
    }
    root.querySelectorAll?.("a[href],button,input[type='submit'],input[type='button']").forEach(classify);
  }

  function boot(){
    document.documentElement.classList.add("avp-cta-system-ready");
    scan(document);

    // Dynamic UI (Practice, AI, Community, Admin, leaderboard, modals).
    const observer=new MutationObserver(records=>{
      records.forEach(record=>{
        record.addedNodes.forEach(node=>{
          if(node.nodeType===1)scan(node);
        });
      });
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",boot,{once:true});
  }else{
    boot();
  }
})();