"use strict";
// El vuelo completo se descarga únicamente al abrir el visor.
// La vista previa automática se limita a escritorio, sin ahorro de datos ni movimiento reducido.
document.addEventListener("DOMContentLoaded", () => {
  const preview = document.getElementById("hero-flight-video");
  const toggle = document.getElementById("hero-video-toggle");
  const stage = document.getElementById("flight-stage");
  const status = document.getElementById("flight-preview-status");
  const opener = document.getElementById("flight-open");
  const dialog = document.getElementById("flight-dialog");
  const full = document.getElementById("flight-full-video");
  if (!preview || !toggle || !opener || !dialog || !full) return;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = matchMedia("(max-width: 820px)");
  const connection = navigator.connection;
  let visible = false;
  let userRequested = false;
  let userPaused = false;
  let loading = false;
  let attempt = 0;

  const automaticAllowed = () => !mobile.matches && !reduced.matches &&
    !connection?.saveData && !["slow-2g", "2g", "3g"].includes(connection?.effectiveType);

  function updateButton() {
    const active = loading || !preview.paused;
    toggle.textContent = active ? "Ⅱ Pausar" : "▶ Reproducir";
    toggle.setAttribute("aria-label", active ? "Pausar vista previa" : "Reproducir vista previa");
  }

  async function syncPreview() {
    const shouldPlay = visible && !document.hidden && !dialog.open && !userPaused &&
      (userRequested || automaticAllowed());
    if (!shouldPlay) {
      ++attempt;
      loading = false;
      preview.pause();
      updateButton();
      return;
    }
    if (loading || !preview.paused) return;
    const currentAttempt = ++attempt;
    if (!preview.getAttribute("src")) preview.src = preview.dataset.src;
    preview.muted = true;
    loading = true;
    updateButton();
    try {
      await preview.play();
    } catch (error) {
      if (currentAttempt === attempt && error.name !== "AbortError") {
        userPaused = true;
        status.textContent = "Pulsa Reproducir para ver la vista previa, o abre el vuelo completo.";
      }
    } finally {
      if (currentAttempt === attempt) { loading = false; updateButton(); }
    }
  }

  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    if (loading || !preview.paused) {
      userPaused = true;
      userRequested = false;
    } else {
      userPaused = false;
      userRequested = true;
      visible = true;
      status.textContent = "Grabación real con DJI Mavic 3M · Vista previa sin sonido.";
    }
    syncPreview();
  });
  preview.addEventListener("playing", () => { stage.classList.add("has-frame"); updateButton(); });
  preview.addEventListener("pause", updateButton);
  preview.addEventListener("error", () => {
    ++attempt;
    loading = false;
    userPaused = true;
    preview.pause();
    stage.classList.remove("has-frame");
    status.textContent = "La vista previa no está disponible. Puedes abrir el vuelo completo.";
    updateButton();
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.15;
      syncPreview();
    }, {threshold:[0, 0.15]});
    observer.observe(stage);
  }
  document.addEventListener("visibilitychange", syncPreview);
  reduced.addEventListener("change", syncPreview);
  mobile.addEventListener("change", syncPreview);
  connection?.addEventListener?.("change", syncPreview);

  opener.addEventListener("click", event => {
    if (typeof dialog.showModal !== "function") return;
    event.preventDefault();
    dialog.showModal();
    document.body.classList.add("dialog-open");
    syncPreview();
    document.getElementById("flight-full-error").hidden = true;
    full.src = full.dataset.src;
    full.play().catch(() => { /* Los controles nativos permiten iniciar si el navegador bloquea el sonido. */ });
  });
  full.addEventListener("error", () => {
    if (dialog.open) document.getElementById("flight-full-error").hidden = false;
  });
  document.getElementById("flight-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    full.pause();
    full.removeAttribute("src");
    full.load();
    document.body.classList.remove("dialog-open");
    opener.focus({preventScroll:true});
    syncPreview();
  });
  window.addEventListener("pagehide", () => { preview.pause(); full.pause(); });
});
