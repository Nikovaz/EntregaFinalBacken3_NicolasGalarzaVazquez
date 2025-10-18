import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Importar routers
import mocksRouter from './routes/mocks.router.js';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/backend_mocks';

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Backend Entregable API',
            version: '1.0.0',
            description: 'API para sistema de adopción de mascotas con mocking de datos',
            contact: {
                name: 'API Support'
            }
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Servidor de desarrollo'
            }
        ],
        tags: [
            { name: 'Users', description: 'Endpoints de gestión de usuarios' },
            { name: 'Pets', description: 'Endpoints de gestión de mascotas' },
            { name: 'Adoptions', description: 'Endpoints de gestión de adopciones' },
            { name: 'Mocks', description: 'Endpoints para generación de datos mock' }
        ]
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Ruta de documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configurar rutas
app.use('/api/mocks', mocksRouter);
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'Backend Entregable - Sistema de Mocking y Adopciones',
        documentation: '/api-docs',
        endpoints: {
            mocks: '/api/mocks',
            users: '/api/users',
            pets: '/api/pets',
            adoptions: '/api/adoptions'
        },
        mockEndpoints: {
            mockingpets: 'GET /api/mocks/mockingpets',
            mockingusers: 'GET /api/mocks/mockingusers',
            generateData: 'POST /api/mocks/generateData'
        }
    });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: err.message
    });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        message: `La ruta ${req.originalUrl} no existe`
    });
});

// Conectar a MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Conectado a MongoDB');
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
            console.log(`📍 URL: http://localhost:${PORT}`);
            console.log(`📚 Documentación: http://localhost:${PORT}/api-docs`);
            console.log('🔗 Endpoints disponibles:');
            console.log('   - GET  /api/mocks/mockingpets');
            console.log('   - GET  /api/mocks/mockingusers');
            console.log('   - POST /api/mocks/generateData');
            console.log('   - GET  /api/users');
            console.log('   - GET  /api/pets');
            console.log('   - GET  /api/adoptions');
        });
    })
    .catch((error) => {
        console.error('❌ Error conectando a MongoDB:', error);
        process.exit(1);
    });

// Manejo de cierre graceful
process.on('SIGINT', async () => {
    console.log('\n🛑 Cerrando servidor...');
    await mongoose.connection.close();
    console.log('✅ Conexión a MongoDB cerrada');
    process.exit(0);
});

export default app;
