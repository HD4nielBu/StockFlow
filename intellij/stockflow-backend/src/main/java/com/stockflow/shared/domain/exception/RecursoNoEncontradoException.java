package com.stockflow.shared.domain.exception;

/** Base para "no existe" -> HTTP 404. */
public abstract class RecursoNoEncontradoException extends RuntimeException {

    protected RecursoNoEncontradoException(String message) {
        super(message);
    }
}
