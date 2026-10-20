import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { ProductoNavegable } from '../../components/ProductoNavegable';
import { ReturnButton } from '../../components/ReturnButton';
import { CATEGORIAS, PRODUCTOS } from '../../data/demoData';
import { PALETTE } from '../../theme/palette';
import { leerIdPositivo } from '../../utils/routeParams';

/** Ruta /categorias/1, /categorias/2, etc. */
export default function DetalleCategoriaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const categoriaId = leerIdPositivo(id);
  const categoria = CATEGORIAS.find((c) => c.id === categoriaId);

  if (!categoria) {
    return (
      <View style={styles.contenido}>
        <EmptyState mensaje="No se encontró la categoría solicitada o su ID no es válido." />
        <Link href="/categorias" asChild>
          <Pressable style={styles.accion} accessibilityRole="link">
            <Text style={styles.accionTexto}>Ir a la lista de categorías</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  // La relación 1:N sigue siendo el mismo filtro de la Guía 02.
  const productos = PRODUCTOS.filter((p) => p.categoriaId === categoria.id);

  return (
    <ScrollView contentContainerStyle={styles.contenido}>
      <ReturnButton destinoSiNoHayHistorial="/categorias" />
      <Text style={styles.etiqueta}>CATEGORÍA N.º {categoria.id} · {categoria.codigo}</Text>
      <Text style={styles.titulo}>{categoria.nombre}</Text>
      <Text style={styles.dato}>Descripción: {categoria.descripcion ?? 'Sin descripción'}</Text>
      <Text style={styles.dato}>
        Estado: {categoria.activo ? 'ACTIVA' : 'INACTIVA'}
      </Text>
      <Text style={styles.subtitulo}>Productos asociados ({productos.length})</Text>
      {productos.length === 0 ? (
        <EmptyState mensaje="Esta categoría aún no tiene productos en los datos de ejemplo." />
      ) : (
        productos.map((p) => (
          <ProductoNavegable
            key={p.id}
            producto={p}
            nombreCategoria={categoria.nombre}
          />
        ))
      )}
      <Text style={styles.pie}>Una categoría puede tener cero, uno o varios productos.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenido: { padding: 18, paddingBottom: 40 },
  etiqueta: { color: PALETTE.acento, fontWeight: '800', marginTop: 6 },
  titulo: { marginTop: 6, fontSize: 25, color: PALETTE.principal, fontWeight: '800' },
  dato: { marginTop: 9, color: PALETTE.secundario, lineHeight: 22 },
  subtitulo: { fontSize: 18, fontWeight: '800', marginTop: 25, marginBottom: 14, color: PALETTE.principal },
  pie: { color: PALETTE.secundario, textAlign: 'center', marginTop: 13 },
  accion: { marginTop: 16, backgroundColor: PALETTE.acentoClaro, padding: 17, borderRadius: 12 },
  accionTexto: { color: PALETTE.principal, fontWeight: '700', textAlign: 'center' },
});
