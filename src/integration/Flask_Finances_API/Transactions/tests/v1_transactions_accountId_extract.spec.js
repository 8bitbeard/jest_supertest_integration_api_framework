/**
 * Flask Finances API Integration Tests
 *
 * @group @flask_finances_api
 * @group @transactions
*/

import { transactionListSchema, errorSchema, errorTokenSchema } from '../contracts/TransactionContract';
import ExtractTransactionRequest from '../requests/v1_transactions_accountId_extract.request'

describe('Transactions', () => {
    describe('POST /v1/transactions/{accountId}/extract', () => {
        it('@contract - deve validar o contrato de retorno de sucesso do serviço de listagem do extrato', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'valid');

            const response = await ExtractTransactionRequest.listTransactionsExtract(accountData, token);
            const { error } = transactionListSchema.validate(response.body, { abortEarly: false });
            expect(error).toBeUndefined();
        })

        it('@contract - deve validar o contrato de retorno de erro do serviço de listagem do extrato', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'invalid_name');

            const response = await ExtractTransactionRequest.listTransactionsExtract(accountData, token);
            const { error } = errorSchema.validate(response.body, { abortEarly: false });
            expect(error).toBeUndefined();
        })

        it('@contract - deve validar o contrato de retorno de erro no token do serviço de listagem do extrato', async () => {
            const accountData = apiDataLoad('accounts', 'valid');

            const response = await ExtractTransactionRequest.listTransactionsExtract(accountData);
            const { error } = errorTokenSchema.validate(response.body, { abortEarly: false });
            expect(error).toBeUndefined();
        })

        it('@smoke - listar o extrato de transações da conta do usuário com sucesso', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'valid');

            const response = await ExtractTransactionRequest.listTransactionsExtract(accountData, token);

            expect(response.statusCode).toBe(200);
            expect(response.body).not.toBeEmpty();
        })

        it('deve retornar um erro ao buscar o extrato de uma conta inexistente', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'invalid_name');

            const response = await ExtractTransactionRequest.listTransactionsExtract(accountData, token);

            const expectedError = apiDataLoad('default_errors', 'account_not_found');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao buscar o extrato de uma conta sem passar o bearer token', async () => {
            const accountData = apiDataLoad('accounts', 'valid');

            const response = await ExtractTransactionRequest.listTransactionsExtract(accountData);

            const expectedError = apiDataLoad('default_errors', 'missing_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao buscar o extrato de uma conta passando um bearer token expirado', async () => {
            const token = apiDataLoad('tokens', 'expired').value;
            const accountData = apiDataLoad('accounts', 'valid');

            const response = await ExtractTransactionRequest.listTransactionsExtract(accountData, token);

            const expectedError = apiDataLoad('default_errors', 'expired_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao buscar o extrato de uma conta passando um bearer token inválido', async () => {
            const token = apiDataLoad('tokens', 'invalid_value').value;
            const accountData = apiDataLoad('accounts', 'valid');

            const response = await ExtractTransactionRequest.listTransactionsExtract(accountData, token);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_format')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao buscar o extrato de uma conta passando um bearer token de formato incorreto', async () => {
            const token = apiDataLoad('tokens', 'invalid_type').value;
            const accountData = apiDataLoad('accounts', 'valid');

            const response = await ExtractTransactionRequest.listTransactionsExtract(accountData, token);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_type')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })
    })
})