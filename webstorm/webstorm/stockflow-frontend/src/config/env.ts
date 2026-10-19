// G05/G10: un solo lugar lee la configuración. Si falta, el error aparece al arrancar y no en cada petición.
export const API_URL: string = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('Falta VITE_API_URL: crea .env.development (ver .env.example) y reinicia npm run dev');
}
