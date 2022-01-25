import request from 'supertest';
import apiUrls from '../../../../support/config/apiUrls.json'

const env = process.env.ENVIRONMENT ? process.env.ENVIRONMENT : 'localhost'
const baseUrl = apiUrls[env]['Flask_Finances_API']
const endpointPath = '/v1/auth/login'

function authenticate({email, password}) {
    return request(baseUrl)
        .post(endpointPath)
        .set({ "Content-Type": 'application/json' })
        .send({
            email: email,
            password: password
        })
}

export { authenticate }