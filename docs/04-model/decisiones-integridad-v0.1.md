# Decisiones de integridad v0.1

| RN/RF | Regla | Protección prevista | Justificación |
|---|---|---|---|
| RN-06 | Código de producto único | UNIQUE en BD | Impide creación de productos duplicados por error. |
| RN-03 | No permitir stock negativo | CHECK en BD + Lógica Backend | Protege la consistencia de inventario físico. |
| RN-02 | Cantidad de movimiento positiva | CHECK en BD | Un movimiento de -5 salidas es una doble negación ambigua; se debe usar tipo SALIDA y cantidad 5. |
