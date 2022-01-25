import request from 'supertest';
import apiUrls from '../../../../support/config/apiUrls.json'

const env = process.env.ENVIRONMENT ? process.env.ENVIRONMENT : 'localhost'
const baseUrl = apiUrls[env]['Flask_Finances_API']
const endpointPath = '/v1/auth/me'

function getUserInfo(token = null) {
    return request(baseUrl)
        .get(endpointPath)
        .set(Object.assign(
            { "Content-Type": 'application/json' },
            token ? { "Authorization": token } : {}
        ))
}

export { getUserInfo }