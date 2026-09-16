(function () {
  'use strict';

  var qtyInputs = document.querySelectorAll('.qty-input');
  var totalEl = document.querySelector('.form-summary');

  if (!qtyInputs.length || !totalEl) return;

  function formatearPrecio(valor) {
    return '$' + valor.toLocaleString('es-AR');
  }

  function actualizarTotales() {
    var total = 0;

    qtyInputs.forEach(function (input) {
      var fila = input.closest('.product-list__row');
      var precio = Number(input.dataset.price);
      var cantidad = Number(input.value) || 0;
      var subtotal = cantidad * precio;

      fila.querySelector('.subtotal').textContent = formatearPrecio(subtotal);
      total += subtotal;
    });

    totalEl.textContent = 'Total: ' + formatearPrecio(total);
  }

  qtyInputs.forEach(function (input) {
    input.addEventListener('input', actualizarTotales);
  });

  actualizarTotales();
})();
