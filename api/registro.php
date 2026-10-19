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

$nombre = trim($datos['nombre'] ?? '');
$email = trim($datos['email'] ?? '');
$password = (string) ($datos['password'] ?? '');

// Validaciones del lado del servidor
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

// Hash BCRYPT de la contraseña, nunca se guarda texto plano
$hash = password_hash($password, PASSWORD_BCRYPT);

try {
    $pdo = obtenerConexion();

    // El rol nunca se toma del request: queda en el default 'cliente' de la tabla
    $consulta = $pdo->prepare('INSERT INTO usuarios (nombre, email, password) VALUES (:nombre, :email, :password)');
    $consulta->execute([
        ':nombre' => $nombre,
        ':email' => $email,
        ':password' => $hash,
    ]);

    http_response_code(201);
    echo json_encode(['estado' => 'exito', 'mensaje' => 'Usuario registrado correctamente.']);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        // Email duplicado (restricción UNIQUE)
        http_response_code(409);
        echo json_encode(['estado' => 'error', 'mensaje' => 'Ese email ya está registrado.']);
    } else {
        http_response_code(500);
        echo json_encode(['estado' => 'error', 'mensaje' => 'No se pudo completar el registro.']);
    }
}
