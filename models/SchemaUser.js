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
    phone: {
        type: Number,
        required: true
    },
    birthdate: {
        type: Date,
    },
    avatar: {
        type: String,
        default: "https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png"
    },
    provider:{
        type: String,
        default: "local"
    },
    motto: {
        type: String,
        default: "Ehy, I'm using Jecko!"
    }
}, { timestamps: true, strict: true });


module.exports = mongoose.model('User', SchemaUser, 'User');