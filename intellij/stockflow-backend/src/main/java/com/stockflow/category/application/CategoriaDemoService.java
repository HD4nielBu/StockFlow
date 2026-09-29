package com.stockflow.category.application;

import com.stockflow.category.infrastructure.adapter.in.web.dto.CategoriaDemoResponse;
import org.springframework.stereotype.Service;

/** Cap. 03: servicio temporal de demostración (sin base de datos). */
@Service
public class CategoriaDemoService {

    public CategoriaDemoResponse obtenerDemo() {
        return new CategoriaDemoResponse(
                1L,
                "CAT-OFI",
                "Material de oficina",
                "Papelería y útiles"
        );
    }
}
