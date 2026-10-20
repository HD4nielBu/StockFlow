import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { ReturnButton } from '../../components/ReturnButton';
import { CATEGORIAS, PRODUCTOS } from '../../data/demoData';
import { PALETTE } from '../../theme/palette';
import { leerIdPositivo } from '../../utils/routeParams';

/** Ruta /productos/1, /productos/2, etc. */
export default function DetalleProductoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productoId = leerIdPositivo(id);
  const producto = PRODUCTOS.find((p) => p.id === productoId);

  if (!producto) {
    return (
      <View style={styles.contenido}>
        <EmptyState mensaje="No se encontró el producto solicitado o su ID no es válido." />
        <Link href="/productos" asChild>
          <Pressable style={styles.accion} accessibilityRole="link">
            <Text style={styles.accionTexto}>Ir a la lista de productos</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  const categoria = CATEGORIAS.find((c) => c.id === producto.categoriaId);

  return (
    <ScrollView contentContainerStyle={styles.contenido}>
      <ReturnButton destinoSiNoHayHistorial="/productos" />
      <Text style={styles.etiqueta}>PRODUCTO N.º {producto.id}</Text>
      <Text style={styles.titulo}>{producto.codigo}</Text>
      <Text style={styles.dato}>Nombre: {producto.nombre}</Text>
      <Text style={styles.dato}>Unidad de medida: {producto.unidadMedida}</Text>
      <Text style={styles.dato}>Stock mínimo por defecto: {producto.stockMinimoDefault}</Text>
      <Text style={styles.subtitulo}>Categoría</Text>
      <Text style={styles.dato}>{categoria?.nombre ?? 'Categoría no encontrada'}</Text>
      {categoria ? (
        <Link
          href={{ pathname: '/categorias/[id]', params: { id: String(categoria.id) } }}
          asChild
        >
          <Pressable style={styles.accion} accessibilityRole="link">
            <Text style={styles.accionTexto}>Ver ficha de la categoría →</Text>
          </Pressable>
        </Link>
      ) : (
        <EmptyState mensaje="Este producto no tiene una categoría válida en los datos locales." />
      )}
      <Text style={styles.pie}>Se navega con identificadores, no copiando objetos completos.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenido: { padding: 18, paddingBottom: 40 },
  etiqueta: { color: PALETTE.acento, fontWeight: '800', marginTop: 6 },
  titulo: { marginTop: 8, fontSize: 28, color: PALETTE.principal, fontWeight: '800' },
  subtitulo: { fontSize: 18, fontWeight: '800', marginTop: 24, color: PALETTE.principal },
  dato: { marginTop: 10, color: PALETTE.secundario, lineHeight: 23 },
  accion: { marginTop: 17, backgroundColor: PALETTE.acentoClaro, padding: 17, borderRadius: 13 },
  accionTexto: { color: PALETTE.principal, fontWeight: '700', textAlign: 'center' },
  pie: { marginTop: 22, textAlign: 'center', lineHeight: 20, color: PALETTE.secundario },
});
