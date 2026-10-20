import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { CategoriaCard } from '../../components/CategoriaCard';
import { CATEGORIAS, PRODUCTOS } from '../../data/demoData';
import { PALETTE } from '../../theme/palette';

/** Ruta /categorias : lista de categorías. */
export default function CategoriasScreen() {
  const router = useRouter();
  return (
    <FlatList
      data={CATEGORIAS}
      keyExtractor={(categoria) => String(categoria.id)}
      contentContainerStyle={styles.contenido}
      ListHeaderComponent={
        <View style={styles.encabezado}>
          <Text style={styles.titulo}>Categorías registradas</Text>
          <Text style={styles.ayuda}>
            Selecciona una categoría. Se abrirá otra pantalla con su detalle.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <CategoriaCard
          categoria={item}
          cantidadProductos={PRODUCTOS.filter((p) => p.categoriaId === item.id).length}
          seleccionada={false}
          alSeleccionar={() => router.push({
            pathname: '/categorias/[id]',
            params: { id: String(item.id) },
          })}
        />
      )}
      ListFooterComponent={
        <Text style={styles.pie}>Estos datos son locales, no vienen del backend.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  contenido: { padding: 18, paddingBottom: 35 },
  encabezado: { marginBottom: 12 },
  titulo: { fontSize: 23, fontWeight: '800', color: PALETTE.principal },
  ayuda: { marginTop: 10, color: PALETTE.secundario, lineHeight: 22 },
  pie: { textAlign: 'center', color: PALETTE.acento, marginTop: 14, fontSize: 13 },
});
