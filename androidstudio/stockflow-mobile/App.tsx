import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

type Seccion = 'categorias' | 'productos';

export default function App() {
  const [seccion, setSeccion] = useState<Seccion>('categorias');
  const esCategorias = seccion === 'categorias';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.pantalla} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.contenido}>
          <Text style={styles.etiqueta}>PROGRAMACIÓN APLICADA</Text>
          <Text style={styles.titulo}>StockFlow</Text>
          <Text style={styles.subtitulo}>
            Mi primera aplicación Android con React Native.
          </Text>

          {/* En cero a propósito: todavía no hay GET al backend ni datos reales */}
          <View style={styles.filaIndicadores}>
            <View style={styles.indicador}>
              <Text style={styles.numero}>0</Text>
              <Text style={styles.indicadorTexto}>Categorías</Text>
            </View>
            <View style={styles.indicador}>
              <Text style={styles.numero}>0</Text>
              <Text style={styles.indicadorTexto}>Productos</Text>
            </View>
          </View>

          <Text style={styles.seccionTitulo}>Explorar módulos</Text>
          <View style={styles.filaBotones}>
            <Pressable
              onPress={() => setSeccion('categorias')}
              accessibilityRole="button"
              accessibilityLabel="Mostrar módulo Categorías"
              accessibilityState={{ selected: esCategorias }}
              style={[styles.boton, esCategorias && styles.botonActivo]}
            >
              <Text
                style={[
                  styles.botonTexto,
                  esCategorias && styles.botonTextoActivo,
                ]}
              >
                Categorías
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSeccion('productos')}
              accessibilityRole="button"
              accessibilityLabel="Mostrar módulo Productos"
              accessibilityState={{ selected: !esCategorias }}
              style={[styles.boton, !esCategorias && styles.botonActivo]}
            >
              <Text
                style={[
                  styles.botonTexto,
                  !esCategorias && styles.botonTextoActivo,
                ]}
              >
                Productos
              </Text>
            </Pressable>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitulo}>
              {esCategorias ? 'Módulo Categorías' : 'Módulo Productos'}
            </Text>
            <Text style={styles.panelTexto}>
              {esCategorias
                ? 'Aquí mostraremos las categorías del inventario y sus datos.'
                : 'Aquí mostraremos los productos de una categoría.'}
            </Text>
            <Text style={styles.aviso}>
              Datos reales: ninguno. Sin API ni base de datos aún.
            </Text>
          </View>

          <Text style={styles.pie}>Categoría (1) - Producto (N)</Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#F4F7FB' },
  contenido: { padding: 20, paddingBottom: 42 },
  etiqueta: { fontSize: 12, color: '#087F85', fontWeight: '700' },
  titulo: { fontSize: 31, color: '#123451', fontWeight: '800', marginTop: 8 },
  subtitulo: { fontSize: 15, color: '#53647B', marginTop: 9 },
  filaIndicadores: { flexDirection: 'row', gap: 12, marginTop: 24 },
  indicador: {
    flex: 1, padding: 18, borderRadius: 16, backgroundColor: '#FFFFFF',
  },
  numero: { fontSize: 29, fontWeight: '700', color: '#123451' },
  indicadorTexto: { marginTop: 4, color: '#53647B' },
  seccionTitulo: { fontSize: 18, fontWeight: '700', marginTop: 26,
    marginBottom: 13, color: '#123451' },
  filaBotones: { flexDirection: 'row', gap: 10 },
  boton: { flex: 1, borderRadius: 12, padding: 14,
    backgroundColor: '#DCE9F2', alignItems: 'center' },
  botonActivo: { backgroundColor: '#087F85' },
  botonTexto: { color: '#123451', fontWeight: '700' },
  botonTextoActivo: { color: '#FFFFFF' },
  panel: { marginTop: 17, backgroundColor: '#FFFFFF',
    padding: 21, borderRadius: 17 },
  panelTitulo: { fontSize: 20, color: '#123451', fontWeight: '700' },
  panelTexto: { fontSize: 15, color: '#53647B', marginTop: 13,
    lineHeight: 23 },
  aviso: { fontSize: 13, color: '#087F85', marginTop: 21 },
  pie: { textAlign: 'center', color: '#53647B', marginTop: 30 },
});
