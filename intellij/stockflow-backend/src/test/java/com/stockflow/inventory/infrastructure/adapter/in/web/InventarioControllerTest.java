package com.stockflow.inventory.infrastructure.adapter.in.web;

import com.stockflow.inventory.domain.model.Pagina;
import com.stockflow.inventory.domain.port.in.ConsultarInventarioUseCase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Contrato HTTP del filtro de fechas del kardex: formato ISO-8601 (con milisegundos, como envía el navegador). */
@WebMvcTest(InventarioController.class)
class InventarioControllerTest {

    @Autowired
    MockMvc mvc;

    @MockitoBean
    ConsultarInventarioUseCase consultar;

    @Test
    void convierteDesdeYHastaAInstantes() throws Exception {
        when(consultar.consultarKardex(anyLong(), any(), any(), anyInt(), anyInt()))
                .thenReturn(new Pagina<>(List.of(), 0, 20, 0, 0));
        mvc.perform(get("/api/inventario/kardex/1")
                        .param("desde", "2026-10-01T04:00:00.000Z")
                        .param("hasta", "2026-10-21T04:00:00Z"))
                .andExpect(status().isOk());
        verify(consultar).consultarKardex(1L, Instant.parse("2026-10-01T04:00:00Z"),
                Instant.parse("2026-10-21T04:00:00Z"), 0, 20);
    }

    @Test
    void sinFechasLlegaNullAlCasoDeUso() throws Exception {
        when(consultar.consultarKardex(anyLong(), any(), any(), anyInt(), anyInt()))
                .thenReturn(new Pagina<>(List.of(), 0, 20, 0, 0));
        mvc.perform(get("/api/inventario/kardex/1")).andExpect(status().isOk());
        verify(consultar).consultarKardex(eq(1L), isNull(), isNull(), eq(0), eq(20));
    }

    @Test
    void movimientosSemanalesUsaOchoSemanasEnUtcPorDefecto() throws Exception {
        when(consultar.resumenSemanal(anyInt(), any())).thenReturn(List.of());
        mvc.perform(get("/api/inventario/movimientos/semanal")).andExpect(status().isOk());
        verify(consultar).resumenSemanal(8, "UTC");
    }

    @Test
    void unaFechaMalFormadaEs400() throws Exception {
        mvc.perform(get("/api/inventario/kardex/1").param("desde", "ayer")).andExpect(status().isBadRequest());
        verify(consultar, never()).consultarKardex(anyLong(), any(), any(), anyInt(), anyInt());
    }
}
