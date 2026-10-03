package com.stockflow.category.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Lo que el cliente HTTP envía para crear una categoría. No lleva id ni activo. */
public record CrearCategoriaRequest(

        @NotBlank(message = "El código es obligatorio")
        @Size(max = 30, message = "El código admite máximo 30 caracteres")
        @Pattern(regexp = "^[A-Za-z0-9-]+$",
                 message = "El código sólo admite letras, números y guiones")
        String codigo,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre admite máximo 100 caracteres")
        String nombre,

        @Size(max = 1000, message = "La descripción admite máximo 1000 caracteres")
        String descripcion
) {}
