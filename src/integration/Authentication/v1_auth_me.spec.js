/**
 * Flask Finances API Integration Tests
 *
 * @group @flask_finances_api
 * @group @authentication
*/

import request from 'supertest';

const baseUrl = 'http://localhost:5000/api'
const endpointPath = '/v1/auth/me'

describe('Authentication', () => {
    describe('GET /v1/auth/me', () => {
        it('@smoke - deve retornar com sucesso os dados do usuário logado', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);

            const response = await request(baseUrl).get(endpointPath).set({
                Authorization: `Bearer ${token}`
            });

            expect(response.statusCode).toBe(200);
            expect(response.body.id).toBeString();
            expect(response.body.name).toBe(userData.name);
            expect(response.body.email).toBe(userData.email);
        })

        it('deve retornar um erro quando não informar o bearer token', async () => {
            const response = await request(baseUrl).get(endpointPath);

            const expectedError = apiDataLoad('default_errors', 'missing_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro quando informar um bearer token expirado', async () => {
            const token = apiDataLoad('tokens', 'expired').value

            const response = await request(baseUrl).get(endpointPath).set({
                Authorization: `Bearer ${token}`
            });

            const expectedError = apiDataLoad('default_errors', 'expired_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro quando informar um bearer token inválido', async () => {
            const token = apiDataLoad('tokens', 'invalid_value').value

            const response = await request(baseUrl).get(endpointPath).set({
                Authorization: `Bearer ${token}`
            });

            const expectedError = apiDataLoad('default_errors', 'invalid_token_format')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro quando informar um bearer token com formato incorreto', async () => {
            const token = apiDataLoad('tokens', 'invalid_type').value

            const response = await request(baseUrl).get(endpointPath).set({
                Authorization: token
            });

            const expectedError = apiDataLoad('default_errors', 'invalid_token_type')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })
    })
})