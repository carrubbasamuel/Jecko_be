const mongoose = require('mongoose');
const SchemaLocation = require('../models/SchemaLocation');





const locationByCity = (req, res) => {
    SchemaLocation.find({ city: req.query.city })
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: 'Errore interno' });
        });
}


module.exports = {
    locationByCity,
};