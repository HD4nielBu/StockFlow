package com.stockflow.product.domain;

import com.stockflow.product.domain.exception.StockMinimoInvalidoException;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Entidad DEPENDIENTE del par 1:N (tabla producto).
 * Conserva categoriaId: así se materializa la FK en el dominio.
 */
public class Producto {

    private final Long id;
    private final Long categoriaId;
    private final String codigo;
    private final String nombre;
    private final UnidadMedida unidadMedida;
    private int stockMinimoDefault;
    private final BigDecimal precioReferencial;
    private boolean activo;

    public Producto(Long id, Long categoriaId, String codigo, String nombre,
                    UnidadMedida unidadMedida, int stockMinimoDefault, BigDecimal precioReferencial) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("RN-06: el producto necesita un código único");
        }
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre del producto es obligatorio");
        }
        if (stockMinimoDefault < 0) {
            throw new StockMinimoInvalidoException(stockMinimoDefault);
        }
        if (precioReferencial != null && precioReferencial.signum() < 0) {
            throw new IllegalArgumentException("El precio referencial no puede ser negativo");
        }
        this.id = Objects.requireNonNull(id, "El id es obligatorio");
        this.categoriaId = Objects.requireNonNull(categoriaId, "La categoría es obligatoria");
        this.codigo = codigo.trim().toUpperCase();
        this.nombre = nombre.trim();
        this.unidadMedida = unidadMedida == null ? UnidadMedida.UNIDAD : unidadMedida;
        this.stockMinimoDefault = stockMinimoDefault;
        this.precioReferencial = precioReferencial;
        this.activo = true;
    }

    /** RN-07: el mínimo se usa para calcular alertas; nunca puede ser negativo. */
    public void cambiarStockMinimo(int nuevoMinimo) {
        if (nuevoMinimo < 0) {
            throw new StockMinimoInvalidoException(nuevoMinimo);
        }
        this.stockMinimoDefault = nuevoMinimo;
    }

    public void descontinuar() {
        this.activo = false;
    }

    public Long getId() { return id; }
    public Long getCategoriaId() { return categoriaId; }
    public String getCodigo() { return codigo; }
    public String getNombre() { return nombre; }
    public UnidadMedida getUnidadMedida() { return unidadMedida; }
    public int getStockMinimoDefault() { return stockMinimoDefault; }
    public BigDecimal getPrecioReferencial() { return precioReferencial; }
    public boolean isActivo() { return activo; }

    @Override
    public String toString() {
        return "Producto{id=" + id + ", categoriaId=" + categoriaId + ", codigo='" + codigo
                + "', unidad=" + unidadMedida + ", minimo=" + stockMinimoDefault + ", activo=" + activo + "}";
    }
}
