# StockFlow — Gestión de Inventario, Compras Internas y Movimientos de Almacén

**Código de proyecto:** PA-06
**Asignatura:** Programación Aplicada 2026-2
**Tipo:** Proyecto integrador full-stack (Web + Móvil)

---

## 1. Problema

Una pyme con un almacén central y dos depósitos actualmente gestiona sus existencias de forma manual y desordenada, sin un sistema que centralice la información. Esto genera:

- Falta de trazabilidad sobre entradas, salidas y transferencias de productos entre ubicaciones.
- Ausencia de alertas confiables ante niveles críticos de stock.
- Descontrol en las solicitudes internas de materiales/productos, sin un flujo formal de aprobación.
- Imposibilidad de auditar quién movió qué, cuándo y por qué.

El cliente requiere una solución digital que reemplace este proceso manual por un sistema transaccional confiable y auditable.

## 2. Objetivo

Construir un sistema de inventario transaccional que permita:

- Gestionar productos, categorías y ubicaciones (almacén central + 2 depósitos).
- Registrar movimientos de stock (entradas, salidas, transferencias) de forma auditable.
- Mantener el stock por ubicación, actualizado únicamente a través de movimientos válidos (nunca editado directamente).
- Administrar solicitudes internas con un flujo de aprobación (Solicitante → Supervisor → Almacén).
- Generar alertas de stock mínimo por producto/ubicación.
- Ofrecer trazabilidad completa mediante kardex y reportes operativos.

El sistema se implementará como un **monolito modular con arquitectura hexagonal simplificada**, con backend en Java 21 + Spring Boot, base de datos PostgreSQL, frontend web en React + TypeScript y aplicación móvil en React Native + TypeScript.

## 3. Actores

| Actor | Responsabilidad principal |
|---|---|
| **Administrador** | Configura catálogos, usuarios y parámetros; supervisa la operación completa. |
| **Encargado de almacén** | Opera los procesos diarios: registra movimientos, atiende solicitudes, gestiona transferencias. |
| **Solicitante interno** | Crea solicitudes de productos/materiales, consulta su estado y stock disponible. |
| **Supervisor** | Aprueba o rechaza solicitudes; tiene visibilidad ampliada y trazabilidad de las operaciones. |

## 4. Alcance funcional

El sistema cubrirá los siguientes módulos:

- **Productos** — catálogo con código único.
- **Categorías** — clasificación de productos.
- **Ubicaciones** — almacén central y depósitos.
- **Stock** — existencias por producto/ubicación (modificable solo vía movimientos).
- **Movimientos** — entradas, salidas y transferencias, todos auditables.
- **Solicitudes internas** — ciclo BORRADOR → ENVIADA → APROBADA/RECHAZADA → ATENDIDA/CANCELADA.
- **Transferencias** — movimiento entre ubicaciones (salida en origen + entrada en destino, en una misma transacción lógica).
- **Aprobaciones** — flujo de autorización de solicitudes por parte del Supervisor.
- **Alertas** — notificación de stock por debajo del mínimo configurado, por producto/ubicación.
- **Reportes** — indicadores operativos y kardex de movimientos.

### Flujo crítico principal
> Solicitante crea solicitud → Supervisor aprueba → Almacén atiende mediante movimiento → Stock se actualiza → Kardex y alerta reflejan el resultado.

### Función de IA (Spring AI) — uso acotado
Asistente **opcional** y complementario para resumir tendencias de movimientos y explicar anomalías simples a partir de datos agregados. No participa en decisiones autónomas de compra ni sustituye reglas de negocio deterministas. Debe estar encapsulado detrás de una interfaz/puerto, con manejo de errores, timeout y fallback.

## 5. Exclusiones (fuera de alcance)

- **No se implementará contabilidad**, cuentas por pagar ni facturación fiscal.
- **No se procesarán pagos** ni información bancaria.
- **No se permitirá editar el stock directamente**: todo cambio debe originarse en un movimiento válido.
- **No se permitirá stock negativo**, salvo configuración explícita del proyecto (deshabilitada por defecto).
- No se construirán microservicios (arquitectura definida: monolito modular hexagonal simplificado).
- La función de IA no reemplaza validaciones ni reglas de negocio deterministas.

## 6. Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Java 21 + Spring Boot |
| Base de datos | PostgreSQL (con migraciones) |
| Web | React + TypeScript |
| Móvil | React Native + TypeScript |
| Contenedores | Docker / Docker Compose |
| CI/CD | GitHub Actions |
| IA complementaria | Spring AI (uso acotado, con fallback) |
| Arquitectura | Monolito modular, hexagonal simplificada |

## 7. Estado actual (2026-10-03)

🟡 **Parte I – Parcial 1 en curso.** Documentación de dominio y datos completa; base de datos implementada con migraciones; backend con catálogo, ubicaciones y el lado de lectura del flujo crítico. **Faltan la aplicación web y la móvil.**

Exigencias del Parcial 1 (ficha PA-06, sección N):
- [x] Documento de visión y contexto del cliente — `docs/01-vision/vision-v0.1.md`
- [x] Matriz de actores, objetivos y responsabilidades — `docs/01-vision/vision-v0.1.md`
- [x] Catálogo de requisitos funcionales y no funcionales — `docs/02-requirements/requisitos-v0.1.md`
- [x] Reglas de negocio numeradas (RN-01 a RN-08) — este README y `docs/04-model/decisiones-integridad-v0.1.md`
- [x] Mapa de historias y casos de uso — `docs/02-requirements/mapa-historias-v0.1.md`
- [x] Modelo conceptual, DER lógico y diccionario de datos — `docs/04-model/`
- [x] Decisiones de arquitectura — `docs/03-decisions/` (convención Git: propuesta pendiente de acuerdo)
- [x] Backlog priorizado con criterios de aceptación — `docs/02-requirements/backlog-v0.1.md`
- [x] Docker Compose con PostgreSQL y migraciones Flyway (V1 esquema, V2 semilla, V3 protección del histórico)
- [x] Backend con módulos y casos de uso funcionando (categorías, productos, ubicaciones, consulta de stock y kardex)
- [x] API documentada: Swagger UI y `requests.http`
- [ ] Esqueleto del flujo crítico completo en el backend (hoy: lectura de stock/kardex; solicitudes y movimientos en SQL)
- [ ] Aplicación web React + TypeScript (shell, layout y 1-2 pantallas conectadas)
- [ ] Aplicación móvil React Native + TypeScript (compilable, navegación y una pantalla)

Detalle por requisito: `docs/02-requirements/requisitos-v0.1.md`.

## 8. Cómo ejecutarlo

Requisitos: Java 21, Maven (o IntelliJ IDEA) y Docker.

```bash
docker compose up -d                  # PostgreSQL 16 en localhost:5432 (base y usuario stockflow_admin)
cd intellij/stockflow-backend
mvn spring-boot:run                   # Flyway crea el esquema y la semilla; API en http://localhost:8080
```

- Probar la API: http://localhost:8080/swagger-ui.html o `intellij/stockflow-backend/requests.http` (IntelliJ).
- Pruebas automáticas: `mvn test` (las de integración usan Docker; si no hay Docker, se omiten).
- Verificación SQL y flujo crítico: `datagrip/03_verificacion_y_pruebas.sql` en DataGrip.
- Credenciales: la clave por defecto es sólo de laboratorio. Para otra, crea un archivo `.env` (ignorado por git) con `DB_PASSWORD=...`.

Detalles del backend, contrato HTTP y decisiones: `intellij/stockflow-backend/README.md`.

## 9. Estructura del repositorio

```
StockFlow/
├── docker-compose.yml          PostgreSQL 16
├── docs/
│   ├── 01-vision/              visión y glosario
│   ├── 02-requirements/        backlog con criterios, requisitos RF/RNF, mapa de historias
│   ├── 03-decisions/           decisiones de arquitectura (ADR)
│   ├── 04-model/               modelo conceptual, relacional, DER, diccionario, físico
│   └── ENTREGA.md              guía de entrega y orden de trabajo
├── datagrip/                   00_admin (sin Docker) y 03_verificacion_y_pruebas.sql
└── intellij/
    ├── stockflow-backend-lab/  Java 21 puro (capítulos 01-02)
    └── stockflow-backend/      Spring Boot (capítulos 03-08), migraciones en src/main/resources/db/migration
```

---
