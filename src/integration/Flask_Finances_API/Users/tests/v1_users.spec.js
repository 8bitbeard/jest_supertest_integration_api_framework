/**
 * Flask Finances API Integration Tests
 *
 * @group @flask_finances_api
 * @group @Users
*/

import { userSchema, userListSchema, errorSchema } from '../contracts/UserContract';
import UserRequest from '../requests/v1_users.request'
import UserFactory from '../factories/UserFactory';

describe('users', () => {
    describe('POST /v1/users/', () => {

        it('@contract - deve validar o contrato de retorno de sucesso do serviço de criação de usuários', async () => {
            const userData = UserFactory.newUserData();

            const response = await UserRequest.createUser(userData);
            const { error } = userSchema.validate(response.body, { abortEarly: false });
            expect(error).toBeUndefined();
        })

        it('@contract - deve validar o contrato de retorno de erro do serviço de criação de usuários', async () => {
            const userData = apiDataLoad('users', 'valid');

            const response = await UserRequest.createUser(userData);
            const { error } = errorSchema.validate(response.body, { abortEarly: false });
            expect(error).toBeUndefined();
        })

        it('@smoke - deve retornar com sucesso os dados do usuário logado', async () => {
            const userData = UserFactory.newUserData();

            const response = await UserRequest.createUser(userData);

            expect(response.statusCode).toBe(201);
            expect(response.body.name).toBe(userData.name);
            expect(response.body.email).toBe(userData.email);
        })

        it('deve retornar um erro ao tentar criar um usuário sem informar o nome', async () => {
            const userData = UserFactory.newUserWithoutName();

            const response = await UserRequest.createUser(userData);

            const expectedError = apiDataLoad('default_errors', 'missing_user_parameters');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar criar um usuário sem informar o email', async () => {
            const userData = UserFactory.newUserWithoutEmail();

            const response = await UserRequest.createUser(userData);

            const expectedError = apiDataLoad('default_errors', 'missing_user_parameters');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar criar um usuário sem informar a senha', async () => {
            const userData = UserFactory.newUserWithoutPassword();

            const response = await UserRequest.createUser(userData);

            const expectedError = apiDataLoad('default_errors', 'missing_user_parameters');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar criar um usuário com um nome inválido', async () => {
            const userData = apiDataLoad('users', 'invalid_name');

            const response = await UserRequest.createUser(userData);

            const expectedError = apiDataLoad('default_errors', 'invalid_user_name');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar criar um usuário com um email inválido', async () => {
            const userData = apiDataLoad('users', 'invalid_email')

            const response = await UserRequest.createUser(userData);

            const expectedError = apiDataLoad('default_errors', 'invalid_user_email');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar criar um usuário com um email já existente', async () => {
            const userData = apiDataLoad('users', 'valid');

            const response = await UserRequest.createUser(userData);

            const expectedError = apiDataLoad('default_errors', 'email_already_exists');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })

        it('deve retornar um erro ao tentar criar um usuário com um uma senha inválida', async () => {
            const userData = apiDataLoad('users', 'invalid_password');

            const response = await UserRequest.createUser(userData);

            const expectedError = apiDataLoad('default_errors', 'invalid_user_password');
            expect(response.statusCode).toBe(expectedError.status);
            expect(response.body.code).toBe(expectedError.code);
            expect(response.body.message).toBe(expectedError.message);
            expect(response.body.details[0]).toBeString(expectedError.details);
        })
    })

    describe('GET /v1/UserRequest/', () => {
        it('@contract - deve validar o contrato de retorno de sucesso do serviço de listage de usuários', async () => {
            const response = await UserRequest.getAllUsers();
            const { error } = userListSchema.validate(response.body, { abortEarly: false });
            expect(error).toBeUndefined();
        })
        it('@smoke - deve retornar uma lista contendo todos os usuários cadastrados', async () => {
            const response = await UserRequest.getAllUsers();

            expect(response.statusCode).toBe(200);
        })
    })
})