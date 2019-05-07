const menu = require('../repositories/menuRepo');

exports.deleteDish = (req, res) => {
    //usuwanie pozycji z menu
    menu.deleteById(req.body.id).then(() => {
        res.redirect('/menu');
    }).catch(err => {
        req.flash('error-menu', 'Wprowadzono dane w nieprawidłowym formacie');
        res.redirect('/menu');
    })

}

exports.addDish = (req, res) => {
    //dodanie pozycji do menu
    let price = Number(req.body.price);
    price = parseInt(price * 100) / 100
    price = price.toFixed(2)
    menu.insert({ name: req.body.name, price: price }).then(result => {
        res.redirect('/menu');
    }).catch(err => {
        req.flash('error-menu', 'Wprowadzono dane w nieprawidłowym formacie');
        res.redirect('/menu');
    })


}

exports.editDish = (req, res) => {
    //edycja pozycji w menu
    menu.updateById(req.body.id, { name: req.body.name, price: parseInt(req.body.price * 100) / 100 }).then(result => {
        res.redirect('/menu');
    }).catch(err => {
        req.flash('error-menu', 'Wprowadzono dane w nieprawidłowym formacie');
        res.redirect('/menu');
    })

}