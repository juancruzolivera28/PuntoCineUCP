<?php

function obtenerFuncionesPorPelicula(PDO $pdo, int $peliculaId): array {
    $consulta = $pdo->prepare(
        'SELECT f.id, f.horario, f.precio, s.id AS sala_id, s.nombre AS sala_nombre, ' .
        'c.id AS cine_id, c.slug AS cine_slug, c.nombre AS cine_nombre ' .
        'FROM funciones f ' .
        'JOIN salas s ON s.id = f.sala_id ' .
        'JOIN cines c ON c.id = s.cine_id ' .
        'WHERE f.pelicula_id = :pelicula_id ' .
        'ORDER BY c.nombre, f.horario'
    );
    $consulta->execute([':pelicula_id' => $peliculaId]);
    return $consulta->fetchAll();
}

function obtenerPeliculas(PDO $pdo): array {
    $consulta = $pdo->query(
        'SELECT id, slug, titulo, genero, duracion_min, clasificacion, poster_url FROM peliculas ORDER BY titulo'
    );
    $peliculas = $consulta->fetchAll();

    foreach ($peliculas as &$pelicula) {
        $pelicula['funciones'] = obtenerFuncionesPorPelicula($pdo, (int) $pelicula['id']);
    }

    return $peliculas;
}

function obtenerPeliculaPorId(PDO $pdo, int $id): ?array {
    $consulta = $pdo->prepare(
        'SELECT id, slug, titulo, genero, duracion_min, clasificacion, sinopsis, director, elenco, idioma, poster_url ' .
        'FROM peliculas WHERE id = :id'
    );
    $consulta->execute([':id' => $id]);
    $pelicula = $consulta->fetch();

    if (!$pelicula) {
        return null;
    }

    $pelicula['funciones'] = obtenerFuncionesPorPelicula($pdo, $id);

    return $pelicula;
}
