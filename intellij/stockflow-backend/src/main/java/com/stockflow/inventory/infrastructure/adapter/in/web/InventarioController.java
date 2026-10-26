package com.stockflow.inventory.infrastructure.adapter.in.web;

import com.stockflow.inventory.domain.port.in.ConsultarInventarioUseCase;
import com.stockflow.inventory.infrastructure.adapter.in.web.dto.ExistenciaResponse;
import com.stockflow.inventory.infrastructure.adapter.in.web.dto.MovimientoKardexResponse;
import com.stockflow.inventory.infrastructure.adapter.in.web.dto.MovimientosSemanaResponse;
import com.stockflow.inventory.infrastructure.adapter.in.web.dto.PaginaResponse;
import com.stockflow.inventory.infrastructure.adapter.in.web.mapper.InventarioWebMapper;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

/** Adapter IN del módulo inventory: sólo lectura (no existe PUT de stock, RN-01). */
@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    private final ConsultarInventarioUseCase consultar;

    public InventarioController(ConsultarInventarioUseCase consultar) {
        this.consultar = consultar;
    }

    /**
     * Existencias por producto/ubicación. Filtros opcionales: ?productoId=1&ubicacionId=2&soloBajoMinimo=true.
     * soloBajoMinimo=true lista las existencias en o bajo su mínimo (RF-20). 200 / 400 / 404.
     */
    @GetMapping("/stock")
    public List<ExistenciaResponse> stock(@RequestParam(required = false) Long productoId,
                                          @RequestParam(required = false) Long ubicacionId,
                                          @RequestParam(defaultValue = "false") boolean soloBajoMinimo) {
        return consultar.consultarStock(productoId, ubicacionId, soloBajoMinimo).stream()
                .map(InventarioWebMapper::toResponse)
                .toList();
    }

    /**
     * Kardex paginado de un producto (RF-19): ?pagina=0&tamano=20. 200 / 400 / 404 / 422.
     * Filtro de fechas opcional en ISO-8601 con zona: ?desde=2026-10-01T04:00:00Z&hasta=2026-10-21T04:00:00Z
     * (desde inclusive, hasta exclusive). Instantes y no fechas: el cliente decide en qué zona empieza "su" día.
     */
    @GetMapping("/kardex/{productoId}")
    public PaginaResponse<MovimientoKardexResponse> kardex(@PathVariable Long productoId,
                                                           @RequestParam(required = false)
                                                           @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant desde,
                                                           @RequestParam(required = false)
                                                           @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant hasta,
                                                           @RequestParam(defaultValue = "0") int pagina,
                                                           @RequestParam(defaultValue = "20") int tamano) {
        return InventarioWebMapper.toResponse(consultar.consultarKardex(productoId, desde, hasta, pagina, tamano));
    }

    /**
     * Movimientos de entrada y salida por semana para el dashboard: ?semanas=8&zona=America/La_Paz. 200 / 422.
     * Cuenta movimientos (no unidades: los productos tienen unidades distintas). Incluye las semanas en 0.
     */
    @GetMapping("/movimientos/semanal")
    public List<MovimientosSemanaResponse> movimientosSemanales(@RequestParam(defaultValue = "8") int semanas,
                                                                @RequestParam(defaultValue = "UTC") String zona) {
        return consultar.resumenSemanal(semanas, zona).stream()
                .map(InventarioWebMapper::toResponse)
                .toList();
    }
}
