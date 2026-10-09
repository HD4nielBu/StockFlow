# ADR-002 — Esquema versionado con Flyway; Hibernate sólo valida
**Estado:** Aceptada · **Fecha:** 2026-10-03

## Contexto
El esquema se diseñó primero en SQL (clases 02-06) y se ejecutaba a mano en DataGrip. El banco exige que el esquema evolucione mediante migraciones y que la solución sea reproducible desde el README.

## Decisión
- Los scripts viven en `intellij/stockflow-backend/src/main/resources/db/migration` y **Flyway los aplica al arrancar**: V1 (esquema), V2 (semilla), V3 (protección del histórico y alertas).
- `spring.jpa.hibernate.ddl-auto: validate`: Hibernate **no crea ni modifica** tablas; sólo verifica que las entidades coincidan con el esquema. La base manda; Java se adapta.
- Una migración aplicada **no se edita**; todo cambio va en una versión nueva.
- `docker-compose.yml` crea la base y el usuario; ya no hace falta `00_admin` cuando se usa Docker.

## Alternativas consideradas
- **`ddl-auto: update/create`**: genera el esquema desde las entidades; pierde CHECK, triggers, vistas y nombres de constraints, y no deja historia.
- **Liquibase**: equivalente, pero con XML/YAML; Flyway usa el SQL que el equipo ya escribió.

## Consecuencias
- Cualquier integrante obtiene la misma base con `docker compose up -d` + arrancar el backend.
- Una base creada a mano antes de Flyway debe recrearse (`docker compose down -v` o `DROP SCHEMA stockflow CASCADE`).
- Si alguien edita V1-V3 después de aplicadas, Flyway detecta el checksum distinto y el backend no arranca.
