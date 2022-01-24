/**
 * Flask Finances API Integration Tests
 *
 * @group @flask_finances_api
 * @group @#wilton_souza
 * @group @users
*/

import request from 'supertest';

const baseUrl = 'http://localhost:5000/api'
const endpointPath = '/v1/users/'

describe('Users', () => {
    describe('POST /v1/users/', () => {
        it('@smoke - deve retornar com sucesso os dados do usuário logado', async () => {
            const randomNumber = generateRandomNumber(10000);
            const userData = {
                name: `QATMP${randomNumber}`,
                email: `qa_tmp_${randomNumber}@example.com`,
                password: '123456'
            }

            const response = await request(baseUrl).post(endpointPath).send(userData);

            expect(response.statusCode).toBe(201);
            expect(response.body.id).toBeString();
            expect(response.body.name).toBe(userData.name);
            expect(response.body.email).toBe(userData.email);
        })

        it('deve retornar um erro ao tentar criar um usuário sem informar o nome', async () => {
            const randomNumber = generateRandomNumber(10000);
            const userData = {
                email: `qa_tmp_${randomNumber}@example.com`,
                password: '123456'
            }

            const response = await request(baseUrl).post(endpointPath).send(userData);

            const expectedError = apiDataLoad('default_errors', 'missing_user_parameters');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar criar um usuário sem informar o email', async () => {
            const randomNumber = Math.floor(Math.random()*10000);
            const userData = {
                name: `QATMP${randomNumber}`,
                password: '123456'
            }

            const response = await request(baseUrl).post(endpointPath).send(userData);

            const expectedError = apiDataLoad('default_errors', 'missing_user_parameters');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar criar um usuário sem informar a senha', async () => {
            const randomNumber = Math.floor(Math.random()*10000);
            const userData = {
                name: `QATMP${randomNumber}`,
                email: `qa_tmp_${randomNumber}@example.com`
            }

            const response = await request(baseUrl).post(endpointPath).send(userData);

            const expectedError = apiDataLoad('default_errors', 'missing_user_parameters');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar criar um usuário com um nome inválido', async () => {
            const randomNumber = Math.floor(Math.random()*10000);
            const userData = {
                name: `QATMP ${randomNumber}`,
                email: `qa_tmp_${randomNumber}@example.com`,
                password: '123456'
            }

            const response = await request(baseUrl).post(endpointPath).send(userData);

            const expectedError = apiDataLoad('default_errors', 'invalid_user_name');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar criar um usuário com um email inválido', async () => {
            const randomNumber = Math.floor(Math.random()*10000);
            const userData = {
                name: `QATMP${randomNumber}`,
                email: `qa_tmp_${randomNumber}example.com`,
                password: '123456'
            }

            const response = await request(baseUrl).post(endpointPath).send(userData);

            const expectedError = apiDataLoad('default_errors', 'invalid_user_email');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar criar um usuário com um email já existente', async () => {
            const randomNumber = Math.floor(Math.random()*10000);
            const userData = {
                name: `QATMP${randomNumber}`,
                email: apiDataLoad('users', 'valid').email,
                password: '123456'
            }

            const response = await request(baseUrl).post(endpointPath).send(userData);

            const expectedError = apiDataLoad('default_errors', 'email_already_exists');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar criar um usuário com um uma senha inválida', async () => {
            const randomNumber = Math.floor(Math.random()*10000);
            const userData = {
                name: `QATMP${randomNumber}`,
                email: `qa_tmp_${randomNumber}@example.com`,
                password: '12345'
            }

            const response = await request(baseUrl).post(endpointPath).send(userData);

            const expectedError = apiDataLoad('default_errors', 'invalid_user_password');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })
    })

    describe('GET /v1/users/', () => {
        it('@smoke - deve retornar uma lista contendo todos os usuários cadastrados', async () => {
            const response = await request(baseUrl).get(endpointPath);

            expect(response.statusCode).toBe(200);
            expect(response.body).toBeArray();
            response.body.forEach((obj) => {
                expect(obj.id).toBeString();
                expect(obj.name).toBeString();
                expect(obj.email).toBeString();
            });
        })
    })
})