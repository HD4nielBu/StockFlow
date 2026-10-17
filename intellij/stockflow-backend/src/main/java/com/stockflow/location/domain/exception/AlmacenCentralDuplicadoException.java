package com.stockflow.location.domain.exception;

import com.stockflow.shared.domain.exception.ConflictoNegocioException;

public class AlmacenCentralDuplicadoException extends ConflictoNegocioException {

    public AlmacenCentralDuplicadoException() {
        super("Ya existe un almacén central activo: la empresa opera con un único almacén central");
    }
}
