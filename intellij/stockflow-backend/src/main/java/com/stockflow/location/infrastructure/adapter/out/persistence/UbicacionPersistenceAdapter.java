package com.stockflow.location.infrastructure.adapter.out.persistence;

import com.stockflow.location.domain.model.TipoUbicacion;
import com.stockflow.location.domain.model.Ubicacion;
import com.stockflow.location.domain.port.out.UbicacionRepositoryPort;
import com.stockflow.location.infrastructure.adapter.out.persistence.mapper.UbicacionPersistenceMapper;
import com.stockflow.location.infrastructure.adapter.out.persistence.repository.SpringDataUbicacionRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/** Adapter OUT: implementa el Port OUT usando Spring Data JPA. */
@Component
public class UbicacionPersistenceAdapter implements UbicacionRepositoryPort {

    private final SpringDataUbicacionRepository repository;

    public UbicacionPersistenceAdapter(SpringDataUbicacionRepository repository) {
        this.repository = repository;
    }

    @Override
    public Ubicacion guardar(Ubicacion ubicacion) {
        var entity = UbicacionPersistenceMapper.toEntity(ubicacion);
        return UbicacionPersistenceMapper.toDomain(repository.save(entity));
    }

    @Override
    public Optional<Ubicacion> buscarPorId(Long id) {
        return repository.findById(id).map(UbicacionPersistenceMapper::toDomain);
    }

    @Override
    public List<Ubicacion> listar(TipoUbicacion tipo) {
        var entidades = tipo == null
                ? repository.findAllByOrderByCodigoAsc()
                : repository.findByTipoOrderByCodigoAsc(tipo);
        return entidades.stream().map(UbicacionPersistenceMapper::toDomain).toList();
    }

    @Override
    public boolean existePorCodigo(String codigo) {
        return repository.existsByCodigo(Ubicacion.normalizarCodigo(codigo));
    }

    @Override
    public boolean existeAlmacenCentralActivo() {
        return repository.existsByTipoAndActivoTrue(TipoUbicacion.ALMACEN_CENTRAL);
    }
}
