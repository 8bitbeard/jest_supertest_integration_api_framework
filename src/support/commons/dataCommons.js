import * as localhostData from '../data/localData.json';
import * as developmentData from '../data/devData.json';
import * as testingData from '../data/uatData.json';
import * as productionData from '../data/prdData.json';

global.apiDataLoad = (rootKey, profiles) => {
    const data = {
        localhost: localhostData,
        development: developmentData,
        testing: testingData,
        production: productionData
    }

    const env = process.env.ENVIRONMENT ? process.env.ENVIRONMENT : 'localhost'
    const parameters = profiles.split(' ');

    const dataValue = data[env][rootKey].filter((object) => parameters.every(p => object.profiles.includes(p)) )

    return dataValue[Math.floor(Math.random()*dataValue.length)];
}