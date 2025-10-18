import PetModel from '../dao/models/pet.model.js';
import UserModel from '../dao/models/user.model.js';

class PetService {
    async getAllPets(filters = {}, page = 1, limit = 10) {
        try {
            const pets = await PetModel
                .find(filters)
                .populate('owner', 'first_name last_name email')
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 });

            const total = await PetModel.countDocuments(filters);

            return { pets, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } };
        } catch (error) {
            throw new Error(`Error obteniendo mascotas: ${error.message}`);
        }
    }

    async getPetById(id) {
        try {
            return await PetModel.findById(id).populate('owner', 'first_name last_name email');
        } catch (error) {
            throw new Error(`Error obteniendo mascota: ${error.message}`);
        }
    }

    async createPet(petData) {
        try {
            const { name, specie, birthDate, adopted, owner, image } = petData;

            if (owner) {
                const ownerExists = await UserModel.findById(owner);
                if (!ownerExists) {
                    throw new Error('El usuario propietario no existe');
                }
            }

            const newPet = new PetModel({
                name, specie, birthDate: new Date(birthDate), adopted: adopted || false, owner: owner || null, image: image || null
            });

            const savedPet = await newPet.save();

            if (owner) {
                await UserModel.findByIdAndUpdate(owner, { $push: { pets: savedPet._id } });
            }

            return await this.getPetById(savedPet._id);
        } catch (error) {
            throw new Error(`Error creando mascota: ${error.message}`);
        }
    }
}

export default new PetService();
