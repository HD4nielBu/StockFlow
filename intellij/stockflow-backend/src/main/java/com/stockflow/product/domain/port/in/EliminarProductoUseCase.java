package com.stockflow.product.domain.port.in;

/** Port IN: eliminar un producto que todavía no tiene stock ni movimientos (DELETE). */
public interface EliminarProductoUseCase {

    void eliminar(Long id);
}
