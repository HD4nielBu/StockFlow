package com.stockflow.product.infrastructure.adapter.out.persistence.entity;

import com.stockflow.category.infrastructure.adapter.out.persistence.entity.CategoriaJpaEntity;
import com.stockflow.product.domain.model.UnidadMedida;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

/** Mapea stockflow.producto. La FK categoria_id se expresa con @ManyToOne. */
@Entity
@Table(name = "producto", schema = "stockflow")
public class ProductoJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "producto_id")
    private Long id;

    // Muchos productos -> una categoría. La columna FK física es categoria_id.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private CategoriaJpaEntity categoria;

    @Column(name = "codigo", nullable = false, unique = true, length = 40)
    private String codigo;

    @Column(name = "nombre", nullable = false, length = 140)
    private String nombre;

    @Column(name = "descripcion", columnDefinition = "text")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "unidad_medida", nullable = false, length = 20)
    private UnidadMedida unidadMedida;

    @Column(name = "stock_minimo_default", nullable = false)
    private int stockMinimoDefault;

    @Column(name = "precio_referencial", precision = 12, scale = 2)
    private BigDecimal precioReferencial;

    @Column(name = "activo", nullable = false)
    private boolean activo;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected ProductoJpaEntity() {
    }

    public ProductoJpaEntity(Long id, CategoriaJpaEntity categoria, String codigo, String nombre,
                             String descripcion, UnidadMedida unidadMedida, int stockMinimoDefault,
                             BigDecimal precioReferencial, boolean activo) {
        this.id = id;
        this.categoria = categoria;
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.unidadMedida = unidadMedida;
        this.stockMinimoDefault = stockMinimoDefault;
        this.precioReferencial = precioReferencial;
        this.activo = activo;
    }

    /** Usado por el PUT sobre una entidad managed: Hibernate detecta el cambio (dirty checking). */
    public void actualizar(CategoriaJpaEntity categoria, String codigo, String nombre, String descripcion,
                           UnidadMedida unidadMedida, int stockMinimoDefault,
                           BigDecimal precioReferencial, boolean activo) {
        this.categoria = categoria;
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.unidadMedida = unidadMedida;
        this.stockMinimoDefault = stockMinimoDefault;
        this.precioReferencial = precioReferencial;
        this.activo = activo;
    }

    public Long getId() { return id; }
    public CategoriaJpaEntity getCategoria() { return categoria; }
    public String getCodigo() { return codigo; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public UnidadMedida getUnidadMedida() { return unidadMedida; }
    public int getStockMinimoDefault() { return stockMinimoDefault; }
    public BigDecimal getPrecioReferencial() { return precioReferencial; }
    public boolean isActivo() { return activo; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
