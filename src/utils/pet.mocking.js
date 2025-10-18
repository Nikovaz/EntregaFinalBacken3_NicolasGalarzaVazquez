import { faker } from '@faker-js/faker';

/**
 * Genera una mascota mock
 * @returns {Object} Mascota mock generada
 */
const generateMockPet = () => {
    const species = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'turtle', 'snake'];
    
    return {
        name: faker.person.firstName(),
        specie: faker.helpers.arrayElement(species),
        birthDate: faker.date.past({ years: 10 }),
        adopted: faker.datatype.boolean(),
        owner: null, // Inicialmente sin dueño
        image: faker.image.urlLoremFlickr({ category: 'animals' })
    };
};

/**
 * Genera múltiples mascotas mock
 * @param {number} count - Número de mascotas a generar
 * @returns {Array} Array de mascotas mock
 */
export const generateMockPets = (count = 100) => {
    const pets = [];
    for (let i = 0; i < count; i++) {
        pets.push(generateMockPet());
    }
    return pets;
};

/**
 * Genera una mascota mock con ID para simular respuesta de MongoDB
 * @returns {Object} Mascota mock con _id
 */
const generateMockPetWithId = () => {
    const pet = generateMockPet();
    return {
        _id: faker.database.mongodbObjectId(),
        ...pet,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
    };
};

/**
 * Genera múltiples mascotas mock con ID
 * @param {number} count - Número de mascotas a generar
 * @returns {Array} Array de mascotas mock con _id
 */
export const generateMockPetsWithId = (count = 100) => {
    const pets = [];
    for (let i = 0; i < count; i++) {
        pets.push(generateMockPetWithId());
    }
    return pets;
};

export default { generateMockPets, generateMockPetsWithId };
