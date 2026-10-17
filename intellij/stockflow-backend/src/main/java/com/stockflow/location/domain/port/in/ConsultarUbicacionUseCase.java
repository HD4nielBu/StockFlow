package com.stockflow.location.domain.port.in;

import com.stockflow.location.domain.model.TipoUbicacion;
import com.stockflow.location.domain.model.Ubicacion;

import java.util.List;
import java.util.Optional;

/** Port IN: consultas de ubicaciones. Lo usa también el módulo inventory. */
public interface ConsultarUbicacionUseCase {

    Optional<Ubicacion> buscarPorId(Long id);

    /** tipo es opcional: null lista todas. */
    List<Ubicacion> listar(TipoUbicacion tipo);
}
