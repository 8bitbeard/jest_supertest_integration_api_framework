/**
 * Flask Finances API Integration Tests
 *
 * @group @flask_finances_api
 * @group @accounts
*/

import request from 'supertest';

const baseUrl = 'http://localhost:5000/api'
const endpointPath = '/v1/accounts/'

describe('Accounts', () => {
    describe('POST /v1/accounts/', () => {
        it('@smoke - deve cadastrar uma nova conta com sucesso', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = {
                name: `QA_TMP_${generateRandomNumber(100000000, 999999999)}`,
                balance: generateRandomFloat(1.0, 10.0)
            }

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: `Bearer ${token}`
            }).send(accountData);

            expect(response.statusCode).toBe(201);
            expect(response.body.id).toBeString();
            expect(response.body.name).toBe(accountData.name);
            expect(response.body.income).toBe(convertToReal(0));
            expect(response.body.expense).toBe(convertToReal(0));
            expect(response.body.balance).toBe(convertToReal(accountData.balance));
        })

        it('deve retornar um erro ao tentar cadastrar uma conta com um nome inválido', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = {
                name: apiDataLoad('accounts', 'invalid').name,
                balance: generateRandomFloat(1.0, 10.0)
            }

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: `Bearer ${token}`
            }).send(accountData);

            const expectedError = apiDataLoad('default_errors', 'invalid_account_name');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar cadastrar uma conta com um saldo inválido', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = {
                name: `QA_TMP_${generateRandomNumber(100000000, 999999999)}`,
                balance: apiDataLoad('accounts', 'invalid').balance
            }

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: `Bearer ${token}`
            }).send(accountData);

            const expectedError = apiDataLoad('default_errors', 'invalid_account_balance');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar cadastrar uma conta sem passar o bearer token', async () => {
            const userData = apiDataLoad('users', 'valid');
            const accountData = {
                name: `QA_TMP_${generateRandomNumber(100000000, 999999999)}`,
                balance: generateRandomFloat(1.0, 10.0)
            }

            const response = await request(baseUrl).post(endpointPath).send(accountData);

            const expectedError = apiDataLoad('default_errors', 'missing_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar cadastrar uma conta passando um bearer token expirado', async () => {
            const token = apiDataLoad('tokens', 'expired').value;
            const accountData = {
                name: `QA_TMP_${generateRandomNumber(100000000, 999999999)}`,
                balance: generateRandomFloat(1.0, 10.0)
            }

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: `Bearer ${token}`
            }).send(accountData);

            const expectedError = apiDataLoad('default_errors', 'expired_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar cadastrar uma conta passando um bearer token inválido', async () => {
            const token = apiDataLoad('tokens', 'invalid_value').value;
            const accountData = {
                name: `QA_TMP_${generateRandomNumber(100000000, 999999999)}`,
                balance: generateRandomFloat(1.0, 10.0)
            }

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: `Bearer ${token}`
            }).send(accountData);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_format')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar cadastrar uma conta passando um bearer token de formato incorreto', async () => {
            const token = apiDataLoad('tokens', 'invalid_type').value;
            const accountData = {
                name: `QA_TMP_${generateRandomNumber(100000000, 999999999)}`,
                balance: generateRandomFloat(1.0, 10.0)
            }

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: token
            }).send(accountData);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_type')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })
    })

    describe('GET /v1/accounts/', () => {
        it('@smoke - deve retornar uma lista contendo as contas do usuário logado', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);

            const response = await request(baseUrl).get(endpointPath).set({
                Authorization: `Bearer ${token}`
            })

            expect(response.statusCode).toBe(200);
            expect(response.body).toBeArray();
            response.body.forEach((obj) => {
                expect(obj.id).toBeString();
                expect(obj.name).toBeString();
                expect(obj.income).toMatch(/^R\$ [0-9]*,[0-9][0-9]$/);
                expect(obj.expense).toMatch(/^R\$ [0-9]*,[0-9][0-9]$/);
                expect(obj.balance).toMatch(/^R\$ [0-9]*,[0-9][0-9]$/);
            })
        })

        it('deve retornar um erro ao tentar cadastrar uma conta sem passar o bearer token', async () => {
            const response = await request(baseUrl).post(endpointPath);

            const expectedError = apiDataLoad('default_errors', 'missing_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar cadastrar uma conta passando um bearer token expirado', async () => {
            const token = apiDataLoad('tokens', 'expired').value;

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: `Bearer ${token}`
            });

            const expectedError = apiDataLoad('default_errors', 'expired_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar cadastrar uma conta passando um bearer token inválido', async () => {
            const token = apiDataLoad('tokens', 'invalid_value').value;

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: `Bearer ${token}`
            });

            const expectedError = apiDataLoad('default_errors', 'invalid_token_format')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar cadastrar uma conta passando um bearer token de formato incorreto', async () => {
            const token = apiDataLoad('tokens', 'invalid_type').value;

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: token
            });

            const expectedError = apiDataLoad('default_errors', 'invalid_token_type')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })
    })
})