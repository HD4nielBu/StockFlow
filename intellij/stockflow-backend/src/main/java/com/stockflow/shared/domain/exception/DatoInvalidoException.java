package com.stockflow.shared.domain.exception;

/**
 * Un dato que llega al dominio sin cumplir sus invariantes (obligatorio vacío, valor negativo...).
 * Por HTTP normalmente lo frena antes el DTO (@Valid -> 400); si otro adaptador (job, mensaje, test)
 * llama al caso de uso saltándose el DTO, el dominio igual se protege y la API responde 422, no 500.
 * Se usa en lugar de IllegalArgumentException porque esa la lanzan también librerías y el framework,
 * y no siempre es culpa del cliente.
 */
public class DatoInvalidoException extends ReglaNegocioException {

    public DatoInvalidoException(String message) {
        super(message);
    }
}
