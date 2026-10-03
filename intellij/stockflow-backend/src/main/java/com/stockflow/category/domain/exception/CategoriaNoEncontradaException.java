package com.stockflow.category.domain.exception;

import com.stockflow.shared.domain.exception.RecursoNoEncontradoException;

public class CategoriaNoEncontradaException extends RecursoNoEncontradoException {

    public CategoriaNoEncontradaException(Long id) {
        super("No existe la categoría con id: " + id);
    }
}
