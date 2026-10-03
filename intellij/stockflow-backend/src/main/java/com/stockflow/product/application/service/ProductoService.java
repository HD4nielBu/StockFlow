package com.stockflow.product.application.service;

import com.stockflow.category.domain.exception.CategoriaInactivaException;
import com.stockflow.category.domain.exception.CategoriaNoEncontradaException;
import com.stockflow.category.domain.port.in.ConsultarCategoriaUseCase;
import com.stockflow.product.domain.exception.CodigoProductoDuplicadoException;
import com.stockflow.product.domain.exception.ProductoNoEncontradoException;
import com.stockflow.product.domain.model.Producto;
import com.stockflow.product.domain.port.in.ActualizarProductoUseCase;
import com.stockflow.product.domain.port.in.ConsultarProductoUseCase;
import com.stockflow.product.domain.port.in.EliminarProductoUseCase;
import com.stockflow.product.domain.port.in.RegistrarProductoUseCase;
import com.stockflow.product.domain.port.out.ProductoRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Caso de uso del módulo dependiente.
 * Valida al padre mediante el Port IN del módulo category (NO con su JpaRepository).
 */
@Service
public class ProductoService implements RegistrarProductoUseCase, ConsultarProductoUseCase,
        ActualizarProductoUseCase, EliminarProductoUseCase {

    private final ProductoRepositoryPort repositoryPort;
    private final ConsultarCategoriaUseCase consultarCategoriaUseCase;

    public ProductoService(ProductoRepositoryPort repositoryPort,
                           ConsultarCategoriaUseCase consultarCategoriaUseCase) {
        this.repositoryPort = repositoryPort;
        this.consultarCategoriaUseCase = consultarCategoriaUseCase;
    }

    @Override
    @Transactional
    public Producto registrar(Producto producto) {
        var categoria = consultarCategoriaUseCase.buscarPorId(producto.getCategoriaId())
                .orElseThrow(() -> new CategoriaNoEncontradaException(producto.getCategoriaId()));
        if (!categoria.isActivo()) {
            throw new CategoriaInactivaException(categoria.getId());
        }
        if (repositoryPort.existePorCodigo(producto.getCodigo())) {
            throw new CodigoProductoDuplicadoException(producto.getCodigo());
        }
        return repositoryPort.guardar(producto);
    }

    @Override
    @Transactional
    public Producto actualizar(Long id, Producto cambios) {
        // PUT no crea: si el id no existe es 404, nunca un INSERT
        var actual = repositoryPort.buscarPorId(id)
                .orElseThrow(() -> new ProductoNoEncontradoException(id));
        var categoria = consultarCategoriaUseCase.buscarPorId(cambios.getCategoriaId())
                .orElseThrow(() -> new CategoriaNoEncontradaException(cambios.getCategoriaId()));
        // Una categoría inactiva no admite productos NUEVOS en ella. Si el producto ya estaba ahí,
        // puede seguir editándose (por ejemplo, para desactivarlo también).
        boolean cambiaDeCategoria = !categoria.getId().equals(actual.getCategoriaId());
        if (cambiaDeCategoria && !categoria.isActivo()) {
            throw new CategoriaInactivaException(categoria.getId());
        }
        if (repositoryPort.existePorCodigoEnOtro(cambios.getCodigo(), id)) {
            throw new CodigoProductoDuplicadoException(cambios.getCodigo());
        }
        return repositoryPort.actualizar(new Producto(id, cambios.getCategoriaId(), cambios.getCodigo(),
                cambios.getNombre(), cambios.getDescripcion(), cambios.getUnidadMedida(),
                cambios.getStockMinimoDefault(), cambios.getPrecioReferencial(), cambios.isActivo()));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (repositoryPort.buscarPorId(id).isEmpty()) {
            throw new ProductoNoEncontradoException(id);
        }
        // Si ya tiene stock o movimientos, las FK lo impiden: su historia (kardex) no se borra
        repositoryPort.eliminar(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Producto> buscarPorId(Long id) {
        return repositoryPort.buscarPorId(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> listarPorCategoria(Long categoriaId) {
        if (consultarCategoriaUseCase.buscarPorId(categoriaId).isEmpty()) {
            throw new CategoriaNoEncontradaException(categoriaId);
        }
        return repositoryPort.listarPorCategoriaId(categoriaId);
    }
}
