(() => {
  'use strict';
  if (window.__AVP_HOME_LEARNING_PLATFORM_V1__) return;
  window.__AVP_HOME_LEARNING_PLATFORM_V1__ = true;

  function loadCatalog(done){
    if(window.AVPLearningPlatform){done();return}
    const s=document.createElement('script');
    s.src='learning-platform-catalog-v1.js?v=20260911-session1';
    s.onload=done;
    document.head.appendChild(s);
  }

  function esc(v){return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}

  function render(){
    const platform=window.AVPLearningPlatform;
    const shell=document.querySelector('.home-path-inner');
    const grid=shell?.querySelector('.home-path-grid');
    if(!platform||!shell||!grid)return;

    const title=shell.querySelector(':scope > h2');
    const desc=shell.querySelector(':scope > p');
    if(title)title.textContent='Lộ trình Excel A–Z';
    if(desc)desc.textContent='8 module rõ ràng. Bấm vào một module để xem danh sách bài; luôn có đường quay lại và tiếp tục đúng chỗ đang học.';

    grid.className='home-path-grid home-platform-grid-v1';
    grid.innerHTML=platform.modules.map(module=>`
      <a class="home-platform-module-v1 tone-${esc(module.tone)}" href="${platform.moduleUrl(module.id)}">
        <span class="home-platform-no-v1">${esc(module.number)}</span>
        <span class="home-platform-copy-v1">
          <small>${esc(module.label)}</small>
          <strong>${esc(module.title)}</strong>
          <em>${esc(module.short)}</em>
          <b>${module.lessons.length} bài · Xem danh sách →</b>
        </span>
      </a>`).join('');

    const tease=document.querySelector('#avpScrollTease .avp-tease-title');
    if(tease){
      const chev=tease.querySelector('.avp-tease-chevs');
      tease.innerHTML='';
      if(chev)tease.appendChild(chev);
      tease.append(document.createTextNode(' Lộ trình Excel A–Z · 8 module'));
    }

    const css=document.createElement('style');
    css.id='homeLearningPlatformV1Styles';
    css.textContent=`
      .home-platform-grid-v1{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:12px!important}
      .home-platform-module-v1{min-width:0;display:grid;grid-template-columns:42px minmax(0,1fr);gap:11px;align-items:start;padding:15px;border:1px solid #d9e6de;border-radius:16px;background:#fff;color:#173f2a;text-decoration:none;box-shadow:0 6px 18px rgba(23,70,43,.045);transition:.18s ease}
      .home-platform-module-v1:hover{transform:translateY(-3px);border-color:#9fc9ae;box-shadow:0 12px 28px rgba(23,70,43,.09)}
      .home-platform-no-v1{display:grid;place-items:center;width:42px;height:42px;border-radius:12px;background:#eaf7ef;color:#17633b;font-size:12px;font-weight:950}
      .home-platform-copy-v1{min-width:0;display:block}.home-platform-copy-v1 small{display:block;color:#4d8060;font-size:8px;font-weight:950;letter-spacing:.08em}.home-platform-copy-v1 strong{display:block;margin-top:3px;color:#173f2a;font-size:14px;line-height:1.3}.home-platform-copy-v1 em{display:block;margin-top:5px;color:#6d7e74;font-style:normal;font-size:10px;line-height:1.45}.home-platform-copy-v1 b{display:block;margin-top:9px;color:#217346;font-size:9px}
      .tone-blue .home-platform-no-v1{background:#edf5fb;color:#356f9f}.tone-teal .home-platform-no-v1{background:#e9f7f5;color:#287c72}.tone-indigo .home-platform-no-v1{background:#eef0fb;color:#4d5da8}.tone-purple .home-platform-no-v1{background:#f2edf9;color:#72599a}.tone-rose .home-platform-no-v1{background:#fbefef;color:#9d5454}.tone-sand .home-platform-no-v1{background:#fbf2e5;color:#8b6634}.tone-orange .home-platform-no-v1{background:#fff0e5;color:#9a5d2e}
      body.dark-mode .home-platform-module-v1{background:#17251d;border-color:#30473a;color:#e1efe6}body.dark-mode .home-platform-copy-v1 strong{color:#e5f3e9}body.dark-mode .home-platform-copy-v1 em{color:#a8b8af}
      @media(max-width:980px){.home-platform-grid-v1{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
      @media(max-width:560px){.home-platform-grid-v1{grid-template-columns:1fr!important}.home-platform-module-v1{grid-template-columns:40px minmax(0,1fr)}}
    `;
    if(!document.getElementById(css.id))document.head.appendChild(css);
  }

  function boot(){loadCatalog(render)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
