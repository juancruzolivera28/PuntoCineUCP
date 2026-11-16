<?php

function obtenerConexion(): PDO {
    $host = 'localhost';
    $baseDatos = 'puntocine';
    $usuario = 'root';
    $password = '';
    $dsn = "mysql:host=$host;dbname=$baseDatos;charset=utf8mb4";

    return new PDO($dsn, $usuario, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
}
