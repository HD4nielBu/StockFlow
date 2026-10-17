package com.stockflow.inventory.infrastructure.adapter.in.web.dto;

import java.util.List;

/** Contrato estable de paginación para web y móvil (no se serializa Page de Spring directamente). */
public record PaginaResponse<T>(
        List<T> contenido,
        int pagina,
        int tamano,
        long totalElementos,
        int totalPaginas
) {}
