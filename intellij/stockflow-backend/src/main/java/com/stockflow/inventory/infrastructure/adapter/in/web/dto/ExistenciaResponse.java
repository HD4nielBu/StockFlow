package com.stockflow.inventory.infrastructure.adapter.in.web.dto;

import java.math.BigDecimal;

public record ExistenciaResponse(
        Long stockId,
        Long productoId,
        String codigoProducto,
        String producto,
        Long ubicacionId,
        String codigoUbicacion,
        String ubicacion,
        BigDecimal cantidad,
        BigDecimal stockMinimo,
        boolean bajoMinimo
) {}
