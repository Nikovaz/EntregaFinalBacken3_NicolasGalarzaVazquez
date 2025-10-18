import UserModel from '../dao/models/user.model.js';
import bcrypt from 'bcryptjs';

class UserService {
    async getAllUsers(page = 1, limit = 10) {
        try {
            const users = await UserModel.find({}).select('-password').populate('pets')
                .limit(limit * 1).skip((page - 1) * limit).sort({ createdAt: -1 });
            const total = await UserModel.countDocuments({});
            return { users, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } };
        } catch (error) {
            throw new Error(`Error obteniendo usuarios: ${error.message}`);
        }
    }

    async getUserById(id) {
        try {
            return await UserModel.findById(id).select('-password').populate('pets');
        } catch (error) {
            throw new Error(`Error obteniendo usuario: ${error.message}`);
        }
    }

    async createUser(userData) {
        try {
            const { first_name, last_name, email, age, password, role } = userData;
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                throw new Error('El email ya está registrado');
            }
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const newUser = new UserModel({
                first_name, last_name, email: email.toLowerCase(), age, password: hashedPassword, role: role || 'user', pets: []
            });
            return await newUser.save();
        } catch (error) {
            throw new Error(`Error creando usuario: ${error.message}`);
        }
    }
}

export default new UserService();
