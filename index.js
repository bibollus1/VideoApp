const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');



const port = 3002;
const app = express(); // initialize app

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

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
