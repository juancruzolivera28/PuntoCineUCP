<?php
require_once __DIR__ . '/../config/conexion.php';
require_once __DIR__ . '/../models/Usuario.php';

session_start();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Método no permitido.']);
    exit;
}

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Acceso no autorizado. Inicie sesión.']);
    exit;
}

try {
    $pdo = obtenerConexion();

    $usuario = buscarUsuarioPorId($pdo, $_SESSION['usuario_id']);

    if (!$usuario) {
        http_response_code(401);
        echo json_encode(['estado' => 'error', 'mensaje' => 'Acceso no autorizado. Inicie sesión.']);
        exit;
    }

    http_response_code(200);
    echo json_encode(['estado' => 'exito', 'data' => $usuario]);
} catch (PDOException $error) {
    http_response_code(500);
    echo json_encode(['estado' => 'error', 'mensaje' => 'No se pudo obtener el perfil.']);
}
