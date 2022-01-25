/**
 * Flask Finances API Integration Tests
 *
 * @group @flask_finances_api
 * @group @accounts
*/

import request from 'supertest';

const baseUrl = 'http://localhost:5000/api'
const endpointPath = '/v1/accounts/{accountId}/balance'

describe('Accounts', () => {
    describe('GET /v1/accounts/{accountId}/balance', () => {
        it('@smoke - deve retornar o saldo da conta com sucesso', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'valid');

            const response = await request(baseUrl).get(endpointPath.replace('{accountId}', accountData.id)).set({
                Authorization: `Bearer ${token}`
            });

            expect(response.statusCode).toBe(200);
            expect(response.body.balance).toMatch(/^R\$ [0-9]*,[0-9][0-9]$/);
        })

        it('deve retornar um erro quando buscar o saldo de uma conta inexistente', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'invalid');

            const response = await request(baseUrl).get(endpointPath.replace('{accountId}', accountData.id)).set({
                Authorization: `Bearer ${token}`
            });

            const expectedError = apiDataLoad('default_errors', 'inexistent_account');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar buscar o saldo de uma conta sem passar o bearer token', async () => {
            const accountData = apiDataLoad('accounts', 'valid');
            const response = await request(baseUrl).get(endpointPath.replace('{accountId}', accountData.id));

            const expectedError = apiDataLoad('default_errors', 'missing_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar buscar o saldo de uma conta passando um bearer token expirado', async () => {
            const accountData = apiDataLoad('accounts', 'valid');
            const token = apiDataLoad('tokens', 'expired').value;

            const response = await request(baseUrl).get(endpointPath.replace('{accountId}', accountData.id)).set({
                Authorization: `Bearer ${token}`
            });

            const expectedError = apiDataLoad('default_errors', 'expired_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar buscar o saldo de uma conta passando um bearer token inválido', async () => {
            const accountData = apiDataLoad('accounts', 'valid');
            const token = apiDataLoad('tokens', 'invalid_value').value;

            const response = await request(baseUrl).get(endpointPath.replace('{accountId}', accountData.id)).set({
                Authorization: `Bearer ${token}`
            });

            const expectedError = apiDataLoad('default_errors', 'invalid_token_format')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar buscar o saldo de uma conta passando um bearer token de formato incorreto', async () => {
            const accountData = apiDataLoad('accounts', 'valid');
            const token = apiDataLoad('tokens', 'invalid_type').value;

            const response = await request(baseUrl).get(endpointPath.replace('{accountId}', accountData.id)).set({
                Authorization: token
            });

            const expectedError = apiDataLoad('default_errors', 'invalid_token_type')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })
    })
})