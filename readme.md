# Backend Boilerplate: Express + Auth + CRUD + Scaffolder

Este repositorio es una plantilla base para construir backends modernos en Node.js con Express. Incluye autenticación JWT segura, estructura limpia para CRUDs, validaciones con Zod y un sistema de scaffolding para generar automáticamente controladores, servicios, esquemas, modelos y rutas.

---

## ✨ Características principales

- ✅ Arquitectura modular: controllers, services, schemas, models y routers separados.
- 🔐 Autenticación JWT doble: cookie `HttpOnly` para navegadores y Bearer token para API externa.
- 👤 Sistema de usuarios con registro, login, refresh, logout y cambio de contraseña.
- 🧱 Middleware de autorización basado en roles y derechos (`requiereDerecho`).
- 🧪 Validaciones Zod y esquema de fechas custom con `dateSchema`.
- ⚒️ Sistema de scaffolding para generar entidades CRUD completas.
- 🧩 CRUD de ejemplo para `Instrumentos` (maestro).
- 📁 Proyecto listo para convertirse en plantilla de GitHub.

---

## 📦 Dependencias principales

- express
- jsonwebtoken
- bcrypt
- cookie-parser
- mysql2
- zod
- winston

## 🧱 Estructura del proyecto

```
controllers/
services/
models/
schemas/
routers/
middleware/
scaffold/         <-- generador de CRUDs
output/           <-- archivos generados
```

---

## ⚙️ Scaffolding

Podés definir una entidad en JSON con esta forma:

```json
{
  "grupo": "maestros",
  "entidad": "Instrumento",
  "tabla": "Instrumentos",
  "alias": "i",
  "plural": "instrumentos",
  "campos": [
    "id:int:pk",
    "tipoInstrumentoId:decimal(10,2):fk",
    "emisorId:int(+):fk:opt",
    "ticker:date",
    "notas:string(255)",
    "tipoInstrumento:string(50):join",
    "claseInstrumento:string(50):join",
    "emisor:string(25):join"
  ],
  "joins": [
    {
      "alias": "t",
      "on": "i.tipoInstrumentoId = t.id",
      "tabla": "TiposInstrumentos",
      "select": ["t.nombre as tipoInstrumento", "t.clase as claseInstrumento"]
    },
    {
      "alias": "e",
      "on": "i.emisorId = e.id",
      "tabla": "Emisores",
      "select": ["e.nombre as emisor"]
    }
  ],
  "derechos": {
    "getAll": null,
    "getById": null,
    "create": "instrumentos.crear",
    "update": "instrumentos.modificar",
    "delete": "instrumentos.borrar"
  }
}
```

Desde ahí se genera:

- `instrumentos_controller.js`
- `Instrumentos_service.js`
- `instrumentos_model.js`
- `instrumentos_schema.js`
- `instrumentos_router.js`

Con uso correcto de nombres, joins, Zod y validaciones.

---

## 🛡️ Seguridad y autenticación

Incluye autenticación con:

- Login por JWT (`/login`, `/api-token`)
- Cookies `HttpOnly` con `SameSite` y `Secure`
- Refresh Token persistente
- Logout seguro y expiración forzada de tokens

### Endpoints de la API

La plantilla incluye un módulo de `usuarios` completamente funcional con los siguientes endpoints, todos bajo el prefijo `/api/usuarios`.

| Verbo  | Ruta         | Descripción                                                                                                          | Protegido |
| :----- | :----------- | :------------------------------------------------------------------------------------------------------------------- | :-------- |
| `POST` | `/register`  | Registra un nuevo usuario en el sistema. Requiere `nombre`, `mail` y `password`.                                     | No        |
| `POST` | `/login`     | Autentica a un usuario con `mail` y `password`. Si es exitoso, establece las cookies `accessToken` y `refreshToken`. | No        |
| `POST` | `/api-token` | Una alternativa al login que devuelve los tokens directamente en la respuesta JSON. Ideal para clientes no-web.      | No        |
| `POST` | `/refresh`   | Recibe un `refreshToken` (vía cookie o Bearer) y devuelve un nuevo `accessToken`.                                    | No        |
| `GET`  | `/me`        | Devuelve la información del usuario autenticado (roles y derechos). Requiere un `accessToken` válido.                | **Sí**    |
| `POST` | `/logout`    | Cierra la sesión del usuario. Limpia las cookies y anula el `refreshToken` en la base de datos.                      | **Sí**    |

Las rutas protegidas utilizan el middleware `authMiddleware`, que verifica la validez del `accessToken` enviado.

---

## 🚀 Comenzar

1. Cloná el repo y corré `npm install`.
2. Configurá tu `.env` con credenciales de DB y secretos JWT.
3. Probá el login con `/api/usuarios/login` o `/api-token`.

---

## ✍️ Autor

[Pablo Berdasco](https://github.com/pberdasco)

---
