<?php
require_once __DIR__ . '/../config/conexion.php';

session_start();

header('Content-Type: application/json; charset=utf-8');

// Guardián: sin sesión activa no hay acceso a este endpoint privado
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Acceso no autorizado. Inicie sesión.']);
    exit;
}

try {
    $pdo = obtenerConexion();

    $consulta = $pdo->prepare('SELECT email FROM usuarios WHERE id = :id');
    $consulta->execute([':id' => $_SESSION['usuario_id']]);
    $usuario = $consulta->fetch();

    if (!$usuario) {
        http_response_code(401);
        echo json_encode(['estado' => 'error', 'mensaje' => 'Acceso no autorizado. Inicie sesión.']);
        exit;
    }

    http_response_code(200);
    echo json_encode([
        'estado' => 'exito',
        'data' => [
            'id' => $_SESSION['usuario_id'],
            'nombre' => $_SESSION['usuario_nombre'],
            'email' => $usuario['email'],
            'rol' => $_SESSION['usuario_rol'],
        ],
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['estado' => 'error', 'mensaje' => 'No se pudo obtener el perfil.']);
}
