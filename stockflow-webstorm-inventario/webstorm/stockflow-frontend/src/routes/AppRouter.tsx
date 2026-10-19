import { Route, Routes } from 'react-router';
import CategoriasPage from '../features/categorias/pages/CategoriasPage';
import ExistenciasPage from '../features/inventario/pages/ExistenciasPage';
import KardexPage from '../features/inventario/pages/KardexPage';
import ProductosPage from '../features/productos/pages/ProductosPage';
import UbicacionesPage from '../features/ubicaciones/pages/UbicacionesPage';
import MainLayout from '../layouts/MainLayout';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';

/**
 * G02: qué página corresponde a cada URL. Las rutas hijas no empiezan con "/" porque cuelgan
 * de la ruta de layout. Ojo: /categorias es una ruta del NAVEGADOR, no el endpoint /api/categorias.
 */
export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="categorias" element={<CategoriasPage />} />
        <Route path="productos" element={<ProductosPage />} />
        <Route path="ubicaciones" element={<UbicacionesPage />} />
        <Route path="existencias" element={<ExistenciasPage />} />
        <Route path="kardex" element={<KardexPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
