/**
 * AGROMOD - Mock Database & Initial Data Store
 * Representa la fuente de datos local que simula una base de datos backend.
 */

const COMPANY_INFO = {
  name: "AgroMod",
  tagline: "Inteligencia y Analítica Agrícola con Drones",
  description: "Transformamos datos aéreos y de campo en decisiones agronómicas rentables. Integramos vuelos multiespectrales con DJI Mavic 3M, recolección móvil con Dromapp y análisis predictivo en DROMOD.",
  whatsapp: "+51999999999", // Reemplazar con el número real
  email: "contacto@agromod.pe",
  address: "Chinca / Ica / Lima, Perú",
  social: {
    facebook: "#",
    instagram: "#",
    linkedin: "#"
  }
};

const SERVICES_DATA = [
  {
    id: "vuelos-multiespectrales",
    title: "Vuelos Multiespectrales (NDVI / NDRE)",
    icon: "drone",
    tag: "Monitoreo Aéreo",
    shortDescription: "Mapeo de alta resolución con DJI Mavic 3M para medir vigor vegetativo, clorofila y estrés antes de que sea visible.",
    fullDescription: "Mediante sensores multiespectrales de 4 bandas (Verde, Rojo, Red Edge y Cercano al Infrarrojo NIR), generamos ortomosaicos calibrados radiométricamente. Esto permite detectar deficiencias nutricionales, fallas de riego y anomalías en el cultivo con resolución centimétrica.",
    benefits: [
      "Detección de estrés hídrico y nutricional anticipado",
      "Mapas de prescripción para fertilización y riego focalizado",
      "Precisión centimétrica con georreferenciación RTK",
      "Entrega de capas GeoTIFF compatibles con SIG y maquinaria"
    ]
  },
  {
    id: "monitoreo-fitosanitario",
    title: "Evaluación Fitosanitaria Digital (Dromapp)",
    icon: "bug",
    tag: "Trabajo de Campo",
    shortDescription: "Digitalización de monitoreos de plagas y enfermedades en campo con geolocalización precisa e informes inmediatos.",
    fullDescription: "Reemplazamos las planillas de papel por nuestra aplicación móvil Dromapp. Los evaluadores registran incidencias, severidad, fotos y puntos GPS directamente en cada árbol, sincronizando todo en tiempo real.",
    benefits: [
      "Eliminación de errores de digitación y demoras",
      "Puntos GPS exactos de focos de infestación",
      "Historial comparativo por evaluador, lote y fecha",
      "Operatividad 100% offline en zonas sin cobertura celular"
    ]
  },
  {
    id: "plataforma-dromod",
    title: "Plataforma de Toma de Decisiones (DROMOD)",
    icon: "dashboard",
    tag: "Software & Analítica",
    shortDescription: "Panel web interactivo donde se fusionan los vuelos del dron con las evaluaciones de campo en mapas de calor.",
    fullDescription: "DROMOD centraliza tus lotes, vuelos, aplicaciones químicas y monitoreos. Genera heatmaps y alertas inteligentes para que los gerentes de campo tomen decisiones basadas en datos objetivos y no en suposiciones.",
    benefits: [
      "Mapas de calor de severidad de plagas e índices NDVI",
      "Trazabilidad completa de aplicaciones y control de stock",
      "Historial agronómico interactivo por campaña",
      "Acceso web seguro para agrónomos y gerencia"
    ]
  },
  {
    id: "conteo-fenologia-ia",
    title: "Conteo y Fenología Asistida por IA",
    icon: "brain",
    tag: "Inteligencia Artificial",
    shortDescription: "Modelos de visión computacional entrenados para estimación de masa vegetal, conteo de plantas y distribución fenológica.",
    fullDescription: "Utilizamos algoritmos de aprendizaje automático para analizar imágenes de alta resolución e identificar patrones como porcentaje de floración, cuajado de frutos y detección de fallas o plantas faltantes en el huerto.",
    benefits: [
      "Inventario preciso de árboles vivos y plantas faltantes",
      "Estimación objetiva de la evolución fenológica por lote",
      "Proyección temprana de volúmenes de cosecha",
      "Informes ejecutivos listos para exportar"
    ]
  }
];

const BLOG_POSTS_DATA = [
  {
    id: 1,
    slug: "ndvi-mavic-3m-deteccion-temprana-estres",
    title: "¿Cómo el índice NDVI y el Mavic 3M detectan estrés antes de que el ojo humano lo vea?",
    category: "Vuelos Multiespectrales",
    author: "Ing. Agrónomo AgroMod",
    date: "28 Agosto, 2026",
    readTime: "5 min de lectura",
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80",
    excerpt: "Cuando una hoja cambia de color al amarillo o marrón, el cultivo ya perdió semanas de fotosíntesis. Descubre cómo la banda Red Edge y el infrarrojo cercano alertan problemas a tiempo.",
    content: `
      <p class="lead text-lg font-medium text-gray-700 mb-4">La teledetección agrícola ha dejado de ser una tecnología experimental para convertirse en el estándar de oro en la gestión de cultivos de alto valor en Perú y el mundo.</p>
      
      <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">1. La limitación del espectro visible</h3>
      <p class="mb-4">El ojo humano solo percibe las longitudes de onda del espectro visible (Rojo, Verde y Azul). Cuando observamos clorosis o marchitez en las hojas, la planta ya ha sufrido un estrés celular severo que puede comprometer el rendimiento de la campaña.</p>

      <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">2. El poder de las bandas NIR y Red Edge</h3>
      <p class="mb-4">El dron DJI Mavic 3 Multispectral cuenta con un sensor de 4 bandas de 5 megapíxeles: Verde (560 nm), Rojo (650 nm), Red Edge (730 nm) y Cercano al Infrarrojo NIR (860 nm). Las células del mesófilo esponjoso de una hoja sana reflejan intensamente la radiación NIR. Si la planta sufre estrés hídrico o ataque de hongos, esta reflectancia cae en picada antes de que el pigmento visible cambie.</p>

      <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">3. NDVI vs NDRE en frutales densos</h3>
      <p class="mb-4">En cultivos como palto, cítricos o arándanos con copas densas, el NDVI tiende a saturarse. Por ello, en <strong>AgroMod</strong> utilizamos además el índice <strong>NDRE (Normalized Difference Red Edge)</strong>, que penetra capas más profundas del follaje permitiendo evaluar el estado del nitrógeno y vigor en plantas maduras con precisión milimétrica.</p>

      <div class="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg my-6">
        <h4 class="font-bold text-green-900">Impacto en el Fundo:</h4>
        <p class="text-green-800 text-sm">Un sobrevuelo a tiempo de 50 hectáreas toma menos de 40 minutos con el Mavic 3M y genera un mapa de diagnóstico que permite intervenir únicamente en los sectores con estrés hídrico o nutricional.</p>
      </div>
    `
  },
  {
    id: 2,
    slug: "ahorro-30-porciento-agroquimicos-mapas-calor",
    title: "Reducción de hasta un 30% en costos de agroquímicos con mapas de calor focalizados",
    category: "Fitosanidad y Gestión",
    author: "Equipo Técnico AgroMod",
    date: "02 Septiembre, 2026",
    readTime: "4 min de lectura",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
    excerpt: "Aplicar productos químicos a todo el lote cuando la plaga solo está en el 15% del área es un desperdicio financiero y ambiental. Así funciona el control dirigido.",
    content: `
      <p class="lead text-lg font-medium text-gray-700 mb-4">El paradigma tradicional del 'baño parejo' en pulverizaciones agrícolas está siendo reemplazado por la agricultura de precisión.</p>
      
      <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">El costo de la aplicación generalizada</h3>
      <p class="mb-4">Normalmente, cuando un evaluador reporta queresas o ácaros en un lote, la orden operativa suele ser aplicar tractor y barra de pulverización a la totalidad del cuartel. Sin embargo, en el 80% de los casos, los focos están concentrados en bordes, cabeceras o áreas de menor vigor.</p>

      <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">La solución: DROMOD + Dromapp</h3>
      <p class="mb-4">Al combinar el reporte georreferenciado de Dromapp en campo con las anomalías detectadas por el dron, DROMOD genera un <strong>Mapa de Calor de Infestación</strong> con isolíneas de severidad. Esto permite emitir una receta agronómica de 'parcheo' o aplicación perimetral.</p>

      <div class="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <span class="text-red-500 font-bold text-sm block">Método Convencional</span>
          <p class="text-gray-600 text-sm mt-1">100 hectáreas aplicadas al 100%. Alto desgaste de maquinaria, mayor residuo químico y costo elevado de insumos.</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg border border-green-200">
          <span class="text-green-600 font-bold text-sm block">Método AgroMod</span>
          <p class="text-gray-700 text-sm mt-1">Aplicación concentrada en focos de severidad alta (aprox. 30 ha). Ahorro directo de hasta un 30-40% en volumen de caldo.</p>
        </div>
      </div>
    `
  },
  {
    id: 3,
    slug: "de-la-libreta-a-dromapp-revolucion-evaluador",
    title: "De la libreta de papel a Dromapp: digitalizando al evaluador fitosanitario en campo",
    category: "Tecnología de Campo",
    author: "Área de Innovación AgroMod",
    date: "05 Septiembre, 2026",
    readTime: "6 min de lectura",
    image: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80",
    excerpt: "El tiempo entre que un evaluador anota una plaga en su planilla física y gerencia toma la decisión suele ser de 24 a 48 horas. Con Dromapp la información fluye al instante.",
    content: `
      <p class="lead text-lg font-medium text-gray-700 mb-4">Los técnicos y evaluadores son los ojos del agrónomo en el campo. Sin embargo, el papel mojado, los datos mal transcritos y la falta de geolocalización frenan la rapidez de respuesta.</p>
      
      <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">1. Errores comunes en las planillas físicas</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4 text-gray-700">
        <li>Pérdida de planillas por humedad, lluvia o polvo en el fundo.</li>
        <li>Horas hombre perdidas transcribiendo números a Excel al final de la jornada.</li>
        <li>Falta de ubicación exacta: "¿en qué árbol exacto de las 10 hectáreas estaba el foco?"</li>
      </ul>

      <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">2. La experiencia con Dromapp</h3>
      <p class="mb-4">Dromapp fue diseñada pensando en la ergonomía de campo: interfaz clara, botones grandes para usar con sol directo, GPS automático en cada registro, y listas desplegables de plagas comunes para palto, cítricos y arándano.</p>

      <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">3. Sincronización instantánea con DROMOD</h3>
      <p class="mb-4">Al finalizar la jornada o al encontrar señal Wi-Fi/datos, el evaluador presiona un solo botón de sincronización. Inmediatamente, la oficina central visualiza los puntos evaluados sobre la ortofoto multiespectral.</p>
    `
  }
];

const TESTIMONIALS_DATA = [
  {
    name: "Ing. Carlos Mendoza",
    role: "Jefe de Sanidad Vegetal",
    company: "Fundo Exportador La Candelaria",
    comment: "Con AgroMod redujimos el tiempo de respuesta frente a focos de queresa de 3 días a menos de 4 horas. La integración del dron con la app móvil es lo que le faltaba a nuestra operación.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Mariana Rivas",
    role: "Gerente de Operaciones Agrícolas",
    company: "Agrícola del Valle",
    comment: "Poder cotizar y recibir ortomosaicos calibrados listos para ver en DROMOD nos permitió ahorrar más de un 25% en insumos foliares en nuestra última campaña de palto Hass.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
  }
];
