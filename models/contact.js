const mongoose = require('mongoose')
const Schema = mongoose.Schema


//Zdefiniowanie schematu kontaktów, kontakt do restauracji musi zawierać takie informacje jak:
//Imię i nazwisko właściciela, jego email, telefon oraz adres restauracji
let contactSchema = new Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    street: {
        type: String
    }
}
    //ustalenie maksymalnej ilości dokumentów w kolekcji oraz rozmiaru w bajtach(wymagane)
)

//Utworzenie modelu na podstawie schematu
//Model - jest to kolekcja w bazie danych typu NoSQL
const Contact = mongoose.model('Contact', contactSchema)

exports.Contact = Contact
exports.contactSchema = contactSchema