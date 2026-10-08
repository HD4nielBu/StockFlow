package com.stockflow.product.domain.exception;

public class StockMinimoInvalidoException extends RuntimeException {

    public StockMinimoInvalidoException(int valor) {
        super("El stock mínimo no puede ser negativo. Valor recibido: " + valor);
    }
}
