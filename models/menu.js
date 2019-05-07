const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Zdefiniowanie schematu kontaktów, kontakt do restauracji musi zawierać takie informacje jak:
//Imię i nazwisko właściciela, jego email, telefon oraz adres restauracji
let menuSchema = new Schema({

    //Typ String to tekst, czyli nazwa dania to tekst
    //required - oznacza że pole jest wymagane
    //unique - oznacza że pole jest unikatowe tzn. nie można dodać 2 takiego samego
    name: {
        type: String,
        required: true,
        unique: true
    },

    //Typ Number to wartość liczbowa, cena to liczba
    price: {
        type: Number,
        required: true
    }
})

//Utworzenie modelu na podstawie schematu
const Menu = mongoose.model('Menu', menuSchema)

exports.Menu = Menu
exports.menuSchema = menuSchema
