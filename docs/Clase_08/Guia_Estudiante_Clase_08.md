# PROGRAMACIÓN APLICADA 2026-2
## CLASE 08
**JOIN y consultas relacionales aplicadas a las relaciones reales de tu dominio**

### 1. Qué debes conseguir en esta clase
Combinar información de varias tablas siguiendo PK y FK.
INNER JOIN, LEFT JOIN, JOIN encadenado (3+ tablas), entender aliases, ON vs WHERE, NULL, y evitar duplicados/productos cartesianos involuntarios.

### 2. Qué debes observar del profesor (ParkFlow 360)
Cómo localiza FK, traduce preguntas de negocio, usa aliases, predice filas, y diferencia INNER/LEFT JOIN.

### 3. Lo que NO debes copiar
Consultas de ParkFlow, relaciones no respaldadas por FK de tu modelo, uso excesivo de DISTINCT.

### 4. Archivos que debes tener abiertos
Ficha oficial, modelos (DER lógico, físico), scripts V1 y V2, DataGrip, repositorio Git.

### 5. Paso 1: Selecciona relaciones reales de TU proyecto
Identifica Tabla Padre, PK, Tabla Hija, FK, y Cardinalidad.

### 6. Paso 2: Formula preguntas de negocio
Define preguntas útiles para JOIN 2 tablas, JOIN 3 tablas, LEFT JOIN, y registros sin coincidencia.

### 7. Paso 3: INNER JOIN de dos tablas
```sql
SELECT a.columna, b.columna
FROM tabla_hija a
INNER JOIN tabla_padre b ON b.id = a.padre_id;
```
Responde qué representa la fila y por qué el ON es correcto.

### 8. Ejemplos de transferencia por dominio
Aplica lógica a tu modelo (ej. paciente -> cita, cliente -> orden).

### 9. Paso 4: JOIN encadenado de tres tablas
Dibuja el recorrido A -> B -> C antes de escribir el SQL.

### 10. Paso 5: LEFT JOIN
```sql
SELECT p.id, p.nombre, h.id AS hijo_id
FROM tabla_padre p
LEFT JOIN tabla_hija h ON h.padre_id = p.id;
```

### 11. Paso 6: Encontrar registros sin hijos
Usa `LEFT JOIN` y `WHERE h.id IS NULL`.

### 12. Paso 7: ON y WHERE
ON: cómo se relacionan. WHERE: qué subconjunto quieres.

### 13. Paso 8: Comprende la cardinalidad del resultado
Si un padre tiene múltiples hijos, la fila del padre se repetirá en un JOIN. No uses DISTINCT sin analizar.

### 14. Paso 9: Provoca y diagnostica un error
Modifica un ON deliberadamente (copia temporal) y observa el error (ej. crecimiento multiplicativo).

### 15. Archivo obligatorio de la Clase 08
Crea `backend/src/main/resources/db/queries/class08_joins.sql` con 6 consultas comentadas (INNER, 3 tablas, WHERE, LEFT JOIN, IS NULL, extra).

### 16. Checklist técnico antes del commit
ON justificado por FK, no SELECT *, aliases claros, sin DISTINCT innecesario, preguntas de dominio reales.

### 17. Revisión cruzada obligatoria
Valida con un compañero de equipo.

### 18. Commit de la Clase 08
```bash
git add backend/src/main/resources/db/queries/class08_joins.sql
git commit -m "feat(db): add join queries for class 08"
```
