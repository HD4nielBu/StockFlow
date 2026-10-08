package com.stockflow.category.domain.exception;

public class CodigoCategoriaDuplicadoException extends RuntimeException {

    public CodigoCategoriaDuplicadoException(String codigo) {
        super("Ya existe una categoría con el código: " + codigo);
    }
}
