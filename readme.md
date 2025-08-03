Claro que sí. Aquí tienes una propuesta de `README.md` completa y clara, generada a partir del análisis de tu código. Este archivo está diseñado para ser el acompañante perfecto de tu plantilla.

---

# Backend Boilerplate: Node.js, Express & JWT

Este repositorio sirve como una plantilla de inicio (boilerplate) robusta y segura para construir aplicaciones backend utilizando Node.js y Express. Incluye una implementación completa y segura de autenticación basada en JSON Web Tokens (JWT), siguiendo las mejores prácticas de la industria.

## ✨ Características Principales

- **Arquitectura Limpia y Escalable:** Estructura de proyecto en capas (Routers, Controladores, Servicios y Modelos) que facilita la mantenibilidad y el crecimiento de la aplicación.
- **Autenticación Segura con JWT:** Implementación completa del flujo de `login`, `logout` y `refresh token`.
  - **Tokens de Acceso (Access Token):** De corta duración (2 horas) para acceder a los recursos protegidos.
  - **Tokens de Refresco (Refresh Token):** De larga duración (7 días) para generar nuevos tokens de acceso sin necesidad de volver a iniciar sesión.
- **Doble Mecanismo de Autenticación:**
  1.  **Cookies `HttpOnly`:** Ideal y seguro para clientes web (navegadores). Las cookies se configuran con los flags `HttpOnly`, `SameSite=Strict` y `Secure` (en producción) para mitigar ataques XSS y CSRF.
  2.  **Bearer Token:** Permite la autenticación a través del encabezado `Authorization: Bearer <token>`, estándar para ser consumido por aplicaciones móviles, clientes de escritorio u otros servicios.
- **Seguridad Reforzada:**
  - **Hashing de Contraseñas:** Las contraseñas se hashean utilizando `bcrypt` antes de ser almacenadas en la base de datos.
  - **Invalidación de Sesión en el Servidor:** Al hacer logout, el `refreshToken` se invalida en la base de datos, lo que previene su reutilización incluso si fue robado.
  - **Validación de Entradas:** Uso de **Zod** para validar y sanitizar los datos de entrada (`req.body`), previniendo datos malformados o maliciosos.
  - **Política de CORS Configurable:** Permite definir fácilmente los orígenes permitidos a través de variables de entorno.

## 🛠️ Stack Tecnológico

- **Runtime:** Node.js
- **Framework:** Express.js
- **Autenticación:** JSONWebToken (`jsonwebtoken`)
- **Seguridad:** `bcrypt` (para hashing), `cookie-parser`
- **Validación:** Zod
- **Base de Datos:** `mysql2` (diseñado para MySQL/MariaDB)
- **Otros:** `cors`, `dotenv`

## 🚀 Cómo Empezar

Sigue estos pasos para poner en marcha una nueva instancia de este proyecto.

### Prerrequisitos

- Node.js (se recomienda v18+ para el script `dev` con `--watch`)
- npm o un gestor de paquetes compatible
- Una instancia de base de datos MySQL o MariaDB en ejecución.

### Instalación

1.  **Crear el proyecto desde la plantilla:**
    Haz clic en el botón **"Use this template"** en la parte superior de este repositorio para crear tu propio repositorio nuevo con esta estructura.

2.  **Clonar tu nuevo repositorio:**

    ```bash
    git clone https://github.com/tu-usuario/tu-nuevo-repositorio.git
    cd tu-nuevo-repositorio
    ```

3.  **Instalar dependencias:**

    ```bash
    npm install
    ```

4.  **Configurar las variables de entorno:**
    Copia el archivo de ejemplo `.env.example` a un nuevo archivo llamado `.env`.

    ```bash
    cp .env.example .env
    ```

    Luego, abre el archivo `.env` y edita las variables para que coincidan con tu configuración local.

## ⚙️ Configuración

El archivo `.env` es crucial para la configuración de la aplicación.

```env
# Configuración del Servidor
PORT=5000
CORS_ORIGINS=http://localhost:5500,http://127.0.0.1:5500

# Configuración de la Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_de_bd
DB_DATABASE=nombre_de_tu_bd
DB_PORT=3306

# Secretos para JWT (IMPORTANTE: Usar valores largos, aleatorios y seguros)
JWT_SECRET=un-secreto-muy-largo-y-dificil-para-access-tokens
JWT_REFRESH_SECRET=otro-secreto-diferente-y-seguro-para-refresh-tokens
```

**Importante:** La aplicación verifica al iniciar que `JWT_SECRET` exista y tenga una longitud mínima de 32 caracteres para garantizar la seguridad.

## 📜 Scripts Disponibles

Puedes ejecutar los siguientes scripts desde la raíz del proyecto:

- **`npm run dev`**: Inicia el servidor en modo de desarrollo con recarga automática (`node --watch`).
- **`npm start`**: Inicia el servidor para producción (`node src/server.js`).

## Endpoints de la API

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
