package com.stockflow.location.domain.port.in;

import com.stockflow.location.domain.model.Ubicacion;

/** Port IN: registrar un almacén, depósito o punto de consumo (RF-07). */
public interface RegistrarUbicacionUseCase {

    Ubicacion registrar(Ubicacion ubicacion);
}
