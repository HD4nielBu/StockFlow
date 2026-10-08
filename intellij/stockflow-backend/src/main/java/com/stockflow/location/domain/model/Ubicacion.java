package com.stockflow.location.domain.model;

import com.stockflow.shared.domain.exception.DatoInvalidoException;

/**
 * Lugar físico donde se guarda stock: el almacén central o uno de los depósitos.
 * Sin @Entity: no sabe nada de JPA ni de PostgreSQL.
 */
public class Ubicacion {

    private final Long id;
    private final String codigo;
    private final String nombre;
    private final TipoUbicacion tipo;
    private final String direccion;
    private final boolean activo;

    public Ubicacion(Long id, String codigo, String nombre, TipoUbicacion tipo, String direccion,
                     boolean activo) {
        if (codigo == null || codigo.isBlank()) {
            throw new DatoInvalidoException("El código de la ubicación es obligatorio");
        }
        if (nombre == null || nombre.isBlank()) {
            throw new DatoInvalidoException("El nombre de la ubicación es obligatorio");
        }
        this.id = id;
        this.codigo = normalizarCodigo(codigo);
        this.nombre = nombre.trim();
        this.tipo = tipo == null ? TipoUbicacion.DEPOSITO : tipo;
        this.direccion = (direccion == null || direccion.isBlank()) ? null : direccion.trim();
        this.activo = activo;
    }

    /** Fábrica para una ubicación nueva: sin id (lo genera PostgreSQL) y activa. */
    public static Ubicacion nueva(String codigo, String nombre, TipoUbicacion tipo, String direccion) {
        return new Ubicacion(null, codigo, nombre, tipo, direccion, true);
    }

    public static String normalizarCodigo(String codigo) {
        return codigo == null ? null : codigo.trim().toUpperCase();
    }

    public boolean esAlmacenCentral() {
        return tipo == TipoUbicacion.ALMACEN_CENTRAL;
    }

    public Long getId() { return id; }
    public String getCodigo() { return codigo; }
    public String getNombre() { return nombre; }
    public TipoUbicacion getTipo() { return tipo; }
    public String getDireccion() { return direccion; }
    public boolean isActivo() { return activo; }
}
