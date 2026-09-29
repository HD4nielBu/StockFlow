# Modelo físico v0.1 — StockFlow (Clase 05)

Estrategia de IDs: BIGINT IDENTITY (simple y compatible con JPA IDENTITY). Las claves naturales (código de producto, de categoría, de ubicación) se protegen con UNIQUE porque pueden corregirse sin romper referencias.

## categoria
Propósito: agrupación del catálogo.
| Columna | Tipo candidato | NULL | Rol/Restricción | Fuente |
|---|---|---|---|---|
| categoria_id | BIGINT IDENTITY | NO | PK | Diseño |
| codigo | VARCHAR(30) | NO | UQ, CK no vacío | RF-06 |
| nombre | VARCHAR(100) | NO | UQ | RF-06 |
| descripcion | TEXT | SÍ | — | RF-06 |
| activo | BOOLEAN | NO | DEFAULT TRUE | RF-06 |
| created_at / updated_at | TIMESTAMPTZ | NO | DEFAULT now() | RF-04 |

## producto
| Columna | Tipo candidato | NULL | Rol/Restricción | Fuente |
|---|---|---|---|---|
| producto_id | BIGINT IDENTITY | NO | PK | Diseño |
| categoria_id | BIGINT | NO | FK → categoria | RF-05 |
| codigo | VARCHAR(40) | NO | UQ | RN-06 |
| nombre | VARCHAR(140) | NO | — | RF-05 |
| descripcion | TEXT | SÍ | — | RF-05 |
| unidad_medida | VARCHAR(20) | NO | CK dominio, DEFAULT UNIDAD | RF-05 |
| stock_minimo_default | INTEGER | NO | CK ≥ 0, DEFAULT 0 | RN-07 |
| precio_referencial | NUMERIC(12,2) | SÍ | CK ≥ 0 | RF-14 |
| activo | BOOLEAN | NO | DEFAULT TRUE | RF-05 |

### Decisiones
- `unidad_medida` es VARCHAR + CHECK y no un tipo ENUM de PostgreSQL: agregar valores no exige ALTER TYPE y JPA lo mapea con `@Enumerated(STRING)`.
- El precio es NUMERIC, nunca FLOAT (RN-08 no pide contabilidad, pero los reportes deben cuadrar).

### Regla que NO se resuelve sólo con constraint simple
- RN-01 (stock sólo por movimientos) y RN-05 (transiciones de estado).

## stock
| Columna | Tipo candidato | NULL | Rol/Restricción | Fuente |
|---|---|---|---|---|
| stock_id | BIGINT IDENTITY | NO | PK | Diseño |
| producto_id / ubicacion_id | BIGINT | NO | FK, UQ compuesta | RF-08 |
| cantidad | NUMERIC(14,3) | NO | CK ≥ 0, DEFAULT 0 | RN-03 |
| stock_minimo | NUMERIC(14,3) | NO | CK ≥ 0 | RN-07 |

## movimiento_inventario
| Columna | Tipo candidato | NULL | Rol/Restricción | Fuente |
|---|---|---|---|---|
| movimiento_id | BIGINT IDENTITY | NO | PK | Diseño |
| producto_id / ubicacion_id / usuario_id | BIGINT | NO | FK | RN-02 |
| tipo | VARCHAR(25) | NO | CK dominio | RN-02 |
| cantidad | NUMERIC(14,3) | NO | CK > 0 | RN-02 |
| saldo_resultante | NUMERIC(14,3) | NO | CK ≥ 0 | RN-03, RF-19 |
| referencia_tipo | VARCHAR(20) | NO | CK dominio + CK condicional | RN-02 |
| ocurrido_at | TIMESTAMPTZ | NO | DEFAULT now() | RF-04 |

Las 17 tablas y la vista `vw_kardex` están en `datagrip/V1__creacion_completa_stockflow.sql`.
