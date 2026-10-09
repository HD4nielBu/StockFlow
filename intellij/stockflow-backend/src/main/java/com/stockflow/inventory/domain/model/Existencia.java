package com.stockflow.inventory.domain.model;

import java.math.BigDecimal;

/**
 * Existencia de un producto en una ubicación (fila de stock) con los datos que la hacen legible.
 * Es un modelo de lectura: el stock nunca se edita directamente (RN-01), sólo se consulta.
 */
public record Existencia(
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
