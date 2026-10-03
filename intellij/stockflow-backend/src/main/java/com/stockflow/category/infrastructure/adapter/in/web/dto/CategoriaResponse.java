package com.stockflow.category.infrastructure.adapter.in.web.dto;

/** Lo que la API expone. Incluye id y activo, que no se reciben al crear. */
public record CategoriaResponse(
        Long id,
        String codigo,
        String nombre,
        String descripcion,
        boolean activo
) {}
