const socket = require('socket.io');
const Chat = require('./models/SchemaMessage');




const socketInit = (server) => {
    const io = socket(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
        }
    });
    
    const chatNamespace = io.of('/chat');
    const eventRooms = {};

    chatNamespace.on('connection', (socket) => {
        console.log('Utente connesso');


        socket.on('joinEventRoom', (room) => {
            socket.join(room);
            console.log(`Utente connesso alla stanza ${room}`);
        });

        socket.on('sendMessage', (room) => {
            chatNamespace.to(room).emit('refresh-chat', room);
        });


        socket.on('disconnect', () => {
            console.log('Web socket disconnesso');
        });
    });

    return { chatNamespace, eventRooms }
}


module.exports = socketInit;