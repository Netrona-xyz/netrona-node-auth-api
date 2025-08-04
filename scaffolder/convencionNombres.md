# 📦 Scaffold CRUD Generator

Este generador permite automatizar la creación de archivos CRUD (model, service, controller, schema) a partir de un archivo JSON de configuración para una entidad.

---

## 🔧 Archivo de configuración (JSON)

Ejemplo:

```json
{
  "tabla": "Tipos_Instru_mentos",
  "entidad": "TipoInstrumento",
  "plural": "TiposInstrumentos",
  "alias": "t",
  "campos": [...],
  "joins": [...]
}
```

### Campos:

| Campo     | Tipo   | Requerido | Descripción                                                                                             |
| --------- | ------ | --------- | ------------------------------------------------------------------------------------------------------- |
| `tabla`   | string | ✅        | Nombre exacto de la tabla en SQL. Debe coincidir con la base de datos, sin transformar.                 |
| `entidad` | string | ✅        | Nombre singular y PascalCase. Usado solo para el nombre de clase del modelo.                            |
| `plural`  | string | ✅        | Nombre plural representativo de la entidad. Usado para todo lo demás: clases, archivos, rutas, schemas. |
| `alias`   | string | ✅        | Alias SQL para usar en los `JOINs`, `SELECT`, etc.                                                      |

---

## 🔄 Uso de los campos

### `tabla` (sin transformaciones)

Se usa tal como está en las queries SQL:

```sql
FROM Tipos_Instru_mentos t
INSERT INTO Tipos_Instru_mentos ...
```

### `entidad` (solo modelo)

Usado para generar la clase del modelo:

```js
export default class TipoInstrumento extends BaseModel {}
```

### `plural` (todo lo demás)

Transformado según contexto:

| Contexto         | Ejemplo con `TiposInstrumentos`     |
| ---------------- | ----------------------------------- |
| Clase Service    | `class TiposInstrumentosService`    |
| Clase Controller | `class TiposInstrumentosController` |
| Archivos .js     | `tiposInstrumentos_model.js`, etc.  |
| Rutas API        | `/api/tiposInstrumentos`            |
| Schemas          | `tiposInstrumentosCreateSchema`     |
| Respuestas JSON  | `res.json({ tiposInstrumentos })`   |

---

## 📄 Archivos generados

- `models/[plural]_model.js`
- `services/[plural]_service.js`
- `controllers/[plural]_controller.js`
- `schemas/[plural]_schema.js`
- Fragments: `selectBase`, `fromClause`, `allowedFields`

---

## ✅ Buenas prácticas

- Siempre especificar `plural` en camelCase o PascalCase según corresponda.
- No asumir que el plural se forma con `+s`.
- Usar el campo `entidad` solo para el nombre de clase del modelo.
- Mantener `tabla` fiel al esquema real.

---

> ⚠️ Importante: Este generador no ejecuta migraciones ni crea tablas, solo genera el código base para el backend.
