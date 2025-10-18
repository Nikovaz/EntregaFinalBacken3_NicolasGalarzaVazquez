import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

/**
 * Genera un usuario mock con las características especificadas
 * @returns {Object} Usuario mock generado
 */
const generateMockUser = () => {
    // Generar salt y encriptar la contraseña "coder123"
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('coder123', salt);

    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 80 }),
        password: hashedPassword, // Contraseña encriptada
        role: faker.helpers.arrayElement(['user', 'admin']), // Role aleatorio
        pets: [] // Array vacío como se especifica
    };
};

/**
 * Genera múltiples usuarios mock
 * @param {number} count - Número de usuarios a generar
 * @returns {Array} Array de usuarios mock
 */
export const generateMockUsers = (count = 50) => {
    const users = [];
    for (let i = 0; i < count; i++) {
        users.push(generateMockUser());
    }
    return users;
};

/**
 * Genera un usuario mock con ID para simular respuesta de MongoDB
 * @returns {Object} Usuario mock con _id
 */
const generateMockUserWithId = () => {
    const user = generateMockUser();
    return {
        _id: faker.database.mongodbObjectId(),
        ...user,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
    };
};

/**
 * Genera múltiples usuarios mock con ID
 * @param {number} count - Número de usuarios a generar
 * @returns {Array} Array de usuarios mock con _id
 */
export const generateMockUsersWithId = (count = 50) => {
    const users = [];
    for (let i = 0; i < count; i++) {
        users.push(generateMockUserWithId());
    }
    return users;
};

export default { generateMockUsers, generateMockUsersWithId };
