class AccountFactory {
    newAccountData(balance = null) {
        const randomNumber = generateRandomNumber(10000);
        const categoryData = {
            name: `QATMP${randomNumber}`,
            balance: balance ? balance : 0
        }

        return categoryData
    }
}

export default new AccountFactory;