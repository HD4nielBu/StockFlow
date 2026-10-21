package com.stockflow.inventory.domain.model;

import java.time.LocalDate;

/** Cantidad de movimientos de entrada y salida de una semana (lunes = semana). Cuenta movimientos, no unidades. */
public record MovimientosSemana(LocalDate semana, long entradas, long salidas) {}
