package com.stockflow.location.domain.port.out;

import com.stockflow.location.domain.model.TipoUbicacion;
import com.stockflow.location.domain.model.Ubicacion;

import java.util.List;
import java.util.Optional;

/** Port OUT: lo que el núcleo necesita del exterior. No extiende JpaRepository. */
public interface UbicacionRepositoryPort {

    Ubicacion guardar(Ubicacion ubicacion);

    Optional<Ubicacion> buscarPorId(Long id);

    List<Ubicacion> listar(TipoUbicacion tipo);

    boolean existePorCodigo(String codigo);

    boolean existeAlmacenCentralActivo();
}
