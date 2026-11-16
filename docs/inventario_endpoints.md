# Inventario de endpoints

Todas las respuestas son `Content-Type: application/json; charset=utf-8` con la forma `{ "estado": "exito" | "error", "data"?: ..., "mensaje"?: "..." }`.

## GET /api/peliculas.php

Consultar cartelera completa, o la ficha de una película puntual.

| | |
|---|---|
| Parámetros de entrada | Query string opcional: `id` (int) |
| Respuesta sin `id` | `data`: arreglo de películas `{ id, slug, titulo, genero, duracion_min, clasificacion, poster_url, funciones: [{ id, horario, precio, sala_id, sala_nombre, cine_id, cine_slug, cine_nombre, cine_direccion }] }` |
| Respuesta con `id` | `data`: objeto de película `{ id, slug, titulo, genero, duracion_min, clasificacion, sinopsis, director, elenco, idioma, poster_url, funciones: [...] }` |
| Códigos HTTP | `200` éxito · `400` id inválido o inexistente · `405` método distinto de GET · `500` error de base de datos |

## GET /api/cines.php

Consultar los cines, o el detalle (dirección y salas) de uno puntual.

| | |
|---|---|
| Parámetros de entrada | Query string opcional: `id` (int) |
| Respuesta sin `id` | `data`: arreglo `{ id, slug, nombre, zona, direccion, horario_boleteria }` |
| Respuesta con `id` | `data`: objeto `{ id, slug, nombre, zona, direccion, horario_boleteria, mapa_query, salas: [{ id, nombre, filas, columnas }] }` |
| Códigos HTTP | `200` éxito · `400` id inválido o inexistente · `405` método distinto de GET · `500` error de base de datos |

## GET /api/butacas.php

Consultar el estado de cada butaca de la sala de una función.

| | |
|---|---|
| Parámetros de entrada | Query string obligatorio: `funcion_id` (int) |
| Respuesta | `data`: `{ funcion: { id, horario, precio, sala_id, sala_nombre, pelicula_id, pelicula_titulo, cine_id, cine_nombre }, butacas: [{ id, fila, numero, codigo, estado: "libre" \| "ocupada" }] }` |
| Códigos HTTP | `200` éxito · `400` falta `funcion_id`, no es numérico, o la función no existe · `405` método distinto de GET · `500` error de base de datos |

## GET /api/medios_pago.php

Consultar los medios de pago disponibles.

| | |
|---|---|
| Parámetros de entrada | Ninguno |
| Respuesta | `data`: arreglo `{ id, codigo, nombre }` |
| Códigos HTTP | `200` éxito · `405` método distinto de GET · `500` error de base de datos |

## POST /api/compras.php

Completar una compra (butacas de una función + datos del comprador). No requiere sesión iniciada.

| | |
|---|---|
| Cuerpo JSON de entrada | `{ nombre, direccion, telefono, email, medio_pago: "<codigo>", funcion_id: <int>, butacas: [<int>, ...] }` |
| Respuesta éxito | `data`: `{ id, total }` |
| Respuesta error | `{ estado: "error", mensaje: "..." }` |
| Códigos HTTP | `201` compra creada · `400` datos obligatorios faltantes, email inválido, sin butacas, butaca/función inexistente o butaca ya vendida para esa función · `405` método distinto de POST · `500` error de base de datos |

## POST /api/registro.php

Crear una cuenta de usuario.

| | |
|---|---|
| Cuerpo JSON de entrada | `{ nombre, email, password }` (password de al menos 6 caracteres) |
| Respuesta éxito | `{ estado: "exito", mensaje: "Usuario registrado correctamente." }` |
| Códigos HTTP | `201` usuario creado · `400` datos faltantes, email inválido, contraseña corta o email ya registrado · `405` método distinto de POST · `500` error de base de datos |

## POST /api/login.php

Iniciar sesión.

| | |
|---|---|
| Cuerpo JSON de entrada | `{ email, password }` |
| Respuesta éxito | `data`: `{ nombre, email, rol }` |
| Códigos HTTP | `200` ingreso correcto · `400` datos faltantes o credenciales incorrectas · `405` método distinto de POST · `500` error de base de datos |

## POST /api/logout.php

Cerrar la sesión activa.

| | |
|---|---|
| Parámetros de entrada | Ninguno |
| Respuesta | `{ estado: "exito", mensaje: "Sesión cerrada." }` |
| Códigos HTTP | `200` éxito · `405` método distinto de POST |

## GET /api/perfil.php

Consultar los datos del usuario logueado. Ruta protegida: requiere sesión iniciada.

| | |
|---|---|
| Parámetros de entrada | Ninguno (usa la sesión activa) |
| Respuesta | `data`: `{ id, nombre, email, rol }` |
| Códigos HTTP | `200` éxito · `401` sin sesión iniciada · `405` método distinto de GET · `500` error de base de datos |
