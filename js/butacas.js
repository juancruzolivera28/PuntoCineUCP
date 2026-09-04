(function () {
  'use strict';

  var PRECIO_BUTACA = 4200;

  var seatMap = document.getElementById('seatMap');
  var seatCountEl = document.getElementById('seatCount');
  var seatTotalEl = document.getElementById('seatTotal');
  var continueBtn = document.getElementById('continueBtn');

  if (!seatMap) return;

  function formatearPrecio(valor) {
    return '$' + valor.toLocaleString('es-AR');
  }

  function actualizarResumen() {
    var seleccionadas = seatMap.querySelectorAll('.seat--selected').length;
    seatCountEl.textContent = seleccionadas;
    seatTotalEl.textContent = formatearPrecio(seleccionadas * PRECIO_BUTACA);

    if (continueBtn) {
      var habilitado = seleccionadas > 0;
      continueBtn.setAttribute('aria-disabled', String(!habilitado));
    }
  }

  function alternarButaca(seat) {
    if (seat.disabled || seat.classList.contains('seat--occupied')) return;

    var seleccionada = seat.classList.toggle('seat--selected');
    seat.setAttribute('aria-pressed', String(seleccionada));

    var nombre = seat.getAttribute('data-seat');
    seat.setAttribute(
      'aria-label',
      'Butaca ' + nombre + ', ' + (seleccionada ? 'seleccionada' : 'disponible')
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

  actualizarResumen();
})();
