(()=>{
'use strict';

const PANEL_SELECTOR='[data-admin-section="tools"]';
const CORE_SRC='admin-tools-core.js?v=20260909-panel1';

function ensurePanel(){
  if(document.querySelector(PANEL_SELECTOR)) return true;

  const analyticsHeading=document.querySelector('.admin-section-heading[data-admin-section="analytics"]');
  const dashboard=document.getElementById('adminDashboard');
  const parent=analyticsHeading?.parentElement||dashboard;
  if(!parent){
    console.error('[Admin Tool] Không tìm thấy adminDashboard để khôi phục panel Tool.');
    return false;
  }

  const template=document.createElement('template');
  template.innerHTML=`
    <div class="admin-section-heading admin-view-section" data-admin-section="tools">
      <span>🧰 KHO TOOL</span>
      <h2>Quản lý Tool & nhu cầu cộng đồng</h2>
    </div>

    <section class="admin-panel admin-view-section admin-tools-panel" id="adminToolsPanel" data-admin-section="tools">
      <div class="admin-panel-head">
        <div>
          <span>🧰 TOOL LIBRARY</span>
          <h2>Phát hành Tool</h2>
          <p>Tạo bản nháp trước, sau đó gắn ZIP, ngày phát hành và video TikTok hướng dẫn để đưa Tool lên website.</p>
        </div>
        <button type="button" id="atReload">↻ Làm mới</button>
      </div>

      <div class="at-kpis">
        <article><small>Tổng Tool</small><strong id="atTotal">0</strong></article>
        <article><small>Đã phát hành</small><strong id="atActive">0</strong></article>
        <article><small>Lượt cần Tool</small><strong id="atIdeas">0</strong></article>
      </div>

      <div class="at-layout">
        <section class="at-box">
          <h3>Tool editor</h3>
          <p>Bản nháp không hiện ngoài website. Khi phát hành cần đủ file ZIP, ngày phát hành và link TikTok hướng dẫn.</p>

          <form id="atToolForm" class="at-form">
            <input id="atToolId" type="hidden">

            <label>
              <span>Thứ tự</span>
              <input id="atToolOrder" type="number" min="0" max="9999" step="1" value="0">
            </label>

            <label>
              <span>Trạng thái</span>
              <select id="atToolStatus">
                <option value="draft">Bản nháp</option>
                <option value="published">Phát hành</option>
              </select>
            </label>

            <label class="wide">
              <span>Tên Tool</span>
              <input id="atToolName" type="text" maxlength="120" placeholder="Ví dụ: Tool gộp file Excel" required>
            </label>

            <label class="wide">
              <span>Ứng dụng</span>
              <input id="atToolApplication" type="text" maxlength="240" placeholder="Excel · Power Query · Công việc văn phòng">
            </label>

            <label class="wide">
              <span>Mô tả</span>
              <textarea id="atToolDescription" rows="4" maxlength="1200" placeholder="Tool giải quyết việc gì, phù hợp với ai…"></textarea>
            </label>

            <label>
              <span>Ngày phát hành</span>
              <input id="atToolReleaseDate" type="date">
              <small>Dùng để hiển thị ngày ra Tool và tính lịch Tool tiếp theo.</small>
            </label>

            <label>
              <span>TikTok hướng dẫn</span>
              <input id="atToolTikTok" type="url" maxlength="1200" placeholder="https://www.tiktok.com/@.../video/...">
              <small>Được gắn trực tiếp vào thẻ Tool ngoài website.</small>
            </label>

            <label class="wide">
              <span>File Tool · ZIP</span>
              <input id="atToolFile" type="file" accept=".zip,application/zip">
              <small id="atFileCurrent" class="at-file-current">Chưa có file ZIP đang gắn.</small>
            </label>

            <div class="at-actions">
              <button id="atToolSave" type="submit" class="primary">Lưu Tool</button>
              <button id="atToolReset" type="button">Tạo mới / Hủy sửa</button>
            </div>

            <p id="atNotice" class="at-notice" role="status"></p>
          </form>
        </section>

        <section class="at-box">
          <div class="at-toolbar">
            <div>
              <h3>Danh sách Tool</h3>
              <p>Quản lý bản nháp, Tool đang phát hành, file và video hướng dẫn.</p>
            </div>
          </div>
          <div id="atToolList" class="at-list">
            <div class="at-empty">Chuyển sang tab Tool để tải dữ liệu.</div>
          </div>
        </section>
      </div>

      <section class="at-box at-ideas">
        <div class="at-toolbar">
          <div>
            <h3>Ý tưởng cộng đồng</h3>
            <p>Đổi tên, gộp ý tưởng trùng và cập nhật trạng thái ưu tiên mà không làm mất lượt nhu cầu hợp lệ.</p>
          </div>
        </div>
        <div id="atIdeaList">
          <div class="at-empty">Chuyển sang tab Tool để tải ý tưởng.</div>
        </div>
      </section>
    </section>`;

  if(analyticsHeading) parent.insertBefore(template.content,analyticsHeading);
  else parent.appendChild(template.content);
  return !!document.getElementById('adminToolsPanel');
}

function loadCore(){
  if(window.__avpAdminToolsCoreLoading) return;
  window.__avpAdminToolsCoreLoading=true;
  const script=document.createElement('script');
  script.src=CORE_SRC;
  script.async=false;
  script.dataset.avpAdminToolsCore='1';
  script.onload=()=>{
    window.__avpAdminToolsCoreReady=true;
    const toolTab=document.querySelector('.admin-view-tabs [data-admin-view="tools"]');
    const panel=document.getElementById('adminToolsPanel');
    if(toolTab?.classList.contains('active') && panel && !panel.classList.contains('admin-view-hidden')){
      window.dispatchEvent(new CustomEvent('avp:admin-tools-open'));
    }
  };
  script.onerror=()=>{
    window.__avpAdminToolsCoreLoading=false;
    const notice=document.getElementById('atNotice');
    if(notice) notice.textContent='Không tải được module quản lý Tool. Hãy tải lại trang.';
  };
  document.head.appendChild(script);
}

if(ensurePanel()) loadCore();
})();
