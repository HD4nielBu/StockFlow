package com.stockflow.location.infrastructure.adapter.out.persistence.repository;

import com.stockflow.location.domain.model.TipoUbicacion;
import com.stockflow.location.infrastructure.adapter.out.persistence.entity.UbicacionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpringDataUbicacionRepository extends JpaRepository<UbicacionJpaEntity, Long> {

    boolean existsByCodigo(String codigo);

    boolean existsByTipoAndActivoTrue(TipoUbicacion tipo);

    List<UbicacionJpaEntity> findAllByOrderByCodigoAsc();

    List<UbicacionJpaEntity> findByTipoOrderByCodigoAsc(TipoUbicacion tipo);
}
