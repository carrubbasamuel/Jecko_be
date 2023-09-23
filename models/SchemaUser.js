const mongoose = require('mongoose');

const SchemaUser = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    city: {
        type: String,
    },
    birthdate: {
        type: Date,
    },
    avatar: {
        type: String,
        default: "https://t4.ftcdn.net/jpg/03/46/93/61/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM.jpg"
    },
    provider:{
        type: String,
        default: "local"
    },
    motto: {
        type: String,
        default: "Ehy, I'm using Jecko!"
    },
    games: {
        type: Number,
        default: 0
    },
    createdGames: {
        type: Number,
        default: 0
    },

}, { timestamps: true, strict: true });


module.exports = mongoose.model('User', SchemaUser, 'User');