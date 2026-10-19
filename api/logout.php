<?php
session_start();

header('Content-Type: application/json; charset=utf-8');

// Se vacía la sesión y se borra la cookie correspondiente
$_SESSION = [];

if (ini_get('session.use_cookies')) {
    $parametros = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $parametros['path'],
        $parametros['domain'],
        $parametros['secure'],
        $parametros['httponly']
    );
}

session_destroy();

http_response_code(200);
echo json_encode(['estado' => 'exito', 'mensaje' => 'Sesión cerrada.']);
