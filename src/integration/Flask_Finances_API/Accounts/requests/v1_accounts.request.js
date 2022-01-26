import request from 'supertest';
import { addMsg } from 'jest-html-reporters/helper'
import apiUrls from '../../../../support/config/apiUrls.json'

class AccountRequest {

    constructor() {
        this.env = process.env.ENVIRONMENT ? process.env.ENVIRONMENT : 'localhost'
        this.baseUrl = apiUrls[this.env]['Flask_Finances_API']
        this.endpointPath = '/v1/accounts/'
    }

    async createAccount({ name, balance }, token = null) {
        const response = await request(this.baseUrl)
            .post(this.endpointPath)
            .set(Object.assign(
                { "Content-Type": 'application/json' },
                token ? { "Authorization": token } : {}
            )).send({
                name: name,
                balance: balance
            });
        await addMsg({ message: JSON.stringify(response.body, null, 2) });
        return response;
    }

    async listUserAccounts(token = null) {
        const response = await request(this.baseUrl)
            .get(this.endpointPath)
            .set(Object.assign(
                { "Content-Type": 'application/json' },
                token ? { "Authorization": token } : {}
            ));
        await addMsg({ message: JSON.stringify(response.body, null, 2) });
        return response;
    }

}

export default new AccountRequest;