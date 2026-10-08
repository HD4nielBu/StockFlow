package com.stockflow.product.domain.model;

import com.stockflow.product.domain.exception.StockMinimoInvalidoException;
import com.stockflow.shared.domain.exception.DatoInvalidoException;

import java.math.BigDecimal;

/**
 * Producto del catálogo (RN-06: código único).
 * Conserva categoriaId en lugar de un objeto JPA: el dominio no conoce @ManyToOne.
 */
public class Producto {

    private final Long id;
    private final Long categoriaId;
    private final String codigo;
    private final String nombre;
    private final String descripcion;
    private final UnidadMedida unidadMedida;
    private final int stockMinimoDefault;
    private final BigDecimal precioReferencial;
    private final boolean activo;

    public Producto(Long id, Long categoriaId, String codigo, String nombre, String descripcion,
                    UnidadMedida unidadMedida, int stockMinimoDefault,
                    BigDecimal precioReferencial, boolean activo) {
        if (codigo == null || codigo.isBlank()) {
            throw new DatoInvalidoException("RN-06: el código del producto es obligatorio");
        }
        if (nombre == null || nombre.isBlank()) {
            throw new DatoInvalidoException("El nombre del producto es obligatorio");
        }
        if (stockMinimoDefault < 0) {
            throw new StockMinimoInvalidoException(stockMinimoDefault);
        }
        if (categoriaId == null) {
            throw new DatoInvalidoException("La categoría es obligatoria");
        }
        this.id = id;
        this.categoriaId = categoriaId;
        this.codigo = normalizarCodigo(codigo);
        this.nombre = nombre.trim();
        this.descripcion = (descripcion == null || descripcion.isBlank()) ? null : descripcion.trim();
        this.unidadMedida = unidadMedida == null ? UnidadMedida.UNIDAD : unidadMedida;
        this.stockMinimoDefault = stockMinimoDefault;
        this.precioReferencial = normalizarPrecio(precioReferencial);
        this.activo = activo;
    }

    /** Fábrica para un producto nuevo: sin id y activo. */
    public static Producto nuevo(Long categoriaId, String codigo, String nombre, String descripcion,
                                 UnidadMedida unidadMedida, Integer stockMinimoDefault,
                                 BigDecimal precioReferencial) {
        return new Producto(null, categoriaId, codigo, nombre, descripcion, unidadMedida,
                stockMinimoDefault == null ? 0 : stockMinimoDefault, precioReferencial, true);
    }

    /**
     * NUMERIC(12,2): el precio siempre se guarda y se devuelve con 2 decimales.
     * Sin esto, el POST respondía 10.5 y el GET (leído de PostgreSQL) 10.50 para el mismo producto.
     */
    private static BigDecimal normalizarPrecio(BigDecimal precio) {
        if (precio == null) {
            return null;
        }
        if (precio.signum() < 0) {
            throw new DatoInvalidoException("El precio referencial no puede ser negativo");
        }
        if (precio.stripTrailingZeros().scale() > 2) {
            throw new DatoInvalidoException("El precio referencial admite como máximo 2 decimales");
        }
        return precio.setScale(2);
    }

    public static String normalizarCodigo(String codigo) {
        return codigo == null ? null : codigo.trim().toUpperCase();
    }

    public Long getId() { return id; }
    public Long getCategoriaId() { return categoriaId; }
    public String getCodigo() { return codigo; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public UnidadMedida getUnidadMedida() { return unidadMedida; }
    public int getStockMinimoDefault() { return stockMinimoDefault; }
    public BigDecimal getPrecioReferencial() { return precioReferencial; }
    public boolean isActivo() { return activo; }
}
