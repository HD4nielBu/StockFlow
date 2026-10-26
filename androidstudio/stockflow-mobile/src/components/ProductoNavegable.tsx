import { Link } from 'expo-router';
import { Pressable } from 'react-native';
import type { Producto } from '../models/inventario';
import { ProductoCard } from './ProductoCard';

type Props = { producto: Producto; nombreCategoria: string };

/** ProductoCard como enlace a su detalle; se reutiliza en la lista general y en el detalle de categoría. */
export function ProductoNavegable({ producto, nombreCategoria }: Props) {
  return (
    <Link
      href={{ pathname: '/productos/[id]', params: { id: String(producto.id) } }}
      asChild
    >
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`Ver detalle del producto ${producto.codigo}`}
      >
        <ProductoCard producto={producto} nombreCategoria={nombreCategoria} />
      </Pressable>
    </Link>
  );
}
