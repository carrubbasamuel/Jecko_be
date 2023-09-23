const Event = require('../models/SchemaEvent');
const Message = require('../models/SchemaMessage');
const User = require('../models/SchemaUser');
const { v4: uuidv4 } = require('uuid');



//Crea un nuovo evento controlla se la data di inizio non collide con un evento gia esistente e se la data di inizio non è precedente alla data attuale
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
                return res.status(403).json({ message: "Un evento è gia in corso in questa fascia oraria. Inserisci un'altra fascia oraria." });
            } else {
                return res.status(403).json({ message: "La data di inizio del nuovo evento collide con un evento esistente. Inserisci un'altra data di inizio." });
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

        const user = await User.findById(req.user._id);
        user.createdGames = user.createdGames + 1;
        await user.save();

        //Crea un messaggio che notifica la creazione dell'evento il primo messaggio della room chat
        const newMessage = new Message({
            id_room: newEvent.id_room,
            sender: req.user._id,
            message: `L'utente ${req.user.username} ha creato l'evento`,
            read: req.user._id,
        });

        await newMessage.save();

        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}



//Ritorna tutti gli eventi in base alla location aggiunge un campo isMine che indica se l'utente loggato è il creatore dell'evento
const getEventByLocation = async (req, res) => {
    try {
        const eventTerminated = await Event.find({ dateEnd: { $lte: new Date() } });
        if (eventTerminated) {
            eventTerminated.forEach(async (event) => {
                await Event.findByIdAndDelete(event._id);
            });
        }

        const events = await Event.find({ location: req.params.locationId })
            .populate({
                path: 'creator',
                select: 'username avatar',
            });

        if (events) {
            const eventsWithIsCreator = events.map((event) => {
                return {
                    ...event.toObject(),
                    isMine: req.user._id.toString() === event.creator._id.toString(),
                };
            });

            res.status(200).send(eventsWithIsCreator);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


//Elimina un evento
const delateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.eventId);
        res.status(200).send(event);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}



//Aggiunge un utente all'evento controlla se l'utente è gia iscritto all'evento
const patchJoinEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (event.players.includes(req.user._id)) {
            return res.status(400).json({ message: "Sei gia iscritto a questo evento" });
        }
        event.players.push(req.user._id);
        await event.save();


        const newMessage = new Message({
            id_room: event.id_room,
            sender: req.user._id,
            message: `L'utente ${req.user.username} si è iscritto all'evento`,
            read: req.user._id,
            isJoinMessage: true,
        });
        await newMessage.save();


        res.status(200).json(event);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


//Ritorna tutti gli eventi a cui l'utente è iscritto e aggiunge un campo howChatNotRead che indica il numero di messaggi non letti nella room chat dell'evento
const getOnLoadEventCorrelatedToUser = async (req, res) => {
    try {
        const eventTerminated = await Event.find({ dateEnd: { $lte: new Date() } });

        for (const event of eventTerminated) {
            for (const playerId of event.players) {
                await User.findByIdAndUpdate(playerId, { $inc: { games: 1 } });
            }

            await Event.findByIdAndDelete(event._id);
            await Message.deleteMany({ id_room: event.id_room });
        }

        const event = await Event.find({ players: req.user._id })
            .populate({
                path: 'location',
                select: '-_id cover'
            })

        const howChatNotRead = await Message.find({ id_room: { $in: event.map(event => event.id_room) }, read: { $ne: req.user._id }, sender: { $ne: req.user._id } })
        if (howChatNotRead) {
            const eventWithHowChatNotRead = event.map(event => {
                const howChatNotReadForThisEvent = howChatNotRead.filter(message => message.id_room === event.id_room);
                return {
                    ...event.toObject(),
                    howChatNotRead: howChatNotReadForThisEvent.length,
                }
            })
            res.status(200).send(eventWithHowChatNotRead);
        } else {
            res.status(200).send(event);
        }
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
