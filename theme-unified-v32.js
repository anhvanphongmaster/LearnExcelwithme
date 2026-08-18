(function(){
  // Giao diện tối đã tắt — luôn light mode
  try { localStorage.setItem("theme", "light"); } catch(e) {}
  document.documentElement.classList.remove("dark-mode");
  function forceLight(){
    document.body && document.body.classList.remove("dark-mode");
    document.querySelectorAll("#themeToggle, .top-theme-button").forEach(function(b){
      b.style.display = "none";
      b.hidden = true;
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", forceLight);
  } else {
    forceLight();
  }
})();
