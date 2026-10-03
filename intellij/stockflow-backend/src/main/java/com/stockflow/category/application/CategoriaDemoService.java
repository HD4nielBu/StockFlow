package com.stockflow.category.application;

import com.stockflow.category.domain.model.Categoria;
import org.springframework.stereotype.Service;

/**
 * Cap. 03: servicio temporal de demostración (sin base de datos).
 * Devuelve el modelo de dominio: la aplicación no conoce los DTO web (regla de dependencias).
 */
@Service
public class CategoriaDemoService {

    public Categoria obtenerDemo() {
        return new Categoria(1L, "CAT-OFI", "Material de oficina", "Papelería y útiles", true);
    }
}
