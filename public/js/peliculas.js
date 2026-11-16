(function () {
  'use strict';

  var scriptEl = document.currentScript;
  var apiPeliculas = new URL('../../api/peliculas.php', scriptEl.src).href;

  var BADGE_POR_SLUG = {
    'las-tipas': 'tipas',
    'imax': 'imax',
    'sunstar': 'sunstar',
  };

  function formatearPrecio(valor) {
    return '$' + Number(valor).toLocaleString('es-AR');
  }

  function formatearHora(horario) {
    return horario.slice(0, 5);
  }

  var ACENTOS = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' };

  function claseGenero(genero) {
    var sinAcentos = genero.toLowerCase().replace(/[áéíóú]/g, function (letra) {
      return ACENTOS[letra];
    });
    return 'genre-' + sinAcentos.replace(/\s+/g, '-');
  }

  function claseBadgeCine(slug) {
    return 'badge-cine--' + (BADGE_POR_SLUG[slug] || slug);
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

  async function obtenerPeliculas() {
    var respuesta = await fetch(apiPeliculas);
    var cuerpo = await respuesta.json();
    if (!respuesta.ok) throw new Error(cuerpo.mensaje || 'Error al consultar la cartelera.');
    return cuerpo.data;
  }

  async function obtenerPelicula(id) {
    var respuesta = await fetch(apiPeliculas + '?id=' + encodeURIComponent(id));
    var cuerpo = await respuesta.json();
    if (!respuesta.ok) throw new Error(cuerpo.mensaje || 'Error al consultar la película.');
    return cuerpo.data;
  }

  function crearTarjetaCartelera(pelicula, nivelTitulo) {
    var funciones = pelicula.funciones || [];
    var primera = funciones[0];

    var tarjeta = crearElemento('div', 'card');

    var poster = crearElemento('div', 'poster');
    poster.style.setProperty('--genre-color', 'var(--' + claseGenero(pelicula.genero) + ')');
    poster.style.backgroundImage = "url('" + pelicula.poster_url + "')";
    poster.appendChild(crearElemento('span', 'poster__title', pelicula.titulo));
    tarjeta.appendChild(poster);

    var cuerpo = crearElemento('div', 'card__body');
    cuerpo.appendChild(crearElemento(nivelTitulo || 'h3', 'card__title', pelicula.titulo));

    var meta = crearElemento('div', 'card__meta');
    if (primera) {
      meta.appendChild(crearElemento('span', 'badge-cine ' + claseBadgeCine(primera.cine_slug), primera.cine_nombre));
    }
    meta.appendChild(crearElemento('span', 'tag', pelicula.genero));
    meta.appendChild(crearElemento('span', 'tag', pelicula.clasificacion));
    meta.appendChild(crearElemento('span', 'tag', pelicula.duracion_min + ' min'));
    cuerpo.appendChild(meta);

    if (primera) {
      cuerpo.appendChild(crearElemento('span', 'card__price', formatearPrecio(primera.precio)));
    }

    var enlace = crearElemento('a', 'btn btn--outline btn--full', 'Ver ficha');
    enlace.href = 'producto.html?id=' + pelicula.id;
    enlace.setAttribute('aria-label', 'Ver ficha de ' + pelicula.titulo);
    cuerpo.appendChild(enlace);

    tarjeta.appendChild(cuerpo);
    return tarjeta;
  }

  function crearFilaTabla(pelicula) {
    var funciones = pelicula.funciones || [];
    var primera = funciones[0];
    var fila = document.createElement('tr');

    fila.appendChild(crearElemento('td', null, pelicula.titulo));
    fila.appendChild(crearElemento('td', primera ? 'cine--' + BADGE_POR_SLUG[primera.cine_slug] : null, primera ? primera.cine_nombre : ''));
    fila.appendChild(crearElemento('td', null, pelicula.genero));
    fila.appendChild(crearElemento('td', null, pelicula.duracion_min + ' min'));
    fila.appendChild(crearElemento('td', null, pelicula.clasificacion));
    fila.appendChild(crearElemento('td', null, primera ? primera.sala_nombre : ''));
    fila.appendChild(crearElemento('td', null, funciones.map(function (f) { return formatearHora(f.horario); }).join(' · ')));
    fila.appendChild(crearElemento('td', 'price', primera ? formatearPrecio(primera.precio) : ''));

    var celdaEnlace = document.createElement('td');
    var enlace = crearElemento('a', null, 'Ver ficha');
    enlace.href = 'producto.html?id=' + pelicula.id;
    enlace.setAttribute('aria-label', 'Ver ficha de ' + pelicula.titulo);
    celdaEnlace.appendChild(enlace);
    fila.appendChild(celdaEnlace);

    return fila;
  }

  async function renderizarDestacadas() {
    var contenedor = document.getElementById('destacadas');
    try {
      var peliculas = await obtenerPeliculas();
      peliculas.slice(0, 3).forEach(function (pelicula) {
        contenedor.appendChild(crearTarjetaCartelera(pelicula));
      });
    } catch (error) {
      mostrarError(contenedor, 'No se pudo cargar la cartelera destacada.');
      console.error(error);
    }
  }

  async function renderizarBox() {
    var contenedor = document.getElementById('cartelera-box');
    var cantidadEl = document.getElementById('cartelera-cantidad');
    try {
      var peliculas = await obtenerPeliculas();
      if (cantidadEl) cantidadEl.textContent = peliculas.length + ' películas en cartel esta semana, en los 3 cines de Posadas';
      peliculas.forEach(function (pelicula) {
        contenedor.appendChild(crearTarjetaCartelera(pelicula, 'h2'));
      });
    } catch (error) {
      mostrarError(contenedor, 'No se pudo cargar la cartelera.');
      console.error(error);
    }
  }

  async function renderizarTabla() {
    var contenedor = document.getElementById('cartelera-tabla');
    var cantidadEl = document.getElementById('cartelera-cantidad');
    try {
      var peliculas = await obtenerPeliculas();
      if (cantidadEl) cantidadEl.textContent = peliculas.length + ' películas en cartel esta semana, en los 3 cines de Posadas';
      peliculas.forEach(function (pelicula) {
        contenedor.appendChild(crearFilaTabla(pelicula));
      });
    } catch (error) {
      var fila = document.createElement('tr');
      var celda = document.createElement('td');
      celda.colSpan = 9;
      celda.setAttribute('role', 'alert');
      celda.textContent = 'No se pudo cargar la cartelera.';
      fila.appendChild(celda);
      contenedor.appendChild(fila);
      console.error(error);
    }
  }

  function crearPillFuncion(funcion) {
    var pill = crearElemento('a', 'pill', formatearHora(funcion.horario));
    pill.href = 'butacas.html?funcion_id=' + funcion.id;
    return pill;
  }

  async function renderizarFicha() {
    var parametros = new URLSearchParams(window.location.search);
    var id = parametros.get('id');
    var contenedor = document.getElementById('ficha-pelicula');

    if (!id) {
      document.getElementById('ficha-titulo').textContent = 'Película no encontrada';
      mostrarError(contenedor, 'No se indicó qué película mostrar. Volvé a la cartelera y elegí una.');
      return;
    }

    try {
      var pelicula = await obtenerPelicula(id);
      var primera = (pelicula.funciones || [])[0];

      document.title = 'PuntoCine — ' + pelicula.titulo;

      var poster = document.getElementById('ficha-poster');
      poster.style.setProperty('--genre-color', 'var(--' + claseGenero(pelicula.genero) + ')');
      poster.style.backgroundImage = "url('" + pelicula.poster_url + "')";
      document.getElementById('ficha-poster-titulo').textContent = pelicula.titulo;

      var meta = document.getElementById('ficha-meta');
      if (primera) {
        meta.appendChild(crearElemento('span', 'badge-cine ' + claseBadgeCine(primera.cine_slug), primera.cine_nombre));
      }
      meta.appendChild(crearElemento('span', 'tag', pelicula.genero));
      meta.appendChild(crearElemento('span', 'tag', pelicula.clasificacion));
      meta.appendChild(crearElemento('span', 'tag', pelicula.duracion_min + ' min'));
      if (primera) meta.appendChild(crearElemento('span', 'tag', primera.sala_nombre));

      document.getElementById('ficha-titulo').textContent = pelicula.titulo;
      document.getElementById('ficha-sinopsis').textContent = pelicula.sinopsis;
      document.getElementById('ficha-director').textContent = pelicula.director;
      document.getElementById('ficha-elenco').textContent = pelicula.elenco;
      document.getElementById('ficha-idioma').textContent = pelicula.idioma;
      document.getElementById('ficha-cine').textContent = primera ? (primera.cine_nombre + ' — ' + primera.cine_direccion) : '';
      document.getElementById('ficha-precio').textContent = primera ? (formatearPrecio(primera.precio) + ' por entrada') : '';

      var funcionesEl = document.getElementById('ficha-funciones');
      (pelicula.funciones || []).forEach(function (funcion) {
        funcionesEl.appendChild(crearPillFuncion(funcion));
      });
    } catch (error) {
      document.getElementById('ficha-titulo').textContent = 'Película no encontrada';
      mostrarError(contenedor, 'No se pudo cargar la ficha de la película.');
      console.error(error);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('destacadas')) renderizarDestacadas();
    if (document.getElementById('cartelera-box')) renderizarBox();
    if (document.getElementById('cartelera-tabla')) renderizarTabla();
    if (document.getElementById('ficha-pelicula')) renderizarFicha();
  });
})();
