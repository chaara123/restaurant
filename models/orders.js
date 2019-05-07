const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = require('./users').userSchema

//Zdefiniowanie schematu rezerwacji stolika, rezerwacja musi zawierać takie informacje jak:
//godzinę rezerwacji oraz date rezerwacji
//user - to jest obiekt który ma w sobie użytkownika który zarezerwował stolik
const orderSchema = new Schema({
    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    user: userSchema,
    menuOrder: {
        type: Object,
        required: true,
        default: {

        }
    }
})

exports.orderSchema = orderSchema
