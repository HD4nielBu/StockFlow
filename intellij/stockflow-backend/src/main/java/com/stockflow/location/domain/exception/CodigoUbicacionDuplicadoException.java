package com.stockflow.location.domain.exception;

import com.stockflow.shared.domain.exception.ConflictoNegocioException;

public class CodigoUbicacionDuplicadoException extends ConflictoNegocioException {

    public CodigoUbicacionDuplicadoException(String codigo) {
        super("Ya existe una ubicación con el código " + codigo);
    }
}
