(function () {
  'use strict';

  var UMBRAL_CRITICO = 8;
  var CLAVE_SESION = 'puntocine:seleccion';

  var scriptEl = document.currentScript;
  var apiButacas = new URL('../../api/butacas.php', scriptEl.src).href;

  var seatMap = document.getElementById('seatMap');
  var funcionEl = document.getElementById('butacas-funcion');
  var contenidoEl = document.getElementById('butacas-contenido');
  var seatCountEl = document.getElementById('seatCount');
  var seatTotalEl = document.getElementById('seatTotal');
  var continueBtn = document.getElementById('continueBtn');
  var alertaEl = document.getElementById('alerta-stock');

  if (!seatMap) return;

  var funcionActual = null;
  var seleccion = {};

  function formatearPrecio(valor) {
    return '$' + Number(valor).toLocaleString('es-AR');
  }

  function formatearHora(horario) {
    return horario.slice(0, 5);
  }

  function mostrarError(mensaje) {
    var aviso = document.createElement('div');
    aviso.className = 'carga-error';
    aviso.setAttribute('role', 'alert');
    aviso.textContent = mensaje;
    contenidoEl.hidden = true;
    contenidoEl.parentNode.insertBefore(aviso, contenidoEl);
  }

  function crearAsiento(butaca) {
    var boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'seat';
    boton.dataset.seat = butaca.codigo;
    boton.dataset.butacaId = butaca.id;
    boton.setAttribute('aria-pressed', 'false');

    var ocupada = butaca.estado === 'ocupada';
    boton.classList.toggle('seat--occupied', ocupada);
    boton.disabled = ocupada;
    boton.setAttribute('aria-label', 'Butaca ' + butaca.codigo + ', ' + (ocupada ? 'ocupada' : 'disponible'));

    return boton;
  }

  function construirGrilla(butacas) {
    var filas = {};
    var orden = [];

    butacas.forEach(function (butaca) {
      if (!filas[butaca.fila]) {
        filas[butaca.fila] = [];
        orden.push(butaca.fila);
      }
      filas[butaca.fila].push(butaca);
    });

    orden.forEach(function (fila) {
      var filaEl = document.createElement('div');
      filaEl.className = 'seat-row';

      var etiqueta = document.createElement('span');
      etiqueta.className = 'seat-row__label';
      etiqueta.textContent = fila;
      filaEl.appendChild(etiqueta);

      filas[fila].forEach(function (butaca) {
        filaEl.appendChild(crearAsiento(butaca));
      });

      seatMap.appendChild(filaEl);
    });
  }

  function actualizarAlerta() {
    if (!alertaEl) return;

    var totalButacas = seatMap.querySelectorAll('.seat').length;
    var ocupadas = seatMap.querySelectorAll('.seat--occupied').length;
    var seleccionadas = seatMap.querySelectorAll('.seat--selected').length;
    var disponibles = totalButacas - ocupadas - seleccionadas;

    alertaEl.hidden = disponibles > UMBRAL_CRITICO;
  }

  function actualizarResumen() {
    var cantidad = Object.keys(seleccion).length;
    seatCountEl.textContent = cantidad;
    seatTotalEl.textContent = formatearPrecio(cantidad * funcionActual.precio);

    if (continueBtn) {
      continueBtn.setAttribute('aria-disabled', String(cantidad === 0));
    }

    actualizarAlerta();
  }

  function alternarButaca(boton) {
    if (boton.disabled) return;

    var seleccionada = boton.classList.toggle('seat--selected');
    boton.setAttribute('aria-pressed', String(seleccionada));
    boton.setAttribute('aria-label', 'Butaca ' + boton.dataset.seat + ', ' + (seleccionada ? 'seleccionada' : 'disponible'));

    if (seleccionada) {
      seleccion[boton.dataset.butacaId] = boton.dataset.seat;
    } else {
      delete seleccion[boton.dataset.butacaId];
    }

    actualizarResumen();
  }

  seatMap.addEventListener('click', function (evento) {
    var boton = evento.target.closest('.seat');
    if (boton) alternarButaca(boton);
  });

  if (continueBtn) {
    continueBtn.addEventListener('click', function (evento) {
      if (continueBtn.getAttribute('aria-disabled') === 'true') {
        evento.preventDefault();
        return;
      }

      var butacaIds = Object.keys(seleccion);
      sessionStorage.setItem(CLAVE_SESION, JSON.stringify({
        funcion: funcionActual,
        butacas: butacaIds.map(function (id) {
          return { id: Number(id), codigo: seleccion[id] };
        }),
      }));
    });
  }

  async function cargarButacas(funcionId) {
    var respuesta = await fetch(apiButacas + '?funcion_id=' + encodeURIComponent(funcionId));
    var cuerpo = await respuesta.json();
    if (!respuesta.ok) throw new Error(cuerpo.mensaje || 'No se pudo cargar la función.');
    return cuerpo.data;
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var parametros = new URLSearchParams(window.location.search);
    var funcionId = parametros.get('funcion_id');

    if (!funcionId) {
      mostrarError('No se indicó qué función mostrar. Elegí una película y una función desde la cartelera.');
      return;
    }

    try {
      var datos = await cargarButacas(funcionId);
      funcionActual = datos.funcion;

      funcionEl.textContent = funcionActual.pelicula_titulo + ' · ' + funcionActual.cine_nombre + ' · ' +
        funcionActual.sala_nombre + ' · Hoy ' + formatearHora(funcionActual.horario);

      construirGrilla(datos.butacas);
      actualizarResumen();
    } catch (error) {
      mostrarError('No se pudo cargar el estado de las butacas de esta función.');
      console.error(error);
    }
  });
})();
