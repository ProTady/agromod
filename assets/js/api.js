/**
 * AGROMOD - Capa de Servicio / API Desacoplada
 * =========================================================================
 * Esta capa centraliza todas las peticiones de datos de la web y el blog.
 * 
 * FASE ACTUAL (Mock/Local):
 * Retorna Promesas basadas en los datos estructurados en data.js.
 * 
 * FASE FUTURA (Backend / Base de Datos):
 * Simplemente cambia USE_REMOTE_BACKEND = true y define BASE_API_URL.
 * Toda la interfaz seguirá funcionando exactamente igual sin cambiar el HTML.
 * =========================================================================
 */

const AgroModAPI = (function() {
  // Configuración de conexión futura
  const CONFIG = {
    USE_REMOTE_BACKEND: false, // Cambiar a true cuando haya backend REST
    BASE_API_URL: "http://localhost:8000/api", // Ejemplo: FastAPI DROMOD
    TIMEOUT_MS: 8000
  };

  return {
    /**
     * Obtiene la información general de la empresa
     */
    async getCompanyInfo() {
      if (CONFIG.USE_REMOTE_BACKEND) {
        const res = await fetch(`${CONFIG.BASE_API_URL}/company`);
        return await res.json();
      }
      return Promise.resolve(COMPANY_INFO);
    },

    /**
     * Obtiene el listado de servicios de AgroMod
     */
    async getServices() {
      if (CONFIG.USE_REMOTE_BACKEND) {
        const res = await fetch(`${CONFIG.BASE_API_URL}/services`);
        return await res.json();
      }
      return Promise.resolve(SERVICES_DATA);
    },

    /**
     * Obtiene un servicio específico por su ID
     */
    async getServiceById(id) {
      if (CONFIG.USE_REMOTE_BACKEND) {
        const res = await fetch(`${CONFIG.BASE_API_URL}/services/${id}`);
        return await res.json();
      }
      const item = SERVICES_DATA.find(s => s.id === id);
      return Promise.resolve(item || null);
    },

    /**
     * Obtiene artículos de blog con filtrado opcional por categoría o término de búsqueda
     */
    async getBlogPosts(category = "all", searchQuery = "") {
      if (CONFIG.USE_REMOTE_BACKEND) {
        const params = new URLSearchParams();
        if (category && category !== "all") params.append("category", category);
        if (searchQuery) params.append("q", searchQuery);
        const res = await fetch(`${CONFIG.BASE_API_URL}/blog?${params.toString()}`);
        return await res.json();
      }

      let filtered = [...BLOG_POSTS_DATA];

      if (category && category !== "all") {
        filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }

      if (searchQuery && searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(q) || 
          p.excerpt.toLowerCase().includes(q)
        );
      }

      return Promise.resolve(filtered);
    },

    /**
     * Obtiene un artículo específico por ID o Slug
     */
    async getPostById(idOrSlug) {
      if (CONFIG.USE_REMOTE_BACKEND) {
        const res = await fetch(`${CONFIG.BASE_API_URL}/blog/${idOrSlug}`);
        return await res.json();
      }
      const post = BLOG_POSTS_DATA.find(p => p.id == idOrSlug || p.slug === idOrSlug);
      return Promise.resolve(post || null);
    },

    /**
     * Obtiene los testimonios de clientes
     */
    async getTestimonials() {
      if (CONFIG.USE_REMOTE_BACKEND) {
        const res = await fetch(`${CONFIG.BASE_API_URL}/testimonials`);
        return await res.json();
      }
      return Promise.resolve(TESTIMONIALS_DATA);
    },

    /**
     * Registra una cotización enviada por el usuario
     */
    async submitQuote(quoteData) {
      console.log("[AgroModAPI] Registrando solicitud de cotización:", quoteData);
      
      if (CONFIG.USE_REMOTE_BACKEND) {
        const res = await fetch(`${CONFIG.BASE_API_URL}/quotes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quoteData)
        });
        return await res.json();
      }

      // Simulación de persistencia local (en localStorage) para no perder datos en fase estática
      try {
        const savedQuotes = JSON.parse(localStorage.getItem("agromod_quotes") || "[]");
        quoteData.timestamp = new Date().toISOString();
        quoteData.id = "Q-" + Date.now();
        savedQuotes.push(quoteData);
        localStorage.setItem("agromod_quotes", JSON.stringify(savedQuotes));
      } catch (e) {
        console.warn("No se pudo guardar en localStorage:", e);
      }

      return Promise.resolve({
        success: true,
        message: "Cotización registrada exitosamente.",
        quoteId: quoteData.id
      });
    },

    /**
     * Registra un mensaje de contacto
     */
    async submitContact(contactData) {
      console.log("[AgroModAPI] Registrando mensaje de contacto:", contactData);

      if (CONFIG.USE_REMOTE_BACKEND) {
        const res = await fetch(`${CONFIG.BASE_API_URL}/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactData)
        });
        return await res.json();
      }

      return Promise.resolve({
        success: true,
        message: "Gracias por comunicarte con AgroMod. Te responderemos a la brevedad."
      });
    }
  };
})();
