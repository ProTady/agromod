/**
 * AGROMOD - Lógica Principal e Interactividad de la Web
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  loadServices();
  loadRecentBlogPosts();
  initQuoteCalculator();
});

/* ==========================================================================
   Menú Móvil
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    // Cerrar al hacer clic en cualquier enlace
    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }
}

/* ==========================================================================
   Cargar Servicios Dinámicamente desde AgroModAPI
   ========================================================================== */
async function loadServices() {
  const container = document.getElementById("services-container");
  if (!container) return;

  try {
    const services = await AgroModAPI.getServices();
    
    container.innerHTML = services.map(service => `
      <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-agro card-hover flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-6">
            <span class="badge-pill bg-green-100 text-green-800">${service.tag}</span>
            <div class="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-lg">
              ${getIconHtml(service.icon)}
            </div>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">${service.title}</h3>
          <p class="text-gray-600 text-sm leading-relaxed mb-6">${service.shortDescription}</p>
          
          <div class="space-y-2 mb-6">
            ${service.benefits.slice(0, 3).map(b => `
              <div class="flex items-start text-xs text-gray-700">
                <svg class="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>${b}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <button onclick="prefillQuote('${service.id}')" class="w-full py-3 px-4 bg-gray-50 hover:bg-green-600 hover:text-white text-gray-800 font-semibold text-sm rounded-xl transition duration-200 text-center block">
          Cotizar este servicio &rarr;
        </button>
      </div>
    `).join('');
  } catch (error) {
    console.error("Error al cargar servicios:", error);
    container.innerHTML = `<p class="text-center text-red-500 col-span-3">No se pudieron cargar los servicios en este momento.</p>`;
  }
}

/* ==========================================================================
   Cargar Artículos Recientes en la Portada
   ========================================================================== */
async function loadRecentBlogPosts() {
  const container = document.getElementById("recent-posts-container");
  if (!container) return;

  try {
    const posts = await AgroModAPI.getBlogPosts();
    const recent = posts.slice(0, 3); // Primeros 3 artículos

    container.innerHTML = recent.map(post => `
      <article class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-agro card-hover flex flex-col">
        <div class="h-48 overflow-hidden relative">
          <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
          <span class="absolute top-4 left-4 badge-pill bg-white/95 text-gray-900 backdrop-blur shadow-sm">
            ${post.category}
          </span>
        </div>
        <div class="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center text-xs text-gray-400 mb-2 space-x-2">
              <span>${post.date}</span>
              <span>•</span>
              <span>${post.readTime}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2 leading-snug hover:text-green-600 transition">
              <a href="post.html?id=${post.id}">${post.title}</a>
            </h3>
            <p class="text-gray-600 text-xs line-clamp-3 mb-4 leading-relaxed">${post.excerpt}</p>
          </div>
          <a href="post.html?id=${post.id}" class="text-xs font-bold text-green-600 hover:text-green-700 inline-flex items-center">
            Leer artículo completo
            <svg class="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </article>
    `).join('');
  } catch (error) {
    console.error("Error al cargar artículos recientes:", error);
  }
}

/* ==========================================================================
   Cotizador Interactivo con Salida a WhatsApp / API
   ========================================================================== */
function initQuoteCalculator() {
  const form = document.getElementById("quote-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("quote-name").value.trim();
    const phone = document.getElementById("quote-phone").value.trim();
    const crop = document.getElementById("quote-crop").value;
    const hectares = parseFloat(document.getElementById("quote-hectares").value) || 0;
    const serviceType = document.getElementById("quote-service").value;
    const notes = document.getElementById("quote-notes") ? document.getElementById("quote-notes").value : "";

    if (!name || !phone || hectares <= 0) {
      alert("Por favor completa tu nombre, teléfono y un número válido de hectáreas.");
      return;
    }

    // Estimación de costo referencial
    let pricePerHa = 35; // USD base
    if (serviceType === "vuelos-multiespectrales") pricePerHa = 30;
    if (serviceType === "monitoreo-fitosanitario") pricePerHa = 25;
    if (serviceType === "completo") pricePerHa = 48;

    if (hectares > 100) pricePerHa *= 0.85; // 15% desc volumen
    else if (hectares > 50) pricePerHa *= 0.90; // 10% desc

    const estimatedTotal = Math.round(hectares * pricePerHa);

    const quotePayload = {
      name,
      phone,
      crop,
      hectares,
      serviceType,
      estimatedTotalUSD: estimatedTotal,
      notes
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerText = "Procesando...";

    try {
      // 1. Guardar vía API (Local o Backend)
      await AgroModAPI.submitQuote(quotePayload);

      // 2. Mostrar confirmación en pantalla
      const resultBox = document.getElementById("quote-result-box");
      if (resultBox) {
        document.getElementById("quote-res-name").innerText = name;
        document.getElementById("quote-res-ha").innerText = `${hectares} ha (${crop})`;
        document.getElementById("quote-res-est").innerText = `$${estimatedTotal} USD aprox.`;
        resultBox.classList.remove("hidden");
      }

      // 3. Preparar enlace a WhatsApp
      const waMessage = encodeURIComponent(
        `¡Hola AgroMod! Solicito cotización formal:\n` +
        `👤 Nombre: ${name}\n` +
        `🌱 Cultivo: ${crop}\n` +
        `📐 Hectáreas: ${hectares} ha\n` +
        `🛰️ Servicio de interés: ${serviceType}\n` +
        `💰 Estimado referencial: $${estimatedTotal} USD\n` +
        (notes ? `📝 Notas: ${notes}\n` : "") +
        `Quedo atento a su propuesta técnica.`
      );

      const waBtn = document.getElementById("btn-send-whatsapp");
      if (waBtn) {
        waBtn.href = `https://wa.me/51999999999?text=${waMessage}`; // Ajustar con el WhatsApp real
      }

      submitBtn.innerHTML = "✓ Cotización Generada";
    } catch (err) {
      console.error(err);
      alert("Hubo un error al registrar la cotización. Inténtalo de nuevo.");
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

function prefillQuote(serviceId) {
  const serviceSelect = document.getElementById("quote-service");
  if (serviceSelect) {
    serviceSelect.value = serviceId;
  }
  const quoteSection = document.getElementById("cotizador");
  if (quoteSection) {
    quoteSection.scrollIntoView({ behavior: "smooth" });
  }
}

/* ==========================================================================
   Helper de Iconos SVG
   ========================================================================== */
function getIconHtml(type) {
  switch(type) {
    case 'drone':
      return `<svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>`;
    case 'bug':
      return `<svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>`;
    case 'dashboard':
      return `<svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>`;
    case 'brain':
      return `<svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`;
    default:
      return `<svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`;
  }
}
