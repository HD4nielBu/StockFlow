import { useState } from 'react';
import { Alert } from '../../../components/ui/Alert';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Pagination } from '../../../components/ui/Pagination';
import { SelectFilter } from '../../../components/ui/SelectFilter';
import { useRemoteData } from '../../../shared/hooks/useRemoteData';
import { useProductos } from '../../productos/hooks/useProductos';
import type { MovimientoKardex } from '../models/MovimientoKardex';
import type { Pagina } from '../models/Pagina';
import { inventarioService } from '../services/inventarioService';

const TAMANOS = [10, 20, 50].map((n) => ({ value: String(n), label: `${n} por página` }));
const fecha = new Intl.DateTimeFormat('es-BO', { dateStyle: 'short', timeStyle: 'short' });

/**
 * RF-09 / RF-19: kardex de un producto (historial de movimientos con saldo).
 * - Paginación en el SERVIDOR (?pagina=&tamano=): el historial crece sin límite (G09).
 * - Cada cambio de producto o de página cancela la petición anterior (G08).
 * - El historial no se edita ni se borra (RN-01, protegido con triggers en PostgreSQL).
 */
export default function KardexPage() {
  const productos = useProductos();
  const [productoId, setProductoId] = useState('');
  const [pagina, setPagina] = useState(0);
  const [tamano, setTamano] = useState(10);

  const kardex = useRemoteData<Pagina<MovimientoKardex> | null>(
    (signal) => (productoId ? inventarioService.kardex(Number(productoId), pagina, tamano, signal) : Promise.resolve(null)),
    null,
    `producto=${productoId}&pagina=${pagina}&tamano=${tamano}`,
  );
  const producto = productos.data.find((p) => p.id === Number(productoId));

  return (
    <section className="page-stack page-kardex">
      <div className="page-heading">
        <p className="eyebrow">Movimientos de inventario · RF-09 · RF-19</p>
        <h1>Kardex</h1>
        <p>Historial de entradas y salidas de un producto con el saldo resultante en cada ubicación.</p>
      </div>

      {(kardex.error || productos.error) && <Alert kind="error">{kardex.error || productos.error}</Alert>}

      <div className="toolbar">
        <SelectFilter
          label="Producto"
          value={productoId}
          options={[{ value: '', label: 'Elige un producto' }, ...productos.data.map((p) => ({ value: String(p.id), label: `${p.codigo} · ${p.nombre}` }))]}
          onChange={(v) => {
            setProductoId(v);
            setPagina(0);
          }}
        />
        <SelectFilter
          label="Tamaño"
          value={String(tamano)}
          options={TAMANOS}
          onChange={(v) => {
            setTamano(Number(v));
            setPagina(0);
          }}
        />
      </div>

      {!productoId ? (
        <EmptyState title="Elige un producto" description="El kardex muestra los movimientos de un producto a la vez." />
      ) : kardex.loading ? (
        <div className="state-card">Cargando movimientos...</div>
      ) : !kardex.data || kardex.data.totalElementos === 0 ? (
        <EmptyState title={`${producto?.codigo ?? 'Este producto'} no tiene movimientos`} description="Los movimientos aparecen aquí al registrarse entradas o salidas." />
      ) : (
        <>
          <p className="existencias-resumen">
            <strong>{kardex.data.totalElementos}</strong> movimientos de <strong>{producto?.nombre}</strong>
          </p>
          <div className="table-card">
            <div className="table-responsive">
              <table className="data-table kardex-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Ubicación</th>
                    <th>Tipo</th>
                    <th>Entrada</th>
                    <th>Salida</th>
                    <th>Saldo</th>
                    <th>Referencia</th>
                    <th>Registrado por</th>
                  </tr>
                </thead>
                <tbody>
                  {kardex.data.contenido.map((m) => (
                    <tr key={m.movimientoId}>
                      <td>{fecha.format(new Date(m.ocurridoAt))}</td>
                      <td>{m.ubicacion}</td>
                      <td>
                        <span className="tipo-movimiento">{m.tipo}</span>
                        {m.motivo && <span className="celda-secundaria">{m.motivo}</span>}
                      </td>
                      <td className="num-cell entrada-cell">{m.entrada > 0 ? `+${m.entrada}` : '—'}</td>
                      <td className="num-cell salida-cell">{m.salida > 0 ? `−${m.salida}` : '—'}</td>
                      <td className="num-cell saldo-cell">{m.saldoResultante}</td>
                      <td>{m.referenciaTipo}</td>
                      <td>{m.registradoPor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* El backend cuenta desde 0; Pagination muestra desde 1 */}
          <Pagination page={kardex.data.pagina + 1} totalPages={Math.max(1, kardex.data.totalPaginas)} onPageChange={(p) => setPagina(p - 1)} />
        </>
      )}
    </section>
  );
}
