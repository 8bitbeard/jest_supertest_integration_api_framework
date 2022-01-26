class AccountFactory {
    newAccountData(balance = null) {
        const randomNumber = generateRandomNumber(10000);
        const accountData = {
            name: `QATMP${randomNumber}`,
            balance: balance ? balance : 0
        }

        return accountData
    }
}

export default new AccountFactory;