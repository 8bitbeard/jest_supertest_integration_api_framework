import request from 'supertest';
import { addMsg } from 'jest-html-reporters/helper'
import apiUrls from '../../../../support/config/apiUrls.json'

class IncomeTransactionRequest {

    constructor() {
        this.env = process.env.ENVIRONMENT ? process.env.ENVIRONMENT : 'localhost'
        this.baseUrl = apiUrls[this.env]['Flask_Finances_API']
        this.endpointPath = '/v1/transactions/{accountId}/income'
    }

    async createIncomeTransaction({ value, category }, { id }, token = null) {
        const url = this.endpointPath.replace('{accountId}', id)
        const response = await request(this.baseUrl)
            .post(url)
            .set(Object.assign(
                { "Content-Type": 'application/json' },
                token ? { "Authorization": token } : {}
            )).send({
                value: value,
                category: category
            });
        await addMsg({ message: JSON.stringify(response.body, null, 2) });
        return response;
    }
}

export default new IncomeTransactionRequest;