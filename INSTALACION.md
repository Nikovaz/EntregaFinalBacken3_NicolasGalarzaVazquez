# Instrucciones de Instalación y Uso

## Requisitos Previos

1. **Node.js** (versión 16 o superior)
2. **MongoDB** (local o remoto)
3. **npm** o **yarn**

## Instalación

### 1. Clonar o descargar el proyecto

```bash
# Si tienes el proyecto en un repositorio
git clone <url-del-repositorio>
cd backend-proyecto

# O si lo descargaste como ZIP
# Extraer y navegar a la carpeta
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```bash
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones:

```
MONGODB_URI=mongodb://localhost:27017/backend_mocks
PORT=8080
NODE_ENV=development
```

### 4. Asegurar que MongoDB esté ejecutándose

**MongoDB Local:**
```bash
# En Windows
mongod

# En macOS/Linux
sudo systemctl start mongod
# o
brew services start mongodb/brew/mongodb-community
```

**MongoDB Atlas (Cloud):**
- Usar la URI de conexión proporcionada por MongoDB Atlas en `MONGODB_URI`

## Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

El servidor se ejecutará en `http://localhost:8080` por defecto.

## Pruebas de los Endpoints

### 1. Verificar que el servidor está funcionando

```bash
curl http://localhost:8080
```

### 2. Generar datos mock

**Generar 100 mascotas mock:**
```bash
curl http://localhost:8080/api/mocks/mockingpets
```

**Generar 50 usuarios mock:**
```bash
curl http://localhost:8080/api/mocks/mockingusers
```

**Generar e insertar datos en la BD:**
```bash
curl -X POST http://localhost:8080/api/mocks/generateData \
  -H "Content-Type: application/json" \
  -d '{"users": 10, "pets": 20}'
```

### 3. Verificar datos insertados

**Ver usuarios:**
```bash
curl http://localhost:8080/api/users
```

**Ver mascotas:**
```bash
curl http://localhost:8080/api/pets
```

## Ejemplos de uso con herramientas

### Con Postman

1. **GET** `http://localhost:8080/api/mocks/mockingpets`
2. **GET** `http://localhost:8080/api/mocks/mockingusers`
3. **POST** `http://localhost:8080/api/mocks/generateData`
   - Body (JSON): `{"users": 5, "pets": 10}`

### Con curl

```bash
# Generar datos
curl -X POST http://localhost:8080/api/mocks/generateData \
  -H "Content-Type: application/json" \
  -d '{"users": 15, "pets": 25}'

# Verificar usuarios insertados
curl http://localhost:8080/api/users

# Verificar mascotas insertadas
curl http://localhost:8080/api/pets
```

## Estructura del Proyecto

```
backend-proyecto/
├── src/
│   ├── dao/
│   │   └── models/
│   │       ├── user.model.js
│   │       └── pet.model.js
│   ├── routes/
│   │   ├── mocks.router.js    # Router principal del entregable
│   │   ├── users.router.js
│   │   └── pets.router.js
│   ├── services/
│   │   ├── user.service.js
│   │   └── pet.service.js
│   ├── utils/
│   │   ├── user.mocking.js    # Módulo de mocking de usuarios
│   │   └── pet.mocking.js     # Módulo de mocking de mascotas
│   └── app.js                 # Aplicación principal
├── package.json
├── .env.example
└── README.md
```

## Solución de Problemas

### Error de conexión a MongoDB
- Verificar que MongoDB esté ejecutándose
- Verificar la URI en el archivo `.env`
- Para MongoDB local: `mongodb://localhost:27017/backend_mocks`

### Puerto en uso
- Cambiar el puerto en el archivo `.env`
- O usar: `PORT=3000 npm start`

### Errores de dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

## Contacto

Si tienes problemas con la instalación o ejecución, verifica:
1. Versión de Node.js: `node --version`
2. MongoDB está ejecutándose
3. Las variables de entorno están configuradas correctamente
