package com.stockflow.product.infrastructure.adapter.in.web;

import com.stockflow.product.domain.exception.ProductoNoEncontradoException;
import com.stockflow.product.domain.port.in.ConsultarProductoUseCase;
import com.stockflow.product.domain.port.in.RegistrarProductoUseCase;
import com.stockflow.product.infrastructure.adapter.in.web.dto.CrearProductoRequest;
import com.stockflow.product.infrastructure.adapter.in.web.dto.ProductoResponse;
import com.stockflow.product.infrastructure.adapter.in.web.mapper.ProductoWebMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final RegistrarProductoUseCase registrar;
    private final ConsultarProductoUseCase consultar;

    public ProductoController(RegistrarProductoUseCase registrar,
                              ConsultarProductoUseCase consultar) {
        this.registrar = registrar;
        this.consultar = consultar;
    }

    @PostMapping
    public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody CrearProductoRequest request) {
        var creado = registrar.registrar(ProductoWebMapper.toDomain(request));
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(creado.getId()).toUri();
        return ResponseEntity.created(location).body(ProductoWebMapper.toResponse(creado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> buscarPorId(@PathVariable Long id) {
        var producto = consultar.buscarPorId(id)
                .orElseThrow(() -> new ProductoNoEncontradoException(id));
        return ResponseEntity.ok(ProductoWebMapper.toResponse(producto));
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<ProductoResponse> listarPorCategoria(@PathVariable Long categoriaId) {
        return consultar.listarPorCategoria(categoriaId).stream()
                .map(ProductoWebMapper::toResponse)
                .toList();
    }
}
