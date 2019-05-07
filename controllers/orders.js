const ordersRepo = require('../repositories/ordersRepo');
const usersRepo = require('../repositories/usersRepo')

exports.order = (req, res) => {

    let time = req.body.time;
    let date = req.body.date;
    let email = req.session.email;
    let table = req.body.tableNumber;
    let tableId = req.body.tableId;
    let last = req.body.last;
    let menuOrder;

    try {
        menuOrder = JSON.parse(req.body.order)
    }
    catch{
        menuOrder = {};
    }

    req.flash('selected-index', tableId);
    req.flash('last-index', last);
    ordersRepo.checkAvaiable(date, time, table).then(() => {
        usersRepo.findUserByEmail(email).then((user) => {
            ordersRepo.addOrder(table, { user, date, time, menuOrder }).then(() => {
                res.redirect('/');
            }).catch(() => {
                console.log('errr');
                res.redirect('/');
            })
        }).catch(() => {
            console.log('errr');

            res.redirect('/');
        })
    }).catch(result => {

        if (result.email == email || req.session.isAdmin) {

            ordersRepo.deleteOrderById(table, result.id)
                .then(() => {
                    res.redirect('/');
                })
                .catch(() => {
                    console.log('err');
                    res.redirect('/');
                })
        }
        else {
            res.redirect('/');
        }
    })


}

