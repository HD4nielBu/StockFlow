package com.stockflow.category.domain;

import com.stockflow.category.domain.exception.CodigoProductoRepetidoEnCategoriaException;
import com.stockflow.product.domain.Producto;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Entidad PADRE del par 1:N (tabla categoria).
 * Agrupa productos del catálogo de almacén.
 */
public class Categoria {

    private final Long id;
    private final String codigo;
    private final String nombre;
    private final String descripcion;
    private boolean activo;

    // Relación 1:N expresada con una colección privada (Cap. 01, paso 6)
    private final List<Producto> productos = new ArrayList<>();

    public Categoria(Long id, String codigo, String nombre, String descripcion) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("El código de la categoría es obligatorio");
        }
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre de la categoría es obligatorio");
        }
        this.id = Objects.requireNonNull(id, "El id es obligatorio");
        this.codigo = codigo.trim().toUpperCase();
        this.nombre = nombre.trim();
        this.descripcion = descripcion;
        this.activo = true;
    }

    /** Regla: el producto debe pertenecer a esta categoría y su código no puede repetirse (RN-06). */
    public void agregarProducto(Producto producto) {
        Objects.requireNonNull(producto, "El producto es obligatorio");
        if (!id.equals(producto.getCategoriaId())) {
            throw new IllegalArgumentException(
                    "El producto " + producto.getCodigo() + " no pertenece a la categoría " + codigo);
        }
        boolean repetido = productos.stream()
                .anyMatch(p -> p.getCodigo().equals(producto.getCodigo()));
        if (repetido) {
            throw new CodigoProductoRepetidoEnCategoriaException(producto.getCodigo());
        }
        productos.add(producto);
    }

    public long contarProductosActivos() {
        return productos.stream().filter(Producto::isActivo).count();
    }

    public void desactivar() {
        this.activo = false;
    }

    public List<Producto> getProductos() {
        return Collections.unmodifiableList(productos);
    }

    public CategoriaResumen toResumen() {
        return new CategoriaResumen(id, codigo, nombre, productos.size(), contarProductosActivos());
    }

    public Long getId() { return id; }
    public String getCodigo() { return codigo; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public boolean isActivo() { return activo; }

    @Override
    public String toString() {
        return "Categoria{id=" + id + ", codigo='" + codigo + "', nombre='" + nombre
                + "', productos=" + productos.size() + ", activo=" + activo + "}";
    }
}
