const Message = require('../models/SchemaMessage');
const Event = require('../models/SchemaEvent');


const createMessage =  async (req, res) => {
    try{
        const newMessage = new Message({
        id_room: req.body.id_room,
        sender:  req.user._id,
        message: req.body.message,
    });

    await newMessage.save()
    res.status(201).json(newMessage)
    }catch(error){
        res.status(400).json({ message: error.message });
    }
}


const getMessageByRoomId = async (req, res) => {
    try {
        const allPrecedentMessage = await Message.find({ id_room: req.params.id_room })
            .populate({
                path: 'sender',
                select: 'username avatar',
            })
            .exec();

        if (allPrecedentMessage) {
            const messagesWithIsMine = allPrecedentMessage.map(message => {
                const isMine = message.sender._id.toString() === req.user._id.toString();
                return { ...message.toObject(), isMine };
            });

            res.status(200).json(messagesWithIsMine);
        } else {
            res.status(404).json({ message: "Non ci sono messaggi" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const messageNotRead = async (req, res) => {
    try {
        const events = await Event.find({ players: req.user._id });
        const id_room = events.map(event => event.id_room);
        const messagesNotRead = await Message.find({ 
            id_room: { $in: id_room }, 
            read: { $ne: req.user._id }, 
            sender: { $ne: req.user._id } // Non i messaggi dell'user collegato
        });

        if (messagesNotRead.length > 0) {
            res.status(200).json(messagesNotRead);
        } else {
            res.status(404).json({ message: "Non ci sono messaggi non letti" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const readMessage = async (req, res) => {
    try {
        const messages = await Message.find({ id_room: req.params.id_room, read: { $ne: req.user._id } })
        if (messages) {
            messages.forEach(async message => {
                message.read.push(req.user._id);
                await message.save();
            });
            res.status(200).json(messages);
        } else {
            res.status(404).json({ message: "Non ci sono messaggi non letti" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}






module.exports = {
    createMessage,
    getMessageByRoomId,
    messageNotRead,
    readMessage,
};