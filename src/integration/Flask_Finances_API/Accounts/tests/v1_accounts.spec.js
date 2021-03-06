/**
 * Flask Finances API Integration Tests
 *
 * @group @flask_finances_api
 * @group @accounts
*/

import { accountSchema, accountListSchema, errorSchema, errorTokenSchema } from '../contracts/v1_accounts.contract';
import AccountRequest from '../requests/v1_accounts.request'
import AccountFactory from '../factories/v1_accounts.factory';

describe('Accounts', () => {
    describe('POST /v1/accounts/', () => {
        it('@contract - deve validar o contrato de retorno de sucesso do serviço de criação de contas', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = AccountFactory.newAccountData(generateRandomFloat(1.0, 10.0));

            const response = await AccountRequest.createAccount(accountData, token);
            const { error } = accountSchema.validate(response.body, { abortEarly: false });
            expect(error).toBeUndefined();
        })

        it('@contract - deve validar o contrato de retorno de erro do serviço de criação de contas', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'invalid_name');

            const response = await AccountRequest.createAccount(accountData, token);
            const { error } = errorSchema.validate(response.body, { abortEarly: false });
            expect(error).toBeUndefined();
        })

        it('@smoke - deve cadastrar uma nova conta com sucesso', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = AccountFactory.newAccountData(generateRandomFloat(1.0, 10.0));

            const response = await AccountRequest.createAccount(accountData, token);

            expect(response.statusCode).toBe(201);
            expect(response.body.name).toBe(accountData.name);
            expect(response.body.income).toBe(convertToReal(0));
            expect(response.body.expense).toBe(convertToReal(0));
            expect(response.body.balance).toBe(convertToReal(accountData.balance));
        })

        it('deve retornar um erro ao tentar cadastrar uma conta com um nome inválido', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'invalid_name');

            const response = await AccountRequest.createAccount(accountData, token);

            const expectedError = apiDataLoad('default_errors', 'invalid_account_name');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar cadastrar uma conta com um saldo inválido', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);
            const accountData = apiDataLoad('accounts', 'invalid_balance');

            const response = await AccountRequest.createAccount(accountData, token);

            const expectedError = apiDataLoad('default_errors', 'invalid_account_balance');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar cadastrar uma conta sem passar o bearer token', async () => {
            const accountData = AccountFactory.newAccountData();

            const response = await AccountRequest.createAccount(accountData);

            const expectedError = apiDataLoad('default_errors', 'missing_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar cadastrar uma conta passando um bearer token expirado', async () => {
            const token = apiDataLoad('tokens', 'expired').value;
            const accountData = AccountFactory.newAccountData();

            const response = await AccountRequest.createAccount(accountData, token);

            const expectedError = apiDataLoad('default_errors', 'expired_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar cadastrar uma conta passando um bearer token inválido', async () => {
            const token = apiDataLoad('tokens', 'invalid_value').value;
            const accountData = AccountFactory.newAccountData();

            const response = await AccountRequest.createAccount(accountData, token);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_format')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar cadastrar uma conta passando um bearer token de formato incorreto', async () => {
            const token = apiDataLoad('tokens', 'invalid_type').value;
            const accountData = AccountFactory.newAccountData();

            const response = await AccountRequest.createAccount(accountData, token);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_type')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })
    })

    describe('GET /v1/accounts/', () => {
        it('@contract - deve validar o contrato de retorno de sucesso do serviço de listagem de contas', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);

            const response = await AccountRequest.listUserAccounts(token);

            const { error } = accountListSchema.validate(response.body, { abortEarly: false });
            expect(error).toBeUndefined();
        })

        it('@contract - deve validar o contrato de retorno de erro do serviço de listagem de contas', async () => {
            const response = await AccountRequest.listUserAccounts();

            const { error } = errorTokenSchema.validate(response.body, { abortEarly: false });
            expect(error).toBeUndefined();
        })

        it('@smoke - deve retornar uma lista contendo as contas do usuário logado', async () => {
            const userData = apiDataLoad('users', 'valid');
            const token = await generateBearerToken(userData);

            const response = await AccountRequest.listUserAccounts(token);

            expect(response.statusCode).toBe(200);
            expect(response.body).not.toBeEmpty();
        })

        it('deve retornar um erro ao tentar cadastrar uma conta sem passar o bearer token', async () => {
            const response = await AccountRequest.listUserAccounts();

            const expectedError = apiDataLoad('default_errors', 'missing_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar cadastrar uma conta passando um bearer token expirado', async () => {
            const token = apiDataLoad('tokens', 'expired').value;

            const response = await AccountRequest.listUserAccounts(token);

            const expectedError = apiDataLoad('default_errors', 'expired_bearer_token')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar cadastrar uma conta passando um bearer token inválido', async () => {
            const token = apiDataLoad('tokens', 'invalid_value').value;

            const response = await AccountRequest.listUserAccounts(token);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_format')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })

        it('deve retornar um erro ao tentar cadastrar uma conta passando um bearer token de formato incorreto', async () => {
            const token = apiDataLoad('tokens', 'invalid_type').value;

            const response = await AccountRequest.listUserAccounts(token);

            const expectedError = apiDataLoad('default_errors', 'invalid_token_type')
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.msg).toBe(expectedError.message);
        })
    })
})