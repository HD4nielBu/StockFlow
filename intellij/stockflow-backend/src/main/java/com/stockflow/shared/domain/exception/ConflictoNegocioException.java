package com.stockflow.shared.domain.exception;

/** Base para duplicados / conflictos con datos existentes -> HTTP 409. */
public abstract class ConflictoNegocioException extends RuntimeException {

    protected ConflictoNegocioException(String message) {
        super(message);
    }
}
