package com.stockflow.inventory.domain.port.in;

import com.stockflow.inventory.domain.model.Existencia;
import com.stockflow.inventory.domain.model.MovimientoKardex;
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
}
