import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PALETTE } from '../theme/palette';

/** Todas las pantallas comparten una navegación tipo pila (Stack). */
export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: PALETTE.principal },
          headerTintColor: PALETTE.superficie,
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: PALETTE.fondo },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'StockFlow' }} />
        <Stack.Screen name="categorias/index" options={{ title: 'Categorías' }} />
        <Stack.Screen name="categorias/[id]" options={{ title: 'Detalle de la categoría' }} />
        <Stack.Screen name="productos/index" options={{ title: 'Productos' }} />
        <Stack.Screen name="productos/[id]" options={{ title: 'Detalle del producto' }} />
        <Stack.Screen name="ayuda" options={{ title: 'Acerca de la práctica' }} />
        <Stack.Screen name="+not-found" options={{ title: 'Ruta desconocida' }} />
      </Stack>
    </>
  );
}
