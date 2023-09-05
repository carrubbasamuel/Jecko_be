const Event = require('../models/SchemaEvent');


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
            players: req.body.players,
            description: req.body.description,
            creator: req.user._id,
        });

        const newEvent = await event.save();
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




const getEventByCreator = async (req, res) => {
    try {
        const event = await Event.find({ creator: req.params.creatorId });
        res.status(200).json(event);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}



module.exports = {
    createEvent,
    getEventByLocation,
    getEventByCreator
}
