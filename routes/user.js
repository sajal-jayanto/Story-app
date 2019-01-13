const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const {ensureAuthenticated} = require('../helper/authentication');
const router = express.Router();

require('../model/user')
const User = mongoose.model('users');

require('../model/story')
const Story = mongoose.model('story');



router.all('/*' , function(req , res , next){
    req.app.locals.layout = 'user_layout'
    next();
});

router.get('/register' , function(req , res){
    res.render("users/register");
});

router.get('/login' , function(req , res){
    res.render("users/login");
});


router.post('/register' , function(req , res){

    let err = [];

    if(req.body.pass != req.body.pass2) {
        err.push({text:'Passwords do not match'});
    }
    
    if(req.body.pass.length < 6) {
        err.push({text:'Password must be at least 6 characters'});
    }

    if(err.length > 0) {
        res.render('users/register', {
            errors : err,
            fname : req.body.fname, 
            lname : req.body.lname,
            email: req.body.email,
            date: req.body.date
        });
    } 
    else {
        const newuser = new User({
            firstname : req.body.fname,
            lastname : req.body.lname,
            email : req.body.email,
            date_of_barth : req.body.date,
            password : req.body.pass
        });
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newuser.password , salt, function(err, hash) {
                if(err) throw err;
                newuser.password = hash;
                //console.log(newuser);
                newuser.save().then(() => {
                    req.flash('success_msg', 'You are now registered and can log in');
                    res.redirect('/user/login');
                }).catch(err => {
                    console.log(err);
                    return;
                });
            });
        });
    }
});


router.post('/login' , function(req , res , next){
    passport.authenticate('local', { 
        successRedirect: '/user/story',
        failureRedirect: '/user/login',
        failureFlash: true 
    })(req, res, next);
});


router.get('/logout' , function(req , res){
    req.logout();
    res.redirect('/user/login');
});



router.get('/creat' , ensureAuthenticated ,function(req , res){
    res.render("users/creat_story");
});

router.put('/edit/:id' , ensureAuthenticated ,function(req , res){

    Story.findOne({
        _id:req.params.id
    })
    .then(story =>{
        story.Headline = req.body.headline;
        story.Topic = req.body.topic;
        story.Content = req.body.story_body;

        story.save().then(story =>{
            res.redirect("/user/story");
        });
    });
});

router.get('/edit/:id' , ensureAuthenticated ,function(req , res){

    Story.findOne({
        _id:req.params.id
    })
    .then(story =>{
        res.render('users/edit_story' , {
            story:story
        });
    });
    
});


router.delete('/edit/:id' , ensureAuthenticated ,function(req , res){

    Story.deleteOne({_id:req.params.id})
    .then(() =>{
        res.redirect('/user/story')
    });
});


router.get('/story' , ensureAuthenticated ,function(req , res){
    Story.find({
        UserId : req.user.id
    }).then(story =>{
        res.render("users/your_storys" , {
            story : story
        });
    });
});



router.post('/creat' , function(req , res){

    const temp = uniqid.process() + '.png';
    req.files.image.mv('./public/uploads/' + temp , (err) => {
        if(err) throw err;
    });

    const newstory = new Story({
        UserId : req.user.id,
        Headline : req.body.headline,
        Topic : req.body.topic,
        Image : temp,
        Content : req.body.story_body
    });

    newstory.save().then(() => {
        
        req.flash('success_msg', 'You Post publis ');
        res.redirect('/user/story');

    }).catch(err =>{
        console.log(err);
        return ;
    });

});


module.exports = router;