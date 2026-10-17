package com.stockflow.inventory.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

/**
 * Mapea stockflow.stock SÓLO PARA LECTURA (@Immutable: Hibernate nunca genera UPDATE).
 * RN-01: el stock no se edita directamente; cambiará únicamente a través del caso de uso de movimientos.
 * Las FK se mapean como Long y no como @ManyToOne: este módulo no importa entidades JPA de
 * product ni de location, así que no agrega acoplamiento entre módulos a nivel de persistencia.
 */
@Entity
@Immutable
@Table(name = "stock", schema = "stockflow")
public class StockJpaEntity {

    @Id
    @Column(name = "stock_id")
    private Long id;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Column(name = "ubicacion_id", nullable = false)
    private Long ubicacionId;

    @Column(name = "cantidad", nullable = false, precision = 14, scale = 3)
    private BigDecimal cantidad;

    @Column(name = "stock_minimo", nullable = false, precision = 14, scale = 3)
    private BigDecimal stockMinimo;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected StockJpaEntity() {
    }

    public Long getId() { return id; }
    public Long getProductoId() { return productoId; }
    public Long getUbicacionId() { return ubicacionId; }
    public BigDecimal getCantidad() { return cantidad; }
    public BigDecimal getStockMinimo() { return stockMinimo; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
