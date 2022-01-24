import request from 'supertest';

global.generateBearerToken = async ({email, password}) => {
    const baseUrl = 'http://localhost:5000/api';
    const endpointPath = '/v1/auth/login';

    const response = await request(baseUrl).post(endpointPath).send({
        email: email,
        password: password
    });

    return response.body.access;
}