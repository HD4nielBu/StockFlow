package com.stockflow.inventory.infrastructure.adapter.out.persistence.repository;

import com.stockflow.inventory.infrastructure.adapter.out.persistence.entity.StockJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
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

    interface SemanaFila {
        LocalDate getSemana();
        Long getEntradas();
        Long getSalidas();
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
              AND (CAST(:desde AS TIMESTAMPTZ) IS NULL OR k.ocurrido_at >= :desde)
              AND (CAST(:hasta AS TIMESTAMPTZ) IS NULL OR k.ocurrido_at < :hasta)
            ORDER BY k.ocurrido_at, k.movimiento_id
            """,
            countQuery = """
            SELECT count(*) FROM stockflow.vw_kardex k
            WHERE k.codigo_producto = :codigoProducto
              AND (CAST(:desde AS TIMESTAMPTZ) IS NULL OR k.ocurrido_at >= :desde)
              AND (CAST(:hasta AS TIMESTAMPTZ) IS NULL OR k.ocurrido_at < :hasta)
            """,
            nativeQuery = true)
    Page<KardexFila> buscarKardex(@Param("codigoProducto") String codigoProducto,
                                  @Param("desde") Instant desde,
                                  @Param("hasta") Instant hasta,
                                  Pageable pageable);

    /*
     * generate_series arma TODAS las semanas del rango (las vacías salen con 0) y el LEFT JOIN cuenta en cada una.
     * Sólo ENTRADA y SALIDA: las transferencias son internas (salida + entrada, RN-04) y los ajustes son correcciones.
     * date_trunc('week') empieza el lunes; AT TIME ZONE pasa el instante a la hora local de :zona.
     */
    @Query(value = """
            WITH semanas AS (
                SELECT generate_series(date_trunc('week', now() AT TIME ZONE :zona) - make_interval(weeks => :semanas - 1),
                                       date_trunc('week', now() AT TIME ZONE :zona),
                                       interval '1 week') AS inicio
            )
            SELECT CAST(s.inicio AS DATE) AS "semana",
                   count(m.movimiento_id) FILTER (WHERE m.tipo = 'ENTRADA') AS "entradas",
                   count(m.movimiento_id) FILTER (WHERE m.tipo = 'SALIDA')  AS "salidas"
            FROM semanas s
            LEFT JOIN stockflow.movimiento_inventario m
                   ON m.ocurrido_at AT TIME ZONE :zona >= s.inicio
                  AND m.ocurrido_at AT TIME ZONE :zona <  s.inicio + interval '1 week'
            GROUP BY s.inicio
            ORDER BY s.inicio
            """, nativeQuery = true)
    List<SemanaFila> contarMovimientosPorSemana(@Param("semanas") int semanas, @Param("zona") String zona);
}
