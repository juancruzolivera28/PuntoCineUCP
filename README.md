# PuntoCine

## Descripción

PuntoCine es un sistema de venta de entradas para tres cines de Posadas, Misiones: Las Tipas, IMAX y Sunstar. Desde la página podés consultar la cartelera de la semana, abrir la ficha de cada película, ver la dirección y las salas de cada cine, elegir las butacas de una función y completar la compra sin necesidad de crear una cuenta. Si te registrás e iniciás sesión, también podés consultar tu perfil.

El sistema tiene dos partes que se comunican entre sí:

- El **frontend**: una SPA (del inglés *single-page application*, una página que carga una sola vez y después actualiza su contenido pidiendo datos nuevos, sin recargar), hecha en HTML, CSS y JavaScript puro. Pide los datos al servidor con `fetch` (la función de JavaScript para hacer pedidos HTTP) en vez de tenerlos escritos de antemano en el HTML.
- El **backend**: un conjunto de endpoints en PHP (URLs del servidor que devuelven datos en formato JSON) que consultan una base de datos MySQL con PDO (la interfaz que usa PHP para conectarse a bases de datos de forma segura, con consultas preparadas que evitan la inyección SQL).

Trabajo práctico AE4 (TIFAS) de la materia Paradigmas y Lenguajes de Programación III.

## Requisitos

- XAMPP, con Apache, PHP (versión 8 o superior) y MySQL habilitados.
- Un navegador web.

No hace falta instalar Node, Composer ni ninguna otra herramienta: todo corre con lo que trae XAMPP.

## Instalación

1. Copiá la carpeta completa del proyecto a `C:\xampp\htdocs\PuntoCine`.
2. Abrí el panel de control de XAMPP e iniciá los servicios **Apache** y **MySQL**.
3. Importá la base de datos. Hay dos formas:
   - Desde phpMyAdmin (`http://localhost/phpmyadmin`): pestaña *Importar*, elegí el archivo `sql/puntocine.sql` y confirmá.
   - Desde la línea de comandos, indicando el charset (la codificación de caracteres) explícitamente. En Windows, el cliente de MySQL usa por defecto una codificación que rompe los acentos si no se la aclarás:
     ```
     mysql -u root --default-character-set=utf8mb4 < sql/puntocine.sql
     ```
   El script crea la base `puntocine` y la carga con los tres cines, sus salas, las películas, las funciones, las butacas y los medios de pago.
4. Abrí `http://localhost/PuntoCine/public/` en el navegador.

La conexión a la base está configurada en `config/conexion.php` con las credenciales por defecto de XAMPP (usuario `root`, sin contraseña). Si tu instalación usa otras credenciales, cambialas ahí.

## Estructura de carpetas

```
PuntoCine/
├── api/        Endpoints REST en PHP: peliculas, cines, butacas, medios_pago, compras, login, registro, logout, perfil
├── config/     Conexión PDO a MySQL (conexion.php)
├── models/     Acceso a datos con PDO y consultas preparadas, un archivo por entidad
├── public/     La SPA que se sirve al navegador
│   ├── css/      Hoja de estilos
│   ├── js/       Lógica de cada pantalla: piden datos a la API y los muestran en la página
│   ├── img/      Posters y recursos gráficos
│   ├── cines/    Ficha de cada cine (Las Tipas, IMAX, Sunstar)
│   └── *.html    Páginas de la SPA (cartelera, ficha, butacas, compra, cuenta)
├── sql/        Script de creación de la base y datos de ejemplo (puntocine.sql)
└── docs/       Documentación del proyecto
```

## Endpoints

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

## Cuenta de prueba

La base no trae ninguna cuenta cargada: la tabla de usuarios se crea vacía. Para probar el inicio de sesión, entrá a `http://localhost/PuntoCine/public/cuenta.html` y registrate desde la pestaña "Crear cuenta" (nombre, email y una contraseña de al menos 6 caracteres). Después podés iniciar sesión con esos mismos datos.

Comprar entradas no requiere cuenta: podés elegir butacas y completar la compra sin iniciar sesión.
