package com.stockflow;

import com.stockflow.category.application.CategoriaService;
import com.stockflow.category.domain.Categoria;
import com.stockflow.category.infrastructure.memory.CategoriaRepositoryEnMemoria;
import com.stockflow.product.application.command.RegistrarProductoCommand;
import com.stockflow.product.domain.Producto;
import com.stockflow.product.domain.UnidadMedida;

import java.math.BigDecimal;

public class Main {

    public static void main(String[] args) {
        var repository = new CategoriaRepositoryEnMemoria();
        var service = new CategoriaService(repository);

        System.out.println("=== Capítulo 01: modelo y relación 1:N ===");
        Categoria oficina = service.registrar(
                new Categoria(1L, "cat-ofi", "Material de oficina", "Papelería y útiles"));
        Categoria limpieza = service.registrar(
                new Categoria(2L, "CAT-LIM", "Limpieza", "Insumos de limpieza"));

        var comando = new RegistrarProductoCommand(1L, "PRD-OFI-001", "Resma papel bond A4",
                UnidadMedida.PAQUETE, 20, new BigDecimal("38.50"));
        oficina.agregarProducto(new Producto(10L, comando.categoriaId(), comando.codigo(),
                comando.nombre(), comando.unidadMedida(), comando.stockMinimoDefault(),
                comando.precioReferencial()));
        oficina.agregarProducto(new Producto(11L, 1L, "PRD-OFI-002", "Bolígrafo azul",
                UnidadMedida.UNIDAD, 100, new BigDecimal("2.50")));
        oficina.getProductos().get(1).descontinuar();

        System.out.println(oficina);
        oficina.getProductos().forEach(p -> System.out.println("  -> " + p));
        System.out.println("Resumen: " + oficina.toResumen());

        System.out.println();
        System.out.println("=== Capítulo 02: servicio, Optional y excepciones ===");
        System.out.println("Categorías registradas: " + service.listar().size());
        System.out.println("Buscar id 2: " + service.obtener(2L));

        probar("obtener id inexistente", () -> service.obtener(999L));
        probar("código de categoría duplicado", () -> service.registrar(
                new Categoria(3L, "CAT-OFI", "Otra oficina", null)));
        probar("producto repetido en la categoría (RN-06)", () -> oficina.agregarProducto(
                new Producto(12L, 1L, "PRD-OFI-001", "Papel repetido", UnidadMedida.PAQUETE, 5, null)));
        probar("producto de otra categoría", () -> limpieza.agregarProducto(
                new Producto(13L, 1L, "PRD-OFI-003", "Corrector", UnidadMedida.UNIDAD, 5, null)));
        probar("código de producto vacío (RN-06)", () ->
                new Producto(14L, 2L, "  ", "Sin código", UnidadMedida.UNIDAD, 0, null));
        probar("stock mínimo negativo", () ->
                new Producto(15L, 2L, "PRD-LIM-009", "Mínimo inválido", UnidadMedida.LITRO, -3, null));
        probar("modificar lista inmodificable", () -> oficina.getProductos().clear());
    }

    private static void probar(String caso, Runnable accion) {
        try {
            accion.run();
            System.out.println("[SIN ERROR] " + caso);
        } catch (RuntimeException ex) {
            System.out.println("ERROR CONTROLADO (" + caso + "): "
                    + ex.getClass().getSimpleName() + " -> " + ex.getMessage());
        }
    }
}
