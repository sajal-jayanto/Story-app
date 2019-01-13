const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const methodOverride = require('method-override')
const fileUpload = require('express-fileupload');
const session = require('express-session');
const passport = require('passport');

require('./model/story')
const Story = mongoose.model('story');



// Making app
const app = express();

// routes
const users = require('./routes/user'); 


require('./config/passport')(passport);


// Data base connaction
mongoose.connect('mongodb://sajal:sajal123456@ds255754.mlab.com:55754/story-app', {
    useNewUrlParser: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));


// static folder
app.use(express.static(path.join(__dirname, 'public')));


// body-parser middelwere
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// methodOverride middelwere
app.use(methodOverride('_method'))


// View engien
app.engine('handlebars', exphbs({defaultLayout: 'user_layout'}));
app.set('view engine', 'handlebars');

//Uplode File
app.use(fileUpload());


// app use express-session
app.use(session({
    secret: 'anything',
    resave: true,
    saveUninitialized: true,
}));

// use passport
app.use(passport.initialize());
app.use(passport.session());

// app use connect-flash
app.use(flash());

// Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Home route
app.get('/' , function(req , res){
    
    Story.find({})
    .then(story =>{
        res.render("home" , {
            story:story
        });
    });
});

// About route
app.get('/about' , function(req , res){
    res.render("about");
});


app.get('/story/:id' , function(req , res){
    
    Story.findOne({
        _id:req.params.id
    })
    .then(story =>{
        res.render('see_story' , {
            story:story
        });
    });
});

// app use
app.use('/user' , users);

const port =  process.env.PORT ||  3000;
app.listen(port , function() {
    console.log("Sarver strat at port " + port);
});