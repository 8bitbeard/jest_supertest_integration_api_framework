/**
 * Flask Finances API Integration Tests
 *
 * @group @flask_finances_api
 * @group @authentication
*/

import request from 'supertest';

const baseUrl = 'http://localhost:5000/api'
const endpointPath = '/v1/auth/login'

describe('Authentication', () => {
    describe('POST /v1/auth/login', () => {
        it('@smoke - deve realizar o login de um usuário válido com sucesso', async () => {
            var userData = apiDataLoad('users', 'valid');

            const response = await request(baseUrl).post(endpointPath).send({
                email: userData.email,
                password: userData.password
            });

            expect(response.statusCode).toBe(201);
            expect(response.body.name).toBe(userData.name);
            expect(response.body.email).toBe(userData.email);
            expect(response.body.access).toBeString();
            expect(response.body.refresh).toBeString();
        })

        it('deve retornar um erro quando tentar logar com um usuário inexistente', async () => {
            const userData = apiDataLoad('users', 'invalid');

            const response = await request(baseUrl).post(endpointPath).send({
                email: userData.email,
                password: userData.password
            });

            const expectedError = apiDataLoad('default_errors', 'wrong_credentials');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro quando tentar logar informando uma senha incorreta', async () => {
            const userData = apiDataLoad('users', 'incorrect_password');

            const response = await request(baseUrl).post(endpointPath).send({
                email: userData.email,
                password: userData.password
            });

            const expectedError = apiDataLoad('default_errors', 'wrong_credentials');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro quando realizar uma requisição sem informar o e-mail', async () => {
            const userData = apiDataLoad('users', 'valid');

            const response = await request(baseUrl).post(endpointPath).send({
                password: userData.password
            });

            const expectedError = apiDataLoad('default_errors', 'missing_parameters');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro quando realizar uma requisição sem informar a senha', async () => {
            const userData = apiDataLoad('users', 'valid');

            const response = await request(baseUrl).post(endpointPath).send({
                email: userData.email
            });

            const expectedError = apiDataLoad('default_errors', 'missing_parameters');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })
    })
})