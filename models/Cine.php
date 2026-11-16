<?php

function obtenerCines(PDO $pdo): array {
    $consulta = $pdo->query('SELECT id, slug, nombre, zona, direccion, horario_boleteria FROM cines ORDER BY nombre');
    return $consulta->fetchAll();
}

function obtenerCinePorId(PDO $pdo, int $id): ?array {
    $consulta = $pdo->prepare('SELECT id, slug, nombre, zona, direccion, horario_boleteria, mapa_query FROM cines WHERE id = :id');
    $consulta->execute([':id' => $id]);
    $cine = $consulta->fetch();

    if (!$cine) {
        return null;
    }

    $consultaSalas = $pdo->prepare('SELECT id, nombre, filas, columnas FROM salas WHERE cine_id = :cine_id ORDER BY nombre');
    $consultaSalas->execute([':cine_id' => $id]);
    $cine['salas'] = $consultaSalas->fetchAll();

    return $cine;
}
