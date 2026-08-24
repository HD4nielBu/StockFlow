package com.stockflow.producto.domain;

import com.stockflow.movimiento.domain.MovimientoInventario;
import com.stockflow.producto.exception.ProductoInvalidoException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Producto {
    private Long id;
    private String codigo;
    private String nombre;
    private int stockMinimo;
    private final List<MovimientoInventario> movimientos = new ArrayList<>();

    public Producto(Long id, String codigo, String nombre, int stockMinimo) {
        if (codigo == null || codigo.trim().isEmpty()) {
            throw new ProductoInvalidoException("El código del producto es obligatorio.");
        }
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new ProductoInvalidoException("El nombre del producto es obligatorio.");
        }
        if (stockMinimo < 0) {
            throw new ProductoInvalidoException("El stock mínimo no puede ser negativo.");
        }

        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.stockMinimo = stockMinimo;
    }

    // Comportamiento del negocio
    public void registrarMovimiento(MovimientoInventario movimiento) {
        if (movimiento == null) {
            throw new IllegalArgumentException("No se puede registrar un movimiento nulo.");
        }
        this.movimientos.add(movimiento);
    }

    // Métodos de lectura
    public Long getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public int getStockMinimo() {
        return stockMinimo;
    }

    // Devuelve una lista inmodificable para proteger la encapsulación
    public List<MovimientoInventario> getMovimientos() {
        return Collections.unmodifiableList(movimientos);
    }

    @Override
    public String toString() {
        return "Producto{" +
                "codigo='" + codigo + '\'' +
                ", nombre='" + nombre + '\'' +
                ", movimientos_registrados=" + movimientos.size() +
                '}';
    }
}