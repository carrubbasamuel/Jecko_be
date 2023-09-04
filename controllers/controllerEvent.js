const Event = require('../models/SchemaEvent');


const createEvent = async (req, res) => {
    const event = new Event({
        dateStart: req.body.dateStart,
        dateEnd: req.body.dateEnd,
        location: req.body.location,
        players: req.body.players,
        description: req.body.description,
        creator: req.user._id,
    });
    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getEventByLocation = async (req, res) => {
    try {
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
