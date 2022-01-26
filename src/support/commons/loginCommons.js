import * as PostLogin from '../../integration/Flask_Finances_API/Authentication/requests/v1_auth_login.request';

global.generateBearerToken = async ({email, password}) => {
    const response = await PostLogin.authenticate({email, password})
    return `Bearer ${response.body.access}`;
}