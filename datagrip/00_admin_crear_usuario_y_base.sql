-- =====================================================================
-- StockFlow (PA-06) · 00 · Script administrativo
-- Ejecutar conectado como: usuario postgres / base postgres
-- CREATE DATABASE debe ejecutarse SOLO (fuera de BEGIN/COMMIT).
-- CAMBIA la contraseña antes de ejecutar y NO la subas a GitHub.
-- =====================================================================

-- 0. Verificar dónde estoy (debe decir postgres / postgres)
SELECT current_user AS usuario_actual,
       current_database() AS base_actual,
       version() AS version_postgresql;

-- 1. Crear el administrador del laboratorio
CREATE ROLE stockflow_admin
WITH
    LOGIN
    PASSWORD 'Cambia_Esta_Clave_2026!'
    SUPERUSER
    CREATEDB
    CREATEROLE
    INHERIT;

-- 2. Comprobar el rol
SELECT rolname, rolcanlogin, rolsuper, rolcreatedb, rolcreaterole
FROM pg_roles
WHERE rolname = 'stockflow_admin';

-- 3. Crear la base de datos (ejecutar esta sentencia sola)
CREATE DATABASE stockflow
    WITH
    OWNER = stockflow_admin
    ENCODING = 'UTF8'
    TEMPLATE = template0;

-- 4. Verificar base y propietario
SELECT d.datname AS base_datos,
       r.rolname AS propietario
FROM pg_database d
JOIN pg_roles r ON r.oid = d.datdba
WHERE d.datname = 'stockflow';

-- ---------------------------------------------------------------------
-- SIGUIENTE PASO: crear en DataGrip una NUEVA conexión
--   Host localhost · Port 5432 · Database stockflow · User stockflow_admin
-- y ejecutar allí V1__creacion_completa_stockflow.sql
-- ---------------------------------------------------------------------

-- SOLO SI NECESITAS EMPEZAR DE CERO (conectado a postgres, sin sesiones
-- abiertas hacia stockflow):
-- DROP DATABASE IF EXISTS stockflow;
-- DROP ROLE IF EXISTS stockflow_admin;
