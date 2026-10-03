package com.stockflow.location.infrastructure.adapter.in.web.mapper;

import com.stockflow.location.domain.model.Ubicacion;
import com.stockflow.location.infrastructure.adapter.in.web.dto.CrearUbicacionRequest;
import com.stockflow.location.infrastructure.adapter.in.web.dto.UbicacionResponse;

public final class UbicacionWebMapper {

    private UbicacionWebMapper() {
    }

    public static Ubicacion toDomain(CrearUbicacionRequest request) {
        return Ubicacion.nueva(request.codigo(), request.nombre(), request.tipo(), request.direccion());
    }

    public static UbicacionResponse toResponse(Ubicacion ubicacion) {
        return new UbicacionResponse(ubicacion.getId(), ubicacion.getCodigo(), ubicacion.getNombre(),
                ubicacion.getTipo(), ubicacion.getDireccion(), ubicacion.isActivo());
    }
}
