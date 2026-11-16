# Ficha de calidad ISO/IEC 25010

## Adecuación funcional

El sistema cubre los casos de uso definidos (cartelera, ficha de película, ubicación de cines, selección de butacas, medios de pago y compra) sin agregar operaciones fuera de alcance (no hay CRUD completo ni cancelación de compra). La compra valida en el servidor los datos obligatorios, que haya al menos una butaca y que ninguna esté ya vendida para esa función.

**Evidencia**: `api/compras.php` líneas 24-28 (campos obligatorios) y líneas 36-50 (al menos una butaca, ids válidos); `models/Compra.php` líneas 23-32 (chequeo de butaca ya vendida).

## Eficiencia de desempeño

El estado de las butacas de una función se resuelve con una sola consulta (`LEFT JOIN` contra las butacas ya vendidas para esa función) en lugar de una consulta por butaca, y las consultas usan los índices de las claves foráneas y la restricción `UNIQUE (funcion_id, butaca_id)` para evitar recorridos innecesarios.

**Evidencia**: `models/Butaca.php` línea 31 (`LEFT JOIN compra_butacas ...`); `sql/puntocine.sql` restricción `UNIQUE KEY funcion_butaca (funcion_id, butaca_id)` en la tabla `compra_butacas`.

## Compatibilidad

Todos los endpoints exponen un contrato uniforme (JSON con `Content-Type: application/json; charset=utf-8`), consumible por cualquier cliente HTTP, no solo por esta SPA.

**Evidencia**: `api/peliculas.php` línea 5 (`header('Content-Type: application/json; charset=utf-8')`); el mismo patrón se repite en los 8 endpoints restantes de `api/`.

## Usabilidad

La navegación es accesible por teclado (Tab + Enter) usando `<button>` y `<a>` semánticos, con `:focus-visible` visible en el CSS y regiones `aria-live` en los contenedores que se actualizan por `fetch()`, de modo que los lectores de pantalla anuncian los cambios de la cartelera, las butacas y los mensajes de error.

**Evidencia**: `public/css/styles.css` líneas 439-441 (`a:focus-visible, .btn:focus-visible`); `public/butacas.html` líneas 40 y 51 (`aria-live="polite"` en el resumen de la función y en el mapa de butacas).

## Fiabilidad

La creación de una compra corre dentro de una transacción: si una butaca ya fue vendida o cualquier paso falla, se hace `rollBack()` y no queda ninguna fila a medio insertar (ni la compra ni sus butacas).

**Evidencia**: `models/Compra.php` línea 7 (`beginTransaction()`), línea 68 (`commit()`) y línea 72 (`rollBack()` dentro del `catch`).

## Seguridad

Las contraseñas se guardan con `password_hash()` (BCRYPT) y se verifican con `password_verify()`, nunca en texto plano; el login regenera el id de sesión para evitar fijación de sesión; y todas las consultas SQL del proyecto usan PDO con marcadores nombrados, sin concatenar valores en el SQL.

**Evidencia**: `api/registro.php` línea 46 (`password_hash($password, PASSWORD_BCRYPT)`); `api/login.php` línea 29 (`password_verify`) y línea 42 (`session_regenerate_id(true)`); `models/Usuario.php`, `models/Pelicula.php`, `models/Cine.php`, `models/Butaca.php`, `models/MedioPago.php` y `models/Compra.php` usan `$pdo->prepare()` con marcadores `:campo` en cada consulta.

## Mantenibilidad

El código está separado en capas (`config/` conexión, `models/` acceso a datos, `api/` endpoints, `public/` interfaz), de modo que la lógica de acceso a una tabla vive en un solo archivo y es reutilizada por los endpoints que la necesitan sin duplicar SQL.

**Evidencia**: `models/Pelicula.php` (funciones `obtenerPeliculas` y `obtenerPeliculaPorId`) es usado tanto por `api/peliculas.php` como, indirectamente, por la cartelera filtrada de `public/js/cines.js`; la estructura de carpetas completa está documentada en `README.md`.
