<?php
require_once __DIR__ . '/../config/conexion.php';
require_once __DIR__ . '/../models/Cine.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Método no permitido.']);
    exit;
}

try {
    $pdo = obtenerConexion();

    if (isset($_GET['id'])) {
        $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);

        if ($id === false) {
            http_response_code(400);
            echo json_encode(['estado' => 'error', 'mensaje' => 'El id del cine es inválido.']);
            exit;
        }

        $cine = obtenerCinePorId($pdo, $id);

        if (!$cine) {
            http_response_code(400);
            echo json_encode(['estado' => 'error', 'mensaje' => 'No existe un cine con ese id.']);
            exit;
        }

        http_response_code(200);
        echo json_encode(['estado' => 'exito', 'data' => $cine]);
        exit;
    }

    http_response_code(200);
    echo json_encode(['estado' => 'exito', 'data' => obtenerCines($pdo)]);
} catch (PDOException $error) {
    http_response_code(500);
    echo json_encode(['estado' => 'error', 'mensaje' => 'No se pudo consultar los cines.']);
}
