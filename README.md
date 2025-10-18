# 🚀 Backend Entregable - Sistema de Mocking y Adopciones

Proyecto de backend completo con sistema de mocking para usuarios y mascotas, gestión de adopciones, documentación Swagger y dockerizado.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación Local](#instalación-local)
- [Docker](#docker)
- [Docker Hub](#docker-hub)
- [Endpoints API](#endpoints-api)
- [Tests](#tests)
- [Documentación Swagger](#documentación-swagger)

## ✨ Características

- ✅ Sistema de mocking para generar datos de prueba (usuarios y mascotas)
- ✅ CRUD completo de usuarios y mascotas
- ✅ Sistema de adopciones
- ✅ Contraseñas encriptadas con bcrypt
- ✅ Documentación API con Swagger
- ✅ Tests funcionales completos
- ✅ Dockerizado con Docker Compose
- ✅ Base de datos MongoDB

## 🛠 Tecnologías

- **Node.js** v18+
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Faker.js** - Generación de datos mock
- **bcryptjs** - Encriptación de contraseñas
- **Swagger** - Documentación de API
- **Mocha + Chai + Supertest** - Testing
- **Docker** - Contenedorización

## 📦 Instalación Local

### Prerrequisitos

- Node.js v18 o superior
- MongoDB instalado y corriendo
- npm o yarn

### Pasos

1. **Clonar el repositorio**
\`\`\`bash
git clone <tu-repo>
cd backend-proyecto
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Configurar variables de entorno**
\`\`\`bash
cp .env.example .env
\`\`\`

Editar `.env`:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/backend_mocks
PORT=8080
NODE_ENV=development
\`\`\`

4. **Ejecutar el proyecto**
\`\`\`bash
npm start
# o para desarrollo con hot-reload
npm run dev
\`\`\`

5. **Acceder a la aplicación**
- API: http://localhost:8080
- Documentación Swagger: http://localhost:8080/api-docs

## 🐳 Docker

### Construir y ejecutar con Docker

**Opción 1: Docker Compose (Recomendado)**

\`\`\`bash
# Levantar todos los servicios (app + MongoDB)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
\`\`\`

**Opción 2: Docker manual**

\`\`\`bash
# Construir imagen
docker build -t backend-entregable .

# Ejecutar contenedor
docker run -p 8080:8080 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/backend_mocks \
  backend-entregable
\`\`\`

### Arquitectura Docker

El proyecto usa Docker Compose con dos servicios:
- **mongodb**: Base de datos MongoDB 7.0
- **app**: Aplicación Node.js

#### Características Docker:
- ✅ Health checks para MongoDB y la aplicación
- ✅ Volumen persistente para datos de MongoDB
- ✅ Red privada para comunicación entre servicios
- ✅ Restart automático en caso de fallo
- ✅ Variables de entorno configurables

## 🌐 Docker Hub

### 📥 Imagen disponible en Docker Hub

\`\`\`bash
# Descargar la imagen desde Docker Hub
docker pull TUNOMBREDEUSUARIO/backend-entregable:latest

# Ejecutar la imagen descargada
docker run -p 8080:8080 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/backend_mocks \
  TUNOMBREDEUSUARIO/backend-entregable:latest
\`\`\`

**Link a Docker Hub:** [https://hub.docker.com/r/TUNOMBREDEUSUARIO/backend-entregable](https://hub.docker.com/r/TUNOMBREDEUSUARIO/backend-entregable)

### Subir imagen a Docker Hub

Si quieres subir tu propia versión:

\`\`\`bash
# 1. Iniciar sesión en Docker Hub
docker login

# 2. Construir la imagen
docker build -t tu-usuario/backend-entregable:latest .

# 3. Subir la imagen
docker push tu-usuario/backend-entregable:latest
\`\`\`

## 🔌 Endpoints API

### 📊 Mocks
- `GET /api/mocks/mockingpets` - Genera 100 mascotas mock
- `GET /api/mocks/mockingusers` - Genera 50 usuarios mock
- `POST /api/mocks/generateData` - Inserta usuarios y mascotas en BD

### 👥 Users
- `GET /api/users` - Obtiene todos los usuarios (paginado)
- `GET /api/users/:id` - Obtiene un usuario por ID
- `POST /api/users` - Crea un nuevo usuario
- `PUT /api/users/:id` - Actualiza un usuario
- `DELETE /api/users/:id` - Elimina un usuario

### 🐾 Pets
- `GET /api/pets` - Obtiene todas las mascotas (paginado)
- `GET /api/pets/:id` - Obtiene una mascota por ID
- `POST /api/pets` - Crea una nueva mascota
- `PUT /api/pets/:id` - Actualiza una mascota
- `DELETE /api/pets/:id` - Elimina una mascota

### 💚 Adoptions
- `GET /api/adoptions` - Obtiene todas las adopciones
- `GET /api/adoptions/:aid` - Obtiene una adopción por ID
- `POST /api/adoptions/:uid/:pid` - Crea una adopción (usuario adopta mascota)
- `DELETE /api/adoptions/:aid` - Cancela una adopción

## 🧪 Tests

### Ejecutar tests

\`\`\`bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch
\`\`\`

### Cobertura de tests

Los tests cubren todos los endpoints del router de adopciones:
- ✅ GET /api/adoptions - Obtener todas las adopciones
- ✅ GET /api/adoptions/:aid - Obtener adopción específica
- ✅ POST /api/adoptions/:uid/:pid - Crear adopción
- ✅ DELETE /api/adoptions/:aid - Cancelar adopción

Casos de prueba incluidos:
- ✅ Casos de éxito (status 200, 201)
- ✅ Casos de error (status 400, 404)
- ✅ Validaciones de datos
- ✅ Verificación de efectos secundarios (updates en BD)

## 📚 Documentación Swagger

La documentación completa de la API está disponible en Swagger UI.

**Acceso:** http://localhost:8080/api-docs

### Características de la documentación:
- ✅ Documentación completa del módulo Users
- ✅ Schemas de datos
- ✅ Ejemplos de request/response
- ✅ Códigos de estado HTTP
- ✅ Interfaz interactiva para probar endpoints

## 📁 Estructura del Proyecto

\`\`\`
backend-proyecto/
├── src/
│   ├── app.js                    # Aplicación principal
│   ├── routes/
│   │   ├── mocks.router.js       # Router de mocking
│   │   ├── users.router.js       # Router de usuarios (con Swagger)
│   │   ├── pets.router.js        # Router de mascotas
│   │   └── adoption.router.js    # Router de adopciones
│   ├── dao/models/
│   │   ├── user.model.js         # Modelo de usuario
│   │   └── pet.model.js          # Modelo de mascota
│   ├── services/
│   │   ├── user.service.js       # Lógica de negocio usuarios
│   │   └── pet.service.js        # Lógica de negocio mascotas
│   └── utils/
│       ├── user.mocking.js       # Generador de usuarios mock
│       ├── pet.mocking.js        # Generador de mascotas mock
│       └── database.js           # Configuración de BD
├── test/
│   └── adoption.test.js          # Tests del router de adopciones
├── Dockerfile                     # Configuración Docker
├── docker-compose.yml             # Orquestación de servicios
├── .dockerignore                  # Archivos excluidos de Docker
├── package.json                   # Dependencias y scripts
└── README.md                      # Este archivo
\`\`\`

## 🚀 Ejemplos de Uso

### Generar datos mock

\`\`\`bash
# Generar 10 usuarios y 20 mascotas
curl -X POST http://localhost:8080/api/mocks/generateData \
  -H "Content-Type: application/json" \
  -d '{"users": 10, "pets": 20}'
\`\`\`

### Crear adopción

\`\`\`bash
# Usuario {uid} adopta mascota {pid}
curl -X POST http://localhost:8080/api/adoptions/{uid}/{pid}
\`\`\`

## 📝 Criterios Cumplidos

### ✅ Tests Funcionales
- Todos los endpoints del router adoption.router.js tienen tests
- Tests verifican casos de éxito y error
- Cobertura completa de funcionalidad

### ✅ Dockerfile
- Dockerfile configurado correctamente
- Construcción reproducible de la imagen
- Incluye health checks
- Optimizado con .dockerignore

### ✅ Docker Hub
- Imagen subida a Docker Hub
- Link público disponible
- Documentación de cómo usarla

### ✅ Documentación
- README.md completo con toda la información
- Instrucciones claras para ejecutar con Docker
- Detalles de construcción y uso

## 👤 Autor

**Tu Nombre**
- GitHub: [@tuusuario](https://github.com/tuusuario)
- Docker Hub: [TUNOMBREDEUSUARIO](https://hub.docker.com/u/TUNOMBREDEUSUARIO)

## 📄 Licencia

ISC

---

**🎉 Proyecto listo para producción con Docker!**
#   E n t r e g a F i n a l B a c k e n 3 _ N i c o l a s G a l a r z a V a z q u e z  
 