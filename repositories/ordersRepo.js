const TableModel = require('../models/tables').Table
const { Types: { ObjectId } } = require("mongoose")

//rezerwacja = zamówienie , czasami mówię zamiennie, ale chodzi o to samo

//Repozytorium które służy do operacji na rezerwacjach stolika

//!!! Ważne !!!!
//W bazie danych NIE ISTNIEJE KOLEKCJA ORDER czyli zamówienia, poniważ jest to podschemat Kolekcji Table -> ../models/tables.js -> 22 linijka kodu
//A to oznacza że operujemy na Kolekcji Table
class OrderRepo {

    //dodanie zamówienia na podstawie otrzymanego numeru stolika oraz przekazanie obiektu zamówienia:
    //czyli godzinę rezerwacji oraz date
    static addOrder(number, order) {
        return new Promise((resolve, reject) => {
            //Nie dodajemy tutaj nic do Kolekcji Order, poniważ ona nie istnieje,
            //zamiast tego modyfikujemy dokument Kolekcji Table który zawiera w sobie tablicę rezerwacji
            TableModel.update({ number },
                {
                    //to push jest to dodanie do tej tablicy reservations tego zamówienia
                    $push: {
                        reservations: order
                    }
                },
                (err, raw) => {
                    if (err || raw.n == 0) {
                        console.log(err)
                        reject()
                    }
                    resolve()
                }
            )
        })
    }

    //Zwracanie tablicy zamówień ale z taką samą datą jak w parametrze metody
    static findOrdersByDate(date) {
        return new Promise((resolve, reject) => {
            TableModel.find({ date }, (err, tables) => {
                if (err) {
                    reject()
                }
                resolve(tables)
            })
        })
    }

    //Sprawdza czy stolik w danym dniu o danej godzinie jest zarezerwowany
    //przyjmuejmy 3 argumenty: datę, godzinę oraz numer stolika
    static checkAvaiable(date, time, number) {
        return new Promise((resolve, reject) => {
            //Najpierw szukamy stolika tak by otrzymać dokument Kolekcji Table
            TableModel.findOne({ number }, (err, table) => {
                //table jest to dokument Kolekcji Table
                if (table) {
                    //Przeszukanie pola reservation
                    for (let i = 0; i < table.reservations.length; i++) {
                        //w celu sprawdzeni czy dana godzina w danym dniu jest zajęta,
                        //jeśli warunek poniżej został spełniony tzn. że stolik o tej godzinie w tym dniu jest zajęty
                        //jeśli nie to znaczy że stolik jest wolny i użytkownik może zarezerwować stolik
                        if (table.reservations[i].date == date && table.reservations[i].time == time) {
                            reject({ email: table.reservations[i].user.email, id: table.reservations[i]._id })
                        }
                    }
                }
                resolve()
            })
        })
    }

    //Zwracanie wszystkich zamówień  wszystkich stolików
    //zrobione na zapas, nigdzie nie używane
    static findOrders() {
        return new Promise((resolve, reject) => {
            TableModel.aggregate([
                {
                    $unwind: "$reservations"
                }

            ]).then((docs) => {
                resolve(docs)
            }).catch((err) => {
                console.log(err)
                reject()
            })
        })
    }

    //usuwanie rezerwacji na podstawie pola _id,
    //tak jak wcześniej ponieważ nie istnieje Kolekcja Order tylko zamówienia są częscią kolekcji Table
    //to musimy zmodyfikować konkretny dokument kolekcji Table
    static deleteOrderById(number, id) {
        return new Promise((resolve, reject) => {
            //To jest szukanie stolika po unikatowym numerze stolika
            TableModel.updateOne(
                { number },
                //pull służy do usunięcia z tablicy reservations zamówienia
                { $pull: { reservations: { _id: id } } },
                { safe: true }, (err, obj) => {
                    if (err) {
                        reject()
                    }
                    resolve()
                })
        })
    }

    static addMenuOrderToOrder(number, orderId, menuOrder) {
        let orderId = ObjectId(orderId)
        return new Promise((resolve, reject) => {
            TableModel.updateOne(
                {
                    number: number,
                    "reservations._id": orderId
                },
                {
                    $set: {
                        "reservations.$.menuOrder": menuOrder
                    }
                },
                (err, raw) => {
                    if (err || raw.n == 0) {
                        reject()
                    }
                    resolve()
                })
        })
    }

    static findOrdersByUserId(userId) {
        let userId = ObjectId(userId)
        return new Promise((resolve, reject) => {
            TableModel.aggregate([
                {
                    $unwind: "$reservations"
                },
                {
                    $project: {
                        _id: 0,
                        userId: "$reservations.user._id",
                        menuOrder: "$reservations.menuOrder",
                        number: 1
                    }
                },
                {
                    $match: {
                        userId: userId
                    }
                }
            ]).then((docs) => {
                resolve(docs)
            }).catch((err) => {
                console.log(err)
                reject()
            })
        })

    }

}

module.exports = OrderRepo