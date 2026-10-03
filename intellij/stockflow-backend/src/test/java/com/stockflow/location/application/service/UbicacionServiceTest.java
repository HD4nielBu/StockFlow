package com.stockflow.location.application.service;

import com.stockflow.location.domain.exception.AlmacenCentralDuplicadoException;
import com.stockflow.location.domain.exception.CodigoUbicacionDuplicadoException;
import com.stockflow.location.domain.model.TipoUbicacion;
import com.stockflow.location.domain.model.Ubicacion;
import com.stockflow.location.domain.port.out.UbicacionRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

/** Reglas del registro de ubicaciones con un Port OUT falso: sin Spring y sin PostgreSQL. */
class UbicacionServiceTest {

    private FakeUbicacionRepository repository;
    private UbicacionService service;

    @BeforeEach
    void setUp() {
        repository = new FakeUbicacionRepository();
        service = new UbicacionService(repository);
    }

    @Test
    void registraDepositoNormalizandoElCodigo() {
        var creada = service.registrar(Ubicacion.nueva("ub-dep-este", "Depósito Este", TipoUbicacion.DEPOSITO, null));
        assertNotNull(creada.getId());
        assertEquals("UB-DEP-ESTE", creada.getCodigo());
    }

    @Test
    void sinTipoSeRegistraComoDeposito() {
        assertEquals(TipoUbicacion.DEPOSITO, service.registrar(Ubicacion.nueva("UB-X", "X", null, null)).getTipo());
    }

    @Test
    void rechazaCodigoRepetido() {
        service.registrar(Ubicacion.nueva("UB-CENTRAL", "Central", TipoUbicacion.ALMACEN_CENTRAL, null));
        assertThrows(CodigoUbicacionDuplicadoException.class,
                () -> service.registrar(Ubicacion.nueva("ub-central", "Otro", TipoUbicacion.DEPOSITO, null)));
    }

    @Test
    void rechazaUnSegundoAlmacenCentral() {
        service.registrar(Ubicacion.nueva("UB-CENTRAL", "Central", TipoUbicacion.ALMACEN_CENTRAL, null));
        assertThrows(AlmacenCentralDuplicadoException.class,
                () -> service.registrar(Ubicacion.nueva("UB-CENTRAL-2", "Central 2", TipoUbicacion.ALMACEN_CENTRAL, null)));
    }

    @Test
    void permiteVariosDepositos() {
        service.registrar(Ubicacion.nueva("UB-DEP-1", "Depósito 1", TipoUbicacion.DEPOSITO, null));
        service.registrar(Ubicacion.nueva("UB-DEP-2", "Depósito 2", TipoUbicacion.DEPOSITO, null));
        assertEquals(2, service.listar(TipoUbicacion.DEPOSITO).size());
        assertEquals(0, service.listar(TipoUbicacion.ALMACEN_CENTRAL).size());
    }

    /** Implementación en memoria del Port OUT, sólo para pruebas. */
    static class FakeUbicacionRepository implements UbicacionRepositoryPort {
        private final List<Ubicacion> datos = new ArrayList<>();
        private final AtomicLong secuencia = new AtomicLong();

        @Override
        public Ubicacion guardar(Ubicacion u) {
            var guardada = new Ubicacion(secuencia.incrementAndGet(), u.getCodigo(), u.getNombre(), u.getTipo(),
                    u.getDireccion(), u.isActivo());
            datos.add(guardada);
            return guardada;
        }

        @Override
        public Optional<Ubicacion> buscarPorId(Long id) {
            return datos.stream().filter(u -> u.getId().equals(id)).findFirst();
        }

        @Override
        public List<Ubicacion> listar(TipoUbicacion tipo) {
            return datos.stream().filter(u -> tipo == null || u.getTipo() == tipo).toList();
        }

        @Override
        public boolean existePorCodigo(String codigo) {
            return datos.stream().anyMatch(u -> u.getCodigo().equals(Ubicacion.normalizarCodigo(codigo)));
        }

        @Override
        public boolean existeAlmacenCentralActivo() {
            return datos.stream().anyMatch(u -> u.esAlmacenCentral() && u.isActivo());
        }
    }
}
