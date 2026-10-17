package com.stockflow.inventory.infrastructure.adapter.out.persistence;

import com.stockflow.inventory.domain.model.Existencia;
import com.stockflow.inventory.domain.model.MovimientoKardex;
import com.stockflow.inventory.domain.model.Pagina;
import com.stockflow.inventory.domain.port.out.InventarioConsultaPort;
import com.stockflow.inventory.infrastructure.adapter.out.persistence.repository.SpringDataStockRepository;
import com.stockflow.inventory.infrastructure.adapter.out.persistence.repository.SpringDataStockRepository.ExistenciaFila;
import com.stockflow.inventory.infrastructure.adapter.out.persistence.repository.SpringDataStockRepository.KardexFila;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;

/** Adapter OUT: traduce las proyecciones de Spring Data al modelo de lectura del dominio. */
@Component
public class InventarioConsultaAdapter implements InventarioConsultaPort {

    private final SpringDataStockRepository repository;

    public InventarioConsultaAdapter(SpringDataStockRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Existencia> buscarExistencias(Long productoId, Long ubicacionId, boolean soloBajoMinimo) {
        return repository.buscarExistencias(productoId, ubicacionId, soloBajoMinimo).stream()
                .map(InventarioConsultaAdapter::toDomain)
                .toList();
    }

    @Override
    public Pagina<MovimientoKardex> buscarKardex(String codigoProducto, int pagina, int tamano) {
        var page = repository.buscarKardex(codigoProducto, PageRequest.of(pagina, tamano));
        return new Pagina<>(page.getContent().stream().map(InventarioConsultaAdapter::toDomain).toList(),
                page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages());
    }

    private static Existencia toDomain(ExistenciaFila f) {
        return new Existencia(f.getStockId(), f.getProductoId(), f.getCodigoProducto(), f.getProducto(),
                f.getUbicacionId(), f.getCodigoUbicacion(), f.getUbicacion(), f.getCantidad(),
                f.getStockMinimo(), Boolean.TRUE.equals(f.getBajoMinimo()));
    }

    private static MovimientoKardex toDomain(KardexFila f) {
        return new MovimientoKardex(f.getMovimientoId(), f.getOcurridoAt(), f.getUbicacion(), f.getTipo(),
                f.getEntrada(), f.getSalida(), f.getSaldoResultante(), f.getReferenciaTipo(),
                f.getRegistradoPor(), f.getMotivo());
    }
}
