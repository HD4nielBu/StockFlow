# PROGRAMACIÓN APLICADA 2026-2
## CLASE 07
**DML y consultas SQL básicas aplicadas a los datos reales de tu dominio**

### 1. Qué debes conseguir en esta clase
Insertar, consultar, filtrar, ordenar y modificar información con intención.
Demostrar dataset, lectura, filtros (WHERE, NULL), cambios (UPDATE) y eliminación (DELETE o no).

### 2. Qué debes observar mientras el profesor trabaja ParkFlow 360
Coherencia de datos, orden de inserción, uso de WHERE y NULL, verificación de UPDATE, decisiones sobre DELETE y versionado de scripts.

### 3. Lo que NO debes copiar
Nombres de ParkFlow, datos de estacionamientos, consultas sin sentido para tu ficha, o DELETEs que rompan históricos requeridos.

### 4. Archivos que debes tener abiertos
Ficha oficial, modelos (conceptual, relacional, lógico, físico), `V1_init_core.sql`, repositorio Git, base de datos en DataGrip.

### 5. Paso 1: Diseña tu dataset antes de insertarlo
Define 2-5 filas para 4-6 tablas núcleo. Asegura que los datos permitan probar filtros y relaciones.

### 6. Paso 2 - Crea un script reproducible de datos
Crea `backend/src/main/resources/db/migration/V2_seed_core.sql`
```sql
INSERT INTO tabla_padre (codigo, nombre) VALUES ('P01', 'Dato 1');
INSERT INTO tabla_hija (tabla_padre_id, codigo, estado) VALUES (1, 'H01', 'ACTIVO');
```

### 7. Paso 3: Predice antes de ejecutar
Verifica FKs y constraints. Ejecuta y verifica el resultado.

### 8. Paso 4: Aprende a consultar con SELECT
Evita `SELECT *` como respuesta final. Justifica columnas.

### 9. Paso 5: Formula preguntas reales de TU dominio
Formula preguntas de negocio y respóndelas con SQL.

### 10. Herramientas SQL mínimas de hoy
WHERE, =, <>, AND/OR, IN, BETWEEN, LIKE, IS NULL, ORDER BY, LIMIT.

### 11. Paso 6: Practica NULL sólo si existe en tu modelo
Usa `IS NULL` y `IS NOT NULL`. Nunca uses `= NULL`.

### 12. Paso 7: UPDATE - usa la regla SELECT → UPDATE → SELECT
1. Identifica la fila (SELECT).
2. Modifica con condición (UPDATE ... WHERE).
3. Verifica (SELECT).

### 13. Paso 8: Decide si DELETE tiene sentido en TU dominio
Analiza reglas de negocio; a menudo es mejor un "soft delete" (cambio de estado).

### 14. Paso 9: Crea tu archivo de consultas de estudio
Crea `docs/05-database/clase07-consultas.sql`. Incluye comentarios con las preguntas.

### 15. Las 8 consultas mínimas de tu equipo
Listado ordenado, filtros simples, AND/OR, IN/BETWEEN, LIKE, IS NULL/NOT NULL, reglas de dominio.

### 16. Paso 10: Provoca al menos un error y entiéndelo
Fuerza un error de UNIQUE o FK y comprende el mensaje.

### 17. Revisión cruzada obligatoria
Revisa script semilla y consultas con el equipo.

### 18. Evidencia Git
```bash
git add backend/src/main/resources/db/migration/V2_seed_core.sql docs/05-database/clase07-consultas.sql
git commit -m "feat(db): add seed data and basic queries"
```
