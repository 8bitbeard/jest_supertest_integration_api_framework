import request from 'supertest';
import apiUrls from '../../../../support/config/apiUrls.json'

class UserRequest {

    constructor() {
        this.env = process.env.ENVIRONMENT ? process.env.ENVIRONMENT : 'localhost'
        this.baseUrl = apiUrls[this.env]['Flask_Finances_API']
        this.endpointPath = '/v1/users/'
    }

    createUser({name, email, password}) {
        return request(this.baseUrl)
            .post(this.endpointPath)
            .set({ "Content-Type": 'application/json' })
            .send({
                name: name,
                email: email,
                password: password
            })
    }

    getAllUsers() {
        return request(this.baseUrl)
            .get(this.endpointPath)
            .set({
                "Content-Type": "application/json"
            })
    }

}

export default new UserRequest;