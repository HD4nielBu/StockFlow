package com.stockflow.inventory.domain.port.out;

import com.stockflow.inventory.domain.model.Existencia;
import com.stockflow.inventory.domain.model.MovimientoKardex;
import com.stockflow.inventory.domain.model.Pagina;

import java.util.List;

/** Port OUT: lecturas que el núcleo necesita de la base. No extiende JpaRepository. */
public interface InventarioConsultaPort {

    List<Existencia> buscarExistencias(Long productoId, Long ubicacionId, boolean soloBajoMinimo);

    Pagina<MovimientoKardex> buscarKardex(String codigoProducto, int pagina, int tamano);
}
