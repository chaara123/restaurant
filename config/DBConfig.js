const mongoose = require('mongoose')
const OnInit = require('./OnInit')

//Klasa służąca do połączenia z dowolną instancją bazy danych,
class DBConfig {
    //konstruktor przyjmuje adres bazy danych
    constructor(MONGODB_URI) {
        this.MONGODB_URI = MONGODB_URI
    }
    //metoda connect służy do połączenia z bazą na podstawie podanego w konstruktorze adresu
    connect() {
        mongoose.connect(this.MONGODB_URI, { useNewUrlParser: true }, (err) => {
            if (err) {
                console.log(err)
                process.exit(1)
            }
            console.log(`[MONGODB] Connected to instance on ${this.MONGODB_URI}`)
            OnInit.addAdminOnStart()
            OnInit.addDefaultContactOnStart()
            OnInit.addDefaultRestaurantConfigOnStart()
            OnInit.addDefaultTablesOnStart()
        });
    }
}

module.exports = DBConfig
