package com.stockflow.product.infrastructure.adapter.in.web.mapper;

import com.stockflow.product.domain.model.Producto;
import com.stockflow.product.infrastructure.adapter.in.web.dto.ActualizarProductoRequest;
import com.stockflow.product.infrastructure.adapter.in.web.dto.CrearProductoRequest;
import com.stockflow.product.infrastructure.adapter.in.web.dto.ProductoResponse;

public final class ProductoWebMapper {

    private ProductoWebMapper() {
    }

    public static Producto toDomain(CrearProductoRequest request) {
        return Producto.nuevo(
                request.categoriaId(),
                request.codigo(),
                request.nombre(),
                request.descripcion(),
                request.unidadMedida(),
                request.stockMinimoDefault(),
                request.precioReferencial()
        );
    }

    /** Sin id: el caso de uso lo toma de la ruta. */
    public static Producto toDomain(ActualizarProductoRequest request) {
        return new Producto(
                null,
                request.categoriaId(),
                request.codigo(),
                request.nombre(),
                request.descripcion(),
                request.unidadMedida(),
                request.stockMinimoDefault(),
                request.precioReferencial(),
                request.activo()
        );
    }

    public static ProductoResponse toResponse(Producto producto) {
        return new ProductoResponse(
                producto.getId(),
                producto.getCategoriaId(),
                producto.getCodigo(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getUnidadMedida(),
                producto.getStockMinimoDefault(),
                producto.getPrecioReferencial(),
                producto.isActivo()
        );
    }
}
