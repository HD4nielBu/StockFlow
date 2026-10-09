package com.stockflow.product.domain.exception;

import com.stockflow.shared.domain.exception.ConflictoNegocioException;

public class ProductoEnUsoException extends ConflictoNegocioException {

    public ProductoEnUsoException(Long id) {
        super("RN-01: el producto con id " + id + " tiene stock, movimientos o solicitudes y no se puede "
                + "eliminar; desactívalo con PUT (activo = false)");
    }
}
