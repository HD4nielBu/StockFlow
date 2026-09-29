package com.stockflow.category.domain.exception;

public class CategoriaNoEncontradaException extends RuntimeException {

    public CategoriaNoEncontradaException(Long id) {
        super("No existe la categoría con id: " + id);
    }
}
