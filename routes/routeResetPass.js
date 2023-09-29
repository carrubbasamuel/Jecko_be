const express = require('express')

const reset = express.Router();
const controllerReset = require('../controllers/controllerReset')


reset.post('/forgotpass', controllerReset.forgot)
reset.post('/checkpin', controllerReset.checkPin)
reset.post('/changepass', controllerReset.changePass)


module.exports = reset