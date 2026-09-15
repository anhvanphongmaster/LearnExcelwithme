(() => {
  const original = document.getElementById("avpTyping");
  if (!original || window.__avpTypingCharV1) return;
  window.__avpTypingCharV1 = true;

  // Replace the node so the older typing loop cannot keep updating it.
  const typing = original.cloneNode(false);
  original.replaceWith(typing);

  const lines = [
    "100+ công thức Excel đang chờ bạn",
    "Excel • Office • Productivity",
    "Học nhanh hơn. Làm việc thông minh hơn.",
    "Từ dữ liệu thô → báo cáo chuyên nghiệp",
    "Thực hành theo video • File mẫu sẵn",
    "Power Query • Pivot • Dashboard",
    "Làm sạch dữ liệu trong vài bước",
    "Đua top học viên trên Excel Race",
    "Tự động hóa — ít click, nhiều kết quả",
    "Beginner → Master: một lộ trình rõ ràng"
  ];

  const chars = lines.map(text => Array.from(text));
  let line = 0;
  let index = 0;
  let deleting = false;
  let timer = 0;

  const TYPE_MS = 65;
  const DEL_MS = 38;
  const HOLD_MS = 2300;
  const GAP_MS = 360;

  function render() {
    typing.textContent = chars[line].slice(0, index).join("");
  }

  function schedule(ms) {
    clearTimeout(timer);
    timer = setTimeout(step, ms);
  }

  function step() {
    if (document.hidden) {
      schedule(500);
      return;
    }

    const current = chars[line];
    if (!deleting) {
      index = Math.min(current.length, index + 1);
      render();
      if (index >= current.length) {
        deleting = true;
        schedule(HOLD_MS);
      } else {
        schedule(TYPE_MS);
      }
    } else {
      index = Math.max(0, index - 1);
      render();
      if (index <= 0) {
        deleting = false;
        line = (line + 1) % chars.length;
        schedule(GAP_MS);
      } else {
        schedule(DEL_MS);
      }
    }
  }

  typing.textContent = "";
  schedule(300);
  window.addEventListener("pagehide", () => clearTimeout(timer), { once: true });
})();
