<?php
require_once __DIR__ . '/../config/conexion.php';
require_once __DIR__ . '/../models/Butaca.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Método no permitido.']);
    exit;
}

$funcionId = filter_var($_GET['funcion_id'] ?? null, FILTER_VALIDATE_INT);

if ($funcionId === false || $funcionId === null) {
    http_response_code(400);
    echo json_encode(['estado' => 'error', 'mensaje' => 'El parámetro funcion_id es obligatorio y debe ser numérico.']);
    exit;
}

try {
    $pdo = obtenerConexion();

    $resultado = obtenerButacasPorFuncion($pdo, $funcionId);

    if (!$resultado) {
        http_response_code(400);
        echo json_encode(['estado' => 'error', 'mensaje' => 'No existe una función con ese id.']);
        exit;
    }

    http_response_code(200);
    echo json_encode(['estado' => 'exito', 'data' => $resultado]);
} catch (PDOException $error) {
    http_response_code(500);
    echo json_encode(['estado' => 'error', 'mensaje' => 'No se pudo consultar el estado de las butacas.']);
}
