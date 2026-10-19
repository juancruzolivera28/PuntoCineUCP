<?php
// Conexión PDO a la base puntocine (credenciales default de XAMPP: root sin password)

function obtenerConexion(): PDO {
    $host = 'localhost';
    $baseDatos = 'puntocine';
    $usuario = 'root';
    $password = '';
    $dsn = "mysql:host=$host;dbname=$baseDatos;charset=utf8mb4";

    try {
        return new PDO($dsn, $usuario, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (PDOException $e) {
        // Nunca se expone el detalle real del error de conexión
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['estado' => 'error', 'mensaje' => 'No se pudo conectar a la base de datos.']);
        exit;
    }
}
