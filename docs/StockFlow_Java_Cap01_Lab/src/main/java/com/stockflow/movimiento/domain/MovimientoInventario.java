package com.stockflow.movimiento.domain;

import com.stockflow.movimiento.exception.MovimientoInvalidoException;
import java.time.LocalDateTime;

public class MovimientoInventario {
    private Long id;
    private TipoMovimiento tipo;
    private int cantidad;
    private LocalDateTime fecha;
    private String referencia;

    public MovimientoInventario(Long id, TipoMovimiento tipo, int cantidad, String referencia) {
        if (cantidad <= 0) {
            throw new MovimientoInvalidoException("La cantidad del movimiento debe ser mayor a cero.");
        }
        if (tipo == null) {
            throw new MovimientoInvalidoException("El tipo de movimiento es obligatorio.");
        }

        this.id = id;
        this.tipo = tipo;
        this.cantidad = cantidad;
        this.fecha = LocalDateTime.now();
        this.referencia = referencia;
    }

    public Long getId() {
        return id;
    }

    public TipoMovimiento getTipo() {
        return tipo;
    }

    public int getCantidad() {
        return cantidad;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public String getReferencia() {
        return referencia;
    }

    @Override
    public String toString() {
        return "MovimientoInventario{" +
                "tipo=" + tipo +
                ", cantidad=" + cantidad +
                ", referencia='" + referencia + '\'' +
                '}';
    }
}