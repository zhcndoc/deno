// js/copy-page.ts
document.querySelectorAll(".copy-page-main-btn").forEach(
  (btn) => {
    btn.addEventListener("click", () => {
      navigator?.clipboard?.writeText(window.location.href).then(() => {
        const label = btn.querySelector(".copy-page-main-label");
        if (label) {
          const original = label.textContent;
          label.textContent = "Copied!";
          setTimeout(() => {
            label.textContent = original;
          }, 2e3);
        }
      }).catch(() => {
        const label = btn.querySelector(".copy-page-main-label");
        if (label) {
          const original = label.textContent;
          label.textContent = "Copy failed";
          setTimeout(() => {
            label.textContent = original;
          }, 2e3);
        }
      });
    });
  }
);
var panel = document.getElementById("copy-page-menu");
var toggleBtn = document.querySelector(
  ".copy-page-toggle-btn"
);
panel?.addEventListener("toggle", (event) => {
  const e = event;
  const chevron = toggleBtn?.querySelector(".copy-page-chevron");
  if (e.newState === "open" && toggleBtn) {
    const rect = toggleBtn.getBoundingClientRect();
    panel.style.top = `${rect.bottom + 4}px`;
    panel.style.right = `${window.innerWidth - rect.right}px`;
  }
  if (chevron) {
    chevron.style.transform = e.newState === "open" ? "rotate(180deg)" : "";
  }
});
