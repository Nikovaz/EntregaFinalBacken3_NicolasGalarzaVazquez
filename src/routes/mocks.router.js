import { Router } from 'express';
import { generateMockUsers } from '../utils/user.mocking.js';
import { generateMockPets } from '../utils/pet.mocking.js';
import UserModel from '../dao/models/user.model.js';
import PetModel from '../dao/models/pet.model.js';

const router = Router();

/**
 * GET /api/mocks/mockingpets
 * Genera 100 mascotas mock (migrado del primer desafío)
 */
router.get('/mockingpets', (req, res) => {
    try {
        const pets = generateMockPets(100);
        
        res.status(200).json({
            status: 'success',
            message: '100 mascotas mock generadas correctamente',
            data: pets
        });
    } catch (error) {
        console.error('Error generando mascotas mock:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor al generar mascotas mock'
        });
    }
});

/**
 * GET /api/mocks/mockingusers
 * Genera 50 usuarios mock con formato de MongoDB
 */
router.get('/mockingusers', (req, res) => {
    try {
        const users = generateMockUsers(50);
        
        res.status(200).json({
            status: 'success',
            message: '50 usuarios mock generados correctamente',
            data: users
        });
    } catch (error) {
        console.error('Error generando usuarios mock:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor al generar usuarios mock'
        });
    }
});

/**
 * POST /api/mocks/generateData
 * Genera e inserta usuarios y mascotas en la base de datos
 * Body: { users: number, pets: number }
 */
router.post('/generateData', async (req, res) => {
    try {
        const { users: numUsers, pets: numPets } = req.body;

        // Validar parámetros
        if (!numUsers || !numPets) {
            return res.status(400).json({
                status: 'error',
                message: 'Debes especificar el número de usuarios y mascotas',
                example: { users: 10, pets: 20 }
            });
        }

        if (typeof numUsers !== 'number' || typeof numPets !== 'number') {
            return res.status(400).json({
                status: 'error',
                message: 'Los parámetros users y pets deben ser números'
            });
        }

        if (numUsers < 0 || numPets < 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Los números de usuarios y mascotas deben ser positivos'
            });
        }

        // Generar datos mock
        const usersToInsert = generateMockUsers(numUsers);
        const petsToInsert = generateMockPets(numPets);

        // Insertar en la base de datos
        let insertedUsers = [];
        let insertedPets = [];

        if (numUsers > 0) {
            insertedUsers = await UserModel.insertMany(usersToInsert);
        }

        if (numPets > 0) {
            insertedPets = await PetModel.insertMany(petsToInsert);
        }

        res.status(201).json({
            status: 'success',
            message: `${numUsers} usuarios y ${numPets} mascotas generados e insertados correctamente`,
            data: {
                usersInserted: insertedUsers.length,
                petsInserted: insertedPets.length,
                totalInserted: insertedUsers.length + insertedPets.length
            },
            info: {
                usersIds: insertedUsers.map(user => user._id),
                petsIds: insertedPets.map(pet => pet._id)
            }
        });

    } catch (error) {
        console.error('Error generando e insertando datos:', error);
        
        // Manejo específico de errores de MongoDB
        if (error.code === 11000) {
            return res.status(409).json({
                status: 'error',
                message: 'Error: Email duplicado. Algunos usuarios no pudieron ser insertados.',
                details: error.message
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor al generar e insertar datos',
            details: error.message
        });
    }
});

/**
 * GET /api/mocks
 * Endpoint de información sobre las rutas disponibles
 */
router.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Router de Mocks - Endpoints disponibles',
        endpoints: {
            'GET /mockingpets': 'Genera 100 mascotas mock',
            'GET /mockingusers': 'Genera 50 usuarios mock',
            'POST /generateData': 'Genera e inserta datos en la BD (requiere body con users y pets)'
        },
        examples: {
            generateData: {
                method: 'POST',
                body: { users: 10, pets: 20 },
                description: 'Genera 10 usuarios y 20 mascotas en la base de datos'
            }
        }
    });
});

export default router;
