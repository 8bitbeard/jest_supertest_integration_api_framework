import request from 'supertest';
import apiUrls from '../../../../support/config/apiUrls.json'

const env = process.env.ENVIRONMENT ? process.env.ENVIRONMENT : 'localhost'
const baseUrl = apiUrls[env]['Flask_Finances_API']
const endpointPath = '/v1/users/'

function createUser({name, email, password}) {
    return request(baseUrl)
        .post(endpointPath)
        .set({ "Content-Type": 'application/json' })
        .send({
            name: name,
            email: email,
            password: password
        })
}

function getAllUsers() {
    return request(baseUrl)
        .get(endpointPath)
        .set({
            "Content-Type": "application/json"
        })
}

export { createUser, getAllUsers }