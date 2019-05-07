const ContactModel = require('../models/contact').Contact

//Repozytoria są to klasy która jest pośrednikiem pomiędzy bazą danych a kodem
//służą one najczęściej do obsługi błędów oraz byśmy bezpośrednio nie korzystali z bazy danych tylko z pośrednika
//dobrze jest ich używać żebyśmy przypadkowo nie zaczęli wykonwywać jakiejś operacji która niekoniecznie jest porządana dla danej kolekcji
//np. dla tej kolekcji jest to bardzo ważne, poniważ w przypadku kontaktu nie obsługujemy więcej niż 1 kontaktu, tzn. w bazie danych istnieje tylko 1 dokument
//i nie chcemy żeby ich było więcej, żebyśmy przypadkowo nie dodali do kolekcji 2 takiego dokumentu bo na stronie i tak obsługiwany jest tylko 1 dokument
//kontakt do właściciela restauracji jest tylko 1
//Nie mogłem znaleźć dobrej implementacji w NodeJS ale tutaj jest artykuł: https://medium.com/@pererikbergman/repository-design-pattern-e28c0f3e4a30
class ContactRepo {

    //pobieranie wszystkich kontaktów z bazy danych
    static getAll() {
        return new Promise((resolve, reject) => {
            ContactModel.find({}, (err, contact) => {

                //Wszędzie to err oznacza to samo, jeśli jest błąd jakiejś operacji na bazie danych to wtedy wyrzucamy błąd
                if (err) {
                    reject()
                }
                resolve(contact)
            })
        })
    }

    //updatowanie kontaktu na podstawie pola _id oraz dokumentu który nadpisuje obecny dokument
    static update(id, doc) {
        return new Promise((resolve, reject) => {
            ContactModel.updateOne({ _id: id }, doc, (err, raw) => {
                if (err || raw.n == 0) {
                    reject()
                }
                resolve()
            })
        })
    }
}

module.exports = ContactRepo