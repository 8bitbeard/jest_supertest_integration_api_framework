/**
 * Flask Finances API Integration Tests
 *
 * @group @flask_finances_api
 * @group @transactions
*/

import { transactionSchema, errorSchema, errorTokenSchema } from '../contracts/TransactionContract';
import IncomeTransactionRequest from '../requests/v1_transactions_accountId_income.request'
import TransactionFactory from '../factories/TransactionFactory';

describe('Transactions', () => {
    describe('POST /v1/transactions/{accountId}/income', () => {
        it('@contract - deve validar o contrato de retorno de sucesso do serviço de criação de transação de entrada', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'valid');
            const categoryData = apiDataLoad('categories', 'income')
            const transactionData = TransactionFactory.validTransactionData(categoryData)

            const response = await IncomeTransactionRequest.createIncomeTransaction(transactionData, accountData, token);
            const { error } = transactionSchema.validate(response.body, { abortEarly: false });
            expect(error).toBeUndefined();
        })

        it('@contract - deve validar o contrato de retorno de erro do serviço de criação de transação de entrada', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'valid');
            const categoryData = apiDataLoad('categories', 'expense')
            const transactionData = TransactionFactory.validTransactionData(categoryData)

            const response = await IncomeTransactionRequest.createIncomeTransaction(transactionData, accountData, token);
            const { error } = errorSchema.validate(response.body, { abortEarly: false });
            expect(error).toBeUndefined();
        })

        it('@contract - deve validar o contrato de retorno de erro no token do serviço de criação de transação de entrada', async () => {
            const accountData = apiDataLoad('accounts', 'valid');
            const categoryData = apiDataLoad('categories', 'income')
            const transactionData = TransactionFactory.validTransactionData(categoryData)

            const response = await IncomeTransactionRequest.createIncomeTransaction(transactionData, accountData);
            const { error } = errorTokenSchema.validate(response.body, { abortEarly: false });
            expect(error).toBeUndefined();
        })

        it('@smoke - deve criar uma transação de depósito com sucesso', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'valid');
            const categoryData = apiDataLoad('categories', 'income')
            const transactionData = TransactionFactory.validTransactionData(categoryData)

            const response = await IncomeTransactionRequest.createIncomeTransaction(transactionData, accountData, token);

            expect(response.statusCode).toBe(201);
            expect(response.body.value).toBe(convertToReal(transactionData.value));
            expect(response.body.category.id).toBe(categoryData.id);
            expect(response.body.category.name).toBe(categoryData.name);
            expect(response.body.category.type).toBe(apiDataLoad('categories', 'valid income').enum);
        })

        it('deve retornar um erro ao tentar criar uma transação com uma categoria de saída', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'valid');
            const categoryData = apiDataLoad('categories', 'expense')
            const transactionData = TransactionFactory.validTransactionData(categoryData)

            const response = await IncomeTransactionRequest.createIncomeTransaction(transactionData, accountData, token);

            const expectedError = apiDataLoad('default_errors', 'incorrect_income_category');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar criar uma transação para uma conta inexistente', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'invalid_name');
            const categoryData = apiDataLoad('categories', 'income')
            const transactionData = TransactionFactory.validTransactionData(categoryData)

            const response = await IncomeTransactionRequest.createIncomeTransaction(transactionData, accountData, token);

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
            const transactionData = TransactionFactory.validTransactionData(categoryData)

            const response = await IncomeTransactionRequest.createIncomeTransaction(transactionData, accountData, token);

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
            const categoryData = apiDataLoad('categories', 'income')
            const transactionData = TransactionFactory.invalidTransactionData(categoryData)

            const response = await IncomeTransactionRequest.createIncomeTransaction(transactionData, accountData, token);

            const expectedError = apiDataLoad('default_errors', 'invalid_transaction_value');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar criar uma transação sem passar o bearer token', async () => {
            const accountData = apiDataLoad('accounts', 'valid');
            const categoryData = apiDataLoad('categories', 'income')
            const transactionData = TransactionFactory.validTransactionData(categoryData)

            const response = await IncomeTransactionRequest.createIncomeTransaction(transactionData, accountData);

            const expectedError = apiDataLoad('default_errors', 'missing_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar criar uma transação passando um bearer token expirado', async () => {
            const token = apiDataLoad('tokens', 'expired').value;
            const accountData = apiDataLoad('accounts', 'valid');
            const categoryData = apiDataLoad('categories', 'income')
            const transactionData = TransactionFactory.validTransactionData(categoryData)

            const response = await IncomeTransactionRequest.createIncomeTransaction(transactionData, accountData, token);

            const expectedError = apiDataLoad('default_errors', 'expired_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar criar uma transação passando um bearer token inválido', async () => {
            const token = apiDataLoad('tokens', 'invalid_value').value;
            const accountData = apiDataLoad('accounts', 'valid');
            const categoryData = apiDataLoad('categories', 'income')
            const transactionData = TransactionFactory.validTransactionData(categoryData)

            const response = await IncomeTransactionRequest.createIncomeTransaction(transactionData, accountData, token);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_format')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar criar uma transação passando um bearer token de formato incorreto', async () => {
            const token = apiDataLoad('tokens', 'invalid_type').value;
            const accountData = apiDataLoad('accounts', 'valid');
            const categoryData = apiDataLoad('categories', 'income')
            const transactionData = TransactionFactory.validTransactionData(categoryData)

            const response = await IncomeTransactionRequest.createIncomeTransaction(transactionData, accountData, token);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_type')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })
    })
})