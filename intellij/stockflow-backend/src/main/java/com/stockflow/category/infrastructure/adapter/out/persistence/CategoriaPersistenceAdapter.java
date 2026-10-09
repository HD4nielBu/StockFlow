package com.stockflow.category.infrastructure.adapter.out.persistence;

import com.stockflow.category.domain.exception.CategoriaConProductosException;
import com.stockflow.category.domain.exception.CategoriaNoEncontradaException;
import com.stockflow.category.domain.model.Categoria;
import com.stockflow.category.domain.port.out.CategoriaRepositoryPort;
import com.stockflow.category.infrastructure.adapter.out.persistence.mapper.CategoriaPersistenceMapper;
import com.stockflow.category.infrastructure.adapter.out.persistence.repository.SpringDataCategoriaRepository;
import org.springframework.dao.DataIntegrityViolationException;
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
    public Categoria actualizar(Categoria categoria) {
        // findById deja la entidad managed; al cambiarla, Hibernate genera el UPDATE (dirty checking)
        var entity = repository.findById(categoria.getId())
                .orElseThrow(() -> new CategoriaNoEncontradaException(categoria.getId()));
        entity.actualizar(categoria.getCodigo(), categoria.getNombre(),
                categoria.getDescripcion(), categoria.isActivo());
        // flush: si la base rechaza el UPDATE (UNIQUE), el error ocurre aquí y no al hacer commit
        repository.flush();
        return CategoriaPersistenceMapper.toDomain(entity);
    }

    @Override
    public void eliminar(Long id) {
        try {
            repository.deleteById(id);
            // flush: fuerza el DELETE ahora para que la FK responda dentro de este método
            repository.flush();
        } catch (DataIntegrityViolationException ex) {
            // La única FK que apunta a categoria es fk_producto_categoria
            throw new CategoriaConProductosException(id);
        }
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

    @Override
    public boolean existePorCodigoEnOtra(String codigo, Long id) {
        return repository.existsByCodigoAndIdNot(Categoria.normalizarCodigo(codigo), id);
    }

    @Override
    public boolean existePorNombreEnOtra(String nombre, Long id) {
        return nombre != null && repository.existsByNombreIgnoreCaseAndIdNot(nombre.trim(), id);
    }
}
