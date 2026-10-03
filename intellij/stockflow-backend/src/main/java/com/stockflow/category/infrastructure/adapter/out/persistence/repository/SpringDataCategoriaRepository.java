package com.stockflow.category.infrastructure.adapter.out.persistence.repository;

import com.stockflow.category.infrastructure.adapter.out.persistence.entity.CategoriaJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpringDataCategoriaRepository extends JpaRepository<CategoriaJpaEntity, Long> {

    boolean existsByCodigo(String codigo);

    boolean existsByNombreIgnoreCase(String nombre);

    // ... AND categoria_id <> ? : excluye a la fila que se está editando
    boolean existsByCodigoAndIdNot(String codigo, Long id);

    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);

    List<CategoriaJpaEntity> findAllByOrderByCodigoAsc();

    List<CategoriaJpaEntity> findByNombreContainingIgnoreCaseOrderByCodigoAsc(String nombre);
}
