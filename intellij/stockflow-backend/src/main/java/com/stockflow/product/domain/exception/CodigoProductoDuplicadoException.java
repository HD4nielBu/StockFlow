package com.stockflow.product.domain.exception;

import com.stockflow.shared.domain.exception.ConflictoNegocioException;

public class CodigoProductoDuplicadoException extends ConflictoNegocioException {

    public CodigoProductoDuplicadoException(String codigo) {
        super("RN-06: ya existe un producto con el código " + codigo);
    }
}
