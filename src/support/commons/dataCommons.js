import * as data from '../data/testData.json';

global.apiDataLoad = (rootKey, profiles) => {
    const parameters = profiles.split(' ');

    const dataValue = data[rootKey].filter((object) => parameters.every(p => object.profiles.includes(p)) )

    return dataValue[Math.floor(Math.random()*dataValue.length)];
}