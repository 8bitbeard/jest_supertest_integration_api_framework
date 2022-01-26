class UserFactory {
    newUserData() {
        const randomNumber = generateRandomNumber(10000);
        const userData = {
            name: `QATMP${randomNumber}`,
            email: `qa_tmp_${randomNumber}@example.com`,
            password: '123456'
        }

        return userData
    }

    newUserWithoutName() {
        const randomNumber = generateRandomNumber(10000);
        const userData = {
            email: `qa_tmp_${randomNumber}@example.com`,
            password: '123456'
        }

        return userData
    }

    newUserWithoutEmail() {
        const randomNumber = generateRandomNumber(10000);
        const userData = {
            name: `QATMP${randomNumber}`,
            password: '123456'
        }

        return userData
    }

    newUserWithoutPassword() {
        const randomNumber = generateRandomNumber(10000);
        const userData = {
            name: `QATMP${randomNumber}`,
            email: `qa_tmp_${randomNumber}@example.com`,
        }

        return userData
    }
}

export default new UserFactory;