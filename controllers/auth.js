const usersRepo = require('../repositories/usersRepo');
const mailer = require('../utils/mailer').getTransporter();
const jwt = require('jsonwebtoken');
const secretKey = '123ABC';
const bcrypt = require('bcryptjs')

exports.loginUser = (req, res) => {
    //logowanie użytkownika
    let email = req.body.mail;
    let password = req.body.password;

    usersRepo.findUserByEmail(email).then(result => {
        result.comparePassword(password, (err, isMatch) => {
            if (err || !isMatch) {
                req.flash('error-login', 'Złe hasło lub login')
                res.redirect('/login');
            }
            else {
                req.session.isLogged = true;
                req.session.name = result.firstname + ' ' + result.lastname;
                req.session.email = result.email;
                req.session.isAdmin = result.admin;
                res.redirect('/');
            }


        });
    }).catch(() => {
        req.flash('error-login', 'Złe hasło lub login')
        res.redirect('/login');
    })
}

exports.registerUser = (req, res) => {
    //rejestracja użytkownika
    let data = req.body;

    if (data.password !== data.password2) {
        req.flash('error-registration', 'Hasła nie są identyczne')
        res.redirect('/registration');
        return;
    }

    let d = req.body;

    usersRepo.findUserByEmail(d.email)
        .then((usr) => {
            req.flash('error-registration', 'Konto już istnieje.')
            res.redirect('/registration');
        }).catch(() => {

            usersRepo.addUser({ firstname: d.firstname, lastname: d.lastname, email: d.email, phone: d.phone, password: d.password }).then(() => {
                req.flash('accountCreated', 'Konto zostało utworzone.')
                res.redirect('/login');
            }).catch(() => {
                req.flash('error-registration', 'Konto już istnieje.')
                res.redirect('/registration');
            });
        })



}

exports.logout = (req, res) => {
    //wylogowanie użytkownika
    req.session.destroy(err => {
        if (err) {
            console.log(err)
        }
        res.redirect('/');
    })
}

exports.resetPassword = (req, res) => {
    //wysłanie emaila z linkiem do resetowania hasła
    let email = req.body.mail;

    let data = {
        user: email
    }

    jwt.sign(data, secretKey, { expiresIn: 60 * 60 * 60 }, (err, token) => {
        if (err) {
            console.log(err)
        }
        else {


            mailer.sendMail({
                to: email,
                from: 'restauracjanastudia@gmail.com',
                subject: 'Restauracja - Reset Hasła',
                html: `
                                <h1>Resetowanie hasła</h1>
                                <h3>Witaj, Jeśli chcesz zresetować hasło kliknij link poniżej.</h3>
                                <a href="http://localhost:3000/reset-password/verify/${token}">Resetuj hasło</a>
                            `
            })
                .then(result => {
                })
                .catch(err => {

                })
        }
    })
    req.flash('message-reset', 'Wysłano maila z linkiem do resetu hasła!')
    res.redirect('/reset-password');


}





exports.getResetPasswordVerifyPage = (req, res) => {
    //wyświetlenie strony do resetowania hasłą
    let token = req.params.token;

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.log(err);
            res.send('<h1>Sesja wygasła!</h1>');
        }
        else {
            res.render('resetPassword', { token: token });
        }
    })

}

exports.resetPasswordNewType = (req, res) => {
    //resetowanie hasła przez link z emaila
    const token = req.body.token;
    const password = req.body.password;

    if (password != req.body.password2) {
        req.flash('error-reset', 'Hasła nie są identyczne!')
        res.render('resetPassword', { token: token });
        return;
    }
    bcrypt.genSalt(3, (err, salt) => {
        bcrypt.hash(password, salt, (err, hashed) => {
            jwt.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    console.log(err);
                    res.send('<h1>Sesja wygasła!</h1>');
                    return;
                }
                else {

                    usersRepo.findUserByEmail(decoded.user).then(user => {
                        usersRepo.updateUserById(user._id, { firstname: user.firstname, lastname: user.lastname, phone: user.phone, email: user.email, password: hashed })
                            .then(() => {
                                req.flash('accountCreated', 'Zmieniono Hasło!')
                                res.redirect('/login');

                            })
                            .catch(() => {
                                console.log(err);
                                res.send('<h1>Nastąpił problem!</h1>');
                            })
                    })
                        .catch(() => {
                            console.log(err);
                            res.send('<h1>Nastąpił problem!</h1>');
                        });


                }
            })
        })
    })

}