# API REST Administrativa - Gestión de Tienda

![Node.js](https://img.shields.io/badge/Node.js-16.x-green?style=for-the-badge&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-4.x-blue?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-5.x-green?style=for-the-badge&logo=mongodb)

API RESTful segura y robusta construida con Node.js, Express y MongoDB, diseñada exclusivamente para las tareas administrativas de una plataforma de e-commerce. Proporciona endpoints protegidos para la gestión completa de productos y la consulta de datos para informes.

Este proyecto sigue las mejores prácticas de desarrollo, incluyendo una arquitectura por capas (controladores, servicios, modelos), manejo de errores centralizado y validación de datos.

## 🚀 Características Principales

-   **Autenticación con JWT**: Sistema de login seguro basado en JSON Web Tokens.
-   **Autorización por Roles**: Middleware que restringe el acceso a los endpoints exclusivamente a usuarios con rol de `admin`.
-   **CRUD de Productos**: Operaciones completas para Crear, Leer, Actualizar y Eliminar productos.
-   **Paginación**: El listado de productos está paginado para un rendimiento óptimo.
-   **Validación de Entradas**: Uso de `express-validator` para sanear y validar los datos recibidos.
-   **Manejo de Errores Centralizado**: Un único middleware gestiona todos los errores de la aplicación.
-   **Script de Seeding**: Incluye un script para crear el primer usuario administrador en la base de datos.
-   **Interfaz de Pruebas**: Panel de pruebas web integrado para interactuar con la API fácilmente desde el navegador.

## 🛠️ Stack Tecnológico

-   **Backend**: Node.js, Express.js
-   **Base de Datos**: MongoDB con Mongoose (ODM)
-   **Autenticación**: JSON Web Token (`jsonwebtoken`), `bcryptjs`
-   **Validación**: `express-validator`
-   **Variables de Entorno**: `dotenv`
-   **Desarrollo**: `nodemon`

## 📋 Prerrequisitos

Asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:

-   [Node.js](https://nodejs.org/) (v16 o superior recomendado)
-   [MongoDB](https://www.mongodb.com/try/download/community) (servidor local o una instancia en la nube como MongoDB Atlas)

## ⚙️ Instalación y Configuración

1.  **Clona el repositorio:**
    ```bash
    git clone https://URL_DE_TU_REPOSITORIO.git
    cd nombre-del-directorio
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables. Puedes usar el archivo `.env.example` como plantilla.

    ```env
    # .env.example

    # Configuración del servidor
    PORT=3000

    # URI de conexión a tu base de datos MongoDB
    MONGO_URI=mongodb://localhost:27017/tienda_admin_db

    # Clave secreta para firmar los JWT (¡cámbiala por una cadena larga y segura!)
    JWT_SECRET=ESTE_ES_UN_SECRETO_MUY_DIFICIL_DE_ADIVINAR

    # Tiempo de expiración del token (ej: 1d, 8h, 60m)
    JWT_EXPIRES_IN=1d
    ```

## ▶️ Ejecución del Proyecto

1.  **Crear el usuario administrador:**
    Antes de iniciar el servidor por primera vez, ejecuta el script de "seeding" para crear el usuario `admin` en la base de datos.
    > **Nota:** Puedes cambiar la contraseña por defecto en `scripts/seedAdmin.js`.

    ```bash
    node scripts/seedAdmin.js
    ```
    Deberías ver el mensaje: `Usuario administrador creado exitosamente.`

2.  **Iniciar el servidor en modo desarrollo:**
    Este comando utiliza `nodemon` para reiniciar el servidor automáticamente tras cada cambio en el código.

    ```bash
    npm run dev
    ```

3.  **Iniciar el servidor en modo producción:**
    ```bash
    npm start
    ```

El servidor estará corriendo en `http://localhost:3000`.

## 🧪 Interfaz de Pruebas

Este proyecto incluye una interfaz web para probar todos los endpoints de forma sencilla. Una vez que el servidor esté en marcha, abre tu navegador y visita:

**`http://localhost:3000`**

Desde allí podrás:
-   Hacer login con el usuario `admin@tienda.com` (la contraseña se autocompletará).
-   Obtener un token JWT.
-   Probar el CRUD completo de productos.
-   Ver las respuestas de la API en tiempo real.

## 📝 Documentación de la API

Todas las rutas están prefijadas con `/api/v1`. Las rutas protegidas requieren un token en el header `Authorization`.

`Authorization: Bearer <TU_TOKEN_JWT>`

### Auth

| Método | Ruta                 | Acceso  | Descripción                        |
| :----- | :------------------- | :------ | :--------------------------------- |
| `POST` | `/auth/login`        | Público | Inicia sesión y obtiene un JWT.    |

### Productos

| Método   | Ruta                 | Acceso  | Descripción                            |
| :------- | :------------------- | :------ | :------------------------------------- |
| `GET`    | `/productos`         | Admin   | Lista todos los productos (con paginación). |
| `POST`   | `/productos`         | Admin   | Crea un nuevo producto.                |
| `GET`    | `/productos/:id`     | Admin   | Obtiene un producto por su ID.         |
| `PUT`    | `/productos/:id`     | Admin   | Actualiza un producto existente.       |
| `DELETE` | `/productos/:id`     | Admin   | Elimina un producto.                   |

## 📂 Estructura del Proyecto

```
/
├── public/                # Interfaz de pruebas web
│   ├── index.html
│   ├── style.css
│   └── script.js
├── scripts/               # Scripts de utilidad
│   └── seedAdmin.js
├── src/
│   ├── controllers/       # Lógica de manejo de peticiones y respuestas
│   ├── middlewares/       # Funciones intermedias (auth, roles, errores)
│   ├── models/            # Esquemas de Mongoose para la base de datos
│   ├── routes/            # Definición de las rutas de la API
│   ├── services/          # Lógica de negocio y comunicación con la BD
│   └── validators/        # Reglas de validación para express-validator
│   └── app.js             # Punto de entrada principal y configuración de Express
├── .env                   # Variables de entorno (privado)
├── .gitignore
├── package.json
└── README.md
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.