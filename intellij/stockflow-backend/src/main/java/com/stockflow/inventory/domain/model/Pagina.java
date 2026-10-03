package com.stockflow.inventory.domain.model;

import java.util.List;

/**
 * Página de resultados propia del dominio: el núcleo no depende de Page/Pageable de Spring Data.
 * El adaptador de persistencia traduce Page -> Pagina.
 */
public record Pagina<T>(
        List<T> contenido,
        int pagina,
        int tamano,
        long totalElementos,
        int totalPaginas
) {}
