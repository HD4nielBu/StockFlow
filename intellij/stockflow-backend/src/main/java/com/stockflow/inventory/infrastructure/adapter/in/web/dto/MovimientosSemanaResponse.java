package com.stockflow.inventory.infrastructure.adapter.in.web.dto;

import java.time.LocalDate;

public record MovimientosSemanaResponse(LocalDate semana, long entradas, long salidas) {}
