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

Cada `<div class="poster">` tiene un comentario arriba con la ruta exacta que
le corresponde. Una vez que copies la imagen a esta carpeta con el nombre
indicado, agregá `--poster-image: url('...');` al `style` inline de ese
`<div class="poster">`, junto al `--genre-color` que ya tiene. Por ejemplo,
en `index.html`:

```html
<!-- Para poner imagen real: img/posters/el-ultimo-vagon.jpg -->
<div class="poster" style="--genre-color: var(--genre-accion); --poster-image: url('img/posters/el-ultimo-vagon.jpg');">
```

(en las páginas dentro de `cines/` y en `producto.html`, la ruta relativa es
`../img/posters/...` en vez de `img/posters/...`).

Si no se define `--poster-image`, el póster sigue mostrando el color plano
del género con el título superpuesto, como hasta ahora.
