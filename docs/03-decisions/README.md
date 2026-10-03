# Registro de decisiones técnicas (ADR) — StockFlow (PA-06)

Cada decisión importante queda en un archivo corto con su **contexto**, la **decisión**, las **alternativas** descartadas y las **consecuencias**. Sirve para que cualquier integrante pueda justificar en la defensa una decisión que no tomó personalmente.

| ADR | Decisión | Estado |
|---|---|---|
| [001](ADR-001-monolito-modular-hexagonal.md) | Monolito modular con arquitectura hexagonal simplificada | Aceptada |
| [002](ADR-002-migraciones-flyway-y-validate.md) | Esquema versionado con Flyway; Hibernate sólo valida | Aceptada |
| [003](ADR-003-relacion-1n-unidireccional.md) | Relación Categoría 1:N Producto unidireccional (`@ManyToOne`, sin `@OneToMany`) | Aceptada |
| [004](ADR-004-delete-protegido-por-fk.md) | DELETE físico protegido por las FK, sin `CascadeType`; retirar con `activo = false` | Aceptada |
| [005](ADR-005-stock-solo-por-movimientos.md) | El stock es de sólo lectura y cambia sólo por movimientos (RN-01) | Aceptada |
| [006](ADR-006-contrato-de-errores.md) | Contrato único de errores y códigos 400/404/409/422/500 | Aceptada |
| [007](ADR-007-atender-solicitud-como-salida.md) | Atender una solicitud = SALIDA del almacén central para consumo | Aceptada |
| [008](ADR-008-convenciones-git.md) | Convenciones de Git, ramas y pull requests | **Propuesta** (pendiente de acuerdo del equipo) |

## Plantilla

```markdown
# ADR-NNN — Título
**Estado:** Propuesta | Aceptada | Reemplazada por ADR-XXX · **Fecha:** AAAA-MM-DD

## Contexto
## Decisión
## Alternativas consideradas
## Consecuencias
```
