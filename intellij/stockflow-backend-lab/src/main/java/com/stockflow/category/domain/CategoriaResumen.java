package com.stockflow.category.domain;

/** Record: dato simple e inmutable para mostrar un resumen de la categoría. */
public record CategoriaResumen(
        Long id,
        String codigo,
        String nombre,
        int totalProductos,
        long productosActivos
) {}
