package com.stockflow.inventory.domain.port.in;

import com.stockflow.inventory.domain.model.Existencia;
import com.stockflow.inventory.domain.model.MovimientoKardex;
import com.stockflow.inventory.domain.model.MovimientosSemana;
import com.stockflow.inventory.domain.model.Pagina;

import java.time.Instant;
import java.util.List;

/** Port IN: consultas del inventario (lado de lectura del flujo crítico). */
public interface ConsultarInventarioUseCase {

    /** productoId y ubicacionId son filtros opcionales (null = sin filtro). RF-08 / RF-20. */
    List<Existencia> consultarStock(Long productoId, Long ubicacionId, boolean soloBajoMinimo);

    /**
     * Kardex paginado de un producto, en orden cronológico (RF-19). pagina empieza en 0.
     * desde (inclusive) y hasta (exclusive) son filtros opcionales por fecha del movimiento (null = sin límite).
     */
    Pagina<MovimientoKardex> consultarKardex(Long productoId, Instant desde, Instant hasta, int pagina, int tamano);

    /**
     * Entradas y salidas de las últimas {@code semanas} semanas, de la más antigua a la actual (incluye semanas sin
     * movimientos). zona: id IANA (p. ej. America/La_Paz) que decide dónde empieza cada lunes.
     */
    List<MovimientosSemana> resumenSemanal(int semanas, String zona);
}
