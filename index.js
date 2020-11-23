const Caffine = require('./waiterJS');
// let app = express();
const routes = require('./routes');
const flash = require('express-flash');
const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://bantu:s0ty@t0b@n2@localhost:5432/waiters_db';

const pool = new Pool({
  connectionString
});
var app = express();

const coffee = Caffine(pool);
 const route = routes(coffee);


app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use(session({
  secret: "Please enter number!!",
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.get('/addFlash', async function (req, res) {
  req.flash('info', 'Flash Message Added');
  res.redirect('/');
});

app.get("/", route.waiter);

app.get("/waiter/", route.waiterAgain)

app.get("/days", route.daysOfWeek)

app.get("/waiter/:username",route.getUser)

app.post("/waiter/:username", route.postUser);

  app.get("/reset", route.resetting)

  let PORT = process.env.PORT || 3008;

  app.listen(PORT, function () {
    console.log('App starting on port', PORT);
  });
