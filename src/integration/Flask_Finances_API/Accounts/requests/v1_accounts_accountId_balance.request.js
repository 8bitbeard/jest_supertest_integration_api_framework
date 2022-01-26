import request from 'supertest';
import { addMsg } from 'jest-html-reporters/helper'
import apiUrls from '../../../../support/config/apiUrls.json'

class BalaceRequest {

    constructor() {
        this.env = process.env.ENVIRONMENT ? process.env.ENVIRONMENT : 'localhost'
        this.baseUrl = apiUrls[this.env]['Flask_Finances_API']
        this.endpointPath = '/v1/accounts/{accountId}/balance'
    }

    async getAccountBalance({ id }, token = null) {
        const url = this.endpointPath.replace('{accountId}', id)
        const response = await request(this.baseUrl)
            .get(url)
            .set(Object.assign(
                { "Content-Type": 'application/json' },
                token ? { "Authorization": token } : {}
            ));
        await addMsg({ message: JSON.stringify(response.body, null, 2) });
        return response;
    }
}

export default new BalaceRequest;