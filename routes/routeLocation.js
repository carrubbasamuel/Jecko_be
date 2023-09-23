const express = require('express');
const locationController = require('../controllers/controllerLocation');
const { verifyToken } = require('../middleware/middlewareJWT');

const location = express.Router();


location.get('/location',verifyToken, locationController.locationField);


module.exports = location;