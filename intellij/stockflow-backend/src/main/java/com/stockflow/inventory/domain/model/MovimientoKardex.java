package com.stockflow.inventory.domain.model;

import java.math.BigDecimal;
import java.time.Instant;

/** Una línea del kardex (RF-19): un movimiento con su entrada, salida y saldo resultante. */
public record MovimientoKardex(
        Long movimientoId,
        Instant ocurridoAt,
        String ubicacion,
        String tipo,
        BigDecimal entrada,
        BigDecimal salida,
        BigDecimal saldoResultante,
        String referenciaTipo,
        String registradoPor,
        String motivo
) {}
