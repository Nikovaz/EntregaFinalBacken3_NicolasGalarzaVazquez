import { Router } from 'express';
import PetModel from '../dao/models/pet.model.js';
import UserModel from '../dao/models/user.model.js';

const router = Router();

/**
 * GET /api/pets
 * Obtiene todas las mascotas
 */
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, adopted, specie } = req.query;
        
        // Construir filtros
        const filters = {};
        if (adopted !== undefined) {
            filters.adopted = adopted === 'true';
        }
        if (specie) {
            filters.specie = specie;
        }

        const pets = await PetModel
            .find(filters)
            .populate('owner', 'first_name last_name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await PetModel.countDocuments(filters);

        res.status(200).json({
            status: 'success',
            data: pets,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error obteniendo mascotas:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

/**
 * GET /api/pets/:id
 * Obtiene una mascota por ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const pet = await PetModel
            .findById(id)
            .populate('owner', 'first_name last_name email');

        if (!pet) {
            return res.status(404).json({
                status: 'error',
                message: 'Mascota no encontrada'
            });
        }

        res.status(200).json({
            status: 'success',
            data: pet
        });
    } catch (error) {
        console.error('Error obteniendo mascota:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

/**
 * POST /api/pets
 * Crea una nueva mascota
 */
router.post('/', async (req, res) => {
    try {
        const { name, specie, birthDate, adopted, owner, image } = req.body;

        // Validaciones básicas
        if (!name || !specie || !birthDate) {
            return res.status(400).json({
                status: 'error',
                message: 'Todos los campos son obligatorios: name, specie, birthDate'
            });
        }

        // Validar especie
        const validSpecies = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'turtle', 'snake'];
        if (!validSpecies.includes(specie)) {
            return res.status(400).json({
                status: 'error',
                message: `Especie inválida. Debe ser una de: ${validSpecies.join(', ')}`
            });
        }

        // Verificar que el owner exista si se proporciona
        if (owner) {
            const ownerExists = await UserModel.findById(owner);
            if (!ownerExists) {
                return res.status(404).json({
                    status: 'error',
                    message: 'El usuario propietario no existe'
                });
            }
        }

        // Crear mascota
        const newPet = new PetModel({
            name,
            specie,
            birthDate: new Date(birthDate),
            adopted: adopted || false,
            owner: owner || null,
            image: image || null
        });

        const savedPet = await newPet.save();

        // Si tiene dueño, agregar la mascota al array de pets del usuario
        if (owner) {
            await UserModel.findByIdAndUpdate(
                owner,
                { $push: { pets: savedPet._id } }
            );
        }

        const populatedPet = await PetModel
            .findById(savedPet._id)
            .populate('owner', 'first_name last_name email');

        res.status(201).json({
            status: 'success',
            message: 'Mascota creada correctamente',
            data: populatedPet
        });
    } catch (error) {
        console.error('Error creando mascota:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

/**
 * PUT /api/pets/:id
 * Actualiza una mascota
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, specie, birthDate, adopted, owner, image } = req.body;

        const pet = await PetModel.findById(id);
        if (!pet) {
            return res.status(404).json({
                status: 'error',
                message: 'Mascota no encontrada'
            });
        }

        // Validar especie si se proporciona
        if (specie) {
            const validSpecies = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'turtle', 'snake'];
            if (!validSpecies.includes(specie)) {
                return res.status(400).json({
                    status: 'error',
                    message: `Especie inválida. Debe ser una de: ${validSpecies.join(', ')}`
                });
            }
        }

        // Verificar que el owner exista si se proporciona
        if (owner && owner !== pet.owner?.toString()) {
            const ownerExists = await UserModel.findById(owner);
            if (!ownerExists) {
                return res.status(404).json({
                    status: 'error',
                    message: 'El usuario propietario no existe'
                });
            }

            // Remover mascota del dueño anterior
            if (pet.owner) {
                await UserModel.findByIdAndUpdate(
                    pet.owner,
                    { $pull: { pets: pet._id } }
                );
            }

            // Agregar mascota al nuevo dueño
            await UserModel.findByIdAndUpdate(
                owner,
                { $push: { pets: pet._id } }
            );
        }

        // Preparar datos para actualizar
        const updateData = {};
        if (name) updateData.name = name;
        if (specie) updateData.specie = specie;
        if (birthDate) updateData.birthDate = new Date(birthDate);
        if (adopted !== undefined) updateData.adopted = adopted;
        if (owner !== undefined) updateData.owner = owner || null;
        if (image !== undefined) updateData.image = image || null;

        const updatedPet = await PetModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate('owner', 'first_name last_name email');

        res.status(200).json({
            status: 'success',
            message: 'Mascota actualizada correctamente',
            data: updatedPet
        });
    } catch (error) {
        console.error('Error actualizando mascota:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

/**
 * DELETE /api/pets/:id
 * Elimina una mascota
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const pet = await PetModel.findById(id);
        if (!pet) {
            return res.status(404).json({
                status: 'error',
                message: 'Mascota no encontrada'
            });
        }

        // Remover mascota del array de pets del usuario si tiene dueño
        if (pet.owner) {
            await UserModel.findByIdAndUpdate(
                pet.owner,
                { $pull: { pets: pet._id } }
            );
        }

        await PetModel.findByIdAndDelete(id);

        res.status(200).json({
            status: 'success',
            message: 'Mascota eliminada correctamente',
            data: { id }
        });
    } catch (error) {
        console.error('Error eliminando mascota:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

/**
 * POST /api/pets/:id/adopt/:userId
 * Adoptar una mascota
 */
router.post('/:id/adopt/:userId', async (req, res) => {
    try {
        const { id, userId } = req.params;

        const pet = await PetModel.findById(id);
        if (!pet) {
            return res.status(404).json({
                status: 'error',
                message: 'Mascota no encontrada'
            });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        if (pet.adopted && pet.owner) {
            return res.status(409).json({
                status: 'error',
                message: 'La mascota ya está adoptada'
            });
        }

        // Actualizar mascota
        pet.adopted = true;
        pet.owner = userId;
        await pet.save();

        // Agregar mascota al usuario
        await UserModel.findByIdAndUpdate(
            userId,
            { $push: { pets: pet._id } }
        );

        const updatedPet = await PetModel
            .findById(id)
            .populate('owner', 'first_name last_name email');

        res.status(200).json({
            status: 'success',
            message: 'Mascota adoptada correctamente',
            data: updatedPet
        });
    } catch (error) {
        console.error('Error adoptando mascota:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

/**
 * GET /api/pets/available
 * Obtiene mascotas disponibles para adopción
 */
router.get('/status/available', async (req, res) => {
    try {
        const availablePets = await PetModel
            .find({ adopted: false })
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            data: availablePets,
            count: availablePets.length
        });
    } catch (error) {
        console.error('Error obteniendo mascotas disponibles:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

export default router;
