# StockFlow Mobile

App Android de StockFlow con React Native, Expo y TypeScript. Sigue las guías ParkFlow360 del curso,
adaptadas a Categoría (1) → Producto (N). Avance y evidencias de cada guía en `docs/`.

## Ejecutar en el emulador

Requisitos: Node LTS, Android SDK con `ANDROID_HOME` y `platform-tools` en el PATH, y un AVD encendido
(`adb devices` debe mostrar `device`).

```bash
npm install
npx expo start --android
```

En Android 17 Expo Go pide permiso de red local para conectarse a la IP del PC. En el emulador se evita
redirigiendo el puerto de Metro:

```bash
adb reverse tcp:8081 tcp:8081
adb shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8081" host.exp.exponent
```

Si la descarga de Expo Go falla con `ETIMEDOUT`, darle más tiempo a Node:
`NODE_OPTIONS="--network-family-autoselection-attempt-timeout=3000" npx expo start --android`.

Antes de entregar: `npx tsc --noEmit`.
