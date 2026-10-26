import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { ReturnButton } from '../components/ReturnButton';
import { PALETTE } from '../theme/palette';

/** Ruta /ayuda : objetivos de la práctica y errores controlados. */
export default function AyudaScreen() {
  return (
    <ScrollView contentContainerStyle={styles.contenido}>
      <ReturnButton destinoSiNoHayHistorial="/" />
      <Text style={styles.titulo}>¿Qué estamos practicando?</Text>
      <Text style={styles.parrafo}>
        Una ruta representa una pantalla. En esta guía las pantallas comparten
        datos de ejemplo dentro del teléfono y navegan usando identificadores.
      </Text>
      <Text style={styles.parrafo}>
        Todavía no guardamos información en PostgreSQL ni consultamos Spring Boot.
      </Text>
      <Text style={styles.subtitulo}>Laboratorio: categoría inexistente</Text>
      <Text style={styles.parrafo}>
        Abre una ruta válida, pero con un ID que no existe en los datos de ejemplo.
        La app debe mostrar un mensaje, no cerrarse.
      </Text>
      <Link href={{ pathname: '/categorias/[id]', params: { id: '999' } }} asChild>
        <Pressable style={styles.accion} accessibilityRole="link">
          <Text style={styles.accionTexto}>Probar categoría 999</Text>
        </Pressable>
      </Link>
      <Link href={{ pathname: '/productos/[id]', params: { id: 'abc' } }} asChild>
        <Pressable style={styles.accion} accessibilityRole="link">
          <Text style={styles.accionTexto}>Probar producto con ID inválido</Text>
        </Pressable>
      </Link>
      <Text style={styles.nota}>
        Estos botones son solo para pruebas didácticas. No aparecen en una
        aplicación empresarial terminada.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenido: { padding: 18, paddingBottom: 40 },
  titulo: { marginTop: 8, fontSize: 23, fontWeight: '800', color: PALETTE.principal },
  subtitulo: { marginTop: 25, fontSize: 18, fontWeight: '800', color: PALETTE.principal },
  parrafo: { marginTop: 12, lineHeight: 23, color: PALETTE.secundario },
  accion: { backgroundColor: PALETTE.acentoClaro, borderRadius: 12, padding: 17, marginTop: 12 },
  accionTexto: { textAlign: 'center', fontWeight: '700', color: PALETTE.principal },
  nota: { marginTop: 20, lineHeight: 21, color: PALETTE.acento, fontSize: 13 },
});
