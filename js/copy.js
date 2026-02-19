// js/copy.ts
document.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-copy]");
  if (!btn) {
    return;
  }
  let textToCopy = btn.getAttribute("data-copy");
  textToCopy = textToCopy.replace(/^[\$>\s]+/, "");
  navigator?.clipboard?.writeText(textToCopy).then(() => {
    if (!btn) {
      return;
    }
    const copyIcon = btn.querySelector(".copy-icon");
    const checkIcon = btn.querySelector(".check-icon");
    if (copyIcon && checkIcon) {
      copyIcon.classList.add("hidden");
      checkIcon.classList.remove("hidden");
      setTimeout(() => {
        copyIcon.classList.remove("hidden");
        checkIcon.classList.add("hidden");
      }, 2e3);
    }
  });
});
