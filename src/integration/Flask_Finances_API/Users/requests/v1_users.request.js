import request from 'supertest';
import { addMsg } from 'jest-html-reporters/helper'
import apiUrls from '../../../../support/config/apiUrls.json'

class UserRequest {

    constructor() {
        this.env = process.env.ENVIRONMENT ? process.env.ENVIRONMENT : 'localhost'
        this.baseUrl = apiUrls[this.env]['Flask_Finances_API']
        this.endpointPath = '/v1/users/'
    }

    async createUser({name, email, password}) {
        const response = await request(this.baseUrl)
            .post(this.endpointPath)
            .set({ "Content-Type": 'application/json' })
            .send({
                name: name,
                email: email,
                password: password
            });
        await addMsg({ message: JSON.stringify(response.body, null, 2) });
        return response;
    }

    async getAllUsers() {
        const response = await request(this.baseUrl)
            .get(this.endpointPath)
            .set({
                "Content-Type": "application/json"
            });
        await addMsg({ message: JSON.stringify(response.body, null, 2) });
        return response;
    }

}

export default new UserRequest;