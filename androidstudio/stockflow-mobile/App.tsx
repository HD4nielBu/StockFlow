import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CategoriaCard } from './src/components/CategoriaCard';
import { EmptyState } from './src/components/EmptyState';
import { MetricCard } from './src/components/MetricCard';
import { ProductoCard } from './src/components/ProductoCard';
import { TabSelector } from './src/components/TabSelector';
import { CATEGORIAS, PRODUCTOS } from './src/data/demoData';
import type { Seccion } from './src/models/inventario';
import { PALETTE } from './src/theme/palette';

export default function App() {
  const [seccion, setSeccion] = useState<Seccion>('categorias');
  const [categoriaId, setCategoriaId] = useState<number | null>(null);

  const categoriaElegida = CATEGORIAS.find((c) => c.id === categoriaId) ?? null;
  // Relación 1:N: los productos de la categoría elegida se derivan con filter, no se guardan en otro estado
  const productosElegidos = categoriaElegida
    ? PRODUCTOS.filter((p) => p.categoriaId === categoriaElegida.id)
    : [];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.pantalla} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.contenido}>
          <Text style={styles.sobreTitulo}>PROGRAMACIÓN APLICADA</Text>
          <Text style={styles.titulo}>StockFlow</Text>
          <Text style={styles.subtitulo}>
            Guía 02: componentes, props, estado y estilos.
          </Text>

          <View style={styles.indicadores}>
            <MetricCard etiqueta="Categorías de ejemplo" valor={CATEGORIAS.length} />
            <MetricCard etiqueta="Productos de ejemplo" valor={PRODUCTOS.length} />
          </View>

          <Text style={styles.seccionTitulo}>Explorar información</Text>
          <TabSelector actual={seccion} alCambiar={setSeccion} />

          {seccion === 'categorias' ? (
            <View style={styles.grupo}>
              <Text style={styles.ayuda}>
                Toca una categoría para ver su relación con los productos.
              </Text>
              {CATEGORIAS.map((categoria) => (
                <CategoriaCard
                  key={categoria.id}
                  categoria={categoria}
                  cantidadProductos={
                    PRODUCTOS.filter((p) => p.categoriaId === categoria.id).length
                  }
                  seleccionada={categoriaId === categoria.id}
                  alSeleccionar={() => setCategoriaId(categoria.id)}
                />
              ))}

              {categoriaElegida && (
                <View style={styles.detallePanel}>
                  <Text style={styles.detalleTitulo}>
                    Productos de {categoriaElegida.nombre}
                  </Text>
                  {productosElegidos.length === 0 ? (
                    <EmptyState mensaje="Esta categoría no tiene productos en los datos de ejemplo." />
                  ) : (
                    productosElegidos.map((producto) => (
                      <ProductoCard
                        key={producto.id}
                        producto={producto}
                        nombreCategoria={categoriaElegida.nombre}
                      />
                    ))
                  )}
                </View>
              )}
            </View>
          ) : (
            <View style={styles.grupo}>
              <Text style={styles.ayuda}>
                Esta lista muestra los cinco productos de ejemplo.
              </Text>
              {PRODUCTOS.map((producto) => {
                const categoria = CATEGORIAS.find((c) => c.id === producto.categoriaId);
                return (
                  <ProductoCard
                    key={producto.id}
                    producto={producto}
                    nombreCategoria={categoria?.nombre ?? 'Categoría no encontrada'}
                  />
                );
              })}
            </View>
          )}

          <Text style={styles.aviso}>
            IMPORTANTE: son datos locales de ejemplo; no hay API REST ni PostgreSQL.
          </Text>
          <Text style={styles.pie}>Categoría (1) - Producto (N)</Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: PALETTE.fondo },
  contenido: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 48 },
  sobreTitulo: { color: PALETTE.acento, fontSize: 12, fontWeight: '800' },
  titulo: { color: PALETTE.principal, fontSize: 32, fontWeight: '800', marginTop: 7 },
  subtitulo: { color: PALETTE.secundario, marginTop: 8, fontSize: 15 },
  indicadores: { flexDirection: 'row', gap: 12, marginTop: 22 },
  seccionTitulo: {
    marginTop: 26,
    fontSize: 19,
    fontWeight: '800',
    color: PALETTE.principal,
  },
  grupo: { marginTop: 16 },
  ayuda: { color: PALETTE.secundario, marginBottom: 13, lineHeight: 21 },
  detallePanel: {
    backgroundColor: PALETTE.fondo,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: PALETTE.borde,
  },
  detalleTitulo: {
    color: PALETTE.principal,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  aviso: { marginTop: 18, color: PALETTE.acento, lineHeight: 21, fontSize: 13 },
  pie: { marginTop: 23, textAlign: 'center', color: PALETTE.secundario },
});
