# Diccionario de datos v0.1 — StockFlow (Clase 04)

## categoria
| Atributo | Significado | Obligatorio | Rol | Dominio/regla | Origen |
|---|---|---|---|---|---|
| categoria_id | Identificador técnico | Sí: identifica la fila | PK | autogenerado | Diseño |
| codigo | Código corto del catálogo (CAT-OFI) | Sí | UQ | letras, números y guion | RF-06 |
| nombre | Nombre visible de la categoría | Sí | UQ | ≤100, no vacío | RF-06 |
| descripcion | Detalle de qué agrupa | No | — | texto | RF-06 |
| activo | Si admite nuevos productos | Sí | — | boolean | RF-06 |
| created_at / updated_at | Auditoría mínima | Sí | — | instante | RF-04 |

## producto
| Atributo | Significado | Obligatorio | Rol | Dominio/regla | Origen |
|---|---|---|---|---|---|
| producto_id | Identificador técnico | Sí | PK | autogenerado | Diseño |
| categoria_id | Categoría a la que pertenece | Sí: todo producto se clasifica | FK | debe existir y estar activa | RF-05 |
| codigo | Código de inventario | Sí | UQ | RN-06; se guarda en mayúsculas | RN-06 |
| nombre | Nombre del artículo | Sí | — | ≤140 | RF-05 |
| descripcion | Detalle o presentación | No | — | texto | RF-05 |
| unidad_medida | Cómo se cuenta | Sí | CK | UNIDAD, CAJA, PAQUETE, KILOGRAMO, LITRO, METRO | RF-05 |
| stock_minimo_default | Mínimo sugerido al crear existencias | Sí | CK ≥ 0 | entero | RN-07 |
| precio_referencial | Valor estimado para reportes | No: no siempre se conoce | CK ≥ 0 | NUMERIC(12,2) | RF-14 |
| activo | Si sigue vigente en el catálogo | Sí | — | boolean | RF-05 |

## ubicacion
| Atributo | Significado | Obligatorio | Rol | Dominio/regla | Origen |
|---|---|---|---|---|---|
| ubicacion_id | Identificador técnico | Sí | PK | — | Diseño |
| codigo | Código del almacén/depósito | Sí | UQ | — | RF-07 |
| tipo | Clase de ubicación | Sí | CK | ALMACEN_CENTRAL, DEPOSITO, PUNTO_CONSUMO | A, RF-07 |

## stock
| Atributo | Significado | Obligatorio | Rol | Dominio/regla | Origen |
|---|---|---|---|---|---|
| producto_id / ubicacion_id | Qué y dónde | Sí | FK, UQ compuesta | una fila por par | RF-08 |
| cantidad | Existencia actual | Sí | CK ≥ 0 | sólo cambia por movimientos | RN-01, RN-03 |
| stock_minimo | Mínimo de esa ubicación | Sí | CK ≥ 0 | dispara alertas | RN-07 |

## movimiento_inventario
| Atributo | Significado | Obligatorio | Rol | Dominio/regla | Origen |
|---|---|---|---|---|---|
| tipo | Naturaleza del movimiento | Sí | CK | 6 valores permitidos | RN-02 |
| cantidad | Unidades movidas | Sí | CK > 0 | nunca negativa | RN-02 |
| saldo_resultante | Existencia después del movimiento | Sí | CK ≥ 0 | reproduce el kardex | RF-19 |
| usuario_id | Quién lo registró | Sí | FK | — | RN-02, RF-04 |
| referencia_tipo | Origen del movimiento | Sí | CK | MANUAL, SOLICITUD, TRANSFERENCIA, AJUSTE | RN-02 |
| solicitud_id | Solicitud atendida | Condicional | FK, CK | obligatorio si referencia_tipo = SOLICITUD | RF-18 |

## solicitud
| Atributo | Significado | Obligatorio | Rol | Dominio/regla | Origen |
|---|---|---|---|---|---|
| codigo | Código visible | Sí | UQ | SOL-AAAA-NNNN | RF-10 |
| solicitante_id | Quién pide | Sí | FK | — | RF-10 |
| estado | Punto del ciclo | Sí | CK | 6 estados de RN-05 | RN-05 |
| enviada_at | Cuándo se envió | Condicional | CK | obligatorio salvo en BORRADOR | RF-04 |
