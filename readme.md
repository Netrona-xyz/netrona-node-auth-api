# Backend Boilerplate: Express + Auth + CRUD + Scaffolder

![Node.js](https://img.shields.io/badge/Node.js-%3E=18.x-green?logo=node.js)![License](https://img.shields.io/badge/license-MIT-blue.svg)![Last Commit](https://img.shields.io/github/last-commit/Netrona-xyz/netrona-node-auth-api)![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-yellow?logo=javascript)

Netrona-xyz/netrona-node-auth-api

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
- 🧪 Testing automatizado con Vitest + Supertest, con generación dinámica de casos CRUD vía scaffolding.

---

## 📦 Dependencias principales

- express
- jsonwebtoken
- bcrypt
- cookie-parser
- mysql2
- cors
- zod
- winston

**Dependencias de desarrollo:**

- Vitest
- Supertest

## 🧱 Estructura del proyecto

```
src/
   routers/
   controllers/
   services/
   models/
   schemas/
   middleware/
test/             <-- archivos .test.js
scaffold/         <-- generador de CRUDs
sql/              <-- script tablas requeridas + manejo de migraciones
request/          <-- archivos .rest para probar las apis con rest-client
```

## 🗄️ Base de Datos

Este template incluye scripts SQL mínimos necesarios para operar correctamente, separados en dos archivos clave dentro de la carpeta `/sql/inicial`.

### 📂 Archivos incluidos

#### 1. `BackTemplate-DBStruct.sql`

Contiene la creación de las siguientes **tablas base requeridas**:

| Tabla                  | Descripción breve                                                    |
| ---------------------- | -------------------------------------------------------------------- |
| `Usuarios`             | Gestión de cuentas de usuario (mail, password, refresh token, etc.)  |
| `Roles`                | Definición de roles del sistema (ej. Admin, Viewer, etc.)            |
| `Derechos`             | Lista jerárquica de derechos o permisos disponibles en el sistema    |
| `DerechosRoles`        | Asociación de derechos a roles                                       |
| `RolesUsuarios`        | Asociación de usuarios a uno o más roles                             |
| `MigracionesAplicadas` | Registro interno de migraciones SQL ya aplicadas                     |
| `Emisores`             | Entidad del dominio de ejemplo: emisores de instrumentos financieros |
| `TiposInstrumentos`    | Tipos disponibles (bono, acción, etc.)                               |
| `Instrumentos`         | Instrumentos financieros disponibles (con ticker, emisor, etc.)      |
| `Operaciones`          | Registro de operaciones realizadas sobre instrumentos                |

Estas tablas permiten construir una base funcional que incluya autenticación, autorización y una estructura de dominio básica.

---

#### 2. `BackTemplate-TestMinData.sql`

Carga inicial de datos mínimos de prueba:

- Un usuario administrador y/o tester
- Roles básicos y sus derechos asociados
- Algunos emisores, tipos e instrumentos de prueba

> ⚠️ **Este archivo es solo para entornos de desarrollo o testing.**  
> No debe ejecutarse en entornos de producción.

---

### ⚙️ Aplicar migraciones: `aplicarMigraciones.js`

Script Node.js para aplicar de forma automática los archivos SQL de migración ubicados en `/sql/migraciones`.

- Registra en la tabla `MigracionesAplicadas` los archivos ejecutados.
- Solo se aplican migraciones que aún no estén registradas.

#### 📌 Uso

```bash
node sql/migraciones/aplicarMigraciones.js
```

---

## 📋 Tests automáticos

Este proyecto incluye soporte para **tests funcionales automatizados** usando [Vitest](https://vitest.dev) + [Supertest](https://github.com/ladjs/supertest).

- Verifica comportamiento completo de endpoints CRUD generados.
- Compatible con autenticación y autorización opcional (configurable por `.env`).
- Permite generar archivos de test automáticamente por entidad (Incluído en el proceso de scaffolding del CRUD).

### ⚙️ Scripts de test (`package.json`)

```json
"scripts": {
  "test": "USE_AUTHENTICATION=false USE_AUTHORIZATION=false vitest run",
  "test:auth": "vitest",
  "test:auth-i": "vitest"
}
```

- `npm test`: ejecuta los tests sin autenticación ni autorización (modo funcional puro).
- `npm run test:auth`: ejecuta con seguridad activada según `.env`.
- `npm run test:auth-i`: modo interactivo (útil para desarrollo).

### ✨ Generación automática de tests

Podés generar automáticamente un archivo `.test.js` para todas las entidades que se creen con scaffold.

Incluido como uno de los pasos de:

```bash
node scaffold/generateCRUD.js xxx_entity_config.json
```

Esto crea un test funcional con:

- Login automático (`test@fake.com`) si se requiere autenticación.
- Creación, consulta, actualización y eliminación del recurso de prueba.
- Validación dinámica del status (`201`, `200`, `204`, `403`) según la config.
- Limpieza automática si ya existe un registro con el valor de prueba (`TEST001`, configurable).

### ✅ Recomendación

> Se recomienda ejecutar estos tests con `USE_AUTHORIZATION=false` durante el desarrollo, y validar permisos con tests de seguridad separados si fuera necesario.

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
  },
  "test": {
    "campoUnico": "ticker",
    "valorTest": "TEST001",
    "payloadBase": {
      "tipoInstrumentoId": 1,
      "emisorId": 1,
      "notas": "Test generado"
    }
  }
}
```

Desde ahí se genera:

- `instrumentos_controller.js`
- `Instrumentos_service.js`
- `instrumentos_model.js`
- `instrumentos_schema.js`
- `instrumentos_router.js`
- `instrumentos.test.js`

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

### 🔐 Variables de entorno

Este proyecto incluye un archivo `.envExample` con todas las variables necesarias.

➡️ Copiar y renombrar a `.env` antes de ejecutar.

---

## 🚀 Comenzar

1. Cloná el repo y corré `npm install`.
2. Configurá tu `.env` con credenciales de DB y secretos JWT.
3. Probá el login con `/api/usuarios/login` o `/api-token`.

---

## ✍️ Autor

[Pablo Berdasco](https://github.com/pberdasco)
[Netrona.xyz]

---

## 📄 Licencia

Este proyecto está licenciado bajo los términos de la [MIT License](LICENSE).
