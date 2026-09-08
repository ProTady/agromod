"use strict";
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("blog-grid")) initBlogPage();
  if (document.getElementById("post-article-container")) initSinglePostPage();
});

async function initBlogPage() {
  const grid = document.getElementById("blog-grid");
  const search = document.getElementById("blog-search");
  const count = document.getElementById("blog-count");
  const buttons = [...document.querySelectorAll(".category-filter-btn")];
  let category = "all";
  let generation = 0;
  let debounce;
  function readUrl() {
    const params = new URLSearchParams(location.search);
    const requested = params.get("category");
    category = buttons.some(button => button.dataset.category === requested) ? requested : "all";
    search.value = (params.get("q") || "").slice(0,120);
    buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.category === category)));
  }
  function updateUrl() {
    const url = new URL(location.href);
    if (category === "all") url.searchParams.delete("category"); else url.searchParams.set("category", category);
    if (search.value.trim()) url.searchParams.set("q", search.value.trim()); else url.searchParams.delete("q");
    history.replaceState(null, "", url);
  }
  async function renderFeed() {
    const current = ++generation;
    grid.setAttribute("aria-busy","true"); count.textContent = "Cargando artículos…";
    try {
      const posts = await AgroModAPI.getBlogPosts(category, search.value);
      if (current !== generation) return;
      count.textContent = posts.length + (posts.length === 1 ? " artículo" : " artículos");
      grid.innerHTML = posts.length ? posts.map(AgroUI.postCard).join("") : '<div class="empty-state"><h3>No encontramos artículos con esos filtros.</h3><p>Prueba otra palabra o vuelve a ver todas las publicaciones.</p><button class="button button-outline" id="clear-blog" type="button">Limpiar filtros</button></div>';
      document.getElementById("clear-blog")?.addEventListener("click", () => {
        category = "all"; search.value = "";
        buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.category === "all")));
        updateUrl(); renderFeed(); search.focus();
      });
    } catch {
      if (current !== generation) return;
      count.textContent = "";
      grid.innerHTML = '<div class="empty-state"><h3>No pudimos cargar los artículos.</h3><p>Vuelve a intentarlo en un momento.</p><button class="button button-outline" id="retry-blog">Reintentar</button></div>';
      document.getElementById("retry-blog").addEventListener("click", renderFeed);
    } finally { if (current === generation) grid.setAttribute("aria-busy","false"); }
  }
  buttons.forEach(button => button.addEventListener("click", () => {
    clearTimeout(debounce);
    category = button.dataset.category;
    buttons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    updateUrl(); renderFeed();
  }));
  search.addEventListener("input", () => {
    clearTimeout(debounce);
    ++generation; // Invalida respuestas previas incluso durante el debounce.
    debounce = setTimeout(() => { updateUrl(); renderFeed(); }, 200);
  });
  window.addEventListener("popstate", () => { clearTimeout(debounce); readUrl(); renderFeed(); });
  readUrl(); renderFeed();
}

async function initSinglePostPage() {
  const container = document.getElementById("post-article-container");
  const relatedSection = document.getElementById("related-section");
  const related = document.getElementById("related-posts-container");
  const id = new URLSearchParams(location.search).get("id") || "1";
  const e = AgroUI.escape;
  try {
    const post = await AgroModAPI.getPostById(id);
    if (!post) {
      document.title = "Artículo no encontrado | AgroMod";
      relatedSection.hidden = true;
      container.innerHTML = '<div class="empty-state"><h1>Artículo no encontrado</h1><p>Consulta las publicaciones disponibles en nuestro cuaderno de campo.</p><a class="button" href="blog.html">Volver al blog</a></div>';
      return;
    }
    document.title = post.title + " | Blog AgroMod";
    document.querySelector('meta[name="description"]').content = post.excerpt;
    document.querySelector('meta[property="og:title"]').content = document.title;
    document.querySelector('meta[property="og:description"]').content = post.excerpt;
    document.querySelector('meta[property="og:type"]').content = "article";
    // post.content es HTML editorial del repositorio, nunca contenido de formularios.
    container.innerHTML = `<header class="article-header"><p class="eyebrow">${e(post.category)}</p><h1>${e(post.title)}</h1><div class="article-meta"><span>${e(post.author)}</span><time datetime="${e(post.publishedAt)}">${e(post.date)}</time><span>${e(post.readTime)}</span></div></header><img class="article-image" src="${e(post.image)}" alt="${e(post.title)}" width="1200" height="800" fetchpriority="high"><div class="prose">${post.content}</div><div class="article-share"><span>Comparte este artículo</span><a class="text-link" href="https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " " + location.href)}" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a><a class="text-link" href="blog.html">Todos los artículos →</a></div>`;
    const posts = await AgroModAPI.getBlogPosts();
    const other = posts.filter(item => item.id !== post.id).sort((a,b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0,2);
    related.innerHTML = other.map(AgroUI.postCard).join("");
    relatedSection.hidden = other.length === 0;
  } catch {
    relatedSection.hidden = true;
    container.innerHTML = '<div class="empty-state"><h1>No pudimos abrir el artículo.</h1><p>Puedes volver a intentarlo o consultar el blog.</p><button class="button" id="retry-post">Reintentar</button> <a class="text-link" href="blog.html">Volver al blog</a></div>';
    document.getElementById("retry-post").addEventListener("click", initSinglePostPage);
  }
}
