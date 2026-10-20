import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Seccion } from '../models/inventario';
import { PALETTE } from '../theme/palette';

type Props = {
  actual: Seccion;
  alCambiar: (nuevaSeccion: Seccion) => void;
};

const OPCIONES: { clave: Seccion; etiqueta: string }[] = [
  { clave: 'categorias', etiqueta: 'Categorías' },
  { clave: 'productos', etiqueta: 'Productos' },
];

export function TabSelector({ actual, alCambiar }: Props) {
  return (
    <View style={styles.fila}>
      {OPCIONES.map((opcion) => {
        const elegida = actual === opcion.clave;
        return (
          <Pressable
            key={opcion.clave}
            onPress={() => alCambiar(opcion.clave)}
            accessibilityRole="button"
            accessibilityLabel={`Mostrar ${opcion.etiqueta}`}
            accessibilityState={{ selected: elegida }}
            style={[styles.boton, elegida && styles.botonElegido]}
          >
            <Text style={[styles.texto, elegida && styles.textoElegido]}>
              {opcion.etiqueta}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', gap: 12, marginTop: 12 },
  boton: {
    flex: 1,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PALETTE.acentoClaro,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  botonElegido: { backgroundColor: PALETTE.acento },
  texto: { color: PALETTE.principal, fontSize: 15, fontWeight: '700' },
  textoElegido: { color: PALETTE.superficie },
});
