<?php

function buscarUsuarioPorEmail(PDO $pdo, string $email): ?array {
    $consulta = $pdo->prepare('SELECT id, nombre, email, password, rol FROM usuarios WHERE email = :email');
    $consulta->execute([':email' => $email]);
    $usuario = $consulta->fetch();

    return $usuario ?: null;
}

function buscarUsuarioPorId(PDO $pdo, int $id): ?array {
    $consulta = $pdo->prepare('SELECT id, nombre, email, rol FROM usuarios WHERE id = :id');
    $consulta->execute([':id' => $id]);
    $usuario = $consulta->fetch();

    return $usuario ?: null;
}

function crearUsuario(PDO $pdo, string $nombre, string $email, string $hash): void {
    $consulta = $pdo->prepare('INSERT INTO usuarios (nombre, email, password) VALUES (:nombre, :email, :password)');
    $consulta->execute([
        ':nombre' => $nombre,
        ':email' => $email,
        ':password' => $hash,
    ]);
}
