package com.stockflow.category.domain.model;

/**
 * Modelo de dominio de la CATEGORÍA del catálogo.
 * Sin @Entity: no sabe nada de JPA ni de PostgreSQL.
 */
public class Categoria {

    private final Long id;
    private final String codigo;
    private final String nombre;
    private final String descripcion;
    private final boolean activo;

    public Categoria(Long id, String codigo, String nombre, String descripcion, boolean activo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("El código de la categoría es obligatorio");
        }
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre de la categoría es obligatorio");
        }
        this.id = id;
        this.codigo = normalizarCodigo(codigo);
        this.nombre = nombre.trim();
        this.descripcion = (descripcion == null || descripcion.isBlank()) ? null : descripcion.trim();
        this.activo = activo;
    }

    /** Fábrica para una categoría nueva: sin id (lo genera PostgreSQL) y activa. */
    public static Categoria nueva(String codigo, String nombre, String descripcion) {
        return new Categoria(null, codigo, nombre, descripcion, true);
    }

    public static String normalizarCodigo(String codigo) {
        return codigo == null ? null : codigo.trim().toUpperCase();
    }

    public Long getId() { return id; }
    public String getCodigo() { return codigo; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public boolean isActivo() { return activo; }
}
