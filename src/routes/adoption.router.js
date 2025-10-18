import { Router } from 'express';
import PetModel from '../dao/models/pet.model.js';
import UserModel from '../dao/models/user.model.js';

const router = Router();

/**
 * GET /api/adoptions
 * Obtiene todas las adopciones
 */
router.get('/', async (req, res) => {
    try {
        const adoptions = await PetModel
            .find({ adopted: true, owner: { $ne: null } })
            .populate('owner', 'first_name last_name email')
            .sort({ updatedAt: -1 });

        res.status(200).json({
            status: 'success',
            data: adoptions,
            count: adoptions.length
        });
    } catch (error) {
        console.error('Error obteniendo adopciones:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

/**
 * GET /api/adoptions/:aid
 * Obtiene una adopción específica por ID
 */
router.get('/:aid', async (req, res) => {
    try {
        const { aid } = req.params;

        const adoption = await PetModel
            .findById(aid)
            .populate('owner', 'first_name last_name email');

        if (!adoption) {
            return res.status(404).json({
                status: 'error',
                message: 'Adopción no encontrada'
            });
        }

        if (!adoption.adopted || !adoption.owner) {
            return res.status(400).json({
                status: 'error',
                message: 'Esta mascota no ha sido adoptada'
            });
        }

        res.status(200).json({
            status: 'success',
            data: adoption
        });
    } catch (error) {
        console.error('Error obteniendo adopción:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

/**
 * POST /api/adoptions/:uid/:pid
 * Crea una nueva adopción (usuario adopta mascota)
 */
router.post('/:uid/:pid', async (req, res) => {
    try {
        const { uid, pid } = req.params;

        // Verificar que el usuario existe
        const user = await UserModel.findById(uid);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        // Verificar que la mascota existe
        const pet = await PetModel.findById(pid);
        if (!pet) {
            return res.status(404).json({
                status: 'error',
                message: 'Mascota no encontrada'
            });
        }

        // Verificar que la mascota no está adoptada
        if (pet.adopted && pet.owner) {
            return res.status(400).json({
                status: 'error',
                message: 'Esta mascota ya ha sido adoptada'
            });
        }

        // Realizar la adopción
        pet.adopted = true;
        pet.owner = uid;
        await pet.save();

        // Agregar mascota al array de pets del usuario
        if (!user.pets.includes(pid)) {
            user.pets.push(pid);
            await user.save();
        }

        const adoption = await PetModel
            .findById(pid)
            .populate('owner', 'first_name last_name email');

        res.status(201).json({
            status: 'success',
            message: 'Adopción realizada exitosamente',
            data: adoption
        });
    } catch (error) {
        console.error('Error creando adopción:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

/**
 * DELETE /api/adoptions/:aid
 * Cancela una adopción
 */
router.delete('/:aid', async (req, res) => {
    try {
        const { aid } = req.params;

        const pet = await PetModel.findById(aid);
        if (!pet) {
            return res.status(404).json({
                status: 'error',
                message: 'Mascota no encontrada'
            });
        }

        if (!pet.adopted || !pet.owner) {
            return res.status(400).json({
                status: 'error',
                message: 'Esta mascota no está adoptada'
            });
        }

        const ownerId = pet.owner;

        // Remover mascota del array de pets del usuario
        await UserModel.findByIdAndUpdate(
            ownerId,
            { $pull: { pets: aid } }
        );

        // Cancelar adopción
        pet.adopted = false;
        pet.owner = null;
        await pet.save();

        res.status(200).json({
            status: 'success',
            message: 'Adopción cancelada exitosamente',
            data: pet
        });
    } catch (error) {
        console.error('Error cancelando adopción:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

export default router;
