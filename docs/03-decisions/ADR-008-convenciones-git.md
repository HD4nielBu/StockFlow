# ADR-008 — Convenciones de Git, ramas y pull requests
**Estado:** Propuesta (pendiente de acuerdo del equipo) · **Fecha:** 2026-10-03

## Contexto
La guía formal y el banco piden colaboración verificable: tareas con responsable, commits pequeños, ramas, pull requests revisados por otro integrante y una rama estable demostrable. Hoy el repositorio tiene una rama por integrante (`Bruno`, `David`, `Emanuel`, `Gabriel`, `Hector`, `Samuel`, `Testing`), `main` está desactualizada desde agosto y no hay pull requests ni issues.

## Decisión propuesta
1. **`main` es la rama estable**: siempre compila, pasa las pruebas y es la que se presenta en cada corte. Nadie hace push directo a `main`.
2. **Una rama por tarea**, creada desde `main`: `feat/<tema>`, `fix/<tema>`, `docs/<tema>` (por ejemplo `feat/movimientos`). Las ramas por persona se reemplazan gradualmente por ramas por tarea.
3. **Pull request a `main`** con descripción (qué, por qué, cómo probarlo) y **revisión de otro integrante** antes de integrar.
4. **Commits pequeños** con el formato `tipo: descripción` (`feat`, `fix`, `docs`, `test`, `refactor`).
5. **Un issue por tarea** del backlog (P0-xx), con responsable y criterio de aceptación.
6. **Nunca versionar secretos** (`.env`, `credenciales.env`, tokens); ver `.gitignore`.

## Alternativas consideradas
- **Seguir con una rama por integrante:** dificulta integrar, genera conflictos grandes (por ejemplo, `David` diverge de `main` en los mismos documentos) y no deja evidencia de revisión.

## Consecuencias
- Requiere acordarlo en equipo y activar la protección de `main` en GitHub (Settings → Branches).
- Primer paso sugerido: un PR de `Hector` → `main` revisado por otro integrante.
