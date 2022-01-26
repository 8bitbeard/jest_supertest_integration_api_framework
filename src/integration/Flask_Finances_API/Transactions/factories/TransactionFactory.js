class TransactionFactory {
    validTransactionData({ name }) {
        const transactionData = {
            value: generateRandomFloat(1.0, 2.0),
            category: name
        }

        return transactionData
    }

    invalidTransactionData({ name }) {
        const transactionData = {
            value: -generateRandomFloat(1.0, 2.0),
            category: name
        }

        return transactionData
    }
}

export default new TransactionFactory;