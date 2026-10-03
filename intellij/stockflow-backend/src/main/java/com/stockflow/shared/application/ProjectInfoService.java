package com.stockflow.shared.application;

import org.springframework.stereotype.Service;

/** Cap. 03: primer Bean de aplicación, inyectado por constructor. */
@Service
public class ProjectInfoService {

    public String projectName() {
        return "StockFlow - Inventario y Movimientos de Almacén (PA-06)";
    }

    public String backendStage() {
        return "HEXAGONAL_RELACION_1N";
    }
}
