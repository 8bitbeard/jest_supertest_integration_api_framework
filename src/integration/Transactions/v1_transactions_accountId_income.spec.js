import request from 'supertest';

const baseUrl = 'http://localhost:5000/api'
const endpointPath = '/v1/transactions/{accountId}/income'

describe('Transactions', () => {
    describe('POST /v1/transactions/{accountId}/income', () => {
        it('deve criar uma transação de depósito com sucesso', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'valid');
            const categoryData = apiDataLoad('categories', 'income')
            const transactionData = {
                value: generateRandomFloat(1.0, 2.0),
                category: categoryData.name
            };

            const response = await request(baseUrl).post(endpointPath.replace('{accountId}', accountData.id)).set({
                Authorization: `Bearer ${token}`
            }).send(transactionData);

            expect(response.statusCode).toBe(201);
            expect(response.body.id).toBeString();
            expect(response.body.value).toBe(convertToReal(transactionData.value));
            expect(response.body.created_at).toBeString();
            expect(response.body.category.id).toBeString();
            expect(response.body.category.name).toBe(categoryData.name);
            expect(response.body.category.type).toBe(apiDataLoad('categories', 'valid income').type);
        })

        it('deve retornar um erro ao tentar criar uma transação com uma categoria de saída', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'valid');
            const categoryData = apiDataLoad('categories', 'expense')
            const transactionData = {
                value: generateRandomFloat(1.0, 2.0),
                category: categoryData.name
            };

            const response = await request(baseUrl).post(endpointPath.replace('{accountId}', accountData.id)).set({
                Authorization: `Bearer ${token}`
            }).send(transactionData);

            const expectedError = apiDataLoad('default_errors', 'incorrect_income_category');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar criar uma transação para uma conta inexistente', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'invalid');
            const categoryData = apiDataLoad('categories', 'income')
            const transactionData = {
                value: generateRandomFloat(1.0, 2.0),
                category: categoryData.name
            };

            const response = await request(baseUrl).post(endpointPath.replace('{accountId}', accountData.id)).set({
                Authorization: `Bearer ${token}`
            }).send(transactionData);

            const expectedError = apiDataLoad('default_errors', 'account_not_found');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar criar uma transação com uma categoria inexistente', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'valid');
            const categoryData = apiDataLoad('categories', 'inexistent')
            const transactionData = {
                value: generateRandomFloat(1.0, 2.0),
                category: categoryData.name
            };

            const response = await request(baseUrl).post(endpointPath.replace('{accountId}', accountData.id)).set({
                Authorization: `Bearer ${token}`
            }).send(transactionData);

            const expectedError = apiDataLoad('default_errors', 'category_not_found');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar criar uma transação com um valor negativo', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'valid');
            const categoryData = apiDataLoad('categories', 'expense')
            const transactionData = {
                value: -generateRandomFloat(1.0, 2.0),
                category: categoryData.name
            };

            const response = await request(baseUrl).post(endpointPath.replace('{accountId}', accountData.id)).set({
                Authorization: `Bearer ${token}`
            }).send(transactionData);

            const expectedError = apiDataLoad('default_errors', 'invalid_transaction_value');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar criar uma transação sem passar o bearer token', async () => {
            const accountData = apiDataLoad('accounts', 'valid');
            const categoryData = apiDataLoad('categories', 'income')
            const transactionData = {
                value: generateRandomFloat(1.0, 2.0),
                category: categoryData.name
            };

            const response = await request(baseUrl).post(endpointPath.replace('{accountId}', accountData.id)).send(transactionData);

            const expectedError = apiDataLoad('default_errors', 'missing_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar criar uma transação passando um bearer token expirado', async () => {
            const token = apiDataLoad('tokens', 'expired').value;
            const accountData = apiDataLoad('accounts', 'valid');
            const categoryData = apiDataLoad('categories', 'income')
            const transactionData = {
                value: generateRandomFloat(1.0, 2.0),
                category: categoryData.name
            };

            const response = await request(baseUrl).post(endpointPath.replace('{accountId}', accountData.id)).set({
                Authorization: `Bearer ${token}`
            }).send(transactionData);

            const expectedError = apiDataLoad('default_errors', 'expired_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar criar uma transação passando um bearer token inválido', async () => {
            const token = apiDataLoad('tokens', 'invalid_value').value;
            const accountData = apiDataLoad('accounts', 'valid');
            const categoryData = apiDataLoad('categories', 'income')
            const transactionData = {
                value: generateRandomFloat(1.0, 2.0),
                category: categoryData.name
            };

            const response = await request(baseUrl).post(endpointPath.replace('{accountId}', accountData.id)).set({
                Authorization: `Bearer ${token}`
            }).send(transactionData);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_format')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar criar uma transação passando um bearer token de formato incorreto', async () => {
            const token = apiDataLoad('tokens', 'invalid_type').value;
            const accountData = apiDataLoad('accounts', 'valid');
            const categoryData = apiDataLoad('categories', 'income')
            const transactionData = {
                value: generateRandomFloat(1.0, 2.0),
                category: categoryData.name
            };

            const response = await request(baseUrl).post(endpointPath.replace('{accountId}', accountData.id)).set({
                Authorization: token
            }).send(transactionData);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_type')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })
    })
})