<?php
require_once __DIR__ . '/../config/conexion.php';
require_once __DIR__ . '/../models/Usuario.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Método no permitido.']);
    exit;
}

$datos = json_decode(file_get_contents('php://input'), true) ?? [];

$email = trim($datos['email'] ?? '');
$password = (string) ($datos['password'] ?? '');

if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Email y contraseña son obligatorios.']);
    exit;
}

try {
    $pdo = obtenerConexion();

    $usuario = buscarUsuarioPorEmail($pdo, $email);

    if (!$usuario || !password_verify($password, $usuario['password'])) {
        http_response_code(400);
        echo json_encode(['estado' => 'error', 'mensaje' => 'Email o contraseña incorrectos.']);
        exit;
    }

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
    session_regenerate_id(true);

    $_SESSION['usuario_id'] = $usuario['id'];
    $_SESSION['usuario_nombre'] = $usuario['nombre'];
    $_SESSION['usuario_rol'] = $usuario['rol'];

    http_response_code(200);
    echo json_encode([
        'estado' => 'exito',
        'mensaje' => 'Ingreso correcto.',
        'data' => [
            'nombre' => $usuario['nombre'],
            'email' => $usuario['email'],
            'rol' => $usuario['rol'],
        ],
    ]);
} catch (PDOException $error) {
    http_response_code(500);
    echo json_encode(['estado' => 'error', 'mensaje' => 'No se pudo iniciar sesión.']);
}
