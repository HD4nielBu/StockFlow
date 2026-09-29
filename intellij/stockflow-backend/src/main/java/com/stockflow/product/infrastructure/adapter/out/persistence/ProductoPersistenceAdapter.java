package com.stockflow.product.infrastructure.adapter.out.persistence;

import com.stockflow.category.infrastructure.adapter.out.persistence.repository.SpringDataCategoriaRepository;
import com.stockflow.product.domain.model.Producto;
import com.stockflow.product.domain.port.out.ProductoRepositoryPort;
import com.stockflow.product.infrastructure.adapter.out.persistence.mapper.ProductoPersistenceMapper;
import com.stockflow.product.infrastructure.adapter.out.persistence.repository.SpringDataProductoRepository;
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
    public Optional<Producto> buscarPorId(Long id) {
        return repository.findById(id).map(ProductoPersistenceMapper::toDomain);
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
}
