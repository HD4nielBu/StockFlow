package com.stockflow.category.infrastructure.adapter.out.persistence.entity;

import com.stockflow.product.infrastructure.adapter.out.persistence.entity.ProductoJpaEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/** Mapea EXACTAMENTE la tabla stockflow.categoria del script V1. */
@Entity
@Table(name = "categoria", schema = "stockflow")
public class CategoriaJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "categoria_id")
    private Long id;

    @Column(name = "codigo", nullable = false, unique = true, length = 30)
    private String codigo;

    @Column(name = "nombre", nullable = false, unique = true, length = 100)
    private String nombre;

    @Column(name = "descripcion", columnDefinition = "text")
    private String descripcion;

    @Column(name = "activo", nullable = false)
    private boolean activo;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    /**
     * Lado INVERSO (no propietario) de la relación Categoria 1:N Producto. Ver ADR-003.
     * - mappedBy = "categoria" es el nombre del ATRIBUTO JAVA ProductoJpaEntity.categoria,
     *   no el de la columna SQL categoria_id. El lado propietario, el único que escribe la FK,
     *   es ese @ManyToOne con @JoinColumn(name = "categoria_id").
     * - Sin cascade: guardar o borrar una categoría no propaga nada a sus productos (ADR-004).
     * - Sin orphanRemoval: un producto no se borra por salir de esta lista; cambia de categoría
     *   actualizando su propia FK con el PUT de producto.
     * - LAZY por defecto en @OneToMany: la colección sólo se consulta si alguien la recorre.
     * - Sólo lectura: no hay setters ni helpers addProducto/removeProducto, y ningún mapper
     *   la usa; por eso no hay riesgo de desincronizar los dos lados ni de recursión JSON
     *   (la API expone records DTO, nunca entidades).
     */
    @OneToMany(mappedBy = "categoria")
    private List<ProductoJpaEntity> productos = new ArrayList<>();

    protected CategoriaJpaEntity() {
    }

    public CategoriaJpaEntity(Long id, String codigo, String nombre, String descripcion, boolean activo) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.activo = activo;
    }

    /** Usado por el PUT sobre una entidad managed: Hibernate detecta el cambio (dirty checking). */
    public void actualizar(String codigo, String nombre, String descripcion, boolean activo) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.activo = activo;
    }

    public Long getId() { return id; }
    public String getCodigo() { return codigo; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public boolean isActivo() { return activo; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }

    /** Vista de sólo lectura; dispara un SELECT de productos la primera vez que se recorre (LAZY). */
    public List<ProductoJpaEntity> getProductos() { return Collections.unmodifiableList(productos); }
}
