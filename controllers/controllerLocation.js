const SchemaLocation = require('../models/SchemaLocation');
const Event = require('../models/SchemaEvent');




const locationByCity = (req, res) => {
    SchemaLocation.find({ city: req.query.city })
        .then((data) => {
            Event.find({ location: data }).then((event) => {
                data.forEach((location) => {
                    const eventCorrelated = event.filter((event) => event.location._id.toString() === location._id.toString());
                    if (eventCorrelated.length > 0) {
                        location.haveEvents = true;
                    }
                })
                res.status(200).json(data);
            })
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: 'Errore interno' });
        });
}


module.exports = {
    locationByCity,
};