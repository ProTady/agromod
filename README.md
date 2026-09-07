# AgroMod — Web Comercial y Blog Informativo

Portal web y blog de servicios de agronomía de precisión, teledetección multiespectral con DJI Mavic 3M, evaluaciones fitosanitarias con **Dromapp** y plataforma de decisiones **DROMOD**.

---

## 🚀 Cómo Ejecutar y Probar Localmente

Puedes abrir directamente el archivo `index.html` en tu navegador, o levantar un servidor web local liviano con Python:

```bash
cd d:\italo411\djim3m\agromod
python -m http.server 3000
```

Luego abre tu navegador en:
`http://localhost:3000`

---

## 📂 Estructura del Proyecto

```text
agromod/
├── index.html              # Landing comercial (Servicios, Ecosistema, Cotizador con WhatsApp)
├── blog.html               # Portal del blog (Buscador, filtro por categorías, feed dinámico)
├── post.html               # Plantilla de lectura dinámica de artículos (?id=...)
├── assets/
│   ├── css/
│   │   └── style.css       # Estilos personalizados, gradientes y animaciones
│   ├── js/
│   │   ├── api.js          # Capa de Servicio / API desacoplada (Prepara conexión a BD)
│   │   ├── data.js         # Base de datos simulada en memoria (Servicios, Artículos, Reseñas)
│   │   ├── main.js         # Lógica interactiva de portada, menú móvil y cotizador
│   │   └── blog.js         # Lógica del feed y visor de artículos
│   └── images/
│       └── logo.png        # Logotipo oficial de AgroMod
└── README.md
```

---

## 🔌 Cómo Conectar una Base de Datos / Backend en el Futuro

La aplicación utiliza el **Patrón de Capa de Servicio** en [`assets/js/api.js`](assets/js/api.js).

### Paso 1: Activar el modo remoto en `api.js`
Abre `assets/js/api.js` y cambia los parámetros:

```javascript
const CONFIG = {
  USE_REMOTE_BACKEND: true, // Cambiar a true
  BASE_API_URL: "http://localhost:8000/api", // Tu endpoint FastAPI o Supabase
  TIMEOUT_MS: 8000
};
```

### Paso 2: Endpoints REST esperados por el frontend
Tu backend (por ejemplo en FastAPI dentro de DROMOD) solo debe exponer:
- `GET /api/services`: Retorna array de servicios.
- `GET /api/blog`: Retorna array de artículos (acepta filtros `?category=...&q=...`).
- `GET /api/blog/{id}`: Retorna el detalle del artículo.
- `POST /api/quotes`: Recibe payload de cotización `{ name, phone, crop, hectares, serviceType, notes }`.

**¡No necesitarás modificar ni una sola línea de los archivos HTML!**
