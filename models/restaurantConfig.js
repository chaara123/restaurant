const mongoose = require('mongoose')
const Schema = mongoose.Schema


//Zdefiniowanie schematu konfiguracyjnego restauracji,rezerwacja musi zawierać takie informacje jak:
//open - jest to godzina otwarcia restauracji
//close - jest to godzina zamknięcia restauracji
//maxDayAhead - jest to ilość dni która stanowi o tym ile dni do przodu można rezerwować stoliki
let restaurantConfigSchema = new Schema({
    open: {
        type: String
    },
    close: {
        type: String
    },
    maxDayAhead: {
        type: Number
    }
},
    //ustalenie maksymalnej ilości dokumentów w kolekcji
    {
        capped: {
            size: 1024,
            max: 1
        }
    }
)

//Utworzenie modelu na podstawie schematu
const RestaurantConfig = mongoose.model('RestaurantConfig', restaurantConfigSchema)

exports.RestaurantConfig = RestaurantConfig
exports.restaurantConfigSchema = restaurantConfigSchema