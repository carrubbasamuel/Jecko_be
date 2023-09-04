const express = require('express');

const event = express.Router();


const conrollerEvent = require('../controllers/controllerEvent');


event.post('/create', conrollerEvent.createEvent)
event.get('/locationEvent/:locationId', conrollerEvent.getEventByLocation)


module.exports = event;
