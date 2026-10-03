package com.stockflow.category.domain.exception;

import com.stockflow.shared.domain.exception.ConflictoNegocioException;

public class CategoriaConProductosException extends ConflictoNegocioException {

    public CategoriaConProductosException(Long id) {
        super("La categoría con id " + id + " tiene productos asociados y no se puede eliminar; "
                + "desactívala con PUT (activo = false)");
    }
}
