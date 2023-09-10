const express = require('express');


const message = express.Router();

const controllerMessage = require('../controllers/controllerMessage');


message.post('/message', controllerMessage.createMessage )
message.get('/message/:id_room', controllerMessage.getMessageByRoomId);
message.get('/messageNotRead', controllerMessage.messageNotRead);
message.patch('/messageRead/:id_room', controllerMessage.readMessage);


module.exports = message;