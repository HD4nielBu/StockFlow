package com.stockflow.product.domain.exception;

import com.stockflow.shared.domain.exception.RecursoNoEncontradoException;

public class ProductoNoEncontradoException extends RecursoNoEncontradoException {

    public ProductoNoEncontradoException(Long id) {
        super("No existe el producto con id: " + id);
    }
}
