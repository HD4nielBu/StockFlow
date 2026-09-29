# StockFlow — Proyecto PA-06 · Programación Aplicada 2026-2

Inventario, compras internas y movimientos de almacén. Entrega acumulada hasta el Capítulo 07 (Clases 02-05 + Capítulos 01-07).

Par 1:N del backend: **Categoria (padre) → Producto (dependiente)**, FK `producto.categoria_id`.

## Contenido
```
StockFlow/
├── docs/04-model/                  Clases 02 a 05 (documentación del modelo)
│   ├── model-conceptual-v0.1.md        Clase 02
│   ├── model-relational-v0.1.md        Clase 03
│   ├── der-logico-v0.1.md              Clase 04 (DER en Mermaid)
│   ├── diccionario-datos-v0.1.md       Clase 04
│   ├── decisiones-integridad-v0.1.md   Clase 04
│   ├── convenciones-bd-v0.1.md         Clase 05
│   ├── modelo-fisico-v0.1.md           Clase 05
│   └── plan-migracion-v1.md            Clase 05
├── datagrip/
│   ├── 00_admin_crear_usuario_y_base.sql   (como postgres)
│   ├── V1__creacion_completa_stockflow.sql (17 tablas + vista kardex)
│   ├── V2__datos_semilla.sql
│   └── 03_verificacion_y_pruebas.sql       (JOIN Cap. 07, 15 pruebas negativas, flujo crítico, kardex y alertas)
└── intellij/
    ├── stockflow-backend-lab/      Capítulos 01 y 02 (Java 21 puro)
    └── stockflow-backend/          Capítulos 03 a 07 (Spring Boot)
```

## Orden de trabajo
1. **DataGrip · conexión postgres/postgres** → ejecutar `00_admin_crear_usuario_y_base.sql` (cambia la clave).
2. **DataGrip · nueva conexión** `localhost:5432`, base `stockflow`, usuario `stockflow_admin` → ejecutar `V1`, luego `V2`.
3. Refresh → `stockflow > Schemas > stockflow > Tables` debe mostrar 17 tablas y la vista `vw_kardex`.
4. **IntelliJ** → abrir `stockflow-backend-lab` y ejecutar `Main`.
5. **IntelliJ** → abrir `stockflow-backend`, ejecutar `StockFlowApplication` y probar `requests.http`.
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
- V1 + V2 ejecutados en PostgreSQL 16: 17 tablas, vista kardex y semilla cargada.
- Las 15 pruebas negativas SQL fallan con la constraint esperada.
- El flujo crítico (solicitud → aprobación → movimiento → stock → kardex → alerta) se ejecuta completo en una transacción.
- Laboratorio Java compilado y ejecutado con Java 21.
- Backend compilado y 6 pruebas unitarias del caso de uso pasando.

## Importante para la defensa
Revisa "Respuestas de defensa rápidas" en `intellij/stockflow-backend/README.md` y los documentos de `docs/04-model`. No subas la contraseña real a GitHub.
