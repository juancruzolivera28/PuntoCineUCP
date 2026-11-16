(function () {
  'use strict';

  var scriptEl = document.currentScript;
  var apiCines = new URL('../api/cines.php', scriptEl.src).href;
  var apiPeliculas = new URL('../api/peliculas.php', scriptEl.src).href;

  var ACENTOS = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' };

  function claseGenero(genero) {
    var sinAcentos = genero.toLowerCase().replace(/[áéíóú]/g, function (letra) {
      return ACENTOS[letra];
    });
    return 'genre-' + sinAcentos.replace(/\s+/g, '-');
  }

  function formatearPrecio(valor) {
    return '$' + Number(valor).toLocaleString('es-AR');
  }

  function formatearHora(horario) {
    return horario.slice(0, 5);
  }

  function crearElemento(etiqueta, clase, texto) {
    var el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }

  function mostrarError(contenedor, mensaje) {
    var aviso = crearElemento('div', 'carga-error', mensaje);
    aviso.setAttribute('role', 'alert');
    contenedor.appendChild(aviso);
  }

  async function obtenerJson(url) {
    var respuesta = await fetch(url);
    var cuerpo = await respuesta.json();
    if (!respuesta.ok) throw new Error(cuerpo.mensaje || 'Error al consultar el servidor.');
    return cuerpo.data;
  }

  function crearTarjetaCine(pelicula) {
    var funciones = pelicula.funciones;
    var primera = funciones[0];

    var tarjeta = crearElemento('div', 'card');

    var poster = crearElemento('div', 'poster');
    poster.style.setProperty('--genre-color', 'var(--' + claseGenero(pelicula.genero) + ')');
    poster.style.backgroundImage = "url('../" + pelicula.poster_url + "')";
    poster.appendChild(crearElemento('span', 'poster__title', pelicula.titulo));
    tarjeta.appendChild(poster);

    var cuerpo = crearElemento('div', 'card__body');
    cuerpo.appendChild(crearElemento('h3', 'card__title', pelicula.titulo));

    var meta = crearElemento('div', 'card__meta');
    meta.appendChild(crearElemento('span', 'tag', pelicula.genero));
    meta.appendChild(crearElemento('span', 'tag', pelicula.clasificacion));
    meta.appendChild(crearElemento('span', 'tag', pelicula.duracion_min + ' min'));
    meta.appendChild(crearElemento('span', 'tag', primera.sala_nombre));
    cuerpo.appendChild(meta);

    cuerpo.appendChild(crearElemento('p', 'muted func-times', 'Funciones: ' + funciones.map(function (f) {
      return formatearHora(f.horario);
    }).join(' · ')));

    cuerpo.appendChild(crearElemento('span', 'card__price', formatearPrecio(primera.precio)));

    var enlace = crearElemento('a', 'btn btn--outline btn--full', 'Ver ficha');
    enlace.href = '../producto.html?id=' + pelicula.id;
    cuerpo.appendChild(enlace);

    tarjeta.appendChild(cuerpo);
    return tarjeta;
  }

  async function renderizarCine() {
    var slug = document.body.dataset.cineSlug;
    var contenedorCartelera = document.getElementById('cine-cartelera');

    try {
      var cines = await obtenerJson(apiCines);
      var cineBase = cines.find(function (c) { return c.slug === slug; });

      if (!cineBase) throw new Error('No existe el cine solicitado.');

      var cine = await obtenerJson(apiCines + '?id=' + cineBase.id);

      document.getElementById('cine-direccion').textContent = cine.direccion;
      document.getElementById('cine-salas').textContent = cine.salas.length + ' salas (' + cine.salas.map(function (s) { return s.nombre; }).join(' y ') + ')';
      document.getElementById('cine-horario').textContent = cine.horario_boleteria;

      var mapa = document.getElementById('cine-mapa');
      mapa.src = 'https://www.google.com/maps?q=' + cine.mapa_query + '&output=embed';

      var salaIds = cine.salas.map(function (s) { return s.id; });

      var peliculas = await obtenerJson(apiPeliculas);
      var peliculasDelCine = peliculas
        .map(function (pelicula) {
          var funcionesDelCine = pelicula.funciones.filter(function (f) {
            return salaIds.indexOf(f.sala_id) !== -1;
          });
          if (funcionesDelCine.length === 0) return null;
          return Object.assign({}, pelicula, { funciones: funcionesDelCine });
        })
        .filter(Boolean);

      document.getElementById('cine-cartelera-cantidad').textContent =
        peliculasDelCine.length + ' película' + (peliculasDelCine.length === 1 ? '' : 's') + ' en cartel';

      peliculasDelCine.forEach(function (pelicula) {
        contenedorCartelera.appendChild(crearTarjetaCine(pelicula));
      });
    } catch (error) {
      mostrarError(contenedorCartelera, 'No se pudo cargar la información del cine.');
      console.error(error);
    }
  }

  document.addEventListener('DOMContentLoaded', renderizarCine);
})();
