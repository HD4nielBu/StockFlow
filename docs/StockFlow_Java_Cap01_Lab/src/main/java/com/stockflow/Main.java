package com.stockflow;

import com.stockflow.movimiento.domain.MovimientoInventario;
import com.stockflow.movimiento.domain.TipoMovimiento;
import com.stockflow.producto.domain.Producto;

public class Main {
    public static void main(String[] args) {
        System.out.println("Iniciando laboratorio StockFlow (Java 21)...\n");

        // 1. Crea un objeto padre
        Producto monitor = new Producto(1L, "ELEC-001", "Monitor 24 Pulgadas", 5);
        System.out.println("Producto creado: " + monitor.getNombre());

        // 2. Crea objetos dependientes
        MovimientoInventario entrada = new MovimientoInventario(101L, TipoMovimiento.ENTRADA, 20, "Compra inicial");
        MovimientoInventario salida = new MovimientoInventario(102L, TipoMovimiento.SALIDA, 2, "Requisicion interna");

        // 3. Relaciónalos mediante el método de negocio
        monitor.registrarMovimiento(entrada);
        monitor.registrarMovimiento(salida);

        // 4. Imprime una evidencia
        System.out.println("\nResumen de la Entidad Padre:");
        System.out.println(monitor);

        System.out.println("\nMovimientos registrados para " + monitor.getCodigo() + ":");
        for (MovimientoInventario mov : monitor.getMovimientos()) {
            System.out.println("- " + mov.toString());
        }

        System.out.println("\nLaboratorio finalizado exitosamente.");
    }
}