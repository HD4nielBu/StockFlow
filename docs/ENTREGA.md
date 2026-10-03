# StockFlow — Proyecto PA-06 · Programación Aplicada 2026-2

Inventario, compras internas y movimientos de almacén. Entrega acumulada hasta el Capítulo 08 (Clases 02-08 + Capítulos 01-08) y ficha PA-06, Parte I.

Par 1:N del backend: **Categoria (padre) → Producto (dependiente)**, FK `producto.categoria_id`.

## Contenido
```
StockFlow/
├── docs/01-vision/                 Clase 01: visión y glosario
├── docs/02-requirements/           backlog con criterios de aceptación, requisitos RF/RNF, mapa de historias
├── docs/03-decisions/              decisiones de arquitectura (ADR-001 a ADR-008)
├── docs/04-model/                  Clases 02 a 05 (documentación del modelo)
│   ├── model-conceptual-v0.1.md        Clase 02
│   ├── model-relational-v0.1.md        Clase 03
│   ├── der-logico-v0.1.md              Clase 04 (DER en Mermaid)
│   ├── diccionario-datos-v0.1.md       Clase 04
│   ├── decisiones-integridad-v0.1.md   Clase 04
│   ├── convenciones-bd-v0.1.md         Clase 05
│   ├── modelo-fisico-v0.1.md           Clase 05
│   └── plan-migracion-v1.md            Clase 05
├── docker-compose.yml              PostgreSQL 16 (base stockflow, usuario stockflow_admin)
├── datagrip/
│   ├── 00_admin_crear_usuario_y_base.sql   (sólo si NO usas Docker; como postgres)
│   └── 03_verificacion_y_pruebas.sql       (JOIN Cap. 07, 18 pruebas negativas, flujo crítico idempotente, kardex y alertas)
└── intellij/
    ├── stockflow-backend-lab/      Capítulos 01 y 02 (Java 21 puro)
    └── stockflow-backend/          Capítulos 03 a 08 (Spring Boot)
        └── src/main/resources/db/migration/   (las aplica Flyway al arrancar)
            ├── V1__creacion_completa_stockflow.sql (17 tablas + vista kardex)
            ├── V2__datos_semilla.sql
            └── V3__proteger_historico_y_alertas.sql
```

## Orden de trabajo
1. **Base de datos** → en la raíz: `docker compose up -d`.
   Sin Docker: en DataGrip con la conexión postgres/postgres ejecutar `00_admin_crear_usuario_y_base.sql` (cambia la clave).
2. **IntelliJ** → abrir `stockflow-backend` y ejecutar `StockFlowApplication`.
   Flyway crea el esquema (V1) y carga la semilla (V2); ya no se ejecutan a mano.
3. **DataGrip · conexión** `localhost:5432`, base `stockflow`, usuario `stockflow_admin` → Refresh:
   `stockflow > Schemas > stockflow > Tables` debe mostrar 17 tablas, `flyway_schema_history` y la vista `vw_kardex`.
4. Probar `requests.http` en orden (incluye PUT, DELETE y CORS).
5. **IntelliJ** → abrir `stockflow-backend-lab` y ejecutar `Main`.
6. Volver a DataGrip y ejecutar `03_verificacion_y_pruebas.sql` (secciones 5, 6 y 8 al 10).

## Reglas de negocio y dónde viven
| Regla | Protección |
|---|---|
| RN-01 stock sólo por movimientos | transacción en backend + trigger que impide borrar movimientos |
| RN-02 movimiento válido | NOT NULL + `ck_movimiento_cantidad` + `ck_movimiento_ref_*` |
| RN-03 sin stock negativo | `ck_stock_no_negativo`, `ck_movimiento_saldo`, parámetro `PERMITIR_STOCK_NEGATIVO` |
| RN-04 transferencia = salida + entrada | `ck_transferencia_ubicaciones` + transacción |
| RN-05 estados de solicitud | CHECK + `historial_estado_solicitud` + validación de transición |
| RN-06 código de producto único | `uq_producto_codigo` + validación en el caso de uso (409) |
| RN-07 alertas por producto/ubicación | `stock.stock_minimo` + tabla `alerta_stock` + índice parcial |
| RN-08 sin contabilidad | decisión de alcance: no existen tablas de facturación |

## Verificado antes de entregar
- V1 + V2 aplicados por Flyway en PostgreSQL 16: 17 tablas, vista kardex y semilla cargada.
- Las 18 pruebas negativas SQL fallan con la constraint, trigger o índice esperado.
- El flujo crítico (solicitud → aprobación → movimiento → stock → kardex → alerta) se ejecuta completo en una transacción.
- Laboratorio Java compilado y ejecutado con Java 21.
- Backend compilado y 57 pruebas pasando: dominio, casos de uso, controller (`@WebMvcTest`) e integración con PostgreSQL 16 (Testcontainers: Flyway V1-V3, `mappedBy` y LAZY, consultas nativas, FK, triggers).

## Importante para la defensa
Revisa "Respuestas de defensa rápidas" en `intellij/stockflow-backend/README.md` y los documentos de `docs/04-model`. No subas la contraseña real a GitHub.
