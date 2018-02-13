const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea Index page
router.get('/', (req, res)=>{ // /ideas
  Idea.find({})
  .sort({date:'descending'})
  .then(ideas=>{
      res.render('ideas/index',{
      ideas: ideas
  });
});
});

// Add idea form
router.get('/add', (req, res) => {
  res.render('ideas/add');
});

// Edit idea form
router.get('/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea=>{
    res.render('ideas/edit', {
      idea:idea
    });
  });

});


// Process form
router.post('/', (req, res)=>{
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
        req.flash('success_msg', 'New idea added');
        res.redirect('/ideas');
      })
  }
  // console.log(req.body);
  // res.send('Ok');
});

// Edit Form Process - should be with PUT, but doesn't work, works fine with overwriting post
router.post('/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id,
    })
    .then(idea => {
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
        .then(idea => {
            req.flash('success_msg', 'Idea updated');
            res.redirect('/ideas');
        });
    });
});

// Delete ideas
router.delete('/:id', (req,res)=>{
  Idea.remove({_id:req.params.id})
    .then(()=>{
      req.flash('success_msg', 'Idea removed');
      res.redirect('/ideas');
    })
});



module.exports = router;
