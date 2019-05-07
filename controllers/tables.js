const tablesRepo = require('../repositories/tablesRepo');

exports.addTable = (req, res) => {
    //dodanie stolika
    tablesRepo.addTable({ number: Number(req.body.number), seats: Number(req.body.seats) })
        .then(result => {
            res.redirect('/');
        })
        .catch(err => {
            req.flash('error-index', 'Wprowadzono dane w nieprawidłowym formacie');
            res.redirect('/');
        })
};

exports.getTables = async (req, res) => {
    //otrzymanie wszystkich stolików
    return await tablesRepo.getTables()
        .then(tables => {
            return tables;
        })
        .catch(err => {
            console.log(err);

        })
}


exports.selectTable = async (req, res) => {
    //wybór stolika
    return await tablesRepo.getTableByNumber(req.body.nr)
        .then(table => {
            return table
        }).catch(() => {

        })
}

exports.editTable = (req, res) => {
    //edycja stolika
    tablesRepo.updateById(req.body.id, { number: Number(req.body.number), seats: Number(req.body.seats) })
        .then(table => {
            res.redirect('/');

        }).catch(() => {
            req.flash('error-index', 'Wprowadzono dane w nieprawidłowym formacie');
            res.redirect('/');
        })
}

exports.deleteTable = (req, res) => {
    //usuwanie stolika
    tablesRepo.deleteById(req.body.id)
        .then(table => {
            res.redirect('/');

        }).catch(() => {
            req.flash('error-index', 'Wprowadzono dane w nieprawidłowym formacie');
            res.redirect('/');
        })
}