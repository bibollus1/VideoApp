const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');



const port = 3002;
const app = express(); // initialize app

// Body parser
app.use(bodyParser.json()); // converting user input into JSON
app.use(bodyParser.urlencoded({extended: true}));

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidapp-dev')
.then(()=>console.log('MongoDB Connected...'))
.catch(err=>console.log(err));

//Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

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

app.get('/ideas', (req, res) => {
  res.render('about');
});

app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// Process form
app.post('/ideas', (req, res)=>{
  let errors = [];
  if(!req.body.title){
    errors.push({text:'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'});
  }

  if(errors.length>0){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    //  user: req.user.id
    }
    new Idea(newUser)
      .save()
      .then(idea=>{
        res.redirect('/ideas');
      })
  }
  // console.log(req.body);
  // res.send('Ok');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
