const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Storyschema = new Schema({

    UserId:{
        type: String,
        required : true
    },
    Headline:{
        type: String,
        required : true
    },
    Topic:{
        type: String,
        required : true
    },
    Image:{
        type: String,
        required : true
    },
    Content:{
        type: String,
        required : true
    },
    Date:{
        type: Date,
        default: Date.now
    }
});

mongoose.model('story' , Storyschema);