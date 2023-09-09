const { all } = require('../app');
const Message = require('../models/SchemaMessage');


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






module.exports = {
    createMessage,
    getMessageByRoomId,
};