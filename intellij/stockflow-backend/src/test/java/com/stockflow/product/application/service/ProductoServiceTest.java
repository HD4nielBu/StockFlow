package com.stockflow.product.application.service;

import com.stockflow.category.domain.exception.CategoriaInactivaException;
import com.stockflow.category.domain.exception.CategoriaNoEncontradaException;
import com.stockflow.category.domain.model.Categoria;
import com.stockflow.category.domain.port.in.ConsultarCategoriaUseCase;
import com.stockflow.product.domain.exception.CodigoProductoDuplicadoException;
import com.stockflow.product.domain.exception.ProductoNoEncontradoException;
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
import static org.junit.jupiter.api.Assertions.assertFalse;
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
                2L, new Categoria(2L, "CAT-OLD", "Categoría retirada", null, false),
                3L, new Categoria(3L, "CAT-LIM", "Limpieza", null, true));
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
    void listaSoloLosProductosDeLaCategoria() {
        service.registrar(producto(1L, "PRD-OFI-001", 0));
        service.registrar(producto(1L, "PRD-OFI-002", 0));
        assertEquals(2, service.listarPorCategoria(1L).size());
        assertEquals(0, service.listarPorCategoria(2L).size());
    }

    private Producto cambios(Long categoriaId, String codigo, boolean activo) {
        return new Producto(null, categoriaId, codigo, "Nombre editado", null,
                UnidadMedida.CAJA, 7, new BigDecimal("12.00"), activo);
    }

    // ---------- PUT ----------

    @Test
    void actualizaConservandoElIdYSinFalso409PorSuPropioCodigo() {
        var creado = service.registrar(producto(1L, "PRD-OFI-001", 0));
        var actualizado = service.actualizar(creado.getId(), cambios(1L, "prd-ofi-001", true));
        assertEquals(creado.getId(), actualizado.getId());
        assertEquals("Nombre editado", actualizado.getNombre());
        assertEquals(UnidadMedida.CAJA, actualizado.getUnidadMedida());
        assertEquals(1, repository.datos.size());
    }

    @Test
    void putEsIdempotente() {
        var creado = service.registrar(producto(1L, "PRD-OFI-001", 0));
        var primera = service.actualizar(creado.getId(), cambios(1L, "PRD-OFI-001", true));
        var segunda = service.actualizar(creado.getId(), cambios(1L, "PRD-OFI-001", true));
        assertEquals(primera.getNombre(), segunda.getNombre());
        assertEquals(primera.getStockMinimoDefault(), segunda.getStockMinimoDefault());
        assertEquals(1, repository.datos.size());
    }

    @Test
    void actualizarInexistenteDa404YNoCrea() {
        assertThrows(ProductoNoEncontradoException.class,
                () -> service.actualizar(99L, cambios(1L, "PRD-OFI-099", true)));
        assertEquals(0, repository.datos.size());
    }

    @Test
    void actualizarConCodigoDeOtroProductoDa409() {
        service.registrar(producto(1L, "PRD-OFI-001", 0));
        var segundo = service.registrar(producto(1L, "PRD-OFI-002", 0));
        assertThrows(CodigoProductoDuplicadoException.class,
                () -> service.actualizar(segundo.getId(), cambios(1L, "PRD-OFI-001", true)));
    }

    @Test
    void actualizarHaciaCategoriaInexistenteDa404() {
        var creado = service.registrar(producto(1L, "PRD-OFI-001", 0));
        assertThrows(CategoriaNoEncontradaException.class,
                () -> service.actualizar(creado.getId(), cambios(99L, "PRD-OFI-001", true)));
    }

    @Test
    void moverProductoACategoriaInactivaDa422() {
        var creado = service.registrar(producto(1L, "PRD-OFI-001", 0));
        assertThrows(CategoriaInactivaException.class,
                () -> service.actualizar(creado.getId(), cambios(2L, "PRD-OFI-001", true)));
    }

    @Test
    void cambiaDeCategoriaActivaYSeReflejaEnElListado() {
        var creado = service.registrar(producto(1L, "PRD-OFI-001", 0));
        service.actualizar(creado.getId(), cambios(3L, "PRD-OFI-001", true));
        assertEquals(0, service.listarPorCategoria(1L).size());
        assertEquals(1, service.listarPorCategoria(3L).size());
    }

    @Test
    void desactivarConPutEsUnaEdicionValida() {
        var creado = service.registrar(producto(1L, "PRD-OFI-001", 0));
        assertFalse(service.actualizar(creado.getId(), cambios(1L, "PRD-OFI-001", false)).isActivo());
    }

    // ---------- DELETE ----------

    @Test
    void eliminaProductoExistente() {
        var creado = service.registrar(producto(1L, "PRD-OFI-001", 0));
        service.eliminar(creado.getId());
        assertEquals(Optional.empty(), service.buscarPorId(creado.getId()));
    }

    @Test
    void eliminarInexistenteDa404() {
        assertThrows(ProductoNoEncontradoException.class, () -> service.eliminar(99L));
    }

    /** Implementación en memoria del Port OUT, sólo para pruebas. */
    static class FakeProductoRepository implements ProductoRepositoryPort {
        final List<Producto> datos = new ArrayList<>();
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
        public Producto actualizar(Producto p) {
            datos.replaceAll(actual -> actual.getId().equals(p.getId()) ? p : actual);
            return p;
        }

        @Override
        public void eliminar(Long id) {
            datos.removeIf(p -> p.getId().equals(id));
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

        @Override
        public boolean existePorCodigoEnOtro(String codigo, Long id) {
            return datos.stream().anyMatch(p -> !p.getId().equals(id)
                    && p.getCodigo().equals(Producto.normalizarCodigo(codigo)));
        }
    }
}
