# Graph Report - StockFlow  (2026-10-20)

## Corpus Check
- Large corpus: 505 files · ~265,383 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 2274 nodes · 5592 edges · 126 communities (89 shown, 37 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 448 edges (avg confidence: 0.86)
- Token cost: 1,489,196 input · 0 output

## Community Hubs (Navigation)
- Ubicaciones Backend
- Backend Architecture Concepts
- PDF Guide Generators
- Frontend Navigation Pages
- 2nd Partial Exam Answers
- Confirm Dialog & Empty States
- Git Book Core Concepts
- Badge & Theme UI
- CategoriaService Tests
- Dashboard Charts (BarList/Meter)
- Postman Inventory Tests
- REST Controllers
- Form Fields & Error Text
- DataTable & Dropdowns
- Inventory Query Service
- Producto Service Impl
- Postman Category/Product Tests
- Postman PUT/DELETE/CORS Tests
- JUnit Assertions
- Expo & Postman Workspace
- Alert & Button Components
- Global Exception Handler
- ADRs & DB Conventions
- App Shell & Toasts
- Mobile app.json Config
- Mockito Controller Tests
- Lab Domain Exceptions
- Frontend Guide (Windows)
- Stock Row Mapping
- Postman API Kardex Folder
- Checkbox & Password Inputs
- Frontend Test Tooling
- Categorias Page & Mocks
- Mobile package.json Dev
- Mobile Home & Categories
- Categoria Demo (Cap 03)
- Guide 03 Nav Evidence
- Postgres Persistence Tests
- Vision & Backlog
- Frontend Guide (macOS)
- Categoria Domain Model
- Producto Persistence Adapter
- ProductoService Tests
- Frontend API Client
- tsconfig.app
- Guide 02 UI Evidence
- Repository Ports & Pagination
- CategoriaService Impl
- Categoria Persistence Adapter
- Inventory Query Adapter
- Theme Provider
- Mobile Product List
- Domain Glossary & Flows
- Delete Protection & Errors ADRs
- Health & Swagger Endpoints
- Categoria Use Cases
- Producto JPA Entity
- Frontend Dev Dependencies
- Inventory Hooks & Notifications
- tsconfig.node
- Lab Producto Command
- Delivery & Run Guide
- Categoria JPA Entity
- Frontend Router
- Kardex Hook & Pagination
- Mobile Typecheck Evidence
- Requirements & Mobile README
- Logical ER Model
- CORS Config
- Duplicate-Code Exceptions
- Producto Use Cases
- Guide 01 Mobile Setup
- Stock via Movements ADR
- Run Guide Infrastructure
- Lab Categoria Aggregate
- Lab Producto Entity
- Fake Producto Repository
- Error Boundary & Fonts
- Frontend devDependencies
- Guide 03 Product Evidence
- Mobile Root Layout
- Producto Web Mapper
- Guide 01 Screens Evidence
- Mobile Detail Screens
- Producto Form Types
- Reports Page & CSV
- Docker Compose & Seed Data
- Actors & Approvals
- CORS & Ports Docs
- Postman Guides
- UnidadMedida Enum
- Mobile Expo Dependencies
- Lab CategoriaService
- Backend README Contracts
- Health & Project Info
- Stock JPA Entity
- Not-Found Exceptions
- Mobile Template Icons
- 1:N Relationship ADR
- Demo Users & Roles
- Backend Lab README
- Frontend npm Scripts
- Mobile Tab Selector
- Mobile tsconfig
- Lab Categoria Domain
- Lab In-Memory Repository
- oxlint Config
- Frontend Runtime Deps
- Git Conventions ADR
- Spring Boot Entry Point
- Git GUI Clients
- Lab Main
- Git Init Basics
- Postman Health Folder
- Vite Env Types
- Frontend tsconfig Root
- Git Pull & Fetch
- Git Reflog & Reset
- Postman Categoria PUT
- Git Diff
- Backend POM
- Backend Lab POM
- Postman Categoria DELETE
- Postman Globals

## God Nodes (most connected - your core abstractions)
1. `Producto` - 59 edges
2. `Categoria` - 51 edges
3. `lucide-react` - 44 edges
4. `Ubicacion` - 40 edges
5. `Button()` - 35 edges
6. `vitest` - 33 edges
7. `Banco de 50 preguntas - Defensa oral del frontend` - 33 edges
8. `TipoUbicacion` - 31 edges
9. `Categoria` - 28 edges
10. `ProductoJpaEntity` - 28 edges

## Surprising Connections (you probably didn't know these)
- `Adaptación ParkFlow360 Cliente→Vehículo a Categoría→Producto` --semantically_similar_to--> `Diagrama flujo fullstack 2do parcial (PDF)`  [INFERRED] [semantically similar]
  androidstudio/stockflow-mobile/docs/guia-01.md → diagrama-flujo-2do-parcial.pdf
- `Flyway migraciones V1-V3 (no editar aplicadas)` --semantically_similar_to--> `Flyway V1-V3 + Hibernate ddl-auto validate`  [INFERRED] [semantically similar]
  guias-para-hacer-correr-StockFlow-xd/guia-ejecucion-stockflow.pdf → intellij/stockflow-backend/README.md
- `Recorrido de un clic: Crear producto de la pantalla a PostgreSQL` --semantically_similar_to--> `Recorrido POST /api/productos → PostgreSQL`  [INFERRED] [semantically similar]
  guias-para-hacer-correr-StockFlow-xd/guia-implementacion-frontend-stockflow.pdf → intellij/stockflow-backend/README.md
- `Endpoints sugeridos al backend (POST /auth/login, PUT /ubicaciones/{id}, POST /inventario/movimientos...)` --semantically_similar_to--> `Pendientes conocidos del frontend (sin @Version, sin validacion runtime, ubicaciones sin PUT/DELETE)`  [INFERRED] [semantically similar]
  webstorm/stockflow-frontend/docs/REDISENO-FRONTEND.md → respuestas-2do-parcial.pdf
- `ApiErrorResponse (timestamp, status, error, message, path, fieldErrors)` --shares_data_with--> `GlobalExceptionHandler / ApiErrorResponse (400/404/409/422)`  [INFERRED]
  guias-para-hacer-correr-StockFlow-xd/guia-implementacion-frontend-stockflow.pdf → intellij/stockflow-backend/README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Flujo crítico solicitud→aprobación→movimiento→stock→kardex/alerta** — docs_01_vision_glossary_v0_1_solicitud, docs_01_vision_glossary_v0_1_aprobacion, docs_01_vision_glossary_v0_1_movimiento, docs_01_vision_glossary_v0_1_stock, docs_01_vision_glossary_v0_1_kardex, docs_01_vision_glossary_v0_1_alerta_stock [EXTRACTED 1.00]
- **CRUD fullstack de Producto (GET/POST/PUT/DELETE)** — diagrama_flujo_2do_parcial_get_productos, diagrama_flujo_2do_parcial_post_producto, diagrama_flujo_2do_parcial_put_producto, diagrama_flujo_2do_parcial_delete_producto [EXTRACTED 1.00]
- **Progresión guías móviles 01-03** — androidstudio_stockflow_mobile_docs_guia_01, androidstudio_stockflow_mobile_docs_guia_02, androidstudio_stockflow_mobile_docs_guia_03 [INFERRED 0.95]
- **Cadena Page -> hook -> service -> apiClient** — docs_parciales_respuestas_2do_parcial_productos_page, docs_parciales_respuestas_2do_parcial_use_async_list, docs_parciales_respuestas_2do_parcial_producto_service, docs_parciales_respuestas_2do_parcial_api_client, docs_parciales_respuestas_2do_parcial_env_vite [EXTRACTED 1.00]
- **CRUD fullstack de Producto (GET/POST/PUT/DELETE)** — docs_parciales_respuestas_2do_parcial_flujo_get, docs_parciales_respuestas_2do_parcial_flujo_post, docs_parciales_respuestas_2do_parcial_put_idempotente, docs_parciales_respuestas_2do_parcial_delete_204 [EXTRACTED 1.00]
- **Asincronia con Effects, cleanup y cancelacion** — docs_parciales_respuestas_2do_parcial_use_effect, docs_parciales_respuestas_2do_parcial_abort_controller, docs_parciales_respuestas_2do_parcial_strict_mode, docs_parciales_respuestas_2do_parcial_use_kardex [INFERRED 0.85]
- **Protección multicapa de RN-01 (stock sólo por movimientos)** — docs_04_model_model_conceptual_v0_1_rn_01, docs_03_decisions_adr_005_stock_solo_por_movimientos_stockjpaentity_immutable, docs_03_decisions_adr_005_stock_solo_por_movimientos_triggers_proteccion_historico, docs_04_model_der_logico_v0_1_movimiento_inventario, docs_04_model_model_relational_v0_1_saldo_resultante_guardado [INFERRED 0.85]
- **Contrato de errores de backend a frontend** — docs_03_decisions_adr_006_contrato_de_errores_globalexceptionhandler, docs_03_decisions_adr_006_contrato_de_errores_apierrorresponse, guias_para_hacer_correr_stockflow_xd_macos_guia_implementacion_frontend_stockflow_macos_apierror, guias_para_hacer_correr_stockflow_xd_macos_guia_implementacion_frontend_stockflow_macos_apifetch, guia_postman_stockflow_coleccion_pruebas_completas [INFERRED 0.85]
- **Flujo CRUD de Categoría en el frontend** — guias_para_hacer_correr_stockflow_xd_macos_guia_implementacion_frontend_stockflow_macos_categoriaspage, guias_para_hacer_correr_stockflow_xd_macos_guia_implementacion_frontend_stockflow_macos_categoriaform, guias_para_hacer_correr_stockflow_xd_macos_guia_implementacion_frontend_stockflow_macos_categoriaservice, guias_para_hacer_correr_stockflow_xd_macos_guia_implementacion_frontend_stockflow_macos_apifetch, guias_para_hacer_correr_stockflow_xd_macos_guia_implementacion_frontend_stockflow_macos_useasynclist [EXTRACTED 1.00]
- **Cadena CORS localhost:5173 (yml → CorsConfig → Vite strictPort → preflight Postman)** — intellij_stockflow_backend_src_main_resources_application_cors_allowed_origins, intellij_stockflow_backend_readme_corsconfig, guias_para_hacer_correr_stockflow_xd_guia_implementacion_frontend_stockflow_strictport_5173, guias_para_hacer_correr_stockflow_xd_guia_postman_stockflow_cors_preflight, guias_para_hacer_correr_stockflow_xd_guia_ejecucion_stockflow_cors_localhost_5173 [INFERRED 0.85]
- **Contrato de error ApiErrorResponse compartido** — intellij_stockflow_backend_readme_globalexceptionhandler, guias_para_hacer_correr_stockflow_xd_guia_implementacion_frontend_stockflow_apierrorresponse, guias_para_hacer_correr_stockflow_xd_guia_implementacion_frontend_stockflow_apifetch, postman_collections_stockflow___pruebas_completas_01_categorias__padre__02_400_campos_obligatorios_vacios_request_request, postman_collections_stockflow___pruebas_completas_01_categorias__padre__04_409_codigo_repetido__cat_ofi_existe_en_la_semilla__request_request, postman_collections_stockflow___pruebas_completas_01_categorias__padre__08_404_buscar_por_id_inexistente_request_request [INFERRED 0.85]
- **Flujo de petición del frontend (form → service → apiFetch → env)** — guias_para_hacer_correr_stockflow_xd_guia_implementacion_frontend_stockflow_categoriaform_validacion, guias_para_hacer_correr_stockflow_xd_guia_implementacion_frontend_stockflow_categoriaservice, guias_para_hacer_correr_stockflow_xd_guia_implementacion_frontend_stockflow_apifetch, guias_para_hacer_correr_stockflow_xd_guia_implementacion_frontend_stockflow_vite_api_url [EXTRACTED 1.00]
- **Validaciones 400 de payload de producto** — postman_collections_stockflow___pruebas_completas_02_productos__hijo__06_400_unidad_de_medida_fuera_del_enum_request_request, postman_collections_stockflow___pruebas_completas_02_productos__hijo__07_400_stock_minimo_negativo__rn_07__request_request, postman_collections_stockflow___pruebas_completas_02_productos__hijo__08_400_precio_negativo_request_request [INFERRED 0.85]
- **Reglas de conflicto 409 en ubicaciones** — postman_collections_stockflow___pruebas_completas_03_ubicaciones_07_409_codigo_de_ubicacion_repetido_request_request, postman_collections_stockflow___pruebas_completas_03_ubicaciones_08_409_un_unico_almacen_central_activo_request_request, postman_collections_stockflow___pruebas_completas_03_ubicaciones__resources_definition_unico_almacen_central [INFERRED 0.85]
- **Pruebas de inventario: stock y kardex** — postman_collections_stockflow___pruebas_completas_04_inventario__stock_y_kardex__01_200_existencias_de_todo_el_inventario_request_request, postman_collections_stockflow___pruebas_completas_04_inventario__stock_y_kardex__02_200_existencias_de_un_producto_request_request, postman_collections_stockflow___pruebas_completas_04_inventario__stock_y_kardex__03_200_existencias_de_una_ubicacion_request_request, postman_collections_stockflow___pruebas_completas_04_inventario__stock_y_kardex__04_200_alertas_existencias_en_o_bajo_el_minimo_request_request, postman_collections_stockflow___pruebas_completas_04_inventario__stock_y_kardex__05_404_filtro_con_un_producto_inexistente_request_request, postman_collections_stockflow___pruebas_completas_04_inventario__stock_y_kardex__06_200_kardex_paginado_de_un_producto_request_request, postman_collections_stockflow___pruebas_completas_04_inventario__stock_y_kardex__07_200_kardex_de_a_1_movimiento_por_pagina_request_request, postman_collections_stockflow___pruebas_completas_04_inventario__stock_y_kardex__08_404_kardex_de_un_producto_inexistente_request_request, postman_collections_stockflow___pruebas_completas_04_inventario__stock_y_kardex__09_422_tamano_de_pagina_fuera_de_rango_request_request, postman_collections_stockflow___pruebas_completas_04_inventario__stock_y_kardex__10_400_pagina_no_numerica_request_request [EXTRACTED 1.00]
- **Flujo: desactivar categoria y rechazar mover producto a ella** — postman_collections_stockflow___pruebas_completas_05_put_y_delete_09_200_desactivar_la_categoria_creada__activo___false__request_request, postman_collections_stockflow___pruebas_completas_05_put_y_delete_10_422_mover_el_producto_a_esa_categoria_inactiva_request_request, postman_collections_stockflow___pruebas_completas_05_put_y_delete_10_422_mover_el_producto_a_esa_categoria_inactiva_request_categoria_inactiva_no_asignable, postman_collections_stockflow___pruebas_completas_05_put_y_delete_01_200_put_categoria_conservando_su_codigo_y_nombre_request_put_api_categorias, postman_collections_stockflow___pruebas_completas_05_put_y_delete_06_200_put_producto_cambia_a_la_categoria_2_request_put_api_productos [INFERRED 0.85]
- **Respuestas 4xx validan formato ApiErrorResponse** — postman_collections_stockflow___pruebas_completas_04_inventario__stock_y_kardex__05_404_filtro_con_un_producto_inexistente_request_apierrorresponse, postman_collections_stockflow___pruebas_completas_04_inventario__stock_y_kardex__05_404_filtro_con_un_producto_inexistente_request_request, postman_collections_stockflow___pruebas_completas_04_inventario__stock_y_kardex__08_404_kardex_de_un_producto_inexistente_request_request, postman_collections_stockflow___pruebas_completas_04_inventario__stock_y_kardex__09_422_tamano_de_pagina_fuera_de_rango_request_request, postman_collections_stockflow___pruebas_completas_04_inventario__stock_y_kardex__10_400_pagina_no_numerica_request_request, postman_collections_stockflow___pruebas_completas_05_put_y_delete_03_400_put_sin_el_campo_activo_request_request, postman_collections_stockflow___pruebas_completas_05_put_y_delete_04_404_put_sobre_un_id_inexistente__no_crea__request_request, postman_collections_stockflow___pruebas_completas_05_put_y_delete_05_409_put_con_el_codigo_de_otra_categoria_request_request, postman_collections_stockflow___pruebas_completas_05_put_y_delete_07_404_put_producto_hacia_una_categoria_inexistente_request_request, postman_collections_stockflow___pruebas_completas_05_put_y_delete_08_409_put_producto_con_el_codigo_de_otro__rn_06__request_request, postman_collections_stockflow___pruebas_completas_05_put_y_delete_10_422_mover_el_producto_a_esa_categoria_inactiva_request_request, postman_collections_stockflow___pruebas_completas_05_put_y_delete_11_409_delete_de_un_producto_con_stock__prd_ofi_001__request_request [EXTRACTED 1.00]
- **DELETE cleanup flow (409 guard, 204 product, 204 category, 404 repeat)** — postman_collections_stockflow___pruebas_completas_05_put_y_delete_12_409_delete_de_una_categoria_con_productos__cat_ofi__request, postman_collections_stockflow___pruebas_completas_05_put_y_delete_13_204_delete_del_producto_creado_request, postman_collections_stockflow___pruebas_completas_05_put_y_delete_14_204_delete_de_la_categoria_creada_request, postman_collections_stockflow___pruebas_completas_05_put_y_delete_15_404_el_mismo_delete_otra_vez_request [INFERRED 0.85]
- **Categorias CRUD endpoints (PA-06)** — postman_collections_stockflow_api__pa_06__api_categorias_crear_2_request, postman_collections_stockflow_api__pa_06__api_categorias_listar_1_request, postman_collections_stockflow_api__pa_06__api_categorias__id___resources_actualizar_1_resources_examples_ok_example, postman_collections_stockflow_api__pa_06__api_categorias__id___resources_buscar_por_id_1_resources_examples_ok_example, postman_collections_stockflow_api__pa_06__api_categorias__id___resources_eliminar_1_resources_examples_ok_example [INFERRED 0.85]
- **Categoria by-id CRUD endpoints** — postman_collections_stockflow_api__pa_06__api_categorias__id__buscar_por_id_1_request_get_api_categorias_id, postman_collections_stockflow_api__pa_06__api_categorias__id__actualizar_1_request_put_api_categorias_id, postman_collections_stockflow_api__pa_06__api_categorias__id__eliminar_1_request_delete_api_categorias_id [EXTRACTED 1.00]
- **Inventario read endpoints (stock + kardex)** — postman_collections_stockflow_api__pa_06__api_inventario__resources_definition_inventario_collection, postman_collections_stockflow_api__pa_06__api_inventario_stock_stock_request_get_api_inventario_stock, postman_collections_stockflow_api__pa_06__api_inventario_kardex__productoid__kardex_request_get_api_inventario_kardex_productoid [INFERRED 0.85]
- **Producto DTO flow across crear/actualizar/listar** — postman_collections_stockflow_api__pa_06__api_productos_crear_1_request_post_api_productos, postman_collections_stockflow_api__pa_06__api_productos__id___resources_actualizar_resources_examples_ok_example_actualizar_producto_ok_example, postman_collections_stockflow_api__pa_06__api_productos_categoria__categoriaid__listar_por_categoria_request_get_api_productos_categoria_categoriaid, postman_collections_stockflow_api__pa_06__api_productos__resources_crear_1_resources_examples_ok_example_producto_response [INFERRED 0.85]
- **Postman CRUD de producto por id (GET/PUT/DELETE)** — postman_collections_stockflow_api__pa_06__api_productos__id__buscar_por_id_request_get_producto_por_id, postman_collections_stockflow_api__pa_06__api_productos__id__actualizar_request_put_actualizar_producto, postman_collections_stockflow_api__pa_06__api_productos__id__eliminar_request_delete_eliminar_producto, postman_collections_stockflow_api__pa_06__api_productos__id___resources_buscar_por_id_resources_examples_ok_example_productoresponse_shape [EXTRACTED 1.00]
- **Postman API de ubicaciones (crear, listar, buscar por id)** — postman_collections_stockflow_api__pa_06__api_ubicaciones_crear_request_post_crear_ubicacion, postman_collections_stockflow_api__pa_06__api_ubicaciones_listar_request_get_listar_ubicaciones, postman_collections_stockflow_api__pa_06__api_ubicaciones__id__buscar_por_id_2_request_get_ubicacion_por_id, postman_collections_stockflow_api__pa_06__api_ubicaciones__resources_crear_resources_examples_ok_example_ubicacionresponse_shape, postman_collections_stockflow_api__pa_06__api_ubicaciones__resources_listar_resources_examples_ok_example_tipoubicacion_enum [EXTRACTED 1.00]
- **Cadena de datos frontend Page -> hook -> service -> apiFetch** — _respuestas_2do_parcial_arquitectura_por_features, _respuestas_2do_parcial_useasynclist_abortcontroller, _respuestas_2do_parcial_apifetch_apiclient, _respuestas_2do_parcial_vite_api_url_env, _respuestas_2do_parcial_props_callbacks_tabla_page [INFERRED 0.85]
- **Flujo local basico de Git** — libros_ayuda_git_y_github_git_y_github_desde_cero___2da_ed___brais_moure_git_init, libros_ayuda_git_y_github_git_y_github_desde_cero___2da_ed___brais_moure_git_add, libros_ayuda_git_y_github_git_y_github_desde_cero___2da_ed___brais_moure_git_commit, libros_ayuda_git_y_github_git_y_github_desde_cero___2da_ed___brais_moure_git_status, libros_ayuda_git_y_github_git_y_github_desde_cero___2da_ed___brais_moure_git_log [EXTRACTED 1.00]
- **Flujo de contribucion via Fork y Pull Request** — libros_ayuda_git_y_github_git_y_github_desde_cero___2da_ed___brais_moure_fork, libros_ayuda_git_y_github_git_y_github_desde_cero___2da_ed___brais_moure_git_clone, libros_ayuda_git_y_github_git_y_github_desde_cero___2da_ed___brais_moure_git_push, libros_ayuda_git_y_github_git_y_github_desde_cero___2da_ed___brais_moure_pull_request, libros_ayuda_git_y_github_git_y_github_desde_cero___2da_ed___brais_moure_git_merge [EXTRACTED 1.00]
- **Modelo de ramas Gitflow** — libros_ayuda_git_y_github_git_y_github_desde_cero___2da_ed___brais_moure_main_branch, libros_ayuda_git_y_github_git_y_github_desde_cero___2da_ed___brais_moure_develop_branch, libros_ayuda_git_y_github_git_y_github_desde_cero___2da_ed___brais_moure_feature_branch, libros_ayuda_git_y_github_git_y_github_desde_cero___2da_ed___brais_moure_release_branch, libros_ayuda_git_y_github_git_y_github_desde_cero___2da_ed___brais_moure_hotfix_branch [EXTRACTED 1.00]
- **Android Adaptive Icon Layer Set** — androidstudio_stockflow_mobile_assets_android_icon_background_image, androidstudio_stockflow_mobile_assets_android_icon_foreground_image, androidstudio_stockflow_mobile_assets_android_icon_monochrome_image [INFERRED 0.95]
- **Guía 01: evolución de plantilla Expo a pantalla StockFlow con módulos** — androidstudio_stockflow_mobile_docs_evidencias_guia_01_05_expo_plantilla_inicial, androidstudio_stockflow_mobile_docs_evidencias_guia_01_05b_hola_stockflow, androidstudio_stockflow_mobile_docs_evidencias_guia_01_06_pantalla_categorias, androidstudio_stockflow_mobile_docs_evidencias_guia_01_07_pantalla_productos [INFERRED 0.85]
- **Flujo seleccionar categoría y ver sus productos** — androidstudio_stockflow_mobile_docs_evidencias_guia_02_g2_a01_tarjeta_categoria, androidstudio_stockflow_mobile_docs_evidencias_guia_02_g2_a03_categoria_seleccionada, androidstudio_stockflow_mobile_docs_evidencias_guia_02_g2_a03_tarjeta_producto, androidstudio_stockflow_mobile_docs_evidencias_guia_02_g2_a05_estado_vacio, androidstudio_stockflow_mobile_docs_evidencias_guia_02_g2_a03_relacion_categoria_producto [INFERRED 0.85]
- **Guia 03 navigation flow Home -> Categorias -> Detalle -> Producto** — androidstudio_stockflow_mobile_docs_evidencias_guia_03_g3_a01, androidstudio_stockflow_mobile_docs_evidencias_guia_03_g3_a02, androidstudio_stockflow_mobile_docs_evidencias_guia_03_g3_a03, androidstudio_stockflow_mobile_docs_evidencias_guia_03_g3_a07, androidstudio_stockflow_mobile_docs_evidencias_guia_03_g3_a08 [INFERRED 0.85]
- **Category detail screen with 2/1/1/0 products** — androidstudio_stockflow_mobile_docs_evidencias_guia_03_g3_a03, androidstudio_stockflow_mobile_docs_evidencias_guia_03_g3_a04, androidstudio_stockflow_mobile_docs_evidencias_guia_03_g3_a05, androidstudio_stockflow_mobile_docs_evidencias_guia_03_g3_a06 [EXTRACTED 1.00]
- **Manejo de rutas e IDs invalidos** — androidstudio_stockflow_mobile_docs_evidencias_guia_03_g3_a11, androidstudio_stockflow_mobile_docs_evidencias_guia_03_g3_a12, androidstudio_stockflow_mobile_docs_evidencias_guia_03_g3_a13 [INFERRED 0.85]
- **Flujo lista -> detalle producto -> detalle categoria** — androidstudio_stockflow_mobile_docs_evidencias_guia_03_g3_a09, androidstudio_stockflow_mobile_docs_evidencias_guia_03_g3_a16_frio, androidstudio_stockflow_mobile_docs_evidencias_guia_03_g3_a10, androidstudio_stockflow_mobile_docs_evidencias_guia_03_g3_a16_volver [INFERRED 0.85]

## Communities (126 total, 37 thin omitted)

### Community 0 - "Ubicaciones Backend"
Cohesion: 0.07
Nodes (13): UbicacionService, TipoUbicacion, ALMACEN_CENTRAL, DEPOSITO, PUNTO_CONSUMO, Ubicacion, UbicacionRepositoryPort, UbicacionJpaEntity (+5 more)

### Community 1 - "Backend Architecture Concepts"
Cohesion: 0.05
Nodes (49): Contrato de errores HTTP (GlobalExceptionHandler, ApiErrorResponse, 400/404/409/422/500, ADR-006), CorsConfig backend (stockflow.cors.allowed-origins, default http://localhost:5173), Pruebas backend: ProductoTest, ProductoServiceTest (fakes), WebMvcTest, PersistenciaPostgresTest (Testcontainers), Flujo HTTP backend: Tomcat -> DispatcherServlet -> Controller -> UseCase -> Adapter -> Hibernate -> PostgreSQL, Respuestas 1er parcial: defensa oral del backend (50 preguntas), PUT idempotente con dirty checking (findById + flush, sin save), Relacion Categoria 1:N Producto (fk_producto_categoria, mappedBy=categoria, ManyToOne LAZY), apiFetch / ApiError (unica puerta HTTP, revisa response.ok, 204 sin body) (+41 more)

### Community 2 - "PDF Guide Generators"
Cohesion: 0.10
Nodes (39): antes_de_empezar(), apagar(), backend(), caja(), capitulo(), cmd(), configurar(), documento() (+31 more)

### Community 3 - "Frontend Navigation Pages"
Cohesion: 0.07
Nodes (42): react-dom, ALL_PAGES, DataSource, EXTRA_PAGES, findPage(), NAV_SECTIONS, NavItem, NavSection (+34 more)

### Community 4 - "2nd Partial Exam Answers"
Cohesion: 0.06
Nodes (43): AbortController y race conditions, apiClient / apiFetch / ApiError, Arranque: index.html -> main.tsx -> App -> AppRouter -> pantalla, Banco de 50 preguntas - Defensa oral del frontend, npm run build, dist/, preview y .env por modo, Codigos HTTP vistos desde el frontend (200/201/204/400/404/409/422/500), CORS (CorsConfig, preflight, CORS_ALLOWED_ORIGINS), DashboardPage y useResumenInventario (metricas derivadas) (+35 more)

### Community 5 - "Confirm Dialog & Empty States"
Cohesion: 0.13
Nodes (37): Alert(), Button(), ConfirmDialog(), ConfirmDialogProps, EmptyState(), TableSkeleton(), Modal(), ModalProps (+29 more)

### Community 6 - "Git Book Core Concepts"
Cohesion: 0.05
Nodes (41): Git y GitHub desde cero (2a ed.), Brais Moure (@mouredev), Comunidad mouredev (Discord, Twitch), Rama develop, Ramas feature, Fork, Git, git add (+33 more)

### Community 7 - "Badge & Theme UI"
Cohesion: 0.12
Nodes (30): ThemeSelector(), Badge(), BadgeProps, BadgeTone, Card(), CardProps, DemoBadge(), EmptyStateProps (+22 more)

### Community 8 - "CategoriaService Tests"
Cohesion: 0.11
Nodes (3): CategoriaServiceTest, ProductoTest, ProductoControllerTest

### Community 9 - "Dashboard Charts (BarList/Meter)"
Cohesion: 0.11
Nodes (28): BarItem, BarList(), BarListProps, Meter(), MeterProps, porcentaje(), StatusBar(), StatusBarProps (+20 more)

### Community 10 - "Postman Inventory Tests"
Cohesion: 0.11
Nodes (30): GET /api/inventario/stock, [200] Existencias de todo el inventario, [200] Existencias de un producto, [200] Existencias de una ubicación, Alerta de stock bajo minimo (soloBajoMinimo / bajoMinimo), [200] Alertas: existencias en o bajo el mínimo, ApiErrorResponse, [404] Filtro con un producto inexistente (+22 more)

### Community 11 - "REST Controllers"
Cohesion: 0.15
Nodes (5): RegistrarUbicacionUseCase, CrearUbicacionRequest, UbicacionResponse, UbicacionWebMapper, UbicacionController

### Community 12 - "Form Fields & Error Text"
Cohesion: 0.15
Nodes (23): describirError(), ErrorLegible, ControlProps, Field(), FieldProps, Input(), Select(), Textarea() (+15 more)

### Community 13 - "DataTable & Dropdowns"
Cohesion: 0.15
Nodes (23): Column, DataTable(), DataTableProps, DropdownItem(), DropdownSeparator(), RowActions(), RowActionsProps, Spinner() (+15 more)

### Community 14 - "Inventory Query Service"
Cohesion: 0.17
Nodes (12): InventarioConsultaService, Existencia, MovimientoKardex, Pagina, ConsultarInventarioUseCase, InventarioConsultaPort, ExistenciaResponse, MovimientoKardexResponse (+4 more)

### Community 16 - "Postman Category/Product Tests"
Cohesion: 0.11
Nodes (26): ApiErrorResponse (status, message, path), [400] Id con tipo inválido (GET /api/categorias/abc), [201] Registrar producto en una categoría existente (POST /api/productos), [200] Consultar producto por id (GET /api/productos/1), [200] Listar todos los productos (GET /api/productos), [200] Listar productos de una categoría (GET /api/productos/categoria/1), [404] Registrar con categoría inexistente (POST /api/productos), [409] Código de producto duplicado (RN-06) (POST /api/productos) (+18 more)

### Community 17 - "Postman PUT/DELETE/CORS Tests"
Cohesion: 0.11
Nodes (29): [409] DELETE de una categoría con productos (CAT-OFI), CAT-OFI category (id 1, has products), [204] DELETE del producto creado, productoId variable, [204] DELETE de la categoría creada, [404] El mismo DELETE otra vez, [200] Preflight desde React (localhost:5173), [403] Preflight desde un origen no permitido (+21 more)

### Community 18 - "JUnit Assertions"
Cohesion: 0.11
Nodes (4): CategoriaNoEncontradaException, CodigoCategoriaDuplicadoException, CategoriaConProductosException, CategoriaNoEncontradaException

### Community 19 - "Expo & Postman Workspace"
Cohesion: 0.11
Nodes (26): Postman resources.yaml, Postman collection StockFlow API (PA-06), Mobile AGENTS.md (Expo rules), EAS Build/Submit/Update, Expo Router (rutas en src/app), Diagrama flujo fullstack 2do parcial (PDF), Preflight CORS (CorsConfig), Dónde se rompería el flujo (diagnóstico de fallas) (+18 more)

### Community 20 - "Alert & Button Components"
Cohesion: 0.14
Nodes (18): AlertKind, ICONS, ButtonProps, ButtonSize, ButtonVariant, UbicacionFormProps, vacio, TIPO_UBICACION_LABEL (+10 more)

### Community 22 - "ADRs & DB Conventions"
Cohesion: 0.11
Nodes (18): Triggers que impiden borrar/modificar movimientos, auditoría e historial, ADR-007 Atender solicitud como SALIDA, Registro de decisiones ADR (README), Plantilla ADR (contexto, decisión, alternativas, consecuencias), Convenciones de BD v0.1, Convenciones de nombres BD (pk_, fk_, uq_, ck_, idx_, vw_), DER lógico v0.1, Diccionario de datos v0.1 (+10 more)

### Community 23 - "App Shell & Toasts"
Cohesion: 0.17
Nodes (17): App(), ToastApi, ToastContext, ToastInput, ToastTone, DURATION, ICONS, Toast() (+9 more)

### Community 24 - "Mobile app.json Config"
Cohesion: 0.09
Nodes (22): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, typedRoutes, expo (+14 more)

### Community 26 - "Lab Domain Exceptions"
Cohesion: 0.13
Nodes (5): StockMinimoInvalidoException, CategoriaInactivaException, StockMinimoInvalidoException, DatoInvalidoException, ReglaNegocioException

### Community 27 - "Frontend Guide (Windows)"
Cohesion: 0.13
Nodes (19): ApiErrorResponse (timestamp, status, error, message, path, fieldErrors), apiClient.ts: apiFetch, ApiError, mensajeDeError, AppRouter, MainLayout, Sidebar (React Router SPA), CategoriaForm + validarCategoria (input controlado), categoriaService / productoService / inventarioService, CategoriasPage: CRUD completo con GET /{id} previo y borrado tras 204, Componentes UI reutilizables (Button, Modal, ConfirmDialog, Pagination…), DashboardPage y AppErrorBoundary (G10) (+11 more)

### Community 29 - "Postman API Kardex Folder"
Cohesion: 0.11
Nodes (23): GET /api/categorias/:id (buscar categoria por id), Inventario folder collection, Kardex {productoId} folder collection, Kardex movimiento entry (movimientoId, tipo, entrada, salida, saldoResultante, registradoPor, motivo), Kardex 200 OK example, Paged Kardex response (contenido, pagina, tamano, totalElementos, totalPaginas), GET /api/inventario/kardex/:productoId?pagina&tamano, Kardex folder collection (+15 more)

### Community 30 - "Checkbox & Password Inputs"
Cohesion: 0.18
Nodes (16): lucide-react, mensajeDeError(), Checkbox(), CheckboxProps, PasswordInput(), iniciales(), nombreDesdeIdentificador(), primerNombre() (+8 more)

### Community 31 - "Frontend Test Tooling"
Cohesion: 0.19
Nodes (10): @testing-library/react, @testing-library/user-event, vitest, HealthResponse, healthService, items, Disparador(), montar() (+2 more)

### Community 32 - "Categorias Page & Mocks"
Cohesion: 0.20
Nodes (9): categoriasMock, categoriaService, CategoriaCreateRequest, CategoriaUpdateRequest, Existencia, stockPorProducto(), productosMock, existencias (+1 more)

### Community 33 - "Mobile package.json Dev"
Cohesion: 0.10
Nodes (20): devDependencies, @types/react, typescript, react, @types/react, typescript, main, name (+12 more)

### Community 34 - "Mobile Home & Categories"
Cohesion: 0.17
Nodes (14): CategoriasScreen(), styles, InicioScreen(), styles, styles, CategoriaCard(), Props, styles (+6 more)

### Community 35 - "Categoria Demo (Cap 03)"
Cohesion: 0.18
Nodes (7): CategoriaDemoService, CategoriaDemoController, ActualizarCategoriaRequest, CategoriaDemoResponse, CategoriaResponse, CrearCategoriaRequest, CategoriaWebMapper

### Community 36 - "Guide 03 Nav Evidence"
Cohesion: 0.20
Nodes (19): Home screen: StockFlow Mobile (Guia 03), Back navigation (Volver / header arrow), Expo Router navigation, Local sample data (no REST API), Stack header with settings button, Categorias list screen, Categoria, ACTIVA/INACTIVA status badge (+11 more)

### Community 39 - "Vision & Backlog"
Cohesion: 0.11
Nodes (13): Visión del proyecto v0.1, Alcance del MVP, Criterios de éxito (9), Backlog priorizado v0.1, P0-03 Registrar ubicaciones, P0-04 Crear solicitud, P0-05 Enviar solicitud, P0-07 Atender solicitud (+5 more)

### Community 40 - "Frontend Guide (macOS)"
Cohesion: 0.19
Nodes (17): Guía de implementación del frontend (macOS), apiFetch (cliente HTTP único), AppErrorBoundary, AppRouter, categoriaService, CategoriasPage (CRUD de Categoría), ConfirmDialog / Modal <dialog>, CorsConfig del backend (+9 more)

### Community 44 - "Frontend API Client"
Cohesion: 0.18
Nodes (9): ApiError, ApiErrorResponse, apiFetch(), construirError(), API_URL, productoService, ubicacionService, existenciasMock (+1 more)

### Community 45 - "tsconfig.app"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 46 - "Guide 02 UI Evidence"
Cohesion: 0.26
Nodes (19): Guía 02 evidencia: color de acento cambiado (azul), Color de acento del tema (teal → azul), Guía 02 evidencia A01: pantalla inicial, pestaña Categorías, Badge de estado ACTIVA / INACTIVA, Datos locales de ejemplo (sin API REST ni PostgreSQL), Selector de pestañas Categorías / Productos (estado de vista activa), Tarjeta de categoría (nombre, código CAT-*, descripción, conteo, badge de estado), Tarjetas de resumen (5 categorías / 5 productos de ejemplo) (+11 more)

### Community 52 - "Theme Provider"
Cohesion: 0.23
Nodes (15): THEME_STORAGE_KEY, ThemeContext, preferenciaInicial(), sistemaEsOscuro(), suscribirSistema(), ThemeProvider(), Header(), PageSkeleton() (+7 more)

### Community 53 - "Mobile Product List"
Cohesion: 0.21
Nodes (12): ProductosScreen(), styles, ProductoCard(), Props, styles, UNIDAD_LABEL, ProductoNavegable(), Props (+4 more)

### Community 54 - "Domain Glossary & Flows"
Cohesion: 0.18
Nodes (15): Flujo DELETE producto (204/409), Glosario del dominio v0.1, AlertaStock, Estados de solicitud BORRADOR→ENVIADA→APROBADA/RECHAZADA→ATENDIDA/CANCELADA, ItemSolicitud, Kardex, MovimientoInventario, Referencia de movimiento (+7 more)

### Community 55 - "Delete Protection & Errors ADRs"
Cohesion: 0.18
Nodes (13): ADR-004 DELETE protegido por FK, CategoriaConProductosException / ProductoEnUsoException → 409, Retiro lógico con PUT activo=false, ADR-006 Contrato único de errores, GlobalExceptionHandler (@RestControllerAdvice), Jerarquía de excepciones de dominio (404/409/422), RN-06 Código de producto único, Guía de Postman StockFlow (+5 more)

### Community 56 - "Health & Swagger Endpoints"
Cohesion: 0.22
Nodes (17): Swagger UI /swagger-ui.html, GlobalExceptionHandler / ApiErrorResponse (400/404/409/422), GET /api/health → 200 status OK, GET /api/categorias/demo → 200 CAT-OFI, GET /v3/api-docs → 200 documenta /api/productos, Carpeta 00 Health y documentacion, POST /api/categorias → 201, Location, guarda categoriaId, POST campos vacíos → 400 fieldErrors codigo/nombre (+9 more)

### Community 57 - "Categoria Use Cases"
Cohesion: 0.15
Nodes (5): ActualizarCategoriaUseCase, ConsultarCategoriaUseCase, EliminarCategoriaUseCase, RegistrarCategoriaUseCase, CategoriaController

### Community 59 - "Frontend Dev Dependencies"
Cohesion: 0.12
Nodes (15): jsdom, oxlint, @testing-library/dom, @testing-library/jest-dom, @types/node, @types/react-dom, vite, @vitejs/plugin-react (+7 more)

### Community 60 - "Inventory Hooks & Notifications"
Cohesion: 0.26
Nodes (10): NotificationsMenu(), useCategorias(), useResumenInventario(), fechaHora, TAMANOS, useProductos(), UNIDAD_LABEL, UNIDADES_MEDIDA (+2 more)

### Community 61 - "tsconfig.node"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 62 - "Lab Producto Command"
Cohesion: 0.15
Nodes (8): RegistrarProductoCommand, UnidadMedida, CAJA, KILOGRAMO, LITRO, METRO, PAQUETE, UNIDAD

### Community 63 - "Delivery & Run Guide"
Cohesion: 0.30
Nodes (15): docker-compose PostgreSQL 16 (stockflow_admin), Migraciones Flyway V1/V2/V3, Guía de ejecución StockFlow (Linux), adb reverse tcp:8081 para Android 17, App móvil React Native + Expo (stockflow-mobile), CORS sólo http://localhost:5173, DataGrip (conexión a stockflow), requests.http (+7 more)

### Community 65 - "Frontend Router"
Cohesion: 0.24
Nodes (14): react-router, NotFoundPage(), AlmacenesPage, AppRouter(), CategoriasPage, ConfiguracionPage, DashboardPage, ExistenciasPage (+6 more)

### Community 66 - "Kardex Hook & Pagination"
Cohesion: 0.27
Nodes (8): PaginaResponse, Resultado, Pagina, useKardex(), MovimientoKardex, TIPO_MOVIMIENTO_LABEL, inventarioService, isAbortError()

### Community 67 - "Mobile Typecheck Evidence"
Cohesion: 0.19
Nodes (15): Typecheck npx tsc --noEmit, Evidencia G02 paso 24 error TypeScript, Evidencia G03 A14 tsc, Evidencia G03 recorrido de texto, Guía 02 móvil: componentes, props, estado, CategoriaCard, EmptyState, MetricCard (+7 more)

### Community 68 - "Requirements & Mobile README"
Cohesion: 0.15
Nodes (14): StockFlow Mobile README, P0-01 Autenticación por rol, P0-08 Stock transaccional, P0-10 Transferencia, Catálogo de requisitos v0.1, GET /api/inventario/kardex/{productoId} y /stock?soloBajoMinimo, RF-01 Autenticar y permisos por rol, RF-16 Movimiento y recálculo transaccional (+6 more)

### Community 69 - "Logical ER Model"
Cohesion: 0.30
Nodes (15): Tabla alerta_stock, Tabla aprobacion, Tabla categoria, Diagrama ER (Mermaid), Tabla historial_estado_solicitud, Tabla item_solicitud, Tabla movimiento_inventario, Tabla producto (+7 more)

### Community 71 - "Duplicate-Code Exceptions"
Cohesion: 0.23
Nodes (4): CategoriaDuplicadaException, AlmacenCentralDuplicadoException, CodigoUbicacionDuplicadoException, ConflictoNegocioException

### Community 72 - "Producto Use Cases"
Cohesion: 0.27
Nodes (6): ProductoService, ActualizarProductoUseCase, ConsultarProductoUseCase, EliminarProductoUseCase, RegistrarProductoUseCase, ProductoController

### Community 73 - "Guide 01 Mobile Setup"
Cohesion: 0.16
Nodes (10): Evidencia G01 versiones y adb, Emulador sdk_gphone64_x86_64 (Android 17, adb 1.0.41), Guía 01 móvil: entorno, FK producto.categoria_id (fk_producto_categoria, sin CASCADE), Categoría, Producto, P0-02 Registrar productos, RNF-04 Mantenibilidad hexagonal (+2 more)

### Community 74 - "Stock via Movements ADR"
Cohesion: 0.24
Nodes (12): ADR-005 Stock sólo por movimientos, Movimiento de ajuste AJUSTE_POSITIVO/AJUSTE_NEGATIVO, Transferencia entre almacenes (salida en origen + entrada en destino), Decisiones de integridad v0.1, Prueba de contradicción de reglas de integridad, Modelo conceptual v0.1, RN-01 Stock sólo cambia por movimientos, RN-02 Movimiento válido (tipo, cantidad>0, fecha, usuario, referencia) (+4 more)

### Community 75 - "Run Guide Infrastructure"
Cohesion: 0.22
Nodes (12): adb reverse tcp:8081 para Expo Go en Android 17, Apagado y rutina rápida (no usar docker compose down -v), App móvil React Native + Expo (androidstudio/stockflow-mobile), DataGrip: verificación de datos (18 tablas), Docker Compose: contenedor stockflow-postgres (PostgreSQL 16, localhost:5432), Guía de ejecución StockFlow (Linux), Metro bundler y Expo Router, Pruebas automáticas backend (60 tests, Testcontainers) (+4 more)

### Community 79 - "Error Boundary & Fonts"
Cohesion: 0.15
Nodes (4): @fontsource-variable/inter, AppErrorBoundary, Props, State

### Community 80 - "Frontend devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, jsdom, oxlint, @testing-library/dom, @testing-library/jest-dom, @testing-library/react, @testing-library/user-event, @types/node (+6 more)

### Community 81 - "Guide 03 Product Evidence"
Cohesion: 0.18
Nodes (12): Evidencia G3 A09: Lista de productos (stack con back), Productos locales de ejemplo (PRD-OFI/LIM/EPP/TEC), Evidencia G3 A10: Detalle de categoria Limpieza, CAT-LIM Limpieza, PRD-LIM-001 Detergente liquido 5L, Relacion Categoria 1:N Producto, Evidencia G3 A11: Categoria no encontrada, Estado vacio 'Sin resultados' para ID invalido (+4 more)

### Community 82 - "Mobile Root Layout"
Cohesion: 0.19
Nodes (8): AyudaScreen(), styles, Destino, Props, ReturnButton(), styles, expo-router, expo-status-bar

### Community 83 - "Producto Web Mapper"
Cohesion: 0.28
Nodes (4): ActualizarProductoRequest, CrearProductoRequest, ProductoResponse, ProductoWebMapper

### Community 84 - "Guide 01 Screens Evidence"
Cohesion: 0.23
Nodes (11): Evidencia: Plantilla inicial Expo (Open up App.tsx), App.tsx (punto de entrada plantilla Expo), Evidencia: Pantalla Hola, StockFlow, React Native (primera pantalla), Evidencia: Pantalla StockFlow con módulo Categorías activo, Módulo Categorías, Relación Categoría (1) - Producto (N), Selector Explorar módulos (botones toggle) (+3 more)

### Community 85 - "Mobile Detail Screens"
Cohesion: 0.30
Nodes (8): DetalleCategoriaScreen(), styles, DetalleProductoScreen(), styles, EmptyState(), Props, styles, leerIdPositivo()

### Community 86 - "Producto Form Types"
Cohesion: 0.30
Nodes (7): UnidadMedida, ProductoFormData, ProductoCreateRequest, ProductoUpdateRequest, ProductoFormErrors, valido, validarProducto()

### Community 87 - "Reports Page & CSV"
Cohesion: 0.33
Nodes (9): filasTexto(), PENDIENTES, Reporte, ReportesPage(), aCsv(), Celda, descargarCsv(), nombreConFecha() (+1 more)

### Community 88 - "Docker Compose & Seed Data"
Cohesion: 0.22
Nodes (8): demoData.ts (5 categorías, 5 productos), Servicio postgres (stockflow-postgres, volumen stockflow-data), P0-12 Docker Compose, RNF-10 DevOps Docker Compose y CI, ADR-002 Flyway y ddl-auto validate, Liquibase (alternativa descartada), Migraciones Flyway V1 esquema, V2 semilla, V3 histórico, PostgreSQL 16

### Community 89 - "Actors & Approvals"
Cohesion: 0.25
Nodes (10): Aprobación, P0-06 Aprobar o rechazar, Casos de uso por actor (UC1-UC12), StockFlow README, Administrador, Encargado de almacén, Solicitante interno, StockFlow (PA-06) sistema de inventario (+2 more)

### Community 90 - "CORS & Ports Docs"
Cohesion: 0.20
Nodes (8): CorsConfig del backend (orígenes, métodos, exposedHeaders Location), CorsConfig (stockflow.cors.allowed-origins, CORS_ALLOWED_ORIGINS), application.yml backend, stockflow.cors.allowed-origins (CORS_ALLOWED_ORIGINS, default localhost:5173), spring.flyway schemas stockflow, jpa.hibernate.ddl-auto validate, format_sql, open-in-view false, logging org.hibernate.SQL debug, server.port 8080

### Community 91 - "Postman Guides"
Cohesion: 0.18
Nodes (11): requests.http en IntelliJ, Colección versionada en git (postman/collections), Colección StockFlow - Pruebas completas (57 peticiones, 139 pruebas), Carpeta 06 CORS: preflight OPTIONS 200/403, Postman en la defensa del parcial (preguntas 14, 18, 20, 24), Guía de Postman StockFlow (Linux), Scripts Post-response (pm.test y variables), Postman Runner (ejecutar colección en orden) (+3 more)

### Community 92 - "UnidadMedida Enum"
Cohesion: 0.18
Nodes (7): UnidadMedida, CAJA, KILOGRAMO, LITRO, METRO, PAQUETE, UNIDAD

### Community 93 - "Mobile Expo Dependencies"
Cohesion: 0.20
Nodes (10): dependencies, expo, expo-constants, expo-linking, expo-router, expo-status-bar, react, react-native (+2 more)

### Community 95 - "Backend README Contracts"
Cohesion: 0.22
Nodes (5): Endpoint GET /api/productos agregado (commit 46150a5), Un único almacén central activo (409), Contrato HTTP de la API (categorías, productos, ubicaciones, inventario), Pruebas: ProductoTest, *ServiceTest, ProductoControllerTest, PersistenciaPostgresTest, stockflow-backend (Capítulos 03-08, Spring Boot 3.5 hexagonal)

### Community 98 - "Not-Found Exceptions"
Cohesion: 0.28
Nodes (3): UbicacionNoEncontradaException, ProductoNoEncontradoException, RecursoNoEncontradoException

### Community 99 - "Mobile Template Icons"
Cohesion: 0.25
Nodes (8): Android Adaptive Icon Background (Expo blueprint grid), Android Adaptive Icon Foreground (Expo chevron), Android Adaptive Icon Monochrome (Expo chevron), Expo Template Default Branding, Mobile App Web Favicon (Expo chevron), Mobile App Icon (Expo default), Splash Screen Icon (Expo grid placeholder), StockFlow Web Favicon (bar chart logo)

### Community 100 - "1:N Relationship ADR"
Cohesion: 0.32
Nodes (4): ADR-003 Relación Categoría 1:N Producto y lado inverso, Errores de arranque por mappedBy/@JoinColumn (schema-validation), PersistenciaPostgresTest (Testcontainers), Mapeo ParkFlow360 (Cliente→Vehículo) a StockFlow (Categoría→Producto)

### Community 101 - "Demo Users & Roles"
Cohesion: 0.46
Nodes (5): USUARIOS_DEMO, ROL_INFO, RolCodigo, ROLES, Usuario

### Community 102 - "Backend Lab README"
Cohesion: 0.29
Nodes (4): Relación Categoria 1:N Producto en Java puro (List<Producto>), Excepciones propias (CategoriaNoEncontrada, CodigoCategoriaDuplicado, StockMinimoInvalido…), stockflow-backend-lab (Capítulos 01-02 Java 21), enum UnidadMedida desde el CHECK real

### Community 103 - "Frontend npm Scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, preview, test, test:run

### Community 104 - "Mobile Tab Selector"
Cohesion: 0.33
Nodes (4): OPCIONES, Props, styles, Seccion

### Community 105 - "Mobile tsconfig"
Cohesion: 0.33
Nodes (5): compilerOptions, strict, extends, include, expo/tsconfig.base

### Community 108 - "oxlint Config"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 109 - "Frontend Runtime Deps"
Cohesion: 0.33
Nodes (6): dependencies, @fontsource-variable/inter, lucide-react, react, react-dom, react-router

### Community 110 - "Git Conventions ADR"
Cohesion: 0.60
Nodes (4): ADR-008 Convenciones de Git, Commits pequeños con formato tipo: descripción, main como rama estable protegida, Pull request a main revisado por otro integrante

### Community 112 - "Git GUI Clients"
Cohesion: 0.40
Nodes (5): Fork (cliente Git GUI), Clientes GUI de Git, GitHub Desktop, GitKraken, Sourcetree

### Community 114 - "Git Init Basics"
Cohesion: 0.67
Nodes (3): git init, Rama main / master, oh-my-zsh

### Community 115 - "Postman Health Folder"
Cohesion: 0.67
Nodes (3): Health folder collection, Health 200 OK example, GET /api/health

## Ambiguous Edges - Review These
- `EmptyState` → `ReturnButton`  [AMBIGUOUS]
  androidstudio/stockflow-mobile/docs/guia-03.md · relation: semantically_similar_to
- `Cuenta y perfil de GitHub (README de perfil)` → `Repositorio github.com/mouredev/hello-git`  [AMBIGUOUS]
  LIBROS-AYUDA/Git_y_Github/Git_y_GitHub_Desde_Cero_-_2da_Ed_-_Brais_Moure.pdf · relation: conceptually_related_to

## Knowledge Gaps
- **161 isolated node(s):** `expo`, `expo-constants`, `expo-linking`, `react`, `react-native-safe-area-context` (+156 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 559 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Guía 03 móvil: navegación Expo Router` connect `Mobile Typecheck Evidence` to `Mobile Home & Categories`, `Expo & Postman Workspace`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `expo`, `expo-constants`, `expo-linking` to the rest of the system?**
  _161 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Ubicaciones Backend` be split into smaller, more focused modules?**
  _Cohesion score 0.06553128470936691 - nodes in this community are weakly interconnected._
- **Why does `Guía 02 móvil: componentes, props, estado` connect `Mobile Typecheck Evidence` to `Docker Compose & Seed Data`, `Guide 01 Mobile Setup`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `Backend Architecture Concepts` be split into smaller, more focused modules?**
  _Cohesion score 0.05182443151771549 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `EmptyState` and `ReturnButton`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `Cuenta y perfil de GitHub (README de perfil)` and `Repositorio github.com/mouredev/hello-git`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._