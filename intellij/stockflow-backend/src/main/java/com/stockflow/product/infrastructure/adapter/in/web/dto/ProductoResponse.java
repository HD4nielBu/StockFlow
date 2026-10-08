package com.stockflow.product.infrastructure.adapter.in.web.dto;

import com.stockflow.product.domain.model.UnidadMedida;

import java.math.BigDecimal;

public record ProductoResponse(
        Long id,
        Long categoriaId,
        String codigo,
        String nombre,
        String descripcion,
        UnidadMedida unidadMedida,
        int stockMinimoDefault,
        BigDecimal precioReferencial,
        boolean activo
) {}
