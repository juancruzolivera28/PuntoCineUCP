<?php

function obtenerMediosPago(PDO $pdo): array {
    $consulta = $pdo->query('SELECT id, codigo, nombre FROM medios_pago ORDER BY id');
    return $consulta->fetchAll();
}

function obtenerMedioPagoPorCodigo(PDO $pdo, string $codigo): ?array {
    $consulta = $pdo->prepare('SELECT id, codigo, nombre FROM medios_pago WHERE codigo = :codigo');
    $consulta->execute([':codigo' => $codigo]);
    $medioPago = $consulta->fetch();

    return $medioPago ?: null;
}
