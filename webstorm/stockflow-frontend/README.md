# StockFlow · Frontend (React + TypeScript + Vite)

Cliente web de **StockFlow (PA-06)**. Consume la API REST del backend Spring Boot
(`intellij/stockflow-backend`) y cubre la relación principal **Categoría (padre) 1:N Producto (hijo)**.
Sigue las guías G01–G10 del curso, adaptadas de Cliente → Vehículo a Categoría → Producto.

## Requisitos

| Herramienta | Versión probada |
|---|---|
| Node.js | 26.x (mínimo 20.19 o 22.12, por Vite 8) |
| npm | 12.x |
| Backend StockFlow | corriendo en `http://localhost:8080` con PostgreSQL (Docker) |

## Ejecutar

```bash
npm install          # sólo la primera vez, o cuando cambie package.json
npm run dev          # http://localhost:5173
```

El backend debe estar encendido antes (ver `guia-ejecucion-stockflow.pdf` en la raíz del repositorio).
Su `CorsConfig` sólo permite el origen `http://localhost:5173`.

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Revisa tipos (`tsc -b`) y genera `dist/` para producción |
| `npm run preview` | Sirve `dist/` para probar el build (puerto 4173, que el CORS **no** permite) |
| `npm run lint` | Análisis estático con oxlint |
| `npm test` | Vitest en modo observación |
| `npm run test:run` | Vitest una sola vez (28 pruebas) |

## Configuración

| Archivo | `VITE_API_URL` |
|---|---|
| `.env.development` | `http://localhost:8080/api` |
| `.env.production` | URL pública de la API (ejemplo) |
| `.env.local` | Opcional, sólo en tu máquina; no se sube a git |

Sólo las variables con prefijo `VITE_` llegan al navegador, así que **nunca** se ponen claves ni contraseñas aquí.
Después de editar un `.env` hay que reiniciar `npm run dev`.

## Funcionalidad

| Ruta | Pantalla | Endpoints |
|---|---|---|
| `/` | Dashboard: métricas y stock bajo el mínimo (RF-20) | `GET /categorias`, `GET /productos`, `GET /inventario/stock?soloBajoMinimo=true` |
| `/categorias` | CRUD de categorías, búsqueda, filtro por estado, paginación | `GET`, `GET /{id}`, `POST`, `PUT /{id}`, `DELETE /{id}` |
| `/productos` | CRUD de productos, select de categoría, filtros, paginación | `GET`, `GET /{id}`, `POST`, `PUT /{id}`, `DELETE /{id}` |
| `*` | Página 404 | — |

Las reglas del backend se respetan y sus errores se muestran tal cual:
- **409** al borrar una categoría con productos o un producto con stock. La fila **no** se quita de la tabla.
- **409** por un código repetido.
- **422** al asignar un producto a una categoría inactiva.
- **400** con `fieldErrors`, que aparecen junto a cada campo.

## Estructura

```
src/
├── api/apiClient.ts          # única puerta HTTP: URL base, JSON, response.ok, ApiError
├── app/                      # App y AppErrorBoundary
├── components/common/        # Header, Sidebar
├── components/ui/            # Button, Modal, ConfirmDialog, Pagination, SearchInput, ...
├── config/env.ts             # lee VITE_API_URL
├── features/
│   ├── categorias/           # models, types, services, hooks, utils, components, pages, data
│   ├── productos/            # ídem (entidad hija)
│   └── inventario/           # consulta de stock bajo para el dashboard
├── layouts/MainLayout.tsx    # Sidebar + Header + <Outlet />
├── pages/                    # Dashboard y NotFound
├── routes/AppRouter.tsx      # rutas de react-router
├── shared/                   # useAsyncList, paginar, isAbortError
├── styles/                   # tokens.css (design tokens) y global.css
└── test/setup.ts             # jest-dom, cleanup y simulación de <dialog> para jsdom
```

## Diferencias con las guías

- **Variable de entorno.** Se usa `VITE_API_URL` (G05/G10); la G01 la llamaba `VITE_API_BASE_URL`.
- **ESLint reemplazado por oxlint.** La plantilla de Vite 8 ya no trae ESLint.
- **`ApiError` sin *parameter properties*.** El tsconfig usa `erasableSyntaxOnly`, por eso los campos se declaran explícitamente.
- **Formularios precargados con `key`.** En vez de copiar las props al estado dentro de un `useEffect` (G04/G06), la Page renderiza el formulario con `key={editing?.id}`. React lo vuelve a montar al cambiar de registro, que es lo que React y oxlint recomiendan.
- **Reinicio de página desde los manejadores de eventos.** Los filtros devuelven a la página 1 desde sus manejadores de evento, no desde un Effect.
- **Error combinado del dashboard con `||`.** El dashboard usa `||` para combinar errores. La G10 usaba `??`, que no sirve porque `''` no es *nullish*.
