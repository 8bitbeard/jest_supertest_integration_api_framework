class CategoryFactory {
    newIncomeCategoryData() {
        const randomNumber = generateRandomNumber(10000);
        const categoryData = {
            name: `QATMP${randomNumber}`,
            type: 'E'
        }

        return categoryData
    }

    newExpenseCategoryData() {
        const randomNumber = generateRandomNumber(10000);
        const categoryData = {
            name: `QATMP${randomNumber}`,
            type: 'S'
        }

        return categoryData
    }
}

export default new CategoryFactory;