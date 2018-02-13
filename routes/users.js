const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');

//Load Idea Model
require('../models/Users');
const User = mongoose.model('users');

// User login route
router.get('/login', (req, res)=>{
  res.render('users/login');
});
// User register route
router.get('/register', (req, res)=>{
  res.render('users/register');
});

// Register form POST
router.post('/register', (req,res)=>{
  let errors = [];

  if (req.body.password != req.body.password2){
    errors.push({text:'Password do not match'});
  }

  if (req.body.password.length<4){
    errors.push({text:'Password must be at least 4 characters'})
  }

  if (errors.length>0){
    res.render('users/register',{
      // to not reenter form if fails, it will not clean web storage
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    res.send('Passed!');
  }
});
module.exports = router;
