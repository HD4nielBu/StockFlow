import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ProductoNavegable } from '../../components/ProductoNavegable';
import { CATEGORIAS, PRODUCTOS } from '../../data/demoData';
import { PALETTE } from '../../theme/palette';

/** Ruta /productos : catálogo local de productos. */
export default function ProductosScreen() {
  return (
    <FlatList
      data={PRODUCTOS}
      keyExtractor={(producto) => String(producto.id)}
      contentContainerStyle={styles.contenido}
      ListHeaderComponent={
        <View style={styles.encabezado}>
          <Text style={styles.titulo}>Todos los productos</Text>
          <Text style={styles.ayuda}>Toca una tarjeta para consultar su detalle.</Text>
        </View>
      }
      renderItem={({ item }) => {
        const categoria = CATEGORIAS.find((c) => c.id === item.categoriaId);
        return (
          <ProductoNavegable
            producto={item}
            nombreCategoria={categoria?.nombre ?? 'Categoría no encontrada'}
          />
        );
      }}
      ListFooterComponent={
        <Text style={styles.pie}>Productos locales de ejemplo.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  contenido: { padding: 18, paddingBottom: 35 },
  encabezado: { marginBottom: 14 },
  titulo: { fontSize: 23, fontWeight: '800', color: PALETTE.principal },
  ayuda: { marginTop: 10, color: PALETTE.secundario, lineHeight: 21 },
  pie: { color: PALETTE.acento, textAlign: 'center', marginTop: 10 },
});
