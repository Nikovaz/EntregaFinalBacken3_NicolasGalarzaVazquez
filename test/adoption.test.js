import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import UserModel from '../src/dao/models/user.model.js';
import PetModel from '../src/dao/models/pet.model.js';

const requester = supertest(app);

describe('Tests funcionales del router de Adopciones', function() {
    this.timeout(10000);

    let testUser;
    let testPet;
    let testUser2;
    let testPet2;

    before(async function() {
        try {
            await UserModel.deleteMany({});
            await PetModel.deleteMany({});

            testUser = await UserModel.create({
                first_name: 'Test',
                last_name: 'User',
                email: 'testuser@test.com',
                age: 25,
                password: 'hashedpassword123',
                role: 'user',
                pets: []
            });

            testUser2 = await UserModel.create({
                first_name: 'Test2',
                last_name: 'User2',
                email: 'testuser2@test.com',
                age: 30,
                password: 'hashedpassword456',
                role: 'user',
                pets: []
            });

            testPet = await PetModel.create({
                name: 'TestDog',
                specie: 'dog',
                birthDate: new Date('2020-01-01'),
                adopted: false,
                owner: null
            });

            testPet2 = await PetModel.create({
                name: 'TestCat',
                specie: 'cat',
                birthDate: new Date('2021-06-15'),
                adopted: false,
                owner: null
            });

            console.log('Datos de prueba creados correctamente');
        } catch (error) {
            console.error('Error en setup de tests:', error);
            throw error;
        }
    });

    after(async function() {
        try {
            await UserModel.deleteMany({});
            await PetModel.deleteMany({});
            await mongoose.connection.close();
            console.log('Limpieza completada');
        } catch (error) {
            console.error('Error en limpieza:', error);
        }
    });

    describe('GET /api/adoptions', function() {
        it('Debe retornar status 200 y un array de adopciones', async function() {
            const response = await requester.get('/api/adoptions');
            
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status', 'success');
            expect(response.body).to.have.property('data');
            expect(response.body.data).to.be.an('array');
            expect(response.body).to.have.property('count');
        });

        it('Debe retornar solo mascotas adoptadas', async function() {
            await requester.post(`/api/adoptions/${testUser._id}/${testPet._id}`);
            const response = await requester.get('/api/adoptions');
            
            expect(response.status).to.equal(200);
            expect(response.body.data).to.be.an('array');
            
            if (response.body.data.length > 0) {
                response.body.data.forEach(adoption => {
                    expect(adoption).to.have.property('adopted', true);
                    expect(adoption).to.have.property('owner');
                    expect(adoption.owner).to.not.be.null;
                });
            }
        });
    });

    describe('GET /api/adoptions/:aid', function() {
        it('Debe retornar status 200 y los datos de la adopción', async function() {
            const adoptionResponse = await requester.post(`/api/adoptions/${testUser2._id}/${testPet2._id}`);
            const adoptedPetId = adoptionResponse.body.data._id;

            const response = await requester.get(`/api/adoptions/${adoptedPetId}`);
            
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status', 'success');
            expect(response.body).to.have.property('data');
            expect(response.body.data).to.have.property('_id');
            expect(response.body.data).to.have.property('adopted', true);
            expect(response.body.data).to.have.property('owner');
        });

        it('Debe retornar status 404 si la adopción no existe', async function() {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await requester.get(`/api/adoptions/${fakeId}`);
            
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('status', 'error');
            expect(response.body).to.have.property('message');
        });
    });

    describe('POST /api/adoptions/:uid/:pid', function() {
        let newUser, newPet;

        beforeEach(async function() {
            newUser = await UserModel.create({
                first_name: 'NewTest',
                last_name: 'NewUser',
                email: `newuser${Date.now()}@test.com`,
                age: 28,
                password: 'hashedpassword789',
                role: 'user',
                pets: []
            });

            newPet = await PetModel.create({
                name: 'NewTestPet',
                specie: 'rabbit',
                birthDate: new Date('2022-03-15'),
                adopted: false,
                owner: null
            });
        });

        it('Debe crear una adopción exitosamente y retornar status 201', async function() {
            const response = await requester.post(`/api/adoptions/${newUser._id}/${newPet._id}`);
            
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('status', 'success');
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('data');
            expect(response.body.data).to.have.property('adopted', true);
            expect(response.body.data).to.have.property('owner');
        });

        it('Debe actualizar el array de pets del usuario', async function() {
            await requester.post(`/api/adoptions/${newUser._id}/${newPet._id}`);
            
            const updatedUser = await UserModel.findById(newUser._id);
            expect(updatedUser.pets).to.be.an('array');
            expect(updatedUser.pets).to.have.lengthOf(1);
            expect(updatedUser.pets[0].toString()).to.equal(newPet._id.toString());
        });

        it('Debe retornar status 404 si el usuario no existe', async function() {
            const fakeUserId = new mongoose.Types.ObjectId();
            const response = await requester.post(`/api/adoptions/${fakeUserId}/${newPet._id}`);
            
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('status', 'error');
            expect(response.body.message).to.include('Usuario no encontrado');
        });

        it('Debe retornar status 404 si la mascota no existe', async function() {
            const fakePetId = new mongoose.Types.ObjectId();
            const response = await requester.post(`/api/adoptions/${newUser._id}/${fakePetId}`);
            
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('status', 'error');
            expect(response.body.message).to.include('Mascota no encontrada');
        });

        it('Debe retornar status 400 si la mascota ya está adoptada', async function() {
            await requester.post(`/api/adoptions/${newUser._id}/${newPet._id}`);
            
            const anotherUser = await UserModel.create({
                first_name: 'Another',
                last_name: 'User',
                email: `another${Date.now()}@test.com`,
                age: 35,
                password: 'password',
                role: 'user',
                pets: []
            });

            const response = await requester.post(`/api/adoptions/${anotherUser._id}/${newPet._id}`);
            
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('status', 'error');
            expect(response.body.message).to.include('ya ha sido adoptada');
        });
    });

    describe('DELETE /api/adoptions/:aid', function() {
        let userForDelete, petForDelete;

        beforeEach(async function() {
            userForDelete = await UserModel.create({
                first_name: 'Delete',
                last_name: 'Test',
                email: `deletetest${Date.now()}@test.com`,
                age: 27,
                password: 'password',
                role: 'user',
                pets: []
            });

            petForDelete = await PetModel.create({
                name: 'PetToDelete',
                specie: 'bird',
                birthDate: new Date('2021-09-10'),
                adopted: false,
                owner: null
            });

            await requester.post(`/api/adoptions/${userForDelete._id}/${petForDelete._id}`);
        });

        it('Debe cancelar una adopción exitosamente y retornar status 200', async function() {
            const response = await requester.delete(`/api/adoptions/${petForDelete._id}`);
            
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status', 'success');
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('data');
            expect(response.body.data).to.have.property('adopted', false);
            expect(response.body.data.owner).to.be.null;
        });

        it('Debe remover la mascota del array de pets del usuario', async function() {
            await requester.delete(`/api/adoptions/${petForDelete._id}`);
            
            const updatedUser = await UserModel.findById(userForDelete._id);
            expect(updatedUser.pets).to.be.an('array');
            expect(updatedUser.pets).to.have.lengthOf(0);
        });

        it('Debe retornar status 404 si la mascota no existe', async function() {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await requester.delete(`/api/adoptions/${fakeId}`);
            
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('status', 'error');
            expect(response.body.message).to.include('Mascota no encontrada');
        });

        it('Debe retornar status 400 si la mascota no está adoptada', async function() {
            const notAdoptedPet = await PetModel.create({
                name: 'NotAdopted',
                specie: 'fish',
                birthDate: new Date('2023-01-01'),
                adopted: false,
                owner: null
            });

            const response = await requester.delete(`/api/adoptions/${notAdoptedPet._id}`);
            
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('status', 'error');
            expect(response.body.message).to.include('no está adoptada');
        });
    });
});
