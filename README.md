# AgroMod — web comercial y blog

Sitio estático para presentar vuelos multiespectrales, evaluación de campo con
Dromapp y seguimiento por lote en DROMOD. Compatible con GitHub Pages, incluida
la ruta de proyecto `/agromod/`.

## Ejecutar localmente

Con Python instalado, desde esta carpeta:

```powershell
python -m http.server 3000 --bind 127.0.0.1
```

Abrir http://127.0.0.1:3000/ en el navegador. No requiere instalar paquetes,
compilar CSS, iniciar DROMOD ni conectarse a su base de datos.

## Datos comerciales confirmados

- WhatsApp: **+51 944 163 763**, configurado en `COMPANY_INFO.whatsapp` de
  `assets/js/data.js`. Todos los enlaces usan ese destinatario.
- Atención: **valles de Huaura–Sayán**, para **mandarinas y paltos**.
- Servicios: vuelos multiespectrales, evaluación con Dromapp y seguimiento en DROMOD.
- Precios: cotización personalizada según superficie, ubicación y servicio.
- Correo comercial: aún no disponible; no se publica una dirección de ejemplo.
- Diseño: se conserva la versión aprobada por el responsable.

Datos confirmados el 8 de septiembre de 2026.

- El formulario prepara un resumen en memoria y permite revisarlo o editarlo.
- El usuario confirma el envío en WhatsApp. La página no confirma recepción.
- Sin un destinatario válido, permite copiar el resumen y explica que WhatsApp
  aún no está disponible.
- No se guardan solicitudes en localStorage ni se envían a un backend.
- No se publican tarifas o descuentos de ejemplo. El alcance se cotiza por lote.
- La opción de copiar requiere permiso de portapapeles del navegador; si no está
  disponible, el resumen se selecciona para copiarlo manualmente.

No hay una conexión automática con la PC central de DROMOD. Añadir una bandeja de solicitudes sería una integración
independiente con autenticación, manejo de errores y almacenamiento definidos.

## Contenido y estructura

- `index.html`: portada, servicios, galería, flujo de trabajo, solicitud y FAQ.
- `blog.html`: búsqueda y filtros, conservados en la URL.
- `post.html?id=3`: lectura de artículos; acepta también los slugs existentes.
- `assets/js/data.js`: catálogo, muestras y contenido editorial.
- `assets/js/api.js`: consulta del catálogo y preparación del mensaje.
- `assets/js/main.js`: navegación, galería y formulario.
- `assets/js/blog.js`: listado y lectura del blog.
- `assets/js/video.js`: reproducción de la portada, ahorro de datos y visor del vuelo.
- `assets/video/`: vuelo Full HD y vista previa; detalles en su README.
- `assets/css/style.css`: estilos locales y adaptación a pantallas pequeñas.
- `assets/images/`: capturas originales; el visor permite abrirlas completas.

Las imágenes originales no se modificaron. Las inferiores se cargan de forma
diferida y tienen dimensiones declaradas. Los estilos y las fuentes del sistema
no dependen de un CDN. El identificador gráfico de AgroMod es tipográfico; el
archivo `logo.png` existente corresponde a Dromapp y se conserva en el repositorio.

Los artículos mantienen sus IDs y slugs para preservar enlaces anteriores.
Se retiraron cifras de ahorro, diagnósticos automáticos y testimonios de ejemplo
sin respaldo en el proyecto. El HTML de artículos es contenido editorial local;
no debe interpolarse HTML procedente de formularios o de un futuro backend sin
la validación correspondiente.

## Video de portada

El vuelo completo pesa 71,5 MB, frente a los 439,6 MB del archivo original.
Mantiene 1920×1080, 29,97 fps y el audio sin recodificar. La vista previa de
8 segundos pesa 4,4 MB; el fotograma inicial, 210 KB. Los dos archivos entregados,
P1M3M y P2M3M, tienen iguales pistas de imagen y sonido y comparten una sola copia.

El vuelo completo se carga al abrir el visor. La vista previa solo se inicia
automáticamente en escritorio, cuando está visible, sin ahorro de datos ni
preferencia de movimiento reducido. En celular se reproduce mediante un botón.
Se detiene al salir de la vista o cerrar el visor; no hay sonido automático en
la portada. Los originales se conservan fuera del repositorio.

Al cambiar CSS o scripts, actualizar su parámetro `v` en las tres páginas para
que los navegadores no combinen recursos de publicaciones distintas.

## Verificación

Con Node.js instalado:

```powershell
node tests/site.test.cjs
```

Comprueba solicitudes, validación, enlaces de WhatsApp, filtros, orden de
publicaciones, slugs y existencia de recursos. El entorno de prueba no ofrece
red ni almacenamiento a la API: preparar una solicitud debe funcionar sin ellos.

También se revisó en navegador la portada de escritorio y celular, menú,
selección de DROMOD, edición del resumen, filtros de mapas, visor completo,
búsqueda sin tildes, estado vacío y lectura del blog. Estas comprobaciones no
envían mensajes a terceros. No equivalen a una prueba de recepción comercial.

## Publicación

Sitio público: https://protady.github.io/agromod/.

GitHub Pages publica los cambios de la rama configurada para el sitio. Antes de
actualizarla, ejecutar las comprobaciones y revisar los datos comerciales.
Esta web es independiente del servidor central de DROMOD.
