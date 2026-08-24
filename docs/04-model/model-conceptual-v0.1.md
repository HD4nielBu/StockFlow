# Modelo conceptual v0.1 — StockFlow

## 1. Objetivo
Identificar entidades núcleo, atributos, relaciones y cardinalidades para la gestión de inventarios y movimientos.

## 2. Fuente analizada
Ficha PA-06 (StockFlow).

## 3. Entidades núcleo v0.1
### Producto
Responsabilidad: Catálogo de artículos físicos.
Atributos: Código único, nombre, descripción, umbral mínimo.

### Categoria
Responsabilidad: Agrupación de productos.
Atributos: Nombre, descripción.

### Ubicacion
Responsabilidad: Lugar físico de almacenamiento.
Atributos: Nombre, tipo (Central, Depósito).

### Stock
Responsabilidad: Cantidad actual de un producto en una ubicación.
Atributos: Cantidad.

### MovimientoInventario
Responsabilidad: Transacción auditable que altera el stock.
Atributos: Tipo (Entrada/Salida/Transferencia), cantidad, fecha, usuario, referencia.

### Solicitud
Responsabilidad: Petición de material interno.
Atributos: Estado (Borrador, Enviada, Aprobada, Rechazada, Atendida, Cancelada), fecha.

## 4. Relaciones y Cardinalidades
- **Categoria (1)** a **Producto (N)**: Un producto pertenece a una categoría.
- **Producto (1)** a **Stock (N)**: Un producto tiene stock en varias ubicaciones.
- **Ubicacion (1)** a **Stock (N)**: Una ubicación alberga stock de varios productos.
- **Producto (1)** a **MovimientoInventario (N)**: Un producto registra múltiples movimientos.
- **Solicitud (1)** a **ItemSolicitud (N)**: Una solicitud contiene varios ítems requeridos.

## 5. Reglas iniciales de integridad
- RN-01: El stock cambia únicamente por movimientos válidos.
- RN-02: Movimientos tienen cantidad positiva.
- RN-03: No se permite stock negativo.
- RN-06: Producto tiene código único.
