package com.stockflow.category.infrastructure.adapter.in.web.mapper;

import com.stockflow.category.domain.model.Categoria;
import com.stockflow.category.infrastructure.adapter.in.web.dto.ActualizarCategoriaRequest;
import com.stockflow.category.infrastructure.adapter.in.web.dto.CategoriaDemoResponse;
import com.stockflow.category.infrastructure.adapter.in.web.dto.CategoriaResponse;
import com.stockflow.category.infrastructure.adapter.in.web.dto.CrearCategoriaRequest;

public final class CategoriaWebMapper {

    private CategoriaWebMapper() {
    }

    public static Categoria toDomain(CrearCategoriaRequest request) {
        return Categoria.nueva(request.codigo(), request.nombre(), request.descripcion());
    }

    /** Sin id: el caso de uso lo toma de la ruta. */
    public static Categoria toDomain(ActualizarCategoriaRequest request) {
        return new Categoria(null, request.codigo(), request.nombre(), request.descripcion(),
                request.activo());
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

    public static CategoriaDemoResponse toDemoResponse(Categoria categoria) {
        return new CategoriaDemoResponse(
                categoria.getId(),
                categoria.getCodigo(),
                categoria.getNombre(),
                categoria.getDescripcion()
        );
    }
}
