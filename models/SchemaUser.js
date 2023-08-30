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
    },
    birthdate: {
        type: Date,
    },
    avatar: {
        type: String,
    },
    provider:{
        type: String,
    },
    motto: {
        type: String,
    }
}, { timestamps: true, strict: true });


module.exports = mongoose.model('User', SchemaUser, 'User');