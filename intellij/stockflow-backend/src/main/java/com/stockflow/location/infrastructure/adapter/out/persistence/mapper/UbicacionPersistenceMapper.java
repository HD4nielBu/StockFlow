package com.stockflow.location.infrastructure.adapter.out.persistence.mapper;

import com.stockflow.location.domain.model.Ubicacion;
import com.stockflow.location.infrastructure.adapter.out.persistence.entity.UbicacionJpaEntity;

public final class UbicacionPersistenceMapper {

    private UbicacionPersistenceMapper() {
    }

    public static UbicacionJpaEntity toEntity(Ubicacion domain) {
        return new UbicacionJpaEntity(domain.getId(), domain.getCodigo(), domain.getNombre(),
                domain.getTipo(), domain.getDireccion(), domain.isActivo());
    }

    public static Ubicacion toDomain(UbicacionJpaEntity entity) {
        return new Ubicacion(entity.getId(), entity.getCodigo(), entity.getNombre(),
                entity.getTipo(), entity.getDireccion(), entity.isActivo());
    }
}
