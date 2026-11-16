<?php

function obtenerFuncionConSala(PDO $pdo, int $funcionId): ?array {
    $consulta = $pdo->prepare(
        'SELECT f.id, f.horario, f.precio, s.id AS sala_id, s.nombre AS sala_nombre, ' .
        'p.id AS pelicula_id, p.titulo AS pelicula_titulo, ' .
        'c.id AS cine_id, c.nombre AS cine_nombre ' .
        'FROM funciones f ' .
        'JOIN salas s ON s.id = f.sala_id ' .
        'JOIN cines c ON c.id = s.cine_id ' .
        'JOIN peliculas p ON p.id = f.pelicula_id ' .
        'WHERE f.id = :funcion_id'
    );
    $consulta->execute([':funcion_id' => $funcionId]);
    $funcion = $consulta->fetch();

    return $funcion ?: null;
}

function obtenerButacasPorFuncion(PDO $pdo, int $funcionId): ?array {
    $funcion = obtenerFuncionConSala($pdo, $funcionId);

    if (!$funcion) {
        return null;
    }

    $consulta = $pdo->prepare(
        'SELECT b.id, b.fila, b.numero, b.codigo, ' .
        'CASE WHEN cb.id IS NULL THEN "libre" ELSE "ocupada" END AS estado ' .
        'FROM butacas b ' .
        'LEFT JOIN compra_butacas cb ON cb.butaca_id = b.id AND cb.funcion_id = :funcion_id ' .
        'WHERE b.sala_id = :sala_id ' .
        'ORDER BY b.fila, b.numero'
    );
    $consulta->execute([
        ':funcion_id' => $funcionId,
        ':sala_id' => $funcion['sala_id'],
    ]);

    return [
        'funcion' => $funcion,
        'butacas' => $consulta->fetchAll(),
    ];
}
