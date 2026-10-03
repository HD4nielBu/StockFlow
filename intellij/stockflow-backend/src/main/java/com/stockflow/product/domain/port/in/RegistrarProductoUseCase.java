package com.stockflow.product.domain.port.in;

import com.stockflow.product.domain.model.Producto;

/** Port IN: registrar un producto del catálogo (RF-05). */
public interface RegistrarProductoUseCase {

    Producto registrar(Producto producto);
}
