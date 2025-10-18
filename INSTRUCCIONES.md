# Instrucciones para ejecutar el proyecto

## 1. Instalación
```bash
cd backend-proyecto
npm install
```

## 2. Configuración
1. Copiar `.env.example` a `.env`
2. Configurar las variables de entorno:
```
MONGODB_URI=mongodb://localhost:27017/backend_mocks
PORT=8080
```

## 3. Ejecutar el proyecto
```bash
npm start
# o para desarrollo
npm run dev
```

## 4. Probar los endpoints

### Generar datos mock:
```bash
# Generar 100 mascotas mock
GET http://localhost:8080/api/mocks/mockingpets

# Generar 50 usuarios mock
GET http://localhost:8080/api/mocks/mockingusers

# Generar e insertar datos en BD
POST http://localhost:8080/api/mocks/generateData
Content-Type: application/json

{
  "users": 10,
  "pets": 20
}
```

### Verificar los datos insertados:
```bash
# Ver usuarios insertados
GET http://localhost:8080/api/users

# Ver mascotas insertadas
GET http://localhost:8080/api/pets
```

## Estructura del proyecto:
```
backend-proyecto/
├── src/
│   ├── routes/
│   │   ├── mocks.router.js    # ✅ Router principal de mocking
│   │   ├── users.router.js    # ✅ CRUD de usuarios
│   │   └── pets.router.js     # ✅ CRUD de mascotas
│   ├── utils/
│   │   ├── user.mocking.js    # ✅ Módulo de mocking de usuarios
│   │   └── pet.mocking.js     # ✅ Módulo de mocking de mascotas
│   ├── dao/models/
│   │   ├── user.model.js      # ✅ Modelo de usuario
│   │   └── pet.model.js       # ✅ Modelo de mascota
│   ├── services/
│   │   ├── user.service.js    # ✅ Lógica de negocio usuarios
│   │   └── pet.service.js     # ✅ Lógica de negocio mascotas
│   └── app.js                 # ✅ Aplicación principal
├── package.json               # ✅ Dependencias y scripts
└── README.md                  # ✅ Documentación
```

¡Todo listo para entregar! 🚀
