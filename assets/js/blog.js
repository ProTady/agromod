/**
 * AGROMOD - Lógica del Blog y Visor de Artículos
 */

document.addEventListener("DOMContentLoaded", () => {
  // Si estamos en blog.html
  if (document.getElementById("blog-grid")) {
    initBlogPage();
  }

  // Si estamos en post.html
  if (document.getElementById("post-article-container")) {
    initSinglePostPage();
  }
});

/* ==========================================================================
   Portal del Blog (blog.html)
   ========================================================================== */
async function initBlogPage() {
  const blogGrid = document.getElementById("blog-grid");
  const searchInput = document.getElementById("blog-search");
  const filterButtons = document.querySelectorAll(".category-filter-btn");

  let currentCategory = "all";
  let currentSearch = "";

  async function renderFeed() {
    blogGrid.innerHTML = `
      <div class="col-span-3 text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
        <p class="text-sm text-gray-500 mt-2">Cargando publicaciones...</p>
      </div>
    `;

    try {
      const posts = await AgroModAPI.getBlogPosts(currentCategory, currentSearch);

      if (posts.length === 0) {
        blogGrid.innerHTML = `
          <div class="col-span-3 text-center py-16 bg-white rounded-2xl border border-gray-100 p-8">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            <h4 class="text-lg font-bold text-gray-800 mb-1">No se encontraron artículos</h4>
            <p class="text-gray-500 text-sm">Intenta buscar con otros términos o cambiar la categoría.</p>
          </div>
        `;
        return;
      }

      blogGrid.innerHTML = posts.map(post => `
        <article class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-agro card-hover flex flex-col">
          <div class="h-52 overflow-hidden relative">
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
              <h3 class="text-xl font-bold text-gray-900 mb-3 leading-snug hover:text-green-600 transition">
                <a href="post.html?id=${post.id}">${post.title}</a>
              </h3>
              <p class="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">${post.excerpt}</p>
            </div>
            <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span class="text-xs text-gray-500 font-medium">${post.author}</span>
              <a href="post.html?id=${post.id}" class="text-xs font-bold text-green-600 hover:text-green-700 inline-flex items-center">
                Leer artículo &rarr;
              </a>
            </div>
          </div>
        </article>
      `).join('');
    } catch (err) {
      console.error(err);
      blogGrid.innerHTML = `<p class="col-span-3 text-center text-red-500">Error al cargar los artículos del blog.</p>`;
    }
  }

  // Eventos de botones de categoría
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => {
        b.classList.remove("bg-green-600", "text-white");
        b.classList.add("bg-gray-100", "text-gray-700");
      });
      btn.classList.add("bg-green-600", "text-white");
      btn.classList.remove("bg-gray-100", "text-gray-700");

      currentCategory = btn.getAttribute("data-category");
      renderFeed();
    });
  });

  // Evento de búsqueda con debounce
  if (searchInput) {
    let timeout = null;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        currentSearch = e.target.value;
        renderFeed();
      }, 300);
    });
  }

  // Carga inicial
  renderFeed();
}

/* ==========================================================================
   Visor de Artículo Individual (post.html)
   ========================================================================== */
async function initSinglePostPage() {
  const container = document.getElementById("post-article-container");
  const relatedContainer = document.getElementById("related-posts-container");

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id") || 1; // Default al 1 si no hay param

  try {
    const post = await AgroModAPI.getPostById(postId);

    if (!post) {
      container.innerHTML = `
        <div class="text-center py-20">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Artículo no encontrado</h2>
          <p class="text-gray-600 mb-6">El artículo que buscas no existe o ha sido reubicado.</p>
          <a href="blog.html" class="inline-block py-2 px-6 bg-green-600 text-white rounded-xl font-bold text-sm">Volver al Blog</a>
        </div>
      `;
      return;
    }

    // Actualizar título de la pestaña del navegador
    document.title = `${post.title} | Blog AgroMod`;

    // Renderizar artículo
    container.innerHTML = `
      <header class="mb-8 text-center max-w-3xl mx-auto">
        <span class="badge-pill bg-green-100 text-green-800 mb-4 inline-block">${post.category}</span>
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">${post.title}</h1>
        <div class="flex items-center justify-center text-sm text-gray-500 space-x-3">
          <span class="font-medium text-gray-800">${post.author}</span>
          <span>•</span>
          <span>${post.date}</span>
          <span>•</span>
          <span>${post.readTime}</span>
        </div>
      </header>

      <div class="w-full h-80 md:h-[450px] rounded-3xl overflow-hidden mb-12 shadow-agro-lg">
        <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover">
      </div>

      <div class="prose prose-lg max-w-3xl mx-auto text-gray-700 leading-relaxed font-normal">
        ${post.content}
      </div>

      <div class="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center space-x-2">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Compartir:</span>
          <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + window.location.href)}" target="_blank" class="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 text-xs font-bold">WhatsApp</a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" target="_blank" class="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold">LinkedIn</a>
        </div>
        <a href="blog.html" class="text-sm font-bold text-gray-600 hover:text-green-600 flex items-center">
          &larr; Volver a todos los artículos
        </a>
      </div>
    `;

    // Cargar artículos relacionados
    if (relatedContainer) {
      const allPosts = await AgroModAPI.getBlogPosts();
      const related = allPosts.filter(p => p.id != post.id).slice(0, 2);

      relatedContainer.innerHTML = related.map(rel => `
        <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-agro card-hover flex flex-col">
          <img src="${rel.image}" alt="${rel.title}" class="w-full h-40 object-cover">
          <div class="p-5 flex-1 flex flex-col justify-between">
            <h4 class="font-bold text-gray-900 text-sm mb-2 hover:text-green-600 transition">
              <a href="post.html?id=${rel.id}">${rel.title}</a>
            </h4>
            <a href="post.html?id=${rel.id}" class="text-xs font-bold text-green-600 inline-block mt-2">Leer más &rarr;</a>
          </div>
        </div>
      `).join('');
    }

  } catch (err) {
    console.error(err);
  }
}
