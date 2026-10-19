import { useState } from 'react';
import { Alert } from '../../../components/ui/Alert';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Pagination } from '../../../components/ui/Pagination';
import { SelectFilter } from '../../../components/ui/SelectFilter';
import { useRemoteData } from '../../../shared/hooks/useRemoteData';
import { paginar } from '../../../shared/utils/paginar';
import { useProductos } from '../../productos/hooks/useProductos';
import { useUbicaciones } from '../../ubicaciones/hooks/useUbicaciones';
import { NivelStock } from '../components/NivelStock';
import type { Existencia } from '../models/Existencia';
import { inventarioService } from '../services/inventarioService';

const TAMANO = 10;

/**
 * RF-08 / RF-20: existencias por producto y ubicación. SÓLO LECTURA: el stock cambia con movimientos (RN-01).
 * Los filtros van al backend; al cambiar uno, la petición anterior se cancela (G08).
 */
export default function ExistenciasPage() {
  const productos = useProductos();
  const ubicaciones = useUbicaciones();

  const [productoId, setProductoId] = useState('');
  const [ubicacionId, setUbicacionId] = useState('');
  const [soloBajoMinimo, setSoloBajoMinimo] = useState(false);
  const [page, setPage] = useState(1);

  const filtros = {
    productoId: productoId ? Number(productoId) : undefined,
    ubicacionId: ubicacionId ? Number(ubicacionId) : undefined,
    soloBajoMinimo,
  };
  const stock = useRemoteData<Existencia[]>(
    (signal) => inventarioService.consultarStock(filtros, signal),
    [],
    `p=${productoId}&u=${ubicacionId}&b=${soloBajoMinimo}`,
  );

  // Datos derivados: resumen y página visible
  const bajoMinimo = stock.data.filter((e) => e.bajoMinimo).length;
  const pagina = paginar(stock.data, page, TAMANO);

  const cambiar = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  return (
    <section className="page-stack page-existencias">
      <div className="page-heading">
        <p className="eyebrow">Stock por ubicación · RF-08 · RF-20</p>
        <h1>Existencias</h1>
        <p>Consulta de sólo lectura: el stock cambia únicamente con movimientos registrados (RN-01).</p>
      </div>

      {(stock.error || productos.error || ubicaciones.error) && (
        <Alert kind="error">{stock.error || productos.error || ubicaciones.error}</Alert>
      )}

      <div className="toolbar">
        <SelectFilter
          label="Producto"
          value={productoId}
          options={[{ value: '', label: 'Todos' }, ...productos.data.map((p) => ({ value: String(p.id), label: `${p.codigo} · ${p.nombre}` }))]}
          onChange={cambiar(setProductoId)}
        />
        <SelectFilter
          label="Ubicación"
          value={ubicacionId}
          options={[{ value: '', label: 'Todas' }, ...ubicaciones.data.map((u) => ({ value: String(u.id), label: u.nombre }))]}
          onChange={cambiar(setUbicacionId)}
        />
        <label className="field checkbox-field">
          <input
            type="checkbox"
            checked={soloBajoMinimo}
            onChange={(e) => {
              setSoloBajoMinimo(e.target.checked);
              setPage(1);
            }}
          />
          Sólo bajo mínimo
        </label>
      </div>

      <p className="existencias-resumen">
        <strong>{stock.data.length}</strong> existencias · <strong>{bajoMinimo}</strong> en o bajo su mínimo
      </p>

      {stock.loading ? (
        <div className="state-card">Consultando stock...</div>
      ) : pagina.totalItems === 0 ? (
        <EmptyState title="No hay existencias con esos filtros" description="Cambia el producto, la ubicación o quita «Sólo bajo mínimo»." />
      ) : (
        <>
          <div className="table-card">
            <div className="table-responsive">
              <table className="data-table existencias-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Ubicación</th>
                    <th>Cantidad</th>
                    <th>Mínimo</th>
                    <th>Nivel</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pagina.items.map((e) => (
                    <tr key={e.stockId} className={e.bajoMinimo ? 'fila-alerta' : undefined}>
                      <td>
                        <span className="code-cell">{e.codigoProducto}</span>
                        <span className="celda-secundaria">{e.producto}</span>
                      </td>
                      <td>
                        <span className="code-cell">{e.codigoUbicacion}</span>
                        <span className="celda-secundaria">{e.ubicacion}</span>
                      </td>
                      <td className="num-cell">{e.cantidad}</td>
                      <td className="num-cell">{e.stockMinimo}</td>
                      <td>
                        <NivelStock cantidad={e.cantidad} minimo={e.stockMinimo} />
                      </td>
                      <td>
                        <span className={`badge ${e.bajoMinimo ? 'badge--inactive' : 'badge--active'}`}>
                          {e.bajoMinimo ? 'Bajo mínimo' : 'Normal'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={pagina.pagina} totalPages={pagina.totalPaginas} onPageChange={setPage} />
        </>
      )}
    </section>
  );
}
