const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Userschema = new Schema({

    firstname:{
        type: String,
        required : true
    },
    lastname:{
        type: String,
        required : true
    },
    email:{
        type: String,
        required : true
    },
    date_of_barth:{
        type: Date,
        required : true
    },
    password:{
        type: String,
        required : true
    }
});


mongoose.model( 'users' , Userschema);