const express = require('express')

const reset = express.Router();
const controllerReset = require('../controllers/controllerReset')
const {validateResetPass, validationMiddleware} = require('../middleware/middlewareExpressValidator')


reset.post('/forgotpass', controllerReset.forgot)
reset.post('/checkpin', controllerReset.checkPin)
reset.post('/changepass',validateResetPass, validationMiddleware, controllerReset.changePass)


module.exports = reset