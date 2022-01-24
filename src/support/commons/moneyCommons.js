global.convertToReal = (value) => {
    return `R$ ${value.toFixed(2)}`.replace('.', ',');
}