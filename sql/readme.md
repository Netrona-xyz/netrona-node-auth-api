# Instrucciones de instalación de base de datos

## Desde cero (versión 1.0)

1. Crear base de datos vacía (o dejar que el script lo haga).
2. Ejecutar `2025-7-28-InitialStructure-V1.sql`.
3. Ejecutar `2025-7-28-InitialData-V1.sql`.
4. Ejecutar `2025-7-28-MigracionesAplicadas.sql`.

## Inicializar la tabla MigracionesAplicadas

Cargar 3 registros

## Migraciones

Los cambios posteriores a la versión 1.0 están en `migrations/`.
Aplicar en orden según el timestamp en el nombre del archivo.

_Nota 1_: los .sql pueden tener una primera linea con un comentario `--` que el aplicador grabara en el campo comentario.
_Nota 2_: no usar nombres de base de datos, porque el actualizador intentará utilizar la base configurada en env.

## herramienta para aplicar migraciones posteriores a la v1 + migraciones aplicadas

Utilizar **node sql/aplicarMigraciones.js** que procesara todas las migraciones pendientes
registrandolas a su vez en la tabla MigracionesAplicadas.

Para probar se lo puede llamar con el parametro:
**node sql/aplicarMigraciones.js --dry-run**
