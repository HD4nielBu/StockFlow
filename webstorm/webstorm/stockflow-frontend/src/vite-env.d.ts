/// <reference types="vite/client" />

// G05: tipado de las variables de entorno que usa StockFlow
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
