package com.stockflow.inventory.infrastructure.adapter.in.web.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record MovimientoKardexResponse(
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
