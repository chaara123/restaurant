

exports.ensureisLogged = (req, res, next) => {
    //sprawdzanie czy użytkownik jest zalogowany
    if (req.session.isLogged) {
        next();
    }
    else {
        req.flash('error-login', 'Musisz być zalogowaany')
        res.redirect('/login');
    }
}


exports.ensureIsAdmin = (req, res, next) => {
    //sprawdzanie czy użytkownik jest administratorem
    if (req.session.isAdmin) {
        next();
    }
    else {
        req.flash('error-login', 'Musisz być Administratorem')
        res.redirect('/login');
    }
}


