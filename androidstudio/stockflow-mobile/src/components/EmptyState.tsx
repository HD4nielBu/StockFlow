import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PALETTE } from '../theme/palette';

type Props = { mensaje: string };

export function EmptyState({ mensaje }: Props) {
  return (
    <View style={styles.caja}>
      <Text style={styles.titulo}>Sin resultados</Text>
      <Text style={styles.texto}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caja: {
    padding: 18,
    borderRadius: 12,
    backgroundColor: PALETTE.acentoClaro,
  },
  titulo: { fontWeight: '800', color: PALETTE.principal, fontSize: 15 },
  texto: { marginTop: 6, lineHeight: 21, color: PALETTE.secundario },
});
