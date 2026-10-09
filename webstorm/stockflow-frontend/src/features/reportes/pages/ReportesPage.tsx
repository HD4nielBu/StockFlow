import { CalendarClock, Download, FileSpreadsheet, Info, Landmark, ListChecks, RotateCw, ScrollText, Tags, TriangleAlert, type LucideIcon } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Skeleton } from '../../../components/ui/LoadingSkeleton';
import { useToast } from '../../../components/ui/toast/useToast';
import { useResumenInventario } from '../../inventario/hooks/useResumenInventario';
import { LABEL_ESTADO } from '../../inventario/utils/estadoVisual';
import { estadoExistencia } from '../../inventario/utils/indicadores';
import { UNIDAD_LABEL } from '../../productos/models/Producto';
import { aCsv, descargarCsv, nombreConFecha, type Celda } from '../utils/csv';

interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  icon: LucideIcon;
  filas: number;
  generar: () => { encabezados: string[]; filas: Celda[][] };
}

const filasTexto = (n: number) => `${n} ${n === 1 ? 'fila' : 'filas'}`;

const PENDIENTES: { titulo: string; descripcion: string; icon: LucideIcon }[] = [
  { titulo: 'Movimientos por período', descripcion: 'Entradas y salidas de todos los productos entre dos fechas.', icon: CalendarClock },
  { titulo: 'Valorización contable', descripcion: 'Valor del inventario con costo real y moneda.', icon: Landmark },
  { titulo: 'Reportes programados', descripcion: 'Envío automático por correo cada semana o mes.', icon: ListChecks },
];

/**
 * Exportaciones CSV generadas EN EL NAVEGADOR con los datos reales de la API (no hay un endpoint
 * de reportes). Lo que requiere datos que la API aún no expone se muestra como no disponible.
 */
export default function ReportesPage() {
  const toast = useToast();
  const { categorias, productos, existencias, loading, error, reload } = useResumenInventario();
  const categoriaPorId = new Map(categorias.map((c) => [c.id, c]));
  const productosPorCategoria = new Map<number, number>();
  productos.forEach((p) => productosPorCategoria.set(p.categoriaId, (productosPorCategoria.get(p.categoriaId) ?? 0) + 1));
  const bajoMinimo = existencias.filter((e) => e.bajoMinimo);

  const filaExistencia = (e: (typeof existencias)[number]): Celda[] => [
    e.codigoProducto, e.producto, e.codigoUbicacion, e.ubicacion, e.cantidad, e.stockMinimo, LABEL_ESTADO[estadoExistencia(e)],
  ];
  const encabezadosExistencia = ['Código producto', 'Producto', 'Código ubicación', 'Ubicación', 'Cantidad', 'Stock mínimo', 'Estado'];

  const reportes: Reporte[] = [
    {
      id: 'productos',
      titulo: 'Catálogo de productos',
      descripcion: 'Código, nombre, categoría, unidad, stock mínimo, precio referencial y estado.',
      icon: FileSpreadsheet,
      filas: productos.length,
      generar: () => ({
        encabezados: ['Código', 'Nombre', 'Categoría', 'Unidad', 'Stock mínimo', 'Precio referencial', 'Activo'],
        filas: productos.map((p) => [
          p.codigo, p.nombre, categoriaPorId.get(p.categoriaId)?.nombre ?? `#${p.categoriaId}`, UNIDAD_LABEL[p.unidadMedida],
          p.stockMinimoDefault, p.precioReferencial, p.activo,
        ]),
      }),
    },
    {
      id: 'existencias',
      titulo: 'Existencias por ubicación',
      descripcion: 'Stock de cada producto en cada almacén, con su mínimo y estado.',
      icon: ScrollText,
      filas: existencias.length,
      generar: () => ({ encabezados: encabezadosExistencia, filas: existencias.map(filaExistencia) }),
    },
    {
      id: 'stock-bajo',
      titulo: 'Stock bajo el mínimo',
      descripcion: 'Sólo las existencias que hay que reponer. Útil para compras.',
      icon: TriangleAlert,
      filas: bajoMinimo.length,
      generar: () => ({ encabezados: encabezadosExistencia, filas: bajoMinimo.map(filaExistencia) }),
    },
    {
      id: 'categorias',
      titulo: 'Categorías',
      descripcion: 'Código, nombre, descripción, cantidad de productos y estado.',
      icon: Tags,
      filas: categorias.length,
      generar: () => ({
        encabezados: ['Código', 'Nombre', 'Descripción', 'Productos', 'Activa'],
        filas: categorias.map((c) => [c.codigo, c.nombre, c.descripcion, productosPorCategoria.get(c.id) ?? 0, c.activo]),
      }),
    },
  ];

  const descargar = (r: Reporte) => {
    const { encabezados, filas } = r.generar();
    descargarCsv(nombreConFecha(r.id), aCsv(encabezados, filas));
    toast.success({ title: `${r.titulo} descargado`, description: `${filasTexto(filas.length)} en formato CSV.` });
  };

  return (
    <section className="page-stack">
      <PageHeader
        title="Reportes"
        description="Descarga los datos actuales del inventario para abrirlos en Excel u otra hoja de cálculo."
        reference="Generados en el navegador con /api/productos, /api/categorias y /api/inventario/stock"
      />

      {error && (
        <Alert
          kind="error"
          title="No se pudieron cargar los datos para los reportes"
          action={
            <Button variant="secondary" size="sm" icon={RotateCw} onClick={reload}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <ul className="report-grid" aria-label="Reportes disponibles">
        {reportes.map((r) => (
          <li key={r.id} className="report-card">
            <span className="report-card__icon" aria-hidden="true">
              <r.icon size={20} />
            </span>
            <div className="report-card__text">
              <h2>{r.titulo}</h2>
              <p>{r.descripcion}</p>
            </div>
            <div className="report-card__footer">
              <span className="report-card__rows">{loading ? <Skeleton width={60} /> : filasTexto(r.filas)}</span>
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                disabled={loading || Boolean(error) || r.filas === 0}
                onClick={() => descargar(r)}
                aria-label={`Descargar ${r.titulo} en CSV`}
              >
                CSV
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <section className="section-heading" aria-labelledby="reportes-pendientes">
        <h2 id="reportes-pendientes">Requieren datos que la API aún no ofrece</h2>
        <p>Se habilitarán cuando el backend exponga los endpoints necesarios.</p>
      </section>
      <ul className="report-grid report-grid--muted" aria-label="Reportes no disponibles">
        {PENDIENTES.map((r) => (
          <li key={r.titulo} className="report-card report-card--disabled">
            <span className="report-card__icon" aria-hidden="true">
              <r.icon size={20} />
            </span>
            <div className="report-card__text">
              <h2>{r.titulo}</h2>
              <p>{r.descripcion}</p>
            </div>
            <div className="report-card__footer">
              <Badge>No disponible</Badge>
            </div>
          </li>
        ))}
      </ul>

      <p className="footnote">
        <Info size={14} aria-hidden="true" />
        Los archivos usan ";" como separador y coma decimal, el formato que Excel espera en español.
      </p>
    </section>
  );
}
