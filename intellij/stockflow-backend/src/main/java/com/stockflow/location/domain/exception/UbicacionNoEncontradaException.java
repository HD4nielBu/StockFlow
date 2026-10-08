package com.stockflow.location.domain.exception;

import com.stockflow.shared.domain.exception.RecursoNoEncontradoException;

public class UbicacionNoEncontradaException extends RecursoNoEncontradoException {

    public UbicacionNoEncontradaException(Long id) {
        super("No existe la ubicación con id: " + id);
    }
}
