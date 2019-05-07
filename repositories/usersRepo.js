const UsersModel = require('../models/users').User

//Repozytorium które służy do kontaktu z kolekcją User
class UserRepo {
    static addUser(user) {
        return new Promise((resolve, reject) => {
            UsersModel.create(user, (err, created) => {
                if (err) {
                    console.log(err)
                    reject()
                }
                resolve()
            })
        })
    }

    static findUsers() {
        return new Promise((resolve, reject) => {
            UsersModel.find({}, (err, docs) => {
                if (err) {
                    reject()
                }
                resolve(docs)
            })
        })
    }

    static findUserByEmail(email) {
        return new Promise((resolve, reject) => {
            UsersModel.findOne({ email }, (err, user) => {
                if (err || !user) {
                    console.log(err)
                    reject()
                }
                resolve(user)
            })
        })
    }

    static updateUserById(id, toUpdate) {
        return new Promise((resolve, reject) => {
            UsersModel.updateOne({ _id: id },
                { $set: toUpdate },
                (err, raw) => {
                    if (err || raw.n == 0) {
                        reject()
                    }
                    resolve()
                }
            )
        })
    }

    static deleteUserById(id) {
        return new Promise((resolve, reject) => {
            UsersModel.deleteOne({ _id: id }, (err) => {
                if (err) {
                    reject()
                }
                resolve()
            })
        })
    }

}

module.exports = UserRepo