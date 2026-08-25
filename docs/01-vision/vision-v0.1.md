# Visión v0.1 StockFlow

## 1. Contexto
Una pyme con un almacén central y dos depósitos necesita controlar sus productos, ubicaciones y movimientos. 

## 2. Problema
El sistema actual no ofrece trazabilidad, no hay alertas confiables de stock bajo, y las solicitudes de materiales se pierden o carecen de aprobación formal.

## 3. Objetivo
Centralizar el inventario mediante un sistema transaccional con movimientos auditables y gestión de stock por ubicación.

## 4. Actores
### Administrador
Configura catálogos, ubicaciones, categorías, usuarios y supervisa.
### Encargado de almacén
Opera procesos diarios, registra movimientos físicos y atiende solicitudes.
### Solicitante interno
Crea solicitudes de materiales para uso interno, consulta stock.
### Supervisor
Aprueba solicitudes y coordina procesos específicos con visibilidad ampliada.

## 5. Alcance del MVP
1. Gestión de productos, categorías y ubicaciones.
2. Control de stock por ubicación (impidiendo stock negativo).
3. Registro de movimientos (entradas/salidas).
4. Solicitudes internas y ciclo de aprobación.
5. Transferencias entre almacenes.
6. Alertas automáticas de stock mínimo.
7. Kardex básico de movimientos.

## 6. Exclusiones
Contabilidad, cuentas por pagar, facturación fiscal.

## 7. Éxito inicial del proyecto
El MVP será exitoso cuando se pueda registrar una solicitud, aprobarla, atenderla mediante un movimiento transaccional, y reflejar el cambio en el kardex y en las alertas, desde web y móvil.
