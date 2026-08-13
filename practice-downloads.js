
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("practiceToggleBtn");
  const extras = [...document.querySelectorAll("#tai-lieu .practice-extra")];

  if (!btn || !extras.length) return;

  function setExpanded(expanded){
    extras.forEach(card => card.classList.toggle("practice-visible", expanded));
    btn.setAttribute("aria-expanded", String(expanded));
    btn.innerHTML = expanded
      ? "▲ Thu gọn tài liệu"
      : `📚 Xem thêm ${extras.length} tài liệu`;
  }

  setExpanded(false);

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    setExpanded(!expanded);

    if (expanded) {
      document.getElementById("tai-lieu")?.scrollIntoView({
        behavior:"smooth",
        block:"start"
      });
    }
  });
});
