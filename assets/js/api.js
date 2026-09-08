/**
 * Catálogo estático: no se envían ni guardan solicitudes en un servidor.
 * Las funciones de solicitud preparan un mensaje; el usuario confirma el envío en WhatsApp.
 */
const AgroModAPI = (() => {
  const normalize = value => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const whatsappNumber = raw => {
    const value = String(raw ?? "").trim();
    if (!/^\+?[\d\s().-]+$/.test(value)) return null;
    const digits = value.replace(/\D/g, "");
    if (!/^[1-9]\d{7,14}$/.test(digits) || /(\d)\1{7,}/.test(digits)) return null;
    return digits;
  };
  return {
    async getCompanyInfo() { return {...COMPANY_INFO}; },
    async getServices() { return SERVICES_DATA.map(service => ({...service})); },
    async getServiceById(id) { return SERVICES_DATA.find(service => service.id === id) || null; },
    async getBlogPosts(category = "all", query = "") {
      const search = normalize(query);
      return BLOG_POSTS_DATA.filter(post =>
        (!category || category === "all" || normalize(post.category) === normalize(category)) &&
        (!search || normalize(post.title + " " + post.excerpt + " " + post.category).includes(search))
      ).sort((a,b) => b.publishedAt.localeCompare(a.publishedAt));
    },
    async getPostById(id) { return BLOG_POSTS_DATA.find(post => String(post.id) === String(id) || post.slug === id) || null; },
    getGallery(crop = "all", index = "all") {
      return GALLERY_DATA.filter(item => (crop === "all" || item.crop === crop) && (index === "all" || item.indices.includes(index)));
    },
    getWhatsAppUrl(message, number = COMPANY_INFO.whatsapp) {
      const digits = whatsappNumber(number);
      return digits ? "https://wa.me/" + digits + "?text=" + encodeURIComponent(message) : null;
    },
    prepareQuote(input) {
      const fields = ["name","phone","crop","location","service","notes"];
      const data = Object.fromEntries(fields.map(key => [key, String(input[key] ?? "").trim()]));
      data.hectares = Number(input.hectares);
      const service = SERVICES_DATA.find(item => item.id === data.service);
      if (!data.name || !data.location || !data.crop || !service) throw new Error("Completa tu nombre, cultivo, ubicación y servicio.");
      if (data.name.length > 100 || data.location.length > 160 || data.notes.length > 1200) throw new Error("Acorta los datos para preparar la solicitud.");
      if (!/^\+?[\d\s().-]{7,24}$/.test(data.phone) || !/^\d{7,15}$/.test(data.phone.replace(/\D/g,""))) throw new Error("Revisa el teléfono e incluye el código de país.");
      if (!Number.isFinite(data.hectares) || data.hectares < 0.01 || data.hectares > 100000) throw new Error("Indica una superficie válida, desde 0.01 hectáreas.");
      const hectares = new Intl.NumberFormat("es-PE", {maximumFractionDigits:2}).format(data.hectares);
      const lines = ["Hola, AgroMod. Quisiera solicitar una evaluación de mi lote.", "", "Nombre o empresa: " + data.name, "Teléfono: " + data.phone, "Cultivo: " + data.crop, "Superficie: " + hectares + " ha", "Ubicación: " + data.location, "Servicio: " + service.title];
      if (data.notes) lines.push("Observaciones: " + data.notes);
      lines.push("", "Me gustaría coordinar el alcance, la disponibilidad y una propuesta.");
      return {message:lines.join("\n"), data, service};
    }
  };
})();
