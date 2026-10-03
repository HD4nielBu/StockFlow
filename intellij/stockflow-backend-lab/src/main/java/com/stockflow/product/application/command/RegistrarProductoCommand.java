package com.stockflow.product.application.command;

import com.stockflow.product.domain.UnidadMedida;

import java.math.BigDecimal;

/**
 * Datos que necesita la operación "registrar producto" (RF-05).
 * No incluye id (lo genera el sistema) ni activo (arranca en true).
 */
public record RegistrarProductoCommand(
        Long categoriaId,
        String codigo,
        String nombre,
        UnidadMedida unidadMedida,
        int stockMinimoDefault,
        BigDecimal precioReferencial
) {}
