package com.stockflow.product.domain.port.in;

import com.stockflow.product.domain.model.Producto;

/** Port IN: reemplazar los datos editables de un producto existente (PUT). */
public interface ActualizarProductoUseCase {

    /** El id llega por separado: la identidad la decide la ruta, no el cuerpo. */
    Producto actualizar(Long id, Producto cambios);
}
