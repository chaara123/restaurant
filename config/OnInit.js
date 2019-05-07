const User = require('../models/users').User
const Contact = require('../models/contact').Contact
const Table = require("../models/tables").Table
const RestaurantConfig = require('../models/restaurantConfig').RestaurantConfig
const fs = require("fs")
const path = require('path');

//Wywołujemy ją podaczas startu aplikacji w celu wprowadzenia 
//domyślnych danych do bazy danych
class OnInit {

    //Sprawdza czy w kolekcji users istnieje przynajmniej 1 użytkownik o typie Administrator
    //jeśli nie to go dodaje
    static addAdminOnStart() {
        User.find({ admin: true }, (err, results) => {
            if (results.length == 0) {
                User.create({
                    firstname: 'admin',
                    lastname: 'admin',
                    email: 'admin',
                    phone: '',
                    password: 'admin',
                    admin: true
                })
            }
        })
    }

    //Sprawdza czy w kolekcji restaurantConfigs istnieje przynajmniej 1 dokument
    //jeśli nie to go dodaje
    static addDefaultRestaurantConfigOnStart() {
        RestaurantConfig.create({
            open: '11',
            close: '22',
            maxDayAhead: 3
        })
    }

    //Sprawdza czy w kolekcji contacts istnieje przynajmniej 1 dokument
    //jeśli nie to go dodaje
    static addDefaultContactOnStart() {
        Contact.count({}, (error, count) => {
            if (count == 0) {
                Contact.create({
                    firstname: '',
                    lastname: '',
                    email: '',
                    phone: '',
                    street: ''
                })
            }
        })

    }

    static addDefaultTablesOnStart() {
        Table.deleteMany({}, (err) => {
            if (err) {
                throw new Error("Problem with erase data from Tables Collection")
            }
        })
        try {
            fs.readFile(path.join(__dirname, "tables.json"), (err, data) => {
                if (err) {
                    console.log(err)
                }
                let tables = JSON.parse(data)
                Table.insertMany(tables, (err, doc) => {
                })
            })
        } catch (err) {
            console.log(`Problem with read and load default tables`)
        }
    }

}

module.exports = OnInit