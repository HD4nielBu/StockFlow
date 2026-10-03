package com.stockflow.product.infrastructure.adapter.out.persistence.mapper;

import com.stockflow.category.infrastructure.adapter.out.persistence.entity.CategoriaJpaEntity;
import com.stockflow.product.domain.model.Producto;
import com.stockflow.product.infrastructure.adapter.out.persistence.entity.ProductoJpaEntity;

public final class ProductoPersistenceMapper {

    private ProductoPersistenceMapper() {
    }

    public static ProductoJpaEntity toJpa(Producto domain, CategoriaJpaEntity categoriaRef) {
        return new ProductoJpaEntity(
                domain.getId(),
                categoriaRef,
                domain.getCodigo(),
                domain.getNombre(),
                domain.getDescripcion(),
                domain.getUnidadMedida(),
                domain.getStockMinimoDefault(),
                domain.getPrecioReferencial(),
                domain.isActivo()
        );
    }

    /** La entidad JPA tiene el objeto padre; el dominio sólo conserva su id. */
    public static Producto toDomain(ProductoJpaEntity e) {
        return new Producto(
                e.getId(),
                e.getCategoria().getId(),
                e.getCodigo(),
                e.getNombre(),
                e.getDescripcion(),
                e.getUnidadMedida(),
                e.getStockMinimoDefault(),
                e.getPrecioReferencial(),
                e.isActivo()
        );
    }
}
