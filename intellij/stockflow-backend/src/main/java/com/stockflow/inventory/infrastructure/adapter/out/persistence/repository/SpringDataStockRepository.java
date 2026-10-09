package com.stockflow.inventory.infrastructure.adapter.out.persistence.repository;

import com.stockflow.inventory.infrastructure.adapter.out.persistence.entity.StockJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Consultas con @Query nativo: SQL de PostgreSQL escrito a mano porque combinan tres tablas
 * y una vista; un método derivado (findBy...) no puede expresarlas.
 * Los alias van entre comillas para conservar mayúsculas y coincidir con los getters de las proyecciones.
 */
public interface SpringDataStockRepository extends JpaRepository<StockJpaEntity, Long> {

    /** Proyección: Spring Data crea una implementación que lee cada alias de la fila. */
    interface ExistenciaFila {
        Long getStockId();
        Long getProductoId();
        String getCodigoProducto();
        String getProducto();
        Long getUbicacionId();
        String getCodigoUbicacion();
        String getUbicacion();
        BigDecimal getCantidad();
        BigDecimal getStockMinimo();
        Boolean getBajoMinimo();
    }

    interface KardexFila {
        Long getMovimientoId();
        Instant getOcurridoAt();
        String getUbicacion();
        String getTipo();
        BigDecimal getEntrada();
        BigDecimal getSalida();
        BigDecimal getSaldoResultante();
        String getReferenciaTipo();
        String getRegistradoPor();
        String getMotivo();
    }

    // CAST(:x AS BIGINT) IS NULL: PostgreSQL necesita conocer el tipo del parámetro cuando llega null
    @Query(value = """
            SELECT s.stock_id      AS "stockId",
                   p.producto_id   AS "productoId",
                   p.codigo        AS "codigoProducto",
                   p.nombre        AS "producto",
                   u.ubicacion_id  AS "ubicacionId",
                   u.codigo        AS "codigoUbicacion",
                   u.nombre        AS "ubicacion",
                   s.cantidad      AS "cantidad",
                   s.stock_minimo  AS "stockMinimo",
                   (s.cantidad <= s.stock_minimo) AS "bajoMinimo"
            FROM stockflow.stock s
            JOIN stockflow.producto  p ON p.producto_id  = s.producto_id
            JOIN stockflow.ubicacion u ON u.ubicacion_id = s.ubicacion_id
            WHERE (CAST(:productoId AS BIGINT) IS NULL OR s.producto_id = :productoId)
              AND (CAST(:ubicacionId AS BIGINT) IS NULL OR s.ubicacion_id = :ubicacionId)
              AND (:soloBajoMinimo = FALSE OR s.cantidad <= s.stock_minimo)
            ORDER BY p.codigo, u.codigo
            """, nativeQuery = true)
    List<ExistenciaFila> buscarExistencias(@Param("productoId") Long productoId,
                                           @Param("ubicacionId") Long ubicacionId,
                                           @Param("soloBajoMinimo") boolean soloBajoMinimo);

    // Con Pageable, Spring agrega LIMIT/OFFSET a la consulta y ejecuta countQuery para el total
    @Query(value = """
            SELECT k.movimiento_id    AS "movimientoId",
                   k.ocurrido_at      AS "ocurridoAt",
                   k.ubicacion        AS "ubicacion",
                   k.tipo             AS "tipo",
                   k.entrada          AS "entrada",
                   k.salida           AS "salida",
                   k.saldo_resultante AS "saldoResultante",
                   k.referencia_tipo  AS "referenciaTipo",
                   k.registrado_por   AS "registradoPor",
                   k.motivo           AS "motivo"
            FROM stockflow.vw_kardex k
            WHERE k.codigo_producto = :codigoProducto
            ORDER BY k.ocurrido_at, k.movimiento_id
            """,
            countQuery = "SELECT count(*) FROM stockflow.vw_kardex k WHERE k.codigo_producto = :codigoProducto",
            nativeQuery = true)
    Page<KardexFila> buscarKardex(@Param("codigoProducto") String codigoProducto, Pageable pageable);
}
