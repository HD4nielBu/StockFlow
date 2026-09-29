package com.stockflow.category.domain.exception;

public class CodigoProductoRepetidoEnCategoriaException extends RuntimeException {

    public CodigoProductoRepetidoEnCategoriaException(String codigoProducto) {
        super("RN-06: la categoría ya tiene un producto con el código: " + codigoProducto);
    }
}
