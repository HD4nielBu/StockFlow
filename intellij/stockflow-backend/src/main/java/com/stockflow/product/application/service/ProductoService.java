package com.stockflow.product.application.service;

import com.stockflow.category.domain.exception.CategoriaInactivaException;
import com.stockflow.category.domain.exception.CategoriaNoEncontradaException;
import com.stockflow.category.domain.port.in.ConsultarCategoriaUseCase;
import com.stockflow.product.domain.exception.CodigoProductoDuplicadoException;
import com.stockflow.product.domain.model.Producto;
import com.stockflow.product.domain.port.in.ConsultarProductoUseCase;
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
public class ProductoService implements RegistrarProductoUseCase, ConsultarProductoUseCase {

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
