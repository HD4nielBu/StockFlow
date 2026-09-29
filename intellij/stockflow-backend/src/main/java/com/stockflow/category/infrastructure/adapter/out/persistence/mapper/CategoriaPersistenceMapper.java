package com.stockflow.category.infrastructure.adapter.out.persistence.mapper;

import com.stockflow.category.domain.model.Categoria;
import com.stockflow.category.infrastructure.adapter.out.persistence.entity.CategoriaJpaEntity;

public final class CategoriaPersistenceMapper {

    private CategoriaPersistenceMapper() {
    }

    public static CategoriaJpaEntity toEntity(Categoria domain) {
        return new CategoriaJpaEntity(
                domain.getId(),
                domain.getCodigo(),
                domain.getNombre(),
                domain.getDescripcion(),
                domain.isActivo()
        );
    }

    public static Categoria toDomain(CategoriaJpaEntity entity) {
        return new Categoria(
                entity.getId(),
                entity.getCodigo(),
                entity.getNombre(),
                entity.getDescripcion(),
                entity.isActivo()
        );
    }
}
