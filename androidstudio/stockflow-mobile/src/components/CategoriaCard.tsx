import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Categoria } from '../models/inventario';
import { PALETTE } from '../theme/palette';

type Props = {
  categoria: Categoria;
  cantidadProductos: number;
  seleccionada: boolean;
  alSeleccionar: () => void;
};

export function CategoriaCard({
  categoria,
  cantidadProductos,
  seleccionada,
  alSeleccionar,
}: Props) {
  return (
    <Pressable
      onPress={alSeleccionar}
      accessibilityRole="button"
      accessibilityLabel={`Ver productos de ${categoria.nombre}`}
      accessibilityState={{ selected: seleccionada }}
      style={[styles.tarjeta, seleccionada && styles.tarjetaSeleccionada]}
    >
      <View style={styles.fila}>
        <Text style={styles.nombre}>{categoria.nombre}</Text>
        <Text style={[styles.estado, !categoria.activo && styles.inactiva]}>
          {categoria.activo ? 'ACTIVA' : 'INACTIVA'}
        </Text>
      </View>
      <Text style={styles.detalle}>
        {categoria.codigo}
        {categoria.descripcion ? ` · ${categoria.descripcion}` : ''}
      </Text>
      <Text style={styles.detalle}>
        {cantidadProductos} producto(s) en los datos de ejemplo
      </Text>
      <Text style={styles.accion}>
        {seleccionada ? 'Categoría seleccionada' : 'Tocar para ver sus productos'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: PALETTE.superficie,
    borderWidth: 1,
    borderColor: PALETTE.borde,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  tarjetaSeleccionada: { borderColor: PALETTE.acento, borderWidth: 2 },
  fila: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  nombre: { fontSize: 17, fontWeight: '800', color: PALETTE.principal },
  estado: {
    fontSize: 11,
    fontWeight: '800',
    color: PALETTE.acento,
    backgroundColor: PALETTE.acentoClaro,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
  },
  inactiva: {
    color: PALETTE.inactivo,
    backgroundColor: PALETTE.inactivoClaro,
  },
  detalle: { marginTop: 8, color: PALETTE.secundario, fontSize: 13 },
  accion: { marginTop: 12, color: PALETTE.acento, fontWeight: '700' },
});
