<?php
require_once __DIR__ . '/../config/conexion.php';
require_once __DIR__ . '/../models/MedioPago.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Método no permitido.']);
    exit;
}

try {
    $pdo = obtenerConexion();

    http_response_code(200);
    echo json_encode(['estado' => 'exito', 'data' => obtenerMediosPago($pdo)]);
} catch (PDOException $error) {
    http_response_code(500);
    echo json_encode(['estado' => 'error', 'mensaje' => 'No se pudieron consultar los medios de pago.']);
}
