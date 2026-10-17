package com.stockflow.inventory.infrastructure.adapter.in.web.mapper;

import com.stockflow.inventory.domain.model.Existencia;
import com.stockflow.inventory.domain.model.MovimientoKardex;
import com.stockflow.inventory.domain.model.Pagina;
import com.stockflow.inventory.infrastructure.adapter.in.web.dto.ExistenciaResponse;
import com.stockflow.inventory.infrastructure.adapter.in.web.dto.MovimientoKardexResponse;
import com.stockflow.inventory.infrastructure.adapter.in.web.dto.PaginaResponse;

public final class InventarioWebMapper {

    private InventarioWebMapper() {
    }

    public static ExistenciaResponse toResponse(Existencia e) {
        return new ExistenciaResponse(e.stockId(), e.productoId(), e.codigoProducto(), e.producto(),
                e.ubicacionId(), e.codigoUbicacion(), e.ubicacion(), e.cantidad(), e.stockMinimo(),
                e.bajoMinimo());
    }

    public static PaginaResponse<MovimientoKardexResponse> toResponse(Pagina<MovimientoKardex> p) {
        var contenido = p.contenido().stream()
                .map(m -> new MovimientoKardexResponse(m.movimientoId(), m.ocurridoAt(), m.ubicacion(),
                        m.tipo(), m.entrada(), m.salida(), m.saldoResultante(), m.referenciaTipo(),
                        m.registradoPor(), m.motivo()))
                .toList();
        return new PaginaResponse<>(contenido, p.pagina(), p.tamano(), p.totalElementos(), p.totalPaginas());
    }
}
