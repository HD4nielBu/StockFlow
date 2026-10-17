import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import InicioPage from '../pages/InicioPage';
import NotFoundPage from '../pages/NotFoundPage';

// Code splitting: cada página se descarga la primera vez que se visita. Inicio va en el bundle
// principal porque es la puerta de entrada. El <Suspense> de las páginas internas vive en MainLayout.
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const PerfilPage = lazy(() => import('../features/auth/pages/PerfilPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const CategoriasPage = lazy(() => import('../features/categorias/pages/CategoriasPage'));
const ProductosPage = lazy(() => import('../features/productos/pages/ProductosPage'));
const ExistenciasPage = lazy(() => import('../features/inventario/pages/ExistenciasPage'));
const MovimientosPage = lazy(() => import('../features/inventario/pages/MovimientosPage'));
const AlmacenesPage = lazy(() => import('../features/ubicaciones/pages/AlmacenesPage'));
const ReportesPage = lazy(() => import('../features/reportes/pages/ReportesPage'));
const UsuariosPage = lazy(() => import('../features/usuarios/pages/UsuariosPage'));
const ConfiguracionPage = lazy(() => import('../features/configuracion/pages/ConfiguracionPage'));

/**
 * Sin guard de rutas a propósito: no hay autenticación en el backend y un redirect a /login
 * aparentaría una protección que no existe. /login es la entrada al modo demostración.
 *
 * G02: qué página corresponde a cada URL. Las rutas hijas no empiezan con "/" porque cuelgan
 * de la ruta de layout. Ojo: /categorias es una ruta del NAVEGADOR, no el endpoint /api/categorias.
 */
export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="login"
        element={
          <Suspense fallback={null}>
            <LoginPage />
          </Suspense>
        }
      />
      <Route element={<MainLayout />}>
        <Route index element={<InicioPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="categorias" element={<CategoriasPage />} />
        <Route path="productos" element={<ProductosPage />} />
        <Route path="perfil" element={<PerfilPage />} />
        <Route path="existencias" element={<ExistenciasPage />} />
        <Route path="movimientos" element={<MovimientosPage />} />
        <Route path="almacenes" element={<AlmacenesPage />} />
        <Route path="reportes" element={<ReportesPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="configuracion" element={<ConfiguracionPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
