package com.stockflow.integration;

import com.stockflow.category.domain.exception.CategoriaConProductosException;
import com.stockflow.category.infrastructure.adapter.out.persistence.CategoriaPersistenceAdapter;
import com.stockflow.category.infrastructure.adapter.out.persistence.repository.SpringDataCategoriaRepository;
import com.stockflow.inventory.infrastructure.adapter.out.persistence.InventarioConsultaAdapter;
import com.stockflow.product.domain.exception.ProductoEnUsoException;
import com.stockflow.product.infrastructure.adapter.out.persistence.ProductoPersistenceAdapter;
import com.stockflow.product.infrastructure.adapter.out.persistence.entity.ProductoJpaEntity;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Import;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Prueba de integración de la PERSISTENCIA (pregunta 49, RNF-05) contra un PostgreSQL 16 real:
 * Testcontainers levanta un contenedor desechable, Flyway aplica V1, V2 y V3, y Hibernate valida
 * el esquema (ddl-auto: validate). Lo que aquí se comprueba no lo puede comprobar un mock:
 * SQL nativo, vistas, FK, triggers e índices.
 *
 * Requiere Docker. Si no hay Docker disponible, la clase se OMITE (no falla), para que
 * `mvn test` siga funcionando en una máquina sin Docker.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers(disabledWithoutDocker = true)
@Import({InventarioConsultaAdapter.class, CategoriaPersistenceAdapter.class, ProductoPersistenceAdapter.class})
class PersistenciaPostgresTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

    @Autowired
    InventarioConsultaAdapter inventario;
    @Autowired
    CategoriaPersistenceAdapter categorias;
    @Autowired
    ProductoPersistenceAdapter productos;
    @Autowired
    SpringDataCategoriaRepository categoriaRepository;
    @Autowired
    EntityManager em;

    // ---------- Relación 1:N: lado propietario y lado inverso (preguntas 29, 30, 33 y 49) ----------

    /**
     * Si mappedBy estuviera mal escrito (por ejemplo "categoria_id", el nombre de la COLUMNA),
     * Hibernate fallaría al construir el EntityManagerFactory y esta clase no llegaría a ejecutarse:
     * es la prueba que detecta un error en mappedBy que una prueba unitaria del service nunca vería.
     */
    @Test
    void ladoInversoMappedByLeeLosProductosATravesDeLaFkYEsLazy() {
        var oficina = categoriaRepository.findById(1L).orElseThrow();   // CAT-OFI de la semilla
        var util = em.getEntityManagerFactory().getPersistenceUnitUtil();

        // @OneToMany es LAZY por defecto: cargar la categoría no trae sus productos
        assertFalse(util.isLoaded(oficina, "productos"));

        // Al recorrer la colección, Hibernate ejecuta: SELECT ... FROM producto WHERE categoria_id = ?
        Set<String> codigos = oficina.getProductos().stream()
                .map(ProductoJpaEntity::getCodigo)
                .collect(Collectors.toSet());
        assertEquals(Set.of("PRD-OFI-001", "PRD-OFI-002"), codigos);
        assertTrue(util.isLoaded(oficina, "productos"));
    }

    @Test
    void listarTodosLosProductosOrdenadosPorCodigo() {
        var todos = productos.listarTodos();
        assertEquals(5, todos.size());
        assertEquals("PRD-EPP-001", todos.get(0).getCodigo());
        assertEquals("PRD-TEC-001", todos.get(4).getCodigo());
    }

    @Test
    void ladoInversoEsDeSoloLectura() {
        var oficina = categoriaRepository.findById(1L).orElseThrow();
        assertThrows(UnsupportedOperationException.class, () -> oficina.getProductos().clear());
    }

    // ---------- @Query nativo y paginación (preguntas 17 y 47) ----------

    @Test
    void existenciasSinFiltrosDevuelveLasDiezFilasDeLaSemilla() {
        assertEquals(10, inventario.buscarExistencias(null, null, false).size());
    }

    @Test
    void soloBajoMinimoDevuelveElBoligrafoDelDepositoNorte() {
        var bajoMinimo = inventario.buscarExistencias(null, null, true);
        assertEquals(1, bajoMinimo.size());
        assertEquals("PRD-OFI-002", bajoMinimo.get(0).codigoProducto());
        assertEquals("UB-DEP-NOR", bajoMinimo.get(0).codigoUbicacion());
        assertTrue(bajoMinimo.get(0).bajoMinimo());
    }

    @Test
    void kardexPaginadoLeeLaVistaYCalculaElTotal() {
        // PRD-OFI-001 tiene 2 movimientos de carga inicial (central y depósito norte)
        var pagina = inventario.buscarKardex("PRD-OFI-001", 0, 1);
        assertEquals(1, pagina.contenido().size());
        assertEquals(2, pagina.totalElementos());
        assertEquals(2, pagina.totalPaginas());
        assertEquals("ENTRADA", pagina.contenido().get(0).tipo());
    }

    // ---------- DELETE protegido por las FK (traducción a excepciones de dominio) ----------

    @Test
    void eliminarCategoriaConProductosLanzaConflictoDeDominio() {
        assertThrows(CategoriaConProductosException.class, () -> categorias.eliminar(1L));
    }

    @Test
    void eliminarProductoConStockLanzaConflictoDeDominio() {
        assertThrows(ProductoEnUsoException.class, () -> productos.eliminar(1L));
    }

    // ---------- Migración V3 ----------

    @Test
    void v3RegistraLaAlertaQueLaSemillaJustificaba() {
        Number abiertas = (Number) em.createNativeQuery(
                "SELECT count(*) FROM stockflow.alerta_stock WHERE estado = 'ABIERTA'").getSingleResult();
        assertEquals(1, abiertas.intValue());
    }

    @Test
    void v3ImpideModificarUnMovimiento() {
        var ex = assertThrows(RuntimeException.class, () -> em.createNativeQuery(
                "UPDATE stockflow.movimiento_inventario SET cantidad = 999 WHERE movimiento_id = 1")
                .executeUpdate());
        assertTrue(mensajeCompleto(ex).contains("no se pueden modificar"), mensajeCompleto(ex));
    }

    @Test
    void v3ImpideNombresDeCategoriaQueSoloDifierenEnMayusculas() {
        var ex = assertThrows(RuntimeException.class, () -> em.createNativeQuery(
                "INSERT INTO stockflow.categoria (codigo, nombre) VALUES ('CAT-DUP', 'LIMPIEZA')")
                .executeUpdate());
        assertTrue(mensajeCompleto(ex).contains("uq_categoria_nombre_ci"), mensajeCompleto(ex));
    }

    private static String mensajeCompleto(Throwable t) {
        var sb = new StringBuilder();
        for (Throwable c = t; c != null; c = c.getCause()) {
            sb.append(c.getMessage()).append(" | ");
        }
        return sb.toString();
    }
}
