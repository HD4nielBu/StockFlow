package com.stockflow.inventory.infrastructure.adapter.in.web;

import com.stockflow.inventory.domain.port.in.ConsultarInventarioUseCase;
import com.stockflow.inventory.infrastructure.adapter.in.web.dto.ExistenciaResponse;
import com.stockflow.inventory.infrastructure.adapter.in.web.dto.MovimientoKardexResponse;
import com.stockflow.inventory.infrastructure.adapter.in.web.dto.PaginaResponse;
import com.stockflow.inventory.infrastructure.adapter.in.web.mapper.InventarioWebMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    /** Kardex paginado de un producto (RF-19): ?pagina=0&tamano=20. 200 / 400 / 404 / 422. */
    @GetMapping("/kardex/{productoId}")
    public PaginaResponse<MovimientoKardexResponse> kardex(@PathVariable Long productoId,
                                                           @RequestParam(defaultValue = "0") int pagina,
                                                           @RequestParam(defaultValue = "20") int tamano) {
        return InventarioWebMapper.toResponse(consultar.consultarKardex(productoId, pagina, tamano));
    }
}
