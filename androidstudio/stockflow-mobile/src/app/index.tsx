import { Link } from 'expo-router';
import { ScrollView, Pressable, StyleSheet, Text, View } from 'react-native';
import { MetricCard } from '../components/MetricCard';
import { CATEGORIAS, PRODUCTOS } from '../data/demoData';
import { PALETTE } from '../theme/palette';

/** Ruta / : menú de la aplicación. */
export default function InicioScreen() {
  return (
    <ScrollView contentContainerStyle={styles.contenido}>
      <Text style={styles.etiqueta}>PROGRAMACIÓN APLICADA · GUÍA 03</Text>
      <Text style={styles.titulo}>StockFlow Mobile</Text>
      <Text style={styles.descripcion}>
        Navegación entre pantallas con Expo Router, React Native y TypeScript.
      </Text>
      <View style={styles.metricas}>
        <MetricCard etiqueta="Categorías" valor={CATEGORIAS.length} />
        <MetricCard etiqueta="Productos" valor={PRODUCTOS.length} />
      </View>
      <Text style={styles.subtitulo}>¿Dónde quieres entrar?</Text>
      <Link href="/categorias" asChild>
        <Pressable style={styles.boton} accessibilityRole="link">
          <Text style={styles.botonTitulo}>Explorar categorías →</Text>
          <Text style={styles.botonSub}>Ver categorías y sus productos asociados</Text>
        </Pressable>
      </Link>
      <Link href="/productos" asChild>
        <Pressable style={styles.boton} accessibilityRole="link">
          <Text style={styles.botonTitulo}>Explorar productos →</Text>
          <Text style={styles.botonSub}>Consultar todos los productos de ejemplo</Text>
        </Pressable>
      </Link>
      <Link href="/ayuda" asChild>
        <Pressable style={styles.botonSuave} accessibilityRole="link">
          <Text style={styles.botonTitulo}>Acerca de esta guía</Text>
        </Pressable>
      </Link>
      <Text style={styles.aviso}>
        Datos locales de ejemplo: todavía NO existe consumo de API REST.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenido: { paddingHorizontal: 18, paddingTop: 24, paddingBottom: 42 },
  etiqueta: { fontSize: 12, fontWeight: '800', color: PALETTE.acento },
  titulo: { marginTop: 8, fontSize: 28, fontWeight: '800', color: PALETTE.principal },
  descripcion: { marginTop: 10, lineHeight: 23, color: PALETTE.secundario },
  metricas: { flexDirection: 'row', gap: 10, marginTop: 20 },
  subtitulo: { marginTop: 25, marginBottom: 12, color: PALETTE.principal, fontSize: 18, fontWeight: '800' },
  boton: { backgroundColor: PALETTE.superficie, borderRadius: 14, padding: 17,
    borderWidth: 1, borderColor: PALETTE.borde, marginBottom: 11 },
  botonTitulo: { color: PALETTE.principal, fontSize: 16, fontWeight: '800' },
  botonSub: { color: PALETTE.secundario, marginTop: 6, lineHeight: 20 },
  botonSuave: { backgroundColor: PALETTE.acentoClaro, borderRadius: 14, padding: 17 },
  aviso: { marginTop: 23, lineHeight: 21, color: PALETTE.acento, fontSize: 13 },
});
