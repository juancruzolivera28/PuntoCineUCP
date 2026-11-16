(function () {
  'use strict';

  var scriptEl = document.currentScript;
  var apiPerfil = new URL('../../api/perfil.php', scriptEl.src).href;
  var apiLogin = new URL('../../api/login.php', scriptEl.src).href;
  var apiRegistro = new URL('../../api/registro.php', scriptEl.src).href;
  var apiLogout = new URL('../../api/logout.php', scriptEl.src).href;
  var paginaCuenta = new URL('../cuenta.html', scriptEl.src).href;

  async function obtenerPerfil() {
    try {
      var respuesta = await fetch(apiPerfil);
      if (!respuesta.ok) return null;
      var cuerpo = await respuesta.json();
      return cuerpo.data;
    } catch (error) {
      console.error('Error al consultar el perfil:', error);
      return null;
    }
  }

  async function cerrarSesion() {
    try {
      await fetch(apiLogout, { method: 'POST' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  function pintarNav(usuario) {
    var navAuth = document.getElementById('nav-auth');
    if (!navAuth) return;

    while (navAuth.firstChild) navAuth.removeChild(navAuth.firstChild);

    if (usuario) {
      var saludo = document.createElement('span');
      saludo.className = 'auth-nav__saludo';
      saludo.textContent = 'Hola, ' + usuario.nombre;

      var btnSalir = document.createElement('button');
      btnSalir.type = 'button';
      btnSalir.className = 'auth-nav__salir';
      btnSalir.textContent = 'Salir';
      btnSalir.addEventListener('click', async function () {
        await cerrarSesion();
        window.location.reload();
      });

      navAuth.appendChild(saludo);
      navAuth.appendChild(btnSalir);
    } else {
      var link = document.createElement('a');
      link.href = paginaCuenta;
      link.className = 'auth-nav__ingresar';
      link.textContent = 'Ingresar';
      navAuth.appendChild(link);
    }
  }

  function mostrarMensaje(el, texto, tipo) {
    if (!el) return;
    el.textContent = texto;
    el.className = 'auth-mensaje auth-mensaje--' + tipo;
    el.hidden = false;
  }

  function inicializarPestanas() {
    var tabLogin = document.getElementById('tab-login');
    var tabRegistro = document.getElementById('tab-registro');
    var panelLogin = document.getElementById('panel-login');
    var panelRegistro = document.getElementById('panel-registro');

    if (!tabLogin || !tabRegistro || !panelLogin || !panelRegistro) return;

    function activar(pestana) {
      var esLogin = pestana === 'login';
      panelLogin.hidden = !esLogin;
      panelRegistro.hidden = esLogin;
      tabLogin.classList.toggle('auth-tab--active', esLogin);
      tabRegistro.classList.toggle('auth-tab--active', !esLogin);
      tabLogin.setAttribute('aria-selected', String(esLogin));
      tabRegistro.setAttribute('aria-selected', String(!esLogin));
    }

    tabLogin.addEventListener('click', function () { activar('login'); });
    tabRegistro.addEventListener('click', function () { activar('registro'); });
  }

  function mostrarPanelPrivado(usuario) {
    var vistaPublica = document.getElementById('vista-publica');
    var panelPrivado = document.getElementById('panel-privado');
    if (!vistaPublica || !panelPrivado) return;

    vistaPublica.hidden = true;
    panelPrivado.hidden = false;

    document.getElementById('user-nombre').textContent = usuario.nombre;
    document.getElementById('user-email').textContent = usuario.email;
    document.getElementById('user-rol').textContent = usuario.rol;
  }

  function inicializarCuenta(usuario) {
    var formLogin = document.getElementById('form-login');
    var formRegistro = document.getElementById('form-registro');
    var btnLogout = document.getElementById('btn-logout');

    if (!formLogin && !formRegistro && !btnLogout) return;

    inicializarPestanas();

    if (usuario) mostrarPanelPrivado(usuario);

    if (formLogin) {
      formLogin.addEventListener('submit', async function (evento) {
        evento.preventDefault();
        var mensaje = document.getElementById('mensaje-login');
        var email = document.getElementById('login-email').value;
        var password = document.getElementById('login-password').value;

        try {
          var respuesta = await fetch(apiLogin, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password }),
          });
          var cuerpo = await respuesta.json();

          if (respuesta.ok) {
            mostrarMensaje(mensaje, cuerpo.mensaje, 'exito');
            mostrarPanelPrivado(cuerpo.data);
            pintarNav(cuerpo.data);
          } else {
            mostrarMensaje(mensaje, cuerpo.mensaje, 'error');
          }
        } catch (error) {
          mostrarMensaje(mensaje, 'No se pudo conectar con el servidor.', 'error');
          console.error('Error en login:', error);
        }
      });
    }

    if (formRegistro) {
      formRegistro.addEventListener('submit', async function (evento) {
        evento.preventDefault();
        var mensaje = document.getElementById('mensaje-registro');
        var nombre = document.getElementById('registro-nombre').value;
        var email = document.getElementById('registro-email').value;
        var password = document.getElementById('registro-password').value;

        try {
          var respuesta = await fetch(apiRegistro, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nombre, email: email, password: password }),
          });
          var cuerpo = await respuesta.json();

          if (respuesta.ok) {
            mostrarMensaje(mensaje, cuerpo.mensaje + ' Ya podés ingresar.', 'exito');
            formRegistro.reset();
          } else {
            mostrarMensaje(mensaje, cuerpo.mensaje, 'error');
          }
        } catch (error) {
          mostrarMensaje(mensaje, 'No se pudo conectar con el servidor.', 'error');
          console.error('Error en registro:', error);
        }
      });
    }

    if (btnLogout) {
      btnLogout.addEventListener('click', async function () {
        await cerrarSesion();
        window.location.reload();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var usuario = await obtenerPerfil();
    pintarNav(usuario);
    inicializarCuenta(usuario);
  });
})();
