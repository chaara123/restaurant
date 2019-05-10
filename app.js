const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const hbs = require("express-handlebars");
const session = require("express-session");
const flash = require("connect-flash");
const MONGODB_URI =
  "mongodb://admin:admin123@ds123465.mlab.com:23465/restaurant" || "mongodb://localhost:27017/restaurant";
//'mongodb://admin:admin18@ds111065.mlab.com:11065/restaurant'
const DBConfig = require("./config/DBConfig");
const PORT = process.env.PORT || 3000;
const app = express();
//update
//wyłączenie crashowania się aplikacji przy wyrzucaniu własnych wyjątków !!!
//bardzo ważne
process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

//Utworzenie obiektu klasy DBConfig i przekazanie mu adresu bazy danych
let dbConnection = new DBConfig(MONGODB_URI)
//wywołanie metody connect obiektu dbConnection w celu połączenia się z bazą danych
dbConnection.connect()

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
  defaultLayout: 'main.hbs',
  extname: '.hbs',
  partialsDir: "views/partials",
  helpers: {
      renderCalendar: function (reservations, date, open, close, email, isAdmin) {
          let html = '<div class="hour-container">';
          for (let i = open; i < close; i++) {
              let occupied = false;
              let my = false;
              let reservuser = '';
              for (let reserv of reservations) {
                  if (reserv.date == date && reserv.time == i) {
                      occupied = true;
                      reservuser = reserv.user.firstname + ' ' + reserv.user.lastname;
                      if (reserv.user.email == email) {
                          my = true;
                      }
                  }

              }
              if (my) {
                  html += `<button formaction="/order" class="hour my" name="time" value="${i}">${i}:00 <br/>Moja<br/>Rezerwacja</button>`
              }
              else {

                  if (occupied) {
                      html += `<button formaction="/order" class="hour occupied" name="time" value="${i}">${i}:00`;
                      if (isAdmin) {
                          html += '<br/>' + reservuser;
                      }
                      html += '</button>';
                  }
                  else {
                      html += `<button formaction="/order" onclick="makeReservation(event,this)" class="hour" name="time" value="${i}">${i}:00</button>`;
                  }
              }
          }
          html += "</div>";
          return html;
      }
  }
}));
app.set('view engine', 'hbs');

app.use(session({
  key: 'restaurant.session.sid',
  secret: 'Lol',
  resave: false,
  saveUninitialized: false
}));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static('static'));



app.use(flash());
const mailer = require('./utils/mailer').init();
app.use((req, res, next) => {
  res.locals.isLogged = req.session.isLogged;
  res.locals.name = req.session.name;
  next();
});
const routes = require('./routes/routes')
app.use('/', routes);


//Startowanie apliacji na danym porcie
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
