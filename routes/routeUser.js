const express = require('express');
const formDataSingup = require('../middleware/middlewareMulter');

const user = express.Router();


const userController = require('../controllers/controllerUser');
const { loginValidation,signupValidation, validationMiddleware } = require('../middleware/middlewareExpressValidator');
const { verifyToken } = require('../middleware/middlewareJWT');



user.post('/signup',formDataSingup.single('avatar'), signupValidation, validationMiddleware, userController.signup);
user.post('/login', loginValidation, validationMiddleware, userController.login);
user.get('/profile', verifyToken, userController.profile);
user.get('/profile/:id', verifyToken, userController.usersProfile);
user.patch('/editUser', verifyToken, userController.editUser);
user.patch('/editUser/avatar',verifyToken, formDataSingup.single('avatar'), userController.editAvatar);



module.exports = user;