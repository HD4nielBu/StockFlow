package com.stockflow.inventory.application.service;

import com.stockflow.shared.domain.exception.DatoInvalidoException;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertThrows;

/** Validación del rango de fechas del kardex: se rechaza ANTES de tocar los puertos (por eso van en null). */
class InventarioConsultaServiceTest {

    private final InventarioConsultaService service = new InventarioConsultaService(null, null, null);

    @Test
    void rechazaUnRangoDeFechasInvertido() {
        var desde = Instant.parse("2026-10-20T04:00:00Z");
        var hasta = Instant.parse("2026-10-01T04:00:00Z");
        assertThrows(DatoInvalidoException.class, () -> service.consultarKardex(1L, desde, hasta, 0, 20));
    }

    @Test
    void rechazaUnRangoVacio() {
        var instante = Instant.parse("2026-10-20T04:00:00Z");
        assertThrows(DatoInvalidoException.class, () -> service.consultarKardex(1L, instante, instante, 0, 20));
    }

    @Test
    void resumenSemanalRechazaSemanasFueraDeRango() {
        assertThrows(DatoInvalidoException.class, () -> service.resumenSemanal(0, "UTC"));
        assertThrows(DatoInvalidoException.class, () -> service.resumenSemanal(53, "UTC"));
    }

    @Test
    void resumenSemanalSoloAceptaZonasIana() {
        assertThrows(DatoInvalidoException.class, () -> service.resumenSemanal(8, "Marte/Olympus"));
        // Un desfase fijo se rechaza: PostgreSQL lo leería con el signo invertido
        assertThrows(DatoInvalidoException.class, () -> service.resumenSemanal(8, "+05:00"));
    }
}
