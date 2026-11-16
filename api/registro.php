<?php
require_once __DIR__ . '/../config/conexion.php';
require_once __DIR__ . '/../models/Usuario.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Método no permitido.']);
    exit;
}

$datos = json_decode(file_get_contents('php://input'), true);

$nombre = trim($datos['nombre'] ?? '');
$email = trim($datos['email'] ?? '');
$password = (string) ($datos['password'] ?? '');

if ($nombre === '' || $email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Nombre, email y contraseña son obligatorios.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['estado' => 'error', 'mensaje' => 'El email no es válido.']);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['estado' => 'error', 'mensaje' => 'La contraseña debe tener al menos 6 caracteres.']);
    exit;
}

try {
    $pdo = obtenerConexion();

    if (buscarUsuarioPorEmail($pdo, $email)) {
        http_response_code(400);
        echo json_encode(['estado' => 'error', 'mensaje' => 'Ese email ya está registrado.']);
        exit;
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);
    crearUsuario($pdo, $nombre, $email, $hash);

    http_response_code(201);
    echo json_encode(['estado' => 'exito', 'mensaje' => 'Usuario registrado correctamente.']);
} catch (PDOException $error) {
    http_response_code(500);
    echo json_encode(['estado' => 'error', 'mensaje' => 'No se pudo completar el registro.']);
}
