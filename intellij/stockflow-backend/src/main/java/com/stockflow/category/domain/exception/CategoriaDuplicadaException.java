package com.stockflow.category.domain.exception;

import com.stockflow.shared.domain.exception.ConflictoNegocioException;

public class CategoriaDuplicadaException extends ConflictoNegocioException {

    public CategoriaDuplicadaException(String valor) {
        super("Ya existe una categoría con el valor: " + valor);
    }
}
