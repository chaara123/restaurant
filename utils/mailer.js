const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

let transporter;
class Mailer {

    static init() {//funkcja tworzy obiekt transporter, który pozwala na wysyłanei maili
        transporter = nodemailer.createTransport(sendGridTransport({
            auth: {
                api_key: 'SG.L9wvW2p7Rr2zeTIbVsz7Hw.E4dEMoKVi8mcOO4zqiSzjcW1Pnhk5M224ooJBlls9g8'
            }
        }))

        return transporter;
    }

    //funkcja zwraca obiekt transporter
    static getTransporter() {
        if (transporter == null) {
            this.init()
        }
        else {
            return transporter;
        }
    }
}

module.exports = Mailer;