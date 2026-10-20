import { Link, Stack } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PALETTE } from '../theme/palette';

/** Se activa cuando la ruta NO coincide con ningún archivo de src/app. */
export default function RutaNoEncontradaScreen() {
  return (
    <View style={styles.contenido}>
      <Stack.Screen options={{ title: 'Ruta no encontrada' }} />
      <Text style={styles.titulo}>Pantalla desconocida</Text>
      <Text style={styles.detalle}>
        La dirección solicitada no corresponde a una pantalla de StockFlow.
      </Text>
      <Link href="/" asChild>
        <Pressable style={styles.accion} accessibilityRole="link">
          <Text style={styles.accionTexto}>Ir al inicio</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  contenido: { flex: 1, padding: 22, justifyContent: 'center' },
  titulo: { fontSize: 23, fontWeight: '800', color: PALETTE.principal },
  detalle: { marginTop: 12, lineHeight: 23, color: PALETTE.secundario },
  accion: { marginTop: 22, padding: 17, borderRadius: 12, backgroundColor: PALETTE.acentoClaro },
  accionTexto: { fontWeight: '700', color: PALETTE.principal, textAlign: 'center' },
});
