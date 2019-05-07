const MenuModel = require('../models/menu').Menu

//Repozytorium które służy do kontaktu z kolekcją Menu
class MenuRepository {

    static getAll() {
        return new Promise((resolve, reject) => {
            MenuModel.find({}, (err, menus) => {
                if (err) {
                    reject()
                }
                resolve(menus)
            })
        })
    }

    static updateById(id, doc) {
        return new Promise((resolve, reject) => {
            MenuModel.updateOne({ _id: id }, doc, (err, raw) => {
                
                //Jeśli podczas modyfikacji liczba dopasowanych dokumentów jest równa 0 to wyrzuca błąd
                if (err || raw.n == 0) {
                    reject()
                }
                resolve()
            })
        })
    }

    //dodawanie dokumentu do kolekcji Menu
    static insert(doc) {
        return new Promise((resolve, reject) => {
            MenuModel.create(doc, (err, menu) => {
                if (err) {
                    reject()
                }
                resolve()
            })
        })
    }

    //usuwanie dokumentu z kolekcji Menu przez podanie jesto _id
    static deleteById(id) {
        return new Promise((resolve, reject) => {
            MenuModel.findOneAndRemove({ _id: id }, (err) => {
                if (err) {
                    reject()
                }
                resolve()
            })
        })
    }
}

module.exports = MenuRepository
