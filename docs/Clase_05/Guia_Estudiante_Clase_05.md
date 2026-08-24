# PROGRAMACIÓN APLICADA 2026-2
## CLASE 05
**Diseño físico previo a PostgreSQL**
*Tipos de datos candidatos | convenciones | constraints | estrategia de migración*

**GUÍA DEL ESTUDIANTE**
Observa ParkFlow 360, comprende el patrón y aplícalo exclusivamente a tu proyecto asignado.

- **Duración:** 90 minutos
- **Proyecto espejo:** ParkFlow 360
- **Frontera técnica:** Diseño físico preparado; sin ejecutar CREATE TABLE
- **Evidencia:** Modelo físico v0.1 + plan de migración + commit

### 1. Regla de trabajo de esta guía: ParkFlow NO es tu proyecto
El profesor mostrará estas decisiones usando ParkFlow 360. Tu responsabilidad es identificar el método y aplicarlo al proyecto oficial de tu equipo. No copies nombres de tablas, tipos, campos ni reglas de ParkFlow si no corresponden a tu dominio.

Tu secuencia de trabajo en esta clase será: OBSERVAR → ENTENDER → TRADUCIR → JUSTIFICAR → DOCUMENTAR → VERSIONAR.

### 2. Qué debes lograr hoy en TU proyecto
* Tomar el DER lógico y diccionario de datos de tu equipo como fuente de trabajo.
* Definir convenciones de nombres para la base de datos de tu proyecto.
* Asignar tipos PostgreSQL candidatos a los atributos relevantes.
* Decidir estrategia de identificadores sin copiar la decisión de ParkFlow automáticamente.
* Justificar nulabilidad, unicidad, dominios y restricciones.
* Distinguir reglas simples de fila de reglas transaccionales entre varias filas.
* Planificar el orden de creación del núcleo de tu esquema.
* Crear un plan de migración V1, todavía sin ejecutar SQL.
* Dejar evidencia Git defendible por cualquier integrante.

**Frontera técnica**
En Clase 05 NO debes crear tablas en PostgreSQL. No ejecutes CREATE TABLE. Tampoco debes crear entidades JPA. Tu producto es un diseño físico preparado para ser implementado en Clase 06.

### 3. Antes de comenzar: abre las fuentes correctas
1. Abre la ficha oficial de tu proyecto asignado.
2. Revisa especialmente reglas de negocio, modelo mínimo esperado, requisitos funcionales y flujo crítico.
3. Abre tu `model-conceptual-v0.1.md` de Clase 02.
4. Abre tu `model-relational-v0.1.md` de Clase 03.
5. Abre tu `der-logico-v0.1.md` y `diccionario-datos-v0.1.md` de Clase 04.
6. Si estos documentos se contradicen, detente y corrige primero el modelo. No diseñes físicamente una contradicción.

### 4. Qué debes observar cuando el profesor usa ParkFlow
| El profesor muestra... | Tú debes preguntarte en tu proyecto... |
|---|---|
| `espacio.codigo` | ¿Qué códigos o identificadores operativos existen en mi dominio? |
| `vehiculo.placa` UNIQUE | ¿Qué dato de negocio no debería repetirse? |
| `reserva.fecha_inicio` TIMESTAMPTZ | ¿Tengo fechas calendario o instantes con hora? |
| tarifa NUMERIC | ¿Tengo importes/mediciones que exigen exactitud? |
| estado + CHECK | ¿Qué atributos tienen un conjunto cerrado de valores? |
| FK espacio zona | ¿Qué relaciones de mi DER deben materializarse como FK? |
| orden de tablas | ¿Qué tablas de mi proyecto dependen de otras? |

### 5. Paso 1: Define tus convenciones
Crea una convención pequeña y consistente. Puedes tomar como referencia el patrón mostrado por el profesor, pero debes decidirlo como equipo.

`docs/04-model/convenciones-bd-v0.1.md`

### 6. Paso 2 - Decide tu estrategia de identificadores
No preguntes "¿qué usa ParkFlow?". Pregunta "¿qué necesita mi proyecto?". Para el curso, BIGINT autogenerado es una opción simple y válida; UUID también puede ser válido si existe una razón.

### 7. Paso 3 Asigna tipos candidatos atributo por atributo
Trabaja sobre las tablas principales de tu primer flujo. No uses VARCHAR(255) automáticamente. Cada tipo debe responder a la semántica del dato.

| Dato conceptual | Preguntas | Tipo candidato |
|---|---|---|
| Código | ¿longitud razonable? ¿alfanumérico? | VARCHAR(n) |
| Descripción extensa | ¿puede crecer libremente? | TEXT |
| Cantidad | ¿entera o fraccionaria? | INTEGER/NUMERIC |
| Importe | ¿requiere exactitud decimal? | NUMERIC(p,s) |
| Fecha | ¿sólo día? | DATE |
| Evento con hora | ¿es un instante? | TIMESTAMPTZ |
| Bandera | ¿verdadero/falso real? | BOOLEAN |
| Estado | ¿conjunto cerrado? | VARCHAR + dominio controlado |

### 8. Ejemplos por proyecto: aprende el patrón, no el contenido
(Referencia de ejemplos omitida por brevedad, aplicar lógica a tu proyecto).

### 9. Paso 4: Nulabilidad: demuestra que NULL tiene significado
Para cada atributo, formula la pregunta: ¿puede existir una instancia válida de esta entidad sin conocer este dato en ese momento? Si la respuesta es sí, puede ser nullable. Si no, debe ser obligatorio.

### 10. Paso 5: Separa PK, UNIQUE y datos visibles
Una PK técnica identifica una fila. Una clave natural o dato de negocio puede requerir UNIQUE. No son equivalentes.

### 11. Paso 6: Clasifica tus restricciones
| Tipo de regla | Mecanismo fisico futuro | Ejemplo genérico |
|---|---|---|
| Identidad | PRIMARY KEY | id de una entidad |
| Referencia existente | FOREIGN KEY | detalle pertenece a cabecera |
| Dato obligatorio | NOT NULL | fecha de inicio requerida |
| No repetición | UNIQUE | código único |
| Coherencia de una fila | CHECK | fin > inicio; cantidad > 0 |
| Regla entre múltiples filas | lógica transaccional/constraint avanzado | evitar solapamientos |

### 12. Paso 7: Trata correctamente dinero, cantidades y mediciones
Si tu proyecto maneja dinero, evita FLOAT/DOUBLE. Usa NUMERIC(p,s).

### 13. Paso 8: Distingue DATE de TIMESTAMPTZ
DATE para calendario, TIMESTAMPTZ para instantes precisos.

### 14. Paso 9: Estados controlados
Extrae de tu ficha oficial las máquinas o conjuntos de estados.

### 15. Paso 10: Auditoría mínima
Evalúa `created_at` y `updated_at`. No agregues columnas decorativas.

### 16. Paso 11 - Construye tu modelo físico v0.1
Crea `docs/04-model/modelo-fisico-v0.1.md`.

### 17. Paso 12: Define el orden de creación por dependencias
Haz una lista de las tablas que entrarán en tu primera migración y ordénalas.

### 18. Paso 13: Crea tu plan de migración V1
Crea `docs/04-model/plan-migracion-v1.md`.

### 19. Prueba de coherencia contra tu flujo crítico
Recorre el flujo crítico oficial de tu proyecto y comprueba si el diseño puede almacenar cada paso.

### 20. Revisión cruzada obligatoria del equipo
Validar tipos de datos, nullables, restricciones, dependencias y reglas de negocio con otros miembros del equipo.

### 21. Qué NO debes hacer
* Copiar ParkFlow ciegamente.
* Usar VARCHAR(255) o FLOAT para todo.
* Poner NOT NULL a todo o NULL a todo.
* Crear tablas en PostgreSQL aún.

### 22. Comandos Git de cierre
```bash
git status
git add docs/04-model/modelo-fisico-v0.1.md
git add docs/04-model/convenciones-bd-v0.1.md
git add docs/04-model/plan-migracion-v1.md
git commit -m "docs: prepara diseño fisico inicial de base de datos"
git log --oneline -5
```
