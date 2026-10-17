package com.stockflow.location.infrastructure.adapter.out.persistence.entity;

import com.stockflow.location.domain.model.TipoUbicacion;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

/** Mapea EXACTAMENTE la tabla stockflow.ubicacion del script V1 (no tiene updated_at). */
@Entity
@Table(name = "ubicacion", schema = "stockflow")
public class UbicacionJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ubicacion_id")
    private Long id;

    @Column(name = "codigo", nullable = false, unique = true, length = 30)
    private String codigo;

    @Column(name = "nombre", nullable = false, length = 120)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 20)
    private TipoUbicacion tipo;

    @Column(name = "direccion", length = 220)
    private String direccion;

    @Column(name = "activo", nullable = false)
    private boolean activo;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    protected UbicacionJpaEntity() {
    }

    public UbicacionJpaEntity(Long id, String codigo, String nombre, TipoUbicacion tipo,
                              String direccion, boolean activo) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.tipo = tipo;
        this.direccion = direccion;
        this.activo = activo;
    }

    public Long getId() { return id; }
    public String getCodigo() { return codigo; }
    public String getNombre() { return nombre; }
    public TipoUbicacion getTipo() { return tipo; }
    public String getDireccion() { return direccion; }
    public boolean isActivo() { return activo; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
