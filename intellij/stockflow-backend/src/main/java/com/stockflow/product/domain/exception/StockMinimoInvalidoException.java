package com.stockflow.product.domain.exception;

import com.stockflow.shared.domain.exception.ReglaNegocioException;

public class StockMinimoInvalidoException extends ReglaNegocioException {

    public StockMinimoInvalidoException(int valor) {
        super("RN-07: el stock mínimo no puede ser negativo. Valor recibido: " + valor);
    }
}
