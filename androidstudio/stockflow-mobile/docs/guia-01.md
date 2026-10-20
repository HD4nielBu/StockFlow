# Guía 01 · Entorno y primera aplicación Android

Adaptación de la Guía 01 de ParkFlow360 (Cliente 1:N Vehículo) a StockFlow.

## Ficha de adaptación (capítulo 14)

| Pregunta | ParkFlow360 (ejemplo) | StockFlow |
|---|---|---|
| ¿Cuál es el sistema? | ParkFlow360 | StockFlow: inventario, solicitudes internas y movimientos de almacén |
| ¿Entidad padre (1)? | Cliente | Categoría |
| ¿Entidad hija (N)? | Vehículo | Producto |
| ¿Clave foránea en el backend? | `vehiculo.cliente_id` | `producto.categoria_id` (`fk_producto_categoria`, sin CASCADE) |
| ¿Qué pantalla presentarás primero? | Selección Clientes / Vehículos | Selección Categorías / Productos |
| ¿Cómo se llama tu backend? | Spring Boot hexagonal | Spring Boot hexagonal (`intellij/stockflow-backend`) |
| ¿Cuál es tu frontend Web? | React + TypeScript + Vite | React + TypeScript + Vite (`webstorm/stockflow-frontend`) |
| ¿Qué operación probarás luego? | Listar Clientes | Listar Categorías (`GET /api/categorias`) |

Qué mostrará cada pantalla cuando exista el CRUD: la de Categorías, su código, nombre, estado activo y cuántos
productos tiene; la de Productos, código, nombre, unidad de medida y la categoría a la que pertenece.

## Entorno verificado

Equipo Linux (las guías están escritas para Windows; equivalencias abajo). Evidencia en
`evidencias/guia-01/01_03_versiones_y_adb.txt`.

| Comprobación (lista del capítulo 20) | Resultado |
|---|---|
| A · Hardware | 23 GB RAM; virtualización KVM activa (`emulator -accel-check`) |
| B · Node y npm | node v24.21.0 (LTS), npm 11.19.0 |
| C · Android Studio | 2026.2.1 vía JetBrains Toolbox; SDK Manager y Device Manager |
| D · SDK / ADB | `~/Android/Sdk`; `ANDROID_HOME` y `platform-tools` en `~/.zshrc`; adb 1.0.41 |
| E · Dispositivo | AVD `Medium_Phone_API_37.0` (Android 17, x86_64, Google Play); `adb devices -l` → `device` |
| F · Proyecto | `androidstudio/stockflow-mobile`, plantilla `blank-typescript`, Expo SDK 58, React Native 0.88 |
| G · Arranque Expo | `npx expo start --android` desde la raíz del proyecto |
| H · Pantalla | `05_expo_plantilla_inicial.png`, `05b_hola_stockflow.png` |
| I · Interacción | `06_pantalla_categorias.png` → `07_pantalla_productos.png`: el panel cambia con `useState` |
| J · Explicación | Los contadores están en 0 porque no hay GET al backend: mostrar una cifra inventada sería una falsa validación |

Equivalencias Windows → Linux: `Set-Location` → `cd`; `Test-Path` → `ls`; variables de usuario de Windows →
`export` en `~/.zshrc`; WHPX → KVM.

## Bitácora de diagnóstico

| Problema | Evidencia | Hipótesis | Acción mínima | Resultado |
|---|---|---|---|---|
| Android Studio: "Unable to access Android SDK add-on list" en el primer arranque | `curl` a `dl.google.com/.../addons_list-5.xml` responde 200 | Fallo puntual de la descarga de add-ons opcionales antes de existir el SDK | Cancelar el aviso y seguir el asistente Standard | SDK instalado |
| El asistente instaló API 37 y no API 36 | `ls ~/Android/Sdk/platforms` → `android-37.0` | El modo Standard instala la plataforma más reciente | Se acepta para el emulador (Expo Go corre en un Android más nuevo que su target); Platform 36 queda pendiente para las builds de la Guía 15 | Emulador operativo |
| `Fetching Expo Go` → `AggregateError [ETIMEDOUT]` | `node fetch` a github.com falla o funciona de forma intermitente; `curl -6` falla y `curl -4` responde | Red intermitente; Node prueba IPv6/IPv4 con un tiempo por intento muy corto | `NODE_OPTIONS="--network-family-autoselection-attempt-timeout=3000"` | Expo Go descargado e instalado |
| Expo Go abre su inicio y no la app; aviso "Local network access needed" | La URL era `exp://<IP-LAN>:8081` | Android 17 exige permiso de red local para conectar a la IP del PC | `adb reverse tcp:8081 tcp:8081` y abrir `exp://127.0.0.1:8081` | La app carga |

## Qué NO implementa esta guía

No hay API REST, base de datos, navegación entre pantallas ni CRUD. La interfaz solo cambia un estado local
(`seccion`) que no está sincronizado con PostgreSQL.
