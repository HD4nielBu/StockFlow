package com.stockflow.product.infrastructure.adapter.in.web;

import com.stockflow.category.domain.exception.CategoriaInactivaException;
import com.stockflow.product.domain.exception.CodigoProductoDuplicadoException;
import com.stockflow.product.domain.exception.ProductoEnUsoException;
import com.stockflow.product.domain.model.Producto;
import com.stockflow.product.domain.model.UnidadMedida;
import com.stockflow.product.domain.port.in.ActualizarProductoUseCase;
import com.stockflow.product.domain.port.in.ConsultarProductoUseCase;
import com.stockflow.product.domain.port.in.EliminarProductoUseCase;
import com.stockflow.product.domain.port.in.RegistrarProductoUseCase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Optional;

import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Prueba del ADAPTADOR WEB (pregunta 49): contrato HTTP, validación @Valid, status, JSON y el
 * GlobalExceptionHandler. @WebMvcTest levanta sólo Spring MVC; los casos de uso son mocks,
 * así que no hay servicio real ni base de datos.
 */
@WebMvcTest(ProductoController.class)
class ProductoControllerTest {

    @Autowired
    MockMvc mvc;

    @MockitoBean
    RegistrarProductoUseCase registrar;
    @MockitoBean
    ConsultarProductoUseCase consultar;
    @MockitoBean
    ActualizarProductoUseCase actualizar;
    @MockitoBean
    EliminarProductoUseCase eliminar;

    private static final String CUERPO_VALIDO = """
            {"categoriaId": 1, "codigo": "prd-ofi-010", "nombre": "Cuaderno",
             "unidadMedida": "UNIDAD", "stockMinimoDefault": 25, "precioReferencial": 18.9}
            """;

    private Producto producto(long id) {
        return new Producto(id, 1L, "PRD-OFI-010", "Cuaderno", null, UnidadMedida.UNIDAD, 25,
                new BigDecimal("18.9"), true);
    }

    @Test
    void post201ConLocationYJson() throws Exception {
        when(registrar.registrar(any())).thenReturn(producto(7));
        mvc.perform(post("/api/productos").contentType(MediaType.APPLICATION_JSON).content(CUERPO_VALIDO))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", endsWith("/api/productos/7")))
                .andExpect(jsonPath("$.id").value(7))
                .andExpect(jsonPath("$.codigo").value("PRD-OFI-010"))
                // el dominio normaliza a NUMERIC(12,2): 18.9 -> 18.90
                .andExpect(content().string(containsString("\"precioReferencial\":18.90")));
    }

    @Test
    void post400ConErroresPorCampoYSinLlegarAlCasoDeUso() throws Exception {
        mvc.perform(post("/api/productos").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"categoriaId\": 1, \"codigo\": \"\", \"nombre\": \"X\", \"stockMinimoDefault\": -1}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.fieldErrors.codigo").exists())
                .andExpect(jsonPath("$.fieldErrors.stockMinimoDefault").exists());
        verify(registrar, never()).registrar(any());
    }

    @Test
    void post400SiLaUnidadNoExisteEnElEnum() throws Exception {
        mvc.perform(post("/api/productos").contentType(MediaType.APPLICATION_JSON)
                        .content(CUERPO_VALIDO.replace("UNIDAD", "BARRIL")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void post409SiElCodigoEstaRepetido() throws Exception {
        when(registrar.registrar(any())).thenThrow(new CodigoProductoDuplicadoException("PRD-OFI-010"));
        mvc.perform(post("/api/productos").contentType(MediaType.APPLICATION_JSON).content(CUERPO_VALIDO))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value(containsString("RN-06")));
    }

    @Test
    void getListadoCompleto200() throws Exception {
        when(consultar.listarTodos()).thenReturn(java.util.List.of(producto(7), producto(8)));
        mvc.perform(get("/api/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].categoriaId").value(1));
    }

    @Test
    void get404SiNoExiste() throws Exception {
        when(consultar.buscarPorId(99L)).thenReturn(Optional.empty());
        mvc.perform(get("/api/productos/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.path").value("/api/productos/99"));
    }

    @Test
    void get400SiElIdNoEsNumerico() throws Exception {
        mvc.perform(get("/api/productos/abc")).andExpect(status().isBadRequest());
    }

    @Test
    void put422SiLaCategoriaDestinoEstaInactiva() throws Exception {
        when(actualizar.actualizar(eq(7L), any())).thenThrow(new CategoriaInactivaException(2L));
        mvc.perform(put("/api/productos/7").contentType(MediaType.APPLICATION_JSON)
                        .content(CUERPO_VALIDO.replace("}", ", \"activo\": true}")))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    void put400SiFaltaActivo() throws Exception {
        mvc.perform(put("/api/productos/7").contentType(MediaType.APPLICATION_JSON).content(CUERPO_VALIDO))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.activo").exists());
    }

    @Test
    void delete204SinCuerpo() throws Exception {
        mvc.perform(delete("/api/productos/7"))
                .andExpect(status().isNoContent())
                .andExpect(content().string(""));
    }

    @Test
    void delete409SiTieneStockOMovimientos() throws Exception {
        doThrow(new ProductoEnUsoException(1L)).when(eliminar).eliminar(1L);
        mvc.perform(delete("/api/productos/1")).andExpect(status().isConflict());
    }

    /** Capítulo 08: error no controlado -> 500 con mensaje genérico, sin filtrar detalles internos. */
    @Test
    void errorNoControlado500SinExponerElDetalleInterno() throws Exception {
        when(consultar.buscarPorId(anyLong()))
                .thenThrow(new RuntimeException("password=secreta en jdbc:postgresql://..."));
        mvc.perform(get("/api/productos/1"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Error interno del servidor"))
                .andExpect(content().string(not(containsString("secreta"))));
    }
}
