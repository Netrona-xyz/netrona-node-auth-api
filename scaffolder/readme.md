# 📄 Configuración de entidad para scaffolder

Este archivo JSON describe los metadatos de una entidad para generar automáticamente archivos de modelo, servicio, controlador, esquema Zod, router y fragmentos SQL.

---

## 🔧 Estructura general

```json
{
  "grupo": "maestros",
  "entidad": "Instrumento",
  "tabla": "Instrumentos",
  "alias": "i",
  "plural": "Instrumentos",
  "campos": [ ... ],
  "joins": [ ... ],
  "derechos": { ... }
}
```

---

## 🧩 Campos

El array `"campos"` describe cada atributo de la entidad, su tipo, y sus banderas opcionales.

### 🧱 Sintaxis general

```
nombre:tipo(opcional):flag1:flag2:...
```

### 📌 Ejemplo

```json
"campos": [
    "id:int:pk",
    "tipoInstrumentoId:decimal(10,2):fk",
    "emisorId:int(+):fk:opt",
    "emisor:string(25):join"
    }
```

### 🧾 Tipos soportados

| Tipo base      | Sintaxis                  | Resultado en esquema Zod                               |
| -------------- | ------------------------- | ------------------------------------------------------ |
| `int`          | `int`, `int(+)`, `int(0)` | `z.number().int() [.positive(), .nonnegative()]`, etc. |
| `decimal`      | `decimal(10,2)`           | `z.number()`                                           |
| `string`       | `string(50)`              | `z.string().max(50)`                                   |
| `date`/`fecha` | `date`                    | `dateSchema.optional()`                                |

### 🎏 Banderas posibles

| Flag     | Significado                                                   |
| -------- | ------------------------------------------------------------- |
| `pk`     | Clave primaria. Se excluye de los esquemas                    |
| `fk`     | Clave foránea. Se marca como atributo especial en el modelo   |
| `join`   | Campo proveniente de un JOIN (se excluye del esquema)         |
| `hidden` | Se oculta (por ahora sin uso, reservado para futuras mejoras) |
| `opt`    | Campo opcional en Zod (`.optional()`)                         |

### ⚖️ Valores adicionales de tipo

- `int(+)`: genera `z.number().int().positive()`
- `int(0)`: genera `z.number().int().nonnegative()`
- `string(60)`: genera `z.string().max(60)`

---

## 🔗 Joins

Permite definir JOINs con otras tablas, incluyendo campos seleccionados y alias.

### 🎯 Ejemplo

```json
{
  "alias": "t",
  "on": "i.tipoInstrumentoId = t.id",
  "tabla": "TiposInstrumentos",
  "select": ["t.nombre as tipoInstrumento", "t.clase as claseInstrumento"]
}
```

Cada campo que venga del `select` también debe figurar en `"campos"` con el flag `:join`.

---

## 🛡️ Derechos

Define los permisos requeridos para cada operación.  
Si un valor es `null`, **no se agrega el middleware `requiereDerecho()`** para esa ruta.

### ⚙️ Ejemplo

```json
"derechos": {
  "getAll": null,
  "getById": null,
  "create": "instrumentos.crear",
  "update": "instrumentos.modificar",
  "delete": "instrumentos.borrar"
}
```

---

## 🧠 Consideraciones sobre nombres

| Campo     | Uso                                                                                  |
| --------- | ------------------------------------------------------------------------------------ |
| `entidad` | Se usa para el nombre de la clase del modelo (`Instrumento`)                         |
| `plural`  | Se usa para nombre de archivos, clases de controller/service, rutas (`Instrumentos`) |
| `tabla`   | Se usa tal cual en SQL (`FROM Instrumentos i`)                                       |
| `alias`   | Alias SQL para evitar ambigüedades en los SELECT (`i`)                               |
