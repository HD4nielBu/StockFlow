package com.stockflow.category.infrastructure.adapter.in.web;

import com.stockflow.category.domain.exception.CategoriaNoEncontradaException;
import com.stockflow.category.domain.port.in.ConsultarCategoriaUseCase;
import com.stockflow.category.domain.port.in.RegistrarCategoriaUseCase;
import com.stockflow.category.infrastructure.adapter.in.web.dto.CategoriaResponse;
import com.stockflow.category.infrastructure.adapter.in.web.dto.CrearCategoriaRequest;
import com.stockflow.category.infrastructure.adapter.in.web.mapper.CategoriaWebMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/** Adapter IN: depende de los Ports IN, nunca del JpaRepository. */
@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final RegistrarCategoriaUseCase registrar;
    private final ConsultarCategoriaUseCase consultar;

    public CategoriaController(RegistrarCategoriaUseCase registrar, ConsultarCategoriaUseCase consultar) {
        this.registrar = registrar;
        this.consultar = consultar;
    }

    @PostMapping
    public ResponseEntity<CategoriaResponse> crear(@Valid @RequestBody CrearCategoriaRequest request) {
        var creada = registrar.registrar(CategoriaWebMapper.toDomain(request));
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(creada.getId()).toUri();
        return ResponseEntity.created(location).body(CategoriaWebMapper.toResponse(creada));
    }

    @GetMapping
    public List<CategoriaResponse> listar(@RequestParam(required = false) String nombre) {
        return consultar.listar(nombre).stream()
                .map(CategoriaWebMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponse> buscarPorId(@PathVariable Long id) {
        var categoria = consultar.buscarPorId(id)
                .orElseThrow(() -> new CategoriaNoEncontradaException(id));
        return ResponseEntity.ok(CategoriaWebMapper.toResponse(categoria));
    }
}
