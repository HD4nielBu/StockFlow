package com.stockflow.product.infrastructure.adapter.in.web.dto;

import com.stockflow.product.domain.model.UnidadMedida;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CrearProductoRequest(

        @NotNull(message = "La categoría es obligatoria")
        @Positive(message = "El id de la categoría debe ser positivo")
        Long categoriaId,

        @NotBlank(message = "El código es obligatorio")
        @Size(max = 40, message = "El código admite máximo 40 caracteres")
        @Pattern(regexp = "^[A-Za-z0-9-]+$",
                 message = "El código sólo admite letras, números y guiones")
        String codigo,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 140, message = "El nombre admite máximo 140 caracteres")
        String nombre,

        @Size(max = 1000, message = "La descripción admite máximo 1000 caracteres")
        String descripcion,

        // Opcional: si no llega se usa UNIDAD. Un valor fuera del enum produce 400.
        UnidadMedida unidadMedida,

        @PositiveOrZero(message = "RN-07: el stock mínimo no puede ser negativo")
        Integer stockMinimoDefault,

        @PositiveOrZero(message = "El precio referencial no puede ser negativo")
        @Digits(integer = 10, fraction = 2, message = "Formato NUMERIC(12,2): máx. 10 enteros y 2 decimales")
        BigDecimal precioReferencial
) {}
