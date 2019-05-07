const TableModel = require('../models/tables').Table

//Repozytorium które służy do kontaktu z kolekcją Table
class TableRepo {

    //Zwracanie wszystkich stołów
    static getTables() {
        return new Promise((resolve, reject) => {
            TableModel.find({}, (err, tables) => {
                if (err) {
                    reject()
                }


                resolve(tables)
            })
        })
    }

    //Zwracanie stołu na podstawie _id dokumentu
    static getTable(id) {
        return new Promise((resolve, reject) => {
            TableModel.findOne({ _id: id }, (err, table) => {
                if (err) {
                    reject()
                }
                resolve(table)
            })
        })
    }

    //Zwracanie stołu na podstawie unikatowego numeru stolika
    static getTableByNumber(number) {
        return new Promise((resolve, reject) => {
            TableModel.findOne({ number }, (err, table) => {
                if (err) {
                    reject()
                }
                resolve(table)
            })
        })
    }

    //Dodanie stołu do kolekcji Table
    static addTable(table) {
        return new Promise((resolve, reject) => {
            TableModel.create(table, (err, created) => {
                if (err || !created) {
                    console.log(err)
                    reject()
                }
                resolve()
            })
        })
    }

    //Usuwanie dokumentu na podstawie pola _id
    static deleteById(id) {
        return new Promise((resolve, reject) => {
            TableModel.deleteOne({ _id: id }, (err) => {
                if (err) {
                    reject()
                }
                resolve()
            })
        })
    }

    //Modyfikacja dokumentu na podstawie pola _id
    static updateById(id, toUpdate) {
        return new Promise((resolve, reject) => {
            TableModel.update({ _id: id },
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
}

module.exports = TableRepo