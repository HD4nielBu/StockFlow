package com.stockflow.product.application.service;

import com.stockflow.category.domain.exception.CategoriaInactivaException;
import com.stockflow.category.domain.exception.CategoriaNoEncontradaException;
import com.stockflow.category.domain.model.Categoria;
import com.stockflow.category.domain.port.in.ConsultarCategoriaUseCase;
import com.stockflow.product.domain.exception.CodigoProductoDuplicadoException;
import com.stockflow.product.domain.exception.StockMinimoInvalidoException;
import com.stockflow.product.domain.model.Producto;
import com.stockflow.product.domain.model.UnidadMedida;
import com.stockflow.product.domain.port.out.ProductoRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

/** Prueba las reglas del caso de uso con puertos falsos: sin Spring y sin PostgreSQL. */
class ProductoServiceTest {

    private FakeProductoRepository repository;
    private ProductoService service;

    @BeforeEach
    void setUp() {
        repository = new FakeProductoRepository();
        var categorias = Map.of(
                1L, new Categoria(1L, "CAT-OFI", "Material de oficina", null, true),
                2L, new Categoria(2L, "CAT-OLD", "Categoría retirada", null, false));
        ConsultarCategoriaUseCase consultarCategoria = new ConsultarCategoriaUseCase() {
            @Override
            public Optional<Categoria> buscarPorId(Long id) {
                return Optional.ofNullable(categorias.get(id));
            }

            @Override
            public List<Categoria> listar(String nombre) {
                return List.copyOf(categorias.values());
            }
        };
        service = new ProductoService(repository, consultarCategoria);
    }

    private Producto producto(Long categoriaId, String codigo, Integer minimo) {
        return Producto.nuevo(categoriaId, codigo, "Producto de prueba", null,
                UnidadMedida.UNIDAD, minimo, new BigDecimal("10.00"));
    }

    @Test
    void registraProductoValidoNormalizandoElCodigo() {
        var creado = service.registrar(producto(1L, "prd-ofi-001", 5));
        assertNotNull(creado.getId());
        assertEquals("PRD-OFI-001", creado.getCodigo());
        assertEquals(UnidadMedida.UNIDAD, creado.getUnidadMedida());
    }

    @Test
    void rechazaCategoriaInexistente() {
        assertThrows(CategoriaNoEncontradaException.class,
                () -> service.registrar(producto(99L, "PRD-X-01", 0)));
    }

    @Test
    void rechazaCategoriaInactiva() {
        assertThrows(CategoriaInactivaException.class,
                () -> service.registrar(producto(2L, "PRD-X-02", 0)));
    }

    @Test
    void rechazaCodigoDuplicadoRN06() {
        service.registrar(producto(1L, "PRD-OFI-001", 0));
        assertThrows(CodigoProductoDuplicadoException.class,
                () -> service.registrar(producto(1L, " prd-ofi-001 ", 0)));
    }

    @Test
    void rechazaStockMinimoNegativoRN07() {
        assertThrows(StockMinimoInvalidoException.class,
                () -> service.registrar(producto(1L, "PRD-OFI-009", -1)));
    }

    @Test
    void listaSoloLosProductosDeLaCategoria() {
        service.registrar(producto(1L, "PRD-OFI-001", 0));
        service.registrar(producto(1L, "PRD-OFI-002", 0));
        assertEquals(2, service.listarPorCategoria(1L).size());
        assertEquals(0, service.listarPorCategoria(2L).size());
    }

    /** Implementación en memoria del Port OUT, sólo para pruebas. */
    static class FakeProductoRepository implements ProductoRepositoryPort {
        private final List<Producto> datos = new ArrayList<>();
        private final AtomicLong secuencia = new AtomicLong();

        @Override
        public Producto guardar(Producto p) {
            var guardado = new Producto(secuencia.incrementAndGet(), p.getCategoriaId(), p.getCodigo(),
                    p.getNombre(), p.getDescripcion(), p.getUnidadMedida(), p.getStockMinimoDefault(),
                    p.getPrecioReferencial(), p.isActivo());
            datos.add(guardado);
            return guardado;
        }

        @Override
        public Optional<Producto> buscarPorId(Long id) {
            return datos.stream().filter(p -> p.getId().equals(id)).findFirst();
        }

        @Override
        public List<Producto> listarPorCategoriaId(Long categoriaId) {
            return datos.stream().filter(p -> p.getCategoriaId().equals(categoriaId)).toList();
        }

        @Override
        public boolean existePorCodigo(String codigo) {
            return datos.stream().anyMatch(p -> p.getCodigo().equals(Producto.normalizarCodigo(codigo)));
        }
    }
}
