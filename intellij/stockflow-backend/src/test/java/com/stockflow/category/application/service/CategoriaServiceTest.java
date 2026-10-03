package com.stockflow.category.application.service;

import com.stockflow.category.domain.exception.CategoriaConProductosException;
import com.stockflow.category.domain.exception.CategoriaDuplicadaException;
import com.stockflow.category.domain.exception.CategoriaNoEncontradaException;
import com.stockflow.category.domain.model.Categoria;
import com.stockflow.category.domain.port.out.CategoriaRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Reglas de PUT y DELETE de categoría con un Port OUT falso: sin Spring y sin PostgreSQL. */
class CategoriaServiceTest {

    private FakeCategoriaRepository repository;
    private CategoriaService service;

    @BeforeEach
    void setUp() {
        repository = new FakeCategoriaRepository();
        service = new CategoriaService(repository);
    }

    private Categoria cambios(String codigo, String nombre, boolean activo) {
        return new Categoria(null, codigo, nombre, "Editada", activo);
    }

    @Test
    void actualizaSinFalso409CuandoConservaSuCodigoYNombre() {
        var creada = service.registrar(Categoria.nueva("CAT-OFI", "Oficina", null));
        var actualizada = service.actualizar(creada.getId(), cambios("cat-ofi", "OFICINA", true));
        assertEquals(creada.getId(), actualizada.getId());
        assertEquals("OFICINA", actualizada.getNombre());
        assertEquals("Editada", actualizada.getDescripcion());
    }

    @Test
    void actualizarInexistenteDa404YNoCrea() {
        assertThrows(CategoriaNoEncontradaException.class,
                () -> service.actualizar(99L, cambios("CAT-X", "X", true)));
        assertEquals(0, repository.datos.size());
    }

    @Test
    void actualizarConCodigoDeOtraDa409() {
        service.registrar(Categoria.nueva("CAT-OFI", "Oficina", null));
        var limpieza = service.registrar(Categoria.nueva("CAT-LIM", "Limpieza", null));
        assertThrows(CategoriaDuplicadaException.class,
                () -> service.actualizar(limpieza.getId(), cambios("CAT-OFI", "Limpieza", true)));
    }

    @Test
    void actualizarConNombreDeOtraDa409IgnorandoMayusculas() {
        service.registrar(Categoria.nueva("CAT-OFI", "Oficina", null));
        var limpieza = service.registrar(Categoria.nueva("CAT-LIM", "Limpieza", null));
        assertThrows(CategoriaDuplicadaException.class,
                () -> service.actualizar(limpieza.getId(), cambios("CAT-LIM", "oficina", true)));
    }

    @Test
    void desactivarConPut() {
        var creada = service.registrar(Categoria.nueva("CAT-OFI", "Oficina", null));
        assertFalse(service.actualizar(creada.getId(), cambios("CAT-OFI", "Oficina", false)).isActivo());
    }

    @Test
    void eliminaCategoriaSinProductos() {
        var creada = service.registrar(Categoria.nueva("CAT-OFI", "Oficina", null));
        service.eliminar(creada.getId());
        assertTrue(service.buscarPorId(creada.getId()).isEmpty());
    }

    @Test
    void eliminarInexistenteDa404() {
        assertThrows(CategoriaNoEncontradaException.class, () -> service.eliminar(99L));
    }

    @Test
    void eliminarCategoriaConProductosDa409() {
        var creada = service.registrar(Categoria.nueva("CAT-OFI", "Oficina", null));
        repository.conProductos.add(creada.getId());   // simula la FK fk_producto_categoria
        assertThrows(CategoriaConProductosException.class, () -> service.eliminar(creada.getId()));
        assertTrue(service.buscarPorId(creada.getId()).isPresent());
    }

    /** Implementación en memoria del Port OUT, sólo para pruebas. */
    static class FakeCategoriaRepository implements CategoriaRepositoryPort {
        final List<Categoria> datos = new ArrayList<>();
        final Set<Long> conProductos = new HashSet<>();
        private final AtomicLong secuencia = new AtomicLong();

        @Override
        public Categoria guardar(Categoria c) {
            var guardada = new Categoria(secuencia.incrementAndGet(), c.getCodigo(), c.getNombre(),
                    c.getDescripcion(), c.isActivo());
            datos.add(guardada);
            return guardada;
        }

        @Override
        public Categoria actualizar(Categoria c) {
            datos.replaceAll(actual -> actual.getId().equals(c.getId()) ? c : actual);
            return c;
        }

        @Override
        public void eliminar(Long id) {
            if (conProductos.contains(id)) {
                throw new CategoriaConProductosException(id);
            }
            datos.removeIf(c -> c.getId().equals(id));
        }

        @Override
        public Optional<Categoria> buscarPorId(Long id) {
            return datos.stream().filter(c -> c.getId().equals(id)).findFirst();
        }

        @Override
        public List<Categoria> listar(String nombre) {
            return List.copyOf(datos);
        }

        @Override
        public boolean existePorCodigo(String codigo) {
            return datos.stream().anyMatch(c -> c.getCodigo().equals(Categoria.normalizarCodigo(codigo)));
        }

        @Override
        public boolean existePorNombre(String nombre) {
            return datos.stream().anyMatch(c -> c.getNombre().equalsIgnoreCase(nombre.trim()));
        }

        @Override
        public boolean existePorCodigoEnOtra(String codigo, Long id) {
            return datos.stream().anyMatch(c -> !c.getId().equals(id)
                    && c.getCodigo().equals(Categoria.normalizarCodigo(codigo)));
        }

        @Override
        public boolean existePorNombreEnOtra(String nombre, Long id) {
            return datos.stream().anyMatch(c -> !c.getId().equals(id)
                    && c.getNombre().equalsIgnoreCase(nombre.trim()));
        }
    }
}
