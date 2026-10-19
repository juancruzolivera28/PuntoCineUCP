<?php
require_once __DIR__ . '/../config/conexion.php';

header('Content-Type: application/json; charset=utf-8');

// Este endpoint solo acepta POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Método no permitido.']);
    exit;
}

$datos = json_decode(file_get_contents('php://input'), true);

$email = trim($datos['email'] ?? '');
$password = (string) ($datos['password'] ?? '');

if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Email y contraseña son obligatorios.']);
    exit;
}

try {
    $pdo = obtenerConexion();

    $consulta = $pdo->prepare('SELECT id, nombre, email, password, rol FROM usuarios WHERE email = :email');
    $consulta->execute([':email' => $email]);
    $usuario = $consulta->fetch();

    if (!$usuario || !password_verify($password, $usuario['password'])) {
        http_response_code(401);
        // Mensaje genérico: no se aclara si falló el email o la contraseña
        echo json_encode(['estado' => 'error', 'mensaje' => 'Email o contraseña incorrectos.']);
        exit;
    }

    // Cookie de sesión HttpOnly + SameSite=Lax, configurada ANTES de abrir la sesión
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
    session_regenerate_id(true); // evita fijación de sesión

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
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['estado' => 'error', 'mensaje' => 'No se pudo iniciar sesión.']);
}
