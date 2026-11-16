# PuntoCine

Sistema de venta de entradas para los cines PuntoCine (Las Tipas, IMAX y Sunstar, en Posadas, Misiones). Permite consultar la cartelera, ver la ficha de cada película, ubicar los cines, elegir butacas para una función y completar la compra sin necesidad de iniciar sesión. Quien se registra y loguea puede además consultar su perfil.

Trabajo práctico AE4 (TIFAS) — Paradigmas y Lenguajes de Programación III.

## Arquitectura

- **Frontend**: SPA en HTML, CSS y JavaScript (fetch + async/await), sin frameworks.
- **Backend**: endpoints REST en PHP puro, sin frameworks.
- **Base de datos**: MySQL, accedida con PDO y prepared statements.

## Estructura de carpetas

```
PuntoCine/
├── api/              Endpoints REST en PHP (peliculas, cines, butacas, medios_pago, compras, login, registro, logout, perfil)
├── config/           Conexión PDO a MySQL (conexion.php)
├── models/           Acceso a datos con PDO Prepared Statements (una clase/archivo por entidad)
├── public/           La SPA que se sirve al navegador
│   ├── css/          Hoja de estilos
│   ├── js/           Lógica de cada pantalla (fetch a la API, render con textContent)
│   ├── img/          Posters y recursos gráficos
│   ├── cines/        Fichas de cada cine (Las Tipas, IMAX, Sunstar)
│   └── *.html         Páginas de la SPA (cartelera, ficha, butacas, compra, cuenta)
├── sql/              Script de creación de la base y datos de ejemplo (puntocine.sql)
└── docs/             Documentación del proyecto
```

## Puesta en marcha con XAMPP

1. Copiá la carpeta completa `PuntoCine` dentro de `htdocs` de tu instalación de XAMPP.
2. Iniciá los servicios **Apache** y **MySQL** desde el panel de control de XAMPP.
3. Abrí phpMyAdmin (`http://localhost/phpmyadmin`), creá la base importando el script `sql/puntocine.sql` (pestaña *Importar*). El script crea la base `puntocine` y la completa con cines, salas, películas, funciones, butacas y medios de pago de ejemplo.
4. Abrí `http://localhost/PuntoCine/public/` en el navegador.

La conexión en `config/conexion.php` usa las credenciales por defecto de XAMPP (usuario `root`, sin contraseña). Si tu instalación usa otras credenciales, actualizalas ahí.

Si en vez de phpMyAdmin importás con el cliente `mysql` por línea de comandos en Windows, indicá el charset explícitamente, porque por defecto usa `cp850` y corrompe los acentos:

```
mysql -u root --default-character-set=utf8mb4 < sql/puntocine.sql
```

## Casos de uso principales

| Caso de uso | Endpoint |
|---|---|
| Consultar cartelera | `GET /api/peliculas.php` |
| Ver ficha de una película | `GET /api/peliculas.php?id=` |
| Ver ubicación de un cine | `GET /api/cines.php` y `GET /api/cines.php?id=` |
| Seleccionar butaca | `GET /api/butacas.php?funcion_id=` |
| Elegir medio de pago | `GET /api/medios_pago.php` |
| Completar compra (sin sesión) | `POST /api/compras.php` |
| Ver perfil (requiere sesión) | `GET /api/perfil.php` |

El detalle de parámetros, respuestas y códigos HTTP de cada endpoint está en `docs/inventario_endpoints.md`.
