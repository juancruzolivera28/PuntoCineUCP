(function () {
  'use strict';

  var BUTACAS_URL = 'data/butacas.json';
  var PRECIO_BUTACA = 4200;
  var UMBRAL_CRITICO = 8;

  var seatMap = document.getElementById('seatMap');
  var seatCountEl = document.getElementById('seatCount');
  var seatTotalEl = document.getElementById('seatTotal');
  var continueBtn = document.getElementById('continueBtn');
  var alertaEl = document.getElementById('alerta-stock');

  if (!seatMap) return;

  function formatearPrecio(valor) {
    return '$' + valor.toLocaleString('es-AR');
  }

  function mostrarError(mensaje) {
    var aviso = document.createElement('div');
    aviso.className = 'carga-error';
    aviso.setAttribute('role', 'alert');
    aviso.textContent = mensaje;
    seatMap.parentNode.insertBefore(aviso, seatMap);
  }

  // Simula la respuesta de un servidor con el estado real de la sala: el
  // libre/ocupada de cada butaca ya no está hardcodeado en el HTML ni el JS.
  async function cargarButacas() {
    const respuesta = await fetch(BUTACAS_URL);

    if (!respuesta.ok) {
      throw new Error('Respuesta HTTP ' + respuesta.status);
    }

    const butacas = await respuesta.json();
    return butacas;
  }

  function pintarButaca(seat, estado) {
    var ocupada = estado === 'ocupada';

    seat.classList.toggle('seat--occupied', ocupada);
    seat.disabled = ocupada;
    seat.setAttribute('aria-pressed', 'false');
    seat.setAttribute(
      'aria-label',
      'Butaca ' + seat.dataset.seat + ', ' + (ocupada ? 'ocupada' : 'disponible')
    );
  }

  function pintarGrilla(butacas) {
    butacas.forEach(function (butaca) {
      var seat = seatMap.querySelector('.seat[data-seat="' + butaca.id + '"]');
      if (seat) pintarButaca(seat, butaca.estado);
    });
  }

  function actualizarAlerta() {
    if (!alertaEl) return;

    var totalButacas = seatMap.querySelectorAll('.seat').length;
    var ocupadas = seatMap.querySelectorAll('.seat--occupied').length;
    var seleccionadas = seatMap.querySelectorAll('.seat--selected').length;

    // Una butaca seleccionada ya no está disponible para otro comprador
    // mientras dura esta reserva, así que cuenta como "stock" consumido
    // igual que una ocupada a los fines de la alerta.
    var disponibles = totalButacas - ocupadas - seleccionadas;

    alertaEl.hidden = disponibles > UMBRAL_CRITICO;
  }

  function actualizarResumen() {
    var seleccionadas = seatMap.querySelectorAll('.seat--selected').length;
    seatCountEl.textContent = seleccionadas;
    seatTotalEl.textContent = formatearPrecio(seleccionadas * PRECIO_BUTACA);

    if (continueBtn) {
      var habilitado = seleccionadas > 0;
      continueBtn.setAttribute('aria-disabled', String(!habilitado));
    }

    actualizarAlerta();
  }

  function alternarButaca(seat) {
    if (seat.disabled || seat.classList.contains('seat--occupied')) return;

    var seleccionada = seat.classList.toggle('seat--selected');
    seat.setAttribute('aria-pressed', String(seleccionada));
    seat.setAttribute(
      'aria-label',
      'Butaca ' + seat.dataset.seat + ', ' + (seleccionada ? 'seleccionada' : 'disponible')
    );

    actualizarResumen();
  }

  seatMap.addEventListener('click', function (evento) {
    var seat = evento.target.closest('.seat');
    if (seat) alternarButaca(seat);
  });

  if (continueBtn) {
    continueBtn.addEventListener('click', function (evento) {
      if (continueBtn.getAttribute('aria-disabled') === 'true') {
        evento.preventDefault();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', async function () {
    try {
      var butacas = await cargarButacas();
      pintarGrilla(butacas);
      actualizarResumen();
    } catch (error) {
      // Si se abre butacas.html con doble clic (protocolo file://), fetch()
      // de un archivo local puede fallar por CORS: se avisa en el DOM.
      mostrarError(
        'No se pudo cargar el estado de las butacas. ' +
        'Si abriste este archivo con doble clic, probá servirlo desde un ' +
        'servidor local (por ejemplo "Live Server" de VS Code o ' +
        '"python -m http.server"), ya que los navegadores bloquean fetch() ' +
        'sobre archivos abiertos con file://.'
      );
      console.error('Error al cargar butacas:', error);
    }
  });
})();
