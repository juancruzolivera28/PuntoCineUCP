-- Base de datos y tabla de usuarios para la autenticación de PuntoCine

CREATE DATABASE IF NOT EXISTS puntocine
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE puntocine;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, -- hash BCRYPT, nunca texto plano
  rol VARCHAR(20) NOT NULL DEFAULT 'cliente',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
