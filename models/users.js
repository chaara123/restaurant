const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

//Zdefiniowanie schematu stolika w restauracji, musi zawierać takie informacje jak:
//firstname - imię zarejestrowanego użytkownika
//lastname - nazwisko zarejestrowanego użytkownika
//email - email zarejestrowanego użytkownika
//phone - telefon zarejestrowanego użytkownika
//password - zaszyfrowane hasło zarejestrowanego użytkownika
//admin - wartość true lub false, true jeśli użytkownik jest adminem, false jeśli nim nie jest
const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true
    },

    //default - oznacza wartość która jest wartością domyślną podczas tworzenia dokumentu,
    //jeśli byśmy nie podali pola admin
    admin: {
        type: Boolean,
        default: false,
        required: true
    }
})

//o tym najlepiej jakby Pani poczytała: https://mongoosejs.com/docs/guide.html#methods
//jest to najprościej rzecz ujmując metoda którą wywołuje się na dokumencie kolekcji
//comparePassword służy do porównania haseł, potrzebne przy logowaniu, ponieważ hasło które jest w bazie danych jest zaszyfrowane
//a hasło które wpisuje użytkownik podczas logowania już nie jest
userSchema.methods.comparePassword = function (candidatePassword, cb) {

    //gotowa funkcja modułu bcryptjs która zajmuje się "hashowaniem" haseł
    //ponieżej funkcja compare zajmuje się porównianiem haseł
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
}

//o tym najlepiej jakby Pani poczytała: https://mongoosejs.com/docs/middleware.html
//metoda ktora wywołuje się tuż przed zapisaniem dokumentu do kolekcji
//ma na celu "zahasowanie" hasła i jego zapisanie do kolekcji
userSchema.pre('save', function (next) {
    const user = this
    
    //jeśli nie modyfikujemy hasła to zwracam next tak aby ominąć jego hashowanie
    if (!user.isModified('password')) return next();

    //w tym miejscu jest to po prostu hashowanie hasła,
    //tu jest świetny artykuł który wyczerpuje temat: https://auth0.com/blog/hashing-in-action-understanding-bcrypt/
    bcrypt.genSalt(3, (err, salt) => {
        if (err) {
            return next(err)
        }
        bcrypt.hash(user.password, salt, (err, hashed) => {
            if (err) {
                return next(err)
            }
            user.password = hashed
            next()
        })
    })
})

//Utworzenie modelu na podstawie schematu
const User = mongoose.model('User', userSchema)



exports.User = User
exports.userSchema = userSchema
