package com.stockflow.location.infrastructure.adapter.in.web.dto;

import com.stockflow.location.domain.model.TipoUbicacion;

public record UbicacionResponse(
        Long id,
        String codigo,
        String nombre,
        TipoUbicacion tipo,
        String direccion,
        boolean activo
) {}
