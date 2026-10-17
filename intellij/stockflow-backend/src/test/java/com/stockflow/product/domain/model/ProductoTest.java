package com.stockflow.product.domain.model;

import com.stockflow.product.domain.exception.StockMinimoInvalidoException;
import com.stockflow.shared.domain.exception.DatoInvalidoException;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * Invariantes del dominio Producto: se prueban sin servicio, sin Spring y sin base.
 * (Antes la regla RN-07 se probaba "a través" del servicio, pero la excepción la lanzaba este constructor.)
 */
class ProductoTest {

    private Producto conPrecio(String precio) {
        return Producto.nuevo(1L, "PRD-OFI-001", "Resma", null, UnidadMedida.PAQUETE, 5,
                precio == null ? null : new BigDecimal(precio));
    }

    @Test
    void rechazaStockMinimoNegativoRN07() {
        assertThrows(StockMinimoInvalidoException.class,
                () -> Producto.nuevo(1L, "PRD-OFI-009", "X", null, UnidadMedida.UNIDAD, -1, null));
    }

    @Test
    void normalizaElPrecioADosDecimales() {
        assertEquals(new BigDecimal("10.50"), conPrecio("10.5").getPrecioReferencial());
        assertEquals(new BigDecimal("10.00"), conPrecio("10").getPrecioReferencial());
        assertEquals(new BigDecimal("10.50"), conPrecio("10.500").getPrecioReferencial());
    }

    @Test
    void precioNuloSignificaDesconocido() {
        assertNull(conPrecio(null).getPrecioReferencial());
    }

    @Test
    void rechazaPrecioConMasDeDosDecimales() {
        assertThrows(DatoInvalidoException.class, () -> conPrecio("10.555"));
    }

    @Test
    void rechazaPrecioNegativo() {
        assertThrows(DatoInvalidoException.class, () -> conPrecio("-1"));
    }

    @Test
    void rechazaCategoriaNulaComoDatoInvalidoYNoComoNullPointer() {
        assertThrows(DatoInvalidoException.class,
                () -> Producto.nuevo(null, "PRD-OFI-001", "X", null, UnidadMedida.UNIDAD, 0, null));
    }

    @Test
    void rechazaCodigoVacio() {
        assertThrows(DatoInvalidoException.class,
                () -> Producto.nuevo(1L, "  ", "X", null, UnidadMedida.UNIDAD, 0, null));
    }

    @Test
    void normalizaElCodigoAMayusculas() {
        assertEquals("PRD-OFI-001", Producto.nuevo(1L, " prd-ofi-001 ", "X", null, null, null, null).getCodigo());
    }
}
