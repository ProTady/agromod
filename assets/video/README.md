# Video del DJI Mavic 3M

Preparado el 9 de septiembre de 2026 a partir de los videos facilitados por el
responsable de AgroMod. P1M3M.mp4 y P2M3M.mp4 tienen pistas H.264 y AAC idénticas
(verificación SHA-256 de cada pista). Sus contenedores difieren en metadatos.

| Recurso | Tamaño | Formato y uso |
| --- | ---: | --- |
| Original, por archivo | 439.614.586 bytes | 1920×1080, 29,97 fps, 21,568 s |
| vuelo-m3m-1080p.mp4 | 71.549.064 bytes | Vuelo completo Full HD con audio original |
| vuelo-m3m-fondo-720p.mp4 | 4.383.912 bytes | Extracto de 8 s, 1280×720, sin audio |
| ../images/vuelo-m3m-poster.jpg | 210.055 bytes | Fotograma inicial, 1200×675 |

Reducción del archivo completo: aproximadamente 83,7 %. Se conserva el encuadre,
resolución y frecuencia de cuadros; el audio AAC se copia sin recodificar.
La compresión de imagen es con pérdida, con calidad visual comprobada. No se
presenta como una copia matemáticamente sin pérdidas. La comparación VMAF del
vuelo completo obtuvo 99,53/100 usando uno de cada cinco cuadros; este indicador
complementa la revisión visual y no garantiza igualdad de cada píxel.

Se utilizó FFmpeg 7.1 con libx264. Opciones reproducibles:

```text
Completo:
-i ORIGINAL -map 0:v:0 -map 0:a:0? -map_metadata -1 -map_chapters -1
-c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -c:a copy
-movflags +faststart -write_tmcd 0 vuelo-m3m-1080p.mp4

Vista previa:
-ss 2 -i ORIGINAL -t 8 -map 0:v:0 -map_metadata -1 -map_chapters -1
-vf scale=1280:720:flags=lanczos -c:v libx264 -preset slow -crf 26
-maxrate 4M -bufsize 8M -pix_fmt yuv420p -an
-movflags +faststart -write_tmcd 0 vuelo-m3m-fondo-720p.mp4
```

Los datos de tiempo y metadatos del archivo fuente no se publican. La tabla
de reproducción MP4 está al principio para permitir el inicio progresivo.
El video completo no se descarga al entrar a la portada: solo al solicitarlo.
