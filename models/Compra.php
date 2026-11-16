<?php

class ButacaNoDisponibleException extends RuntimeException {
}

function crearCompra(PDO $pdo, array $datos): array {
    $pdo->beginTransaction();

    try {
        $consultaFuncion = $pdo->prepare('SELECT sala_id, precio FROM funciones WHERE id = :funcion_id');
        $consultaFuncion->execute([':funcion_id' => $datos['funcion_id']]);
        $funcion = $consultaFuncion->fetch();

        if (!$funcion) {
            throw new InvalidArgumentException('La función indicada no existe.');
        }

        $consultaButaca = $pdo->prepare('SELECT id FROM butacas WHERE id = :id AND sala_id = :sala_id');
        $consultaVenta = $pdo->prepare(
            'SELECT id FROM compra_butacas WHERE funcion_id = :funcion_id AND butaca_id = :butaca_id FOR UPDATE'
        );

        foreach ($datos['butaca_ids'] as $butacaId) {
            $consultaButaca->execute([':id' => $butacaId, ':sala_id' => $funcion['sala_id']]);
            if (!$consultaButaca->fetch()) {
                throw new InvalidArgumentException('Una de las butacas indicadas no pertenece a la sala de la función.');
            }

            $consultaVenta->execute([':funcion_id' => $datos['funcion_id'], ':butaca_id' => $butacaId]);
            if ($consultaVenta->fetch()) {
                throw new ButacaNoDisponibleException('Una de las butacas seleccionadas ya fue vendida para esta función.');
            }
        }

        $precioUnitario = (float) $funcion['precio'];
        $total = $precioUnitario * count($datos['butaca_ids']);

        $insertarCompra = $pdo->prepare(
            'INSERT INTO compras (nombre, direccion, telefono, email, medio_pago_id, usuario_id, total) ' .
            'VALUES (:nombre, :direccion, :telefono, :email, :medio_pago_id, :usuario_id, :total)'
        );
        $insertarCompra->execute([
            ':nombre' => $datos['nombre'],
            ':direccion' => $datos['direccion'],
            ':telefono' => $datos['telefono'],
            ':email' => $datos['email'],
            ':medio_pago_id' => $datos['medio_pago_id'],
            ':usuario_id' => $datos['usuario_id'],
            ':total' => $total,
        ]);

        $compraId = (int) $pdo->lastInsertId();

        $insertarButaca = $pdo->prepare(
            'INSERT INTO compra_butacas (compra_id, funcion_id, butaca_id, precio) ' .
            'VALUES (:compra_id, :funcion_id, :butaca_id, :precio)'
        );

        foreach ($datos['butaca_ids'] as $butacaId) {
            $insertarButaca->execute([
                ':compra_id' => $compraId,
                ':funcion_id' => $datos['funcion_id'],
                ':butaca_id' => $butacaId,
                ':precio' => $precioUnitario,
            ]);
        }

        $pdo->commit();

        return ['id' => $compraId, 'total' => $total];
    } catch (Throwable $error) {
        $pdo->rollBack();
        throw $error;
    }
}
