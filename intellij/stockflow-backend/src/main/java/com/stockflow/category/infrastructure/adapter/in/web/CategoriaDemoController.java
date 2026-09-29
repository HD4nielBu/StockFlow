package com.stockflow.category.infrastructure.adapter.in.web;

import com.stockflow.category.application.CategoriaDemoService;
import com.stockflow.category.infrastructure.adapter.in.web.dto.CategoriaDemoResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Cap. 03: GET /api/categorias/demo */
@RestController
@RequestMapping("/api/categorias")
public class CategoriaDemoController {

    private final CategoriaDemoService service;

    public CategoriaDemoController(CategoriaDemoService service) {
        this.service = service;
    }

    @GetMapping("/demo")
    public CategoriaDemoResponse demo() {
        return service.obtenerDemo();
    }
}
