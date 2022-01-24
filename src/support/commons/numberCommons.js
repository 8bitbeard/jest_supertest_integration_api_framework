global.generateRandomNumber = (firstValue, secondValue) => {
    const minValue = secondValue ? firstValue : 0;
    const maxValue = secondValue ? secondValue : firstValue;

    const result = Math.floor(minValue + Math.random() * maxValue);
    return result
}

global.generateRandomFloat = (firstValue, secondValue = null) => {
    const minValue = secondValue ? firstValue : 0.0;
    const maxValue = secondValue ? secondValue : firstValue;
    const result = minValue + Math.random() * maxValue;
    return result
}