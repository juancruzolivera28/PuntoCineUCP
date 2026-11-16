<?php
require_once __DIR__ . '/../config/conexion.php';
require_once __DIR__ . '/../models/MedioPago.php';
require_once __DIR__ . '/../models/Compra.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Método no permitido.']);
    exit;
}

$cuerpo = json_decode(file_get_contents('php://input'), true) ?? [];

$nombre = trim($cuerpo['nombre'] ?? '');
$direccion = trim($cuerpo['direccion'] ?? '');
$telefono = trim($cuerpo['telefono'] ?? '');
$email = trim($cuerpo['email'] ?? '');
$medioPagoCodigo = trim($cuerpo['medio_pago'] ?? '');
$funcionId = filter_var($cuerpo['funcion_id'] ?? null, FILTER_VALIDATE_INT);
$butacaIds = $cuerpo['butacas'] ?? null;

if ($nombre === '' || $direccion === '' || $telefono === '' || $email === '' || $medioPagoCodigo === '' || $funcionId === false || $funcionId === null) {
    http_response_code(400);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Nombre, dirección, teléfono, email, medio de pago y función son obligatorios.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['estado' => 'error', 'mensaje' => 'El email no es válido.']);
    exit;
}

if (!is_array($butacaIds) || count($butacaIds) === 0) {
    http_response_code(400);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Debe seleccionar al menos una butaca.']);
    exit;
}

$butacaIdsValidadas = [];
foreach ($butacaIds as $butacaId) {
    $butacaIdValidada = filter_var($butacaId, FILTER_VALIDATE_INT);
    if ($butacaIdValidada === false) {
        http_response_code(400);
        echo json_encode(['estado' => 'error', 'mensaje' => 'Las butacas indicadas son inválidas.']);
        exit;
    }
    $butacaIdsValidadas[] = $butacaIdValidada;
}

session_start();
$usuarioId = $_SESSION['usuario_id'] ?? null;

try {
    $pdo = obtenerConexion();

    $medioPago = obtenerMedioPagoPorCodigo($pdo, $medioPagoCodigo);

    if (!$medioPago) {
        http_response_code(400);
        echo json_encode(['estado' => 'error', 'mensaje' => 'El medio de pago indicado no existe.']);
        exit;
    }

    $compra = crearCompra($pdo, [
        'nombre' => $nombre,
        'direccion' => $direccion,
        'telefono' => $telefono,
        'email' => $email,
        'medio_pago_id' => $medioPago['id'],
        'usuario_id' => $usuarioId,
        'funcion_id' => $funcionId,
        'butaca_ids' => $butacaIdsValidadas,
    ]);

    http_response_code(201);
    echo json_encode([
        'estado' => 'exito',
        'mensaje' => 'Compra confirmada.',
        'data' => $compra,
    ]);
} catch (InvalidArgumentException $error) {
    http_response_code(400);
    echo json_encode(['estado' => 'error', 'mensaje' => $error->getMessage()]);
} catch (ButacaNoDisponibleException $error) {
    http_response_code(400);
    echo json_encode(['estado' => 'error', 'mensaje' => $error->getMessage()]);
} catch (PDOException $error) {
    http_response_code(500);
    echo json_encode(['estado' => 'error', 'mensaje' => 'No se pudo registrar la compra.']);
}
