/**
 * Flask Finances API Integration Tests
 *
 * @group @flask_finances_api
 * @group @categories
*/

import request from 'supertest';

const baseUrl = 'http://localhost:5000/api'
const endpointPath = '/v1/categories/'

describe('Categories', () => {
    describe('POST /v1/categories/', () => {
        it('@smoke - deve cadastrar uma categoria de entrada com sucesso', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const categoryData = {
                name: `QA_TMP_CAT_${generateRandomNumber(100000, 999999)}`,
                type: apiDataLoad('categories', 'income').value
            };

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: `Bearer ${token}`
            }).send(categoryData);

            expect(response.statusCode).toBe(201);
            expect(response.body.id).toBeString();
            expect(response.body.name).toBe(categoryData.name);
            expect(response.body.type).toBe(apiDataLoad('categories', 'valid income').type);
        })

        it('deve cadastrar uma categoria de saída com sucesso', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const categoryData = {
                name: `QA_TMP_CAT_${generateRandomNumber(100000, 999999)}`,
                type: apiDataLoad('categories', 'expense').value
            };

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: `Bearer ${token}`
            }).send(categoryData);

            expect(response.statusCode).toBe(201);
            expect(response.body.id).toBeString();
            expect(response.body.name).toBe(categoryData.name);
            expect(response.body.type).toBe(apiDataLoad('categories', 'valid expense').type);
        })

        it('deve retornar um erro ao tentar cadastrar uma categoria inválida', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const categoryData = {
                name: `QA_TMP_CAT_${generateRandomNumber(100000, 999999)}`,
                type: apiDataLoad('categories', 'invalid').value
            };

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: `Bearer ${token}`
            }).send(categoryData);

            const expectedError = apiDataLoad('default_errors', 'invalid_category_type');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar cadastrar uma categoria de entrada com um nome já existente', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const categoryData = apiDataLoad('categories', 'valid income')

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: `Bearer ${token}`
            }).send({
                name: categoryData.name,
                type: categoryData.value
            });

            const expectedError = apiDataLoad('default_errors', 'category_already_exists');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar cadastrar uma categoria de saída com um nome já existente', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const categoryData = apiDataLoad('categories', 'valid expense')

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: `Bearer ${token}`
            }).send({
                name: categoryData.name,
                type: categoryData.value
            });

            const expectedError = apiDataLoad('default_errors', 'category_already_exists');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar cadastrar uma categoria sem passar o bearer token', async () => {
            const categoryData = {
                name: `QA_TMP_CAT_${generateRandomNumber(100000, 999999)}`,
                type: apiDataLoad('categories', 'income').value
            };

            const response = await request(baseUrl).post(endpointPath).send(categoryData);

            const expectedError = apiDataLoad('default_errors', 'missing_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar cadastrar uma categoria passando um bearer token expirado', async () => {
            const token = apiDataLoad('tokens', 'expired').value;
            const categoryData = {
                name: `QA_TMP_CAT_${generateRandomNumber(100000, 999999)}`,
                type: apiDataLoad('categories', 'income').value
            };

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: `Bearer ${token}`
            }).send(categoryData);

            const expectedError = apiDataLoad('default_errors', 'expired_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar cadastrar uma categoria passando um bearer token inválido', async () => {
            const token = apiDataLoad('tokens', 'invalid_value').value;
            const categoryData = {
                name: `QA_TMP_CAT_${generateRandomNumber(100000, 999999)}`,
                type: apiDataLoad('categories', 'income').value
            };

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: `Bearer ${token}`
            }).send(categoryData);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_format')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar cadastrar uma categoria passando um bearer token de formato incorreto', async () => {
            const token = apiDataLoad('tokens', 'invalid_type').value;
            const categoryData = {
                name: `QA_TMP_CAT_${generateRandomNumber(100000, 999999)}`,
                type: apiDataLoad('categories', 'income').value
            };

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: token
            }).send(categoryData);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_type')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })
    })

    describe('GET /v1/categories/', () => {
        it('@smoke - deve retornar uma lista contendo todas as caregorias cadastradas pelo usuário logado', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);

            const response = await request(baseUrl).get(endpointPath).set({
                Authorization: `Bearer ${token}`
            });

            expect(response.statusCode).toBe(200);
            expect(response.body).toBeArray();
            response.body.forEach((obj) => {
                expect(obj.id).toBeString();
                expect(obj.name).toBeString();
                expect([
                    apiDataLoad('categories', 'valid income').type,
                    apiDataLoad('categories', 'valid expense').type
                ]).toContain(obj.type);
            })
        })

        it('deve retornar um erro ao tentar listar as categorias sem passar o bearer token', async () => {
            const response = await request(baseUrl).post(endpointPath);

            const expectedError = apiDataLoad('default_errors', 'missing_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar listar as categorias passando um bearer token expirado', async () => {
            const token = apiDataLoad('tokens', 'expired').value;

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: `Bearer ${token}`
            });

            const expectedError = apiDataLoad('default_errors', 'expired_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar listar as categorias passando um bearer token inválido', async () => {
            const token = apiDataLoad('tokens', 'invalid_value').value;

            const response = await request(baseUrl).post(endpointPath).set({
                Authorization: `Bearer ${token}`
            });

            const expectedError = apiDataLoad('default_errors', 'invalid_token_format')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar listar as categorias passando um bearer token de formato incorreto', async () => {
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