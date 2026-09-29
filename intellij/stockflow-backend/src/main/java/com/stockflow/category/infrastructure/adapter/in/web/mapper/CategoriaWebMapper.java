package com.stockflow.category.infrastructure.adapter.in.web.mapper;

import com.stockflow.category.domain.model.Categoria;
import com.stockflow.category.infrastructure.adapter.in.web.dto.CategoriaResponse;
import com.stockflow.category.infrastructure.adapter.in.web.dto.CrearCategoriaRequest;

public final class CategoriaWebMapper {

    private CategoriaWebMapper() {
    }

    public static Categoria toDomain(CrearCategoriaRequest request) {
        return Categoria.nueva(request.codigo(), request.nombre(), request.descripcion());
    }

    public static CategoriaResponse toResponse(Categoria categoria) {
        return new CategoriaResponse(
                categoria.getId(),
                categoria.getCodigo(),
                categoria.getNombre(),
                categoria.getDescripcion(),
                categoria.isActivo()
        );
    }
}
