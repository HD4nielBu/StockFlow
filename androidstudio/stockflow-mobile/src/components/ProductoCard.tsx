import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Producto, UnidadMedida } from '../models/inventario';
import { PALETTE } from '../theme/palette';

type Props = {
  producto: Producto;
  nombreCategoria: string;
};

// Nombre legible de cada unidad; el valor del enum es el que viaja a la API.
const UNIDAD_LABEL: Record<UnidadMedida, string> = {
  UNIDAD: 'Unidad',
  CAJA: 'Caja',
  PAQUETE: 'Paquete',
  KILOGRAMO: 'Kilogramo (kg)',
  LITRO: 'Litro (L)',
  METRO: 'Metro (m)',
};

export function ProductoCard({ producto, nombreCategoria }: Props) {
  return (
    <View style={styles.tarjeta}>
      <Text style={styles.codigo}>{producto.codigo}</Text>
      <Text style={styles.detalle}>
        {producto.nombre} · {UNIDAD_LABEL[producto.unidadMedida]}
      </Text>
      <Text style={styles.categoria}>Categoría: {nombreCategoria}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: PALETTE.superficie,
    borderColor: PALETTE.borde,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  codigo: { color: PALETTE.principal, fontSize: 17, fontWeight: '800' },
  detalle: { color: PALETTE.secundario, fontSize: 14, marginTop: 6 },
  categoria: { color: PALETTE.acento, fontSize: 13, marginTop: 8 },
});
