# Pósters reales

Esta carpeta es donde van las imágenes reales de cada película. Todavía no hay
ninguna imagen acá — cuando tengas el archivo, guardalo con el nombre exacto
de esta tabla (en minúsculas, con guiones, sin acentos) para que reemplace el
póster de color generado por CSS:

| Película          | Archivo esperado                     |
|--------------------|--------------------------------------|
| El Último Vagón    | `img/posters/el-ultimo-vagon.jpg`    |
| La Casa del Fondo  | `img/posters/la-casa-del-fondo.jpg`  |
| Risas en el Ático  | `img/posters/risas-en-el-atico.jpg`  |
| Colores de Otoño   | `img/posters/colores-de-otono.jpg`   |
| Spiderman          | `img/posters/spiderman.jpg`          |
| La Odisea          | `img/posters/la-odisea.jpg`          |

## Cómo activar la imagen

No hace falta tocar ningún archivo HTML ni CSS: cada `<div class="poster">`
del sitio ya apunta a la ruta de esta tabla. Vos solo tenés que guardar (o
pegar) la imagen en esta carpeta con el nombre exacto que le corresponde —
en cuanto el archivo exista ahí, va a aparecer automáticamente reemplazando
el color plano.

Si más adelante querés usar otro nombre de archivo o guardarla en otro lado,
buscá el comentario `<!-- Para poner imagen real: ... -->` arriba del póster
correspondiente y cambiá la ruta dentro de `--poster-image: url('...');` en
ese mismo `<div>`.

Mientras el archivo no exista, el póster sigue mostrando el color plano del
género con el título superpuesto — no rompe nada.
