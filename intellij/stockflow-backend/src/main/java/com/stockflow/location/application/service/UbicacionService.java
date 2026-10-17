package com.stockflow.location.application.service;

import com.stockflow.location.domain.exception.AlmacenCentralDuplicadoException;
import com.stockflow.location.domain.exception.CodigoUbicacionDuplicadoException;
import com.stockflow.location.domain.model.TipoUbicacion;
import com.stockflow.location.domain.model.Ubicacion;
import com.stockflow.location.domain.port.in.ConsultarUbicacionUseCase;
import com.stockflow.location.domain.port.in.RegistrarUbicacionUseCase;
import com.stockflow.location.domain.port.out.UbicacionRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UbicacionService implements RegistrarUbicacionUseCase, ConsultarUbicacionUseCase {

    private final UbicacionRepositoryPort repositoryPort;

    public UbicacionService(UbicacionRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    @Override
    @Transactional
    public Ubicacion registrar(Ubicacion ubicacion) {
        // Respeta uq_ubicacion_codigo antes de llegar a la base (409 con mensaje claro)
        if (repositoryPort.existePorCodigo(ubicacion.getCodigo())) {
            throw new CodigoUbicacionDuplicadoException(ubicacion.getCodigo());
        }
        // Regla del cliente (ficha PA-06, sección A): un almacén central y varios depósitos
        if (ubicacion.esAlmacenCentral() && repositoryPort.existeAlmacenCentralActivo()) {
            throw new AlmacenCentralDuplicadoException();
        }
        return repositoryPort.guardar(ubicacion);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Ubicacion> buscarPorId(Long id) {
        return repositoryPort.buscarPorId(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Ubicacion> listar(TipoUbicacion tipo) {
        return repositoryPort.listar(tipo);
    }
}
