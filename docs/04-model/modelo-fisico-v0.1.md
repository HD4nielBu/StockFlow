# Modelo Físico v0.1 StockFlow

## producto
| Columna | Tipo candidato | NULL | Restricción |
|---|---|---|---|
| id | BIGINT | NO | PK |
| categoria_id | BIGINT | NO | FK a categoria |
| codigo | VARCHAR(50) | NO | UQ |
| nombre | VARCHAR(100) | NO | |
| activo | BOOLEAN | NO | DEFAULT TRUE |

## stock
| Columna | Tipo candidato | NULL | Restricción |
|---|---|---|---|
| id | BIGINT | NO | PK |
| producto_id | BIGINT | NO | FK a producto |
| ubicacion_id| BIGINT | NO | FK a ubicacion |
| cantidad | INTEGER | NO | CHECK (cantidad >= 0) |
*(Se añade UNIQUE(producto_id, ubicacion_id))*

## movimiento_inventario
| Columna | Tipo candidato | NULL | Restricción |
|---|---|---|---|
| id | BIGINT | NO | PK |
| producto_id | BIGINT | NO | FK a producto |
| ubicacion_id| BIGINT | NO | FK a ubicacion |
| tipo | VARCHAR(20) | NO | ENTRADA, SALIDA, TRANSF |
| cantidad | INTEGER | NO | CHECK (cantidad > 0) |
| fecha | TIMESTAMPTZ | NO | DEFAULT CURRENT_TIMESTAMP |
