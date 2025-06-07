# Bolsa de Trabajo de Oficios

Este proyecto es una plataforma web diseñada para conectar clientes con profesionales de diversos oficios (electricistas, carpinteros, plomeros, etc.). Permite a los clientes publicar trabajos y a los profesionales ofrecer sus servicios, facilitando el contacto y la futura puntuación mutua.

## Estructura del Proyecto

El proyecto está dividido en dos componentes principales:

-   \`/frontend\`: Aplicación Next.js (React) que maneja la interfaz de usuario.
-   \`/backend\`: API RESTful construida con Node.js y Express, utilizando MongoDB como base de datos.

## Tecnologías Utilizadas

**Backend:**
-   Node.js
-   Express.js
-   MongoDB (con Mongoose)
-   JSON Web Tokens (JWT) para autenticación
-   bcrypt.js para hashing de contraseñas
-   Jest y Supertest para pruebas

**Frontend:**
-   Next.js (con React y TypeScript - aunque los archivos son .tsx, la lógica es principalmente JS)
-   Bootstrap 5 para estilos CSS
-   Axios para peticiones HTTP
-   React Context API para manejo de estado de autenticación

**Desarrollo:**
-   npm como gestor de paquetes

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:
-   [Node.js](https://nodejs.org/) (versión LTS recomendada, incluye npm)
-   [MongoDB](https://www.mongodb.com/try/download/community) (servidor de base de datos) - Asegúrate de que esté corriendo.

## Configuración y Ejecución

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### 1. Backend Setup

Navega a la carpeta del backend:
\`\`\`bash
cd backend
\`\`\`

Instala las dependencias:
\`\`\`bash
npm install
\`\`\`

Crea un archivo de variables de entorno \`.env\` en la carpeta \`backend\`. Puedes copiar \`.env.example\` si existiera, o crearlo manualmente. Debe contener al menos:
\`\`\`env
# backend/.env
MONGODB_URI=mongodb://localhost:27017/bolsa_trabajo_oficios_dev
JWT_SECRET=tu_super_secreto_para_jwt_debe_ser_largo_y_complejo
JWT_EXPIRE=30d
PORT=5000
\`\`\`
**Nota:** Reemplaza \`JWT_SECRET\` con una cadena aleatoria segura. \`MONGODB_URI\` es la cadena de conexión a tu instancia de MongoDB.

Ejecuta el servidor de desarrollo del backend:
\`\`\`bash
npm start
\`\`\`
El servidor backend debería estar corriendo en \`http://localhost:5000\` (o el puerto que hayas configurado en \`.env\`).

Para ejecutar las pruebas del backend:
\`\`\`bash
npm test
\`\`\`

### 2. Frontend Setup

Navega a la carpeta del frontend (desde la raíz del proyecto):
\`\`\`bash
cd frontend
\`\`\`

Instala las dependencias:
\`\`\`bash
npm install
\`\`\`

Crea un archivo de variables de entorno \`.env.local\` en la carpeta \`frontend\`. Debe contener:
\`\`\`env
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`
**Nota:** Asegúrate de que \`NEXT_PUBLIC_API_URL\` apunte a la URL correcta donde se está ejecutando tu backend.

Ejecuta el servidor de desarrollo del frontend:
\`\`\`bash
npm run dev
\`\`\`
La aplicación frontend debería estar corriendo en \`http://localhost:3000\`.

### 3. Acceder a la Aplicación

Una vez que ambos servidores (backend y frontend) estén en funcionamiento:
-   Abre tu navegador y ve a \`http://localhost:3000\` para ver la aplicación.

## Endpoints Principales de la API (Backend)

La API del backend se encuentra bajo el prefijo \`/api\`.

-   **Autenticación:**
    -   \`POST /api/auth/register\`: Registrar un nuevo usuario.
    -   \`POST /api/auth/login\`: Iniciar sesión.
    -   \`GET /api/auth/me\`: Obtener perfil del usuario autenticado (ruta protegida).
-   **Usuarios (Profesionales):**
    -   \`GET /api/users/professionals\`: Listar todos los profesionales.
    -   \`GET /api/users/:userId/profile\`: Obtener el perfil público de un usuario.
    -   \`PUT /api/users/:userId/profile\`: Actualizar el perfil del usuario (ruta protegida).
-   **Trabajos:**
    -   \`POST /api/jobs\`: Crear una nueva solicitud de trabajo (ruta protegida, para clientes).
    -   \`GET /api/jobs\`: Listar todas las solicitudes de trabajo.
    -   \`GET /api/jobs/:jobId\`: Obtener detalles de un trabajo específico.

## Contribuciones

Por el momento, este proyecto está en desarrollo inicial. Futuras contribuciones podrían incluir:
-   Sistema de puntuación y reseñas.
-   Búsqueda avanzada y filtros.
-   Notificaciones.
-   Panel de administración.
-   Despliegue a producción.

---
*Este README fue generado como parte de un proceso de desarrollo asistido.*
