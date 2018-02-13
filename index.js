const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// express-session + connect-flash - for flash messages
// passpor js + passport local for local login auth
// express router for puting routes in separate files



const port = 3002;
const app = express(); // initialize app

// Load routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

// Body parser
app.use(bodyParser.json()); // converting user input into JSON
app.use(bodyParser.urlencoded({extended: true}));

//Static folder
app.use(express.static(path.join(__dirname, 'public'))); // sets public folder to express static folder

// Method override for making update middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

// Global variables
app.use(function(req,res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidapp-dev')
.then(()=>console.log('MongoDB Connected...'))
.catch(err=>console.log(err));



// handlebars middleware

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// how middleware works
app.use(function(req, res, next) {
  // console.log(Date.now());
  req.name = 'KB';
  next();
});

// index route
app.get('/', (req, res) => { // handling get request
  const title = 'Welcome!';
  res.render('index', {
    title: title
  });
});

// about route
app.get('/about', (req, res) => {
  res.render('about');
});





// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
