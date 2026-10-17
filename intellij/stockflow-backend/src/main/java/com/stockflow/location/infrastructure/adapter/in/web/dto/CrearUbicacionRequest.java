package com.stockflow.location.infrastructure.adapter.in.web.dto;

import com.stockflow.location.domain.model.TipoUbicacion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Lo que el cliente HTTP envía para crear una ubicación. No lleva id ni activo. */
public record CrearUbicacionRequest(

        @NotBlank(message = "El código es obligatorio")
        @Size(max = 30, message = "El código admite máximo 30 caracteres")
        @Pattern(regexp = "^[A-Za-z0-9-]+$",
                 message = "El código sólo admite letras, números y guiones")
        String codigo,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 120, message = "El nombre admite máximo 120 caracteres")
        String nombre,

        // Opcional: si no llega se usa DEPOSITO (DEFAULT de la columna). Un valor fuera del enum produce 400.
        TipoUbicacion tipo,

        @Size(max = 220, message = "La dirección admite máximo 220 caracteres")
        String direccion
) {}
