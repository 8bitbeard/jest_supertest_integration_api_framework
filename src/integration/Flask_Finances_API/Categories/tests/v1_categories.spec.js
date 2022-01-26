/**
 * Flask Finances API Integration Tests
 *
 * @group @flask_finances_api
 * @group @categories
*/

// import request from 'supertest';

// const baseUrl = 'http://localhost:5000/api'
// const endpointPath = '/v1/categories/'

import { categorySchema, categoryListSchema, errorSchema, errorTokenSchema } from '../contracts/CategoryContract';
import CategoryFactory from '../factories/CategoryFactory';
import CategoryRequest from '../requests/v1_categories.request'

describe('Categories', () => {
    describe('POST /v1/categories/', () => {
        it('@contract - deve validar o contrato de retorno de sucesso do serviço de criação de categorias', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const categoryData = CategoryFactory.newIncomeCategoryData();

            const response = await CategoryRequest.createCategory(categoryData, token);
            const { error } = categorySchema.validate(response.body, { abortEarly: false });
            expect(error).toBeUndefined();
        })

        it('@contract - deve validar o contrato de retorno de erro do serviço de criação de categorias', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const categoryData = apiDataLoad('categories', 'invalid');

            const response = await CategoryRequest.createCategory(categoryData, token);
            const { error } = errorSchema.validate(response.body, { abortEarly: false });
            expect(error).toBeUndefined();
        })

        it('@contract - deve validar o contrato de retorno de erro de token do serviço de criação de categorias', async () => {
            const categoryData = apiDataLoad('categories', 'valid income');
            const response = await CategoryRequest.createCategory(categoryData);

            const { error } = errorTokenSchema.validate(response.body, { abortEarly: false });
            expect(error).toBeUndefined();
        })

        it('@smoke - deve cadastrar uma categoria de entrada com sucesso', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const categoryData = CategoryFactory.newIncomeCategoryData();

            const response = await CategoryRequest.createCategory(categoryData, token);

            expect(response.statusCode).toBe(201);
            expect(response.body.name).toBe(categoryData.name);
            expect(response.body.type).toBe(apiDataLoad('categories', 'valid income').enum);
        })

        it('@smoke - deve cadastrar uma categoria de saída com sucesso', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const categoryData = CategoryFactory.newExpenseCategoryData();

            const response = await CategoryRequest.createCategory(categoryData, token);

            expect(response.statusCode).toBe(201);
            expect(response.body.name).toBe(categoryData.name);
            expect(response.body.type).toBe(apiDataLoad('categories', 'valid expense').enum);
        })

        it('deve retornar um erro ao tentar cadastrar uma categoria inválida', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const categoryData = apiDataLoad('categories', 'invalid');

            const response = await CategoryRequest.createCategory(categoryData, token);

            const expectedError = apiDataLoad('default_errors', 'invalid_category_type');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar cadastrar uma categoria de entrada com um nome já existente', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const categoryData = apiDataLoad('categories', 'valid income');

            const response = await CategoryRequest.createCategory(categoryData, token);

            const expectedError = apiDataLoad('default_errors', 'category_already_exists');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar cadastrar uma categoria de saída com um nome já existente', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const categoryData = apiDataLoad('categories', 'valid expense');

            const response = await CategoryRequest.createCategory(categoryData, token);

            const expectedError = apiDataLoad('default_errors', 'category_already_exists');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar cadastrar uma categoria sem passar o bearer token', async () => {
            const categoryData = apiDataLoad('categories', 'valid expense');

            const response = await CategoryRequest.createCategory(categoryData);

            const expectedError = apiDataLoad('default_errors', 'missing_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar cadastrar uma categoria passando um bearer token expirado', async () => {
            const token = apiDataLoad('tokens', 'expired').value;
            const categoryData = apiDataLoad('categories', 'valid expense');

            const response = await CategoryRequest.createCategory(categoryData, token);

            const expectedError = apiDataLoad('default_errors', 'expired_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar cadastrar uma categoria passando um bearer token inválido', async () => {
            const token = apiDataLoad('tokens', 'invalid_value').value;
            const categoryData = apiDataLoad('categories', 'valid expense');

            const response = await CategoryRequest.createCategory(categoryData, token);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_format')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar cadastrar uma categoria passando um bearer token de formato incorreto', async () => {
            const token = apiDataLoad('tokens', 'invalid_type').value;
            const categoryData = apiDataLoad('categories', 'valid expense');

            const response = await CategoryRequest.createCategory(categoryData, token);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_type')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })
    })

    describe('GET /v1/categories/', () => {
        it('@contract - deve validar o contrato de retorno de sucesso do serviço de listagem de categorias', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);

            const response = await CategoryRequest.listUserCategories(token);
            const { error } = categoryListSchema.validate(response.body, { abortEarly: false });
            expect(error).toBeUndefined();
        })

        it('@contract - deve validar o contrato de retorno de erro do serviço de listagem de categorias', async () => {
            const response = await CategoryRequest.listUserCategories();
            const { error } = errorTokenSchema.validate(response.body, { abortEarly: false });
            expect(error).toBeUndefined();
        })

        it('@smoke - deve retornar uma lista contendo todas as caregorias cadastradas pelo usuário logado', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);

            const response = await CategoryRequest.listUserCategories(token);

            expect(response.statusCode).toBe(200);
            expect(response.body).not.toBeEmpty();
        })

        it('deve retornar um erro ao tentar listar as categorias sem passar o bearer token', async () => {
            const response = await CategoryRequest.listUserCategories();

            const expectedError = apiDataLoad('default_errors', 'missing_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar listar as categorias passando um bearer token expirado', async () => {
            const token = apiDataLoad('tokens', 'expired').value;

            const response = await CategoryRequest.listUserCategories(token);

            const expectedError = apiDataLoad('default_errors', 'expired_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar listar as categorias passando um bearer token inválido', async () => {
            const token = apiDataLoad('tokens', 'invalid_value').value;

            const response = await CategoryRequest.listUserCategories(token);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_format')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar listar as categorias passando um bearer token de formato incorreto', async () => {
            const token = apiDataLoad('tokens', 'invalid_type').value;

            const response = await CategoryRequest.listUserCategories(token);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_type')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })
    })
})