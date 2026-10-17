package com.stockflow.inventory.application.service;

import com.stockflow.inventory.domain.model.Existencia;
import com.stockflow.inventory.domain.model.MovimientoKardex;
import com.stockflow.inventory.domain.model.Pagina;
import com.stockflow.inventory.domain.port.in.ConsultarInventarioUseCase;
import com.stockflow.inventory.domain.port.out.InventarioConsultaPort;
import com.stockflow.location.domain.exception.UbicacionNoEncontradaException;
import com.stockflow.location.domain.port.in.ConsultarUbicacionUseCase;
import com.stockflow.product.domain.exception.ProductoNoEncontradoException;
import com.stockflow.product.domain.port.in.ConsultarProductoUseCase;
import com.stockflow.shared.domain.exception.DatoInvalidoException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Lado de lectura del flujo crítico: stock por ubicación, alertas de mínimo y kardex.
 * Valida producto y ubicación con los Ports IN de sus módulos (no con sus JpaRepository).
 */
@Service
public class InventarioConsultaService implements ConsultarInventarioUseCase {

    static final int TAMANO_MAXIMO = 100;

    private final InventarioConsultaPort consultaPort;
    private final ConsultarProductoUseCase consultarProducto;
    private final ConsultarUbicacionUseCase consultarUbicacion;

    public InventarioConsultaService(InventarioConsultaPort consultaPort,
                                     ConsultarProductoUseCase consultarProducto,
                                     ConsultarUbicacionUseCase consultarUbicacion) {
        this.consultaPort = consultaPort;
        this.consultarProducto = consultarProducto;
        this.consultarUbicacion = consultarUbicacion;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Existencia> consultarStock(Long productoId, Long ubicacionId, boolean soloBajoMinimo) {
        // Un filtro con un id inexistente es un 404, no una lista vacía engañosa
        if (productoId != null && consultarProducto.buscarPorId(productoId).isEmpty()) {
            throw new ProductoNoEncontradoException(productoId);
        }
        if (ubicacionId != null && consultarUbicacion.buscarPorId(ubicacionId).isEmpty()) {
            throw new UbicacionNoEncontradaException(ubicacionId);
        }
        return consultaPort.buscarExistencias(productoId, ubicacionId, soloBajoMinimo);
    }

    @Override
    @Transactional(readOnly = true)
    public Pagina<MovimientoKardex> consultarKardex(Long productoId, int pagina, int tamano) {
        if (pagina < 0) {
            throw new DatoInvalidoException("La página empieza en 0");
        }
        if (tamano < 1 || tamano > TAMANO_MAXIMO) {
            throw new DatoInvalidoException("El tamaño de página debe estar entre 1 y " + TAMANO_MAXIMO);
        }
        var producto = consultarProducto.buscarPorId(productoId)
                .orElseThrow(() -> new ProductoNoEncontradoException(productoId));
        // vw_kardex identifica al producto por su código (único, RN-06)
        return consultaPort.buscarKardex(producto.getCodigo(), pagina, tamano);
    }
}
