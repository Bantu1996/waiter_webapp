const Caffine = require('./waiterJS');
// let app = express();
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

const coffee = Caffine(pool);
// const route = routes(register)

var app = express();

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

app.get("/", async function (req, res) {
   var sevenNights = await coffee.sevenDays();
  res.render('waiter', {
  sevenNights
 });
});

app.get("/waiter/", async function (req, res) {
  var sevenNights = await coffee.sevenDays();
  res.render('waiter', {
  sevenNights

  })
 })


app.get("/admin", async function (req, res) {

  var waiters =   await coffee.getAdminId()
  var sevenNights = await coffee.sevenDays();
  // console.log(sevenNights.length);

  
  res.render('admin',{
    waiters,sevenNights} )
})

// app.get("/waiter/", async function (req, res) {
//   // var list = await coffee.waiterList();
//   var sevenNights = await coffee.sevenDays();
//   res.render('waiter', { 
//     // list,
//     sevenNights})
// })
app.get("/waiter/:username", async function (req, res) {
  var user = req.params.username
  var sevenNights = await coffee.sevenDays();
  res.render('waiter', {
   username: user,
   sevenNights
   })
})

app.post("/waiter/:username", async function (req, res) {
  var boxes = req.body.checks
  var user = req.params.username
 
   var sub = await coffee.selectShift(boxes, user)
 if(sub) {
  req.flash('success', 'Successfully submitted your shifts')
 }
 else{
  req.flash('error', 'Please select atleast from 2 shifts and up')
 }
  
  
  res.render('waiter', {
    username: user,
    sub
  
  });

});

app.get("/resetPer", async function (req, res) {
  var id = req.query.id  
  var data = await coffee.resetPer(id)

    req.flash('success', 'Successfully cleared a Waiter on the list')
  res.render('admin', {data})
})

  app.get("/reset", async function (req, res) {
    await coffee.reset(),
      req.flash('success', 'Successfully cleared the Waiters list')
    res.redirect('/admin')
  })



  // resetPer

  let PORT = process.env.PORT || 3007;

  app.listen(PORT, function () {
    console.log('App starting on port', PORT);
  });
