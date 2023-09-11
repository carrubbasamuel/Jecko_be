const socket = require('socket.io');
const {getIdByTokenForSocket} = require('./middleware/middlewareJWT');
const SchemaLocation = require('./models/SchemaLocation');
const Event = require('./models/SchemaEvent');




const socketInit = (server) => {
    const io = socket(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
        }
    });

    
    const chatNamespace = io.of('/chat');
    const userConnected = {};

    chatNamespace.on('connection', (socket) => {
        console.log('Utente connesso');

        //
        socket.on('saveTokenUser', (data) => {
            getIdByTokenForSocket(data)
              .then(id => {
                userConnected[id] = socket.id;
                
              })
              .catch(error => {
                return null
              });
          });

        socket.on('newEvent', async (event) => {
            const LocationOfNewEvent = await SchemaLocation.findOne({ _id: event.location });
            const data ={
                _id: event._id,
                title: event.title,
                location: LocationOfNewEvent,
            }
            socket.broadcast.emit('refresh-event', data);
        });

        //Evento che viene emesso quando un utente si iscrive ad un evento inviato al creatore dell'evento
        socket.on('newPlayerAddInYourEvent', async (event) => {
            const EventWhitPlayers = await Event.findOne({ _id: event._id })
            .populate({
                path: 'players',
                select: 'username',
            });
            const playerAdded = EventWhitPlayers.players[EventWhitPlayers.players.length - 1];
            const data = {
                eventTitle: event.title,
                playerAdded: playerAdded,
            }
            chatNamespace.to(userConnected[EventWhitPlayers.creator]).emit('refresh-player', data);
        });
        socket.on('newMessage', () => {
            chatNamespace.emit('refresh-message');
        });

        socket.on('joinEventRoom', (room) => {
            socket.join(room);
        });

        socket.on('sendMessage', (room) => {
            chatNamespace.to(room).emit('refresh-chat', room);
        });

        socket.on('delateTokenUser', (token) => {
            getIdByTokenForSocket(token)
              .then(id => {
                delete userConnected[id];
              })
              .catch(error => {
                return null
              });
        });

        socket.on('disconnect', () => {
            console.log('Web socket disconnesso');
        });
    });

    return chatNamespace
}


module.exports = socketInit;

