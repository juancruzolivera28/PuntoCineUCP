(function () {
  'use strict';

  var CLAVE_SESION = 'puntocine:seleccion';

  var scriptEl = document.currentScript;
  var apiMediosPago = new URL('../../api/medios_pago.php', scriptEl.src).href;
  var apiCompras = new URL('../../api/compras.php', scriptEl.src).href;

  var form = document.getElementById('form-compra');
  var resumenEl = document.getElementById('resumen-compra');
  var mediosPagoEl = document.getElementById('medios-pago');
  var mensajeEl = document.getElementById('mensaje-compra');

  if (!form) return;

  var seleccion = null;

  function formatearPrecio(valor) {
    return '$' + Number(valor).toLocaleString('es-AR');
  }

  function formatearHora(horario) {
    return horario.slice(0, 5);
  }

  function mostrarMensaje(texto, tipo) {
    mensajeEl.textContent = texto;
    mensajeEl.className = 'auth-mensaje auth-mensaje--' + tipo;
    mensajeEl.hidden = false;
  }

  function mostrarResumen() {
    resumenEl.textContent = '';
    resumenEl.hidden = false;

    var funcion = seleccion.funcion;
    var codigos = seleccion.butacas.map(function (b) { return b.codigo; }).join(', ');
    var total = seleccion.butacas.length * funcion.precio;

    var parrafo = document.createElement('p');
    parrafo.textContent = funcion.pelicula_titulo + ' · ' + funcion.cine_nombre + ' · ' + funcion.sala_nombre +
      ' · Hoy ' + formatearHora(funcion.horario);
    resumenEl.appendChild(parrafo);

    var butacasP = document.createElement('p');
    butacasP.textContent = 'Butacas: ' + codigos;
    resumenEl.appendChild(butacasP);

    var totalP = document.createElement('p');
    totalP.style.fontWeight = '700';
    totalP.textContent = 'Total: ' + formatearPrecio(total);
    resumenEl.appendChild(totalP);
  }

  function mostrarSinSeleccion() {
    resumenEl.textContent = '';
    resumenEl.hidden = false;
    resumenEl.className = 'auth-mensaje auth-mensaje--error';

    var parrafo = document.createElement('p');
    parrafo.textContent = 'No hay butacas seleccionadas.';
    resumenEl.appendChild(parrafo);

    var enlace = document.createElement('a');
    enlace.href = 'listado_box.html';
    enlace.textContent = 'Volver a la cartelera';
    resumenEl.appendChild(enlace);

    form.hidden = true;
  }

  async function cargarMediosPago() {
    var respuesta = await fetch(apiMediosPago);
    var cuerpo = await respuesta.json();
    if (!respuesta.ok) throw new Error(cuerpo.mensaje || 'No se pudieron cargar los medios de pago.');

    cuerpo.data.forEach(function (medio, indice) {
      var label = document.createElement('label');
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'pago';
      input.value = medio.codigo;
      input.required = true;
      if (indice === 0) input.checked = true;

      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + medio.nombre));
      mediosPagoEl.appendChild(label);
    });
  }

  form.addEventListener('submit', async function (evento) {
    evento.preventDefault();

    mensajeEl.hidden = true;

    var medioSeleccionado = form.querySelector('input[name="pago"]:checked');

    var cuerpo = {
      nombre: document.getElementById('nombre').value.trim(),
      direccion: document.getElementById('direccion').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      email: document.getElementById('email').value.trim(),
      medio_pago: medioSeleccionado ? medioSeleccionado.value : '',
      funcion_id: seleccion.funcion.id,
      butacas: seleccion.butacas.map(function (b) { return b.id; }),
    };

    try {
      var respuesta = await fetch(apiCompras, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuerpo),
      });
      var respuestaCuerpo = await respuesta.json();

      if (respuesta.ok) {
        sessionStorage.removeItem(CLAVE_SESION);
        mostrarMensaje(respuestaCuerpo.mensaje, 'exito');
        form.hidden = true;
      } else {
        mostrarMensaje(respuestaCuerpo.mensaje, 'error');
      }
    } catch (error) {
      mostrarMensaje('No se pudo conectar con el servidor.', 'error');
      console.error('Error al confirmar la compra:', error);
    }
  });

  document.addEventListener('DOMContentLoaded', async function () {
    var guardado = sessionStorage.getItem(CLAVE_SESION);
    seleccion = guardado ? JSON.parse(guardado) : null;

    if (!seleccion || !seleccion.butacas || seleccion.butacas.length === 0) {
      mostrarSinSeleccion();
      return;
    }

    mostrarResumen();

    try {
      await cargarMediosPago();
    } catch (error) {
      mostrarMensaje('No se pudieron cargar los medios de pago.', 'error');
      console.error(error);
    }
  });
})();
