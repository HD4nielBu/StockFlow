# StockFlow · Frontend (React + TypeScript + Vite)

Cliente web de **StockFlow (PA-06)**. Consume la API REST del backend Spring Boot
(`intellij/stockflow-backend`) y cubre la relación principal **Categoría (padre) 1:N Producto (hijo)**,
además de existencias, kardex, ubicaciones y reportes.
Sigue las guías G01–G10 del curso, adaptadas de Cliente → Vehículo a Categoría → Producto.

> El rediseño completo de la interfaz (design system, layout, módulos nuevos, accesibilidad y pruebas)
> está documentado en [`docs/REDISENO-FRONTEND.md`](docs/REDISENO-FRONTEND.md).

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
Su `CorsConfig` sólo permite el origen `http://localhost:5173`; por eso `vite.config.ts` fija ese puerto con
`strictPort` (si está ocupado, Vite se detiene en vez de pasarse a 5174, donde todo fallaría por CORS).

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Revisa tipos (`tsc -b`) y genera `dist/` para producción |
| `npm run preview` | Sirve `dist/` en el puerto 4173. Usa la URL de `.env.production`, así que no sirve para probar contra el backend local |
| `npm run lint` | Análisis estático con oxlint |
| `npm test` | Vitest en modo observación |
| `npm run test:run` | Vitest una sola vez (96 pruebas en 27 archivos) |

## Configuración

| Archivo | `VITE_API_URL` |
|---|---|
| `.env.development` | `http://localhost:8080/api` |
| `.env.production` | URL pública de la API (ejemplo) |
| `.env.local` | Opcional, sólo en tu máquina; no se sube a git |

Sólo las variables con prefijo `VITE_` llegan al navegador, así que **nunca** se ponen claves ni contraseñas aquí.
Después de editar un `.env` hay que reiniciar `npm run dev`.

## Funcionalidad

**Datos reales** = endpoints del backend. **DEMO** = datos locales, siempre rotulados en la interfaz.
Nunca se muestra una cifra inventada como si fuera real.

| Ruta | Pantalla | Datos | Endpoints |
|---|---|---|---|
| `/login` | Acceso en **modo demostración** (no hay autenticación en el backend) | Demo + health real | `GET /health` |
| `/` | Inicio: saludo, accesos rápidos, indicadores, alertas, últimos productos | Real | `GET /categorias`, `/productos`, `/inventario/stock` |
| `/dashboard` | Indicadores y gráficos derivados | Real | ídem |
| `/categorias` | CRUD en modal, búsqueda, filtro de estado, paginación | Real | `GET`, `GET /{id}`, `POST`, `PUT /{id}`, `DELETE /{id}` |
| `/productos` | CRUD en modal, stock real por producto, filtro de categoría en la URL | Real | ídem + `GET /inventario/stock` |
| `/existencias` | Stock por producto y ubicación, cobertura del mínimo (sólo lectura) | Real | `GET /inventario/stock` |
| `/movimientos` | Kardex de un producto, paginado en el servidor | Real | `GET /inventario/kardex/{id}?pagina&tamano`, `GET /ubicaciones` |
| `/almacenes` | Ubicaciones con sus cifras de stock y alta de ubicaciones | Real | `GET /ubicaciones`, `POST /ubicaciones` |
| `/reportes` | Exportaciones CSV generadas en el navegador | Real | `GET /productos`, `/categorias`, `/inventario/stock` |
| `/usuarios` | Usuarios y roles (roles iguales a la semilla del backend) | **DEMO** | — (no hay endpoints) |
| `/configuracion` | Tema y estado de la API (reales); datos de la organización (demo, bloqueados) | Mixto | `GET /health` |
| `/perfil` | Datos de la sesión demo (se guardan sólo en el navegador) y tema | **DEMO** | — |
| `*` | Página 404 | — | — |

Las reglas del backend se respetan y sus errores se muestran con un título claro y su mensaje original:
- **409** al borrar una categoría con productos o un producto con stock. La fila **no** se quita de la tabla.
- **409** por un código repetido o un segundo almacén central.
- **422** al asignar un producto a una categoría inactiva o con un tamaño de página fuera de rango.
- **404** si el registro ya no existe: la lista se recarga.
- **400** con `fieldErrors`, que aparecen junto a cada campo.

### Modo demostración (sin autenticación real)

El backend todavía no tiene login. `/login` permite entrar con cualquier correo o usuario: **no se
verifican credenciales**, la contraseña no se envía ni se guarda, y sólo se recuerda el nombre y el correo a mostrar
(`sessionStorage`, o `localStorage` si se marca "Recordarme"). No hay *guard* de rutas: aparentaría una protección que
no existe. Todo vive en `src/features/auth/` para reemplazarlo cuando exista el endpoint real.

## Estructura

```
src/
├── api/                      # apiClient (única puerta HTTP), describirError, healthService, PaginaResponse
├── app/                      # App (providers), AppErrorBoundary, navigation.ts (menú), theme/ (claro/oscuro)
├── components/common/        # Sidebar, Header, Breadcrumbs, HeaderSearch, NotificationsMenu, UserMenu, ThemeMenu...
├── components/ui/            # biblioteca propia: Button, Field, Modal, Dropdown, Tooltip, Toast, DataTable, Tabs,
│                             #   Pagination, StatCard, BarList, StatusBar, Meter, Skeleton, EmptyState, PageHeader...
├── config/env.ts             # lee VITE_API_URL
├── features/
│   ├── auth/                 # sesión de demostración, Login y Perfil
│   ├── categorias/           # models, types, services, hooks, utils, components, pages, data
│   ├── productos/            # ídem (entidad hija)
│   ├── inventario/           # existencias, kardex, indicadores del dashboard
│   ├── ubicaciones/          # almacenes (listar + crear)
│   ├── reportes/             # exportación CSV
│   ├── usuarios/             # vista DEMO (modelo de roles del backend)
│   └── configuracion/
├── layouts/MainLayout.tsx    # Sidebar + Header + <Outlet /> (con Suspense para las rutas lazy)
├── pages/                    # Inicio, Dashboard, NotFound
├── routes/AppRouter.tsx      # rutas; cada página se carga bajo demanda (React.lazy)
├── shared/                   # useAsyncList, useAnchoredPosition, paginar, formato, storage
├── styles/                   # tokens.css, base.css, layout.css, components.css, pages.css
└── test/                     # setup, renderWithProviders, fixtures
```

## Diferencias con las guías

- **Variable de entorno.** Se usa `VITE_API_URL` (G05/G10); la G01 la llamaba `VITE_API_BASE_URL`.
- **ESLint reemplazado por oxlint.** La plantilla de Vite 8 ya no trae ESLint.
- **`ApiError` sin *parameter properties*.** El tsconfig usa `erasableSyntaxOnly`, por eso los campos se declaran explícitamente.
- **Formularios precargados con `key`.** En vez de copiar las props al estado dentro de un `useEffect` (G04/G06), la Page renderiza el formulario con `key={editing?.id}`. React lo vuelve a montar al cambiar de registro, que es lo que React y oxlint recomiendan.
- **Reinicio de página desde los manejadores de eventos.** Los filtros devuelven a la página 1 desde sus manejadores de evento, no desde un Effect.
- **Error combinado del dashboard con `||`.** El dashboard usa `||` para combinar errores. La G10 usaba `??`, que no sirve porque `''` no es *nullish*.
- **Formularios en modal con `key` por apertura.** El formulario se monta con un `key` nuevo cada vez que se abre el modal, en lugar de `key={editing?.id}`, para conservar la animación de cierre.
- **Mensajes de éxito con toasts.** Sustituyen a los `Alert` con `setTimeout` (que no se cancelaba y borraba el mensaje siguiente antes de tiempo).

## Dependencias añadidas en el rediseño

| Paquete | Para qué |
|---|---|
| `lucide-react` | Iconos (sólo los usados entran al bundle) |
| `@fontsource-variable/inter` | Tipografía Inter servida desde el propio proyecto, sin CDN |

No se usa ninguna biblioteca de componentes, animaciones ni toasts: todo está en `src/components/ui/`.
