/**
 * Contenido editorial de AgroMod. No contiene credenciales ni datos de clientes.
 * Configurar solo un WhatsApp comercial confirmado (código de país incluido).
 * Vacío: la web permite preparar y copiar, sin abrir un destinatario de ejemplo.
 */
const COMPANY_INFO = {
  name: "AgroMod",
  tagline: "Agricultura de precisión",
  whatsapp: "+51944163763",
  email: "",
  country: "Perú"
};

const SERVICES_DATA = [
  {
    id: "vuelos-multiespectrales", icon: "↗", tag: "VISTA AÉREA",
    title: "Vuelos multiespectrales",
    shortDescription: "Observa las diferencias del cultivo con imágenes RGB y mapas de índices como NDVI, NDRE y GNDVI.",
    benefits: ["Capas organizadas por lote", "Sectores para orientar la inspección", "Formatos de entrega acordados"]
  },
  {
    id: "monitoreo-fitosanitario", icon: "⌖", tag: "EN EL CAMPO",
    title: "Evaluación con Dromapp",
    shortDescription: "Da contexto a los mapas con observaciones de campo, fotografías y registros asociados a una ubicación.",
    benefits: ["Registro desde el celular", "Preparación de datos para uso sin red", "Sincronización al recuperar conexión"]
  },
  {
    id: "plataforma-dromod", icon: "▥", tag: "SEGUIMIENTO",
    title: "Tu información en DROMOD",
    shortDescription: "Organiza las capas y evaluaciones de cada lote para consultar resultados y dar continuidad al monitoreo.",
    benefits: ["Consulta por lote y fecha", "Revisión de áreas de interés", "Historial para siguientes inspecciones"]
  }
];

const GALLERY_DATA = [
  {id:"palto-rgb-ndvi",crop:"paltos",cropLabel:"Paltos",indices:["RGB","NDVI"],title:"De la imagen visible al índice NDVI",image:"assets/images/paltos_comparativa_rgb_ndvi.jpg",width:1200,height:600,description:"Dos vistas para ubicar las diferencias del cultivo y preparar el recorrido de campo."},
  {id:"citricos-ndvi",crop:"citricos",cropLabel:"Cítricos",indices:["NDVI"],title:"Una vista del vigor en cítricos",image:"assets/images/citricos_ndvi_detalle.jpg",width:1200,height:800,description:"Muestra NDVI para observar la distribución del índice en las hileras del lote."},
  {id:"citricos-ndre",crop:"citricos",cropLabel:"Cítricos",indices:["NDRE"],title:"Otra lectura del mismo cultivo",image:"assets/images/citricos_ndre_detalle.jpg",width:1200,height:800,description:"Muestra NDRE para complementar la revisión de la variabilidad observada en el cultivo."},
  {id:"palto-ndvi",crop:"paltos",cropLabel:"Paltos",indices:["NDVI"],title:"El detalle que orienta la inspección",image:"assets/images/paltos_ndvi_detalle.jpg",width:1200,height:800,description:"Vista de detalle para localizar sectores que requieren observaciones adicionales en campo."}
];

const BLOG_POSTS_DATA = [
  {
    id: 1, slug: "ndvi-mavic-3m-deteccion-temprana-estres",
    title: "Cómo leer un mapa NDVI antes de recorrer tu lote",
    category: "Vuelos Multiespectrales", author: "Equipo AgroMod",
    date: "28 agosto, 2026", publishedAt: "2026-08-28", readTime: "3 min de lectura",
    image: "assets/images/citricos_ndvi_detalle.jpg",
    excerpt: "Un mapa ayuda a plantear dónde revisar primero. Aprende a mirar la escala, el contexto y las diferencias dentro del lote.",
    content: `
      <p>Una imagen multiespectral ofrece otra perspectiva del cultivo. Para aprovecharla, empieza por ubicar el lote y leer la escala de la capa que estás consultando.</p>
      <h2>Primero, identifica qué estás mirando</h2>
      <p>Comprueba el nombre del lote, la fecha del vuelo y el índice seleccionado. Una imagen RGB y una capa NDVI representan información distinta; conviene consultarlas junto con las observaciones de campo.</p>
      <h2>Lee la escala antes de interpretar un color</h2>
      <p>Revisa los valores de la leyenda y la superficie cubierta por la captura. No supongas que un mismo color representa el mismo valor en todos los mapas. En las muestras de este sitio conservamos la escala que aparece en la imagen original.</p>
      <h2>Convierte la observación en un recorrido</h2>
      <p>Selecciona sectores con diferencias visibles y anota qué quieres comprobar. Registra fotografías y ubicación durante la visita para relacionar lo que muestra la imagen con lo que encuentras en el lote.</p>
      <aside><strong>Del mapa a la evaluación</strong><p>Una diferencia de índice no es un diagnóstico de plaga, nutrición o riego. La interpretación requiere contexto y verificación en campo.</p></aside>
      <h2>Deja una referencia para volver</h2>
      <p>Conserva la fecha y las áreas revisadas. En una siguiente inspección, esa referencia ayuda a organizar la comparación y a distinguir cambios del cultivo de diferencias en las condiciones de captura.</p>`
  },
  {
    id: 2, slug: "ahorro-30-porciento-agroquimicos-mapas-calor",
    title: "Del mapa a la visita: cómo priorizar zonas de evaluación",
    category: "Fitosanidad y Gestión", author: "Equipo AgroMod",
    date: "2 septiembre, 2026", publishedAt: "2026-09-02", readTime: "3 min de lectura",
    image: "assets/images/paltos_comparativa_rgb_ndvi.jpg",
    excerpt: "Organiza un recorrido con preguntas concretas y deja registros que permitan dar seguimiento a cada zona.",
    content: `
      <p>Un lote puede tener sectores que requieren una mirada más cercana. Combinar la vista aérea con un recorrido organizado ayuda a documentar esas diferencias.</p>
      <h2>Define qué necesitas comprobar</h2>
      <p>Antes de salir, revisa los mapas disponibles y las observaciones anteriores. Delimita las áreas que visitarás e identifica qué información falta para entender lo que está ocurriendo.</p>
      <h2>Registra también el contexto</h2>
      <ul><li>Ubicación y fecha de la evaluación.</li><li>Observaciones del cultivo y fotografías.</li><li>Condiciones del sector que ayuden a interpretar el hallazgo.</li><li>Preguntas pendientes y necesidad de una nueva visita.</li></ul>
      <h2>Revisa antes de decidir una intervención</h2>
      <p>Las diferencias del mapa orientan la visita. Las decisiones de manejo corresponden a la evaluación agronómica del caso, con las mediciones y verificaciones que sean necesarias.</p>
      <aside><strong>Seguimiento documentado</strong><p>El objetivo es disponer de información para decidir. No se puede prometer un porcentaje de ahorro a partir de una imagen aislada.</p></aside>
      <h2>Cierra el recorrido con un siguiente paso</h2>
      <p>Organiza los registros por lote y deja constancia de lo que se revisó. Así, el equipo puede retomar la inspección sin depender únicamente de notas dispersas.</p>`
  },
  {
    id: 3, slug: "de-la-libreta-a-dromapp-revolucion-evaluador",
    title: "Prepara Dromapp antes de salir a un campo sin conexión",
    category: "Tecnología de Campo", author: "Equipo AgroMod",
    date: "5 septiembre, 2026", publishedAt: "2026-09-05", readTime: "3 min de lectura",
    image: "assets/images/paltos_ndvi_detalle.jpg",
    excerpt: "Descarga los datos que vas a usar, comprueba el acceso sin red y sincroniza tus registros al volver.",
    content: `
      <p>En el campo no siempre hay cobertura. Conviene preparar la jornada antes de alejarte de la red donde puedes acceder a DROMOD.</p>
      <h2>Antes de salir</h2>
      <ul><li>Sincroniza el catálogo y los lotes que vas a revisar.</li><li>Descarga las capas y escalas que utilizarás.</li><li>Comprueba que puedes abrirlas sin conexión.</li><li>Revisa permisos de ubicación y carga de batería.</li></ul>
      <h2>Durante el recorrido</h2>
      <p>Relaciona cada observación con su lote. Añade ubicación, fotografía y notas que ayuden a recordar lo que encontraste. Comprueba el estado de guardado de los registros antes de continuar.</p>
      <aside><strong>Guardar y sincronizar son pasos diferentes</strong><p>Un registro guardado en el teléfono necesita sincronizarse para estar disponible en DROMOD. Sin acceso al servidor, el envío debe esperar.</p></aside>
      <h2>Al recuperar la conexión</h2>
      <p>Conéctate a la red desde la que puedes acceder al servidor, sincroniza y revisa el resultado. Verifica que no queden registros pendientes antes de dar por cerrada la jornada.</p>
      <h2>Prepara el próximo recorrido</h2>
      <p>Consulta las evaluaciones y capas por lote y fecha. Mantener este orden permite volver a las áreas de interés con el contexto de la visita anterior.</p>`
  }
];
// Publicar testimonios únicamente después de confirmar autoría y autorización.
const TESTIMONIALS_DATA = [];
