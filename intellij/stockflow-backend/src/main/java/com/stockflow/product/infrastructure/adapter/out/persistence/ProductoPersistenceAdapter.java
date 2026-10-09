package com.stockflow.product.infrastructure.adapter.out.persistence;

import com.stockflow.category.infrastructure.adapter.out.persistence.repository.SpringDataCategoriaRepository;
import com.stockflow.product.domain.exception.ProductoEnUsoException;
import com.stockflow.product.domain.exception.ProductoNoEncontradoException;
import com.stockflow.product.domain.model.Producto;
import com.stockflow.product.domain.port.out.ProductoRepositoryPort;
import com.stockflow.product.infrastructure.adapter.out.persistence.mapper.ProductoPersistenceMapper;
import com.stockflow.product.infrastructure.adapter.out.persistence.repository.SpringDataProductoRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Adapter OUT del módulo dependiente.
 * La referencia al repositorio JPA del padre queda aquí, en infraestructura;
 * el caso de uso nunca la ve.
 */
@Component
public class ProductoPersistenceAdapter implements ProductoRepositoryPort {

    private final SpringDataProductoRepository repository;
    private final SpringDataCategoriaRepository categoriaRepository;

    public ProductoPersistenceAdapter(SpringDataProductoRepository repository,
                                      SpringDataCategoriaRepository categoriaRepository) {
        this.repository = repository;
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public Producto guardar(Producto producto) {
        // getReferenceById no hace SELECT: crea un proxy con el id para llenar la FK
        var categoriaRef = categoriaRepository.getReferenceById(producto.getCategoriaId());
        var entity = ProductoPersistenceMapper.toJpa(producto, categoriaRef);
        return ProductoPersistenceMapper.toDomain(repository.save(entity));
    }

    @Override
    public Producto actualizar(Producto producto) {
        // findById deja la entidad managed; al cambiarla, Hibernate genera el UPDATE (dirty checking)
        var entity = repository.findById(producto.getId())
                .orElseThrow(() -> new ProductoNoEncontradoException(producto.getId()));
        var categoriaRef = categoriaRepository.getReferenceById(producto.getCategoriaId());
        entity.actualizar(categoriaRef, producto.getCodigo(), producto.getNombre(),
                producto.getDescripcion(), producto.getUnidadMedida(), producto.getStockMinimoDefault(),
                producto.getPrecioReferencial(), producto.isActivo());
        // flush: si la base rechaza el UPDATE (UNIQUE, CHECK), el error ocurre aquí y no al hacer commit
        repository.flush();
        return ProductoPersistenceMapper.toDomain(entity);
    }

    @Override
    public void eliminar(Long id) {
        try {
            repository.deleteById(id);
            // flush: fuerza el DELETE ahora para que las FK respondan dentro de este método
            repository.flush();
        } catch (DataIntegrityViolationException ex) {
            // FK desde stock, movimiento_inventario, item_solicitud, transferencia_detalle o alerta_stock
            throw new ProductoEnUsoException(id);
        }
    }

    @Override
    public Optional<Producto> buscarPorId(Long id) {
        return repository.findById(id).map(ProductoPersistenceMapper::toDomain);
    }

    @Override
    public List<Producto> listarTodos() {
        // Un solo SELECT: el mapper sólo lee categoria.getId(), que el proxy LAZY ya conoce (sin N+1)
        return repository.findAllByOrderByCodigoAsc().stream()
                .map(ProductoPersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public List<Producto> listarPorCategoriaId(Long categoriaId) {
        return repository.findByCategoria_IdOrderByCodigoAsc(categoriaId).stream()
                .map(ProductoPersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public boolean existePorCodigo(String codigo) {
        return repository.existsByCodigo(Producto.normalizarCodigo(codigo));
    }

    @Override
    public boolean existePorCodigoEnOtro(String codigo, Long id) {
        return repository.existsByCodigoAndIdNot(Producto.normalizarCodigo(codigo), id);
    }
}
