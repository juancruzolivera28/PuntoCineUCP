(function () {
  'use strict';

  var PRECIOS_URL = 'data/precios.json';

  var qtyControls = document.querySelectorAll('.qty-control');
  var totalEl = document.querySelector('.form-summary');

  if (!qtyControls.length || !totalEl) return;

  var precios = [];

  function formatearPrecio(valor) {
    return '$' + valor.toLocaleString('es-AR');
  }

  function mostrarError(mensaje) {
    var listado = document.querySelector('.product-list');
    if (!listado || !listado.parentNode) return;

    var aviso = document.createElement('div');
    aviso.className = 'precios-error';
    aviso.setAttribute('role', 'alert');
    aviso.textContent = mensaje;
    listado.parentNode.insertBefore(aviso, listado);
  }

  // Simula la respuesta de un servidor: los precios ya no están hardcodeados
  // en el HTML, se piden por fetch() a un JSON local.
  async function cargarPrecios() {
    const respuesta = await fetch(PRECIOS_URL);

    if (!respuesta.ok) {
      throw new Error('Respuesta HTTP ' + respuesta.status);
    }

    const lista = await respuesta.json();
    return lista;
  }

  function buscarPrecio(id) {
    var item = precios.find(function (p) { return p.id === id; });
    return item ? item.precio : 0;
  }

  function calcularSubtotal(control) {
    var valueEl = control.querySelector('.qty-value');
    var cantidad = Number(valueEl.textContent) || 0;
    var precio = buscarPrecio(control.dataset.id);
    return cantidad * precio;
  }

  function actualizarFila(control) {
    var fila = control.closest('.product-list__row');
    var subtotalEl = fila && fila.querySelector('.subtotal');
    if (subtotalEl) {
      subtotalEl.textContent = formatearPrecio(calcularSubtotal(control));
    }
  }

  function actualizarTotal() {
    var total = 0;
    qtyControls.forEach(function (control) {
      total += calcularSubtotal(control);
    });
    totalEl.textContent = 'Total: ' + formatearPrecio(total);
  }

  function cambiarCantidad(control, delta) {
    var valueEl = control.querySelector('.qty-value');
    var actual = Number(valueEl.textContent) || 0;
    var nuevo = Math.max(0, actual + delta);

    valueEl.textContent = String(nuevo);
    actualizarFila(control);
    actualizarTotal();
  }

  function habilitarControles() {
    qtyControls.forEach(function (control) {
      var btnMenos = control.querySelector('.qty-btn--minus');
      var btnMas = control.querySelector('.qty-btn--plus');

      if (!btnMenos || !btnMas) return;

      btnMenos.disabled = false;
      btnMas.disabled = false;

      btnMenos.addEventListener('click', function () {
        cambiarCantidad(control, -1);
      });

      btnMas.addEventListener('click', function () {
        cambiarCantidad(control, 1);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', async function () {
    try {
      precios = await cargarPrecios();
      habilitarControles();
      actualizarTotal();
    } catch (error) {
      // Si se abre comprar.html con doble clic (protocolo file://), fetch()
      // de un archivo local puede fallar por CORS: se avisa en el DOM.
      mostrarError(
        'No se pudieron cargar los precios de las funciones. ' +
        'Si abriste este archivo con doble clic, probá servirlo desde un ' +
        'servidor local (por ejemplo "Live Server" de VS Code o ' +
        '"python -m http.server"), ya que los navegadores bloquean fetch() ' +
        'sobre archivos abiertos con file://.'
      );
      console.error('Error al cargar precios:', error);
    }
  });
})();
