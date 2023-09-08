const Event = require('../models/SchemaEvent');
const Message = require('../models/SchemaMessage');
const { v4: uuidv4 } = require('uuid');


const createEvent = async (req, res) => {
    const newEventStart = req.body.dateStart;

    try {
        const overlappingEvent = await Event.findOne({
            dateStart: { $lte: newEventStart },
            dateEnd: { $gt: newEventStart },
            location: req.body.location,
        });

        if (overlappingEvent) {
            const currentTime = new Date();
            if (overlappingEvent.dateStart <= currentTime) {
                return res.status(400).json({ message: "Un evento è gia in corso in questa fascia oraria. Inserisci un'altra fascia oraria."});
            } else {
                return res.status(400).json({ message: "La data di inizio del nuovo evento collide con un evento esistente. vuoi partecipare ?", existingEvent: overlappingEvent });
            }
        }

        
        const event = new Event({
            title: req.body.title,
            dateStart: req.body.dateStart,
            dateEnd: req.body.dateEnd,
            location: req.body.location,
            players: req.user._id,
            description: req.body.description,
            creator: req.user._id,
            id_room: uuidv4(),
        });
        const newEvent = await event.save();

        //First message
        const newMessage = new Message({
            id_room: newEvent.id_room,
            sender: req.user._id,
            message: "Evento creato",
        });
        
        await newMessage.save();

        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}




const getEventByLocation = async (req, res) => {
    try {
        const eventTerminated = await Event.find({ dateEnd: { $lte: new Date() } });
        if (eventTerminated) {
            eventTerminated.forEach(async (event) => {
                await Event.findByIdAndDelete(event._id);
            });
        }

        const event = await Event.find({ location: req.params.locationId });
        res.status(200).send(event);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


const delateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.eventId);
        res.status(200).send(event);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}






const patchJoinEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (event.players.includes(req.user._id)) {
            return res.status(400).json({ message: "Sei gia iscritto a questo evento" });
        }
        event.players.push(req.user._id);
        await event.save();
        res.status(200).json(event);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


//Restituisce tutti gli eventi a cui l'utente è iscritto
const getOnLoadEventCorrelatedToUser = async (req, res) => {
    try {
        const eventTerminated = await Event.find({ dateEnd: { $lte: new Date() } });
        if (eventTerminated) {
            eventTerminated.forEach(async (event) => {
                await Event.findByIdAndDelete(event._id);
                await Message.deleteMany({ id_room: event.id_room });
            });
        }

        const event = await Event.find({ players: req.user._id })
        res.status(200).send(event);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}




module.exports = {
    createEvent,
    getEventByLocation,
    delateEvent,
    patchJoinEvent,
    getOnLoadEventCorrelatedToUser,
}
