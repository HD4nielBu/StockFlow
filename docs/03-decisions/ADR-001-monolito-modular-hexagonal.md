# ADR-001 — Monolito modular con arquitectura hexagonal simplificada
**Estado:** Aceptada · **Fecha:** 2026-09-29

## Contexto
La ficha PA-06 y la guía formal fijan la arquitectura: un solo despliegue, organizado por módulos, que separe dominio, aplicación e infraestructura (RNF-04). El equipo aprende el stack desde cero; la complejidad operativa debe ser baja.

## Decisión
- Un único proyecto Spring Boot (`com.stockflow`) dividido en **módulos de negocio**: `category`, `product`, `location`, `inventory` y `shared`.
- Dentro de cada módulo: `domain` (modelo sin JPA, excepciones, **Ports IN** = casos de uso, **Ports OUT** = lo que el núcleo necesita), `application/service` (implementa los casos de uso) e `infrastructure/adapter` (`in/web` controllers y DTO, `out/persistence` JPA).
- Un módulo usa a otro **sólo a través de su Port IN** (por ejemplo, `ProductoService` → `ConsultarCategoriaUseCase`), nunca de su `JpaRepository`.

## Alternativas consideradas
- **Capas globales** (`controller/`, `service/`, `repository/`): más simple al inicio, pero mezcla módulos y no muestra límites.
- **Microservicios**: descartados por la cátedra; agregan red, despliegue distribuido y consistencia eventual sin un beneficio para este tamaño.

## Consecuencias
- Los casos de uso se prueban con Ports OUT falsos, sin Spring ni base (`*ServiceTest`).
- Hay más archivos por funcionalidad (DTO, mappers, ports).
- **Acoplamiento conocido:** `ProductoJpaEntity` (`@ManyToOne CategoriaJpaEntity`) y `ProductoPersistenceAdapter` (`getReferenceById` del repositorio de categorías) conocen la infraestructura de `category`. Está confinado a infraestructura y permite usar la FK con JPA. Para extraer `product` como servicio habría que cambiar la relación por `Long categoriaId` e implementar `ConsultarCategoriaUseCase` como cliente HTTP. El módulo `inventory` ya sigue ese estilo: mapea las FK como `Long`.
