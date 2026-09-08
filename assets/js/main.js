"use strict";
const AgroUI = {
  escape(value) { return String(value ?? "").replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character])); },
  postCard(post) {
    const e = AgroUI.escape;
    const href = "post.html?id=" + encodeURIComponent(post.id);
    return `<article class="blog-card"><a class="blog-card-image" href="${href}" tabindex="-1" aria-hidden="true"><img src="${e(post.image)}" alt="" width="1200" height="800" loading="lazy" decoding="async"></a><div class="blog-card-body"><span class="eyebrow">${e(post.category)}</span><div class="post-date"><time datetime="${e(post.publishedAt)}">${e(post.date)}</time> · ${e(post.readTime)}</div><h3><a href="${href}">${e(post.title)}</a></h3><p>${e(post.excerpt)}</p><a class="text-link" href="${href}" aria-label="Leer: ${e(post.title)}">Leer artículo ↗</a></div></article>`;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initContactLinks();
  document.querySelectorAll("[data-year]").forEach(element => { element.textContent = new Date().getFullYear(); });
  if (document.getElementById("services-grid")) initHome();
});

function initMobileMenu() {
  const button = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (!button || !menu) return;
  function toggle(open) {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menu.classList.toggle("is-open", open);
  }
  button.addEventListener("click", () => toggle(button.getAttribute("aria-expanded") !== "true"));
  menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => toggle(false)));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") { toggle(false); button.focus(); }
  });
  document.addEventListener("click", event => {
    if (!menu.contains(event.target) && !button.contains(event.target)) toggle(false);
  });
  const wide = matchMedia("(min-width: 821px)");
  wide.addEventListener("change", () => toggle(false));
}

function initContactLinks() {
  const url = AgroModAPI.getWhatsAppUrl("Hola, AgroMod. Me gustaría conversar sobre la evaluación de mi lote.");
  document.querySelectorAll("[data-whatsapp]").forEach(link => {
    link.hidden = !url;
    if (url) {
      link.href = url;
      const number = COMPANY_INFO.whatsapp.replace(/\D/g, "");
      const displayNumber = /^51\d{9}$/.test(number)
        ? `+51 ${number.slice(2,5)} ${number.slice(5,8)} ${number.slice(8)}`
        : COMPANY_INFO.whatsapp;
      link.textContent = "WhatsApp · " + displayNumber;
    }
  });
}

async function initHome() {
  initGallery();
  initInquiry();
  const grid = document.getElementById("services-grid");
  const select = document.getElementById("quote-service");
  try {
    const services = await AgroModAPI.getServices();
    const e = AgroUI.escape;
    grid.innerHTML = services.map((service, index) => `
      <article class="service-card"><div class="service-top"><div class="service-icon" aria-hidden="true">${e(service.icon)}</div><span>0${index + 1}</span></div><span class="eyebrow">${e(service.tag)}</span><h3>${e(service.title)}</h3><p>${e(service.shortDescription)}</p><ul>${service.benefits.map(benefit => "<li>" + e(benefit) + "</li>").join("")}</ul><a class="text-link service-request" href="#cotizador" data-service="${e(service.id)}">Consultar servicio ↗<span class="sr-only">: ${e(service.title)}</span></a></article>`).join("");
    services.forEach(service => select.add(new Option(service.title, service.id)));
    grid.querySelectorAll(".service-request").forEach(link => link.addEventListener("click", () => {
      document.getElementById("quote-form").hidden = false;
      select.value = link.dataset.service;
      select.dispatchEvent(new Event("change", {bubbles:true}));
    }));
  } catch {
    grid.innerHTML = '<p class="error-message">No pudimos cargar los servicios. Recarga la página para volver a intentar.</p>';
  }
  const postsGrid = document.getElementById("recent-blog-grid");
  try {
    postsGrid.innerHTML = (await AgroModAPI.getBlogPosts()).slice(0,3).map(AgroUI.postCard).join("");
  } catch {
    postsGrid.innerHTML = '<p>No pudimos cargar los artículos. <a class="text-link" href="blog.html">Abrir el blog</a></p>';
  }
}

function initGallery() {
  const grid = document.getElementById("gallery-grid");
  const indexSelect = document.getElementById("gallery-index");
  const count = document.getElementById("gallery-count");
  const filters = document.querySelectorAll("[data-crop]");
  const dialog = document.getElementById("map-dialog");
  const image = document.getElementById("map-dialog-image");
  let crop = "all";
  let opener = null;
  function render() {
    const items = AgroModAPI.getGallery(crop, indexSelect.value);
    count.textContent = items.length + (items.length === 1 ? " mapa disponible" : " mapas disponibles");
    const e = AgroUI.escape;
    grid.innerHTML = items.length ? items.map(item => `
      <article class="map-card"><button class="map-open" type="button" data-map="${e(item.id)}" aria-label="Ver mapa: ${e(item.title)}"><img src="${e(item.image)}" width="${item.width}" height="${item.height}" loading="lazy" decoding="async" alt="${e(item.cropLabel + " · " + item.indices.join(" / "))}"><span class="map-open-label">Ver mapa completo ↗</span></button><div class="map-card-copy"><div class="map-card-meta"><span>${e(item.cropLabel)}</span><span>${e(item.indices.join(" + "))}</span></div><h3>${e(item.title)}</h3><p>${e(item.description)}</p></div></article>`).join("") : '<div class="empty-state"><h3>No hay muestras con esta combinación.</h3><p>Prueba otro cultivo o consulta todos los índices.</p><button class="button button-outline" type="button" id="gallery-reset">Ver todos los mapas</button></div>';
    document.getElementById("gallery-reset")?.addEventListener("click", () => {
      crop = "all"; indexSelect.value = "all";
      filters.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.crop === crop)));
      render();
      filters[0].focus();
    });
  }
  filters.forEach(button => button.addEventListener("click", () => {
    crop = button.dataset.crop;
    filters.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    render();
  }));
  indexSelect.addEventListener("change", render);
  grid.addEventListener("click", event => {
    const button = event.target.closest("[data-map]");
    if (!button) return;
    const item = GALLERY_DATA.find(map => map.id === button.dataset.map);
    if (!item) return;
    opener = button;
    image.src = item.image; image.alt = item.title; image.width = item.width; image.height = item.height;
    document.getElementById("map-dialog-title").textContent = item.cropLabel + " · " + item.indices.join(" + ");
    document.getElementById("map-dialog-caption").textContent = item.description + " Imagen original; consulta la escala de esta captura.";
    document.getElementById("map-original").href = item.image;
    dialog.showModal();
    document.body.classList.add("dialog-open");
  });
  document.getElementById("map-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    opener?.focus();
  });
  render();
}

function initInquiry() {
  const form = document.getElementById("quote-form");
  const result = document.getElementById("quote-result");
  const error = document.getElementById("quote-error");
  const summary = document.getElementById("quote-summary");
  const whatsapp = document.getElementById("quote-whatsapp");
  const status = document.getElementById("copy-status");
  const clearDraft = () => {
    result.hidden = true; summary.value = ""; status.textContent = "";
    whatsapp.removeAttribute("href"); whatsapp.hidden = true;
    error.hidden = true;
  };
  form.addEventListener("input", clearDraft);
  form.addEventListener("change", clearDraft);
  form.addEventListener("submit", event => {
    event.preventDefault();
    error.hidden = true;
    try {
      const draft = AgroModAPI.prepareQuote(Object.fromEntries(new FormData(form)));
      summary.value = draft.message;
      const url = AgroModAPI.getWhatsAppUrl(draft.message);
      whatsapp.hidden = !url;
      if (url) whatsapp.href = url; else whatsapp.removeAttribute("href");
      document.getElementById("contact-unavailable").hidden = !!url;
      status.textContent = "";
      form.hidden = true; result.hidden = false;
      document.getElementById("result-title").focus({preventScroll:true});
      result.scrollIntoView({block:"start", behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
    } catch (reason) {
      error.textContent = reason.message;
      error.hidden = false;
    }
  });
  document.getElementById("quote-edit").addEventListener("click", () => {
    clearDraft(); form.hidden = false;
    document.getElementById("quote-name").focus();
  });
  document.getElementById("quote-copy").addEventListener("click", async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(summary.value);
      status.textContent = "Resumen copiado. Todavía no se ha enviado.";
    } catch {
      summary.focus(); summary.select();
      status.textContent = "Seleccionamos el resumen. Usa Copiar en el menú del dispositivo o Ctrl+C.";
    }
  });
}
