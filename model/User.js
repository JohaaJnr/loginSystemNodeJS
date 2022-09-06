var mongoose = require('mongoose')
var UserSchema = new mongoose.Schema({

    username:{
        type: String,
        unique: true
    },

    email: {
        type: String,
        unique: true
    },

    dob:{
        type: String
    },

    phone: {
        type: String
    },

    image:{
        type: String
    },

    profession:{
        type: String
    },

    link:{
        type: []
    },

    skills:{
        type: []
    },

    key:{
        type: String
    },

    createdAt:{
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('User', UserSchema)