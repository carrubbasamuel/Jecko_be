const express = require('express');
const formDataSingup = require('../middleware/middlewareMulter');

const user = express.Router();


const userController = require('../controllers/controllerUser');



user.post('/signup',formDataSingup.single('avatar'), userController.signup);
user.post('/login', userController.login);



module.exports = user;