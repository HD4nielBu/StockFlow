package com.stockflow.shared.domain.exception;

/** Base para reglas de negocio violadas -> HTTP 422. */
public abstract class ReglaNegocioException extends RuntimeException {

    protected ReglaNegocioException(String message) {
        super(message);
    }
}
