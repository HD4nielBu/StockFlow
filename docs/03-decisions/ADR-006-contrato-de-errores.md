# ADR-006 — Contrato único de errores
**Estado:** Aceptada · **Fecha:** 2026-09-29 (ampliada 2026-10-03)

## Contexto
Web y móvil deben reaccionar igual ante cualquier error (RNF-07). El Capítulo 08 pide un formato único y controllers sin `try/catch`.

## Decisión
- `GlobalExceptionHandler` (`@RestControllerAdvice`) devuelve siempre `ApiErrorResponse { timestamp, status, error, message, path, fieldErrors }`.
- Correspondencia de códigos:

| Código | Cuándo | Ejemplo |
|---|---|---|
| 400 | El formato de la petición es inválido (`@Valid`, JSON mal formado, tipo de parámetro) | código vacío, `unidadMedida: "BARRIL"`, `/api/productos/abc` |
| 404 | El recurso referido no existe | producto 999, categoría padre inexistente |
| 409 | Conflicto con datos existentes | código duplicado (RN-06), DELETE bloqueado por FK, segundo almacén central |
| 422 | Petición bien formada que viola una regla de negocio | categoría inactiva, stock mínimo negativo, dato inválido en el dominio, página fuera de rango |
| 500 | Error no previsto | se registra en el log; el cliente recibe sólo "Error interno del servidor" |

- Jerarquía en `shared/domain/exception`: `RecursoNoEncontradoException` (404), `ConflictoNegocioException` (409), `ReglaNegocioException` (422) y `DatoInvalidoException` (422, reemplaza a `IllegalArgumentException`).

## Alternativas consideradas
- **400 para toda regla de negocio:** mezcla "formato incorrecto" con "regla violada".
- **Devolver el mensaje de PostgreSQL:** filtra detalles internos (nombres de tablas, a veces datos).

## Consecuencias
- `ProductoControllerTest` verifica 201/400/404/409/422/204/500 y que el 500 no exponga detalles internos.
