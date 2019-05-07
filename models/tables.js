const mongoose = require('mongoose')
const Schema = mongoose.Schema
const orderSchema = require('./orders').orderSchema


//Zdefiniowanie schematu stolika w restauracji, musi zawierać takie informacje jak:
//number - numer stolika
//seats - liczba miejsc,

//reservation - jest to tablica która składa się ze schematu zamówień, najprościej rzecz ujmując każdy stolik ma rezerwacje
//więc musi zawierać informacje o tym na kiedy została wykonana rezerwacja oraz o tym kto zarezerował stolik
const tableSchema = new Schema({
    number: {
        type: Number,
        required: true,
        unique: true
    },
    seats: {
        type: Number,
        required: true
    },
    reservations: [orderSchema]
})

//Utworzenie modelu na podstawie schematu
const Table = mongoose.model('Table', tableSchema)

exports.Table = Table
exports.tableSchema = tableSchema
