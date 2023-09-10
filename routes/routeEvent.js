const express = require('express');

const event = express.Router();


const conrollerEvent = require('../controllers/controllerEvent');
const { eventValidation, validationMiddleware } = require('../middleware/middlewareExpressValidator');


event.post('/create',eventValidation, validationMiddleware, conrollerEvent.createEvent)
event.get('/locationEvent/:locationId', conrollerEvent.getEventByLocation)
event.get('/onLoadEvent', conrollerEvent.getOnLoadEventCorrelatedToUser)
event.delete('/delateEvent/:eventId', conrollerEvent.delateEvent)
event.patch('/joinEvent/:eventId', conrollerEvent.patchJoinEvent)


module.exports = event;
