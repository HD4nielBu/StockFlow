package com.stockflow.product.infrastructure.adapter.out.persistence.repository;

import com.stockflow.product.infrastructure.adapter.out.persistence.entity.ProductoJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpringDataProductoRepository extends JpaRepository<ProductoJpaEntity, Long> {

    boolean existsByCodigo(String codigo);

    // ... AND producto_id <> ? : excluye a la fila que se está editando
    boolean existsByCodigoAndIdNot(String codigo, Long id);

    // categoria.id -> navega la FK: WHERE categoria_id = ?
    List<ProductoJpaEntity> findByCategoria_IdOrderByCodigoAsc(Long categoriaId);
}
