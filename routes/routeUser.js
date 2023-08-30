const express = require('express');


const user = express.Router();


const userController = require('../controllers/controllerUser');



user.post('/signup', userController.signup);
user.post('/login', userController.login);



module.exports = user;