# Capítulos 01 y 02 - Java 21 · StockFlow (PA-06)

Proyecto: **stockflow-backend-lab** · Package base: `com.stockflow`

## Entidades elegidas
- Tabla padre: `categoria` (PK `categoria_id`) -> módulo `category`
- Tabla dependiente: `producto` (PK `producto_id`) -> módulo `product`
- Relación: 1:N (una categoría agrupa muchos productos; cada producto pertenece a una categoría)
- FK: `producto.categoria_id -> categoria.categoria_id`
- UNIQUE: `categoria.codigo`, `producto.codigo` (RN-06)
- Dominio controlado: `producto.unidad_medida` (CHECK) -> `enum UnidadMedida`

## Cómo ejecutarlo en IntelliJ
1. File > Open > carpeta `stockflow-backend-lab` (IntelliJ lo detecta como Maven).
2. Project Structure > SDK = Java 21.
3. Ejecuta `com.stockflow.Main`.

## Capítulo 01 (Java esencial)
- `Categoria` y `Producto` con atributos `private` y constructores que validan.
- Relación 1:N: `List<Producto>` privada dentro de `Categoria` + `agregarProducto()`.
- Reglas: el producto debe pertenecer a la categoría y su código no puede repetirse (RN-06); el stock mínimo nunca es negativo.
- Enum `UnidadMedida` sale del CHECK real de la tabla.
- `CategoriaResumen` es un record inmutable.

## Capítulo 02 (contratos, colecciones y errores)
### Colección elegida
Usamos `Map<Long, Categoria>` porque la búsqueda principal es por id (como la PK). `LinkedHashMap` mantiene el orden para listar.
### Optional
`buscarPorId` puede no encontrar la categoría; `Optional` lo hace visible y el servicio lo convierte en `CategoriaNoEncontradaException`.
### Excepciones propias
- `CategoriaNoEncontradaException`: id inexistente.
- `CodigoCategoriaDuplicadoException`: viola el UNIQUE lógico de `codigo`.
- `CodigoProductoRepetidoEnCategoriaException`: RN-06 dentro de la categoría.
- `StockMinimoInvalidoException`: protege el CHECK `stock_minimo_default >= 0`.
### Enum
`UnidadMedida` evita textos libres como "cajita" o "und".
### Record
`RegistrarProductoCommand` lleva sólo los datos de la operación de alta.
### ¿Qué cambiará con PostgreSQL?
Sólo `CategoriaRepositoryEnMemoria` se reemplaza por un adaptador JPA. `CategoriaService` no cambia porque depende de la interfaz.

## Commits sugeridos
```
git commit -m "feat: crear modelo Java inicial del dominio"
git commit -m "feat(java): aplicar interfaces colecciones optional y excepciones al dominio"
```
