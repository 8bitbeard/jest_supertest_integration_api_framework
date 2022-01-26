class ExpenseTransactionFactory {
    newExpenseTransactionData({ name }) {
        const transactionData = {
            value: generateRandomFloat(1.0, 2.0),
            category: name
        }

        return transactionData
    }

    newInvalidExpenseTransactionData({ name }) {
        const transactionData = {
            value: -generateRandomFloat(1.0, 2.0),
            category: name
        }

        return transactionData
    }
}

export default new ExpenseTransactionFactory;