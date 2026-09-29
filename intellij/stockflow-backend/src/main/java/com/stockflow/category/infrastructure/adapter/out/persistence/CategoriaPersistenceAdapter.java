package com.stockflow.category.infrastructure.adapter.out.persistence;

import com.stockflow.category.domain.model.Categoria;
import com.stockflow.category.domain.port.out.CategoriaRepositoryPort;
import com.stockflow.category.infrastructure.adapter.out.persistence.mapper.CategoriaPersistenceMapper;
import com.stockflow.category.infrastructure.adapter.out.persistence.repository.SpringDataCategoriaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/** Adapter OUT: implementa el Port OUT usando Spring Data JPA. */
@Component
public class CategoriaPersistenceAdapter implements CategoriaRepositoryPort {

    private final SpringDataCategoriaRepository repository;

    public CategoriaPersistenceAdapter(SpringDataCategoriaRepository repository) {
        this.repository = repository;
    }

    @Override
    public Categoria guardar(Categoria categoria) {
        var entity = CategoriaPersistenceMapper.toEntity(categoria);
        return CategoriaPersistenceMapper.toDomain(repository.save(entity));
    }

    @Override
    public Optional<Categoria> buscarPorId(Long id) {
        return repository.findById(id).map(CategoriaPersistenceMapper::toDomain);
    }

    @Override
    public List<Categoria> listar(String nombre) {
        var entidades = (nombre == null || nombre.isBlank())
                ? repository.findAllByOrderByCodigoAsc()
                : repository.findByNombreContainingIgnoreCaseOrderByCodigoAsc(nombre.trim());
        return entidades.stream().map(CategoriaPersistenceMapper::toDomain).toList();
    }

    @Override
    public boolean existePorCodigo(String codigo) {
        return repository.existsByCodigo(Categoria.normalizarCodigo(codigo));
    }

    @Override
    public boolean existePorNombre(String nombre) {
        return nombre != null && repository.existsByNombreIgnoreCase(nombre.trim());
    }
}
