const express = require('express');


const message = express.Router();

const controllerMessage = require('../controllers/controllerMessage');


message.post('/message', controllerMessage.createMessage )
message.get('/message/:id_room', controllerMessage.getMessageByRoomId);


module.exports = message;