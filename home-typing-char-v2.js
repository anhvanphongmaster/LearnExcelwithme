(() => {
  if (window.__avpTypingCharV2) return;
  window.__avpTypingCharV2 = true;

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

  function start() {
    const old = document.getElementById("avpTyping");
    if (!old) return;

    const typing = old.cloneNode(false);
    typing.textContent = "";
    old.replaceWith(typing);

    let line = 0;
    let char = 0;
    let deleting = false;
    let nextAt = performance.now() + 250;
    let raf = 0;
    const TYPE_MS = 55;
    const DEL_MS = 35;
    const HOLD_MS = 2300;
    const GAP_MS = 360;

    function frame(now) {
      if (document.hidden) {
        nextAt = now + 300;
        raf = requestAnimationFrame(frame);
        return;
      }
      if (now < nextAt) {
        raf = requestAnimationFrame(frame);
        return;
      }

      const text = lines[line] || "";
      if (!deleting) {
        char = Math.min(text.length, char + 1);
        typing.textContent = text.slice(0, char);
        if (char >= text.length) {
          deleting = true;
          nextAt = now + HOLD_MS;
        } else {
          nextAt = now + TYPE_MS;
        }
      } else {
        char = Math.max(0, char - 1);
        typing.textContent = text.slice(0, char);
        if (char <= 0) {
          deleting = false;
          line = (line + 1) % lines.length;
          nextAt = now + GAP_MS;
        } else {
          nextAt = now + DEL_MS;
        }
      }
      raf = requestAnimationFrame(frame);
    }

    cancelAnimationFrame(window.__avpTypingCharV2Raf || 0);
    window.__avpTypingCharV2Raf = requestAnimationFrame(frame);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
