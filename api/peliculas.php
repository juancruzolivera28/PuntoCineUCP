<?php
require_once __DIR__ . '/../config/conexion.php';
require_once __DIR__ . '/../models/Pelicula.php';

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
            echo json_encode(['estado' => 'error', 'mensaje' => 'El id de la película es inválido.']);
            exit;
        }

        $pelicula = obtenerPeliculaPorId($pdo, $id);

        if (!$pelicula) {
            http_response_code(400);
            echo json_encode(['estado' => 'error', 'mensaje' => 'No existe una película con ese id.']);
            exit;
        }

        http_response_code(200);
        echo json_encode(['estado' => 'exito', 'data' => $pelicula]);
        exit;
    }

    http_response_code(200);
    echo json_encode(['estado' => 'exito', 'data' => obtenerPeliculas($pdo)]);
} catch (PDOException $error) {
    http_response_code(500);
    echo json_encode(['estado' => 'error', 'mensaje' => 'No se pudo consultar la cartelera.']);
}
