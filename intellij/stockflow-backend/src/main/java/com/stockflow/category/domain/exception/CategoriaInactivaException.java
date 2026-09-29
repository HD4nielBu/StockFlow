package com.stockflow.category.domain.exception;

import com.stockflow.shared.domain.exception.ReglaNegocioException;

public class CategoriaInactivaException extends ReglaNegocioException {

    public CategoriaInactivaException(Long id) {
        super("La categoría con id " + id + " está inactiva y no admite nuevos productos");
    }
}
