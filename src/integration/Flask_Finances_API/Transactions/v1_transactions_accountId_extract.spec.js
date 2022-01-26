/**
 * Flask Finances API Integration Tests
 *
 * @group @flask_finances_api
 * @group @transactions
*/

import request from 'supertest';

const baseUrl = 'http://localhost:5000/api'
const endpointPath = '/v1/transactions/{accountId}/extract'

describe('Transactions', () => {
    describe('POST /v1/transactions/{accountId}/extract', () => {
        it('@smoke - deve criar uma transação de depósito com sucesso', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'valid');

            const response = await request(baseUrl).get(endpointPath.replace('{accountId}', accountData.id)).set({
                Authorization: token
            });

            expect(response.statusCode).toBe(200);
            expect(response.body).toBeArray();
            response.body.forEach((obj) => {
                expect(obj.id).toBeString();
                expect(obj.value).toMatch(/^R\$ [0-9]*,[0-9][0-9]$/);
                expect(obj.created_at).toBeString();
                expect(obj.category.id).toBeString();
                expect(obj.category.name).toBeString();
                expect([
                    apiDataLoad('categories', 'valid income').type,
                    apiDataLoad('categories', 'valid expense').type
                ]).toContain(obj.category.type);
            })
        })

        it('deve retornar um erro ao buscar o extrato de uma conta inexistente', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'invalid_name');

            const response = await request(baseUrl).get(endpointPath.replace('{accountId}', accountData.id)).set({
                Authorization: token
            });

            const expectedError = apiDataLoad('default_errors', 'account_not_found');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao buscar o extrato de uma conta sem passar o bearer token', async () => {
            const accountData = apiDataLoad('accounts', 'valid');

            const response = await request(baseUrl).get(endpointPath.replace('{accountId}', accountData.id));

            const expectedError = apiDataLoad('default_errors', 'missing_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao buscar o extrato de uma conta passando um bearer token expirado', async () => {
            const token = apiDataLoad('tokens', 'expired').value;
            const accountData = apiDataLoad('accounts', 'valid');

            const response = await request(baseUrl).get(endpointPath.replace('{accountId}', accountData.id)).set({
                Authorization: token
            }).send(accountData);

            const expectedError = apiDataLoad('default_errors', 'expired_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao buscar o extrato de uma conta passando um bearer token inválido', async () => {
            const token = apiDataLoad('tokens', 'invalid_value').value;
            const accountData = apiDataLoad('accounts', 'valid');

            const response = await request(baseUrl).get(endpointPath.replace('{accountId}', accountData.id)).set({
                Authorization: token
            }).send(accountData);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_format')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao buscar o extrato de uma conta passando um bearer token de formato incorreto', async () => {
            const token = apiDataLoad('tokens', 'invalid_type').value;
            const accountData = apiDataLoad('accounts', 'valid');

            const response = await request(baseUrl).get(endpointPath.replace('{accountId}', accountData.id)).set({
                Authorization: token
            }).send(accountData);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_type')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })
    })
})