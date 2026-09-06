(() => {
  const KEY_HISTORY='avp_learning_history_v2', KEY_BOOK='avp_bookmarks_v2';
  const AVP_EMBEDDED=(function(){try{return new URLSearchParams(location.search).get('embed')==='1'||window.self!==window.top;}catch(e){return window.self!==window.top;}})();
  if(AVP_EMBEDDED){document.documentElement.classList.add('avp-embedded-frame','avp-embedded-youtube');}

  const IGNORE=new Set(['auth.html','admin.html','privacy.html','terms.html','disclaimer.html','open-source.html','lienhe.html','gioithieu.html']);
  const page=location.pathname.split('/').pop()||'index.html';
  const title=(document.querySelector('h1')?.textContent||document.title.split('|')[0]||page).trim();

  /* =========================================================
     PAGE CONTEXT V1 — AVP biết người dùng đang ở đâu
     - Khu học: im, chỉ hỗ trợ khi người dùng chủ động / có thông báo.
     - Khu bài tập: báo đúng khu hiện tại + thỉnh thoảng gợi ý khu liên quan.
     - Trang chủ / Skill Map / Race: có thể sinh động hơn.
     ========================================================= */
  const LESSON_CONTEXT={
    'excel.html':'Excel cơ bản',
    'filtersort.html':'Filter & Sort',
    'pivottable.html':'PivotTable',
    'bieudopareto.html':'Biểu đồ Pareto',
    'baocaoexcel.html':'Báo cáo Excel / QC',
    'excel-nang-cao.html':'Excel nâng cao',
    'power-query-course.html':'Power Query',
    'power-pivot-dax.html':'Power Pivot & DAX',
    'dashboard-dong.html':'Dashboard động',
    'vba-macro.html':'VBA / Macro',
    'solver-whatif.html':'What-If & Solver'
  };
  const REFERENCE_CONTEXT={
    'phimtatexcel.html':'Phím tắt Excel',
    'congthucexcel.html':'Công thức Excel',
    'excel-dictionary.html':'Từ điển Excel',
    'excel-handbook.html':'Excel Handbook'
  };
  const PRACTICE_CONTEXT={
    'practice-video.html':{label:'Practice Hub',intro:'Bạn đang ở Khu bài tập. Chọn cách luyện phù hợp với mục tiêu của bạn.',lines:[
      'TikTok Practice phù hợp khi bạn muốn luyện nhanh theo từng video.',
      'YouTube Project phù hợp với bài dài, làm theo từng phần của một project.',
      'Bài tập tự chấm phù hợp khi bạn muốn làm file rồi biết kết quả.',
      'Nếu chưa biết cách bắt đầu một bài, Hướng dẫn bài tập sẽ gợi ý hướng làm.',
      'Không cần vào tất cả các khu. Hãy chọn một kiểu luyện phù hợp với mục tiêu hiện tại.',
      'Muốn kiểm tra kiến thức nhanh thì Race phù hợp hơn một project dài.'
    ],suggestions:[
      'Muốn luyện nhanh? Thử TikTok Practice.',
      'Muốn làm một project dài hơn? Sang YouTube Project.',
      'Muốn biết bài mình làm đúng chưa? Sang Bài tập tự chấm.',
      'Muốn kiểm tra phản xạ Excel? Thử Excel Race.',
      'Thiếu kiến thức nền? Skill Map sẽ chỉ bài nên học trước.'
    ]},
    'practice-tiktok.html':{label:'TikTok Practice',intro:'Bạn đang ở Bài tập TikTok. Chọn chủ đề, xem đúng video và tải file của bài.',lines:[
      'Ở TikTok Practice, mỗi bài đi cùng video đã phát hành.',
      'Chọn đúng chủ đề trước sẽ giúp bạn tìm bài nhanh hơn.',
      'Làm lại trên file thực hành sẽ hiệu quả hơn chỉ xem video.',
      'Nếu bài có file, hãy tải đúng file đi kèm để tránh lệch dữ liệu với video.',
      'Thử làm lại một lần không nhìn video để biết mình đã nhớ thao tác chưa.',
      'Bạn có thể bấm AVP để hỏi AI hoặc Chat Admin ngay khi đang vướng một bước.'
    ],suggestions:[
      'Muốn bài dài và liền mạch hơn? Sang YouTube Project.',
      'Muốn hệ thống kiểm tra kết quả? Thử Bài tập tự chấm.',
      'Bí cách làm một bài? Mở Hướng dẫn bài tập.',
      'Muốn học lại phần kiến thức trước khi làm? Mở Skill Map.',
      'Cần tra nhanh một hàm Excel? Mở Từ điển Excel từ AVP.'
    ]},
    'practice-youtube.html':{label:'YouTube Project',intro:'Bạn đang ở YouTube Project. Các bài được tổ chức theo project và từng phần.',lines:[
      'YouTube Project phù hợp để luyện một quy trình Excel dài từ đầu đến cuối.',
      'Nên làm lần lượt từng phần để dữ liệu và kết quả không bị đứt mạch.',
      'Hãy giữ file của phần trước nếu project tiếp tục dùng lại dữ liệu.',
      'Nên hoàn thành phần hiện tại trước khi nhảy sang phần sau của project.',
      'Nếu kết quả lệch video, kiểm tra lại bước trước thay vì sửa thủ công kết quả cuối.',
      'Có thể hỏi AI ngay tại đây nếu bạn chưa hiểu mục đích của một bước.'
    ],suggestions:[
      'Muốn luyện nhanh một kỹ năng riêng? Sang TikTok Practice.',
      'Muốn làm bài có chấm kết quả? Thử Bài tập tự chấm.',
      'Cần ôn lại kiến thức nền? Quay lại Skill Map.',
      'Muốn kiểm tra nhanh sau khi học? Thử Excel Race.'
    ]},
    'practice-grader.html':{label:'Bài tập tự chấm',intro:'Bạn đang ở Bài tập tự chấm. Làm file, nộp bài và nhận kết quả từ hệ thống.',lines:[
      'Ở khu Tự chấm, hãy đọc đúng yêu cầu trước khi sửa file.',
      'Nếu bài chưa đạt, xem lại lỗi được báo rồi sửa đúng phần đó.',
      'Mỗi chủ đề có nhiều mức bài để bạn tăng dần độ khó.',
      'Nộp đúng file của bài đang làm để hệ thống chấm đúng yêu cầu.',
      'Nếu chưa đạt, tập trung sửa đúng lỗi được báo thay vì làm lại toàn bộ.',
      'Khi đã qua bài dễ, hãy tăng dần độ khó thay vì chọn bài ngẫu nhiên.'
    ],suggestions:[
      'Chưa biết bắt đầu bài thế nào? Mở Hướng dẫn bài tập.',
      'Muốn xem cách làm qua video ngắn? Sang TikTok Practice.',
      'Muốn luyện theo project dài? Sang YouTube Project.',
      'Thiếu kiến thức của chủ đề này? Quay lại Skill Map để ôn trước.',
      'Muốn kiểm tra phản xạ thay vì nộp file? Thử Excel Race.'
    ]},
    'practice-guides.html':{label:'Hướng dẫn bài tập',intro:'Bạn đang ở Hướng dẫn bài tập. Đây là nơi xem gợi ý trước khi tự làm.',lines:[
      'Hướng dẫn chỉ nên dùng khi bạn đang bí, đừng xem đáp án quá sớm.',
      'Đọc gợi ý xong hãy quay lại file và tự làm lại một lần.',
      'Hướng dẫn là nơi tháo nút thắt, không phải nơi thay thế việc tự làm bài.',
      'Nếu một gợi ý vẫn chưa đủ rõ, bấm AVP để hỏi AI theo đúng bài đang xem.'
    ],suggestions:[
      'Đã hiểu hướng làm? Quay lại Bài tập tự chấm để kiểm tra kết quả.',
      'Muốn xem thao tác qua video? Sang TikTok Practice.',
      'Cần học lại kiến thức nền? Mở Skill Map.'
    ]},
    'practice-lab.html':{label:'Practice Lab',intro:'Bạn đang ở Practice Lab. Đây là khu luyện theo nhiệm vụ và case thực tế.',lines:[
      'Practice Lab phù hợp khi bạn muốn ghép nhiều kỹ năng Excel trong cùng một case.',
      'Hãy đọc mục tiêu của nhiệm vụ trước rồi mới mở file thực hành.',
      'Một case có thể cần nhiều kỹ năng cùng lúc, vì vậy đừng vội sửa dữ liệu khi chưa hiểu yêu cầu.',
      'Nếu bị kẹt ở một bước, hãy xác định chính xác kỹ năng đang thiếu rồi mới tra cứu.'
    ],suggestions:[
      'Muốn luyện từng kỹ năng ngắn hơn? Mở Khu bài tập.',
      'Thiếu kiến thức nền? Quay lại Skill Map để học đúng bài.',
      'Muốn kiểm tra nhanh kiến thức đã học? Thử Excel Race.'
    ]}
  };

  function resolvePageContext(){
    if(PRACTICE_CONTEXT[page]){
      const p=PRACTICE_CONTEXT[page];
      return {area:'Khu bài tập',kind:'practice',motion:'stationary',autoTalk:true,...p};
    }
    if(LESSON_CONTEXT[page]){
      return {
        area:'Khu học',kind:'learning',motion:'stationary',autoTalk:false,label:LESSON_CONTEXT[page],
        intro:`Bạn đang học: ${LESSON_CONTEXT[page]}.`,
        lines:[],
        suggestions:['Khi học xong, bạn có thể sang Khu bài tập để luyện lại bằng file.']
      };
    }
    if(REFERENCE_CONTEXT[page]){
      return {
        area:'Kho tra cứu',kind:'reference',motion:'stationary',autoTalk:false,label:REFERENCE_CONTEXT[page],
        intro:`Bạn đang ở kho tra cứu: ${REFERENCE_CONTEXT[page]}.`,
        lines:[],suggestions:['Nếu đang học theo lộ trình, quay lại Skill Map để tiếp tục đúng bài.']
      };
    }
    if(page==='professional-access.html')return {
      area:'Bài tập nâng cao',kind:'professional-access',motion:'stationary',autoTalk:false,label:'Professional Track',
      intro:'Bạn đang ở khu Bài tập nâng cao (Pro).',
      lines:[],suggestions:[]
    };
    if(page==='professional-track.html')return {
      area:'Bài tập nâng cao',kind:'professional',motion:'stationary',autoTalk:true,label:'Professional Track',
      intro:'Bạn đã vào được Professional Track. Chọn đúng lĩnh vực và làm từng case theo thứ tự.',
      lines:[
        'Đã mở được khu Pro rồi thì cứ làm từng case một, không cần vội chạy hết lộ trình.',
        'Case khó là bình thường. Hãy xác định đúng bước đang vướng trước khi hỏi AI hoặc Admin.',
        'Ưu tiên hiểu cách xử lý và lý do làm, đừng chỉ cố ra đúng kết quả cuối.',
        'Nếu một case có nhiều bước, hoàn thành từng checkpoint rồi mới chuyển tiếp.',
        'Bạn đã đạt điều kiện để vào khu này. Giờ tập trung nâng chất lượng bài làm nhé.'
      ],
      suggestions:[
        'Cần hỗ trợ ngay trong case? Bấm AVP để Hỏi AI hoặc Chat Admin.',
        'Làm xong một case, tự kiểm tra lại file trước khi chuyển sang case tiếp theo.'
      ]
    };
    if(page==='skill-map.html')return {
      area:'Khu học',kind:'map',motion:'stationary',autoTalk:true,label:'Skill Map',
      intro:'Bạn đang ở Skill Map. Đây là nơi chọn bài và xem mình nên học gì tiếp theo.',
      lines:['Nếu chưa biết bắt đầu từ đâu, hãy bắt đầu với Excel cơ bản.','Bài có trạng thái hiện tại là điểm nên học tiếp trước.'],
      suggestions:['Học xong một bài, sang Khu bài tập để luyện lại sẽ dễ nhớ hơn.']
    };
    if(page==='index.html')return {
      area:'Trang chủ',kind:'home',motion:'patrol',autoTalk:true,label:'Trang chủ',
      intro:'Chào mừng bạn đến Learn Excel with Anh Văn Phòng.',
      lines:['Muốn học theo thứ tự? Skill Map sẽ chỉ bài nên bắt đầu.','Muốn thực hành ngay? Khu bài tập có TikTok, YouTube và Tự chấm.'],
      suggestions:['Chưa biết học gì trước? Mở Skill Map.','Muốn luyện ngay bằng file? Mở Khu bài tập.']
    };
    if(page==='excel-race.html')return {
      area:'Thử thách',kind:'game',motion:'patrol',autoTalk:true,label:'Excel Race',
      intro:'Bạn đang ở Excel Race. Trả lời nhanh nhưng đừng đoán vội.',
      lines:['Giữ streak bằng cách đọc kỹ câu hỏi trước khi chọn.','Race phù hợp để kiểm tra phản xạ sau khi đã học kiến thức.'],
      suggestions:['Gặp phần chưa chắc? Quay lại Skill Map để ôn đúng chủ đề.']
    };
    if(page==='playground.html'||page==='baitapexcel.html')return {
      area:'Thực hành',kind:'practice',motion:'stationary',autoTalk:true,label:title,
      intro:`Bạn đang ở ${title}.`,lines:['Làm từng bài một và kiểm tra kết quả trước khi chuyển tiếp.'],
      suggestions:['Muốn thêm dạng bài khác? Mở Khu bài tập.']
    };
    if(['tools-center.html','formula-finder.html','excel-doctor.html','qc-dashboard.html','excel-mobile.html'].includes(page))return {
      area:'Công cụ',kind:'tools',motion:'stationary',autoTalk:false,label:title,
      intro:`Bạn đang ở Công cụ: ${title}.`,lines:[],suggestions:[]
    };
    return {area:'Learn Excel',kind:'general',motion:'stationary',autoTalk:false,label:title,intro:`Bạn đang ở ${title}.`,lines:[],suggestions:[]};
  }

  const pageContext=resolvePageContext();
  const ROBOT_CAN_PATROL=pageContext.kind==='home' && pageContext.motion==='patrol';
  window.AVPPageContext=Object.freeze({
    page,area:pageContext.area,label:pageContext.label,kind:pageContext.kind,
    title,href:location.href
  });
  document.documentElement.dataset.avpArea=pageContext.kind;

  const now=Date.now();
  const safe=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
  const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const toast=(t)=>{let e=document.querySelector('.avp-save-toast');if(!e){e=document.createElement('div');e.className='avp-save-toast';document.body.appendChild(e)}e.textContent=t;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),1800)};
  if(!IGNORE.has(page)){
    const hist=safe(KEY_HISTORY).filter(x=>x.url!==page);hist.unshift({url:page,title,ts:now});save(KEY_HISTORY,hist.slice(0,12));
  }
  function progress(){
    const courses=safe('completedCourses'); const pg=safe('avp_playground_completed_v1');
    const coursePct=Math.min(100,Math.round((Array.isArray(courses)?courses.length:0)/6*100));
    const pgPct=Math.min(100,Math.round((Array.isArray(pg)?pg.length:0)/10*100));
    const quiz=Math.min(100,(parseInt(localStorage.getItem('quizBestScore')||'0',10)||0)*20);
    return Math.round((coursePct+pgPct+quiz)/3);
  }
  function renderHub(){
    const h=safe(KEY_HISTORY), b=safe(KEY_BOOK); const pct=progress();
    const recent=h.slice(0,5).map(x=>`<div class="avp-hub-card"><strong>${esc(x.title)}</strong><small>${ago(x.ts)}</small><div class="avp-hub-actions"><a class="avp-hub-btn" href="${attr(x.url)}">Mở lại →</a></div></div>`).join('')||'<div class="avp-hub-empty">Chưa có lịch sử học trên thiết bị này.</div>';
    const books=b.slice(0,6).map(x=>`<div class="avp-hub-card avp-hub-row"><div><strong>${esc(x.title)}</strong><small>Đã lưu để học lại</small></div><a class="avp-hub-btn" href="${attr(x.url)}">Mở</a></div>`).join('')||'<div class="avp-hub-empty">Chưa lưu bài nào. Bấm biểu tượng 🔖 ở cạnh phải để lưu.</div>';
    return `<div class="avp-hub-head"><div><div class="avp-hub-title">📚 Trung tâm học tập</div><small>Tiếp tục đúng chỗ, không mất tiến độ</small></div><button class="avp-hub-close" aria-label="Đóng">×</button></div>
      <section class="avp-hub-section"><h3>Tiến độ tổng</h3><div class="avp-hub-card"><div class="avp-hub-row"><strong>${pct}% hoàn thành</strong><small>trên thiết bị này</small></div><div class="avp-hub-progress"><span style="width:${pct}%"></span></div><div class="avp-hub-actions"><a class="avp-hub-btn" href="dashboard.html">Xem Dashboard</a><a class="avp-hub-btn secondary" href="skill-map.html">Lộ trình học</a></div></div></section><section class="avp-hub-section"><h3>Chức năng nhanh</h3><div class="avp-hub-quick">
<a class="avp-hub-btn" href="index.html">🏠 Trang chủ</a>
<a class="avp-hub-btn" href="practice-video.html">📚 Practice Hub</a>
<a class="avp-hub-btn" href="excel-race.html">🏁 Excel Race</a>
<a class="avp-hub-btn secondary" href="excel.html">📘 Excel cơ bản</a>
<a class="avp-hub-btn secondary" href="dashboard.html">📊 Tiến độ</a>
<a class="avp-hub-btn secondary" href="auth.html?tab=login">👤 Đăng nhập</a>
</div></section>
      <section class="avp-hub-section"><h3>Học gần đây</h3>${recent}</section>
      <section class="avp-hub-section"><h3>Đã lưu</h3>${books}</section>
      <section class="avp-hub-section"><h3>Sao lưu tiến độ</h3><div class="avp-hub-card"><small>Xuất dữ liệu học tập để đổi máy/trình duyệt mà không mất tiến độ.</small><div class="avp-hub-actions"><button class="avp-hub-btn" data-export>Xuất tiến độ</button><label class="avp-hub-btn secondary" style="cursor:pointer">Nhập tiến độ<input data-import type="file" accept="application/json" hidden></label></div></div></section>`;
  }
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); const attr=esc;
  const ago=t=>{const m=Math.max(0,Math.floor((Date.now()-t)/60000));if(m<1)return'Vừa xem';if(m<60)return`${m} phút trước`;const h=Math.floor(m/60);if(h<24)return`${h} giờ trước`;return`${Math.floor(h/24)} ngày trước`};
  function openHub(){
    window.dispatchEvent(new CustomEvent('avp:surface-open',{detail:{surface:'learning'}}));
    setEdgeMenu(false);back.classList.add('open');hub.innerHTML=renderHub();hub.querySelector('.avp-hub-close').onclick=closeHub;hub.querySelector('[data-export]').onclick=exportData;hub.querySelector('[data-import]').onchange=importData}
  function closeHub(){back.classList.remove('open')}
  function exportData(){const data={version:2,exportedAt:new Date().toISOString(),origin:'LearnExcelwithme',storage:{}};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&(/^(avp_|completedCourses|currentCourse|quizBestScore|dashboardLots|theme)/.test(k)))data.storage[k]=localStorage.getItem(k)}const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`learn-excel-progress-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);toast('Đã xuất tiến độ')}
  function importData(e){const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!d||d.origin!=='LearnExcelwithme'||!d.storage)throw 0;Object.entries(d.storage).forEach(([k,v])=>localStorage.setItem(k,v));toast('Đã khôi phục tiến độ');setTimeout(()=>location.reload(),700)}catch{(window.avpAlert?window.avpAlert('File tiến độ không hợp lệ.',{title:"Excel",icon:"📥",tone:"ok"}):alert('File tiến độ không hợp lệ.'))}};r.readAsText(f)}
  /* =========================================================
     FLOATING ACTION HUB V3
     1 nút duy nhất ở viền: Trung tâm học / Chat Admin / Hỏi AI
     ========================================================= */
  const launcher=document.createElement('div');
  launcher.className=`avp-edge-launcher is-right is-robot ${ROBOT_CAN_PATROL?'is-walking':'is-stationary'}`;
  launcher.id='avpEdgeLauncher';

  const aiActionLabel=pageContext.kind==='learning'?'Hỏi AI về bài này':(pageContext.kind==='practice'?'Hỏi AI về bài tập':'Hỏi AI');

  launcher.innerHTML=`
    <div class="avp-edge-menu" id="avpEdgeMenu" hidden>
      <div class="avp-edge-context" aria-label="Vị trí hiện tại">
        <span>${esc(pageContext.area)}</span>
        <strong>${esc(pageContext.label)}</strong>
      </div>
      <button type="button" class="avp-edge-action" data-edge-action="ai">
        <span>✨</span><b>${esc(aiActionLabel)}</b>
      </button>
      <button type="button" class="avp-edge-action" data-edge-action="dictionary">
        <span>📘</span><b>Từ điển Excel</b>
      </button>
      <button type="button" class="avp-edge-action" data-edge-action="community" id="avpExternalCommunityButton">
        <span>👥</span><b>Cộng đồng</b>
        <span id="avpCommunityMenuBadge" class="avp-edge-section-badge" hidden>0</span>
      </button>
      <button type="button" class="avp-edge-action" data-edge-action="chat">
        <span>💬</span><b>Chat Admin</b>
        <span class="avp-edge-section-badge" hidden>0</span>
      </button>
    </div>

    <button
      type="button"
      class="avp-hub-fab avp-edge-main"
      id="avpEdgeMain"
      aria-label="Mở công cụ nhanh"
      aria-expanded="false"
      title="Công cụ nhanh — kéo để di chuyển"
    >
      <span class="avp-bot" aria-hidden="true">
        <span class="avp-bot-head"><i class="avp-bot-eye"></i><i class="avp-bot-eye"></i><i class="avp-bot-mouth"></i><i class="avp-bot-tear l"></i><i class="avp-bot-tear r"></i></span>
        <span class="avp-bot-arm avp-bot-arm-l"></span>
        <span class="avp-bot-body">AVP</span>
        <span class="avp-bot-arm avp-bot-arm-r"></span>
        <span class="avp-bot-leg avp-bot-leg-l"></span>
        <span class="avp-bot-leg avp-bot-leg-r"></span>
      </span>
      <span class="avp-edge-main-icon" hidden>AVP</span>
      <span class="avp-edge-badge" id="avpEdgeBadge" hidden>0</span>
    </button>
  `;

  document.body.appendChild(launcher);
  document.documentElement.classList.add('avp-has-robot');
  if(AVP_EMBEDDED){launcher.hidden=true;launcher.style.display='none';}

  const fab=launcher.querySelector('#avpEdgeMain');
  const edgeMenu=launcher.querySelector('#avpEdgeMenu');
  const edgeBadge=launcher.querySelector('#avpEdgeBadge');
  fab.title=`Trợ lý AVP — ${pageContext.area}: ${pageContext.label}`;
  fab.setAttribute('aria-label',`Mở trợ lý AVP — ${pageContext.label}`);

  /* =========================================================
     MINI PREVIEW V2 — FIXED LAYER
     Không nằm trong launcher để tránh bị CSS cha che.
     ========================================================= */
  const mini=document.createElement('button');
  mini.type='button';
  mini.className='avp-edge-mini-preview-v2';
  mini.id='avpEdgeMiniPreview';
  mini.hidden=true;
  mini.innerHTML=`
    <span class="avp-edge-mini-name"></span>
    <span class="avp-edge-mini-body"></span>
  `;
  document.body.appendChild(mini);
  if(AVP_EMBEDDED){mini.hidden=true;mini.style.display='none';}

  let miniTimer=null;
  let miniDetail=null;
  let miniHideToken=0;

  const MINI_LAST_VISIT='avp_edge_last_visit_v2';
  const MINI_LAST_GREETING='avp_edge_last_greeting_v2';
  const MINI_LAST_UNREAD_SHOWN='avp_edge_last_unread_shown_v2';

  function miniDuration(text){
    const n=String(text||'').length;
    if(n<=35)return 3000;
    if(n<=90)return 4000;
    return 5000;
  }

  function launcherRect(){
    return launcher.getBoundingClientRect();
  }

  function positionMiniPreview(){
    if(mini.hidden)return;

    const r=launcherRect();
    const gap=8;
    const vw=window.innerWidth;
    const vh=window.innerHeight;

    /* cho browser tính width thật trước */
    const mr=mini.getBoundingClientRect();
    const mw=mr.width||Math.min(270,vw-78);
    const mh=mr.height||58;

    let top=r.top+(r.height-mh)/2;
    top=Math.max(8,Math.min(vh-mh-8,top));

    mini.style.top=Math.round(top)+'px';

    if(launcher.classList.contains('is-left')){
      mini.classList.add('from-left');
      mini.classList.remove('from-right');
      mini.style.left=Math.round(r.right+gap)+'px';
      mini.style.right='auto';
    }else{
      mini.classList.add('from-right');
      mini.classList.remove('from-left');
      mini.style.right=Math.round(vw-r.left+gap)+'px';
      mini.style.left='auto';
    }
  }

  function hideMiniPreview(){
    clearTimeout(miniTimer);
    miniTimer=null;

    if(mini.hidden)return;

    const token=++miniHideToken;

    mini.classList.remove('show');
    mini.classList.add('hide');

    setTimeout(()=>{
      if(token!==miniHideToken)return;
      mini.hidden=true;
      mini.classList.remove('hide');
    },240);
  }

  function showMiniPreview(detail){
    if(launcher.classList.contains('is-robot'))return;
    const body=String(detail?.body||'Tin nhắn mới').trim()||'Tin nhắn mới';
    const sender=String(detail?.sender||'Tin nhắn mới').trim();

    miniDetail=detail||{};

    mini.querySelector('.avp-edge-mini-name').textContent=sender;
    mini.querySelector('.avp-edge-mini-body').textContent=body;

    clearTimeout(miniTimer);
    ++miniHideToken;

    mini.hidden=false;
    mini.classList.remove('hide');

    /* position:fixed, luôn nằm ngoài mọi stacking context của launcher */
    positionMiniPreview();

    requestAnimationFrame(()=>{
      positionMiniPreview();
      mini.classList.add('show');
    });

    miniTimer=setTimeout(
      hideMiniPreview,
      miniDuration(body)
    );
  }

  function openChatFromMini(){
    hideMiniPreview();
    setEdgeMenu(false);

    const chat=document.getElementById('avpChatBubble');

    if(chat){
      chat.click();
    }else{
      toast('Chat Admin đang tải, thử lại sau một chút');
    }
  }

  mini.addEventListener('click',openChatFromMini);

  window.addEventListener('avp:chat-ready',()=>{
    setTimeout(()=>{
      const count=unreadCountFromChatBadge();
      if(count>0 && mini.hidden){
        reliableShowUnread(count);
      }else if(count<=0 && mini.hidden){
        showReturnGreeting();
      }
    },250);
  });

  window.addEventListener('avp:chat-new-message',e=>{
    const detail=e.detail||{};

    showMiniPreview({
      sender:detail.sender||'Tin nhắn mới',
      body:detail.body||'Bạn vừa nhận được một tin nhắn mới.',
      ...detail
    });
  });

  window.AVPShowMiniChatPreview=showMiniPreview;

  function unreadCountFromChatBadge(){
    const candidates=[
      document.getElementById('avpChatBadge'),
      document.getElementById('avpChatUnreadBadge'),
      document.querySelector('.avp-chat-badge'),
      document.querySelector('[data-avp-chat-badge]'),
      document.querySelector('#avpChatLauncher [class*="badge"]')
    ].filter(Boolean);

    for(const badge of candidates){
      const raw=String(badge.textContent||'').trim();
      const count=parseInt(raw.replace(/\D/g,''),10)||0;

      if(count>0){
        const style=getComputedStyle(badge);
        if(!badge.hidden && style.display!=='none' && style.visibility!=='hidden'){
          return count;
        }
      }
    }

    return 0;
  }

  function unreadCountFromCommunity(){
    return Math.max(0,Number(window.__avpCommunityUnreadCount||0));
  }

  let starUnread=0;
  async function refreshStarUnread(){
    try{
      const sb=window.avpSupabase;
      if(!sb)return;
      const sess=await sb.auth.getUser();
      if(!sess?.data?.user){starUnread=0;return;}
      const {count,error}=await sb.from("practice_grader_star_notifs")
        .select("id",{count:"exact",head:true})
        .eq("is_read",false);
      if(!error) starUnread=Math.max(0,Number(count||0));
    }catch(e){}
  }


  async function showUnreadReturnPreview(count){
    if(count<=0)return false;

    let detail=null;

    try{
      if(typeof window.AVPGetLatestUnreadPreview==="function"){
        detail=await Promise.race([
          window.AVPGetLatestUnreadPreview(),
          new Promise(resolve=>setTimeout(()=>resolve(null),1800))
        ]);
      }
    }catch(e){
      console.warn("AVP unread preview content",e);
    }

    if(detail?.body){
      showMiniPreview({
        ...detail,
        unread:true
      });
    }else{
      showMiniPreview({
        sender:'Tin nhắn chưa đọc',
        body:count===1
          ? 'Bạn có 1 thông báo mới. Chạm để xem.'
          : `Bạn có ${count} thông báo mới. Chạm để xem.`,
        unread:true,
        fallback:true
      });
    }

    try{
      localStorage.setItem(
        MINI_LAST_UNREAD_SHOWN,
        JSON.stringify({count,at:Date.now()})
      );
    }catch{}

    return true;
  }

  const encouragements=[
    ['Chào mừng bạn quay lại 👋','Tiếp tục học thêm một mẹo Excel nhé.'],
    ['Anh Văn Phòng','Một chút mỗi ngày, Excel sẽ nhẹ nhàng hơn 💚'],
    ['Sẵn sàng chưa? ✨','Mở một bài thực hành và làm tiếp thôi.'],
    ['Học Excel thôi 📊','Mỗi lần quay lại là thêm một chút kỹ năng mới.']
  ];

  function showReturnGreeting(force=false){
    if(unreadCountFromChatBadge()>0)return false;

    const now=Date.now();
    const lastGreeting=Number(localStorage.getItem(MINI_LAST_GREETING)||0);

    /* Không spam khi chỉ chuyển qua lại giữa các trang nội bộ liên tục.
       Khi quay lại sau >= 60 giây thì có thể chào lại.
       Lần đầu vào trang vẫn cho hiện một lời chào. */
    if(!force && lastGreeting && now-lastGreeting<60*1000){
      return false;
    }

    const item=encouragements[
      Math.floor(Math.random()*encouragements.length)
    ];

    showMiniPreview({
      sender:item[0],
      body:item[1],
      greeting:true
    });

    try{
      localStorage.setItem(MINI_LAST_GREETING,String(now));
    }catch{}

    return true;
  }

  function showReturnState(){
    /* Chờ chat/badge load từ Supabase trước */
    let tries=0;

    const check=()=>{
      tries++;

      const count=unreadCountFromChatBadge();

      if(count>0){
        showUnreadReturnPreview(count);
        return;
      }

      if(
        document.getElementById('avpChatBadge') ||
        tries>=12
      ){
        showReturnGreeting();
        return;
      }

      setTimeout(check,350);
    };

    setTimeout(check,500);
  }


  /* =========================================================
     MINI PREVIEW RELIABLE RESTORE
     - Tin nhắn mới: nổi ngay cạnh AVP.
     - Nếu realtime lỡ miss: badge tăng vẫn bung preview.
     - Không có tin chưa đọc: tự chào lại sau khi chat đã load.
     ========================================================= */
  let reliablePreviewBooted=false;
  let reliableLastUnread=-1;

  function reliableChatPanelOpen(){
    const panel=document.getElementById('avpChatPanel');
    return !!(panel && !panel.hidden);
  }

  async function reliableShowUnread(count){
    if(count<=0 || reliableChatPanelOpen())return false;

    try{
      await showUnreadReturnPreview(count);
      return true;
    }catch(e){
      console.warn('AVP reliable unread preview',e);
      return false;
    }
  }

  function reliablePreviewBoot(){
    if(reliablePreviewBooted)return;
    reliablePreviewBooted=true;

    let tries=0;

    const bootCheck=()=>{
      tries++;

      if(document.visibilityState!=='visible'){
        setTimeout(bootCheck,500);
        return;
      }

      const count=unreadCountFromChatBadge();

      if(count>0){
        reliableLastUnread=count;
        reliableShowUnread(count);
        return;
      }

      /* Chờ admin-chat.js mount xong rồi mới tự chào. */
      if(
        document.getElementById('avpChatBadge') ||
        typeof window.AVPGetLatestUnreadPreview==='function' ||
        tries>=16
      ){
        showReturnGreeting();
        reliableLastUnread=0;
        return;
      }

      setTimeout(bootCheck,350);
    };

    setTimeout(bootCheck,700);
  }

  /* Fallback rất nhẹ: nếu realtime không phát event nhưng badge tăng,
     vẫn nổi preview ngay. */
  const reliableUnreadTimer=setInterval(()=>{
    if(document.visibilityState!=='visible')return;

    const count=unreadCountFromChatBadge();

    if(reliableLastUnread<0){
      reliableLastUnread=count;
      return;
    }

    if(
      count>reliableLastUnread &&
      !reliableChatPanelOpen()
    ){
      reliableShowUnread(count);
    }

    reliableLastUnread=count;
  },1800);

  window.addEventListener('pagehide',()=>{
    clearInterval(reliableUnreadTimer);
  },{once:true});

  /* Lúc vào website:
     - có unread -> preview unread
     - không có -> lời chào/động viên */
  showReturnState();
  reliablePreviewBoot();

  let hiddenAt=0;

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      hiddenAt=Date.now();
      try{
        localStorage.setItem(MINI_LAST_VISIT,String(hiddenAt));
      }catch{}
      return;
    }

    const awayMs=hiddenAt
      ? Date.now()-hiddenAt
      : 0;

    /* Quay lại sau khi rời app/tab:
       unread luôn ưu tiên; không unread thì chào nếu rời >= 60 giây */
    setTimeout(()=>{
      const count=unreadCountFromChatBadge();

      if(count>0){
        showUnreadReturnPreview(count);
      }else if(awayMs>=60*1000){
        showReturnGreeting(true);
      }
    },500);
  });

  window.addEventListener('focus',()=>{
    setTimeout(()=>{
      const count=unreadCountFromChatBadge();

      if(count>0 && mini.hidden){
        showUnreadReturnPreview(count);
      }
    },600);
  });

  window.addEventListener('resize',positionMiniPreview);

  const back=document.createElement('div');
  back.className='avp-hub-backdrop';
  back.innerHTML='<aside class="avp-hub" role="dialog" aria-modal="true" aria-label="Trung tâm học tập"></aside>';
  document.body.appendChild(back);
  const hub=back.querySelector('.avp-hub');

  function positionDockedRobotMenu(){
    if(!launcher.classList.contains('is-docked-right') || edgeMenu.hidden)return;
    const r=launcher.getBoundingClientRect();
    const gap=8;
    const mh=edgeMenu.offsetHeight||250;
    const maxTop=Math.max(gap,window.innerHeight-mh-gap);
    const top=Math.max(gap,Math.min(r.top+r.height/2-mh/2,maxTop));
    edgeMenu.style.setProperty('position','fixed','important');
    edgeMenu.style.setProperty('left','auto','important');
    edgeMenu.style.setProperty('right',Math.max(72,window.innerWidth-r.left+8)+'px','important');
    edgeMenu.style.setProperty('top',Math.round(top)+'px','important');
    edgeMenu.style.setProperty('bottom','auto','important');
    edgeMenu.style.setProperty('transform','none','important');
    edgeMenu.style.setProperty('align-items','flex-end','important');
  }

  function setEdgeMenu(open){
    edgeMenu.hidden=!open;
    launcher.classList.toggle('open',open);
    fab.setAttribute('aria-expanded',open?'true':'false');
    const icon=fab.querySelector('.avp-edge-main-icon');
    if(icon)icon.textContent='AVP';
    if(open){
      launcher.classList.remove('is-walking','is-stationary');
      launcher.classList.add('is-greeting');
      fab.style.transform='none';
      requestAnimationFrame(positionDockedRobotMenu);
    }else{
      launcher.classList.remove('is-greeting');
      if(ROBOT_CAN_PATROL){
        launcher.classList.add('is-walking');
        launcher.classList.remove('is-stationary');
      }else{
        launcher.classList.remove('is-walking');
        launcher.classList.add('is-stationary');
      }
    }

    if(!open){
      setTimeout(()=>{
        const count=unreadCountFromChatBadge();
        if(count>0 && mini.hidden && !reliableChatPanelOpen()){
          reliableShowUnread(count);
        }
      },450);
    }
  }

  function clickHiddenTool(id,label){
    const btn=document.getElementById(id);
    if(btn){
      btn.click();
      return true;
    }
    toast(`${label} đang tải, thử lại sau một chút`);
    return false;
  }

  launcher.querySelectorAll('[data-edge-action]').forEach(btn=>{
    btn.addEventListener('click',async e=>{
      e.preventDefault();
      e.stopPropagation();

      const action=btn.dataset.edgeAction;
      hideMiniPreview();
      setEdgeMenu(false);

      const next=location.pathname.split('/').pop()||'index.html';
      let user=null;
      try{
        if(window.AVPAccess&&typeof window.AVPAccess.getUser==='function'){
          user=await window.AVPAccess.getUser(false);
        }
      }catch(err){}
      if(!user){
        try{
          const sb=window.avpSupabase;
          if(sb?.auth){
            const sess=await sb.auth.getSession();
            user=sess?.data?.session?.user||null;
          }
        }catch(err){}
      }
      if(!user){
        toast('Đăng nhập để dùng Hỏi AI, Từ điển, Cộng đồng và Chat Admin');
        return;
      }

      const aiPanel=document.getElementById('avpAiChatPanel');
      const chatPanels=[
        document.getElementById('avpChatPanel'),
        document.getElementById('avpAdminFloatPanel'),
        document.getElementById('avpGuestChatPanel')
      ].filter(Boolean);

      if(action==='dictionary'){
        window.location.href='excel-dictionary.html';
        return;
      }

      if(action==='learning'){
        if(back.classList.contains('open')){
          closeHub();
          return;
        }
        window.dispatchEvent(new CustomEvent('avp:surface-open',{detail:{surface:'learning'}}));
        openHub();
      }else if(action==='community'){
        const communityAlreadyOpen=aiPanel && !aiPanel.hidden && !document.getElementById('avpCommunityMode')?.hidden;
        if(communityAlreadyOpen){
          aiPanel.hidden=true;
          return;
        }
        window.dispatchEvent(new CustomEvent('avp:surface-open',{detail:{surface:'aihub'}}));
        if(window.AVPCommunity?.open){
          window.AVPCommunity.open();
        }else{
          toast('Cộng đồng đang tải, thử lại sau một chút');
        }
      }else if(action==='chat'){
        const chatAlreadyOpen=chatPanels.some(p=>!p.hidden);
        if(chatAlreadyOpen){
          chatPanels.forEach(p=>p.hidden=true);
          return;
        }
        window.dispatchEvent(new CustomEvent('avp:surface-open',{detail:{surface:'chat'}}));
        clickHiddenTool('avpChatBubble','Chat Admin');
      }else if(action==='ai'){
        const aiAlreadyOpen=aiPanel && !aiPanel.hidden && !document.getElementById('avpAiMode')?.hidden;
        if(aiAlreadyOpen){
          aiPanel.hidden=true;
          return;
        }
        window.dispatchEvent(new CustomEvent('avp:surface-open',{detail:{surface:'aihub'}}));
        clickHiddenTool('avpAiChatBubble','AI Chat');
      }
    });
  });

  /* Mirror badge chưa đọc từ Chat Admin ra nút chính.
     Không dùng observer toàn trang; chỉ polling rất nhẹ. */
  let previousEdgeCount=-1;



  function setNativeEdgeBadge(actionName,count){
    const n=Math.max(0,Number(count||0));
    const action=document.querySelector(`.avp-edge-action[data-edge-action="${actionName}"]`);
    if(!action)return;

    let badge=action.querySelector(".avp-edge-section-badge");
    if(!badge){
      badge=document.createElement("span");
      badge.className="avp-edge-section-badge";
      badge.setAttribute("aria-hidden","true");
      action.appendChild(badge);
    }

    badge.hidden=n<=0;
    badge.textContent=n>99?"99+":String(n);
    action.classList.toggle("has-unread",n>0);
  }

  function setCommunityEdgeBadge(count){
    const n=Math.max(0,Number(count||0)+starUnread);
    const action=document.querySelector('.avp-edge-action[data-edge-action="community"]');
    if(!action)return;

    let badge=document.getElementById("avpCommunityMenuBadge");
    if(!badge){
      badge=document.createElement("span");
      badge.id="avpCommunityMenuBadge";
      badge.className="avp-edge-section-badge";
      action.appendChild(badge);
    }

    badge.hidden=n<=0;
    badge.textContent=n>99?"99+":String(n);
    action.classList.toggle("has-unread",n>0);
  }

  function syncEdgeSectionBadges(){
    const chat=unreadCountFromChatBadge();
    const community=unreadCountFromCommunity();

    // Menu thật đang dùng data-edge-action="chat".
    setNativeEdgeBadge("chat",chat);

    // Cộng đồng là nút được ai-chat.js chèn riêng vào menu.
    setCommunityEdgeBadge(community);
  }

  function syncEdgeBadge(){
    syncEdgeSectionBadges();

    const count=
      unreadCountFromChatBadge()
      +
      unreadCountFromCommunity()
      +
      starUnread;

    if(count<=0){
      edgeBadge.hidden=true;
      edgeBadge.textContent='0';
      previousEdgeCount=0;
      fab?.classList.remove("has-pulse");
      launcher?.classList.remove("has-pulse");
      return;
    }

    edgeBadge.hidden=false;
    edgeBadge.textContent=count>9?'9+':String(count);
    fab?.classList.add("has-pulse");
    launcher?.classList.add("has-pulse");

    /* Lần đầu badge xuất hiện sau khi trang load cũng phải bung,
       không cần previous count > 0 như bản cũ. */
    if(
      previousEdgeCount>=0 &&
      count>previousEdgeCount &&
      mini.hidden
    ){
      showUnreadReturnPreview(count);
    }

    previousEdgeCount=count;
  }

  function refreshUnreadWhenVisible(){
    if(document.visibilityState!=="visible") return;
    refreshStarUnread().then(syncEdgeBadge);
  }

  refreshUnreadWhenVisible();
  const starUnreadTimer=setInterval(refreshUnreadWhenVisible,30000);

  syncEdgeBadge();

  fab?.addEventListener('click',()=>{
    // Đợi menu bỏ hidden rồi gắn badge vào đúng từng nút.
    setTimeout(syncEdgeBadge,0);
  });

  window.addEventListener('avp:community-unread',syncEdgeBadge);

  const edgeBadgeTimer=setInterval(()=>{
    if(document.visibilityState==="visible") syncEdgeBadge();
  },3000);

  window.addEventListener(
    'pagehide',
    ()=>{
      clearInterval(edgeBadgeTimer);
      clearInterval(starUnreadTimer);
    },
    {once:true}
  );

  /* Kéo dọc màn hình + snap sát viền trái/phải, nhớ vị trí. */
  (function enableDragEdgeLauncher(root,btn){
    const POS_KEY='avp_edge_launcher_pos_v5';
    const EDGE_GAP=6;

    const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

    function sideFromX(x,w){
      return (x + w/2) < (window.innerWidth/2) ? 'left' : 'right';
    }

    function applySideClass(side){
      root.classList.toggle('is-left',side==='left');
      root.classList.toggle('is-right',side==='right');
    }

    function save(side,y){
      try{
        localStorage.setItem(POS_KEY,JSON.stringify({side,y}));
      }catch{}
    }

    function snapToEdge(side,y,animate=true){
      const w=root.offsetWidth||50;
      const h=root.offsetHeight||50;
      const maxY=Math.max(EDGE_GAP,window.innerHeight-h-EDGE_GAP);
      const top=clamp(Number(y)||Math.round(window.innerHeight*.55),EDGE_GAP,maxY);

      applySideClass(side);

      if(animate)root.classList.add('is-snapping');

      root.style.top=top+'px';
      root.style.bottom='auto';

      if(side==='left'){
        root.style.left=EDGE_GAP+'px';
        root.style.right='auto';
      }else{
        root.style.left=(window.innerWidth-w-EDGE_GAP)+'px';
        root.style.right='auto';
      }

      save(side,top);
      requestAnimationFrame(positionMiniPreview);

      if(animate){
        setTimeout(()=>root.classList.remove('is-snapping'),260);
      }
    }

    let saved=null;
    try{
      saved=JSON.parse(localStorage.getItem(POS_KEY)||'null');
    }catch{}

    if(!root.classList.contains('is-robot')){
      snapToEdge(
        saved?.side==='left'?'left':'right',
        saved?.y ?? Math.round(window.innerHeight*.56),
        false
      );
    }

    window.addEventListener('resize',()=>{
      if(root.classList.contains('is-robot'))return;
      let pos=null;
      try{
        pos=JSON.parse(localStorage.getItem(POS_KEY)||'null');
      }catch{}

      snapToEdge(
        pos?.side==='left'?'left':'right',
        pos?.y ?? root.getBoundingClientRect().top,
        false
      );
    });

    let dragging=false;
    let moved=false;
    let pointerId=null;

    let grabOffsetX=0;
    let grabOffsetY=0;

    btn.addEventListener('pointerdown',e=>{
      if(launcher.classList.contains('is-robot')){
        window.__avpBotLiftStart={y:e.clientY,x:e.clientX};
        return;
      }
      if(e.button!=null && e.button!==0)return;

      const r=root.getBoundingClientRect();

      dragging=true;
      moved=false;
      pointerId=e.pointerId;

      // Điểm người dùng chạm trong chính nút -> cảm giác kéo như AssistiveTouch.
      grabOffsetX=e.clientX-r.left;
      grabOffsetY=e.clientY-r.top;

      root.style.left=r.left+'px';
      root.style.right='auto';
      root.style.top=r.top+'px';
      root.style.bottom='auto';

      root.classList.add('is-dragging');
      setEdgeMenu(false);
      hideMiniPreview();

      try{
        btn.setPointerCapture(pointerId);
      }catch{}

      e.preventDefault();
    },{passive:false});

    btn.addEventListener('pointermove',e=>{
      if(!dragging)return;

      const w=root.offsetWidth||50;
      const h=root.offsetHeight||50;

      let x=e.clientX-grabOffsetX;
      let y=e.clientY-grabOffsetY;

      x=clamp(x,EDGE_GAP,window.innerWidth-w-EDGE_GAP);
      y=clamp(y,EDGE_GAP,window.innerHeight-h-EDGE_GAP);

      const r=root.getBoundingClientRect();
      if(Math.abs(x-r.left)>2 || Math.abs(y-r.top)>2){
        moved=true;
      }

      root.style.left=x+'px';
      root.style.right='auto';
      root.style.top=y+'px';
      root.style.bottom='auto';

      applySideClass(sideFromX(x,w));
      requestAnimationFrame(positionMiniPreview);

      e.preventDefault();
    },{passive:false});

    function finish(e){
      if(!dragging)return;

      dragging=false;
      root.classList.remove('is-dragging');

      try{
        btn.releasePointerCapture(pointerId);
      }catch{}

      if(moved){
        const r=root.getBoundingClientRect();
        const side=sideFromX(r.left,r.width);

        snapToEdge(side,r.top,true);

        btn.dataset.justDragged='1';
        setTimeout(()=>delete btn.dataset.justDragged,320);
      }
    }

    btn.addEventListener('pointerup',finish);
    btn.addEventListener('pointercancel',finish);

    btn.addEventListener('click',e=>{
      if(btn.dataset.justDragged==='1' || btn.dataset.justLifted==='1'){
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      setEdgeMenu(edgeMenu.hidden);
    });
  })(launcher,fab);

  document.addEventListener('pointerdown',e=>{
    if(!launcher.contains(e.target))setEdgeMenu(false);
  },{passive:true});

  window.addEventListener('avp:surface-open',e=>{
    if(e.detail?.surface!=='learning') closeHub();
  });

  back.addEventListener('click',e=>{if(e.target===back)closeHub()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeHub()});
  /* V82: bỏ nút bookmark nổi để giảm số nút cố định trên màn hình.
     Dữ liệu bookmark cũ vẫn được giữ nguyên trong localStorage. */


  (function avpRobotWalk(){
    if(AVP_EMBEDDED)return;
    const PAD=16;
    const POS_BOT='avp_bot_walk_x_v1';
    let x=PAD;
    let dir=1;
    try{
      const savedBot=JSON.parse(localStorage.getItem(POS_BOT)||'null');
      if(savedBot && typeof savedBot.x==='number'){
        x=savedBot.x;
        dir=savedBot.dir===-1?-1:1;
      }
    }catch(e){}
    const SPEED=0.72;
    let lifting=false;
    let liftMoved=false;
    let startY=null,startX=0;
    let talking=false;
    let bubbleToken=0;

    const GENERIC_LINES=[
      'Cần hỏi ngay trong lúc làm? Bấm AVP để mở Hỏi AI hoặc Chat Admin.',
      'Nếu đang bí, hãy hỏi đúng lỗi hoặc bước bạn đang vướng để nhận câu trả lời sát hơn.',
      'Làm trực tiếp trên file sẽ nhớ lâu hơn chỉ xem cách làm.',
      'Không cần học tất cả cùng lúc. Chọn đúng một mục rồi làm đến khi hiểu.',
      'Nếu cần người hỗ trợ, AVP vẫn giữ Hỏi AI, Từ điển, Cộng đồng và Chat Admin.',
      'Khi đã hiểu một bước, tự làm lại từ đầu sẽ giúp bạn nhớ chắc hơn.'
    ];

    const bubble=document.createElement('div');
    bubble.className='avp-bot-bubble';
    bubble.id='avpBotBubble';
    bubble.hidden=true;
    document.body.appendChild(bubble);

    function unreadNow(){
      return unreadCountFromChatBadge()+unreadCountFromCommunity()+starUnread;
    }
    function restBottom(){
      return window.innerWidth<=720?84:18;
    }
    function placeBubble(){
      const r=launcher.getBoundingClientRect();
      const bw=Math.min(252,window.innerWidth-24);
      let left=r.left+r.width/2-bw/2;
      left=Math.max(12,Math.min(left,window.innerWidth-bw-12));
      bubble.style.width=bw+'px';
      bubble.style.left=left+'px';
      bubble.style.bottom=(window.innerHeight-r.top+10)+'px';
    }
    function hideBubble(){
      bubbleToken++;
      talking=false;
      bubble.classList.remove('show');
      bubble.hidden=true;
    }
    function showLine(text,ms=2900){
      if(!text || document.visibilityState!=='visible')return Promise.resolve(false);
      const token=++bubbleToken;
      talking=true;
      bubble.textContent=text;
      bubble.hidden=false;
      bubble.classList.add('show');
      placeBubble();
      return new Promise(res=>setTimeout(()=>{
        if(token===bubbleToken){
          bubble.classList.remove('show');
          bubble.hidden=true;
          talking=false;
        }
        res(true);
      },ms));
    }
    window.AVPBotSay=(text,ms)=>showLine(String(text||''),ms||3000);

    function proAccessMessage(state){
      if(pageContext.kind!=='professional-access' || !state)return '';
      const phase=String(state.phase||state.status||'').toLowerCase();
      if(state.isAdmin || state.canAccess || phase==='approved'){
        return 'Khu Pro đã được mở cho tài khoản này. Bạn có thể vào Professional Track và bắt đầu luyện case chuyên sâu.';
      }
      if(phase==='locked' || phase==='insufficient'){
        const limits=state.limits||{basic:1500,intermediate:1300,advanced:1000,days:5};
        const missing=[];
        if(Number(state.basicScore||0)<Number(limits.basic||1500))missing.push(`Cơ bản ${Number(state.basicScore||0).toLocaleString('vi-VN')}/${Number(limits.basic||1500).toLocaleString('vi-VN')} điểm`);
        if(Number(state.intermediateScore||0)<Number(limits.intermediate||1300))missing.push(`Trung cấp ${Number(state.intermediateScore||0).toLocaleString('vi-VN')}/${Number(limits.intermediate||1300).toLocaleString('vi-VN')} điểm`);
        if(Number(state.advancedScore||0)<Number(limits.advanced||1000))missing.push(`Nâng cao ${Number(state.advancedScore||0).toLocaleString('vi-VN')}/${Number(limits.advanced||1000).toLocaleString('vi-VN')} điểm`);
        if(Number(state.activeDays||0)<Number(limits.days||5))missing.push(`${Number(state.activeDays||0)}/${Number(limits.days||5)} ngày hoạt động`);
        const detail=missing.length?` Bạn còn thiếu: ${missing.join(', ')}.`:'';
        return `Bạn chưa đủ điều kiện vào khu Pro.${detail} Hãy tiếp tục làm Bài tập tự chấm để tích điểm; khi đủ điều kiện, hệ thống sẽ mở bước tiếp theo.`;
      }
      if(phase==='eligible'){
        return 'Bạn đã đủ điểm và ngày hoạt động. Bước tiếp theo là nộp chứng chỉ để Admin xác nhận quyền vào khu Pro.';
      }
      if(phase==='pending'){
        return 'Bạn đã đủ điều kiện và đã nộp hồ sơ. Hiện chỉ cần chờ Admin xét duyệt, không cần tích thêm điểm để mở bước này.';
      }
      if(phase==='rejected'){
        return 'Hồ sơ Pro đang cần bổ sung. Hãy xem ghi chú của Admin trên trang này rồi nộp lại đúng phần còn thiếu.';
      }
      if(phase==='login'){
        return 'Bạn cần đăng nhập để hệ thống kiểm tra điểm và điều kiện vào khu Pro.';
      }
      return '';
    }
    function announceProAccess(state){
      const msg=proAccessMessage(state);
      if(!msg || document.visibilityState!=='visible')return;
      setTimeout(()=>{ if(!launcher.classList.contains('open')) showLine(msg,4600); },350);
    }
    window.addEventListener('avp:professional-access-state',e=>announceProAccess(e.detail));
    if(window.AVPProfessionalAccessState)announceProAccess(window.AVPProfessionalAccessState);

    function pick(list){
      return list?.length?list[Math.floor(Math.random()*list.length)]:'';
    }
    function contextualLine(){
      const suggestions=pageContext.suggestions||[];
      const lines=[...(pageContext.lines||[]),...GENERIC_LINES];
      if(suggestions.length && Math.random()<0.34)return pick(suggestions);
      return pick(lines)||pageContext.intro;
    }
    function nextTalkDelay(){
      if(pageContext.kind==='game')return 26000+Math.floor(Math.random()*20000);
      if(pageContext.kind==='home'||pageContext.kind==='map')return 38000+Math.floor(Math.random()*28000);
      if(pageContext.kind==='practice')return 50000+Math.floor(Math.random()*42000);
      return 90000;
    }
    function canSpeak(){
      return !launcher.classList.contains('open')&&!lifting&&document.visibilityState==='visible';
    }

    async function talkLoop(){
      /* Bài học/kho tra cứu không tự nói: giữ tập trung. */
      if(!pageContext.autoTalk)return;

      await new Promise(r=>setTimeout(r,pageContext.kind==='practice'?1600:2800));
      if(canSpeak() && pageContext.intro){
        await showLine(pageContext.intro,pageContext.kind==='practice'?3300:2800);
      }

      while(true){
        await new Promise(r=>setTimeout(r,nextTalkDelay()));
        if(!canSpeak())continue;
        const unread=unreadNow();
        if(unread>0){
          await showLine(unread>1?`Bạn có ${unread} thông báo mới chưa đọc.`:'Bạn có thông báo mới chưa đọc.',2800);
          continue;
        }
        await showLine(contextualLine(),3000);
      }
    }

    const DOCK_KEY='avp_bot_dock_right_y_v1';
    const DOCK_GAP=6;
    const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

    function w(){return Math.max(56,fab.offsetWidth||56)}
    function h(){return Math.max(72,launcher.offsetHeight||72)}
    function maxX(){return Math.max(PAD,window.innerWidth-w()-PAD)}
    function persistWalk(){
      try{localStorage.setItem(POS_BOT,JSON.stringify({x,dir}));}catch(e){}
    }
    function savedDockY(){
      try{
        const raw=localStorage.getItem(DOCK_KEY);
        if(raw!==null){
          const n=Number(raw);
          if(Number.isFinite(n))return n;
        }
      }catch(e){}
      return Math.round(window.innerHeight*.56);
    }
    function persistDock(y){
      try{localStorage.setItem(DOCK_KEY,String(Math.round(y)));}catch(e){}
    }
    function applyPos(px,bottom){
      launcher.style.left=px+'px';
      launcher.style.right='auto';
      launcher.style.top='auto';
      launcher.style.bottom=bottom+'px';
    }
    function applyDock(y,animate=false){
      const top=clamp(Number(y)||savedDockY(),DOCK_GAP,Math.max(DOCK_GAP,window.innerHeight-h()-DOCK_GAP));
      if(animate)launcher.classList.add('is-snapping');
      launcher.classList.add('is-right','is-docked-right','is-stationary');
      launcher.classList.remove('is-left','is-walking','face-left');
      launcher.style.top=Math.round(top)+'px';
      launcher.style.bottom='auto';
      launcher.style.left=Math.max(DOCK_GAP,window.innerWidth-(launcher.offsetWidth||64)-DOCK_GAP)+'px';
      launcher.style.right='auto';
      persistDock(top);
      if(!edgeMenu.hidden)requestAnimationFrame(positionDockedRobotMenu);
      if(animate)setTimeout(()=>launcher.classList.remove('is-snapping'),260);
    }

    function frame(){
      if(!lifting && ROBOT_CAN_PATROL && launcher.classList.contains('is-walking') && !launcher.classList.contains('open')){
        x+=dir*SPEED;
        const mx=maxX();
        if(x>=mx){x=mx;dir=-1}
        if(x<=PAD){x=PAD;dir=1}
        applyPos(x,PAD);
        launcher.classList.toggle('face-left',dir<0);
        if(!window.__avpBotSaveT || Date.now()-window.__avpBotSaveT>600){
          window.__avpBotSaveT=Date.now();
          persistWalk();
        }
      }
      if(!bubble.hidden)placeBubble();
      requestAnimationFrame(frame);
    }

    fab.addEventListener('pointerdown',function(e){
      if(e.button!=null && e.button!==0)return;
      lifting=false;
      liftMoved=false;
      startY=e.clientY;
      startX=e.clientX;
      try{fab.setPointerCapture(e.pointerId)}catch(err){}
    });
    fab.addEventListener('pointermove',function(e){
      if(startY==null)return;
      const dist=Math.hypot(e.clientX-startX,e.clientY-startY);

      /* Trang chủ giữ hành vi cũ: phải nhấc robot lên mới khóc. */
      if(ROBOT_CAN_PATROL){
        const dy=startY-e.clientY;
        if(dy>18 && dist>18){
          lifting=true;
          liftMoved=true;
          hideBubble();
          launcher.classList.add('is-lifted','is-crying');
          launcher.classList.remove('is-walking','is-stationary','is-greeting','open');
          edgeMenu.hidden=true;
          const bottom=Math.max(PAD,window.innerHeight-e.clientY-36);
          applyPos(Math.max(PAD,Math.min(e.clientX-32,maxX())),bottom);
        }
        return;
      }

      /* Mọi trang ngoài trang chủ: kéo tự do, robot khóc trong lúc kéo. */
      if(dist>6){
        lifting=true;
        liftMoved=true;
        hideBubble();
        launcher.classList.add('is-lifted','is-crying','is-dragging');
        launcher.classList.remove('is-walking','is-stationary','is-greeting','open');
        edgeMenu.hidden=true;
        const left=clamp(e.clientX-w()/2,DOCK_GAP,Math.max(DOCK_GAP,window.innerWidth-w()-DOCK_GAP));
        const top=clamp(e.clientY-h()/2,DOCK_GAP,Math.max(DOCK_GAP,window.innerHeight-h()-DOCK_GAP));
        launcher.style.left=Math.round(left)+'px';
        launcher.style.right='auto';
        launcher.style.top=Math.round(top)+'px';
        launcher.style.bottom='auto';
      }
    });
    function dropLift(){
      startY=null;
      if(!liftMoved){
        lifting=false;
        return;
      }
      fab.dataset.justLifted='1';
      setTimeout(()=>delete fab.dataset.justLifted,240);
      launcher.classList.remove('is-lifted','is-crying','is-dragging');
      lifting=false;
      liftMoved=false;
      if(ROBOT_CAN_PATROL){
        applyPos(x,PAD);
        if(!launcher.classList.contains('open'))launcher.classList.add('is-walking');
      }else{
        /* Luôn hút về bên phải nhưng giữ đúng độ cao người dùng vừa thả. */
        applyDock(launcher.getBoundingClientRect().top,true);
      }
    }
    fab.addEventListener('pointerup',dropLift);
    fab.addEventListener('pointercancel',dropLift);

    /* Tin nhắn mới luôn quan trọng hơn lời gợi ý. */
    window.addEventListener('avp:chat-new-message',e=>{
      if(!canSpeak())return;
      const sender=String(e.detail?.sender||'Admin').trim();
      showLine(`Bạn có tin nhắn mới từ ${sender}. Bấm AVP để xem.`,3200);
    });

    /* Khi hoàn thành bài, robot mới chủ động xuất hiện trong khu học. */
    const celebrate=()=>{
      if(document.visibilityState!=='visible')return;
      launcher.classList.remove('is-walking','is-stationary');
      launcher.classList.add('is-greeting');
      showLine('Đã ghi nhận hoàn thành. Bạn có thể học bài tiếp theo hoặc sang Khu bài tập để luyện lại.',3600)
        .finally(()=>{
          launcher.classList.remove('is-greeting');
          if(ROBOT_CAN_PATROL)launcher.classList.add('is-walking');
          else launcher.classList.add('is-stationary');
        });
    };
    window.addEventListener('avp:course-xp',celebrate);

    if(ROBOT_CAN_PATROL){
      launcher.classList.remove('is-docked-right');
      applyPos(x,PAD);
    }else{
      applyDock(savedDockY(),false);
    }
    requestAnimationFrame(frame);
    talkLoop();
    window.addEventListener('resize',()=>{
      if(ROBOT_CAN_PATROL){
        if(x>maxX())x=maxX();
        applyPos(x,PAD);
        persistWalk();
      }else{
        applyDock(savedDockY(),false);
        if(!edgeMenu.hidden)requestAnimationFrame(positionDockedRobotMenu);
      }
      placeBubble();
    });
    window.addEventListener('pagehide',()=>{if(ROBOT_CAN_PATROL)persistWalk();else persistDock(launcher.getBoundingClientRect().top)});
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden){
        hideBubble();
        if(ROBOT_CAN_PATROL)persistWalk();
        else persistDock(launcher.getBoundingClientRect().top);
      }
    });
  })();

  if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  let deferred;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;showInstall()});
  function showInstall(){if(sessionStorage.getItem('avp_install_hide'))return;const b=document.createElement('div');b.className='avp-install-banner show';b.innerHTML='<strong>📱 Cài Learn Excel như ứng dụng</strong><p>Mở nhanh hơn và dùng được một phần nội dung khi mạng yếu.</p><div class="avp-hub-actions"><button class="avp-hub-btn" data-install>Cài ứng dụng</button><button class="avp-hub-btn secondary" data-hide>Để sau</button></div>';document.body.appendChild(b);b.querySelector('[data-install]').onclick=async()=>{if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;b.remove()}};b.querySelector('[data-hide]').onclick=()=>{sessionStorage.setItem('avp_install_hide','1');b.remove()}}
})();


/* Global Download Manager loader */
(()=>{if(document.querySelector('script[data-avp-download-manager]'))return;const s=document.createElement('script');s.src='download-manager.js?v=20260828a';s.defer=true;s.dataset.avpDownloadManager='1';document.head.appendChild(s);})();
